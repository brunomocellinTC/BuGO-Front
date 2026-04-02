import type { Dispatch, SetStateAction } from "react";
import { AzureSyncResponse } from "../../types/workItemCreatorTypes";
import { fetchEpicChildren } from "../api/fetchEpicChildren";

export async function handleUpdateEpic(
  epicId: string,
  setFormValues: Dispatch<SetStateAction<Record<string, string>>>,
  setSyncData: Dispatch<SetStateAction<AzureSyncResponse | null>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  setFormValues((current) => ({
    ...current,
    epicId
  }));

  try {
    const epic = await fetchEpicChildren(epicId);
    const firstFeature = epic.features[0];
    const firstParent = firstFeature?.children[0];

    setSyncData((current) =>
      current
        ? {
            ...current,
            epics: current.epics.map((item) => (item.id === epic.id ? epic : item))
          }
        : current
    );

    setFormValues((current) => ({
      ...current,
      epicId,
      featureId: firstFeature ? String(firstFeature.id) : "",
      parentId: firstParent ? String(firstParent.id) : ""
    }));
  } catch (refreshError) {
    const message = refreshError instanceof Error ? refreshError.message : "Failed to refresh epic";
    setError(message);
  }
}
