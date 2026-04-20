import type { ChangeEvent, MutableRefObject } from "react";
import InfoPopover from "./InfoPopover";
import { AttachmentDraft, FormConfigResponse, FormField, SystemInfoItem, WorkItemKind } from "../types/workItemCreatorTypes";

type WorkItemFieldsProps = {
  kind: WorkItemKind;
  fields: FormField[];
  config: FormConfigResponse;
  formValues: Record<string, string>;
  steps: string[];
  attachments: AttachmentDraft[];
  systemInfo: SystemInfoItem[];
  showValidationErrors: boolean;
  activeButtonBackground: string;
  stepInputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  isFieldInvalid: (fieldId: string, required?: boolean) => boolean;
  updateField: (fieldId: string, value: string) => void;
  updateStep: (index: number, value: string) => void;
  addStep: () => void;
  removeStep: (index: number) => void;
  handleFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: (index: number) => void;
  toggleSystemInfo: (category: "browser" | "desktop" | "mobile", name: string) => void;
  updateSystemInfoVersion: (category: "browser" | "desktop" | "mobile", name: string, value: string) => void;
  updateSystemInfoDetail: (category: "browser" | "desktop" | "mobile", name: string, value: string) => void;
  isSystemInfoSelected: (category: "browser" | "desktop" | "mobile", name: string) => boolean;
  getSystemInfoVersion: (category: "browser" | "desktop" | "mobile", name: string) => string;
  getSystemInfoDetail: (category: "browser" | "desktop" | "mobile", name: string) => string;
  saveSystemInfo: () => void;
};

