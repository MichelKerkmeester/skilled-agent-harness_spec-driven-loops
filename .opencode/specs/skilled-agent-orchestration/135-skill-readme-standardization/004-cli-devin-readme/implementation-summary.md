---
title: "Implementation Summary: cli-devin README"
description: "The cli-devin README now reads in the narrative voice, leads with the family-unique cloud handoff and the four-model preset, and drops the stale version and reference count the old one carried."
trigger_phrases:
  - "cli-devin readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/004-cli-devin-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-devin README via the full recipe"
    next_safe_action: "Begin phase 005 (cli-opencode README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full recipe repeated; cloud handoff and four-model preset foregrounded; stale version/count dropped"
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
| **Spec Folder** | 004-cli-devin-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-devin README now opens with a human pitch and an at-a-glance table, explains the problem before the mechanism, and reads like a sibling of the other cli-* READMEs.

### Narrative rewrite

The README moved to the narrative skeleton with QUICK START showing the auth pre-flight and the default and complex-model dispatches, and HOW IT WORKS narrating the lifecycle, the self-invocation guard and its cloud-handoff exception, the local-to-cloud handoff, the four-model preset and the permission modes. It is 221 lines and HVR-clean.

### Distinctive value foregrounded

The rewrite leads with what makes cli-devin different from its siblings: the family-unique local-to-cloud handoff that returns a PR after you disconnect, and the four-model preset (swe-1.6 Free-tier default, deepseek-v4 primary-complex, glm-5.1 and kimi-k2.6 fallbacks).

### Stale facts dropped

The old README claimed version 1.0.2.0 (the skill is 1.0.13.0) and 5 references (the directory holds 10). The new template carries no version line and the rewrite cites the navigable references without a count, so both stale facts are gone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-devin/README.md` | Modified | Narrative-voice rewrite, cloud handoff and models foregrounded |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Iteration 1 gathered purpose, modes and invocation; iteration 2 verified flags, the model roster and stale facts, each cited to a file. All four seats flagged the same two stale facts. The host cross-read SKILL.md directly, synthesized a context report, then dispatched both models to draft. The host merged the two drafts, fixed one HVR slip and confirmed every cited path resolves.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the cloud handoff and four-model preset | These are the distinctive value the old README under-played |
| Drop the version line and reference count | The template carries no version, and a count drifts; both were stale in the old README |
| Merge MiMo's auth-first quick start with DeepSeek's richer HOW IT WORKS | Auth pre-flight belongs before the first dispatch, and DeepSeek had the fuller guard and permission-mode detail |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR scan (em dash, semicolon, Oxford-comma list) | PASS, clean after one semicolon fix |
| Stale version and count removed | PASS, no version line, no count |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The skill's reference directory has 10 files; the README links the navigable subset.** The README links the references a reader needs to navigate (cli_reference, integration_patterns, devin_tools, agent_delegation, cloud_handoff, the two deep-loop docs, and the two assets) rather than every file, by design.
<!-- /ANCHOR:limitations -->
