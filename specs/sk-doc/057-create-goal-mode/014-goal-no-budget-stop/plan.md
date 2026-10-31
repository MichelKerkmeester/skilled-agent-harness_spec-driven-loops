---
title: "Implementation Plan: Phase 14: goal-no-budget-stop"
description: "Remove the token budget, turn cap and wall-clock cap from the OpenCode goal plugin so it follows the shared core, which only counts turns. Keep the budget as a recorded reading, rewrite the tests that asserted the stops and update every doc that named the limits."
trigger_phrases:
  - "goal no budget stop plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: goal-no-budget-stop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS) and Markdown |
| **Framework** | The OpenCode goal plugin and the shared goal hooks core |
| **Storage** | The plugin's goal state records. The `maxAutoTurns` field is no longer stored |
| **Testing** | `node --test` on the OpenCode goal suites and `goal-core.test.cjs`, a negative control against the pre-change plugin, the sk-code drift-guard wrapper and `validate.sh --strict` |

### Overview
Delete the three stops and everything that served them from the OpenCode plugin, so it matches the shared core. Keep the token budget as a recorded reading and keep the `budget_limited` value so older records still load. Rewrite the tests that asserted the stops to assert that the goal keeps running, pin the same rule in the core with one test and update every doc that named the limits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable, each with a baseline
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] OpenCode goal suites and `goal-core.test.cjs` pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Subtraction to match one reference. The shared core treats a goal as running while its status is `active` and only counts turns. The OpenCode plugin is brought to the same rule by deleting its extra stops.

### Key Components
- **Continuation decision**: loses the cap and budget checks and their helper functions.
- **Turn reservation**: loses the cap check.
- **Token accounting**: both paths lose the budget status switch.
- **Resume**: loses the refusal while over budget. A `budget_limited` record from an older version still resumes.
- **Status output**: loses four lines, and the usage line reads `iteration N` with no ratio.

### Data Flow
Each turn adds its tokens and time to the goal record. The plugin continues the goal after the 1500 ms cooldown. No budget, turn count or elapsed time ends or silences it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/opencode-goal.js` | The only producer of the three stops | Remove them and their options, env variables, stored field and status lines | V1, V2 |
| `.skilled/hooks/goal/lib/goal-core.cjs` and the Pi, Cursor and Devin hooks | Count turns, never stop a goal | Unchanged, one test added | V3 |
| The Hermes plugin | Has no goal limit | Not a consumer | Inventory in the first task |
| The OpenCode goal suites | Asserted the old stops | Rewrite to assert the goal keeps running | V2, V4 |
| Plugin doc, command doc, feature catalog and playbook entries, `ENV-REFERENCE.md`, `.env.example` | Named the limits | Update | V5 |

Required inventories:
- Same-class producers: `rg -n "maxAutoTurns|maxWallMs|OPENCODE_GOAL_MAX_|budget_limited" .opencode .skilled -g '!**/changelog/**'`.
- Consumers of the changed symbols: the same pattern over `.opencode/plugins/tests`, `.skilled/hooks/goal`, the feature catalogs, the playbooks and the env docs.
- Matrix axes: stop kind (token budget, turn cap, wall clock) and runtime (OpenCode, shared core, Hermes). Only the OpenCode column held any stop, so three rows change.
- Invariant: a goal whose status is `active` stays active however large its token, turn or time totals grow.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The OpenCode goal plugin | `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs`, baseline 152 of 152 |
| Unit | The shared core | `node --test .skilled/hooks/goal/lib/goal-core.test.cjs`, with the new test |
| Negative control | The rewritten and new tests | The same tests run against the pre-change plugin, where 10 fail |
| Search | The retired names are gone from the plugin and the env docs | `rg` counts in `acceptance-criteria.md` |
| Gate | sk-code alignment | The sk-code drift-guard wrapper, `run-all-drift-guards.sh`, all four guards passed on the final state |
| Packet | This spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `goal-core.cjs` status values | Internal | Green | The plugin would have no reference rule |
| Goal records with `budget_limited` | Internal | Green | They would stop loading, so the value stays |
| sk-code drift-guard wrapper | Internal | Yellow | Closure waits for its result |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A goal suite fails after commit, an older record stops loading or an operator needs the turn or time cap back.
- **Procedure**: `git revert` the phase commit, then rerun the OpenCode goal suites and `goal-core.test.cjs`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, inventory) ──► Core (plugin, tests, docs) ──► Verify (suites, negative control, gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | A short read of each runtime's goal code |
| Core Implementation | Medium | One plugin file, six test files and eight doc or config files |
| Verification | Medium | Two suites, a negative control and two gates |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data change, so no backup is needed
- [x] No feature flag, because the stops are removed and not toggled
- [x] No monitoring is in scope

### Rollback Procedure
1. `git revert` the phase commit.
2. Rerun the OpenCode goal suites and `goal-core.test.cjs`.
3. Tell the operator the stops are back, with their defaults of 8 auto turns and 30 minutes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No goal record is rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

