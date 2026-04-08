interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const sizes = {
  sm: { wordmark: "text-xl", tagline: "text-[8px]", tracking: "tracking-[0.18em]" },
  md: { wordmark: "text-3xl", tagline: "text-[9px]", tracking: "tracking-[0.18em]" },
  lg: { wordmark: "text-5xl", tagline: "text-[10px]", tracking: "tracking-[0.18em]" },
};

export default function Logo({
  variant = "dark",
  size = "md",
  showTagline = false,
}: LogoProps) {
  const isDark = variant === "dark";
  const s = sizes[size];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`font-black uppercase ${s.wordmark} ${s.tracking} leading-none ${
          isDark ? "text-carbono" : "text-papel"
        }`}
      >
        KOBO
      </span>
      {showTagline && (
        <span
          className={`font-medium uppercase ${s.tagline} tracking-[0.28em] ${
            isDark ? "text-pedra" : "text-pedra"
          }`}
        >
          MÓVEIS QUE BRINCAM
        </span>
      )}
    </div>
  );
}
