// ────────────────────────────────────────────────────────────────
// MODULE: v3 Style-Reference Formatters
// ────────────────────────────────────────────────────────────────
//
// Deterministic emitters for the v3 "Style Reference" schema. Everything here renders
// directly from tokens.json with ZERO AI involvement, so the worst fabrication surface —
// the AI concretizing a vague value (e.g. inventing "100rem" when the real max-width is
// "100%") — is removed. Colour NAMES are assigned by a deterministic hue+lightness
// lexicon (evocative but grounded), so the Name, Token slug, and Quick Start stay
// mutually consistent without an AI naming pass. The AI's job downstream is prose only:
// intro voice, component descriptions, do/don't, similar brands — never a value.

import {
  createSchemaConsumerContract,
  resolveQuickStartGroups,
  resolveSchemaSections,
  schemaSectionForEmitter,
  V3_SCHEMA,
} from './schema-v3';
import { normalizeTypographyScale } from './typography-role-v3';

import type {
  QuickStartGroup,
  QuickStartTargetId,
  SchemaConsumerContract,
  SchemaSection,
  StyleReferenceSchema,
} from './schema-v3';
import type { ColorToken, DesignTokens, MeasuredMotionSection, TypographyLevel } from './types';

// ── colour space ────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

function normalizeHex(hex: string): string {
  const h = hex.replace('#', '').toLowerCase();
  return h.length >= 6 ? `#${h.slice(0, 6)}` : `#${h}`;
}

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── deterministic colour naming ─────────────────────────────────
// Evocative-but-grounded names from hue + lightness. Not brand-bespoke (the live site's
// own names are unknown), but stable, characterizing, and collision-resolved.
function baseName(hex: string): { name: string; descriptor: string } {
  const { h, s, l } = rgbToHsl(...hexToRgb(hex));
  if (s < 0.12) {
    // neutrals by lightness
    if (l >= 0.93) return { name: 'Snow', descriptor: 'a near-white' };
    if (l >= 0.82) return { name: 'Linen', descriptor: 'a soft off-white' };
    if (l <= 0.08) return { name: 'Ink', descriptor: 'a near-black' };
    if (l <= 0.2) return { name: 'Obsidian', descriptor: 'a deep near-black' };
    if (l <= 0.35) return { name: 'Graphite', descriptor: 'a dark gray' };
    if (l <= 0.55) return { name: 'Slate', descriptor: 'a mid gray' };
    if (l <= 0.72) return { name: 'Steel', descriptor: 'a light gray' };
    return { name: 'Mist', descriptor: 'a pale gray' };
  }
  const fam = (() => {
    if (h < 15 || h >= 345) return { n: 'Crimson', d: 'red' };
    if (h < 45) return { n: 'Ember', d: 'orange' };
    if (h < 70) return { n: 'Citron', d: 'yellow' };
    if (h < 160) return s > 0.55 ? { n: 'Voltage', d: 'green' } : { n: 'Sage', d: 'green-gray' };
    if (h < 200) return { n: 'Teal', d: 'teal' };
    if (h < 255) return { n: 'Azure', d: 'blue' };
    if (h < 290) return { n: 'Indigo', d: 'indigo' };
    return { n: 'Magenta', d: 'magenta' };
  })();
  const tier = l <= 0.25 ? 'Deep ' : l >= 0.78 ? 'Light ' : '';
  return { name: `${tier}${fam.n}`, descriptor: `a ${l <= 0.25 ? 'deep ' : l >= 0.78 ? 'light ' : ''}${fam.d}` };
}

// Dominant measured usage, as a role phrase (no frequency numbers).
function usageRole(c: ColorToken): string {
  const u = c.usedAs ?? ({} as ColorToken['usedAs']);
  const dims: [string, number][] = [
    ['text', u.textColor ?? 0],
    ['borders', u.borderColor ?? 0],
    ['backgrounds', u.bgColor ?? 0],
    ['icons', u.iconColor ?? 0],
    ['gradients', u.gradientColor ?? 0],
  ];
  const used = dims.filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return used.length ? used.join(', ') : 'decorative use';
}

