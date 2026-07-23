// ────────────────────────────────────────────────────────────────
// MODULE: DESIGN.md Validator
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import { CORPUS_BASELINE_V3 } from './corpus-baseline-v3';
import { formatMotionV3 } from './formatters-v3';
import {
  assertSchemaIntegrity,
  createSchemaConsumerContract,
  isSchemaDocument,
  resolveCapabilities,
  resolveQuickStartGroups,
  resolveSchemaSections,
  resolveValidationPolicy,
  schemaSection,
  V3_SCHEMA,
} from './schema-v3';

import type { CorpusBaselineV3 } from './corpus-baseline-v3';
import type {
  AdvisoryStratum,
  AdvisoryTier,
  HardFailureCategory,
  SchemaConsumerContract,
  StyleReferenceSchema,
} from './schema-v3';
import type { DesignTokens } from './types';

// ─── Result Types ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ────────────────────────────────────────────────────────────────

interface RawValidationIssue {
  type: string;
  value: string;
  message: string;
}

export interface ValidationIssue extends RawValidationIssue {
  severity: 'hard' | 'advisory';
  category: HardFailureCategory | AdvisoryStratum;
  tier?: AdvisoryTier;
}

export interface ValidationResult {
  passed: string[];
  warnings: ValidationIssue[];
  failures: ValidationIssue[];
  score: number;
  // Split scores so a doc cannot hide invented prose behind hex fidelity. valuesScore =
  // hex/section/format/stability fidelity; claimsScore = prose provenance (interpretive
  // fabrication + filled-but-empty sections).
  valuesScore: number;
  claimsScore: number;
  schemaVersion: string;
  hardCategories: readonly HardFailureCategory[];
  advisoryStrata: readonly AdvisoryStratum[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 3. HELPERS
// ────────────────────────────────────────────────────────────────

function normalizeHex(raw: string): string {
  const h = raw.replace('#', '').toLowerCase();
  if (h.length === 3) {
    return h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length === 4) {
    return h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length === 8) {
    return h.slice(0, 6);
  }
  return h;
}

function stripHtmlComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '');
}

// ─── Checks ──────────────────────────────────────────────────────────────────

