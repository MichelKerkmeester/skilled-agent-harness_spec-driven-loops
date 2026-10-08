---
title: "Tasks: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "drift guard cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the wrapper: exit 1, 60 errors, 254 warnings, 22548 files scanned (`.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`)
- [x] T002 Baseline the verifier tests: 26 passed (`test_verify_alignment_drift.py`)
- [x] T003 Survey tracked files a `-fixture` and a `specs/**/evidence/` rule would match, to confirm no shipped code is caught
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `is_unscanned_record_path` and call it from `iter_code_files` (`verify_alignment_drift.py`)
- [x] T005 Add `test_skips_spec_evidence_and_fixture_trees` (`test_verify_alignment_drift.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verifier tests: 27 passed, exit 0
- [x] T007 Drift-guard wrapper: `all 2 guards PASSED`, exit 0, 0 errors, 247 warnings
- [x] T008 `git status --porcelain` lists only the verifier, its test, this packet and the track root metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