export interface NamedColor {
  hex: string;
  name: string;
  token: string;
  role: string;
  layer: string | undefined;
}

export function nameColors(tokens: DesignTokens): NamedColor[] {
  const used = new Map<string, number>();
  return tokens.colorTokens.map((c) => {
    const { name, descriptor } = baseName(c.hex);
    let finalName = name;
    const seen = used.get(name) ?? 0;
    if (seen > 0) finalName = `${name} ${seen + 1}`; // collision-resolve deterministically
    used.set(name, seen + 1);
    const layer = (c as unknown as { stability?: { layer?: string } }).stability?.layer;
    return {
      hex: normalizeHex(c.hex),
      name: finalName,
      token: `--color-${slug(finalName)}`,
      role: `${usageRole(c)} — ${descriptor}`,
      layer,
    };
  });
}

// ── §3 Tokens — Colors ──────────────────────────────────────────
export function formatColorsV3(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
  section: SchemaSection = schemaSectionForEmitter('colors', schema),
): string {
  const named = nameColors(tokens);
  // Anything not explicitly campaign or content lands in the main table — a token whose
  // stability layer never got classified must not silently vanish from the palette.
  const main = named.filter((n) => n.layer !== 'campaign' && n.layer !== 'content');
  const campaign = named.filter((n) => n.layer === 'campaign');
  const row = (n: NamedColor) => `| ${n.name} | \`${n.hex}\` | \`${n.token}\` | ${n.role} |`;
  const header = '| Name | Value | Token | Role |\n|------|-------|-------|------|\n';
  let out = `${section.heading}\n\n`;
  out += main.length ? header + main.map(row).join('\n') + '\n' : '_No L1/L2 system colours were extracted._\n';
  if (campaign.length) out += '\n### Current Campaign Colors (Subject to change)\n\n' + header + campaign.map(row).join('\n') + '\n';
  return out;
}

// ── §5 Tokens — Spacing & Shapes (values VERBATIM, incl. max-width) ──
export function formatSpacingShapesV3(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
  section: SchemaSection = schemaSectionForEmitter('spacing-shapes', schema),
): string {
  const sp = (tokens as unknown as { spacingSystem?: { baseUnit?: number; scale?: number[]; maxContentWidth?: string | null } }).spacingSystem;
  const radii = (tokens as unknown as { radiusTokens?: { value: string; frequency: number; typicalElements: string[] }[] }).radiusTokens ?? [];
  const shadows = tokens.shadowTokens ?? [];
  const scale = sp?.scale ?? [];

  let out = `${section.heading}\n\n`;
  if (sp?.baseUnit) out += `**Base unit:** ${sp.baseUnit}px\n`;
  // Density from how large the gaps run relative to the base unit.
  const maxGap = scale.length ? Math.max(...scale) : 0;
  const density = maxGap >= 80 ? 'spacious' : maxGap >= 40 ? 'comfortable' : 'compact';
  out += `**Density:** ${density}\n\n`;

  if (scale.length) {
    out += '### Spacing Scale\n\n| Name | Value | Token |\n|------|-------|-------|\n';
    out += scale.map((n) => `| ${n} | ${n}px | \`--spacing-${n}\` |`).join('\n') + '\n\n';
  }
  if (radii.length) {
    out += '### Border Radius\n\n| Element | Value |\n|---------|-------|\n';
    const byElem = [...radii].sort((a, b) => b.frequency - a.frequency)
      .map((r) => `| ${(r.typicalElements ?? [])[0] ?? 'elements'} | ${r.value} |`);
    out += byElem.join('\n') + '\n\n';
  }
  if (shadows.length) {
    out += '### Shadows\n\n| Name | Value | Token |\n|------|-------|-------|\n';
    out += shadows.map((s, i) => {
      const v = (s as unknown as { value?: string }).value ?? '';
      return `| ${i + 1} | \`${v}\` | \`--shadow-${i + 1}\` |`;
    }).join('\n') + '\n\n';
  }
  out += '### Layout\n';
  // VERBATIM max-width — the fabrication guard. "100%" stays "100%", never "100rem".
  out += `- **Page max-width:** ${sp?.maxContentWidth ?? 'not measured'}\n`;
  return out;
}

