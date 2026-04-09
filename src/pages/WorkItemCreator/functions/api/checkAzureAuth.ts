import { AzureAuthCheckResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function checkAzureAuth() {
  const response = await fetch(`${getApiBaseUrl()}/api/azure-auth-check`);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Falha ao validar PAT no Azure");
  }

  return (await response.json()) as AzureAuthCheckResponse;
}
