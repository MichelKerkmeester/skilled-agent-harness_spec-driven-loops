import { describe, it, expect } from 'vitest';
import { emitQuickStart, formatSchemaSectionV3 } from '../scripts/formatters-v3';
import { resolveSchemaSections, schemaSection, V3_SCHEMA } from '../scripts/schema-v3';
import { isValidationPass, validateDesignMd } from '../scripts/validate';
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

No shadow tokens were extracted.

## 7. Do's and Don'ts

Do use consistent spacing.

## 8. Responsive Behavior

Mobile-first breakpoints at 768px and 1024px.

## 9. Agent Prompt Guide

Use \`#6b5ce7\` for primary actions.
`;

function makeV3Tokens(): DesignTokens {
  return makeTokens({
    spacingSystem: {
      baseUnit: 4,
      scale: [4, 8, 16],
      frequencyMap: {},
      maxContentWidth: '100%',
      sectionSpacing: [],
    },
    radiusTokens: [],
    shadowTokens: [],
    components: [],
  });
}

function v3Document(tokens: DesignTokens): string {
  const sections = resolveSchemaSections(tokens)
    .map((section) => section.emitter
      ? formatSchemaSectionV3(section, tokens)
      : `${section.heading}\n\nTarget-grounded content.`)
    .join('\n\n');
  return `# Example ${V3_SCHEMA.document.titleSuffix}\n\n${sections}\n`;
}

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

  it('scores production advisory-only input as passing and hard input as blocking', () => {
    const tokens = makeV3Tokens();
    const document = v3Document(tokens);
    const advisoryOnly = validateDesignMd(document, tokens);
    expect(advisoryOnly.warnings.some((warning) => warning.severity === 'advisory')).toBe(true);
    expect(advisoryOnly.score).toBe(100);
    expect(advisoryOnly.failures).toHaveLength(0);
    expect(isValidationPass(advisoryOnly)).toBe(true);

    const quickStartHeading = schemaSection(V3_SCHEMA.document.quickStartSectionId).heading;
    const hardDocument = document.replace(
      quickStartHeading,
      `#deadbe\n\n${quickStartHeading}`,
    );
    const hardFailure = validateDesignMd(hardDocument, tokens);
    expect(hardFailure.score).toBe(95);
    expect(hardFailure.failures).toHaveLength(1);
    expect(hardFailure.failures[0]).toMatchObject({
      type: 'phantom-color',
      severity: 'hard',
      category: 'target',
    });
    expect(isValidationPass(hardFailure)).toBe(false);
  });

  it('keeps ungrounded interpretive claims as hard provenance failures', () => {
    const md = VALID_MD + '\n\nThis is a gradient-as-depth technique that replaces shadow elevation. Unlike most systems, this one is flat.\n';
    const result = validateDesignMd(md, makeTokens());
    const proseFailures = result.failures.filter((issue) => issue.type === 'prose-fabrication');
    // assert WHICH patterns fired, not just a loose count
    expect(proseFailures.some((issue) => /gradient-as-depth|replaces-shadow/i.test(issue.message))).toBe(true);
    expect(proseFailures.some((issue) => /most systems/i.test(issue.message))).toBe(true);
    expect(proseFailures.every((issue) => issue.category === 'provenance')).toBe(true);
    expect(result.claimsScore).toBeLessThan(result.valuesScore);
  });

  it('flags a focus-consistent claim when the tokens show it is not', () => {
    const tokens = makeTokens();
    (tokens as unknown as { a11yTokens: unknown }).a11yTokens = {
      focusIndicator: { style: {}, consistent: false, captured: false },
      contrastPairs: [], minTouchTarget: { width: 44, height: 44 }, minFontSize: '16px',
    };
    const md = VALID_MD + '\n\nThe focus indicators are consistent across all elements.\n';
    const result = validateDesignMd(md, tokens);
    expect(result.failures.filter((failure) => failure.value === 'focus consistent').length).toBe(1);
  });

  it('score cannot go below 0', () => {
    const tokens = makeV3Tokens();
    const phantoms = Array.from(
      { length: 21 },
      (_, index) => `#${(index + 1).toString(16).padStart(6, '0')}`,
    ).join(' ');
    const result = validateDesignMd(`${v3Document(tokens)}\n${phantoms}\n`, tokens);
    expect(result.failures.filter((failure) => failure.type === 'phantom-color'))
      .toHaveLength(21);
    expect(result.score).toBe(0);
  });

  it('quickstart fidelity: an empty deterministic surface fails required active groups', () => {
    const tokens = makeV3Tokens();
    const quickStart = emitQuickStart(tokens);
    const quickStartHeading = schemaSection(V3_SCHEMA.document.quickStartSectionId).heading;
    const emptyQuickStart = [
      quickStartHeading,
      '',
      ...V3_SCHEMA.quickStartTargets.flatMap((target) => [
        target.heading,
        '',
        `\`\`\`${target.fenceLanguage}`,
        target.wrapperOpen,
        target.wrapperClose,
        '```',
        '',
      ]),
    ].join('\n');
    const result = validateDesignMd(v3Document(tokens).replace(quickStart, emptyQuickStart), tokens);
    const missingGroups = result.failures.filter((failure) => (
      failure.type === 'quickstart-missing-group'
    ));

    expect(missingGroups.length).toBeGreaterThan(0);
    expect(missingGroups.every((failure) => failure.category === 'schema')).toBe(true);
    expect(isValidationPass(result)).toBe(false);
  });

  it('quickstart fidelity: flags a --page-max-width that disagrees with tokens (the 100rem class)', () => {
    const t = makeTokens();
    (t as unknown as { spacingSystem: unknown }).spacingSystem = { maxContentWidth: '100%', scale: [], baseUnit: 4, frequencyMap: {}, sectionSpacing: [] };
    const md = VALID_MD + '\n\n## Quick Start\n```css\n:root {\n  --color-a: #6b5ce7;\n  --page-max-width: 100rem;\n}\n```\n';
    const result = validateDesignMd(md, t);
    expect(result.failures.some((failure) => failure.type === 'quickstart-maxwidth')).toBe(true);
  });

  it('quickstart fidelity: a phantom Quick Start hex is a critical failure', () => {
    const md = VALID_MD + '\n\n## Quick Start\n```css\n:root {\n  --color-x: #1a2b3c;\n}\n```\n';
    const result = validateDesignMd(md, makeTokens());
    expect(result.failures.some((f) => f.type === 'quickstart-phantom-color')).toBe(true);
  });

  it('requires and value-checks Motion when detector evidence is present', () => {
    const tokens = makeV3Tokens();
    tokens.motionSystem = {
      durationScale: [{ label: 'small', value: '150ms', frequency: 2 }],
      primaryTimingFunction: 'ease-out',
      timingFunctions: [{ value: 'ease-out', frequency: 2 }],
      keyframeAnimations: [],
      prefersReducedMotion: false,
    };
    const document = v3Document(tokens);

    expect(validateDesignMd(document, tokens).failures).toHaveLength(0);
    expect(validateDesignMd(document.replace('## Motion', '## Motion Removed'), tokens).failures)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'missing-section', value: '## Motion' }),
      ]));
    expect(validateDesignMd(document.replace('`150ms`', '`999ms`'), tokens).failures)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'motion-value-fidelity', category: 'target' }),
      ]));
  });

  it('rejects a phrase-triggered Motion section without detector evidence', () => {
    const tokens = makeV3Tokens();
    tokens.motionSystem = null;
    const document = `${v3Document(tokens)}\n## Motion\n\nMotion 150ms ease-out.\n`;
    const result = validateDesignMd(document, tokens);

    expect(result.failures).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'unexpected-motion-section',
        category: 'provenance',
      }),
    ]));
  });
});
