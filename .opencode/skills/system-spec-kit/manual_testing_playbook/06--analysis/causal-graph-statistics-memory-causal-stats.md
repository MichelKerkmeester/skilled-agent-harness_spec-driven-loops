---
title: "EX-020 -- Causal graph statistics (memory_causal_stats)"
description: "This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review."
audited_post_018: true
---

# EX-020 -- Causal graph statistics (memory_causal_stats)

## 1. OVERVIEW

This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `deltaByRelation` per-relation deltas, `balanceStatus` enum (`balanced` | `relation_skewed` | `insufficient_data`), `dominantRelation`, and baseline coverage/edge metrics. `insufficient_data` is returned when the per-window relation-delta total is below the insufficiency threshold (`RELATION_INSUFFICIENT_TOTAL = 5`); on a freshly indexed corpus with few recent edges this is the expected, correct status.
- Real user request: `` Please validate Causal graph statistics (memory_causal_stats) against memory_causal_stats() and tell me whether the expected signals are present: `deltaByRelation` keys cover the causal relation types present in the test corpus; `balanceStatus` value matches corpus shape; `dominantRelation` reflects the skewing relation when `balanceStatus === "relation_skewed"`; baseline coverage/edge metrics still present. ``
- Prompt: `Validate memory_causal_stats per-window metrics across balanced, skewed, and low-delta corpora; return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `deltaByRelation` keys cover the causal relation types present in the corpus; `balanceStatus` value matches corpus shape (`balanced` | `relation_skewed` | `insufficient_data`); `dominantRelation` set when skewed; baseline coverage/edge metrics still present
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `deltaByRelation`, `balanceStatus`, and `dominantRelation` are present and align with the corpus shape across balanced, skewed, and low-delta (insufficient_data) scenarios

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_causal_stats per-window metrics across balanced, skewed, and low-delta corpora; return pass/fail with cited evidence.
```

### Commands

1. memory_causal_stats()

### Expected

Coverage and edge metrics present

### Evidence

Stats output

### Pass / Fail

- **Pass**: metrics returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Rebuild causal edges if empty

---

### Prompt

```
Validate memory_causal_stats per-window metrics across balanced, skewed, and low-delta corpora; return pass/fail with cited evidence.
```

### Commands

1. `memory_causal_stats()` against a balanced corpus (per-window relation-delta total ≥ 5, no single relation dominating) → assert `balanceStatus === "balanced"`, `deltaByRelation` populated
2. `memory_causal_stats()` against a skewed corpus (one relation dominates the window deltas) → assert `balanceStatus === "relation_skewed"` and `dominantRelation` names the dominant relation
3. `memory_causal_stats()` against a low-delta corpus (per-window relation-delta total < 5) → assert `balanceStatus === "insufficient_data"` (correct, expected status on sparse/freshly-indexed graphs — not a failure)

### Expected

`deltaByRelation` keyed by the relation types present with non-negative integer deltas; `balanceStatus` matches the corpus shape (`balanced` | `relation_skewed` | `insufficient_data`); `dominantRelation` set when `relation_skewed`.

### Evidence

memory_causal_stats responses for the three corpora highlighting deltaByRelation, balanceStatus, and dominantRelation fields

### Pass / Fail

- **Pass**: `deltaByRelation`, `balanceStatus`, and `dominantRelation` present and consistent with the corpus across the three scenarios
- **Fail**: any field missing, or `balanceStatus` drifts from the documented enum (`balanced` | `relation_skewed` | `insufficient_data`)

### Failure Triage

Inspect `mcp_server/handlers/causal-graph.ts` balanceStatus computation (`RELATION_INSUFFICIENT_TOTAL` threshold). `insufficient_data` on a sparse corpus is expected; rebuild causal edges only if baseline coverage/edge metrics are also empty.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/047-causal-graph-statistics-memorycausalstats.md](../../feature_catalog/06--analysis/047-causal-graph-statistics-memorycausalstats.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/causal-graph-statistics-memory-causal-stats.md`
