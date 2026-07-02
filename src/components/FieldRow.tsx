"use client";

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
      className={`border border-gray-700 rounded-lg p-3 mb-2 bg-gray-900 ${
        depth > 0 ? "ml-4 border-l-2 border-l-blue-500" : ""
      }`}
    >
      {/* Top row — key name + type selector + remove */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Field name */}
        <input
          type="text"
          value={fieldKey}
          onChange={(e) => onRename(fieldKey, e.target.value)}
          placeholder="field name"
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 w-36 border border-gray-600 focus:outline-none focus:border-blue-500"
        />

        {/* Type selector */}
        <select
          value={field.type}
          onChange={(e) => handleTypeChange(e.target.value as FieldType)}
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
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
            className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
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
            className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
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
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
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
                className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
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
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 w-20 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </>
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(fieldKey)}
          className="ml-auto text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/30 transition"
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
          <p className="text-xs text-gray-400 mb-1">Array item structure:</p>
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