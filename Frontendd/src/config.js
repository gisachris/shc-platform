
const defaultApiUrl = 'https://shc-platform.onrender.com';
const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim();

function resolveApiBaseUrl() {
  if (!configuredApiUrl) {
    return defaultApiUrl;
  }

  if (/^https?:\/\//i.test(configuredApiUrl)) {
    return configuredApiUrl.replace(/\/$/, '');
  }

  if (configuredApiUrl.includes('backend.com') || configuredApiUrl.includes('localhost')) {
    return defaultApiUrl;
  }

  if (configuredApiUrl.startsWith('//')) {
    return `https:${configuredApiUrl}`.replace(/\/$/, '');
  }

  return defaultApiUrl;
}

export const API_BASE_URL = resolveApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
