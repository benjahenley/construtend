// Contenido del sitio. Los datos de contacto marcados como PENDIENTE deben
// reemplazarse por los definitivos antes de publicar.
export const COMPANY = {
  name: "Construtend",
  legalName: "CONSTRUTEND S.A.",
  cuit: "30-71776067-7",
  founded: "2022",
  foundedLong: "31 de agosto de 2022",
  address: "Av. Callao 322, Piso 5, Dpto. B",
  city: "Ciudad Autónoma de Buenos Aires",
  email: "contacto@construtend.com.ar", // PENDIENTE
  phoneLabel: "+54 11 5555 5555", // PENDIENTE
  phoneHref: "+541155555555", // PENDIENTE
  whatsapp: "5491155555555", // PENDIENTE
};

export const NAV = [
  { label: "Enfoque", href: "#enfoque" },
  { label: "Capacidad", href: "#capacidad" },
  { label: "Materiales", href: "#materiales" },
  { label: "Contacto", href: "#contacto" },
];

export const HERO = {
  headline: ["Una obra", "no se levanta.", "Se coordina."],
  lead:
    "Ejecutamos construcción especializada y controlamos lo que la obra consume: el material, su traslado y el momento exacto en que llega al terreno.",
  cta: "Conversemos tu obra",
};

export const INTRO = {
  lead:
    "Construtend opera desde Buenos Aires como contratista especializado. Con los años sumó el abastecimiento y el traslado de los insumos que antes dependían de terceros.",
  statement:
    "Entre el material en bruto y la estructura terminada hay una distancia que casi nadie administra. Trabajamos exactamente ahí: en el tramo donde una obra deja de improvisar y se vuelve previsible.",
};

export const JOURNEY = {
  heading: ["Una sola", "cadena."],
  intro:
    "Tres instancias que en la mayoría de los proyectos están repartidas entre proveedores distintos. Acá responden a una misma firma.",
  stages: [
    {
      key: "origen",
      title: "Origen",
      image: "/images/origen.jpg",
      alt: "Perfilería y barras de acero apiladas en depósito",
      body:
        "El material se define antes de que la obra lo necesite. Acero, herrajes, tendido eléctrico y áridos se compran con volumen propio, de modo que el abastecimiento deje de ser un imprevisto y pase a ser una decisión ya tomada.",
    },
    {
      key: "movimiento",
      title: "Movimiento",
      image: "/images/movimiento.jpg",
      alt: "Carga de materiales de construcción para su traslado",
      body:
        "Entre el depósito y el terreno hay una logística que define plazos. La coordinamos nosotros y respondemos por el tiempo, la secuencia y el estado con el que cada partida llega al frente de trabajo.",
    },
    {
      key: "obra",
      title: "Obra",
      image: "/images/obra.jpg",
      alt: "Estructura de hormigón en ejecución",
      body:
        "La ejecución especializada cierra el ciclo. Lo que se planificó como compra y traslado se convierte en estructura, instalación y terminación, con un único responsable de principio a fin.",
    },
  ],
};

// Los recortes del collage. x/y/w/h van en porcentaje del marco, no de la foto:
// el marco es algo más grande que ella, así que un recorte en x:0 se apoya
// afuera en desktop y, en mobile —donde foto y marco coinciden— cae adentro.
// `image` es la foto del recorte. Si se omite, el recorte pasa a ser un
// acercamiento a la foto del material y ahí sí hacen falta `crop` (el punto al
// que se acerca) y `zoom` (cuánto).
export const MATERIALS = {
  heading: ["Lo que sostiene", "cada decisión."],
  items: [
    {
      image: "/images/mat-acero.jpg",
      title: "Acero y metales",
      alt: "Perfiles de acero estructural",
      details: [{ x: 1, y: 44, w: 29, h: 17, image: "/images/sec-acero.webp" }],
    },
    {
      image: "/images/mat-hormigon.jpg",
      title: "Hormigón y áridos",
      alt: "Hormigón fresco siendo colocado",
      details: [
        { x: 4, y: 9, w: 30, h: 18, image: "/images/sec-hormigon.jpeg" },
        { x: 62, y: 63, w: 26, h: 22, image: "/images/sec-hormigon-2.jpg" },
      ],
    },
    {
      image: "/images/mat-electrico.jpg",
      title: "Tendido eléctrico",
      alt: "Cableado eléctrico en instalación",
      details: [
        { x: 55, y: 21, w: 32, h: 16, image: "/images/sec-electrico-2.webp" },
        { x: 1, y: 59, w: 25, h: 15, image: "/images/sec-electrico-3.jpeg" },
        { x: 28, y: 15, w: 22, h: 20, image: "/images/sec-electrico.webp" },
      ],
    },
    {
      image: "/images/mat-ferreteria.jpg",
      title: "Herrajes y fijaciones",
      alt: "Herrajes y fijaciones metálicas",
      details: [
        { x: 0, y: 29, w: 27, h: 16, image: "/images/sec-ferreteria-2.webp" },
        { x: 50, y: 68, w: 31, h: 19, image: "/images/sec-ferreteria.jpg" },
      ],
    },
    {
      image: "/images/mat-terminacion.jpg",
      title: "Terminaciones",
      alt: "Detalle de terminación arquitectónica",
      details: [
        { x: 63, y: 39, w: 29, h: 17, image: "/images/sec-terminacion.webp" },
      ],
    },
  ],
};

export const PROOF = {
  year: COMPANY.founded,
  statement:
    "Sociedad anónima constituida en la Ciudad de Buenos Aires. Desde entonces cada proyecto se ejecuta bajo la misma premisa: una sola firma responde por el material, por su llegada y por lo que finalmente queda construido.",

};

export const FOOTER = {
  invitation: ["Conversemos", "tu próxima obra."],
  lead:
    "Contanos qué necesitás ejecutar y con qué plazo. Respondemos con un esquema de trabajo concreto.",
};
