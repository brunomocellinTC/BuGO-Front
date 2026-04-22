import type { Dispatch, FormEvent, SetStateAction } from "react";

import { postWorkItem } from "../api/postWorkItem";
import { FRONTEND_ONLY_SUBMIT } from "../utils/frontendOnlySubmit";
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

function focusInvalidField(fieldId: string) {
  if (typeof document === "undefined") {
    return;
  }

  window.setTimeout(() => {
    const field = document.querySelector(`[data-field-id="${fieldId}"]`) as HTMLElement | null;

    if (!field) {
      return;
    }

    field.scrollIntoView({ behavior: "smooth", block: "center" });

    const candidate =
      field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement
        ? field
        : (field.querySelector("input, textarea, select, button") as HTMLElement | null);

    candidate?.focus();
  }, 0);
}

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

  const hasAnyStep = steps.some((step) => step.trim().length > 0);
  const hasSystemInfo = systemInfo.length > 0;
  const hasAnyAttachment = attachments.length > 0;
  const hasAnyCriteria = (formValues.acceptanceCriteria ?? "")
    .split(/\r?\n/)
    .some((criterion) => criterion.replace(/^\s*\d+\.\s*/, "").trim().length > 0);

  const missing: string[] = [];
  let firstInvalidFieldId: string | null = null;

  const registerMissing = (label: string, fieldId: string) => {
    missing.push(label);

    if (!firstInvalidFieldId) {
      firstInvalidFieldId = fieldId;
    }
  };

  const sendByValue = (formValues.sendBy ?? "").trim();

  if (!sendByValue || sendByValue.toLowerCase() === "selecione...") {
    registerMissing("Enviado por", "sendBy");
  }
  if (!(formValues.titleTag ?? "").trim()) {
    registerMissing("Tag", "titleTag");
  }

  if (!(formValues.titleText ?? "").trim()) {
    registerMissing("Titulo", "titleText");
  }

  if (!(formValues.description ?? "").trim()) {
    registerMissing("Description", "description");
  }

  if (kind === "bug") {
    if (!hasAnyStep) {
      registerMissing("Steps", "steps");
    }

    if (!hasSystemInfo) {
      registerMissing("System Info", "systemInfo");
    }

    if (!hasAnyAttachment) {
      registerMissing("Anexos", "media");
    }
  }

  if (kind === "issue") {
    if (!hasAnyCriteria) {
      registerMissing("Acceptance Criteria", "acceptanceCriteria");
    }

    if (!hasAnyAttachment) {
      registerMissing("Anexos", "media");
    }
  }

  if (missing.length > 0) {
    setError(`Campos obrigatorios: ${missing.join(", ")}.`);

    if (firstInvalidFieldId) {
      focusInvalidField(firstInvalidFieldId);
    }

    return;
  }

  setIsSubmitting(true);

  try {
    const payload = {
      kind,
      ...formValues,
      steps: steps.map((step) => step.trim()).filter(Boolean),
      systemInfo,
      attachments: attachments.map(({ name, type, size, contentBase64 }) => ({
        name,
        type,
        size,
        contentBase64: contentBase64 ?? ""
      }))
    };

    console.log("[BuGO][SubmitPayload]", {
      areaPath: formValues.areaPath,
      epicId: formValues.epicId,
      featureId: formValues.featureId,
      parentId: formValues.parentId,
      kind
    });

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
    const message = submitError instanceof Error ? submitError.message : "Falha ao enviar card";
    setError(message);
  } finally {
    setIsSubmitting(false);
  }
}

