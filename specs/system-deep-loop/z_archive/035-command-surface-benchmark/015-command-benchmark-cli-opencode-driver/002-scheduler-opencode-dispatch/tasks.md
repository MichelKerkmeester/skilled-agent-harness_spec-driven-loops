---
title: "Tasks: Scheduler/Runner cli-opencode Dispatch Wiring"
description: "Task breakdown for wiring the cli-opencode leg into behavior-bench-run.cjs: LEG_TABLE entry, buildSpawnArgs model/variant plumbing, --dir, child spec-gate env, and byte-stable frozen-leg verification."
trigger_phrases:
  - "tasks scheduler opencode dispatch"
  - "runner buildSpawnArgs tasks"
  - "cli-opencode leg wiring tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/002-scheduler-opencode-dispatch"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 tasks"
    next_safe_action: "Wire runner dispatch on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-002-scheduler-opencode-dispatch-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scheduler/Runner cli-opencode Dispatch Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-read cli-opencode SKILL.md — Default Invocation §3 + ALWAYS rules 3/5/6/11/17 (`cli-opencode/SKILL.md`) [20m]
- [ ] T002 [B] Choose the model/variant plumbing seam (per-model keys vs runner flags vs env seam) [15m]
- [ ] T003 Capture a golden snapshot of `buildSpawnArgs` output for `claude-cli`/`gpt-fast-high`/`gpt-fast-med` [15m]
- [ ] T004 Create isolated worktree; record recovery-baseline commit hash [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### LEG_TABLE + spawn builder
- [ ] T005 Add `cli-opencode` `LEG_TABLE` entry rendering the canonical base argv (`behavior-bench-run.cjs`) [30m]
- [ ] T006 Extend `buildSpawnArgs` to interpolate model/variant for the new leg (`behavior-bench-run.cjs`) [45m]
- [ ] T007 Append `--dir <repo-root>` to the new leg's opencode argv (`behavior-bench-run.cjs`) [20m]
- [ ] T008 Verify no `--agent` token is ever added for the new leg (`behavior-bench-run.cjs`) [10m]

### Env + stdin
- [ ] T009 Inject `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` on the opencode child spawn (leg-scoped) (`behavior-bench-run.cjs`) [30m]
- [ ] T010 Confirm `stdio: ['ignore','pipe','pipe']` preserved (closed-stdin, no literal `</dev/null` in argv) (`behavior-bench-run.cjs`) [10m]

### Selectability seam (if seam 2)
- [ ] T011 [P] Add optional `--model/--variant` to runner `parseArgs` (`behavior-bench-run.cjs`) [20m]
- [ ] T012 [P] Pass `--model/--variant` from the cell `executor` in scheduler `invokeRunner` (`run-command-behavior-matrix.cjs`) [30m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit
- [ ] T013 Test: `cli-opencode` leg renders exact canonical argv, no `--agent` [30m]
- [ ] T014 Test: command-kind scenario renders `--command <family>/<name>` before `--format json` [20m]
- [ ] T015 Test: missing `executor` falls back to `deepseek/deepseek-v4-pro` + `high` [15m]

### Snapshot / regression
- [ ] T016 Snapshot test: frozen legs' `buildSpawnArgs` byte-identical to the golden [20m]

### Env / contract
- [ ] T017 Assert env injection carries the two child spec-gate vars [15m]
- [ ] T018 Confirm exit-code contract unchanged (`0/2/3/75`) and `EXIT_ENV` retryable path intact [20m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (seam chosen)
- [ ] All unit + snapshot tests passing
- [ ] Frozen legs byte-identical
- [ ] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Upstream schema**: See `../001-driver-leg-and-matrix-schema/`

<!-- /ANCHOR:cross-refs -->
