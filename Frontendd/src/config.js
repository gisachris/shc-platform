
const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim();

export const API_BASE_URL = configuredApiUrl && /^https?:\/\//.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, '')
  : '';
