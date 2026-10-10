---
title: "Timeline: Spec folder tooling: canonical root, numbering, track roots and archive"
description: "Order in which the 20 packets under this parent were started and finished, with the number each had before it moved here."
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

> The order the packets under `034-spec-folder-tooling` were started and finished, taken from git, with the number each packet carried before it moved under this parent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-speckit/034-spec-folder-tooling`, children 001 to 020
**Status:** In Progress
**Started:** 2026-09-23
**Last updated:** 2026-10-10
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

**2026-10-06:** `006-series-parent-rule-and-sibling-listing` started. 6 commits, first `839e5ec61d` on 2026-10-06 and last `b8c2f5ff40` on 2026-10-09. Outcome: A second small change to the same artifact now has a legal home, the series parent, and create.sh shows the recent packets in the track and seeds trigger phrases that name the topic.

**2026-10-07:** `007-series-parent-review-and-hardening-research` started. 3 commits, first `4b33313bd4` and last `d727cf94fe` on 2026-10-07. Outcome: A 3-iteration deep review found the Phase 6 code sound but four rule-doc defects, and a 10-iteration deep research run ranked ten ways to make grouping related work the default at the moment an agent picks a folder.

**2026-10-07:** `008-series-parent-review-fixes` started. 3 commits, first `4af470d153` and last `d727cf94fe` on 2026-10-07. Outcome: The series parent recipe now runs as written, every stale copy of the rule names the exception, the listing strips control bytes, the Phase 6 records match what shipped and cli-pi receives the configured effort. The committed trigger index is rebuilt and fresh.

**2026-10-07:** `009-gate-3-menu-series-parent` started. 3 commits, first `4af470d153` and last `d727cf94fe` on 2026-10-07. Outcome: Every runtime copy of the Gate 3 menu now names the series parent under option C and leaves option B for new or unrelated work. One source of truth in spec-gate-core.mjs, pinned by byte tests and swept across the repository.

**2026-10-07:** `010-trigger-index-ci-rebuild` started. 5 commits, first `4af470d153` on 2026-10-07 and last `abb53ecc69` on 2026-10-08. Outcome: CI now repairs trigger index drift instead of only reporting it, through a rebuild workflow that commits the index when a push leaves it stale, guards against loops and races, and reports a rejected push by naming branch protection.

**2026-10-07:** `011-template-phrase-census-and-cleanup` started. 3 commits, first `4af470d153` and last `d727cf94fe` on 2026-10-07. Outcome: New Level 2 packets carry phrases about their own work, the acceptance criteria template defaults are flagged by the judge, and the operator-approved cleanup removed the exact template block from 509 files across 375 packets. The trigger index is rebuilt and fresh.

**2026-10-07:** `012-template-phrase-cleanup-round-two` started. 1 commit, `d727cf94fe` on 2026-10-07. Outcome: New packets carry seeded phrases in all five documents, the judge flags every template's defaults, and the approved cleanup removed default rows from 1,319 live files. All 541 touched folders pass strict validation, after fixing 21 that were already failing.

**2026-10-08:** `013-corpus-wide-validation-repair` started. 3 commits, first `560d387a57` and last `d1d9448ba6`, both on 2026-10-08. Outcome: 4,368 of 4,371 live and archived packets now pass strict validation, up from 2,325, with no packet that passed before failing now. The archive lost its template phrases, and 157 missing documents were reconstructed with a dated note.

**2026-10-08:** `014-spec-auto-healing-research` started. 3 commits, first `a599f9a085` and last `d1d9448ba6`, both on 2026-10-08. Outcome: Three research lineages of 15 iterations each traced the branch's spec failures to a few producers that still run, found that the healers write what the checkers reject and ranked 16 fixes. The top five are small and stop new failures at their source.

**2026-10-08:** `015-archive-current-location-and-ignored-files` started. 2 commits, first `c60aa8b468` and last `d1d9448ba6`, both on 2026-10-08. Outcome: Archiving or restoring a packet now leaves it passing strict validation, because the move re-derives its recorded paths. A local trigger index build now matches CI, because it skips the files the committed ignore rules exclude.

**2026-10-08:** `016-research-recommendations` started. 29 commits, first `d1d9448ba6` on 2026-10-08 and last `f3f8583579` on 2026-10-09. Outcome: Each of the 16 research recommendations is a child phase, and all 16 are Complete with their acceptance rows Met. The lanes shipped to main on 2026-10-09. On 2026-10-10 all five completion criteria in its goal.md were ticked with proof. The CLI test criterion passed after the test projection was aligned with the quoted workflow reference, and the packet reads Complete.

**2026-10-09:** `017-heal-cli-and-compat-yaml-simplification` started. 1 commit, `c098e12f7a` on 2026-10-09. Outcome: The lane-mode CLI lost two unused flags, the compat action states its failed-step rule once, and a test now pins the order that refusals are recorded in.

**2026-10-09:** `018-epic-docs-alignment` started. 2 commits, first `f3f8583579` and last `9bd0eecc44`, both on 2026-10-09. Outcome: Epic docs alignment for the spec-folder tooling: the playbooks, catalogs, READMEs, doctor docs and release changelogs now describe what the code ships.

**2026-10-09:** `019-epic-follow-up-fixes` started. 1 commit, first `079e9c34d2` and last `079e9c34d2` on 2026-10-09. Outcome: closes the follow-ups the epic left, covering the env reference, the compat workflow contract, Gate 3 parity coverage, CLI test isolation and the leaf manifest generator. Its post-push CI on main is recorded in its scratch evidence.

**2026-10-10:** `020-deep-review-remediation` started. 0 commits, because its work is still in the working tree. Outcome: pending. The packet remediates the deep review findings against phases 016 to 019, and it closes only after its final gates pass.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-09-24. Status: Open. Phase 020 is the only child still In Progress.
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
