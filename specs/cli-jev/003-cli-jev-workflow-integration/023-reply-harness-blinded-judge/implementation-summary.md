---
title: "Implementation Summary: Phase 23: reply-harness-blinded-judge (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one read-only script that measures whether a Jev or Deem rubric score agrees with the operator's grades of masked reply-harness replies better than the mechanical scores. It was released on 2026-09-29 and waits on the operator's grades."
trigger_phrases:
  - "reply harness judge summary"
  - "reply harness judge status"
  - "judge-agreement planned"
  - "blinded judge results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned phase documents from research item R6"
    next_safe_action: "Released 2026-09-29 (parent goal D3): run T001, then T002"
    blockers:
      - "Label gate: 0 of 38 distinct masked replies graded by the operator"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-023-reply-harness-blinded-judge"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Who reads the agreement number, and what would a keep change"
      - "Should the blocking class be graded beside the seven dimensions"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 23: reply-harness-blinded-judge (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-reply-harness-blinded-judge |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, test, run or commit exists for it.

### Phase 23: reply-harness-blinded-judge

The plan adds `judge-agreement.mjs` (proposed) beside `.skilled/skills/sk-communication/benchmark/reply-harness/blind.mjs`. Its default run joins masked replies to their committed files, scores them with `score.mjs` unchanged and prints the mechanical baseline and a label gate of 20 operator-graded replies, with zero model calls. Past the gate, a Deem arm and a Jev arm, each behind its own switch and checks, ask one rubric `score` per reply and dimension and print one verdict per column under the Keep Rule in `spec.md` section 4. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R6 in `../001-deep-research/research/research.md` section 11 and the carried table in `../007-classifier-deep-research/research/research.md` section 12. The cited harness lines were reopened at the worktree HEAD, and the committed blind runs were counted: 42 masked files and 38 distinct replies. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. The build waits on 20 graded replies.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The baseline is the harness's own mechanical score | A judge earns its place only by agreeing with the operator more often than what the harness already computes for free |
| Replies join by text hash, not by the path in `order-sealed.json` | One committed sealed order names directories that now hold other replies, so a path join would score the wrong text |
| The sign test counts replies, not cells | The seven cells of one reply are not independent, so counting cells would overstate the evidence |
| A Deem `score` holds by its commit pair | A `score` has no option order to rotate, and the served model is deterministic (research C4) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase may close at its label gate.** No model writes a grade, so without the operator's grades no arm runs.
2. **The reply set is small.** 38 distinct replies answer 7 cases from 2 models, so a verdict describes this set only.
3. **Counts can drift.** The 42 and 38 are from 2026-09-29. The build recounts them at its own HEAD.
<!-- /ANCHOR:limitations -->

---
