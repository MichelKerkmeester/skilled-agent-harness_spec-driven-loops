---
title: "Goal: Phase 11: spec-validator-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "spec validator fixes goal"
  - "ac coverage unresolved citation criteria"
  - "check-goal goal.md path criteria"
  - "spec validator owner decision"
  - "create.sh phase label criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T17:51:28Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase with criterion 6 amended"
    next_safe_action: "None. The orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Criterion 6 wording: amended at close to REQ-010's own check, the --description the stub logs (orchestrator decision)"
      - "Counting unresolved citations: option A, report only (scratch/briefs/00-index.md)"
      - "Detecting a phase label that disagrees with its folder number: option A, fix at the source only (scratch/briefs/00-index.md)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: spec-validator-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `AC_COVERAGE` report each cited `file:line` that names no readable file or a line outside it, make `check-goal.cjs` accept a path ending in `goal.md` and make `create.sh --phase --parent` label each child it adds with its folder's number, without changing any of the three tools' pass, fail, exit or labeling behavior for any other input.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Report only. An unresolved citation adds one `Unresolved evidence citation(s):` detail and still counts as coverage. The floor, `SPECKIT_AC_COVERAGE_CUTOFF`, the enforce switch, the advisory default and the covered count stay unchanged until the `system-spec-kit` owner picks option B or C |
