import { useLayoutEffect, useRef, useState } from "react";
import { MATERIALS } from "../data";
import { gsap, ScrollTrigger, EASE, useGsap } from "../lib/anim";

const COUNT = MATERIALS.items.length;

// Cuánto hay que arrastrar para que la carta salga en vez de volver a su sitio.
// Alto a propósito: pasar de material tiene que costar.
const THROW_AT = 96;

// La carta de abajo espera algo más chica y crece mientras la de arriba se va.
const REST_SCALE = 0.92;

// El contorno es la silueta del cubo de la marca, sin las aristas internas:
// el hexágono limpio deja todo el claro para la flecha. El glifo va en su
// propio grupo para que el hover lo adelante sin tocar el trazo del contorno.
function NavArrow({ dir, disabled, onClick }) {
  const prev = dir === "prev";
  return (
    <button
      type="button"
      data-dir={dir}
      disabled={disabled}
      onClick={onClick}
      aria-label={prev ? "Material anterior" : "Material siguiente"}
      className="mt-nav w-[clamp(3.25rem,4.2vw,4rem)] shrink-0 text-graphite transition-opacity duration-500 disabled:pointer-events-none disabled:opacity-25"
    >
      {/* El viewBox lleva holgura para que el trazo no se recorte contra el
          borde de los vértices. */}
      <svg
        viewBox="-3 -3 118 126"
        fill="none"
        className="w-full"
        aria-hidden="true"
      >
        <g
          className="mt-nav-frame transition-[stroke] duration-500"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M56 0L108 30V90L56 120L4 90V30Z" />
        </g>
        <g
          className="mt-nav-glyph"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {prev ? (
            <path d="M72 60H41M50 51L41 60L50 69" />
          ) : (
            <path d="M40 60H71M62 51L71 60L62 69" />
          )}
        </g>
      </svg>
    </button>
  );
}

