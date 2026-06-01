/**
 * Helper para adicionar token de autenticação aos headers
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("app_token");
  
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

/**
 * Wrapper para fetch que inclui autenticação automaticamente
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });
}
