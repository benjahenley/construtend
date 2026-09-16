import { INTRO } from "../data";
import Cube from "./Cube";
import { gsap, EASE, splitWords, useGsap } from "../lib/anim";

export default function Intro() {
  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    const cube = q(".intro-cube")[0];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const statement = q(".intro-statement")[0];
      const words = splitWords(statement);

      gsap.set(words, { color: "var(--color-steel-2)" });
      gsap.to(words, {
        color: "var(--color-graphite)",
        ease: "none",
        stagger: 0.6,
        scrollTrigger: {
          trigger: statement,
          start: "top 76%",
          end: "bottom 58%",
          scrub: 0.6,
        },
      });

      gsap.from(q(".intro-reveal"), {
        opacity: 0,
        y: 24,
        duration: 1.1,
        stagger: 0.12,
        ease: EASE,
        scrollTrigger: { trigger: q(".intro-grid")[0], start: "top 82%" },
      });

      // El cubo se arma al entrar: las tres caras convergen desde su posición
      // explotada. Atado al scroll, no a un tiempo, para que el ensamblaje siga
      // el gesto de la persona.
      gsap.from(q(".cube-shift"), {
        x: (i, el) => Number(el.dataset.dx),
        y: (i, el) => Number(el.dataset.dy),
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: cube,
          start: "top 92%",
          end: "top 52%",
          scrub: 0.6,
        },
      });
    });

    // En touch no hay hover, así que el gesto se muestra solo: una vez armado
    // el cubo, las caras se abren y vuelven a cerrarse. Son los mismos vectores
    // que usa el hover, y viven en el grupo interno, de modo que no chocan con
    // el ensamblaje que corre en el externo.
    mm.add("(hover: none) and (prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { duration: 0.6, ease: EASE },
          scrollTrigger: { trigger: cube, start: "top 46%", once: true },
        })
        .to(q(".cube-face-top"), { y: -5.5 }, 0)
        .to(q(".cube-face-left"), { x: -4.8, y: 2.8 }, 0)
        .to(q(".cube-face-right"), { x: 4.8, y: 2.8 }, 0)
        .to(q(".cube-face"), { x: 0, y: 0, duration: 0.85, ease: "power2.inOut" }, 1.3);
    });
  });

  return (
    <section id="enfoque" ref={scope} data-nav-white className="relative bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-gutter py-[clamp(5.5rem,15vh,11rem)]">
        <div className="intro-grid grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-[4vw]">
          <div className="intro-reveal md:col-span-4 md:border-r md:border-line md:pr-[3vw]">
            {/* En mobile el cubo se apoya al pie del párrafo y ocupa la esquina
                que si no queda vacía; desde md vuelve a caer debajo del texto. */}
            <div className="flex items-end gap-[6vw] md:block">
              <p className="text-[0.95rem] leading-[1.75] text-graphite-soft md:max-w-[26rem]">
                {INTRO.lead}
              </p>
              <Cube className="intro-cube w-[clamp(3.25rem,13vw,4.75rem)] shrink-0 md:mt-[clamp(2.75rem,5vw,4rem)] md:w-[clamp(4.75rem,6vw,6.5rem)]" />
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="intro-statement font-display text-[clamp(1.55rem,3.3vw,2.9rem)] leading-[1.14] tracking-[-0.02em]">
              {INTRO.statement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
