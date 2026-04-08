/**
 * flora-generate.js
 * Automação Playwright para geração de imagens no Flora.ai
 *
 * Uso:
 *   node scripts/flora-generate.js
 *
 * O script abre o Flora.ai em modo visível, aguarda você fazer login,
 * e depois submete cada prompt automaticamente, salvando os resultados
 * em public/images/
 *
 * Dependências: npm install playwright
 *               npx playwright install chromium
 */

const { chromium } = require("playwright");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// ─── Configuração ────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images");
const PROGRESS_FILE = path.join(__dirname, ".flora-progress.json");
const TIMEOUT_PER_IMAGE = 90_000; // 90s por geração
const MAX_RETRIES = 3;

// ─── Prompts Kobo ────────────────────────────────────────────────────────────

const prompts = [
  {
    slug: "hero-atelier",
    filename: "hero-atelier.png",
    prompt:
      "Minimal Brazilian children's furniture atelier, warm neutral palette, cream walls, raw MDF shelves with visible allen-key joints, soft morning light, rounded organic shapes, muted sage and clay accents, editorial photography, Kinfolk style, 35mm, shallow depth of field",
    aspectRatio: "16:9",
  },
  {
    slug: "produto-estante-nuvem",
    filename: "produto-estante-nuvem.png",
    prompt:
      "Cloud-shaped children's bookshelf in raw MDF with rounded edges, visible star-head screws as design feature, matte finish, standing on bone-white seamless background, studio light, soft shadow, product photography, minimal",
    aspectRatio: "1:1",
  },
  {
    slug: "produto-banco-pebble",
    filename: "produto-banco-pebble.png",
    prompt:
      "Small pebble-shaped children's stool in sage-green painted MDF, smooth rounded form, visible allen joints on side, on paper background, top-angled studio shot, minimal editorial",
    aspectRatio: "1:1",
  },
  {
    slug: "lifestyle-crianca",
    filename: "lifestyle-crianca.png",
    prompt:
      "Child aged 4 playing with wooden modular toy on MDF low table in a bright minimal scandinavian-japanese nursery, neutral terracotta and sage palette, natural linen curtains, no branding, candid editorial",
    aspectRatio: "4:3",
  },
  {
    slug: "textura-mdf",
    filename: "textura-mdf.png",
    prompt:
      "Extreme close-up of raw MDF surface with rounded edge and a single visible star-head screw, warm directional light, macro texture, neutral tones",
    aspectRatio: "1:1",
  },
  {
    slug: "packaging-flatlay",
    filename: "packaging-flatlay.png",
    prompt:
      "Flat lay of a children's furniture kit: kraft clay-colored cardboard box, bone-white instruction booklet, small allen key, cotton tag with KOBO wordmark, neutral paper background, overhead editorial photography",
    aspectRatio: "4:3",
  },
  {
    slug: "produto-mesa-baixa",
    filename: "produto-mesa-baixa.png",
    prompt:
      "Low children's activity table in raw MDF, rounded corners, visible assembly joints as design detail, on warm cream background, studio product shot, minimal",
    aspectRatio: "1:1",
  },
  {
    slug: "atelier-detalhe",
    filename: "atelier-detalhe.png",
    prompt:
      "Close-up detail of furniture assembly joint — allen key screw in MDF, rounded wooden edge, warm workshop light, shallow depth of field, editorial macro",
    aspectRatio: "4:3",
  },
];

// ─── Utilitários ─────────────────────────────────────────────────────────────

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function waitForEnter(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, () => {
      rl.close();
      resolve();
    });
  });
}

function log(msg) {
  const time = new Date().toLocaleTimeString("pt-BR");
  console.log(`[${time}] ${msg}`);
}

// ─── Lógica de geração no Flora.ai ───────────────────────────────────────────

