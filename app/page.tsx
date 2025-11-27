import MyHeroSection from "@/src/components/MyHeroSection";
import ProjectPreviewCard from "@/src/components/project-preview-card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex flex-col w-full justify-start">
        <MyHeroSection />
        <ProjectPreviewCard count={3} />
      </main>
    </div>
  );
}
