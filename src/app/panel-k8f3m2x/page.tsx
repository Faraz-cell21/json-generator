"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_PATH } from "@/lib/authRoutes";

interface Log {
  _id: string;
  ip_address: string;
  field_count: number;
  nesting_depth: number;
  records_requested: number;
  schema_submitted: object;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSchema, setSelectedSchema] = useState<object | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      if (res.status === 401) {
        router.push(LOGIN_PATH);
        return;
      }
      const data = await res.json();
      setLogs(data.logs);
    } catch {
      setError("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(LOGIN_PATH);
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <main className="min-h-screen bg-green-50 text-green-950">
      {/* Header */}
      <header className="border-b border-green-200 bg-white px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-900">Admin Panel</h1>
          <p className="text-xs text-green-700 mt-0.5">
            Generation logs — last 100 requests
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-3 py-2 min-h-[44px] transition"
          >
            ← Back to App
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded px-3 py-2 min-h-[44px] transition"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
        {/* Stats Row */}
        {!loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Requests"
              value={logs.length}
            />
            <StatCard
              label="Avg Fields"
              value={
                logs.length
                  ? Math.round(
                      logs.reduce((a, l) => a + l.field_count, 0) / logs.length
                    )
                  : 0
              }
            />
            <StatCard
              label="Avg Records"
              value={
                logs.length
                  ? Math.round(
                      logs.reduce((a, l) => a + l.records_requested, 0) /
                        logs.length
                    )
                  : 0
              }
            />
            <StatCard
              label="Avg Depth"
              value={
                logs.length
                  ? Math.round(
                      logs.reduce((a, l) => a + l.nesting_depth, 0) /
                        logs.length
                    )
                  : 0
              }
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-green-700">
            Loading logs...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-red-400">{error}</div>
        )}

        {/* Logs Table */}
        {!loading && !error && (
          <div className="bg-white border border-green-200 rounded-xl overflow-x-auto overscroll-x-contain">
            <p className="sm:hidden text-xs text-green-700 px-4 pt-3">
              Swipe table horizontally to see all columns
            </p>
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-green-200 text-green-800 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Timestamp</th>
                  <th className="text-left px-4 py-3">IP Address</th>
                  <th className="text-center px-4 py-3">Fields</th>
                  <th className="text-center px-4 py-3">Depth</th>
                  <th className="text-center px-4 py-3">Records</th>
                  <th className="text-center px-4 py-3">Schema</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-green-700"
                    >
                      No logs yet. Generate some data first.
                    </td>
                  </tr>
                )}
                {logs.map((log, i) => (
                  <tr
                    key={log._id}
                    className={`border-b border-green-200 hover:bg-green-100 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-green-50/60"
                    }`}
                  >
                    <td className="px-4 py-3 text-green-900 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-green-900 font-mono text-xs whitespace-nowrap">
                      {log.ip_address}
                    </td>
                    <td className="px-4 py-3 text-center text-green-950 font-medium">
                      {log.field_count}
                    </td>
                    <td className="px-4 py-3 text-center text-green-950 font-medium">
                      {log.nesting_depth}
                    </td>
                    <td className="px-4 py-3 text-center text-green-950 font-medium">
                      {log.records_requested}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSchema(log.schema_submitted)
                        }
                        className="text-xs text-green-700 hover:text-green-900 border border-green-300 hover:border-green-500 bg-white rounded px-2 py-2 min-h-[36px] transition whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schema Modal */}
      {selectedSchema && (
        <div
          className="fixed inset-0 bg-green-950/30 backdrop-blur-[1px] flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedSchema(null)}
        >
          <div
            className="bg-white border border-green-200 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-900 font-semibold">Schema Submitted</h3>
              <button
                onClick={() => setSelectedSchema(null)}
                className="text-green-700 hover:text-green-900 text-sm"
              >
                ✕ Close
              </button>
            </div>
            <pre className="text-green-900 text-xs font-mono whitespace-pre-wrap break-words bg-green-50 rounded-lg p-4 border border-green-200">
              {JSON.stringify(selectedSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-green-200 rounded-xl px-4 py-4 shadow-sm">
      <p className="text-green-700 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-green-900 text-2xl font-bold">{value}</p>
    </div>
  );
}