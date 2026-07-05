"use client";

import {
  ArrayItemConfig,
  ArrayItemType,
  UNNAMED_FIELD_PREFIX,
} from "@/types/schema";
import {
  stringFakerOptions,
  numberFakerOptions,
  arrayItemTypes,
} from "@/lib/fakerOptions";
import SchemaBuilder from "./SchemaBuilder";
import SearchableSelect from "./SearchableSelect";
import TupleItemEditor from "./TupleItemEditor";

interface ArrayItemEditorProps {
  config: ArrayItemConfig;
  onChange: (config: ArrayItemConfig) => void;
  depth?: number;
  label?: string;
}

const inputClass =
  "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500";

const selectClass =
  "bg-white text-green-900 text-base sm:text-sm rounded px-2 py-2.5 w-full min-w-0 border border-green-300 focus:outline-none focus:border-green-500 appearance-none";

export default function ArrayItemEditor({
  config,
  onChange,
  depth = 0,
  label,
}: ArrayItemEditorProps) {
  const handleItemTypeChange = (itemType: ArrayItemType) => {
    if (itemType === "object") {
      onChange({
        itemType: "object",
        fields: config.fields ?? {},
        count: config.count,
      });
      return;
    }
    if (itemType === "array") {
      onChange({
        itemType: "array",
        count: config.count,
        itemSchema: { itemType: "string" },
      });
      return;
    }
    if (itemType === "tuple") {
      onChange({
        itemType: "tuple",
        count: config.count,
        tupleItems: config.tupleItems ?? [{ type: "string" }],
      });
      return;
    }
    onChange({
      itemType,
      count: config.count,
      fakerType: undefined,
      fields: undefined,
      itemSchema: undefined,
      tupleItems: undefined,
    });
  };

  const handleAddItemField = () => {
    const key = `${UNNAMED_FIELD_PREFIX}${Date.now()}`;
    if (config.itemType !== "object") {
      onChange({
        itemType: "object",
        count: config.count,
        fields: { [key]: { type: "string" } },
        fakerType: undefined,
        itemSchema: undefined,
      });
      return;
    }
    onChange({
      ...config,
      fields: {
        ...(config.fields ?? {}),
        [key]: { type: "string" },
      },
    });
  };

  return (
    <div
      className={
        depth > 0
          ? "mt-2 border border-green-200 rounded-lg p-3 bg-green-50/40"
          : ""
      }
    >
      {label && (
        <p className="text-xs text-green-700 mb-2 font-medium">{label}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select
          value={config.itemType}
          onChange={(e) => handleItemTypeChange(e.target.value as ArrayItemType)}
          className={selectClass}
        >
          {arrayItemTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {config.itemType === "string" && (
          <SearchableSelect
            options={stringFakerOptions}
            value={config.fakerType ?? ""}
            onChange={(fakerType) => onChange({ ...config, fakerType })}
          />
        )}

        {config.itemType === "number" && (
          <SearchableSelect
            options={numberFakerOptions}
            value={config.fakerType ?? ""}
            onChange={(fakerType) => onChange({ ...config, fakerType })}
          />
        )}

        <input
          type="number"
          min={1}
          max={20}
          placeholder="Item count"
          value={config.count ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              count: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className={inputClass}
        />
      </div>

      {config.itemType === "object" && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs text-green-700 font-medium">Fields in each item:</p>
            <button
              type="button"
              onClick={handleAddItemField}
              className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-1.5 transition shrink-0"
            >
              + Add Field
            </button>
          </div>
          <SchemaBuilder
            schema={config.fields ?? {}}
            onChange={(fields) => onChange({ ...config, fields })}
            depth={depth + 1}
          />
        </div>
      )}

      {config.itemType !== "object" &&
        config.itemType !== "array" &&
        config.itemType !== "tuple" && (
        <div className="mt-3">
          <p className="text-xs text-green-600 mb-2">
            Each item is a single {config.itemType}. Add more fields per item below.
          </p>
          <button
            type="button"
            onClick={handleAddItemField}
            className="w-full sm:w-auto text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 rounded px-4 py-2.5 min-h-[44px] transition bg-white hover:bg-green-50"
          >
            + Add Field to Each Item
          </button>
        </div>
      )}

      {config.itemType === "array" && (
        <div className="mt-3">
          <ArrayItemEditor
            config={config.itemSchema ?? { itemType: "string" }}
            onChange={(itemSchema) => onChange({ ...config, itemSchema })}
            depth={depth + 1}
            label="Nested array items:"
          />
        </div>
      )}

      {config.itemType === "tuple" && (
        <div className="mt-3">
          <TupleItemEditor
            items={config.tupleItems ?? []}
            onChange={(tupleItems) => onChange({ ...config, tupleItems })}
            depth={depth + 1}
            label="Tuple positions (each index has its own type):"
          />
        </div>
      )}
    </div>
  );
}
