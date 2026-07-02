"use client";

import { useEffect, useState } from "react";
import { SchemaField, FieldType, isUnnamedFieldKey } from "@/types/schema";
import {
  stringFakerOptions,
  numberFakerOptions,
  arrayItemTypes,
} from "@/lib/fakerOptions";
import SchemaBuilder from "./SchemaBuilder";

interface FieldRowProps {
  fieldKey: string;
  field: SchemaField;
  onUpdate: (key: string, updated: SchemaField) => void;
  onRemove: (key: string) => void;
  onRename: (oldKey: string, newKey: string) => void;
  depth?: number;
}

const fieldTypes: { label: string; value: FieldType }[] = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Object", value: "object" },
  { label: "Array", value: "array" },
];

export default function FieldRow({
  fieldKey,
  field,
  onUpdate,
  onRemove,
  onRename,
  depth = 0,
}: FieldRowProps) {
  const [draftFieldKey, setDraftFieldKey] = useState(() =>
    isUnnamedFieldKey(fieldKey) ? "" : fieldKey
  );

  useEffect(() => {
    setDraftFieldKey(isUnnamedFieldKey(fieldKey) ? "" : fieldKey);
  }, [fieldKey]);

  const commitRename = () => {
    const nextKey = draftFieldKey.trim();
    if (!nextKey) {
      setDraftFieldKey(isUnnamedFieldKey(fieldKey) ? "" : fieldKey);
      return;
    }
    if (nextKey !== fieldKey) {
      onRename(fieldKey, nextKey);
    }
  };

  const handleTypeChange = (newType: FieldType) => {
    if (newType === "object") {
      onUpdate(fieldKey, { type: "object", fields: {} });
    } else if (newType === "array") {
      onUpdate(fieldKey, { type: "array", itemType: "string" });
    } else {
      onUpdate(fieldKey, { type: newType });
    }
  };

  const handleFakerTypeChange = (fakerType: string) => {
    onUpdate(fieldKey, { ...field, fakerType } as any);
  };

  const handleArrayItemTypeChange = (itemType: string) => {
    if (itemType === "object") {
      onUpdate(fieldKey, { type: "array", itemType: "object", fields: {} });
    } else {
      onUpdate(fieldKey, {
        type: "array",
        itemType: itemType as any,
        fakerType: undefined,
        fields: undefined,
      });
    }
  };

  const handleArrayCountChange = (count: number) => {
    onUpdate(fieldKey, { ...field, count } as any);
  };

  const handleNestedUpdate = (
    nestedFields: Record<string, SchemaField>
  ) => {
    onUpdate(fieldKey, { ...field, fields: nestedFields } as any);
  };

  const inputClass =
    "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500";

  const selectClass =
    "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500 appearance-none";

  return (
    <div
      className={`relative z-10 w-full max-w-full border border-green-200 rounded-lg p-3 mb-2 bg-white ${
        depth > 0 ? "sm:ml-4 border-l-2 border-l-green-500" : ""
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draftFieldKey}
            onChange={(e) => setDraftFieldKey(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitRename();
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Type field key"
            className={`${inputClass} flex-1`}
          />

          <button
            type="button"
            onClick={() => onRemove(fieldKey)}
            className="shrink-0 text-red-600 hover:text-red-700 active:text-red-800 text-sm px-3 py-2 min-h-[44px] rounded hover:bg-red-50 active:bg-red-100 transition"
          >
            ✕ Remove
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={field.type}
            onChange={(e) => handleTypeChange(e.target.value as FieldType)}
            className={selectClass}
          >
            {fieldTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {field.type === "string" && (
            <select
              value={(field as any).fakerType ?? ""}
              onChange={(e) => handleFakerTypeChange(e.target.value)}
              className={selectClass}
            >
              <option value="">-- select faker type --</option>
              {stringFakerOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "number" && (
            <select
              value={(field as any).fakerType ?? ""}
              onChange={(e) => handleFakerTypeChange(e.target.value)}
              className={selectClass}
            >
              <option value="">-- select faker type --</option>
              {numberFakerOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "array" && (
            <>
              <select
                value={(field as any).itemType ?? "string"}
                onChange={(e) => handleArrayItemTypeChange(e.target.value)}
                className={selectClass}
              >
                {arrayItemTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              {(field as any).itemType === "string" && (
                <select
                  value={(field as any).fakerType ?? ""}
                  onChange={(e) => handleFakerTypeChange(e.target.value)}
                  className={selectClass}
                >
                  <option value="">-- select faker type --</option>
                  {stringFakerOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}

              {(field as any).itemType === "number" && (
                <select
                  value={(field as any).fakerType ?? ""}
                  onChange={(e) => handleFakerTypeChange(e.target.value)}
                  className={selectClass}
                >
                  <option value="">-- select faker type --</option>
                  {numberFakerOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="number"
                min={1}
                max={20}
                placeholder="count"
                value={(field as any).count ?? ""}
                onChange={(e) =>
                  handleArrayCountChange(Number(e.target.value))
                }
                className={inputClass}
              />
            </>
          )}
        </div>
      </div>

      {/* Nested object fields */}
      {field.type === "object" && (
        <div className="mt-3">
          <SchemaBuilder
            schema={(field as any).fields ?? {}}
            onChange={handleNestedUpdate}
            depth={depth + 1}
          />
        </div>
      )}

      {/* Nested array object fields */}
      {field.type === "array" && (field as any).itemType === "object" && (
        <div className="mt-3">
          <p className="text-xs text-green-700 mb-1">Array item structure:</p>
          <SchemaBuilder
            schema={(field as any).fields ?? {}}
            onChange={handleNestedUpdate}
            depth={depth + 1}
          />
        </div>
      )}
    </div>
  );
}