import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const featuredProducts = [
  {
    name: "Estante Nuvem",
    material: "MDF Cru",
    description:
      "Formato nuvem com bordas roliças. Encaixes à vista como ornamento.",
    imageSrc: "/images/produto-estante-nuvem.jpg",
    imageAlt: "Estante Nuvem em MDF cru com encaixes à vista",
    href: "/colecao",
  },
  {
    name: "Banco Pebble",
    material: "MDF Sálvia",
    description:
      "Forma pebble de baixo centro de gravidade. Seguro desde os primeiros passos.",
    imageSrc: "/images/produto-banco-pebble.jpg",
    imageAlt: "Banco Pebble em MDF na cor sálvia",
    href: "/colecao",
  },
  {
    name: "Mesa Baixa",
    material: "MDF Cru",
    description: "Cantos arredondados, altura ideal para atividades no chão.",
    imageSrc: "/images/produto-mesa-baixa.jpg",
    imageAlt: "Mesa baixa em MDF cru para crianças",
    href: "/colecao",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-papel min-h-[88vh] flex flex-col justify-center px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto w-full py-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-6">
              Atelier Brasileiro
            </p>
            <h1 className="text-[clamp(72px,14vw,160px)] font-black uppercase tracking-[0.14em] text-carbono leading-none">
              KOBO
            </h1>
            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.28em] text-pedra">
              MÓVEIS QUE BRINCAM
            </p>
          </div>
        </section>

        {/* Manifesto */}
        <section className="bg-osso px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-8">
              Manifesto
            </p>
            <p className="text-lg md:text-xl font-normal text-tinta leading-relaxed">
              Móveis feitos com honestidade. O MDF aparece como é, os encaixes
              ficam à vista, as bordas são roliças. Nada é disfarçado.
            </p>
            <p className="text-lg md:text-xl font-normal text-tinta leading-relaxed mt-4">
              Peças lúdicas sem serem infantilizadas. Projetadas para brincar,
              mas desenhadas para durar além da infância.
            </p>
          </div>
        </section>

        {/* Produtos em destaque */}
        <section className="bg-papel px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-2">
                  Coleção
                </p>
                <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-carbono">
                  DESTAQUES
                </h2>
              </div>
              <Link
                href="/colecao"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-pedra hover:text-carbono transition-colors"
              >
                Ver tudo →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.name} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Atelier */}
        <section className="bg-grafite px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-3">
                Processo
              </p>
              <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-papel">
                O ATELIER
              </h2>
              <p className="text-sm font-normal text-cinza-claro mt-3 max-w-md leading-relaxed">
                Cada peça é fabricada no atelier em São Paulo. Conheça o
                processo, os materiais e os princípios que guiam cada projeto.
              </p>
            </div>
            <Link
              href="/atelier"
              className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-papel border border-cinza-claro px-6 py-3 hover:border-papel transition-colors whitespace-nowrap"
            >
              Conheça o atelier
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
