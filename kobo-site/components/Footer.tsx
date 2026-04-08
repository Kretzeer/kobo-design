import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-carbono text-papel">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Marca */}
          <div className="flex flex-col gap-3">
            <span className="text-4xl font-black uppercase tracking-[0.18em] leading-none">
              KOBO
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra">
              MÓVEIS QUE BRINCAM
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra">
              Navegação
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/colecao", label: "Coleção" },
                { href: "/atelier", label: "Atelier" },
                { href: "/contato", label: "Contato" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-normal text-cinza-claro hover:text-papel transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra">
              Contato
            </p>
            <div className="flex flex-col gap-2 text-sm font-normal text-cinza-claro">
              <span>contato@kobo.com.br</span>
              <span>@kobomobiliario</span>
              <span>São Paulo — SP</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-grafite flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[10px] font-normal text-pedra tracking-[0.1em]">
            © 2026 Kobo. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-normal text-pedra tracking-[0.1em]">
            Atelier brasileiro de mobiliário infantil
          </p>
        </div>
      </div>
    </footer>
  );
}
