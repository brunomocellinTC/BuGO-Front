import type { Dispatch, SetStateAction } from "react";
import { AzureEpic } from "../../types/workItemCreatorTypes";
import { handleUpdateParent } from "./handleUpdateParent";

export async function handleUpdateFeature(
  featureId: string,
  selectedEpic: AzureEpic | undefined,
  setFormValues: Dispatch<SetStateAction<Record<string, string>>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  setFormValues((current) => {
    const feature = selectedEpic?.features.find((item) => String(item.id) === featureId);
    const firstParent = feature?.children[0];

    return {
      ...current,
      featureId,
      parentId: firstParent ? String(firstParent.id) : ""
    };
  });

  const feature = selectedEpic?.features.find((item) => String(item.id) === featureId);
  const firstParent = feature?.children[0];

  if (firstParent) {
    await handleUpdateParent(String(firstParent.id), setFormValues, setError);
  }
}
