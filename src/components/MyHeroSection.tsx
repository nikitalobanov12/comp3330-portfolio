import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyHeroSection() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 md:gap-6 items-center">
          {/* Left side - Text content */}
          <div className="order-2 md:order-1 p-4 sm:p-6 md:p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-roboto-mono)] mb-2">
                Hi, I&apos;m Nikita
              </CardTitle>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Full-Stack Developer
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg leading-relaxed">
                I build modern web applications with cutting-edge technologies.
                Passionate about creating elegant solutions to complex problems
                and delivering exceptional user experiences.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Specializing in React, Next.js, TypeScript, and cloud
                technologies. Always learning, always building.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <a href="#projects">View My Work</a>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <a href="/resume">Download Resume</a>
                </Button>
              </div>
            </CardContent>
          </div>

          {/* Right side - Profile image */}
          <div className="order-1 md:order-2 relative h-[250px] sm:h-[300px] md:h-[500px] w-full bg-blue-500 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <p className="text-xl sm:text-2xl font-bold">Hero Photo</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
