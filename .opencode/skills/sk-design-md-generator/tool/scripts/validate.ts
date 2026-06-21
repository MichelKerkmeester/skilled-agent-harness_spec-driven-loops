import * as fs from 'fs';
import type { DesignTokens } from './types';

// ─── Result Types ────────────────────────────────────────────────────────────

interface ValidationIssue {
  type: string;
  value: string;
  message: string;
}

export interface ValidationResult {
  passed: string[];
  warnings: ValidationIssue[];
  failures: ValidationIssue[];
  score: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function checkPhantomColors(md: string, tokens: DesignTokens): { passed: boolean; failures: ValidationIssue[] } {
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
  const failures: ValidationIssue[] = [];
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

function checkUnknownFonts(md: string, tokens: DesignTokens): { passed: boolean; warnings: ValidationIssue[] } {
  const backtickPattern = /`([^`]+)`/g;
  const knownFonts = new Set<string>();
  for (const face of tokens.fontInfo.fontFaces) {
    knownFonts.add(face.family.toLowerCase().replace(/['"]/g, ''));
  }
  for (const loaded of tokens.fontInfo.loadedFonts) {
    knownFonts.add(loaded.family.toLowerCase().replace(/['"]/g, ''));
  }

  const warnings: ValidationIssue[] = [];
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

function checkFormatConsistency(md: string): { passed: boolean; failures: ValidationIssue[] } {
  const failures: ValidationIssue[] = [];

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

function checkSectionCompleteness(md: string): { passed: boolean; failures: ValidationIssue[] } {
  // Support both v1 (9 sections) and v2 (17 sections) formats
  const v2Sections = [
    '## 0. Brand Context',
    '## 1. Visual Theme & Atmosphere',
    '## 2. Color Palette & Roles',
    '## 3. Typography Rules',
    '## 4. Component Stylings',
    '## 5. Layout Principles',
    '## 6. Depth & Elevation',
    '## 7. Content & Voice',
    "## 8. Do's and Don'ts",
    '## 9. Accessibility Contract',
    '## 10. Responsive Behavior',
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
  // Detect format version: if Section 0 exists, use v2 checks
  const isV2 = md.toLowerCase().includes('## 0. brand context');
  const requiredSections = isV2 ? v2Sections : v1Sections;

  const mdLower = md.toLowerCase();
  const failures: ValidationIssue[] = [];

  for (const section of requiredSections) {
    if (!mdLower.includes(section.toLowerCase())) {
      failures.push({ type: 'missing-section', value: section, message: `Required section "${section}" not found` });
    }
  }
  return { passed: failures.length === 0, failures };
}

function checkContent(md: string): { passed: boolean; warnings: ValidationIssue[] } {
  const warnings: ValidationIssue[] = [];

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

export function validateDesignMd(mdContent: string, tokens: DesignTokens): ValidationResult {
  const passed: string[] = [];
  const warnings: ValidationIssue[] = [];
  const failures: ValidationIssue[] = [];

  const phantom = checkPhantomColors(mdContent, tokens);
  if (phantom.passed) passed.push('phantom-color');
  else failures.push(...phantom.failures);

  const fonts = checkUnknownFonts(mdContent, tokens);
  if (fonts.passed) passed.push('unknown-font');
  else warnings.push(...fonts.warnings);

  const format = checkFormatConsistency(mdContent);
  if (format.passed) passed.push('format-consistency');
  else failures.push(...format.failures);

  const sections = checkSectionCompleteness(mdContent);
  if (sections.passed) passed.push('section-completeness');
  else failures.push(...sections.failures);

  const content = checkContent(mdContent);
  if (content.passed) passed.push('content-checks');
  else warnings.push(...content.warnings);

  const score = Math.max(0, 100 - failures.length * 5 - warnings.length * 1);

  return { passed, warnings, failures, score };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function printResult(result: ValidationResult): void {
  console.log(`\n${BOLD}=== DESIGN.md Validation ===${RESET}\n`);

  if (result.passed.length > 0) {
    console.log(`${GREEN}Passed checks:${RESET}`);
    for (const p of result.passed) {
      console.log(`  ${GREEN}[PASS]${RESET} ${p}`);
    }
  }

  if (result.failures.length > 0) {
    console.log(`\n${RED}Failures (${result.failures.length}):${RESET}`);
    for (const f of result.failures) {
      console.log(`  ${RED}[FAIL]${RESET} ${f.type}: ${f.value} — ${f.message}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\n${YELLOW}Warnings (${result.warnings.length}):${RESET}`);
    for (const w of result.warnings) {
      console.log(`  ${YELLOW}[WARN]${RESET} ${w.type}: ${w.value} — ${w.message}`);
    }
  }

  console.log(`\n${BOLD}Score: ${result.score}/100${RESET}`);
  if (result.score >= 80) {
    console.log(`${GREEN}Result: PASS${RESET}\n`);
  } else {
    console.log(`${RED}Result: FAIL (minimum 80 required)${RESET}\n`);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(`Usage: npx ts-node scripts/validate.ts <design-md-path> <tokens-json-path>`);
    process.exit(1);
  }

  const [mdPath, tokensPath] = args;

  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const tokens: DesignTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  const result = validateDesignMd(mdContent, tokens);
  printResult(result);
  process.exit(result.score >= 80 ? 0 : 1);
}
