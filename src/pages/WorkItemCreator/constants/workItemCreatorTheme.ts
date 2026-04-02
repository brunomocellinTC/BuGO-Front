import { WorkItemKind } from "../types/workItemCreatorTypes";

export const themeMap: Record<WorkItemKind, { shell: string; glow: string; badge: string; button: string }> = {
  bug: {
    shell: "theme-bug",
    glow: "from-rose-500/30 via-red-500/10 to-transparent",
    badge: "border-red-300 bg-red-500/15 text-red-50",
    button: "linear-gradient(135deg, #c62828, #ef4444)"
  },
  issue: {
    shell: "theme-improvement",
    glow: "from-sky-500/30 via-blue-500/10 to-transparent",
    badge: "border-sky-300 bg-sky-500/15 text-sky-50",
    button: "linear-gradient(135deg, #0078d4, #38bdf8)"
  },
  task: {
    shell: "theme-task",
    glow: "from-yellow-400/30 via-amber-300/10 to-transparent",
    badge: "border-amber-200 bg-amber-400/15 text-amber-50",
    button: "linear-gradient(135deg, #f59e0b, #facc15)"
  }
};
