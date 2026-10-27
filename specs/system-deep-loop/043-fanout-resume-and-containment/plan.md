---
title: "Implementation Plan: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit"
description: "Give each dispatch of a lineage its own logical effect id so a resume reaches the executor, and hold a baseline-dirty path that changed again out of quarantine, patch and revert under the default containment remedy."
trigger_phrases:
  - "fanout resume and containment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (tsx-loaded) and CommonJS in the deep-loop runtime |
| **Framework** | None; vitest for tests |
| **Storage** | The per-lineage effect ledger (append-only frames) and `git status` |
| **Testing** | vitest, `npm test` in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Resume: `dispatchExecutorEffect` keyed every dispatch of a lineage on `fanout-dispatch:<label>:attempt-<n>` under the lineage's stored session id, and `n` restarts at 1 with each supervisor run, so a resumed dispatch collided with the first one. The fix counts the dispatches already recorded and suffixes the logical effect id. Containment: `detectNewOutOfScopeViolations` already knows a path was dirty at the baseline; the fix carries that fact to `enforceWriteContainment`, which reports such a path as contested instead of quarantining it as the lane's.
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
- [x] `npm test` in the runtime prints the same failures as the baseline run, none new, and the new tests pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-module fix per bug.

### Key Components
- **`fanout-effect-dispatch.ts`**: routes the executor spawn through the effect gateway; owns the logical effect id.
- **`write-containment.ts`**: detects, quarantines and reverts out-of-lineage writes; owns the attribution classes.
- **`fanout-run.cjs`**: the supervisor; writes the ledger events and the lineage output.

### Data Flow
Resume: supervisor start, stored session id read, `dispatchExecutorEffect` reads the effect ledger, counts earlier intents for the lineage and attempt, picks the logical effect id, gateway executes. Containment: baseline snapshot before dispatch, `enforceWriteContainment` after it, contested paths split off before capture, quarantine and revert, then reported by the supervisor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/deep-loop/fanout-effect-dispatch.ts` | Owns the logical effect id for each executor spawn | update | `tests/unit/fanout-effect-dispatch.vitest.ts` |
| `lib/receipts-and-effect-recovery/effect-gateway.ts` | Replays a logical effect that already has a confirmation, and refuses one with an unresolved intent | unchanged | `rg -n "EFFECT_INTENT_UNRESOLVED" lib` prints the one refusal the fix routes around |
| `scripts/fanout-run.cjs` | Only caller of `dispatchExecutorEffect` | update (containment wiring only) | `rg -n "dispatchExecutorEffect" scripts lib` prints one call site |
| `lib/deep-loop/write-containment.ts` | Attribution classes and the quarantine and revert remedies | update | `tests/unit/write-containment.vitest.ts` |
| `tests/stress/cli-adapter/fanout.vitest.ts`, `tests/fanout-loop-prompt-in-process.test.ts` | Read the containment module | not a consumer of `contested` | included in the full suite run |

Same-class producers: `rg -n "logicalEffectId" lib scripts` prints the one fan-out producer; the other hits are the gateway and its tests. Consumers of the changed result: `rg -n "enforceWriteContainment" lib scripts tests` prints `fanout-run.cjs` and the unit tests.
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
| Unit | `dispatchExecutorEffect` over a real effect ledger; `enforceWriteContainment` over a real temp git repo | vitest |
| Integration | `fanout-run.cjs` with stub executors: three resumes of one lineage, and an operator edit made while a stub lane runs | vitest, stub shell executors |
| Manual | None | N/A |

Each new test was run against the unfixed source first and failed for the stated reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest 4.1.12 in the runtime `node_modules` | Internal | Green | No tests can run |
| `git` on PATH | External | Green | Containment tests fail open and prove nothing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a resumed lineage dispatches twice for one resume, or the guard reports a path as contested that the lane alone changed.
- **Procedure**: revert the change to the three runtime files and the three test files. Effect ledgers written with a `:redispatch-N` id stay readable, because the gateway treats them as ordinary logical effects.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (reproduce both bugs, baseline suite) | none | Implementation |
| Implementation (tests first, then fixes) | Setup | Verification |
| Verification (suite, drift check, strict validation) | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
