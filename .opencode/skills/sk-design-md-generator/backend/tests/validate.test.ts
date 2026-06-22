import { describe, it, expect } from 'vitest';
import { validateDesignMd, type ValidationResult } from '../scripts/validate';
import type { DesignTokens } from '../scripts/types';

// ─── Minimal tokens fixture ─────────────────────────────────────────────────

function makeTokens(overrides: Partial<DesignTokens> = {}): DesignTokens {
  return {
    colorTokens: [
      { hex: '#6b5ce7', rgba: [107, 92, 231, 1], frequency: 50, usedAs: { textColor: 0, bgColor: 30, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      { hex: '#ffffff', rgba: [255, 255, 255, 1], frequency: 200, usedAs: { textColor: 0, bgColor: 100, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      { hex: '#000000', rgba: [0, 0, 0, 1], frequency: 100, usedAs: { textColor: 80, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      { hex: '#f5f5f5', rgba: [245, 245, 245, 1], frequency: 40, usedAs: { textColor: 0, bgColor: 20, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      { hex: '#e5e5e5', rgba: [229, 229, 229, 1], frequency: 30, usedAs: { textColor: 0, bgColor: 0, borderColor: 20, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.8, sourcePages: [], confidence: 'medium' },
      { hex: '#333333', rgba: [51, 51, 51, 1], frequency: 60, usedAs: { textColor: 40, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      { hex: '#ff4444', rgba: [255, 68, 68, 1], frequency: 10, usedAs: { textColor: 5, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.5, sourcePages: [], confidence: 'medium' },
      { hex: '#44bb44', rgba: [68, 187, 68, 1], frequency: 8, usedAs: { textColor: 3, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.3, sourcePages: [], confidence: 'low' },
    ],
    colorRelationships: { lightnessScales: [], complementaryPairs: [], contrastPairs: [] },
    typographyLevels: [],
    fontInfo: {
      fontFaces: [{ family: 'Inter', weight: '400', style: 'normal', src: '' }],
      loadedFonts: [{ family: 'Inter', weight: '400', style: 'normal' }],
    },
    shadowTokens: [],
    radiusTokens: [],
    spacingSystem: { baseUnit: null, commonValues: [], gcdCandidate: null },
    componentGroups: [],
    cssVariablesSummary: [],
    metadata: { totalPages: 1, totalElements: 100, extractedAt: '2026-01-01', urls: ['https://example.com'] },
    ...overrides,
  } as DesignTokens;
}

// ─── Well-formed markdown fixture ───────────────────────────────────────────

const VALID_MD = `# DESIGN.md — Example

## 1. Visual Theme & Atmosphere

A warm, approachable palette with purple as the defining accent.

## 2. Color Palette & Roles

| Role | Hex | Usage |
|------|-----|-------|
| Primary | \`#6b5ce7\` | Buttons, links |
| Background | \`#ffffff\` | Page bg |
| Text Primary | \`#000000\` | Body text |
| Surface | \`#f5f5f5\` | Cards |
| Border | \`#e5e5e5\` | Dividers |
| Text Secondary | \`#333333\` | Muted text |
| Destructive | \`#ff4444\` | Errors |
| Success | \`#44bb44\` | Success |

## 3. Typography Rules

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Display | \`Inter\` | 48px | 700 | 1.1 |
| Heading | \`Inter\` | 32px | 600 | 1.2 |
| Body | \`Inter\` | 16px | 400 | 1.5 |

## 4. Component Stylings

Buttons use \`#6b5ce7\` as background.

## 5. Layout Principles

8px base grid.

## 6. Depth & Elevation

Subtle shadows.

## 7. Do's and Don'ts

Do use consistent spacing.

## 8. Responsive Behavior

Mobile-first breakpoints at 768px and 1024px.

## 9. Agent Prompt Guide

Use \`#6b5ce7\` for primary actions.
`;

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('validateDesignMd', () => {
  it('passes a well-formed DESIGN.md', () => {
    const result = validateDesignMd(VALID_MD, makeTokens());
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.failures).toHaveLength(0);
  });

  it('detects phantom colors not in tokens', () => {
    const mdWithPhantom = VALID_MD.replace('#6b5ce7', '#deadbe');
    const result = validateDesignMd(mdWithPhantom, makeTokens());
    const phantoms = result.failures.filter((f) => f.type === 'phantom-color');
    expect(phantoms.length).toBeGreaterThan(0);
    expect(phantoms[0].value).toContain('deadbe');
  });

  it('detects content (L4) colors that must be excluded from the doc', () => {
    const tokens = makeTokens();
    // Mark the primary color (present in VALID_MD) as a content-layer (L4) token.
    (tokens.colorTokens[0] as unknown as { stability: { layer: string } }).stability = { layer: 'content' };
    const result = validateDesignMd(VALID_MD, tokens);
    const l4 = result.failures.filter((f) => f.type === 'content-color');
    expect(l4.length).toBeGreaterThan(0);
    expect(l4[0].value.toLowerCase()).toContain('6b5ce7');
  });

  it('detects uppercase hex as format issue', () => {
    const mdUpper = VALID_MD.replace('#6b5ce7', '#6B5CE7');
    const result = validateDesignMd(mdUpper, makeTokens());
    const hexIssues = result.failures.filter((f) => f.type === 'hex-format');
    expect(hexIssues.length).toBeGreaterThan(0);
  });

  it('detects word font-weights', () => {
    const mdBold = VALID_MD + '\n\nUse `bold` weight for emphasis.\n';
    const result = validateDesignMd(mdBold, makeTokens());
    const weightIssues = result.failures.filter((f) => f.type === 'weight-format');
    expect(weightIssues.length).toBeGreaterThan(0);
  });

  it('detects missing sections', () => {
    const mdMissing = VALID_MD.replace('## 7. Do\'s and Don\'ts', '## 7. Removed');
    const result = validateDesignMd(mdMissing, makeTokens());
    const missing = result.failures.filter((f) => f.type === 'missing-section');
    expect(missing.length).toBe(1);
    expect(missing[0].value).toContain("Do's and Don'ts");
  });

  it('warns when color count is low', () => {
    const fewColors = makeTokens({
      colorTokens: [
        { hex: '#000000', rgba: [0, 0, 0, 1], frequency: 10, usedAs: { textColor: 10, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high' },
      ],
    });
    const mdFewColors = VALID_MD.replace(/\| .+ \| `#[0-9a-f]{6}` .+\n/g, '');
    const result = validateDesignMd(mdFewColors, fewColors);
    const colorWarns = result.warnings.filter((w) => w.type === 'insufficient-colors');
    expect(colorWarns.length).toBe(1); // stripped colour rows fall below the 8-colour floor -> warns
  });

  it('scoring: failures cost 5 pts, warnings cost 1 pt', () => {
    const result: ValidationResult = {
      passed: [],
      failures: [{ type: 'test', value: 'x', message: 'fail1' }, { type: 'test', value: 'y', message: 'fail2' }],
      warnings: [{ type: 'test', value: 'z', message: 'warn1' }],
      score: Math.max(0, 100 - 2 * 5 - 1 * 1),
      valuesScore: Math.max(0, 100 - 2 * 5 - 1 * 1),
      claimsScore: 100,
    };
    expect(result.score).toBe(89);
  });

  it('flags interpretive fabrication prose and splits the claims score (WARNING-tier)', () => {
    const md = VALID_MD + '\n\nThis is a gradient-as-depth technique that replaces shadow elevation. Unlike most systems, this one is flat.\n';
    const result = validateDesignMd(md, makeTokens());
    const proseWarns = result.warnings.filter((w) => w.type === 'prose-fabrication');
    // assert WHICH patterns fired, not just a loose count
    expect(proseWarns.some((w) => /gradient-as-depth|replaces-shadow/i.test(w.message))).toBe(true);
    expect(proseWarns.some((w) => /most systems/i.test(w.message))).toBe(true);
    expect(result.claimsScore).toBeLessThan(result.valuesScore);
    expect(result.failures.length).toBe(0); // prose checks are WARNING-tier, never hard-fail
  });

  it('flags a focus-consistent claim when the tokens show it is not', () => {
    const tokens = makeTokens();
    (tokens as unknown as { a11yTokens: unknown }).a11yTokens = {
      focusIndicator: { style: {}, consistent: false, captured: false },
      contrastPairs: [], minTouchTarget: { width: 44, height: 44 }, minFontSize: '16px',
    };
    const md = VALID_MD + '\n\nThe focus indicators are consistent across all elements.\n';
    const result = validateDesignMd(md, tokens);
    expect(result.warnings.filter((w) => w.value === 'focus consistent').length).toBe(1);
  });

  it('score cannot go below 0', () => {
    // 21 failures = 105 points deducted → clamped to 0
    const manyFailures = Array.from({ length: 21 }, (_, i) => ({
      type: 'test',
      value: `v${i}`,
      message: `fail${i}`,
    }));
    const score = Math.max(0, 100 - manyFailures.length * 5);
    expect(score).toBe(0);
  });

  it('quickstart fidelity: flags a --page-max-width that disagrees with tokens (the 100rem class)', () => {
    const t = makeTokens();
    (t as unknown as { spacingSystem: unknown }).spacingSystem = { maxContentWidth: '100%', scale: [], baseUnit: 4, frequencyMap: {}, sectionSpacing: [] };
    const md = VALID_MD + '\n\n## Quick Start\n```css\n:root {\n  --color-a: #6b5ce7;\n  --page-max-width: 100rem;\n}\n```\n';
    const result = validateDesignMd(md, t);
    expect(result.warnings.some((w) => w.type === 'quickstart-maxwidth')).toBe(true);
  });

  it('quickstart fidelity: a phantom Quick Start hex is a critical failure', () => {
    const md = VALID_MD + '\n\n## Quick Start\n```css\n:root {\n  --color-x: #1a2b3c;\n}\n```\n';
    const result = validateDesignMd(md, makeTokens());
    expect(result.failures.some((f) => f.type === 'quickstart-phantom-color')).toBe(true);
  });
});
