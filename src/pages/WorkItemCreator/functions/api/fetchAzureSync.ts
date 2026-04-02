import { AzureSyncResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function fetchAzureSync() {
  const response = await fetch(`${getApiBaseUrl()}/api/azure-sync`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to sync Azure data");
  }

  return data as AzureSyncResponse;
}
