"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FakerOption } from "@/lib/fakerOptions";

interface SearchableSelectProps {
  options: FakerOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select faker type",
  className = "",
}: SearchableSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setHighlightIndex(0);
      requestAnimationFrame(() => searchRef.current?.focus());
    } else {
      setQuery("");
      setHighlightIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setHighlightIndex((i) =>
      filtered.length === 0 ? 0 : Math.min(i, filtered.length - 1)
    );
  }, [filtered.length]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((i) =>
          filtered.length === 0 ? 0 : (i + 1) % filtered.length
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((i) =>
          filtered.length === 0
            ? 0
            : (i - 1 + filtered.length) % filtered.length
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIndex]) {
          selectOption(filtered[highlightIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full min-w-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`w-full min-w-0 text-left bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 border border-green-300 focus:outline-none focus:border-green-500 flex items-center justify-between gap-2 ${
          value ? "" : "text-green-600"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="shrink-0 text-green-600 text-xs" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full bg-white border border-green-300 rounded-lg shadow-lg overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="p-2 border-b border-green-200">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full bg-green-50 text-green-900 text-sm rounded px-2 py-2 border border-green-200 focus:outline-none focus:border-green-500"
              autoComplete="off"
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            className="max-h-52 overflow-y-auto py-1"
          >
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ""}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption("")}
                className={`w-full text-left px-3 py-2 text-sm ${
                  value === ""
                    ? "bg-green-100 text-green-900"
                    : "text-green-700 hover:bg-green-50"
                }`}
              >
                {placeholder}
              </button>
            </li>

            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-green-600 text-center">
                No matches
              </li>
            ) : (
              filtered.map((option, index) => (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHighlightIndex(index)}
                    className={`w-full text-left px-3 py-2 text-sm truncate ${
                      value === option.value
                        ? "bg-green-100 text-green-900 font-medium"
                        : highlightIndex === index
                          ? "bg-green-50 text-green-900"
                          : "text-green-800 hover:bg-green-50"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
