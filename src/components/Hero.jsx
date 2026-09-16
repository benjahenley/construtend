import { HERO } from "../data";
import { gsap, EASE, EASE_EXPO, primeStrokes, useGsap } from "../lib/anim";

/* Axonometric geometry — three datum levels sharing one plan.
   Half-width 230, half-height 118, levels at y = 470 / 320 / 170. */
const LEVELS = { base: 470, mid: 320, top: 170 };
const plan = (cy) => ({
  n: [320, cy - 118],
  e: [550, cy],
  s: [320, cy + 118],
  w: [90, cy],
});
const B = plan(LEVELS.base);
const M = plan(LEVELS.mid);
const T = plan(LEVELS.top);

const edges = (p) => [
  [p.n, p.e],
  [p.e, p.s],
  [p.s, p.w],
  [p.w, p.n],
];

const Line = ({ from, to, className, stroke, width = 1 }) => (
  <line
    className={className}
    x1={from[0]}
    y1={from[1]}
    x2={to[0]}
    y2={to[1]}
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="square"
  />
);

const ANNOTATIONS = [
  { y: LEVELS.base, label: "Origen" },
  { y: LEVELS.mid, label: "Movimiento" },
  { y: LEVELS.top, label: "Obra" },
];

function Structure() {
  return (
    <svg viewBox="0 0 780 640" className="h-auto w-full overflow-visible" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ct-slab" x1="90" y1="288" x2="550" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-graphite-soft)" />
          <stop offset="54%" stopColor="var(--color-bronze-deep)" />
          <stop offset="100%" stopColor="var(--color-bronze)" />
        </linearGradient>
      </defs>

      <g className="structure-group">
        {edges(B).map(([from, to], i) => (
          <Line key={`b${i}`} from={from} to={to} className="draw-base" stroke="var(--color-graphite)" width={1.4} />
        ))}

        {/* columns, drawn upward from the base */}
        {["n", "e", "s", "w"].map((k) => (
          <Line
            key={`c${k}`}
            from={B[k]}
            to={T[k]}
            className="draw-col"
            stroke="var(--color-graphite)"
            width={1.4}
          />
        ))}

        {edges(M).map(([from, to], i) => (
          <Line key={`m${i}`} from={from} to={to} className="draw-mid" stroke="var(--color-steel-2)" />
        ))}

        {/* asymmetric bracing: lower left bay, upper right bay */}
        {[
          [B.w, M.s],
          [M.w, B.s],
          [M.s, T.e],
          [T.s, M.e],
        ].map(([from, to], i) => (
          <Line key={`x${i}`} from={from} to={to} className="draw-brace" stroke="var(--color-steel)" />
        ))}

        {/* the finished surface — the one place the accent gradient appears */}
        <polygon
          className="slab"
          points={`${T.n} ${T.e} ${T.s} ${T.w}`}
          fill="url(#ct-slab)"
          opacity="0.75"
        />

        {edges(T).map(([from, to], i) => (
          <Line key={`t${i}`} from={from} to={to} className="draw-top" stroke="var(--color-graphite)" width={1.7} />
        ))}

        {ANNOTATIONS.map(({ y, label }) => (
          <g key={label}>
            <g className="node" transform={`translate(550 ${y}) rotate(45)`}>
              <rect x="-4.5" y="-4.5" width="9" height="9" fill="var(--color-graphite)" />
            </g>
            <Line from={[558, y]} to={[596, y]} className="draw-leader" stroke="var(--color-steel)" />
            <text
              className="anno"
              x="606"
              y={y + 4}
              fill="var(--color-steel)"
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em" }}
            >
              {label.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// La etiqueta se dibuja dos veces: una en el botón y otra dentro del rombo.
// Mismo markup en ambas para que la copia caiga exactamente sobre la original.
const CtaContent = () => (
  <>
    <span className="eyebrow">{HERO.cta}</span>
    <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden="true">
      <path d="M0 4h20M17 1l4 3-4 3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </>
);

export default function Hero() {
  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      primeStrokes(q(".draw-base, .draw-col, .draw-mid, .draw-brace, .draw-top, .draw-leader"));

      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.to(q(".draw-base"), { strokeDashoffset: 0, duration: 1, stagger: 0.05 })
        .to(q(".draw-col"), { strokeDashoffset: 0, duration: 0.95, stagger: 0.08 }, "-=0.62")
        .to(q(".draw-mid"), { strokeDashoffset: 0, duration: 0.8, stagger: 0.04 }, "-=0.55")
        .to(q(".draw-brace"), { strokeDashoffset: 0, duration: 0.7, stagger: 0.06 }, "-=0.5")
        .to(q(".draw-top"), { strokeDashoffset: 0, duration: 0.9, stagger: 0.05 }, "-=0.4")
        .from(q(".slab"), { opacity: 0, scale: 0.93, transformOrigin: "50% 50%", duration: 1.3, ease: EASE_EXPO }, "-=0.45")
        .from(q(".node"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08 }, "-=0.9")
        .to(q(".draw-leader"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.09 }, "-=0.55")
        .from(q(".anno"), { opacity: 0, x: -10, duration: 0.6, stagger: 0.09 }, "<")
        .from(q(".hero-line"), { yPercent: 118, duration: 1.2, stagger: 0.09, ease: EASE_EXPO }, 0.3)
        .from(q(".hero-lead"), { opacity: 0, y: 20, duration: 0.9 }, 1)
        .from(q(".hero-cta"), { opacity: 0, y: 20, duration: 0.9 }, 1.15);

      gsap.to(q(".structure-group"), {
        y: -12,
        duration: 6.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: tl.duration() * 0.6,
      });

      const stage = q(".hero-stage")[0];
      gsap.to(q(".hero-copy"), {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".hero-figure-inner"), {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: true },
      });
    });

    // El CTA colapsa en un rombo que persigue al cursor y se llena de tinta
    // como un líquido, invirtiendo el texto que queda bajo la superficie. Solo
    // con puntero fino: sin hover real el marco se queda quieto.
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cta = q(".cta")[0];
      const frame = q(".cta-frame")[0];
      const liquid = q(".cta-liquid")[0];
      const liquidFill = q(".cta-liquid-fill")[0];
      const wave = q(".cta-liquid-path")[0];
      if (!cta || !frame || !liquid || !liquidFill || !wave) return;

      let hovering = false;
      let ticking = false;
      let dead = false;
      const box = { w: 0, h: 0 };
      // Lado del cuadrado: algo menor que el alto del botón, para que al girar
      // la diagonal no crezca de más.
      const side = () => Math.round(box.h * 0.82);

      // Media diagonal del rombo: cuánto tiene que subir el líquido para taparlo.
      const REACH = 34;
      const SPAN = 70; // mitad del ancho de onda que se dibuja
      const AMP = 2.6; // altura de la cresta
      const LEN = 22; // largo de onda
      const STEPS = 28;

      // Estado único: ventana, contra-transformación y onda se escriben en el
      // mismo frame, que es lo que las mantiene alineadas al pixel.
      const st = { x: 0, y: 0, w: 0, h: 0, rot: 0, fill: 0, phase: 0 };

      // Superficie a plomo en coordenadas del botón, con dos senos desfasados
      // para que la cresta no se lea periódica.
      const path = () => {
        const { x, y, fill, phase } = st;
        const level = y + REACH - fill * (REACH * 2);
        const x0 = x - SPAN;
        let d = "";
        for (let i = 0; i <= STEPS; i++) {
          const px = x0 + (i / STEPS) * (SPAN * 2);
          const py =
            level +
            Math.sin(px / LEN + phase) * AMP +
            Math.sin(px / (LEN * 0.55) - phase * 1.3) * AMP * 0.45;
          d += `${i ? "L" : "M"}${px.toFixed(2)} ${py.toFixed(2)}`;
        }
        return `${d}L${(x + SPAN).toFixed(2)} ${(y + 240).toFixed(2)}L${x0.toFixed(2)} ${(y + 240).toFixed(2)}Z`;
      };

      const render = () => {
        const { x, y, w, h, rot } = st;
        frame.style.width = `${w}px`;
        frame.style.height = `${h}px`;
        // Con origen en 0 0, esto deja la ventana centrada en (x, y) y girada
        // sobre su propio centro.
        frame.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) translate(${-w / 2}px, ${-h / 2}px)`;
        // Transformación inversa: lo de adentro vuelve a quedar en coordenadas
        // del botón por más que la ventana se mueva y gire.
        liquid.style.transform = `translate(${w / 2}px, ${h / 2}px) rotate(${-rot}deg) translate(${-x}px, ${-y}px)`;
        wave.setAttribute("d", path());
      };

      const measure = () => {
        if (dead) return;
        const r = cta.getBoundingClientRect();
        box.w = r.width;
        box.h = r.height;
        // inset-0 clava los cuatro lados; acá el tamaño pasa a ser explícito.
        frame.style.right = "auto";
        frame.style.bottom = "auto";
        frame.style.transformOrigin = "0 0";
        liquid.style.transformOrigin = "0 0";
        // La tinta tiene que cubrir el botón con margen: el rombo asoma fuera
        // cuando el cursor va por el borde.
        Object.assign(liquidFill.style, {
          left: "-80px",
          top: "-80px",
          width: `${box.w + 160}px`,
          height: `${box.h + 160}px`,
        });
        if (!hovering) {
          Object.assign(st, { w: box.w, h: box.h, x: box.w / 2, y: box.h / 2, rot: 0, fill: 0 });
          render();
        }
      };

      measure();
      // El ancho depende de la fuente: si aún no cargó, la medida inicial miente.
      document.fonts?.ready.then(measure);
      window.addEventListener("resize", measure);

      // quickTo mantiene un único tween por eje, así el rombo interpola hacia
      // cada nueva posición en vez de reiniciar el movimiento en cada evento.
      const xTo = gsap.quickTo(st, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(st, "y", { duration: 0.6, ease: "power3" });

      // El oleaje corre solo mientras dura el hover.
      const ripple = gsap.to(st, {
        phase: Math.PI * 2,
        duration: 1.5,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      const track = (e) => {
        const r = cta.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };

      const onEnter = (e) => {
        hovering = true;
        if (!ticking) {
          gsap.ticker.add(render);
          ticking = true;
        }
        ripple.play();
        track(e);
        gsap.to(st, { w: side(), h: side(), rot: 45, duration: 0.9, ease: EASE_EXPO, overwrite: "auto" });
        gsap.to(st, { fill: 1, duration: 0.7, ease: "power2.out", overwrite: "auto" });
      };

      const onMove = (e) => {
        if (hovering) track(e);
      };

      const onLeave = () => {
        hovering = false;
        xTo(box.w / 2);
        yTo(box.h / 2);
        gsap.to(st, { fill: 0, duration: 0.5, ease: "power2.in", overwrite: "auto" });
        gsap.to(st, {
          w: box.w,
          h: box.h,
          rot: 0,
          duration: 0.9,
          ease: EASE_EXPO,
          overwrite: "auto",
          onComplete: () => {
            // Nada que dibujar hasta el próximo hover.
            if (!hovering && ticking) {
              gsap.ticker.remove(render);
              ticking = false;
              ripple.pause();
            }
          },
        });
      };

      cta.addEventListener("pointerenter", onEnter);
      cta.addEventListener("pointermove", onMove);
      cta.addEventListener("pointerleave", onLeave);

      return () => {
        dead = true;
        if (ticking) gsap.ticker.remove(render);
        ripple.kill();
        window.removeEventListener("resize", measure);
        cta.removeEventListener("pointerenter", onEnter);
        cta.removeEventListener("pointermove", onMove);
        cta.removeEventListener("pointerleave", onLeave);
      };
    });

    mm.add("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const figure = q(".hero-figure")[0];
      const xTo = gsap.quickTo(figure, "x", { duration: 1, ease: "power3" });
      const yTo = gsap.quickTo(figure, "y", { duration: 1, ease: "power3" });
      const onMove = (e) => {
        xTo((e.clientX / window.innerWidth - 0.5) * 34);
        yTo((e.clientY / window.innerHeight - 0.5) * 26);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    });
  });

  return (
    <section id="inicio" ref={scope} className="relative isolate overflow-hidden bg-paper">
      <div className="blueprint pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="hero-stage relative mx-auto flex min-h-svh w-full max-w-[1680px] flex-col justify-center gap-12 px-gutter pt-28 pb-14 md:gap-0 md:py-32">
        <div className="hero-figure mx-auto w-[min(100%,25rem)] md:pointer-events-none md:absolute md:inset-y-0 md:right-[-3%] md:mx-0 md:flex md:w-[56%] md:max-w-none md:items-center lg:right-0 lg:w-[52%]">
          <div className="hero-figure-inner w-full">
            <Structure />
          </div>
        </div>

        <div className="hero-copy relative z-10 max-w-[46rem]">
          <h1 className="text-[clamp(2.7rem,7.6vw,6.8rem)] leading-[0.94]">
            {HERO.headline.map((line, i) => (
              <span key={line} className="line-mask pb-[0.08em]">
                <span className={`hero-line inline-block${i === 2 ? " bronze-text" : ""}`}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-lead mt-8 max-w-[34rem] text-[1.0625rem] text-graphite-soft md:mt-10 md:max-w-[min(34rem,42vw)] md:text-[0.95rem] lg:text-[1.0625rem]">
            {HERO.lead}
          </p>

          <div className="hero-cta mt-9 md:mt-11">
            <a href="#contacto" className="cta relative inline-flex items-center gap-4 px-7 py-4">
              <CtaContent />

              {/* La onda del líquido. Recorta a la vez el relleno negro y la copia
                  en papel, así el texto se invierte exactamente donde subió. */}
              <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <clipPath id="cta-liquid" clipPathUnits="userSpaceOnUse">
                  <path className="cta-liquid-path" d="M0 0Z" />
                </clipPath>
              </svg>

              {/* Ventana recortada que se encoge, gira y sigue al cursor, por encima
                  del texto real. inset-0 sin relleno es el estado en reposo y el
                  fallback sin JS o con menos movimiento. */}
              <span
                aria-hidden="true"
                className="cta-frame pointer-events-none absolute inset-0 z-10 overflow-hidden border border-graphite"
              >
                {/* Contra-transformado: adentro se vuelve a trabajar en coordenadas
                    del botón, de modo que el líquido cae siempre a plomo por más
                    que el rombo gire, y la copia cae sobre el texto original. */}
                <span
                  className="cta-liquid absolute -left-px -top-px"
                  style={{ clipPath: "url(#cta-liquid)", WebkitClipPath: "url(#cta-liquid)" }}
                >
                  <span className="cta-liquid-fill absolute bg-graphite" />
                  <span className="cta-invert absolute left-0 top-0 flex w-max items-center gap-4 px-7 py-4 text-paper">
                    <CtaContent />
                  </span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
