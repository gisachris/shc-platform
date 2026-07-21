import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const backendRoot = path.resolve(currentDir, '../..');

export function loadEnv({ cwd = process.cwd(), filePath = currentFilePath } = {}) {
  const resolvedCandidates = [
    path.resolve(path.dirname(filePath), '../../.env'),
    path.resolve(cwd, '.env'),
    path.resolve(cwd, 'backend/.env'),
    path.resolve(backendRoot, '.env'),
  ];

  const uniqueCandidates = [...new Set(resolvedCandidates.filter(Boolean))];

  for (const candidate of uniqueCandidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
    }
  }

  if (!uniqueCandidates.some((candidate) => fs.existsSync(candidate))) {
    dotenv.config();
  }

  return process.env;
}

loadEnv();

const isProduction = process.env.NODE_ENV === 'production';
const requiredEnvVars = [];

if (isProduction) {
  requiredEnvVars.push('JWT_SECRET', 'MONGO_URI', 'CLIENT_URL');
}

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}. Copy backend/.env.example to backend/.env and fill in the values.`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5050),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_mgmt',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailFrom: (process.env.EMAIL_FROM || `${process.env.APP_NAME || 'eventone'} <no-reply@eventone.local>`).toString(),
  appName: process.env.APP_NAME?.toString().trim() || 'eventone',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

export default env;
