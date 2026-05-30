'use strict';

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Shared Benchmark Profile/Fixture Path Resolution                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// F017-P2-09 (017 review): materialize-benchmark-fixtures.cjs and run-benchmark.cjs
// both hardcoded the SAME profiles-dir default literal and an identical
// fixturePathFor(). The F-P1-4b invariant ("a profile-by-id resolves identically
// in BOTH steps") relied on those two copies staying byte-aligned by hand. This
// module is the single source of truth so the alignment is structural, not a
// hand-maintained contract.
//
// Scope note: only the two provably-identical pieces are consolidated here. The
// per-script loadProfile/resolveInput helpers differ in body (run-benchmark's
// loadProfile returns {data, path}; the materializer resolves inline) and stay
// in their own files, so this module does NOT change any resolution behavior.

const path = require('node:path');

// The default benchmark-profiles directory both Lane B steps fall back to when
// --profiles-dir is not supplied. Kept identical to the prior in-file literals.
const DEFAULT_PROFILES_DIR =
  '.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles';

// Map a fixture reference (id or *.json filename) to its on-disk path under the
// fixture dir. Behavior-identical to the prior copies in both Lane B steps.
function fixturePathFor(fixtureRef, fixtureDir) {
  const fileName = fixtureRef.endsWith('.json') ? fixtureRef : `${fixtureRef}.json`;
  return path.join(fixtureDir, fileName);
}

module.exports = { DEFAULT_PROFILES_DIR, fixturePathFor };
