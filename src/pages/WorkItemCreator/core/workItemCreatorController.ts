import { useEffect, useMemo, useRef, useState } from "react";

import { fetchAzureSync } from "../functions/api/fetchAzureSync";
import { fetchFormConfig } from "../functions/api/fetchFormConfig";
import { loadStoredSystemInfo } from "../functions/utils/loadStoredSystemInfo";

import {
  AttachmentDraft,
  AzureSyncResponse,
  FormConfigResponse,
  SubmitResponse,
  SystemInfoItem,
  WorkItemKind
} from "../types/workItemCreatorTypes";

interface User {
  email: string;
  name: string;
}

export const workItemCreatorController = () => {
  const [config, setConfig] = useState<FormConfigResponse | null>(null);
  const [syncData, setSyncData] = useState<AzureSyncResponse | null>(null);

  const [kind, setKind] = useState<WorkItemKind>("bug");

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [steps, setSteps] = useState<string[]>([""]);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);

  const [systemInfo, setSystemInfo] = useState<SystemInfoItem[]>(
    () => loadStoredSystemInfo()
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const [isSyncing, setIsSyncing] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  const [isCheckingAzureAuth, setIsCheckingAzureAuth] = useState(false);

  const [azureAuthFeedback, setAzureAuthFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const stepInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  /**
   * Carrega usuário autenticado
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem("app_user");

        if (!userStr) {
          return;
        }

        const parsedUser = JSON.parse(userStr);

        if (parsedUser?.name) {
          setCurrentUser(parsedUser);
        }
      } catch (err) {
        console.error("Falha ao carregar usuário:", err);
      }
    };

    loadUser();

    /**
     * Alguns navegadores / fluxos OAuth
     * terminam o login depois do primeiro render.
     * Isso evita precisar dar F5.
     */
    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  /**
   * Sempre sincroniza sendBy
   * quando currentUser mudar
   */
  useEffect(() => {
    if (!currentUser?.name) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      sendBy: currentUser.name
    }));
  }, [currentUser]);

  /**
   * Carrega config + sync
   */
  useEffect(() => {
    async function loadData() {
      const [formConfigData, azureSyncData] = await Promise.all([
        fetchFormConfig(),
        fetchAzureSync()
      ]);

      const firstEpic = azureSyncData.epics[0];

      const firstFeature = firstEpic?.features[0];

      /**
       * Filtra apenas itens válidos
       * para parent
       */
      const validParents =
        firstFeature?.children.filter(
          (item) =>
            item.workItemType !== "Bug" &&
            item.workItemType !== "Task"
        ) ?? [];

      const firstParent = validParents[0];

      setConfig(formConfigData);
      setSyncData(azureSyncData);
      setFormValues((current) => ({
        ...current,
        ...formConfigData.defaults,

        epicId: firstEpic
          ? String(firstEpic.id)
          : "",

        featureId: firstFeature
          ? String(firstFeature.id)
          : "",

        parentId: firstParent
          ? String(firstParent.id)
          : "",

        /**
         * IMPORTANTÍSSIMO:
         * usa SEMPRE o nome atual do usuário
         * autenticado e não sobrescreve
         * com vazio
         */
        sendBy:
          currentUser?.name ||
          current.sendBy ||
          ""
      }));

      setSteps([""]);
      setAttachments([]);
    }

    loadData()
      .catch((loadError: unknown) => {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load form";

        setError(message);
      })
      .finally(() => {
        setIsSyncing(false);
      });
  }, [currentUser]);

  const fields = useMemo(() => {
    if (!config) {
      return [];
    }

    return kind === "bug"
      ? config.bugFields
      : kind === "issue"
        ? config.issueFields
        : config.taskFields;
  }, [config, kind]);

  const selectedEpic = useMemo(
    () =>
      syncData?.epics.find(
        (epic) =>
          String(epic.id) === formValues.epicId
      ) ?? syncData?.epics[0],
    [syncData, formValues.epicId]
  );

  const selectedFeature = useMemo(
    () =>
      selectedEpic?.features.find(
        (feature) =>
          String(feature.id) === formValues.featureId
      ) ?? selectedEpic?.features[0],
    [selectedEpic, formValues.featureId]
  );

  const parentOptions = useMemo(
    () =>
      (selectedFeature?.children ?? []).filter(
        (item) =>
          item.workItemType !== "Bug" &&
          item.workItemType !== "Task"
      ),
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
    setSyncData,
    isCheckingAzureAuth,
    setIsCheckingAzureAuth,
    azureAuthFeedback,
    setAzureAuthFeedback,
    currentUser
  };

  return { state };
};