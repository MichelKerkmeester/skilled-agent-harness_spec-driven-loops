---
title: "Tasks: Phase 2: fresh-timing-profile"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fresh timing profile tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: fresh-timing-profile

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

- [x] T001 Check the machine is quiet. Verify: `pgrep -fl vitest` prints nothing.
- [x] T002 Rebuild spec-kit (`S`). Verify: `npm run build` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Profile the deep-loop suite (`D`). Verify: `npx vitest run --reporter=json --outputFile=<file>` exits 0 and the report has 173 files.
- [x] T004 Profile the spec-kit core lane (`S`). Verify: the report has 126 run files and exits 0.
- [ ] T005 Profile the spec-kit cli lane (`S/cli`). Verify: the report has 202 run files and exits 0. Not met: 4 cli files failed while the core lane shared the checkout; see the summary.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Write the timing tables (this phase's `implementation-summary.md`). Verify: each table names seconds per file.
- [x] T007 Decide phases 3 and 4. Verify: the summary states go or no-go for each with its number.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
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



