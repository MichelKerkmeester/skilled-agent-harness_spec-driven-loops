---
title: "DOC-342 -- Doctor update G9 dashboard"
description: "Manual scenario validating /doctor:update cross-subsystem dashboard rendering across all seven dashboard subsystems with status, age, and recommended action."
version: 3.6.0.6
id: doctor-commands-doctor-update-g9-dashboard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-342 -- Doctor update G9 dashboard

## 1. OVERVIEW

This scenario validates the cross-subsystem dashboard rendered by `/doctor:update`. It uses a workspace with all dashboard subsystems present and a mix of health states, then verifies the output includes one row per subsystem with status, age, and recommended action.

The dashboard is the operator's decision surface. If it omits a subsystem or drops age/action context, the orchestrator cannot be safely trusted for update planning.

---

## 2. SCENARIO CONTRACT

- Objective: Seven-row cross-subsystem dashboard with actionable status context.
- Playbook ID: DOC-342.
- Real user request: `Run /doctor:update and verify the cross-subsystem dashboard renders all 7 subsystems with status + age + recommended action.`
- Prompt: `Run /doctor:update and verify the cross-subsystem dashboard renders all 7 subsystems with status + age + recommended action.`
- Preconditions: All dashboard subsystems are present and probeable with varied states across code-graph, context-index, causal-edges, skill-graph, deep-loop-graph, code_graph, and eval.
- Expected execution process: Run `/doctor:update`, capture the dashboard before or during action selection, count rows, and verify each row includes status, age, and recommended action.
- Expected signals: exactly seven dashboard rows with statuses such as `FRESH`, `DEGRADED`, `STALE`, or `MISSING`; each row includes `last_indexed_at` age or equivalent age value plus recommended action.
- Desired user-visible outcome: A dashboard verdict proving every subsystem is visible and actionable.
- Pass/fail: PASS if the dashboard includes all seven expected rows and every row has status, age, and recommended action.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update and verify the cross-subsystem dashboard renders all 7 subsystems with status + age + recommended action.
```

### Commands

1. Prepare a disposable workspace where all seven dashboard subsystems are probeable.
2. Seed or select varied health states across the subsystems where practical.
3. Run `/doctor:update` through the real runtime.
4. Capture the `Cross-Subsystem Health Dashboard` output.
5. Count dashboard rows for code-graph, context-index, causal-edges, skill-graph, deep-loop-graph, code_graph, and eval.
6. Verify every row includes status, age or `last_indexed_at` equivalent, and recommended action.
7. Capture `.doctor-update.last-run.json` for any actions taken after the dashboard.

### Expected

The command loads `doctor-update.yaml` and renders the cross-subsystem dashboard with exactly seven rows for the required dashboard subsystems. Each row reports a state in the expected status vocabulary, an age value based on freshness or `last_indexed_at`, and a recommended action such as scan, skip, rollback, init-links, upsert, reindex, fix-daemon, run-ablation, or validate.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: The dashboard includes all seven expected rows and every row has status, age, and recommended action.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If row count is wrong, inspect `doctor-update.yaml` Phase 4 dashboard rows and compare with `.opencode/commands/doctor/update.md` output contract. If age is missing, inspect the status probe adapters for `last_indexed_at` or equivalent freshness metadata.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor-update.yaml](../../../../commands/doctor/assets/doctor-update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp-server/database/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-342
- Feature name: Doctor update G9 dashboard
- Command mode: `/doctor:update`
- YAML asset: `doctor-update.yaml`
- Dashboard rows: code-graph, context-index, causal-edges, skill-graph, deep-loop-graph, code_graph, eval
- Runtime policy: Real dashboard output only.
- Destructive: Potentially, if the interactive flow follows dashboard recommendations; use disposable workspace.
- Feature file path: `doctor-commands/doctor-update-g9-dashboard.md`
