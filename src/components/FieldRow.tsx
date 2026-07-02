"use client";

import { useEffect, useState } from "react";
import { SchemaField, FieldType } from "@/types/schema";
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
  const [draftFieldKey, setDraftFieldKey] = useState(fieldKey);

  useEffect(() => {
    setDraftFieldKey(fieldKey);
  }, [fieldKey]);

  const commitRename = () => {
    const nextKey = draftFieldKey.trim();
    if (!nextKey) {
      setDraftFieldKey(fieldKey);
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

  return (
    <div
      className={`border border-green-200 rounded-lg p-3 mb-2 bg-white ${
        depth > 0 ? "ml-4 border-l-2 border-l-green-500" : ""
      }`}
    >
      {/* Top row — key name + type selector + remove */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Field name */}
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
          placeholder="field name"
          className="bg-white text-green-900 text-sm rounded px-2 py-1 w-36 border border-green-300 focus:outline-none focus:border-green-500"
        />

        {/* Type selector */}
        <select
          value={field.type}
          onChange={(e) => handleTypeChange(e.target.value as FieldType)}
          className="bg-white text-green-900 text-sm rounded px-2 py-1 border border-green-300 focus:outline-none focus:border-green-500"
        >
          {fieldTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Faker type for strings */}
        {field.type === "string" && (
          <select
            value={(field as any).fakerType ?? ""}
            onChange={(e) => handleFakerTypeChange(e.target.value)}
            className="bg-white text-green-900 text-sm rounded px-2 py-1 border border-green-300 focus:outline-none focus:border-green-500"
          >
            <option value="">-- select faker type --</option>
            {stringFakerOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}

        {/* Faker type for numbers */}
        {field.type === "number" && (
          <select
            value={(field as any).fakerType ?? ""}
            onChange={(e) => handleFakerTypeChange(e.target.value)}
            className="bg-white text-green-900 text-sm rounded px-2 py-1 border border-green-300 focus:outline-none focus:border-green-500"
          >
            <option value="">-- select faker type --</option>
            {numberFakerOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}

        {/* Array controls */}
        {field.type === "array" && (
          <>
            <select
              value={(field as any).itemType ?? "string"}
              onChange={(e) => handleArrayItemTypeChange(e.target.value)}
              className="bg-white text-green-900 text-sm rounded px-2 py-1 border border-green-300 focus:outline-none focus:border-green-500"
            >
              {arrayItemTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Array string faker */}
            {(field as any).itemType === "string" && (
              <select
                value={(field as any).fakerType ?? ""}
                onChange={(e) => handleFakerTypeChange(e.target.value)}
                className="bg-white text-green-900 text-sm rounded px-2 py-1 border border-green-300 focus:outline-none focus:border-green-500"
              >
                <option value="">-- select faker type --</option>
                {stringFakerOptions.map((o) => (
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
              className="bg-white text-green-900 text-sm rounded px-2 py-1 w-20 border border-green-300 focus:outline-none focus:border-green-500"
            />
          </>
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(fieldKey)}
          className="ml-auto text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition"
        >
          ✕ Remove
        </button>
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