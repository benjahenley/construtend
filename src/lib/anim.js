import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE = "power3.out";
export const EASE_EXPO = "expo.out";

/**
 * Splits an element's text into word spans wrapped in overflow-hidden masks so
 * words can be swept up from behind a line. Returns the inner (animatable) nodes.
 */
export function splitWords(el) {
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const nodes = [];
  text.split(/(\s+)/).forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(" "));
      return;
    }
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = word;
    inner.setAttribute("aria-hidden", "true");
    mask.appendChild(inner);
    el.appendChild(mask);
    nodes.push(inner);
  });
  return nodes;
}

/**
 * Primes SVG strokes for a draw-on reveal and returns them ready to tween
 * (`strokeDashoffset: 0`). Avoids needing GSAP's paid DrawSVG plugin.
 */
export function primeStrokes(nodes) {
  const list = Array.from(nodes);
  list.forEach((node) => {
    const length = node.getTotalLength();
    gsap.set(node, { strokeDasharray: length, strokeDashoffset: length });
  });
  return list;
}

/**
 * Scoped GSAP effects with automatic cleanup on unmount and on StrictMode's
 * double-invoke. Attach the returned ref to the component's root element.
 */
export function useGsap(setup, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(setup, scope.current || undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
