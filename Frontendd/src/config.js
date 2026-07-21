
const configuredApiUrl = (import.meta.env.VITE_API_URL || 'https://shc-platform.onrender.com').trim();

export const API_BASE_URL = configuredApiUrl && /^https?:\/\//.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, '')
  : 'https://shc-platform.onrender.com';

export const API_URL = `${API_BASE_URL}/api`;
