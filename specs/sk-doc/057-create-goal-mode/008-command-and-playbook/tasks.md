---
title: "Tasks: Phase 8: command-and-playbook"
description: "Tasks to author and verify the /create:goal command surface and its eight-scenario manual testing playbook."
trigger_phrases:
  - "create-goal phase tasks"
  - "goal command verification checklist"
  - "goal playbook implementation tasks"
  - "command mirror checks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: command-and-playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T###` followed by one priority tag, a description and its file path.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read Phase 004's accepted operation decision and record the exact operation names for the argument hint; stop command authoring if the decision is absent (specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md). Evidence: the six settled operations are top-level, phase-parent, child, retrofit, phase-add and amend (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/implementation-summary.md:57`).
- [x] T002 [P0] Confirm Phase 007's real-request evidence satisfies the parent handoff for both routing stages (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md). Evidence: phase 007 routes a real goal-authoring request advisor to `sk-doc` to `sk-create-goal` (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/scratch/routing-replay-final.txt:3`).
- [x] T003 [P1] Check that the four runtime mirror destinations and the playbook package target do not contain conflicting files (.claude/commands/create/goal.md, .codex/prompts/create-goal.md, .pi/prompts/create-goal.md, .cursor/commands/create-goal.md, .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/). Evidence: none of the six mirror paths or the playbook root existed before the dispatch; `git status` showed them absent.
- [x] T004 [P1] Load the command and playbook authoring contracts before writing any command or scenario artifacts (.skilled/skills/sk-doc/sk-create-command/SKILL.md; .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md). Evidence: both workers loaded `sk-create-command` and `sk-create-manual-testing-playbook` with their command YAMLs before writing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Invoke `/create:command` through `sk-create-command` to author `.skilled/commands/create/goal.md` as a thin router, not by hand (.skilled/commands/create/goal.md). Evidence: the router is 75 lines with eight contract sections; `validate_document.py --type command` reports 0 issues (`.skilled/commands/create/goal.md:50`).
- [x] T006 [P0] Author `.skilled/commands/create/assets/create-goal-auto.yaml` and `.skilled/commands/create/assets/create-goal-confirm.yaml`; wire each advertised suffix to its matching asset (.skilled/skills/sk-doc/sk-create-command/SKILL.md). Evidence: `:auto` and `:confirm` resolve to `create-goal-auto.yaml` and `create-goal-confirm.yaml`; both parse as YAML and run `check-goal.cjs` (`.skilled/commands/create/goal.md:50`).
- [x] T007 [P0] Author `.skilled/commands/create/assets/create-goal-presentation.txt` and keep prompts, results and next steps out of the router (.skilled/skills/sk-doc/sk-create-command/SKILL.md). Evidence: prompts, results and the session-goal redirect live in the presentation asset (`.skilled/commands/create/assets/create-goal-presentation.txt:40`).
- [x] T008 [P0] Add one `/create:goal` entry to `.skilled/skills/sk-doc/command-metadata.json` with `ownerMode: sk-create-goal` and an argument hint containing every Phase 004 operation plus `:auto` and `:confirm` (.skilled/skills/sk-doc/command-metadata.json). Evidence: one entry, `ownerMode: sk-create-goal`, an 86-character hint with the six operations and both suffixes (`.skilled/skills/sk-doc/command-metadata.json:456`).
- [x] T009 [P0] Add one `/create:goal` invocation row to `.skilled/commands/create/README.txt` (.skilled/commands/create/README.txt). Evidence: one COMMANDS row (`.skilled/commands/create/README.txt:55`) plus the file-tree line and a usage example.
- [x] T010 [P0] Create `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md` and `.cursor/commands/create-goal.md` as runtime mirrors. Evidence: generated, never hand-written: the `.claude` and `.cursor` symlinks by `sync-runtime-mirrors.cjs`, the `.codex` and `.pi` prompts by their sync scripts; each `test -f` succeeds.
- [x] T011 [P0] Invoke `/create:manual-testing-playbook sk-create-goal create --path .skilled/skills/sk-doc :confirm` through `sk-create-manual-testing-playbook` with `manual-scenarios` source strategy and this phase as the existing spec folder (.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md). Evidence: the package root `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md:162` built through the playbook workflow with `manual-scenarios` and spec_choice D. Deviation: run as `:auto`, because a dispatched worker cannot answer checkpoints; the orchestrator reviewed the category and root index afterwards.
- [x] T012 [P0] Author the eight indexed scenario files under `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/`, one for each required top-level, nested, missing-goal, budget, placeholder, binding, session-routing and parent-resend behavior. Evidence: eight files in `goal-authoring/`, SCG-001 to SCG-008, each indexed once (`.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md:331`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Run `check_authored_name_kebab.py`, `validate_document.py --type command` and `extract_structure.py` on `.skilled/commands/create/goal.md`; read each output and exit status (.skilled/skills/sk-doc/sk-create-command/SKILL.md:383-408). Evidence: kebab PASS; `validate_document.py --type command` 0 issues; `extract_structure.py` exit 0 with eight sections.
- [x] T014 [P0] Parse `.skilled/skills/sk-doc/command-metadata.json` with Node; inspect the `/create:goal` entry for one owner, all Phase 004 operation names, both suffixes and the argument-hint length limit. Evidence: the entry parses with Node; owner `sk-create-goal`; hint length 86 of 140.
- [x] T015 [P0] Run `rg -n '/create:goal' .skilled/commands/create/README.txt` and confirm exactly one row; run `test -f` on each of the four runtime mirror paths. Evidence: one row in each index; all four mirror paths resolve with `test -f`.
- [x] T016 [P0] Run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook`; require `PASS` and eight indexed scenarios (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:447-490). Evidence: `PASS package=sk-doc/sk-create-goal tier=FAIL_CLOSED scenarios=8 categories=1 operator=8 routing_gold_excluded=0 violations=0 warnings=0`.
- [x] T017 [P0] Manually inspect all eight scenario files against the root index, exact prompts, command sequences, expected signals, evidence, pass/fail criteria and failure triage (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:243-263, 329-337). Evidence: every scenario has a prompt, commands, expected signals, evidence, pass/fail criteria and failure triage, and each file name appears once in the root index; HVR 0 hard blockers in all nine files.
- [x] T018 [P0] Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/008-command-and-playbook --strict`; fix every error except the three generated-metadata rules reserved for the orchestrator, and read the `Summary` line and exit status. Evidence: strict validation `RESULT: PASSED` on 2026-09-26.
- [x] T019 [P1] Reconcile each acceptance criterion with its task and evidence cell; keep all criteria `Unmet` until the phase implementation has run (acceptance-criteria.md). Evidence: every acceptance row carries its observed evidence and status.
- [x] T020 [P1] Review the scoped output list and rollback steps; confirm no hub registration, mode implementation, parent document or other phase is included (specs/sk-doc/060-create-goal-mode/spec.md:94-108, 127-149). Evidence: `git status` shows only the command set, the metadata entry, the two indexes, the generated mirrors and the playbook; no hub registration, mode or other phase file changed in this phase.
- [x] T021 [P0] Regenerate the Hermes mirrors with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, then confirm both pass with `--check` (operator-approved amendment). Evidence: `sync-prompts-hermes.cjs --check` prints `PASS: 34 prompts are in sync` and `sync-skills-hermes.cjs --check` prints `PASS: 71 Hermes skill copies in sync`.
- [x] T022 [P0] Add the `/create:goal` row to `.skilled/commands/README.txt`, raise the create count to 13, and confirm `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` (operator-approved amendment). Evidence: the row is at `.skilled/commands/README.txt:149` and the create count at `.skilled/commands/README.txt:44` reads 13; the catalog check prints `STATUS=OK`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] All P0 tasks have execution evidence and all P1 tasks are complete or explicitly deferred.
- [x] [P0] No blocking task or acceptance criterion remains unresolved.
- [x] [P1] The command mirrors resolve and the playbook package validator reports `PASS`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Acceptance criteria**: See `acceptance-criteria.md`.
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` with testable REQ identifiers.
- [x] CHK-002 [P0] Plan names every command, workflow and observable check.
- [x] CHK-003 [P1] Phase 004 operation decision and Phase 007 route handoff are available before implementation. (phase 004 summary and phase 007 replay)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The command router passes the shared command structure and authored-name checks.
- [x] CHK-011 [P1] `command-metadata.json` parses as JSON and contains one `/create:goal` entry.
- [x] CHK-012 [P1] Both `:auto` and `:confirm` targets resolve to workflow assets.
- [x] CHK-013 [P1] The four runtime command mirrors resolve to files. (all four resolve; the two Hermes copies too)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion has an evidence command and a tracing task.
- [x] CHK-021 [P0] The playbook package validator reports `PASS` and counts eight scenarios. (`scenarios=8`, `violations=0`)
- [x] CHK-022 [P1] The root index maps each required scenario to one canonical per-feature file.
- [x] CHK-023 [P1] Each scenario defines a prompt, command sequence, expected signal, evidence and binary verdict. (all eight carry every section; SCG-007 and SCG-008 executed and passed)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase authors command and playbook documentation; it does not remediate a code finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or production data appears in command or playbook artifacts.
- [x] CHK-031 [P0] Required command input is explicit and is not inferred from unrelated context.
- [x] CHK-032 [P1] The command adds no privileged or external action outside its packet-file authoring scope.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` describe the same scope and checks.
- [x] CHK-041 [P1] The router keeps presentation wording in its presentation asset.
- [x] CHK-042 [P1] The create-command README has one accurate `/create:goal` row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New command, mirror and playbook artifacts stay at the paths named in `spec.md`. Deviation: the approved amendments add the Hermes copies and the repo-wide index row beyond the spec's original list.
- [x] CHK-051 [P1] No temporary, generated or unrelated file remains in the phase scope. (scenario runs removed their temp workspaces; evidence stays under `scratch/scenario-runs/`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->

---
