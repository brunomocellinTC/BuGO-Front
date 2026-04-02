export type WorkItemKind = "bug" | "issue" | "task";

export type Option = {
  value: string;
  label: string;
};

export type FormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "steps" | "media" | "systemInfo";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: Option[];
};

export type FormConfigResponse = {
  title: string;
  description: string;
  basePath: string;
  kinds: Array<{
    id: WorkItemKind;
    label: string;
    accent: string;
    workItemType: string;
  }>;
  titleTags: Option[];
  people: Option[];
  browsers: Option[];
  desktopPlatforms: Option[];
  mobilePlatforms: Option[];
  bugFields: FormField[];
  issueFields: FormField[];
  taskFields: FormField[];
  defaults: Record<string, string>;
};

export type AzureEpic = {
  id: number;
  title: string;
  state: string;
  features: Array<{
    id: number;
    title: string;
    workItemType: string;
    state: string;
    children: Array<{
      id: number;
      title: string;
      workItemType: string;
      state: string;
    }>;
  }>;
};

export type AzureSyncResponse = {
  workItemTypes: Array<{
    name: string;
    referenceName?: string;
    color?: string;
  }>;
  epics: AzureEpic[];
  relationTypes: Array<{
    referenceName: string;
    name: string;
  }>;
};

export type ParentSummary = {
  id: number;
  title: string;
  workItemType: string;
  state: string;
  parentId?: number;
};

export type ErrorResponse = {
  error?: string;
};

export type SubmitResponse = {
  id: number;
  url: string;
};

export type AttachmentDraft = {
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
};

export type SystemInfoItem = {
  category: "browser" | "desktop" | "mobile";
  name: string;
  detail: string;
  version: string;
};
