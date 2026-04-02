import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function formatMobilePreview(systemInfo: SystemInfoItem[]) {
  return systemInfo
    .filter((item) => item.category === "mobile")
    .map((item) => {
      const icon = item.name === "Android" ? "\u{1F916}" : "\u{1F4F1}";
      const suffix = [item.version, item.detail].filter(Boolean).join(" / ");
      return `${icon} ${item.name}${suffix ? ` ${suffix}` : ""}`;
    })
    .join("\n");
}
