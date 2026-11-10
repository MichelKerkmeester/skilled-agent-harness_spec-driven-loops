---
title: "Tasks: Phase 1: spec-kit-core"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "spec kit core tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: spec-kit-core

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

`R` is `research/` in this folder. `S` is `R/deep-research-state.jsonl`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the research charter (`spec.md`). Verify: the targeted strict rules report no placeholder in `spec.md`.
- [x] T002 Initialize the run (`R/deep-research-config.json`). Verify: the first row of `S` has `"type":"config"`.
- [x] T003 Seed twelve key questions (`R/deep-research-strategy.md`). Verify: `rg -c '^- \[' R/deep-research-strategy.md` prints 12 or more.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run ten iterations through cli-devin (`R/iterations/`). Verify: `rg -c '"type":"iteration"' S` prints 10 or more (now 20).
- [x] T005 Open two citations per iteration and log the verdict (`decision-record.md`). Verify: the steering table has one row per iteration.
- [x] T006 Steer each next focus toward unread releases, unprobed types and unverified claims (`R/inbox.jsonl`). Verify: the steering table names a focus per iteration.
- [x] T007 Score the depth checkpoint and extend by five when it fails (`decision-record.md`). Verify: the checkpoint table has a row per checkpoint.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Synthesize (`R/research.md`). Verify: `test -s R/research.md` exits 0.
- [x] T009 Fill the coverage table (`implementation-summary.md`). Verify: the table has 14 release rows and 7 type columns.
- [x] T010 Validate this folder (`spec.md`). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: two citations per iteration opened and logged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
