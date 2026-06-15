---
title: "DRV-015 -- Review iterations emit structured graphEvents"
description: "Verify that review iteration records carry a graphEvents array consumed by the coverage-graph reducer with loop_type=review nodes and edges."
---

# DRV-015 -- Review iterations emit structured graphEvents

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-015`.

---

## 1. OVERVIEW

This scenario validates structured graph event emission for `DRV-015`. The objective is to verify that a running deep review iteration writes a `graphEvents` array that the coverage-graph reducer ingests under `loop_type='review'`, with nodes and edges keyed by `session_id` and `iteration`.

### WHY THIS MATTERS

Graph-aware review convergence depends on replayable iteration-level graph data. If review iterations do not persist structured graph events, graph-assisted coverage analysis cannot confirm which dimensions touched which files or whether findings are connected to evidence.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Review iterations emit structured graphEvents.
- Given: A running deep review iteration.
- When: The iteration completes with P0/P1/P2 findings.
- Then: The JSONL record contains a `graphEvents` array. The coverage-graph reducer ingests those events as `loop_type='review'` nodes/edges scoped to the session and iteration.
- Real user request: When a review iteration finishes, what graph data is written so coverage and convergence can replay the review state?
- Prompt: `Validate deep-review graphEvents records and confirm the coverage-graph reducer ingests them under loop_type=review.`
- Expected execution process: Inspect the deep-review convergence reference for the graph-aware iteration-record contract first, then the coverage-graph database source for the active `loop_type` schema, then the live coverage-graph tests for ingestion coverage.
- Desired user-facing outcome: The user understands that completed review iterations emit replayable graph events and that the coverage-graph reducer keys them by `loop_type='review'`, session, and iteration.
- Expected signals: `graphEvents` referenced as iteration-record input for graph-aware review convergence. The active `coverage-graph-db.ts` source carries `LoopType = 'research' | 'review'` and persists nodes/edges scoped to `(spec_folder, loop_type, session_id, iteration)`. Live convergence tests exercise the review path.
- Pass/fail posture: PASS if the convergence reference, the active coverage-graph source, and the live convergence tests agree that review iterations carry `graphEvents` and the reducer keys ingestion by `loop_type='review'`. FAIL if the record contract is absent or the active source no longer supports the review loop type.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level source and test contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review graphEvents records and confirm the coverage-graph reducer ingests them under loop_type=review.
### Commands
1. `bash: rg -n 'graphEvents|review iteration records|graph-aware review convergence' .opencode/skills/deep-loop-workflows/review/references/convergence/convergence.md`
2. `bash: rg -n "LoopType|loop_type.*review|coverage_nodes|coverage_edges" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`
3. `bash: rg -n 'graphEvents|loop_type|review' .opencode/skills/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts`
### Expected
`graphEvents` used as iteration-record input in the convergence reference. `coverage-graph-db.ts` exports `LoopType` with `'review'` branch and persists nodes/edges keyed by `(spec_folder, loop_type, session_id)`. Live convergence tests exercise review-loop ingestion.
### Evidence
Capture the convergence reference lines that describe `graphEvents` in review iteration records, the `LoopType` definition and review-loop SQL keys from `coverage-graph-db.ts`, and one convergence-test example that exercises the review path.
### Pass/Fail
PASS if the convergence reference, the active coverage-graph source, and the live convergence tests agree that completed review iterations emit `graphEvents` and the reducer keys ingestion by `loop_type='review'`. FAIL if any of those pieces are missing or contradictory.
### Failure Triage
Privilege the convergence reference for the contract, the `coverage-graph-db.ts` source for the active schema, and the convergence tests for ingestion evidence.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/review/references/convergence/convergence.md` | Graph-aware review convergence contract, documents `graphEvents` as iteration-record input |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Active coverage-graph reducer source, defines `LoopType = 'research' \| 'review'` and persists nodes/edges keyed by `(spec_folder, loop_type, session_id, iteration)` |
| `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Live convergence tests with JSONL-shaped graph events exercising the review loop_type path |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/graph-events-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/review/` as of 2026-04-10.
