export function getBrowserIcon(name: string) {
  return name === "Chrome"
    ? ""
    : name === "Edge"
      ? "??"
      : name === "Firefox"
        ? "??"
        : name === "Brave"
          ? "??"
          : name === "Opera GX"
            ? "??"
            : "??";
}
