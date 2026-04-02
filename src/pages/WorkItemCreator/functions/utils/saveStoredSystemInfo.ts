import { SystemInfoItem } from "../../types/workItemCreatorTypes";
import { SYSTEM_INFO_STORAGE_KEY } from "./systemInfoStorageKey";

export function saveStoredSystemInfo(systemInfo: SystemInfoItem[]) {
  window.localStorage.setItem(SYSTEM_INFO_STORAGE_KEY, JSON.stringify(systemInfo));
}
