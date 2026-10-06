---
title: "Implementation Plan: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune"
description: "archive.sh archives any folder into the z_archive beside it and restores it to the place that archive belongs to. Archives count only beside a packet home, the specs root, a track, or a packet or phase reached through numbered folders, and --list walks those folders instead of searching the tree."
trigger_phrases:
  - "phase-aware archive"
  - "archive a phase"
  - "packet home"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 |
| **Framework** | None |
| **Storage** | Folders under `specs/` |
| **Testing** | Vitest (`cli` project) and `test-phase-validation.js` |

### Overview
The archive for a folder is the `z_archive/` beside it, and a restore goes to the place that archive belongs to. That one rule covers a packet at the specs root, a track packet and a phase. A packet home, the specs root, a track, or a packet or phase reached through numbered folders only, decides where archives may sit, so copies of a specs tree inside research folders never count.
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
One shell script with small helpers.

### Key Components
- **`is_packet_home`**: true for the specs root, a track, or a folder reached from either through numbered segments only
- **`archive_dirs_under`**: the archive beside one packet home, then the same for each numbered folder in it, never following a link or entering an archive
- **`archive_dirs`**: the walk from the specs root and from each track that is not a link
- **Phase note**: after archiving a phase whose parent has a `graph-metadata.json`, names the reviewed prune

### Data Flow
Archive checks that the folder's parent is a packet home, moves the folder into the parent's `z_archive/`, refreshes the track list when the folder sits directly in a track, and prints the prune note for a phase. Restore checks that the folder sits directly in a `z_archive/` whose owner is a packet home, then moves it back to that owner.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The cases run in the throwaway repository that packet 038's tests use. Each guarded rule was removed on purpose, 20 in all, and each removal fails the suite. A read-only `--list` on this repository checks the walk against the real tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Packet 038's track-aware `archive.sh` and its test fixture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. A phase archived with the new script sits in its parent's `z_archive/`, where this repository already keeps archived phases, so nothing needs moving back.
<!-- /ANCHOR:rollback -->

---
