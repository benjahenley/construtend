import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/anim";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Journey from "./components/Journey";
import Materials from "./components/Materials";
import Proof from "./components/Proof";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pinned and scrubbed triggers need re-measuring once images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = setTimeout(refresh, 600);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.lenis = null;
      window.removeEventListener("load", refresh);
      clearTimeout(settle);
    };
  }, []);

  return (
    <div className="grain relative">
      <Header />
      <main>
        <Hero />
        <Intro />
        <Journey />
        <Materials />
        <Proof />
      </main>
      <Footer />
    </div>
  );
}
