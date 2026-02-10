import Image from 'next/image';

export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f4f4] m-0 font-sans">
      <div className="bg-white text-center p-6 rounded-xl shadow-md">
      <Image
          src="https://images.contentstack.io/v3/assets/blt7359e2a55efae483/blt518e5105a0686696/663e30a08f19535905e50af2/Logo.svg"
          alt="Contentstack Logo"
          width={180}
          height={60}
          className="inline mr-5 align-middle"
          priority
        />

          <a 
          href={`${process.env.NEXT_PUBLIC_OAUTH_AUTHORIZE_URL}
          ?client_id=${process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}
          &redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}
          &response_type=code`}
          className="login-btn"
          >
          Log In
        </a>
      </div>
    </main>
  );
}