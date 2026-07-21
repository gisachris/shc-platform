
const defaultApiUrl = 'https://shc-platform.onrender.com';

export const API_BASE_URL = defaultApiUrl;
export const API_URL = `${API_BASE_URL}/api`;

if (typeof window !== 'undefined') {
  window.__APP_CONFIG__ = { apiBaseUrl: API_BASE_URL };
}