| D2 | A cited path resolves as an absolute path, else in the packet folder, else in the repository root from `git -C <folder> rev-parse --show-toplevel` with the working directory as fallback. It must name a readable file and a line from 1 to that file's line count |
| D3 | `check-goal.cjs` changes only in `main()`. The exported functions, the five checks and the exit codes 0, 1 and 2 stay as they are |
| D4 | Each fix follows its owner's contract: `system-spec-kit` for `check-ac-coverage.sh`, `create.sh` and `validation-rules.md`, `sk-create-goal` for `check-goal.cjs` and its `scripts/README.md`. Code comments carry no spec path, phase number or REQ or task id |
| D5 | Each child `create.sh` appends carries its folder's phase number in the three labels. The source fix is `8036425eaa`, from another packet, and this phase only pins it with a test. Detecting a label that disagrees with its folder number, in `validate.sh` or `repair-derived.cjs`, waits for the `system-spec-kit` owner |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` ends `0 failed` with more than 25 passed, including cases where a missing file and a line past the end each put their AC id in an `Unresolved evidence citation(s):` detail
- [x] The 25 `expect`, `expect_source` and `expect_status` calls that existed on 2026-09-27 in `tests/check-ac-coverage.sh` pass with no edit, and `git diff` on `check-ac-coverage.sh` changes no line that increments `covered`
- [x] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md` exits 0 and prints `RESULT: PASSED (5/5 checks)`, and the same command on that folder's `spec.md` exits 2 with `packet path is not a directory`
- [x] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` reports `fail 0` with more than 15 passing
- [x] `rg -n 'nresolved' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` and `rg -n 'goal.md' .skilled/skills/sk-doc/sk-create-goal/scripts/README.md` each return the new line
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` ends `0 failed` with more than 10 passed, including a case where children appended after `001-foundation` carry "Phase 2" and "Phase 3" in the `--description` passed to the `description.json` generator, as the stub logs it, and in `graph-metadata.json` and the `spec.md` title
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal authored from the orchestrator brief's `011-spec-validator-fixes` section and 007 `research.md` section 6 (line 466), question 48 (line 1171) and ledger row 97 (line 1468) |
| Citations reopened | Done | `check-ac-coverage.sh:291`, `:327` and `:346` hold the shape test and its uses. `check-goal.cjs:681-689` is the exports block, `:693` sets the exit code from `main()` and `:697` sets exit 2 on a thrown error. `check-goal.cjs:89-92` throws `packet path is not a directory` |
| Baseline | Done | 2026-09-27: `tests/check-ac-coverage.sh` printed `25 passed, 0 failed`. `node --test .../sk-create-goal/scripts/tests/` printed `tests 15`, `pass 15`, `fail 0`. `check-goal.cjs .../006-goal-criteria-lint/goal.md` exited 2 with `packet path is not a directory`, and the folder exited 0 with `RESULT: PASSED (4/4 checks)` |
| Corpus scan | Done | Read-only scan of 374 `acceptance-criteria.md` files outside `z_archive`: 2,395 rows, 787 with a citation shape, 1,112 citations, 657 resolve, 455 name no file, 0 out of range. 56 of the 97 packets at or above the 0.9 floor would fall under it if unresolved citations stopped counting |
| Owner history | Done | `git log -5` on 2026-09-27: `check-ac-coverage.sh` and its test last changed in `ec33385ae5e` (2026-09-17, source-root move). `validation-rules.md` last in `ab725ca7ae2` (2026-09-25). `check-goal.cjs` and its test last in `062ac6e4f5` (2026-09-26), `scripts/README.md` the same. `git status --short` on all six files was empty, so nothing is in flight |
| create.sh label amendment | Done | 2026-09-27: added REQ-009 to REQ-011, AC-009 to AC-011, D5 and criterion 6 at the coordinator's request, from the orchestrator's observation while adding phases 010 to 017. Reopened `create.sh:1489`, `:1511` and `:1523`, which build labels from `_i`, and `:1236`, `:1252` and `:1541`, which already use `_phase_number`. Baseline `test-phase-system.sh`: `10 passed, 0 failed (of 10)`. `create.sh` last changed in `e7a347928b` (2026-09-24) with no uncommitted change, and no sibling phase names it. Scan: 14 of 27 `Phase N:` labels in 2,183 `description.json` files disagree with their folder |
| Folder label | Done | 2026-09-27: `description.json` changed from "Phase 2: spec-validator-fixes" to "Phase 11: spec-validator-fixes", the form siblings 013 and 016 use |
| Build baseline | Done | 2026-09-27, orchestrator, before the build: `check-ac-coverage.sh` `25 passed, 0 failed`, exit 0. `node --test` `tests 18`, `pass 18`, `fail 0`, exit 0. `test-phase-system.sh` `Results: 10 passed, 0 failed (of 10)`, exit 0. `check-goal.cjs .../006-goal-criteria-lint/goal.md` `RESULT: FAILED (0/5 checks; errors=1)`, exit 2. Timing on `specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation` (37 ACs): 2.26, 1.60 and 1.57 s, each exit 0 |
| Order against phase 006 | Done | 2026-09-27: phase 006 is not built in this wave, so its `git diff --quiet` on `check-goal.cjs` cannot collide with brief 06, which is committed in `e9059c8073` before any 006 run. Source: the orchestrator's build evidence |
| Owner decisions | Done | Counting unresolved citations: option A, report only. Label detection: option A, fix at the source only. The exported `check-goal.cjs` functions keep taking a packet directory. Settled before the build. Source: `scratch/briefs/00-index.md` |
| Build | Done | 2026-09-27: briefs 01 to 09 from `scratch/briefs/`, each verified by the orchestrator, committed as `e9059c8073`. 01 on codex gpt-5.5 high (208 s). 02 to 05 on cursor `grok-4.7-xhigh-fast` (182, 138 and 146 s for 03 to 05). 06 and 07 on codex gpt-5.5 medium (118 and 94 s). 08 and 09 on pi deepseek-v4.1-flash thinking max (57 and 24 s). Seven files changed in two skills |
| Cross-family review | Done | 2026-09-27, the `review` agent on Claude Opus 5.5 over `e9059c8073`: no P0 or P1, the covered count unchanged, the `check-goal.cjs` change correct. Three P2s in the new detail line: a comma or semicolon after a match, a line number that wraps past 64 bits, and a legacy id cell split on its own comma. Its own checks: 41/0 under `/bin/bash` 3.2, 20/0 node tests, 7 new cases fail on the pre-build code |
| Review fixes | Done | 2026-09-27: briefs 10, 11 and 12 on cursor Grok 4.7 (165, 134 and 147 s), suite 42/0, 43/0 and 44/0 in turn. Committed as `03e567cfe7` |
| Verification | Done | 2026-09-27 at `03e567cfe7`, orchestrator: `check-ac-coverage.sh` `44 passed, 0 failed`, exit 0. `node --test` `tests 20`, `pass 20`, `fail 0`, exit 0. `test-phase-system.sh` `Results: 12 passed, 0 failed (of 12)`, exit 0. `create-root-numbering.vitest.ts` `Tests  6 passed (6)`, exit 0. The `goal.md` and folder `check-goal.cjs` runs on 006 diff to nothing, and `spec.md` exits 2. The `covered++` diff count is `0`, and `rules/` plus `create.sh` show only `check-ac-coverage.sh` changed |
| Label revert test | Done | 2026-09-27: `test-phase-system.sh` against the `create.sh` from `8036425eaa^` prints `11 passed, 1 failed`, with the appended-label case failing. Against the current `create.sh`: `12 passed, 0 failed` |
| Timing after | Done | Same packet, three runs each, all exit 0. After the build: 2.32, 1.77 and 1.78 s. After the review fixes: 1.76, 1.73 and 1.73 s. The change stays within run-to-run noise, about 0.1 to 0.2 s at most. Every run printed `AC_COVERAGE advisory: 37/37 ACs have evidence; floor 34/37` |
| Real packet | Done | `validate.sh --strict` on `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment`: exit 0, `RESULT: PASSED`, `6/6 ACs have evidence; floor 6/6`, and a detail line starting `Unresolved evidence citation(s): AC-001 (runtime/cli/spec/create.sh:157)`. The skill-relative citations do not resolve, the ratio is unchanged |
| Phase docs | Done | 2026-09-27: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence, and the stale premises are corrected in `spec.md`, `plan.md` and `tasks.md`. AC-001 to AC-011 are `Met` |
| Outside-root case | Done | 2026-09-27: brief 13 (cursor Grok 4.7, 128 s) adds "a citation that climbs out of the folder resolves only to a real file" to `tests/check-ac-coverage.sh`, +3/-0, commit `baf2876802`. A `..` citation to a file outside the packet folder resolves, and one to a missing file stays unresolved. Suite `45 passed, 0 failed`, exit 0. Source: the orchestrator's follow-up evidence |
| Stderr check | Done | 2026-09-27, orchestrator at HEAD `baf2876802`, stderr captured per command: `check-goal.cjs` on the folder and on its `goal.md` for the parent and all 18 children of `003-cli-jev-workflow-integration`, `node --test`, the `check-ac-coverage.sh` suite and `validate.sh --strict` on four packets. Every command wrote 0 bytes of stderr, and every exit code was 0. Source: the orchestrator's follow-up evidence |
| Owner-contract read | Done | 2026-09-27, a post-build conformance read, since no pre-build read is recorded. `system-spec-kit/SKILL.md:456`, `validation-rules.md:95` and `:101`, `sk-create-goal/SKILL.md:109`, `scripts/README.md:54` and `:70`, and the `sk-code` shell and Node guides agree with the build. Function comment blocks are a P2 recommendation that the rule file meets with WHY comments. Detail in `tasks.md` T002 |
| Closure | Done | 2026-09-27: every acceptance row `Met` and every criterion ticked, so `spec.md` and `implementation-summary.md` say Complete |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 2". This is Phase 11 of 17, as the titles and `spec.md` metadata now say |
| Report only instead of an uncounted citation | The brief asks for a resolution rule and how an unresolved citation is reported. Counting it as uncovered would drop 56 of 97 at-floor packets under the floor, many of them citing skill-relative paths such as `runtime/cli/rules/check-ac-coverage.sh:381`. That keeps 015's floor and cutoff outcomes intact, and the counting choice is recorded as an owner decision in `spec.md` section 10 |
| Collision with phase 006 | 006 plans `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` after its build and copies parser lines `:135-144`, `:162-201` and `:207-212`. This build edits `main()` only, below those lines. The orchestrator picks the order: commit 011 first, or run 006's check before 011 starts |
| Shape test limit | `has_file_line()` does not match a range such as `file:12-20`, because `-` is not in its trailing character class. Left alone: changing the shape test changes the covered count |
| README mismatch | `sk-create-goal/scripts/README.md` section 5 says `--all` exits 2 when any goal has a finding. `check-goal.cjs:666` exits 2 only on read errors. Out of scope here, reported for the sk-create-goal owner |
| Criteria in the objective | The objective is one sentence, as phase 006 does. The criteria reach the operator verbatim through the chat slice, which carries this criteria section |
| Executor switch (build) | D5 of the plan named codex for the code briefs. Codex hit its usage limit on brief 02 ("try again at 10:43 PM", exit 1 after 97 s), so briefs 02 to 05 and 10 to 12 ran on cursor Grok 4.7 (`grok-4.7-xhigh-fast`). The orchestrator verified each diff the same way. Source: the orchestrator's build evidence |
| Commit before review (build) | The build was committed as `e9059c8073` before its cross-family review ran. The review found no P0 or P1, and its three P2s were fixed in the follow-up `03e567cfe7`, not by amending the build commit. Source: the orchestrator's build evidence |
| create.sh fix landed elsewhere (build) | `8036425eaa` (packet `system-skill-advisor/030/011-observation-fixes`) already sets `_phase_number` at `create.sh:1489` and uses it at `:1494`, `:1516` and `:1528`, the formula that builds the folder prefix. It also changed the two `phase ${_i}` warnings the spec put out of scope. This phase edits no `create.sh` line. AC-009 is met by that commit plus brief 07's shell test. `create.sh` changed on this branch only through the main merge `d6e512e6b5`. Source: `scratch/briefs/00-index.md` premise 1 and the orchestrator's build evidence |
| Five checks, not four (build) | `e7c88670fb` added `frontmatter-fence` to `check-goal.cjs`, so a pass prints `RESULT: PASSED (5/5 checks)`. D3 and criterion 3 said four and `4/4`, and now say five and `5/5`. The amendment changes no requirement: the exit contract and the `main()`-only edit stand. Source: `scratch/briefs/00-index.md` premise 2 |
| D5 amended (build) | D5 said `create.sh` reads the number from the folder's `NNN` prefix. The fix in `8036425eaa` computes it with the prefix's own formula instead, so D5 now names that commit as the source fix and this phase as its test. Source: `scratch/briefs/00-index.md` premise 1 |
| node --test baseline (build) | The planning run recorded 15 tests. The build baseline measured 18, and the after-count is 20. Criterion 4's "more than 15" still holds as written. Source: the orchestrator's baseline run |
| awk getline design replaced (build) | macOS BSD awk aborts the whole program with `i/o error` and exit 2 when `getline` reads a directory, which would stop the rule under `set -e`. Awk now carries the citations out as a fifth field, and bash builtins in `run_check` resolve them. There is still no process per citation and one `git` call per run. Source: `scratch/briefs/00-index.md` premise 4 |
| AC-002 fixture run (build) | AC-002 asks for a `validate.sh --strict` run on a fixture packet. The run was made on a real packet (T021) and printed the detail. The `expect_detail` case covers the fixture side. Source: the orchestrator's build evidence |
| Amendment at close: criterion 6 | The criterion said the appended children carry the labels "in `description.json`". REQ-010, which it tracks, runs its check "through the stub log": the test's stub records the `--description` that `create.sh` passes to the `description.json` generator and never writes the file. The criterion's wording went further than REQ-010's own check, so it now names the `--description` as the stub logs it, plus `graph-metadata.json` and the `spec.md` title, and is ticked. The operator can revert this amendment. Source: the orchestrator's decision in its follow-up evidence, and `test-phase-system.sh` Test 4 |
| README count (noticed, not fixed) | `sk-create-goal/scripts/README.md:16` still says the checker catches "four things", while `check-goal.cjs` has five checks. Out of scope, recorded for the `sk-create-goal` owner. Source: the orchestrator's build evidence |
<!-- /ANCHOR:log -->
