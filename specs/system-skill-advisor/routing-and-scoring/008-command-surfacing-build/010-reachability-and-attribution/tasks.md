---
title: "Tasks: Phase 10: reachability-and-attribution"
description: "Ordered worker-sized tasks that record the offer and the brief on every run line, backfill the before arm, make the scorer attributable, add the Codex and DSH install steps with read-only doctor checks and measure the cold first prompt before changing it."
trigger_phrases:
  - "reachability and attribution tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: reachability-and-attribution

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
| `[C]` | Coordinator task: a live model session, an arena or an operator step. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `TC` is `npm run typecheck` in `ADV`, which must exit 0.
- `S` is `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs`. `R` is `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs`. `T` is `$ADV/tests/command-transcript-score.vitest.ts`.
- `OF` is `$ADV/scripts/routing-accuracy/command-offer.mjs` (new). `OT` is `$ADV/tests/command-offer.vitest.ts` (new). `RA` is `$ADV/scripts/routing-accuracy/README.md`.
- `VT` is `npx vitest run tests/command-transcript-score.vitest.ts` in `ADV`. `VO` is `npx vitest run tests/command-offer.vitest.ts` in `ADV`.
- `PRE` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`. `SP` is this phase's `scratch/` folder.
- `HOOK` is `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`, the Claude prompt hook entry.
- `IG` is `INSTALL-SKILLED.md`. `DI` is `.dsh/plugins/repo-guards/index.mjs`. `DT` is `.dsh/plugins/repo-guards/tests/bundle.test.mjs`. `DR` is `.dsh/plugins/repo-guards/README.md`. `DA` is `.dsh/plugins/repo-guards/adapters/README.md`.
- `DS` is `.skilled/commands/doctor/scripts`. `CK` is `$DS/codex-hook-approval-check.cjs` and `CKT` its test `$DS/tests/codex-hook-approval-check.test.cjs`. `HW` is `$DS/hook-wiring-check.cjs` and `HWT` its test `$DS/tests/hook-wiring-check.test.cjs`.
- `RMY` is `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`. `SCY` is `.skilled/commands/doctor/assets/doctor-symlink-check.yaml`. `DCT` is `node --test $DS/tests/doctor-symlink-contract.test.cjs $DS/tests/doctor-runtime-mirrors-contract.test.cjs`.
- `HR` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`. `HS` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`. `LCH` is `.skilled/bin/system-skill-advisor-launcher.cjs`.
- `FLOOR` is `node $ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer'`, which must print `{"correct":24,"total":44}` and `{"count":0,"total":35}`.

