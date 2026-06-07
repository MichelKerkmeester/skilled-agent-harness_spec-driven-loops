---
title: "Implementation Summary: sk-prompt-small-model README"
description: "The sk-prompt-small-model README now reads in the narrative voice and leads with the per-model prompt-craft hub and the craft-versus-mechanics split, with the wrong executor count and version corrected."
trigger_phrases:
  - "sk-prompt-small-model readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/019-sk-prompt-small-model-readme"
    last_updated_at: "2026-06-07T14:42:36Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-prompt-small-model README; Batch D 5 of 6"
    next_safe_action: "Begin phase 020 (sk-prompt README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-019"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All cited paths and both benchmark dirs resolve; executor count corrected to two plus optional; version dropped; minimax-2.7 marked historical; the framework map kept as a pattern"
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
| **Spec Folder** | 019-sk-prompt-small-model-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-prompt-small-model README now opens with a human pitch and an at-a-glance table, explains the different-models-want-different-prompts problem before the mechanism, and leads with the distinctive value: a per-model prompt-craft hub where you look up a model's framework, scaffold and gotchas before dispatch, then apply the executor mechanics from cli-devin or cli-opencode. Craft lives here, mechanics live in the executor.

### Narrative rewrite

HOW IT WORKS covers the navigation chain (resolve the model id, read the index, read the profile, follow to the executor mechanics), the per-model profiles, the framework map (RCAF default, TIDD-EC for MiniMax, COSTAR for MiMo), the registry the profiles mirror and the craft-versus-mechanics split. INTEGRATION lays out the four-way ownership: the hub, sk-prompt for the generic frameworks, the two cli-X executors for mechanics, and system-spec-kit for runtime. It is 196 lines and HVR-clean in prose.

### Corrections

The old README claimed prompt-craft cannot drift across "five executors". The hub actually dispatches through two active executors (cli-devin and cli-opencode) plus an optional third (cli-claude-code for haiku); the "five" confused the dispatch executors with the five CLI quality-card mirrors. The rewrite states two plus an optional third, drops the version line, keeps the framework map as a pattern rather than a pinned count, and marks minimax-2.7 as historical (only MiniMax-M3 is benchmark-backed).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-small-model/README.md` | Modified | Narrative-voice rewrite of the per-model prompt-craft hub README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both confirmed the framework map and the four-way ownership split from `model-profiles.json` and the profiles, and both found the same version and "five executors" drift. DeepSeek's draft was the stronger base. The host verified every cited path resolves (including the two benchmark directories), corrected the framework-map cell so minimax-2.7 is marked historical rather than benchmark-backed, and confirmed no version or "five executors" leaked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the craft-versus-mechanics split | It is the skill's defining architecture and the reason it exists |
| Correct "five executors" to two plus optional | The hub dispatches through cli-devin and cli-opencode, with cli-claude-code optional |
| Keep the framework map as a pattern, not a count | The model set drifts as models are added or retired |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| No "five executors", no version leak | PASS |
| All cited paths and both benchmark dirs resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None specific to this README.** The framework map, the ownership split and the registry were captured accurately, and the minimax-2.7 evidence nuance was corrected during the host merge.
<!-- /ANCHOR:limitations -->
