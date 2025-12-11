import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHero, getHeroDefaults, getHeroPlaceholderAvatar } from "@/lib/db";

export default async function MyHeroSection() {
  // Fetch hero data from database
  const hero = await getHero();
  const defaults = await getHeroDefaults();
  const placeholderAvatar = await getHeroPlaceholderAvatar();

  // Use hero data or fall back to defaults
  const fullName = hero?.fullName || defaults.fullName;
  const shortDescription = hero?.shortDescription || defaults.shortDescription;
  const longDescription = hero?.longDescription || defaults.longDescription;
  const avatar = hero?.avatar || defaults.avatar;

  // Check if avatar is valid (not empty and not the transparent placeholder)
  const hasValidAvatar = avatar && avatar !== placeholderAvatar && avatar.startsWith("data:");

  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 md:gap-6 items-center">
          {/* Left side - Text content */}
          <div className="order-2 md:order-1 p-4 sm:p-6 md:p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-roboto-mono)] mb-2">
                Hi, I&apos;m {fullName}
              </CardTitle>
              <p className="text-lg sm:text-xl text-muted-foreground">
                {shortDescription}
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {longDescription}
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
          <div className="order-1 md:order-2 relative h-[250px] sm:h-[300px] md:h-[500px] w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {hasValidAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatar}
                alt={`${fullName}'s profile photo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-white text-center p-8">
                <p className="text-xl sm:text-2xl font-bold">Hero Photo</p>
                <p className="text-sm mt-2 opacity-75">
                  Upload from Dashboard
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
