// ───────────────────────────────────────────────────────────────────
// MODULE: Context Type Canonicalizer Tests
// ───────────────────────────────────────────────────────────────────

// Script-style assertions for the context-type canonicalizer; throws on the
// first failing assertion.

import {
  DOCUMENT_CONTEXT_TYPE_ALIASES,
  IMPORTANCE_TIERS,
  IMPORTANCE_TIER_ALIASES,
  isLegacyContextType,
  LEGACY_CONTEXT_TYPE_ALIASES,
  resolveCanonicalContextType,
  SESSION_CONTEXT_TYPES,
} from '../context-types.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

assert(resolveCanonicalContextType('research') === 'research', 'a canonical value resolves to itself');
assert(resolveCanonicalContextType('decision') === 'planning', 'a legacy alias resolves to its canonical type');
assert(isLegacyContextType('decision') === true, 'a legacy alias is reported as legacy');
assert(resolveCanonicalContextType('nonsense') === null, 'an unknown value resolves to nothing, not a default');

// The session list classifies saves; its behavior-carrying values must stay.
for (const value of ['debugging', 'review', 'planning', 'decision', 'discovery']) {
  assert(SESSION_CONTEXT_TYPES.has(value), `the session list keeps ${value}`);
}
assert(SESSION_CONTEXT_TYPES.size === 11, 'the session list holds the 11 values the CLI accepted');

// Documents may carry a wider set of spellings, but migration still rewrites only the legacy pair.
assert(DOCUMENT_CONTEXT_TYPE_ALIASES.review === 'research', 'a template-emitted value is a legal document alias');
assert(Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).length === 2, 'the legacy alias pair is unchanged');
assert(resolveCanonicalContextType('review') === null, 'resolving stays limited to canonical values and the legacy pair');

assert(IMPORTANCE_TIERS.size === 6 && IMPORTANCE_TIERS.has('temporary'), 'the six importance tiers load');
assert(IMPORTANCE_TIER_ALIASES.high === 'important', 'an importance-tier alias maps to its canonical tier');

process.stdout.write('context types ok\n');
