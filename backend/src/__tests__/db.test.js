import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

describe('connectDB', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects when MongoDB connection fails', async () => {
    jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('boom'));

    await expect(connectDB()).rejects.toThrow('boom');
  });
});
