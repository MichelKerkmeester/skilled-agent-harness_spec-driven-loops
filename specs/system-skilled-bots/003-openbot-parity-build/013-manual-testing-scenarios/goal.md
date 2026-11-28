---
title: "Goal: Phase 13: manual-testing-scenarios"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios"
    last_updated_at: "2026-11-25T20:02:42Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-012-manual-testing-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 13: manual-testing-scenarios

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove from a plain terminal that an operator can drive every verb and record phases 001 to 011 deliver, by adding 33 scenarios in ten new category folders to the system-skilled-bots manual testing playbook, the nine conversation scenarios first and recording one execution of all 58 scenarios with the three system-deep-loop scenarios that cover the executor audit, as phase 13 of the parent goal's OpenBot parity build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes documentation only. No runtime module, CLI verb, test or crate changes, and a scenario that finds a phase's behavior wrong files a defect against that phase rather than editing it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:42]. |
| D2 | The nine conversation scenarios come first, and each is one bash block whose turns are numbered rather than the `json conversation` runner style, because the subject is the bots CLI and not an AI runtime session [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:187]. |
| D3 | The corpus gains 33 scenarios, one per requirement cluster rather than one per requirement, so `BOT-026` to `BOT-058` is the whole addition and 58 is the corpus total [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:52]. |
| D4 | Every timing scenario computes its slot at run time from the current clock plus two minutes and names no future day, and the `until` and fatigue scenarios drive a short loop with no wait [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:189]. |
| D5 | `record-playbook-run.cjs` is the one writer of the run folder, so `results.csv` is never hand-edited, and a scenario that cannot run records `SKIP` with its blocker rather than a silent pass [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:252]. |
| D6 | A real channel account is an optional operator prerequisite. The channel scenarios run on the fake transport, and a scenario that names a real account records `SKIP` with the missing account as its blocker [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:198]. |
| D7 | Every check runs without a tty: the screen's refusal, its lib-level key handling and the `bots answer` write are each proved by a command that needs no terminal [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:202]. |
| D8 | The recorded execution covers all 58 scenarios, BOT-001 to BOT-025 as a regression check on the rewritten runtime, plus DLR-002, DLR-023 and DLR-064 from `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/`, which read `executor-audit.ts` that 007 and 008 changed. The recorder writes the three deep-loop verdicts into `.skilled/skills/system-deep-loop/benchmark/reports/`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0`, and `rg -c '^## [1-5]\. ' .skilled/skills/system-skilled-bots/manual-testing-playbook/*/*.md` prints 58 lines each holding `5`.
- [x] `find .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations -name '*.md' | wc -l` prints 9, and `rg -c '^### Turn [0-9]' .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations/*.md` prints nine lines each holding `2` or more.
- [ ] `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path, `rg -c '^BOT-0' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 58, `rg -c ',(PASS|FAIL|SKIP),' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 58, `rg -c '^DLR-0(02|23|64),' .skilled/skills/system-deep-loop/benchmark/reports/*--manual-testing-playbook--executor-audit/results.csv` prints 3, `rg -c '^# recorded by record-playbook-run.cjs' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 1, `rg -c 'manual-testing-playbook--openbot-parity' .skilled/skills/system-skilled-bots/benchmark/reports/README.md` prints 1, and every id `rg -c ',FAIL,'` prints appears in `scratch/failures.md` with a phase and a requirement. Also `rg -c ',SKIP,' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 0, or every `SKIP` row's reason names a prerequisite the build does not own rather than a missing verb or a missing field, because phases 001 to 011 are closed before the corpus runs.
- [x] `rg -c '^### BOT-0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` prints 58, and `awk '/^## 15\./,0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md | rg -c '^\| BOT-0'` prints 58.
- [x] `rg -n 'date -v\+2M|date -d' .skilled/skills/system-skilled-bots/manual-testing-playbook/routines/cron-start-fires-at-computed-slot.md` prints the slot computation, and `rg -n 'seq 1 10' .skilled/skills/system-skilled-bots/manual-testing-playbook/routines/fatigue-after-ten-failures.md` prints the loop.
- [x] `rg -n 'isTTY|/dev/tty' .skilled/skills/system-skilled-bots/manual-testing-playbook/*/*.md` exits 1, and `rg -c 'mktemp -d' .skilled/skills/system-skilled-bots/manual-testing-playbook/{conversations,routines,activity,terminal-screen,working-place,memory,apps,vault,skills,channels}` prints 33 lines each holding `1` or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios` prints `RESULT: PASSED (5/5 checks)` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 1` |
| Corpus baseline | Done | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=25 categories=7 operator=19 routing_gold_excluded=6 violations=0 warnings=0` |
| Scenario authoring | Done | `find .skilled/skills/system-skilled-bots/manual-testing-playbook -mindepth 2 -name '*.md' \| wc -l` prints 58, and `find .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations -name '*.md' \| wc -l` prints 9 |
| Dry run | Recorded, not this phase's evidence | A run folder `2026-11-26--manual-testing-playbook--openbot-parity` was written early, before phases 001 to 011 landed, and its 33 rows all read `SKIP`. T051 moves it aside because the recorder refuses an existing folder, and the real run is recorded after wave 7 |
| Recorded run | Pending | `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` exits 1 once T051 has moved the dry-run folder aside, so no run folder exists yet |
| Acceptance criteria | Partly met | Ten rows in `acceptance-criteria.md` read `Met` and three read `Unmet`: AC-005, AC-006 and AC-010 rest on execution, and AC-013 is the row that keeps a `SKIP` from standing in for a pass |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md:77` binds this phase through its row `013-manual-testing-scenarios/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| AC-009's row count is scoped to section 15 here | AC-009's Verification cell counts `^\| BOT-0` across the whole root index, which already holds 8 hub-routing rows in section 7, so the file-wide count would read 66 once the 33 new rows land rather than the 58 the row asks for. Criterion 4 scopes the count to section 15, the cross-reference table AC-009's Given/When/Then names, where 25 rows stood before this run and 58 stand now. AC-009's Verification cell carries the scoped command. |
| Criterion 3's results.csv commands were amended | The recorder writes `scenario_id,runtime,verdict,reason,evidence` and a leading `# recorded by record-playbook-run.cjs` line, so `rg -c '^(PASS\|FAIL\|SKIP),'` reads 0 and `rg -c '^#'` reads 1 on every run it writes. The criterion now reads `^BOT-0` for the row count, `,(PASS\|FAIL\|SKIP),` for the verdict column and `^# recorded by record-playbook-run.cjs` for the one provenance line. The same three commands are in AC-005, T044, T047 and the plan's Definition of Done. |
| All 33 dry-run verdicts are SKIP | The dry run was taken before phases 001 to 011 landed, so the nine verbs and the two fields this corpus drives were absent from the tree. A `FAIL` would file a defect against a phase that has not been built, so each scenario recorded `SKIP` with its blocker and `scratch/failures.md` holds no failure row. The real run happens after those phases close, and AC-013 then refuses a `SKIP` whose reason is a missing verb or field |
| The dry-run folder is moved aside, not deleted | F-001 offered archiving or deleting the folder the recorder refuses. The assistant took the first alternative, archiving, on 2026-11-26 under the operator's do-not-ask directive, because a dry run is evidence of what the tree looked like before the build and a delete cannot be undone. T051 moves it out of `benchmark/reports/` and the recorder then writes the real folder |
| The scenario files are re-checked before execution | F-065 found four hard mismatches between the authored files and the contracts, each of which would record a false `FAIL` against a correct product. T050 re-checks all 33 files against `contracts/cli-json.md`, `contracts/refusals.md` and `design/refusal-catalogue.md`, replaces any `pbots check` call with the checker script, and records one row per file in `scratch/contract-recheck.md` |
| Seven criteria carry twelve acceptance rows | Criteria 1 to 7 cover SC-001 to SC-004 and AC-001 to AC-009 and AC-011 to AC-012. AC-010's benchmark index row rides inside criterion 3, so the goal stays inside the seven-criterion limit. |
| Criteria 3 and 4 merged on 2026-11-27 | The `SKIP` check of AC-013 was a criterion of its own, which made eight and failed `check-goal.cjs`. It now rides inside criterion 3, the other `results.csv` check, so criteria 1 to 7 cover AC-001 to AC-009 and AC-011 to AC-013. Every command is kept. The playbook amendment of 2026-11-27 left the counts as they were: on that day the package validator printed `scenarios=58 categories=17 operator=52`, the root index printed 58 twice and the tty search exited 1. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries 11 unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| The run widened to 58 plus 3 | The operator decided on 2026-11-28 that this phase executes all 58 scenarios, BOT-001 to BOT-025 as a regression check, and the system-deep-loop scenarios DLR-002, DLR-023 and DLR-064 that cover the executor audit. D8, criterion 3, REQ-005, REQ-014, AC-005, AC-014, AC-015 and the new tasks T052 to T054 carry it. The done tasks T001 to T039 are unchanged. |
| Parent metadata fingerprint | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --strict` reports `GENERATED_METADATA_INTEGRITY: graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH` on the parent, because the child goals are among its source docs. The fix is `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build --apply`, which writes outside this phase's folder and belongs to the run that closes the parent. |
<!-- /ANCHOR:log -->
