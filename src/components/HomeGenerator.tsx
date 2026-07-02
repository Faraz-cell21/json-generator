"use client";

import { useState } from "react";
import SchemaBuilder from "@/components/SchemaBuilder";
import {
  SchemaState,
  countNamedFields,
  hasUnnamedFields,
} from "@/types/schema";

export default function HomeGenerator() {
  const [schema, setSchema] = useState<SchemaState>({});
  const [records, setRecords] = useState<number>(5);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (countNamedFields(schema) === 0) {
      setError("Please add at least one field.");
      return;
    }

    if (hasUnnamedFields(schema)) {
      setError("Please name all fields before generating.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { generateRecords } = await import("@/lib/generator");
      const generated = generateRecords(schema, records);
      setOutput(JSON.stringify(generated, null, 2));

      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema,
          records_requested: records,
        }),
      });
    } catch (err) {
      setError("Something went wrong during generation.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSchema({});
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <>
      <header className="border-b border-green-200 bg-white px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-900 tracking-tight">
            JSON Generator
          </h1>
          <p className="text-xs text-green-700 mt-0.5">
            Define your schema and generate realistic fake JSON data
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-4 py-2.5 min-h-[44px] transition"
        >
          Reset
        </button>
      </header>

      <div className="w-full max-w-full flex flex-col lg:flex-row lg:h-[calc(100vh-65px)]">
        <section className="w-full max-w-full lg:w-1/2 p-4 sm:p-6 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-green-200 bg-white relative z-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-green-800 uppercase tracking-widest">
              Schema
            </h2>
            <span className="text-xs text-green-700">
              {countNamedFields(schema)} field
              {countNamedFields(schema) !== 1 ? "s" : ""}
            </span>
          </div>

          <SchemaBuilder schema={schema} onChange={setSchema} />

          <div className="mt-6 pt-6 border-t border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <label className="text-sm text-green-800 whitespace-nowrap">
                Records to generate:
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={records}
                onChange={(e) =>
                  setRecords(Math.min(1000, Math.max(1, Number(e.target.value))))
                }
                className="bg-white text-green-900 text-sm rounded px-3 py-1.5 w-24 border border-green-300 focus:outline-none focus:border-green-500"
              />
              <span className="text-xs text-green-700">max 1000</span>
            </div>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-green-300 disabled:text-green-700 text-white font-medium rounded-lg px-4 py-3 min-h-[48px] transition text-sm"
            >
              {loading ? "Generating..." : "Generate JSON"}
            </button>
          </div>
        </section>

        <section className="w-full max-w-full lg:w-1/2 p-4 sm:p-6 lg:overflow-y-auto flex flex-col relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-green-800 uppercase tracking-widest">
              Output
            </h2>

            {output && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-2 min-h-[44px] transition"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-2 min-h-[44px] transition"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          {output ? (
            <pre className="flex-1 bg-white border border-green-200 rounded-lg p-4 text-sm text-green-900 overflow-auto font-mono whitespace-pre-wrap break-words">
              {output}
            </pre>
          ) : (
            <div className="min-h-[220px] lg:flex-1 bg-white border border-green-300 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-green-700 text-sm">No output yet</p>
                <p className="text-green-600 text-xs mt-1">
                  Add fields and click Generate JSON
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