async function generateImage(page, prompt, outputPath) {
  // 1. Criar novo canvas / projeto
  log("Navegando para nova geração...");
  await page.goto("https://flora.ai", { waitUntil: "networkidle", timeout: 30_000 });

  // Aguarda a interface carregar (ajuste os seletores conforme a UI atual do Flora)
  // Estratégia: procurar botão de "New", "Create", "+" ou similar
  const newButtonSelectors = [
    'button:has-text("New")',
    'button:has-text("Create")',
    'a:has-text("New")',
    '[data-testid="new-canvas"]',
    '[aria-label="New canvas"]',
    'button[class*="new"]',
  ];

  let newClicked = false;
  for (const sel of newButtonSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 3000 })) {
        await btn.click();
        newClicked = true;
        log(`Clicou em "New" via: ${sel}`);
        break;
      }
    } catch {
      // tenta próximo seletor
    }
  }

  if (!newClicked) {
    log("ATENÇÃO: botão 'New' não encontrado — continuando na página atual.");
  }

  await page.waitForTimeout(2000);

  // 2. Procurar campo de prompt ou nó de imagem
  const promptInputSelectors = [
    'textarea[placeholder*="prompt"]',
    'textarea[placeholder*="Prompt"]',
    'textarea[placeholder*="describe"]',
    'input[placeholder*="prompt"]',
    '[data-testid="prompt-input"]',
    '[aria-label*="prompt"]',
    "textarea",
  ];

  let promptInput = null;
  for (const sel of promptInputSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        promptInput = el;
        log(`Campo de prompt encontrado via: ${sel}`);
        break;
      }
    } catch {
      // tenta próximo
    }
  }

  if (!promptInput) {
    throw new Error(
      "Campo de prompt não encontrado. A interface do Flora pode ter mudado. " +
        "Complete este passo manualmente e pressione Enter para continuar."
    );
  }

  // 3. Digitar o prompt
  await promptInput.click();
  await promptInput.fill(prompt);
  log("Prompt inserido.");

  // 4. Clicar em gerar
  const generateSelectors = [
    'button:has-text("Generate")',
    'button:has-text("Run")',
    'button:has-text("Create")',
    'button[type="submit"]',
    '[data-testid="generate-button"]',
    '[aria-label="Generate"]',
  ];

  let generated = false;
  for (const sel of generateSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        generated = true;
        log(`Geração iniciada via: ${sel}`);
        break;
      }
    } catch {
      // tenta próximo
    }
  }

  if (!generated) {
    log("ATENÇÃO: botão Generate não encontrado. Tente pressionar Ctrl+Enter...");
    await page.keyboard.press("Control+Enter");
  }

  // 5. Aguardar a imagem ser gerada
  log(`Aguardando geração (até ${TIMEOUT_PER_IMAGE / 1000}s)...`);

  const imageSelectors = [
    'img[data-generated="true"]',
    '[data-testid="output-image"] img',
    '.output img',
    'canvas[data-type="output"]',
  ];

  let generatedImage = null;
  const deadline = Date.now() + TIMEOUT_PER_IMAGE;

  while (Date.now() < deadline) {
    for (const sel of imageSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 })) {
          generatedImage = el;
          break;
        }
      } catch {
        // continua
      }
    }
    if (generatedImage) break;
    await page.waitForTimeout(2000);
    process.stdout.write(".");
  }
  console.log("");

  // 6. Fazer download da imagem
  if (generatedImage) {
    // Tentar botão de download
    const downloadSelectors = [
      'button:has-text("Download")',
      '[aria-label="Download"]',
      '[data-testid="download-button"]',
      'a[download]',
    ];

    let downloaded = false;
    for (const sel of downloadSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          const [download] = await Promise.all([
            page.waitForEvent("download", { timeout: 15_000 }),
            btn.click(),
          ]);
          await download.saveAs(outputPath);
          downloaded = true;
          log(`Download salvo em: ${outputPath}`);
          break;
        }
      } catch {
        // tenta próximo
      }
    }

    if (!downloaded) {
      // Fallback: screenshot do elemento
      log("Download direto falhou — capturando screenshot do elemento...");
      await generatedImage.screenshot({ path: outputPath });
      log(`Screenshot salvo em: ${outputPath}`);
    }
  } else {
    throw new Error(
      `Imagem não gerada dentro do timeout de ${TIMEOUT_PER_IMAGE / 1000}s.`
    );
  }
}

