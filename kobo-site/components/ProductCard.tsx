import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  material: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
}

export default function ProductCard({
  name,
  material,
  description,
  imageSrc,
  imageAlt,
  href = "/colecao",
}: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="flex flex-col gap-4">
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden bg-osso border border-cinza-claro group-hover:border-argila transition-colors">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-pedra">
            {material}
          </p>
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-carbono leading-tight">
            {name}
          </h3>
          <p className="text-sm font-normal text-grafite leading-relaxed mt-1">
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}
