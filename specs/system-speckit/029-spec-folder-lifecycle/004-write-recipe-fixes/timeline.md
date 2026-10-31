---
title: "Timeline: Write recipe fixes: backfill flag, commit step, workspace bullet, post-checks and verification gate"
description: "Order in which the 5 packets under this parent were started and finished, with the number each had before it moved here."
trigger_phrases:
  - "write recipe fixes timeline"
  - "spec folder write recipe timeline"
  - "write recipe commit step timeline"
  - "041-write-recipe-fixes number map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Write recipe fixes: backfill flag, commit step, workspace bullet, post-checks and verification gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order the 5 packets under `041-write-recipe-fixes` were started and finished, taken from git, with the number each packet carried before it moved under this parent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-speckit/041-write-recipe-fixes`, children 001 to 005
**Status:** Complete
**Started:** 2026-09-29
**Last updated:** 2026-09-29
**Owner:** the spec-kit maintainers. Dates and hashes come from `git log` over each packet's former path, so the hashes are the ones in history after the commit message rewrite that repointed the old folder names.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

Each entry is a packet's first commit. The outcome names what the packet left behind.

**2026-09-29:** `001-fix-write-recipe-backfill-flag` (was `041-fix-write-recipe-backfill-flag`) started. 1 commit, first `4e5e7ad283` and last `4e5e7ad283` on 2026-09-29. Outcome: Step 5 of the recipe passes the packet folder to the backfill instead of exiting 1.

**2026-09-29:** `002-fix-write-recipe-commit-step` (was `042-fix-write-recipe-commit-step`) started. 1 commit, first `91f292ceec` and last `91f292ceec` on 2026-09-29. Outcome: Step 7 follows the commit hook instead of asking for a trailer the hook refuses.

**2026-09-29:** `003-fix-write-recipe-workspace-bullet` (was `043-fix-write-recipe-workspace-bullet`) started. 1 commit, first `5ce7cbf9da` and last `5ce7cbf9da` on 2026-09-29. Outcome: The Step 7 workspace bullet defers to the sk-git workspace rule instead of fixing main.

**2026-09-29:** `004-fix-write-recipe-post-checks` (was `044-fix-write-recipe-post-checks`) started. 1 commit, first `2343979238` and last `2343979238` on 2026-09-29. Outcome: The status and push rows no longer assume a clean tree or a push to main.

**2026-09-29:** `005-fix-write-recipe-verification-gate` (was `045-fix-write-recipe-verification-gate`) started. 1 commit, first `5ca79707c9` and last `5ca79707c9` on 2026-09-29. Outcome: The Step 7 verification gate checks the staged set instead of the whole working tree.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-09-29. Status: Done. Evidence: every child reports complete in its graph metadata.
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:numbers -->
## 4. NUMBER MAP

This parent took the number of its first child, so the numbers of the other packets it holds are now free in `specs/system-speckit/`. They are not reused. New packets in the track keep counting from the highest number in use.

- `041-fix-write-recipe-backfill-flag` is now `041-write-recipe-fixes/001-fix-write-recipe-backfill-flag`.
- `042-fix-write-recipe-commit-step` is now `041-write-recipe-fixes/002-fix-write-recipe-commit-step`.
- `043-fix-write-recipe-workspace-bullet` is now `041-write-recipe-fixes/003-fix-write-recipe-workspace-bullet`.
- `044-fix-write-recipe-post-checks` is now `041-write-recipe-fixes/004-fix-write-recipe-post-checks`.
- `045-fix-write-recipe-verification-gate` is now `041-write-recipe-fixes/005-fix-write-recipe-verification-gate`.
<!-- /ANCHOR:numbers -->