Rules for every task:
- Each task is one change to the files it names. A task that names a script and its test adds the behaviour and the one case that pins it.
- No task reads or prints holdout prompt text. A row whose split is `holdout` is never opened.
- No worker starts a live model session. Live runs, arenas and operator steps are `[C]` tasks.
- No code comment may name a spec path, a phase number, a task id, an ADR or a REQ id. State the durable reason instead. T028 checks it.
- No task writes to the home folder, installs anything, edits `AGENTS.md` or renames `.skilled/commands/create/skill.md`.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses.
- Wave 0: T001 (`$SP/before.txt`, `$SP/summary-before.json`), T002 (`$SP/socket-key.txt`), T003 (`$SP/cold-start.mjs`, `$SP/cold-start-before.txt`). Read-only for the repository.
- Gate: no task from wave 1 on starts before the coordinator confirms that the before arm in `PRE` is finished, because T017 changes what the start rate counts.
- Wave 1: T004 (`OF`, `OT`), T005 (`S`, `T`), T006 (`DI`, `DT`), T007 (`CK`, `CKT`), T008 (`HW`, `HWT`), T009 (`IG`).
- Wave 2: T010 (`OF`, `OT`), T011 (`S`, `T`), T012 (`IG`), T013 (`DR`, `DA`), T014 (`RMY`), T015 (`SCY`).
- Wave 3: T016 (`OF`, `OT`), T017 (`S`, `T`), T018 (`$DS/README.markdown`).
- Wave 4: T019 (`R`), T020 (`S`, `T`).
- Wave 5: T021 (`R`), T022 (`S`, `T`).
- Wave 6: T023 (`RA`).
- Cold-start wave C1, only when T003 shows a fail-open: T024 (`HR`, then `HS` regenerates `.claude/settings.json` and `.codex/hooks.json`), T025 (`LCH`).
- Cold-start wave C2: T026 (`$SP/cold-start-after.txt`).
- Verification, one at a time: T027, T028.
- After the phase is committed: T029, T030, T031 and T033 are coordinator tasks, T032 is a worker task that waits on T031 and T034 closes the phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$SP/before.txt`, `$SP/summary-before.json`). Run `FLOOR`, `TC`, `VT`, `DCT`, `node --test tests/bundle.test.mjs` in `.dsh/plugins/repo-guards`, `node $HS --check` and `node $S --summary $PRE --json > $SP/summary-before.json`, and write each command with its last output line into `before.txt`. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `TC` exits 0, `VT` reports 0 failed, `DCT` reports `fail 0`, the bundle test reports `fail 0`, `node $HS --check` exits 0 and `jq -r 'keys | join(",")' $SP/summary-before.json` prints the six runtimes.
- [x] T002 Read how `$ADV/skill-advisor-cli.ts` and `LCH` name the daemon socket under `SPECKIT_IPC_SOCKET_DIR`, and record whether two checkouts reach two daemons (`$SP/socket-key.txt`). Verify: the file names the function and the line that derive the socket name and ends with one word, `per-checkout` or `shared`. When it says `shared`, T016 gives each checkout its own socket directory.
- [x] T003 Write `$SP/cold-start.mjs` and run it once with `--runs 5` (`$SP/cold-start-before.txt`). Each run makes a fresh directory with `mkdtempSync(join(tmpdir(), 'ssa-cold-'))`, with `tmpdir` from `node:os`, pipes `{"prompt":"create a readme for the utils folder","cwd":"<repository root>","hook_event_name":"UserPromptSubmit","session_id":"cold-<n>"}` into `node $HOOK` with `SPECKIT_IPC_SOCKET_DIR` set to that directory, and prints the milliseconds and the first line of `additionalContext` (or `<none>`). An optional `--warm` runs `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root <root> --format json --no-warm-only` detached with the same variable and waits 3,000 ms before the hook. After each run the script sends `SIGTERM` only to a process whose command line names that directory, then removes the directory. The last line reads `fail-open N of 5`, where a run fails open when its first line does not start with `Advisor: live` or `Advisor: stale`. Verify: the file has six lines and its last line matches `fail-open [0-5] of 5`, `ls -d "$TMPDIR"/ssa-cold-* 2>/dev/null` prints nothing and `ls /tmp/system-skill-advisor | wc -l` prints the same number before and after the run. When N is 0, mark T024 to T026 `[x]` with `Dropped: T003 measured fail-open 0 of 5` and the median milliseconds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [x] T004 [P] Create `OF` with two exports. `parseOffer(head)` returns `{ offeredCommand, offeredPolicy }`: `offeredCommand` is the first match of `/\/[a-z][a-z-]*:[a-z][a-z-]*(?: [a-z][a-z-]*)?/` in the head, or null, and `offeredPolicy` is `run`, `start` or `ask` when `(run)`, `(start)` or `(ask)` follows that match after optional spaces, or null. `replayOffer({ checkoutDir, prompt, sessionId, timeoutMs = 30000 })` runs `node <checkoutDir>/$HOOK` with `cwd` `checkoutDir` and the payload shape of T003, takes the first line of `hookSpecificOutput.additionalContext` and returns `parseOffer` of it with `offerError: null`, or null fields with `offerError` `hook_missing`, `hook_failed` or `no_head`. Create `OT` with cases for the heads `Advisor: live; use sk-git → /doctor:git hooks (ask) 0.82/0.12 pass.`, `Advisor: live; ambiguous: /doctor:git hooks 0.82/0.12 vs sk-git 0.86/0.16 pass.`, `Advisor: live; use command-spec-kit-plan 0.82/0.16 pass.` and a `replayOffer` call on a folder with no hook, which returns `offerError` `hook_missing`. Verify: `VO` reports 0 failed and `TC` exits 0.
- [x] T005 [P] In `commandParts` (`S`), when the name holds whitespace, keep the text before the first space as `name` and the rest as `route`, so `/doctor:git hooks` looks up `doctor/git.md`. Add one case to `T`: events that read `.skilled/commands/doctor/git.md` and then write give `startState(events, { expected_command: '/doctor:git hooks', expected_policy: 'run' }).started` true. Verify: `VT` reports 0 failed.
- [x] T006 [P] In `apply` (`DI`), change the advisor flag to `enabled: options.promptAdvisor !== false`. In `DT`, rename the test to `prompt advisor stays on unless its row flag is false` and assert that `preStepCount({ adapters: { promptAdvisor: true } })` equals `preStepCount()` and that `preStepCount({ adapters: { promptAdvisor: false } })` is one lower. Verify: `rg -n "promptAdvisor !== false" $DI` prints one line, and `node --test tests/bundle.test.mjs` in `.dsh/plugins/repo-guards` reports `fail 0`.
- [x] T007 [P] Create `CK` and `CKT`. `CK [--root <dir>] [--config <path>] [--json]` reads `<root>/.codex/hooks.json` and prints `SKIP no-codex-hooks` with exit 0 when it is absent. It finds the `UserPromptSubmit` group `g` and hook index `i` whose `command` contains `hooks/codex/user-prompt-submit.js`, or prints `WARN codex-advisor-hook-absent` with exit 1. It reads `--config`, else `${CODEX_HOME:-$HOME/.codex}/config.toml`, and looks for a header line `[hooks.state."<root>/.codex/hooks.json:user_prompt_submit:<g>:<i>"]`, with `<root>` as given or as its real path, followed by a `trusted_hash` line before the next header. Found prints `PASS codex-hooks-approved` with exit 0. Otherwise it prints `WARN codex-hooks-unapproved <root>` and `repair: open /hooks in a Codex session at <root> and approve each entry`, with exit 1. A bad flag exits 2. It never prints a hash and calls no write, mkdir, rename or remove function. `CKT` covers an approved fixture, an unapproved fixture and a root with no `.codex`. Verify: `node --test $CKT` reports `pass 3` and `fail 0`, `rg -n "writeFile|appendFile|mkdir|rename|rmSync|unlink" $CK` prints nothing, and `shasum -a 256 ~/.codex/config.toml` prints the same digest before and after `node $CK --root .`, which prints one line starting `PASS` or `WARN`.
- [x] T008 [P] Create `HW` and `HWT`. `HW --root <dir> [--json]` checks four runtimes: `claude` (`.claude/settings.json`, event `UserPromptSubmit`, marker `hooks/claude/user-prompt-submit.js`), `codex` (`.codex/hooks.json`, `UserPromptSubmit`, `hooks/codex/user-prompt-submit.js`), `cursor` (`.cursor/hooks.json`, `beforeSubmitPrompt`, `hooks/cursor/user-prompt-submit.js`) and `devin` (`.devin/hooks.v1.json`, `UserPromptSubmit`, `hooks/devin/user-prompt-submit.js`). A runtime whose folder is absent is skipped. It reads the event under `hooks` or at the top level and prints `ok <runtime>` when its JSON text holds the marker, else `hook-missing <runtime> <file>`, also for a missing or unreadable file. It exits 1 when any line is `hook-missing`, 0 otherwise and 2 on a bad flag or a missing root. It writes nothing. `HWT` covers a root whose `.claude/settings.json` lacks the entry, the same root with it and a root with no runtime folder. Verify: `node --test $HWT` reports `pass 3` and `fail 0`, and `node $HW --root .` prints `ok claude`, `ok codex`, `ok cursor` and `ok devin` and exits 0.
- [x] T009 [P] In `IG`, under `### Check the Install`, add one paragraph after the line about hyphenated commands: Codex runs a project hook only after you approve it, so open `/hooks` in a Codex session at the repository root and approve each entry it lists. Codex keeps each approval as a `trusted_hash` in `~/.codex/config.toml`, so a changed entry needs approving again, and `/doctor:runtime-mirrors` prints `PASS codex-hooks-approved` once the advisor's entry is approved. Verify: `rg -n "codex-hooks-approved" $IG` prints one line and `rg -c "trusted_hash" $IG` prints 1.

