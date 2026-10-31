---
title: "Tasks: Phase 65: cli-hermes and cli-pi dispatch rules"
description: "Ordered tasks to scope the cli-hermes and cli-pi rule that sends dispatches to the shared runtime to research and review lineages."
trigger_phrases:
  - "cli hermes pi dispatch rules tasks"
  - "cli hermes pi runtime delegation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 65: cli-hermes and cli-pi dispatch rules

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

- [x] T001 Find every cli packet that sends all dispatches to the shared runtime
  - Evidence: cli-hermes and cli-pi, five sites each; the `SKILL.md` of cli-claude-code and of cli-opencode never mention the shared runtime.
- [x] T002 Confirm the runner checks loop type for every executor kind
  - Evidence: `main()` in `fanout-run.cjs` calls `assertActiveFanoutLoopType` right after parsing its arguments, before it reads the fan-out config or builds any executor's command; three helpers repeat the check.
- [x] T003 Find where each packet describes a one-shot dispatch
  - Evidence: cli-pi's `references/providers-and-models.md` §5 "Dispatch envelope (child / detached sessions)"; cli-hermes has no envelope section, so its `SKILL.md` §3 "The Dispatch Shape" plus ALWAYS rule 11's child environment.
- [x] T004 Match each old text in the brief against its file before dispatch
  - Evidence: all twelve OLD strings found exactly once with `grep -cF`; the verification pattern hit exactly the ten lines to be replaced.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Scope the five rule sites in cli-hermes (`cli-hermes/SKILL.md`)
  - Evidence: core principle, Execution Ownership, lifecycle step 4, rule 2 and the success criterion; `version: 1.0.4.0`.
- [x] T006 Scope the five rule sites in cli-pi (`cli-pi/SKILL.md`)
  - Evidence: the same five sites; `version: 1.5.11.0`.
- [x] T007 Add both changelog entries (`cli-hermes/changelog/v1.0.4.0.md`, `cli-pi/changelog/v1.5.11.0.md`)
  - Evidence: each file is byte-identical to the text in the brief.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate the four documents and search all seven cli packets for the old wording
  - Evidence: sk-doc `validate_document.py` reports 0 issues on each; the sweep over every cli `SKILL.md` finds no hit.
- [x] T009 Refresh the generated copies the edit made stale
  - Evidence: the cli hub's runtime and authored routing manifests and the Hermes copies of both skills; the guard, the Hermes check and every other mirror check pass.
- [x] T010 Update documentation
  - Evidence: this phase's four docs, row 65 in the parent map, and 064's successor.
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
