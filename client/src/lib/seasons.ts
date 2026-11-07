import { useStore } from "../hooks/useShop";

/** Temporadas visuales del sitio. Solo la administradora la cambia, desde Configuración. */
export type SeasonId = "BASE" | "NAVIDAD" | "MUERTOS" | "AMOR";

export interface Season {
  id: SeasonId;
  name: string;
  /** Como se escribe dentro de una frase («Colección de …»). */
  inline: string;
  /** Slug de la categoría con la colección de temporada (null en la temporada base). */
  category: string | null;
  title: string;
  subtitle: string;
  cta: string;
  /** Ilustración de la portada. */
  hero: string;
  /** Paleta mostrada en el panel. */
  swatches: string[];
}

export const SEASONS: Record<SeasonId, Season> = {
  BASE: {
    id: "BASE",
    name: "Velvet cocoa",
    inline: "temporada",
    category: null,
    title: "Velas que guardan tus momentos",
    subtitle: "Recuerdos para bautizos, baby showers, bodas y XV años, y velas aromáticas hechas a mano en la Ciudad de México.",
    cta: "Ver recuerdos para eventos",
    hero: "/productos/velas/velvet-cocoa.svg",
    swatches: ["#56131B", "#71142A", "#A77F60", "#E3C8AE"],
  },
  NAVIDAD: {
    id: "NAVIDAD",
    name: "Navidad",
    inline: "Navidad",
    category: "navidad",
    title: "Esta Navidad, enciende algo especial",
    subtitle: "Pino, ponche y jengibre hechos vela: para regalar, intercambiar y vestir tu mesa de diciembre.",
    cta: "Ver colección de Navidad",
    hero: "/productos/velas/esfera-roja.svg",
    swatches: ["#7D2826", "#EFE9D7", "#898861", "#343723"],
  },
  MUERTOS: {
    id: "MUERTOS",
    name: "Día de muertos",
    inline: "Día de muertos",
    category: "dia-de-muertos",
    title: "Una luz para quienes recordamos",
    subtitle: "Cempasúchil, copal y pan de muerto para iluminar tu ofrenda y guiar el camino de regreso.",
    cta: "Ver colección de Día de muertos",
    hero: "/productos/velas/cempasuchil.svg",
    swatches: ["#2E1A3D", "#6B3590", "#F29E1F", "#C2185B"],
  },
  AMOR: {
    id: "AMOR",
    name: "Amor y amistad",
    inline: "amor y amistad",
    category: "amor-y-amistad",
    title: "Para quien hace brillar tus días",
    subtitle: "Corazones, rosas y vainilla: detalles hechos a mano para el 14 de febrero.",
    cta: "Ver colección de amor y amistad",
    hero: "/productos/velas/frasco-te-quiero.svg",
    swatches: ["#7A0F26", "#C21D3C", "#F39AAC", "#FFDFE5"],
  },
};

export const SEASON_IDS = Object.keys(SEASONS) as SeasonId[];

/** Temporada vigente: la que eligió la administradora; si no hay o ya no existe, la base. */
export function resolveSeason(setting: string | null | undefined): SeasonId {
  return setting && setting in SEASONS ? (setting as SeasonId) : "BASE";
}

export function useSeason(): Season {
  const { data: store } = useStore();
  return SEASONS[resolveSeason(store?.season)];
}
