---
title: "Tasks: Rule delivery instrumentation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rule delivery instrumentation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rule delivery instrumentation

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the Codex session JSONL format and the Claude Code compaction record shape from local samples
- [x] T002 [P] Probe whether Devin, Cursor, OpenCode and Pi keep a readable session transcript, and record the result in `plan.md`
- [x] T003 Copy the script to `sk-create-repo-rule/scripts/` and write synthetic fixtures (`test_measure_rule_compliance.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Normalize events through a Claude Code adapter and a Codex adapter
- [x] T005 Count delivery receipts by channel and compaction window
- [x] T006 Compute Gate 5 and §8 eligibility and misses
- [x] T007 Add the rule-version split from `git log`
- [x] T008 Add the requested-table split and Wilson intervals
- [x] T009 List the script in `sk-create-repo-rule/SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run pytest and the output-privacy test
- [x] T011 Reproduce the evidence pack's `Read`-channel numbers on the same window
- [x] T012 Commit the baseline report under `baselines/`
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Predecessor handoff criteria met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed scripts pass their existing lint or syntax checks
- [x] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Privacy test passes: no fixture text in output
- [x] CHK-021 [P0] Gate 5 and §8 rates carry denominators
- [x] CHK-022 [P0] Evidence pack numbers reproduced on the `Read` channel
- [x] CHK-023 [P1] Codex adapter covered by a fixture
- [x] CHK-024 [P1] Baseline committed before phase 006
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete
- [x] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No transcript text, secret or credential in any committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files in scratch/ only, cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
