---
title: "Implementation Summary"
description: "Planned, not built. This phase will score real session transcripts per runtime for command starts, the COMMAND token and loop init, against a pre-change run."
trigger_phrases:
  - "per runtime behaviour proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof"
    last_updated_at: "2026-11-12T20:58:41Z"
    last_updated_by: "generate-context"
    recent_action: "Planned phases 005 to 008 and started the phase 007 harness build"
    next_safe_action: "Run the smoke run and the before arm once the scorer and runner are built"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-runtime-behaviour-proof"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "fddcf466-8e1f-44cf-a132-6f846b676c18"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-12T20:58:41Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-per-runtime-behaviour-proof |
| **Completed** | Not completed. Planned 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and no task has run. When it is built, you will be able to see per runtime how often a model starts the command the advisor surfaced, before and after the binding phases, and whether a started heavy workflow ran its init.

### Phase 7: per-runtime-behaviour-proof

The plan adds a transcript scorer and a one-turn runner beside the routing-accuracy captures, a lead-phrase word check in the bridge deriver and, only if phase 006 left it out, a once-per-command clause in the Gate 2 bullet. It also confirms why Claude Code lists one `create` entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The planned files are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The order is in `tasks.md`: setup, then the code and the pre-change arm before phase 005 lands, then the post-change and started-command arms after phase 006.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 2 over the helper's Level 1 | The brief requires `acceptance-criteria.md`, and every sibling phase is Level 2 |
| Score from each runtime's session store | One normalizer serves six runtimes through the existing readers (plan ADR-001) |
| All six runtimes, a pre-change arm on today's branch tip, chat-user runs and the kept lead phrase | The operator's answers of 2026-11-12, quoted in `spec.md` section 10 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder at planning time | Recorded in the planner's reply |
| G5 listing result | Not run. T020 writes it here |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cursor cannot be measured.** Its session reader is gated until preCompact delivery is proven. The summary reports it as not measured.
2. **Two locators are unconfirmed.** Pi and Devin session ids come from the T022 smoke run, so their rows may change before the arms run.
<!-- /ANCHOR:limitations -->

---