function WorkItemFields({
  kind,
  fields,
  config,
  formValues,
  steps,
  attachments,
  systemInfo,
  showValidationErrors,
  activeButtonBackground,
  stepInputRefs,
  isFieldInvalid,
  updateField,
  updateStep,
  addStep,
  removeStep,
  handleFiles,
  removeAttachment,
  toggleSystemInfo,
  updateSystemInfoVersion,
  updateSystemInfoDetail,
  isSystemInfoSelected,
  getSystemInfoVersion,
  getSystemInfoDetail,
  saveSystemInfo
}: WorkItemFieldsProps) {
  function renderGenericField(field: FormField, options?: {
    spanTwoColumns?: boolean;
    label?: string;
    popover?: {
      title: string;
      items: Array<{ keyword?: string; text: string }>;
      useBddTrigger?: boolean;
    };
  }) {
    const value = formValues[field.id] ?? "";
    const isTextarea = field.type === "textarea";
    const spanTwoColumns = options?.spanTwoColumns ?? isTextarea;
    const fieldLabel = options?.label ?? field.label;
    const popover = options?.popover;
    const invalidClass = isFieldInvalid(field.id, field.required)
      ? "border-red-400 bg-red-50 text-red-950 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100"
      : "";

    const bugStepsInvalid =
      kind === "bug" && showValidationErrors && field.type === "steps" && !steps.some((step) => step.trim());
    const bugSystemInfoInvalid =
      kind === "bug" && showValidationErrors && field.type === "systemInfo" && systemInfo.length === 0;
    const bugMediaInvalid =
      kind === "bug" && showValidationErrors && field.type === "media" && attachments.length === 0;

    if (field.type === "steps") {
      return (
        <div key={field.id} className={`grid h-full gap-2 content-start ${spanTwoColumns ? "xl:col-span-2" : ""} ${bugStepsInvalid ? "rounded-2xl border border-red-400/70 p-2" : ""}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white">{fieldLabel}</span>
            <InfoPopover
              title="Padrao BDD para Steps"
              triggerText="BDD"
              triggerIconUrl="https://cucumber.io/img/logo.svg"
              align="right"
              triggerClassName="inline-flex items-center gap-1 text-[12px] font-semibold text-white transition hover:text-slate-200"
              items={[
                { keyword: "Quando", text: "entro no 'link'" },
                { keyword: "E", text: "a home aparece" },
                { keyword: "E", text: "clico no botao 'login'" },
                { keyword: "E", text: "valido meu perfil" },
                { keyword: "Então", text: "vejo o Dashboard" }
              ]}
            />
          </div>
          <div className="grid content-start gap-2">
            {steps.map((step, index) => (
              <div key={`${field.id}-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={step}
                  placeholder={`Passo ${index + 1}`}
                  ref={(element) => {
                    stepInputRefs.current[index] = element;
                  }}
                  onChange={(event) => updateStep(index, event.target.value)}
                  className="input-base"
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-50"
                >
                  -
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex w-fit items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            + Adicionar step
          </button>
        </div>
      );
    }

    if (field.id === "acceptanceCriteria") {
      const rawLines = value.split(/\r?\n/);
      const criteriaList = rawLines.length > 0
        ? rawLines.map((line) => line.replace(/^\s*\d+\.\s*/, ""))
        : [""];

      const issueCriteriaInvalid = kind === "issue" && showValidationErrors && !criteriaList.some((line) => line.replace(/^\s*\d+\.\s*/, "").trim());

      const updateCriteria = (index: number, nextValue: string) => {
        const draft = [...criteriaList];
        draft[index] = nextValue;
        updateField(field.id, draft.join("\n"));
      };

      const addCriteria = () => {
        const draft = [...criteriaList, ""];
        updateField(field.id, draft.join("\n"));
      };

      const removeCriteria = (index: number) => {
        const draft = criteriaList.filter((_, currentIndex) => currentIndex !== index);
        updateField(field.id, draft.length > 0 ? draft.join("\n") : "");
      };

      return (
        <div key={field.id} className={`grid h-full gap-2 content-start ${spanTwoColumns ? "xl:col-span-2" : ""} ${issueCriteriaInvalid ? "rounded-2xl border border-red-400/70 p-2" : ""}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white">{fieldLabel}{field.required ? " *" : ""}</span>
            {popover ? (
              <InfoPopover
                title={popover.title}
                align="right"
                triggerText={popover.useBddTrigger ? "BDD" : ""}
                triggerIconUrl={popover.useBddTrigger ? "https://cucumber.io/img/logo.svg" : undefined}
                triggerClassName={popover.useBddTrigger
                  ? "inline-flex items-center gap-1 text-[12px] font-semibold text-white transition hover:text-slate-200"
                  : "inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-[11px] font-semibold text-white transition hover:bg-white/10"}
                items={popover.items}
              />
            ) : null}
          </div>

          <div className="grid content-start gap-2">
            {criteriaList.map((criterion, index) => (
              <div key={`${field.id}-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={criterion}
                  placeholder={`Criterio ${index + 1}`}
                  onChange={(event) => updateCriteria(index, event.target.value)}
                  className={`input-base ${invalidClass}`}
                />
                <button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-50"
                >
                  -
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCriteria}
            className="inline-flex w-fit items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            + Adicionar criterio
          </button>
        </div>
      );
    }

    if (field.type === "media") {
      const uploadPanelClass = kind === "bug" ? "min-h-[196px]" : "";
      return (
        <div key={field.id} className={`grid gap-2 ${spanTwoColumns ? "xl:col-span-2" : ""} ${bugMediaInvalid ? "rounded-2xl border border-red-400/70 p-2" : ""}`}>
          <span className="text-sm font-semibold text-white">{fieldLabel}</span>
          <div className={`flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 ${uploadPanelClass}`}>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
              <label
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ background: activeButtonBackground }}
              >
                Escolher arquivos
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFiles}
                  className="sr-only"
                />
              </label>

              <div className="flex min-h-[44px] flex-1 flex-wrap gap-2">
                {attachments.length > 0 ? (
                  attachments.map((attachment, index) => (
                    <span
                      key={`${attachment.name}-${attachment.size}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                    >
                      <span className="max-w-[260px] truncate">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-bold text-slate-600 transition hover:border-red-300 hover:text-red-600"
                        aria-label={`Remover ${attachment.name}`}
                      >
                        X
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="self-center text-sm text-slate-300">Nenhum arquivo selecionado.</p>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-300">Selecione uma ou varias imagens e videos no mesmo envio.</p>
          </div>
        </div>
      );
    }

    if (field.type === "systemInfo") {
      return (
        <div key={field.id} className={`grid gap-2 ${spanTwoColumns ? "xl:col-span-2" : ""} ${bugSystemInfoInvalid ? "rounded-2xl border border-red-400/70 p-2" : ""}`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-white">{fieldLabel}</span>
            <button
              type="button"
              onClick={saveSystemInfo}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/15"
            >
              Save
            </button>
          </div>
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid items-start gap-2 xl:grid-cols-3">
              <div className="grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-950">Browsers</p>
                {config.browsers.map((option) => {
                  const checked = isSystemInfoSelected("browser", option.value);

                  return (
                    <div key={option.value} className="inline-grid w-32 grid-cols-[65px_54px] items-center justify-start gap-1 rounded-lg border border-slate-200 bg-white px-1 py-1 2xl:w-fit 2xl:grid-cols-[92px_56px]">
                      <button
                        type="button"
                        onClick={() => toggleSystemInfo("browser", option.value)}
                        className={`w-[65px] rounded-lg px-2 py-1 text-left text-[11px] font-semibold transition 2xl:w-auto ${
                          checked ? "text-white shadow-sm" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        }`}
                        style={checked ? { background: activeButtonBackground } : undefined}
                      >
                        {option.label}
                      </button>
                      {checked ? (
                        <input
                          type="text"
                          value={getSystemInfoVersion("browser", option.value)}
                          onChange={(event) => updateSystemInfoVersion("browser", option.value, event.target.value)}
                          placeholder="Versao"
                          maxLength={5}
                          className="input-inline w-[48px] flex-none px-1.5 py-1 text-[11px] 2xl:w-[56px]"
                        />
                      ) : <div className="h-[28px]" />}
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-950">Sistema</p>
                {config.desktopPlatforms.map((option) => {
                  const checked = isSystemInfoSelected("desktop", option.value);

                  return (
                    <div key={option.value} className="inline-grid w-[122px] grid-cols-[56px_54px] items-center justify-start gap-2 rounded-lg border border-slate-200 bg-white px-1 py-1 2xl:w-fit 2xl:grid-cols-[82px_56px]">
                      <button
                        type="button"
                        onClick={() => toggleSystemInfo("desktop", option.value)}
                        className={`w-[60px] rounded-lg px-2 py-1 text-left text-[11px] font-semibold transition 2xl:w-auto ${
                          checked ? "text-white shadow-sm" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        }`}
                        style={checked ? { background: activeButtonBackground } : undefined}
                      >
                        {option.label}
                      </button>
                      {checked ? (
                        <input
                          type="text"
                          value={getSystemInfoVersion("desktop", option.value)}
                          onChange={(event) => updateSystemInfoVersion("desktop", option.value, event.target.value)}
                          placeholder="Versao"
                          maxLength={5}
                          className="input-inline w-[48px] flex-none px-1.5 py-1 text-[11px] 2xl:w-[56px]"
                        />
                      ) : <div className="h-[28px]" />}
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-950">Mobile</p>
                {config.mobilePlatforms.map((option) => {
                  const checked = isSystemInfoSelected("mobile", option.value);
                  const detailValue = getSystemInfoDetail("mobile", option.value);

                  return (
                    <div key={option.value} className="w-32 rounded-lg border border-slate-200 bg-white px-1 py-1 xl:w-[128px] 2xl:w-fit">
                      <div className="grid grid-cols-[50px_54px] items-center justify-start gap-2 2xl:grid-cols-[82px_56px]">
                        <button
                          type="button"
                          onClick={() => toggleSystemInfo("mobile", option.value)}
                          className={`w-[54px] rounded-lg px-2 py-1 text-left text-[11px] font-semibold transition 2xl:w-auto ${
                            checked ? "text-white shadow-sm" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                          }`}
                          style={checked ? { background: activeButtonBackground } : undefined}
                        >
                          {option.label}
                        </button>
                        {checked ? (
                          <input
                            type="text"
                            value={getSystemInfoVersion("mobile", option.value)}
                            onChange={(event) => updateSystemInfoVersion("mobile", option.value, event.target.value)}
                            placeholder="Versao"
                            className="input-inline w-[48px] flex-none px-1.5 py-1 text-[11px] 2xl:w-[56px]"
                          />
                        ) : <div className="h-[28px]" />}
                      </div>
                      {checked ? (
                        <div className="mt-2 grid gap-1">
                          <input
                            type="text"
                            value={detailValue}
                            onChange={(event) => updateSystemInfoDetail("mobile", option.value, event.target.value)}
                            placeholder={option.value === "Android" ? "Aparelho" : "Modelo"}
                            className="input-inline w-[106px]"
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <label key={field.id} className={`grid h-full gap-2 content-start ${spanTwoColumns ? "xl:col-span-2" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white">
            {fieldLabel}
            {field.required ? " *" : ""}
          </span>
          {popover ? (
            <InfoPopover
              title={popover.title}
              align="right"
              triggerText={popover.useBddTrigger ? "BDD" : ""}
              triggerIconUrl={popover.useBddTrigger ? "https://cucumber.io/img/logo.svg" : undefined}
              triggerClassName={popover.useBddTrigger
                ? "inline-flex items-center gap-1 text-[12px] font-semibold text-white transition hover:text-slate-200"
                : "inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-[11px] font-semibold text-white transition hover:bg-white/10"}
              items={popover.items}
            />
          ) : null}
        </div>
        {field.type === "select" ? (
          <select
            required={field.required}
            value={value}
            onChange={(event) => updateField(field.id, event.target.value)}
            className={`input-base ${invalidClass}`}
          >
            <option value="" disabled={!field.required}>
              {field.required ? "Selecione..." : "Opcional"}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            required={field.required}
            rows={4}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateField(field.id, event.target.value)}
            className={`input-base min-h-[220px] h-full resize-y ${invalidClass}`}
          />
        ) : (
          <input
            required={field.required}
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateField(field.id, event.target.value)}
            className={`input-base ${invalidClass}`}
          />
        )}
      </label>
    );
  }

  const getField = (fieldId: string) => fields.find((field) => field.id === fieldId);
  const sendByField = getField("sendBy");
  const descriptionField = getField("description");
  const stepsField = getField("steps");
  const systemInfoField = getField("systemInfo");
  const mediaField = getField("media");
  const priorityField = getField("priority");
  const severityField = getField("severity");
  const activityField = getField("activity");
  const processPhaseField = getField("processPhase");
  const acceptanceCriteriaField = getField("acceptanceCriteria");
  const valueAreaField = getField("valueArea");

  return (
    <>
      {kind === "bug" ? (
        <>
          <div className="grid gap-2 xl:col-span-2 xl:grid-cols-5">
            {sendByField ? renderGenericField(sendByField, { label: "Enviado por" }) : null}
            {priorityField ? renderGenericField(priorityField) : null}
            {severityField ? renderGenericField(severityField) : null}
            {activityField ? renderGenericField(activityField, { label: "Activity" }) : null}
            {processPhaseField ? renderGenericField(processPhaseField) : null}
          </div>
          <div className="grid items-start gap-3 xl:col-span-2 xl:grid-cols-2">
            {descriptionField ? renderGenericField(descriptionField, { spanTwoColumns: false }) : null}
            {stepsField ? renderGenericField(stepsField, { spanTwoColumns: false }) : null}
          </div>
          {systemInfoField ? renderGenericField(systemInfoField) : null}
          {mediaField ? renderGenericField(mediaField) : null}
        </>
      ) : kind === "issue" ? (
        <>
          <div className="grid gap-2 xl:col-span-2 xl:grid-cols-3">
            {sendByField ? renderGenericField(sendByField, { label: "Enviado por" }) : null}
            {priorityField ? renderGenericField(priorityField) : null}
            {valueAreaField ? renderGenericField(valueAreaField) : null}
          </div>
          <div className="grid items-start gap-3 xl:col-span-2 xl:grid-cols-2">
            {descriptionField ? renderGenericField(descriptionField, {
              spanTwoColumns: false,
              popover: {
                title: "Padrao para Description",
                items: [
                  { text: "Contexto: colaboradores nao conseguem concluir o login em determinados cenarios." },
                  { text: "Problema: o sistema retorna a tela inicial sem feedback claro para o usuario." },
                  { text: "Impacto: aumento de retrabalho no suporte e atraso no fluxo operacional." },
                  { text: "Escopo: ajustar validacoes e mensagens apenas na etapa de autenticacao." },
                  { text: "Resultado esperado: login previsivel, com mensagem objetiva em caso de falha." }
                ]
              }
            }) : null}
            {acceptanceCriteriaField ? renderGenericField(acceptanceCriteriaField, {
              spanTwoColumns: false,
              popover: {
                title: "Padrao para Acceptance Criteria",
                useBddTrigger: true,
                items: [
                  { keyword: "Quando", text: "o usuario informar credenciais validas e confirmar o login" },
                  { keyword: "Então", text: "o sistema deve redirecionar para o Dashboard em ate 2 segundos" },
                  { keyword: "E", text: "o nome do usuario autenticado deve aparecer no cabecalho" },
                  { keyword: "Quando", text: "as credenciais estiverem invalidas" },
                  { keyword: "Então", text: "deve exibir mensagem clara sem limpar os campos preenchidos" }
                ]
              }
            }) : null}
          </div>
          {mediaField ? renderGenericField(mediaField) : null}
        </>
      ) : (
        <>
          {priorityField ? renderGenericField(priorityField) : null}
          {activityField ? renderGenericField(activityField, { label: "Activity" }) : null}
          {descriptionField ? renderGenericField(descriptionField) : null}
          {mediaField ? renderGenericField(mediaField) : null}
        </>
      )}
    </>
  );
}

export default WorkItemFields;








