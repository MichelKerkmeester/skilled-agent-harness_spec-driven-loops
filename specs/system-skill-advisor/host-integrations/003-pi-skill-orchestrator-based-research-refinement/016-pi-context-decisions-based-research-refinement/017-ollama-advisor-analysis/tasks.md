---
title: "Tasks: Phase 17: ollama-advisor-analysis"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ollama advisor analysis tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: ollama-advisor-analysis

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

- [x] T001 Record the baseline daemon and Ollama state (`spec.md` Measured Behavior). Verify: `pgrep -f runtime/advisor-server.js | wc -l` printed 3 and `pgrep -fl ollama | wc -l` printed 0.
- [x] T002 Write the analysis prompt with the child preamble, the file list and the five questions (scratch `f017/prompt.txt`). Verify: `wc -l` printed 38.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the read-only dispatch: `claude2 -p --model claude-fable-5-2 --effort medium --permission-mode plan --agent review`. Verify: exit 0 and a non-empty report on stdout. Evidence: implementation-summary.md Verification.
- [x] T004 Save the report (`evidence/report.md`). Verify: `rg -c 'ts:[0-9]+|cjs:[0-9]+|mjs:[0-9]+' evidence/report.md` prints at least 5. Evidence: implementation-summary.md Verification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Check the report's ranked findings against the cited lines (`implementation-summary.md`). Verify: each top finding is listed as confirmed or not, with the line read. Evidence: implementation-summary.md Verification.
- [x] T006 Confirm the dispatch wrote nothing. Verify: `git status --short` shows changes only in this phase folder. Evidence: implementation-summary.md Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `evidence/report.md` saved and its top findings checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



