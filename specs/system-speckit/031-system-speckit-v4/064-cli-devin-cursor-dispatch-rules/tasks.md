---
title: "Tasks: Phase 64: cli-devin and cli-cursor dispatch rules"
description: "Ordered tasks to scope the cli-devin and cli-cursor fan-out rule to research and review lineages."
trigger_phrases:
  - "cli devin cursor dispatch rules tasks"
  - "cli devin cursor fanout scope tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 64: cli-devin and cli-cursor dispatch rules

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

- [x] T001 Find every line in both packets that routes dispatches through the runner
  - Evidence: Execution Ownership (two sentences) and ALWAYS rule 2 in each; the success-criteria and Execution summary lines are the ones cli-codex also kept.
- [x] T002 Confirm where each packet describes its child envelope
  - Evidence: both `references/providers-and-models.md` hold "Dispatch envelope (child / detached sessions)" under `## 5. HOW TO INVOKE`.
- [x] T003 Match each old text in the brief against its file before dispatch
  - Evidence: all eight OLD strings found exactly once with `grep -cF`; neither changelog file existed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scope Execution Ownership and rule 2 in cli-devin (`cli-devin/SKILL.md`)
  - Evidence: three replacements with executor kind `cli-devin`; `version: 1.4.3.0`.
- [x] T005 Scope Execution Ownership and rule 2 in cli-cursor (`cli-cursor/SKILL.md`)
  - Evidence: three replacements with executor kind `cli-cursor`; `version: 1.4.2.0`.
- [x] T006 Add both changelog entries (`cli-devin/changelog/v1.4.3.0.md`, `cli-cursor/changelog/v1.4.2.0.md`)
  - Evidence: each file is byte-identical to the text in the brief.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate the four documents and search for the old wording
  - Evidence: sk-doc `validate_document.py` reports 0 issues on each; the old wording appears 0 times in both `SKILL.md`.
- [x] T008 Refresh the generated copies the edit made stale
  - Evidence: the cli hub's runtime and authored routing manifests and the Hermes copies of both skills; the guard and the Hermes check both pass.
- [x] T009 Update documentation
  - Evidence: this phase's four docs, row 64 in the parent map, and 063's successor.
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
