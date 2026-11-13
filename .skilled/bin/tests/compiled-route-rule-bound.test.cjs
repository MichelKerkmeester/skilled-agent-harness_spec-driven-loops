'use strict';

// A hub compiler that enumerates mode subsets grows its rule list with every
// mode, and the list is rebuilt on each route call. These bounds fail before a
// hub's list grows large enough to slow a route call again.

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const ROLLOUT = path.resolve(__dirname, '..', 'lib', 'compiled-routing', '009-parent-hub-rollout');
const MAX_BUNDLE_MODES = 4;
const MAX_RULES_PER_HUB = 5000;

for (const hub of ['001-sk-code', '003-mcp-tooling', '009-sk-design']) {
  test(`${hub} keeps its composition rules inside the bounds`, () => {
    const loaded = require(path.join(ROLLOUT, hub, 'harness', 'build-artifacts.cjs')).loadSnapshot();
    const snapshot = loaded.snapshot || loaded;
    const rules = snapshot.policy.compositionRules;
    const tooWide = rules.filter((rule) => rule.targetIds.length > MAX_BUNDLE_MODES);
    assert.equal(tooWide.length, 0, `${tooWide.length} rule(s) hold more than ${MAX_BUNDLE_MODES} targets`);
    assert.ok(rules.length <= MAX_RULES_PER_HUB, `${rules.length} rules exceed ${MAX_RULES_PER_HUB}`);
  });
}
