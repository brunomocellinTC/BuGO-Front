import { SystemInfoItem } from "../../types/workItemCreatorTypes";
import { SYSTEM_INFO_STORAGE_KEY } from "./systemInfoStorageKey";

export function loadStoredSystemInfo(): SystemInfoItem[] {
  try {
    const storedSystemInfo = window.localStorage.getItem(SYSTEM_INFO_STORAGE_KEY);

    if (!storedSystemInfo) {
      return [];
    }

    const parsed = JSON.parse(storedSystemInfo) as SystemInfoItem[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        (item.category === "browser" || item.category === "desktop" || item.category === "mobile") &&
        typeof item.name === "string" &&
        typeof item.version === "string" &&
        typeof item.detail === "string"
    );
  } catch {
    return [];
  }
}
