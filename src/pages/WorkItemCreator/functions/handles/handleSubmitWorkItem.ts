import type { Dispatch, FormEvent, SetStateAction } from "react";
import { FRONTEND_ONLY_SUBMIT } from "../utils/frontendOnlySubmit";
import { postWorkItem } from "../api/postWorkItem";
import { AttachmentDraft, SubmitResponse, SystemInfoItem, WorkItemKind } from "../../types/workItemCreatorTypes";

type SubmitDependencies = {
  kind: WorkItemKind;
  formValues: Record<string, string>;
  steps: string[];
  systemInfo: SystemInfoItem[];
  attachments: AttachmentDraft[];
  setError: Dispatch<SetStateAction<string | null>>;
  setResult: Dispatch<SetStateAction<SubmitResponse | null>>;
  setShowValidationErrors: Dispatch<SetStateAction<boolean>>;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

export async function handleSubmitWorkItem(
  event: FormEvent<HTMLFormElement>,
  dependencies: SubmitDependencies
) {
  const {
    kind,
    formValues,
    steps,
    systemInfo,
    attachments,
    setError,
    setResult,
    setShowValidationErrors,
    setIsSubmitting
  } = dependencies;

  event.preventDefault();
  setError(null);
  setResult(null);
  setShowValidationErrors(true);

  if (!(event.currentTarget as HTMLFormElement).reportValidity()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const payload = {
      kind,
      ...formValues,
      steps: steps.map((step) => step.trim()).filter(Boolean),
      systemInfo,
      attachments: attachments.map(({ name, type, size }) => ({
        name,
        type,
        size
      }))
    };

    if (FRONTEND_ONLY_SUBMIT) {
      window.setTimeout(() => {
        setResult({ id: 0, url: "#" });
        setIsSubmitting(false);
      }, 250);
      return;
    }

    const data = await postWorkItem(payload);
    setResult(data);
  } catch (submitError) {
    const message = submitError instanceof Error ? submitError.message : "Submit failed";
    setError(message);
  } finally {
    setIsSubmitting(false);
  }
}
