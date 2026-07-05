function normalizeSiteUrl(raw?: string): string | null {
  if (!raw?.trim()) return null;

  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return null;
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const url = normalizeSiteUrl(candidate);
    if (url) return url;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "JSON Generator",
  title: "JSON Generator | Create Fake JSON Data Online",
  description:
    "Free online JSON generator. Define a custom schema and generate realistic fake JSON data for API testing, mock databases, and prototyping.",
  keywords: [
    "json generator",
    "fake json data",
    "mock json",
    "test data generator",
    "faker json",
    "api mock data",
    "json schema generator",
    "generate json online",
  ],
};
