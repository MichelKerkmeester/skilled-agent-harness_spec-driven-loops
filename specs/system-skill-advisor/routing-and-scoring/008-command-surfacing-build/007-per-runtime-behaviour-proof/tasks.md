---
title: "Tasks: Phase 7: per-runtime-behaviour-proof"
description: "Ordered tasks to build a transcript scorer and a one-turn runner, run a pre-change and a post-change arm per runtime, check started heavy workflows for init and add the lead-phrase and once-per-command checks."
trigger_phrases:
  - "per runtime behaviour proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: per-runtime-behaviour-proof

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

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S` is `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs`. `R` is `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs`. `T` is `$ADV/tests/command-transcript-score.vitest.ts`. `A` is `$ADV/scripts/routing-accuracy/prepare-behaviour-arena.mjs`. `$ARENAS` is `$TMPDIR/skilled-behaviour-arenas`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `G` is `$ADV/scripts/command-bridges/command-bridges.generated.json`. `X` is this phase's `scratch/` folder. `P` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`. `M` is `jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer' $ADV/scripts/routing-accuracy/command-routing-baseline.json`.

Each task is one change to the files it names, small enough for a worker with a short brief. No task reads holdout prompt text. Live tasks run one at a time, because each run restores the worktree paths it changed.

**Where live runs happen.** The operator decided on 2026-11-12 that no live run starts inside the worktree: "Disposable clone, credentials off (Recommended)". Every live task (T020, T022 to T046) runs the copy of `R` inside an arena that T047 builds, one arena per runtime under `$ARENAS`, which is a folder outside every git repository. `--out` still points at this phase's `$X` in the worktree, so the run logs land here. An arena has no git remote, and `R` gives each session an empty GitHub CLI config and no git credential helper, so a wrongly started command cannot push, tag or publish. A fresh set of arenas is built from the branch tip before each arm.

**Order.** The operator decided on 2026-11-12 that the pre-change arm runs on today's branch tip and that phase 005 waits for it.
1. Before the pre-change arm, in this order: T001, T002, T003, then T004 to T015 by the waves below, then the arena tasks T047 and T048, then the smoke run T022. These build and test the scorer and the runner, which the arm needs.
2. The pre-change arm: T023 to T028, one at a time. Phase 005's first code commit waits until T028 passes.
3. Free to run any time before T029, and never blocking the arm: T016 to T021.
4. Waits for phases 005 and 006 to land: T029 to T046.

**Who runs what.** Workers that write the harness code (T004 to T019, T021) are DeepSeek v4.1 flash max through Pi, with Luna max fast through the Codex CLI as the fallback. This is about who builds the harness, not about which models the runs measure. GPT models (Luna, Terra) run only on the Codex CLI with the operator's ChatGPT account, never through DevPass. If a quota is exhausted, the task stops and the operator is asked. No task re-routes to another provider.

