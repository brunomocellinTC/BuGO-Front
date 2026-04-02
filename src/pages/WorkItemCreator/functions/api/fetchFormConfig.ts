import { FormConfigResponse } from "../../types/workItemCreatorTypes";
import { getApiBaseUrl } from "./getApiBaseUrl";

export async function fetchFormConfig() {
  const response = await fetch(`${getApiBaseUrl()}/api/form-config`);
  return (await response.json()) as FormConfigResponse;
}
