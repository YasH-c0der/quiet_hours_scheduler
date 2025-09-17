import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { connectMongoose } from "@/lib/mongoose";
import mongoose from "mongoose";
import { markQuietHourNotified } from "@/lib/models/quietHour";
import { model } from "mongoose";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectMongoose();
    const QuietHour = mongoose.models.QuietHour || model("QuietHour");
    const res = await QuietHour.deleteOne({ _id: params.id, userId });
    return NextResponse.json({ deleted: res.deletedCount === 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { notified } = body ?? {};
    if (typeof notified !== "boolean") {
      return NextResponse.json({ error: "notified boolean required" }, { status: 400 });
    }

    await connectMongoose();
    const QuietHour = mongoose.models.QuietHour || model("QuietHour");
    const res = await QuietHour.updateOne({ _id: params.id, userId }, { $set: { notified } });
    return NextResponse.json({ updated: res.modifiedCount === 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


