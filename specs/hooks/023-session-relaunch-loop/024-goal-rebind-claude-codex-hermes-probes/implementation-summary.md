---
title: "Implementation Summary"
description: "Planned: four recorded probes settle whether a hop can set a goal on Claude, Codex and Hermes, and pick the build path for phase 27."
trigger_phrases:
  - "goal rebind probes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Planned the phase; nothing is built"
    next_safe_action: "Ask the operator about bypass flags, then run probe A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-24-goal-rebind-claude-codex-hermes-probes"
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
| **Spec Folder** | 024-goal-rebind-claude-codex-hermes-probes |
| **Completed** | Not completed |
| **Level** | 2 |
| **Status** | Draft |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and no file outside this folder has changed for it. Four recorded probes and a verdict table will be built.

### Phase 24: goal-rebind-claude-codex-hermes-probes

You will get four recorded runs, each with a control that could have shown the opposite. Their verdicts decide whether phase 27 sends the goal from a start hook, from the start prompt, or by asking the receiver to send the fenced slice the GOAL POSTURE RULE already requires.

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
| Probe before building | The design rests on four claims read from code and docs, and a hook built on an unrun claim can fail without a sound |
| Run each probe with a control | A run that comes out the same whether the claim is true or false confirms nothing |
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

1. A probe shows behavior on this machine and these runtime versions only. A runtime update can change it, so each record names the version.
<!-- /ANCHOR:limitations -->

---
