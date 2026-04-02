export function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!value) {
    return "";
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}