// ── §8 Surfaces (background colours actually used) ──────────────
export function formatSurfacesV3(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
  section: SchemaSection = schemaSectionForEmitter('surfaces', schema),
): string {
  const named = nameColors(tokens);
  const bgs = named
    .filter((n) => {
      const tok = tokens.colorTokens.find((c) => normalizeHex(c.hex) === n.hex);
      return (tok?.usedAs.bgColor ?? 0) > 0;
    })
    .sort((a, b) => rgbToHsl(...hexToRgb(a.hex)).l - rgbToHsl(...hexToRgb(b.hex)).l) // dark→light? canvas usually lightest
    .reverse()
    .slice(0, 4);
  let out = `${section.heading}\n\n`;
  if (!bgs.length) return out + '_No background-surface colours were extracted._\n';
  out += '| Level | Name | Value | Purpose |\n|-------|------|-------|---------|\n';
  out += bgs.map((n, i) => `| ${i} | ${i === 0 ? 'Canvas' : n.name} | \`${n.hex}\` | ${i === 0 ? 'Full-bleed page background' : 'Surface / panel'} |`).join('\n') + '\n';
  return out;
}

function markdownTableCell(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').replace(/`/g, '\\`').trim();
}

// ── Motion (measured detector output only) ─────────────────────
export function formatMotionV3(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
  section: SchemaSection = schemaSectionForEmitter('motion', schema),
): string {
  const motion = tokens.motionSystem as MeasuredMotionSection;
  const durationRows = motion.durationScale.map((band) => (
    `| ${markdownTableCell(band.label)} | \`${markdownTableCell(band.value)}\` |`
  ));
  const timingFunctions = [...motion.timingFunctions]
    .sort((left, right) => right.frequency - left.frequency)
    .map((timing) => `\`${markdownTableCell(timing.value)}\``);

  const lines = [
    section.heading,
    '',
    `**Reduced-motion query:** ${motion.prefersReducedMotion ? 'detected' : 'not detected'}`,
    '',
    '### Duration Scale',
    '',
    '| Band | Duration |',
    '|------|----------|',
    ...durationRows,
  ];

  if (timingFunctions.length > 0) {
    lines.push(
      '',
      '### Timing Functions',
      '',
      `**Primary:** \`${markdownTableCell(motion.primaryTimingFunction)}\``,
      '',
      `**Observed:** ${timingFunctions.join(', ')}`,
    );
  }

  if (motion.keyframeAnimations.length > 0) {
    lines.push(
      '',
      '### Keyframe Animations',
      '',
      '| Name | Type | Duration | Properties |',
      '|------|------|----------|------------|',
      ...motion.keyframeAnimations.map((animation) => (
        `| ${markdownTableCell(animation.name)} | ${markdownTableCell(animation.type)} | \`${markdownTableCell(animation.duration)}\` | ${animation.properties.map(markdownTableCell).join(', ')} |`
      )),
    );
  }

  return `${lines.join('\n')}\n`;
}

// ── Quick Start (CSS + Tailwind) — schema groups own the emitted surface ──
function fontValue(value: string): string {
  return /\s/.test(value) ? `'${value.replace(/'/g, "\\'")}'` : value;
}

function typographyEntries(
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): readonly { level: TypographyLevel; role: string }[] {
  const levels = [...(tokens.typographyLevels ?? [])]
    .sort((left, right) => parseFloat(left.fontSize) - parseFloat(right.fontSize));
  const roles = normalizeTypographyScale(levels, schema);
  return levels.map((level, index) => ({
    level,
    role: roles[index].normalizedRole.replace(':', '-'),
  }));
}

