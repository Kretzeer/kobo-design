/**
 * validate.js
 * Validação visual automática do sistema Kobo com Playwright
 *
 * Uso:
 *   # Em um terminal: npm run dev
 *   # Em outro terminal:
 *   node scripts/validate.js
 *
 * O script valida:
 * 1. Brand System HTML (Kobo_Brand_System.html)
 * 2. Site Next.js (4 rotas × 3 viewports)
 * 3. Consistência de marca (fonte, cores, tipografia)
 * E tenta corrigir automaticamente falhas simples.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// ─── Configuração ─────────────────────────────────────────────────────────────

const SITE_URL = "http://localhost:3000";
const BRAND_HTML = path.join(__dirname, "..", "..", "Kobo_Brand_System.html");
const OUTPUT_DIR = path.join(__dirname, "validation");
const REPORT_FILE = path.join(OUTPUT_DIR, "report.md");
const MAX_AUTO_FIXES = 3;

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const ROUTES = ["/", "/colecao", "/atelier", "/contato"];

// Paleta proprietária (todas as cores permitidas)
const KOBO_PALETTE = new Set([
  "#0f0f0f", "#1c1c1c", "#3a3a38", "#8a857c", "#b8b3a8",
  "#e9e4d8", "#f4f0e6", "#d6c4a3", "#c8a78a", "#a8b09a", "#6b5a48",
  "transparent", "rgba(0, 0, 0, 0)", "rgb(0,0,0)", "rgb(255,255,255)",
]);

// Arquivos do site para tentativa de correção automática
const LAYOUT_FILE = path.join(__dirname, "..", "app", "layout.tsx");
const GLOBALS_CSS = path.join(__dirname, "..", "app", "globals.css");

// ─── Utilitários ──────────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function log(msg, level = "info") {
  const icons = { info: "·", ok: "✓", fail: "✗", fix: "⚙", warn: "⚠" };
  console.log(`${icons[level] || "·"} ${msg}`);
}

function rgbToHex(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb.toLowerCase().replace(/\s/g, "");
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
  );
}

function isKoboColor(cssColor) {
  if (!cssColor || cssColor === "transparent") return true;
  const hex = rgbToHex(cssColor);
  return KOBO_PALETTE.has(hex) || cssColor.includes("transparent") || cssColor === "rgba(0, 0, 0, 0)";
}

// ─── Resultados ───────────────────────────────────────────────────────────────

const results = [];

function addResult(check, passed, detail = "", screenshotPath = "") {
  results.push({ check, passed, detail, screenshotPath });
  log(
    `${check}${detail ? " — " + detail : ""}`,
    passed ? "ok" : "fail"
  );
}

// ─── Correções automáticas ────────────────────────────────────────────────────

let fixCount = 0;

function tryFix(description, fixFn) {
  if (fixCount >= MAX_AUTO_FIXES) {
    log(`Limite de ${MAX_AUTO_FIXES} correções automáticas atingido.`, "warn");
    return false;
  }
  try {
    fixFn();
    fixCount++;
    log(`Correção aplicada: ${description}`, "fix");
    return true;
  } catch (e) {
    log(`Correção falhou: ${description} — ${e.message}`, "warn");
    return false;
  }
}

function fixMissingMavenPro() {
  // Verifica e corrige import da Maven Pro no layout
  if (!fs.existsSync(LAYOUT_FILE)) return false;
  let content = fs.readFileSync(LAYOUT_FILE, "utf-8");
  if (content.includes("Maven_Pro")) return false; // já está

  content = content.replace(
    /import.*from "next\/font\/google";/,
    'import { Maven_Pro } from "next/font/google";'
  );
  content = content.replace(
    /const \w+ = \w+\({[\s\S]*?\}\);[\s\S]*?const \w+ = \w+\({[\s\S]*?\}\);/m,
    `const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-maven",
});`
  );
  fs.writeFileSync(LAYOUT_FILE, content);
  return true;
}

function fixMissingColorTokens() {
  if (!fs.existsSync(GLOBALS_CSS)) return false;
  let content = fs.readFileSync(GLOBALS_CSS, "utf-8");
  if (content.includes("--color-carbono")) return false; // já tem

  const tokens = `
@theme inline {
  --font-sans: var(--font-maven);
  --color-carbono:    #0F0F0F;
  --color-tinta:      #1C1C1C;
  --color-grafite:    #3A3A38;
  --color-pedra:      #8A857C;
  --color-cinza-claro:#B8B3A8;
  --color-osso:       #E9E4D8;
  --color-papel:      #F4F0E6;
  --color-areia:      #D6C4A3;
  --color-argila:     #C8A78A;
  --color-salvia:     #A8B09A;
  --color-umbra:      #6B5A48;
}`;

  content = content.replace(/@theme inline \{[\s\S]*?\}/m, tokens);
  fs.writeFileSync(GLOBALS_CSS, content);
  return true;
}

// ─── Validação Brand System HTML ──────────────────────────────────────────────

async function validateBrandSystem(browser) {
  log("\n── Brand System HTML ──────────────────────");
  const outDir = path.join(OUTPUT_DIR, "brand-system");
  ensureDir(outDir);

  if (!fs.existsSync(BRAND_HTML)) {
    addResult("Brand System HTML existe", false, `Não encontrado em: ${BRAND_HTML}`);
    return;
  }

  addResult("Brand System HTML existe", true);

  const page = await browser.newPage();
  await page.goto(`file:///${BRAND_HTML.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle",
    timeout: 15_000,
  });

  // Screenshot completa
  const fullShot = path.join(outDir, "full.png");
  await page.screenshot({ path: fullShot, fullPage: true });

  // Verificar Maven Pro
  const fontFamily = await page.evaluate(() => {
    const el = document.querySelector("body") || document.documentElement;
    return window.getComputedStyle(el).fontFamily;
  });
  const hasMaven = fontFamily.toLowerCase().includes("maven");
  addResult("Brand System — Maven Pro carregada", hasMaven, `font-family: ${fontFamily.substring(0, 60)}`);

  // Verificar 10 seções
  const sections = ["#logo", "#cartoes", "#ecobags", "#papelaria", "#merchandise", "#estampas", "#selos", "#sinalizacao", "#instagram", "#paleta"];
  for (const sec of sections) {
    const exists = await page.locator(sec).count() > 0;
    addResult(`Brand System — seção ${sec}`, exists);
    if (exists) {
      const secShot = path.join(outDir, `${sec.replace("#", "")}.png`);
      try {
        await page.locator(sec).screenshot({ path: secShot });
      } catch {
        // ignora erro de screenshot
      }
    }
  }

  // Verificar 11 cores da paleta
  const swatchCount = await page.locator(".swatch").count();
  addResult("Brand System — 11 swatches de paleta", swatchCount === 11, `encontrados: ${swatchCount}`);

  // Verificar ausência de fontes serifadas
  const serifFound = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("*"));
    return all.some((el) => {
      const ff = window.getComputedStyle(el).fontFamily;
      return /serif/i.test(ff) && !/sans-serif/i.test(ff);
    });
  });
  addResult("Brand System — sem fontes serifadas", !serifFound);

  await page.close();
}

// ─── Validação do Site ────────────────────────────────────────────────────────

async function validateSite(browser) {
  log("\n── Site Next.js ───────────────────────────");
  const outDir = path.join(OUTPUT_DIR, "site");
  ensureDir(outDir);

  // Testar se o servidor está rodando
  let serverUp = false;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const response = await page.goto(SITE_URL, { timeout: 10_000 });
    serverUp = response && response.ok();
    await page.close();
    await context.close();
  } catch {
    serverUp = false;
  }

  if (!serverUp) {
    addResult(
      "Servidor Next.js rodando",
      false,
      `Não foi possível conectar em ${SITE_URL}. Inicie com: npm run dev`
    );
    return;
  }

  addResult("Servidor Next.js rodando", true, SITE_URL);

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${SITE_URL}${route}`;
      const label = `${viewport.name} — ${route}`;
      const shotDir = path.join(outDir, viewport.name);
      ensureDir(shotDir);
      const shotPath = path.join(shotDir, `${route.replace("/", "") || "home"}.png`);

      try {
        const res = await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
        const ok = res && res.ok();
        addResult(`${label} — HTTP ok`, ok, `status: ${res?.status()}`);

        if (ok) {
          await page.screenshot({ path: shotPath, fullPage: viewport.name === "desktop" });

          // Verificar Nav visível
          const navVisible = await page.locator("header nav").first().isVisible();
          addResult(`${label} — Nav visível`, navVisible, "", shotPath);

          // Verificar fundo Papel no body (apenas desktop home)
          if (viewport.name === "desktop" && route === "/") {
            const bodyBg = await page.evaluate(() =>
              window.getComputedStyle(document.documentElement).backgroundColor
            );
            const hex = rgbToHex(bodyBg);
            const isPapel = hex === "#f4f0e6";
            addResult(`${label} — fundo Papel (#F4F0E6)`, isPapel, `encontrado: ${hex}`);
          }

          // Verificar Maven Pro carregada
          if (viewport.name === "desktop") {
            const fontFamily = await page.evaluate(() =>
              window.getComputedStyle(document.body).fontFamily
            );
            const hasMaven = fontFamily.toLowerCase().includes("maven");
            if (!hasMaven) {
              addResult(`${label} — Maven Pro carregada`, false, fontFamily.substring(0, 60));
              // Tenta correção automática
              if (tryFix("Adicionar Maven Pro ao layout.tsx", fixMissingMavenPro)) {
                log("Reinicie o servidor para aplicar a correção da fonte.", "warn");
              }
            } else {
              addResult(`${label} — Maven Pro carregada`, true);
            }
          }

          // Verificar imagens via HTTP (contorna limitações do IntersectionObserver headless)
          const imageSrcs = await page.evaluate(() =>
            Array.from(document.images).map((img) => img.getAttribute("src")).filter(Boolean)
          );

          const brokenImages = [];
          for (const src of imageSrcs) {
            const fullUrl = src.startsWith("http") ? src : `${SITE_URL}${src}`;
            try {
              const r = await page.request.get(fullUrl, { timeout: 8000 });
              if (!r.ok()) brokenImages.push(src);
            } catch {
              brokenImages.push(src);
            }
          }

          if (brokenImages.length > 0) {
            addResult(
              `${label} — imagens ok`,
              false,
              `${brokenImages.length} imagem(ns) não carregaram: ${brokenImages.slice(0, 2).join(", ")}`,
              shotPath
            );
          } else {
            addResult(`${label} — imagens ok`, true);
          }

          // Verificar H1 em caixa alta (desktop home)
          if (viewport.name === "desktop" && route === "/") {
            const h1Text = await page.locator("h1").first().textContent().catch(() => "");
            const isUppercase = h1Text === h1Text.toUpperCase();
            addResult(`${label} — H1 em caixa alta`, isUppercase, `"${h1Text.trim().substring(0, 30)}"`);
          }
        }
      } catch (err) {
        addResult(`${label} — acesso`, false, err.message);
      }
    }

    await page.close();
    await context.close();
  }
}

// ─── Verificação de consistência de cores ────────────────────────────────────

async function validateColorConsistency(browser) {
  log("\n── Consistência de Cores ──────────────────");

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let serverUp = false;
  try {
    const res = await page.goto(SITE_URL, { timeout: 10_000 });
    serverUp = res && res.ok();
  } catch {
    serverUp = false;
  }

  if (!serverUp) {
    addResult("Consistência de cores — servidor disponível", false);
    await page.close();
    await context.close();
    return;
  }

  // Amostrar cores usadas em elementos de texto e fundo
  const colorSample = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll("h1, h2, h3, p, header, main, footer, section");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      results.push(style.color, style.backgroundColor);
    });
    return [...new Set(results)];
  });

  const offPaletteColors = colorSample.filter(
    (c) => c && c !== "rgba(0, 0, 0, 0)" && !isKoboColor(c)
  );

  if (offPaletteColors.length > 0) {
    addResult(
      "Cores dentro da paleta Kobo",
      false,
      `Cores fora da paleta: ${offPaletteColors.slice(0, 4).join(", ")}`
    );
    // Tenta corrigir tokens CSS ausentes
    tryFix("Restaurar tokens de cor no globals.css", fixMissingColorTokens);
  } else {
    addResult("Cores dentro da paleta Kobo", true);
  }

  // Verificar ausência de serif
  const serifFound = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("*")).some((el) => {
      const ff = window.getComputedStyle(el).fontFamily;
      return /\bserif\b/i.test(ff) && !/sans-serif/i.test(ff);
    });
  });
  addResult("Nenhuma fonte serifada no site", !serifFound);

  await page.close();
  await context.close();
}

// ─── Geração do Relatório ─────────────────────────────────────────────────────

function generateReport() {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const pct = Math.round((passed / total) * 100);

  let md = `# Kobo — Relatório de Validação Visual\n\n`;
  md += `> Gerado em: ${new Date().toLocaleString("pt-BR")}\n\n`;
  md += `## Resumo\n\n`;
  md += `| Total | Aprovados | Falhas | Score |\n`;
  md += `|-------|-----------|--------|-------|\n`;
  md += `| ${total} | ${passed} | ${failed} | ${pct}% |\n\n`;

  if (fixCount > 0) {
    md += `> **${fixCount} correção(ões) automática(s) aplicada(s).** Reinicie o servidor se necessário.\n\n`;
  }

  md += `## Checks Detalhados\n\n`;
  for (const r of results) {
    const icon = r.passed ? "✓" : "✗";
    md += `- ${icon} **${r.check}**`;
    if (r.detail) md += ` — \`${r.detail}\``;
    if (r.screenshotPath) md += `\n  - Screenshot: \`${r.screenshotPath}\``;
    md += "\n";
  }

  if (failed > 0) {
    md += `\n## Ações Necessárias\n\n`;
    const failures = results.filter((r) => !r.passed);
    for (const f of failures) {
      md += `- [ ] **${f.check}**: ${f.detail}\n`;
    }
  }

  md += `\n---\n*Kobo Sistema Visual v02 · ${new Date().getFullYear()}*\n`;

  fs.writeFileSync(REPORT_FILE, md);
  return { passed, failed, total, pct };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, "brand-system"));
  ensureDir(path.join(OUTPUT_DIR, "site"));

  log("Iniciando validação visual Kobo...\n");

  const browser = await chromium.launch({ headless: true });

  try {
    await validateBrandSystem(browser);
    await validateSite(browser);
    await validateColorConsistency(browser);
  } finally {
    await browser.close();
  }

  const { passed, failed, total, pct } = generateReport();

  console.log("\n" + "=".repeat(60));
  log(`Validação concluída: ${passed}/${total} (${pct}%)`, pct === 100 ? "ok" : "warn");
  if (failed > 0) {
    log(`${failed} falha(s). Veja: ${REPORT_FILE}`, "fail");
  } else {
    log("Todos os checks passaram.", "ok");
  }
  if (fixCount > 0) {
    log(`${fixCount} correção(ões) automática(s) aplicada(s).`, "fix");
    log("Reinicie o servidor Next.js para aplicar as correções.", "warn");
  }
  console.log("=".repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
