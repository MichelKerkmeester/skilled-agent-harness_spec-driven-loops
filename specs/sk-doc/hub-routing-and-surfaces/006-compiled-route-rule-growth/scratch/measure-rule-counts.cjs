#!/usr/bin/env node
'use strict';

// Prints, for each hub compiler that enumerates mode subsets, the mode count,
// the composition rule count and the rules per bundle size. Run from the
// repository root. Reads only.

const path = require('path');

const ROLLOUT = path.resolve('.skilled/bin/lib/compiled-routing/009-parent-hub-rollout');

for (const hub of ['001-sk-code', '003-mcp-tooling', '009-sk-design']) {
  const loaded = require(path.join(ROLLOUT, hub, 'harness', 'build-artifacts.cjs')).loadSnapshot();
  const snapshot = loaded.snapshot || loaded;
  const bySize = {};
  for (const rule of snapshot.policy.compositionRules) {
    bySize[rule.targetIds.length] = (bySize[rule.targetIds.length] || 0) + 1;
  }
  const modes = snapshot.routingModel.tieBreak.length;
  console.log(`${hub} modes=${modes} rules=${snapshot.policy.compositionRules.length} bySize=${JSON.stringify(bySize)}`);
}
