---
title: "Tasks: Phase 004 — Trigger Phrases, advisor + code-graph"
description: "Task breakdown for adding and improving trigger_phrases in the skill-advisor and code-graph catalog snippets."
trigger_phrases:
  - "trigger phrases advisor codegraph tasks"
  - "advisor trigger phrases task list"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 004 — Trigger Phrases, advisor + code-graph

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Audit existing `trigger_phrases` in both skills
- [ ] T002 Build the category batches for skill-advisor and code-graph
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Process the skill-advisor categories
- [ ] T004 Process the code-graph categories
- [ ] T005 Improve existing weak phrases to the three-phrase floor
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Run the per-skill missing `trigger_phrases` greps
- [ ] T007 Run the combined gap check across both skills
- [ ] T008 Review the diff scope before committing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
