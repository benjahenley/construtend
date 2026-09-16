import { PROOF } from "../data";
import { gsap, EASE, EASE_EXPO, splitWords, useGsap } from "../lib/anim";

export default function Proof() {
  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const trigger = { trigger: q(".pf-grid")[0], start: "top 76%" };

      gsap.from(q(".pf-year-inner"), {
        yPercent: 108,
        duration: 1.5,
        ease: EASE_EXPO,
        scrollTrigger: trigger,
      });

      gsap.from(splitWords(q(".pf-statement")[0]), {
        opacity: 0,
        yPercent: 60,
        duration: 1,
        stagger: 0.022,
        ease: EASE,
        scrollTrigger: trigger,
      });

      gsap.from(q(".pf-fade"), {
        opacity: 0,
        y: 18,
        duration: 1,
        stagger: 0.12,
        ease: EASE,
        scrollTrigger: trigger,
      });

      gsap.to(q(".pf-year"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: q(".pf-grid")[0],
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  });

  return (
    <section ref={scope} data-nav-white className="relative bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-gutter py-[clamp(5.5rem,15vh,11rem)]">
        <div className="pf-grid grid grid-cols-1 items-end gap-10 md:grid-cols-12 md:gap-[4vw]">
          {/* El cuerpo se mide contra la columna (cqw), no contra el viewport:
              en tablet la columna es la mitad del ancho de pantalla, así que
              con vw el número crecía más rápido que su caja y el line-mask, que
              recorta para el reveal, se comía el último dígito. */}
          <div className="pf-year @container md:col-span-6">
            <span className="line-mask pb-[0.06em]">
              <span className="pf-year-inner text-hollow block font-display text-[clamp(7rem,38cqw,16rem)] leading-[0.8] tracking-[-0.04em]">
                {PROOF.year}
              </span>
            </span>
          </div>

          <div className="md:col-span-6 md:pb-4">
            <p className="pf-statement max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.6]">
              {PROOF.statement}
            </p>
            <p className="pf-fade mt-8 flex items-start gap-4 text-steel">
              <span className="mt-[0.6em] h-px w-12 shrink-0 bg-line" aria-hidden="true" />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">
                {PROOF.note}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