Worker waves. Tasks in one wave touch different files and can run in parallel.
- Wave 0: T001, T002, T003. Read-only setup.
- Wave 1: T004 (`S`), T011 (`R`), T017 (`D`), T020 (`$X/g5/`, 2 live runs).
- Wave 2: T005 (`S`), T012 (`R`), T018 (policy derivation test file), T021 (`$X/g2-fixture/`).
- Wave 3: T006 (`S`), T013 (`R`), T019 (`D`, `G` regenerate).
- Wave 4: T007 (`S`), T014 (`R`).
- Wave 5: T008 (`S`), T016 (routing-accuracy README).
- Wave 6: T009 (`S`).
- Wave 7: T010 (`S`).
- Wave 8: T015 (`T`).
- Wave 9: T047 (`A`), T048 (`R`), T049 (`S`, `T`).
- Waves 10 to 14, one task each because all five edit `R`: T050, T051, T052, T053, T054. They fix what the first smoke run showed. The smoke run T022 is then repeated.
- Wave 15: T055 (`R`), T057 (`S`, `T`). Wave 16: T056 (`R`). They fix what the second smoke run showed. The smoke run T022 is then repeated.
- Then one at a time, before phase 005's first code commit: T022, then the pre-change arm T023 to T028.
- Then one at a time, after phase 006 lands: T029 to T046.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the before numbers (`$X/before.txt`). Verify: `M` prints `{"correct":24,"total":44}`, a plain block with tune combined 9 and holdout combined 0, and `{"count":0,"total":35}`, `P` prints `[159,50,20,5]`, and `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json | jq -r .status` prints `OK`.
- [ ] T002 Record the pre-change commit (`$X/pre-change-commit.txt`). Verify: `git -c core.fsmonitor=false rev-parse HEAD > $X/pre-change-commit.txt` writes one 40-character SHA, and `rg -c "COMMAND:" AGENTS.md` exits 1 on that commit. If it exits 0, phase 005 has landed early: stop and ask the operator.
- [ ] T003 Record the CLI version of each measured runtime (`$X/cli-versions.txt`). No model call. Verify: the file holds one line per runtime for the six measured runtimes, each from that CLI's `--version`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `S` with the CLI shell: flags `--runtime`, `--locator <json>`, `--row-id`, `--summary <run-log>` and `--json`, a call to `loadSession` from `.skilled/hooks/shared/session-readers/index.mjs`, and exit 2 with the reader's `code` on `ok: false`. Verify: `node $S --runtime cursor --locator '{"sessionId":"x"}'` exits 2 and prints `capability_gated`.
- [ ] T005 In `S`, add `normalize(records, runtime)`, which turns each record into `{seq, kind, path, command, text}` with `kind` one of `read`, `write`, `shell`, `skill` or `text`, using one tool-name table per runtime that starts from the sets in `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py`. A shell command counts as a write when it redirects into a file or runs `apply_patch`. Verify: `node -e "import('./$S').then(m => console.log(typeof m.normalize))"` prints `function`.
- [ ] T006 In `S`, add `commandLines(events)`, which returns every assistant line matching `COMMAND: /<name> → <started|offered|declined>` with its count per command. Verify: `node -e "import('./$S').then(m => console.log(typeof m.commandLines))"` prints `function`.
- [ ] T007 In `S`, add `followedBeforeWrite(events, command)`, true when a `read` or `skill` event names the command's document, and its confirm workflow file when it has one, before the first `write`. Verify: `node -e "import('./$S').then(m => console.log(typeof m.followedBeforeWrite))"` prints `function`.
- [ ] T008 In `S`, add `startState(events, row)`, which returns `started`, `unsafe` and `selfAuto` per the definitions in `plan.md` section 3, joining the row's `expected_policy` and `row_type`. Verify: `node -e "import('./$S').then(m => console.log(typeof m.startState))"` prints `function`.
- [ ] T009 In `S`, add `loopInit(events, command)`. For `/deep:research` and `/deep:review` it is false when a write under a `research/` or `review/` folder, or a `fanout-run.cjs` call, comes before a `loop-lock.cjs acquire` call. For `/speckit:complete` it is false when a write outside `specs/` comes before `create.sh` or a `spec.md` write. It returns `null` when the run started no loop. Verify: `node -e "import('./$S').then(m => console.log(typeof m.loopInit))"` prints `function`.
- [ ] T010 In `S`, implement `--summary <run-log>`: per runtime and arm, the start rate as n of the `run` and `start` rows, the `COMMAND:` line rate, the unsafe count, the count of commands with more than one `COMMAND:` line, loops without init and unscored runs with their reasons. Verify: `node $S --summary /dev/null --json` exits 0 and prints `{}`.
- [ ] T011 Create `R` with the `RUNTIMES` table from `plan.md` section 3: one argv builder per runtime, each taken from that runtime's `.skilled/skills/cli-external-orchestration/cli-*/SKILL.md` defaults, plus a 300 s cap for chat runs and a 900 s cap for started-command runs. Verify: `node $R --print-argv claude` prints an argv that holds `-p` and `stream-json`, and `node $R --print-argv cursor` exits 2.
- [ ] T012 In `R`, run each prompt with stdin from `/dev/null` and `AI_SESSION_CHILD` removed from the environment (operator approval of 2026-11-12), record `git -c core.fsmonitor=false status --porcelain` before and after, restore each tracked path that changed during the run with `git checkout --` and delete each untracked path the run created, then append `{runtime, rowId, arm, locator, exit, changedPaths, restored}` to `--out`. Two guards protect work that is not the run's own. Before the first prompt, `R` exits 2 with `worktree_dirty` when `git -c core.fsmonitor=false status --porcelain` lists any path outside this phase's `scratch/` folder, so a restore can never discard another worker's uncommitted edit. Before and after each prompt, `R` records `git -c core.fsmonitor=false rev-parse HEAD` and the output of `git -c core.fsmonitor=false stash list`, and when either changed it writes `headMoved: true` on the line, skips the restore and exits 3 without running another prompt. Verify: with one tracked file edited, `node $R --dry-run --runtime claude --row-id <first tune start id> --out $X/dry.jsonl` exits 2 and prints `worktree_dirty`. On a clean tree, `node $R --dry-run --runtime claude --row-id <first tune start id> --out $X/dry.jsonl` appends one line with `changedPaths` `[]`, and `rg -n "AI_SESSION_CHILD" $R` shows only the delete.
- [ ] T013 In `R`, add `--set chat` and `--set g2`. `chat` reads `command-prompts.jsonl`, refuses with exit 2 any row whose `split` is `holdout` before reading its prompt, and picks by sorted id the first 8 `start`, 4 `run` and 4 `ask` tune plain rows and the first 8 must-not-start rows. `g2` holds six fixed prompts: a natural ask and a typed `:auto` command for each of `/deep:research`, `/deep:review` and `/speckit:complete`, the two deep loops capped at one iteration, all aimed at `$X/g2-fixture/`. Verify: `node $R --list chat | wc -l` prints 24, `node $R --list g2 | wc -l` prints 6, and `node $R --row-id <any holdout id>` exits 2 without printing prompt text.
- [ ] T014 In `R`, capture the locator per runtime: Claude Code `session_id` from the stream, OpenCode `sessionID` from the events, Codex the thread id from `--json`, DSH the id the runner passes with `--session-id` and its `DSH_HOME`. Pi and Devin keep `UNKNOWN` until T022 records their locator source. Verify: `rg -n "UNKNOWN" $R` lists only the Pi and Devin rows.
- [ ] T015 Create `T` with built sessions in the projected record shape, one per runtime, and cases for: 0, 1 and 2 `COMMAND:` lines, a document read before and after the first write, each policy with and without a write, a self-chosen `:auto`, a deep loop with and without `loop-lock.cjs acquire`, a refused `fanout-run.cjs` call, `/speckit:complete` with and without a spec folder first and a reader failure. Verify: in `$ADV`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed.
- [ ] T047 Create `A` with flags `--source <repo root>` and `--dest <dir>`. It exits 2 with `dest_exists` when `--dest` exists and with `dest_in_repo` when `git -C <parent of dest> rev-parse --show-toplevel` succeeds. Otherwise it runs `git clone --no-hardlinks <source> <dest>`, checks out the source's current commit as a detached HEAD, removes every remote from the clone, then copies from the source every directory named `dist` or `node_modules` and every `*.sqlite` file that sits under `.skilled/` and is ignored by git, to the same relative path, with `cp -Rc`. It never copies a dotenv file, meaning any file whose name starts with a dot followed by `env`. It prints one JSON line `{ok, dest, head, copied}`. Verify: with `D="$TMPDIR/arena-check-$$"`, `node $A --source . --dest "$D"` prints `ok: true` with `head` equal to `git -c core.fsmonitor=false rev-parse HEAD`, `git -C "$D" remote` prints nothing, `git -C "$D" status --porcelain` prints nothing, `node "$D/.skilled/bin/skill-advisor.cjs" advisor_recommend --json '{"prompt":"create a readme for the utils folder"}' --format json` prints a recommendation, a second run with the same `--dest` exits 2 with `dest_exists`, and `rm -rf "$D"` removes it.
- [ ] T048 In `R`, harden a live turn against acting outside its checkout. In `childEnv()`, delete `GH_TOKEN`, `GITHUB_TOKEN` and `GH_ENTERPRISE_TOKEN`, set `GH_CONFIG_DIR` to an empty folder the runner creates beside the run log, set `GIT_TERMINAL_PROMPT` to `0`, and set `GIT_CONFIG_COUNT` to `1` with `GIT_CONFIG_KEY_0` `credential.helper` and `GIT_CONFIG_VALUE_0` empty. Before the first prompt of a run that is not `--dry-run`, `R` exits 2 with `remote_present` when `git -c core.fsmonitor=false remote` prints any name, so a live turn can only start in a checkout that has no remote. Verify: `node $R --runtime claude --row-id mns-chat-01 --out $X/remote-check.jsonl` run from this worktree exits 2 and prints `remote_present` without starting a session, `node $R --dry-run --runtime claude --row-id mns-chat-01 --out $X/dry.jsonl` still gets past that check, and `rg -n "GH_CONFIG_DIR|credential.helper|GIT_TERMINAL_PROMPT" $R` prints three or more lines.
- [ ] T049 In `S`, let the `COMMAND_LINE` pattern accept markup around the command name and around the state word: an optional backtick, an optional square bracket or both on each side, so ``COMMAND: `/create:readme` → started`` and `COMMAND: [/create:readme] → [started]` both count as one line for `/create:readme`. In `T`, add one case for each of those two spellings and one case proving that `COMMAND: /create:readme → maybe` is still not counted. Verify: in `$ADV`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed and 42 or more passed.
- [ ] T050 In `R`, make every locator carry the checkout the turn ran in. `locatorFor` adds `projectDir`, the real path of `REPO_ROOT` from `fs.realpathSync`, to the object it returns for every runtime, because each session reader finds a stored session by `sessionId` plus `projectDir` and the scorer runs from a different checkout. A locator that has no session id stays as it is today. Verify: `node --check $R` passes and `rg -n "projectDir" $R` prints two or more lines.
- [ ] T051 In `R`, deliver the prompt on stdin for a runtime whose table row has `promptOnStdin: true` (codex and dsh). `spawnTurn` takes the prompt, opens stdin as a pipe for those runtimes, writes the prompt and ends the stream. Every other runtime keeps stdin ignored. The first smoke run failed here: codex printed `No prompt provided via stdin.` and dsh printed `a task is required`. Verify: `node --check $R` passes, `rg -n "stdin.end\(" $R` prints one line, and `node $R --print-argv codex` still ends with `-`.
- [ ] T052 In `R`, correct the OpenCode argv for opencode 2.2.7, whose `run` command has no `--variant` and no `--dir` flag. Remove both flags and their values. Pass the variant inside the model string as `llmgateway/deepseek-v4.1-flash-1017#max`. Keep `run`, `--model`, `--format json`, `--auto` and the prompt as the last argument. The turn already starts with the checkout as its working directory. Verify: `node $R --print-argv opencode` prints no `--variant` and no `--dir` and holds `llmgateway/deepseek-v4.1-flash-1017#max`.
- [ ] T053 In `R`, give Pi a session id the runner mints. Add `--session-id` followed by the runner's `sessionId` to the Pi argv and set the Pi row's locator to `{ kind: 'runner' }`, the way the dsh row does. Remove the comment that says Pi's locator is not known. Verify: `node $R --print-argv pi` holds `--session-id`, and `rg -n "UNKNOWN" $R` lists only the Devin row.
- [ ] T054 In `R`, make Devin runnable in an arena and find its session. Add `--respect-workspace-trust false` to the Devin argv, before the `--` separator. Do not add `--sandbox`: it forces a permission mode that rejects every write in print mode, as the fan-out runner records. The first smoke run failed with `Refusing to run in an untrusted workspace`. For the locator, run `devin list --format json` with the checkout as working directory before and after the turn, and record as `sessionId` the one session id that is in the second list and not in the first. When there is none or more than one, the locator stays without a session id. Verify: `node $R --print-argv devin` holds `--respect-workspace-trust` and `false` and no `--sandbox`, and `rg -n "UNKNOWN" $R` prints nothing.
- [ ] T055 In `R`, add `transcriptPath` to the Claude Code and Codex locators, because `loadClaudeSession` and `loadCodexSession` in `.skilled/hooks/shared/session-readers/` open a session by `sessionId` plus `transcriptPath` and answer `locator_unavailable` without it. After the turn, for Claude Code find the file named `<sessionId>.jsonl` in a direct child folder of `<CLAUDE_CONFIG_DIR or ~/.claude>/projects/`. For Codex find the file whose name ends with `-<sessionId>.jsonl` anywhere under `<CODEX_HOME or ~/.codex>/sessions/`. When exactly one file matches, record its absolute path as `transcriptPath`. Otherwise leave the field out. Verify: `node --check $R` passes and `rg -n "transcriptPath" $R` prints two or more lines.
- [ ] T056 In `R`, let DSH create its own session. The second smoke run failed with `session ... does not exist; omit --session-id to start a new Session`. Remove `--session-id` and its value from the DSH argv. Set the DSH row's locator to a store listing: before and after the turn, list the directory names in `<DSH_HOME or ~/.dsh>/sessions/<key>/`, where `<key>` is `dshProjectKey(projectDir)` imported from `.skilled/hooks/shared/session-readers/dsh.mjs`, and record as `sessionId` the one name that is in the second list and not in the first. A missing folder counts as an empty list. When there is none or more than one, the locator stays without a session id. Keep `dshHome` and `projectDir` on the locator. Also stop adding `dshHome` to the Pi locator. Verify: `node $R --print-argv dsh` holds no `--session-id` and still ends with `-`, and `node --check $R` passes.
- [ ] T057 In `S`, score a run whenever its session loads, whatever its exit code. Today `--summary` counts a run with a non-zero exit as unscored with reason `exit_<code>`, which threw away the OpenCode smoke run that worked for five minutes and was stopped by the cap. A run is unscored only when it has no usable locator or the reader fails, and the reason is then the reader's code. Add a `capped` count per runtime and arm for runs whose exit is 143 or null. In `T`, add a case where a run with exit 143 and a loadable session is scored and counted as capped, and a case where a run with exit 1 and no session id is unscored. Verify: in `$ADV`, `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed and 44 or more passed.
- [ ] T016 [P] Document both scripts, their flags and exit 2 in `$ADV/scripts/routing-accuracy/README.md`. Verify: `rg -n "score-command-transcripts|run-command-behaviour" $ADV/scripts/routing-accuracy/README.md` prints at least two lines.
- [ ] T017 In `doctorLeadPhrases` (`D`), reject a lead phrase that holds no state or health word (`check`, `state`, `status`, `report`, `health`, `off`, `on`, `which`, `show`, `list`, `inventory`, `drift`, `stale`, `missing`, `failing`, `broken`) unless its route's derived policy is `ask`. Verify: `node $D --check` prints `fresh`.
- [ ] T018 Add two cases to `$ADV/tests/command-policy-derivation.vitest.ts`: a fixture `read-only` route with lead phrase `disable the gate` fails the deriver, and the same phrase on a `mutates` route passes. Verify: in `$ADV`, `npx vitest run tests/command-policy-derivation.vitest.ts` reports 0 failed.
- [ ] T019 Run `node $D` to regenerate `G`. Verify: `git -c core.fsmonitor=false diff --stat -- $G $ADV/lib/scorer/projection.ts $ADV/scripts/skill_advisor.py` prints nothing, and in `$ADV`, `npx vitest run tests/doctor-routing-slice.vitest.ts` reports 0 failed.
- [ ] T020 Confirm the G5 cause in two copies outside the repository, so no parent `.claude/` folder is found: in a directory from `mktemp -d`, copy `.skilled/commands/create/readme.md` and `skill.md` into `a/.claude/commands/create/`, and into `b/.claude/commands/create/` with `skill.md` renamed to `new-skill.md`. In each, run Claude Code once, model `claude-sonnet-5-5`, prompt "List the names of every entry your Skill tool offers, one per line, and nothing else." (2 live runs). Save the two outputs to `$X/g5/listing-a.txt` and `$X/g5/listing-b.txt` and delete the temp directory. Verify: both files exist, and the result line in `implementation-summary.md` names which listing shows `create:readme`.
- [ ] T021 Create the started-command fixture (`$X/g2-fixture/`): `spec.md` naming one question about `src/parse.mjs`, and `src/parse.mjs` with one exported function. Verify: `ls $X/g2-fixture` lists `spec.md` and `src`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Before phase 005's first code commit, one at a time:

