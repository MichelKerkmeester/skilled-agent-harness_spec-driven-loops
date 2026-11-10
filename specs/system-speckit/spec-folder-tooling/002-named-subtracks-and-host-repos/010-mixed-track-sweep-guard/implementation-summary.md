---
title: "Implementation Summary"
description: "The two packets left flat after Phase 008 now sit in the operator-selected sub-tracks. The sweep also fails a top-level track that still contains flat packets beside sub-tracks, with the packet names and a move instruction."
trigger_phrases:
  - "mixed track sweep guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/010-mixed-track-sweep-guard"
    last_updated_at: "2026-11-10T08:48:51Z"
    last_updated_by: "generate-context"
    recent_action: "Moved the last two flat packets into sub-tracks and added the mixed-track sweep check"
    next_safe_action: "Run the sweep on Barter specs before vendoring this version"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
    session_dedup:
      fingerprint: "sha256:db2e8a05e40b8024108dfdb003a1fcb431771723b6d7c37cb867bc8ce4abb188"
      session_id: "scaffold-010-mixed-track-sweep-guard"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "1dd4a9a8-36db-41ed-a4d5-da599d436310"
      workspace: "/Users/michelkerkmeester/worktrees/public/336-subtrack-gap-fixes"
      savedAt: "2026-11-10T08:48:51Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-mixed-track-sweep-guard |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The two flat packets now live inside their selected sub-tracks, and the sweep reports a mixed top-level track as an error. A correct children list can no longer hide flat packets beside sub-tracks from the sweep.

### Phase 10: mixed-track-sweep-guard

Phase 008 regrouped ten spec tracks into 39 sub-tracks but left two packets flat while another session edited them. On 2026-11-10 the operator saw `019-surface-consistency-research` beside four sub-tracks under `sk-code`, said this must not occur, then selected both packet destinations and the sweep-only guard.

`specs/sk-code/019-surface-consistency-research` moved to `specs/sk-code/code-surfaces/001-surface-consistency-research`. It first joined the sub-track as 006. The operator then asked for it to be first, so it became 001 and the five packets already there shifted to 002 through 006 (commit `e9cfd657d5`). `specs/hooks-plugins-extensions/028-sweet-search-integration` moved to `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration`. The first move rewrote 194 references in 26 files. The second rewrote 1940 references in 122 files. Nine `description.json` files were aligned, and the recheck found 0 of 2563 entries out of line. The repository now has 40 sub-tracks and no track mixes flat packets with sub-tracks.

`trackLayout(children)` in `runtime/cli/lib/track-roots.mjs` separates numbered packets from sub-tracks and returns `mixed` when both are present. The top-level sweep prints `    flat packets beside sub-tracks: <names>` for a mixed track, then prints `<n> track(s) hold flat packets beside sub-tracks; move each packet into a sub-track` and exits 1. Working-tree and `--rev` runs behave the same. A sub-track is not checked, and a track with no sub-tracks stays valid.

The shared fixture gained a flat option. Two clean-sweep tests now build without the flat packet, and a new test checks exit 1 and identical output in working-tree and commit runs. The docs describe the rule, the feature-catalog version is 2.0.7.0, and the skill and changelog are at version 2.12.46.0.

Later on 2026-11-10 the operator found `specs/hooks-plugins-extensions/026-context-paging` in the primary checkout. It held only an ignored copy of a reference clone. The packet itself lives at `specs/other/004-context-paging`. A search of the checkout found one more leftover, `specs/sk-communication`, with 90 ignored files from a track deleted in commit `122af3efd4`. The operator chose to delete both without a backup. The one file that existed only in the old clone, `npm.md`, was copied to the live clone first.

The sweep missed that folder because it only counts a numbered folder with a `spec.md`. In the working tree it now prints `<track>/<folder>: numbered folder without spec.md beside sub-tracks` for such a folder in a track with sub-tracks. The operator chose a warning, so the exit code does not change. The skill and changelog are at version 2.12.49.0, and the feature catalog at 2.0.8.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-code/019-surface-consistency-research` to `specs/sk-code/code-surfaces/001-surface-consistency-research` | Moved | Place the packet in the selected code-surfaces sub-track |
| `specs/hooks-plugins-extensions/028-sweet-search-integration` to `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration` | Moved | Place the packet in a new selected retrieval-integrations sub-track |
| Live reference files for both packet paths | Modified | Rewrite 194 references in 26 files and 1940 references in 122 files |
| Nine `description.json` files | Modified | Align the packet number or parent chain |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modified | Add the shared child-layout classifier |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | Fail mixed top-level tracks in working-tree and `--rev` runs |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs` | Modified | Add a flat packet option to the shared fixture |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Modified | Add mixed-track sweep coverage and update clean-sweep fixtures |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` and `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md` | Modified | Document the sweep guard and shared classifier |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Modified | Document the mixed-track rule and update the catalog version to 2.0.7.0 |
| `.skilled/skills/system-spec-kit/changelog/v2.12.46.0.md` | Created | Record the release changes |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Update the skill version to 2.12.46.0, then 2.12.49.0 |
| `.skilled/skills/system-spec-kit/changelog/v2.12.49.0.md` | Created | Record the leftover-folder warning |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The packet moves and path alignment were recorded in commit `06ac059b69`. The recheck found 0 of 2563 description entries out of line, and the repository sweep printed `all track roots match their declared children`. The operator selected Sweep only, so `create.sh` was left unchanged.

The mixed-track regression test checks both the working tree and a commit. Both cases exit 1, print the per-track and final messages, and produce identical output. The track-roots and archive-track test files report 89 passed and 0 failed. The track-roots file grew from 28 to 29 tests.

Strict validation reported 24 passed and 0 failed for sk-code and 37 passed and 0 failed for hooks-plugins-extensions. The markdown-link check reported 0 broken links, and `check_changelog_shape.py` printed PASS.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The operator selected both packet destinations | The two paths were chosen explicitly after the mixed layout was noticed |
| The guard runs in the sweep only | The operator chose Sweep only, so `create.sh` stays unchanged |
| The sweep checks top-level tracks only | Sub-tracks are never checked, and tracks with no sub-tracks remain valid |
| The Barter repository stays unchanged | The operator decides whether and when to move its flat packets |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Repository track-root sweep after the moves | PASS: `all track roots match their declared children` |
| Recheck of packet description metadata | PASS: 0 of 2563 entries out of line |
| Strict validation for sk-code | PASS: 24 passed, 0 failed |
| Strict validation for hooks-plugins-extensions | PASS: 37 passed, 0 failed |
| Markdown-link check | PASS: 0 broken |
| `track-roots.vitest.ts` and `archive-track.vitest.ts` | PASS: 89 passed, 0 failed. The track-roots file increased from 28 to 29 tests |
| Mixed-track working-tree and commit cases | PASS: both exit 1 and produce identical output with both messages |
| `check_changelog_shape.py` | PASS |
| Leftover-folder warning test | PASS: `track-roots`, `archive-track` and `create-track-refresh` report 116 passed, 0 failed. The new test fails with the change removed |
| Primary checkout after the deletions | PASS: no numbered folder beside sub-tracks lacks `spec.md`, and the sweep prints `all track roots match their declared children` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Barter will see three mixed tracks after it vendors this version.** The bartender track has two flat packets, barter-scrooge has six and gitops-development has two. The sweep will exit 1 until those packets move into sub-tracks. No Barter files changed, and the operator decides the follow-through.
<!-- /ANCHOR:limitations -->

---


