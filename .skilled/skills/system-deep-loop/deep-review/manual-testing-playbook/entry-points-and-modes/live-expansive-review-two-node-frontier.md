---
title: "DRV-084 -- Live expansive review of one small file"
description: "This scenario validates a low-token live expansive review for `DRV-084`. It focuses on one 121-line file, two sub-target nodes, three deterministic iterations and the signals that show no node is answered yet."
version: 1.0.1.0
---

# DRV-084 -- Live expansive review of one small file

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-084`.

---

## 1. OVERVIEW

This scenario validates a small live expansive review for `DRV-084`. It focuses on one 121-line runtime helper, `.skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs`, a two-node frontier and three iterations with convergence off.

### Why This Matters

An expansive review at its derived default can size itself to `min(24, ...)` iterations, and a node needs one iteration per dimension before it can close. A manual check of the review frontier should use a tiny target, an explicit cap and a short iteration budget. If it does not, the operator spends a full review budget to learn that two nodes stay open.

---

## 2. SCENARIO CONTRACT

Operators run this as a real orchestrator-led review against a fixture spec folder, then read the review config, node store, dashboard and iteration directory. The scenario is complete when the operator can say how many nodes the frontier held, which dimensions were covered and why no node closed.

- Objective: Verify that a live expansive review of one small file with `maxDepth` 2, `maxFrontierNodes` 2 and two seeded sub-target nodes holds two depth-1 nodes, answers none of them in three iterations, and renders the frontier dashboard section.
- Real user request: Give this one state-append helper a small expansive review with two sub-targets and three iterations, and tell me what the frontier looks like afterwards.
- Prompt: `Run a three-iteration expansive deep review of .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs with --depth-mode=expansive --max-iterations=3 --convergence-mode=off --frontier-max-depth=2 --frontier-max-nodes=2, and the DeepSeek flash executor, then report the node statuses, the dimensions covered and the iteration count.`
- Expected execution process: Name the repo-relative file path so setup binds `review_target_type` to `files`, confirm the config it writes carries both caps, hold the run before the frontier seed step, seed two sub-targets, then let three iterations and synthesis finish.
- Expected signals: `review/frontier-nodes.jsonl` holds two depth-1 node ids and no node deeper than two; neither node is answered because three iterations cover only three of the four canonical dimensions; the statuses are open or active; `review/deep-review-dashboard.md` contains `## 10B. FRONTIER` and a frontier size of two; `review/iterations/` holds exactly three files; the config shows `reviewTargetType` `files`, `maxIterations` 3 and both caps 2.
- Desired user-visible outcome: The operator is told the review used three iterations, both sub-targets are still open, three dimensions were covered, and where the frontier evidence lives.
- Pass/fail: PASS if the node count, statuses, dashboard section, dimension coverage, iteration count and config values match; FAIL if any one differs, including a third node, an answered node or a fourth iteration.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a three-iteration expansive deep review of .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs with --depth-mode=expansive --max-iterations=3 --convergence-mode=off --frontier-max-depth=2 --frontier-max-nodes=2, and the DeepSeek flash executor, then report the node statuses, the dimensions covered and the iteration count.`

### Commands

1. `wc -l .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs`
2. `rg -n -- '--depth-mode|--max-iterations|--convergence-mode|--frontier-max-depth|--frontier-max-nodes' .skilled/commands/deep/review.md`
3. `/deep:review ".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs" :confirm --spec-folder=<fixture> --depth-mode=expansive --max-iterations=3 --convergence-mode=off --frontier-max-depth=2 --frontier-max-nodes=2 --executor=cli-opencode --model='opencode-go/deepseek-v4.1-flash#max'`
4. When the orchestrator reports the config written and stops before the frontier seed step, confirm the caps landed at init: `jq '{maxIterations, maxDepth: .expansiveDepth.maxDepth, maxFrontierNodes: .expansiveDepth.maxFrontierNodes, depthMode: .antiConvergence.depthMode}' <fixture>/review/deep-review-config.json`
5. `printf '%s\n' '[{"question":"Does the gateway refuse an iteration record without an integer iteration before it appends?","scope":".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs","evidence":".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs"},{"question":"Does the observed-time stamp preserve the producer claimed timestamp without letting it win?","scope":".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs","evidence":".skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs"}]' > <fixture>/review/frontier-seed.json`, then tell the orchestrator to seed that file unchanged.
6. Let the run continue through seeding, three iterations and synthesis.
7. `jq -s '[.[] | select(.depth == 1) | .nodeId] | unique | length' <fixture>/review/frontier-nodes.jsonl`
8. `jq -s '[.[] | .depth] | max' <fixture>/review/frontier-nodes.jsonl`
9. `jq -s 'group_by(.nodeId) | map(last) | map({nodeId, depth, status})' <fixture>/review/frontier-nodes.jsonl`
10. `rg -n '^## 10B\. FRONTIER|Frontier size' <fixture>/review/deep-review-dashboard.md`
11. `find <fixture>/review/iterations -name 'iteration-*.md' | wc -l`
12. `jq '{reviewTargetType, reviewDimensions, maxIterations, maxDepth: .expansiveDepth.maxDepth, maxFrontierNodes: .expansiveDepth.maxFrontierNodes, depthMode: .antiConvergence.depthMode, convergenceMode: .antiConvergence.convergenceMode}' <fixture>/review/deep-review-config.json`
13. `rg -n '^\| (correctness|security|traceability|maintainability) \|' <fixture>/review/deep-review-dashboard.md`

The executor note: the cli-opencode self-invocation guard refuses that executor when the command is driven from inside an OpenCode session. An operator running from OpenCode uses the default native executor with the session model set to `opencode-go/deepseek-v4.1-flash#max` instead.

