import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AttachmentDraft } from "../../types/workItemCreatorTypes";

export function handleFilesChange(
  event: ChangeEvent<HTMLInputElement>,
  currentAttachments: AttachmentDraft[],
  setAttachments: Dispatch<SetStateAction<AttachmentDraft[]>>
) {
  const selectedFiles = event.target.files;

  currentAttachments.forEach((attachment) => {
    if (attachment.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
  });

  if (!selectedFiles) {
    setAttachments([]);
    return;
  }

  setAttachments(
    Array.from(selectedFiles).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
    }))
  );
}
