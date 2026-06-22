import { describe, it, expect } from 'vitest';
import { buildWritePrompt } from '../build-write-prompt';
import type { DesignTokens } from '../types';

function tokens(overrides: Record<string, unknown> = {}): DesignTokens {
  return {
    colorTokens: [
      { hex: '#06458c', rgba: [6, 69, 140, 1], frequency: 10393, usedAs: { textColor: 3038, bgColor: 82, borderColor: 7271, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: ['--brand'], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'infrastructure', confidence: 1, signals: [] } },
    ],
    typographyLevels: [
      { fontFamily: 'Silka Webfont', fontSize: '16px', fontWeight: '400', lineHeight: '23.2px', letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 100, typicalTags: ['p'], sampleTexts: [], confidence: 'high' },
    ],
    shadowTokens: [],
    gradients: [{ value: 'linear-gradient(270deg, rgb(3,29,60), rgb(4,51,103) 15%)', location: 'card' }],
    darkMode: { supported: false, detectionMethod: 'none' },
    motionSystem: { durationScale: [{ label: 'fast', value: '100ms', frequency: 4 }] },
    a11yTokens: { focusIndicator: { captured: true, consistent: false, style: {} }, contrastPairs: [] },
    iconSystem: null,
    ...overrides,
  } as unknown as DesignTokens;
}

describe('buildWritePrompt (doc-as-view integration)', () => {
  it('embeds pre-rendered §2/§3/§6 and a PRESENT/ABSENT manifest, deterministically', () => {
    const p = buildWritePrompt(tokens());
    expect(p).toBe(buildWritePrompt(tokens())); // deterministic
    expect(p).toContain('## 2. Color Palette'); // pre-rendered colour table
    expect(p).toContain('## 6. Depth & Elevation'); // pre-rendered depth
    expect(p).toContain('**Flat.**'); // flat depth (no shadows)
    expect(p).toContain('PRE-RENDERED');
    expect(p).toMatch(/2\.5 Dark Mode \| ABSENT/); // no dark palette
    expect(p).toMatch(/6\.5 Motion \| PRESENT/); // has durations
    expect(p).toMatch(/12 Iconography \| ABSENT/); // no icon system
  });

  it('marks accessibility ABSENT and warns when focus was not captured', () => {
    const p = buildWritePrompt(tokens({ a11yTokens: { focusIndicator: { captured: false, consistent: false, style: {} }, contrastPairs: [] } }));
    expect(p).toContain('focus NOT captured');
    expect(p).toMatch(/9 Accessibility \| ABSENT/);
  });
});
