import { describe, it, expect } from 'vitest';
import {
  emitQuickStart,
  formatColorsV3,
  formatMotionV3,
  formatSpacingShapesV3,
  formatSurfacesV3,
  nameColors,
} from '../scripts/formatters-v3';
import type { DesignTokens } from '../scripts/types';

function tokens(over: Record<string, unknown> = {}): DesignTokens {
  return {
    colorTokens: [
      { hex: '#0a0a0a', rgba: [10, 10, 10, 1], frequency: 100, usedAs: { textColor: 50, bgColor: 1, borderColor: 90, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'infrastructure', confidence: 1, signals: [] } },
      { hex: '#06458c', rgba: [6, 69, 140, 1], frequency: 80, usedAs: { textColor: 30, bgColor: 1, borderColor: 70, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } },
      { hex: '#fefefe', rgba: [254, 254, 254, 1], frequency: 70, usedAs: { textColor: 20, bgColor: 60, borderColor: 50, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'infrastructure', confidence: 1, signals: [] } },
      { hex: '#101012', rgba: [16, 16, 18, 1], frequency: 5, usedAs: { textColor: 5, bgColor: 0, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 0.5, sourcePages: [], confidence: 'low', stability: { layer: 'system', confidence: 0.5, signals: [] } },
    ],
    typographyLevels: [
      { fontFamily: 'Silka', fontSize: '16px', fontWeight: '400', lineHeight: '23px', letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 100, typicalTags: ['p'], sampleTexts: [], confidence: 'high' },
    ],
    shadowTokens: [],
    spacingSystem: { baseUnit: 4, scale: [4, 28, 56, 92], frequencyMap: {}, maxContentWidth: '100%', sectionSpacing: [] },
    radiusTokens: [{ value: '7px', frequency: 170, typicalElements: ['button'] }],
    ...over,
  } as unknown as DesignTokens;
}

describe('formatters-v3 (Style Reference emitters)', () => {
  it('names colours by hue+lightness (reference register) + resolves collisions', () => {
    const n = nameColors(tokens());
    const byHex = Object.fromEntries(n.map((x) => [x.hex, x.name]));
    expect(byHex['#0a0a0a']).toBe('Ink');       // near-black
    expect(byHex['#06458c']).toBe('Azure');     // blue
    expect(byHex['#fefefe']).toBe('Snow');      // near-white
    expect(byHex['#101012']).toBe('Ink 2'); // 2nd near-black -> deterministic collision suffix
    // slug matches name
    expect(n.find((x) => x.hex === '#06458c')!.token).toBe('--color-azure');
  });

  it('FAB-KILLER: max-width is emitted VERBATIM from tokens (100% never becomes 100rem)', () => {
    const out = formatSpacingShapesV3(tokens());
    expect(out).toContain('**Page max-width:** 100%');
    expect(out).not.toContain('rem');
    expect(out).not.toContain('1600');
  });

  it('Quick Start is deterministic, value-faithful, and slug-consistent', () => {
    const a = emitQuickStart(tokens());
    expect(a).toBe(emitQuickStart(tokens())); // deterministic
    expect(a).toContain('--color-azure: #06458c;');
    expect(a).toContain('--page-max-width: 100%;');
    // every hex traces to a token hex
    const hexes = new Set(tokens().colorTokens.map((c) => c.hex.toLowerCase()));
    const phantom = (a.match(/#[0-9a-f]{6}/gi) || []).map((h) => h.toLowerCase()).filter((h) => !hexes.has(h));
    expect(phantom).toHaveLength(0);
  });

  it('renders measured motion values without inventing a timing function', () => {
    const output = formatMotionV3(tokens({
      motionSystem: {
        durationScale: [
          { label: 'small', value: '150ms', frequency: 3 },
          { label: 'medium', value: '300ms', frequency: 1 },
        ],
        primaryTimingFunction: 'ease-out',
        timingFunctions: [{ value: 'ease-out', frequency: 3 }],
        keyframeAnimations: [
          { name: 'fade-in', type: 'entrance', duration: '300ms', properties: ['opacity'] },
        ],
        prefersReducedMotion: true,
      },
    }));

    expect(output).toContain('## Motion');
    expect(output).toContain('| small | `150ms` |');
    expect(output).toContain('**Primary:** `ease-out`');
    expect(output).toContain('| fade-in | entrance | `300ms` | opacity |');
    expect(output).toContain('**Reduced-motion query:** detected');
    expect(output).not.toContain('frequency');
  });

  it('empty/missing token sets render absence cleanly and never throw', () => {
    const t = { colorTokens: [], typographyLevels: [], shadowTokens: [], spacingSystem: undefined, radiusTokens: [] } as unknown as DesignTokens;
    expect(formatColorsV3(t)).toContain('No L1/L2 system colours');
    expect(formatSurfacesV3(t)).toContain('No background-surface');
    expect(() => formatSpacingShapesV3(t)).not.toThrow();
    expect(() => emitQuickStart(t)).not.toThrow();
    expect(formatSpacingShapesV3(t)).toContain('not measured'); // no spacingSystem -> honest, not a fabricated max-width
  });
});
