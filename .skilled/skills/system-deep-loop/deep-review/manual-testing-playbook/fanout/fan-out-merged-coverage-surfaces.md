---
title: "DRV-071 -- Fan-out merged review keeps its coverage surfaces"
description: "This scenario validates that a merged two-lineage review fan-out keeps its coverage surfaces for `DRV-071`. It focuses on the six surfaces the merge now carries from the lineages instead of dropping them."
version: 1.0.1.0
---

# DRV-071 -- Fan-out merged review keeps its coverage surfaces

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-071`.

---

## 1. OVERVIEW

This scenario validates the merged coverage surfaces for `DRV-071`. It focuses on a two-lineage review fan-out whose merged registry must carry the coverage that each lineage recorded: `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergenceByLineage` and `ruledOutCandidates`.

### Why This Matters

Before the merge carried these surfaces, the merged review registry dropped the coverage its lineages had recorded. A review that fanned out to two lineages could then show less coverage than either lineage had done, and the convergence guards read the merged registry. Keeping the surfaces is what lets a fan-out review stop on real coverage.

---

## 2. SCENARIO CONTRACT

Operators run this as a real check against a two-lineage fan-out artifact, so the merged output is read from the same lineage folders a live fan-out produces.

- Objective: Confirm that `fanout-merge.cjs` returns the six coverage surfaces in the merged review registry, built from both lineages, in deterministic order.
- Real user request: A two-lineage review fan-out finished. Show me the merged coverage, and make sure neither lineage's coverage was dropped in the merge.
- Prompt: `Merge the two-lineage deep-review fan-out artifact and confirm the merged registry keeps dimensionCoverage, traceability, searchCoverage, candidateCoverage, divergenceByLineage and ruledOutCandidates from both lineages.`
- Expected execution process: Read the lineage folders under the fixture artifact directory, run the merge script with `--loop-type review`, and read the six surfaces from its JSON output with `jq`.
- Expected signals: The merge exits 0. `dimensionCoverage` is the union of both lineages with sorted keys. `traceability` keeps the strictest status per protocol, so `fail` beats `blocked`, `blocked` beats `partial`, `partial` beats `pass`, and `pass` beats `notApplicable`. `searchCoverage` and `candidateCoverage` are sorted unions, and each candidate bucket lists its lineages. `divergenceByLineage` holds each lineage's pivot state under its label, with no merged `divergence` key. Each `ruledOutCandidates` entry carries a `lineage` field.
- Desired user-visible outcome: The user is told that the merged review shows coverage from both lineages, with each lineage's divergence kept separate.
- Pass/fail: PASS if all six surfaces are present and built from both lineages, and no merged `divergence` key appears; FAIL if a surface is missing or empty while a lineage recorded it, or the merged output contains a merged `divergence` key.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Merge the two-lineage deep-review fan-out artifact and confirm the merged registry keeps dimensionCoverage, traceability, searchCoverage, candidateCoverage, divergenceByLineage and ruledOutCandidates from both lineages.`

### Commands

1. `rg -n 'mergeReviewCoverageSurfaces|dimensionCoverage|divergenceByLineage' .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run fanout-merge.vitest fanout-review-focus.vitest`
3. `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir <fixture-artifact-dir> | jq '{dimensionCoverage, traceability, searchCoverage, candidateCoverage, divergenceByLineage, ruledOutCandidates}'`
4. `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir <fixture-artifact-dir> | jq 'has("divergence")'`

`<fixture-artifact-dir>` holds a `lineages/{label}/` sub-packet for each of the two lineages.

### Expected

Command 1 prints the helper that spreads the six surfaces into the merged registry and the two surface keys. Command 2 exits 0 with no failed test. Command 3 exits 0 and prints the six surfaces, each built from both lineages. Command 4 prints `false`.

### Evidence

Capture the command 1 match, the command 2 summary, the command 3 JSON for the six surfaces, and the command 4 output.

### Pass / Fail

- **Pass**: The merge exits 0, all six surfaces are present and built from both lineages, `divergenceByLineage` is keyed by lineage label, and the merged output has no `divergence` key.
- **Fail**: The merge exits non-zero, a surface is missing or empty while a lineage recorded it, the strictest-status rule is broken, or the merged output carries a `divergence` key.

### Failure Triage

If a surface is missing, check that `mergeReviewCoverageSurfaces` is wired into the merged registry in `fanout-merge.cjs`. If the traceability status is wrong, compare the two lineages' per-protocol status first, since the strictest status must win regardless of the order the lineages arrive. If the exit is 3, the artifact directory is missing a lineage sub-packet.

### Optional Supplemental Checks

- Order: merge the same two lineages with their labels swapped in the directory listing and confirm the output is identical, since every merge walks lineages in label order.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | No dedicated fan-out catalog entry exists for `deep-review` yet; the implementation anchors below are the contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Six merge helpers and `mergeReviewCoverageSurfaces`, spread into the merged review registry |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Per-surface cases, order-swap case and missing-field cases |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | End-to-end case through the `fanout-merge.cjs` script |

---

## 5. SOURCE METADATA

- Group: FAN-OUT
- Playbook ID: DRV-071
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/fan-out-merged-coverage-surfaces.md`
