import { SubmitResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";
import { fetchWithAuth } from "./authHeaders";

export async function postWorkItem(payload: unknown) {
  const response = await fetchWithAuth(`${getApiBaseUrl()}/api/work-items`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create work item");
  }

  return data as SubmitResponse;
}
