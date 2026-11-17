---
title: "Implementation Summary: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "Implementation has not started. Only the setup task T001 is done: the operator chose on 2026-11-17 to cap council seat outputs at 3 per council attempt, with at most one retry per pivot."
trigger_phrases:
  - "pivot hygiene implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene"
    last_updated_at: "2026-11-17T16:56:43Z"
    last_updated_by: "generate-context"
    recent_action: "13 build phases authored; decisions recorded"
    next_safe_action: "Plan and build 001-completed-run-extension"
    packet_purpose: "Purpose: The seat cap has the scope the operator chose, the dead guard no longer pretends to protect anything, and a transient council quorum failure gets exactly one retry inside the seat budget."
    blockers: []
    key_files:
      - "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "operator-decision-012-pivot-hygiene"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "94a4cf06-5c71-4a49-952f-6bbffe1f9b56"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T16:56:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-pivot-hygiene |
| **Completed** | Not complete. Setup task T001 done 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No runtime code has changed yet. The operator decided ADR-001 on 2026-11-17 in two steps (OD-001 and OD-002), and that decision is recorded in `decision-record.md`, which unblocks the implementation tasks in `tasks.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` | Modified | ADR-001 Accepted with the operator's choices and two Operator Decisions rows |
| `plan.md`, `tasks.md`, `spec.md` | Modified | The rejected option's branch removed, the retry given its own 3 seats; T001 marked done |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The decision was recorded in the spec documents only. No code was written, and nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cap council seat outputs per pivot, 3 per council attempt, with at most one retry per pivot on a quorum failure, so one pivot uses at most 6; `maxPivots: 3` still caps the run. "Council" is divergent mode's internal three-seat vote in `runtime/lib/deep-loop/divergent-pivot.ts`, not the deprecated ai-council mode. | A failed or resumed pivot no longer shrinks later pivots, and the retry fits because it gets its own 3 seats. The run ceiling rises from 9 to 18 seat outputs. A lifetime cap shared across pivots was rejected. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n 'Accepted' decision-record.md` | Prints the ADR-001 status line |
| Runtime suites | Not run yet; T002 captures the baseline |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No runtime change yet.** `divergent-pivot.ts` is untouched until T003 lands.
<!-- /ANCHOR:limitations -->

---
