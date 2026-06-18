---
title: "Implementation Summary: deep-research README"
description: "The deep-research README now reads in the narrative voice and leads with the autonomous research loop, externalized state and the convergence stop signal, with the stale version line and hard script count dropped."
trigger_phrases:
  - "deep-research readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/010-deep-research-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-research README"
    next_safe_action: "Begin phase 011 (deep-review README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 21 references, scripts and assets resolve; findings-registry named per SKILL.md canonical declaration; version line and hard script count dropped per template"
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
| **Spec Folder** | 010-deep-research-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-research README now opens with a human pitch and an at-a-glance table, explains the context-fatigue problem before the mechanism, and leads with the distinctive value: an autonomous loop that externalizes state to disk and dispatches a fresh LEAF agent per iteration, stopping on a convergence signal computed from the new-information ratio.

### Narrative rewrite

The README leads with the loop. HOW IT WORKS covers the iteration lifecycle (the command YAML owns dispatch, one LEAF per pass capped at roughly twelve tool calls), externalized state (config, JSONL log, strategy, registry, dashboard, the reducer-versus-agent ownership split) and convergence detection (the new-information ratio against a minimum-iterations floor, the quality gate and stuck recovery). It is 207 lines and HVR-clean in prose.

### Stale drift dropped

The old README carried a `1.14.0.0` version line that disagreed with the SKILL.md frontmatter and a Key Statistics block with a drifted script count. The rewrite drops both per the narrative template. The findings registry is named `deep-research-findings-registry.json` per the SKILL.md canonical declaration rather than the legacy short form in the config asset.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-research/README.md` | Modified | Narrative-voice rewrite of the research-loop README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats, both citing file evidence for the loop, the convergence model and the outputs. DeepSeek's draft was the stronger base. The host verified all 21 cited references, scripts and assets against the tree, confirmed the SKILL.md canonical registry name, and dropped the version line and hard script count per the template.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the autonomous loop and externalized state | That is the skill's distinctive value over a single-pass lookup |
| Drop the version line and hard script count | Both had drifted; the template carries neither |
| Name the registry `deep-research-findings-registry.json` | SKILL.md declares it the canonical name for sibling consistency |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| All 21 references, scripts and assets resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Findings-registry filename has source drift.** The config asset still emits the legacy short form (`findings-registry.json`) while SKILL.md declares the long form canonical. The README follows SKILL.md; reconciling the asset is out of scope for a docs-only phase.
<!-- /ANCHOR:limitations -->
