---
title: "Tasks: Phase 63: cli-codex dispatch rules"
description: "Ordered tasks to scope cli-codex's fan-out rule to research and review lineages and record the sandbox IPC limit on checks."
trigger_phrases:
  - "cli codex dispatch rules tasks"
  - "cli codex fanout scope tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 63: cli-codex dispatch rules

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

- [x] T001 Confirm what the fan-out runner accepts
  - Evidence: `ACTIVE_FANOUT_LOOP_TYPES` in `fanout-run.cjs` lists only `research` and `review`.
- [x] T002 Confirm where one-shot dispatches are described
  - Evidence: `references/providers-and-models.md` §5 carries the child dispatch envelope.
- [x] T003 Match each old text in the brief against `SKILL.md` before dispatch
  - Evidence: every OLD string found exactly once with `grep -cF`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scope Execution Ownership to research and review lineages (`cli-codex/SKILL.md`)
  - Evidence: both paragraphs now name the two loop types and point one-shot dispatches at the child envelope.
- [x] T005 Add the sandbox IPC gotcha (`cli-codex/SKILL.md`)
  - Evidence: a fifth bullet names `--sandbox workspace-write`, `listen EPERM`, the date, codex-cli 0.156.1, and that the orchestrator runs such checks itself.
- [x] T006 Rewrite ALWAYS rule 2 (`cli-codex/SKILL.md`)
  - Evidence: rule 2 delegates research and review lineages and sends single build or doc dispatches to the envelope.
- [x] T007 Bump the version and add the changelog (`cli-codex/SKILL.md`, `cli-codex/changelog/v1.9.4.0.md`)
  - Evidence: `version: 1.9.4.0`; the changelog entry is new.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate both documents and search for the old wording
  - Evidence: sk-doc `validate_document.py` reports 0 issues on each; `Delegate orchestrated execution` no longer appears.
- [x] T009 Refresh the generated copies the edit made stale
  - Evidence: the cli hub's runtime and authored routing manifests and the Hermes copy of the skill; the guard and the Hermes check both pass.
- [x] T010 Update documentation
  - Evidence: this phase's four docs, row 63 in the parent map, and 062's successor.
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
