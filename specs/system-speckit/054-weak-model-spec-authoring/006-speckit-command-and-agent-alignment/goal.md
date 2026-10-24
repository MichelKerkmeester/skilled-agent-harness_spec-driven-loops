---
title: "Goal: Phase 6: speckit-command-and-agent-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "speckit command and agent alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment"
    last_updated_at: "2026-10-24T22:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed phase 006"
    next_safe_action: "Start phase 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: speckit-command-and-agent-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every speckit command and every doc-authoring agent in line with the templates, the placeholder gate and the authoring card that phases 2 to 5 change, then leave every runtime mirror regenerated from those corrected sources.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Writes land on the 12 audited command and agent files, the 4 authored Claude siblings, the generated mirror trees and this phase folder. No template, validator, runtime source or reference file changes. |
| D2 | The audit is frozen at authoring time as 27 exact rows. The executor applies text and does not judge it. |
| D3 | Every row is applied by `apply_row.py`, which refuses unless the locator occurs exactly once in its file. |
| D4 | Generated mirrors are rebuilt by their own generators. `.claude/agents` is the one authored sibling, edited by six MIRROR rows. |
| D5 | The suite and the trigger index are compared with the phase start, not with phase 1. The cumulative difference is recorded as information, not as a pass condition. |
| D6 | One read-only review runs through `cli-devin` with `swe-2-max`. No writer worker runs in this phase, because every text change is frozen in a row. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/audit/rows.jsonl` holds 27 lines, `jq -c .` parses every line, and T004 prints `27 1`
- [x] T006 prints `27`, `27` and `27`, which means every row applied and changed only the file it names (78, 78, 78 with the 51 extra rows)
- [x] `scratch/audit/searches.txt` holds `A1_rc=1`, `A2_rc=1`, `A3_rc=1`, `A4_rc=1` and `GUARD_REFS=6`
- [x] `scratch/mirrors/summary.txt` holds eight lines that end in `rc=0`
- [x] T009 prints `INDEX_STALENESS_SAME`, `gate1_exit=0` and a lookup exit of 0 or 1
- [x] T012 prints `SUITE_MATCH`, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this phase with `--strict` prints `RESULT: PASSED` with no changed path outside the rows, the generated trees and this phase folder
- [x] `scratch/review/T013.txt` holds only `P0`, `P1` or `P2` lines or the single line `NO FINDINGS`, and each finding is applied or recorded in section 4
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
| Phase opened | Done | Executed by the Claude Code execution agent on 2026-10-24 from HEAD `11d9bb566a` |
| Phases 1, 4 and 5 checked (T001) | Done | Printed `LEDGER_OK`, `CARD_OK`, `CARD_SYNC_OK` and `EXAMPLE_DRIFT_OK` |
| Tools checked (T002) | Done | Python 3.9.6, jq 1.7.1, ripgrep 15.2.0, node v26.8.2, npm 11.19.1, git 2.50.1 |
| Phase start commit | Done | 11d9bb566a56d110d3899998faf531f836f01d9d |
| Suite and doctor baseline (T003) | Done | `scratch/suite-before.txt` is a copy of phase 005's `005-weak-model-authoring-card/scratch/test/suite-end.txt` (exit=0, 279 files, 4162 tests in the first shard). Only `11d9bb566a`, a one-file phase 004 changelog edit that no test reads, came after it. `scratch/doctor-before.json` parses |
| 27 rows saved (T004) | Done | `jq -c . rows.jsonl \| wc -l` printed `27` and the count check printed `27 1` |
| Tools saved and applier self-tested (T005) | Done | Self-test printed `APPLIED R-001`, `FAIL R-001: expected text already present`, `exit=1`, `1`, then `SYNTAX_OK` |
| 27 rows applied (T006) | Done | 27 frozen rows plus 51 extra rows (R-028 to R-078) = 78. The three counts printed `78`, `78`, `78` and 0 rows were blocked or skipped. `scratch/audit/applied.txt` |
| Four search gates (T007) | Done | `A1_rc=1`, `A2_rc=1`, `A3_rc=1`, `A4_rc=1`, `GUARD_REFS=6`, plus `A6_rc=1` for the widened search of the 16 extra-row files |
| Mirrors regenerated and eight checks run (T008) | Done | 8 lines end in `rc=0` and 8 match PASS or STATUS=OK. Generators wrote 4 `.codex/agents` TOMLs and 4 `.pi/agents` files, 0 prompts, 0 links. No other `.codex` or `.pi` path or symlink changed |
| Doctor:speckit checks and index comparison (T009) | Done | `INDEX_STALENESS_SAME`, `gate1_exit=0`, `lookup_exit=0`. See the index finding in the deviations table |
| Owner 006 ledger rows recorded (T010) | Done | `OWNER006_TOTAL=0`, `OWNER006_OPEN=0`, `OWNER006_COUNTS_OK`. Open list: `scratch/audit/owner-006-open.txt` (empty) |
| Scope check (T011) | Done | 41 changed paths outside this folder: 32 row files, 8 generated mirror files and 1 compiled contract. Unexplained 0. `scratch/audit/unexplained-files.txt` is empty. This is the count T011 printed and is kept as run. The commit holds 45 paths outside this folder (32 row files, 12 generated mirror files, 1 compiled contract), because 4 Hermes copies were regenerated after T011, see the Hermes row in the deviations table |
| Suite compared with the phase start (T012) | Done | `SUITE_MATCH`, exit=0, 2345 s wall time. First attempt `scratch/suite-end.attempt1.txt` failed 3 tests, see the deviations table |
| Frontier review and findings (T013) | Done | cli-devin swe-2-max, read-only, returned `NO FINDINGS` (`scratch/review/T013.txt`) |
| Phase closed and committed (T014) | Done | Strict validation printed `RESULT: PASSED`. One local commit on the worktree branch, not pushed |

### Deviations and findings

| Item | Note |
|------|------|
| check-placeholders C3 | The nine hits are the literal token `[SPEC_FOLDER]` inside fenced YAML and JSONL rows. This is the known scanner false positive class, so no text changes. |
| Suite comparison C8 | ADR-003 is approved by the orchestrator: compare the suite with the phase start, not with phase 001's `suite-start.txt`. Phase 001 records that file when it runs. |
| Shared template text | The `../changelog/` line in `spec.md` and the `decision-record.md` waiver line in `acceptance-criteria.md` are fixed template text shared by every phase. Left unchanged. |
| Generated metadata | Editing the six docs changed `graph-metadata.json`'s `source_fingerprint`, so `repair-derived.cjs --apply` re-derived that generated file. `validate.sh --strict` enforces the match. No authored content changed. |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
| Executors on 2026-10-24 | The phase docs' OpenCode, DeepSeek, Task tool and cli-codex wording is history and is superseded by parent D4, D7 and D8. The Claude Code execution agent applied every row by script with the T005 applier and dispatched no subagent. The only external dispatches were the extra-row review (X2) and the T013 review, both cli-devin swe-2-max on `--permission-mode auto`, with the diff and the checks precomputed into files |
| X0 precheck | HEAD was `11d9bb566a` directly on the phase 005 commit `0046fc7ae2`, and `git status --porcelain --untracked-files=all` listed nothing outside `001-template-drift-census-and-baseline/scratch/`. T003 and T011 use `--untracked-files=all` and exclude that scratch folder |
| Suite baseline reuse and timing | T003 reused phase 005's end-of-phase suite as `suite-before.txt`. Both suite runs set `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000` and ran in the background. The second run took 2345 s. The shell's `grep` is a function that swallows counts, so every check ran `/usr/bin/grep` |
| Rows vs phase 003 (LS14) | R-007 and R-008 state the rule phase 003 shipped: a v2.3 doc warns on an unfilled value token while `spec.md` says Draft and errors at any other status, and an older doc keeps the error. `validatePlaceholders` in `runtime/lib/validation/orchestrator.ts` enforces it, so both rows were applied unchanged |
| Trigger index at the phase start (LS6) | The premise that the index is stale at the phase start is wrong in a different way. At the start `fresh` was false with 3 missing documents (the authoring card and the phase 004 and 005 changelogs), 0 obsolete and 0 stale. T009 shows the same set before and after, so this phase added none. The premise text is not edited. The phase 006 changelog adds a fourth unindexed document of the same class |
| Doctor commands | No doctor rows. The read-only re-audit in the conductor scratchpad (`audit-doctor-006.md`) checked 91 doctor files and found 0 authoring findings |
| Extra rows (operator scope extension) | `rg` found 45 `checklist.md` mentions in 16 command assets (14 `create/assets`, 2 `deep/assets`). 51 extra rows R-028 to R-078 cover all 45, and 6 of the 51 add the level-2 `acceptance-criteria.md` example to the template list of the creator commands that now require that doc. 0 mentions were skipped (`scratch/audit/extra-skipped.txt`). Ladders and memory-load lists drop `checklist.md`, as frozen rows R-014 and R-017 do. Required-file, route and output lists name `acceptance-criteria.md` |
| Amendment note 2026-10-24: D1 and D2 with the extension | D1 and D2 above are frozen and were not reworded. Read them with the operator-approved scope extension in the "Extra rows (operator scope extension)" row: D1 covers 16 + 16 files (the 12 audited files and 4 Claude siblings, plus the 16 command assets of R-028 to R-078), and D2 covers 27 + 51 rows, 78 in all. The 12 generated mirror files in the commit are the "generated mirror trees" D1 already names |
| Hermes agent copies regenerated at commit | The mirror-parity hook required `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`. It wrote 4 of 68 copies: `.hermes/skills/agent-code/SKILL.md`, `agent-context`, `agent-markdown` and `agent-orchestrate` (`scratch/mirrors/gen-hermes.txt`: `Wrote 4 of 68 Hermes skill copies; pruned 0`), and `scratch/mirrors/check-hermes.txt` printed `PASS: 68 Hermes skill copies in sync`. T008 ran its five generators and eight checks before this step and T011 saved its list before it, so the T008 summary (4 Codex TOMLs and 4 Pi files) and the T011 count of 41 changed paths do not include the Hermes copies. Final scope of the commit: 45 paths outside this folder = 32 row files + 12 generated mirror files (4 `.codex/agents`, 4 `.pi/agents`, 4 `.hermes/skills`) + 1 compiled contract |
| Plan boxes left unchecked | `plan.md` has 16 readiness, rollback and pre-task boxes. 14 are ticked from committed evidence, and 2 stay open. "Read this phase's `spec.md`, this plan and `tasks.md` before the first command" is a reading step that left no committed trace. "Read `cli-codex/SKILL.md` before the review command" does not apply as written, because the takeover moved the review to cli-devin swe-2-max (see the Takeover row) and no cli-codex review ran |
| Extra-row review (X2) | cli-devin swe-2-max, read-only, one run: `NO FINDINGS`. It confirmed 45 hits mapped to rows and that the remaining word `checklist` in those files refers to the verification checklist section of `tasks.md`. `scratch/review/X2.txt` |
| STALE_SOURCE_DIGEST failure | The first full suite (`scratch/suite-end.attempt1.txt`, exit=1) failed 3 tests with 4159 passed, 21 skipped and 279 files, so the totals differ from the baseline only by those 3 failures. `check-contract-drift.vitest.ts` (2 tests) and `render-command-contract.vitest.ts` (1 test) reported a source digest mismatch for `deep-review-auto.yaml` and `deep-review-confirm.yaml`, which rows R-073 to R-078 edit. The deep/review compiled contract records a hash of both files |
| Conductor decision on the digest failure | Keep all 78 rows and recompile the deep command contracts. The compiled contract is a derived output of those YAML files, as the mirrors are, and commit `d01455d107` is the precedent. `compile-command-contracts.cjs --write` without `--command` printed `--command is required` and wrote nothing. `--command deep/review --write` printed the output path and exit=0 (`scratch/audit/compile-contracts.txt`). Only `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` changed, 2 digest lines, and the new digests equal the live digests the failure reported (`scratch/audit/compile-contracts.diff`). Both vitest files then passed (43 tests) and `check-contract-drift.cjs` printed `[CONTRACT DRIFT] OK commands=3`. The compiled file is staged as a derived output required by the digest check |
| Stale wording left in deep-review SKILL.md | `.skilled/skills/system-deep-loop/deep-review/SKILL.md` still says the AC_COVERAGE signal needs `checklist.md` (3 `checklist.md` mentions). The rule in `runtime/cli/rules/check-ac-coverage.sh` reads `acceptance-criteria.md`. Finding only: the file is out of scope and was not edited |
| Prompt mirrors | T008 rewrote 0 of 38 `.codex/prompts` and 0 of 38 `.pi/prompts` files, because the prompt stubs hold no row text. The spec's Regenerate wording for them is history |
| Review reach | The T013 review ran before the contract recompile, so it did not see the compiled file. The drift check, both vitest files and the full suite cover that file. One review is one lens: `NO FINDINGS` is not proof, and the scripted counts (78 applied, 0 unexplained paths, 8 mirror checks) carry the evidence |
| Cumulative suite delta | Against phase 001's `suite-start.txt` the first shard is unchanged and the second shard has 4 more files and 24 more tests, which phases 002 to 005 added. Information only |
| Implementation summary claim | The old claim that the rows were applied to a copy under `scratch/test/` was removed. No such folder exists. The tested applier self-test copy is gone, and the evidence is the real apply in `scratch/audit/applied.txt` |
<!-- /ANCHOR:log -->

