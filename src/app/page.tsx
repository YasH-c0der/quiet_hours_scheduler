"use Client";
import Link from "next/link";

export default function Home() {


  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <div className="flex gap-3 justify-center">
            <Link
              href="/sign-in"
              className="h-10 px-4 rounded bg-black text-white inline-flex items-center justify-center"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="h-10 px-4 rounded border inline-flex items-center justify-center"
            >
              Sign up
            </Link>
            <Link
              href="/sign-out"
              className="h-10 px-4 rounded border inline-flex items-center justify-center"
            >
              Sign out
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
