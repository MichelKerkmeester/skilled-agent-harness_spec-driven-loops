import { describe, it, expect } from 'vitest';
import { formatColorTable, formatTypographyTable, formatDepthSection } from '../formatters';
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
});
