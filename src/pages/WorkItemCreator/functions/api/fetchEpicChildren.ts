import { AzureEpic, ErrorResponse } from "../../types/workItemCreatorTypes";
import { isAzureEpic } from "../utils/isAzureEpic";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function fetchEpicChildren(epicId: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/epics/${epicId}/children`);
  const data = (await response.json()) as AzureEpic | ErrorResponse;

  if (!response.ok || !isAzureEpic(data)) {
    throw new Error(("error" in data ? data.error : undefined) ?? "Failed to refresh epic");
  }

  return data;
}
