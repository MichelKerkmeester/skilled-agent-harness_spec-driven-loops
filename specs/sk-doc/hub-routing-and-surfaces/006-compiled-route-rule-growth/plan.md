---
title: "Implementation Plan: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes"
description: "Add one constant and one condition to each of three authored registry compilers, rebuild the served copies, refresh the stale activation manifests and add a bound test. The rule counts printed by a measurement script prove the cap."
trigger_phrases:
  - "compiled route rule growth plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | None. The activation manifests are JSON files |
| **Testing** | `node --test` |

### Overview
Three authored registry compilers gain a `MAX_BUNDLE_MODES` constant of 4, and both rule builders in each skip a subset larger than it. The served copies are rebuilt from the authored files, and the activation manifest of each hub whose policy hash changed is refreshed. A measurement script prints 25, 154 and 4 rules, and a new test bounds the targets per rule and the rules per hub.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `node --test .skilled/bin/tests/` reports `fail 0` before any edit
- [x] `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` before any edit
- [x] The manifest question in `spec.md` section 7 has an answer

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/bin/tests/` reports `fail 0` and 176 tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded subset enumeration

### Key Components
- **Three registry compilers**: `buildCompositionRules` and `buildBundleRules` in the sk-code, mcp-tooling and sk-design compilers. They produce the rule lists, so the cap goes there and nowhere else.
- **Bound test**: `.skilled/bin/tests/compiled-route-rule-bound.test.cjs`. Without it nothing fails when a hub's rule count grows again.

### Data Flow
A route call runs `compiled-route.cjs`, which loads the hub snapshot through the hub's `harness/build-artifacts.cjs`. That calls `compileRegistry`, which builds both rule lists from the hub's tie-break order. The router then looks the selected modes up in `routingModel.bundleRules`, and `assertComposition` in `005-decision-evaluator/lib/decision-contract.cjs` checks the bundle against `policy.compositionRules`. A bundle with no rule throws there, and the front door prints the legacy sentinel.

### The edits

In each of the three compilers, insert this block directly above the comment that starts `// Every non-empty two-or-more subset`:

```js
// The rule count doubles with every mode, and the whole list is built, hashed
// and validated on each route call, so a bundle is capped at this many modes.
// A tie across more modes finds no rule, the policy check rejects the bundle
// and the front door answers with the legacy sentinel.
const MAX_BUNDLE_MODES = 4;

```

In that same comment, replace `Every non-empty two-or-more subset of the tie-break order` with `Every subset of two to MAX_BUNDLE_MODES modes of the tie-break order`.

In each compiler, replace both occurrences of

```js
    if (bits.length < 2) continue;
```

with

```js
    if (bits.length < 2 || bits.length > MAX_BUNDLE_MODES) continue;
```

In each of the three routers, the comment above `exactBundle` says a near-tied score set always finds an exact match. Replace that sentence with: `The compiler generates one rule for every subset of two to four modes of the tie-break order, so a tie across more modes finds no match here.`

The new test file:

```js
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
```
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the test, sync and rule-count baselines and answers the manifest question. Implementation adds the test, caps the three compilers and corrects the three router comments. Verification rebuilds the served copies, refreshes the stale manifests and reruns the measurement and the tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/bin/tests/compiled-route-rule-bound.test.cjs` is run once before the compiler edits and must fail there for sk-code and mcp-tooling, so it is known to detect the fault. After the rebuild `node --test .skilled/bin/tests/` reports `fail 0` and 176 tests, against a baseline of 173 tests, 172 passed and 1 skipped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node and its built-in test runner. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a test in `.skilled/bin/tests/` that passed in the baseline fails after the rebuild, or a hub stops answering with `"action":"route"` for a prompt it routed before. Before the rebuild is finalized, restore the served tree from the rollback path the rebuild printed. After the commit, revert the one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-code, mcp-tooling and sk-design `registry-compiler.cjs` | Produce `compositionRules` and `bundleRules` by enumerating every subset | Update | The measurement script prints 25, 154 and 4 |
| system-deep-loop, cli-external-orchestration, sk-doc and cli-classifier `registry-compiler.cjs` | Produce rule lists without a subset loop | Unchanged | `rg -c '1 << ' <file>` prints nothing for each |
| `exactBundle` in the three routers | Reads `routingModel.bundleRules` | Comment only | `rg -c 'always finds an exact match' <file>` prints nothing |
| `assertComposition` in `005-decision-evaluator/lib/decision-contract.cjs` | Rejects a bundle with no rule | Unchanged. It is the check that turns a wide tie into the legacy sentinel | The compiled route tests pass |
| `computeBasePolicyHash` and the activation manifests | Pin a hash of the compiled policy | Refresh sk-code and mcp-tooling. sk-design keeps its four rules and its hash | `compiled-route-manifest.cjs freshness` prints `"fresh":true` |
| `.skilled/bin/lib/compiled-routing` served copies | Byte copies of the authored files | Rebuilt by the sync step | `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` |
| Barter's vendored tree | Carries the same cap as an overlay on the sk-code compiler | Not a Skilled surface. Barter drops the overlay on its next re-pin | Not checked here |

Matrix axis: hub mode count. Rows are 3 modes with 4 rules, 5 modes with 25, 8 modes with 154 and 18 modes with 4,029. The first three are checked by the measurement script. The 18-mode row was measured in Barter's tree and is not reproduced by a Skilled test.

Invariant: no compiled rule holds more than `MAX_BUNDLE_MODES` targets, and a selected mode set of two to four modes always has exactly one rule in tie-break order.
<!-- /ANCHOR:affected-surfaces -->

---
