---
title: "Tasks: Phase 13: manual-testing-scenarios"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "manual testing scenarios tasks"
  - "openbot parity playbook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: manual-testing-scenarios

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

Six shell variables this list uses: `PB` is `.skilled/skills/system-skilled-bots/manual-testing-playbook`, `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs`, `SPECS` is `specs/system-skilled-bots/003-openbot-parity-build`, `VAL` is `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and `CHECK` is `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs`.

Every scenario builds its own throwaway world under one `mktemp -d` folder, drives `$BOTS` in it with the stub executor first on `PATH`, and removes the world in its last step. No scenario writes to a real state root, and no scenario calls a model. Each file carries the five numbered sections in order [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:158], and the recorder is the one writer of the run folder [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215].
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:waves -->
## Wave Plan

Eleven waves. Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of distinct files it writes, and a wave that shares a file runs one worker. The verify column names the check the orchestrator runs before the next wave starts. Waves 0 to 5 ran before 2026-11-27 and keep the executors they ran on. The open dispatched wave, 8, runs on `cli-mistral-vibe` at `deepseek-flash`, the parent's primary since that date [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

Waves 6, 7, 9 and 10 run from the orchestrator as plain shell, with no external executor. The playbook forbids any wave inside an AI runtime session, because the recursion guard refuses the runs, and every bot definition the new scenarios write names `cli-codex`, so a scenario executed from inside a session would be refused by its own subject. Those four waves are the re-verification, the execution, the re-run and the two validator gates.

| Wave | Task ids | Files | Executor | Model | Effort | Workers in parallel | Verify | Fallback order |
|------|----------|-------|----------|-------|--------|---------------------|--------|----------------|
| 0 | T001-T005 | five `scratch/` notes | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 5 | V0 | pi, vibe, devin, codex |
| 1 | T006-T014 | nine `conversations/` files | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 9, the file-overlap bound. Run in three batches of 3 when the gateway rate limit bites | V1 | opencode, vibe, devin, codex |
| 2 | T015-T022 | five `routines/` and three `activity/` files | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 8 | V2 | pi, vibe, devin, codex |
| 3 | T023-T027 | three `terminal-screen/` and two `working-place/` files | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 5 | V3 | opencode, vibe, devin, codex |
| 4 | T028-T037 | three `memory/`, two `apps/`, three `vault/` and two `skills/` files | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 10 | V4 | pi, vibe, devin, codex |
| 5 | T038-T039 | one `channels/` file and the root index | `cli-devin` | `deepseek-v4-1-flash-max` | max, baked into the uid | 2, after the quota probe | V5 | pi, opencode, vibe, codex |
| 6 | T050-T051 | `scratch/contract-recheck.md` and the moved dry-run folder | the orchestrator, no external executor | none | none | 1, because the re-check reads every file the five authoring waves wrote | V6 | none. The orchestrator runs both |
| 7 | T040-T043, T052, T053 | six verdict CSVs under `scratch/` | the orchestrator, no external executor | none | none | 1, because one operator runs the blocks in order | V7 | none. The orchestrator runs all six |
| 8 | T044, T046 | `scratch/results.csv` and the scenario files a `FAIL` names | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 1, because both tasks share the results file | V8 | pi, opencode, devin, codex |
| 9 | T047, T045, T054 | `scratch/results.csv`, the bots run folder and the deep-loop run folder | the orchestrator, no external executor | none | none | 1, because the recorder reads the files the re-run wrote | V9 | none. The orchestrator runs all three |
| 10 | T048-T049 | none. Both tasks read | the orchestrator, no external executor | none | none | 1 | V10 | none. The orchestrator runs both |

- **V0**: `rg -c '^\| BOT-0' scratch/scenario-inventory.md` prints 33, and each of the five `scratch/` notes exists.
- **V1**: `find $PB/conversations -name '*.md' | wc -l` prints 9, and `$VAL --package system-skilled-bots` prints `PASS` with `violations=0`.
- **V2**: `find $PB/routines $PB/activity -name '*.md' | wc -l` prints 8, and `$VAL --package system-skilled-bots` prints `PASS`.
- **V3**: `find $PB/terminal-screen $PB/working-place -name '*.md' | wc -l` prints 5, and `$VAL --package system-skilled-bots` prints `PASS`.
- **V4**: `find $PB/memory $PB/apps $PB/vault $PB/skills -name '*.md' | wc -l` prints 10, and `$VAL --package system-skilled-bots` prints `PASS`.
- **V5**: `find $PB/channels -name '*.md' | wc -l` prints 1, and `$VAL --package system-skilled-bots` prints `PASS ... scenarios=58 categories=17 ... violations=0`.
- **V6**: `rg -c '^\| BOT-0' scratch/contract-recheck.md` prints 33, `rg -c 'pbots check' $PB` exits 1, and `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` exits 1, so the dry-run folder is out of the recorder's way.
- **V7**: `cat scratch/verdicts-*.csv | rg -c '^BOT-0[0-9]{2},[^,]*,(PASS|FAIL|SKIP),'` prints 58, and `rg -c '^DLR-0(02|23|64),[^,]*,(PASS|FAIL|SKIP),' scratch/verdicts-deep-loop.csv` prints 3.
- **V8**: `rg -c '^BOT-0' scratch/results.csv` prints 58, `rg -c ',(PASS|FAIL|SKIP),' scratch/results.csv` prints 58, and `rg -c ',FAIL,' scratch/results.csv` prints 0, or every id it prints appears in `scratch/failures.md`.
- **V9**: `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path, `rg -c '^BOT-0' <that path>` prints 58, `rg -c ',(PASS|FAIL|SKIP),' <that path>` prints 58, and `rg -c '^# recorded by record-playbook-run.cjs' <that path>` prints 1. `rg -c '^DLR-0(02|23|64),' .skilled/skills/system-deep-loop/benchmark/reports/*--manual-testing-playbook--executor-audit/results.csv` prints 3.
- **V10**: `$VAL --package system-skilled-bots` prints `PASS`, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios --strict` prints `RESULT: PASSED`.

The fallback order is the ladder in `plan.md`'s External orchestration section, minus the executor the wave already used. A wave that reaches the end of its ladder without a working executor stops and reports the wave, its task ids and the last refusal. A wave with no external executor has no ladder to walk, so a failure there is repaired and re-run rather than delegated.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the eleven phase specs and record each verb and each record a scenario must name (`scratch/verb-and-record-map.md`). Verify: `rg -c '^\| REQ-' $SPECS/00*/spec.md` prints eleven `file:count` lines, one per phase
- [x] T002 Read the playbook contract, the command and the conversation reference, and record the five-section order and the eight required fields (`scratch/playbook-contract.md`). Verify: `rg -n 'Required per-feature section order' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` prints one line
- [x] T003 Read the existing corpus and record its 25 ids and seven category folders (`scratch/baseline-corpus.md`). Verify: `$VAL --package system-skilled-bots` prints `scenarios=25 categories=7`
- [x] T004 Capture the baseline verb probe, so the spec's measured behavior is reproducible (`scratch/baseline-verbs.txt`). Verify: `rg -c 'unknown verb' scratch/baseline-verbs.txt` prints 8
- [x] T005 Write the scenario inventory, one row per new scenario with its id, category, phase and what it proves (`scratch/scenario-inventory.md`). Verify: `rg -c '^\| BOT-0' scratch/scenario-inventory.md` prints 33
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1: Conversation Scenarios

- [x] T006 Write BOT-026, `bots chat` appends one human and one bot message and dispatches one run (`$PB/conversations/chat-appends-one-message.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/chat-appends-one-message.md` prints 5
- [x] T007 Write BOT-027, `@bot` routes a message to the named bot and an unknown bot is refused `bot-unknown` (`$PB/conversations/at-bot-routing.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/at-bot-routing.md` prints 5
- [x] T008 Write BOT-028, a parked chat run is answered with `--scope once` and the resume appends its bot message (`$PB/conversations/park-answer-scope-once.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/park-answer-scope-once.md` prints 5
- [x] T009 Write BOT-029, `--scope deny` records `deny` and `--scope always` is refused `grant-scope-unsupported` (`$PB/conversations/scope-deny-and-unsupported.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/scope-deny-and-unsupported.md` prints 5
- [x] T010 Write BOT-030, the item carries `grants` and the inbox line prints its kind, rung and scope (`$PB/conversations/grants-on-the-item.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/grants-on-the-item.md` prints 5
- [x] T011 Write BOT-031, a `[REMEMBER]` line becomes a `memory-proposal`, `confirm` appends the fact and `reject` appends nothing (`$PB/conversations/memory-proposal-confirm.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/memory-proposal-confirm.md` prints 5
- [x] T012 Write BOT-032, `bots skill propose` writes the draft and one `skill-proposal` item and the answer records the decision with no resume (`$PB/conversations/skill-proposal-review.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/skill-proposal-review.md` prints 5
- [x] T013 Write BOT-033, a link and a numbered reply answer an item through the fake transport (`$PB/conversations/channel-link-and-reply.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/channel-link-and-reply.md` prints 5
- [x] T014 Write BOT-034, a channel answer from a non-approver is refused `answer-not-approver` (`$PB/conversations/channel-non-approver.md`). Verify: `rg -c '^## [1-5]\. ' $PB/conversations/channel-non-approver.md` prints 5

### Wave 2: Routines And Activity

- [x] T015 Write BOT-035, the routine block renders and `bots routines` lists it (`$PB/routines/routine-block-renders.md`). Verify: `rg -c '^## [1-5]\. ' $PB/routines/routine-block-renders.md` prints 5
- [x] T016 Write BOT-036, a routine's cron start installs and fires at the slot computed at run time from the current clock plus two minutes (`$PB/routines/cron-start-fires-at-computed-slot.md`). Verify: `rg -n 'date -v\+2M|date -d' $PB/routines/cron-start-fires-at-computed-slot.md` prints the computation
- [x] T017 Write BOT-037, the `until` outcome sets `completed` and records `untilMetAt` in a short loop with no wait (`$PB/routines/until-outcome-completes.md`). Verify: `rg -n 'until_check|for i in' $PB/routines/until-outcome-completes.md` prints the loop
- [x] T018 Write BOT-038, a cron start under 900 seconds is refused `routine-floor-15-minutes` (`$PB/routines/floor-fifteen-minutes.md`). Verify: `rg -c '^## [1-5]\. ' $PB/routines/floor-fifteen-minutes.md` prints 5
- [x] T019 Write BOT-039, ten consecutive failures disable the bot and raise one item, driven by a short loop (`$PB/routines/fatigue-after-ten-failures.md`). Verify: `rg -n 'seq 1 10' $PB/routines/fatigue-after-ten-failures.md` prints the loop
- [x] T020 Write BOT-040, `bots activity` groups rows under the seven ids in order (`$PB/activity/activity-groups-seven-ids.md`). Verify: `rg -c '^## [1-5]\. ' $PB/activity/activity-groups-seven-ids.md` prints 5
- [x] T021 Write BOT-041, `bots inbox --json` carries the item fields (`$PB/activity/inbox-json-item-fields.md`). Verify: `rg -c '^## [1-5]\. ' $PB/activity/inbox-json-item-fields.md` prints 5
- [x] T022 Write BOT-042, the actor is recorded on the answer and on the run record (`$PB/activity/actor-on-answer-and-record.md`). Verify: `rg -c '^## [1-5]\. ' $PB/activity/actor-on-answer-and-record.md` prints 5

### Wave 3: Terminal Screen And Working Place

- [x] T023 Write BOT-043, the screen refuses without the binary and exits 4 (`$PB/terminal-screen/screen-refuses-without-binary.md`). Verify: `rg -c '^## [1-5]\. ' $PB/terminal-screen/screen-refuses-without-binary.md` prints 5
- [x] T024 Write BOT-044, the inbox pane answers with `y` and `n` through `bots answer --scope` (`$PB/terminal-screen/inbox-pane-answers.md`). Verify: `rg -c '^## [1-5]\. ' $PB/terminal-screen/inbox-pane-answers.md` prints 5
- [x] T025 Write BOT-045, the banner and the overlay draw every key they bind (`$PB/terminal-screen/banner-and-overlay.md`). Verify: `rg -c '^## [1-5]\. ' $PB/terminal-screen/banner-and-overlay.md` prints 5
- [x] T026 Write BOT-046, the prompt names the working place and the record carries the branch (`$PB/working-place/working-place-line.md`). Verify: `rg -c '^## [1-5]\. ' $PB/working-place/working-place-line.md` prints 5
- [x] T027 Write BOT-047, `bots status` prints `branch` and `worktree` (`$PB/working-place/status-branch-and-worktree.md`). Verify: `rg -c '^## [1-5]\. ' $PB/working-place/status-branch-and-worktree.md` prints 5

### Wave 4: Memory, Apps, Vault And Skills

- [x] T028 Write BOT-048, `bots remember` appends and `--list` prints the entry (`$PB/memory/remember-appends-and-lists.md`). Verify: `rg -c '^## [1-5]\. ' $PB/memory/remember-appends-and-lists.md` prints 5
- [x] T029 Write BOT-049, the memory block is injected and an empty file injects nothing (`$PB/memory/memory-block-injected.md`). Verify: `rg -c '^## [1-5]\. ' $PB/memory/memory-block-injected.md` prints 5
- [x] T030 Write BOT-050, the 60-entry and 3,600-byte bound refuses the next append (`$PB/memory/memory-bound-refuses.md`). Verify: `rg -c '^## [1-5]\. ' $PB/memory/memory-bound-refuses.md` prints 5
- [x] T031 Write BOT-051, `apps:` filters `utcp.json` and records `posture.apps` (`$PB/apps/apps-filter-utcp-config.md`). Verify: `rg -c '^## [1-5]\. ' $PB/apps/apps-filter-utcp-config.md` prints 5
- [x] T032 Write BOT-052, `apps-unknown-server` fails the checker (`$PB/apps/apps-unknown-server.md`). Verify: `rg -c '^## [1-5]\. ' $PB/apps/apps-unknown-server.md` prints 5
- [x] T033 Write BOT-053, `bots secret set` stores a value and `list` prints no value (`$PB/vault/secret-set-and-list.md`). Verify: `rg -c '^## [1-5]\. ' $PB/vault/secret-set-and-list.md` prints 5
- [x] T034 Write BOT-054, the secret reaches the child and `secretsUsed` records the name (`$PB/vault/secret-reaches-child.md`). Verify: `rg -c '^## [1-5]\. ' $PB/vault/secret-reaches-child.md` prints 5
- [x] T035 Write BOT-055, a printed secret is redacted and records `secret-in-output` (`$PB/vault/secret-in-output-redacted.md`). Verify: `rg -c '^## [1-5]\. ' $PB/vault/secret-in-output-redacted.md` prints 5
- [x] T036 Write BOT-056, a `skills:` list injects the body at the skills position (`$PB/skills/skills-list-injects-body.md`). Verify: `rg -c '^## [1-5]\. ' $PB/skills/skills-list-injects-body.md` prints 5
- [x] T037 Write BOT-057, `skills-over-budget` refuses a list whose bodies cross the cap (`$PB/skills/skills-over-budget.md`). Verify: `rg -c '^## [1-5]\. ' $PB/skills/skills-over-budget.md` prints 5

### Wave 5: Channels And The Root Index

- [x] T038 Write BOT-058, the send queue records `unknown` and never retries (`$PB/channels/queue-unknown-not-retried.md`). Verify: `rg -c '^## [1-5]\. ' $PB/channels/queue-unknown-not-retried.md` prints 5
- [x] T039 Extend the root index with the ten category sections, the counts, the preconditions, the evidence rules, the notation, the review protocol, the wave plan, the scenario table rows and the two cross-reference sections (`$PB/manual-testing-playbook.md`). Verify: `rg -c '^### BOT-0' $PB/manual-testing-playbook.md` prints 58
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Wave 6: Scenario Re-verification

- [ ] T050 Re-check every one of the 33 scenario files against `contracts/cli-json.md`, `contracts/refusals.md` and `design/refusal-catalogue.md`, and fix each mismatch the check finds, so no scenario records a false `FAIL` against a correct product (`scratch/contract-recheck.md`). Verify: `rg -c '^\| BOT-0' scratch/contract-recheck.md` prints 33, and `rg -c 'pbots check' $PB` exits 1, because no `check` verb exists or is planned and the checker script is the command a scenario runs
- [ ] T051 Move the dry-run report folder aside, because the recorder refuses a run folder that already exists (`.skilled/skills/system-skilled-bots/benchmark/reports/`). Verify: `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` exits 1, so no run folder is in the recorder's way

### Wave 7: Execution

- [ ] T040 Execute the nine conversation scenarios and record one verdict row per scenario with its reason and evidence (`scratch/verdicts-conversations.csv`). Verify: `rg -c ',(PASS|FAIL|SKIP),' scratch/verdicts-conversations.csv` prints 9
- [ ] T041 Execute the five routine scenarios, including the one schedule scenario whose slot is computed at run time (`scratch/verdicts-routines.csv`). Verify: `rg -c ',(PASS|FAIL|SKIP),' scratch/verdicts-routines.csv` prints 5
- [ ] T042 Execute the three activity and three terminal-screen scenarios (`scratch/verdicts-activity-screen.csv`). Verify: `rg -c ',(PASS|FAIL|SKIP),' scratch/verdicts-activity-screen.csv` prints 6
- [ ] T043 Execute the two working-place, three memory, two app, three vault, two skill and one channel scenarios (`scratch/verdicts-rest.csv`). Verify: `rg -c ',(PASS|FAIL|SKIP),' scratch/verdicts-rest.csv` prints 13
- [ ] T052 Execute the 25 pre-parity scenarios, BOT-001 to BOT-025, as a regression check on the runtime phases 001 to 011 rewrote, and record one verdict row per scenario with its reason and evidence (`scratch/verdicts-regression.csv`). Verify: `rg -c '^BOT-0(0[1-9]|1[0-9]|2[0-5]),[^,]*,(PASS|FAIL|SKIP),' scratch/verdicts-regression.csv` prints 25
- [ ] T053 Execute DLR-002 Executor audit, DLR-023 Fan-out config schema and DLR-064 Research honors the configured Claude config dir from `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook`, the three scenarios that read `executor-audit.ts` or its tests, which 007 and 008 changed, and record one verdict row each with its reason and evidence (`scratch/verdicts-deep-loop.csv`). Verify: `rg -c '^DLR-0(02|23|64),[^,]*,(PASS|FAIL|SKIP),' scratch/verdicts-deep-loop.csv` prints 3

### Wave 8: Merge And Fix

- [ ] T044 Merge the five bots verdict files into one results file with the recorder's header (`scratch/results.csv`). Verify: `rg -c '^BOT-0' scratch/results.csv` prints 58 and `rg -c ',(PASS|FAIL|SKIP),' scratch/results.csv` prints 58
- [ ] T046 Fix each `FAIL` in its scenario, or file it as a defect naming the phase, the requirement and the observed line, and file a deep-loop `FAIL` against 007 or 008, whichever changed the line it observed (`scratch/failures.md`). Verify: `rg -c ',FAIL,' scratch/results.csv scratch/verdicts-deep-loop.csv` prints 0 for both, or every id it prints appears in `scratch/failures.md` with a phase and a requirement

### Wave 9: Re-run And Record

- [ ] T047 Re-run the scenarios a fix touched and update their rows, so the recorded run matches the corpus (`scratch/results.csv`). Verify: `rg -c '^BOT-0' scratch/results.csv` prints 58, `rg -c ',(PASS|FAIL|SKIP),' scratch/results.csv` prints 58 and `rg -c ',FAIL,' scratch/results.csv` prints 0
- [ ] T045 Record the run through the recorder, which writes the run folder and its row in the benchmark index (`.skilled/skills/system-skilled-bots/benchmark/reports/`). Verify: `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path and `rg -c '^BOT-0' <that path>` prints 58
- [ ] T054 Record the three deep-loop verdicts through the recorder with `--playbook .skilled/skills/system-deep-loop/runtime/manual-testing-playbook --reports .skilled/skills/system-deep-loop/benchmark/reports --label manual-testing-playbook--executor-audit` (`.skilled/skills/system-deep-loop/benchmark/reports/`). Verify: `rg -c '^DLR-0(02|23|64),' .skilled/skills/system-deep-loop/benchmark/reports/*--manual-testing-playbook--executor-audit/results.csv` prints 3 and `rg -c '^# recorded by record-playbook-run.cjs' <that path>` prints 1

