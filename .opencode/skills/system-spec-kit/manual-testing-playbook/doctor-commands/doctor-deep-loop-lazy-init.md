---
title: "DOC-331 -- Doctor deep-loop lazy init"
description: "Manual scenario validating /doctor deep-loop lazy initialization from existing research and review iteration folders."
version: 3.6.0.8
id: doctor-commands-doctor-deep-loop-lazy-init
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-331 -- Doctor deep-loop lazy init

## 1. OVERVIEW

This scenario validates `/doctor deep-loop` when `.opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` is empty or missing but existing spec packets already contain `research/iterations/*.md` or `review/iterations/*.md` files.

The behavior is user-observable: an operator who has just completed a deep-research or deep-review run asks the doctor command to initialize coverage graph state, and the command rebuilds nodes and edges from the iteration markdown sources instead of reporting an unrecoverable empty graph.

---

## 2. SCENARIO CONTRACT

- Objective: Lazy-init the deep-loop graph from existing iteration folders.
- Playbook ID: DOC-331.
- Real user request: `Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.`
- Prompt: `Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.`
- Preconditions: `deep-loop-graph.sqlite` is empty or missing in a disposable workspace, and one or more spec packets contain readable `research/iterations/*.md` or `review/iterations/*.md` files.
- Expected execution process: Confirm the graph is empty, inventory iteration folders, run `/doctor deep-loop --scope=both`, and verify post-run graph status plus source-file provenance.
- Expected signals: Phase 0 detects `empty_graph=true`; `lazy_init.available=true`; Phase 3 calls `deep_loop_graph_upsert` using iteration-derived batches; final status is applied with nonzero graph nodes and edges.
- Desired user-visible outcome: A concise applied verdict naming the populated graph and the iteration sources used.
- Pass/fail: PASS if post-run `deep_loop_graph_status()` reports a nonzero node count and cited source files match the discovered iteration folders.
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
3. Remove or isolate only `.opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` in the disposable workspace.
4. Confirm the precondition with `deep_loop_graph_status({})` or an equivalent graph status call showing zero nodes.
5. Run `/doctor deep-loop --scope=both` through the real runtime.
6. Capture the YAML asset load for `.opencode/commands/doctor/assets/doctor-deep-loop.yaml`, the snapshot path, lazy-init block, and upsert batch summary.
7. Run `deep_loop_graph_status({})` after the command.
8. Capture the state log path and the list of source iteration files cited by the rebuild plan.

### Expected

The command resolves mutation flow, loads `doctor-deep-loop.yaml`, marks the empty graph as lazy-init eligible, snapshots `deep-loop-graph.sqlite`, parses iteration markdown files into deterministic graph batches, and writes nodes plus edges through `deep_loop_graph_upsert`.

The final report shows an applied status, nonzero graph node count, nonzero or explicitly justified edge count, and provenance back to the iteration files used as read-only sources.

### Evidence

- Pre-run `deep_loop_graph_status({})` output showing an empty or missing graph.
- Iteration inventory showing readable `research/iterations/*.md` or `review/iterations/*.md` files.
- `/doctor deep-loop --scope=both` transcript.
- Snapshot path and Phase 3 mutation-boundary validation output.
- `deep_loop_graph_upsert` summary with nodes and edges upserted.
- Post-run `deep_loop_graph_status({})` output with nonzero nodes.
- State log showing `lazy_init.available=true`, `status: APPLIED`, and source iteration file paths.

### Pass / Fail

- **Pass**: Post-run `deep_loop_graph_status()` reports a nonzero node count and cited source files match the discovered iteration folders.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If lazy-init is not offered, inspect Phase 0 discovery in `.opencode/commands/doctor/assets/doctor-deep-loop.yaml` for `iteration_folder_count` and `empty_graph` classification. If upsert runs but graph status remains empty, inspect the derived `specFolder`, `loopType`, `sessionId`, node IDs, and edge IDs in the state log before rerunning with `/doctor deep-loop --scope=both`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor-deep-loop.yaml](../../../../commands/doctor/assets/doctor-deep-loop.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-331
- Feature name: Doctor deep-loop lazy init
- Command mode: `/doctor deep-loop --scope=both`
- YAML asset: `doctor-deep-loop.yaml`
- Graph target: `.opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite`
- Mutation boundary: graph upserts only; iteration markdown files are read-only inputs.
- Feature file path: `doctor-commands/doctor-deep-loop-lazy-init.md`
