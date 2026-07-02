"use client";

import { SchemaField, SchemaState } from "@/types/schema";
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
    const key = `field_${Date.now()}`;
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
    <div>
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
        onClick={addField}
        className="mt-1 text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 rounded px-3 py-1 transition bg-white hover:bg-green-50"
      >
        + Add Field
      </button>
    </div>
  );
}