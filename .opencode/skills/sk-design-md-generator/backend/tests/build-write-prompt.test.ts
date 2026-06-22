import { describe, it, expect } from 'vitest';
import { buildWritePrompt } from '../scripts/build-write-prompt';
import type { DesignTokens } from '../scripts/types';

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

describe('buildWritePrompt (v3 Style Reference)', () => {
  it('pre-renders the v3 value sections + a facts block, deterministically', () => {
    const p = buildWritePrompt(tokens());
    expect(p).toBe(buildWritePrompt(tokens())); // deterministic
    expect(p).toContain('## Tokens — Colors'); // pre-rendered named colour table
    expect(p).toContain('## Quick Start'); // pre-rendered Quick Start
    expect(p).toContain('@theme'); // Tailwind block
    expect(p).toContain('PASTE THEM UNCHANGED');
    expect(p).toContain('FACTS'); // facts block present
    expect(p).toContain('FLAT'); // 0 shadows -> elevation must be flat, never gradient-as-depth
  });

  it('states focus honesty in the facts (captured but not consistent → do not call it consistent)', () => {
    const p = buildWritePrompt(tokens());
    expect(p).toContain('Do NOT call focus "consistent"'); // fixture: captured:true, consistent:false
    const p2 = buildWritePrompt(tokens({ a11yTokens: { focusIndicator: { captured: false, consistent: false, style: {} }, contrastPairs: [] } }));
    expect(p2).toContain('NOT captured — do not assert focus consistency');
  });
});
