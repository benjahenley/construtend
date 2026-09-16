// La marca como axonométrica explotada. Cada cara vive en dos grupos anidados:
// el externo lo mueve el scroll (GSAP, vía .cube-shift) y el interno el hover
// (CSS, vía .cube-face), de modo que las dos animaciones nunca escriben sobre
// la misma transform. Los data-dx/dy son los ejes del cubo proyectados a
// pantalla: la tapa sale recto hacia arriba y los laterales por las diagonales
// isométricas de ±30°. El svg va con overflow visible porque el vértice de la
// tapa apoya justo en y=0: sin eso, todo recorrido hacia arriba se recorta.
export default function Cube({ className = "" }) {
  return (
    <svg
      viewBox="0 0 112 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`cube overflow-visible text-graphite ${className}`}
    >
      {/* Área de hover continua: sin esto el puntero sólo cuenta sobre el
          relleno de cada cara y el gesto se corta entre una y otra. */}
      <rect width="112" height="128" fill="transparent" />

      <g className="cube-shift" data-dx="0" data-dy="-20">
        <g className="cube-face cube-face-top">
          <path fill="var(--color-bronze)" d="M56 0L108.536 30.333L56 60.667L3.464 30.333L56 0Z" />
        </g>
      </g>

      <g className="cube-shift" data-dx="-17.3" data-dy="10">
        <g className="cube-face cube-face-left">
          <path fill="currentColor" d="M0 36.333L52.536 66.667V127.333L0 97V36.333Z" />
        </g>
      </g>

      <g className="cube-shift" data-dx="17.3" data-dy="10">
        <g className="cube-face cube-face-right">
          <path fill="currentColor" d="M59.464 66.667L112 36.333V97L59.464 127.333V66.667Z" />
        </g>
      </g>
    </svg>
  );
}
