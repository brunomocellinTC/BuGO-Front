const DEFAULT_PROD_API_BASE_URL = "https://bugo-api.vercel.app";

export function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();

  if (value) {
    return value.endsWith("/") ? value.slice(0, -1) : value;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:3000";
    }

    if (host.endsWith("github.io")) {
      return DEFAULT_PROD_API_BASE_URL;
    }
  }

  return "";
}
