"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? null;
      setUserEmail(email);
      setLoading(false);
      if (!email) {
        router.replace("/sign-in");
      }
    };
    fetch();
  }, [router, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm">Signed in as {userEmail}</p>
        <div className="text-sm">
          <Link href="/" className="underline">Home</Link>
        </div>
      </div>
    </main>
  );
}


