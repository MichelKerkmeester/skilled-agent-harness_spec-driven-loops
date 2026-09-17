// ────────────────────────────────────────────────────────────────
// MODULE: Semantic Typography Role Tests
// ────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { normalizeTypographyRole, normalizeTypographyScale } from '../scripts/typography-role-v3';

import type { TypographyLevel } from '../scripts/types';

function level(tag: string, fontSize: string): TypographyLevel {
  return {
    fontFamily: 'Example Sans', fontSize, fontWeight: '400', lineHeight: '1.5',
    letterSpacing: '0px', textTransform: null, fontFeatureSettings: null,
    frequency: 1, typicalTags: tag ? [tag] : [], sampleTexts: [], confidence: 'high',
  };
}

describe('semantic typography-role normalizer', () => {
  it('maps aliases into the stable core while preserving the original label', () => {
    expect(normalizeTypographyRole('H1')).toEqual({
      originalLabel: 'H1',
      semanticRole: 'heading',
      normalizedRole: 'heading',
      isExtension: false,
    });
  });

  it('namespaces novel roles so they cannot shadow the core', () => {
    expect(normalizeTypographyRole('Product Stat', 'acme')).toEqual({
      originalLabel: 'Product Stat',
      semanticRole: 'extension',
      normalizedRole: 'acme:product-stat',
      isExtension: true,
    });
  });

  it('keeps repeated semantic roles stable and collision-free across a scale', () => {
    const roles = normalizeTypographyScale([level('p', '14px'), level('p', '18px')]);
    expect(roles.map((role) => role.normalizedRole)).toEqual(['body', 'body-2']);
    expect(roles.map((role) => role.originalLabel)).toEqual(['p', 'p']);
  });
});
