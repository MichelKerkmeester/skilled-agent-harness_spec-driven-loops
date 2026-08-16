---
title: "Verification Checklist: cli-pi Fan-out Execution"
description: "QA verification for driving a non-streaming cli-pi lineage to completion."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-16T14:33:41Z"
    last_updated_by: "claude"
    recent_action: "Authored the QA checklist for the cli-pi fan-out fix"
    next_safe_action: "Operator approves approach, then run the REQ-001 diagnosis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-pi Fan-out Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` only with cited evidence. A finding is a hypothesis until confirmed against the real symptom.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] [P0] The stall is reproduced and the requeue trigger characterized with real timestamps.
- [ ] [P1] The liveness signal used by the orphan/stall detection is cited by `file:line`.
- [ ] [P0] The mechanism (liveness allowance / streaming dispatch / both) is decided with rationale.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] [P0] A live-but-silent cli-pi worker is not requeued while within its own timeout.
- [ ] [P1] `tsc --noEmit` / syntax clean on the changed files.
- [ ] [P1] The change is executor-aware, not a blanket disable of orphan/stall detection.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] [P0] Unit test: a cli-pi lineage with a live worker is not requeued.
- [ ] [P0] Negative control: a genuinely hung worker is still caught.
- [ ] [P0] Live cli-pi DeepSeek review lineage completes `fulfilled` with iterations.
- [ ] [P1] Live cli-pi DeepSeek research lineage completes.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] [P0] Streaming executors (opencode/codex) still complete clean — no regression.
- [ ] [P1] The 010 write boundary holds on the cli-pi run: zero out-of-scope reverts.
- [ ] [P1] No real forbidden-tool runs by DeepSeek on the completed cli-pi run.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] [P1] The liveness allowance is bounded by the executor timeout, not by disabling detection.
- [ ] [P0] Live runs ran in an isolated worktree with a recorded recovery baseline (RM-8).
- [ ] [P1] write-containment remains the enforced backstop, unchanged.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] [P1] `decision-record.md` records the chosen mechanism with the diagnosis.
- [ ] [P1] `implementation-summary.md` records final state + the live-run evidence.
- [ ] [P2] The 010 packet's Known Limitations is updated once cli-pi runs the loops.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] [P1] Changes scoped to the fan-out runner / cli-pi builder / executor-config; no unrelated edits.
- [ ] [P2] No task-created residue in the scoped diff.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] [P0] `validate.sh <spec-folder> --strict` Errors: 0.
- [ ] [P0] All P0 requirements satisfied with evidence.
- [ ] [P1] Completion metadata reconciled across spec/plan/tasks/checklist/implementation-summary.

<!-- /ANCHOR:summary -->
