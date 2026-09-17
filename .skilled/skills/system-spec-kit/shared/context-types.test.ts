// Script-style assertions for the context-type canonicalizer; throws on the
// first failing assertion.

import { isLegacyContextType, resolveCanonicalContextType } from './context-types.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

assert(resolveCanonicalContextType('research') === 'research', 'a canonical value resolves to itself');
assert(resolveCanonicalContextType('decision') === 'planning', 'a legacy alias resolves to its canonical type');
assert(isLegacyContextType('decision') === true, 'a legacy alias is reported as legacy');
assert(resolveCanonicalContextType('nonsense') === null, 'an unknown value resolves to nothing, not a default');

process.stdout.write('context types ok\n');
