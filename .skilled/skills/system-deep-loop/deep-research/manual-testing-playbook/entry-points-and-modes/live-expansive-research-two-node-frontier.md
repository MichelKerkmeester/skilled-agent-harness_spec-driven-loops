---
title: "DR-077 -- Live expansive research with two frontier nodes"
description: "This scenario validates a low-token live expansive research run for `DR-077`. It focuses on a two-node frontier cap, three deterministic iterations and the dashboard, node-store and iteration-count signals an operator can read afterwards."
version: 1.0.0.0
---

# DR-077 -- Live expansive research with two frontier nodes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-077`.

---

## 1. OVERVIEW

This scenario validates a small live expansive research run for `DR-077`. It focuses on one narrow repo question, a frontier capped at two nodes, and three iterations that cannot stop early because convergence is off.

### Why This Matters

An operator who wants to see the expansive frontier work should not have to spend a derived budget of up to 16 iterations. The caps live in the run config and have no flag, so the only cheap way to run is to set them, seed two nodes and keep the iteration count explicit. If the caps are left at their defaults, the run grows past what a quick manual check can inspect.

---

## 2. SCENARIO CONTRACT

Operators run this as a real orchestrator-led check on a fixture spec folder, then read the node store, config, dashboard and iteration directory. The scenario is complete when the operator can say how many nodes the frontier held and how many iterations ran.

- Objective: Verify that a live expansive research run with `maxDepth` 2, `maxFrontierNodes` 2 and two seeded nodes holds exactly two depth-1 nodes, reaches no depth past two, writes exactly three iterations and renders the frontier dashboard section.
- Real user request: Give me a small expansive research run on one narrow question, with a two-node frontier and three iterations, so I can see the behavior without a long budget.
- Prompt: `Run a three-iteration expansive deep-research on which events the deep-research reducer projects from the ledger, with --depth-mode=expansive --max-iterations=3 --convergence-mode=off, a frontier capped at two nodes, and the DeepSeek flash executor, then report the node count, the iteration count and any node deeper than two.`
- Expected execution process: Start the command in `:confirm` mode, hold it after setup writes the config and before the frontier seed step, set the two caps in that config, write a two-row seed file, let the seed step admit it unchanged, then let the three iterations and synthesis finish.
- Expected signals: `research/frontier-nodes.jsonl` holds two depth-1 node ids and no node deeper than two; `research/deep-research-dashboard.md` contains `## 6B. FRONTIER`; `research/iterations/` holds exactly three `iteration-NNN.md` files; the config shows `maxIterations` 3, `expansiveDepth.maxDepth` 2 and `expansiveDepth.maxFrontierNodes` 2.
- Desired user-visible outcome: The operator is told the run used three iterations, the frontier held two nodes, no node went past depth two, and where the dashboard and node store are.
- Pass/fail: PASS if the node count, maximum depth, dashboard section, iteration count and config values all match the expected signals; FAIL if any one differs, including a third depth-1 node or a fourth iteration.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a three-iteration expansive deep-research on which events the deep-research reducer projects from the ledger, with --depth-mode=expansive --max-iterations=3 --convergence-mode=off, a frontier capped at two nodes, and the DeepSeek flash executor, then report the node count, the iteration count and any node deeper than two.`

### Commands

1. `rg -n -- '--depth-mode|--max-iterations|--convergence-mode' .skilled/commands/deep/research.md`
2. `rg -n 'expansiveDepth|maxFrontierNodes|maxDepth|readCaps' .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs`
3. `/deep:research "Which events does the deep-research reducer project from the ledger?" :confirm --spec-folder=<fixture> --depth-mode=expansive --max-iterations=3 --convergence-mode=off --executor=cli-opencode --model='opencode-go/deepseek-v4.1-flash#max'`
4. When the orchestrator reports the config written and stops before the frontier seed step, set the caps. This is a config edit because no flag exists for either value: `jq '.expansiveDepth.maxDepth = 2 | .expansiveDepth.maxFrontierNodes = 2' <fixture>/research/deep-research-config.json > /tmp/dr-caps.json && mv /tmp/dr-caps.json <fixture>/research/deep-research-config.json`
5. `printf '%s\n' '[{"question":"Which ledger stems does the reducer project into the dashboard?","scope":".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs","evidence":".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"},{"question":"Which iteration-record fields does the append gateway project into the state log?","scope":".skilled/skills/system-deep-loop/runtime/scripts","evidence":".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs"}]' > <fixture>/research/frontier-seed.json`, then tell the orchestrator to seed that file unchanged.
6. Let the run continue through seeding, three iterations and synthesis.
7. `jq -s '[.[] | select(.depth == 1) | .nodeId] | unique | length' <fixture>/research/frontier-nodes.jsonl`
8. `jq -s '[.[] | .depth] | max' <fixture>/research/frontier-nodes.jsonl`
9. `jq -s 'group_by(.nodeId) | map(last) | map({nodeId, depth, status})' <fixture>/research/frontier-nodes.jsonl`
10. `rg -n '^## 6B\. FRONTIER|Frontier size' <fixture>/research/deep-research-dashboard.md`
11. `find <fixture>/research/iterations -name 'iteration-*.md' | wc -l`
12. `jq '{maxIterations, maxDepth: .expansiveDepth.maxDepth, maxFrontierNodes: .expansiveDepth.maxFrontierNodes, depthMode: .antiConvergence.depthMode, convergenceMode: .antiConvergence.convergenceMode}' <fixture>/research/deep-research-config.json`

The executor note: the cli-opencode self-invocation guard refuses that executor when the command is driven from inside an OpenCode session. An operator running from OpenCode uses the default native executor with the session model set to `opencode-go/deepseek-v4.1-flash#max` instead.

