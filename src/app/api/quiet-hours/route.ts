import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { connectMongoose } from "@/lib/mongoose";
import { createQuietHour, listQuietHoursForUser } from "@/lib/models/quietHour";

export async function GET() {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectMongoose();
    const items = await listQuietHoursForUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { startTime, endTime } = body ?? {};
    if (!startTime || !endTime) return NextResponse.json({ error: "startTime and endTime required" }, { status: 400 });

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date(s)" }, { status: 400 });
    }
    if (end <= start) {
      return NextResponse.json({ error: "endTime must be after startTime" }, { status: 400 });
    }

    await connectMongoose();
    const doc = await createQuietHour({ userId, startTime: start, endTime: end });
    return NextResponse.json({ item: doc }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}