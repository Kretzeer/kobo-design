import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato — Kobo",
  description: "Entre em contato com o atelier Kobo.",
};

export default function ContatoPage() {
  return (
    <>
      <Nav />

      <main className="flex-1 bg-papel">
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Info */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-pedra mb-6">
                Contato
              </p>
              <h1 className="text-3xl font-black uppercase tracking-[0.16em] text-carbono mb-12">
                FALE COM O ATELIER
              </h1>

              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra mb-2">
                    E-mail
                  </p>
                  <p className="text-sm font-normal text-tinta">
                    contato@kobo.com.br
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra mb-2">
                    Instagram
                  </p>
                  <p className="text-sm font-normal text-tinta">
                    @kobomobiliario
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra mb-2">
                    Localização
                  </p>
                  <p className="text-sm font-normal text-tinta">
                    São Paulo — SP, Brasil
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra mb-2">
                    Atendimento
                  </p>
                  <p className="text-sm font-normal text-tinta">
                    Segunda a sexta, 9h às 18h
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div>
              <form
                action="mailto:contato@kobo.com.br"
                method="post"
                encType="text/plain"
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nome"
                    className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    className="bg-transparent border-b border-cinza-claro text-tinta text-sm font-normal py-2 outline-none focus:border-carbono transition-colors placeholder:text-cinza-claro"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-transparent border-b border-cinza-claro text-tinta text-sm font-normal py-2 outline-none focus:border-carbono transition-colors placeholder:text-cinza-claro"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="mensagem"
                    className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={6}
                    className="bg-transparent border-b border-cinza-claro text-tinta text-sm font-normal py-2 outline-none focus:border-carbono transition-colors placeholder:text-cinza-claro resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <button
                  type="submit"
                  className="self-start mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-carbono border border-carbono px-8 py-3 hover:bg-carbono hover:text-papel transition-colors"
                >
                  Enviar
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
