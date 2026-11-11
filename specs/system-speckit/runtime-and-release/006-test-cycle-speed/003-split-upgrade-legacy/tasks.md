---
title: "Tasks: Phase 3: split-upgrade-legacy"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "split upgrade legacy tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: split-upgrade-legacy

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

`S` is `.skilled/skills/system-spec-kit/runtime`. `D` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the cli test count (`S/cli`). Verify: `npx vitest list --config ../../vitest.config.ts --project cli` prints the count.
- [x] T002 Record the lane time from phase 2. Verify: the phase 2 summary names it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the sandbox helpers (`S/cli/tests/helpers/upgrade-legacy-harness.ts`). Verify: the old file still passes with the helper imported.
- [x] T004 Split into four files (`S/cli/tests/upgrade-legacy-*.vitest.ts`). Verify: the four files hold 65 tests.
- [x] T005 Update both callers (`S/scripts/run-cli-tests.sh`, `.github/workflows/spec-kit-check.yml`). Verify: neither names the old file.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Compare the counts. Verify: the cli count equals T001's.
- [x] T007 Run three times. Verify: `npm run test:cli` exits 0 three times.
- [x] T008 Compare the time. Verify: the median is at least 10% under T002's, or the commit is reverted.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-five-cuts/research/research.md`
<!-- /ANCHOR:cross-refs -->

---



