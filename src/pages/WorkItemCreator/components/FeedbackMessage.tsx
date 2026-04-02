import type { ReactNode } from "react";

type FeedbackMessageProps = {
  tone: "error" | "success";
  children: ReactNode;
};

function FeedbackMessage({ tone, children }: FeedbackMessageProps) {
  const className =
    tone === "error"
      ? "mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      : "mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800";

  return <div className={className}>{children}</div>;
}

export default FeedbackMessage;
