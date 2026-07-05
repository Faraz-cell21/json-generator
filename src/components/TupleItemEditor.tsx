"use client";

import { SchemaField } from "@/types/schema";
import TuplePositionRow from "./TuplePositionRow";

interface TupleItemEditorProps {
  items: SchemaField[];
  onChange: (items: SchemaField[]) => void;
  depth?: number;
  label?: string;
}

export default function TupleItemEditor({
  items,
  onChange,
  depth = 0,
  label,
}: TupleItemEditorProps) {
  const addPosition = () => {
    onChange([...items, { type: "string" }]);
  };

  const updatePosition = (index: number, field: SchemaField) => {
    const next = [...items];
    next[index] = field;
    onChange(next);
  };

  const removePosition = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div
      className={
        depth > 0
          ? "border border-green-200 rounded-lg p-3 bg-green-50/40"
          : ""
      }
    >
      {label && (
        <p className="text-xs text-green-700 mb-2 font-medium">{label}</p>
      )}

      {items.length === 0 && (
        <p className="text-xs text-green-600 mb-2">
          No positions yet. Add one to define this tuple.
        </p>
      )}

      {items.map((item, index) => (
        <TuplePositionRow
          key={`${depth}-${index}`}
          index={index}
          field={item}
          onUpdate={(field) => updatePosition(index, field)}
          onRemove={() => removePosition(index)}
          depth={depth}
        />
      ))}

      <button
        type="button"
        onClick={addPosition}
        className="mt-1 w-full sm:w-auto text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 rounded px-4 py-2.5 min-h-[44px] transition bg-white hover:bg-green-50"
      >
        + Add Position
      </button>
    </div>
  );
}
