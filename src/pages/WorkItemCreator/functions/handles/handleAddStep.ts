import type { Dispatch, MutableRefObject, SetStateAction } from "react";

export function handleAddStep(
  setSteps: Dispatch<SetStateAction<string[]>>,
  stepInputRefs: MutableRefObject<Array<HTMLInputElement | null>>
) {
  setSteps((current) => {
    const next = [...current, ""];

    window.setTimeout(() => {
      stepInputRefs.current[next.length - 1]?.focus();
    }, 0);

    return next;
  });
}
