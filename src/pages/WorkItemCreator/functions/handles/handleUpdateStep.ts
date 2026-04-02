import type { Dispatch, SetStateAction } from "react";

export function handleUpdateStep(
  index: number,
  value: string,
  setSteps: Dispatch<SetStateAction<string[]>>
) {
  setSteps((current) => current.map((step, stepIndex) => (stepIndex === index ? value : step)));
}
