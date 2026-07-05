"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_PATH } from "@/lib/authRoutes";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        return;
      }

      router.push(ADMIN_PATH);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-green-900">Admin Login</h1>
          <p className="text-green-700 text-sm mt-1">
            JSON Generator admin
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-green-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-sm text-green-800 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin@example.com"
              className="w-full bg-white text-green-900 text-sm rounded-lg px-3 py-2 border border-green-300 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-sm text-green-800 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-white text-green-900 text-sm rounded-lg px-3 py-2 border border-green-300 focus:outline-none focus:border-green-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-300 disabled:text-green-700 text-white font-medium rounded-lg px-4 py-2.5 transition text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}