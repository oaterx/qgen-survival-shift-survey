"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ value, options, placeholder = "เลือก...", onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between px-4 rounded-[10px] border bg-qgen-paper-alt",
          "font-ui cursor-pointer transition-colors duration-150 text-left",
          "focus:outline-none focus:ring-2 focus:ring-qgen-signal/30 focus:border-qgen-signal",
          selected
            ? "text-qgen-black-soft border-qgen-gray-ash/60"
            : "text-qgen-gray-ash border-qgen-gray-border",
        ].join(" ")}
        style={{ height: 46, fontSize: 13 }}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          width="13" height="13" viewBox="0 0 14 14" fill="none"
          className={`shrink-0 ml-2 text-qgen-gray-ash transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-20 rounded-[10px] border border-qgen-gray-border bg-qgen-paper-alt
            shadow-[0_12px_32px_rgba(10,10,10,0.12)] overflow-y-auto"
          style={{ maxHeight: 240 }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={[
                "w-full text-left px-4 py-2.5 font-ui transition-colors duration-100",
                opt.value === value
                  ? "bg-qgen-signal-soft text-qgen-signal-deep font-semibold"
                  : "text-qgen-black-soft hover:bg-qgen-paper-wash",
              ].join(" ")}
              style={{ fontSize: 13 }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
