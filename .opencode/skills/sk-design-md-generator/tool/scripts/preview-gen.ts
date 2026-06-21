import * as fs from 'fs';
import * as path from 'path';
import type { DesignTokens, ColorToken, TypographyLevel, ShadowToken, RadiusToken } from './types';

// ─── HTML Generation ────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function topColors(tokens: ColorToken[], n: number): ColorToken[] {
  return tokens.filter((c) => c.rgba[3] > 0.1).slice(0, n);
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function inferBackground(tokens: ColorToken[]): string {
  // Prefer the lightest color used as background
  const bgCandidates = tokens
    .filter((c) => c.usedAs.bgColor > 0 && c.frequency > 5)
    .sort((a, b) => luminance(b.rgba[0], b.rgba[1], b.rgba[2]) - luminance(a.rgba[0], a.rgba[1], a.rgba[2]));
  return bgCandidates[0]?.hex ?? '#ffffff';
}

function inferTextColor(tokens: ColorToken[]): string {
  // Prefer the darkest color used as text
  const textCandidates = tokens
    .filter((c) => c.usedAs.textColor > 0 && c.frequency > 5)
    .sort((a, b) => luminance(a.rgba[0], a.rgba[1], a.rgba[2]) - luminance(b.rgba[0], b.rgba[1], b.rgba[2]));
  const bg = inferBackground(tokens);
  const bgLum = (() => { const c = tokens.find((t) => t.hex === bg); return c ? luminance(c.rgba[0], c.rgba[1], c.rgba[2]) : 255; })();
  // Ensure contrast: if bg is dark, pick lightest text; if bg is light, pick darkest
  if (bgLum < 128) {
    return textCandidates[textCandidates.length - 1]?.hex ?? '#ffffff';
  }
  return textCandidates[0]?.hex ?? '#000000';
}

function inferPrimary(tokens: ColorToken[]): string {
  // First non-grayscale color with decent frequency
  for (const c of tokens) {
    const [r, g, b] = c.rgba;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 30 && c.frequency > 5) return c.hex;
  }
  return tokens[0]?.hex ?? '#6b5ce7';
}

