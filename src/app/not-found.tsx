import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white border border-green-200 rounded-xl p-8 shadow-sm">
          <p className="text-6xl font-bold text-green-600 tracking-tight">404</p>
          <h1 className="text-xl font-bold text-green-900 mt-4">
            Page not found
          </h1>
          <p className="text-green-700 text-sm mt-2">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg px-4 py-3 min-h-[48px] transition text-sm"
          >
            Back to JSON Generator
          </Link>
        </div>

        <p className="text-xs text-green-600 mt-4">
          JSON Generator - fake data, real fast
        </p>
      </div>
    </main>
  );
}
