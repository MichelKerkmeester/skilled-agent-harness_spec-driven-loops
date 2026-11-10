---
title: "Tasks: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doc tooling prose and release amend tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes

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

`D` is `.skilled/skills/sk-doc/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the four failures (`spec.md` §2). Verify: the measured-behavior block quotes each one.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Rewrite the README prose, install-document and spacing rules (`D/sk-create-readme/`). Verify: `rg -n "several distinct points" D/sk-create-readme` prints nothing.
- [x] T003 [P] Add `build_release_notes.py`, the amend path and the ordering rule (`D/sk-create-changelog/`). Verify: the builder's output equals the published v4.0.2.0 body.
- [x] T004 [P] Skip docs taken unchanged from a merged-in parent (`D/shared/scripts/frontmatter-version.mjs`). Verify: `pre-commit.test.sh` prints `163 passed, 0 failed`.
- [x] T005 [P] Exempt listed product names (`D/sk-create-with-human-voice/`). Verify: `test_hvr_scan.py` prints `ALL PASS`.
- [x] T006 Make the root README spacing uniform (`README.md`). Verify: the diff holds only `&nbsp;` and blank lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the touched suites. Verify: each new test fails on the old code and passes on the new one.
- [x] T008 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every script change has a failing-then-passing test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: the install guide and v4.0.2.0 release work in `specs/system-skilled-doctor/001-skill-and-overlay-build/006-setup-guide`
<!-- /ANCHOR:cross-refs -->

---
