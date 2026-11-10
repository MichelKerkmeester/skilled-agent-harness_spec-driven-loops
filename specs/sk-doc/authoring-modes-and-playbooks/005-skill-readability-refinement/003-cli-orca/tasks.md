---
title: "Tasks: Phase 3: cli-orca"
description: "Scope, audit, fix, review and gate the in-scope docs."
trigger_phrases:
  - "cli orca tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: cli-orca

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

- [x] T001 List the scope and the inbound-linked headings (`scratch/scope.txt`, `scratch/inbound-anchors.txt`). Verify: `wc -l < scratch/scope.txt` prints 17.
- [x] T002 Record the gate before any edit (`scratch/run.log`). Verify: its first line reads `files=17 render_warnings=1 invalid=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Audit each chunk with DeepSeek max (`scratch/findings.md`). Verify: it holds 44 findings, 3 of them P1.
- [x] T004 Apply the findings with DeepSeek (`scratch/fix-1.log`). Verify: the log ends `STATUS=OK`.
- [x] T005 Review the diff with DeepSeek max until it passes (`scratch/review-*.md`). Verify: 1 round(s), verdicts PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the scope gate (`scratch/gate-after.txt`). Verify: it prints `files=17 render_warnings=0 invalid=0`.
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



