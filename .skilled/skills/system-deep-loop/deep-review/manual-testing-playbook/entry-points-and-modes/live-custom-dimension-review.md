---
title: "DRV-085 -- Live review of one custom dimension"
description: "This scenario validates a low-token live review with one custom dimension for `DRV-085`. It focuses on the setup answer `correctness, performance`, three deterministic iterations and the coverage evidence that performance was reviewed."
version: 1.0.0.0
---

# DRV-085 -- Live review of one custom dimension

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-085`.

---

## 1. OVERVIEW

This scenario validates a small live review that reviews one custom dimension after correctness for `DRV-085`. It focuses on the same 121-line runtime helper used by `DRV-084`, a two-name dimension answer and two iterations with convergence off.

### Why This Matters

A custom dimension is only real to an operator when a live run names it, reviews it and records its coverage. A scenario that only reads the setup rule cannot show that the run's second iteration actually reviewed performance. Two iterations keep the check cheap while still covering the canonical first name and the custom second name.

---

## 2. SCENARIO CONTRACT

Operators run this as a real orchestrator-led review against a fixture spec folder and answer the dimensions question with `correctness, performance`. The scenario is complete when the operator can point at the iteration and dashboard evidence for performance.

- Objective: Verify that a live review configured with `review_dimensions: correctness, performance` records both names, reviews correctness first and performance second, and shows performance as covered after two iterations.
- Real user request: Review this one small state-append helper for correctness and performance, and show me that performance was actually covered.
- Prompt: `Run a three-iteration deep review of .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs for the dimensions correctness and performance with --max-iterations=3 --convergence-mode=off and the DeepSeek flash executor, then confirm that performance is in the config, in the second iteration and in the coverage report.`
- Expected execution process: Answer the setup dimensions question with `correctness, performance`, keep the default depth mode, let three iterations run, then read the config, the second iteration file, the state log and the dashboard coverage table. The run needs three iterations, not two: the last iteration under the cap goes to `traceability` while a core traceability protocol is unfinished, so a two-iteration run never reaches performance.
- Expected signals: The config lists `reviewDimensions` as `correctness` then `performance`; `review/iterations/` holds exactly three files; the second iteration's focus and dimensions name performance; the dashboard's `## 5. DIMENSION COVERAGE` table marks performance `covered`; no `review/frontier-nodes.jsonl` exists because the depth mode stayed default.
- Desired user-visible outcome: The operator is told correctness ran first, performance ran second, performance is covered, and the run took three iterations with no frontier.
- Pass/fail: PASS if the config names both dimensions, the second iteration and the dashboard prove performance, the iteration count is three and no frontier store exists; FAIL if performance is missing from any of them or a fourth iteration runs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a three-iteration deep review of .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs for the dimensions correctness and performance with --max-iterations=3 --convergence-mode=off and the DeepSeek flash executor, then confirm that performance is in the config, in the second iteration and in the coverage report.`

### Commands

1. `wc -l .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs`
2. `/deep:review ".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs" :confirm --spec-folder=<fixture> --max-iterations=3 --convergence-mode=off --executor=cli-opencode --model='opencode-go/deepseek-v4.1-flash#max'`, then answer the review dimensions question with `correctness, performance` and keep the depth mode at `default`.
3. `jq '{reviewDimensions, reviewTargetType, maxIterations, depthMode: .antiConvergence.depthMode, convergenceMode: .antiConvergence.convergenceMode}' <fixture>/review/deep-review-config.json`
4. `find <fixture>/review/iterations -name 'iteration-*.md' | wc -l`
5. `rg -n 'performance|correctness' <fixture>/review/iterations/iteration-002.md`
6. `jq -c 'select(.type == "iteration") | {iteration, focus, dimensions}' <fixture>/review/deep-review-state.jsonl`
7. `rg -n '^\| performance \|' <fixture>/review/deep-review-dashboard.md`
8. `test ! -e <fixture>/review/frontier-nodes.jsonl && echo 'no frontier store'`

The executor note: the cli-opencode self-invocation guard refuses that executor when the command is driven from inside an OpenCode session. An operator running from OpenCode uses the default native executor with the session model set to `opencode-go/deepseek-v4.1-flash#max` instead.

### Expected

Command 1 prints `121`. Command 2 runs the review; the setup answer is normalized to `["correctness","performance"]`, and because the configured names are a subset, the dimension queue is correctness then performance. Command 3 shows those two names in order, `reviewTargetType` `files`, `maxIterations` 3, `depthMode` `default` and `convergenceMode` `off`. Command 4 prints `3`. Command 5 prints a performance focus line in the second iteration. Command 6 prints three iteration records, the second naming performance. Command 7 prints `| performance | covered |`, and command 8 prints `no frontier store`.

### Evidence

Capture the command 1 line count, the config JSON, the iteration listing, the performance lines from the second iteration file and the state log, the dashboard coverage row and the frontier-store absence line.

### Pass / Fail

- **Pass**: `reviewDimensions` is correctness then performance, exactly three iterations ran, the second iteration and the dashboard prove performance is covered, and no frontier store exists.
- **Fail**: A missing or reordered dimension name, a fourth iteration, a dashboard row that leaves performance pending, or a frontier store that a default run should not create.

### Failure Triage

Check the config first. A config that lists all four canonical names means the setup answer was treated as `all`, so rerun and answer `correctness, performance` at the dimensions question. A performance row left pending after three iterations means the second iteration focused another dimension, so read its `focus` and `dimensions` in the state log.

### Optional Supplemental Checks

- Repeat the run on `runtime-bootstrap.cjs` (79 lines) and confirm the same two-dimension shape.
- Confirm that a third iteration would only be needed to cover a third dimension, which this scenario deliberately does not request.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../initialization-and-state-setup/custom-dimension-setup-and-universe.md` | Setup normalization and dimension-universe contract |
| `../review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | Covered custom dimension at the clean stop |
| `../../feature-catalog/review-dimensions/custom-review-dimensions.md` | Feature-catalog entry for custom review dimensions |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | Dimensions setup answer, normalize step and dimension queue |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Dimension universe, coverage projection and dashboard table |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Custom-dimension coverage cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Custom-dimension prompt line case |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-085
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/live-custom-dimension-review.md`
