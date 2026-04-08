import type { ChangeEvent, Dispatch, SetStateAction } from "react";

import { AttachmentDraft } from "../../types/workItemCreatorTypes";

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };

    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export async function handleFilesChange(
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

  const nextAttachments = await Promise.all(
    Array.from(selectedFiles).map(async (file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      contentBase64: await fileToBase64(file)
    }))
  );

  setAttachments(nextAttachments);
}

