import { describe, it, expect } from 'vitest';
import { detectIcons } from '../scripts/icon-detect';
import type { DOMCollection } from '../scripts/types';

function domCollection(over: Partial<DOMCollection> = {}): DOMCollection {
  return {
    elements: [],
    cssVariables: [],
    gradients: [],
    svgSizes: [],
    svgColors: [],
    ...over,
  } as unknown as DOMCollection;
}

describe('detectIcons (P2-003 coverage: focused extraction module regression)', () => {
  it('returns null when fewer than 3 SVGs were collected (not enough signal)', () => {
    const result = detectIcons([
      domCollection({ svgSizes: [{ width: 24, height: 24 }, { width: 24, height: 24 }] }),
    ]);
    expect(result).toBeNull();
  });

  it('detects a lucide icon library from svg class names', () => {
    const result = detectIcons([
      domCollection({
        svgSizes: [{ width: 24, height: 24 }, { width: 24, height: 24 }, { width: 24, height: 24 }],
        svgColors: ['currentColor', 'currentColor', 'currentColor'],
        elements: [
          { tag: 'svg', className: 'lucide lucide-arrow-right' },
          { tag: 'svg', className: 'lucide lucide-check' },
          { tag: 'svg', className: 'lucide lucide-x' },
        ] as unknown as DOMCollection['elements'],
      }),
    ]);
    expect(result?.library).toBe('lucide');
    expect(result?.totalCount).toBe(3);
  });

  it('classifies color mode as currentColor when the overwhelming majority use currentColor', () => {
    const result = detectIcons([
      domCollection({
        svgSizes: Array.from({ length: 6 }, () => ({ width: 16, height: 16 })),
        // 5/6 = 0.833 > the 0.8 threshold in determineColorMode
        svgColors: ['currentColor', 'currentColor', 'currentColor', 'currentColor', 'currentColor', '#000000'],
      }),
    ]);
    expect(result?.colorMode).toBe('currentColor');
  });

  it('classifies color mode as fixed when the overwhelming majority use fixed colors', () => {
    const result = detectIcons([
      domCollection({
        svgSizes: [{ width: 16, height: 16 }, { width: 16, height: 16 }, { width: 16, height: 16 }],
        svgColors: ['#ff0000', '#00ff00', '#0000ff'],
      }),
    ]);
    expect(result?.colorMode).toBe('fixed');
  });

  it('returns the top-3 most frequent icon widths as the size scale, sorted ascending', () => {
    const result = detectIcons([
      domCollection({
        svgSizes: [
          { width: 16, height: 16 }, { width: 16, height: 16 }, { width: 16, height: 16 },
          { width: 24, height: 24 }, { width: 24, height: 24 },
          { width: 32, height: 32 },
        ],
      }),
    ]);
    expect(result?.sizeScale).toEqual([16, 24, 32]);
  });
});
