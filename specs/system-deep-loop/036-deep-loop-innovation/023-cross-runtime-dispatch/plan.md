---
title: "Implementation Plan: Retire the deep/* Dispatch-Context (Phase-0) Gate"
description: "Plan to retire the in-prompt Phase-0 self-classification gate across all deep/* commands, relying on the deterministic harness guard for the genuine dispatch-integrity case."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch"
    last_updated_at: "2026-08-27T07:25:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan; implementation complete"
    next_safe_action: "Run whole-suite gates; commit"
trigger_phrases: []
---
# Implementation Plan: Retire the deep/* Dispatch-Context (Phase-0) Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | Capable orchestrators (GPT-5.6-Luna) false-block a real `/deep:review` with "DIRECT INVOCATION REQUIRED" |
| **Root cause** | The Phase-0 gate asks the model to classify unobservable dispatch provenance; the classification is unanswerable in-prompt and byte-identical between genuine and pasted-inline on codex/pi |
| **Change kind** | Delete the gate everywhere; rely on the deterministic harness guard for the real case |
| **Verification** | Grep-clean of gate markers; render + drift green; both whole-suite gates no new failures |

### Overview
The gate is unfixable in-prompt, unnecessary (defends a case that occurs in zero code), and redundant with the harness guard. The fix removes it from all 8 deep/* commands, `prompt/improve`, the 4 legacy bodies, the 3 presentations, and reverts the dormant 022 render layer + test. It then cleans the gate's setup-contract residue (orphaned required-input variables and two workflow-YAML confirmation steps) and recompiles the 4 injection-command contracts so digests match.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed the harness guard is wired and deterministic (`system-deep-loop-guard.js` fires at `tool.execute.before`; `dispatch-guard.cjs:isCommandDrivenIteration` reads on-disk config)
- [x] Confirmed no auto-YAML or executable code consumes `general_agent_verified` / `dispatch_context_verified`

### Definition of Done
- [x] Gate markers grep-clean under `commands/deep/` + `commands/prompt/`
- [x] Dormant 022 render layer + test reverted
- [x] 4 contracts recompiled; `render-command-contract` + `check-contract-drift` green
- [ ] Both whole-suite gates show no new failures vs baseline

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic host-side enforcement over model self-classification. The gate's flaw is asking the model to introspect its dispatch context — an unanswerable, unobservable question. The harness guard already answers the real question (is this a command-driven iteration?) from on-disk filesystem state a forged prompt cannot produce. The gate is therefore pure liability: it can only false-block genuine invocations, never add protection the guard lacks.

### Key Components
- **The deep/* command bodies** — the injected surface; the gate is removed from each.
- **`system-deep-loop-guard.js` + `dispatch-guard.cjs`** — the retained deterministic protection, unchanged.
- **`render-command-contract.cjs`** — the dormant render layer; the 022 authorization is reverted.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] Enumerate every on-disk copy of the gate + every consumer of its output variables
- [x] Classify consumers executable vs doc-only; confirm 0 executable consumers

### Phase 2: Remove
- [x] Script the uniform Phase-0 block removal (13 files)
- [x] Hand-trim the ROUTER-CONTRACT prose + renumber FIRST-ACTION lists
- [x] Clean the setup-contract residue + the 2 workflow-YAML confirmation steps
- [x] Clean the 3 presentation gate-display references
- [x] Revert the dormant 022 render authorization + its test

### Phase 3: Reconcile + Verify
- [x] Recompile the 4 injection-command contracts
- [x] `render-command-contract` + `check-contract-drift` green
- [ ] Both whole-suite gates: no new code-caused failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep audit | Gate markers gone under commands/deep + commands/prompt | rg |
| Unit | Render prefix no longer emits the authorization; contracts fresh | vitest |
| Regression | Both whole-suite gates vs baseline | vitest + `run-node-tests.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `compile-command-contracts.cjs` | Internal | Green | Contract freshness after doc edits |
| Harness guard | Internal | Green | The retained real protection |
| Both whole-suite gates | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An unforeseen consumer of the removed variables surfaces, or a command fails to route.
- **Procedure**: `git revert` the commit. Every change is a doc/YAML deletion plus a render revert and a contract recompile; reverting restores the prior gate wholesale. No data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──> Phase 2 (Remove) ──> Phase 3 (Reconcile + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Remove |
| Remove | Inventory | Reconcile |
| Reconcile + Verify | Remove | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | ~45 min (repo-wide consumer audit) |
| Remove | Medium | ~1 hour (13-file script + ~30 prose edits) |
| Reconcile + Verify | Low | ~30 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed 0 executable consumers of the removed variables
- [x] Both-gate baselines recorded

### Rollback Procedure
1. `git revert` the commit.
2. Re-run `render-command-contract` + `check-contract-drift` to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — doc/YAML edits + one render revert + a contract recompile.

<!-- /ANCHOR:enhanced-rollback -->
