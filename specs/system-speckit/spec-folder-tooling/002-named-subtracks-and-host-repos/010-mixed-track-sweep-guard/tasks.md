---
title: "Tasks: Phase 10: mixed-track-sweep-guard"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mixed track sweep guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: mixed-track-sweep-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
No shell variables are used. Task lines name the relevant paths directly.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the operator-selected destinations and sweep-only boundary (`spec.md`). Verify: the packet records both destinations and the Sweep only choice. Evidence: operator decision on 2026-11-10.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T002 Move the surface consistency packet into its selected code-surfaces sub-track (`specs/sk-code/019-surface-consistency-research`). Verify: the repository sweep prints `all track roots match their declared children`. Evidence: move recorded in commit `06ac059b69`.
- [x] T003 Move the Sweet Search packet into a new retrieval-integrations sub-track (`specs/hooks-plugins-extensions/028-sweet-search-integration`). Verify: the repository sweep prints `all track roots match their declared children`. Evidence: move recorded in commit `06ac059b69`.
- [x] T004 Rewrite live path references and align packet descriptions (`specs/`). Verify: the recheck finds 0 of 2563 entries out of line. Evidence: 194 references in 26 files for the surface consistency path, 1940 references in 122 files for the Sweet Search path and nine aligned `description.json` files.
- [x] T005 Add `trackLayout(children)` to the shared track-roots helper (`runtime/cli/lib/track-roots.mjs`). Verify: numbered packets and sub-tracks are separated and a track with both is classified as `mixed`. Evidence: helper returns the mixed classification for both child types.
- [x] T006 Make the sweep reject mixed top-level tracks in working-tree and `--rev` modes (`runtime/cli/spec/sweep-track-roots.mjs`). Verify: mixed cases exit 1, print both required messages and have identical output. Evidence: the sweep test covers both modes.
- [x] T007 Add the flat fixture option and mixed-track sweep coverage (`tests/fixtures/subtrack-tree.mjs`, `track-roots.vitest.ts`). Verify: the track-roots test count increases from 28 to 29, and the two test files report 89 passed and 0 failed. Evidence: `track-roots.vitest.ts` and `archive-track.vitest.ts` passed.
- [x] T008 Update the CLI and feature-catalog docs and release version (`runtime/cli/spec/README.md`, `runtime/cli/lib/README.md`, `tooling-and-scripts/track-root-children-lists.md`, changelog, `SKILL.md`). Verify: markdown links report 0 broken and `check_changelog_shape.py` prints PASS. Evidence: feature-catalog version 2.0.7.0, changelog v2.12.46.0 and skill version 2.12.46.0.
- [x] T009 Record the Barter host impact and the completed changes (`implementation-summary.md`). Verify: the summary names bartender, barter-scrooge and gitops-development as mixed tracks. Evidence: the reported counts are two, six and two flat packets, and no Barter files changed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Record the final sweep, test and documentation evidence (`implementation-summary.md`). Verify: the sweep prints `all track roots match their declared children`, the suites report 89 passed and 0 failed, and the strict validations report 24 and 37 passed with 0 failed. Evidence: markdown links report 0 broken and `check_changelog_shape.py` prints PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---



