import type { Dispatch, SetStateAction } from "react";
import { AzureEpic } from "../../types/workItemCreatorTypes";

export async function handleUpdateFeature(
  featureId: string,
  selectedEpic: AzureEpic | undefined,
  setFormValues: Dispatch<SetStateAction<Record<string, string>>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  try {
    setFormValues((current) => {
      const feature = selectedEpic?.features.find(
        (item) => String(item.id) === featureId
      );

      // mantém parent atual se ainda existir
      const currentParentStillExists = feature?.children.some(
        (child) => String(child.id) === current.parentId
      );

      return {
        ...current,
        featureId,

        // NÃO resetar automaticamente para o primeiro item
        parentId: currentParentStillExists
          ? current.parentId
          : feature?.children?.[0]
            ? String(feature.children[0].id)
            : ""
      };
    });
  } catch (refreshError) {
    const message =
      refreshError instanceof Error
        ? refreshError.message
        : "Failed to refresh feature";

    setError(message);
  }
}