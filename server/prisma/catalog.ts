/**
 * Catálogo de DEMOSTRACIÓN de Mafer: velas artesanales.
 * Recuerdos para eventos (bautizo, baby shower, bodas, XV años), velas de temporada
 * (Navidad, Día de muertos y Amor y amistad, que incluye las velas con forma de postre) y aromáticas.
 * Nombres, descripciones, precios (MXN) y existencias son EJEMPLOS. Las imágenes son fotos de
 * referencia recortadas sin fondo (client/public/productos/velas y client/public/productos):
 * reemplázalas por fotos propias desde el panel /admin antes de vender.
 */
import type { InventoryMode, OptionType } from "@prisma/client";

export type Opt = { name: string; type: OptionType; isRequired?: boolean; maxLength?: number; values?: [string, number][] };
export type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  short: string;
  description: string;
  price: number; // pesos
  sale?: number;
  featured?: boolean;
  mode: InventoryMode;
  stock?: number;
  low?: number; // alerta de inventario bajo
  prep: number; // horas
  variants?: [string, number][]; // [nombre, recargo en pesos]
  options?: Opt[];
  /** Ruta de la imagen; por omisión /productos/<slug>.webp */
  image?: string;
};

/** Fotos de referencia recortadas (sin fondo). */
const foto = (slug: string) => `/productos/velas/${slug}.webp`;

/** Las de temporada usan el mismo slug que la temporada en el sitio (ver client/src/lib/seasons.ts). */
export const categories = [
  { slug: "navidad", name: "Navidad", description: "Pino, ponche y jengibre para regalar y decorar en diciembre.", sortOrder: 1, imageUrl: foto("pino-nevado") },
  { slug: "dia-de-muertos", name: "Día de muertos", description: "Calaveritas, cempasúchil y pan de muerto para tu ofrenda.", sortOrder: 2, imageUrl: foto("calaverita-de-azucar") },
  { slug: "amor-y-amistad", name: "Amor y amistad", description: "Corazones, flores y velas con forma de postre para regalar.", sortOrder: 3, imageUrl: foto("frasco-te-quiero") },
  { slug: "bautizo", name: "Bautizo", description: "Velas de ceremonia y recuerdos para tus invitados.", sortOrder: 5, imageUrl: foto("frasco-bendicion") },
  { slug: "baby-shower", name: "Baby shower", description: "Recuerdos tiernos en rosa, azul o neutro.", sortOrder: 6, imageUrl: foto("frasco-oh-baby") },
  { slug: "bodas", name: "Bodas", description: "Vela de unidad y recuerdos con sus iniciales.", sortOrder: 7, imageUrl: foto("ramo-de-tulipanes") },
  { slug: "xv-y-cumpleanos", name: "XV años y cumpleaños", description: "Recuerdos en los colores de tu fiesta.", sortOrder: 8, imageUrl: foto("recuerdo-xv-anos") },
  { slug: "aromaticas", name: "Aromáticas", description: "Para todo el año: rosa velvet, flores en gel, matcha y cereza.", sortOrder: 9, imageUrl: foto("velvet-cocoa") },
];

/** Categorías que ya no se usan (postres y demostraciones anteriores): se ocultan y sus productos se archivan. */
export const retiredCategories = [
  "pasteles", "pasteles-personalizados", "cupcakes", "donas", "galletas", "pan-dulce", "postres-especiales",
  "cajas-de-regalo", "paquetes-para-eventos", "promociones", "halloween", "velas",
];

// ───────── Opciones reutilizables ─────────
const aroma: Opt = { name: "Aroma", type: "SINGLE", isRequired: true, values: [["Vainilla", 0], ["Fresa", 0], ["Chocolate", 0], ["Canela", 0], ["Sin aroma", 0]] };
const empaque: Opt = { name: "Presentación", type: "SINGLE", isRequired: true, values: [["Sin empaque", 0], ["Caja de regalo con moño", 35]] };
const tarjeta: Opt = { name: "Tarjeta con mensaje", type: "TEXT", maxLength: 120 };
const vela = [aroma, empaque, tarjeta];
const regalo = [empaque, tarjeta];

