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
};

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
  onSelectKind
}: TypeSelectorSidebarProps) {
  const activeTheme = themeMap[kind];
  const fullTitle = buildFullTitle(titleTag, titleText);
  const osPreview = formatOsPreview(systemInfo);
  const browserPreview = formatBrowserPreview(systemInfo);
  const mobilePreview = formatMobilePreview(systemInfo);
  const imageAttachments = getImageAttachments(attachments);
  const videoAttachments = getVideoAttachments(attachments);

  return (
    <aside className="rounded-[24px] border border-white/10 bg-slate-950/85 p-4 shadow-panel backdrop-blur xl:max-h-[calc(100vh-1.5rem)] xl:overflow-y-auto">
      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Tipo</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">{config.title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-300">{config.basePath}</p>

      <div className="mt-4 grid gap-2">
        {config.kinds.map((item) => {
          const isActive = item.id === kind;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectKind(item.id)}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                isActive
                  ? "border-white/40 bg-white/10 shadow-lg"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${isActive ? activeTheme.badge : "border-white/10 bg-white/5 text-slate-300"}`}>
                {item.label}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{item.workItemType}</p>
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
            {imageAttachments.length > 0 ? (
              <div className="mt-3">
                <p>----------------</p>
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
              </div>
            ) : null}
          </div>

          {kind === "bug" && steps.some((step) => step.trim()) ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Steps *</p>
              <div className="mt-1 space-y-1">
                {steps.filter((step) => step.trim()).map((step, index) => (
                  <p key={`${step}-${index}`}>{index + 1}. {step}</p>
                ))}
              </div>
            </div>
          ) : null}

          {kind === "bug" ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">System Info</p>
              <div className="mt-1 space-y-3 whitespace-pre-wrap leading-6">
                <div>
                  <p>---- OS ----</p>
                  <p>{osPreview || "-"}</p>
                  <p>-------------</p>
                </div>
                <div>
                  <p>---- Browsers ----</p>
                  <p>{browserPreview || "-"}</p>
                  <p>--------------------</p>
                </div>
                <div>
                  <p>---- Mobile ----</p>
                  <p>{mobilePreview || "-"}</p>
                  <p>----------------</p>
                </div>
              </div>
            </div>
          ) : null}

          {kind === "issue" && acceptanceCriteria ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Acceptance Criteria</p>
              <p className="mt-1 whitespace-pre-wrap leading-6">{acceptanceCriteria}</p>
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

          {videoAttachments.length > 0 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Videos</p>
              <p className="mt-1 whitespace-pre-wrap leading-6">
                {`Segue ${videoAttachments.map((attachment) => attachment.name).join(", ")}`}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default TypeSelectorSidebar;