// ─── Placeholder para imagens que falharam ───────────────────────────────────

function createPlaceholder(outputPath, slug) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#D6C4A3"/>
  <text x="600" y="380" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="#6B5A48" letter-spacing="8">KOBO</text>
  <text x="600" y="430" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#8A857C" letter-spacing="4">${slug}</text>
  <text x="600" y="470" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#8A857C">Substitua por imagem do Flora.ai</text>
</svg>`;
  // Salva como SVG temporário (renomeado com .png para compatibilidade)
  fs.writeFileSync(outputPath.replace(".png", ".svg"), svg);
  log(`Placeholder SVG criado: ${outputPath.replace(".png", ".svg")}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Garantir diretório de saída
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const progress = loadProgress();
  const pending = prompts.filter((p) => !progress[p.slug]);

  if (pending.length === 0) {
    log("Todas as imagens já foram geradas.");
    return;
  }

  log(`${pending.length} imagem(ns) a gerar.`);
  log(`Saída: ${OUTPUT_DIR}`);

  // Lançar browser em modo visível
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });
  const page = await context.newPage();

  // Abrir Flora.ai
  await page.goto("https://flora.ai", { waitUntil: "domcontentloaded", timeout: 30_000 });

  // Aguardar login manual
  console.log("\n" + "=".repeat(60));
  console.log("FAÇA LOGIN NO FLORA.AI NA JANELA DO BROWSER.");
  console.log("Quando estiver logado e na tela principal,");
  await waitForEnter("pressione ENTER aqui para continuar...");
  console.log("=".repeat(60) + "\n");

  // Gerar cada imagem
  for (const item of pending) {
    const outputPath = path.join(OUTPUT_DIR, item.filename);

    if (fs.existsSync(outputPath)) {
      log(`Arquivo já existe, pulando: ${item.filename}`);
      progress[item.slug] = { done: true, file: outputPath };
      saveProgress(progress);
      continue;
    }

    log(`\n>>> Gerando: ${item.slug}`);
    log(`Prompt: ${item.prompt.substring(0, 80)}...`);

    let success = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await generateImage(page, item.prompt, outputPath);
        progress[item.slug] = { done: true, file: outputPath };
        saveProgress(progress);
        success = true;
        log(`✓ ${item.filename} salvo com sucesso.`);
        break;
      } catch (err) {
        log(`✗ Tentativa ${attempt}/${MAX_RETRIES} falhou: ${err.message}`);

        if (attempt < MAX_RETRIES) {
          log("Aguardando 5s antes de nova tentativa...");
          await page.waitForTimeout(5000);
        } else {
          log(`Falha definitiva em ${item.slug}. Criando placeholder.`);
          createPlaceholder(outputPath, item.slug);
          progress[item.slug] = { done: false, error: err.message };
          saveProgress(progress);

          await waitForEnter(
            `\nComplete manualmente a geração de "${item.slug}" no browser\ne salve em: ${outputPath}\nPressione ENTER para continuar com a próxima imagem...`
          );
        }
      }
    }

    if (success) {
      // Pequena pausa entre gerações para não sobrecarregar
      await page.waitForTimeout(2000);
    }
  }

  await browser.close();

  // Relatório final
  const done = Object.values(progress).filter((v) => v.done).length;
  const failed = Object.values(progress).filter((v) => !v.done).length;

  console.log("\n" + "=".repeat(60));
  log(`Concluído. ${done} geradas ✓  ${failed} falhas ✗`);
  if (failed > 0) {
    log(`Verifique ${PROGRESS_FILE} para detalhes dos erros.`);
  }
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
