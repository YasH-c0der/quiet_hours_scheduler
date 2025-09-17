import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { connectMongoose } from "@/lib/mongoose";
import mongoose from "mongoose";
import { model } from "mongoose";

function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
  return typeof (value as PromiseLike<T>)?.then === "function";
}

export async function DELETE(_: NextRequest, context: unknown) {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const { params } = (context as { params?: { id?: string } | PromiseLike<{ id?: string }> }) ?? {};
    const resolvedParams = params && isPromiseLike<{ id?: string }>(params)
      ? await params
      : (params as { id?: string } | undefined);
    const id = resolvedParams?.id;
    const userId = data.user?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectMongoose();
    const QuietHour = mongoose.models.QuietHour || model("QuietHour");
    const res = await QuietHour.deleteOne({ _id: id, userId });
    return NextResponse.json({ deleted: res.deletedCount === 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: unknown) {
  try {
    const supabase = await getServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    const { params } = (context as { params?: { id?: string } | PromiseLike<{ id?: string }> }) ?? {};
    const resolvedParams = params && isPromiseLike<{ id?: string }>(params)
      ? await params
      : (params as { id?: string } | undefined);
    const id = resolvedParams?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { notified } = body ?? {};
    if (typeof notified !== "boolean") {
      return NextResponse.json({ error: "notified boolean required" }, { status: 400 });
    }

    await connectMongoose();
    const QuietHour = mongoose.models.QuietHour || model("QuietHour");
    const res = await QuietHour.updateOne({ _id: id, userId }, { $set: { notified } });
    return NextResponse.json({ updated: res.modifiedCount === 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


