"use client";

import { useEffect, useState } from "react";
import { SchemaField, FieldType, isUnnamedFieldKey, UNNAMED_FIELD_PREFIX } from "@/types/schema";
import {
  stringFakerOptions,
  numberFakerOptions,
} from "@/lib/fakerOptions";
import SchemaBuilder from "./SchemaBuilder";
import SearchableSelect from "./SearchableSelect";
import ArrayItemEditor from "./ArrayItemEditor";
import TupleItemEditor from "./TupleItemEditor";

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
  { label: "Tuple", value: "tuple" },
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
      onUpdate(fieldKey, { type: "array", itemType: "object", fields: {} });
    } else if (newType === "tuple") {
      onUpdate(fieldKey, { type: "tuple", tupleItems: [{ type: "string" }] });
    } else {
      onUpdate(fieldKey, { type: newType });
    }
  };

  const handleFakerTypeChange = (fakerType: string) => {
    onUpdate(fieldKey, { ...field, fakerType } as SchemaField);
  };

  const handleNestedUpdate = (nestedFields: Record<string, SchemaField>) => {
    onUpdate(fieldKey, { ...field, fields: nestedFields } as SchemaField);
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
            Remove
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
            <SearchableSelect
              options={stringFakerOptions}
              value={field.fakerType ?? ""}
              onChange={handleFakerTypeChange}
            />
          )}

          {field.type === "number" && (
            <SearchableSelect
              options={numberFakerOptions}
              value={field.fakerType ?? ""}
              onChange={handleFakerTypeChange}
            />
          )}
        </div>
      </div>

      {field.type === "object" && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs text-green-700 font-medium">Nested object fields:</p>
            <button
              type="button"
              onClick={() => {
                const key = `${UNNAMED_FIELD_PREFIX}${Date.now()}`;
                handleNestedUpdate({
                  ...(field.fields ?? {}),
                  [key]: { type: "string" },
                });
              }}
              className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-1.5 transition shrink-0"
            >
              + Add Field
            </button>
          </div>
          <SchemaBuilder
            schema={field.fields ?? {}}
            onChange={handleNestedUpdate}
            depth={depth + 1}
          />
        </div>
      )}

      {field.type === "array" && (
        <div className="mt-3">
          <ArrayItemEditor
            config={field}
            onChange={(config) =>
              onUpdate(fieldKey, { type: "array", ...config })
            }
            depth={depth}
            label="Array items:"
          />
        </div>
      )}

      {field.type === "tuple" && (
        <div className="mt-3">
          <TupleItemEditor
            items={field.tupleItems}
            onChange={(tupleItems) =>
              onUpdate(fieldKey, { type: "tuple", tupleItems })
            }
            depth={depth}
            label="Tuple positions (each index has its own type):"
          />
        </div>
      )}
    </div>
  );
}
