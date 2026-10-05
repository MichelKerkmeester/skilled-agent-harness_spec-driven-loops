---
title: "Implementation Summary"
description: "Three red checks on main were cleared by regenerating five derived files from their unchanged sources."
trigger_phrases:
  - "main ci regenerations summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/029-main-ci-regenerations"
    last_updated_at: "2026-10-05T13:00:00Z"
    last_updated_by: "main-ci-regenerations"
    recent_action: "Regenerated Hermes copies, the README manifest and two deep-loop contracts"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/commands/deep/assets/compiled/deep-review.contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "main-ci-regenerations"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-main-ci-regenerations |
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Main's CI is green again without touching a source file.

### Phase 29: main-ci-regenerations

- **Hermes copies.** `sk-create-changelog` and `sk-create-repo-rule` were rewritten from their sources after `accb58557c` edited them.
- **README manifest.** The frozen durable-directory list now includes `sk-create-repo-rule/scripts/rule-experiment-fixture`, a tracked directory added in `edba53daeb`.
- **Deep-loop contracts.** `deep/review` and `deep/research` record the current digests of the SKILL.md files `a46bd8c782` edited.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Two Hermes `SKILL.md` copies | Modified | Regenerated |
| `durable-directory-manifest.json` | Modified | One directory added |
| Two compiled contracts | Modified | Digests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure was reproduced locally before its generator ran, and each diff was checked to touch only generated content.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate rather than revert the source edits | Each source edit was deliberate; only its derived output was missing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hermes skill and prompt checks | PASS |
| Command tree parity | PASS |
| sk-doc script suite | PASS |
| Contract drift check | OK, 3 commands |
| Deep-loop contract test files | 42 of 42 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The same drift recurs whenever a source is edited without its generator; all three reached main past the commit hooks, so only CI caught them.
<!-- /ANCHOR:limitations -->

---
