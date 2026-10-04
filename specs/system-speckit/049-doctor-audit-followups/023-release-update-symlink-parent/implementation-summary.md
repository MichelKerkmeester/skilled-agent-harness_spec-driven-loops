---
title: "Implementation Summary"
description: "/doctor:update now reports a release file below a local symlink as a symlink-parent conflict instead of aborting, and the update fixture no longer needs its workaround."
trigger_phrases:
  - "release update symlink parent summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/023-release-update-symlink-parent"
    last_updated_at: "2026-10-04T19:40:00Z"
    last_updated_by: "release-update-symlink-parent"
    recent_action: "Fixed the symlinked-parent crash and removed the fixture workaround"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".skilled/commands/doctor/scripts/tests/release-update.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "release-update-symlink-parent"
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
| **Spec Folder** | 023-release-update-symlink-parent |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A v4.0.0.0 install can check a newer release again. The one path it cannot read safely shows up as a conflict instead of stopping the whole run.

### Phase 23: release-update-symlink-parent

- **Read path.** `safeResolve` tags the symlinked-parent error, and `worktreeEntry` returns an unsupported entry marked `symlinkParent` for it. Writes still go through the unchanged guard.
- **Classification.** `classifyFile` reports that entry as `conflict` with `conflictKind: symlink-parent`. The plan records no local state for it, the recommendation is keep-local, and adopt-release is refused because the kind is not adoptable.
- **Fixture.** The fixture carries the fixed updater and the workaround commit is reverted, so `.skilled/changelog/sk-design` is a symlink again, as v4.0.0.0 ships it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `release-update.cjs` | Modified | Report symlinked parents on read |
| `release-update.test.cjs` | Modified | Regression test |
| `doctor-update-align.yaml` | Modified | keep-local only for the new conflict |
| Fixture commits `02e1efe7d5`, `17b5d43be3` (local) | Created | Updater overlay and workaround revert |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first: the new test failed at the check step on the old engine, then passed after the fix. A second reader, `withLocalContent` in align, surfaced when the test reached align, which is why the plan records no local state for the entry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Conflict, not an absent file | Treating the path as absent would make apply try to write through the link. A conflict shows the operator the case and only keep-local can answer it |
| keep-local as the only answer | Writing the release file would land in the link's target, outside the path the release names |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New regression test on the old engine | Failed at the check step, exit 1 |
| `release-update.test.cjs` after the fix | 73 of 73 pass |
| Fixture scoped checks, no workaround | `sk-code-webflow` customized, `sk-code-web-dev` local, `sk-git` conflict, `sk-code-obsidian` removed |
| Fixture unscoped check against `v4.0.0.2` | Exit 0, 5 `symlink-parent` conflicts in `directory:changelog` |
| Fixture apply and rollback round trip | 4 paths written, 4 restored, `skipped` empty, checksums and status match the committed state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A checkout that wants the release's folder must remove its symlink and run align again, since the engine never replaces a symlink with a folder on its own.
<!-- /ANCHOR:limitations -->

---
