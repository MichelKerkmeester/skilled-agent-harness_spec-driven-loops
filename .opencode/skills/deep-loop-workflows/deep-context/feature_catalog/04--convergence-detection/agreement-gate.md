---
title: "Agreement Gate"
description: "Requires a minimum number of distinct executor confirmations before a finding is agreement-eligible, blocking convergence when agreementRate falls below 0.50."
trigger_phrases:
  - "agreement gate"
  - "agreementMin"
  - "agreement eligible"
  - "executor confirmation minimum"
  - "single executor finding"
  - "agreement threshold convergence"
---

# Agreement Gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Requires a minimum number of distinct executor confirmations before a finding is agreement-eligible, blocking convergence when `agreementRate` falls below 0.50.

The agreement gate is what differentiates `deep-context` from a single-model code search. A finding confirmed by two or more independent executors on the same shared focus has higher confidence than one found by a single executor, regardless of how many files that executor visited. The gate enforces this by blocking STOP when too many findings lack cross-executor confirmation.

---

## 2. HOW IT WORKS

### Agreement Threshold

`config.agreementMin` (default 2) is the minimum distinct-executor count for a finding to be classified as agreement-eligible. This value comes from the setup phase and is written into `config.fanout.executors` and the JSONL config record at initialization.

### Impact on Saturation Check

Only agreement-eligible findings contribute to `new_agreement_eligible_count` in the per-iteration JSONL record. The saturation check uses `new_agreement_eligible_count / max(1, merged_findings_count)` as the convergence ratio — meaning single-executor findings do not advance convergence, no matter how many there are.

### Agreement Rate Blocker

`evaluateContext` in `coverage-graph-signals.ts` computes `agreementRate = agreement-eligible / all-surviving-gated-findings`. When `agreementRate < 0.50`, `convergence.cjs` returns `STOP_BLOCKED` with `agreementRate` as a named blocker. The host's `step_emit_blocked_stop` records this and injects a recovery focus to improve agreement in the next sweep.

### Single-Seat Pool Warning

A pool with exactly one executor produces no agreement signal — all findings will have `agreement = 1` and the agreement gate will perpetually block unless the operator raises the `agreementMin` to 1. The command warns at setup when a single-seat pool is detected and continues, but the operator must acknowledge the degraded confidence model.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/context.md` | Command | Pool default policy note: "A 1-seat pool is legal but defeats the purpose (no agreement signal); warn and continue" |
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Script | `DEFAULT_AGREEMENT_MIN = 2` constant; agreement-eligible marking in the registry buckets |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `CONTEXT_AGREEMENT_MIN`; `evaluateContext` agreementRate blocking logic |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/04--convergence-detection/agreement-gate.md` | Manual playbook | Verifies agreement-eligible classification, agreementRate STOP_BLOCKED when below threshold, and single-seat pool warning |

---

## 4. SOURCE METADATA

- Group: Convergence Detection
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--convergence-detection/agreement-gate.md`

Related references:
- [relevance-gate.md](relevance-gate.md) — The parallel blocking guard for relevanceFloor
- [context-coverage-signals.md](context-coverage-signals.md) — Full five-signal schema including agreementRate
