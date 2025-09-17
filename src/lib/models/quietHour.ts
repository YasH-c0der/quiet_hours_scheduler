import mongoose, { Schema, type InferSchemaType, Model } from "mongoose";
import { connectMongoose } from "@/lib/mongoose";

const QuietHourSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    notified: { type: Boolean, required: true, default: false, index: true },
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { versionKey: false }
);

QuietHourSchema.index({ userId: 1, startTime: 1 }, { name: "user_start_idx" });
QuietHourSchema.index({ notified: 1 }, { name: "notified_idx" });

export type QuietHour = InferSchemaType<typeof QuietHourSchema> & { _id: mongoose.Types.ObjectId };

let QuietHourModel: Model<QuietHour>;

function getModel(): Model<QuietHour> {
  return (QuietHourModel ||= (mongoose.models.QuietHour as Model<QuietHour>) ||
    mongoose.model<QuietHour>("QuietHour", QuietHourSchema, "quiet_hours"));
}

export type CreateQuietHourInput = {
  userId: string;
  startTime: Date;
  endTime: Date;
  notified?: boolean;
};

export async function createQuietHour(input: CreateQuietHourInput): Promise<QuietHour> {
  await connectMongoose();
  const Model = getModel();
  const doc = await Model.create({
    userId: input.userId,
    startTime: input.startTime,
    endTime: input.endTime,
    notified: input.notified ?? false,
    createdAt: new Date(),
  });
  return doc.toObject() as QuietHour;
}

export async function listQuietHoursForUser(userId: string): Promise<QuietHour[]> {
  await connectMongoose();
  const Model = getModel();
  const docs = await Model.find({ userId }).sort({ startTime: -1 }).lean();
  return docs as QuietHour[];
}

export async function markQuietHourNotified(id: string): Promise<boolean> {
  await connectMongoose();
  const Model = getModel();
  const res = await Model.updateOne({ _id: id }, { $set: { notified: true } });
  return res.modifiedCount > 0;
}