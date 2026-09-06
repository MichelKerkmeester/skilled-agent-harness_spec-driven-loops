---
title: "Tasks: deep review remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review remediation tasks"
  - "verify findings at source"
  - "close completion rows"
  - "reader fail closed test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep review remediation

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

- [x] T001 Run the review as a cli-codex lineage through the fan-out runner: ten iterations, stop policy max-iterations (`../review/lineages/luna-max/`)
- [x] T002 Recover the misplaced iteration 9 (written to the repository root by the model, preserved by the containment gate) into the lineage and resume for iteration 10 and synthesis
- [x] T003 [P] Verify all six findings at their cited locations before changing anything
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 F001: shared `assertTriggerIndexShape` in `lib/artifact.mjs`, called by the generator and the reader; silent skips removed from lookup
- [x] T005 F002 and F003: close T013 in phase 005 and the completion and checklist rows in phases 001 and 002 with evidence
- [x] T006 F004: restate the retired-prefix criterion in the parent goal to the proven form and record the amendment
- [x] T007 F005 and F006: owner and review checkpoint on every open decision; release-environment caveat row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Retrieval suites pass with the four fail-closed cases (76 tests)
- [x] T009 Index regenerates byte-identical; parent validates recursively with 0 errors
- [x] T010 Parent map, roadmap and this packet's docs updated
- [x] T011 Alignment inventory: 214 hits in 115 live files still describing the memory database, daemon, server, tools or retired commands (changelogs, benchmark reports and spec packets excluded)
- [x] T012 Runtime surfaces aligned: commands index, doctor menus and update workflow, agent routing tables and mirrors in five runtimes, hooks, install guides, root README and release notes; dangling installer symlink removed (`64de7e9389`, `00fb64241f`)
- [x] T013 Skill docs aligned: system-spec-kit references, catalog, playbook and module READMEs; every other skill's references and playbooks; the agent template's dead memory grant; two references whose subject was the dead store deleted with the leaf manifest regenerated (`59aa0b8435`)
- [x] T014 Code seams repaired: spawn-authority guard reads the advisor's lease, doctor:update drops the deleted server artifact and keeps state in the advisor's database directory, route guard and config blocks cleaned (`6f9a7331b2`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every finding re-read at source, fixes proven by the suites and the recursive validate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



