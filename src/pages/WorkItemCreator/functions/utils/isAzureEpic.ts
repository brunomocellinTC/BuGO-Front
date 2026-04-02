import { AzureEpic, ErrorResponse } from "../../types/workItemCreatorTypes";

export function isAzureEpic(value: AzureEpic | ErrorResponse): value is AzureEpic {
  return "id" in value && "features" in value;
}
