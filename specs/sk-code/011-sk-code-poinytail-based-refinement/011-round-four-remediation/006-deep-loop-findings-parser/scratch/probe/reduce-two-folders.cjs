'use strict';
// Reduces the two real review folders in memory and prints their open and resolved counts.
const path = require('node:path');
const { reduceReviewState } = require(path.resolve('.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs'));
const dirs = [
  'specs/sk-prompt/z_archive/002-sk-improve-prompt-rename/review',
  'specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/010-sk-deep-research-review-improvement-2/review',
];
for (const dir of dirs) {
  const r = reduceReviewState(path.dirname(dir), { write: false, lenient: true, artifactDir: dir });
  console.log(`${dir} open=${r.registry.openFindingsCount} resolved=${r.registry.resolvedFindingsCount}`);
}
