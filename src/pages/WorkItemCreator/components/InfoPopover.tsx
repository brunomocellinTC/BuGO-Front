import { useEffect, useRef, useState } from "react";

type InfoPopoverItem = {
  keyword?: string;
  text: string;
};

type InfoPopoverProps = {
  title: string;
  items: InfoPopoverItem[];
  triggerText?: string;
  triggerEmoji?: string;
  triggerIconUrl?: string;
  triggerClassName?: string;
  align?: "left" | "right";
};

function InfoPopover({
  title,
  items,
  triggerText = "Info",
  triggerEmoji,
  triggerIconUrl,
  triggerClassName,
  align = "left"
}: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const isQuestionOnlyTrigger = !triggerText && !triggerEmoji && !triggerIconUrl;

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (!popoverRef.current) {
        return;
      }

      if (!popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div ref={popoverRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={
          triggerClassName ??
          "inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white transition hover:bg-white/20"
        }
        aria-expanded={open}
      >
        {triggerIconUrl ? (
          <img src={triggerIconUrl} alt="BDD" className="h-4 w-4" />
        ) : null}
        {triggerText ? <span>{triggerText}</span> : null}
        {triggerEmoji ? <span aria-hidden="true">{triggerEmoji}</span> : null}
        {isQuestionOnlyTrigger ? (
          <span className="text-[11px] font-semibold">?</span>
        ) : (
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[10px]">?</span>
        )}
      </button>

      {open ? (
        <div className={`absolute top-8 z-20 w-[340px] rounded-2xl border border-white/15 bg-slate-950/95 p-3 shadow-xl backdrop-blur ${align === "right" ? "right-0" : "left-0"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{title}</p>
          <div className="mt-2 space-y-1 text-sm leading-6 text-slate-100">
            {items.map((item, index) => (
              <p key={`${item.keyword ?? "line"}-${index}`}>
                {item.keyword ? <strong>{item.keyword}</strong> : null}
                {item.keyword ? " " : ""}
                {item.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default InfoPopover;

