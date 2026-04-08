import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier — Kobo",
  description:
    "Conheça o processo de fabricação Kobo. MDF, encaixes e honestidade material.",
};

const steps = [
  {
    number: "01",
    title: "Projeto",
    description:
      "Cada peça começa em papel. Proporções, encaixes e raios de curvatura são definidos antes de qualquer corte.",
  },
  {
    number: "02",
    title: "Corte CNC",
    description:
      "O MDF é cortado em CNC de alta precisão. As folgas dos encaixes são calculadas para montagem sem cola.",
  },
  {
    number: "03",
    title: "Acabamento",
    description:
      "Bordas fresadas a 4mm de raio. Lixamento manual em três granulações. Sem verniz, sem tinta além do necessário.",
  },
  {
    number: "04",
    title: "Montagem",
    description:
      "O cliente monta com uma chave allen. Os parafusos ficam à vista — são parte do projeto, não um detalhe a esconder.",
  },
];

export default function AtelierPage() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        {/* Hero do atelier */}
        <section className="bg-carbono">
          <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-6">
              Sobre
            </p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.16em] text-papel leading-tight max-w-xl">
              O ATELIER
            </h1>
          </div>

          {/* Imagem do atelier */}
          <div className="relative w-full aspect-[16/7] max-h-[520px]">
            <Image
              src="/images/hero-atelier.jpg"
              alt="Atelier Kobo — prateleiras de MDF com encaixes à vista"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Texto principal */}
        <section className="bg-papel px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-8">
              Princípios
            </p>
            <p className="text-lg font-normal text-tinta leading-relaxed">
              Kobo é um atelier de mobiliário infantil fundado em São Paulo com
              um princípio simples: honestidade material.
            </p>
            <p className="text-lg font-normal text-tinta leading-relaxed mt-4">
              O MDF aparece como MDF. Os encaixes ficam à vista e viram
              ornamento. As bordas são roliças não por modismo — porque uma
              criança que tropeça merece uma quina que não machuca.
            </p>
            <p className="text-lg font-normal text-tinta leading-relaxed mt-4">
              Não fazemos móveis infantilizados. Fazemos peças que respeitam a
              criança como usuária, os pais como compradores e o espaço como
              projeto.
            </p>
          </div>
        </section>

        {/* Timeline do processo */}
        <section className="bg-osso px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-12">
              Processo de Fabricação
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-8">
                  <span className="text-4xl font-black text-cinza-claro leading-none shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.16em] text-carbono mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-normal text-grafite leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detalhe de material */}
        <section className="bg-tinta">
          <div className="relative w-full aspect-[16/6] max-h-[400px]">
            <Image
              src="/images/atelier-detalhe.jpg"
              alt="Detalhe de encaixe em MDF — parafuso allen à vista"
              fill
              className="object-cover"
            />
          </div>
          <div className="px-6 md:px-16 lg:px-24 py-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra">
              Encaixe à vista — o parafuso como ornamento
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
