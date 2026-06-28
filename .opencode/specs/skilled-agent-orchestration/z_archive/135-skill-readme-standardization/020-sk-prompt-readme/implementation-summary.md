---
title: "Implementation Summary: sk-prompt README"
description: "The sk-prompt README now reads in the narrative voice and leads with the prompt-engineering engine (seven frameworks, DEPTH thinking, CLEAR scoring), closing Batch D."
trigger_phrases:
  - "sk-prompt readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/020-sk-prompt-readme"
    last_updated_at: "2026-06-07T14:57:42Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-prompt README; Batch D complete (6 of 6)"
    next_safe_action: "Begin phase 021 (system-code-graph README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-020"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All cited paths resolve; version dropped; modes described not counted; registry framed as a 5-of-7 subset; CLEAR floors filled; one em dash and two Oxford-list commas fixed in the merge"
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
| **Spec Folder** | 020-sk-prompt-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-prompt README now opens with a human pitch and an at-a-glance table, explains the vague-prompt problem before the mechanism, and leads with the distinctive value: a prompt-engineering engine that auto-selects from seven frameworks, runs a five-phase DEPTH thinking pass and scores the output with CLEAR so a prompt ships only when it clears the threshold.

### Narrative rewrite

HOW IT WORKS covers framework selection (scoring against task characteristics), the DEPTH phases (Discover, Engineer, Prototype, Test, Harmonize), the CLEAR rubric (Correctness 10, Logic 10, Expression 15, Arrangement 10, Reusability 5, pass at 40 with per-dimension floors) and the operating modes (interactive, text, short, improve, refine, json, yaml, raw). INTEGRATION states the boundary with sk-prompt-models (which chooses which framework a small model wants) and the cli-X executors (mechanics). It is 220 lines and HVR-clean in prose.

### Corrections

The rewrite drops the version line, describes the modes rather than pinning a count (the docs disagree on eight versus nine because `$deep`/`$d` and `$s` aliases live in the references but not the SKILL.md mode table), frames `framework-registry.json` as a five-of-seven code-oriented subset (the full definitions live in `patterns_evaluation.md`), and uses mode-driven round counts rather than the stale "5 to 10 rounds" phrasing. During the host merge, one em dash in the example output block and two Oxford-list commas were fixed, and the CLEAR floor column was filled with the verified values.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/README.md` | Modified | Narrative-voice rewrite of the prompt-engineering engine README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both confirmed the framework set, the DEPTH phases and the CLEAR rubric, and both flagged the registry-subset and mode-count drift. DeepSeek's draft was the stronger base. The host verified every cited path resolves, fixed one em dash and two Oxford-list commas, filled the CLEAR floor values from the verified rubric, and confirmed the registry is framed as a subset.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the framework / DEPTH / CLEAR pipeline | It is the engine's distinctive value and quality contract |
| Frame the registry as a five-of-seven subset | It holds only code-oriented scaffolds; the definitions live in patterns_evaluation.md |
| Describe the modes rather than pin a count | The docs disagree on eight versus nine |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean (one em dash and two Oxford commas fixed) |
| No version; registry framed as subset; round counts mode-driven | PASS |
| All cited paths resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None specific to this README.** The frameworks, DEPTH, CLEAR and modes were captured accurately, and the registry-subset nuance was clarified during the host merge.
<!-- /ANCHOR:limitations -->
