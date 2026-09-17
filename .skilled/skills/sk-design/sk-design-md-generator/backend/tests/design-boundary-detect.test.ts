import { describe, it, expect } from 'vitest';
import { detectBoundaries, type PageGroup } from '../scripts/design-boundary-detect';

function pageGroup(over: Partial<PageGroup> = {}): PageGroup {
  return {
    label: 'example.com',
    urls: ['https://example.com'],
    colorTokens: [],
    typographyLevels: [],
    components: [],
    spacingSystem: { baseUnit: 4, scale: [4, 8, 16] },
    radiusTokens: [],
    shadowTokens: [],
    fontFamilies: [],
    ...over,
  } as unknown as PageGroup;
}

describe('detectBoundaries (P2-003 coverage: focused extraction module regression)', () => {
  it('reports "unified" with 100% similarity for a single page group', () => {
    const result = detectBoundaries([pageGroup()]);
    expect(result.relationship).toBe('unified');
    expect(result.overallSimilarity).toBe(100);
    expect(result.sharedTokenSummary).toBeNull();
  });

  it('reports "unified" for two groups sharing identical fonts and colors', () => {
    const shared = {
      fontFamilies: ['Inter', 'system-ui'],
      colorTokens: [
        { hex: '#111111', rgba: [17, 17, 17, 1], frequency: 10, usedAs: {}, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } },
      ],
    } as unknown as Partial<PageGroup>;
    const result = detectBoundaries([
      pageGroup({ label: 'a.example.com', ...shared }),
      pageGroup({ label: 'b.example.com', ...shared }),
    ]);
    expect(result.relationship).toBe('unified');
  });

  it('reports "independent" for two groups with completely disjoint fonts, colors, spacing, radii, and shadows', () => {
    const result = detectBoundaries([
      pageGroup({
        label: 'brand-a.example.com',
        fontFamilies: ['Georgia'],
        colorTokens: [{ hex: '#ff0000', rgba: [255, 0, 0, 1], frequency: 10, usedAs: {}, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } }] as unknown as PageGroup['colorTokens'],
        spacingSystem: { baseUnit: 4, scale: [4, 8, 12] },
        radiusTokens: [{ value: '2px', frequency: 10, typicalElements: ['button'] }] as unknown as PageGroup['radiusTokens'],
        shadowTokens: [{ value: '0 1px 2px rgba(0,0,0,0.1)' }] as unknown as PageGroup['shadowTokens'],
      }),
      pageGroup({
        label: 'brand-b.example.com',
        fontFamilies: ['Courier New'],
        colorTokens: [{ hex: '#0000ff', rgba: [0, 0, 255, 1], frequency: 10, usedAs: {}, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } }] as unknown as PageGroup['colorTokens'],
        spacingSystem: { baseUnit: 8, scale: [8, 24, 48, 96] },
        radiusTokens: [{ value: '24px', frequency: 10, typicalElements: ['card'] }] as unknown as PageGroup['radiusTokens'],
        shadowTokens: [{ value: '0 20px 40px rgba(0,0,0,0.4)' }] as unknown as PageGroup['shadowTokens'],
      }),
    ]);
    expect(result.relationship).toBe('independent');
    expect(result.overallSimilarity).toBeLessThan(30);
  });

  it('includes a per-group token-count summary for every input group', () => {
    const result = detectBoundaries([
      pageGroup({ label: 'a.example.com', colorTokens: [{ hex: '#111', rgba: [17, 17, 17, 1] }] as unknown as PageGroup['colorTokens'] }),
      pageGroup({ label: 'b.example.com' }),
    ]);
    expect(result.groups).toHaveLength(2);
    expect(result.groups.map((g) => g.label)).toEqual(['a.example.com', 'b.example.com']);
    expect(result.groups[0].tokenCount.colors).toBe(1);
  });
});
