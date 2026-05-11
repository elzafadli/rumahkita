// export const API_BASE_URL = process.env.API_BASE_URL;
export const API_BASE_URL = "https://api.fincontrol.my.id";

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const apiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  return `${apiBaseUrl}${path}`;
}
