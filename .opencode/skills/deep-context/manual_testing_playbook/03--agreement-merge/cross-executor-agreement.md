---
title: "MERGE-002 -- Cross-Executor Agreement"
description: "This scenario validates Cross-Executor Agreement for `MERGE-002`. It focuses on the relevance gate that routes below-threshold findings to a lowConfidence bucket and drives the per-iteration saturation check from agreement-eligible counts."
---

# MERGE-002 -- Cross-Executor Agreement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MERGE-002`.

---

## 1. OVERVIEW

This scenario validates Cross-Executor Agreement for `MERGE-002`. It focuses on `DEFAULT_RELEVANCE_GATE = 0.55` in `reduce-state.cjs`, below-gate units routing to a `lowConfidence` bucket (kept, not discarded), marginal near-misses [0.40, 0.55) routing to the Gaps section, and agreement-eligible findings driving the per-iteration `new_agreement_eligible_count` that feeds the saturation check.

### Why This Matters

Without the relevance gate the loop would accept tangential findings as coverage signal — a small model that confidently over-collects peripherally related code would satisfy convergence prematurely. The `lowConfidence` bucket design ensures near-misses remain accessible for the Gaps section without inflating the coverage signals that guard the STOP decision.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MERGE-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `DEFAULT_RELEVANCE_GATE = 0.55` drops below-gate units to `lowConfidence`, near-misses route to Gaps, and only agreement-eligible findings drive saturation.
- Real user request: `Verify that the relevance gate correctly separates high-confidence findings from noise and near-misses in the deep-context registry.`
- Prompt: `As a manual-testing orchestrator, validate the cross-executor agreement and relevance-gate contract for deep-context against reduce-state.cjs, loop_protocol.md §6, and convergence.md §6. Verify DEFAULT_RELEVANCE_GATE = 0.55 is in reduce-state.cjs, below-gate units go to a lowConfidence bucket (not discarded), and new_agreement_eligible_count drives the per-iteration saturation check. Return a concise verdict.`
- Expected execution process: Read reduce-state.cjs for `DEFAULT_RELEVANCE_GATE`, `lowConfidence` bucket, and the relevance comparison; read loop_protocol.md §6 for marginal range documentation; read convergence.md §6 for saturation check description.
- Expected signals: `DEFAULT_RELEVANCE_GATE = 0.55` constant in reduce-state.cjs; `lowConfidence` array populated for below-gate units; `droppedBelowGate` field on low-confidence records; loop_protocol.md §6 documents marginal range [0.40, 0.55) and Gaps routing.
- Desired user-visible outcome: Relevance-gated findings are excluded from convergence decisions while near-misses remain accessible in the report's Gaps section, preventing premature saturation from noisy small-model output.
- Pass/fail: PASS if `DEFAULT_RELEVANCE_GATE = 0.55` constant exists, `lowConfidence` bucket is built in the registry, and loop_protocol.md documents the marginal routing; FAIL if any element is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep reduce-state.cjs and reference docs.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MERGE-002 | Cross-Executor Agreement | Verify relevance gate routes below-threshold findings to lowConfidence bucket | `Verify that the relevance gate correctly separates high-confidence findings from noise and near-misses in the deep-context registry.` | 1. `rg "DEFAULT_RELEVANCE_GATE" .opencode/skills/deep-context/scripts/reduce-state.cjs` -> 2. `rg "lowConfidence\|low_confidence\|droppedBelowGate" .opencode/skills/deep-context/scripts/reduce-state.cjs` -> 3. `rg "marginal\|0\.40\|0\.55\|Gaps" .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 4. `rg "new_agreement_eligible\|agreementEligible\|saturation" .opencode/skills/deep-context/scripts/reduce-state.cjs .opencode/skills/deep-context/references/convergence/convergence.md` | Step 1: constant = 0.55 found; Step 2: lowConfidence bucket and droppedBelowGate found; Step 3: marginal range documented; Step 4: saturation signal found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if lowConfidence bucket or relevance gate constant is absent | 1. Confirm DEFAULT_RELEVANCE_GATE spelling in reduce-state.cjs. 2. Check convergence.md for alternative saturation-check wording. 3. Search loop_protocol.md for "near-miss" or "[0.4" pattern. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/03--agreement-merge/cross-executor-agreement.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | `DEFAULT_RELEVANCE_GATE`, `lowConfidence` bucket assignment, `agreementEligible` flag |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | §6: relevance gate, marginal range, Gaps routing |
| `.opencode/skills/deep-context/references/convergence/convergence_signals.md` | §5: threshold reference table including `relevanceGate = 0.55` |

---

## 5. SOURCE METADATA

- Group: Agreement Merge
- Playbook ID: MERGE-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--agreement-merge/cross-executor-agreement.md`
