// ────────────────────────────────────────────────────────────────
// Deterministic DESIGN.md section renderers (doc-as-view, Phase A)
//
// These render the value-bearing sections directly from tokens.json with ZERO AI
// involvement, removing the worst hallucination surface: hand-assembling value tables
// from raw JSON. Output is deterministic (identical tokens produce byte-identical
// markdown) and naming is FUNCTIONAL — derived from measured usage, never an evocative
// name — so no name is invented. Stability gating is enforced here: L1/L2 colours reach
// the main table, L3 only the "Subject to change" block, L4 is excluded entirely.
// ────────────────────────────────────────────────────────────────

import type { ColorToken, DesignTokens, TypographyLevel } from './types';

function normalizeHex(hex: string): string {
  const h = hex.replace('#', '').toLowerCase();
  return h.length >= 6 ? `#${h.slice(0, 6)}` : `#${h}`;
}

function layerOf(c: ColorToken): string | undefined {
  return (c as unknown as { stability?: { layer?: string } }).stability?.layer;
}

// Functional role: every usage dimension that is non-zero, with its measured count,
// ordered by dominance. No evocative name is invented.
function colorRole(c: ColorToken): string {
  const dims: [string, number][] = [
    ['border', c.usedAs.borderColor],
    ['text', c.usedAs.textColor],
    ['background', c.usedAs.bgColor],
    ['icon', c.usedAs.iconColor],
    ['gradient', c.usedAs.gradientColor],
    ['shadow', c.usedAs.shadowColor],
  ];
  const used = dims.filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  return used.length === 0 ? 'unused' : used.map(([k, n]) => `${k} ${n}`).join(', ');
}

export function formatColorTable(tokens: DesignTokens): string {
  const main = tokens.colorTokens.filter((c) => {
    const l = layerOf(c);
    return l === 'infrastructure' || l === 'system';
  });
  const campaign = tokens.colorTokens.filter((c) => layerOf(c) === 'campaign');

  const header = '| Hex | Usage (measured) | Frequency | CSS var |\n|-----|------------------|-----------|---------|\n';
  const row = (c: ColorToken) =>
    `| \`${normalizeHex(c.hex)}\` | ${colorRole(c)} | ${c.frequency} | ${c.cssVariableNames[0] ? '`' + c.cssVariableNames[0] + '`' : '-'} |`;

  let out = '## 2. Color Palette & Roles\n\n';
  out += main.length > 0
    ? header + main.map(row).join('\n') + '\n'
    : '_No L1/L2 system colours were extracted._\n';
  if (campaign.length > 0) {
    out += '\n### Current Campaign Colors (Subject to change)\n\n' + header + campaign.map(row).join('\n') + '\n';
  }
  return out;
}

// Role label from the most representative tag (h1/h2/p/...) or, when none, the size.
function typeRole(t: TypographyLevel): string {
  return (t.typicalTags ?? [])[0] ?? `${t.fontSize} text`;
}

export function formatTypographyTable(tokens: DesignTokens): string {
  const levels = [...tokens.typographyLevels].sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize));
  const header = '| Role | Font | Size / Line | Weight | Letter-spacing | Transform |\n|------|------|-------------|--------|----------------|-----------|\n';
  const row = (t: TypographyLevel) =>
    `| ${typeRole(t)} | \`${t.fontFamily}\` | ${t.fontSize} / ${t.lineHeight} | ${t.fontWeight} | ${t.letterSpacing} | ${t.textTransform ?? 'none'} |`;
  let out = '## 3. Typography Rules\n\n';
  out += levels.length > 0
    ? header + levels.map(row).join('\n') + '\n'
    : '_No typography levels were extracted._\n';
  return out;
}

