---
title: "Tasks: Phase 49: review-rows-reconciliation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review rows reconciliation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 49: review-rows-reconciliation

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

- [x] T001 Read the 040, 041, 042 and 048 summaries and list each of the 35 held findings with the phase and first fixing commit (`scratch/briefs/b01-review-rows.task`)
- [x] T002 Write `scratch/check-review-rows.mjs`: tracked paths against `git ls-files`, the open P0/P1 rule against §4, and §2 against the rows (`scratch/check-review-rows.mjs`)
- [x] T003 Write the five briefs, four writing and one read-only review, and dispatch DeepSeek v4.1 flash max through `cli-pi` on `llmgateway` (`scratch/briefs/b01-review-rows.task`, `b02-review-new-files.task`, `b03-039-summary-wording.task`, `b04-new-rows-and-totals.task`, `b05-phase-docs.task`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reword the 35 §5 entries from held to "fixed by 040/041/042 (<commits>)", and rename §3 to "Held for the Operator, Since Fixed" with a "Fixed by" column (`../039-sk-code-opencode-alignment-audit/review.md`)
- [x] T005 Replace 039's held wording in the description, What Was Built, Decisions and continuity block with the phases that fixed all 35 (`../039-sk-code-opencode-alignment-audit/implementation-summary.md`)
- [x] T006 Read-only DeepSeek review of the four hook files added after the audit: 6 P2, no P0 or P1, each with a rule, a line and a suggested fix (`scratch/review-new-files.md`)
- [x] T007 Add the four `b14-new-files` rows, record `b09-hooks-dispatch-R01` P1 with its reason, and recompute §2 from the rows (`../039-sk-code-opencode-alignment-audit/review.md`)
- [x] T008 Fill this phase's four docs and the parent map and handoff rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [x] T009 Run the checker against the new review: exit 0, 323 tracked, 323 rows, 0 open P0/P1, 1 recorded P1 (`scratch/check-review-rows.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run recursive strict validation on the parent packet: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` - PASSED, 50 of 50 folders, exit 0
- [ ] T011 Push the reconciled record to main
- [ ] T012 Confirm CI is green at the pushed commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
