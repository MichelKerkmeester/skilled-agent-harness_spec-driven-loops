---
title: "Corpus partitioning"
description: "The ITERATE-state resolver that answers what the next iteration should check by round-robin over lanes with remaining unaudited artifacts."
trigger_phrases:
  - "corpus partitioning"
  - "partition-corpus.cjs"
  - "lane round-robin"
  - "next slice batch size"
  - "iterate state partitioning"
version: 1.0.0.1
---

# Corpus partitioning

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `ITERATE`-state resolver that answers "what should the next iteration check?" by round-robin over lanes with remaining unaudited artifacts.

`partition-corpus.cjs` is a single-shot resolver: the planned `/deep:alignment` command workflow (phase-009, not yet built) will call it once per iteration and act on the answer, and it is runnable directly via its own CLI today. It never dispatches or loops itself, mirroring the other runtime scripts and honoring the FORBIDDEN INVOCATION PATTERNS ban on a self-looping dispatcher.

## 2. HOW IT WORKS

It reads the DISCOVER-state corpus (`deep-alignment-corpus.json`) and the reducer's per-lane `artifactsChecked` count, then walks the corpus lanes in declaration order — wrapping — and returns the next lane whose corpus still has unaudited artifacts, sliced to `batchSize` (default 5). A lane whose corpus is zero-length (a `NOT_APPLICABLE` lane) or already fully checked is skipped without ending the walk; `{ done: true }` is returned only when every lane's corpus is exhausted. The response carries the lane's identity (`laneId`, `authority`, `artifactClass`, `scope`), the artifact slice, and the count remaining after the slice, so the planned driving agent will know exactly which authority's `check()` to run against which artifacts next.

The round-robin order is stable across calls because it walks the corpus's declaration order rather than a rediscovered or alphabetical order — so the rotation is deterministic given the same corpus and checked counts.

**Difference from deep-review:** deep-review rotates over a fixed set of four named dimensions, always the same four. deep-alignment's lanes are N-many, resolved per-run, with variable artifact counts, so "next dimension" becomes "next lane with remaining unaudited artifacts, wrapping" — a variable-width rotation deep-review's fixed rotation never needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/partition-corpus.cjs` | Script | Reads the corpus + reducer counts and implements `resolveNextSlice()` round-robin with the `batchSize` default. |
| `runtime/scripts/reduce-alignment-state.cjs` | Runtime | Supplies the per-lane `artifactsChecked` count the partitioner compares against each lane's corpus total. |
| `references/state_machine_wiring.md` | Reference | Section 6 documents the lane round-robin and its distinction from deep-review's fixed rotation. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Exercises the round-robin across two lanes (slice 1 → lane 0, slice 2 → lane 1, slice 3 → done) and the zero-lane `done` case. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/corpus-partitioning.md`
- Primary sources: `scripts/partition-corpus.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, `references/state_machine_wiring.md`
Related references:
- [state-machine.md](../loop_lifecycle/state_machine.md) — State machine
- [convergence-check.md](../loop_lifecycle/convergence_check.md) — Convergence check
