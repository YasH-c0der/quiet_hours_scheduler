import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectMongoose() {
  if (global._mongooseConn) return global._mongooseConn;
  global._mongooseConn = mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB,
  });
  return global._mongooseConn;
}