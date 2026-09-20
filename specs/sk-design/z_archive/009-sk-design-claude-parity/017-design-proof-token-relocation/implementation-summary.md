---
title: "Implementation Summary"
description: "design_proof_token.md now lives in shared/ alongside its cross-cutting siblings; all 8 live citations across 2 skills repointed, references/ folder removed, D5 connectivity confirmed clean."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 017 implementation summary"
  - "design proof token relocation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/017-design-proof-token-relocation"
    last_updated_at: "2026-07-07T04:26:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks done"
    next_safe_action: "Commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/skills/sk-design/shared/design_proof_token.md"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-proof-token-relocation-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-design-proof-token-relocation |
| **Completed** | 2026-07-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-design`'s hub root had a `references/` folder holding exactly one file, `design_proof_token.md`, while every other cross-cutting design doc already lived flat in `shared/` — visible directly in `hub-router.json`'s own `defaultResource` list, where 3 of 4 entries were `shared/*.md` and the fourth was this one outlier. Before moving anything, a repo-wide grep confirmed the file is very much alive: wired into `hub-router.json`'s `routerPolicy.defaultResource`, cited by two `shared/assets/*.md` proof cards, and cross-referenced from four `mcp-open-design` docs (two with `#anchor` fragments into specific sections). The file was moved via `git mv` (history-preserving), all 8 live citation points across the 2 skills were repointed, and the now-empty `references/` folder was removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/references/design_proof_token.md` | Moved (`git mv`) | -> `.opencode/skills/sk-design/shared/design_proof_token.md` |
| `.opencode/skills/sk-design/references/` | Removed | Now-empty folder |
| `.opencode/skills/sk-design/hub-router.json` | Edited | `defaultResource` path repointed; version 1.2.0.0 -> 1.2.1.0 |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Edited | `../../references/` -> `../` |
| `.opencode/skills/sk-design/shared/assets/context_loaded_card.md` | Edited | `../../references/` -> `../` |
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Edited | `sk-design/references/` -> `sk-design/shared/` |
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Edited | Same segment fix (2 occurrences) |
| `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` | Edited | Same segment fix, `#2-field-schema-v1` anchor preserved |
| `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` | Edited | Same segment fix (2 occurrences), `#4-digest-canonicalization` anchor preserved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A repo-wide grep for `design_proof_token` ran BEFORE touching anything, confirming 8 live citation sites across the two skills (not the orphaned file the folder layout suggested). The file's own content was read in full to confirm it had no internal relative markdown links that the move would break (its JSON example cites repo-absolute paths, not relative links). `git mv` relocated the file, a targeted `sed` substitution fixed the 6 cross-skill occurrences in one pass (the relative depth to `sk-design/` is unchanged since `references/` and `shared/` are siblings, so only the trailing segment needed to change), and the 3 in-skill citations were edited individually since their relative depth DID change (2 levels up -> 1 level up, now that the citing files and the target both sit under `shared/`). A second repo-wide grep afterward confirmed zero live stale hits, and a router-mode skill-benchmark re-run confirmed the D5 connectivity gate still passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `git mv` instead of delete + recreate | Preserves the file's git history/blame instead of starting it over as a "new" file |
| Left changelog/review/closed-phase mentions of the old path untouched | Those are point-in-time historical records of what was true when they were written (like a changelog entry or git commit message) — retroactively editing them would misrepresent history, not fix a live pointer |
| Used a plain `sed` segment substitution for the 6 cross-skill occurrences | The relative depth (`../../sk-design/`) is identical before and after since `references/` and `shared/` are both direct children of `sk-design/`; only the trailing folder segment changes, so a targeted substitution is safer than hand-editing 4 files individually |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repo-wide grep for `design_proof_token` (before) | 8 live citation sites found across 2 skills (confirms NOT orphaned) |
| Repo-wide grep for `design_proof_token` (after) | 0 live hits; only pre-existing changelog/review/closed-phase historical mentions remain, left untouched by design |
| `hub-router.json` JSON parse | PASS |
| Router-mode skill-benchmark re-run | verdict PASS, aggregate 100/100, D5 connectivity 100/100 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live-mode benchmark re-run.** Verification used the fast, deterministic router-mode connectivity gate only; a full live-mode re-run (dispatching through `cli-opencode`) was not repeated for this small, structural-only change since router mode's D5 gate is the specific check that catches broken/orphaned reference paths.
<!-- /ANCHOR:limitations -->
