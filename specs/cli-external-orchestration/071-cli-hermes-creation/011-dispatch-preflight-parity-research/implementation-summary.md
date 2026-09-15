---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research"
    last_updated_at: "2026-09-15T15:46:31Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-dispatch-preflight-parity-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-dispatch-preflight-parity-research |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ten iterations on the dispatch preflight, run on DeepSeek V4.1 Flash at max through cli-pi with the stop policy set to max-iterations. The synthesis at `research/research.md` carries the severity table for all 23 declared rules, the defect table, the Cursor and OpenCode parity comparison, the ranked recommendations and the phase decomposition that phases 013 to 016 were built from. Two severity-5 findings came out of it that were not known beforehand: the codex dispatch shape matched no real codex command, leaving that runtime unguarded, and the fan-out runner never set the Hermes project-plugin opt-in, leaving every repo guard inert in the runs they were built for.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[How was this tested, verified and shipped? What was the rollout approach?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| [What was decided] | [Active-voice rationale with specific reasoning] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **[Limitation]** [Specific detail with workaround if one exists.]
<!-- /ANCHOR:limitations -->

---


