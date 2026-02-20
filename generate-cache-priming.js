import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FLAG = /@cache-priming-enabled/;
const DYNAMIC_SEGMENT = /\[.+?\]/;

function findFiles(dir, match) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? findFiles(full, match) : match(entry.name) ? [full] : [];
  });
}

function pagePathToUrl(filePath) {
  const dir = path.dirname(path.relative(path.join(__dirname, "app"), filePath));
  return dir === "." ? "/" : `/${dir.replace(/\\/g, "/")}`;
}

function resolveUrlsFromBuildOutput(routePattern) {
  const routeRegex = new RegExp(
    "^" + routePattern.replace(/\[(?:\.\.\.)?\w+\]/g, "[^/]+") + "$"
  );
  const seen = new Set();
  return [
    path.join(__dirname, ".next", "server", "app"),   // App Router
    path.join(__dirname, ".next", "server", "pages"),  // Pages Router
  ].flatMap((buildDir) =>
    findFiles(buildDir, (name) => name.endsWith(".html")).reduce((acc, file) => {
      let url = "/" + path.relative(buildDir, file).replace(/\\/g, "/").replace(/\.html$/, "");
      if (url.endsWith("/index")) url = url.slice(0, -6) || "/";
      if (routeRegex.test(url) && !seen.has(url)) { seen.add(url); acc.push(url); }
      return acc;
    }, [])
  );
}

const generatedUrls = findFiles(path.join(__dirname, "app"), (name) => /^page\.(tsx|ts|jsx|js)$/.test(name))
  .filter((file) => CACHE_FLAG.test(fs.readFileSync(file, "utf8")))
  .flatMap((file) => {
    const url = pagePathToUrl(file);
    if (!DYNAMIC_SEGMENT.test(url)) return [url];
    const resolved = resolveUrlsFromBuildOutput(url);
    if (resolved.length === 0) console.warn(`No pre-rendered pages found for ${url} — ensure generateStaticParams is exported.`);
    return resolved;
  });

const launchJsonPath = path.join(__dirname, "launch.json");
const existing = fs.existsSync(launchJsonPath)
  ? JSON.parse(fs.readFileSync(launchJsonPath, "utf8"))
  : {};

// Get existing URLs and merge with generated ones
const existingUrls = existing?.cache?.cachePriming?.urls ?? [];
const mergedUrls = [...new Set([...existingUrls, ...generatedUrls])];

// Preserve all existing config, only update cache.cachePriming.urls
if (!existing.cache) existing.cache = {};
if (!existing.cache.cachePriming) existing.cache.cachePriming = {};
existing.cache.cachePriming.urls = mergedUrls;

fs.writeFileSync(launchJsonPath, JSON.stringify(existing, null, 2) + "\n");

console.log(`📖 Found ${existingUrls.length} existing URL(s)`);
console.log(`🔍 Discovered ${generatedUrls.length} URL(s) from flags`);
console.log(`✅ Total ${mergedUrls.length} URL(s) in launch.json:`, mergedUrls);