### Wave 10: The Gates

- [ ] T048 Run the package validator over the whole corpus (`$PB/manual-testing-playbook.md`). Verify: `$VAL --package system-skilled-bots` prints `PASS ... scenarios=58 categories=17 ... violations=0 warnings=0`
- [ ] T049 Run the packet validator over this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The package validator prints `PASS ... scenarios=58 categories=17 ... violations=0 warnings=0`, and the run folder holds 58 verdict rows. The deep-loop run folder holds 3
- [ ] No verdict reads `SKIP` for a missing verb or a missing field, because phases 001 to 011 are closed before wave 7 starts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose External orchestration section owns the executor roster, the effort policy and the fallback ladder this list's wave table cites
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the blocker on the same line, and the packet cannot close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P0] `$VAL --package system-skilled-bots` printed `scenarios=25 categories=7` before the first scenario file was written, and prints `scenarios=58 categories=17` now
- [x] CHK-005 [P0] `test -f $RT/tests/fixtures/stub-executor` exits 0, so a scenario can dispatch a run without a model
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every scenario file carries the five numbered sections in order, so `rg -c '^## [1-5]\. ' <file>` prints 5 for each of the 33 files
- [x] CHK-011 [P0] Every scenario file carries the eight required fields: feature id, prompt, command sequence, expected signals, evidence, pass/fail, failure triage and the root link
- [x] CHK-012 [P1] Every scenario's bash block removes its temp world in its last step, so `rg -c 'rm -rf "\$W"' <file>` prints 1 for each of the 33 files
- [x] CHK-013 [P1] No scenario rewrites an existing pre-parity scenario, so `git status --porcelain $PB` lists only new files and the root index
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete: every created scenario has a recorded verdict
- [x] CHK-022 [P1] Edge cases tested: the empty inbox, the memory bound and the non-zero exit each have a scenario
- [x] CHK-023 [P1] Error scenarios validated: each refusal a scenario asserts names its own error string
- [ ] CHK-024 [P0] `$VAL --coverage --package system-skilled-bots` reports 58 recorded ids and no run folder without a `results.csv`
- [ ] CHK-025 [P0] Every scenario file was re-checked against the contracts before execution, so `rg -c '^\| BOT-0' scratch/contract-recheck.md` prints 33 and no scenario asserts a field name, a verb or a refusal form the contracts do not carry
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No scenario writes a real secret value or a real channel token, so `rg -n 'sk-[A-Za-z0-9]{20,}|xoxb-|bot[0-9]{8,}' $PB` exits 1
- [x] CHK-031 [P0] Every scenario uses a temp state root and a `pb-` bot id, so `rg -c 'mktemp -d' <file>` prints at least 1 for each of the 33 files
- [x] CHK-032 [P1] A scenario that would print a stored secret prints the redacted form only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: the inventory in `spec.md`, the waves in `plan.md` and the task ids in `tasks.md` name the same 33 scenarios
- [x] CHK-041 [P1] The root index's counts match the files on disk
- [ ] CHK-042 [P2] `benchmark/reports/README.md` names the run folder the recorder wrote
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---

