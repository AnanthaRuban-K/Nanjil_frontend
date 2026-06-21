"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white shadow-xl sm:mx-4 sm:max-w-md sm:rounded-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold text-[#12355B] sm:text-lg">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
