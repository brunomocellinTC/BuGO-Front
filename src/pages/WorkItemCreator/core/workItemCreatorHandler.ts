import type { ChangeEvent, FormEvent } from "react";
import { saveStoredSystemInfo } from "../functions/utils/saveStoredSystemInfo";
import { handleAddStep } from "../functions/handles/handleAddStep";
import { handleFilesChange } from "../functions/handles/handleFilesChange";
import { handleRemoveAttachment } from "../functions/handles/handleRemoveAttachment";
import { handleRemoveStep } from "../functions/handles/handleRemoveStep";
import { handleSubmitWorkItem } from "../functions/handles/handleSubmitWorkItem";
import { handleToggleSystemInfo } from "../functions/handles/handleToggleSystemInfo";
import { handleUpdateEpic } from "../functions/handles/handleUpdateEpic";
import { handleUpdateFeature } from "../functions/handles/handleUpdateFeature";
import { handleUpdateField } from "../functions/handles/handleUpdateField";
import { handleUpdateParent } from "../functions/handles/handleUpdateParent";
import { handleUpdateStep } from "../functions/handles/handleUpdateStep";
import { handleUpdateSystemInfoDetail } from "../functions/handles/handleUpdateSystemInfoDetail";
import { handleUpdateSystemInfoVersion } from "../functions/handles/handleUpdateSystemInfoVersion";
import { SystemInfoItem } from "../types/workItemCreatorTypes";

export const workItemCreatorHandler = (State: any) => ({
  updateEpic: (epicId: string) =>
    handleUpdateEpic(epicId, State.setFormValues, State.setSyncData, State.setError),

  updateFeature: (featureId: string) =>
    handleUpdateFeature(featureId, State.selectedEpic, State.setFormValues, State.setError),

  updateParent: (parentId: string) =>
    handleUpdateParent(parentId, State.setFormValues, State.setError),

  updateField: (fieldId: string, value: string) =>
    handleUpdateField(fieldId, value, State.setFormValues),

  updateStep: (index: number, value: string) =>
    handleUpdateStep(index, value, State.setSteps),

  addStep: () =>
    handleAddStep(State.setSteps, State.stepInputRefs),

  removeStep: (index: number) =>
    handleRemoveStep(index, State.setSteps),

  handleFiles: (event: ChangeEvent<HTMLInputElement>) =>
    handleFilesChange(event, State.attachments, State.setAttachments),

  removeAttachment: (index: number) =>
    handleRemoveAttachment(index, State.setAttachments),

  toggleSystemInfo: (category: "browser" | "desktop" | "mobile", name: string) =>
    handleToggleSystemInfo(category, name, State.setSystemInfo),

  updateSystemInfoVersion: (category: "browser" | "desktop" | "mobile", name: string, version: string) =>
    handleUpdateSystemInfoVersion(category, name, version, State.setSystemInfo),

  updateSystemInfoDetail: (category: "browser" | "desktop" | "mobile", name: string, detail: string) =>
    handleUpdateSystemInfoDetail(category, name, detail, State.setSystemInfo),

  isSystemInfoSelected: (category: "browser" | "desktop" | "mobile", name: string) =>
    State.systemInfo.some((item: SystemInfoItem) => item.category === category && item.name === name),

  getSystemInfoVersion: (category: "browser" | "desktop" | "mobile", name: string) =>
    State.systemInfo.find((item: SystemInfoItem) => item.category === category && item.name === name)?.version ?? "",

  getSystemInfoDetail: (category: "browser" | "desktop" | "mobile", name: string) =>
    State.systemInfo.find((item: SystemInfoItem) => item.category === category && item.name === name)?.detail ?? "",

  saveSystemInfo: () =>
    saveStoredSystemInfo(State.systemInfo),

  handleSubmit: (event: FormEvent<HTMLFormElement>) =>
    handleSubmitWorkItem(event, {
      kind: State.kind,
      formValues: State.formValues,
      steps: State.steps,
      systemInfo: State.systemInfo,
      attachments: State.attachments,
      setError: State.setError,
      setResult: State.setResult,
      setShowValidationErrors: State.setShowValidationErrors,
      setIsSubmitting: State.setIsSubmitting
    })
});
