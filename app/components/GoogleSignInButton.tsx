"use client";

import { loginGoogle } from "@/lib/auth-actions";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={loginGoogle}
      className="w-full flex bg-gray-900 text-foreground items-center justify-center gap-3 font-medium px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.805 10.023h-9.806v3.955h5.644c-.244 1.316-.98 2.432-2.086 3.18v2.64h3.38c1.982-1.824 3.126-4.518 3.126-7.775 0-.525-.047-1.035-.138-1.995z" />
        <path d="M11.999 21c2.808 0 5.165-.93 6.887-2.52l-3.38-2.64c-.94.63-2.14 1-3.507 1a6.01 6.01 0 01-5.68-3.54H2.93v2.64A11.998 11.998 0 0011.999 21z" />
        <path d="M6.32 13.23a6.01 6.01 0 010-3.46V7.13H2.93a11.998 11.998 0 000 9.74l3.39-2.64z" />
        <path d="M11.999 5c1.53 0 2.898.526 3.977 1.56l2.982-2.982C16.156 2.01 14.808 1 11.999 1a10 10 0 00-8.44 4.68l3.39 2.64A6.01 6.01 0 0111.999 5z" />
      </svg>
      Continue with Google
    </button>
  );
}