- [ ] T022 Smoke run: one tune start row on each measured runtime with its default model from `plan.md` section 3 (6 live runs, `$X/runs-smoke.jsonl`). Record the Pi and Devin locator source in `R`. The Codex smoke run follows the GPT rule: the Codex CLI with the operator's ChatGPT account only, never DevPass, and on an exhausted quota stop and ask the operator. Verify: `node $S --summary $X/runs-smoke.jsonl --json | jq -c 'map_values(.unscored)'` prints 0 for every runtime, and `rg -n "UNKNOWN" $R` prints nothing.
- [ ] T023 Pre-change arm, Claude Code, `claude-sonnet-5-5`, 24 prompts (`$X/runs-pre.jsonl`). Verify: `jq -s '[.[] | select(.runtime=="claude" and .arm=="pre")] | length' $X/runs-pre.jsonl` prints 24.
- [ ] T024 Pre-change arm, Codex, `gpt-6-luna` medium fast, 24 prompts (`$X/runs-pre.jsonl`). GPT rule: the Codex CLI with the operator's ChatGPT account only, never DevPass, and on an exhausted quota stop and ask the operator. Verify: the same count for `codex` prints 24.
- [ ] T025 Pre-change arm, OpenCode, `llmgateway/deepseek-v4.1-flash-1017` max, 24 prompts (`$X/runs-pre.jsonl`). Verify: the same count for `opencode` prints 24.
- [ ] T026 Pre-change arm, Pi, `deepseek-v4.1-flash-1017` on `llmgateway`, 24 prompts (`$X/runs-pre.jsonl`). Verify: the same count for `pi` prints 24.
- [ ] T027 Pre-change arm, Devin, `swe-2-max`, 24 prompts (`$X/runs-pre.jsonl`). Verify: the same count for `devin` prints 24.
- [ ] T028 Pre-change arm, DSH, default roster route, 24 prompts (`$X/runs-pre.jsonl`). Verify: the same count for `dsh` prints 24, and `git -c core.fsmonitor=false status --porcelain` lists nothing outside this phase folder.

