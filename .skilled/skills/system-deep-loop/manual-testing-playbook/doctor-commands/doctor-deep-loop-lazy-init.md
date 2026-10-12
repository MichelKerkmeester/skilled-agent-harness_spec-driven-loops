---
title: "DOC-331 -- Doctor deep-loop lazy init"
description: "Manual scenario validating that /doctor:deep-loop reports lazy-init availability for an empty graph with existing iteration folders and recommends the repair path without writing the graph."
version: 1.6.0.8
id: doctor-commands-doctor-deep-loop-lazy-init
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-331 -- Doctor deep-loop lazy init

## 1. OVERVIEW

This scenario validates `/doctor:deep-loop` when `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` is empty or missing but existing spec packets already contain `research/iterations/*.md` or `review/iterations/*.md` files.

The behavior is user-observable. An operator who has just completed a deep-research or deep-review run asks the doctor command about coverage graph state. The command reports that the graph is recoverable from the iteration sources and names the repair path. No whole-graph rebuild tool ships, because the coverage graph fills as loop iterations upsert their rows. The repair is resuming the loop, or a manual repair through `system-deep-loop/runtime/scripts/upsert.cjs` from the iteration records.

---

## 2. SCENARIO CONTRACT

- Objective: Report lazy-init availability for an empty deep-loop graph with existing iteration folders, and recommend the repair path.
- Playbook ID: DOC-331.
- Real user request: `Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.`
- Prompt: `Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.`
- Preconditions: `deep-loop-graph.sqlite` is empty or missing in a disposable workspace, and one or more spec packets contain readable `research/iterations/*.md` or `review/iterations/*.md` files.
- Expected execution process: Confirm the graph is empty, inventory iteration folders, run `/doctor:deep-loop --scope=both`, and verify the recommendation plus an unchanged graph.
- Expected signals: Phase 0 detects `empty_graph=true` and sets `lazy_init.available=true`. Phase 2 recommends resuming the loop or a manual `upsert.cjs` repair. The workflow never calls `deep_loop_graph_upsert`, and the final status is `EMPTY` or an equivalent attention state.
- Desired user-visible outcome: A concise diagnostic verdict naming the empty graph, the iteration sources found and the recommended repair.
- Pass/fail: PASS if the report shows `lazy_init.available=true`, recommends resuming the loop or a manual `upsert.cjs` repair, and post-run `deep_loop_graph_status()` still reports zero nodes.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.
```

### Commands

1. Create a disposable copy of the repository or worktree.
2. Confirm at least one source iteration file exists:
   - `find .opencode/specs -path '*/research/iterations/*.md' -o -path '*/review/iterations/*.md' | head`
3. Remove or isolate only `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` in the disposable workspace.
4. Confirm the precondition with `deep_loop_graph_status({})` or an equivalent graph status call showing zero nodes.
5. Run `/doctor:deep-loop --scope=both` through the real runtime.
6. Capture the YAML asset load for `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`, the Phase 0 lazy-init block and the Phase 2 recommendation.
7. Run `deep_loop_graph_status({})` after the command.
8. Capture the state log path and the iteration file count Phase 0 reported.

### Expected

The command loads `doctor-deep-loop.yaml`, runs every status, query and convergence call with `--read-only`, and marks the empty graph as lazy-init eligible. Phase 2 recommends resuming the loop, whose iterations upsert their graph rows, or a manual repair through `system-deep-loop/runtime/scripts/upsert.cjs` from the iteration records.

The final report shows the empty graph, the iteration source count and the recommended repair. The workflow writes only its packet-local state log. The graph database is unchanged.

### Evidence

- Pre-run `deep_loop_graph_status({})` output showing an empty or missing graph.
- Iteration inventory showing readable `research/iterations/*.md` or `review/iterations/*.md` files.
- `/doctor:deep-loop --scope=both` transcript.
- Phase 2 recommendation naming the loop resume or the manual `upsert.cjs` repair.
- Transcript evidence that `deep_loop_graph_upsert` did not run.
- Post-run `deep_loop_graph_status({})` output still showing zero nodes.
- State log showing `lazy_init.available=true` and the iteration file count.

### Pass / Fail

- **Pass**: The report shows `lazy_init.available=true`, recommends resuming the loop or a manual `upsert.cjs` repair, and post-run `deep_loop_graph_status()` still reports zero nodes.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If lazy-init is not reported, inspect Phase 0 discovery in `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` for `iteration_folder_count` and `empty_graph` classification. If the graph changed during the run, inspect the read-only flags on the status, query and convergence calls, because the workflow must never upsert.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/deep-loop.md](../../../../commands/doctor/deep-loop.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-deep-loop.yaml](../../../../commands/doctor/assets/doctor-deep-loop.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

Provenance: manual only - find .opencode/specs -path '*/research/iterations/*.md' -o -path '*/review/iterations/*.md' | head

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-331
- Feature name: Doctor deep-loop lazy init
- Command mode: `/doctor:deep-loop --scope=both`
- YAML asset: `doctor-deep-loop.yaml`
- Graph target: `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite`
- Mutation boundary: read-only diagnostic. The workflow writes only its packet-local state log, and iteration markdown files are read-only inputs.
- Feature file path: `doctor-commands/doctor-deep-loop-lazy-init.md`
