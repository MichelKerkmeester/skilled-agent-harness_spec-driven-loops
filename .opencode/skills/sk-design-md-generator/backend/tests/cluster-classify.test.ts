import { describe, it, expect } from 'vitest';
import { classifyVariant, classifyColorStability } from '../scripts/cluster';
import type { ElementStyle, ColorToken } from '../scripts/types';

const el = (o: Partial<ElementStyle>) =>
  ({ backgroundColor: 'rgb(255,255,255)', color: 'rgb(0,0,0)', boxShadow: 'none', borderTopWidth: '0px', ...o } as ElementStyle);

describe('classifyVariant (button/control heuristic)', () => {
  it('classifies each branch, including the Outline/Tertiary additions', () => {
    expect(classifyVariant(el({ backgroundColor: 'rgba(0,0,0,0)' }))).toBe('Ghost');
    expect(classifyVariant(el({ backgroundColor: 'rgb(220,30,30)', color: 'rgb(255,255,255)' }))).toBe('Destructive');
    expect(classifyVariant(el({ backgroundColor: 'rgb(10,30,60)', color: 'rgb(255,255,255)' }))).toBe('Primary');
    expect(classifyVariant(el({ backgroundColor: 'rgb(255,255,255)', color: 'rgb(10,10,10)', borderTopWidth: '1px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }))).toBe('Secondary');
    // mid-light bg dodges the Secondary branch (which needs bgLum > 0.7) and lands on Outline
    expect(classifyVariant(el({ backgroundColor: 'rgb(200,200,200)', color: 'rgb(10,10,10)', borderTopWidth: '1px' }))).toBe('Outline');
    expect(classifyVariant(el({ backgroundColor: 'rgb(255,255,255)', color: 'rgb(10,10,10)' }))).toBe('Tertiary');
  });
});

describe('classifyColorStability coverage-election pre-gate', () => {
  it('caps a high-frequency single-page colour at L3 (campaign), not L1/L2', () => {
    const c = {
      hex: '#06458c', rgba: [6, 69, 140, 1], frequency: 9999, pagesCoverage: 0.25,
      usedAs: { textColor: 5000, bgColor: 100, borderColor: 4000, shadowColor: 0, gradientColor: 0, iconColor: 0 },
      cssVariableNames: ['--brand'], sourcePages: [], confidence: 'high',
    } as unknown as ColorToken;
    const result = classifyColorStability(c, 5);
    expect(result.layer).toBe('campaign');
    expect(result.signals.some((s) => /coverage-gate/.test(s))).toBe(true);
  });
});
