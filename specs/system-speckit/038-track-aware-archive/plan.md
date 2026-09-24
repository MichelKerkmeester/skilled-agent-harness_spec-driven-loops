---
title: "Implementation Plan: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list"
description: "archive.sh finds the track a packet sits in and uses that track's z_archive/, restores from any archive to where the folder came from, lists every archive, and runs refresh-track-roots.mjs for the track after each move."
trigger_phrases:
  - "track-aware archive"
  - "archive.sh track"
  - "restore to track"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 |
| **Framework** | None |
| **Storage** | Folders under `specs/` and each track's `graph-metadata.json` |
| **Testing** | Vitest (`cli` project) and `test-phase-validation.js` |

### Overview
`archive.sh` works out whether a packet sits directly in a track and archives it into that track's `z_archive/`, or into the root archive when it sits at the specs root. Restore reads the owner back from the archive path. After either move the script runs `refresh-track-roots.mjs` for the track, the writer packet 037 added.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shell script with small helpers, calling the existing writer.

### Key Components
- **`track_of`**: the track a folder sits directly under, or nothing at the specs root
- **`archive_dir_for`**: the root archive or `specs/<track>/z_archive`
- **`archived_track_of`**: the owner of the archive a folder sits in, failing when it is in none
- **`archive_dirs`**: every archive, root first, without symlinked tracks
- **`refresh_track_root`**: runs the writer for one track, and warns instead of failing

### Data Flow
Archive resolves the folder, refuses one outside the specs root or under any `z_archive/`, checks completeness, picks the archive from the track, copies and renames, removes the source, then refreshes the track. Restore resolves the folder, finds its archive's owner, moves it back to the owner, then refreshes the track.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The nine cases run in a throwaway git repository that holds copies of `archive.sh`, the writer and its module, because the script takes its root from the working directory's repository. Each guarded rule was then removed on purpose, ten in all, and each removal fails the suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`refresh-track-roots.mjs` and `lib/track-roots.mjs` from packet 037, and `node` on the path.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Packets archived with the new script sit in their track's `z_archive/`, where every track already keeps its archive by hand, so nothing needs moving back.
<!-- /ANCHOR:rollback -->

---
