import type { Dispatch, SetStateAction } from "react";
import { fetchParentSummary } from "../api/fetchParentSummary";

export async function handleUpdateParent(
  parentId: string,
  setFormValues: Dispatch<SetStateAction<Record<string, string>>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  setFormValues((current) => ({
    ...current,
    parentId
  }));

  try {
    await fetchParentSummary(parentId);
  } catch (refreshError) {
    const message = refreshError instanceof Error ? refreshError.message : "Failed to refresh parent";
    setError(message);
  }
}