function generatePreviewHtml(tokens: DesignTokens): string {
  const colors = topColors(tokens.colorTokens, 20);
  const typo = tokens.typographyLevels.slice(0, 8);
  const shadows = tokens.shadowTokens.slice(0, 5);
  const radii = tokens.radiusTokens.slice(0, 5);

  const bgColor = inferBackground(colors);
  const textColor = inferTextColor(colors);
  const primary = inferPrimary(colors);

  const fontFamily = typo[0]?.fontFamily ?? 'system-ui';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DESIGN.md Preview — ${escapeHtml(tokens.meta?.sourceUrls?.[0] ?? 'Unknown')}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: '${escapeHtml(fontFamily)}', system-ui, -apple-system, sans-serif;
    background: ${bgColor};
    color: ${textColor};
    line-height: 1.5;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  h1 { font-size: 2rem; margin-bottom: 2rem; font-weight: 700; }
  h2 { font-size: 1.25rem; margin: 2.5rem 0 1rem; font-weight: 600; border-bottom: 1px solid ${primary}40; padding-bottom: 0.5rem; }
  .section { margin-bottom: 3rem; }

  /* Color Swatches */
  .color-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .color-swatch {
    width: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${textColor}20;
  }
  .color-swatch__block { height: 60px; }
  .color-swatch__info { padding: 0.5rem; font-size: 0.75rem; }
  .color-swatch__hex { font-family: monospace; font-weight: 600; }
  .color-swatch__freq { opacity: 0.6; }

  /* Typography Scale */
  .typo-row { margin-bottom: 1rem; padding: 0.75rem; border-left: 3px solid ${primary}; background: ${textColor}05; }
  .typo-meta { font-size: 0.75rem; opacity: 0.6; font-family: monospace; margin-top: 0.25rem; }

  /* Components */
  .btn-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: inherit;
  }
  .btn:hover { opacity: 0.85; }
  .btn--primary { background: ${primary}; color: #fff; }
  .btn--secondary { background: transparent; color: ${textColor}; border: 1px solid ${textColor}30; }

  /* Shadow Showcase */
  .shadow-grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
  .shadow-card {
    width: 160px;
    height: 100px;
    background: ${bgColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-family: monospace;
    word-break: break-all;
    padding: 0.5rem;
    border: 1px solid ${textColor}10;
  }

  /* Input */
  .input-demo {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: flex-start;
  }
  .input {
    padding: 0.625rem 0.875rem;
    border: 1px solid ${textColor}30;
    background: ${bgColor};
    color: ${textColor};
    font-size: 0.875rem;
    font-family: inherit;
    outline: none;
    width: 280px;
  }

  /* Card */
  .card {
    padding: 1.5rem;
    background: ${bgColor};
    border: 1px solid ${textColor}15;
    max-width: 360px;
  }
  .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
  .card p { font-size: 0.875rem; opacity: 0.7; }
</style>
</head>
<body>

<h1>DESIGN.md Preview</h1>
<p style="opacity:0.6;margin-bottom:2rem;">Auto-generated from tokens.json — ${escapeHtml(tokens.meta?.sourceUrls?.[0] ?? '')}</p>

<!-- Color Palette -->
<section class="section">
<h2>Color Palette (${colors.length} tokens)</h2>
<div class="color-grid">
${colors.map((c) => `  <div class="color-swatch">
    <div class="color-swatch__block" style="background:${c.hex}"></div>
    <div class="color-swatch__info">
      <div class="color-swatch__hex">${c.hex}</div>
      <div class="color-swatch__freq">freq: ${c.frequency}</div>
    </div>
  </div>`).join('\n')}
</div>
</section>

<!-- Typography Scale -->
<section class="section">
<h2>Typography Scale (${typo.length} levels)</h2>
${typo.map((t) => `<div class="typo-row">
  <div style="font-family:'${escapeHtml(t.fontFamily)}',system-ui;font-size:${t.fontSize};font-weight:${t.fontWeight};line-height:${t.lineHeight}">The quick brown fox</div>
  <div class="typo-meta">${escapeHtml(t.fontFamily)} · ${t.fontSize} · ${t.fontWeight} · ${t.lineHeight}</div>
</div>`).join('\n')}
</section>

<!-- Components -->
<section class="section">
<h2>Buttons</h2>
<div class="btn-row">
  <button class="btn btn--primary" style="border-radius:${radii[0]?.value ?? '6px'}">Primary Action</button>
  <button class="btn btn--secondary" style="border-radius:${radii[0]?.value ?? '6px'}">Secondary</button>
</div>
</section>

<section class="section">
<h2>Input</h2>
<div class="input-demo">
  <input class="input" style="border-radius:${radii[0]?.value ?? '4px'}" placeholder="Email address" />
  <button class="btn btn--primary" style="border-radius:${radii[0]?.value ?? '6px'}">Submit</button>
</div>
</section>

<!-- Shadows -->
${shadows.length > 0 ? `<section class="section">
<h2>Shadow System (${shadows.length} levels)</h2>
<div class="shadow-grid">
${shadows.map((s) => `  <div class="shadow-card" style="box-shadow:${escapeHtml(s.value)};border-radius:${radii[0]?.value ?? '8px'}">${escapeHtml(s.type)}</div>`).join('\n')}
</div>
</section>` : ''}

<!-- Card -->
<section class="section">
<h2>Card</h2>
<div class="card" style="border-radius:${radii[0]?.value ?? '8px'};${shadows[0] ? `box-shadow:${shadows[0].value}` : ''}">
  <h3>Example Card</h3>
  <p>This card uses the extracted tokens — background, border, shadow, and radius values all come from the site's design system.</p>
</div>
</section>

</body>
</html>`;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function generatePreview(tokensPath: string, outputDir: string): void {
  const tokens: DesignTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  const html = generatePreviewHtml(tokens);
  fs.writeFileSync(path.join(outputDir, 'preview.html'), html);
  console.log(`  Generated preview.html`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: npx ts-node scripts/preview-gen.ts <tokens-json-path> [output-dir]');
    process.exit(1);
  }
  const tokensPath = args[0];
  const outputDir = args[1] ?? path.dirname(tokensPath);
  generatePreview(tokensPath, outputDir);
}
