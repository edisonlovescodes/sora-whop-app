"use client";

import { useState, useEffect, useCallback } from "react";

type EmbeddedCheckoutProps = {
  url?: string | null; // Hosted Whop checkout URL
  label?: string;
};

export default function EmbeddedCheckout({ url, label = "Upgrade Now" }: EmbeddedCheckoutProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    if (!url) return;
    // Many providers (including Whop checkout) deny iframe embedding.
    // For whop.com, open a centered popup window for an in-app feeling.
    if (/^https?:\/\/([^.]+\.)?whop\.com\/.+/i.test(url)) {
      const w = 520;
      const h = 760;
      const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
      const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
      const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
      const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
      const left = Math.max(0, (width - w) / 2 + dualScreenLeft);
      const top = Math.max(0, (height - h) / 2 + dualScreenTop);
      const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h},top=${top},left=${left}`;
      const win = window.open(url, "whopCheckout", features);
      if (!win) {
        // If blocked, fall back to top navigation
        window.location.href = url;
      }
      return;
    }
    // Otherwise try to embed in a modal iframe
    setOpen(true);
  }, [url]);

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={!url}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#FA4616] px-4 py-2 text-sm font-semibold text-[#141212] hover:opacity-90 disabled:opacity-50"
      >
        {label}
      </button>

      {open && url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          {/* Modal */}
          <div className="relative z-10 w-[95vw] max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#141212] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[#FCF6F5]">
              <div className="text-sm font-semibold">Checkout</div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="h-[70vh] w-full bg-black">
              {/* If we got here, we render an iframe. Some providers may still block. */}
              <iframe
                src={url}
                className="h-full w-full"
                title="Checkout"
                allow="payment *; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
