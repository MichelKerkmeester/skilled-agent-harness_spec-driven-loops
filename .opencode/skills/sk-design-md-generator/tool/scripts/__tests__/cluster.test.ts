import { describe, it, expect } from 'vitest';
import {
  parseColor,
  parsePxValue,
  rgbaToHex,
  wcagContrast,
  deltaE,
  classifyShadow,
  splitShadowLayers,
  mergeTokenSets,
  type OKLCH,
} from '../cluster';
import type { DesignTokens, ColorToken } from '../types';

// ─── parseColor ─────────────────────────────────────────────────────────────

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    const c = parseColor('#ff6600');
    expect(c).toEqual({ r: 255, g: 102, b: 0, a: 1 });
  });

  it('parses 3-digit hex (shorthand)', () => {
    const c = parseColor('#f60');
    expect(c).toEqual({ r: 255, g: 102, b: 0, a: 1 });
  });

  it('parses 8-digit hex with alpha', () => {
    const c = parseColor('#ff660080');
    expect(c).not.toBeNull();
    expect(c!.r).toBe(255);
    expect(c!.g).toBe(102);
    expect(c!.b).toBe(0);
    expect(c!.a).toBeCloseTo(0.502, 1);
  });

  it('parses rgb()', () => {
    const c = parseColor('rgb(100, 200, 50)');
    expect(c).toEqual({ r: 100, g: 200, b: 50, a: 1 });
  });

  it('parses rgba() with alpha', () => {
    const c = parseColor('rgba(100, 200, 50, 0.5)');
    expect(c).toEqual({ r: 100, g: 200, b: 50, a: 0.5 });
  });

  it('parses named colors', () => {
    expect(parseColor('white')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('black')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('parses transparent', () => {
    expect(parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  it('returns null for invalid values', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('none')).toBeNull();
    expect(parseColor('currentcolor')).toBeNull();
    expect(parseColor('inherit')).toBeNull();
  });

  it('is case-insensitive', () => {
    expect(parseColor('#FF6600')).toEqual({ r: 255, g: 102, b: 0, a: 1 });
    expect(parseColor('RGB(100, 200, 50)')).toEqual({ r: 100, g: 200, b: 50, a: 1 });
  });

  it('parses hsl()', () => {
    const c = parseColor('hsl(0, 100%, 50%)');
    expect(c).not.toBeNull();
    expect(c!.r).toBe(255);
    expect(c!.g).toBe(0);
    expect(c!.b).toBe(0);
  });
});

// ─── parsePxValue ───────────────────────────────────────────────────────────

describe('parsePxValue', () => {
  it('parses px values', () => {
    expect(parsePxValue('16px')).toBe(16);
    expect(parsePxValue('0px')).toBe(0);
    expect(parsePxValue('1.5px')).toBe(1.5);
  });

  it('converts rem to px (×16)', () => {
    expect(parsePxValue('1rem')).toBe(16);
    expect(parsePxValue('2rem')).toBe(32);
    expect(parsePxValue('0.75rem')).toBe(12);
  });

  it('converts em to px (×16)', () => {
    expect(parsePxValue('1em')).toBe(16);
  });

  it('handles unitless numbers', () => {
    expect(parsePxValue('24')).toBe(24);
  });

  it('returns null for non-numeric values', () => {
    expect(parsePxValue('auto')).toBeNull();
    expect(parsePxValue('none')).toBeNull();
    expect(parsePxValue('normal')).toBeNull();
    expect(parsePxValue('')).toBeNull();
  });
});

// ─── rgbaToHex ──────────────────────────────────────────────────────────────

describe('rgbaToHex', () => {
  it('converts RGB to 6-digit hex', () => {
    expect(rgbaToHex(255, 102, 0)).toBe('#ff6600');
    expect(rgbaToHex(0, 0, 0)).toBe('#000000');
    expect(rgbaToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('clamps values to 0-255', () => {
    expect(rgbaToHex(300, -10, 128)).toBe('#ff0080');
  });

  it('rounds fractional values', () => {
    expect(rgbaToHex(127.6, 0, 0)).toBe('#800000');
  });
});

// ─── wcagContrast ───────────────────────────────────────────────────────────

describe('wcagContrast', () => {
  it('returns 21:1 for black on white', () => {
    const ratio = wcagContrast('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('returns 1:1 for same color', () => {
    const ratio = wcagContrast('#336699', '#336699');
    expect(ratio).toBeCloseTo(1, 0);
  });

  it('is symmetric', () => {
    const a = wcagContrast('#000000', '#ffffff');
    const b = wcagContrast('#ffffff', '#000000');
    expect(a).toBeCloseTo(b, 5);
  });

  it('returns 1 for invalid colors', () => {
    expect(wcagContrast('invalid', '#ffffff')).toBe(1);
  });
});

// ─── deltaE (OKLCH) ────────────────────────────────────────────────────────

describe('deltaE', () => {
  it('returns 0 for identical colors', () => {
    const c: OKLCH = { l: 0.5, c: 0.1, h: 180 };
    expect(deltaE(c, c)).toBe(0);
  });

  it('returns small value for similar colors', () => {
    const a: OKLCH = { l: 0.5, c: 0.1, h: 180 };
    const b: OKLCH = { l: 0.51, c: 0.1, h: 181 };
    expect(deltaE(a, b)).toBeLessThan(3);
  });

  it('returns large value for different colors', () => {
    const a: OKLCH = { l: 0.9, c: 0.0, h: 0 };   // near white
    const b: OKLCH = { l: 0.1, c: 0.0, h: 0 };   // near black
    expect(deltaE(a, b)).toBeGreaterThan(50);
  });

  it('is symmetric', () => {
    const a: OKLCH = { l: 0.6, c: 0.15, h: 30 };
    const b: OKLCH = { l: 0.4, c: 0.10, h: 200 };
    expect(deltaE(a, b)).toBeCloseTo(deltaE(b, a), 10);
  });

  it('detects within-cluster threshold (< 3)', () => {
    // Two very similar purples
    const a: OKLCH = { l: 0.5, c: 0.2, h: 270 };
    const b: OKLCH = { l: 0.505, c: 0.2, h: 270.5 };
    expect(deltaE(a, b)).toBeLessThan(3);
  });
});

// ─── classifyShadow ─────────────────────────────────────────────────────────

describe('splitShadowLayers', () => {
  it('treats rgba commas as non-separators', () => {
    expect(splitShadowLayers('rgba(0,0,0,0.1) 0 4px 6px')).toHaveLength(1);
    expect(splitShadowLayers('rgba(50,50,93,0.12) 0px 16px 32px 0px')).toHaveLength(1);
  });

  it('splits real multi-layer shadows', () => {
    expect(splitShadowLayers('0 1px 2px #000, 0 4px 8px #111')).toHaveLength(2);
    expect(splitShadowLayers('rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.05) 0 4px 8px')).toHaveLength(2);
  });

  it('handles single simple shadow', () => {
    expect(splitShadowLayers('0 2px 4px #000')).toHaveLength(1);
  });
});

describe('classifyShadow', () => {
  it('classifies elevation shadow (hex color)', () => {
    expect(classifyShadow('0px 2px 8px #00000020')).toBe('elevation');
    expect(classifyShadow('0 4px 6px #0000001a')).toBe('elevation');
  });

  it('classifies elevation shadow (rgba color)', () => {
    expect(classifyShadow('rgba(0,0,0,0.1) 0px 4px 6px 0px')).toBe('elevation');
    expect(classifyShadow('rgba(50,50,93,0.12) 0px 16px 32px 0px')).toBe('elevation');
  });

  it('classifies border-shadow (spread only, no offset/blur)', () => {
    expect(classifyShadow('0 0 0 2px #0000001a')).toBe('border-shadow');
    expect(classifyShadow('0 0 0 2px rgba(0,0,0,0.1)')).toBe('border-shadow');
  });

  it('classifies ring (negative spread, no offset/blur)', () => {
    expect(classifyShadow('0 0 0 -2px #000')).toBe('ring');
  });

  it('classifies inset shadow', () => {
    expect(classifyShadow('inset 0 2px 4px #0000001a')).toBe('inset');
    expect(classifyShadow('inset 0 2px 4px rgba(0,0,0,0.1)')).toBe('inset');
  });

  it('classifies real multi-layer shadows as complex-stack', () => {
    expect(classifyShadow('0 1px 2px #000, 0 4px 8px #111')).toBe('complex-stack');
    expect(classifyShadow('rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.05) 0 4px 8px')).toBe('complex-stack');
  });

  it('defaults to elevation for ambiguous values', () => {
    expect(classifyShadow('0 0 4px #000')).toBe('elevation');
  });
});

// ─── mergeTokenSets ─────────────────────────────────────────────────────────

function makeColor(hex: string, freq: number): ColorToken {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    hex,
    rgba: [r, g, b, 1],
    frequency: freq,
    usedAs: { textColor: 0, bgColor: freq, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 },
    cssVariableNames: [],
    pagesCoverage: 1,
    sourcePages: [],
    confidence: 'high',
  };
}

function makeMinimalTokens(colors: ColorToken[]): DesignTokens {
  return {
    colorTokens: colors,
    colorRelationships: { lightnessScales: [], complementaryPairs: [], contrastPairs: [] },
    typographyLevels: [
      { fontFamily: 'Inter', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', letterSpacing: 'normal', textTransform: null, fontFeatureSettings: null, frequency: 50, typicalTags: ['p'], sampleTexts: ['Hello'], confidence: 'high' },
    ],
    fontInfo: { fontFaces: [], loadedFonts: [] },
    shadowTokens: [{ value: '0 2px 4px #0001', frequency: 10, type: 'elevation', typicalElements: ['div'] }],
    radiusTokens: [{ value: '8px', frequency: 20, typicalElements: ['div'] }],
    spacingSystem: { baseUnit: null, commonValues: [], gcdCandidate: null },
    componentGroups: [],
    cssVariablesSummary: [],
    metadata: { totalPages: 1, totalElements: 100, extractedAt: '2026-01-01', urls: ['https://example.com'] },
  } as unknown as DesignTokens;
}

describe('mergeTokenSets', () => {
  it('merges perceptually identical colors by combining frequencies', () => {
    const existing = makeMinimalTokens([makeColor('#ff0000', 10)]);
    // #ff0100 is nearly identical to #ff0000
    const incoming = makeMinimalTokens([makeColor('#ff0100', 5)]);
    const merged = mergeTokenSets(existing, incoming);
    // Should merge into one color since delta-E < 3
    expect(merged.colorTokens.length).toBe(1);
    expect(merged.colorTokens[0].frequency).toBe(15);
  });

  it('keeps distinct colors separate', () => {
    const existing = makeMinimalTokens([makeColor('#ff0000', 10)]);
    const incoming = makeMinimalTokens([makeColor('#0000ff', 5)]); // very different
    const merged = mergeTokenSets(existing, incoming);
    expect(merged.colorTokens.length).toBe(2);
  });

  it('merges typography by key (family|size|weight)', () => {
    const existing = makeMinimalTokens([]);
    existing.typographyLevels = [
      { fontFamily: 'Inter', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', letterSpacing: 'normal', textTransform: null, fontFeatureSettings: null, frequency: 50, typicalTags: ['p'], sampleTexts: ['Hello'], confidence: 'high' },
    ];
    const incoming = makeMinimalTokens([]);
    incoming.typographyLevels = [
      { fontFamily: 'Inter', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', letterSpacing: 'normal', textTransform: null, fontFeatureSettings: null, frequency: 30, typicalTags: ['p'], sampleTexts: ['World'], confidence: 'high' },
      { fontFamily: 'Inter', fontSize: '32px', fontWeight: '700', lineHeight: '1.2', letterSpacing: 'normal', textTransform: null, fontFeatureSettings: null, frequency: 10, typicalTags: ['h1'], sampleTexts: ['Title'], confidence: 'medium' },
    ];
    const merged = mergeTokenSets(existing, incoming);
    expect(merged.typographyLevels.length).toBe(2);
    const body = merged.typographyLevels.find(t => t.fontSize === '16px');
    expect(body!.frequency).toBe(80);
  });

  it('merges shadows by exact value', () => {
    const existing = makeMinimalTokens([]);
    existing.shadowTokens = [{ value: '0 2px 4px #0001', frequency: 10, type: 'elevation', typicalElements: ['div'] }];
    const incoming = makeMinimalTokens([]);
    incoming.shadowTokens = [
      { value: '0 2px 4px #0001', frequency: 5, type: 'elevation', typicalElements: ['div'] },
      { value: '0 8px 16px #0002', frequency: 3, type: 'elevation', typicalElements: ['section'] },
    ];
    const merged = mergeTokenSets(existing, incoming);
    expect(merged.shadowTokens.length).toBe(2);
    expect(merged.shadowTokens.find(s => s.value === '0 2px 4px #0001')!.frequency).toBe(15);
  });

  it('merges radius tokens by exact value', () => {
    const existing = makeMinimalTokens([]);
    existing.radiusTokens = [{ value: '8px', frequency: 20, typicalElements: ['div'] }];
    const incoming = makeMinimalTokens([]);
    incoming.radiusTokens = [
      { value: '8px', frequency: 10, typicalElements: ['div'] },
      { value: '16px', frequency: 5, typicalElements: ['section'] },
    ];
    const merged = mergeTokenSets(existing, incoming);
    expect(merged.radiusTokens.length).toBe(2);
    expect(merged.radiusTokens.find(r => r.value === '8px')!.frequency).toBe(30);
  });
});
