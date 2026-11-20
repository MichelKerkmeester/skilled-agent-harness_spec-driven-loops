---
title: "Tasks: Phase 16: upstream-code-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "upstream code alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: upstream-code-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

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

- [x] T001 List the code destinations of Barter's manifest with a Skilled counterpart (`/tmp/ovl-gates/016-up-files.txt`). Verify: `wc -l` prints 24.
- [x] T002 [P] Run the read-only audits g1 to g4 with cli-pi and the `fanout-run.cjs` audit with @review (`/tmp/ovl-gates/pi/`). Verify: each output has a `## Findings` table.
- [x] T003 Capture the baselines of the covering suites (`/tmp/ovl-gates/g-base2.txt`). Verify: each line shows `exit=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix the git hooks and the pre-push test (`.skilled/scripts/git-hooks/`). Verify: the hook tests exit 0.
- [x] T005 Fix the compiled-route guard and canary router (`.skilled/bin/`). Verify: `node --test .skilled/bin/tests/compiled-route-*.test.cjs` exits 0.
- [x] T006 Fix the deep-loop files (`executor-config.ts`, `fanout-run.cjs`, `append-mode-event.cjs`). Verify: their vitests exit 0.
- [x] T007 Fix `review-research-paths.cjs` and the remaining spec-kit files. Verify: their vitests exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-read the handoff list and apply any new item. Verify: every item has a row in `implementation-summary.md`.
- [x] T009 Rerun every covering suite. Verify: each count matches its baseline.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] All 24 counterparts are recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



