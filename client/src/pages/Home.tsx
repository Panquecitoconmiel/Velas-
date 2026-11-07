import { useQuery } from "@tanstack/react-query";
import { Flame, Gift, MessageCircle, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductCard";
import { SeasonDecor } from "../components/SeasonDecor";
import { ContactInfo, DeliveryInfo, FAQ } from "../components/StoreInfo";
import { ErrorState, ProductImage, Spinner } from "../components/ui";
import { useCategories, useStore } from "../hooks/useShop";
import { asset } from "../lib/asset";
import { SEASONS, useSeason } from "../lib/seasons";
import { whatsappLink } from "../lib/whatsapp";
import { api } from "../services/api";

const PASTEL = ["bg-rosa-100", "bg-celeste", "bg-vainilla", "bg-durazno-100"];
const EVENTOS = ["bautizo", "baby-shower", "bodas", "xv-y-cumpleanos"];

/** Encabezado de sección: título a la izquierda, enlace a la derecha. */
function Section({ id, title, intro, link, band, children }: {
  id?: string; title: string; intro?: string; link?: { to: string; label: string }; band?: boolean; children: ReactNode;
}) {
  const head = (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="max-w-2xl">
        <h2 className="titulo-dulce">{title}</h2>
        {intro && <p className="mt-1.5 text-[15px] text-cafe-500">{intro}</p>}
      </div>
      {link && (
        <Link to={link.to} className="text-sm font-bold text-rosa-600 underline-offset-4 hover:underline">
          {link.label}
        </Link>
      )}
    </div>
  );
  if (band) {
    return (
      <section id={id} className="relative mt-20 bg-durazno-100 py-14 sm:mt-24">
        <div className="contenedor">{head}{children}</div>
      </section>
    );
  }
  return (
    <section id={id} className="contenedor mt-20 sm:mt-24">
      {head}
      {children}
    </section>
  );
}

function ProductSection(props: { query: Record<string, string | number>; title: string; intro?: string; link?: { to: string; label: string }; hideIfEmpty?: boolean; band?: boolean; id?: string }) {
  const { query, hideIfEmpty, ...section } = props;
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["products", query], queryFn: () => api.products(query) });
  if (isLoading) return <Section {...section}><Spinner /></Section>;
  if (isError) return <Section {...section}><ErrorState message="No pudimos cargar los productos." onRetry={refetch} /></Section>;
  if (!data?.items.length && hideIfEmpty) return null;
  return <Section {...section}>{data?.items.length ? <ProductGrid products={data.items} /> : <p className="text-sm text-cafe-500">Pronto tendremos novedades aquí.</p>}</Section>;
}

const PROMESAS = [
  { Icon: Flame, title: "Hechas a mano", text: "Cera de soya y aromas elegidos en pequeños lotes." },
  { Icon: Gift, title: "Personalizadas", text: "Nombres, fecha y colores para los recuerdos de tu evento." },
  { Icon: ShieldCheck, title: "Pago seguro o por WhatsApp", text: "Paga con tarjeta o cotiza tu pedido por mayoreo." },
];

