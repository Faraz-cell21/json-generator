"use client";

import { useState } from "react";
import SchemaBuilder from "@/components/SchemaBuilder";
import { SchemaState } from "@/types/schema";
import { generateRecords } from "@/lib/generator";

export default function Home() {
  const [schema, setSchema] = useState<SchemaState>({});
  const [records, setRecords] = useState<number>(5);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (Object.keys(schema).length === 0) {
      setError("Please add at least one field.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Generate JSON on the client
      const generated = generateRecords(schema, records);
      setOutput(JSON.stringify(generated, null, 2));

      // Log metadata to backend
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
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            JSON Generator
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Define your schema and generate realistic fake JSON data
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded px-3 py-1.5 transition"
        >
          Reset
        </button>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Left Panel — Schema Builder */}
        <div className="lg:w-1/2 p-6 overflow-y-auto border-r border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
              Schema
            </h2>
            <span className="text-xs text-gray-500">
              {Object.keys(schema).length} field
              {Object.keys(schema).length !== 1 ? "s" : ""}
            </span>
          </div>

          <SchemaBuilder schema={schema} onChange={setSchema} />

          {/* Record count + Generate */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-gray-400 whitespace-nowrap">
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
                className="bg-gray-800 text-white text-sm rounded px-3 py-1.5 w-24 border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">max 1000</span>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-400 text-white font-medium rounded-lg px-4 py-2.5 transition text-sm"
            >
              {loading ? "Generating..." : "Generate JSON"}
            </button>
          </div>
        </div>

        {/* Right Panel — JSON Output */}
        <div className="lg:w-1/2 p-6 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
              Output
            </h2>

            {output && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded px-3 py-1 transition"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded px-3 py-1 transition"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          {output ? (
            <pre className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-green-400 overflow-auto font-mono whitespace-pre-wrap break-words">
              {output}
            </pre>
          ) : (
            <div className="flex-1 bg-gray-900 border border-gray-700 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  No output yet
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Add fields and click Generate JSON
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}