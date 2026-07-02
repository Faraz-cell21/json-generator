"use client";

import { SchemaField, SchemaState, UNNAMED_FIELD_PREFIX } from "@/types/schema";
import FieldRow from "./FieldRow";

interface SchemaBuilderProps {
  schema: SchemaState;
  onChange: (schema: SchemaState) => void;
  depth?: number;
}

export default function SchemaBuilder({
  schema,
  onChange,
  depth = 0,
}: SchemaBuilderProps) {
  const addField = () => {
    const key = `${UNNAMED_FIELD_PREFIX}${Date.now()}`;
    onChange({
      ...schema,
      [key]: { type: "string" },
    });
  };

  const updateField = (key: string, updated: SchemaField) => {
    onChange({ ...schema, [key]: updated });
  };

  const removeField = (key: string) => {
    const updated = { ...schema };
    delete updated[key];
    onChange(updated);
  };

  const renameField = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const entries = Object.entries(schema);
    const index = entries.findIndex(([k]) => k === oldKey);
    if (index === -1) return;
    entries[index] = [newKey, entries[index][1]];
    onChange(Object.fromEntries(entries));
  };

  return (
    <div className="w-full max-w-full">
      {Object.entries(schema).map(([key, field]) => (
        <FieldRow
          key={key}
          fieldKey={key}
          field={field}
          onUpdate={updateField}
          onRemove={removeField}
          onRename={renameField}
          depth={depth}
        />
      ))}

      <button
        type="button"
        onClick={addField}
        className="mt-2 w-full sm:w-auto text-sm text-green-700 hover:text-green-900 active:text-green-950 border border-green-300 hover:border-green-500 rounded px-4 py-3 min-h-[48px] transition bg-white hover:bg-green-50"
      >
        + Add Field
      </button>
    </div>
  );
}