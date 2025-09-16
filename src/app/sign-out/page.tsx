"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignOutPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignOut() {
    setLoading(true);
    setMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage("Signed out (demo). Redirect as needed.");
    } catch (err) {
      setMessage("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-6">Sign out</h1>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full h-10 rounded bg-black text-white disabled:opacity-70"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
        <div className="mt-6 text-sm">
          <Link href="/" className="underline">Back to home</Link>
        </div>
      </div>
    </main>
  );
}