export default function Home() {
  const { data: categories } = useCategories();
  const { data: store } = useStore();
  const season = useSeason();
  const byslug = new Map((categories ?? []).map((c) => [c.slug, c]));
  const eventos = EVENTOS.map((s) => byslug.get(s)).filter((c) => c && c.productCount > 0);
  const seasonal = (Object.values(SEASONS) as (typeof SEASONS)[keyof typeof SEASONS][])
    .filter((s) => s.category && s.id !== season.id)
    .map((s) => byslug.get(s.category!))
    .filter((c) => c && c.productCount > 0);
  const waText = `¡Hola, ${store?.storeName ?? "Mafer"}! Quiero cotizar velas para mi evento.`;

  return (
    <>
      {/* Portada de temporada: fondo oscuro, vela grande encendida */}
      <section className="relative isolate overflow-hidden bg-noche text-noche-texto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_45%,var(--color-noche-2)_0%,transparent_62%)]" aria-hidden="true" />
        <SeasonDecor key={season.id} id={season.id} />
        <div className="contenedor grid min-h-[min(86vh,46rem)] items-center gap-6 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div className="relative text-center md:text-left">
            <p className="font-semibold text-brillo">{season.category ? `Colección de ${season.inline}` : "Hechas a mano en la Ciudad de México"}</p>
            <h1 className="mt-4 text-[2.9rem] leading-[0.98] font-semibold text-noche-texto sm:text-[4.4rem] lg:text-[5.2rem]">{season.title}</h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-noche-texto/80 md:mx-0">{season.subtitle}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to={season.category ? `/categoria/${season.category}` : "#eventos"} className="btn bg-brillo px-8 py-3.5 text-[15px] font-bold text-noche hover:brightness-110">{season.cta}</Link>
              <a href={whatsappLink(store?.whatsapp, waText)} target="_blank" rel="noreferrer noopener" className="btn border border-noche-texto/35 px-7 py-3.5 text-[15px] font-bold text-noche-texto hover:bg-noche-texto/10">
                <MessageCircle className="size-4" /> Cotizar por WhatsApp
              </a>
            </div>
          </div>
          <div className="relative order-first flex justify-center md:order-none">
            <div className="halo-vela absolute top-[2%] left-1/2 aspect-square w-[min(92vw,34rem)] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brillo)_45%,transparent)_0%,transparent_65%)]" aria-hidden="true" />
            <img src={asset(season.hero)} alt="" className="vela-flota relative w-[min(78vw,32rem)] drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]" />
            <div className="absolute bottom-[4%] left-1/2 h-6 w-[min(55vw,20rem)] -translate-x-1/2 rounded-[50%] bg-black/30 blur-md" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Lo que distingue a Mafer */}
      <section className="relative border-b border-rosa-100 bg-white">
        <ul className="contenedor grid divide-rosa-100 py-6 sm:grid-cols-3 sm:divide-x">
          {PROMESAS.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3.5 py-3 sm:justify-center sm:px-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-rosa-100 text-rosa-600"><Icon className="size-5" /></span>
              <span>
                <span className="block font-display text-[16px] font-semibold text-cafe-900">{title}</span>
                <span className="block text-sm text-cafe-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Colección de la temporada vigente */}
      {season.category && (
        <ProductSection
          query={{ category: season.category, pageSize: 8, sort: "popular" }}
          title={`Colección de ${season.inline}`}
          intro="Para regalar, intercambiar o decorar. Apártalas con tiempo: se producen en lotes pequeños."
          link={{ to: `/categoria/${season.category}`, label: "Ver toda la colección" }}
          hideIfEmpty
        />
      )}

      {/* Recuerdos para eventos */}
      {eventos.length > 0 && (
        <Section id="eventos" title="Recuerdos para tu evento" intro="Velas personalizadas con nombres, fecha y los colores de tu celebración. Se venden por paquete de 10, 25 o 50 piezas.">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {eventos.map((c, i) => (
              <Link key={c!.id} to={`/categoria/${c!.slug}`} className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[2rem] p-5 ${PASTEL[i % PASTEL.length]} transition hover:shadow-[var(--shadow-elevada)]`}>
                <ProductImage src={c!.imageUrl} alt="" className="mx-auto w-[86%] flex-1 transition duration-700 group-hover:scale-[1.06]" />
                <span className="mt-2 font-display text-[1.35rem] leading-tight font-semibold text-cafe-900 sm:text-[1.6rem]">{c!.name}</span>
                <span className="mt-1 text-sm text-cafe-500">{c!.description}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Por pieza o por mayoreo */}
      <section className="contenedor mt-20 sm:mt-24">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] bg-rosa-100 p-8 sm:p-10">
            <h2 className="titulo-dulce">¿Una vela para regalar?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-cafe-700">Elige tu vela, agrégala al carrito y paga con tarjeta. Puedes pedir caja de regalo y tarjeta con mensaje.</p>
            <Link to="/catalogo" className="btn-primario mt-6 px-7">Comprar por pieza</Link>
          </div>
          <div className="rounded-[2rem] bg-noche p-8 text-noche-texto sm:p-10">
            <h2 className="titulo-dulce text-noche-texto">¿Recuerdos para tu evento?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-noche-texto/80">Cuéntanos cuántas piezas, los colores y la fecha. Te mandamos tu cotización y el diseño de la etiqueta por WhatsApp.</p>
            <a href={whatsappLink(store?.whatsapp, waText)} target="_blank" rel="noreferrer noopener" className="btn mt-6 bg-brillo px-7 font-bold text-noche hover:brightness-110">
              <MessageCircle className="size-4" /> Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <ProductSection query={{ featured: "true", pageSize: 8, sort: "popular" }} title="Favoritas de nuestras clientas" link={{ to: "/catalogo", label: "Ver catálogo" }} />
      <ProductSection query={{ category: "aromaticas", pageSize: 4, sort: "popular" }} title="Aromáticas para todo el año" intro="Rosa velvet, flores en gel, matcha y cereza en vasos de vidrio reutilizables." link={{ to: "/categoria/aromaticas", label: "Ver aromáticas" }} hideIfEmpty band />
      {season.id !== "AMOR" && <ProductSection query={{ category: "amor-y-amistad", pageSize: 4, sort: "popular" }} title="Amor y amistad" intro="Corazones, flores y velas que parecen postre (no son comestibles)." link={{ to: "/categoria/amor-y-amistad", label: "Ver todas" }} hideIfEmpty />}

      {seasonal.length > 0 && (
        <Section title="Otras temporadas" intro="Aparta con tiempo las velas de tu próxima celebración.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {seasonal.map((c, i) => (
              <Link key={c!.id} to={`/categoria/${c!.slug}`} className={`group flex items-center gap-3 rounded-2xl p-3 ${PASTEL[(i + 1) % PASTEL.length]} hover:shadow-[var(--shadow-suave)]`}>
                <ProductImage src={c!.imageUrl} alt="" className="size-16 shrink-0" />
                <span className="font-display text-[16px] font-semibold text-cafe-900 group-hover:text-rosa-600">{c!.name}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {store && (
        <>
          <Section id="entregas" title="Pedidos y entregas">
            <DeliveryInfo s={store} />
          </Section>
          <section className="contenedor mt-20 grid gap-10 sm:mt-24 lg:grid-cols-[1.4fr_1fr]">
            <div id="preguntas">
              <h2 className="titulo-dulce mb-6">Preguntas frecuentes</h2>
              <FAQ s={store} />
            </div>
            <div id="contacto">
              <h2 className="titulo-dulce mb-6">Contacto</h2>
              <div className="tarjeta p-6">
                <ContactInfo s={store} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
