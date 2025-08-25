import ConstellationBackground from './ConstellationBackground';
import Hero from './Hero';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-light">
      <ConstellationBackground />
      <Hero />
    </div>
  )
}

export default LandingPage