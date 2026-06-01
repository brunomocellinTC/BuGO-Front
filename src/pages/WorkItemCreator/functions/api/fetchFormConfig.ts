import { FormConfigResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";
import { fetchWithAuth } from "./authHeaders";

export async function fetchFormConfig() {
  const response = await fetchWithAuth(`${getApiBaseUrl()}/api/form-config`);
  return (await response.json()) as FormConfigResponse;
}
