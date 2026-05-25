---
title: "DOC-342 -- Doctor update G9 dashboard"
description: "Manual scenario validating /doctor:update cross-subsystem dashboard rendering across all seven dashboard subsystems with status, age, and recommended action."
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
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

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

The command loads `doctor_update.yaml` and renders the cross-subsystem dashboard with exactly seven rows for the required dashboard subsystems. Each row reports a state in the expected status vocabulary, an age value based on freshness or `last_indexed_at`, and a recommended action such as scan, skip, rollback, init-links, upsert, reindex, fix-daemon, run-ablation, or validate.

### Evidence

- Full dashboard transcript.
- Row-count check showing seven required subsystem rows.
- Highlighted row snippets proving each row has status, age, and recommended action.
- State log path emitted by the command.

### Pass / Fail

- **PASS**: all seven rows appear exactly once, each row includes status, age, and recommended action, and statuses map to the observed subsystem health.
- **FAIL**: any required row is missing, a row lacks age or action, row count is not seven, or status/action recommendations contradict observed health.
- **SKIP**: a subsystem cannot be made probeable in the sandbox.
- **UNAUTOMATABLE**: the runtime cannot execute `/doctor:update` or capture the dashboard.

### Failure Triage

If row count is wrong, inspect `doctor_update.yaml` Phase 4 dashboard rows and compare with `.opencode/commands/doctor/update.md` output contract. If age is missing, inspect the status probe adapters for `last_indexed_at` or equivalent freshness metadata.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../mcp_server/database/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-342
- Feature name: Doctor update G9 dashboard
- Command mode: `/doctor:update`
- YAML asset: `doctor_update.yaml`
- Dashboard rows: code-graph, context-index, causal-edges, skill-graph, deep-loop-graph, code_graph, eval
- Runtime policy: Real dashboard output only.
- Destructive: Potentially, if the interactive flow follows dashboard recommendations; use disposable workspace.
- Feature file path: `23--doctor-commands/342-doctor-update-G9-dashboard.md`
