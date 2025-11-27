import MyHeroSection from "@/src/components/MyHeroSection";
import ProjectPreviewCard from "@/src/components/project-preview-card";
import GitHubCalendar from "@/src/components/github-calendar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex flex-col w-full justify-start">
        <MyHeroSection />
        <ProjectPreviewCard count={3} />
        <section className="container mx-auto px-4 py-8 md:py-12">
          <GitHubCalendar username="nikitalobanov12" />
        </section>
      </main>
    </div>
  );
}
