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
  type QuietItem = { _id: string; startTime: string; endTime: string; notified: boolean };
  const [items, setItems] = useState<QuietItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  async function fetchItems() {
    const res = await fetch("/api/quiet-hours");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    if (!loading && userEmail) {
      fetchItems();
    }
  }, [loading, userEmail]);

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiet-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime, endTime }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to create");
      }
      setStartTime("");
      setEndTime("");
      await fetchItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteItem(id: string) {
    await fetch(`/api/quiet-hours/${id}`, { method: "DELETE" });
    await fetchItems();
  }

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
        <form onSubmit={createItem} className="text-left space-y-3">
          <div className="space-y-1">
            <label className="block text-sm">Start time (UTC)</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm">End time (UTC)</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} className="h-10 px-4 rounded bg-black text-white disabled:opacity-70">
            {submitting ? "Adding..." : "Add quiet hours"}
          </button>
        </form>

        <div className="text-left">
          <h2 className="mt-6 mb-2 font-medium">Your quiet hours</h2>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it._id} className="flex items-center justify-between rounded border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">
                    {new Date(it.startTime).toISOString()} → {new Date(it.endTime).toISOString()}
                  </div>
                  <div className="text-xs text-gray-600">notified: {String(it.notified)}</div>
                </div>
                <button onClick={() => deleteItem(it._id)} className="text-red-600 text-sm underline">Delete</button>
              </li>
            ))}
            {items.length === 0 && <li className="text-sm text-gray-600">No quiet hours yet.</li>}
          </ul>
        </div>

        <div className="text-sm">
          <Link href="/" className="underline">Home</Link>
        </div>
      </div>
    </main>
  );
}


