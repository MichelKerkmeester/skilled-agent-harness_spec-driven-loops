'use strict';

// NEGATIVE FIXTURE (must FAIL the no-spec-import guard).
// Seeds the exact coupling the guard exists to catch: runtime code requiring a
// module from the mutable spec tree. Never wired into any runtime path.

const { resolveRoute } = require(
  '../../../../specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs',
);

module.exports = { resolveRoute };
