import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coleção — Kobo",
  description: "Mobiliário infantil em MDF. Encaixes à vista, bordas roliças.",
};

const products = [
  {
    name: "Estante Nuvem",
    material: "MDF Cru",
    description:
      "Formato nuvem com bordas roliças e encaixes à vista. Parafuso estrela como detalhe de projeto.",
    imageSrc: "/images/produto-estante-nuvem.jpg",
    imageAlt: "Estante Nuvem Kobo em MDF cru",
  },
  {
    name: "Banco Pebble",
    material: "MDF Sálvia",
    description:
      "Forma pebble de baixo centro de gravidade. Encaixes allen aparentes na lateral.",
    imageSrc: "/images/produto-banco-pebble.jpg",
    imageAlt: "Banco Pebble Kobo em MDF sálvia",
  },
  {
    name: "Mesa Baixa",
    material: "MDF Cru",
    description:
      "Altura de 28 cm para atividades sentadas no chão. Cantos totalmente arredondados.",
    imageSrc: "/images/produto-mesa-baixa.jpg",
    imageAlt: "Mesa baixa Kobo em MDF cru",
  },
  {
    name: "Prateleira Arco",
    material: "MDF Areia",
    description:
      "Perfil em arco, montagem em 3 minutos. Carrega até 8 kg por módulo.",
    imageSrc: "/images/atelier-detalhe.jpg",
    imageAlt: "Prateleira Arco Kobo em MDF areia",
  },
  {
    name: "Baú Bloco",
    material: "MDF Cru",
    description:
      "Baú com tampa de encaixe duplo. Interior em papel kraft. Cabe 40 litros.",
    imageSrc: "/images/packaging-flatlay.jpg",
    imageAlt: "Baú Bloco Kobo em MDF cru",
  },
  {
    name: "Cabideiro Ramo",
    material: "MDF Argila",
    description:
      "Cinco ganchos em ramo estilizado. Altura de 90 cm, fixação na parede.",
    imageSrc: "/images/textura-mdf.jpg",
    imageAlt: "Cabideiro Ramo Kobo em MDF argila",
  },
];

export default function ColecaoPage() {
  return (
    <>
      <Nav />

      <main className="flex-1 bg-papel">
        {/* Header */}
        <div className="px-6 md:px-16 lg:px-24 py-16 border-b border-cinza-claro">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-3">
              Coleção 2026
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.16em] text-carbono">
              TODOS OS PRODUTOS
            </h1>
            <p className="text-sm font-normal text-pedra mt-3">
              {products.length} peças
            </p>
          </div>
        </div>

        {/* Grade de produtos */}
        <div className="px-6 md:px-16 lg:px-24 py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
