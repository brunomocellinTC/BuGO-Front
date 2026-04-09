import { themeMap } from "../constants/workItemCreatorTheme";
import { buildFullTitle } from "../functions/utils/buildFullTitle";
import { formatBrowserPreview } from "../functions/utils/formatBrowserPreview";
import { formatMobilePreview } from "../functions/utils/formatMobilePreview";
import { formatOsPreview } from "../functions/utils/formatOsPreview";
import { getImageAttachments } from "../functions/utils/getImageAttachments";
import { getVideoAttachments } from "../functions/utils/getVideoAttachments";
import { AttachmentDraft, FormConfigResponse, SystemInfoItem, WorkItemKind } from "../types/workItemCreatorTypes";

type TypeSelectorSidebarProps = {
  config: FormConfigResponse;
  kind: WorkItemKind;
  titleTag: string;
  titleText: string;
  description: string;
  acceptanceCriteria?: string;
  priority?: string;
  valueArea?: string;
  activity?: string;
  requesterName?: string;
  steps: string[];
  systemInfo: SystemInfoItem[];
  attachments: AttachmentDraft[];
  onSelectKind: (kind: WorkItemKind) => void;
  onCheckAzureAuth: () => void;
  isCheckingAzureAuth: boolean;
};

function splitBddStep(step: string) {
  const trimmed = step.trim();
  const normalized = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = normalized.match(/^(Quando|E|Entao)\b\s*(.*)$/i);

  if (!match) {
    return null;
  }

  const keywordRaw = match[1].toLowerCase();
  const keyword = keywordRaw.startsWith("ent") ? "Ent\u00e3o" : keywordRaw === "e" ? "E" : "Quando";
  return {
    keyword,
    content: match[2]
  };
}

function TypeSelectorSidebar({
  config,
  kind,
  titleTag,
  titleText,
  description,
  acceptanceCriteria,
  priority,
  valueArea,
  activity,
  requesterName,
  steps,
  systemInfo,
  attachments,
  onSelectKind,
  onCheckAzureAuth,
  isCheckingAzureAuth
}: TypeSelectorSidebarProps) {
  const activeTheme = themeMap[kind];
  const fullTitle = buildFullTitle(titleTag, titleText);
  const osPreview = formatOsPreview(systemInfo);
  const browserPreview = formatBrowserPreview(systemInfo);
  const mobilePreview = formatMobilePreview(systemInfo);
  const imageAttachments = getImageAttachments(attachments);
  const videoAttachments = getVideoAttachments(attachments);
  const hasAnyAttachmentPreview = imageAttachments.length > 0 || videoAttachments.length > 0;

  return (
    <aside className="rounded-[24px] border border-white/10 bg-slate-950/85 p-4 shadow-panel backdrop-blur xl:max-h-[calc(100vh-1.5rem)] xl:overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Tipo</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{config.title}</h1>
        <button
          type="button"
          onClick={onCheckAzureAuth}
          disabled={isCheckingAzureAuth}
          className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCheckingAzureAuth ? "Validando" : "Testar PAT"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{config.basePath}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {config.kinds.filter((item) => item.id !== "task").map((item) => {
          const isActive = item.id === kind;
          const displayLabel = item.id === "issue" ? "PBI" : item.label;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectKind(item.id)}
              className={`flex min-h-[118px] flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center transition ${isActive
                  ? item.id === "bug"
                    ? "border-red-400 bg-white/10 shadow-lg"
                    : "border-sky-400 bg-white/10 shadow-lg"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
            >
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${isActive ? activeTheme.badge : "border-white/10 bg-white/5 text-slate-300"}`}>
                {displayLabel}
              </span>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                {item.id === "bug"
                  ? "Falha com passos, severidade e system info."
                  : item.id === "issue"
                    ? "Melhoria com criterio de aceite e valor."
                    : "Atividade criada dentro de um parent item."}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Preview</p>
        <p className="mt-2 text-base font-medium text-white">{fullTitle || "[TAG] Titulo do card"}</p>
        <div className="mt-4 grid gap-3 text-sm text-slate-200">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Description</p>
            <p className="mt-1 whitespace-pre-wrap leading-6">{description || "-"}</p>
            {hasAnyAttachmentPreview ? (
              <div className="mt-3">
                <p>-- Anexos --</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {imageAttachments.map((attachment) =>
                    attachment.previewUrl ? (
                      <img
                        key={`${attachment.name}-${attachment.size}`}
                        src={attachment.previewUrl}
                        alt={attachment.name}
                        className="max-h-48 w-full rounded-xl border border-white/10 object-cover"
                      />
                    ) : null
                  )}
                </div>
                {videoAttachments.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    {videoAttachments.map((attachment) => (
                      <a
                        key={`${attachment.name}-${attachment.size}`}
                        href={attachment.previewUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="block underline"
                      >
                        {`Segue video ${attachment.name}`}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {kind === "bug" && steps.some((step) => step.trim()) ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Steps *</p>
              <div className="mt-1 space-y-1">
                {steps.filter((step) => step.trim()).map((step, index) => {
                  const bdd = splitBddStep(step);

                  return (
                    <p key={`${step}-${index}`}>
                      {index + 1}. {bdd ? <><strong>{bdd.keyword}</strong>{bdd.content ? ` ${bdd.content}` : ""}</> : step}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : null}

          {kind === "bug" ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">System Info</p>
              <div className="mt-1 space-y-3 whitespace-pre-wrap leading-6">
                <div>
                  <p>---- Browsers ----</p>
                  <p>{browserPreview || "-"}</p>
                </div>
                <div>
                  <p>---- OS ----</p>
                  <p>{osPreview || "-"}</p>
                </div>
                <div>
                  <p>---- Mobile ----</p>
                  <p>{mobilePreview || "-"}</p>
                </div>
              </div>
            </div>
          ) : null}

          {kind === "issue" && acceptanceCriteria ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Acceptance Criteria</p>
              <div className="mt-1 space-y-1">
                {acceptanceCriteria
                  .split(/\r?\n/)
                  .map((line) => line.replace(/^\s*\d+\.\s*/, "").trim())
                  .filter(Boolean)
                  .map((criterion, index) => {
                    const bdd = splitBddStep(criterion);

                    return (
                      <p key={`${criterion}-${index}`}>
                        {index + 1}. {bdd ? <><strong>{bdd.keyword}</strong>{bdd.content ? ` ${bdd.content}` : ""}</> : criterion}
                      </p>
                    );
                  })}
              </div>
            </div>
          ) : null}

          {kind === "issue" ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Details</p>
              <p className="mt-1 whitespace-pre-wrap leading-6">
                Priority: {priority || "-"}
                {"\n"}
                Value Area: {valueArea || "-"}
                {"\n"}
                Enviado por: {requesterName || "-"}
              </p>
            </div>
          ) : kind === "task" ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Details</p>
              <p className="mt-1 whitespace-pre-wrap leading-6">
                Priority: {priority || "-"}
                {"\n"}
                Development: {activity || "-"}
                {"\n"}
                Enviado por: {requesterName || "-"}
              </p>
            </div>
          ) : null}


        </div>
      </div>
    </aside>
  );
}

export default TypeSelectorSidebar;





