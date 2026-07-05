"use client";

import { useMemo, useState } from "react";
import {
  inferSchemaFromJsonText,
  isInferSchemaError,
} from "@/lib/inferSchema";
import type { SchemaState } from "@/types/schema";

interface PasteJsonModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (schema: SchemaState, suggestedRecords: number) => void;
}

export default function PasteJsonModal({
  open,
  onClose,
  onImport,
}: PasteJsonModalProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    if (!text.trim()) return null;
    const result = inferSchemaFromJsonText(text);
    if (isInferSchemaError(result)) return { error: result.message };
    return {
      fieldCount: result.fieldCount,
      depth: result.depth,
      suggestedRecords: result.suggestedRecords,
    };
  }, [text]);

  if (!open) return null;

  const handleImport = () => {
    setError("");
    const result = inferSchemaFromJsonText(text);
    if (isInferSchemaError(result)) {
      setError(result.message);
      return;
    }
    onImport(result.schema, result.suggestedRecords);
    setText("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setText("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-green-950/30 backdrop-blur-[1px] flex items-center justify-center z-50 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white border border-green-200 rounded-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-green-900 font-semibold">Paste JSON</h3>
            <p className="text-xs text-green-700 mt-1">
              Paste JSON directly to build a schema automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-green-700 hover:text-green-900 text-sm px-2 py-1"
          >
            Close
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder={'[\n  {\n    "id": "uuid-here",\n    "email": "user@example.com",\n    "age": 28\n  }\n]'}
          rows={12}
          className="w-full bg-green-50 text-green-900 text-sm font-mono rounded-lg px-3 py-3 border border-green-200 focus:outline-none focus:border-green-500 resize-y min-h-[200px]"
          spellCheck={false}
        />

        {preview && !("error" in preview) && (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            <p>
              {preview.fieldCount} field{preview.fieldCount !== 1 ? "s" : ""},{" "}
              {preview.depth} level{preview.depth !== 1 ? "s" : ""} deep
            </p>
            <p className="text-xs text-green-700 mt-1">
              Suggested records: {preview.suggestedRecords}
            </p>
          </div>
        )}

        {preview && "error" in preview && text.trim() && (
          <p className="mt-3 text-sm text-red-500">{preview.error}</p>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded-lg px-4 py-2.5 min-h-[44px] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!text.trim() || Boolean(preview && "error" in preview)}
            className="text-sm bg-green-600 hover:bg-green-500 disabled:bg-green-300 disabled:text-green-700 text-white font-medium rounded-lg px-4 py-2.5 min-h-[44px] transition"
          >
            Replace Schema
          </button>
        </div>
      </div>
    </div>
  );
}
