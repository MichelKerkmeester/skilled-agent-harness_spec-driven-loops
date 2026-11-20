---
title: "Implementation Summary: Phase 1: engine-out-of-tree-overlay-folder"
description: "The overlay engine now runs every command with the overlay folder beside the tree as ../<name>, so a consumer can keep its overlays outside the vendored copy, while an in-tree folder behaves as before."
trigger_phrases:
  - "sibling overlay folder shipped"
  - "engine out of tree overlay folder evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder"
    last_updated_at: "2026-11-20T11:35:02Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the sibling overlay folder"
    next_safe_action: "Start phase 002"
    packet_purpose: "Purpose: A consumer whose `.skilled-overlays.json` names `../<name>` runs status, apply, `--guard`, pre-commit, `--adopt`, `--capture`, `--relayout`, re-pin (live and `--stage`) and `repin --rollback` with the overlay folder beside the tree, while an in-tree folder behaves byte for byte as today."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs"
    session_dedup:
      fingerprint: "sha256:b03a1fb15e079dbc213a0ccc48525b3a5ccb6eb58d7a01ea5d63156956b38a78"
      session_id: "impl-001-engine-out-of-tree-overlay-folder"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0bdae7d5-3bdf-4448-b239-f0e7616d298a"
      workspace: "/Users/michelkerkmeester/worktrees/public/481-overlay-framework-root-layout"
      savedAt: "2026-11-20T11:35:02Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-engine-out-of-tree-overlay-folder |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`.skilled-overlays.json` can now name a folder beside the tree, `../overlays`. Status, apply, capture, adopt, `--guard`, pre-commit, relayout, re-pin, `repin --stage` and `repin --rollback` all work with that folder. An in-tree overlay folder behaves exactly as it did, and the starting suite still passes unedited.

### The sibling overlay folder

The engine accepts one parent segment and nothing deeper. It also refuses a sibling that resolves to the tree itself, whether through a case variant or a link. Every report prints the folder the way the setting names it, so a source reads `../overlays/<source>`.

A re-pin backup records the overlay folder's own files as `"area": "overlay"` entries, kept apart under `overlay-backup/`. Rollback restores each entry against the root its area names, and an older run folder rolls back as before. A stage copies the tree and the overlay folder side by side and writes nothing live. Pre-commit refuses an overlay folder outside the tree's git repository with exit 2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `resolveOverlayDir`, `writeBackup`, `rollbackUnderLock`, `stageFolderProblem` and the stage branch of `repinRun`, `stagedUnownedChanges`, `relayoutUnderLock` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` | Modified | `siblingOverlayFolder` option on `createWorkspace` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modified | Refusal test split into accept and refuse rows; link-to-tree and case-variant refusals |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Sibling status, `--json`, apply and capture cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Sibling live re-pin, rollback, stage, layout link and tampered-backup cases; the in-tree no-`area` case |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Sibling guard (including from outside the tree), adopt and both pre-commit layouts |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modified | Sibling relayout case |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | Modified | Sibling guard-core case; `overlay-guard.cjs` unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

1. Recorded the baselines (engine 203/203, guard 19/19) and the probe's exit-2 refusal.
2. Wrote the sibling tests first, in three parallel test lanes. Against the unchanged engine the whole suite was 228 tests: 211 passed and 17 failed. Every failure was a new sibling case, which was the negative control.
3. Made the engine changes in two sequential lanes: resolve plus backup and rollback, then stage, pre-commit and relayout.
4. A code review returned one P1, a tree-self refusal that compared spelling only, and two P2s. All three were fixed with negative tests. Removing the P1 fix made the two new tests fail again.
5. A re-review approved the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Overlay-area copies go in `overlay-backup/`, next to `backup/` | A tree path such as `overlay-manifest.json` at the tree root can never collide with an overlay file of the same name. |
| Sibling branches test `!isWithin(root, overlayRoot)` and leave the in-tree expressions as they were | In-tree runs keep their exact keys, backup format and pre-commit git path, so existing consumers see no change. |
| The tree-self refusal compares resolved paths as well as spelling | `../TREE` on a case-insensitive disk, or a link back to the tree, would otherwise make the overlay folder the tree. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | PASS: tests 238, pass 238, fail 0, exit 0 (baseline 203/203). `scratch/evidence/after-engine-suite.txt` |
| `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | PASS: 20/20, exit 0 (baseline 19/19) |
| Per-criterion runs | PASS: each exit 0. `scratch/evidence/after-per-criterion.txt` |
| `node -c overlay-engine.cjs` | PASS: exit 0 |
| No existing assertion removed (T019 `rg`) | PASS: printed nothing |
| No ephemeral label in added lines (CHK-011 `rg`) | PASS: printed nothing |
| Doctor docs, yaml and `overlay-guard.cjs` untouched (T021) | PASS: printed nothing |
| Probe tree with `../overlays` | Now reaches `no overlay manifest at ../overlays/overlay-manifest.json`, exit 2. `scratch/evidence/after-probe.txt` |
| Code review | APPROVED after one fix round; one P2 left open, listed below |
| `validate.sh --strict` on this folder and on the parent (recursive) | PASS: `RESULT: PASSED`, exit 0, for both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A dangling sibling link into the tree is accepted.** When `../<name>` is a link whose target inside the tree doesn't exist yet, `canonicalPath` falls back to the link's own path, so the refusal passes. The next run after the target folder appears refuses it. The review rated this P2. Refusing a sibling link whose target can't be resolved would close it.
2. **The case-variant refusal test skips on a case-sensitive disk.** It ran on macOS here; the Linux skip path wasn't exercised.
3. **Docs and workflow yaml still describe an in-tree folder only.** Phase 003 owns them.
<!-- /ANCHOR:limitations -->
