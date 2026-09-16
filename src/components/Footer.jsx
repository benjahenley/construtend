import { COMPANY, FOOTER } from "../data";
import Logo from "./Logo";
import { gsap, EASE, EASE_EXPO, useGsap } from "../lib/anim";

// Las hojas de la cresta, de la más alta a la que apoya sobre el footer: el
// mismo gris enfriándose hasta el graphite del fondo. Los saltos son amplios a
// propósito —el apilado se lee por diferencia de tono, no por líneas— y se
// achican hacia abajo, como se juntan las páginas al apoyarse en la mesa.
const CREST_SHEETS = ["#737a84", "#565d67", "#3c424a", "#272b31", "#16181b"];

const Channel = ({ href, label, value }) => (
  <a href={href} className="group block py-2">
    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
      {label}
    </span>
    <span className="relative mt-1 inline-block text-[0.95rem] text-paper">
      {value}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-bronze transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full" />
    </span>
  </a>
);

export default function Footer() {
  const scope = useGsap((self) => {
    const q = self.selector;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(q(".ft-reveal"), {
        opacity: 0,
        y: 24,
        duration: 1.1,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: { trigger: q(".ft-top")[0], start: "top 80%" },
      });

      const wordmark = q(".ft-wordmark")[0];
      gsap.from(q(".ft-wordmark-inner"), {
        yPercent: 110,
        duration: 1.4,
        ease: EASE_EXPO,
        scrollTrigger: { trigger: wordmark, start: "top 92%" },
      });
    });
  });

  return (
    <footer id="contacto" ref={scope} className="relative text-paper">
      {/* El fondo va en blanco, el de la sección que entrega el scroll: los
          triángulos que el pico deja libres a los costados son parte de ella. */}
      <div
        aria-hidden="true"
        data-nav-white
        className="ft-crest relative bg-white"
        style={{ "--crest-sheets": CREST_SHEETS.length }}
      >
        {CREST_SHEETS.map((shade, i) => (
          <div
            key={shade}
            className="ft-crest-sheet"
            style={{ top: `calc(var(--crest-step) * ${i})`, background: shade }}
          />
        ))}
      </div>

      <div data-nav-dark className="bg-graphite">
        <div className="mx-auto w-full max-w-[1680px] px-gutter pt-[clamp(3rem,9vh,6rem)] pb-10">
          <div className="ft-top grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-[4vw]">
            <div className="md:col-span-7">
              <h2 className="ft-reveal text-[clamp(2.4rem,6vw,5rem)] leading-[0.96]">
                {FOOTER.invitation.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <div className="md:col-span-5 md:pt-2">
              <p className="ft-reveal max-w-[26rem] text-[0.95rem] leading-[1.75] text-steel-2">
                {FOOTER.lead}
              </p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="ft-reveal group relative mt-8 inline-flex items-center gap-4 overflow-hidden border border-line-invert px-7 py-4"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0"
                />
                <span className="eyebrow relative z-10 transition-colors duration-[650ms] group-hover:text-graphite">
                  Escribirnos
                </span>
              </a>
            </div>
          </div>

          <div className="mt-[clamp(4rem,10vh,7rem)] grid grid-cols-1 gap-y-10 border-t border-line-invert pt-10 sm:grid-cols-2 md:grid-cols-12 md:gap-[4vw]">
            <div className="md:col-span-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
                Domicilio
              </p>
              <p className="mt-3 text-[0.95rem] leading-[1.7] text-paper">
                {COMPANY.address}
                <br />
                {COMPANY.city}
              </p>

              <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
                Referente
              </p>
              <p className="mt-3 text-[0.95rem] leading-[1.7] text-paper">
                {COMPANY.contactName}
                <br />
                <span className="text-steel-2">{COMPANY.contactRole}</span>
              </p>
            </div>

            <div className="md:col-span-4">
              <Channel href={`mailto:${COMPANY.email}`} label="Correo" value={COMPANY.email} />
              <Channel href={`tel:${COMPANY.phoneHref}`} label="Teléfono" value={COMPANY.phoneLabel} />
              <Channel
                href={`https://wa.me/${COMPANY.whatsapp}`}
                label="WhatsApp"
                value="Enviar mensaje"
              />
            </div>

            <div className="md:col-span-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
                Identificación
              </p>
              <dl className="mt-3 text-[0.95rem] leading-[1.7]">
                <div className="flex gap-3">
                  <dt className="text-steel">Razón social</dt>
                  <dd>{COMPANY.legalName}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-steel">CUIT</dt>
                  <dd>{COMPANY.cuit}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* La firma es el logo completo —cubo y logotipo—, en monocromo paper:
              el svg ya trae las dos piezas a la misma escala, así que basta con
              darle el ancho de la columna para que entren juntas. */}
          <h2 className="ft-wordmark line-mask mt-[clamp(4rem,12vh,8rem)]">
            <span className="sr-only">{COMPANY.name}</span>
            <Logo
              className="ft-wordmark-inner block h-auto w-full text-paper"
              topFill="currentColor"
            />
          </h2>

          <div className="mt-10 flex flex-col gap-3 border-t border-line-invert pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
              © {new Date().getFullYear()} {COMPANY.legalName}
            </p>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
              Buenos Aires, Argentina
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
