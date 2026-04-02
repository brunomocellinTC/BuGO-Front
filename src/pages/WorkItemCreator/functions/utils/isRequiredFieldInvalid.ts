export function isRequiredFieldInvalid(value: string | undefined, required?: boolean, showValidationErrors?: boolean) {
  if (!required || !showValidationErrors) {
    return false;
  }

  return !value?.trim();
}