/** Recuerdos para eventos: se venden por paquete y se personalizan. */
const paquetes = (pieza: number): [string, number][] => [
  ["Paquete de 10", 0],
  ["Paquete de 25", Math.round(pieza * 25 * 0.95) - pieza * 10],
  ["Paquete de 50", Math.round(pieza * 50 * 0.9) - pieza * 10],
];
const nombreFecha: Opt = { name: "Nombre(s) y fecha para la etiqueta", type: "TEXT", isRequired: true, maxLength: 60 };
const liston = (colores: string[]): Opt => ({ name: "Color de listón", type: "SINGLE", isRequired: true, values: colores.map((c) => [c, 0]) });
const etiqueta: Opt = { name: "Etiqueta", type: "SINGLE", isRequired: true, values: [["Etiqueta impresa", 0], ["Etiqueta con foto", 4 * 10]] };
const indicaciones: Opt = { name: "Indicaciones (colores, temática, fecha del evento)", type: "TEXT", maxLength: 300 };
const recuerdo = (colores: string[]) => [nombreFecha, liston(colores), etiqueta, indicaciones];

export const products: CatalogProduct[] = [
  // ───── Navidad ─────
  { slug: "pino-nevado", name: "Pino nevado", category: "navidad", featured: true, price: 220, mode: "TRACKED", stock: 18, prep: 0, image: foto("pino-nevado"),
    short: "Arbolito de cera sobre gel rojo.",
    description: "Vela en vaso con un arbolito de cera color marfil, moño vino y base de gel rojo con brillos. Aroma a pino, menta y escarcha.",
    options: regalo },
  { slug: "ponche-navideno", name: "Ponche navideño", category: "navidad", featured: true, price: 190, mode: "TRACKED", stock: 20, prep: 0, image: foto("ponche-navideno"),
    short: "Canela, guayaba y naranja.",
    description: "Vela en vaso de vidrio decorado con acebo y ramitas de pino. Aroma a ponche: canela, guayaba, tejocote y naranja.",
    options: regalo },
  { slug: "galleta-de-jengibre", name: "Latte de jengibre", category: "navidad", price: 180, mode: "TRACKED", stock: 15, prep: 0, image: foto("galleta-de-jengibre"),
    short: "Crema, galletitas y canela.",
    description: "Vela en vaso con «crema» de cera, hombrecitos de jengibre y bastoncitos. Aroma a galleta de jengibre y café con leche.",
    options: regalo },
  { slug: "esfera-roja", name: "Vela Santa", category: "navidad", featured: true, price: 160, sale: 139, mode: "TRACKED", stock: 24, prep: 0, image: foto("esfera-roja"),
    short: "Vaso rojo con cinturón de Santa.",
    description: "Vela en vaso rojo con el cinturón y los botones de Santa. Aroma a manzana horneada con canela. Precio especial de temporada.",
    options: regalo },
  { slug: "set-navideno-mini", name: "Cupcake de Santa", category: "navidad", featured: true, price: 190, mode: "TRACKED", stock: 10, prep: 0, image: foto("set-navideno-mini"),
    short: "Crema, cereza y chispas en vaso.",
    description: "Vela en vaso con cinturón de Santa, «crema» batida de cera, chispas de colores y cereza. Aroma a vainilla y cereza.",
    options: [tarjeta] },

  { slug: "arbolito-en-vaso", name: "Arbolito de matcha", category: "navidad", price: 210, mode: "TRACKED", stock: 12, prep: 0, image: foto("arbolito-en-vaso"),
    short: "Pino de crema verde sobre gel rojo.",
    description: "Vela en vaso con un arbolito de «crema» verde, decoraciones rojas y base de gel rojo. Aroma a pino y matcha.",
    options: regalo },

  // ───── Amor y amistad ─────
  { slug: "frasco-te-quiero", name: "Frasco te quiero", category: "amor-y-amistad", featured: true, price: 210, mode: "TRACKED", stock: 16, prep: 0, image: foto("frasco-te-quiero"),
    short: "Corazones rojos en cera blanca.",
    description: "Vela en vaso con corazones rojos dentro de la cera. Aroma a rosas con frambuesa y vainilla.",
    options: regalo },
  { slug: "rosas-y-vainilla", name: "Corazones en gel rojo", category: "amor-y-amistad", price: 190, mode: "TRACKED", stock: 12, prep: 0, image: foto("rosas-y-vainilla"),
    short: "Corazoncitos sobre gel rojo.",
    description: "Vela en vaso con corazoncitos rojos y base de gel con brillos. Aroma a fresa y vainilla.",
    options: regalo },
  { slug: "set-amistad-mini", name: "Caja corazón de flores", category: "amor-y-amistad", featured: true, price: 450, mode: "TRACKED", stock: 10, prep: 0, image: foto("set-amistad-mini"),
    short: "Rosas, peonías y corazones de cera.",
    description: "Caja en forma de corazón llena de flores y corazones de cera en tonos rojo, rosa y blanco. Un regalo para guardar.",
    options: [tarjeta] },

  // ───── Día de muertos ─────
  { slug: "calaverita-de-azucar", name: "Calaverita de azúcar", category: "dia-de-muertos", featured: true, price: 240, mode: "TRACKED", stock: 12, prep: 0, image: foto("calaverita-de-azucar"),
    short: "Calavera pintada con corona de cempasúchil.",
    description: "Vela con forma de calaverita de azúcar pintada a mano, con corona de flor de cempasúchil de cera. Aroma a vainilla y canela.",
    options: regalo },
  { slug: "calavera-con-cempasuchil", name: "Calavera con cempasúchil", category: "dia-de-muertos", featured: true, price: 260, mode: "TRACKED", stock: 10, prep: 0, image: foto("calavera-con-cempasuchil"),
    short: "Calavera blanca con corona de flores.",
    description: "Vela con forma de calavera marfil coronada con flores de cempasúchil y una rosa de cera.",
    options: regalo },
  { slug: "calavera-rosa", name: "Calavera con peonía rosa", category: "dia-de-muertos", price: 260, mode: "TRACKED", stock: 8, prep: 0, image: foto("calavera-rosa"),
    short: "Calavera con peonía y pedrería.",
    description: "Vela con forma de calavera con peonía rosa de cera y pedrería en la frente.",
    options: regalo },
  { slug: "calaveras-blanca-y-negra", name: "Par de calaveras", category: "dia-de-muertos", price: 280, mode: "TRACKED", stock: 10, prep: 0, image: foto("calaveras-blanca-y-negra"),
    short: "Una negra y una marfil.",
    description: "Par de velas con forma de calavera, una negra y una marfil, para el altar o la repisa.",
    options: regalo },
  { slug: "cempasuchil", name: "Flores de cempasúchil", category: "dia-de-muertos", featured: true, price: 320, mode: "TRACKED", stock: 8, prep: 0, image: foto("cempasuchil"),
    short: "Ramito de velas de cempasúchil.",
    description: "Velas con forma de flor de cempasúchil en tonos naranja y rojo, para iluminar tu ofrenda.",
    options: regalo },
  { slug: "pan-de-muerto", name: "Pan de muerto", category: "dia-de-muertos", price: 180, mode: "TRACKED", stock: 15, prep: 0, image: foto("pan-de-muerto"),
    short: "Vela con forma de pan de muerto.",
    description: "Vela con forma de pan de muerto con «azúcar», aroma a azahar y mantequilla.",
    options: regalo },
  { slug: "veladora-catrina", name: "Veladora catrina", category: "dia-de-muertos", price: 190, mode: "TRACKED", stock: 15, prep: 0, image: foto("veladora-catrina"),
    short: "Vaso con etiqueta de catrina.",
    description: "Veladora en vaso con flores de cempasúchil de cera y etiqueta de catrina de Día de muertos.",
    options: regalo },
  { slug: "veladoras-de-ofrenda", name: "Veladoras con nombre", category: "dia-de-muertos", featured: true, price: 150, mode: "MADE_TO_ORDER", prep: 72, image: foto("veladoras-de-ofrenda"),
    short: "Con el nombre de tu ser querido.",
    description: "Veladora en vaso con papel picado y el nombre de tu ser querido, coronada con flor de cera. Se elabora sobre pedido.",
    options: [{ name: "Nombre para la veladora", type: "TEXT", isRequired: true, maxLength: 30 }, { name: "Color del papel picado", type: "SINGLE", isRequired: true, values: [["Rosa mexicano", 0], ["Morado", 0], ["Naranja", 0], ["Azul", 0]] }] },
  { slug: "mascotas-de-ofrenda", name: "Mascotas de ofrenda", category: "dia-de-muertos", price: 280, mode: "MADE_TO_ORDER", prep: 72, image: foto("mascotas-de-ofrenda"),
    short: "Gatito y perrito esqueleto.",
    description: "Par de velas con forma de gatito y perrito esqueleto, para recordar a tus mascotas en la ofrenda.",
    options: [tarjeta] },
  { slug: "perrito-alebrije", name: "Perrito alebrije", category: "dia-de-muertos", price: 290, mode: "MADE_TO_ORDER", prep: 72, image: foto("perrito-alebrije"),
    short: "Perrito pintado a mano con flores.",
    description: "Vela con forma de perrito decorado como alebrije, con flores y corazón pintados a mano.",
    options: [tarjeta] },

  // ───── Bautizo ─────
  { slug: "vela-de-bautizo", name: "Vela de bautizo con perlas", category: "bautizo", featured: true, price: 480, mode: "MADE_TO_ORDER", prep: 120, image: foto("vela-de-bautizo"),
    short: "Pilar con perlas y el nombre del bebé.",
    description: "Vela de pilar blanca con aplicación de perlas, encaje y el nombre y la fecha del bautizo. Se elabora sobre pedido.",
    options: [nombreFecha, liston(["Blanco", "Dorado", "Azul cielo", "Rosa palo"]), indicaciones] },
  { slug: "recuerdo-bautizo-mini", name: "Recuerdo ángel", category: "bautizo", featured: true, price: 350, mode: "MADE_TO_ORDER", prep: 168, image: foto("recuerdo-bautizo-mini"),
    short: "Angelitos de cera para tus invitados, desde $35 por pieza.",
    description: "Angelitos de cera de soya con corazón calado, en bolsita de organza con etiqueta personalizada. Se venden por paquete; para más de 50 piezas cotiza por WhatsApp.",
    variants: paquetes(35), options: recuerdo(["Blanco", "Dorado", "Azul cielo", "Rosa palo"]) },
  { slug: "frasco-bendicion", name: "Angelita rosa", category: "bautizo", price: 95, mode: "MADE_TO_ORDER", prep: 120, image: foto("frasco-bendicion"),
    short: "Angelita de cera para niña.",
    description: "Vela con forma de angelita rosa con aureola dorada, ideal para recuerdo de bautizo de niña o para la mesa de los padrinos.",
    options: [nombreFecha, liston(["Blanco", "Dorado", "Azul cielo", "Rosa palo"])] },

  { slug: "cirio-de-bautizo", name: "Cirio de bautizo azul", category: "bautizo", price: 350, mode: "MADE_TO_ORDER", prep: 120, image: foto("cirio-de-bautizo"),
    short: "Cirio con cordón azul y moño.",
    description: "Cirio blanco forrado con cordón azul, moño de listón y detalle dorado, para la ceremonia. Se elabora sobre pedido.",
    options: [nombreFecha, liston(["Azul cielo", "Rosa palo", "Blanco", "Dorado"])] },

  // ───── Baby shower ─────
  { slug: "frasco-oh-baby", name: "Osito de baby shower", category: "baby-shower", featured: true, price: 85, mode: "MADE_TO_ORDER", prep: 120, image: foto("frasco-oh-baby"),
    short: "Osito de cera con moño azul o rosa.",
    description: "Vela con forma de osito con moño de listón. Elige el color del moño y agrega etiqueta con el nombre del bebé.",
    options: [{ name: "Color", type: "SINGLE", isRequired: true, values: [["Azul cielo", 0], ["Rosa", 0], ["Neutro (crema)", 0]] }, nombreFecha] },
  { slug: "recuerdo-huellitas-mini", name: "Velas burbuja con corazones", category: "baby-shower", price: 320, mode: "MADE_TO_ORDER", prep: 168, image: foto("recuerdo-huellitas-mini"),
    short: "Burbujas y arcos con corazoncitos, desde $32 por pieza.",
    description: "Velas de cera de soya en forma de burbuja, arco y columna con corazoncitos rojos. Se venden por paquete.",
    variants: paquetes(32), options: recuerdo(["Rosa", "Azul cielo", "Amarillo pastel", "Blanco"]) },
  { slug: "pilar-baby-mono", name: "Angelito con corazón", category: "baby-shower", price: 150, mode: "MADE_TO_ORDER", prep: 72, image: foto("pilar-baby-mono"),
    short: "Angelito de cera con corazón azul.",
    description: "Vela con forma de angelito abrazando un corazón azul, para decorar la mesa principal o como regalo para la mamá.",
    options: [liston(["Rosa", "Azul cielo", "Amarillo pastel"])] },

  // ───── Bodas ─────
  { slug: "vela-de-unidad", name: "Vela de unidad", category: "bodas", featured: true, price: 650, mode: "MADE_TO_ORDER", prep: 168, image: foto("vela-de-unidad"),
    short: "Par de velas altas con moño.",
    description: "Par de velas altas color marfil con textura de perlas y moño de satín, para el ritual de unidad. Con los nombres de los novios y la fecha.",
    options: [nombreFecha, liston(["Marfil", "Dorado", "Champaña", "Verde salvia"]), indicaciones] },
  { slug: "recuerdo-boda-frasco", name: "Peonía en vaso", category: "bodas", featured: true, price: 450, mode: "MADE_TO_ORDER", prep: 168, image: foto("recuerdo-boda-frasco"),
    short: "Desde $45 por pieza, con sus iniciales.",
    description: "Vela en vaso con peonía de cera y base de hoja dorada. Etiqueta con las iniciales y la fecha de la boda. Se vende por paquete; para más de 50 piezas cotiza por WhatsApp.",
    variants: paquetes(45), options: recuerdo(["Marfil", "Dorado", "Champaña", "Verde salvia"]) },
  { slug: "pilar-iniciales", name: "Pilar con rosas doradas", category: "bodas", price: 280, mode: "MADE_TO_ORDER", prep: 120, image: foto("pilar-iniciales"),
    short: "Para la mesa de honor.",
    description: "Vela de pilar marfil con rosas doradas, perlas y mariposas, y las iniciales de los novios. Ideal para la mesa de honor.",
    options: [nombreFecha] },

  { slug: "ramo-de-tulipanes", name: "Ramo de tulipanes", category: "bodas", featured: true, price: 320, mode: "MADE_TO_ORDER", prep: 120, image: foto("ramo-de-tulipanes"),
    short: "Ramo de tulipanes blancos de cera.",
    description: "Vela con forma de ramo de tulipanes blancos atado con moño de satín. Para la mesa de honor o como regalo para la novia.",
    options: [nombreFecha] },

  // ───── XV años y cumpleaños ─────
  { slug: "recuerdo-xv-anos", name: "Peonía en caja rosa", category: "xv-y-cumpleanos", featured: true, price: 90, mode: "MADE_TO_ORDER", prep: 120, image: foto("recuerdo-xv-anos"),
    short: "Peonía de cera con nube y moño.",
    description: "Vela de peonía blanca en caja rosa con flor de nube y moño de satín. En los colores de la fiesta, con el nombre de la quinceañera.",
    options: [{ name: "Color", type: "SINGLE", isRequired: true, values: [["Rosa", 0], ["Lila", 0], ["Azul", 0], ["Verde menta", 0]] }, nombreFecha] },
  { slug: "recuerdo-cumpleanos-mini", name: "Mini helados de cera", category: "xv-y-cumpleanos", price: 300, mode: "MADE_TO_ORDER", prep: 120, image: foto("recuerdo-cumpleanos-mini"),
    short: "Cupcakes helado en colores pastel, desde $30 por pieza.",
    description: "Velas con forma de cupcake helado en verde menta, rosa y amarillo, con cereza. Se venden por paquete.",
    variants: paquetes(30), options: recuerdo(["Rosa", "Azul", "Amarillo", "Multicolor"]) },

  // ───── Aromáticas ─────
  { slug: "velvet-cocoa", name: "Rosa velvet", category: "aromaticas", featured: true, price: 240, mode: "TRACKED", stock: 16, prep: 0, image: foto("velvet-cocoa"),
    short: "Rosa roja de cera, en vaso con tapa.",
    description: "Vela en vaso con rosa roja de cera y tapa de madera, con etiqueta personalizada. Aroma a cacao, rosa seca y vainilla.",
    options: regalo },
  { slug: "ambar", name: "Flores en gel", category: "aromaticas", featured: true, price: 180, mode: "TRACKED", stock: 20, prep: 0, image: foto("ambar"),
    short: "Flores naturales suspendidas.",
    description: "Vela de gel transparente con flores naturales rosas y blancas suspendidas. Aroma suave a flores blancas.",
    options: regalo },
  { slug: "coco-y-vainilla", name: "Cereza y vainilla", category: "aromaticas", price: 160, mode: "TRACKED", stock: 18, prep: 0, image: foto("coco-y-vainilla"),
    short: "Capas de crema y cerezas.",
    description: "Vela en vaso con capas de crema, chocolate y cerezas de cera. Aroma a cereza y vainilla.",
    options: regalo },
  { slug: "eucalipto-y-menta", name: "Matcha latte", category: "aromaticas", price: 170, mode: "TRACKED", stock: 4, low: 5, prep: 0, image: foto("eucalipto-y-menta"),
    short: "Té verde, leche y vainilla.",
    description: "Vela en vaso con capas verde y crema que imitan un matcha latte con hielo. Aroma a té verde y vainilla.",
    options: regalo },

  // ───── Velas postre (en Amor y amistad) ─────
  { slug: "vela-pastelito-fresas", name: "Vela pastelito de fresas", category: "amor-y-amistad", featured: true, price: 320, mode: "TRACKED", stock: 8, prep: 0,
    short: "Vela de cera de soya con forma de shortcake de fresa.",
    description: "Vela artesanal de cera de soya con forma de pastelito de fresas con crema y bola de helado. Decorativa y aromática. No es comestible.",
    options: vela },
  { slug: "vela-cupcake-chocolate", name: "Vela cupcake de chocolate", category: "amor-y-amistad", featured: true, price: 260, mode: "TRACKED", stock: 10, prep: 0,
    short: "Cupcake de cera con chocolate y tableta.",
    description: "Vela con forma de cupcake de vainilla bañado en chocolate, con trocitos y tableta de chocolate. No es comestible.",
    options: vela },
  { slug: "vela-cheesecake-mora", name: "Vela cheesecake de mora", category: "amor-y-amistad", price: 280, mode: "TRACKED", stock: 6, prep: 0,
    short: "Mini cheesecake de cera con moras.",
    description: "Vela con forma de mini cheesecake con cubierta de mora y moras azules. No es comestible.",
    options: vela },
  { slug: "vela-pastel-rosa-galleta", name: "Vela pastel rosa con galleta", category: "amor-y-amistad", price: 290, mode: "TRACKED", stock: 7, prep: 0,
    short: "Pastelito rosa con glaseado, galleta y fresa.",
    description: "Vela con forma de pastelito rosa con glaseado blanco escurrido, galleta y fresa. No es comestible.",
    options: vela },
  { slug: "vela-vaso-fresas-crema", name: "Vela vaso de fresas con crema", category: "amor-y-amistad", price: 340, mode: "TRACKED", stock: 5, prep: 0,
    short: "Vaso de vidrio con fresas, crema y galletas de cera.",
    description: "Vela en vaso de vidrio reutilizable con capas de fresa y crema, decorada con fresas y galletitas. No es comestible.",
    options: vela },
  { slug: "velas-pastel-corazon", name: "Set de velas pastel corazón", category: "amor-y-amistad", price: 420, sale: 359, mode: "TRACKED", stock: 4, prep: 0,
    short: "Dos velas: corazón con moño y pastelito con fresas.",
    description: "Set de dos velas estilo vintage: un corazón rosa con moño y un pastelito blanco con fresas. Precio especial por tiempo limitado. No son comestibles.",
    options: vela },
  { slug: "velas-croissant-frambuesa", name: "Set de 4 velas croissant", category: "amor-y-amistad", featured: true, price: 380, mode: "TRACKED", stock: 6, prep: 0,
    short: "Cuatro croissants de cera con crema y frambuesas.",
    description: "Set de cuatro velas con forma de croissant con crema y frambuesas. Lindas para centros de mesa. No son comestibles.",
    options: vela },
  { slug: "velas-copa-helado", name: "Vela copa de helado", category: "amor-y-amistad", price: 220, mode: "TRACKED", stock: 12, prep: 0,
    short: "Bola de helado de cera en copa de vidrio.",
    description: "Vela con forma de helado en copa de vidrio, con cereza. Disponible en rosa, vainilla o azul. No es comestible.",
    options: [{ name: "Color", type: "SINGLE", isRequired: true, values: [["Rosa", 0], ["Vainilla", 0], ["Azul", 0]] }, ...vela] },
  { slug: "velas-cupcake-helado", name: "Vela cupcake helado", category: "amor-y-amistad", price: 190, mode: "TRACKED", stock: 15, prep: 0,
    short: "Cupcake de cera en colores pastel.",
    description: "Vela con forma de cupcake con bola de helado en colores pastel y frutitas. No es comestible.",
    options: [{ name: "Color", type: "SINGLE", isRequired: true, values: [["Rosa", 0], ["Amarillo", 0], ["Verde menta", 0], ["Azul", 0]] }, ...vela] },
  { slug: "velas-gelatina-rosa", name: "Set de velas gelatina rosa", category: "amor-y-amistad", price: 350, mode: "TRACKED", stock: 2, low: 3, prep: 0,
    short: "Tres gelatinas de cera y vela de burbujas corazón.",
    description: "Set de tres velas con forma de gelatina en capas rosa y crema, más una vela de burbujas de corazones. No son comestibles.",
    options: vela },
];