// §6 is where "gradient-as-depth" was fabricated. Rendering it deterministically from
// shadowTokens/gradients removes that surface: when there are no shadows the section is
// FLAT by construction, and any gradients are listed as decorative surface treatments,
// never a depth/elevation system.
export function formatDepthSection(tokens: DesignTokens): string {
  const shadows = tokens.shadowTokens ?? [];
  const gradients = (tokens as unknown as { gradients?: { value?: string; location?: string }[] }).gradients ?? [];
  const grad = (g: { value?: string; location?: string } | string) =>
    typeof g === 'string' ? { value: g, location: 'decorative' } : { value: g.value ?? '', location: g.location ?? 'decorative' };

  let out = '## 6. Depth & Elevation\n\n';
  if (shadows.length === 0) {
    out += '**Flat.** Zero shadow tokens were extracted; the system uses no box-shadow elevation.\n';
    if (gradients.length > 0) {
      out += `\n${gradients.length} decorative gradient${gradients.length === 1 ? '' : 's'} were captured (surface treatments, NOT a depth or elevation system):\n\n`;
      out += '| Gradient | Where |\n|----------|-------|\n';
      out += gradients.map((g) => { const x = grad(g); return `| \`${x.value.slice(0, 80)}\` | ${x.location} |`; }).join('\n') + '\n';
    }
    return out;
  }
  out += '| Shadow | Type | Frequency |\n|--------|------|-----------|\n';
  out += shadows.map((s) => {
    const sh = s as unknown as { value?: string; type?: string; frequency?: number };
    return `| \`${sh.value ?? ''}\` | ${sh.type ?? '-'} | ${sh.frequency ?? '-'} |`;
  }).join('\n') + '\n';
  return out;
}

// §9 contrast pairs rendered verbatim from the measured a11y data. Colours are emitted
// as-is (they may be hex or rgb) — no normalization, no invented ratios.
export function formatContrastTable(tokens: DesignTokens): string {
  const pairs = (tokens as unknown as { a11yTokens?: { contrastPairs?: { foreground: string; background: string; ratio: number; meetsAA: boolean; meetsAAA: boolean; usageCount: number }[] } }).a11yTokens?.contrastPairs ?? [];
  let out = '### Contrast Pairs\n\n';
  if (pairs.length === 0) return out + '_No contrast pairs were extracted._\n';
  const sorted = [...pairs].sort((a, b) => b.usageCount - a.usageCount);
  out += '| Foreground | Background | Ratio | AA | AAA | Usage |\n|------------|------------|-------|----|----|-------|\n';
  out += sorted.map((p) => `| \`${p.foreground}\` | \`${p.background}\` | ${p.ratio.toFixed(2)} | ${p.meetsAA ? 'PASS' : 'fail'} | ${p.meetsAAA ? 'PASS' : 'fail'} | ${p.usageCount} |`).join('\n') + '\n';
  return out;
}

// §5 spacing scale rendered from the measured spacing system. Every value verbatim.
export function formatSpacingScale(tokens: DesignTokens): string {
  const s = (tokens as unknown as { spacingSystem?: { baseUnit: number; scale: number[]; maxContentWidth: string | null } }).spacingSystem;
  let out = '### Spacing Scale\n\n';
  if (!s || (s.scale ?? []).length === 0) return out + '_No spacing scale was extracted._\n';
  out += `Base unit: \`${s.baseUnit}px\`. Scale: ${s.scale.map((n) => '`' + n + 'px`').join(', ')}.\n`;
  if (s.maxContentWidth) out += `\nMax content width: \`${s.maxContentWidth}\`.\n`;
  return out;
}

// §4 border-radius tokens, most-frequent first, every value verbatim.
export function formatRadiusTable(tokens: DesignTokens): string {
  const radii = (tokens as unknown as { radiusTokens?: { value: string; frequency: number; typicalElements: string[] }[] }).radiusTokens ?? [];
  let out = '### Border Radius\n\n';
  if (radii.length === 0) return out + '_No border-radius tokens were extracted._\n';
  const sorted = [...radii].sort((a, b) => b.frequency - a.frequency);
  out += '| Radius | Frequency | Typical elements |\n|--------|-----------|------------------|\n';
  out += sorted.map((r) => `| \`${r.value}\` | ${r.frequency} | ${(r.typicalElements ?? []).slice(0, 3).join(', ') || '-'} |`).join('\n') + '\n';
  return out;
}
