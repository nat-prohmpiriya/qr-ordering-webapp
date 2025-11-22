import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
  var mongoClient: MongoClientCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

// MongoClient for NextAuth adapter
let clientCached: MongoClientCache = global.mongoClient || { client: null, promise: null };

if (!global.mongoClient) {
  global.mongoClient = clientCached;
}

export const clientPromise: Promise<MongoClient> = (async () => {
  if (clientCached.client) {
    return clientCached.client;
  }

  if (!clientCached.promise) {
    const opts = {};

    clientCached.promise = MongoClient.connect(MONGODB_URI!, opts).then((client) => {
      console.log('✅ MongoClient connected successfully (NextAuth)');
      return client;
    });
  }

  try {
    clientCached.client = await clientCached.promise;
  } catch (e) {
    clientCached.promise = null;
    console.error('❌ MongoClient connection error:', e);
    throw e;
  }

  return clientCached.client;
})();

export default connectDB;
