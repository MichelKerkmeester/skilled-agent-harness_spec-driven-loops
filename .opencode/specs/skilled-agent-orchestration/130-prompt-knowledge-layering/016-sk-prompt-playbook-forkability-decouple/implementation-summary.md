---
title: "Implementation Summary: sk-prompt-playbook-forkability-decouple"
description: "The sk-prompt manual-testing-playbook no longer references sk-prompt-small-model or cli skills; two card-centric scenarios were reframed to test sk-prompt's own surface."
trigger_phrases:
  - "playbook decouple summary"
  - "forkability summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/016-sk-prompt-playbook-forkability-decouple"
    last_updated_at: "2026-06-03T14:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Playbook decoupled; scenarios reframed; changelog written"
    next_safe_action: "Commit phase 016 (file-precise)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md"
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
| **Spec Folder** | 016-sk-prompt-playbook-forkability-decouple |
| **Completed** | 2026-06-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-prompt manual-testing-playbook is now self-contained. A standalone fork of sk-prompt runs
its playbook clean, with no dependence on the model-craft hub or the cli skills.

### Two escalation scenarios reframed to sk-prompt's own surface

`SP-023` and `SP-024` used to test the CLI prompt-quality card, which left sk-prompt for the hub in
phase 013. `SP-023` now verifies a low-complexity prompt passes sk-prompt's CLEAR check inline
without dispatching `@prompt-improver`, anchored on `references/patterns_evaluation.md`. `SP-024`
now verifies a high-risk prompt escalates to `@prompt-improver`, anchored on `SKILL.md` §7 contract
and §4 ESCALATE IF. Both `rg` test steps target sk-prompt's own files and resolve.

### Every hub-card reference repointed or removed

The remaining card references in `SP-019`, `SP-021`, `SP-025`, `SP-026` were removed (redundant with
adjacent sk-prompt rows) or repointed to `SKILL.md` §7. The root playbook lost the card from its
coverage note, Realistic Test Model, Global Preconditions disk-resolution list, and §12/§15
descriptions. The stale `§8 fast-path asset` reference (phase 014 removed that section) now points
at `§7`, and the `cli-*` names in the wave-planning rules were genericized.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `manual_testing_playbook.md` | Modified | Coverage, test model, preconditions, §12/§15, cli genericization |
| `06--escalation-tiers/023-...md` | Modified | Reframed to sk-prompt inline CLEAR fast path |
| `06--escalation-tiers/024-...md` | Modified | Reframed to sk-prompt `@prompt-improver` escalation |
| `06--escalation-tiers/025-...md`, `026-...md` | Modified | Hub-card source refs repointed/removed |
| `05--framework-selection/019-...md`, `021-...md` | Modified | Redundant hub-card source refs removed |
| `SKILL.md` | Modified | Version 2.1.3.0 |
| `changelog/v2.1.3.0.md` | Created | Decouple changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only forkability audit found the dependencies and classified them (hard `rg`/assertion vs
soft source-ref). Because the hub has no playbook, moving the card-centric scenarios was
impractical, so they were reframed to test sk-prompt's own observable behavior using sk-prompt's own
docs as anchors. Verification: a token grep returns 0 for `sk-prompt-small-model`,
`cli_prompt_quality_card`, and every `cli-*` skill; all 37 `rg` targets in the playbook point only at
`sk-prompt/`; the reframed targets resolve (33 CLEAR matches, all 4 escalation terms); and
`validate_document.py` reports VALID on the root playbook plus all six touched feature files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reframe SP-023/024, do not remove | The behaviors (inline CLEAR pass, escalate to @prompt-improver) are observable from sk-prompt's own docs; removal would gut a coherent category and a critical-path scenario. |
| Anchor on sk-prompt's own docs | patterns_evaluation.md holds CLEAR; SKILL.md §7 holds the @prompt-improver contract -- the real owners of the tested behavior. |
| Keep the `023-cli-card-...` filename slug | Renaming would churn the §12 + §15 catalog links for a cosmetic gain; the title and content are reframed. |
| Genericize cli-* operational mentions | They named example parallel workers, not a hard dependency, but a fork should not reference sibling skills. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Token grep (sk-prompt-small-model / cli_prompt_quality_card / cli-*) | PASS, all 0 |
| All rg targets point only at sk-prompt/ | PASS, 37/37 |
| Reframed rg targets resolve | PASS, 33 CLEAR matches; 4 escalation terms |
| `validate_document.py` on root + 6 feature files | PASS, all VALID |
| `validate.sh --recursive --strict` (130 parent) | PASS, 0 errors 0 warnings |
| card-sync guard | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Filename slug retained.** `023-cli-card-five-question-fast-path.md` keeps its card-era slug; only the title and content were reframed. Renaming was skipped to avoid catalog-link churn.
2. **Hub has no playbook.** The CLI card's own fast-path behavior is no longer tested anywhere; if that coverage is wanted, the hub (`sk-prompt-small-model`) needs its own playbook -- a separate follow-up, out of this phase's scope.
<!-- /ANCHOR:limitations -->
