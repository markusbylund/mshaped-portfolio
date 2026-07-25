import { CollaborationSection } from "../sections/CollaborationSection";
import { DecisionSection } from "../sections/DecisionSection";
import { FeaturedProjects } from "../sections/FeaturedProjects";
import { HelpSection } from "../sections/HelpSection";
import { HeroSection } from "../sections/HeroSection";
import { IndustryStrip } from "../sections/IndustryStrip";
import { PainPointsSection } from "../sections/PainPointsSection";

export function Home() {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <HelpSection />
      <FeaturedProjects />
      <CollaborationSection />
      <IndustryStrip />
      <DecisionSection />
    </>
  );
}