function checkPhantomColors(md: string, tokens: DesignTokens): { passed: boolean; failures: RawValidationIssue[] } {
  const cleaned = stripHtmlComments(md);
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
  const matches = cleaned.match(hexPattern) ?? [];
  const tokenHexSet = new Set(tokens.colorTokens.map((c) => normalizeHex(c.hex)));
  // Also accept colors from CSS variables (may not be in colorTokens but are ground truth)
  const cssVars = (tokens as unknown as Record<string, unknown>).cssVariables as { name: string; value: string }[] | undefined;
  if (cssVars) {
    for (const v of cssVars) {
      const hexMatch = v.value?.match(/#[0-9a-fA-F]{3,8}\b/);
      if (hexMatch) tokenHexSet.add(normalizeHex(hexMatch[0]));
    }
  }
  // Also accept colors from dark mode variable diffs
  const darkMode = (tokens as unknown as Record<string, unknown>).darkMode as { variableDiff?: { lightValue: string; darkValue: string }[] } | undefined;
  if (darkMode?.variableDiff) {
    for (const v of darkMode.variableDiff) {
      for (const val of [v.lightValue, v.darkValue]) {
        const hexMatch = val?.match(/#[0-9a-fA-F]{6}\b/);
        if (hexMatch) tokenHexSet.add(normalizeHex(hexMatch[0]));
      }
    }
  }
  const failures: RawValidationIssue[] = [];
  const seen = new Set<string>();

  for (const raw of matches) {
    const normalized = normalizeHex(raw);
    if (normalized.length !== 6) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    if (!tokenHexSet.has(normalized)) {
      failures.push({ type: 'phantom-color', value: raw, message: `Color ${raw} (${normalized}) not found in tokens.colorTokens` });
    }
  }
  return { passed: failures.length === 0, failures };
}

// Cardinal-rule gating: L1/L2 belong in main sections, L3 only in a "Subject to
// change" block, and L4 (content-layer, one-off/image-derived) colors are excluded
// entirely. A content-layer hex appearing anywhere in DESIGN.md is a gating
// violation that hex-tracing alone (checkPhantomColors) cannot catch — the color is
// real, it just must not be presented as a design token.
function checkStabilityGating(md: string, tokens: DesignTokens): { passed: boolean; failures: RawValidationIssue[] } {
  const cleaned = stripHtmlComments(md);
  const matches = cleaned.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  const layerByHex = new Map<string, string>();
  for (const c of tokens.colorTokens) {
    const layer = (c as unknown as { stability?: { layer?: string } }).stability?.layer;
    if (layer) layerByHex.set(normalizeHex(c.hex), layer);
  }
  const failures: RawValidationIssue[] = [];
  const seen = new Set<string>();
  for (const raw of matches) {
    const normalized = normalizeHex(raw);
    if (normalized.length !== 6 || seen.has(normalized)) continue;
    seen.add(normalized);
    if (layerByHex.get(normalized) === 'content') {
      failures.push({
        type: 'content-color',
        value: raw,
        message: `Color ${raw} is a content (L4) token and must be excluded from DESIGN.md (cardinal rule: L4 colors are not design tokens)`,
      });
    }
  }
  return { passed: failures.length === 0, failures };
}

function checkUnknownFonts(md: string, tokens: DesignTokens): { passed: boolean; warnings: RawValidationIssue[] } {
  const backtickPattern = /`([^`]+)`/g;
  const knownFonts = new Set<string>();
  for (const face of tokens.fontInfo.fontFaces) {
    knownFonts.add(face.family.toLowerCase().replace(/['"]/g, ''));
  }
  for (const loaded of tokens.fontInfo.loadedFonts) {
    knownFonts.add(loaded.family.toLowerCase().replace(/['"]/g, ''));
  }

  const warnings: RawValidationIssue[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = backtickPattern.exec(md)) !== null) {
    const val = match[1].trim();
    if (seen.has(val.toLowerCase())) continue;
    seen.add(val.toLowerCase());
    // Heuristic: looks like a font name if it has an uppercase letter,
    // is not a hex code, and doesn't look like a CSS property
    if (!/[A-Z]/.test(val)) continue;
    if (/^#[0-9a-fA-F]{3,8}$/.test(val)) continue;
    if (/[{}<>=()]/.test(val)) continue; // code/JSX (e.g. strokeWidth={1}) is not a font
    if (/[.!?]$/.test(val)) continue; // sentence-ending punctuation -> content phrase, not a font
    if (/^[a-z-]+:/.test(val)) continue;
    if (/^\d/.test(val)) continue;
    if (val.length > 40) continue;
    // Skip anything containing pipe (markdown table content)
    if (val.includes('|')) continue;
    // Skip anything containing newlines (multi-line backtick blocks)
    if (val.includes('\n')) continue;
    // Skip anything starting with -- or containing --- (markdown separators)
    if (val.startsWith('--') || val.includes('---')) continue;
    // Skip anything that looks like a sentence (contains spaces and lowercase)
    if (val.split(' ').length > 4) continue;
    // Skip common non-font tokens
    if (/^(none|inherit|initial|auto|normal|bold|semibold|medium|regular|light)$/i.test(val)) continue;
    // Skip camelCase CSS property names (e.g. borderColor, backgroundColor, fontWeight)
    if (/^[a-z][a-zA-Z]+$/.test(val) && val.length < 30) continue;
    // Skip ALL-CAPS words (likely button labels, not fonts: "GET STARTED", "BUILD")
    if (/^[A-Z\s]+$/.test(val) && val.length < 30) continue;
    // Skip quoted strings (e.g. "GET STARTED" in backticks from voice examples)
    if (/^".*"$/.test(val)) continue;
    // Skip CSS class names, animation names, and module identifiers (contain _ or __)
    if (/[_]/.test(val)) continue;
    // Skip comma-separated font stacks (e.g. "Nitti, Menlo, Courier, monospace")
    if (val.includes(',')) continue;
    // Skip common system fonts not always in extraction
    if (/^(Georgia|Times New Roman|Arial|Helvetica|Verdana|Courier|Inter|Fira Code|JetBrains Mono|DM Sans|Noto Sans|Roboto|system-ui)$/i.test(val)) continue;

    const normalized = val.toLowerCase().replace(/['"]/g, '');
    if (!knownFonts.has(normalized)) {
      warnings.push({ type: 'unknown-font', value: val, message: `Font "${val}" not found in tokens.fontInfo` });
    }
  }
  return { passed: warnings.length === 0, warnings };
}

function checkFormatConsistency(md: string): { passed: boolean; failures: RawValidationIssue[] } {
  const failures: RawValidationIssue[] = [];

  // Hex format: should be 6-digit lowercase
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
  const cleaned = stripHtmlComments(md);
  let match: RegExpExecArray | null;
  const seenHex = new Set<string>();

  while ((match = hexPattern.exec(cleaned)) !== null) {
    const raw = match[0];
    if (seenHex.has(raw)) continue;
    seenHex.add(raw);
    const body = raw.slice(1);
    if (body.length !== 6) {
      failures.push({ type: 'hex-format', value: raw, message: `Hex "${raw}" should be 6-digit format` });
    } else if (body !== body.toLowerCase()) {
      failures.push({ type: 'hex-format', value: raw, message: `Hex "${raw}" should be lowercase` });
    }
  }

  // Font-weight in backticks should be numeric
  const weightWords = /`(bold|semibold|light|thin|black|extra-?bold|ultra-?bold|demi-?bold|extra-?light|ultra-?light|medium)`/gi;
  while ((match = weightWords.exec(md)) !== null) {
    failures.push({ type: 'weight-format', value: match[1], message: `Font weight "${match[1]}" should be numeric (e.g. 700)` });
  }

  // Table column consistency
  const lines = md.split('\n');
  let tableHeaderCols: number | null = null;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cols = line.split('|').length - 2; // strip leading/trailing empty
      if (!inTable) {
        tableHeaderCols = cols;
        inTable = true;
      } else if (/^[\s|:-]+$/.test(line)) {
        // separator row, skip
      } else if (tableHeaderCols !== null && cols !== tableHeaderCols) {
        failures.push({ type: 'table-format', value: `line ${i + 1}`, message: `Table row has ${cols} columns but header has ${tableHeaderCols}` });
      }
    } else {
      inTable = false;
      tableHeaderCols = null;
    }
  }

  // Consecutive blank lines
  const blankRun = /\n{4,}/g;
  while ((match = blankRun.exec(md)) !== null) {
    const lineNum = md.slice(0, match.index).split('\n').length;
    failures.push({ type: 'blank-lines', value: `line ${lineNum}`, message: 'More than 1 consecutive blank line' });
  }

  return { passed: failures.length === 0, failures };
}

export function checkSectionCompleteness(
  md: string,
  tokens?: DesignTokens,
  schema: StyleReferenceSchema = V3_SCHEMA,
): { passed: boolean; failures: RawValidationIssue[] } {
  // Required v2 core sections. Section 2.5 (Dark Mode) is conditional on a
  // detected dark palette, and 14-17 are optional, so they are not required here.
  const v2Sections = [
    '## 0. Brand Context',
    '## 1. Visual Theme & Atmosphere',
    '## 2. Color Palette & Roles',
    '## 3. Typography Rules',
    '## 4. Component Stylings',
    '## 5. Layout Principles',
    '## 6. Depth & Elevation',
    '## 6.5. Motion System',
    '## 7. Content & Voice',
    "## 8. Do's and Don'ts",
    '## 9. Accessibility Contract',
    '## 10. Responsive Behavior',
    '## 11. State Matrix',
    '## 12. Iconography',
    '## 13. Agent Prompt Guide',
  ];
  const v1Sections = [
    '## 1. Visual Theme & Atmosphere',
    '## 2. Color Palette & Roles',
    '## 3. Typography Rules',
    '## 4. Component Stylings',
    '## 5. Layout Principles',
    '## 6. Depth & Elevation',
    "## 7. Do's and Don'ts",
    '## 8. Responsive Behavior',
    '## 9. Agent Prompt Guide',
  ];
  const isV3 = isSchemaDocument(md, schema);
  const isV2 = md.toLowerCase().includes('## 0. brand context');
  const requiredSections = isV3 && tokens
    ? resolveSchemaSections(tokens, schema).map((section) => section.heading)
    : isV2
      ? v2Sections
      : v1Sections;

  const mdLower = md.toLowerCase();
  const failures: RawValidationIssue[] = [];

  for (const section of requiredSections) {
    // Anchor the heading to line-start (and require a word boundary after it) so a deeper
    // heading like "### Layout" cannot satisfy a "## Layout" requirement via substring match.
    const escaped = section.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingRe = new RegExp(`(?:^|\\n)${escaped}[ \\t]*(?=\\r?\\n|$)`);
    if (!headingRe.test(mdLower)) {
      failures.push({ type: 'missing-section', value: section, message: `Required section "${section}" not found` });
    }
  }
  return { passed: failures.length === 0, failures };
}

function checkContent(md: string): { passed: boolean; warnings: RawValidationIssue[] } {
  const warnings: RawValidationIssue[] = [];

  // Typography table check
  const typoSection = md.match(/##\s*3\.\s*Typography Rules[\s\S]*?(?=##\s*4\.|$)/i);
  if (typoSection) {
    const hasTable = /\|.*Role.*\|.*Font.*\|.*Size.*\|/i.test(typoSection[0]) ||
                     /\|.*Font.*\|.*Size.*\|/i.test(typoSection[0]);
    if (!hasTable) {
      warnings.push({ type: 'missing-type-table', value: 'Typography Rules', message: 'Typography section should have a table with Role/Font/Size columns' });
    }
  }

  // Color count check
  const colorSection = md.match(/##\s*2\.\s*Color Palette[\s\S]*?(?=##\s*3\.|$)/i);
  if (colorSection) {
    const hexLines = colorSection[0].split('\n').filter((l) => /#[0-9a-fA-F]{3,8}\b/.test(l));
    if (hexLines.length < 8) {
      warnings.push({ type: 'insufficient-colors', value: `${hexLines.length} colors`, message: `Color Palette should have at least 8 color entries (found ${hexLines.length})` });
    }
  }

  return { passed: warnings.length === 0, warnings };
}

// ─── Main Validation ─────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ────────────────────────────────────────────────────────────────

// These phrases are inherently ungrounded: target tokens carry no evidence about other
// systems, and the depth/focus claims are known fabrication paths.
const PROSE_FABRICATION_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(unlike most|most systems|where others|the typical approach|the conventional|departs? from convention|refuses? to)\b/i, label: 'comparison to other/most systems / convention (no token data about other systems)' },
  { re: /gradient[\s-]?as[\s-]?depth|replaces?\s+(the\s+)?shadow\s+elevation/i, label: 'gradient-as-depth / replaces-shadow-elevation claim' },
];

function checkProseDiscipline(md: string, tokens: DesignTokens): { passed: boolean; warnings: RawValidationIssue[] } {
  const cleaned = stripHtmlComments(md);
  const warnings: RawValidationIssue[] = [];
  for (const { re, label } of PROSE_FABRICATION_PATTERNS) {
    const m = cleaned.match(re);
    if (m) warnings.push({ type: 'prose-fabrication', value: m[0], message: `Interpretive fabrication risk: ${label}` });
  }
  // The second known hallucination: a "focus ... consistent" claim must be backed by
  // captured focus styles.
  const focus = (tokens as unknown as { a11yTokens?: { focusIndicator?: { captured?: boolean; consistent?: boolean } } }).a11yTokens?.focusIndicator;
  if (focus && (focus.captured === false || focus.consistent === false)) {
    if (/focus[^.\n]{0,40}\bconsistent(ly)?\b/i.test(cleaned) && !/\binconsistent\b|not consistent/i.test(cleaned)) {
      warnings.push({ type: 'prose-fabrication', value: 'focus consistent', message: 'Asserts focus is consistent but tokens show captured=false or consistent=false' });
    }
  }
  return { passed: warnings.length === 0, warnings };
}

// Flags a high-risk section that is present in the doc while its backing tokens are empty
// and it was not stamped ABSENT — the mechanical signature of an invented section.
function checkSectionCoverage(md: string, tokens: DesignTokens): { passed: boolean; warnings: RawValidationIssue[] } {
  const t = tokens as unknown as Record<string, unknown>;
  const isEmpty = (x: unknown) => !x || (Array.isArray(x) ? x.length === 0 : (typeof x === 'object' ? Object.keys(x as object).length === 0 : !x));
  const motion = (t.motionSystem as { durationScale?: unknown[] } | undefined)?.durationScale;
  const icons = (t.iconSystem as { totalCount?: number } | undefined)?.totalCount;
  const absent = /\bABSENT\b|No (shadow|motion|icon|gradient)[^.\n]*(was|were) extracted|zero shadow tokens/i.test(md);
  const checks: { section: RegExp; empty: boolean; field: string }[] = [
    { section: /^##\s*6\.?\s+Depth/im, empty: isEmpty(t.shadowTokens) && isEmpty(t.gradients), field: 'shadowTokens + gradients' },
    { section: /^##\s*6\.5\.?\s+Motion/im, empty: isEmpty(motion), field: 'motionSystem' },
    { section: /^##\s*12\.?\s+Icon/im, empty: !icons, field: 'iconSystem' },
  ];
  const warnings: RawValidationIssue[] = [];
  for (const c of checks) {
    if (c.empty && c.section.test(md) && !absent) {
      warnings.push({ type: 'section-coverage', value: c.field, message: `Section present but backing ${c.field} is empty — stamp ABSENT instead of inventing content` });
    }
  }
  return { passed: warnings.length === 0, warnings };
}

function markdownBlock(markdown: string, heading: string, headingLevel: number): string | undefined {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = new RegExp(`(?:^|\\n)${escaped}[ \\t]*(?:\\r?\\n|$)`, 'i').exec(markdown);
  if (!start) return undefined;
  const contentStart = start.index + start[0].length;
  const nextHeading = new RegExp(`^#{1,${headingLevel}}\\s+`, 'm').exec(markdown.slice(contentStart));
  return nextHeading
    ? markdown.slice(contentStart, contentStart + nextHeading.index)
    : markdown.slice(contentStart);
}

