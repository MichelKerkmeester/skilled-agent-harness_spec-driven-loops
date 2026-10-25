---
title: "Implementation Plan: Phase 5: persisted-hops-validation"
description: "Tighten the hop check in shouldRelaunch so only a non-negative integer number passes, with a failing-first table test."
trigger_phrases:
  - "persisted hops validation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: persisted-hops-validation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | JSON relaunch record on disk |
| **Testing** | `node --test`, vitest for the pi adapter |

### Overview
`shouldRelaunch` in `relaunch-core.cjs` coerces `record.hops` with `Number()`, which turns null into 0 and "3" into 3. The change replaces the coercion with a strict check: a number type, an integer and zero or more. Anything else returns the existing `hop-cap` decline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Producers confirmed to write hops as a number
- [ ] Baseline test run captured

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both test commands pass with no new failures against the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure decision function guarding the relaunch wrapper.

### Key Components
- **`shouldRelaunch`** (`relaunch-core.cjs:1044-1047`): the hop gate being tightened.
- **`preparePending`** (`relaunch-core.cjs:734-766`): producer, defaults `hops = 0` at :741 and writes the record field at :756. arm, unarm, markSignalled and markDeferred copy the whole record.
- **CLI prepare path** (`bin/session-relaunch.cjs:496-532`): producer, parses `SKILLED_LOOP_HOPS` and rejects non-integers before writing.

### Data Flow
The wrapper exports `SKILLED_LOOP_HOPS`, the CLI writes it into the record as a number, and on exit `shouldRelaunch` reads the record. Only the read side changes. The new check reads:

```js
const hops = record.hops;
const hopLimit = Number(maxHops);
if (typeof hops !== 'number' || !Number.isInteger(hops) || hops < 0
  || !Number.isFinite(hopLimit) || hops >= hopLimit) {
  return { relaunch: false, reason: 'hop-cap' };
}
```

Any comment added beside it states only the durable reason (a coerced count would let a malformed record skip the cap) and carries no spec or finding id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shouldRelaunch` in `relaunch-core.cjs` | Owns the hop gate | Update | New table test |
| `preparePending` and CLI prepare | Write `hops` | Unchanged, confirmed number | file:line in implementation summary |
| `killer.cjs:693-694` | Calls `Number(record?.hops)` before `Number.isInteger`, so null and "3" pass there | Unchanged, not a consumer of `shouldRelaunch` | Read. Outcome after this phase: for a null or "3" hops record the killer still ends the session, then the wrapper declines it with `hop-cap`, so the operator gets the manual relaunch command |
| `nudge.cjs:446` | Reads only `stale` from the record | Unchanged, unaffected | Read |
| `skilled-loop` wrapper | Reads the decline reason | Unchanged | Reason stays `hop-cap` |

Required inventories:
- Same-class producers: `rg -n 'hops' .skilled/hooks/session-relaunch --glob '*.cjs'`.
- Consumers of changed symbols: `rg -n 'shouldRelaunch' .skilled .opencode`.
- Matrix axes: hop value (-1, 1.5, null, "3", NaN, Infinity, 0, 9, 10) against limit 10.
- Algorithm invariant: only a non-negative integer number below the limit relaunches.
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
| Unit | `shouldRelaunch` malformed-hops table (with an `undefined` row, green before) and hops 0 and 9 | `node --test` |
| Existing tests | No existing test changes; a full-suite run with the strict rule preloaded passed 868/868 | `node --test` |
| Regression | Whole relaunch suite plus plugin and pi adapters | `node --test`, vitest |
| Manual | None; no live proof needed | - |

Run both commands before the change for a baseline and again after, then report the delta:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Producers write hops as a number | Internal | Green | A string producer would make every relaunch decline; stop and report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Valid relaunches start declining with `hop-cap`.
- **Procedure**: Revert the `shouldRelaunch` hunk; the test file change can stay or go with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (producer check, baseline) ──► Core (test red, code) ──► Verify (suites, docs)
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test output saved under `scratch/`
- [ ] Producer file:line recorded

### Rollback Procedure
1. Revert the `shouldRelaunch` change in `relaunch-core.cjs`.
2. Rerun both test commands.
3. Confirm the hops 9 and 10 tests behave as at baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
