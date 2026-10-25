---
title: "Tasks: Phase 3: review-remediation"
description: "Ordered tasks that apply the deep review's confirmed findings to the research documents and to the sk-code-quality and sk-code-review folders."
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: review-remediation

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

- [x] T001 Read the review report and the files each finding names (`../review/review-report.md`)
- [x] T002 Record the research close commit `ee8c7e6f24` and confirm the two mode folders are unchanged from `f8671e07c2` to it
- [x] T003 Run the playbook, alignment and canary checks once for a baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add ADR-003 and re-close AC-009 and CHK-032 against it (`../00{1,2}-*/decision-record.md`, `acceptance-criteria.md`, `tasks.md`)
- [x] T005 Mark D3 and D4 superseded by ADR-002 and amend the completion criteria in the three goals (`../goal.md`, `../00{1,2}-*/goal.md`)
- [x] T006 Apply S-P2-01 to S-P2-06: CHK-031 wording, Status Complete, AC-003 to AC-005 at fifteen, limitations, `completion_pct`, open question and handoff row
- [x] T007 Apply S-P2-07 and S-P2-08: re-anchor ten ROUTER.md tags and correct the envelope premise (`../00{1,2}-*/research/research.md`, `../002-review-mode-research/spec.md`)
- [x] T008 Apply S-P2-09: delete the four scratch drafts (`../scratch/`)
- [x] T009 Apply S-P2-10 to S-P2-12: quality playbook root, review census, COMPONENT headers
- [x] T010 Add `### Extension Floors` and its pinned-copy assertion with one drift test (`sk-code-review/SKILL.md`, `scripts/check-rule-copies.js`, `scripts/check-rule-copies.test.sh`)
- [x] T014 Split the quality P0 floor per the operator's ruling and update CQ-001 (`sk-code-quality/SKILL.md`, `README.md`, `changelog/v1.3.0.0.md`, `manual-testing-playbook/quality-gate/quality-checklist.md`, `decision-record.md`)
- [x] T015 Record the no-profile ruling, drop `config` from the section 9.3 order and close review ranks 1, 3 and 5 (`sk-code-review/SKILL.md`, `../002-review-mode-research/research/research.md`, `../review/review-report.md`, `decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the sk-doc validators on each changed playbook and README
- [x] T012 Run `check-rule-copies.js`, its test suite and the four sk-code-quality test suites
- [x] T013 Run recursive strict validation of the parent packet
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
