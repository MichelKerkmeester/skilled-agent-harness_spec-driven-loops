import { describe, it, expect } from 'vitest';
import { extractA11y } from '../scripts/a11y-extract';
import type { InteractionData } from '../scripts/types';

// Regression: the focus indicator must report honest absence. Returning
// consistent:true on empty data is what let the DESIGN.md writer assert
// "focus indicators are consistent" with zero backing data.
describe('extractFocusIndicator honest absence (via extractA11y)', () => {
  it('reports captured:false and consistent:false when no focus styles were captured', () => {
    const a11y = extractA11y([], []);
    expect(a11y.focusIndicator.captured).toBe(false);
    expect(a11y.focusIndicator.consistent).toBe(false);
    expect(Object.keys(a11y.focusIndicator.style)).toHaveLength(0);
  });

  it('reports captured:true with a real captured focus style', () => {
    const interactions = [
      { captures: [{ focusVisibleDiff: { outline: '2px solid #000000' } }] },
    ] as unknown as InteractionData[];
    const a11y = extractA11y([], interactions);
    expect(a11y.focusIndicator.captured).toBe(true);
    expect(a11y.focusIndicator.style.outline).toBe('2px solid #000000');
  });
});
