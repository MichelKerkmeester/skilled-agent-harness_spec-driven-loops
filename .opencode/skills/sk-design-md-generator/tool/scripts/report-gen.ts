import * as fs from 'fs';
import * as path from 'path';
import type { DesignTokens, ColorToken, TypographyLevel, ShadowToken, RadiusToken } from './types';
import { validateDesignMd, type ValidationResult } from './validate';

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function topColors(tokens: ColorToken[], n: number): ColorToken[] {
  return tokens.filter((c) => c.rgba[3] > 0.1).slice(0, n);
}

function lumRgb(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function inferPrimary(tokens: ColorToken[]): string {
  for (const c of tokens) {
    const [r, g, b] = c.rgba;
    if (Math.max(r, g, b) - Math.min(r, g, b) > 30 && c.frequency > 5) return c.hex;
  }
  return '#6b5ce7';
}

function contrastOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return lumRgb(r, g, b) > 140 ? '#000' : '#fff';
}

function colorRole(c: ColorToken): string {
  const r: string[] = [];
  if (c.usedAs.bgColor > 0) r.push('bg');
  if (c.usedAs.textColor > 0) r.push('text');
  if (c.usedAs.borderColor > 0) r.push('border');
  if (c.usedAs.shadowColor > 0) r.push('shadow');
  if (c.usedAs.gradientColor > 0) r.push('gradient');
  if (c.usedAs.iconColor > 0) r.push('icon');
  return r.join(', ') || '—';
}

function isChromatic(c: ColorToken): boolean {
  const [r, g, b] = c.rgba;
  return Math.max(r, g, b) - Math.min(r, g, b) > 25;
}

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return lumRgb(r, g, b) < 140;
}

function inferPreviewTokens(colors: ColorToken[], typo: TypographyLevel[], shadows: ShadowToken[], radii: RadiusToken[]): {
  primaryBg: string; primaryText: string; secondaryBorderColor: string; secondaryTextColor: string;
  surfaceBg: string; textColor: string; borderColor: string;
  radius: string; shadow: string; fontFamily: string;
  headingFont: string; headingWeight: string; bodyFont: string; bodyWeight: string;
  successColor: string; warningColor: string;
} {
  // Primary: darkest chromatic or high-frequency bg color
  const chromaticBgs = colors.filter((c) => isChromatic(c) && c.usedAs.bgColor > 0);
  const chromaticAll = colors.filter(isChromatic);
  const primaryCandidate = chromaticBgs.sort((a, b) => b.frequency - a.frequency)[0]
    ?? chromaticAll.sort((a, b) => {
      const aLum = lumRgb(a.rgba[0], a.rgba[1], a.rgba[2]);
      const bLum = lumRgb(b.rgba[0], b.rgba[1], b.rgba[2]);
      return aLum - bLum;
    })[0];
  const primaryBg = primaryCandidate?.hex ?? '#6b5ce7';
  const primaryText = contrastOn(primaryBg);

  // Border: most frequent border color
  const borderCandidates = colors.filter((c) => c.usedAs.borderColor > 0).sort((a, b) => b.usedAs.borderColor - a.usedAs.borderColor);
  const borderColor = borderCandidates[0]?.hex ?? '#e5e7eb';

  // Secondary button: border + text from brand or text color
  const secondaryBorderColor = borderColor;
  const textCandidates = colors.filter((c) => c.usedAs.textColor > 0).sort((a, b) => b.usedAs.textColor - a.usedAs.textColor);
  const secondaryTextColor = textCandidates[0]?.hex ?? '#1a1a2e';

  // Surface bg: lightest bg color
  const bgCandidates = colors.filter((c) => c.usedAs.bgColor > 0).sort((a, b) => {
    const aLum = lumRgb(a.rgba[0], a.rgba[1], a.rgba[2]);
    const bLum = lumRgb(b.rgba[0], b.rgba[1], b.rgba[2]);
    return bLum - aLum;
  });
  const surfaceBg = bgCandidates[0]?.hex ?? '#ffffff';
  const textColor = textCandidates[0]?.hex ?? '#1a1a2e';

  // Radius
  const radius = radii[0]?.value ?? '8px';

  // Shadow
  const shadow = shadows[0]?.value ?? '0 2px 8px rgba(0,0,0,0.08)';

  // Fonts
  const headingLevel = typo.find((t) => t.typicalTags.some((tag) => /^h[1-3]$/.test(tag))) ?? typo[0];
  const bodyLevel = typo.find((t) => t.typicalTags.some((tag) => tag === 'p' || tag === 'span' || tag === 'div')) ?? typo[typo.length - 1] ?? headingLevel;
  const fontFamily = headingLevel?.fontFamily ?? 'system-ui';
  const headingFont = headingLevel?.fontFamily ?? 'system-ui';
  const headingWeight = headingLevel?.fontWeight ?? '700';
  const bodyFont = bodyLevel?.fontFamily ?? 'system-ui';
  const bodyWeight = bodyLevel?.fontWeight ?? '400';

  // Success/warning: infer from chromatic palette or use fallbacks
  const greens = chromaticAll.filter((c) => {
    const [r, g, b] = c.rgba;
    return g > r && g > b && g > 100;
  });
  const yellows = chromaticAll.filter((c) => {
    const [r, g, b] = c.rgba;
    return r > 180 && g > 150 && b < 100;
  });
  const successColor = greens[0]?.hex ?? '#22c55e';
  const warningColor = yellows[0]?.hex ?? '#eab308';

  return {
    primaryBg, primaryText, secondaryBorderColor, secondaryTextColor,
    surfaceBg, textColor, borderColor, radius, shadow, fontFamily,
    headingFont, headingWeight, bodyFont, bodyWeight, successColor, warningColor,
  };
}

