/**
 * Helper para adicionar token de autenticação aos headers
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("app_token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Força logout limpo e redireciona para login
 */
function handleAuthExpired() {
  localStorage.removeItem("app_token");
  localStorage.removeItem("app_user");

  const base = import.meta.env.VITE_BASENAME || "";
  window.location.replace(`${window.location.origin}${base}login`);
}

/**
 * Wrapper para fetch com autenticação + tratamento de expiração
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // 🔥 TRATAMENTO GLOBAL DE TOKEN EXPIRADO
  if (response.status === 401) {
    try {
      const cloned = response.clone();

      const data = await cloned.json().catch(() => null);

      const message = data?.message?.toLowerCase?.() || "";

      const isAuthError =
        message.includes("token") ||
        message.includes("expired") ||
        message.includes("invalid") ||
        true; // fallback seguro

      if (isAuthError) {
        handleAuthExpired();
      }
    } catch {
      handleAuthExpired();
    }

    // interrompe fluxo normal
    throw new Error("Unauthorized");
  }

  return response;
}