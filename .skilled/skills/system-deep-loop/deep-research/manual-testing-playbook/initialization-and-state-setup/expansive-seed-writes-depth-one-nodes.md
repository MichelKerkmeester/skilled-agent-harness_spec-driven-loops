---
title: "DR-069 -- Expansive seed writes depth-one nodes before iteration one"
description: "This scenario validates that the expansive seed step runs before the fan-out spawn and after config creation, and that a repeated seed does not decompose the topic a second time, for `DR-069`."
version: 1.16.2.0
---

# DR-069 -- Expansive seed writes depth-one nodes before iteration one

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-069`.

---

## 1. OVERVIEW

This scenario validates the seed step of the expansive depth mode. The objective is to confirm that the depth-one frontier nodes exist before the first iteration, on both the fan-out path and the single-executor path.

### Why This Matters

A seeded node gives iteration one an open node to work. Without the seed, the first iteration runs with no frontier, and a fan-out run has no nodes to deal across its lineages.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm the order of the seed step in the workflow and the seed behavior in the admission helper.

- Objective: Confirm that the seed step runs before the fan-out spawn and inside `phase_init` after config creation, and that a second seed does not add a second decomposition.
- Real user request: Start an expansive research run and tell me the frontier already holds open nodes before the first iteration.
- Prompt: `Check that expansive depth mode seeds its depth-one frontier nodes before iteration one, on the fan-out path and on the single-executor path, and that a second seed does not decompose the topic again. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Read the step order in the workflow file, run the ordering cases of the YAML contract suite and run the seed cases of the admission suite by file stem.
- Expected signals: The root `step_frontier_seed` line precedes `step_fanout_spawn`. The `phase_init` copy of `step_frontier_seed` follows `step_create_config`. Two YAML contract cases pass. Two admission cases pass, one showing that a seeded node keeps root as its parent and one showing that a second seed call adds nothing.
- Desired user-visible outcome: The operator can say the first iteration starts from open depth-one nodes, and a repeated launch cannot add a second decomposition.
- Pass/fail: PASS if the step order and all four named cases pass; FAIL if the seed runs after the spawn, after the iteration starts, or adds nodes on a repeated call.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that expansive depth mode seeds its depth-one frontier nodes before iteration one, on the fan-out path and on the single-executor path, and that a second seed does not decompose the topic again. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `rg -n "^\s*(step_frontier_seed|step_fanout_spawn|step_create_config):" .skilled/commands/deep/assets/deep-research.yaml`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run stop-decision-yaml-contract.vitest -t "seeds" --reporter=verbose`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run frontier-admit.vitest -t "seedNodes" --reporter=verbose`

### Expected

Command 1 prints four lines in file order. The first `step_frontier_seed` line comes before the `step_fanout_spawn` line, and the second `step_frontier_seed` line comes after the `step_create_config` line. Command 2 prints `Tests  4 passed` (the rest of the file skipped), because the filter also matches the two review seed cases. The research cases `seeds the frontier before fan-out spawns` and `seeds the single-executor frontier right after the config exists` pass. Command 3 prints `Tests  2 passed` (the rest of the file skipped), with the cases `seedNodes forces root parents` and `seedNodes seeds a run once and skips a second decomposition` passing.

### Evidence

- The four `rg` lines from command 1, read in file order.
- The two verbose case lines and the summary line from commands 2 and 3, with each exit status.

### Pass / Fail

- **Pass**: The step order matches the expected order and all four named cases pass.
- **Fail**: The seed step sits after the fan-out spawn or after iteration one starts, or a case fails.

### Failure Triage

- The seed step sits after the spawn: check the root workflow order, because a fan-out lineage skips `phase_init` and would start with no nodes.
- The single-executor seed is missing: check the `phase_init` copy, which must follow `step_create_config`.
- A repeated seed adds nodes: check the already-seeded guard in the admission helper.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | `step_frontier_seed` at the workflow root and inside `phase_init` |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | `seedNodes`, which writes the depth-one rows once per run |
| `stop-decision-yaml-contract.vitest` | Seed order on the fan-out path and on the single-executor path |
| `frontier-admit.vitest` | Root parents and the single seed per run |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-069
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md`
- Feature catalog status: `feature-catalog/convergence/expansive-depth-mode.md` covers the expansive seed step in its Seeding And Admission section.