function buildComponentPreviewHtml(colors: ColorToken[], typo: TypographyLevel[], shadows: ShadowToken[], radii: RadiusToken[]): string {
  const t = inferPreviewTokens(colors, typo, shadows, radii);
  const dominantIsDark = isDark(t.surfaceBg);
  const previewBg = dominantIsDark ? '#1a1a2e' : '#f5f5f7';
  const previewCardBg = t.surfaceBg;

  return `
<div class="card">
  <h2>\u{1F3A8} Live Component Preview</h2>
  <div class="preview-subtitle">Components rendered using extracted design tokens</div>

  <div class="preview-section-label">Buttons</div>
  <div class="preview-row">
    <button class="preview-btn" style="background:${t.primaryBg};color:${t.primaryText};border-radius:${t.radius};font-family:'${esc(t.fontFamily)}',system-ui;">Primary Action</button>
    <button class="preview-btn--secondary" style="border:1.5px solid ${t.secondaryBorderColor};color:${t.secondaryTextColor};border-radius:${t.radius};font-family:'${esc(t.fontFamily)}',system-ui;">Secondary</button>
    <button class="preview-btn" style="background:${t.primaryBg};color:${t.primaryText};border-radius:${t.radius};font-family:'${esc(t.fontFamily)}',system-ui;opacity:0.5;cursor:not-allowed;padding:0.45rem 1rem;font-size:0.75rem;">Disabled</button>
  </div>

  <div class="preview-section-label">Card</div>
  <div style="background:${previewBg};border-radius:var(--radius);padding:1.25rem;">
    <div class="preview-card" style="background:${previewCardBg};border:1px solid ${t.borderColor};border-radius:${t.radius};box-shadow:${esc(t.shadow)};">
      <div class="preview-card__title" style="font-family:'${esc(t.headingFont)}',system-ui;font-weight:${t.headingWeight};color:${t.textColor};">Card Heading</div>
      <div class="preview-card__body" style="font-family:'${esc(t.bodyFont)}',system-ui;font-weight:${t.bodyWeight};color:${t.textColor};opacity:0.75;">This card uses the extracted surface color, border, radius, shadow, and typography tokens from the analyzed design system.</div>
      <button class="preview-btn" style="background:${t.primaryBg};color:${t.primaryText};border-radius:${t.radius};font-family:'${esc(t.fontFamily)}',system-ui;font-size:0.8rem;padding:0.4rem 1rem;">Learn More</button>
    </div>
  </div>

  <div class="preview-section-label">Input + Button</div>
  <div class="preview-form">
    <input class="preview-input" type="text" placeholder="Enter your email" style="border:1.5px solid ${t.borderColor};border-radius:${t.radius};font-family:'${esc(t.bodyFont)}',system-ui;color:${t.textColor};">
    <button class="preview-btn" style="background:${t.primaryBg};color:${t.primaryText};border-radius:${t.radius};font-family:'${esc(t.fontFamily)}',system-ui;">Subscribe</button>
  </div>

  <div class="preview-section-label">Badges</div>
  <div class="preview-row">
    <span class="preview-badge" style="background:${t.primaryBg};color:${t.primaryText};border-radius:${t.radius};">Brand</span>
    <span class="preview-badge" style="background:${t.successColor};color:${contrastOn(t.successColor)};border-radius:${t.radius};">Success</span>
    <span class="preview-badge" style="background:${t.warningColor};color:${contrastOn(t.warningColor)};border-radius:${t.radius};">Warning</span>
  </div>
</div>`;
}