After phase 006 lands, one at a time:

- [ ] T029 Confirm both binding phases are in the worktree (`AGENTS.md`, read only). Verify: `rg -c "COMMAND:" AGENTS.md` prints at least 1, `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json | jq -r .status` prints `OK`, and `../006-gate-2-binding-and-runtime-pointers/implementation-summary.md` names the commit that landed the bullet.
- [ ] T030 Read the Gate 2 bullet phase 006 wrote. If it already says the `COMMAND:` line is printed once per command per session and a brief naming a command already started or declined is ignored, mark T031 and T032 not needed. Verify: `rg -n "once per command" AGENTS.md` prints one line, or the task notes that it printed none.
- [ ] T031 Only if T030 found no clause: append to the Gate 2 command bullet in `AGENTS.md` the sentence "Print it once per command per session, and ignore a brief that names a command already started or declined." Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json | jq -r '.rows[] | select(.id=="A6") | .detail'` shows the last anchor at or under 16384 bytes.
- [ ] T032 Only if T031 ran: refresh the Gate 2 section entry in `.skilled/commands/doctor/assets/agents-md-manifest.json` the way phase 003 did. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --json | jq -r .status` prints `OK`.
- [ ] T033 Post-change arm, Claude Code, `claude-sonnet-5-5`, 24 prompts (`$X/runs-post.jsonl`). Verify: the post count for `claude` prints 24.
- [ ] T034 Post-change arm, Codex, `gpt-6-luna` medium fast, 24 prompts (`$X/runs-post.jsonl`). GPT rule: the Codex CLI with the operator's ChatGPT account only, never DevPass, and on an exhausted quota stop and ask the operator. Verify: the post count for `codex` prints 24.
- [ ] T035 Post-change arm, OpenCode, `llmgateway/deepseek-v4.1-flash-1017` max, 24 prompts (`$X/runs-post.jsonl`). Verify: the post count for `opencode` prints 24.
- [ ] T036 Post-change arm, Pi, `deepseek-v4.1-flash-1017` on `llmgateway`, 24 prompts (`$X/runs-post.jsonl`). Verify: the post count for `pi` prints 24.
- [ ] T037 Post-change arm, Devin, `swe-2-max`, 24 prompts (`$X/runs-post.jsonl`). Verify: the post count for `devin` prints 24.
- [ ] T038 Post-change arm, DSH, default roster route, 24 prompts (`$X/runs-post.jsonl`). Verify: the post count for `dsh` prints 24.
- [ ] T039 Started-command set, Claude Code, `claude-sonnet-5-5`, 6 prompts (`$X/runs-g2.jsonl`). Verify: `jq -s '[.[] | select(.runtime=="claude")] | length' $X/runs-g2.jsonl` prints 6.
- [ ] T040 Started-command set, Codex, `gpt-6-luna` medium fast, 6 prompts (`$X/runs-g2.jsonl`). GPT rule: the Codex CLI with the operator's ChatGPT account only, never DevPass, and on an exhausted quota stop and ask the operator. Verify: the count for `codex` prints 6.
- [ ] T041 Started-command set, OpenCode, `llmgateway/deepseek-v4.1-flash-1017` max, 6 prompts (`$X/runs-g2.jsonl`). Verify: the count for `opencode` prints 6.
- [ ] T042 Started-command set, Pi, `deepseek-v4.1-flash-1017` on `llmgateway`, 6 prompts (`$X/runs-g2.jsonl`). Verify: the count for `pi` prints 6.
- [ ] T043 Started-command set, Devin, `swe-2-max`, 6 prompts (`$X/runs-g2.jsonl`). Verify: the count for `devin` prints 6.
- [ ] T044 Started-command set, DSH, default roster route, 6 prompts (`$X/runs-g2.jsonl`). Verify: the count for `dsh` prints 6, and `git -c core.fsmonitor=false status --porcelain` lists nothing outside this phase folder.
- [ ] T045 Score all three logs (`$X/summary.json`). Verify: `node $S --summary $X/runs-pre.jsonl $X/runs-post.jsonl $X/runs-g2.jsonl --json > $X/summary.json` exits 0, the file shows a pre and a post start rate per runtime, `unsafe` 0 in every post row, `loopsWithoutInit` 0 in every g2 row and no command with more than one `COMMAND:` line.
- [ ] T046 Check the floors and the suite, then write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `M` and `P` print the T001 numbers, `node $D --check` prints `fresh`, in `$ADV` `npx tsc --noEmit` exits 0 and `npm test` reports 0 failed, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T031 and T032 marked not needed by T030
- [ ] No `[B]` blocked tasks remaining
- [ ] `$X/summary.json` shows a pre and a post start rate per measured runtime, zero unsafe starts and zero loops without init
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Review**: `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` R8, G2, G5, R10c and R10d
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

