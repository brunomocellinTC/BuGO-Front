import { AttachmentDraft } from "../../types/workItemCreatorTypes";

export function getImageAttachments(attachments: AttachmentDraft[]) {
  return attachments.filter((attachment) => attachment.type.startsWith("image/"));
}