function commentLabels(markdown: string): readonly string[] {
  return [...markdown.matchAll(/\/\*\s*([^*]+?)\s*\*\//g)].map((match) => match[1].trim());
}

function checkMotionFidelity(
  md: string,
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): { passed: boolean; failures: RawValidationIssue[] } {
  const section = schema.sections.find((candidate) => candidate.id === 'motion');
  if (!section) return { passed: true, failures: [] };

  const actual = markdownBlock(md, section.heading, 2);
  const hasMotionEvidence = resolveCapabilities(tokens, schema).has(section.capability ?? 'motion');
  if (!hasMotionEvidence) {
    return actual === undefined
      ? { passed: true, failures: [] }
      : {
        passed: false,
        failures: [{
          type: 'unexpected-motion-section',
          value: section.heading,
          message: 'Motion section is present without a measured durationScale from the motion detector',
        }],
      };
  }
  if (actual === undefined) return { passed: true, failures: [] };

  const expectedDocument = formatMotionV3(tokens, schema, section);
  const expected = markdownBlock(expectedDocument, section.heading, 2) ?? '';
  const normalize = (value: string) => value.replace(/\r\n/g, '\n').trim();
  if (normalize(actual) === normalize(expected)) return { passed: true, failures: [] };
  return {
    passed: false,
    failures: [{
      type: 'motion-value-fidelity',
      value: section.heading,
      message: 'Motion section must match the deterministic projection of measured motionSystem evidence',
    }],
  };
}

// The ship-ready surface must contain exactly the schema groups enabled by measured
// capabilities. Value checks remain separate so structural and target fidelity failures
// stay legible.
function checkQuickStartFidelity(
  md: string,
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): { passed: boolean; failures: RawValidationIssue[] } {
  const failures: RawValidationIssue[] = [];
  const quickStartSection = schemaSection(schema.document.quickStartSectionId, schema);
  const qs = markdownBlock(md, quickStartSection.heading, 2);
  if (qs === undefined) return { passed: true, failures };

  for (const target of schema.quickStartTargets) {
    const targetBlock = markdownBlock(qs, target.heading, 3) ?? '';
    const labels = commentLabels(targetBlock);
    const expected = resolveQuickStartGroups(tokens, target.id, schema);
    const expectedLabels = new Set(expected.map((group) => group.label));
    for (const group of expected) {
      const count = labels.filter((label) => label === group.label).length;
      if (count === 0) {
        failures.push({
          type: 'quickstart-missing-group',
          value: `${target.id}:${group.id}`,
          message: `${target.heading} is missing required group "${group.label}"`,
        });
      } else if (count > 1) {
        failures.push({
          type: 'quickstart-duplicate-group',
          value: `${target.id}:${group.id}`,
          message: `${target.heading} contains group "${group.label}" ${count} times`,
        });
      }
    }
    for (const label of new Set(labels)) {
      if (!expectedLabels.has(label)) {
        failures.push({
          type: 'quickstart-unexpected-group',
          value: `${target.id}:${label}`,
          message: `${target.heading} contains non-applicable group "${label}"`,
        });
      }
    }
  }

  const hexes = new Set(tokens.colorTokens.map((c) => c.hex.toLowerCase().slice(0, 7)));
  for (const raw of qs.match(/#[0-9a-fA-F]{6}\b/g) ?? []) {
    if (!hexes.has(raw.toLowerCase())) failures.push({ type: 'quickstart-phantom-color', value: raw, message: `Quick Start hex ${raw} not found in tokens.colorTokens` });
  }
  const mw = (tokens as unknown as { spacingSystem?: { maxContentWidth?: string | null } }).spacingSystem?.maxContentWidth;
  const qsMw = qs.match(/--page-max-width:\s*([^;]+);/);
  if (mw && qsMw && qsMw[1].trim() !== mw.trim()) {
    failures.push({ type: 'quickstart-maxwidth', value: qsMw[1].trim(), message: `Quick Start --page-max-width "${qsMw[1].trim()}" does not match tokens maxContentWidth "${mw}"` });
  }
  return { passed: failures.length === 0, failures };
}

function checkProvenance(
  md: string,
  tokens: DesignTokens,
  schema: StyleReferenceSchema,
): RawValidationIssue[] {
  if (!isSchemaDocument(md, schema)) return [];
  const raw = tokens as unknown as {
    meta?: { sourceUrls?: string[] };
    metadata?: { urls?: string[] };
  };
  const sourceUrls = raw.meta?.sourceUrls ?? raw.metadata?.urls ?? [];
  return sourceUrls.length > 0
    ? []
    : [{
      type: 'provenance-missing',
      value: 'tokens sourceUrls',
      message: 'v3 validation requires at least one target source URL in the extraction metadata',
    }];
}

function checkCorpusAdvisories(
  md: string,
  tokens: DesignTokens,
  baseline: CorpusBaselineV3,
  schema: StyleReferenceSchema,
): RawValidationIssue[] {
  if (!isSchemaDocument(md, schema) || baseline.bundleCount === 0) return [];
  const warnings: RawValidationIssue[] = [];
  const headings = [...md.matchAll(/^##\s+(.+)$/gm)].map((match) => `## ${match[1].trim()}`);
  if (headings.length < baseline.sectionCount.p10 || headings.length > baseline.sectionCount.p90) {
    warnings.push({
      type: 'corpus-shape',
      value: `${headings.length} sections`,
      message: `Section count is outside the corpus diagnostic band ${baseline.sectionCount.p10}-${baseline.sectionCount.p90}`,
    });
  }
  const knownHeadings = new Set(schema.sections.map((section) => section.heading.toLowerCase()));
  const unknownHeadings = headings.filter((heading) => !knownHeadings.has(heading.toLowerCase()));
  if (unknownHeadings.length > 0) {
    warnings.push({
      type: 'corpus-vocabulary',
      value: unknownHeadings.join(', '),
      message: 'Extension headings are preserved but sit outside the stable v3 vocabulary',
    });
  }
  const capabilities = resolveCapabilities(tokens, schema);
  for (const capability of capabilities) {
    const count = baseline.capabilityCounts[capability];
    if (count !== undefined && count < Math.ceil(baseline.bundleCount * 0.1)) {
      warnings.push({
        type: 'corpus-rarity',
        value: capability,
        message: `Capability is present in ${count}/${baseline.bundleCount} corpus bundles; preserve it as valid target evidence`,
      });
    }
  }
  return warnings;
}

function classifyValidationIssues(
  issues: readonly RawValidationIssue[],
  schema: StyleReferenceSchema,
): { failures: ValidationIssue[]; warnings: ValidationIssue[] } {
  const failures: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  for (const issue of issues) {
    const policy = resolveValidationPolicy(issue.type, schema);
    const classified: ValidationIssue = { ...issue, ...policy };
    if (classified.severity === 'hard') failures.push(classified);
    else warnings.push(classified);
  }
  return { failures, warnings };
}

export interface ValidationOptions {
  readonly schema?: StyleReferenceSchema;
  readonly corpusBaseline?: CorpusBaselineV3;
}

export function validateDesignMd(
  mdContent: string,
  tokens: DesignTokens,
  options: ValidationOptions = {},
): ValidationResult {
  const schema = options.schema ?? V3_SCHEMA;
  assertSchemaIntegrity(schema);
  const corpusBaseline = options.corpusBaseline ?? CORPUS_BASELINE_V3;
  const passed: string[] = [];
  const rawIssues: RawValidationIssue[] = [];

  const phantom = checkPhantomColors(mdContent, tokens);
  if (phantom.passed) passed.push('phantom-color');
  else rawIssues.push(...phantom.failures);

  const gating = checkStabilityGating(mdContent, tokens);
  if (gating.passed) passed.push('stability-gating');
  else rawIssues.push(...gating.failures);

  const fonts = checkUnknownFonts(mdContent, tokens);
  if (fonts.passed) passed.push('unknown-font');
  else rawIssues.push(...fonts.warnings);

  const format = checkFormatConsistency(mdContent);
  if (format.passed) passed.push('format-consistency');
  else rawIssues.push(...format.failures);

  const sections = checkSectionCompleteness(mdContent, tokens, schema);
  if (sections.passed) passed.push('section-completeness');
  else rawIssues.push(...sections.failures);

  const content = checkContent(mdContent);
  if (content.passed) passed.push('content-checks');
  else rawIssues.push(...content.warnings);

  const prose = checkProseDiscipline(mdContent, tokens);
  if (prose.passed) passed.push('prose-discipline');
  else rawIssues.push(...prose.warnings);

  const coverage = checkSectionCoverage(mdContent, tokens);
  if (coverage.passed) passed.push('section-coverage');
  else rawIssues.push(...coverage.warnings);

  const qsFidelity = checkQuickStartFidelity(mdContent, tokens, schema);
  if (qsFidelity.passed) passed.push('quickstart-fidelity');
  rawIssues.push(...qsFidelity.failures);

  const motionFidelity = checkMotionFidelity(mdContent, tokens, schema);
  if (motionFidelity.passed) passed.push('motion-fidelity');
  rawIssues.push(...motionFidelity.failures);
  rawIssues.push(...checkProvenance(mdContent, tokens, schema));
  rawIssues.push(...checkCorpusAdvisories(mdContent, tokens, corpusBaseline, schema));

  const { failures, warnings } = classifyValidationIssues(rawIssues, schema);
  const claimsFailures = failures.filter((failure) => failure.category === 'provenance');
  const valueFailures = failures.filter((failure) => failure.category !== 'provenance');
  const valuesScore = Math.max(0, 100 - valueFailures.length * 5);
  const claimsScore = Math.max(0, 100 - claimsFailures.length * 10);
  const score = Math.max(0, 100 - failures.length * 5);

  return {
    passed,
    warnings,
    failures,
    score,
    valuesScore,
    claimsScore,
    schemaVersion: schema.version,
    hardCategories: schema.validation.hardCategories,
    advisoryStrata: schema.validation.advisoryStrata,
  };
}

export function getValidatorSchemaContract(
  schema: StyleReferenceSchema = V3_SCHEMA,
): SchemaConsumerContract {
  return createSchemaConsumerContract('validator', schema);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 5. CONSTANTS
// ────────────────────────────────────────────────────────────────

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// ────────────────────────────────────────────────────────────────
// 6. HELPERS
// ────────────────────────────────────────────────────────────────

export function isValidationPass(result: ValidationResult): boolean {
  return result.failures.length === 0;
}

function printResult(result: ValidationResult): void {
  console.log(`\n${BOLD}=== DESIGN.md Validation ===${RESET}\n`);

  if (result.passed.length > 0) {
    console.log(`${GREEN}Passed checks:${RESET}`);
    for (const p of result.passed) {
      console.log(`  ${GREEN}[PASS]${RESET} ${p}`);
    }
  }

  if (result.failures.length > 0) {
    console.log(`\n${RED}Hard failures (${result.failures.length}):${RESET}`);
    for (const f of result.failures) {
      console.log(`  ${RED}[FAIL:${f.category}]${RESET} ${f.type}: ${f.value} — ${f.message}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\n${YELLOW}Advisory corpus warnings (${result.warnings.length}):${RESET}`);
    for (const stratum of result.advisoryStrata) {
      for (const warning of result.warnings.filter((item) => item.category === stratum)) {
        console.log(`  ${YELLOW}[${stratum}:${warning.tier ?? 'notice'}]${RESET} ${warning.type}: ${warning.value} — ${warning.message}`);
      }
    }
  }

  console.log(`\n${BOLD}Score: ${result.score}/100${RESET}  (values ${result.valuesScore}/100, claims ${result.claimsScore}/100)`);
  if (result.claimsScore < 80) {
    console.log(`${YELLOW}  Claims score is low — prose may assert relationships/consistency not backed by tokens.${RESET}`);
  }
  if (isValidationPass(result)) {
    console.log(`${GREEN}Result: PASS${RESET}\n`);
  } else {
    console.log(`${RED}Result: FAIL (${result.hardCategories.join(', ')} failures are hard)${RESET}\n`);
  }
}

// ────────────────────────────────────────────────────────────────
// 7. CORE LOGIC
// ────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(`Usage: npx ts-node scripts/validate.ts <design-md-path> <tokens-json-path>`);
    process.exit(1);
  }

  const [mdPath, tokensPath] = args;

  let mdContent: string;
  let tokens: DesignTokens;
  try {
    mdContent = fs.readFileSync(mdPath, 'utf-8');
    tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  } catch (err) {
    console.error(`Could not read inputs: ${(err as Error).message}`);
    process.exit(1);
  }

  const result = validateDesignMd(mdContent, tokens);
  printResult(result);
  process.exit(isValidationPass(result) ? 0 : 1);
}
