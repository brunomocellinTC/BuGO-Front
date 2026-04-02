import { parseTitleTags } from "./parseTitleTags";

export function buildFullTitle(titleTag: string, titleText: string) {
  const parsedTags = parseTitleTags(titleTag);
  const titlePrefix = parsedTags.map((tag) => `[${tag}]`).join("");

  if (!titleText) {
    return "";
  }

  return `${titlePrefix ? `${titlePrefix} ` : ""}${titleText}`;
}
