---
title: "Tasks: Phase 2: mode-scaffold"
description: "Task Format: T### [P0/P1/P2] Description (file path)"
trigger_phrases:
  - "sk-create-goal scaffold tasks"
  - "nested packet setup tasks"
  - "mode scaffold verification"
  - "parent-skill 6a check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: mode-scaffold

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P0]` | Hard blocker |
| `[P1]` | Required |
| `[P2]` | Optional |

**Task Format**: `- [ ] T### [P0], [P1] or [P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read phase 001's final ownership decision and target tree. Confirm every incoming handoff condition is met (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/target-tree.md` and `mode-boundary.md`, plus the parent handoff at `specs/sk-doc/060-create-goal-mode/spec.md:142-143`). Evidence: phase 001 closed with strict `RESULT: PASSED`; `mode-boundary.md` section 5 selects a mode-local checker and `target-tree.md` section 1 lists the packet tree.
- [x] T002 [P0] Confirm `.skilled/skills/sk-doc/sk-create-goal/` is absent and record the output plus exit status of the baseline parent-skill check (`node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-248`). Evidence: `ls -d .skilled/skills/sk-doc/sk-create-goal` exited 1 (absent); the baseline parent-skill check printed `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0.
- [x] T003 [P1] Record whether phase 001 selected a mode-local checker. Create no `scripts/` directory until that decision is available (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). Evidence: phase 001 selected a mode-local checker, so `scripts/` is created.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Author `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` from the nested packet scaffold with the goal-file execution boundary, renderer ownership and routing contract (`.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:1-18,66-101`) (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`). Evidence: `SKILL.md` (179 lines) carries the four pre-write decisions, the system-spec-kit rendering path, the files-only boundary and the goal contract facts.
- [x] T005 [P0] Create `.skilled/skills/sk-doc/sk-create-goal/README.md` as a reader stub and `references/README.md` as the packet reference index (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:40-49`) (`specs/sk-doc/z_archive/040-create-repo-rules/003-skill-scaffold-and-template/spec.md:77-83,93-104`). Evidence: `README.md` is an 18-line stub; `references/README.md` indexes the six owner documents; all 18 relative links resolve.
- [x] T006 [P0] Create `assets/` for phase 003 exemplars and `changelog/` for later release notes. Create `scripts/` only for a phase 001 local-checker decision (`specs/sk-doc/060-create-goal-mode/spec.md:123,126,129`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). Evidence: `assets/`, `changelog/` and `scripts/` exist, each holding a `.gitkeep` until its content lands.
- [x] T007 [P0] Keep the mode unregistered. Omit its own root identity files and do not copy `goal.md.tmpl` (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:59`) (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`). Evidence: `find` for `goal.md.tmpl`, `graph-metadata.json` and `description.json` under the mode returned 0; `git status --short .skilled/` shows no change outside `sk-create-goal/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-doc/sk-create-goal --check --strict`. Require `Result: PASS` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171`). Evidence: `Result: PASS`, exit 0, with one advisory warning for `scripts/.gitkeep`.
- [x] T009 [P0] Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`. Require only invariant `6a` for `sk-create-goal`, with no other failure (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-255`) (`specs/sk-doc/060-create-goal-mode/spec.md:143`). Evidence: exit 1 with exactly one failure, `6a: child director(ies) neither registered as a packet nor allowlisted: [sk-create-goal]`.
- [x] T010 [P0] Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/002-mode-scaffold --strict`. Require `RESULT: PASSED` after generated metadata is current (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). Evidence: `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-25.
- [x] T011 [P1] Run `find .skilled/skills/sk-doc/sk-create-goal -print | sort` and compare the listing with phase 001's `target-tree.md`. Verify that no hub registration or local goal template exists (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`) (`specs/sk-doc/060-create-goal-mode/goal.md:50`). Evidence: the listing is `SKILL.md`, `README.md`, `references/README.md`, `assets/.gitkeep`, `changelog/.gitkeep`, `scripts/.gitkeep`, the phase 002 subset of the target tree; no registration and no local goal template.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks have observed evidence in this checklist.
- [x] Every acceptance criterion is `Met`, `Waived` or `Superseded` with valid evidence (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/acceptance-criteria.md:50-75`).
- [x] [P0] The package gate reports `Result: PASS`, the parent check reports only the expected `6a` and strict validation prints `RESULT: PASSED` (`specs/sk-doc/060-create-goal-mode/spec.md:131-143`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Acceptance closure gate**: See `acceptance-criteria.md`.
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 001 ownership contract and target tree are final (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`).
- [x] CHK-002 [P0] Target mode directory is absent and the parent-check baseline is recorded (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-248`).
- [x] CHK-003 [P1] Checker ownership determines whether `scripts/` is created (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Strict package check prints `Result: PASS` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171`).
- [x] CHK-011 [P0] Parent-skill check reports only `6a` for `sk-create-goal` (`specs/sk-doc/060-create-goal-mode/spec.md:143`).
- [x] CHK-012 [P1] `SKILL.md` names the system-spec-kit renderer and has no copied goal template (`specs/sk-doc/060-create-goal-mode/goal.md:50`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18`). `SKILL.md:105`.
- [x] CHK-013 [P1] No mode registration or hub metadata is added in this phase (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143`) (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion has a corresponding task reference in its Verification cell (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/acceptance-criteria.md:50-75`).
- [x] CHK-021 [P0] Strict phase validator prints `RESULT: PASSED` (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`).
- [x] CHK-022 [P1] The packet file listing matches phase 001's target tree (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] Confirm fix-specific producer and consumer inventories are not applicable because this phase scaffolds a packet and does not fix a reported defect (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The mode root contains no hub identity files and no copied goal template (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:59`) (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`) (`specs/sk-doc/060-create-goal-mode/goal.md:50`).
- [x] CHK-031 [P1] No goal-hook state, host goal command or system-spec-kit source is changed (`specs/sk-doc/060-create-goal-mode/spec.md:94-98` and `specs/sk-doc/060-create-goal-mode/goal.md:51-54`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `SKILL.md`, `README.md`, `references/README.md` and `assets/` describe the same packet boundary (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:40-49`).
- [x] CHK-041 [P2] The README stays a stub and makes no claim that later authoring standards already exist (`specs/sk-doc/060-create-goal-mode/spec.md:123-129`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary output is left in the mode packet (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/plan.md:119-128`).
- [x] CHK-051 [P1] Every created path is under `.skilled/skills/sk-doc/sk-create-goal/` (`specs/sk-doc/060-create-goal-mode/spec.md:85-109`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->