A blocked task gets `[B]` and one line naming what blocks it. An unsafe start or a loop without init in the post-change runs blocks the phase and returns decision D1 to the operator.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The four questions in `spec.md` have an operator answer. Evidence: answered 2026-11-12, each as the planned option.
- [ ] CHK-002 [P0] The before numbers are in `$X/before.txt` (T001).
- [ ] CHK-003 [P0] The pre-change commit holds no `COMMAND:` line (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] In `$ADV`, `npx tsc --noEmit` exits 0.
- [ ] CHK-011 [P0] No code comment names a spec path, a phase number or a task id: `rg -n "T0[0-9]{2}|REQ-0|specs/" $S $R $T` prints nothing.
- [ ] CHK-012 [P1] A reader failure yields exit 2 with the reader's code (T004, T015).
- [ ] CHK-013 [P1] The runner reads no holdout prompt: `rg -n "holdout" $R` shows only the refusal (T013).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every scorer fact has a test row (T015).
- [ ] CHK-021 [P0] Zero unsafe starts and zero loops without init in the post-change and started-command logs (T045).
- [ ] CHK-022 [P1] The floors are unchanged (T046).
- [ ] CHK-023 [P1] The lead-phrase check fails and passes on its fixtures (T018).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The gap is class `matrix/evidence`: no check observes model behaviour.
- [ ] CHK-FIX-002 [P0] Every runtime with a `ready` reader is measured or named as not measured with its reason.
- [ ] CHK-FIX-003 [P1] The matrix axes in `plan.md` are listed in the header of `T`.
- [ ] CHK-FIX-004 [P1] Evidence names the commit each arm ran on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential appears in an argv or a run log: `rg -n -i "api[_-]?key|token=" $X/*.jsonl` prints nothing.
- [ ] CHK-031 [P0] The summary prints no prompt or reply text beyond `COMMAND:` lines.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same runtimes and run counts.
- [ ] CHK-041 [P1] `$ADV/scripts/routing-accuracy/README.md` names both scripts and their exit 2.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Run logs, listings, the fixture and the summary live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds only the evidence files the summary cites at completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 1/11 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
