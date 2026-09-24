---
title: "Feature Specification: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list"
description: "archive.sh sent a track packet to the root specs/z_archive/, restored it to the specs root rather than its track, and left the track root's children_ids stale, which the pre-push track-root gate then blocks. Every track here archives into its own z_archive/ by hand, and the script's list could not see those archives."
trigger_phrases:
  - "track-aware archive"
  - "archive.sh track"
  - "restore to track"
  - "track z_archive"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`archive.sh` knew one archive, `specs/z_archive/`. It moved a track packet there, out of its track, and restored any packet to the specs root rather than to the track it came from. It never touched the track root's `children_ids`, so after either move the pre-push track-root gate blocked the next push. Every track in this repository archives into its own `specs/<track>/z_archive/` by hand, 268 packets across ten tracks, and `--list` could not see one of them: this repository has no root archive, so the script reported nothing archived.

### Purpose
Archiving and restoring a track packet keeps it inside its track, and the track's list follows the move, so the gate has nothing to block.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Archive a packet that sits directly in a track into that track's own `z_archive/`, and keep the root archive for a packet at the specs root
- Restore from a track's `z_archive/` back into the track, and from the root archive back to the specs root
- Refuse to archive a folder under any `z_archive/`, and refuse to restore a folder that is in no archive
- List every archive's entries by the path that restores them, leaving out symlinked tracks
- Refresh the track root's `children_ids` after both moves, and warn when the writer is missing or fails
- Tests, mutation runs, and the docs that describe the script

### Out of Scope
- A phase child still archives to the root `specs/z_archive/` - the script has always done this, and no track archives a single phase on its own
- Symlinked tracks - their packets resolve outside this specs root, so the script refuses them as before
- Moving packets that were archived by hand - they are already where the script now puts them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Per-track archive, restore and list; track-list refresh |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Create | Nine cases in a throwaway repository |
| `runtime/cli/spec/README.md`, two catalogue entries, the lifecycle playbook, `SKILL.md`, `README.md` | Modify | Describe the per-track archive and the refresh |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modify | Regenerated after the `SKILL.md` edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A track packet archives into its own track | `specs/tools/002-b` lands at `specs/tools/z_archive/002-b`, and no root `specs/z_archive/` is created |
| REQ-002 | A track packet restores into its track | `specs/tools/z_archive/002-b` returns to `specs/tools/002-b` |
| REQ-003 | The track list follows both moves | `children_ids` drops the packet on archive and lists it again on restore |
| REQ-004 | A packet at the specs root keeps the root archive | `specs/005-root` archives to `specs/z_archive/005-root` and restores back |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--list` covers every archive | It prints `specs/tools/z_archive/001-a` and `specs/z_archive/005-root`, and leaves out a symlinked track |
| REQ-006 | Wrong targets are refused | A folder in a track archive is "already archived"; a live phase child in a track is "not in archive directory" and stays where it is |
| REQ-007 | A missing writer never blocks the move | The packet is archived, the list is untouched, and the output says `tools/graph-metadata.json was not refreshed` |
| REQ-008 | A track without `graph-metadata.json` archives quietly | No refresh warning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `archive-track.vitest.ts` passes, 9 of 9, and each guarded rule removed on purpose fails it
- **SC-002**: `test-phase-validation.js` keeps passing, with its two path-safety messages unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `refresh-track-roots.mjs` from packet 037 | The list would go stale | The move still happens and the script names the command to rerun |
| Risk | Restore moving a live folder | High | Restore accepts only a folder under the root archive or a track's `z_archive/`, and a case checks a live phase child is refused |
| Risk | Bash 3.2 on macOS | Med | No `mapfile`, no empty-array expansion; the suite runs under `/bin/bash` 3.2 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose "Make it track-aware": archive into the track's own `z_archive/`, restore to the track, and refresh the list both times.
<!-- /ANCHOR:questions -->

---
