import { describe, it, expect } from 'vitest';
import { parseTransitionShorthand } from '../scripts/css-analyzer';

describe('parseTransitionShorthand (P1-007 regression: cubic-bezier comma-splitting)', () => {
  it('keeps a single cubic-bezier transition as one entry, not four', () => {
    const result = parseTransitionShorthand('color 150ms cubic-bezier(0.4, 0, 0.2, 1)');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      property: 'color',
      duration: '150ms',
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: '0s',
    });
  });

  it('correctly splits multiple transitions that each use cubic-bezier', () => {
    const result = parseTransitionShorthand(
      'color 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1) 50ms',
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      property: 'color',
      duration: '150ms',
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: '0s',
    });
    expect(result[1]).toEqual({
      property: 'transform',
      duration: '200ms',
      timingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      delay: '50ms',
    });
  });

  it('handles steps() the same way as cubic-bezier', () => {
    const result = parseTransitionShorthand('opacity 300ms steps(4, jump-end)');
    expect(result).toHaveLength(1);
    expect(result[0].timingFunction).toBe('steps(4, jump-end)');
  });

  it('still parses plain keyword timing functions and multi-transition lists correctly', () => {
    const result = parseTransitionShorthand('color 150ms ease, transform 200ms linear 50ms');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ property: 'color', duration: '150ms', timingFunction: 'ease', delay: '0s' });
    expect(result[1]).toEqual({ property: 'transform', duration: '200ms', timingFunction: 'linear', delay: '50ms' });
  });

  it('defaults property to "all" and timing function to "ease" when omitted', () => {
    const result = parseTransitionShorthand('150ms');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ property: 'all', duration: '150ms', timingFunction: 'ease', delay: '0s' });
  });
});
