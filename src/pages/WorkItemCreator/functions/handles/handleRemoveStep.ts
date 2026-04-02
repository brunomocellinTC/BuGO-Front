import type { Dispatch, SetStateAction } from "react";

export function handleRemoveStep(
  index: number,
  setSteps: Dispatch<SetStateAction<string[]>>
) {
  setSteps((current) => {
    const next = current.filter((_, stepIndex) => stepIndex !== index);
    return next.length > 0 ? next : [""];
  });
}
