import mongoose from "mongoose";

const globalWithMongoose = globalThis;

if (!globalWithMongoose.__mongoose) {
  globalWithMongoose.__mongoose = { conn: null, promise: null, error: null, retryAfter: 0 };
}

let cached = globalWithMongoose.__mongoose;
cached.error ??= null;
cached.retryAfter ??= 0;

export async function connectMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.error && cached.retryAfter > Date.now()) {
    throw cached.error;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", false);
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
        socketTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 0,
      })
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        cached.error = null;
        cached.retryAfter = 0;
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        cached.error = error;
        cached.retryAfter = Date.now() + 10000;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
