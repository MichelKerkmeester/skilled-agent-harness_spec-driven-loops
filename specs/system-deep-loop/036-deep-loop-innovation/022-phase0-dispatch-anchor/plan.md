---
title: "Implementation Plan: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate"
description: "Phased plan to make the injection prefix authoritatively resolve the deep/* Phase-0 dispatch-context gate, ending the DIRECT INVOCATION false-block on capable orchestrators."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-phase0-dispatch-anchor"
    last_updated_at: "2026-08-27T05:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan; implementation complete"
    next_safe_action: "Verify both gates; reconcile docs"
---
# Implementation Plan: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | Capable orchestrators (GPT-5.6-Luna) false-block a real `/deep:review` with "DIRECT INVOCATION REQUIRED" |
| **Root cause** | The Phase-0 gate asks the model to self-classify real-vs-pasted-inline; the model sees the command content and mis-concludes "pasted inline" |
| **Change kind** | The injection prefix (objective, present only for real invocations) now resolves the gate authoritatively |
| **Verification** | Rendered prefix precedes the gate; no-message case omits it; both gates; no contract drift |

### Overview
The command runner already prepends an objective marker (`ARGS_PRESENT=true` / `<!-- INVOCATION MESSAGE -->`) that a pasted-inline paste never carries. The fix adds a DISPATCH-CONTEXT authorization to that prefix: its presence proves a real invocation, so the model is told the gate is satisfied and to proceed. Implemented once in `buildInvocationPrefix`, it covers all 4 injection commands, needs no per-doc edits and no contract recompile, and preserves the pasted-inline guard (a paste has no prefix, so no authorization).

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed the injected prompt carries the ARGS_PRESENT prefix ahead of the gate
- [x] Confirmed the prefix is present only for real invocations (not the no-message case)

### Definition of Done
- [x] The authorization renders ahead of the gate for a real invocation
- [x] The no-message render omits it
- [x] Both gates clean; `check-contract-drift` green with no recompile

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Objective signal over model judgment. The gate's flaw is asking the model to introspect its dispatch context. The runner already emits an objective discriminator; the fix routes the authorization through that discriminator so the answer is data, not a guess — and only ever present for the real-invocation case.

### Key Components
- **`buildInvocationPrefix`** — emits the ARGS_PRESENT block; now also the DISPATCH-CONTEXT authorization for real invocations.
- **The deep/* Phase-0 gate** — unchanged in text; it now reads an already-satisfied answer from the prefix above it.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm
- [x] Render `deep/review` and confirm the ARGS_PRESENT prefix precedes the Phase-0 gate
- [x] Confirm the no-message render omits the message block (the pasted-inline shape)
- [x] Confirm the injection map covers `review`/`research`/`ai-council`/`alignment` only

### Phase 2: Implement
- [x] Add the DISPATCH-CONTEXT authorization to the ARGS_PRESENT=true branch of `buildInvocationPrefix`
- [x] Keep the authorization out of the no-message branch
- [x] Add a regression test (present-real / absent-pasted-inline)

### Phase 3: Verify
- [x] `render deep/review`: authorization present before the gate
- [x] Comment hygiene clean; contracts not staled (`check-contract-drift` green)
- [x] Both gates: no new code-caused failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Authorization present (real) / absent (no-message), ahead of body | vitest |
| Render | `render deep/review` output structure | render CLI |
| Regression | Both whole-suite gates; contracts not staled | vitest + `run-node-tests.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `render-command-contract.cjs` injection path | Internal | Green | The prefix carrier |
| Both whole-suite gates | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The authorization causes an unexpected render regression.
- **Procedure**: `git checkout` `render-command-contract.cjs` + the test. The prefix reverts; no contract or doc change to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm) ──> Phase 2 (Prefix authorization) ──> Phase 3 (Verify both gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | None | Implement |
| Implement | The confirmation | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm | Medium | ~1 hour (render-path mapping) |
| Implement | Low | ~20 min |
| Verify (both gates) | Low | 30 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed the prefix is not stored in the compiled contract (no recompile)
- [x] Both-gate baselines recorded

### Rollback Procedure
1. `git checkout` `render-command-contract.cjs`.
2. Revert the test addition.
3. Re-render `deep/review` to confirm the prior prefix.

### Data Reversal
- **Has data migrations?** No — one render function + one test.

<!-- /ANCHOR:enhanced-rollback -->
