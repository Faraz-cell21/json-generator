"use client";

import {
  FieldType,
  SchemaField,
  UNNAMED_FIELD_PREFIX,
} from "@/types/schema";
import {
  stringFakerOptions,
  numberFakerOptions,
} from "@/lib/fakerOptions";
import SchemaBuilder from "./SchemaBuilder";
import SearchableSelect from "./SearchableSelect";
import ArrayItemEditor from "./ArrayItemEditor";
import TupleItemEditor from "./TupleItemEditor";

interface TuplePositionRowProps {
  index: number;
  field: SchemaField;
  onUpdate: (field: SchemaField) => void;
  onRemove: () => void;
  depth?: number;
}

const positionTypes: { label: string; value: FieldType }[] = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Object", value: "object" },
  { label: "Array", value: "array" },
  { label: "Tuple", value: "tuple" },
];

const inputClass =
  "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500";

const selectClass =
  "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500 appearance-none";

export default function TuplePositionRow({
  index,
  field,
  onUpdate,
  onRemove,
  depth = 0,
}: TuplePositionRowProps) {
  const handleTypeChange = (newType: FieldType) => {
    if (newType === "object") {
      onUpdate({ type: "object", fields: {} });
    } else if (newType === "array") {
      onUpdate({ type: "array", itemType: "object", fields: {} });
    } else if (newType === "tuple") {
      onUpdate({ type: "tuple", tupleItems: [{ type: "string" }] });
    } else {
      onUpdate({ type: newType });
    }
  };

  return (
    <div
      className={`border border-green-200 rounded-lg p-3 mb-2 bg-white ${
        depth > 0 ? "sm:ml-4 border-l-2 border-l-green-400" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">
          Position {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
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
          {positionTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {field.type === "string" && (
          <SearchableSelect
            options={stringFakerOptions}
            value={field.fakerType ?? ""}
            onChange={(fakerType) => onUpdate({ ...field, fakerType })}
          />
        )}

        {field.type === "number" && (
          <SearchableSelect
            options={numberFakerOptions}
            value={field.fakerType ?? ""}
            onChange={(fakerType) => onUpdate({ ...field, fakerType })}
          />
        )}
      </div>

      {field.type === "object" && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs text-green-700">Object fields:</p>
            <button
              type="button"
              onClick={() => {
                const key = `${UNNAMED_FIELD_PREFIX}${Date.now()}`;
                onUpdate({
                  type: "object",
                  fields: {
                    ...(field.fields ?? {}),
                    [key]: { type: "string" },
                  },
                });
              }}
              className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-1.5 transition"
            >
              + Add Field
            </button>
          </div>
          <SchemaBuilder
            schema={field.fields ?? {}}
            onChange={(fields) => onUpdate({ type: "object", fields })}
            depth={depth + 1}
          />
        </div>
      )}

      {field.type === "array" && (
        <div className="mt-3">
          <ArrayItemEditor
            config={field}
            onChange={(config) => onUpdate({ type: "array", ...config })}
            depth={depth + 1}
            label="Array at this position:"
          />
        </div>
      )}

      {field.type === "tuple" && (
        <div className="mt-3">
          <TupleItemEditor
            items={field.tupleItems}
            onChange={(tupleItems) => onUpdate({ type: "tuple", tupleItems })}
            depth={depth + 1}
            label="Nested tuple positions:"
          />
        </div>
      )}
    </div>
  );
}
