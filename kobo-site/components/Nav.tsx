"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/colecao", label: "COLEÇÃO" },
  { href: "/atelier", label: "ATELIER" },
  { href: "/contato", label: "CONTATO" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-papel border-b border-cinza-claro">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo variant="dark" size="sm" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-[11px] font-medium uppercase tracking-[0.28em] transition-colors ${
                  pathname.startsWith(l.href)
                    ? "text-carbono"
                    : "text-pedra hover:text-carbono"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-carbono transition-transform origin-center ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-carbono transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-carbono transition-transform origin-center ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-papel border-t border-cinza-claro px-6 py-6">
          <ul className="flex flex-col gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-[13px] font-medium uppercase tracking-[0.28em] ${
                    pathname.startsWith(l.href) ? "text-carbono" : "text-pedra"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
