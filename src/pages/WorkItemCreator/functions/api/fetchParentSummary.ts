import { ErrorResponse, ParentSummary } from "../../types/workItemCreatorTypes";
import { isParentSummary } from "../utils/isParentSummary";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function fetchParentSummary(parentId: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/work-items/${parentId}`);
  const data = (await response.json()) as ParentSummary | ErrorResponse;

  if (!response.ok || !isParentSummary(data)) {
    throw new Error(("error" in data ? data.error : undefined) ?? "Failed to refresh parent");
  }

  return data;
}