### Expected

Command 1 prints `121`. Command 2 prints a match for every one of the five flags. Command 3 starts setup with a file target, so the config carries `reviewTargetType` `files`, and command 4 shows the config the run wrote: `maxIterations` 3, both caps 2 and `depthMode` `expansive`, so the two flags landed at init rather than through a later edit. The seed step's budget step is skipped because `--max-iterations` is explicit. Command 5 gives the seed step exactly two sub-targets; the seed pass is exempt from the run-wide node cap and answers only to the root-children cap, so both nodes are admitted. After the run, command 7 prints `2`, command 8 prints `1` because both nodes sit at depth 1, command 9 lists two rows with status `open` or `active` and none `answered`, command 10 prints `## 10B. FRONTIER` and a frontier size of two, command 11 prints `3`, command 12 still shows `maxIterations` 3 with both caps 2 and the four canonical dimensions, and command 13 shows three canonical dimensions `covered` with maintainability the remaining `pending` row. At three iterations no review node can be answered because each node needs one iteration per dimension.

### Evidence

Capture the command 1 line count, the command 2 matches, the command 4 config JSON, the seed output and warning, the command 7 to 13 outputs, and the iteration file listing.

### Pass / Fail

- **Pass**: Two depth-1 node ids, no node deeper than two, no answered node, the frontier dashboard section, exactly three iterations, and `reviewTargetType` `files` with `maxIterations` 3 and both caps 2.
- **Fail**: A third node, a node deeper than two, an answered node at three iterations, a missing dashboard section, an iteration count other than three, or a cap that differs from 2.

### Failure Triage

Check the config first. A cap still at 3 or null at command 4 means the invocation dropped the flag or the value was not a positive integer, so rerun with both flags. A cap that matches at command 4 but not at command 12 means something rewrote the config. An answered node at three iterations contradicts the one-iteration-per-dimension rule, so read the node's `coveredDimensions` in the registry. A fourth iteration means convergence was not off.

### Optional Supplemental Checks

- Run the same review on `runtime-bootstrap.cjs`, which is 79 lines, and confirm the same two-node shape with a different small target.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/loop-lifecycle/expansive-depth-mode.md` | Feature-catalog entry for review frontier growth |
| `../initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | Seed contract for review depth-one nodes |
| `../iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | Node coverage rule this scenario observes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | Config creation, seed step, budget skip and review loop |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Caps reader, review seed and node store writer |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Review frontier projection and dashboard section |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts` | Review seed and cap cases |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-084
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/live-expansive-review-two-node-frontier.md`
