---
title: "Implementation Plan: Phase 4: v2-review-p2-fixes"
description: "Fixes the eight P2 advisories of the third OpenCode v1 removal review with small code, test, CI and evidence edits. Each fix has its own proof command, and a reconstructed gate runs before the first edit and again from the final tree."
trigger_phrases:
  - "v2 review p2 fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: v2-review-p2-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM and CJS), TypeScript tests, bash, GitHub Actions YAML |
| **Framework** | OpenCode 2.3.2 plugin host |
| **Storage** | None |
| **Testing** | `node --test`, vitest (hooks tree and deep-loop runtime) |

### Overview
The fixes touch the cli-opencode tests, the dispatch tests, the doctor battery, the plugin bridge and its 20 callers, one workflow, one parity test and two phase 001 evidence lines. The `dualPlugin` rename is mechanical, so the risk sits in the inventory test that finds bridged plugins by the builder's name. The gate runs once before any edit and once from the final tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The gate script reports no new failure on any leg against `scratch/gate-baseline.txt`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted fixes, no new module.

### Key Components
- **`.opencode/plugins/lib/v2-bridge.js`**: builds every plugin's `{ id, setup }` export; the rename lands here.
- **`.opencode/plugins/tests/plugin-inventory.test.cjs`**: the registration test that already asserts `skippedKeys` against the manifest; it gains a bridged-count assertion.

### Data Flow
A plugin file calls the builder with its id and hook factory. At setup the bridge registers the mapped hook keys and lists any other key in `cleanup.skippedKeys`, which the inventory test compares with the manifest's empty `skippedHooks` list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `opencode-version.mjs` trust list | Probes only `opencode`, a path ending `/opencode` and `$OPENCODE_BIN` | unchanged | `opencode-dual-dispatch.vitest.ts` keeps its "does not probe a numbered name" case |
| `opencode\d*` dispatch patterns (audit, rule checks, freshness guard, Vibe copy) | Recognize any numbered launcher as a dispatch | unchanged; tests renamed | freshness-guard and dispatch-audit suites pass |
| `v2-bridge.js` builder | Produces every plugin export | update (rename) | `git grep -c dualPlugin -- ':!specs'` prints nothing |
| `plugin-inventory.cjs` bridged classifier | Finds bridged plugins by the builder call | update | bridged count equals the plugin file count |
| `git-setup-check.cjs` export reader | Unwraps the builder call to judge a plugin | update | `git-setup-check.test.cjs` passes |
| `opencode-version-battery.cjs` `readV2` | Spawns the private server | update | battery test asserts `--hostname 127.0.0.1` |

Required inventories:
- Same-class producers: `git grep -n -e 'opencode2' -e 'opencode\\d' -- ':!specs'`.
- Consumers of changed symbols: `git grep -n dualPlugin -- ':!specs'` (33 files, 138 hits before the edit).
- Matrix axes: launcher name (`opencode`, a path to `opencode`, a numbered name) by surface (version probe, dispatch recognition).
- Algorithm invariant: the probe trusts fewer names than the dispatch guards recognize, so a numbered launcher is audited but never probed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the gate baseline and saves `opencode serve --help`. Implementation applies the eight fixes in the order of `tasks.md`. Verification reruns each fix's proof, the whole gate, the runtime-mirror check and the recursive strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Plugin bridge and inventory, battery, dispatch audit, models-form scan, parser parity | `node --test`, vitest |
| Integration | The battery workflow's unit step run locally in a stripped environment | `env -i` plus `node --test` |
| Manual | One real `--family=v2` battery leg on OpenCode 2.3.2 | `node opencode-version-battery.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.3.2 binary | External | Green | The live battery leg cannot run |
| `.skilled/node_modules` and the runtime `node_modules` | Internal | Green | The vitest legs cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a plugin fails to load on OpenCode 2, or the battery's v2 leg stops starting.
- **Procedure**: revert the phase's commits on the branch with `git revert`; nothing outside the repository changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The recorded baseline | Verification |
| Verification | Every implementation task | Closure |
<!-- /ANCHOR:phase-deps -->
