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

- [x] T001 Confirm the convert script from phases 3 to 5 exists (`DOC/scripts/sk-skill-convert.cjs`). Verify: `node DOC/scripts/sk-skill-convert.cjs` with no subcommand prints its `USAGE: Invalid invocation.` usage block and exits 2.
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

<!-- ANCHOR:phase-4 -->
## Phase 4: Alignment With The Engine

The convert engine grew a plain-skill path, `--description-trim`, `--allowed-tools`, a `preserve --snapshot` check and a printed undo block while this phase was in review. Every task below brings the surfaces back in line with it; none of them changes the engine.

- [x] T018 Align the workflow with the engine's real order: plan, the trim and allowed-tools questions with their own yes, the plan rerun with the approved flags, the printed plan, the conversion question, then `apply --apply` with the same flags (`DOC/assets/doctor-sk-skill-convert.yaml`). Verify: `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` passes with its phase-order assertions.
- [x] T019 Print the engine's undo block instead of composing one (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`). Verify: the contract test's undo assertion passes and the scratch run shows the engine's `Undo:` block with its `cp` and `rm` lines and its `Check:` line.
- [x] T020 Describe the plain-skill prose step and its `preserve --snapshot` proof from the engine's interface, in the workflow, the router and the presentation (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/sk-skill.md`). Verify: the contract test's preserve assertions pass and the scratch run prints `Preservation PASS`.
- [x] T021 Derive the refusal code list from the engine source in the contract test, match the presentation table to it, and carry `INTENT_SIGNALS_BELOW_FLOOR`, `DESCRIPTION_TOO_LONG` and `ALLOWED_TOOLS_MISSING` as follow-up questions rather than refusals (`DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/assets/doctor-sk-skill-convert.yaml`). Verify: `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` reports 33 tests, 33 pass.
- [x] T022 Widen the argument hint and the command contract together, list the engine's real write set in `_routes.yaml` and in the workflow, and name `/doctor:skill-advisor rebuild` as the advisor next step (`DOC/sk-skill.md`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `DOC/_routes.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/assets/doctor-setup-presentation.txt`). Verify: a JSON Schema check of the contract reports `schema errors = 0` and `bash DOC/scripts/route-validate.sh` exits 0 with 52 script invocations.
- [x] T023 Run the workflow's order on a scratch skill in a temporary repository and record it (`scratch/t018-alignment-run.md`). Verify: the transcript shows the plan, `STATUS=CANCELLED` on no with an unchanged tree hash, and `STATUS=OK` on yes with the engine's undo block.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: The Two Reviews' Findings

Two reviews of this phase found the plain-skill path unreachable and several statements that
no longer matched what the engine prints. Every task below fixes one finding on the surfaces
this phase owns; none of them changes the engine, its libraries or the compiled bridges.