### Wave 2
- [x] T010 [P] Add `briefDelivered({ runtime, locator, loadSession })` to `OF`. For `claude` it reads `locator.transcriptPath` and returns true when a line has `type` `attachment`, `attachment.type` `hook_additional_context`, `attachment.hookEvent` `UserPromptSubmit` and content matching `/Advisor: [a-z]+[;. ]/`, false when the file loads without one and `"unknown"` when it cannot be read. For `pi` it loads the session and tests its records with the same pattern. Every other runtime returns `"unknown"`. Add three `OT` cases: a Claude fixture with the attachment, one without it and a `devin` locator. Verify: `VO` reports 0 failed.
- [x] T011 [P] In `S`, carry `wrote` (true when the run line's `changedPaths` is a non-empty array) on each scored result and add `byPolicy` to each tally block with keys `run`, `start` and `ask`, each `{ rows, capped, started, wrote }`, filled from the row's `expected_policy`. Print one text line per policy under each arm, `policy <name>: <rows> rows, <capped> capped, <started> started, <wrote> wrote`. Add one `T` case through the summary fixture. Verify: `VT` reports 0 failed, and `node $S --summary $PRE --json | jq -c '.claude.pre.byPolicy | keys'` prints `["ask","run","start"]`.
- [x] T012 [P] In `IG`, change `any of the six runtimes: OpenCode, Claude Code, Codex, Cursor, Devin or Pi` to `any of the seven runtimes: OpenCode, Claude Code, Codex, Cursor, Devin, Pi or DeepSeek Harness (DSH)`, add DSH to the runtimes that spell commands with a hyphen and add one sentence: DSH loads the repository's guards and the skill advisor only from the patches a run names, so start it with `--patch .dsh/patches/guards.patch.yml`. Verify: `grep -ci dsh $IG` prints at least 2.
- [x] T013 [P] In `DR` section 5 and in the `prompt-advisor.mjs` row of `DA`, state that the bundle registers the prompt advisor unless its row flag is `false`, that the guards patch still writes `true` and that a lineage leaf stays without a brief. Verify: `rg -n "unless its row flag is .false." $DR $DA` prints two lines and `rg -n "Off unless" $DA` prints nothing.
- [x] T014 [P] In `RMY`, add `codex_hook_approval: ".skilled/commands/doctor/scripts/codex-hook-approval-check.cjs"` to `upstream_assets` and one step after the `codex_hooks_installer` step: run `upstream_assets.codex_hook_approval` with `--root "$PWD"`. `PASS` is in sync, `WARN` sets STATUS to WARN and shows the repair line without counting as drift, and `SKIP` leaves STATUS unchanged. Keep every existing phrase. Verify: `rg -c "codex_hook_approval" $RMY` prints 2 and `DCT` reports `fail 0`.
- [x] T015 [P] In `SCY`, add `hook_wiring: ".skilled/commands/doctor/scripts/hook-wiring-check.cjs"` to `upstream_assets`, add a step after the engine run that runs `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root "{root}"`, shows each `hook-missing <runtime>` line and ends with STATUS=WARN on exit 1, naming the repair: copy the prompt hook entry from Skilled's own file for that runtime into the target's file. Append to the invariant that the route also runs the read-only hook-wiring check, keeping the words `check subcommand only`. Verify: `rg -c "hook-wiring-check.cjs" $SCY` prints at least 2 and `DCT` reports `fail 0`.

### Wave 3
- [x] T016 [P] Add `backfillRunLog({ inPath, outPath, promptFor, replay = replayOffer, brief = briefDelivered, warm })` to `OF`. It refuses with code `same_path` when `outPath` resolves to `inPath`. It calls `promptFor(rowId)` for every line before writing, so a holdout or unknown row refuses the run with no output file. For each line it takes the checkout from `locator.projectDir`, warms each checkout once with `warm(checkoutDir)` (default: `advisor_status --workspace-root <dir> --format json --no-warm-only` through that checkout's `.skilled/bin/skill-advisor.cjs`), replays the offer with session id `backfill-<rowId>`, sets `briefDelivered` and writes the line with the three fields and `offerBackfilled: true`. A line with no `projectDir` gets null fields and `offerError: 'no_checkout'`. When `$SP/socket-key.txt` says `shared`, `warm` and `replay` also set `SPECKIT_IPC_SOCKET_DIR` to one short `/tmp/ssa-bf-<n>` directory per checkout. Add `OT` cases with injected `replay`, `brief` and `warm` for a two-line log, a `no_checkout` line, a refused holdout id and `same_path`. Verify: `VO` reports 0 failed.
- [x] T017 [P] In `S`, keep capped runs out of the start denominator: `startRows` and `started` count uncapped start rows only, and a new `cappedStartRows` counts capped start rows. Print `capped start rows <n>` on the arm line. Add one `T` case with a capped and an uncapped start row. Verify: `VT` reports 0 failed, and `node $S --summary $PRE --json | jq -c '.opencode.pre | {startRate, cappedStartRows}'` prints a `startRate` whose denominator plus `cappedStartRows` equals the arm's start rows in `$SP/summary-before.json`.
- [x] T018 [P] In `$DS/README.markdown`, add `codex-hook-approval-check.cjs` and `hook-wiring-check.cjs` to the tree, the script table and the read-only table, each with its flags and exit codes. Verify: `rg -c "codex-hook-approval-check.cjs|hook-wiring-check.cjs" $DS/README.markdown` prints at least 4.

### Wave 4
- [x] T019 In `R`, import `replayOffer` and `briefDelivered` from `OF`. In `runTurn`, after the restore and before the line is appended, call `replayOffer({ checkoutDir: PROJECT_DIR, prompt: job.prompt, sessionId })` and add `offeredCommand` and `offeredPolicy` to the line, then add `briefDelivered` from the turn's locator (`"unknown"` in a dry run). Change nothing else in the turn. Verify: `node --check $R` exits 0, `rg -c "offeredCommand|offeredPolicy|briefDelivered" $R` prints at least 3, and `node $R --print-argv claude | jq -r 'type'` prints `array`.
- [x] T020 In `S`, add `offered`, `startedOfOffered` and `offerUnknown` to each tally block. `offered` counts uncapped start rows whose line's `offeredCommand` names the row's expected command by namespace and name, `startedOfOffered` counts the started ones among them and `offerUnknown` counts uncapped start rows whose line has no `offeredCommand` key. Print `offered <X>, started <Y> of <X>, offer unknown <n>` on the arm line. Add one `T` case with an offered and a not-offered start row. Verify: `VT` reports 0 failed, and `node $S --summary $PRE --json | jq -c '.claude.pre | {offered, startedOfOffered, offerUnknown}'` prints `{"offered":0,"startedOfOffered":0,"offerUnknown":12}`.

### Wave 5
- [x] T021 In `R`, add a `--backfill <run-log>` mode that needs `--out <new-log>` and calls `backfillRunLog` with a `promptFor` built from the runner's own `promptFor` and the fixture folder `resolve(dirname(<run-log>), G2_FIXTURE_DIRNAME)`. A refusal prints its code as JSON and exits 2. Add the mode to the usage text. Then write `$SP/backfill-fixture.jsonl` with two lines for row `cmd-create-agent-plain-tune-01`, runtime `claude`, arm `pre`, exit 0, empty `changedPaths`, the first with `locator` `{"projectDir":"<absolute repository root>"}` and the second with `locator` null, and run `node $R --backfill $SP/backfill-fixture.jsonl --out $SP/backfill-out.jsonl`. Verify: `jq -c '{offerBackfilled, briefDelivered, offerError, has: has("offeredCommand")}' $SP/backfill-out.jsonl` prints `{"offerBackfilled":true,"briefDelivered":"unknown","offerError":null,"has":true}` and then a line with `"offerError":"no_checkout"`, and `node $R --backfill $SP/backfill-fixture.jsonl --out $SP/backfill-fixture.jsonl` exits 2 and prints `same_path`.
- [x] T022 In `S`, after all lines are tallied, set `armIncomplete` on each runtime's arm block to true when its `runs` is lower than the largest `runs` of any runtime in the same arm, else false. End the arm's text line with `, arm incomplete` when it is true. Add one `T` case with two runtimes of two and one runs. Verify: `VT` reports 0 failed, and `node $S --summary $PRE --json | jq -c '[to_entries[] | select(.value.pre.armIncomplete == true) | .key]'` prints the runtimes whose `pre` run count in `$SP/summary-before.json` is below the largest.

### Wave 6
- [x] T023 In `RA`, describe the three run-line fields and that the offer is a replay of the Claude prompt hook after the turn, the `--backfill` mode and its refusals, and the summary keys `offered`, `startedOfOffered`, `offerUnknown`, `cappedStartRows`, `armIncomplete` and `byPolicy`. Verify: `rg -c "offeredCommand|--backfill|armIncomplete|byPolicy|cappedStartRows" $RA` prints at least 5.

### Cold-start wave C1 (only when T003 shows a fail-open)
- [x] T024 Dropped: T003 measured fail-open 0 of 5 with a sandboxed socket (median 431 ms), and a true cold start with no daemon alive measured fail-open 0 of 5 (median 742 ms against the 2,500 ms hook budget, `scratch/cold-arena-result.txt`). Original task: [P] In `HR`, add a hook `advisor-warm` with concern `Start the skill advisor daemon at session start so the first prompt gets a brief`, bound for `claude` at `SessionStart` group 0 slot 8 and for `codex` at `SessionStart` group 0 slot 5, each with runner `node`, script `.skilled/bin/skill-advisor.cjs`, args `advisor_status --workspace-root . --format json --no-warm-only`, timeout 3 and fallback `background`. Run `node $HS`. Do not edit a generated file by hand. Verify: `node $HS --check` exits 0, `jq '[.hooks.SessionStart[].hooks[] | select(.command | test("skill-advisor.cjs advisor_status"))] | length'` prints 1 for `.claude/settings.json` and for `.codex/hooks.json`, and `git -c core.fsmonitor=false diff --stat HEAD -- .cursor/hooks.json .devin/hooks.v1.json` prints nothing.
- [x] T025 Dropped: T003 measured fail-open 0 of 5 with a sandboxed socket (median 431 ms), and a true cold start with no daemon alive measured fail-open 0 of 5 (median 742 ms against the 2,500 ms hook budget, `scratch/cold-arena-result.txt`). Original task: [P] In `LCH`, set `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` to `750` in the daemon's environment when the launcher's own environment leaves it unset, and add the name to the list of variables passed to the daemon. Verify: `node --check $LCH` exits 0 and `rg -c "SPECKIT_CASCADE_PROBE_TIMEOUT_MS" $LCH` prints at least 2.

### Cold-start wave C2
- [x] T026 Dropped: T003 measured fail-open 0 of 5 with a sandboxed socket (median 431 ms), and a true cold start with no daemon alive measured fail-open 0 of 5 (median 742 ms against the 2,500 ms hook budget, `scratch/cold-arena-result.txt`). Original task: Run `node $SP/cold-start.mjs --runs 5 --warm` (`$SP/cold-start-after.txt`). Verify: its last line reads `fail-open 0 of 5`, and `ls -d "$TMPDIR"/ssa-cold-* 2>/dev/null` prints nothing. If it reads more than 0, revert T024 and T025 and mark them `[B]` with the printed line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Run every gate. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `TC` exits 0, `VT` and `VO` report 0 failed, `node --test $CKT $HWT` and `DCT` report `fail 0`, `node --test tests/bundle.test.mjs` in `.dsh/plugins/repo-guards` reports `fail 0` and `node $HS --check` exits 0.
- [ ] T028 Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md .skilled/commands/create` exits 0, `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled .dsh | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9])"` prints nothing, and `git -c core.fsmonitor=false status --short -- .skilled .dsh INSTALL-SKILLED.md .claude .codex` lists only files named in this phase's tasks.
- [ ] T029 [C] Backfill the before arm: run `node $R --backfill $PRE --out $SP/runs-pre-attributed.jsonl` from the repository root while the six arenas under `$TMPDIR/skilled-behaviour-arenas/pre-<runtime>` still exist at commit `2920b1abef`. Verify: `wc -l` prints the same number for both files, `git -c core.fsmonitor=false diff --quiet HEAD -- $PRE` exits 0 and `jq -r '"\(.runtime) \(.briefDelivered)"' $SP/runs-pre-attributed.jsonl | sort | uniq -c` shows every `claude` and `pi` line as `true` and every `codex`, `devin`, `opencode` and `dsh` line as `unknown`.
- [ ] T030 [C] Run `node $S --summary $SP/runs-pre-attributed.jsonl > $SP/summary-attributed.txt`. Verify: every arm line holds `offered`, `capped start rows` and three `policy` lines, and a runtime with fewer rows than the others ends with `arm incomplete`.
- [ ] T031 [C] Codex smoke: prepare one arena at this phase's commit, have the operator open `/hooks` in a Codex session there and approve each entry, then run one row through `R` with `--runtime codex --arm smoke`. Verify: `node $CK --root <arena>` prints `PASS codex-hooks-approved`, and the rollout at the line's `locator.transcriptPath` contains `Advisor: `.
- [ ] T032 Only when T031's rollout contains the brief: in `briefDelivered` (`OF`), decide `codex` from its raw rollout in the shape T031 shows, with one `OT` case built from that shape. Verify: `VO` reports 0 failed. When T031's rollout holds no brief, mark this task `[x]` with `Dropped: no Codex brief in the smoke rollout`.
- [ ] T033 [C] DSH smoke: in an arena at this phase's commit, run one turn through `dsh` with one route patch and the guards patch and without the lineage patch. Verify: the stored step payload contains `Advisor: `.
- [ ] T034 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T024 to T026 and T032 either done or marked dropped with their measured reason
- [ ] No `[B]` blocked tasks remaining
- [ ] The before arm is backfilled, and the attributed summary prints an offered count for every runtime
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research.md`
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

A blocked task gets `[B]` and one line naming what blocks it. A moved floor blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The before numbers and the old-meaning summary are in `scratch/` (T001).
- [ ] CHK-002 [P0] The coordinator confirmed the before arm is finished before wave 1 started.
- [ ] CHK-003 [P1] The socket key and the cold-start measurement are recorded (T002, T003).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run typecheck` in `ADV` exits 0.
- [ ] CHK-011 [P0] No code comment names a spec path, a phase number, a task id, an ADR or a REQ id (T028).
- [ ] CHK-012 [P0] The two check scripts and the backfill write nothing in the home folder (T007, T028).
- [ ] CHK-013 [P1] A failed replay yields null fields with an `offerError`, never a crash (T004).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The scorer and offer tests pass (T027).
- [ ] CHK-021 [P0] The floors hold (T027).
- [ ] CHK-022 [P1] The doctor contract tests, the two check tests and the DSH bundle test pass (T027).
- [ ] CHK-023 [P1] The backfill has as many lines as its input and leaves the input unchanged (T029).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The gap is class `measurement`: the harness reports a rate it cannot attribute.
- [ ] CHK-FIX-002 [P0] Every reader of the start rate is listed: `rg -n "startRate|startRows" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'`.
- [ ] CHK-FIX-003 [P1] Every runtime with a prompt hook file is in the hook-wiring table: claude, codex, cursor and devin.
- [ ] CHK-FIX-004 [P1] Evidence names the commit it ran on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No task reads or prints holdout prompt text, and the backfill refuses a holdout row id (T016).
- [ ] CHK-031 [P0] The Codex check prints no hash value (T007).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same fields and numbers.
- [ ] CHK-041 [P1] The install guide, the DSH READMEs, the doctor scripts README and the routing-accuracy README match the code (T009, T012, T013, T018, T023).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Probes, fixtures, measurements and the attributed log live in `scratch/` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 9 | 0/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
