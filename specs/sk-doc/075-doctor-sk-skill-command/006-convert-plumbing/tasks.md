---
title: "Tasks: Phase 6: convert-plumbing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert plumbing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: convert-plumbing

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOC` is `.skilled/commands/doctor`. `BR` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the convert script from phases 3 to 5 exists (`DOC/scripts/sk-skill-convert.cjs`). Verify: `node DOC/scripts/sk-skill-convert.cjs plan --help` exits 0.
- [x] T002 Confirm the phase 2 plumbing exists (`DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `ls` lists all three.
- [x] T003 [P] Record the starting gate results (`scratch/before.md`). Verify: the file lists `route-validate.sh`, `run-all.sh` and `doctor-phrase-reach.cjs` with exit codes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the workflow (`DOC/assets/doctor-sk-skill-convert.yaml`) with phases read, refuse, plan and approval, write, re-read, undo, modelled on `doctor-ci-scaffold.yaml:25-36, 86-98`. Verify: `rg -c 'STATUS=(OK|CANCELLED|FAIL)' DOC/assets/doctor-sk-skill-convert.yaml` prints 3 or more.
- [x] T005 Add the `convert` route (`DOC/_routes.yaml`) with `mutating: mutates`, `script_invocations` for `sk-skill-convert.cjs` and trigger phrases of three or more words. Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [x] T006 Add the convert target to the router and presentation (`DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`), with plan, refusal, `OK` and `CANCELLED` states. Verify: route-validate reports target parity.
- [x] T007 Add the convert row to the setup list (`DOC/assets/doctor-setup-presentation.txt`). Verify: `rg -n 'doctor:sk-skill convert' DOC/assets/doctor-setup-presentation.txt` prints one line.
- [x] T008 Add convert to `families.doctor` when absent (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `node --test DOC/scripts/tests/doctor-update-contract.test.cjs` passes.
- [x] T017 Add `default_target: true` to the `check` route when the `convert` route lands, and change the contract test's single-route assertion to expect both targets and the flag (`DOC/_routes.yaml`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `node BR/derive-command-bridges.cjs` exits 0.
- [x] T009 Activate the bridge in both lists (`BR/scoring-compatibility.json`), then run `node BR/derive-command-bridges.cjs`. Verify: `rg -c '/doctor:sk-skill' BR/command-bridges.generated.json` prints 1 or more.
- [x] T010 Extend the contract test (`DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`) with every `REFUSE:` string, the three statuses and the order plan before apply. Verify: `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` passes.
- [x] T011 Regenerate the command mirrors with the sync scripts, never by hand. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` exit 0.
- [x] T016 Author the router, presentation and convert YAML through the sk-create-command mode: read `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `ROUTER.md` and `references/router-presentation-split.md`, then run `/create:command` (`.skilled/commands/create/command.md`) against `assets/command-router-template.md`, `assets/command-presentation-template.md` and `assets/command-template.md`. Verify: the log in `scratch/` names the `/create:command` run, and a JSON Schema check of `assets/command-contract.json` against `assets/command-contract.schema.json` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: `bash DOC/scripts/tests/run-all.sh` prints every suite PASS.
- [x] T013 Run phrase reach (`DOC/scripts/doctor-phrase-reach.cjs`). Verify: `node DOC/scripts/doctor-phrase-reach.cjs` exits 0 and lists the convert phrases under `/doctor:sk-skill`.
- [x] T014 Run `/doctor:sk-skill convert` on a scratch skill under `scratch/`. Verify: the transcript shows the plan, `STATUS=CANCELLED` on "no" with no changed file, then `STATUS=OK` on "yes".
- [x] T015 Run convert on a scratch skill named with a `local-` prefix and on a dual-declaration fixture. Verify: each prints `REFUSE:` and `STATUS=FAIL`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:execution-evidence -->
## Execution Evidence

Every run below happened in this worktree on 2026-10-30, from the worktree root. `DOC` is
`.skilled/commands/doctor` and `BR` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges`.

| Task | Command | Exit | Observed |
|------|---------|------|----------|
| T001 | `node DOC/scripts/sk-skill-convert.cjs plan` with no target | 2 | The script has no `--help`: it answers an unknown option with its usage block. The usage names `plan <skill-name-or-path>` and `apply <skill-name-or-path> [--apply]`, which is the interface this phase builds on |
| T002 | `ls` on the three phase 2 files | 0 | `sk-skill.md`, `doctor-sk-skill-presentation.txt` and `doctor-sk-skill-contract.test.cjs` all present before the first edit |
| T003 | the three gates, recorded before any edit | 0 | `scratch/before.md`: 19 routes, 7/7 suites, `STATUS=OK phrases=118 bridges=22`, bridge `"fresh"` |
| T004 | `rg -c 'STATUS=(OK\|CANCELLED\|FAIL)' DOC/assets/doctor-sk-skill-convert.yaml` | 0 | 11 matching lines; the file also carries `output.statuses: [OK, CANCELLED, FAIL]` |
| T005 | `bash DOC/scripts/route-validate.sh` | 0 | `OK: route-validate — 20 routes validated, 3 warnings` |
| T006 | the same run | 0 | `PASS: J1: targets are in parity with their router and presentation across 9 commands` |
| T007 | `rg -n 'doctor:sk-skill convert' DOC/assets/doctor-setup-presentation.txt` | 0 | One row: ``\| `/doctor:sk-skill convert <name-or-path> [--dry-run]` \| …`` |
| T008 | `node --test DOC/scripts/tests/doctor-update-contract.test.cjs` | 0 | 12 tests, 12 pass; the contract already had a `families.doctor` entry, so the convert target was added to it rather than a second entry |
| T009 | `node BR/derive-command-bridges.cjs` | 0 | `"status": "generated"`, `typescriptActive 29`, `pythonActive 39`; `rg -c '/doctor:sk-skill' BR/command-bridges.generated.json` prints 10, which covers both bridges |
| T010 | `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` | 0 | 25 tests, 25 pass. The refusal test reads the converter's own source, so a reason the engine never prints fails |
| T011 | the seven sync scripts, then each with `--check` | 0 | All seven wrote 0 files and then reported `PASS` in sync, because the generated prompt stubs point at the router and carry none of its text |
| T012 | `bash DOC/scripts/tests/run-all.sh` | 0 | `[run-all] 7 suite(s) passed, 0 failed` |
| T013 | `node DOC/scripts/doctor-phrase-reach.cjs` | 0 | `STATUS=OK phrases=130 bridges=24`, with six `PASS command-doctor-sk-skill-convert` and six `PASS command-doctor-sk-skill-check` lines |
| T014 | the transcript in `scratch/t014-convert-run.md` | - | Sections 1 to 3: the plan, no change on no, the apply, the backup, the re-read and the undo |
| T015 | the same transcript, section 4 | 1 each | `RESERVED_PREFIX:` and `DUAL_DECLARATION:`, each rendered as `REFUSE:` plus `STATUS=FAIL` |
| T016 | `scratch/t016-authoring-log.md` plus the schema and structure validators | 0 | `schema errors = 0`; `✅ VALID: …/sk-skill.md`, `Total issues: 0` |
| T017 | `node BR/derive-command-bridges.cjs --check` | 0 | `"changed": []`; the contract test asserts the `default_target` flag on `check` and its absence on `convert` |

Two more checks were run because the bridge activation reaches the scorer beyond the doctor routes:

| Check | Command | Exit | Observed |
|-------|---------|------|----------|
| Accuracy ratchet | `vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | 0 | 7 tests pass, so the two new bridges moved no baseline |
| Python and TypeScript parity | `vitest run tests/parity/python-ts-parity.vitest.ts tests/parity/router-signature-parity.vitest.ts tests/compiled-routing-consumption.vitest.ts` | 0 | 7 tests pass across the three suites |
| Bridge drift guard | `vitest run tests/command-bridges-drift-guard.vitest.ts` | 0 | 5 tests pass |
<!-- /ANCHOR:execution-evidence -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the T014 transcript is saved in `scratch/`. The scratch skills were built under the dispatcher's scratch root and driven from there, because the converter only converts a direct child of the skills root it is given; the transcript records every command and its output.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 2.2, 3 and 5 (phase 6)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Evidence for every row below is in `## Execution Evidence`, `scratch/t014-convert-run.md`,
`scratch/t016-authoring-log.md` and `scratch/before.md`.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocking phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Phases 2, 3 and 5 closed: `sk-skill-convert.cjs` and `sk-skill.md` exist
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [x] CHK-011 [P0] The YAML parses: `node -e "require('yaml').parse(require('fs').readFileSync('.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml','utf8'))"` exits 0
- [x] CHK-012 [P1] Every refusal ends with `STATUS=FAIL` and a named reason
- [x] CHK-013 [P1] The YAML follows the `doctor-ci-scaffold.yaml` phase shape
- [x] CHK-014 [P1] Command surfaces came from the sk-create-command templates and the contract validates against its schema
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual run shows plan, `CANCELLED` on no, `OK` on yes
- [x] CHK-022 [P1] `local-` prefix and dual declaration refused
- [x] CHK-023 [P1] `run-all.sh` and `doctor-phrase-reach.cjs` pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds a route; it fixes no reported finding.

- [x] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the YAML, route or tests
- [x] CHK-031 [P0] The name argument is validated: `local-` and `agent-` prefixes and collisions are refused
- [x] CHK-032 [P1] `allowed-tools` is proposed and confirmed, never defaulted (D7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The YAML's invariant line states the no-write-before-yes rule
- [x] CHK-042 [P2] README updates deferred to phase 7
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch skills and transcripts live in `scratch/` only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-10-30

Notes on the two rows a reader should not read as a bare tick:

- **CHK-042** is a deferral by design: the README and changelog work belongs to the docs phase, and no README was touched here.
- **CHK-051**: no scratch skill lives in this packet's `scratch/`. The scratch skills used for the manual run were built in the dispatcher's scratch root and driven from there, so nothing needed removing from the packet. `scratch/` holds `before.md`, `t014-convert-run.md`, `t016-authoring-log.md` and `.gitkeep`, which are the phase's evidence.
<!-- /ANCHOR:summary -->

---



