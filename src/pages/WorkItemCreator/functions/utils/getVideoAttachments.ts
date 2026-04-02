import { AttachmentDraft } from "../../types/workItemCreatorTypes";

export function getVideoAttachments(attachments: AttachmentDraft[]) {
  return attachments.filter((attachment) => attachment.type.startsWith("video/"));
}
