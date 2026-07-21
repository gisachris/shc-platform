import mongoose from 'mongoose';
import { env } from './env.js';

function normalizeMongoUri(uri) {
  if (!uri) {
    return 'mongodb://127.0.0.1:27017/event_mgmt';
  }

  if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  return `mongodb://${uri}`;
}

export async function connectDB() {
  const mongoUri = normalizeMongoUri(env.mongoUri);
  const hasExplicitMongoUri = Boolean(process.env.MONGO_URI && process.env.MONGO_URI.trim());
  mongoose.set('strictQuery', true);

  try {
    const dbName = new URL(mongoUri).pathname.slice(1).split('?')[0] || 'event_mgmt';
    await mongoose.connect(mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (hasExplicitMongoUri) {
      console.error('MongoDB connection failed for configured MONGO_URI:', message);
      console.error('Verify that your Atlas cluster allows connections from this IP address and that the username/password are correct.');
      throw error;
    }

    if (env.nodeEnv === 'production') {
      console.error('MongoDB connection error:', message);
      throw error;
    }

    if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      console.error('MongoDB connection failed:', message);
      throw error;
    }

    console.warn('MongoDB unavailable; falling back to local development defaults.');
    const fallbackUri = 'mongodb://127.0.0.1:27017/event_mgmt';
    try {
      const fallbackDbName = new URL(fallbackUri).pathname.slice(1).split('?')[0] || 'event_mgmt';
      await mongoose.connect(fallbackUri, {
        dbName: fallbackDbName,
        serverSelectionTimeoutMS: 10000,
      });
      console.log('MongoDB connected to local fallback instance');
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      console.error('MongoDB connection failed:', fallbackMessage);
      throw fallbackError;
    }
  }
}
