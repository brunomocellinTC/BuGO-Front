import type { Dispatch, SetStateAction } from "react";
import { SystemInfoItem } from "../../types/workItemCreatorTypes";

export function handleUpdateSystemInfoDetail(
  category: "browser" | "desktop" | "mobile",
  name: string,
  detail: string,
  setSystemInfo: Dispatch<SetStateAction<SystemInfoItem[]>>
) {
  setSystemInfo((current) =>
    current.map((item) =>
      item.category === category && item.name === name
        ? {
            ...item,
            detail
          }
        : item
    )
  );
}
