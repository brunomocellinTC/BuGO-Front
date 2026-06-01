import { AzureAuthCheckResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";
import { fetchWithAuth } from "./authHeaders";

export async function checkAzureAuth() {
  const response = await fetchWithAuth(`${getApiBaseUrl()}/api/azure-auth-check`);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Falha ao validar PAT no Azure");
  }

  return (await response.json()) as AzureAuthCheckResponse;
}
