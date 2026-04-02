import { ErrorResponse, ParentSummary } from "../../types/workItemCreatorTypes";

export function isParentSummary(value: ParentSummary | ErrorResponse): value is ParentSummary {
  return "id" in value && "title" in value && "workItemType" in value && "state" in value;
}
