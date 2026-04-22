import { AzureEpic, Option, WorkItemKind } from "../types/workItemCreatorTypes";

function getAreaDisplayLabel(area: Option) {
  const fallback = area.value.split("\\").pop() || area.value;
  const label = (area.label || "").trim();

  if (!label) {
    return fallback;
  }

  const fromLabel = label.split("\\").pop()?.trim() || label;
  return fromLabel;
}

type HierarchySectionProps = {
  kind: WorkItemKind;
  syncData: { epics: AzureEpic[] } | null;
  selectedEpic?: AzureEpic;
  areaOptions: Option[];
  parentOptions: Array<{
    id: number;
    title: string;
    workItemType: string;
  }>;
  values: {
    epicId?: string;
    featureId?: string;
    parentId?: string;
    areaPath?: string;
    titleTag?: string;
    titleText?: string;
  };
  onEpicChange: (epicId: string) => Promise<void>;
  onFeatureChange: (featureId: string) => Promise<void>;
  onParentChange: (parentId: string) => Promise<void>;
  onFieldChange: (fieldId: string, value: string) => void;
  isFieldInvalid: (fieldId: string, required?: boolean) => boolean;
};

function HierarchySection({
  kind,
  syncData,
  selectedEpic,
  areaOptions,
  parentOptions,
  values,
  onEpicChange,
  onFeatureChange,
  onParentChange,
  onFieldChange,
  isFieldInvalid
}: HierarchySectionProps) {
  return (
    <>
      <div className={`xl:col-span-2 grid gap-2 ${kind === "task" ? "xl:grid-cols-3" : "xl:grid-cols-2"}`}>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Epic</span>
          <select
            data-field-id="epicId"
            value={values.epicId ?? ""}
            onChange={(event) => void onEpicChange(event.target.value)}
            className={`input-base ${isFieldInvalid("epicId", true) ? "border-red-400 bg-red-50 text-red-950 focus:border-red-500 focus:ring-red-100" : ""}`}
          >
            {syncData?.epics.map((epic) => {
              const epicEmoji = "\uD83D\uDC51";

              return (
                <option key={epic.id} value={epic.id}>
                  {epicEmoji} {epic.title}
                </option>
              );
            })}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Feature</span>
          <select
            data-field-id="featureId"
            value={values.featureId ?? ""}
            onChange={(event) => void onFeatureChange(event.target.value)}
            className={`input-base ${isFieldInvalid("featureId", true) ? "border-red-400 bg-red-50 text-red-950 focus:border-red-500 focus:ring-red-100" : ""}`}
          >
            {selectedEpic?.features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {"\uD83C\uDFC6"} {feature.title}
              </option>
            ))}
          </select>
        </label>

        {kind === "task" ? (
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white">Parent item</span>
            <select
              data-field-id="parentId"
              value={values.parentId ?? ""}
              onChange={(event) => void onParentChange(event.target.value)}
              className={`input-base ${isFieldInvalid("parentId", true) ? "border-red-400 bg-red-50 text-red-950 focus:border-red-500 focus:ring-red-100" : ""}`}
            >
              {parentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} [{item.workItemType}] {item.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="xl:col-span-2 grid gap-2 xl:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Area</span>
          <select
            data-field-id="areaPath"
            value={values.areaPath ?? ""}
            onChange={(event) => {
              console.log("[BuGO][AreaSelect] selectedAreaPath:", event.target.value);
              onFieldChange("areaPath", event.target.value);
            }}
            className={`input-base ${isFieldInvalid("areaPath", true) ? "border-red-400 bg-red-50 text-red-950 focus:border-red-500 focus:ring-red-100" : ""}`}
          >
            {areaOptions.map((area) => (
              <option key={area.value} value={area.value}>
                {getAreaDisplayLabel(area)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Tag</span>
          <input
            data-field-id="titleTag"
            value={values.titleTag ?? ""}
            placeholder="Grafia, Android, Home"
            onChange={(event) => onFieldChange("titleTag", event.target.value)}
            className={`input-base ${isFieldInvalid("titleTag", true) ? "border-red-400 bg-red-50 text-red-950 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white">Titulo</span>
          <input
            data-field-id="titleText"
            type="text"
            value={values.titleText ?? ""}
            placeholder="Titulo mais detalhado do card"
            onChange={(event) => onFieldChange("titleText", event.target.value)}
            className={`input-base ${isFieldInvalid("titleText", true) ? "border-red-400 bg-red-50 text-red-950 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
          />
        </label>
      </div>
    </>
  );
}

export default HierarchySection;

