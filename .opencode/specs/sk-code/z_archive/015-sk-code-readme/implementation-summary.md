---
title: "Implementation Summary: sk-code README"
description: "The sk-code README now reads in the narrative voice and leads with the surface-aware router, the five gated phases and the Iron Law, with MOTION_DEV corrected from a surface to a cross-stack resource intent."
trigger_phrases:
  - "sk-code readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-readme"
    last_updated_at: "2026-06-07T14:07:55Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-code README; Batch D 2 of 6"
    next_safe_action: "Begin phase 017 (sk-doc README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All cited paths resolve; MOTION_DEV corrected to a resource intent (2 surfaces + UNKNOWN); five gated phases distinguished from the four-axis routing; version, LOC and intent count dropped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-sk-code-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code README now opens with a human pitch and an at-a-glance table, explains the one-generic-skill-cannot-serve-many-stacks problem before the mechanism, and leads with the distinctive value: a single code-work skill that detects which surface it is in (WEBFLOW or OPENCODE, with an UNKNOWN fallback), loads that surface's standards, runs five gated phases and enforces the Iron Law so nothing is called done without fresh surface verification evidence. It also frames sk-code as the one skill end users customize for their own stack.

### Narrative rewrite

HOW IT WORKS covers surface detection and the OPENCODE-over-WEBFLOW precedence, the intent routing, the five gated phases (Research, Implementation, the Code Quality Gate, Debugging, Verification) and the Iron Law, with the per-surface verification commands. QUICK START shows surface detection and a verification command. The table of contents is gone. It is 198 lines and HVR-clean in prose.

### MOTION_DEV corrected

The old README presented MOTION_DEV as a third surface and a valid surface-override value. SKILL.md and the reference docs define only two surfaces (WEBFLOW, OPENCODE) plus an UNKNOWN fallback, with MOTION_DEV a cross-stack resource intent loaded after surface detection. The rewrite corrects this throughout. It also stops conflating the four-axis routing model with the five-phase lifecycle, and drops the version line, the line count and the intent count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/README.md` | Modified | Narrative-voice rewrite with the MOTION_DEV and phase corrections |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both independently found that MOTION_DEV is not a surface and that the README miscounts surfaces and phases, and both confirmed it against `description.json` (the supported_surfaces array holds only WEBFLOW and OPENCODE). The host pinned the corrected model in the context report and forbade the surface framing in the authoring prompt. DeepSeek's draft was the stronger base. The host verified every cited path resolves and confirmed the draft carries no "third surface" framing and no version leak.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct MOTION_DEV to a resource intent | The README was materially wrong; readers would expect a surface that does not exist |
| Lead with the router, the phases and the Iron Law | That is the skill's distinctive value and its core safety property |
| Drop the version, line count and intent count | The docs disagree on version and the counts drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| MOTION_DEV framed as a resource intent (no "third surface"); no version leak | PASS |
| All cited paths resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None specific to this README.** The surface model, the phases and the verification commands were captured accurately, and the MOTION_DEV correction was cross-checked against `description.json`.
<!-- /ANCHOR:limitations -->
