import { useEffect, useRef, useState } from "react";
import { gsap, useGsap, EASE_EXPO } from "../lib/anim";
import { NAV, COMPANY } from "../data";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState("paper");

  // Settles in last, once the hero's headline and structure have resolved.
  const scope = useGsap((self) => {
    gsap.from(self.selector(".hd-bar"), {
      yPercent: -120,
      opacity: 0,
      duration: 0.9,
      delay: 1.4,
      ease: EASE_EXPO,
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tono de la sección que está pasando bajo la barra. Las secciones que no son
  // paper se marcan con data-nav-dark o data-nav-white; el resto vale paper.
  // Probed by rect rather than mix-blend-mode, which glitches on iOS Safari.
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll("[data-nav-dark], [data-nav-white]"));
    if (!zones.length) return;
    const probe = () => {
      const y = 40;
      const hit = zones.find((z) => {
        const r = z.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setZone(hit ? (hit.hasAttribute("data-nav-dark") ? "dark" : "white") : "paper");
    };
    probe();
    window.addEventListener("scroll", probe, { passive: true });
    window.addEventListener("resize", probe, { passive: true });
    return () => {
      window.removeEventListener("scroll", probe);
      window.removeEventListener("resize", probe);
    };
  }, []);

  const inverted = zone === "dark" && !open;
  const tone = inverted ? "text-paper" : "text-graphite";

  // Pasado el hero la barra deja de flotar sobre la imagen y toma cuerpo: copia
  // el fondo de la sección que tiene debajo, así no se recorta contra ella. El
  // fondo y el volteo de los ítems viajan juntos (misma duración que `tone`).
  const surface = !scrolled
    ? "bg-transparent"
    : inverted
      ? "bg-graphite"
      : zone === "white" && !open
        ? "bg-white"
        : "bg-paper";

  // Lenis's start() cancels any in-flight scrollTo, so skip the unlock while a
  // menu tap is still scrolling the page.
  const navigatingRef = useRef(false);
  useEffect(() => {
    if (open) window.lenis?.stop();
    else if (!navigatingRef.current) window.lenis?.start();
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    navigatingRef.current = true;
    window.lenis?.start();
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) {
      navigatingRef.current = false;
      return;
    }
    if (window.lenis) {
      window.lenis.scrollTo(el, {
        offset: -8,
        force: true,
        onComplete: () => {
          navigatingRef.current = false;
        },
      });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
      navigatingRef.current = false;
    }
  };

  return (
    <>
      <header
        ref={scope}
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-500 ${surface}`}
      >
        <div
          className={`hd-bar relative flex items-center justify-between px-gutter transition-[padding,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${surface} ${
            scrolled ? "py-4" : "py-6 md:py-8"
          }`}
        >
          <a
            href="#inicio"
            onClick={(e) => go(e, "#inicio")}
            aria-label={COMPANY.legalName}
            className={`group flex items-center transition-colors duration-500 ${tone}`}
          >
            <Logo className="h-6 w-auto transition-opacity duration-500 group-hover:opacity-70 md:h-7" />
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => go(e, n.href)}
                className={`group relative font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-500 ${tone}`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full ${
                    inverted ? "bg-paper" : "bg-graphite"
                  }`}
                />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className="flex h-6 w-8 flex-col items-end justify-center gap-[6px] md:hidden"
          >
            <span
              className={`h-px transition-all duration-500 ${inverted ? "bg-paper" : "bg-graphite"} ${
                open ? "w-6 translate-y-[3.5px] rotate-45" : "w-8"
              }`}
            />
            <span
              className={`h-px transition-all duration-500 ${inverted ? "bg-paper" : "bg-graphite"} ${
                open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-5"
              }`}
            />
          </button>

          {/* datum rule: draws itself across the bar once the hero is behind you */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-gutter bottom-0 h-px origin-left transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${
              inverted ? "bg-line-invert" : "bg-line"
            } ${scrolled && !open ? "scale-x-100" : "scale-x-0"}`}
          />
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-paper px-gutter pt-32 pb-12 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => go(e, n.href)}
              className="border-b border-line-soft py-5 font-display text-[2.6rem] leading-none text-graphite"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a href={`mailto:${COMPANY.email}`} className="eyebrow text-steel">
          {COMPANY.email}
        </a>
      </div>
    </>
  );
}
