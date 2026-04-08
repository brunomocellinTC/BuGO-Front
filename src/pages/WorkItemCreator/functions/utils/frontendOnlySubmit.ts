const rawFlag = (import.meta.env.VITE_FRONTEND_ONLY_SUBMIT ?? "false").trim().toLowerCase();

export const FRONTEND_ONLY_SUBMIT = rawFlag === "true" || rawFlag === "1" || rawFlag === "yes";
