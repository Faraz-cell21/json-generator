export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "http://localhost:3000";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.replace(/\/$/, "");
  }

  return `https://${url.replace(/\/$/, "")}`;
}

export const siteConfig = {
  name: "JSON Generator",
  title: "JSON Generator - Create Fake JSON Data Online",
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
