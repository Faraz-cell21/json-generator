"use client";

import { useEffect, useRef, useState } from "react";
import {
  inferSchemaFromJsonText,
  isInferSchemaError,
} from "@/lib/inferSchema";
import type { SchemaState } from "@/types/schema";

interface ImportJsonModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (schema: SchemaState, suggestedRecords: number) => void;
}

interface FilePreview {
  fileName: string;
  fieldCount: number;
  depth: number;
  suggestedRecords: number;
  schema: SchemaState;
}

function isJsonFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".json") || file.type === "application/json";
}

export default function ImportJsonModal({
  open,
  onClose,
  onImport,
}: ImportJsonModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [parseError, setParseError] = useState("");
  const [importError, setImportError] = useState("");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!open) {
      setFileName("");
      setFileText("");
      setPreview(null);
      setParseError("");
      setImportError("");
      setDragging(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [open]);

  if (!open) return null;

  const processFile = async (file: File) => {
    if (!isJsonFile(file)) {
      setToast("Only .json files are supported");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setImportError("");
    setParseError("");

    try {
      const text = await file.text();
      const result = inferSchemaFromJsonText(text);

      if (isInferSchemaError(result)) {
        setFileName(file.name);
        setFileText(text);
        setPreview(null);
        setParseError(result.message);
        return;
      }

      setFileName(file.name);
      setFileText(text);
      setPreview({
        fileName: file.name,
        fieldCount: result.fieldCount,
        depth: result.depth,
        suggestedRecords: result.suggestedRecords,
        schema: result.schema,
      });
    } catch {
      setFileName(file.name);
      setPreview(null);
      setParseError("Could not read this file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleImport = () => {
    setImportError("");
    const result = inferSchemaFromJsonText(fileText);
    if (isInferSchemaError(result)) {
      setImportError(result.message);
      return;
    }
    onImport(result.schema, result.suggestedRecords);
    onClose();
  };

  const handleClose = () => {
    setImportError("");
    onClose();
  };

  return (
    <>
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-green-950 text-white text-sm px-4 py-3 rounded-lg shadow-lg border border-green-800 max-w-sm text-center"
        >
          {toast}
        </div>
      )}

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
              <h3 className="text-green-900 font-semibold">Upload JSON</h3>
              <p className="text-xs text-green-700 mt-1">
                Upload a .json file to build a schema automatically.
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

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
              dragging
                ? "border-green-500 bg-green-50"
                : "border-green-300 bg-green-50/50"
            }`}
          >
            <p className="text-sm text-green-800 font-medium">
              Drag and drop a .json file here
            </p>
            <p className="text-xs text-green-600 mt-1 mb-4">or</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded-lg px-4 py-2.5 min-h-[44px] transition"
            >
              Choose .json file
            </button>
            <p className="text-xs text-green-600 mt-4">
              Only .json files are supported
            </p>
          </div>

          {fileName && (
            <p className="mt-3 text-sm text-green-800">
              Selected: <span className="font-mono">{fileName}</span>
            </p>
          )}

          {preview && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              <p>
                {preview.fieldCount} field
                {preview.fieldCount !== 1 ? "s" : ""}, {preview.depth} level
                {preview.depth !== 1 ? "s" : ""} deep
              </p>
              <p className="text-xs text-green-700 mt-1">
                Suggested records: {preview.suggestedRecords}
              </p>
            </div>
          )}

          {parseError && (
            <p className="mt-3 text-sm text-red-500">{parseError}</p>
          )}

          {importError && (
            <p className="mt-3 text-sm text-red-500">{importError}</p>
          )}

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
              disabled={!preview}
              className="text-sm bg-green-600 hover:bg-green-500 disabled:bg-green-300 disabled:text-green-700 text-white font-medium rounded-lg px-4 py-2.5 min-h-[44px] transition"
            >
              Replace Schema
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
