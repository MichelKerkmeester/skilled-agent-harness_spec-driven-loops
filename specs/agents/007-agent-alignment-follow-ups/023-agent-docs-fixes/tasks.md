---
title: "Tasks: Phase 23: agent-docs-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent docs fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: agent-docs-fixes

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
`X` is `.skilled/bin/agent-mirror-crosswalk.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-measure each finding against the tree after phase 22 (`research/research.md` of phase 20). Verify: each brief quotes the current text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Bring the crosswalk to eight trees (`.skilled/bin/agent-mirror-crosswalk.md`). Verify: no tree count of six remains.
- [x] T003 [P] Fix the runtime lists and the Vibe sync doc (README, `CROSS-CLI.md`, agents README, both deep-loop skills, mirror check comment, `.vibe/SYNC.md`). Verify: `rg -n Copilot` over both skills prints nothing.
- [x] T004 [P] Fix the status enum, tool line, agent classes, citations and doctor roster wording (ten files). Verify: both enums list `thought` and the doctor YAML parses.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the REQ-001 search and check each new citation. Verify: the search prints nothing and each citation lands on its rule.
- [x] T006 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every phase 20 doc finding is fixed or recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 20 findings in `../020-agent-docs-alignment-research/research/research.md` sections 3 to 6
<!-- /ANCHOR:cross-refs -->
