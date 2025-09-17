import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}
if (!dbName) {
  throw new Error("Missing MONGODB_DB in environment");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}