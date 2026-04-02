import type { Dispatch, SetStateAction } from "react";
import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function handleToggleSystemInfo(
  category: "browser" | "desktop" | "mobile",
  name: string,
  setSystemInfo: Dispatch<SetStateAction<SystemInfoItem[]>>
) {
  setSystemInfo((current) => {
    const exists = current.some((item) => item.category === category && item.name === name);

    if (exists) {
      return current.filter((item) => !(item.category === category && item.name === name));
    }

    return [...current, { category, name, version: "", detail: "" }];
  });
}
