---
title: "Implementation Plan: Clone path and messages"
description: "Edit the README adapting block for the clone path and the tree's real removal and add steps, make the guard's stale line name its commands, and give the contract library a named failure when @spec-kit/shared is not built, each code change with a test that fails before it."
trigger_phrases:
  - "clone path and messages plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Clone path and messages

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and the root README |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs`; `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` (a plain assert script) |

### Overview
Three independent changes built by three concurrent DeepSeek dispatches: the README block (R1 and R4 together, because both edit it), the guard's stale branch (R2) and the contract library's shared-module load (R5). Each code change gets a test that fails against the origin/main source and one edge case. A fresh clone and a stale copy prove the user path end to end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail with a named cause and the next action

### Key Components
- **`inspect(hubId)`** in `compiled-route-guard.cjs`: returns `stale-manifest` when the runtime manifest no longer matches the hub's inputs; `main()` prints the summary lines
- **`authoredDrift(hubId)`**: derives the runtime manifest and its authored twin; the stale line reuses that derivation
- **`root-router-contract.cjs:65`**: the one require of `@spec-kit/shared` on the battery's load path; `ci-skill-root-metadata.cjs:54` and the doctor's 12-lib loader require the library
- **The README block** "What Adapting `sk-code` Looks Like": "Before you start", removal steps 6 and 7, add step 3

### Data Flow
A user runs the README battery. The doctor and `ci-skill-root-metadata.cjs` load the contract library, which loads `@spec-kit/shared` from the provisioned `node_modules`. The guard compares each hub's runtime manifest with what its inputs compile to and with its authored twin.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` adapting block | The external user's guide | Update | L-5, criterion 3 |
| `compiled-route-guard.cjs` | Freshness verdict for CI, hooks and the doctor | Update stale line | T1, T2, L-3, L-4 |
| `root-router-contract.cjs` | Contract library for the doctor and the CI gate | Named failure | T3, T4, L-1 |
| `ci-skill-root-metadata.cjs` | CI gate and README battery leg | Stack-free exit, only if needed | L-1 |
| `.github/workflows/routing-registry-drift.yml` | Runs the guard in CI | Unchanged; the live verdict stays exit 0 | Criterion 2 |

Required inventories:
- Consumers of the guard's stale output: `rg -n "Re-mint|stale-manifest" .skilled .github` before changing the line; the `Re-mint:` prefix stays so no consumer breaks.
- Loaders of the contract library: the doctor, `ci-skill-root-metadata.cjs`, `leaf-route-replay.cjs` and the test.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Clone recipe: `git clone -q <worktree> <scratch>/clone` gives the committed tree with no `node_modules`. Stale-copy recipe: copy the worktree to the session scratchpad without `node_modules`, link each `node_modules` to the worktree's, then hand-edit `.skilled/skills/sk-code/hub-router.json` so its inputs no longer match the minted manifest.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | T1 to T4 | `node --test`, plain assert script |
| Fail-before | T1 and T3 against the origin/main source | `git show origin/main:<path>` swapped in, test run, file restored |
| Integration | The README battery and the drift guards | The six README commands |
| Copy runs | L-1 to L-4 | A fresh clone and a stale copy |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin DeepSeek V4.1 Flash max | External | Available | Fallback cli-pi `llmgateway/deepseek-v4.1-flash` |
| Phase 002 | Internal | Downstream | Prints this phase's repair texts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard, the doctor or `ci-skill-root-metadata.cjs` turns red on the pristine tree or in CI.
- **Procedure**: Revert this phase's commits; the old messages return.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

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
| Setup | Low | Worktree and baselines |
| Core Implementation | Low | Three concurrent dispatches |
| Verification | Med | Clone and copy runs and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines of the battery and both test files recorded

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the README battery on the live tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
