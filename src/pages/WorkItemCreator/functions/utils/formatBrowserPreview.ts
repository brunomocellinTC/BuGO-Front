import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function formatBrowserPreview(systemInfo: SystemInfoItem[]) {
  return systemInfo
    .filter((item) => item.category === "browser")
    .map((item) => {
      const icon =
        item.name === "Chrome"
          ? "\u{1F310}"
          : item.name === "Edge"
            ? "\u{1FA9F}"
            : item.name === "Firefox"
              ? "\u{1F98A}"
              : item.name === "Brave"
                ? "\u{1F981}"
                : item.name === "Opera GX"
                  ? "\u{2B55}"
                  : "\u{1F30D}";
      return `${icon} ${item.name}${item.version ? ` ${item.version}` : ""}`;
    })
    .join("\n");
}