### Expected

Command 1 prints the three flag rows, and command 2 prints the caps reader and both config keys, which confirms neither cap has a flag. Command 3 starts setup. At command 4 the config holds the two caps; the seed step's own budget step is skipped because `--max-iterations` is explicit. Command 5 gives the seed step exactly two rows, so it admits two nodes and prints its no-growth-slot warning, which is expected at a cap of two. After the run, command 7 prints `2`, command 8 prints `1` because both nodes sit at depth 1, command 9 lists two rows whose status is open, active or answered, command 10 prints `## 6B. FRONTIER` and a frontier size line, command 11 prints `3`, and command 12 shows `maxIterations` 3 with both caps 2.

### Evidence

Capture the command 1 and 2 matches, the config JSON before and after command 4, the seed command's stdout and warning, the command 7 to 12 outputs, and the iteration file listing.

### Pass / Fail

- **Pass**: Two depth-1 node ids, no depth past two, the frontier dashboard section, exactly three iterations, and `maxIterations` 3 with both caps 2.
- **Fail**: A third node id, a node deeper than two, a missing dashboard section, an iteration count other than three, or a cap that differs from 2.

### Failure Triage

Check the config first. A cap still at 3 or null means command 4 ran after the seed or was overwritten, so rerun on a fresh fixture and hold the run at the config report. A third node means the seed file held more than two rows or the cap edit arrived late. A fourth iteration means convergence was not off.

### Optional Supplemental Checks

- Confirm the seed step normally asks for three to six sub-questions and that two is a deliberate operator override, not the documented default.
- Run the same invocation with `--dry-run` and confirm no config is written, so the caps cannot be staged that way.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/convergence/expansive-depth-mode.md` | Feature-catalog entry for research frontier growth |
| `expansive-depth-flag-and-default-identity.md` | Flag and default-identity scenario for the same mode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | Config creation, seed step, budget skip and expansive loop |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Caps reader, seed admission and node store writer |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Dashboard frontier section and node projection |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` | Seed, admission and cap cases |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-077
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/live-expansive-research-two-node-frontier.md`
