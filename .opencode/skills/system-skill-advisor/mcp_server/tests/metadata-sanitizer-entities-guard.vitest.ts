// ───────────────────────────────────────────────────────────────
// MODULE: derived.entities shape preservation guard
// ───────────────────────────────────────────────────────────────
// sanitizeDerivedMetadata flattens object-shaped entities ({name, kind, path,
// source}, as sk-design and system-deep-loop ship) to their `name` so they reach
// the SQLite index and the scorer's derivedKeywords. Before this fix the object
// shape was filtered out by a `typeof entry === 'string'` guard and dropped
// silently; because restoring it changes indexed content and shifts advisor
// scoring, the fix co-landed with the 193-row parity re-baseline.

import { describe, it, expect } from 'vitest';
import { sanitizeDerivedMetadata } from '../lib/skill-graph/metadata-sanitizer.js';

describe('derived.entities object-shape preservation', () => {
  const objectEntity = {
    name: 'sk-design',
    kind: 'skill',
    path: '.opencode/skills/sk-design/SKILL.md',
    source: 'derived',
  };

  // Object entities survive, flattened to their `name`.
  it('preserves object-shaped entities, indexed by name', () => {
    const out = sanitizeDerivedMetadata({ entities: [objectEntity] }, 'guard-test');
    expect(out?.entities).toContain('sk-design');
  });

  // When `name` is absent the entity falls back to its `path`.
  it('falls back to path when an object entity has no name', () => {
    const out = sanitizeDerivedMetadata(
      { entities: [{ kind: 'reference', path: 'quick_start', source: 'derived' }] },
      'guard-test',
    );
    expect(out?.entities).toContain('quick_start');
  });

  // Plain string entities remain unaffected.
  it('keeps string entities untouched', () => {
    const out = sanitizeDerivedMetadata({ entities: ['plain-string-entity'] }, 'guard-test');
    expect(out?.entities).toEqual(['plain-string-entity']);
  });

  // Shapeless entries (no name, no path) are still dropped.
  it('drops entities with neither name nor path', () => {
    const out = sanitizeDerivedMetadata(
      { entities: [{ kind: 'reference', source: 'derived' }, 42, null] },
      'guard-test',
    );
    expect(out?.entities).toEqual([]);
  });
});
