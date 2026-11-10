---
title: "Tasks: Phase 8: routing-and-release-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "routing and release alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: routing-and-release-alignment

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rerun the seven stored probes on the unchanged tree (`.skilled/bin/skill-advisor.cjs`). Verify: `advisor_recommend` names `command-doctor-helper` first on three of them and ties on one.
- [x] T002 Have a review agent read the retrieval code of phases 4 to 7 (`runtime/cli/retrieval`). Verify: the report lists no P0 or P1 and ten P2 findings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add three intent signals and remove the duplicate (`.skilled/skills/system-spec-kit/graph-metadata.json`). Verify: `rg -c '"trigger phrase"' .skilled/skills/system-spec-kit/graph-metadata.json` prints 1.
- [x] T004 Add the read-only lift and its cases (`runtime/lib/scorer/fusion.ts`, `tests/scorer/route-gates.vitest.ts`). Verify: `npx vitest run tests/scorer/route-gates.vitest.ts` prints `Tests  19 passed (19)`.
- [x] T005 Apply the verified trims (`retrieval/lib/unindexed-docs.mjs`, `retrieval/lookup-trigger-index.mjs`, two test files). Verify: `rg -c "^export" .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs` prints 1.
- [x] T006 Write the release and component entries (`.skilled/changelog/skilled/v4.0.2.1.md`, `v2.12.47.0.md`, `v0.18.6.0.md`). Verify: `check_changelog_shape.py` on the three files prints `pass=3 fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rebuild the advisor and rerun the seven probes (`.skilled/bin/skill-advisor.cjs`). Verify: six pass, and phase 6 probe P02 still ties.
- [x] T008 Run the advisor suite (`system-skill-advisor/runtime`). Verify: `npx vitest run` exits 0 with 0 failed.
- [x] T009 Run the `system-spec-kit` suite (`system-spec-kit/runtime`). Verify: `npm test` exits 0 with 0 failed.
- [x] T011 Apply `--limit` to the `path` and `count` recipes (`retrieval/rg-wrapper.mjs`, `ops/retrofit-convention.mjs`, `tests/rg-wrapper-recipes.vitest.ts`). Verify: the wrapper test file passes 27 of 27.
- [x] T012 Expand the v4.0.2.1 entry and the GitHub release (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `check_changelog_shape.py` prints `PASS`.
- [x] T010 Run the alignment battery over the change (`run-battery.cjs`). Verify: the status line prints `fail=0`.
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
<!-- /ANCHOR:cross-refs -->

---



