import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function formatBrowserPreview(systemInfo: SystemInfoItem[]) {
  return systemInfo
    .filter((item) => item.category === "browser")
    .map((item) => {
      const icon =
        item.name === "Chrome"
          ? "🌐"
          : item.name === "Edge"
            ? "🧭"
            : item.name === "Firefox"
              ? "🦊"
              : item.name === "Brave"
                ? "🦁"
                : item.name === "Opera GX"
                  ? "⭕"
                  : "🌍";
      return `${icon} ${item.name}${item.version ? ` ${item.version}` : ""}`;
    })
    .join("\n");
}
