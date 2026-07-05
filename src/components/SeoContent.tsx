import { getSiteUrl, siteConfig } from "@/lib/site";

const faqs = [
  {
    question: "What is a JSON generator?",
    answer:
      "A JSON generator creates structured JSON data from a schema you define. It is useful for API testing, database seeding, and frontend prototyping.",
  },
  {
    question: "Can I generate multiple records at once?",
    answer:
      "Yes. Choose how many records to generate (up to 1000) and download or copy the full JSON output instantly.",
  },
  {
    question: "What faker data types are supported?",
    answer:
      "The tool supports strings, numbers, booleans, nested objects, and arrays with realistic faker values like names, emails, addresses, prices, and more.",
  },
];

export default function SeoContent() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
      },
      {
        "@type": "WebApplication",
        name: siteConfig.name,
        url: siteUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        description: siteConfig.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-t border-green-200 bg-white px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-green-900 mb-2">
            Free Online JSON Generator for Developers
          </h2>
          <p className="text-sm text-green-800 leading-relaxed mb-4">
            {siteConfig.name} helps you build custom schemas and generate
            realistic fake JSON data for API mocks, test fixtures, and database
            seeding. Define fields, pick faker types, and export JSON in seconds.
          </p>

          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-green-800 mb-8 list-disc pl-5">
            <li>Visual schema builder with nested objects and arrays</li>
            <li>100+ faker options for strings and numbers</li>
            <li>Generate up to 1000 records per request</li>
            <li>Copy or download JSON output instantly</li>
          </ul>

          <h3 className="text-base font-semibold text-green-900 mb-3">
            Frequently Asked Questions
          </h3>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium text-green-900">
                  {faq.question}
                </dt>
                <dd className="text-sm text-green-700 mt-1">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
