---
title: "Tasks: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "claude code native dispatch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI

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

- [x] T001 Read the guard lines in `cli-claude-code/SKILL.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Reword the three guard lines (`.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md`)
- [x] T003 Re-mint the hub manifest and copy it to its authored source
- [x] T007 State effort inheritance and cite the subagents page in the bullet and guard comment (`.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md`)
- [x] T008 Regenerate the Hermes copy (`node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`)
- [x] T009 Add the doc test (`.skilled/skills/system-spec-kit/runtime/cli/tests/claude-code-native-dispatch-docs.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 `parent-skill-check.cjs` on the hub exits 0
- [x] T005 `compiled-route-guard.cjs` exits 0 and `route-validate.sh` exits 0
- [x] T006 Strict validation prints `RESULT: PASSED`
- [x] T010 The doc test fails against the stale Hermes copy and passes after regeneration
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gate checks passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



