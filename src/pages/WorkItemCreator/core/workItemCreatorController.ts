import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAzureSync } from "../functions/api/fetchAzureSync";
import { fetchFormConfig } from "../functions/api/fetchFormConfig";
import { loadStoredSystemInfo } from "../functions/utils/loadStoredSystemInfo";
import { AttachmentDraft, AzureSyncResponse, FormConfigResponse, SubmitResponse, SystemInfoItem, WorkItemKind } from "../types/workItemCreatorTypes";

export const workItemCreatorController = () => {
  const [config, setConfig] = useState<FormConfigResponse | null>(null);
  const [syncData, setSyncData] = useState<AzureSyncResponse | null>(null);
  const [kind, setKind] = useState<WorkItemKind>("bug");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [steps, setSteps] = useState<string[]>([""]);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfoItem[]>(() => loadStoredSystemInfo());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const stepInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    async function loadData() {
      const [formConfigData, azureSyncData] = await Promise.all([
        fetchFormConfig(),
        fetchAzureSync()
      ]);

      const firstEpic = azureSyncData.epics[0];
      const firstFeature = firstEpic?.features[0];
      const firstParent = firstFeature?.children[0];

      setConfig(formConfigData);
      setSyncData(azureSyncData);
      setFormValues({
        ...formConfigData.defaults,
        epicId: firstEpic ? String(firstEpic.id) : "",
        featureId: firstFeature ? String(firstFeature.id) : "",
        parentId: firstParent ? String(firstParent.id) : ""
      });
      setSteps([""]);
      setAttachments([]);
    }

    loadData()
      .catch((loadError: unknown) => {
        const message = loadError instanceof Error ? loadError.message : "Failed to load form";
        setError(message);
      })
      .finally(() => setIsSyncing(false));
  }, []);

  const fields = useMemo(() => {
    if (!config) {
      return [];
    }

    return kind === "bug" ? config.bugFields : kind === "issue" ? config.issueFields : config.taskFields;
  }, [config, kind]);

  const selectedEpic = useMemo(
    () => syncData?.epics.find((epic) => String(epic.id) === formValues.epicId) ?? syncData?.epics[0],
    [syncData, formValues.epicId]
  );

  const selectedFeature = useMemo(
    () => selectedEpic?.features.find((feature) => String(feature.id) === formValues.featureId) ?? selectedEpic?.features[0],
    [selectedEpic, formValues.featureId]
  );

  const parentOptions = useMemo(
    () => (selectedFeature?.children ?? []).filter((item) => item.workItemType !== "Bug" && item.workItemType !== "Task"),
    [selectedFeature]
  );

  const state = {
    config,
    syncData,
    kind,
    setKind,
    formValues,
    setFormValues,
    steps,
    setSteps,
    attachments,
    setAttachments,
    systemInfo,
    setSystemInfo,
    isSubmitting,
    setIsSubmitting,
    showValidationErrors,
    setShowValidationErrors,
    isSyncing,
    error,
    setError,
    result,
    setResult,
    stepInputRefs,
    fields,
    selectedEpic,
    parentOptions,
    setSyncData
  };

  return { state };
};
