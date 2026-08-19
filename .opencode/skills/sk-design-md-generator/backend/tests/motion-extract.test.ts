import { describe, it, expect } from 'vitest';
import { extractMotion } from '../scripts/motion-extract';
import type { CSSAnalysis, DOMCollection } from '../scripts/types';

function css(over: Partial<CSSAnalysis> = {}): CSSAnalysis {
  return {
    pseudoClassRules: [],
    mediaBreakpoints: [],
    transitions: [],
    animations: [],
    supportsQueries: [],
    containerQueries: [],
    totalRuleCount: 0,
    analyzedSheetCount: 0,
    failedSheets: [],
    ...over,
  } as unknown as CSSAnalysis;
}

describe('extractMotion (P2-003 coverage: focused extraction module regression)', () => {
  it('returns null when there are no transitions and no animations', () => {
    expect(extractMotion(css(), [] as DOMCollection[])).toBeNull();
  });

  it('buckets transition durations into micro/small/medium/large/xl tiers in ascending order', () => {
    const result = extractMotion(
      css({
        transitions: [
          { selector: '.a', property: 'opacity', duration: '80ms', timingFunction: 'ease', delay: '0s' },
          { selector: '.b', property: 'transform', duration: '150ms', timingFunction: 'ease', delay: '0s' },
          { selector: '.c', property: 'color', duration: '600ms', timingFunction: 'linear', delay: '0s' },
        ],
      }),
      [] as DOMCollection[],
    );
    expect(result).not.toBeNull();
    const labels = result!.durationScale.map((d) => d.label);
    expect(labels).toEqual(['micro', 'small', 'large']); // ascending tier order, not insertion order
  });

  it('picks the most frequent timing function as primary', () => {
    const result = extractMotion(
      css({
        transitions: [
          { selector: '.a', property: 'opacity', duration: '150ms', timingFunction: 'ease-out', delay: '0s' },
          { selector: '.b', property: 'transform', duration: '150ms', timingFunction: 'ease-out', delay: '0s' },
          { selector: '.c', property: 'color', duration: '150ms', timingFunction: 'linear', delay: '0s' },
        ],
      }),
      [] as DOMCollection[],
    );
    expect(result!.primaryTimingFunction).toBe('ease-out');
  });

  it('classifies a fade-in keyframe animation (opacity 0 -> 1) as "entrance"', () => {
    const result = extractMotion(
      css({
        animations: [
          {
            name: 'fadeIn', duration: '300ms', usedBy: ['.modal'],
            keyframes: [
              { offset: '0%', properties: { opacity: '0' } },
              { offset: '100%', properties: { opacity: '1' } },
            ],
          },
        ],
      }),
      [] as DOMCollection[],
    );
    expect(result!.keyframeAnimations[0].type).toBe('entrance');
  });

  it('classifies a fade-out keyframe animation (opacity 1 -> 0) as "exit"', () => {
    const result = extractMotion(
      css({
        animations: [
          {
            name: 'fadeOut', duration: '300ms', usedBy: ['.modal'],
            keyframes: [
              { offset: '0%', properties: { opacity: '1' } },
              { offset: '100%', properties: { opacity: '0' } },
            ],
          },
        ],
      }),
      [] as DOMCollection[],
    );
    expect(result!.keyframeAnimations[0].type).toBe('exit');
  });

  it('flags prefers-reduced-motion when present in media breakpoints', () => {
    const result = extractMotion(
      css({
        transitions: [{ selector: '.a', property: 'opacity', duration: '150ms', timingFunction: 'ease', delay: '0s' }],
        mediaBreakpoints: [{ query: '(prefers-reduced-motion: reduce)', type: 'prefers-reduced-motion', value: 'reduce', ruleCount: 2 }],
      }),
      [] as DOMCollection[],
    );
    expect(result!.prefersReducedMotion).toBe(true);
  });
});
