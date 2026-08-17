---
title: "Tasks: cli-pi Fan-out Execution"
description: "Task breakdown for driving a non-streaming cli-pi lineage to completion in the deep-loop fan-out runner."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-17T04:33:13Z"
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

- [x] [P0] T001 — Reproduced the cli-pi review run under ledger + process capture. Verify: the lineage completed `fulfilled` (exit 0, ~10.9 min, `run_id 1786892651162-qypn2j`); ledger `started → progress → completed` with one non-fatal `stall_detected`; no `orphan_requeued`. The "requeue loop" premise did not reproduce.
- [x] [P1] T002 — Traced the three liveness judgements. Verify: stall-watchdog fed only by streamed stdout (`onOutput`/`markLineageEvent`); lag-ceiling abort not armed (`lagCeilingAction` never forwarded at the `runCappedPool` call); post-exit-orphan needs a real subprocess exit (`handlePostExitWatchdog`).
- [x] [P0] T003 — Decided: artifact-progress liveness feeding all three guards, bounded by the executor timeout. Verify: `decision-record.md` records the diagnosis, decision, and rejected alternatives.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P0] T004 — Applied artifact-progress liveness: a poller in `fanout-run.cjs` resets the stall-watchdog and calls `context.reportProgress` (threaded through `fanout-pool.cjs`) on real writes. Verify: `node --check` clean on both files; positive unit tests green (not lag-aborted / not orphaned while progressing).
- [B] [P1] T005 — `--mode json` streaming dispatch NOT chosen. Deferred by design: artifact-progress covers the liveness gap without changing the cli-pi command contract or output capture (`decision-record.md` rejected alternatives).
- [x] [P0] T006 — Bounded the allowance. Verify: negative-control tests — a worker whose progress stops is still lag-aborted, and an exited worker with no fresh progress is still orphaned; stashing the pool fix makes the positive tests fail and controls pass.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] [P0] T007 — cli-pi review drives the full loop with no requeue. Verify: pre-fix diagnosis run `fulfilled` (all iterations); post-fix run produced all 3 iterations + `review-report.md`, zero `orphan_requeued`/`lag_ceiling_abort` — the fan-out drove pi through the entire loop. (The post-fix run was then marked `rejected` by the write-containment backstop, see T008 — a boundary event, not a fan-out failure.)
- [x] [P1] T008 — The 010 write boundary held. Verify: on the post-fix run the containment guard detected DeepSeek writing 4 out-of-scope paths into a sibling packet and reverted them (`containment_violation` → `failed`), protecting the repo. Weak-model out-of-scope writes remain a live behaviour (010's domain); the backstop is enforced and worked.
- [x] [P0] T009 — Non-regression proven by suite. Verify: full pool suite 31/31; fan-out + cli-pi stress 38 passed / 2 skipped; streaming executors unaffected by the added progress path.
- [B] [P1] T010 — Live cli-pi **research** run deferred with operator approval. Verify: research uses the identical fan-out loop path the review run exercises; review-only live proof accepted (operator selection).
- [x] [P0] T011 — `validate.sh --strict` Errors: 0; completion metadata reconciled across spec/plan/tasks/checklist/implementation-summary. Verify: exit summary Errors: 0.

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