function emitQuickStartGroup(
  group: QuickStartGroup,
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): readonly string[] {
  const named = nameColors(tokens)
    .filter((color) => color.layer !== 'content' && color.layer !== 'campaign');
  const spacing = (tokens as unknown as {
    spacingSystem?: { scale?: number[]; maxContentWidth?: string | null };
  }).spacingSystem;
  const entries = typographyEntries(tokens, schema);
  switch (group.emitKind) {
    case 'colors':
      return named.map((color) => `${color.token}: ${color.hex};`);
    case 'font-family': {
      const seen = new Set<string>();
      return entries.flatMap(({ level, role }) => {
        if (seen.has(level.fontFamily)) return [];
        seen.add(level.fontFamily);
        return [`--font-${role}: ${fontValue(level.fontFamily)};`];
      });
    }
    case 'font-size':
      return entries.map(({ level, role }) => `--text-${role}: ${level.fontSize};`);
    case 'line-height':
      return entries.map(({ level, role }) => `--leading-${role}: ${level.lineHeight};`);
    case 'font-weight':
      return entries.map(({ level, role }) => `--weight-${role}: ${level.fontWeight};`);
    case 'letter-spacing':
      return entries.map(({ level, role }) => `--tracking-${role}: ${level.letterSpacing};`);
    case 'spacing':
      return (spacing?.scale ?? []).map((value) => `--spacing-${value}: ${value}px;`);
    case 'layout':
      return spacing?.maxContentWidth
        ? [`--page-max-width: ${spacing.maxContentWidth};`]
        : [];
    case 'radius':
      return (tokens.radiusTokens ?? []).map((radius) => (
        `--radius-${slug((radius.typicalElements ?? [])[0] ?? 'base')}: ${radius.value};`
      ));
    case 'shadow':
      return (tokens.shadowTokens ?? []).map((shadow, index) => (
        `--shadow-${index + 1}: ${shadow.value};`
      ));
  }
}

function quickStartBody(
  target: QuickStartTargetId,
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): string {
  const blocks = resolveQuickStartGroups(tokens, target, schema)
    .map((group) => {
      const lines = emitQuickStartGroup(group, tokens, schema);
      return [`  /* ${group.label} */`, ...lines.map((line) => `  ${line}`)].join('\n');
    });
  return blocks.join('\n');
}

export function emitQuickStart(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
  section: SchemaSection = schemaSectionForEmitter('quick-start', schema),
): string {
  return [
    section.heading,
    '',
    ...schema.quickStartTargets.flatMap((target) => [
      target.heading,
      '',
      `\`\`\`${target.fenceLanguage}`,
      target.wrapperOpen,
      quickStartBody(target.id, tokens, schema),
      target.wrapperClose,
      '```',
      '',
    ]),
  ].join('\n');
}

/** Render one deterministic schema section using its schema-owned identity. */
export function formatSchemaSectionV3(
  section: SchemaSection,
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
): string {
  switch (section.emitter) {
    case 'colors': return formatColorsV3(tokens, schema, section);
    case 'spacing-shapes': return formatSpacingShapesV3(tokens, schema, section);
    case 'surfaces': return formatSurfacesV3(tokens, schema, section);
    case 'motion': return formatMotionV3(tokens, schema, section);
    case 'quick-start': return emitQuickStart(tokens, schema, section);
    case undefined: throw new Error(`Schema section ${section.id} has no deterministic emitter.`);
  }
}

/** Render every active deterministic section in schema order. */
export function formatSchemaValueSectionsV3(
  tokens: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
): string {
  return resolveSchemaSections(tokens, schema)
    .filter((section): section is SchemaSection & { emitter: NonNullable<SchemaSection['emitter']> } => (
      section.emitter !== undefined
    ))
    .map((section) => formatSchemaSectionV3(section, tokens, schema))
    .join('\n\n');
}

export function getFormatterSchemaContract(
  schema: StyleReferenceSchema = V3_SCHEMA,
): SchemaConsumerContract {
  return createSchemaConsumerContract('formatter', schema);
}
