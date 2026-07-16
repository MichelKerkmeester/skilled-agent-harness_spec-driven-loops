---
title: "Implementation Summary: card-relocation-and-guard"
description: "Relocated the canonical cli_prompt_quality_card.md from sk-prompt to the sk-prompt-models hub, repointed ~15 consumer references plus the card's own links, cleaned sk-prompt's graph-metadata, and updated the sync guard's canonical path so sk-prompt is now a forkable generic engine."
trigger_phrases:
  - "card relocation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/013-card-relocation-and-guard"
    last_updated_at: "2026-06-03T11:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 013 content complete + verified"
    next_safe_action: "Validate, commit, push; spec 130 phases 010-013 complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 013-card-relocation-and-guard |
| **Completed** | 2026-06-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI-dispatch quality card no longer sits inside the generic framework engine, and sk-prompt is now forkable.

### The card lives with the hub
`cli_prompt_quality_card.md` moved (git rename) from `sk-prompt/assets/` to `sk-prompt-models/assets/`. The hub already owns the per-model profiles + registry, so the cross-CLI card belongs there. sk-prompt now carries only generic, fork-portable knowledge: the 7-framework definitions, CLEAR, DEPTH, format guides, and the framework registry.

### Everything that pointed at the card was repointed
The five cli SKILL.md, the five cli cards, the hub SKILL.md, and `cli-devin/references/context-budget.md` (~15 references) now point at the hub. The card's own outbound links to the framework definitions were repointed to `../../sk-prompt/references/`. sk-prompt's `graph-metadata.json` was cleaned of the card (the `enhance_when` rule, the key_files entry, the entity, the source_docs entry).

### The guard follows the card
`check-prompt-quality-card-sync.sh` is path-agnostic in its logic (it checks the five cli card filenames, table-absence, and SKILL.md pointers), so only its header canonical-location comment needed updating. CHECK 1-4, the pre-commit orchestrator, and the CI workflow are unchanged and green against the relocated card.

### Files Changed
| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt/assets/cli_prompt_quality_card.md` → `sk-prompt-models/assets/` | Renamed | Card relocated to the hub |
| `sk-prompt-models/SKILL.md` | Modified | §5 card ref → local; version 0.7.2.0 |
| `sk-prompt-models/assets/cli_prompt_quality_card.md` | Modified | Own framework-def links → `../../sk-prompt/references/` |
| 5 cli SKILL.md + 5 cli cards + `cli-devin/references/context-budget.md` | Modified | Card pointer → the hub |
| `sk-prompt/SKILL.md` + `graph-metadata.json` | Modified | Card removed; version 2.1.0.0; forkable-clean |
| `system-skill-advisor/...check-prompt-quality-card-sync.sh` + `SKILL.md` | Modified | Canonical-path comment; version 0.6.0 |
| 3 changelogs (hub, sk-prompt, advisor) | Created | Per-skill records |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The full ripple was mapped first (consumers, the card's own links, the guard's path, sk-prompt's graph-metadata), then the card was `git mv`'d, the 11 cli-* consumers repointed by a sibling path swap, and the special cases (hub SKILL.md local ref, the card's own links, the guard comment, the four graph-metadata spots) hand-edited. Verified: guard green, no active file references the old path, the card and its links resolve, and sk-prompt's graph-metadata is valid and card-free.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Card → the hub (single canonical) | The hub owns the per-model craft; the cross-CLI card belongs with it, not in the forkable generic engine |
| Guard comment-only change | The guard's logic keys on filenames + table-absence, not the canonical path, so the move did not break it |
| No version bump for the 5 cli skills | Their change is a mechanical pointer repoint; the move is recorded in the hub + sk-prompt changelogs |
| Card's framework-def links → sk-prompt | Framework definitions stay in sk-prompt; the card delegates to them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Card relocated; git tracks a rename; sk-prompt card-free | PASS |
| No active skill file references the old sk-prompt card path | PASS |
| Card + its links resolve; sk-prompt graph-metadata valid + card-free | PASS |
| card-sync guard green (canonical path updated) | PASS |
| validate.sh --recursive --strict | (run at commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 5 cli skills' card-pointer repoint is committed without a version bump.** It is a mechanical consequence of the move, recorded in the hub + sk-prompt changelogs; bumping five versions for a path swap would be noise.
2. **Derived graph-metadata across skills was hand-corrected for sk-prompt only.** A future advisor re-index will regenerate the rest; the hub gaining the card as a key_file is left to that re-index.
<!-- /ANCHOR:limitations -->
