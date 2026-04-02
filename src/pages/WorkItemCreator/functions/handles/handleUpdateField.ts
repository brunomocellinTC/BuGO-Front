import type { Dispatch, MutableRefObject, SetStateAction } from "react";

export function handleUpdateField(
  fieldId: string,
  value: string,
  setFormValues: Dispatch<SetStateAction<Record<string, string>>>
) {
  setFormValues((current) => ({
    ...current,
    [fieldId]: value
  }));
}
