import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function formatOsPreview(systemInfo: SystemInfoItem[]) {
  return systemInfo
    .filter((item) => item.category === "desktop")
    .map((item) => {
      const icon = item.name === "Windows" ? "\u{1FA9F}" : item.name === "Mac" ? "\u{1F34E}" : "\u{1F427}";
      return `${icon} ${item.name}${item.version ? ` ${item.version}` : ""}`;
    })
    .join("\n");
}
