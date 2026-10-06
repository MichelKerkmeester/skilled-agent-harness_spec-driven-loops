---
title: "Timeline: Advisor defect and hardening fixes: suite failures, diagnostics, bootstrap, daemon recycle and stress suite"
description: "Order in which the 6 packets under this parent were started and finished, with the number each had before it moved here."
trigger_phrases:
  - "advisor defect fixes timeline"
  - "advisor suite failures timeline"
  - "empty recommendation diagnostic timeline"
  - "026-defect-and-hardening-fixes number map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Advisor defect and hardening fixes: suite failures, diagnostics, bootstrap, daemon recycle and stress suite

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order the 6 packets under `026-defect-and-hardening-fixes` were started and finished, taken from git, with the number each packet carried before it moved under this parent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-skill-advisor/026-defect-and-hardening-fixes`, children 001 to 006
**Status:** Complete
**Started:** 2026-09-12
**Last updated:** 2026-10-05
**Owner:** the spec-kit maintainers. Dates and hashes come from `git log` over each packet's former path, so the hashes are the ones in history before this move.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

Each entry is a packet's first commit. The outcome names what the packet left behind.

**2026-09-12:** `001-pre-existing-suite-failures` (was `026-pre-existing-suite-failures`) started. 3 commits, first `89df0ba0750` and last `099990cf343` on 2026-09-20. Outcome: The five suites carried as pre-existing failures are explained and fixed.

**2026-09-12:** `002-empty-recommendation-diagnostic` (was `027-empty-recommendation-diagnostic`) started. 2 commits, first `8a13dc6b78f` and last `bc441a1d448` on 2026-09-12. Outcome: The hook diagnostics separate an empty recommendation from an unreachable advisor.

**2026-09-23:** `003-fix-remaining-advisor-defects` (was `029-fix-remaining-advisor-defects`) started. 4 commits, first `89569a7f81` and last `d4ffc18aca` on 2026-09-23. Outcome: The Pi directive delivery path returns a decision instead of throwing, along with the other remaining defects.

**2026-10-01:** `004-fresh-clone-bootstrap` (was `032-fresh-clone-bootstrap`) started. 1 commit, first `0d2937d661` and last `0d2937d661` on 2026-10-01. Outcome: A clean clone builds the advisor launcher.

**2026-10-05:** `005-stale-build-daemon-recycle` (was `034-stale-build-daemon-recycle`) started. 1 commit, first `1c88e16439` and last `1c88e16439` on 2026-10-05. Outcome: The CLI and launcher recycle a live daemon that predates the current build.

**2026-10-05:** `006-stress-suite-ci` (was `035-stress-suite-ci`) started. 2 commits, first `7c65ed8811` and last `3d4458cb16` on 2026-10-05. Outcome: A workflow runs the stress suite in CI.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-10-05. Status: Done. Evidence: every child reports complete in its graph metadata.
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:numbers -->
## 4. NUMBER MAP

This parent took the number of its first child, so the numbers of the other packets it holds are now free in `specs/system-skill-advisor/`. They are not reused. New packets in the track keep counting from the highest number in use.

- `026-pre-existing-suite-failures` is now `026-defect-and-hardening-fixes/001-pre-existing-suite-failures`.
- `027-empty-recommendation-diagnostic` is now `026-defect-and-hardening-fixes/002-empty-recommendation-diagnostic`.
- `029-fix-remaining-advisor-defects` is now `026-defect-and-hardening-fixes/003-fix-remaining-advisor-defects`.
- `032-fresh-clone-bootstrap` is now `026-defect-and-hardening-fixes/004-fresh-clone-bootstrap`.
- `034-stale-build-daemon-recycle` is now `026-defect-and-hardening-fixes/005-stale-build-daemon-recycle`.
- `035-stress-suite-ci` is now `026-defect-and-hardening-fixes/006-stress-suite-ci`.
<!-- /ANCHOR:numbers -->
