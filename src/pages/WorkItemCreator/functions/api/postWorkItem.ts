import { SubmitResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function postWorkItem(payload: unknown) {
  const response = await fetch(`${getApiBaseUrl()}/api/work-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create work item");
  }

  return data as SubmitResponse;
}
