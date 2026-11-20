---
title: "Tasks: Phase 21: epic-verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "epic verification tasks"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: epic-verification

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

- [x] T001 Record the baseline commit count, HEAD and lane weight (`spec.md` Measured Behavior), and the worktree status before the dispatch. Verify: the commit count printed 49 and HEAD printed `7ee80c87364`. Evidence: spec.md Measured Behavior.
- [x] T002 Write the brief with the child preamble, claims O1 to O6 and S1 to S4, the defect ranking and the Ollama cost question (`scratch/prompt.md`). Verify: `wc -l` prints 44. Evidence: 44 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the read-only dispatch: `claude2 -p --model claude-fable-5-2 --effort high --permission-mode plan --agent review`. Verify: exit 0 and a non-empty report on stdout. Evidence: exit 0, stderr 0 bytes, 15,130-byte report.
- [x] T004 Save the report (`evidence/report.md`). Verify: it holds a verdict line for each of O1 to O6 and S1 to S4. Evidence: `rg -c '^- \*\*[OS][1-6] '` prints 10.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Check every verdict that is not CONFIRMED, and every P0 or P1 defect, against the cited lines (`implementation-summary.md`). Verify: each is listed as confirmed or not, with the line read. Evidence: O3, O5, O6, S4 and the P1 confirmed in implementation-summary.md Verification.
- [x] T006 Confirm the dispatch wrote nothing. Verify: `git status --short` shows no new change outside this phase folder and the parent `spec.md`. Evidence: only this folder and the parent's spec.md, goal.md and graph-metadata.json, all conductor writes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `evidence/report.md` saved and its non-CONFIRMED verdicts checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
