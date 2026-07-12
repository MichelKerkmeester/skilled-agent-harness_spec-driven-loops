---
title: "DOC-332 -- Doctor deep-loop empty no source"
description: "Manual scenario validating /doctor deep-loop behavior when the coverage graph is empty and no iteration folders exist."
version: 3.6.0.10
---

# DOC-332 -- Doctor deep-loop empty no source

## 1. OVERVIEW

This scenario validates `/doctor deep-loop` when the deep-loop coverage graph is empty and there are no `research/iterations/*.md` or `review/iterations/*.md` sources available.

The command must stay read-only and refuse remediation. An empty graph without source iterations is not a recoverable lazy-init case; the correct user-facing result is a degraded diagnostic with a recommendation to run a real deep-research or deep-review loop first.

---

## 2. SCENARIO CONTRACT

- Objective: Report empty deep-loop graph with no iteration source and refuse remediation.
- Playbook ID: DOC-332.
- Real user request: `Check deep-loop graph status. There's no recent research iteration data.`
- Prompt: `Check deep-loop graph status. There's no recent research iteration data.`
- Preconditions: `deep-loop-graph.sqlite` is empty or missing in a disposable workspace, and no spec packet under the sandbox contains `research/iterations/*.md` or `review/iterations/*.md`.
- Expected execution process: Confirm graph emptiness, confirm no iteration files, run `/doctor deep-loop --scope=both`, and capture the diagnostic report.
- Expected signals: read-only diagnostic flow loads `doctor_deep-loop.yaml`; `empty_graph=true`; `iteration_folder_count=0`; `lazy_init.available=false`; status is `DEGRADED`, `EMPTY`, or equivalent attention state with no `deep_loop_graph_upsert` call.
- Desired user-visible outcome: A concise diagnostic verdict saying no iteration source was detected and recommending `/deep:research` or `/deep:review` first.
- Pass/fail: PASS if the command reports the empty graph and missing source clearly while performing no graph mutation.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Check deep-loop graph status. There's no recent research iteration data.
```

### Commands

1. Create a disposable copy of the repository or a minimal sandbox with no deep-loop iteration folders.
2. Confirm no source iteration files exist:
   - `test -z "$(find .opencode/specs -path '*/research/iterations/*.md' -o -path '*/review/iterations/*.md' | head -1)"`
3. Remove or isolate only `mcp_server/database/deep-loop-graph.sqlite` in the disposable workspace.
4. Confirm the graph status is empty with `deep_loop_graph_status({})` or equivalent.
5. Run `/doctor deep-loop --scope=both` through the real runtime.
6. Capture the full diagnostic report and state log.
7. Verify the transcript contains no `deep_loop_graph_upsert` call and no snapshot or rollback activity.

### Expected

The command resolves read-only diagnostic flow, loads `doctor_deep-loop.yaml`, inventories zero research/review iteration sources, and emits an empty-graph diagnostic. The report should include the user-facing message `no iteration source detected` or equivalent wording and recommend running `/deep:research` or `/deep:review` before apply remediation.

No graph rows are inserted, no snapshot is taken, and no iteration markdown files are created.

### Evidence

- Pre-run proof that no `research/iterations/*.md` or `review/iterations/*.md` files exist.
- Pre-run `deep_loop_graph_status({})` output showing an empty graph.
- `/doctor deep-loop --scope=both` transcript.
- Diagnostic report showing empty graph plus missing iteration source.
- State log showing `iteration_folder_count: 0`, `lazy_init.available: false`, and read-only mode.
- Transcript evidence that `deep_loop_graph_upsert` did not run.

### Pass / Fail

- **PASS**: command reports empty graph and no iteration source, recommends running a deep-loop workflow first, and performs no mutation.
- **FAIL**: command attempts lazy-init without source files, calls `deep_loop_graph_upsert`, invents iteration data, or reports a healthy graph.
- **SKIP**: the sandbox cannot remove or isolate iteration folders without touching active user data.
- **UNAUTOMATABLE**: only valid if the runtime cannot execute `/doctor deep-loop` and no direct status diagnostic can be captured.

### Failure Triage

If the command tries to remediate, inspect the diagnostic-mode guard in `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` and fail with `auto-mode-upsert-forbidden`. If it reports a source despite the sandbox having no iteration files, inspect the Glob path resolution and verify the command is running from the intended disposable workspace.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_deep-loop.yaml](../../../../commands/doctor/assets/doctor_deep-loop.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-332
- Feature name: Doctor deep-loop empty no source
- Command mode: `/doctor deep-loop --scope=both`
- YAML asset: `doctor_deep-loop.yaml`
- Expected refusal: no iteration source detected.
- Mutation boundary: read-only diagnostic; no `deep_loop_graph_upsert`.
- Feature file path: `doctor_commands/doctor_deep_loop_empty_no_source.md`
