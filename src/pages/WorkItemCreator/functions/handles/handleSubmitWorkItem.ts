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

function getMissingBaseFields(kind: WorkItemKind, formValues: Record<string, string>) {
  const requiredFields: Array<{ id: string; label: string }> = [
    { id: "epicId", label: "Epic" },
    { id: "featureId", label: "Feature" },
    { id: "areaPath", label: "Area" },
    { id: "titleTag", label: "Tag" },
    { id: "titleText", label: "Titulo" },
    { id: "description", label: "Description" },
    { id: "requesterName", label: "Nome" }
  ];

  if (kind === "task") {
    requiredFields.push({ id: "parentId", label: "Parent item" });
  }

  return requiredFields
    .filter((field) => !(formValues[field.id] ?? "").trim())
    .map((field) => field.label);
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

  const missingBaseFields = getMissingBaseFields(kind, formValues);

  if (missingBaseFields.length > 0) {
    setError(`Preencha os campos obrigatorios: ${missingBaseFields.join(", ")}.`);
    return;
  }

  const hasAnyStep = steps.some((step) => step.trim().length > 0);
  const hasSystemInfo = systemInfo.length > 0;
  const hasAnyCriteria = (formValues.acceptanceCriteria ?? "")
    .split(/\r?\n/)
    .some((criterion) => criterion.replace(/^\s*\d+\.\s*/, "").trim().length > 0);

  if (kind === "bug" && (!hasAnyStep || !hasSystemInfo)) {
    const missing: string[] = [];

    if (!hasAnyStep) {
      missing.push("Steps");
    }

    if (!hasSystemInfo) {
      missing.push("System Info");
    }

    setError(`Bug requer preenchimento de: ${missing.join(", ")}.`);
    return;
  }

  if (kind === "issue" && !hasAnyCriteria) {
    setError("PBI requer ao menos 1 criterio em Acceptance Criteria.");
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





