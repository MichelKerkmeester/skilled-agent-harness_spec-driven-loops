---
title: "Tasks: Assess a proposed thinking discipline against AGENTS.md and the repo rules, and integrate what survives the repo-rule decision tests"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Assess a proposed thinking discipline against AGENTS.md and the repo rules, and integrate what survives the repo-rule decision tests

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

- [x] T001 Scaffold the packet in the agents track (`specs/agents/017-thinking-discipline/`)
- [x] T002 Map all nine points to existing homes with citations (`research/research.md`)
- [x] T003 [P] DeepSeek V4.1 Flash max review via cli-pi (`research/reviews/deepseek-v4.1-flash-max.md`)
- [x] T004 [P] GPT-6 Luna max fast review via cli-codex (`research/reviews/gpt-6-luna-max-fast.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run the four decision tests and record refusals (`research/research.md` §4–5)
- [x] T006 Operator confirmed Test 4 and picked the rule section plus the AGENTS.md line
- [x] T007 Apply the chosen edit (`.skilled/repo-rules/uncertainty-and-honesty.md`, `REPO RULES.md`, `AGENTS.md`)
- [x] T007a Trim AGENTS.md Gate 3 by 123 bytes net so Blast-Radius ends inside the 16,384-byte prefix (`AGENTS.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `check-repo-rules` 11/11 PASS exit 0; `check-rule-copies` OK exit 0, Blast-Radius ends at byte 16,373
- [x] T008a Opus high review applied in full (`research/research.md` §7)
- [x] T008b Devin fix: `.devin/config.json`, `.devin/skills` link, sync-script guard and `.devin/SYNC.md` (`research/research.md` §9)
- [x] T009 `validate.sh --strict` reports RESULT: PASSED
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



