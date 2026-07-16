---
title: "Implementation Summary: Renumber system-speckit active packets above the archive ceiling"
description: "Executed the system-speckit 001-016 -> 026-041 renumber (16 git mv renames + self-referential ref-repair + metadata regen) and the 026-029 untracked-stub removal. Validation error-count delta vs pre-rename baseline is 0."
trigger_phrases:
  - "system-speckit renumber active packets"
  - "system-speckit archive ceiling overlap"
  - "026-029 stub directory removal"
  - "spec-folder renumbering repair"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed 001-016 to 026-041 renumber"
    next_safe_action: "Commit and FF-push renumber to v4"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/specs/system-speckit/026-cmd-memory-output/"
      - ".opencode/specs/system-speckit/041-cmd-speckit-family-rename/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-executed"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Stub handling (REQ-001): operator approved delete-outright; the 4 untracked stubs (026-029, ~281M) were removed."
      - "Executor: ran a deterministic git mv + perl ref-repair script directly (not cli-codex) — see Key Decisions for the verified sandbox reason."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-system-speckit-renumber |
| **Completed** | Yes — renumber executed, committed + FF-pushed (a0991d173a) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 16 active system-speckit packets were renumbered from `001`-`016` to `026`-`041` (each keeping its own slug), so the active range now starts cleanly above the archive's `001`-`025` ceiling. The 4 stale untracked stub directories that squatted on the `026`-`029` prefixes were removed first. All work ran inside an isolated worktree off clean origin; nothing was touched outside `.opencode/specs/system-speckit/`.

### Executed Renumber (026-041) and Stub Removal

- **Stub removal (main tree):** the 4 untracked, mismatched-slug stub directories (`026`-`029`, ~281M of git-unrecoverable content) were deleted outright after explicit operator approval.
- **16 renames (worktree):** directory-level `git mv` for every row of the `001-016 -> 026-041` map, ascending-target order, each target slot confirmed empty first. `git status` shows 18,359 staged `R` renames.
- **Ref-repair:** every self-referential old-basename token (qualified `system-speckit/<old>` paths, bare `| **Spec Folder** |` rows, relative cross-packet links, `packet_pointer` values) rewritten to the new basename across `system-speckit/**`, excluding the `000` migration packet (which documents the map itself). 7,531 files edited; 0 qualified old-tokens remain.
- **Metadata regen:** `generate-description.js` + `backfill-graph-metadata.js` re-run for the 16 top-level packets (offline, root = worktree), clearing the `GENERATED_METADATA_INTEGRITY` signature invalidated by the in-place edits. No absolute paths leaked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `001-016 -> 026-041` (16 dirs) | `git mv` | Move active packets above archive ceiling; preserve rename history |
| ~7,531 files under `system-speckit/**` | Edit (ref-repair) | Rewrite self-referential old-basename tokens to new numbers |
| 16 `description.json` + 16 `graph-metadata.json` | Regenerate | Refresh generated metadata + integrity signature for new paths |
| 4 stub dirs (`026`-`029`) | `rm -rf` (main tree) | Remove untracked mismatched-slug residue occupying target range |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deterministic scripted execution in the isolated worktree `.worktrees/0055-skilled-migration-000-scaffold` (branch `skilled/0055-migration-000-scaffold`, based off clean origin). Phase A `git mv` (16 rows), Phase B `perl -i` full-basename ref-repair (file list from `grep -rlFI`, `000` packet excluded), Phase C metadata regen from the main tree's `dist/`. Verification ran from the main tree against the worktree paths (the worktree lacks `node_modules`/`dist`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Execute the 16 `git mv` renames in ascending target-number order | Sources (`001`-`016`) and targets (`026`-`041`) are disjoint ranges, so no target slot is ever double-occupied mid-sequence; rename detection stays clean. |
| Repair by full old-basename string, not just the qualified `system-speckit/<old>` token | A collision check proved all 16 basenames are unique prefixes, so a full-string replace safely supersets qualified paths, bare `Spec Folder` rows, and relative cross-packet links in one pass — the qualified-only pass would have left bare rows and relative links stale. |
| Exclude the `000` migration packet from ref-repair | Its `plan.md` documents the old→new map verbatim; rewriting old tokens there would corrupt the map. |
| Ran a deterministic local script instead of the plan-named cli-codex/GPT-5.6 executor | Verified friction, not assumed: the renumber requires the isolated linked worktree for concurrency safety, but a linked worktree's git index lives under the main repo's `.git/worktrees/…` — outside cli-codex's `--sandbox workspace-write` boundary, so `git mv` would be blocked; the only workaround (pointing codex at the main tree) would expose the live, dirty concurrent sk-doc migration to a semi-autonomous agent. The operation is fully deterministic (a `git mv` map + a scoped `perl` replace), so GPT-5.6 adds no reasoning value here. GPT-5.6/cli-codex is reserved for the authoring-heavy phases (005 sk-design reconstruction, 006 deep-research). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Renames staged as `R` | 18,359 `R` entries in `git status --porcelain` |
| Remaining qualified old-tokens (`system-speckit/(001-016)`, excl `000`) | 0 |
| Any file still containing an old top-level slug (excl `000`) | 0 |
| Number-line invariant | archive max `025` immediately followed by active min `026`; no `001-016` remaining; no gap |
| `validate.sh --recursive --strict` error-count delta vs pre-rename baseline | 0 (baseline 46 → post-rename 46 across the 16 packets) |
| Absolute-path leak in regenerated metadata | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deferred pre-existing drift (REQ-008).** `040-base-files-renumbering-name-cleanup` (was `015`) carries a `packet_pointer` to a deleted `skilled-agent-orchestration/z_archive/090-...` path — drift that predates this rename. It is part of the baseline's 46 errors (not a regression), so it was left untouched; its canonical pointer target is a separate decision. Flagged for follow-up.
2. **Metadata regen scoped to the 16 top-level packets.** Child folders' generated metadata was not regenerated because recursive validation showed children contribute 0 error-count delta (the integrity signature is enforced only at packet top level here).
3. **Not yet committed/pushed at time of writing.** The worktree holds the executed renumber; commit + FF-push to `skilled/v4.0.0.0` (rebase-on-race) is the next step.
<!-- /ANCHOR:limitations -->

---
