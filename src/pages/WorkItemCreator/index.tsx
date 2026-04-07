import FeedbackMessage from "./components/FeedbackMessage";
import HierarchySection from "./components/HierarchySection";
import TypeSelectorSidebar from "./components/TypeSelectorSidebar";
import WorkItemFields from "./components/WorkItemFields";
import { themeMap } from "./constants/workItemCreatorTheme";
import { workItemCreatorController } from "./core/workItemCreatorController";
import { workItemCreatorHandler } from "./core/workItemCreatorHandler";
import { isRequiredFieldInvalid } from "./functions/utils/isRequiredFieldInvalid";

function WorkItemCreatorPage() {
  const { state } = workItemCreatorController();
  const handlers = workItemCreatorHandler(state);

  if (!state.config || state.isSyncing) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 lg:px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Loading Azure form...</p>
        </div>
      </main>
    );
  }

  const activeTheme = themeMap[state.kind];
  const isFieldInvalid = (fieldId: string, required?: boolean) =>
    isRequiredFieldInvalid(state.formValues[fieldId], required, state.showValidationErrors);

  return (
    <main className={`min-h-screen ${activeTheme.shell}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeTheme.glow}`} />

      <div className="relative mx-auto flex min-h-screen max-w-[1640px] flex-col px-3 py-3 lg:px-4 lg:py-4">
        <section className="grid gap-3 xl:min-h-[calc(100vh-1.5rem)] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(0,1fr)]">
          <TypeSelectorSidebar
            config={state.config}
            kind={state.kind}
            titleTag={state.formValues.titleTag ?? ""}
            titleText={state.formValues.titleText ?? ""}
            description={state.formValues.description ?? ""}
            acceptanceCriteria={state.formValues.acceptanceCriteria}
            priority={state.formValues.priority}
            valueArea={state.formValues.valueArea}
            activity={state.formValues.activity}
            requesterName={state.formValues.requesterName}
            steps={state.steps}
            systemInfo={state.systemInfo}
            attachments={state.attachments}
            onSelectKind={state.setKind}
          />

          <section className="rounded-[24px] border border-white/10 bg-slate-950/78 p-4 shadow-panel backdrop-blur xl:max-h-[calc(100vh-1.5rem)] xl:overflow-y-auto">
            <form className="grid gap-3 xl:grid-cols-2" onSubmit={handlers.handleSubmit}>
              <HierarchySection
                kind={state.kind}
                syncData={state.syncData}
                selectedEpic={state.selectedEpic}
                parentOptions={state.parentOptions}
                values={state.formValues}
                onEpicChange={handlers.updateEpic}
                onFeatureChange={handlers.updateFeature}
                onParentChange={handlers.updateParent}
                onFieldChange={handlers.updateField}
                isFieldInvalid={isFieldInvalid}
              />

              <WorkItemFields
                kind={state.kind}
                fields={state.fields}
                config={state.config}
                formValues={state.formValues}
                steps={state.steps}
                attachments={state.attachments}
                activeButtonBackground={activeTheme.button}
                stepInputRefs={state.stepInputRefs}
                isFieldInvalid={isFieldInvalid}
                updateField={handlers.updateField}
                updateStep={handlers.updateStep}
                addStep={handlers.addStep}
                removeStep={handlers.removeStep}
                handleFiles={handlers.handleFiles}
                removeAttachment={handlers.removeAttachment}
                toggleSystemInfo={handlers.toggleSystemInfo}
                updateSystemInfoVersion={handlers.updateSystemInfoVersion}
                updateSystemInfoDetail={handlers.updateSystemInfoDetail}
                isSystemInfoSelected={handlers.isSystemInfoSelected}
                getSystemInfoVersion={handlers.getSystemInfoVersion}
                getSystemInfoDetail={handlers.getSystemInfoDetail}
                saveSystemInfo={handlers.saveSystemInfo}
                showValidationErrors={state.showValidationErrors}
                systemInfo={state.systemInfo}
              />

              <button
                type="submit"
                disabled={state.isSubmitting}
                className="mt-2 inline-flex items-center justify-center rounded-2xl border-2 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 xl:col-span-2"
                style={{ background: activeTheme.button, borderColor: "transparent" }}
                onMouseEnter={(event) => {
                  if (state.isSubmitting) return;
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.borderColor = state.kind === "bug" ? "#ef4444" : state.kind === "issue" ? "#38bdf8" : "#facc15";
                  event.currentTarget.style.color = state.kind === "bug" ? "#fca5a5" : state.kind === "issue" ? "#7dd3fc" : "#fde047";
                }}
                onMouseLeave={(event) => {
                  if (state.isSubmitting) return;
                  event.currentTarget.style.background = activeTheme.button;
                  event.currentTarget.style.borderColor = "transparent";
                  event.currentTarget.style.color = "#ffffff";
                }}
              >
                {state.isSubmitting ? "Creating..." : `Create ${state.kind === "issue" ? "PBI" : state.kind === "bug" ? "bug" : "task"}`}
              </button>
            </form>

            {state.error ? <FeedbackMessage tone="error">{state.error}</FeedbackMessage> : null}

            {state.result ? (
              <FeedbackMessage tone="success">
                {state.result.id === 0 ? (
                  <span>Validacao local concluida. Nenhum card foi enviado ao Azure.</span>
                ) : (
                  <>
                    Work item criado com ID <strong>{state.result.id}</strong>.
                    <a className="ml-2 underline" href={state.result.url} target="_blank" rel="noreferrer">
                      Abrir no Azure
                    </a>
                  </>
                )}
              </FeedbackMessage>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}

export default WorkItemCreatorPage;





