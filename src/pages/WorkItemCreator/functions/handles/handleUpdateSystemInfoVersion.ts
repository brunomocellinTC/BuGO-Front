import type { Dispatch, SetStateAction } from "react";
import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function handleUpdateSystemInfoVersion(
  category: "browser" | "desktop" | "mobile",
  name: string,
  version: string,
  setSystemInfo: Dispatch<SetStateAction<SystemInfoItem[]>>
) {
  setSystemInfo((current) =>
    current.map((item) =>
      item.category === category && item.name === name
        ? {
            ...item,
            version
          }
        : item
    )
  );
}