export default function Materials() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const previousRef = useRef(0);
  const cardRefs = useRef([]);
  const titleRef = useRef(null);
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const flyingRef = useRef(false);

  const cardAt = (index) => cardRefs.current[index] ?? null;
  const exists = (index) => index >= 0 && index < COUNT;

  // Encendido de televisor: el recorte arranca como una línea de un píxel en el
  // centro, se abre en vertical y recién ahí se apaga el destello que tapaba la
  // foto. Entra después de la principal, escalonado uno detrás de otro.
  const revealDetails = (card) => {
    const details = card.querySelectorAll(".mt-detail");
    const flashes = card.querySelectorAll(".mt-flash");
    if (!details.length) return;

    gsap.killTweensOf([...details, ...flashes]);

    // Un tween por recorte en vez de un stagger: con immediateRender en false,
    // cada uno toma su estado de línea recién cuando le toca. Un fromTo
    // escalonado encendería las tres líneas juntas y sólo escalonaría la
    // apertura.
    const tl = gsap.timeline({ delay: 0.14 });
    details.forEach((el, i) => {
      const at = i * 0.24;
      tl.fromTo(
        el,
        { scaleY: 0.012, autoAlpha: 1, immediateRender: false },
        { scaleY: 1, duration: 0.5, ease: "power3.out" },
        at,
      ).fromTo(
        flashes[i],
        { autoAlpha: 1, immediateRender: false },
        { autoAlpha: 0, duration: 0.55, ease: "power2.out" },
        at + 0.08,
      );
    });
  };

  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(q(".mt-head"), {
        opacity: 0,
        y: 26,
        duration: 1.1,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: { trigger: q(".mt-stage")[0], start: "top 72%" },
      });

      ScrollTrigger.create({
        trigger: q(".mt-stage")[0],
        start: "top 64%",
        once: true,
        onEnter: () => revealDetails(cardRefs.current[activeRef.current]),
      });

      // Cada recorte recorre una distancia distinta mientras la sección cruza
      // el viewport, así que se despegan de la foto y entre sí. El recorrido se
      // mide contra el alto del marco y no en píxeles fijos, para que en mobile
      // no se salga de la caja y quede cortado contra el borde.
      const frame = frameRef.current;
      cardRefs.current.filter(Boolean).forEach((card) => {
        card.querySelectorAll(".mt-parallax").forEach((el, i) => {
          const reach = 0.05 + i * 0.04;
          gsap.fromTo(
            el,
            { y: () => frame.offsetHeight * reach },
            {
              y: () => -frame.offsetHeight * reach,
              ease: "none",
              scrollTrigger: {
                trigger: q(".mt-stage")[0],
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    });
  });

  // Cada vez que cambia el material, el mazo vuelve a su estado canónico: la
  // carta activa arriba y en su sitio, el resto abajo, chicas y ocultas. La que
  // acaba de llegar es la única que se anima, con el rebote de back.out.
  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const from = previousRef.current;
    previousRef.current = active;
    const dir = active > from ? 1 : -1;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    cards.forEach((el, i) => {
      if (i === active) return;
      const details = el.querySelectorAll(".mt-detail");
      gsap.killTweensOf([el, ...details]);
      gsap.set(el, {
        x: 0,
        rotation: 0,
        scale: REST_SCALE,
        autoAlpha: 0,
        zIndex: 1,
      });
      // Apagados, no sólo tapados por la carta: si no, asoman enteros mientras
      // la de arriba se va y recién después corre el encendido.
      gsap.set(details, { x: 0, scaleY: 0.012, autoAlpha: 0 });
      gsap.set(el.querySelectorAll(".mt-flash"), { autoAlpha: 1 });
    });

    const top = cards[active];
    gsap.killTweensOf(top);
    gsap.set(top, { x: 0, rotation: 0, scale: 1, autoAlpha: 1, zIndex: 2 });

    // Al montar (from === active) los recortes quedan apagados: los enciende el
    // ScrollTrigger cuando la sección entra, para que el primer material también
    // tenga su encendido y no aparezca ya resuelto.
    if (from === active || reduce) {
      const off = !reduce;
      gsap.set(top.querySelectorAll(".mt-detail"), {
        scaleY: off ? 0.012 : 1,
        autoAlpha: off ? 0 : 1,
      });
      gsap.set(top.querySelectorAll(".mt-flash"), { autoAlpha: off ? 1 : 0 });
      gsap.set(titleRef.current, { autoAlpha: 1, yPercent: 0 });
      return;
    }

    revealDetails(top);
    gsap.fromTo(
      titleRef.current,
      { yPercent: 55 * dir, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(2.2)" },
    );
  }, [active]);

  // Saca la carta de arriba por el costado hacia el que se la empujó. El índice
  // cambia recién al terminar el vuelo, así que el efecto de arriba encuentra a
  // la carta entrante ya visible y no hay parpadeo entre una cosa y la otra.
  const throwCard = (dir) => {
    const target = activeRef.current + dir;
    if (flyingRef.current || !exists(target)) return;
    flyingRef.current = true;

    const top = cardAt(activeRef.current);
    const under = cardAt(target);
    const width = frameRef.current?.offsetWidth ?? 400;

    gsap.set(under, { autoAlpha: 1 });
    gsap.to(under, { scale: 1, duration: 0.42, ease: "power2.out" });
    gsap.to(top, {
      x: -dir * width * 1.25,
      rotation: -dir * 14,
      duration: 0.42,
      ease: "power2.in",
      onComplete: () => {
        flyingRef.current = false;
        activeRef.current = target;
        setActive(target);
      },
    });
  };

  // No alcanzó el umbral: la carta vuelve a su lugar con un rebote corto y la
  // de abajo se esconde otra vez.
  const settle = () => {
    const card = cardAt(activeRef.current);
    gsap.to(card, { x: 0, rotation: 0, duration: 0.8, ease: "back.out(1.8)" });
    gsap.to(card.querySelectorAll(".mt-detail"), {
      x: 0,
      duration: 0.8,
      ease: "back.out(1.8)",
    });
    [1, -1].forEach((dir) => {
      const index = activeRef.current + dir;
      if (exists(index))
        gsap.to(cardAt(index), {
          scale: REST_SCALE,
          duration: 0.4,
          autoAlpha: 0,
        });
    });
  };

  const onPointerDown = (event) => {
    if (flyingRef.current) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { id: event.pointerId, originX: event.clientX, dx: 0 };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.originX;
    drag.dx = dx;

    // Sin vecino hacia ese lado la carta se resiste: sigue al dedo a un tercio
    // del recorrido y nunca llega a cruzar el umbral.
    const dir = dx < 0 ? 1 : -1;
    const free = exists(activeRef.current + dir);
    const travel = free ? dx : dx * 0.32;

    const card = cardAt(activeRef.current);
    gsap.set(card, { x: travel, rotation: travel * 0.035 });

    // Cada recorte se corre un poco más que el anterior: la profundidad es lo
    // que hace que el collage se lea como capas y no como una calcomanía.
    card.querySelectorAll(".mt-detail").forEach((el, index) => {
      gsap.set(el, { x: travel * (0.12 + index * 0.09) });
    });

    const behind = activeRef.current + dir;
    const opposite = activeRef.current - dir;
    if (exists(opposite)) gsap.set(cardAt(opposite), { autoAlpha: 0 });
    if (free) {
      const progress = Math.min(1, Math.abs(dx) / THROW_AT);
      gsap.set(cardAt(behind), {
        autoAlpha: 1,
        scale: REST_SCALE + 0.05 * progress,
      });
    }
  };

  const onPointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;

    const dir = drag.dx < 0 ? 1 : -1;
    if (Math.abs(drag.dx) >= THROW_AT && exists(activeRef.current + dir))
      throwCard(dir);
    else settle();
  };

  const item = MATERIALS.items[active];

  return (
    <section id="materiales" ref={scope} className="relative bg-paper">
      <div className="mt-stage relative flex min-h-svh w-full flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-gutter pt-[clamp(4.5rem,10vh,6.5rem)] pb-[clamp(2rem,5vh,3.5rem)]">
          {/* El encabezado sólo aparece si la altura del viewport lo permite. */}
          <div className="mt-masthead shrink-0 pb-[clamp(1.5rem,4vh,3rem)] [@media(max-height:40rem)]:hidden">
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12 md:gap-[4vw]">
              <h2 className="mt-head text-[clamp(1.9rem,3.4vw,3rem)] leading-[0.96] md:col-span-7">
                {MATERIALS.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-head hidden max-w-[26rem] text-[0.95rem] leading-[1.75] text-graphite-soft md:col-span-5 md:block">
                {MATERIALS.intro}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-8 md:flex-row md:items-center md:gap-[5vw]">
            {/* Proporción fija y, en desktop, alto fijo del que sale el ancho:
                los cinco originales van de 0.65 a 1.5, y con la caja atada al
                espacio libre cada imagen se recortaba distinto. El tope de
                58svh es lo que mantiene la sección dentro de un viewport, que
                es lo que evita que el encabezado choque con el header al
                scrollear. touch-pan-y deja intacto el scroll vertical de la
                página: sólo el arrastre horizontal llega como pointer event. */}
            <div
              ref={frameRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative aspect-square w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing md:aspect-[0.9] md:h-[64svh] md:w-auto md:shrink-0"
            >
              {MATERIALS.items.map((entry, i) => (
                <div
                  key={entry.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="invisible absolute inset-0"
                >
                  {/* En mobile la foto ocupa el marco entero, así que nada puede
                      salirse de ella; en desktop queda con aire alrededor y los
                      recortes tienen por dónde asomarse. */}
                  <figure className="absolute inset-0 overflow-hidden border border-line bg-paper md:inset-x-[10%] md:inset-y-[5%]">
                    <img
                      src={entry.image}
                      alt={entry.alt}
                      loading="lazy"
                      draggable="false"
                      className="h-full w-full object-cover"
                    />
                  </figure>

                  {entry.details?.map((detail, d) => (
                    <div
                      key={`${entry.title}-${d}`}
                      aria-hidden="true"
                      // El tercer recorte se va en mobile: a ese tamaño el
                      // collage se vuelve ruido.
                      // El parallax del scroll vive en este envoltorio y el
                      // encendido y el arrastre en el hijo: el reset del mazo
                      // hace killTweensOf sobre .mt-detail y si compartieran
                      // elemento se llevaría puesto el tween del scrub.
                      className={`mt-parallax absolute ${d > 1 ? "hidden md:block" : ""}`}
                      style={{
                        left: `${detail.x}%`,
                        top: `${detail.y}%`,
                        width: `${detail.w}%`,
                        height: `${detail.h}%`,
                      }}
                    >
                      <div className="mt-detail relative h-full w-full overflow-hidden">
                        <img
                          src={detail.image ?? entry.image}
                          alt=""
                          loading="lazy"
                          draggable="false"
                          // img-cool enfría los recortes hacia la paleta del
                          // sitio: varias de estas fotos vienen con dorados que
                          // contra el grafito y el papel cantan.
                          className="img-cool h-full w-full object-cover"
                          // Un detalle con foto propia se muestra tal cual; el
                          // zoom existe sólo para los que son un acercamiento a
                          // la foto principal.
                          style={
                            detail.zoom
                              ? {
                                  transform: `scale(${detail.zoom})`,
                                  transformOrigin: detail.crop,
                                }
                              : undefined
                          }
                        />
                        {/* La franja encendida del arranque: tapa la imagen
                          mientras el recorte es todavía una línea. */}
                        <span className="mt-flash pointer-events-none absolute inset-0 bg-paper" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-6 md:block md:max-w-[26rem] md:flex-1">
              <div className="min-w-0">
                <span
                  className="block h-px w-14 bg-bronze"
                  aria-hidden="true"
                />
                {/* Se reservan dos líneas (2em con leading-none): "Herrajes y
                    fijaciones" ocupa dos y "Terminaciones" una, y sin el
                    mínimo el bloque cambia de alto al pasar de una a otra,
                    corriendo todo lo que tiene alrededor. */}
                <h3
                  ref={titleRef}
                  className="mt-5 min-h-[2em] text-[clamp(1.75rem,4.4vw,3.4rem)] leading-none md:mt-7"
                >
                  {item.title}
                </h3>
              </div>

              <div className="flex shrink-0 gap-3 md:mt-[clamp(2.5rem,5vh,4rem)] md:gap-4">
                <NavArrow
                  dir="prev"
                  disabled={active === 0}
                  onClick={() => throwCard(-1)}
                />
                <NavArrow
                  dir="next"
                  disabled={active === COUNT - 1}
                  onClick={() => throwCard(1)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
