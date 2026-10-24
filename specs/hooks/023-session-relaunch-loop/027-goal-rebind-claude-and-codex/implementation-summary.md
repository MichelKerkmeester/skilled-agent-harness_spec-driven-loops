---
title: "Implementation Summary"
description: "Planned: a Claude or Codex receiver sets the hand-over goal from goal.md on the path the probes proved, or asks for the fenced slice."
trigger_phrases:
  - "goal rebind claude codex implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Planned the phase; nothing is built"
    next_safe_action: "Wait for the phase 024 verdicts, then record the baseline gate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-27-goal-rebind-claude-and-codex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-goal-rebind-claude-and-codex |
| **Completed** | Not completed |
| **Level** | 2 |
| **Status** | Draft |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and no file outside this folder has changed for it. A slice helper, the Claude receiver path and the Codex seed instruction will be built.

### Phase 27: goal-rebind-claude-and-codex

You will get a Claude or Codex receiver that has the sender goal set from `goal.md` after a hop, or asks for the fenced slice when automation is not proven. It sends nothing over the 4,000-character limit and nothing when the sender had no goal.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Planned | Not started | The file list lives in `spec.md` section 3. This table is filled when the work lands. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The plan is in `plan.md` and the ordered work is in `tasks.md`. Delivery notes are written here when the phase closes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Take the path the probes prove | A hook built on an unrun claim can fail without a sound |
| Send the slice from the file, never a pasted copy | A copy goes stale against `goal.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | Not run for the finished phase, because the phase is planned. The planning docs alone pass it with 0 errors. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The Claude path depends on a probe verdict, so the final shape is not known until phase 24 closes.
<!-- /ANCHOR:limitations -->

---
