---
title: "Timeline: Spec folder tooling: canonical root, numbering, track roots and archive"
description: "Order in which the 5 packets under this parent were started and finished, with the number each had before it moved here."
trigger_phrases:
  - "spec folder tooling timeline"
  - "create.sh canonical specs root timeline"
  - "track root children timeline"
  - "034-spec-folder-tooling number map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Spec folder tooling: canonical root, numbering, track roots and archive

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order the 5 packets under `034-spec-folder-tooling` were started and finished, taken from git, with the number each packet carried before it moved under this parent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-speckit/034-spec-folder-tooling`, children 001 to 005
**Status:** Complete
**Started:** 2026-09-23
**Last updated:** 2026-09-24
**Owner:** the spec-kit maintainers. Dates and hashes come from `git log` over each packet's former path, so the hashes are the ones in history after the commit message rewrite that repointed the old folder names.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

Each entry is a packet's first commit. The outcome names what the packet left behind.

**2026-09-23:** `001-create-canonical-specs-root` (was `034-create-canonical-specs-root`) started. 1 commit, first `efc110a31e` and last `efc110a31e` on 2026-09-23. Outcome: create.sh writes new packets under the canonical specs root, and --track numbers from it.

**2026-09-24:** `002-root-numbering-without-track` (was `036-root-numbering-without-track`) started. 1 commit, first `4e4d50e52d` and last `4e4d50e52d` on 2026-09-24. Outcome: create.sh numbers a new packet at the specs root from the highest number in use.

**2026-09-24:** `003-track-root-children` (was `037-track-root-children`) started. 4 commits, first `e3f42d0ecb` and last `cf2b8ae7ea` on 2026-09-24. Outcome: Each track root lists the packets it holds, and a push that breaks that is blocked.

**2026-09-24:** `004-track-aware-archive` (was `038-track-aware-archive`) started. 2 commits, first `cf2b8ae7ea` and last `8036f130e1` on 2026-09-24. Outcome: archive.sh keeps a track packet inside its track and refreshes the track list.

**2026-09-24:** `005-phase-aware-archive` (was `039-phase-aware-archive`) started. 1 commit, first `8036f130e1` and last `8036f130e1` on 2026-09-24. Outcome: archive.sh moves a phase into its parent's z_archive and restores it there, and leaves the parent's phase list to the reviewed prune.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-09-24. Status: Done. Evidence: every child reports complete in its graph metadata.
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:numbers -->
## 4. NUMBER MAP

This parent took the number of its first child, so the numbers of the other packets it holds are now free in `specs/system-speckit/`. They are not reused. New packets in the track keep counting from the highest number in use.

- `034-create-canonical-specs-root` is now `034-spec-folder-tooling/001-create-canonical-specs-root`.
- `036-root-numbering-without-track` is now `034-spec-folder-tooling/002-root-numbering-without-track`.
- `037-track-root-children` is now `034-spec-folder-tooling/003-track-root-children`.
- `038-track-aware-archive` is now `034-spec-folder-tooling/004-track-aware-archive`.
- `039-phase-aware-archive` is now `034-spec-folder-tooling/005-phase-aware-archive`.
<!-- /ANCHOR:numbers -->
