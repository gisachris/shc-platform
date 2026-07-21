import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { loadEnv } from '../config/env.js';

describe('env loading', () => {
  const originalCwd = process.cwd();
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.chdir(originalCwd);
    process.env = { ...originalEnv };
  });

  it('loads a backend .env file when running from the repository root', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eventone-env-'));
    const backendDir = path.join(tempDir, 'backend');
    const repoRoot = tempDir;

    fs.mkdirSync(backendDir, { recursive: true });
    fs.writeFileSync(path.join(backendDir, '.env'), 'MONGO_URI=mongodb://127.0.0.1:27017/test_db\nJWT_SECRET=test-secret\n');

    process.chdir(repoRoot);
    delete process.env.MONGO_URI;
    delete process.env.JWT_SECRET;

    loadEnv({
      cwd: repoRoot,
      filePath: path.join(backendDir, 'src', 'config', 'env.js')
    });

    expect(process.env.MONGO_URI).toBe('mongodb://127.0.0.1:27017/test_db');
    expect(process.env.JWT_SECRET).toBe('test-secret');
  });
});
