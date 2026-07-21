import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  const mongoUri = env.mongoUri;
  mongoose.set('strictQuery', true);

  try {
    const dbName = new URL(mongoUri).pathname.slice(1).split('?')[0] || 'event_mgmt';
    await mongoose.connect(mongoUri, {
      dbName,
    });
    console.log('MongoDB connected');
  } catch (error) {
    if (env.nodeEnv === 'production') {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }

    console.warn('MongoDB unavailable; continuing in development mode. Install/start MongoDB for persistence APIs.');
  }
}
