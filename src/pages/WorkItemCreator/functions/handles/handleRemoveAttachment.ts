import type { Dispatch, SetStateAction } from "react";
import { AttachmentDraft } from "../../types/workItemCreatorTypes";

export function handleRemoveAttachment(
  index: number,
  setAttachments: Dispatch<SetStateAction<AttachmentDraft[]>>
) {
  setAttachments((current) => {
    const next = [...current];
    const removed = next[index];

    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    next.splice(index, 1);
    return next;
  });
}
