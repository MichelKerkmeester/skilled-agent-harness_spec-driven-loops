import { describe, it, expect } from 'vitest';
import { formatColorTable, formatTypographyTable, formatDepthSection, formatContrastTable, formatSpacingScale, formatRadiusTable } from '../formatters';
import type { DesignTokens } from '../types';

function tokens(): DesignTokens {
  return {
    colorTokens: [
      { hex: '#06458c', rgba: [6, 69, 140, 1], frequency: 10393, usedAs: { textColor: 3038, bgColor: 82, borderColor: 7271, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: ['--brand'], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'infrastructure', confidence: 1, signals: [] } },
      { hex: '#043367', rgba: [4, 51, 103, 1], frequency: 10, usedAs: { textColor: 0, bgColor: 6, borderColor: 0, shadowColor: 0, gradientColor: 4, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.4, sourcePages: [], confidence: 'medium', stability: { layer: 'system', confidence: 0.5, signals: [] } },
      { hex: '#d31510', rgba: [211, 21, 16, 1], frequency: 12, usedAs: { textColor: 0, bgColor: 5, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.2, sourcePages: [], confidence: 'low', stability: { layer: 'campaign', confidence: 0.2, signals: [] } },
      { hex: '#646464', rgba: [100, 100, 100, 1], frequency: 3, usedAs: { textColor: 0, bgColor: 4, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.1, sourcePages: [], confidence: 'low', stability: { layer: 'content', confidence: 0.1, signals: [] } },
    ],
    typographyLevels: [
      { fontFamily: 'Silka Webfont', fontSize: '16px', fontWeight: '400', lineHeight: '23.2px', letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 100, typicalTags: ['p'], sampleTexts: [], confidence: 'high' },
      { fontFamily: 'Silka Webfont', fontSize: '49px', fontWeight: '600', lineHeight: '58.8px', letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 5, typicalTags: ['h2'], sampleTexts: [], confidence: 'high' },
    ],
  } as unknown as DesignTokens;
}

describe('formatters (doc-as-view Phase A)', () => {
  it('color table: deterministic, functional naming, L1/L2 main, L3 campaign, L4 excluded', () => {
    const a = formatColorTable(tokens());
    expect(a).toBe(formatColorTable(tokens())); // deterministic render
    expect(a).toContain('#06458c'); // L1 in main
    expect(a).toContain('#043367'); // L2 in main
    expect(a).toContain('Subject to change'); // L3 block present
    expect(a).toContain('#d31510'); // L3 in campaign block
    expect(a).not.toContain('#646464'); // L4 (content) excluded entirely
    expect(a).toContain('border 7271'); // functional usage naming, not an invented name
  });

  it('typography table: every level verbatim, sorted by size descending', () => {
    const a = formatTypographyTable(tokens());
    expect(a).toBe(formatTypographyTable(tokens())); // deterministic
    expect(a.indexOf('49px')).toBeLessThan(a.indexOf('16px')); // 49 before 16
    expect(a).toContain('Silka Webfont');
    expect(a).toContain('h2'); // role derived from tag
  });

  it('depth section: flat when no shadows; gradients are decorative, never gradient-as-depth', () => {
    const t = {
      shadowTokens: [],
      gradients: [
        { value: 'linear-gradient(270deg, rgb(3,29,60), rgb(4,51,103) 15%)', location: 'card' },
        { value: 'linear-gradient(90deg, rgb(254,254,254), rgba(254,254,254,0))', location: 'decorative' },
      ],
      colorTokens: [], typographyLevels: [],
    } as unknown as DesignTokens;
    const out = formatDepthSection(t);
    expect(out).toBe(formatDepthSection(t)); // deterministic
    expect(out).toContain('**Flat.**');
    expect(out).toContain('decorative gradient');
    expect(out.toLowerCase()).not.toContain('gradient-as-depth');
    expect(out.toLowerCase()).not.toContain('replaces shadow');
  });

  it('value tables: contrast, spacing, radius render verbatim, sorted, ABSENT when empty', () => {
    const t = {
      a11yTokens: {
        contrastPairs: [
          { foreground: '#0a0a0a', background: '#fefefe', ratio: 18.5, meetsAA: true, meetsAAA: true, usageCount: 200 },
          { foreground: '#06458c', background: '#fefefe', ratio: 7.2, meetsAA: true, meetsAAA: false, usageCount: 50 },
        ],
      },
      spacingSystem: { baseUnit: 8, scale: [4, 8, 16, 24, 48], frequencyMap: {}, maxContentWidth: '1200px', sectionSpacing: [] },
      radiusTokens: [
        { value: '10.5px', frequency: 40, typicalElements: ['button'] },
        { value: '7px', frequency: 12, typicalElements: ['div'] },
      ],
      colorTokens: [], typographyLevels: [], shadowTokens: [],
    } as unknown as DesignTokens;

    const c = formatContrastTable(t);
    expect(c).toBe(formatContrastTable(t)); // deterministic
    expect(c).toContain('18.50'); // ratio rendered
    expect(c.indexOf('18.50')).toBeLessThan(c.indexOf('7.20')); // usage-200 row (ratio 18.50) before usage-50 row

    const sp = formatSpacingScale(t);
    expect(sp).toContain('8px'); // base unit
    expect(sp).toContain('1200px'); // max content width

    const r = formatRadiusTable(t);
    expect(r.indexOf('10.5px')).toBeLessThan(r.indexOf('7px')); // sorted by frequency desc

    expect(formatContrastTable({ a11yTokens: { contrastPairs: [] } } as unknown as DesignTokens)).toContain('_No contrast pairs');
    expect(formatRadiusTable({ radiusTokens: [] } as unknown as DesignTokens)).toContain('_No border-radius');
  });
});
