import HomeGenerator from "@/components/HomeGenerator";
import SeoContent from "@/components/SeoContent";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-green-50 text-green-950 w-full max-w-full">
      <HomeGenerator />
      <SeoContent />
    </main>
  );
}