function valScoreColor(s: number): string {
  if (s >= 95) return '#22c55e';
  if (s >= 80) return '#eab308';
  return '#ef4444';
}

function valScoreLabel(s: number): string {
  if (s >= 95) return 'Excellent';
  if (s >= 80) return 'Pass';
  return 'Needs Work';
}

function proofColor(p: number): string {
  if (p >= 0.85) return '#22c55e';
  if (p >= 0.65) return '#eab308';
  return '#ef4444';
}

function proofLabel(p: number): string {
  if (p >= 0.85) return 'Excellent';
  if (p >= 0.65) return 'Good';
  return 'Needs Work';
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProofData {
  sourceUrl: string;
  coverage: number;
  totalSampled: number;
  matched: number;
  unmatchedColors: { r: number; g: number; b: number; count: number }[];
  originalScreenshot: string;
  previewScreenshot: string;
  excludedRegions: number;
}

// ─── HTML ───────────────────────────────────────────────────────────────────

function generateReportHtml(
  tokens: DesignTokens,
  validation: ValidationResult | null,
  designMdContent: string | null,
  proofData: ProofData | null,
): string {
  const colors = topColors(tokens.colorTokens, 30);
  const typo = tokens.typographyLevels.slice(0, 12);
  const shadows = tokens.shadowTokens.slice(0, 8);
  const radii = tokens.radiusTokens.slice(0, 8);
  const source = tokens.meta?.sourceUrls?.[0] ?? 'Unknown';
  const primary = inferPrimary(colors);

  const brandColors = colors.filter(isChromatic);
  const structuralColors = colors.filter((c) => !isChromatic(c));

  const score = validation?.score ?? null;
  const checksPassed = validation?.passed?.length ?? 0;
  const totalChecks = checksPassed + (validation?.failures?.length ?? 0) + (validation?.warnings?.length ?? 0);

  const googleFontsLinks: string[] = (tokens.fontInfo as { googleFontsLinks?: string[] })?.googleFontsLinks ?? [];
  const uniqueFamilies = [...new Set(typo.map((t) => t.fontFamily))].filter((f) => f !== 'system-ui');
  const googleFontsTag = googleFontsLinks.length > 0
    ? googleFontsLinks.map((l) => `<link rel="stylesheet" href="${esc(l)}">`).join('\n')
    : uniqueFamilies.length > 0
      ? `<!-- Note: ${uniqueFamilies.join(', ')} may be proprietary -->`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Extraction Report — ${esc(source)}</title>
${googleFontsTag}
<style>
  :root {
    --bg: #f8f9fb;
    --surface: #ffffff;
    --text: #1a1a2e;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --primary: ${primary};
    --radius: 10px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; font-size: 15px; }

  /* ── Header ── */
  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 2.5rem 2rem 2rem;
  }
  .header-inner { max-width: 1100px; margin: 0 auto; }
  .header h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
  .header .url { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.15rem; }
  .stats-row {
    display: flex; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;
  }
  .stat {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1.25rem;
    text-align: center;
    min-width: 100px;
  }
  .stat strong { display: block; font-size: 1.4rem; font-weight: 700; color: var(--text); }
  .stat span { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }

  /* ── Layout ── */
  .container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  .card h2 { font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }

  /* ── Score Ring ── */
  .score-ring {
    width: 110px; height: 110px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    position: relative;
  }
  .score-ring::before { content: ''; position: absolute; inset: 5px; border-radius: 50%; background: var(--surface); }
  .score-num { position: relative; font-size: 2rem; font-weight: 800; }
  .score-label { position: relative; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

  /* ── Checks ── */
  .check-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; font-size: 0.8rem; border-bottom: 1px solid var(--border); }
  .check-item:last-child { border-bottom: none; }
  .badge { font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.45rem; border-radius: 4px; }
  .badge--pass { background: #dcfce7; color: #166534; }
  .badge--fail { background: #fef2f2; color: #991b1b; }
  .badge--warn { background: #fefce8; color: #854d0e; }

  /* ── Colors ── */
  .color-grid { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .swatch {
    width: 72px; border-radius: 8px; overflow: hidden;
    border: 1px solid var(--border); font-size: 0.6rem; text-align: center;
  }
  .swatch__color { height: 44px; display: flex; align-items: flex-end; justify-content: center; padding: 2px; font-family: monospace; font-weight: 600; }
  .swatch__meta { padding: 3px; color: var(--text-muted); line-height: 1.3; }
  .color-section-label { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0.75rem 0 0.4rem; }

  /* ── Typography ── */
  .typo-row { display: flex; align-items: baseline; gap: 1rem; padding: 0.4rem 0; border-bottom: 1px solid var(--border); }
  .typo-row:last-child { border-bottom: none; }
  .typo-sample { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typo-spec { font-size: 0.65rem; color: var(--text-muted); font-family: monospace; white-space: nowrap; }

  /* ── Shadow/Radius ── */
  .shadow-row { display: flex; flex-wrap: wrap; gap: 1rem; }
  .shadow-demo { width: 96px; height: 60px; background: var(--surface); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-family: monospace; color: var(--text-muted); border: 1px solid var(--border); }
  .radius-row { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .radius-demo { width: 48px; height: 48px; background: var(--primary); opacity: 0.15; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: var(--text); }

  /* ── Table ── */
  .comp-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
  .comp-table th { text-align: left; font-weight: 600; padding: 0.4rem; border-bottom: 2px solid var(--border); }
  .comp-table td { padding: 0.4rem; border-bottom: 1px solid var(--border); }
  .comp-table td:last-child { text-align: right; color: var(--text-muted); }

  /* ── Scoring Methodology ── */
  .methodology { font-size: 0.8rem; color: var(--text-muted); margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); line-height: 1.7; }
  .methodology strong { color: var(--text); }

  /* ── DESIGN.md ── */
  .md-actions { display: flex; gap: 0.75rem; }
  .md-actions button {
    padding: 0.5rem 1.25rem; font-size: 0.8rem; font-weight: 600;
    border-radius: 6px; cursor: pointer; font-family: inherit; transition: opacity 0.15s;
  }
  .md-actions button:hover { opacity: 0.85; }
  .btn-primary { background: var(--primary); color: #fff; border: none; }
  .btn-secondary { background: transparent; color: var(--text); border: 1.5px solid var(--border); }
  .md-preview {
    background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
    padding: 1.5rem; font-size: 0.85rem; line-height: 1.8;
    max-height: 500px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word;
    font-family: 'SF Mono', 'Fira Code', monospace; margin-top: 1rem;
  }

  /* ── Proof ── */
  .proof-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 900px) { .proof-comparison { grid-template-columns: 1fr; } }
  .proof-panel { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface); }
  .proof-panel__label { padding: 0.5rem 0.75rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); border-bottom: 1px solid var(--border); background: var(--bg); }
  .proof-panel img { width: 100%; height: auto; display: block; }

  .footer { text-align: center; padding: 2rem; font-size: 0.7rem; color: var(--text-muted); }

  /* ── Live Component Preview ── */
  .preview-subtitle { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem; }
  .preview-section-label { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 1.25rem 0 0.6rem; }
  .preview-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
  .preview-btn {
    display: inline-block; padding: 0.6rem 1.5rem; font-size: 0.85rem; font-weight: 600;
    border: none; cursor: pointer; transition: opacity 0.15s, transform 0.1s;
    text-decoration: none; line-height: 1.4;
  }
  .preview-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .preview-btn:active { transform: translateY(0); }
  .preview-btn--secondary {
    background: transparent; cursor: pointer; transition: opacity 0.15s;
    font-size: 0.85rem; font-weight: 600; line-height: 1.4; padding: 0.6rem 1.5rem;
  }
  .preview-btn--secondary:hover { opacity: 0.7; }
  .preview-card {
    padding: 1.25rem; max-width: 380px; width: 100%;
  }
  .preview-card__title { font-size: 1.05rem; margin-bottom: 0.4rem; }
  .preview-card__body { font-size: 0.85rem; line-height: 1.6; margin-bottom: 0.75rem; }
  .preview-form { display: flex; gap: 0.5rem; align-items: stretch; flex-wrap: wrap; }
  .preview-input {
    padding: 0.55rem 0.85rem; font-size: 0.85rem; outline: none; flex: 1; min-width: 160px;
    background: transparent; transition: border-color 0.15s;
  }
  .preview-input:focus { border-color: var(--primary); }
  .preview-badge {
    display: inline-block; padding: 0.2rem 0.65rem; font-size: 0.7rem; font-weight: 700;
    line-height: 1.4;
  }
</style>
</head>
<body>

<!-- ═══════════ HEADER ═══════════ -->
<header class="header">
  <div class="header-inner">
    <h1>Design Extraction Report</h1>
    <div class="url">${esc(source)}</div>
    <div class="stats-row">
      <div class="stat"><strong>${tokens.colorTokens.length}</strong><span>Colors</span></div>
      <div class="stat"><strong>${tokens.typographyLevels.length}</strong><span>Type Levels</span></div>
      <div class="stat"><strong>${tokens.shadowTokens.length}</strong><span>Shadows</span></div>
      <div class="stat"><strong>${tokens.meta?.totalPages ?? '?'}</strong><span>Pages</span></div>
      <div class="stat"><strong>${tokens.meta?.totalElements ?? '?'}</strong><span>Elements</span></div>
      ${proofData ? `<div class="stat" style="border-color:${proofColor(proofData.coverage)}40;"><strong style="color:${proofColor(proofData.coverage)}">${(proofData.coverage * 100).toFixed(1)}%</strong><span>Fidelity</span></div>` : ''}
      ${score !== null ? `<div class="stat" style="border-color:${valScoreColor(score)}40;"><strong style="color:${valScoreColor(score)}">${score}</strong><span>Quality</span></div>` : ''}
    </div>
  </div>
</header>

<div class="container">

<!-- ═══════════ VALIDATION ═══════════ -->
${score !== null ? `
<div class="grid-2">
  <div class="card">
    <h2>📊 Quality Score</h2>
    <div style="display:flex;align-items:center;gap:1.5rem;">
      <div class="score-ring" style="background:conic-gradient(${valScoreColor(score)} ${score * 3.6}deg, var(--border) 0deg);flex-shrink:0;">
        <span class="score-num" style="color:${valScoreColor(score)}">${score}</span>
        <span class="score-label">${valScoreLabel(score)}</span>
      </div>
      <div style="font-size:0.8rem;color:var(--text-muted);">${checksPassed}/${totalChecks} checks passed</div>
    </div>
    <div class="methodology">
      <strong>How this score is calculated:</strong> Start at 100. Each <strong>failure</strong> (phantom color, wrong hex format, missing section) costs <strong>5 points</strong>. Each <strong>warning</strong> (unknown font, low color count) costs <strong>1 point</strong>. Minimum passing score: 80.
    </div>
  </div>
  <div class="card">
    <h2>✅ Validation Details</h2>
    ${validation!.passed.map((p) => `<div class="check-item"><span class="badge badge--pass">PASS</span> ${esc(p)}</div>`).join('\n')}
    ${validation!.failures.map((f) => `<div class="check-item"><span class="badge badge--fail">FAIL</span> ${esc(f.type)}: ${esc(f.message)}</div>`).join('\n')}
    ${validation!.warnings.map((w) => `<div class="check-item"><span class="badge badge--warn">WARN</span> ${esc(w.type)}: ${esc(w.message)}</div>`).join('\n')}
  </div>
</div>
` : ''}

<!-- ═══════════ COLOR PALETTE ═══════════ -->
<div class="card">
  <h2>🎨 Color Palette (${colors.length} tokens)</h2>
  ${brandColors.length > 0 ? `
  <div class="color-section-label">Brand Colors (${brandColors.length})</div>
  <div class="color-grid">
${brandColors.map((c) => `    <div class="swatch"><div class="swatch__color" style="background:${c.hex};color:${contrastOn(c.hex)}">${c.hex}</div><div class="swatch__meta">${colorRole(c)}<br>×${c.frequency}</div></div>`).join('\n')}
  </div>` : ''}
  ${structuralColors.length > 0 ? `
  <div class="color-section-label">Structural Colors (${structuralColors.length})</div>
  <div class="color-grid">
${structuralColors.map((c) => `    <div class="swatch"><div class="swatch__color" style="background:${c.hex};color:${contrastOn(c.hex)}">${c.hex}</div><div class="swatch__meta">${colorRole(c)}<br>×${c.frequency}</div></div>`).join('\n')}
  </div>` : ''}
</div>

<!-- ═══════════ TYPOGRAPHY ═══════════ -->
<div class="card">
  <h2>🔤 Typography Scale</h2>
${typo.map((t) => `  <div class="typo-row"><span class="typo-sample" style="font-family:'${esc(t.fontFamily)}',system-ui;font-size:min(${t.fontSize},2rem);font-weight:${t.fontWeight};line-height:${t.lineHeight}">The quick brown fox jumps</span><span class="typo-spec">${esc(t.fontFamily)} ${t.fontSize} w${t.fontWeight}</span></div>`).join('\n')}
</div>

<div class="grid-2">
${shadows.length > 0 ? `<div class="card"><h2>🌑 Shadows (${shadows.length})</h2><div class="shadow-row">${shadows.map((s) => `<div class="shadow-demo" style="box-shadow:${esc(s.value)}">${esc(s.type)}</div>`).join('')}</div></div>` : ''}
${radii.length > 0 ? `<div class="card"><h2>◼️ Radius (${radii.length})</h2><div class="radius-row">${radii.map((r) => `<div class="radius-demo" style="border-radius:${r.value}">${r.value}</div>`).join('')}</div></div>` : ''}
</div>

<!-- ═══════════ COMPONENTS ═══════════ -->
${tokens.components && tokens.components.length > 0 ? `
<div class="card">
  <h2>🧩 Components Detected</h2>
  <table class="comp-table">
    <thead><tr><th>Type</th><th>Variants</th><th>Count</th></tr></thead>
    <tbody>
${tokens.components.map((cg: { type: string; variants: { name: string; count: number }[] }) => {
  const total = cg.variants.reduce((s: number, v: { count: number }) => s + v.count, 0);
  return `      <tr><td>${esc(cg.type)}</td><td>${cg.variants.map((v: { name: string }) => v.name).join(', ')}</td><td>${total}</td></tr>`;
}).join('\n')}
    </tbody>
  </table>
</div>` : ''}

<!-- ═══════════ LIVE COMPONENT PREVIEW ═══════════ -->
${buildComponentPreviewHtml(colors, typo, shadows, radii)}

<!-- ═══════════ DARK MODE ═══════════ -->
${(tokens as unknown as Record<string, unknown>).darkMode && ((tokens as unknown as Record<string, unknown>).darkMode as { supported: boolean }).supported ? (() => {
  const dm = (tokens as unknown as Record<string, unknown>).darkMode as { supported: boolean; detectionMethod: string; variableDiff: { name: string; lightValue: string; darkValue: string }[]; detectionSource?: string };

  function classifyDarkModeVar(name: string): string {
    const lower = name.toLowerCase();
    if (/bg|background|surface|canvas/.test(lower)) return 'Backgrounds & Surfaces';
    if (/text|foreground|fg|heading|body|label/.test(lower)) return 'Text Colors';
    if (/border|divider|separator|outline/.test(lower)) return 'Borders';
    if (/shadow|elevation|ring/.test(lower)) return 'Shadows & Elevation';
    return 'Other';
  }

  const groups: Record<string, typeof dm.variableDiff> = {};
  const groupOrder = ['Backgrounds & Surfaces', 'Text Colors', 'Borders', 'Shadows & Elevation', 'Other'];
  for (const v of dm.variableDiff) {
    const group = classifyDarkModeVar(v.name);
    if (!groups[group]) groups[group] = [];
    groups[group].push(v);
  }

  function renderVarRow(v: { name: string; lightValue: string; darkValue: string }): string {
    return `      <tr><td style="font-family:monospace;font-size:0.75rem">${esc(v.name)}</td><td><span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:4px;background:${v.lightValue};border:1px solid var(--border)"></span>${esc(v.lightValue)}</td><td><span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:4px;background:${v.darkValue};border:1px solid var(--border)"></span>${esc(v.darkValue)}</td></tr>`;
  }

  const groupsHtml = groupOrder
    .filter((g) => groups[g] && groups[g].length > 0)
    .map((g) => `
    <div class="color-section-label">${esc(g)} (${groups[g].length})</div>
    <table class="comp-table">
      <thead><tr><th>Variable</th><th>Light</th><th>Dark</th></tr></thead>
      <tbody>
${groups[g].map(renderVarRow).join('\n')}
      </tbody>
    </table>`)
    .join('\n');

  return `
<div class="card">
  <h2>🌙 Dark Mode System (${dm.variableDiff.length} variables)</h2>
  <p style="margin-bottom:1rem;font-size:0.85rem;">Detected via <strong>${esc(dm.detectionMethod)}</strong>${dm.detectionSource ? ` on ${esc(dm.detectionSource)}` : ''}</p>
  ${dm.variableDiff.length > 0 ? groupsHtml : '<p style="color:var(--text-muted);font-size:0.85rem;">No variable differences detected.</p>'}
</div>`;
})() : ''}

<!-- ═══════════ FIDELITY PROOF ═══════════ -->
${proofData ? (() => {
  const pct = proofData.coverage;
  const pctStr = (pct * 100).toFixed(1);
  return `
<div class="card">
  <h2>🔬 Fidelity Proof</h2>
  <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;margin-bottom:1rem;">
    <div class="score-ring" style="background:conic-gradient(${proofColor(pct)} ${pct * 360}deg, var(--border) 0deg);width:90px;height:90px;flex-shrink:0;">
      <span class="score-num" style="color:${proofColor(pct)};font-size:1.3rem">${pctStr}%</span>
      <span class="score-label">${proofLabel(pct)}</span>
    </div>
    <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.8;">
      <strong>${proofData.totalSampled.toLocaleString()}</strong> CSS pixels sampled · <strong>${proofData.matched.toLocaleString()}</strong> matched (ΔE&lt;12)<br>
      ${proofData.excludedRegions} image/media regions excluded from sampling
    </div>
  </div>
  <div class="proof-comparison">
    <div class="proof-panel">
      <div class="proof-panel__label">🌐 Original Site</div>
      <img src="data:image/png;base64,${proofData.originalScreenshot}" alt="Original">
    </div>
    <div class="proof-panel">
      <div class="proof-panel__label">🎨 Extracted Preview</div>
      <img src="data:image/png;base64,${proofData.previewScreenshot}" alt="Preview">
    </div>
  </div>
  <div class="methodology">
    <strong>How fidelity is measured:</strong> Playwright captures the live site, samples 2,000 pixels from CSS-rendered areas (excluding &lt;img&gt;, &lt;video&gt;, &lt;svg&gt;, and background-image regions), then computes OKLCH perceptual color distance (ΔE) against the extracted palette. Pixels within ΔE&lt;12 of any palette color count as matched.
  </div>
</div>`;
})() : ''}

<!-- ═══════════ DESIGN.MD ═══════════ -->
${designMdContent ? `
<div class="card">
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
    <h2 style="margin-bottom:0;">📄 DESIGN.md</h2>
    <div class="md-actions">
      <button class="btn-primary" onclick="(() => {
        const blob = new Blob([document.getElementById('md-content').textContent], {type:'text/markdown'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'DESIGN.md';
        a.click();
      })()">⬇ Download MD File</button>
      <button class="btn-secondary" onclick="(() => {
        const text = document.getElementById('md-content').textContent;
        navigator.clipboard.writeText(text).then(() => {
          this.innerHTML = '✅ Copied!';
          setTimeout(() => { this.innerHTML = '📋 Copy All Content'; }, 2000);
        });
      })()">📋 Copy All Content</button>
    </div>
  </div>
  <div class="md-preview">${esc(designMdContent)}</div>
  <pre id="md-content" style="display:none">${esc(designMdContent)}</pre>
</div>` : `
<div class="card" style="text-align:center;padding:2rem;color:var(--text-muted);">
  <h2>📄 DESIGN.md</h2>
  <p>Not yet generated. Use Claude Code skill <code>/design-md</code> to create from tokens.json.</p>
</div>`}

</div>

<footer class="footer">design-md-generator · ${new Date().toISOString().slice(0, 10)}</footer>

</body>
</html>`;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function generateReport(
  tokensPath: string,
  outputDir: string,
  designMdPath?: string,
): void {
  const tokens: DesignTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  let designMdContent: string | null = null;
  let validation: ValidationResult | null = null;

  if (designMdPath && fs.existsSync(designMdPath)) {
    designMdContent = fs.readFileSync(designMdPath, 'utf-8');
    validation = validateDesignMd(designMdContent, tokens);
  }

  let proofData: ProofData | null = null;
  const proofDataPath = path.join(outputDir, 'proof-data.json');
  if (fs.existsSync(proofDataPath)) {
    proofData = JSON.parse(fs.readFileSync(proofDataPath, 'utf-8'));
    console.log(`  Proof data loaded (coverage: ${((proofData?.coverage ?? 0) * 100).toFixed(1)}%)`);
  }

  const html = generateReportHtml(tokens, validation, designMdContent, proofData);
  const outPath = path.join(outputDir, 'report.html');
  fs.writeFileSync(outPath, html);
  console.log(`  Generated report.html → ${outPath}`);

  if (validation) {
    console.log(`  Quality score: ${validation.score}/100 (${validation.passed.length} passed, ${validation.failures.length} failures, ${validation.warnings.length} warnings)`);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error(`Usage:
  npx ts-node scripts/report-gen.ts <tokens-json> [output-dir] [design-md]

Examples:
  npx ts-node scripts/report-gen.ts output/stripe.com/tokens.json
  npx ts-node scripts/report-gen.ts output/stripe.com/tokens.json output/stripe.com/ DESIGN.md`);
    process.exit(1);
  }

  const tokensPath = args[0];
  const outputDir = args[1] ?? path.dirname(tokensPath);
  const designMdPath = args[2];

  generateReport(tokensPath, outputDir, designMdPath);
}
