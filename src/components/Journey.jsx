import { useRef } from "react";
import { JOURNEY } from "../data";
import { gsap, EASE, useGsap } from "../lib/anim";

export default function Journey() {
  const cardRefs = useRef([]);

  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(q(".jn-head"), {
        opacity: 0,
        y: 26,
        duration: 1.1,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: { trigger: q(".jn-header")[0], start: "top 80%" },
      });

      const stack = q(".jn-stack")[0];
      const cards = cardRefs.current.filter(Boolean);

      cards.forEach((card, i) => {
        // pinSpacing:false keeps the stack's own height as the scroll runway,
        // so each card holds the viewport until the last one has arrived.
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top top",
            endTrigger: stack,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const next = cards[i + 1];
        if (!next) return;

        // The outgoing card settles back and dims while the next one rises
        // over it; its top edge stays visible as the seam between the two.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to(card, { scale: 0.93, ease: "none" }, 0)
          .to(card.querySelector(".jn-dim"), { opacity: 0.62, ease: "none" }, 0);
      });
    });
  });

  return (
    <section
      id="capacidad"
      ref={scope}
      data-nav-dark
      className="relative isolate bg-graphite text-paper"
    >
      <div className="jn-header mx-auto w-full max-w-[1680px] px-gutter pt-[clamp(5rem,13vh,9rem)] pb-[clamp(3rem,7vh,5rem)]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-[4vw]">
          <h2 className="jn-head text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.94] md:col-span-7">
            {JOURNEY.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="jn-head max-w-[28rem] text-[0.95rem] leading-[1.75] text-steel-2 md:col-span-5">
            {JOURNEY.intro}
          </p>
        </div>
      </div>

      <div className="jn-stack relative">
        {JOURNEY.stages.map((stage, i) => (
          <article
            key={stage.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ zIndex: i + 1 }}
            className="jn-card relative flex h-svh w-full items-center overflow-hidden border-t border-line-invert bg-graphite will-change-transform"
          >
            <div className="mx-auto w-full max-w-[1680px] px-gutter">
              <div className="grid grid-cols-1 gap-7 md:grid-cols-12 md:items-center md:gap-[4vw]">
                <div className="md:col-span-6">
                  <div className="relative h-[30svh] w-full overflow-hidden border border-line-invert md:aspect-4/5 md:h-auto">
                    <img
                      src={stage.image}
                      alt={stage.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-5 md:col-start-8">
                  <span className="block h-px w-14 bg-bronze" aria-hidden="true" />
                  <h3 className="mt-7 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-none">
                    {stage.title}
                  </h3>
                  <p className="mt-5 max-w-[30rem] text-[0.95rem] leading-[1.78] text-steel-2 md:mt-6 md:text-[1rem]">
                    {stage.body}
                  </p>
                </div>
              </div>
            </div>

            <div className="jn-dim pointer-events-none absolute inset-0 bg-graphite opacity-0" />
          </article>
        ))}
      </div>
    </section>
  );
}
