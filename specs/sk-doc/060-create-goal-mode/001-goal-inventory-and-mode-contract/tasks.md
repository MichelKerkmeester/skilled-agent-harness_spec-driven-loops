---
title: "Tasks: Phase 1: goal-inventory-and-mode-contract"
description: "Phase 001 tasks for the read-only goal inventory and mode contract, each tagged with P0, P1, or P2 priority."
trigger_phrases:
  - "goal inventory tasks"
  - "goal defect reproduction"
  - "goal contract verification"
  - "goal corpus checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: goal-inventory-and-mode-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P0]` | Blocking task |
| `[P1]` | Required task |
| `[P2]` | Optional task |
| `[B]` | Blocked |

**Task Format**: `T### [P0] Description (artifact path)`; use `[P1]` or `[P2]` where appropriate.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the frozen parent scope, D1-D6, both audits, and the goal contract sources; record source line references in `goal-anatomy.md` (`specs/sk-doc/060-create-goal-mode/spec.md:90-99,119-143`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`). Evidence: `goal-anatomy.md` §1-§7 cites the template, slice module, validator and manifest by line; `mode-boundary.md` §1-§3 cites D1-D6.
- [x] T002 [P0] Enumerate `specs/**/goal.md` outside `z_archive` and record the denominator and every path in `goal-corpus-audit.md` (`specs/sk-doc/060-create-goal-mode/spec.md:142`). Evidence: `find specs -type f -name goal.md ! -path '*/z_archive/*' | wc -l` printed 296; `goal-corpus-audit.md` §1; every path is a row in `scratch/goal-corpus-scan.json`.
- [x] T003 [P0] Run `goal.cjs packet` once for every enumerated packet directory; retain each command, exit status, durable count, and budget result in `goal-corpus-audit.md` (`.skilled/hooks/goal/bin/goal.cjs:203-216`). Evidence: `scratch/goal-corpus-scan.json` summary `exitZero: 296` of 296; each row keeps the command, exit, durable count and budget.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Classify placeholder objectives, over-budget parents, missing binding rows, criterion counts outside three to seven, and criteria requiring another file; reproduce every audit-cited example with a command in `goal-corpus-audit.md` (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`; `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`). Evidence: `goal-corpus-audit.md` §2-§9 give each class with its count and packets; §11 reproduces 4 of 4 audit examples with command, output and exit status; §12 lists other-file criteria as human review.
- [x] T005 [P1] Write `goal-anatomy.md` with sections, durable/chat/objective slices, parent versus child structure, limits, and the code that enforces each (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-128`; `.skilled/hooks/goal/lib/goal-slice.cjs:52-118`). Evidence: `goal-anatomy.md` §1-§7; the 4,820 to 3,735 parent cut is recorded as a measured fact in §4.
- [x] T006 [P0] Write `mode-boundary.md` assigning system-spec-kit, goal hooks, host session-goal commands, and `sk-create-goal`; settle the checker versus validator-amendment question against D4 (`specs/sk-doc/060-create-goal-mode/spec.md:90-99,157`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`). Evidence: `mode-boundary.md` §1-§5. Verdict: ship a mode-local checker and record a separate system-spec-kit validator amendment request.
- [x] T007 [P1] Write `decision-tests.md` to distinguish packet-file authoring from session-goal setting, binding, and resend requests (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-123`; `.skilled/commands/speckit/assets/speckit-plan.yaml:182-200`). Evidence: `decision-tests.md` §1-§4, each with one passing and one redirected request.
- [x] T008 [P1] Write `target-tree.md` for the nested mode packet, using the 040 phase 002 and mode packet precedents (`specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/target-tree.md:30-69`; `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:29-43`). Evidence: `target-tree.md` §1-§4 name every mode path, hub surface, command mirror and release path with the phase that creates it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Reconcile the `find` denominator with per-file `goal.cjs packet` results and confirm each audit-cited defect has command output (`specs/sk-doc/060-create-goal-mode/spec.md:138-143`). Evidence: denominator 296 equals `exitZero` 296; each audit-cited defect has command output in `goal-corpus-audit.md` §11.
- [x] T010 [P1] Re-open every load-bearing source citation and mark any unverified claim UNKNOWN (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105`). Evidence: the orchestrator re-opened the load-bearing citations; two were wrong and were fixed (a section cross-reference in `goal-corpus-audit.md` §2 and an audit-file cite in `mode-boundary.md` §5). Live host goal-command behavior is marked UNKNOWN in `mode-boundary.md` §1.
- [x] T011 [P0] Run strict validation on this phase folder and read its Summary line and every remaining rule ID (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). Evidence: `validate.sh` on this folder with `--strict` printed `RESULT: PASSED` with 0 errors and 0 warnings on 2026-09-25.
- [x] T012 [P1] Confirm the five analysis outputs are non-empty and remain within the phase folder; do not create or edit skill files (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`). Evidence: the five outputs are 4,940 to 29,624 bytes; `git status --short --untracked-files=all` shows no write outside this packet except the pre-existing `specs/sk-doc/graph-metadata.json` track update; no skill file changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every task T001-T012 is checked with evidence and carries one `[P0]`, `[P1]`, or `[P2]` priority tag.
The phase is ready for handoff only after the corpus count, defect commands, ownership decision, five artifacts, and strict validator result are recorded (`specs/sk-doc/060-create-goal-mode/spec.md:138-143`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] The read-only boundary and handoff criteria are stated in `spec.md` (`specs/sk-doc/060-create-goal-mode/spec.md:121-143`).
- [x] CHK-002 [P0] Census, CLI, defect reproduction, and validation commands are stated in `plan.md` (`.skilled/hooks/goal/bin/goal.cjs:203-216`).
- [x] CHK-003 [P1] Parent, audit, and source dependencies are named; missing evidence will be marked UNKNOWN (`specs/sk-doc/060-create-goal-mode/spec.md:164-168`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P2] No code is planned in phase 001; confirm the output tree contains only the five analysis artifacts (`specs/sk-doc/060-create-goal-mode/spec.md:90-99,138-143`). Only the five analysis artifacts were added beside the planned docs; scratch holds the scan and the two audits.
- [x] CHK-011 [P2] No goal runtime mutation command is used; the plan uses only the `packet` reporting action (`.skilled/hooks/goal/bin/goal.cjs:203-216`). Only `goal.cjs packet` ran.
- [x] CHK-012 [P2] N/A: no code error handling is implemented in this read-only phase.
- [x] CHK-013 [P2] N/A: no code changes are planned in phase 001 (`specs/sk-doc/060-create-goal-mode/spec.md:121`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is traceable to a task in this file. Each AC row names its tasks.
- [x] CHK-021 [P0] Every audit-cited corpus defect has a reproduction command and recorded output (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`). `goal-corpus-audit.md` §11.
- [x] CHK-022 [P1] Empty, missing, and failed CLI inputs have an explicit reporting path (`.skilled/hooks/goal/bin/goal.cjs:203-216`). Each scan row keeps exit and status; §11 records the one non-zero exit (`ls`, exit 1).
- [x] CHK-023 [P1] Every report conclusion has a command, source citation, or is marked UNKNOWN.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] N/A: phase 001 fixes no implementation defect; it records observed corpus defects and their reproduction commands (`specs/sk-doc/060-create-goal-mode/spec.md:121`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] N/A: this phase handles repository text only and introduces no credentials or access control.
- [x] CHK-031 [P2] N/A: no user input parser is built in this read-only phase.
- [x] CHK-032 [P2] N/A: no auth surface is changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `acceptance-criteria.md` describe the same five analysis artifacts. All four docs name the same five artifacts (grep).
- [x] CHK-041 [P1] Every repository fact in the reports carries a source line or command.
- [x] CHK-042 [P2] N/A: a mode README belongs to a later phase (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Any temporary command output stays under this phase's `scratch/` directory. The scan output is `scratch/goal-corpus-scan.json`.
- [x] CHK-051 [P1] Temporary files created during execution are removed after their results are captured. No temporary files were left; scratch keeps only evidence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---

