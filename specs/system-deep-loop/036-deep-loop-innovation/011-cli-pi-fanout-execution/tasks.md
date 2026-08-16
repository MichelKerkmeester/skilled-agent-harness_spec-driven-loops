---
title: "Tasks: cli-pi Fan-out Execution"
description: "Task breakdown for driving a non-streaming cli-pi lineage to completion in the deep-loop fan-out runner."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-16T14:33:41Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown across three phases"
    next_safe_action: "Operator approves approach, then run the REQ-001 diagnosis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-pi Fan-out Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` complete · `[B]` blocked/deferred (with reason)
- `[P]` parallelizable with siblings
- Each task names its verification.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] [P0] T001 — Reproduce the cli-pi review stall in the worktree and capture the `started`/`orphan_requeued` timing plus the Pi subprocess exit code and output size. Verify: a recorded timeline distinguishing fast empty-exit from premature-orphan.
- [ ] [P1] T002 — Read the orphan/stall/heartbeat detection in `fanout-run.cjs` and the cli-pi command builder; identify the exact liveness signal used. Verify: cited `file:line` for the requeue decision.
- [ ] [P0] T003 — Decide the mechanism (per-executor liveness allowance, `--mode json` streaming dispatch, or both) in `decision-record.md`. Verify: recorded decision with the diagnosis as evidence.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] [P0] T004 — Apply the chosen liveness fix so a live-but-silent cli-pi worker is not requeued while within its own timeout. Verify: `tsc`/syntax clean; unit test green.
- [ ] [P1] T005 — If streaming is chosen, add the `--mode json` dispatch to the cli-pi command builder and adapt output capture. Verify: a real Pi JSON run parses.
- [ ] [P0] T006 — Bound the allowance so a genuinely hung worker is still caught. Verify: negative-control test.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] [P0] T007 — Live cli-pi DeepSeek **review** lineage completes `fulfilled` with iterations, no requeue loop (REQ-002). Verify: orchestration-summary succeeded=1.
- [ ] [P1] T008 — The 010 write boundary holds on that run: zero out-of-scope reverts, zero real forbidden-tool runs (REQ-004). Verify: containment log + command-parse.
- [ ] [P0] T009 — Non-regression: a cli-opencode/codex fan-out lineage still completes clean (REQ-003). Verify: `fulfilled`, no new requeues.
- [ ] [P1] T010 — Live cli-pi DeepSeek **research** lineage completes (REQ-005). Verify: `fulfilled`.
- [ ] [P0] T011 — `validate.sh <spec-folder> --strict` Errors: 0; reconcile completion metadata. Verify: exit summary Errors: 0.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 requirements (REQ-001..003) satisfied with evidence.
- cli-pi review + research lineages complete `fulfilled` with no requeue loop.
- Streaming executors unaffected (T009).
- The 010 write boundary exercised via cli-pi and held (T008).
- `validate.sh --strict` Errors: 0; checklist verified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and success criteria
- `plan.md` — approach and phases
- `checklist.md` — QA verification
- `decision-record.md` — the liveness-tuning vs. streaming-dispatch decision (authored in Phase 1)

<!-- /ANCHOR:cross-refs -->
