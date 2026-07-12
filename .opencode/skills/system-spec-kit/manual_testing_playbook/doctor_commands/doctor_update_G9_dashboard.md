---
title: "DOC-342 -- Doctor update G9 dashboard"
description: "Manual scenario validating /doctor:update cross-subsystem dashboard rendering across all seven dashboard subsystems with status, age, and recommended action."
version: 3.6.0.6
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

- BLOCKED before running `/doctor:update`: the scenario command requires writes outside the user-approved path, so the real runtime could not be executed under this task's constraints.
- User-approved write path for this run: `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor_commands/doctor_update_G9_dashboard.md` only.
- Actual command contract observed in `.opencode/commands/doctor/update.md`:

```text
40: - Snapshot every SQLite database before mutation unless `--no-snapshot` was explicitly passed.
46: - Every terminal path writes the update state log defined by the YAML workflow.
```

- Actual YAML state-log and mutation-boundary output observed in `.opencode/commands/doctor/assets/doctor_update.yaml`:

```text
18:   state_log: "mcp_server/database/.doctor-update.last-run.json"
100:     - ".opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite"  # structural code graph DB (skill-local)
101:     - ".opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite.pre-doctor-update.*.bak"
102:     - "mcp_server/database/context-index.sqlite"  # canonical memory DB
103:     - "mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak"
104:     - ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite"  # standalone advisor routing graph DB
105:     - ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite.pre-doctor-update.*.bak"
106:     - ".opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite"  # research/review coverage graph DB
107:     - ".opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite.pre-doctor-update.*.bak"
108:     - "mcp_server/database/speckit-eval.db"  # eval/ablation DB
109:     - "mcp_server/database/speckit-eval.db.pre-doctor-update.*.bak"
110:     - "mcp_server/database/.doctor-update.flock"  # single-instance lock
111:     - "mcp_server/database/.doctor-update.lock"
112:     - "mcp_server/database/.doctor-update.last-run.json"  # orchestrator state log
113:     - "mcp_server/database/.doctor-update.bootstrap.json"  # pre-MCP bootstrap state
114:     - "mcp_server/database/.doctor-update.bootstrap.lockdir"  # pre-MCP bootstrap lock
```

- Actual presentation contract observed in `.opencode/commands/doctor/assets/doctor_update_presentation.txt` confirms the expected seven-row dashboard shape, but this was not real runtime output from `/doctor:update`:

```text
136: Cross-Subsystem Health Dashboard
138: | Subsystem     | Status | Age | Coverage | Recommended Action |
140: | code-graph    | [OK|STALE|MISSING|REGRESSED] | [age] | [n/a|metric] | [scan|skip|rollback] |
141: | context-index | [OK|STALE|MISSING|REGRESSED] | [age] | [metric] | [index-scan|skip|rollback] |
142: | causal-edges  | [OK|LOW-COVERAGE|REGRESSED] | [age] | [metric] | [init-links|skip|rollback] |
143: | skill-graph   | [OK|STALE|MISSING] | [age] | [n/a|metric] | [scan|skip] |
144: | advisor       | [OK|INVALID|STALE] | [age] | [n/a|metric] | [rebuild|validate] |
145: | deep-loop     | [OK|EMPTY|STALE] | [age] | [n/a|metric] | [upsert|skip] |
146: | eval          | [OK|STALE|SKIPPED] | [age] | [n/a|metric] | [run-ablation|skip] |
```

- Row-count check: BLOCKED; no real `/doctor:update` dashboard transcript was produced because executing the command would violate the allowed write paths.
- State log path emitted by command contract: `mcp_server/database/.doctor-update.last-run.json`; not captured from a real run because the command was not executed.

### Pass / Fail

- **BLOCKED**: `/doctor:update` could not be executed under this task's constraints because the command contract requires writing `mcp_server/database/.doctor-update.last-run.json` on every terminal path and may write additional lock, bootstrap, database, and snapshot files outside the single allowed scenario file.

### Failure Triage

If row count is wrong, inspect `doctor_update.yaml` Phase 4 dashboard rows and compare with `.opencode/commands/doctor/update.md` output contract. If age is missing, inspect the status probe adapters for `last_indexed_at` or equivalent freshness metadata.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
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
- Feature file path: `doctor_commands/doctor_update_G9_dashboard.md`