- [x] T024 Ask the intent phrases as their own follow-up: show the phrases the engine suggests in its `INTENT_SIGNALS_BELOW_FLOOR` message, let the operator approve or edit them, require at least eight distinct phrases of three or more words, and carry one repeated `--approved-phrase` per phrase on the rerun and on the apply (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/sk-skill.md`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: the contract test's follow-up assertions pass and the scratch run's plain path reaches a printed plan.
- [x] T025 Rerun the plan with the documented `apply <target> <flags>` form and no write switch on both paths, name both plan forms a rerun prints, and carry `--approved-phrase`, `--description-trim`, `--allowed-tools` and `--agent-output` on the rerun and on the apply (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/_routes.yaml`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: the contract test asserts all four flags in both phases and the scratch run prints `Apply gate: no writes without --apply.` at exit 0 on each rerun.
- [x] T026 Name one scratch root for the plain path — the agent output, the preserve snapshot and the staging copy — declare it in `setup_vars` and in the workflow `inputs`, list it in `allowed_targets`, delete it on cancel and after a finished run, and point the closing re-read at the converted root rather than the outside source (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/_routes.yaml`, `DOC/sk-skill.md`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `bash DOC/scripts/route-validate.sh` exits 0 and the contract test asserts `inputs.scratch_dir` and the scratch target.
- [x] T027 Describe the undo block as the engine prints it, say the advisor graph is rebuilt rather than backed up, and state what `STALE_PLAN` and an exit-1 apply actually catch (`DOC/assets/doctor-sk-skill-convert.yaml`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: the contract test's undo and invariant assertions pass and no surface names a `git restore` line the engine never prints.
- [x] T028 Re-record the plain and older-Skilled runs against the current engine with every flag the workflow passes, and set AC-002, AC-003, AC-006 and AC-007 from that run (`scratch/t018-alignment-run.md`, `acceptance-criteria.md`). Verify: the transcript quotes the engine's own lines for each call and `validate.sh --strict` reports `RESULT: PASSED`.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:execution-evidence -->
## Execution Evidence

Every run below happened in this worktree on 2026-10-30, from the worktree root. `DOC` is
`.skilled/commands/doctor` and `BR` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges`.

| Task | Command | Exit | Observed |
|------|---------|------|----------|
| T001 | `node DOC/scripts/sk-skill-convert.cjs` with no subcommand | 2 | `USAGE: Invalid invocation.` above the usage block. The block names `plan <skill-name-or-path>`, `apply <skill-name-or-path> [--approved-phrase <text>] [--allowed-tool <tool>] [--allowed-tools <comma list>] [--description-trim <text>] [--agent-output <path>] [--apply]` and `preserve --snapshot <dir> [<skill-dir>]`, which is the interface this phase drives: the `apply` form without `--apply` is the documented rerun |
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
| T013 | `node DOC/scripts/doctor-phrase-reach.cjs` | 0 | `STATUS=OK phrases=130 bridges=24`, with seven `PASS command-doctor-sk-skill-convert` lines (including `top "convert a plain agent skill"` and `top "/doctor:sk-skill convert"`) and five `PASS command-doctor-sk-skill-check` lines, re-run after the alignment round |
| T014 | the transcript in `scratch/t014-convert-run.md` | - | Sections 1 to 3: the plan, no change on no, the apply, the backup, the re-read and the undo |
| T015 | the same transcript, section 4 | 1 each | `RESERVED_PREFIX:` and `DUAL_DECLARATION:`, each rendered as `REFUSE:` plus `STATUS=FAIL` |
| T016 | `scratch/t016-authoring-log.md` plus the schema and structure validators | 0 | `schema errors = 0`; `✅ VALID: …/sk-skill.md`, `Total issues: 0` |
| T017 | `node BR/derive-command-bridges.cjs --check` | 0 | `"changed": []`; the contract test asserts the `default_target` flag on `check` and its absence on `convert` |
| T018 | `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` | 0 | 33 tests, 33 pass, including the phase order (plan, follow-up yeses, plan rerun, conversion question, apply with the same flags), the cancelled wording at each question site and the `--apply`-only-in-the-write-phase rule except the engine's own gate line |
| T019 | the contract test's undo assertion plus `scratch/t018-alignment-run.md` sections 5 and 6 | 0 | The workflow names the engine's `Undo:` line, one `cp` or `cp -R` from the backup per overwritten file, one `rm` or `rm -r` per created path and its `Check:` line, and the scratch run prints exactly that block: six `rm`/`rm -r` lines for the plain run and one `cp` plus one `rm` for the older-Skilled run |
| T020 | the contract test's preserve assertions plus `scratch/t018-alignment-run.md` section 4 | 0 | `Preservation PASS: 7 original body line(s) found.`, exit 0, then the apply printed the same line before its format gates |
| T021 | `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` | 0 | 66 codes derived from `sk-skill-convert.cjs` and its two libraries; every one is named in the presentation, and none of `INTENT_SIGNALS_BELOW_FLOOR`, `DESCRIPTION_TOO_LONG` or `ALLOWED_TOOLS_MISSING` is a stopping refusal anywhere |
| T022 | `/usr/bin/python3` with `jsonschema`, then `bash DOC/scripts/route-validate.sh` | 0 | `whole-document schema errors = 0`, `families.doctor schema errors = 0`; `OK: route-validate — 20 routes validated, 3 warnings` and `L1: all 52 route script invocations are invoked by their workflow YAML` |
| T023 | the harness in the worker's scratch root, driving the workflow's own calls | 0 | The plain path's plan exits 1 with `INTENT_SIGNALS_BELOW_FLOOR`, its phrase rerun exits 0 with the plan and the `approval required` proposal, no gives a hash-equal tree and `STATUS=CANCELLED`, yes gives `Result: PASS`, `Preservation PASS`, the engine's undo block and exit 0; the older Skilled trim run refuses at 173 characters and its rerun prints `Set description:` |
| T024 | `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` plus `scratch/t018-alignment-run.md:37` through `:69` | 0 | The plan call refuses with the suggested phrases, the rerun prints `Approved intent phrases (8): [...]`, and the test asserts the phrase question, the eight-phrase floor and that the code is not a refusal |
| T025 | the same run, `scratch/t018-alignment-run.md:69` and `:207` | 0 | Each rerun is `apply <target> <flags>` with no write switch: it prints the plan and closes on `Apply gate: no writes without --apply.` at exit 0, and the test asserts the four flags in both the rerun and the apply phases |
| T026 | `bash DOC/scripts/route-validate.sh` | 0 | `OK: route-validate — 20 routes validated, 3 warnings`, with `L1: all 52 route script invocations are invoked by their workflow YAML`; the route declares `scratch_dir` and the preserve call names `{scratch_dir}/snapshot` and `{scratch_dir}/staging` |
| T027 | the contract test's undo, invariant and STALE_PLAN assertions | 0 | The undo phase names one `cp`/`cp -R` per overwritten file, one `rm`/`rm -r` per created path and the `Check:` line; the invariant names the advisor graph as rebuilt rather than backed up; no surface names `git restore` |
| T028 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/075-doctor-sk-skill-command/006-convert-plumbing --strict` | 0 | `RESULT: PASSED`, with `AC_COVERAGE advisory: 9/9 ACs have evidence` |

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

This round fixes the findings two reviews raised against the phase's surfaces, and the
one contract test that failed because the engine had moved on.

| Finding | Class | Resolution |
|---------|-------|------------|
| The trim and allowed-tools writes had no backup, and the conversion yes was asked against a plan the operator never saw | P1 | T018: each field is a question with its own yes, the plan is rerun with the approved flags so the engine prints the field as a plan line, and the apply carries the same flags |
| The undo always deleted `ROUTER.md` | P1 | T019: the workflow prints the engine's undo block as printed |
| The plain-skill prose step was undescribed and unproven | P1 | T020: the agent reshapes prose into `--agent-output` and `preserve --snapshot` proves the body before the format gate |
| The refusal table and the workflow disagreed with the engine's codes | P2 | T021: the codes are derived from the engine source and the workflow carries the two follow-up messages as questions |
| The refusal reason test failed on wording the engine no longer prints | P2 | T021 |
| The argument hint, the write set and the advisor next step were stale | P2 | T022 |
| The scratch evidence predated the engine change | P2 | T023 |
| A plain skill could never convert: the plan refuses without eight `--approved-phrase` values and no phase collected them | P1 | T024 |
| The AC-003 and AC-007 evidence was not reproducible: it used phrases no phase collects and showed a `git restore` line and a source `Check:` line the engine does not print | P1 | T027, T028 |
| The undo wording named a `git restore` line, and the "every write is backed up" invariant was false for the advisor graph | P2 | T027 |
| The rerun used an undocumented `plan <flags>` form, printed only one plan form, and the phase-1 interface list omitted `--approved-phrase` | P2 | T025 |
| An exit 1 from the apply was reported as a rollback even when an undo block proved the conversion was kept | P2 | T025 |
| A dry run on a skill whose first plan refused printed no plan and no reason | P2 | T024 |
| The plain path left three scratch writes unplaced, undeclared and uncleaned, and the re-read named the outside source | P2 | T026 |
| The allowed-tools question showed a hard-coded list instead of the plan's proposal | P2 | T024, T026 |
| `STALE_PLAN` claimed to catch an edit between the approved plan and the apply | P2 | T027 |

- [x] CHK-FIX-001 [P1] Every finding above is fixed rather than deferred, and each one is verified by a command or a transcript row.
- [x] CHK-FIX-002 [P2] No finding needed a change outside the phase's own files: the engine, its libraries and the compiled bridges are untouched.
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



