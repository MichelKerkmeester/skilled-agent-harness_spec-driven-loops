// ───────────────────────────────────────────────────────────────
// MODULE: derived.entities shape-break guard (known bug, fix deferred)
// ───────────────────────────────────────────────────────────────
// sanitizeDerivedMetadata bundles `entities` with the plain string-array keys and
// filters every element to `typeof entry === 'string'`, so the object-shaped entities
// that sk-design and deep-loop-workflows ship ({name, kind, path, source}) are silently
// dropped — they never reach the SQLite index or the scorer's derivedKeywords. The fix
// (flatten object entities to their `name`) changes indexed content and therefore shifts
// advisor scoring, so it must co-land with the 193-row parity re-baseline, not before.
//
// This guard is GREEN while the bug stands and flips RED the moment the fix lands — the
// signal to recompute the parity baseline and retire this marker.

import { describe, it, expect } from 'vitest';
import { sanitizeDerivedMetadata } from '../lib/skill-graph/metadata-sanitizer.js';

describe('derived.entities object-shape drop (fix gated on the scorer re-baseline)', () => {
  const objectEntity = {
    name: 'sk-design',
    kind: 'skill',
    path: '.opencode/skills/sk-design/SKILL.md',
    source: 'derived',
  };

  // Desired post-fix behavior: the object entity survives, flattened to its name.
  // Fails today because entities are dropped — `it.fails` therefore passes now and
  // will RED when the sanitizer is fixed.
  it.fails('preserves object-shaped entities (dropped today)', () => {
    const out = sanitizeDerivedMetadata({ entities: [objectEntity] }, 'guard-test');
    expect(out?.entities).toContain('sk-design');
  });

  // Pin the current (buggy) behavior so the drop is documented, not accidental.
  it('documents the current behavior: object entities collapse to an empty array', () => {
    const out = sanitizeDerivedMetadata({ entities: [objectEntity] }, 'guard-test');
    expect(out?.entities).toEqual([]);
  });

  // String entities are unaffected — only the object shape is dropped.
  it('keeps string entities (only the object shape is lost)', () => {
    const out = sanitizeDerivedMetadata({ entities: ['plain-string-entity'] }, 'guard-test');
    expect(out?.entities).toEqual(['plain-string-entity']);
  });
});
