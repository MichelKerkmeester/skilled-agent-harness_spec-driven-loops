---
title: "DLR-027 -- Fan-out merge: research dedup and attribution"
description: "Validate mergeResearchRegistries: deduplication by findingId, cross-lineage attribution array, total iteration count aggregation, and convergence score averaging."
version: 1.4.0.4
---

# DLR-027 -- Fan-out merge: research dedup and attribution

This document captures the validation contract, execution flow, and metadata for `DLR-027`.

---

## 1. OVERVIEW

Validates the research-specific merge path in `fanout-merge.cjs`.

### Why This Matters

Without correct deduplication, the same finding appears N times in the merged registry (once
per lineage), inflating key-finding counts and misleading the synthesis phase. The `_lineages`
attribution array is the only mechanism for cross-model provenance.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `mergeResearchRegistries` deduplicates by `id`, builds `_lineages` attribution, aggregates `iterationsCompleted`, and averages `convergenceScore`.
- Layer partition: research merge.
- Real user request: `Validate the research fan-out merge and confirm the 3 research unit tests pass, verifying deduplication, attribution, and metric aggregation.`
- Expected signals: Duplicate `findingId` → single entry with both lineages in `_lineages`; `metrics.iterationsCompleted` = sum across lineages; `metrics.convergenceScore` = average; null registry handled gracefully.
- Pass/fail: PASS only if all 3 research tests pass with EXIT 0 and source inspection confirms the `findingById` Map dedup logic; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-merge.cjs` present.

### Steps

1. Inspect `scripts/fanout-merge.cjs` `mergeResearchRegistries` — confirm `findingById` Map keyed by `finding.id || finding.title`, `_lineages` push on duplicate, metrics aggregation formula.
2. `bash: cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run ../../runtime//tests/unit/fanout-merge.vitest.ts`
3. Run with `--reporter=verbose` to see individual test names. Verify the 3 research tests: dedup-by-id, iteration-count-sum, null-registry-handled.

### Expected Outcome

Research tests pass. Single merged entry per `findingId` with `_lineages` containing both contributing lineages. `iterationsCompleted` is the sum; `convergenceScore` is the average.

### Failure Modes

- Dedup key missing: every lineage's findings appear separately, inflating registry.
- `_lineages` not populated: cross-model provenance is invisible in the merged output.
- Null registry not handled: script throws when a lineage sub-packet has no registry file.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-merge.cjs` | `mergeResearchRegistries`, `findingById` Map, metrics aggregation |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-merge.vitest.ts` | 3 research dedup/attribution tests (of 10 total) |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-027
- Feature catalog entry: `feature-catalog/fanout/fanout-merge.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-merge-research.md`
- Expected verdict mode: GREEN when research tests pass and source anchors agree
- Wall-time estimate: 5-10 min
