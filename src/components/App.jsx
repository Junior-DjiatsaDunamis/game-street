import { ThemeProvider } from './ThemeProvider';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { SquadBuilder } from './SquadBuilder';
import { ArenaCards } from './ArenaCards';
import { ScoringSection } from './ScoringSection';
import { Timeline } from './Timeline';
import { Footer } from './Footer';

export function App() {
  return (
    <ThemeProvider>
      <Navigation />
      <Hero />
      <SquadBuilder />
      <ArenaCards />
      <ScoringSection />
      <Timeline />
      <Footer />
    </ThemeProvider>
  );
}

