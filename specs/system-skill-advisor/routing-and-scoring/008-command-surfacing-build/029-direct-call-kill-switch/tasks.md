---
title: "Tasks: Phase 29: direct-call-kill-switch"
description: "Ordered worker-sized tasks that record the before-state and reproduce the gap, write CLI cases that fail on the unfixed module, make the shared switch module decide through the hooks' own resolver, keep the daemon on its own environment, keep every test scope off the real flags file, correct three documents, then prove the fix, commit it, review it and close the phase."
trigger_phrases:
  - "direct call kill switch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 29: direct-call-kill-switch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[C]` | Coordinator task: a gate, a full-suite run, a capture, a probe run, a commit, the review or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy SAD=.skilled/skills/system-skill-advisor PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/029-direct-call-kill-switch SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/029-direct-call-kill-switch/scratch`, then `export KS=$PWD/$SP/planning/kill-switch.env`, the committed fixture that holds `SYSTEM_SKILL_ADVISOR_DISABLED=1`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records and `FIX` the one T014 records.
- `AD` is `$ADV/lib/advisor-disabled.ts` and `ADT` is `$ADV/tests/advisor-disabled.vitest.ts`. `HR` is `$ADV/handlers/advisor-recommend.ts` and `HRT` is `$ADV/tests/handlers/advisor-recommend.vitest.ts`. `CLT` is `$ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` and `TU` is `$ADV/tests/skill-advisor-cli-test-utils.ts`.
- `HD` is `$SAD/hooks/skill-advisor-hook.md`, `CP` is `$SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` and `ENVX` is `.skilled/hooks/hook-flags.env.example`.
- No task edits these, which tasks read or run: `CLI` is `$ADV/skill-advisor-cli.ts`, `DC` is `$ADV/tests/skill-advisor-cli-dual-client.vitest.ts`, `HF` is `.skilled/hooks/shared/hook-flags.cjs`, `LB` is `.skilled/bin/system-skill-advisor-launcher.cjs` and `FA` is `$SAD/feature-catalog/cli-surface/advisor-recommend.md`.
- `FILES` is the twelve files a task edits: `AD`, `ADT`, `HR`, `HRT`, `CLT`, `TU`, `HD`, `CP`, `ENVX`, and, added 2026-11-15 by the coordinator, `FA`, `CL` (`$SAD/changelog/v1.1.0.0.md`) and `ER` (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`), whose three tasks run only after phase 025 is Complete because its workers edit `FA` and `CL`. Phase 025's workers edit `$SAD/changelog/v1.1.0.0.md`, `$ADV/lib/README.md`, `$ADV/tests/README.md`, `FA`, `$SAD/feature-catalog/scorer-fusion/command-meaning-matching.md`, `$SAD/feature-catalog/scorer-fusion/doctor-command-routing.md`, `$ADV/scripts/command-bridges/README.md` and the folder `$PK/025-release-notes-and-doc-sync/`, and none of them is in `FILES`.
- `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed. `TC` is `npm run typecheck` in `ADV` and `BUILD` is `npm run build` in `ADV`, which must each exit 0. `BUILD` runs before every shim or probe run after an edit, because the shim runs the compiled `dist` and refuses a stale one. `DT` is `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`, `VP` is `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` and `HFT` is `node --test .skilled/hooks/shared/hook-flags.test.cjs`, which must each report `fail 0`. `EXT` is `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py -q -p no:cacheprovider -k every_example_line`, which must report `1 passed` and writes no cache folder.
- `FLOOR` is `node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.holdout'`, three lines. `EVAL` is `node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, one line. Each prints counts and no row id and no prompt text.
- `REPRO` is `zsh $SP/planning/kill-switch-matrix.sh`, fourteen lines between two lease lines, which writes nothing anywhere. `LEASE` is `jq -c '{pid, ownerPid, socketPath}' $ADV/database/.system-skill-advisor-launcher.json`. `CLOSURE <entries>` is `node $PK/028-direct-call-off-switch/scratch/planning/import-closure.mjs $ADV <entries>`.
- `TIME` is `for i in 1 2 3 4 5; do /usr/bin/time -p env HOOK_FLAGS_CONFIG=$SP/planning/no-such-flags.env node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a readme for the utils folder"}' --format json 2>&1 >/dev/null | rg '^real'; done`, five `real` lines. Its median is the third value in sorted order. It is recorded for the reviewer with no bound.
- `SHELLCHK` is `env | rg -c -e '^(SYSTEM_HOOKS_DISABLED|MK_HOOKS_DISABLED|HOOK_FLAGS_CONFIG|[A-Z_]*SKILL_ADVISOR[A-Z_]*_DISABLED)='`, which must print nothing, so the coordinator's shell exports no switch.
- `PLOG "<item> | <state> | <evidence>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<item> | <state> | <evidence>" --workspace .`.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- The disabled envelope keeps every field name and value it has today. A task adds no field and renames none. The reason stays `Skill advisor disabled by <key>.` with the key the resolver returned.
- Never create, edit, open or print `.skilled/hooks/hook-flags.env`. A flags-file case points `HOOK_FLAGS_CONFIG` at a file the test writes under `os.tmpdir()` or under its own isolated scope folder, or at `KS`. Never edit `HF`, `CLI`, `LB`, `FA`, `DC`, any other hook, adapter or plugin, any file phase 025 owns, or any file under `/private/tmp` that a task did not create.
- No task reads or prints the prompt text of a row file. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, every `git diff`, `show` or `log -p` over a path that includes a row file adds `':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl' ':(exclude)**/behaviour-fresh-prompts.jsonl'`, and `capture-scorer-eval-baseline.mjs --misses` is piped through `jq 'del(.prompt)'`.
- No worker runs the full suite, a capture, the reproduction, a daemon outside the isolated scopes the CLI suites start and clean up themselves, or a model session, and no worker writes under the home folder or under another phase folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, a decision id, an ADR or a REQ id. T013 checks it.
- Do not edit `AGENTS.md`, another phase folder, any `package.json`, any row file, any committed baseline or the compat contract. Add no dependency.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. A doc sentence holds no em dash and no semicolon. A doc task changes no line it does not name.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane C owns `CLT` and `TU` and runs T003 first, before T004, then T006 after T005. Lane M owns `AD`, `ADT`, `HR` and `HRT` and runs T004 after T003, then T005. Lane D owns `HD`, `CP` and `ENVX` and runs T007 and T008 in order after T004, and T009 after T004 at any time. Lanes C and M are serial with each other, because T003's failing run must come before T004's change and T006's `BUILD` must follow T005's edit. Lane D shares no file with them and runs beside them. `[P]` marks the first task of each lane. Every lane task is built by DeepSeek v4.1 flash max on OpenCode Go, one task per session, and checked by an Opus verifier before the next task in its lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 [C] Confirm the phase can start and record the before-state (`$SP/before.txt`, `$SP/floor-before.txt`, `$SP/eval-before.txt`). Run `rg -c '\*\*Status\*\* \| Complete' $PK/028-direct-call-off-switch/spec.md`, `G status --porcelain -- FILES`, `G rev-parse --short HEAD`, `SHELLCHK`, `test -e .skilled/hooks/hook-flags.env; echo "flags file present: $?"` (which tests the path and never opens it), `BUILD`, `TC`, `VX tests/advisor-disabled.vitest.ts`, `VX tests/handlers/advisor-recommend.vitest.ts`, `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `VX tests/skill-advisor-cli-dual-client.vitest.ts`, `VALL`, `DT`, `VP`, `HFT` and `EXT`, then `FLOOR > $SP/floor-before.txt` and `EVAL > $SP/eval-before.txt`, and write each command with its last lines or exit code into `before.txt`. The short hash is `BASE`. Run `VALL` only while no phase 025 worker session is open. When `VALL` fails, write the failing files into `before.txt` and rerun each alone once. When phase 028 is not Complete, the status prints a line or `SHELLCHK` prints a count, stop and mark the phase `[B]` with that line. Verify: the `rg` prints 1, the status and `SHELLCHK` print nothing, `BUILD` and `TC` exit 0, the four `VX` files report 0 failed, `VALL` reports 0 failed or names only files phase 025's workers own, `DT`, `VP` and `HFT` report `fail 0`, `EXT` reports `1 passed`, and `floor-before.txt` and `eval-before.txt` each hold their lines. Phase 028's `scratch/floor-after.txt` and `scratch/eval-after.txt` are the reference, and a difference is written into `before.txt` and the parent goal log with `PLOG`, not fixed.
- [ ] T002 [C] Reproduce the gap and time the warm call (`$SP/repro-before.txt`, `$SP/timing-before.txt`). After T001. Run `LEASE`, `ps -p <its pid> -o pid=` and `REPRO`, and write each command with its output into `repro-before.txt`. Run `TIME > $SP/timing-before.txt`. `REPRO` warms the daemon with an unflagged status call first, because after T001's `BUILD` a live daemon may predate the build. Verify: `ps` prints the lease pid, and the `lease before` and `lease after` lines of `repro-before.txt` are equal. `rg -c ' match=no ' $SP/repro-before.txt` prints 8, `rg -c ' match=yes ' $SP/repro-before.txt` prints 6 and `rg -c -F 'hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=on' $SP/repro-before.txt` prints 4, matching the Measured Behavior block of `spec.md`, and `timing-before.txt` holds five `real` lines. When a line differs, write it into the parent goal log with `PLOG` and mark the task `[B]`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane C: the CLI cases and the CLI test scope

- [ ] T003 [P] Write the CLI kill-switch cases on the unfixed module (`CLT`). After T002 and before T004. This task changes no code outside `CLT`, and its cases are the failing half of T004's proof. Import `writeFileSync` beside `existsSync` and `mkdirSync`, and `join` from `node:path`. In the phase 028 case `abstains under %s before it asks a warm daemon`, replace `ADVISOR_DISABLED_FLAGS.map((flag) => [flag])` with `ADVISOR_DISABLED_FLAGS.filter((flag) => !flag.startsWith('MK_')).map((flag) => [flag])`, under a comment saying the resolver copies an `MK_` value onto its new name when it loads, so the reason an `MK_` name gets depends on load order and the loop leaves those names out. Add a local `flagsFile(scope: IsolatedCliScope): string` that writes `SYSTEM_SKILL_ADVISOR_DISABLED=1` and a newline to `join(scope.rootDir, 'hook-flags.env')` and returns that path. Add `describe('skill-advisor CLI kill switch, as the hooks resolve it')` with three cases, each in its own isolated scope with the fake daemon started with `'answer'` on `scope.socketPath`. First, `it.each([['SYSTEM_SKILL_ADVISOR_DISABLED', '1'], ['SYSTEM_SKILL_ADVISOR_DISABLED', 'true'], ['SYSTEM_SKILL_ADVISOR_HOOK_DISABLED', 'yes'], ['SYSTEM_HOOKS_DISABLED', '1']])('abstains under %s=%s before it asks a warm daemon', ...)`: run `runRecommend(scope, { ...switchEnv(scope), [name]: value })` and expect exit code 0, `status` `ok`, `recommendations` `[]`, `abstainReasons` equal to a one-item array that holds `Skill advisor disabled by <name>.`, `warnings` `['ADVISOR_DISABLED']` and `daemon.calls` of length 0. Second, `it('abstains under a flags-file entry before it asks a warm daemon')`: run `runRecommend(scope, { ...switchEnv(scope), HOOK_FLAGS_CONFIG: flagsFile(scope) })` and expect exit code 0, `recommendations` `[]`, the reason `Skill advisor disabled by SYSTEM_SKILL_ADVISOR_DISABLED.` and `daemon.calls` of length 0. Third, `it('still asks a warm daemon when the environment sets the switch to 0 over the file')`: run `runRecommend(scope, { ...switchEnv(scope), HOOK_FLAGS_CONFIG: flagsFile(scope), SYSTEM_SKILL_ADVISOR_DISABLED: '0' })` and expect exit code 0, the first recommendation `sk-code` and `daemon.calls` of length 1. This control passes before the fix and after it. Verify: `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` reports 5 failed of 12, the four `it.each` cases and the flags-file case, each with one daemon call and an `sk-code` row, while the control, the phase 028 cases and the two retry cases pass, and `TC` exits 0. T004's verify reruns the file to 0 failed.

### Lane M: the shared module and the handler

- [ ] T004 [P] Decide through the hooks' resolver (`ADT`, then `AD`). After T003's failing run. Test first, in `ADT`: import `writeFileSync` beside the other `node:fs` names and `ADVISOR_DISABLED_FLAGS` beside the other module names. Give every existing `advisorDisabledBy(<env>)` call a second argument `{}` and every existing `disabledRecommendOutput(<input>, <env>)` call a third argument `{}`, so no case reads a real flags file. Replace the case `ignores %o, as the handler always has` with two. `it.each([[{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '0' }], [{ SYSTEM_SKILL_ADVISOR_DISABLED: '' }]])('ignores %o, as the hooks do', ...)` expects `null`. `it.each([[{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true' }, 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'], [{ SYSTEM_SKILL_ADVISOR_DISABLED: '1' }, 'SYSTEM_SKILL_ADVISOR_DISABLED'], [{ SYSTEM_SKILL_ADVISOR_DISABLED: 'ON' }, 'SYSTEM_SKILL_ADVISOR_DISABLED'], [{ SYSTEM_HOOKS_DISABLED: '1' }, 'SYSTEM_HOOKS_DISABLED']])('names the switch for %o, as the hooks do', ...)` expects the key. Add `it('takes its names from the hooks resolver')` expecting `ADVISOR_DISABLED_FLAGS` to equal `expect.arrayContaining(['SYSTEM_HOOKS_DISABLED', 'SYSTEM_SKILL_ADVISOR_DISABLED', 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED', 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED'])`. Add `describe('advisorDisabledBy with a flags file')`, whose cases share a folder from `mkdtempSync(join(tmpdir(), 'adv-flags-'))` holding `hook-flags.env` with `SYSTEM_SKILL_ADVISOR_DISABLED=1` and a newline, removed in an `afterAll`. It has three cases: `advisorDisabledBy({ HOOK_FLAGS_CONFIG: <file> })` with no second argument expects `SYSTEM_SKILL_ADVISOR_DISABLED`, `advisorDisabledBy({ HOOK_FLAGS_CONFIG: <file>, SYSTEM_SKILL_ADVISOR_DISABLED: '0' })` expects `null`, and `advisorDisabledBy({ HOOK_FLAGS_CONFIG: <file> }, {})` expects `null`. Run `VX tests/advisor-disabled.vitest.ts` and see the four naming cases, the resolver case and the first file case fail, because the module still matches two names against `'1'`. Then in `AD`: add `existsSync` to the `node:fs` import, `dirname` and `join` to the `node:path` import, `createRequire` from `node:module` and `fileURLToPath` from `node:url`. Declare a local interface for the resolver with `hookFlagDecision(concern, env, config)` returning `{ enabled: boolean, key: string | null }`, `loadConfigFile(path)`, `configPath()`, `concernFlag(concern)`, `MASTER_FLAG`, `MASTER_ALIASES` and `LEGACY_ALIASES`. Add `loadHookFlags()`, which starts at `dirname(fileURLToPath(import.meta.url))`, walks up one `dirname` at a time until the folder is its own parent, and at the first folder where `existsSync(join(folder, 'hooks', 'shared', 'hook-flags.cjs'))` is true returns `createRequire(import.meta.url)` of that path, and returns `null` when no folder has it or the require throws. Its comment says the walk exists because the source and the built module sit at different depths below `.skilled`, and that a missing resolver answers as if no switch were set, as every adapter does. Call it once at module level. Replace `ADVISOR_DISABLED_FLAGS` with the resolver's names for `'skill-advisor'` in its check order, `MASTER_FLAG`, then `MASTER_ALIASES`, then `concernFlag('skill-advisor')`, then `LEGACY_ALIASES['skill-advisor']`, or an empty list when the resolver is `null`, typed `readonly string[]`, under a comment saying callers strip these names to isolate a scope. Change `advisorDisabledBy` to `(env: NodeJS.ProcessEnv = process.env, config?: Readonly<Record<string, string>>): string | null`: it returns `null` when the resolver is `null`, uses `config` when given and otherwise `loadConfigFile(env.HOOK_FLAGS_CONFIG || configPath())`, always calls `hookFlagDecision('skill-advisor', env, <that config>)` with both arguments, and returns `null` when the decision is enabled and its `key` otherwise. Its comment says both arguments go in so an explicit environment never drops the file, and the file is read per call because each CLI call is its own process. Give `disabledRecommendOutput` a third parameter `config?: Readonly<Record<string, string>>` and pass `env` and `config` to `advisorDisabledBy`. Add one sentence to the module header saying the rule itself is the hooks' resolver. Change nothing else. Verify: the first run fails as described, then `VX tests/advisor-disabled.vitest.ts` and `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` report 0 failed, `VX tests/handlers/advisor-recommend.vitest.ts` reports 0 failed with its T001 count, `TC` and `BUILD` exit 0, `node --input-type=module -e "import('./$ADV/dist/runtime/lib/advisor-disabled.js').then((m) => console.log(m.advisorDisabledBy({ SYSTEM_SKILL_ADVISOR_DISABLED: '1' }, {})))"` prints `SYSTEM_SKILL_ADVISOR_DISABLED`, `rg -n "'true'|'yes'|'on'|=== '1'" $AD` prints nothing, `rg -c "\.hookFlagDecision\(" $AD` prints 1, `rg -c "handlers/|skill-advisor-brief" $AD` prints nothing and `CLOSURE skill-advisor-cli.ts lib/advisor-disabled.ts` names `zod` as the only package on both lines.
- [ ] T005 Keep the daemon off the flags file (`HRT`, then `HR` function `handleAdvisorRecommend`). After T004. Test first, in `HRT`: import `writeFileSync` beside the other `node:fs` names, `tmpdir` from `node:os` and `ADVISOR_DISABLED_FLAGS` from `../../lib/advisor-disabled.js`. In `beforeEach`, delete every name in `ADVISOR_DISABLED_FLAGS` and `HOOK_FLAGS_CONFIG` from `process.env`. In `afterEach`, replace the two lines `delete process.env.SYSTEM_SKILL_ADVISOR_HOOK_DISABLED;` and `delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;` with the same deletes. Below the case `honors the canonical SYSTEM_ disable flag on the daemon path`, add `it('honors the canonical kill switch with a truthy value in the daemon environment')`, which sets `process.env.SYSTEM_SKILL_ADVISOR_DISABLED` to `'true'` and expects `freshness` `unavailable`, `recommendations` `[]`, `warnings` `['ADVISOR_DISABLED']`, the reason `Skill advisor disabled by SYSTEM_SKILL_ADVISOR_DISABLED.` and `mockScoreAdvisorPrompt` not called. It passes once T004 is in and pins that a daemon now reads the canonical name from its own environment. Add `it('never reads the flags file in the daemon')`, which makes a folder with `mkdtempSync(join(tmpdir(), 'adv-daemon-flags-'))`, pushes it to `tempDirs`, writes `hook-flags.env` there with `SYSTEM_SKILL_ADVISOR_DISABLED=1` and a newline, sets `process.env.HOOK_FLAGS_CONFIG` to it, returns `status('live')` from `mockReadAdvisorStatus` and `scoreResult()` from `mockScoreAdvisorPrompt`, calls `handleAdvisorRecommend({ prompt: 'Implement routing' })` and expects `response.data.warnings ?? []` not to contain `ADVISOR_DISABLED` and `mockScoreAdvisorPrompt` to have been called. Run `VX tests/handlers/advisor-recommend.vitest.ts` and see only the flags-file case fail, because the handler's call reads the file through the module's defaults. Then in `HR`, replace `disabledRecommendOutput(input)` with `disabledRecommendOutput(input, process.env, {})`, under a comment saying a shared daemon decides from the environment it was started with and never from the flags file, because a caller's own `0` must beat the file and only the caller can see it. Verify: the first run fails as described, then `VX tests/handlers/advisor-recommend.vitest.ts` reports 0 failed with 2 more passed than its T001 count, the same run with `SYSTEM_SKILL_ADVISOR_DISABLED=1` set in front of it reports 0 failed, `TC` exits 0 and `rg -c -F "disabledRecommendOutput(input, process.env, {})" $HR` prints 1.
- [ ] T006 Keep the isolated CLI scope off any real flags file (`TU` function `createIsolatedCliScope`). After T005. Run `BUILD` first, because the shim refuses the `dist` built before T005's edit. Test first: from the repository root after the notation exports, run `HOOK_FLAGS_CONFIG=$KS env -u AI_SESSION_CHILD npx vitest run tests/skill-advisor-cli-dual-client.vitest.ts` in `ADV` and see `serves two concurrent CLI shim calls from one resident daemon` fail, because the scope copies the shell's `HOOK_FLAGS_CONFIG`, the shim now abstains and the case expects `sk-code`. Then in `TU`, add `HOOK_FLAGS_CONFIG: join(rootDir, 'no-such-hook-flags.env'),` to the scope's `env` object after `...process.env`, under a comment saying a flags file named in the shell or present in the checkout would make every isolated call abstain, so the scope names one that does not exist. Verify: the first run fails as described, then the same command, `VX tests/skill-advisor-cli-dual-client.vitest.ts` and `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` report 0 failed, and `TC` exits 0.

### Lane D: three documents

- [ ] T007 [P] State that the direct call uses the adapters' resolution (`HD` section 6). After T004. In the table, replace the row text `Canonical kill-switch. Every adapter checks \`isHookEnabled('skill-advisor')\` and returns empty/skipped prompt-safe output. |` with `Canonical kill-switch. Every adapter checks \`isHookEnabled('skill-advisor')\` and returns empty/skipped prompt-safe output, and the \`advisor_recommend\` direct call abstains. |`. Replace the whole paragraph that starts `The direct call decides in the caller's own process.` with this paragraph: `The direct call decides in the caller's own process, by the same resolution the adapters use. \`node .skilled/bin/skill-advisor.cjs advisor_recommend\` asks \`hookFlagDecision('skill-advisor')\` in \`.skilled/hooks/shared/hook-flags.cjs\`, with the caller's environment over \`.skilled/hooks/hook-flags.env\`, before it connects to a daemon or runs the local scorer. Whenever the adapters are off, under any name in this table, any truthy value or a line in the flags file, it prints the empty envelope with \`ADVISOR_DISABLED\` and names the switch that decided. A daemon reads the same names from its own environment and never reads the flags file, and the launcher passes no switch name and no \`HOOK_FLAGS_CONFIG\` to a daemon it starts, so a flagged command that happens to start the daemon does not leave it abstaining for every later caller. The standalone Python CLI keeps its own rule: only \`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED\`, set to exactly \`1\`.` Verify: `rg -c "by the same resolution the adapters use" $HD` prints 1, `rg -c "and the \`advisor_recommend\` direct call abstains. \|" $HD` prints 1, `rg -c "act on the adapters only|reads the two \`_HOOK_DISABLED\` names" $HD` prints nothing and `G diff --stat -- $HD` shows one file changed.
- [ ] T008 Check the canonical name in the disable-flag playbook step (`CP`). After T007. In section 3, step 1's lead line, replace `so the flagged call must abstain although the daemon would answer, and the unflagged call after it must still recommend:` with `so each flagged call must abstain although the daemon would answer, the legacy name set to \`1\` and the canonical name set to \`true\`, and the unflagged call after them must still recommend:`. In its bash block, below the line that starts `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .skilled/bin/skill-advisor.cjs advisor_recommend`, add `SYSTEM_SKILL_ADVISOR_DISABLED=true node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000`, and in the line after it replace `env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED node` with `env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_HOOKS_DISABLED node`. Under Expected Signals, replace the line that starts `- Step 1's flagged call returns` with `- Step 1's two flagged calls each return \`recommendations: []\`, \`freshness: "unavailable"\` and \`ADVISOR_DISABLED\`, although the warm daemon would have answered, and the second names \`SYSTEM_SKILL_ADVISOR_DISABLED\` in its abstain reason.`. Under Evidence, replace the line that starts `- Record whether the flagged native response` with `- Record whether each flagged native response has empty recommendations, freshness unavailable and ADVISOR_DISABLED, which switch each abstain reason names, and whether the unflagged call that follows still recommends.`. In section 4, below the `lib/advisor-disabled.ts` line, add `` - `.skilled/hooks/shared/hook-flags.cjs` ``. Verify: `rg -c "SYSTEM_SKILL_ADVISOR_DISABLED=true node" $CP` prints 1, `rg -c "each flagged call must abstain" $CP` prints 1, `rg -c "the second names" $CP` prints 1, `rg -c "hooks/shared/hook-flags.cjs" $CP` prints 1 and `G diff --stat -- $CP` shows one file changed.
- [ ] T009 [P] Say the switch also turns off the direct call (`ENVX` line 47). After T004. Replace `# SYSTEM_SKILL_ADVISOR_DISABLED=1         # skill-advisor brief on your prompts` with `# SYSTEM_SKILL_ADVISOR_DISABLED=1         # skill-advisor brief on your prompts and the Gate 2 advisor_recommend direct call`, keeping the column of the comment. Verify: `rg -c "the Gate 2 advisor_recommend direct call" $ENVX` prints 1, `EXT` reports `1 passed`, `HFT` reports `fail 0` and `G diff --numstat -- $ENVX | cut -f1,2` prints `1	1`.
- [ ] T017 [P] Name every switch the direct call now honours (`FA`). After T004 and after phase 025 is Complete. Added 2026-11-15 by the coordinator. In the sentence near line 23 that says `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` or `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` makes the direct call abstain, state instead that the client abstains whenever the skill-advisor hooks are off by the same rule the adapters use, the canonical `SYSTEM_SKILL_ADVISOR_DISABLED`, its aliases, the master switch, a truthy value or the flags file, and that the daemon reads only its own environment. Verify: `rg -c -F 'SYSTEM_SKILL_ADVISOR_DISABLED' $FA` prints at least 1 and the sk-doc `validate_document.py` and `validate_catalog_package.py --package system-skill-advisor` both exit 0.
- [ ] T018 [P] Widen the changelog item (`CL`). After T004 and after phase 025 is Complete. Added 2026-11-15 by the coordinator. Rewrite the Hook Health item `The Direct Call Reads the Switch` so it says the direct call abstains whenever the skill-advisor hooks are off, under `SYSTEM_SKILL_ADVISOR_DISABLED`, its aliases, the master switch or the flags file, decided in the caller's own process, and that the launcher passes no switch name to a daemon it starts. Keep two to four sentences. Verify: `rg -c -F 'SYSTEM_SKILL_ADVISOR_DISABLED' $CL` prints at least 1 and `check_changelog_shape.py` prints `SUMMARY files=1 pass=1 fail=0`.
- [ ] T019 [P] Say the kill switch reaches the direct call (`ER` line 75). After T004. Added 2026-11-15 by the coordinator. In the row for `SYSTEM_SKILL_ADVISOR_DISABLED`, extend `Disables skill-advisor injection.` to say it also makes the `advisor_recommend` direct call abstain. Verify: `rg -n 'SYSTEM_SKILL_ADVISOR_DISABLED' $ER` shows the row naming the direct call, and the row is still one table line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T010 [C] Run every gate (`$SP/after.txt`). After every lane, and only while no phase 025 worker session is open. Run `SHELLCHK`, `BUILD`, `VX tests/advisor-disabled.vitest.ts`, `VX tests/handlers/advisor-recommend.vitest.ts`, `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `VX tests/skill-advisor-cli-dual-client.vitest.ts`, `TC`, `VALL`, `DT`, `VP`, `HFT` and `EXT`, and write each command with its result lines into `after.txt`. When `VALL` fails on a timing or load case, rerun that file alone twice and then `VALL` once, and record all three. A `VALL` failure in a file phase 025 owns counts against this phase unless it also failed in `before.txt` and `rg -l "advisor-disabled|skill-advisor-cli|advisor-recommend|hook-flags" <that file>` prints nothing. Verify: `SHELLCHK` prints nothing, every run reports 0 failed, `fail 0`, `1 passed` or exit 0 under that rule, and `VALL` reports more passed tests than its line in `before.txt`.
- [ ] T011 [C] Prove the floors did not move (`$SP/floor-after.txt`, `$SP/eval-after.txt`). After T010. Run `FLOOR > $SP/floor-after.txt` and `EVAL > $SP/eval-after.txt`. Verify: `cmp` of each after file with its before file prints nothing and exits 0. When a line differs, write the moved counts into the parent goal log with `PLOG` and mark the task `[B]`.
- [ ] T012 [C] Rerun the reproduction, the closure probe, the timing and the playbook step (`$SP/repro-after.txt`, `$SP/closure-after.txt`, `$SP/timing-after.txt`, `$SP/playbook-after.txt`). After T011, on the `dist` T010 built. Run `LEASE` and `REPRO` into `repro-after.txt`. Run `CLOSURE skill-advisor-cli.ts lib/advisor-disabled.ts handlers/advisor-recommend.ts > $SP/closure-after.txt`, then `rg -n "require\(" $HF .skilled/hooks/shared/env-aliases.cjs >> $SP/closure-after.txt`. Run `TIME > $SP/timing-after.txt`, and the four commands of `CP` step 1 into `playbook-after.txt`. Verify: `rg -c ' match=yes ' $SP/repro-after.txt` prints 14 and `rg -c ' match=no ' $SP/repro-after.txt` prints nothing. `rg -c -F 'SYSTEM_SKILL_ADVISOR_DISABLED=1         hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=off:SYSTEM_SKILL_ADVISOR_DISABLED' $SP/repro-after.txt` prints 1, the hard check that the built module finds the resolver. `diff <(rg ' hook=on ' $SP/repro-before.txt) <(rg ' hook=on ' $SP/repro-after.txt)` prints nothing. The `lease before` and `lease after` lines of `repro-after.txt` are equal. The `skill-advisor-cli.ts` line of `closure-after.txt` names `zod` as its only package, and its `require` lines name only `node:fs`, `node:path` and `./env-aliases.cjs`. `timing-after.txt` holds five `real` lines. In `playbook-after.txt` both flagged calls hold `ADVISOR_DISABLED`, the second holds `disabled by SYSTEM_SKILL_ADVISOR_DISABLED`, and the unflagged call holds at least one `skillId`.
- [ ] T013 [C] Check the boundaries (`$SP/boundaries.txt`). After T012. Write each command below with its output or exit code into `boundaries.txt`. Verify: `G diff --quiet BASE -- AGENTS.md` exits 0. `test "$(G rev-parse BASE:$RAD/command-prompts.jsonl)" = "$(G hash-object $RAD/command-prompts.jsonl)"` and the same for `$RAD/holdout-prompts.jsonl` and `$RAD/behaviour-fresh-prompts.jsonl` exit 0, so no row file is diffed. `G diff --quiet BASE -- $RAD/command-routing-baseline.json $RAD/scorer-eval-baseline.json` exits 0. `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing. `G diff --quiet BASE -- $CLI $LB .skilled/hooks/shared $ADV/schemas/compat-contract.json $ADV/lib/compat $ADV/scripts/skill_advisor.py` exits 0, so the client, the launcher, the resolver and the compat contract are unchanged. `rg -c -e "'(SYSTEM_HOOKS_DISABLED|MK_HOOKS_DISABLED|HOOK_FLAGS_CONFIG|[A-Z_]*SKILL_ADVISOR[A-Z_]*_DISABLED)'" $LB` prints nothing. `G diff BASE -U0 -- $AD $ADT $HR $HRT $CLT $TU | rg -e '^\+\s*(//|#|\*|/\*)' | rg -c -e 'specs/|[0-9]{3}-[a-z]|\b(T|P|Q|A)[0-9]{3}\b|\bD[0-9]\b|\b(REQ|AC|CHK|ADR|SC|NFR)-[0-9]+|\bphase [0-9]+'` prints nothing. `G diff BASE -U0 -- $HD $CP $ENVX | rg '^\+' | rg -c '\x{2014}'` prints nothing. `test -e .skilled/hooks/hook-flags.env; echo $?` prints what T001 recorded, and no command opened the file. `test -e $SP/planning/no-such-flags.env; echo $?` prints 1. `G status --porcelain --untracked-files=all -- .skilled .opencode` names only `FILES` and the paths phase 025's workers own.
- [ ] T014 [C] Commit the fix (`FILES` and this phase folder). After T013. Stage by path with `G add -- FILES $PH`, never with `-a` or a folder above `$PH`, and commit with a conventional message. The parent `spec.md`, `../decision-record.md`, `../goal.md` and every file phase 025 owns are not part of this commit. Record the short hash as `FIX`. Verify: `G status --porcelain -- FILES $PH` prints nothing, `G log -1 --format=%h` prints `FIX` and `G show --stat --format= FIX` lists only paths in `FILES` or under `$PH`.
- [ ] T015 [C] Review the fix diff (`$SP/review/brief.txt`, `$SP/review/report.txt`). After T014. Write `brief.txt` naming the diff `G diff BASE FIX -- FILES`, the REQ tables and the Mechanism per Path table of `spec.md`, decisions D1 and D2 of `plan.md` and assumptions A4 to A6 of `spec.md`, and asking whether the client abstains exactly when `hookFlagDecision('skill-advisor')` says disabled in the same environment, whether any path can drop the flags file, whether the built module finds the resolver, whether the daemon can read the file, whether any unflagged path changes, whether an added comment names an id, and whether the three documents state the shipped behaviour. One Opus reviewer reads it read-only and writes `report.txt` with a verdict line and each item at P0, P1 or P2. Reproduce each P0 and P1 by running its cited input. A reproduced one becomes a new task with the next free id in the lane that owns the file, test first and checked by an Opus verifier, then a new fix commit whose diff the reviewer reads again. A P1 that does not reproduce is recorded with the command that showed it, and each P2 is recorded on this line with its fix or its reason. Verify: `report.txt` exists and holds a verdict line, and every P0 and P1 it names is named by a task line or recorded here as not reproduced.
- [ ] T016 [C] Write the results and close the phase (`$PH/implementation-summary.md`, the parent goal log through `PLOG` only). After T015. Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, `FIX` and any later fix commit, the nine files, the reproduction lines before and after, the floors, the suite counts, the two timing medians, the review verdict, the residual of decision D2 and every `[B]` task. Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 29 row of `../spec.md` to `Complete`, write `PLOG "Phase 029 direct-call kill switch | Complete | <FIX>: the direct call abstains whenever the hooks are off, 14 of 14 matrix lines match"`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED`, and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/repro-after.txt` prints `match=yes` on all fourteen lines, with the canonical line abstaining through the built shim
- [ ] `scratch/review/report.txt` holds a verdict with no open P0 or P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, decisions D1 and D2
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The phase this extends**: `../028-direct-call-off-switch/`, assumption A4 of its `spec.md`
- **Decision**: P054 in `../decision-record.md`
- **Planning probe**: `scratch/planning/kill-switch-matrix.sh` with its fixture `scratch/planning/kill-switch.env`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task stops its lane. The coordinator records the printed line in the parent goal log and decides. No test is loosened to pass, and no unflagged answer may change to make a flagged one abstain.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phase 028 reads `Complete` and `FILES` are clean in `git status` (T001).
- [ ] CHK-002 [P0] The floors, the eval line and the suite lines are recorded before the first edit (T001).
- [ ] CHK-003 [P1] `$SP/repro-before.txt` matches the Measured Behavior block and the lease pid is running (T002).
- [ ] CHK-004 [P1] `SHELLCHK` prints nothing at T001 and T010, and no task opened `.skilled/hooks/hook-flags.env` (T001, T013).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `BUILD` and `TC` exit 0 (T010).
- [ ] CHK-011 [P0] `AD` calls `.hookFlagDecision(` once, holds no truthy literal and no name list of its own, and `CLI` shows no diff (T004, T013).
- [ ] CHK-012 [P1] No added comment names a spec path or an id, and no added doc line holds an em dash (T013).
- [ ] CHK-013 [P1] The resolver walk, the fail-open, the per-call file read, the handler's empty config, the CLT loop filter and the TU scope path each carry one reason comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` reports 0 failed under the T010 rule, `DT`, `VP` and `HFT` report `fail 0` and `EXT` reports `1 passed` (T010).
- [ ] CHK-021 [P0] The floor and eval after files equal their before files (T011).
- [ ] CHK-022 [P0] T003, T004, T005 and T006 each recorded a failing first run for the reason their lines name.
- [ ] CHK-023 [P0] The reproduction prints `match=yes` on fourteen of fourteen lines, and the canonical line abstains through the built shim (T012).
- [ ] CHK-024 [P1] The client's closure names `zod` only, the resolver requires only Node built-ins and its alias bridge, and both timing files hold five warm call times (T002, T012).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding class: the ignored switch is `cross-consumer`, one rule read by the prompt hooks and by the direct call in different processes, with the environment and the flags file as two sources. The daemon's empty file config is `env-precedence`, and the test scope changes are `test-isolation`. The three documents are `instance-only`.
- [ ] CHK-FIX-002 [P0] Same-class producers: `rg -n "HOOK_DISABLED|_DISABLED'|=== '1'" $ADV --glob '*.ts' --glob '!**/dist/**' --glob '!tests/**'` lists the module and the compat probe at `BASE`, and only the compat probe after the fix.
- [ ] CHK-FIX-003 [P0] Consumers: `rg -n "ADVISOR_DISABLED_FLAGS|advisorDisabledBy|disabledRecommendOutput" $ADV --glob '*.ts' --glob '!**/dist/**'` is read at close, and every caller still receives the fields it reads (T010).
- [ ] CHK-FIX-004 [P0] Adversarial table tests: the explicit environment with no config (the first file case of `ADT`), the source against the built module (the import check of T004 and the canonical line of T012), the `MK_` alias (the matrix line and the CLT loop filter), the environment's `0` over the file's `1` (`ADT`, `CLT` and the matrix), the empty and `0` values (`ADT`) and the flags file named in the daemon's environment (`HRT`) each hold a row.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count: the name by the value by the source by the argument form by the order, fourteen lines in the reproduction, and the name and value rows of `ADT` and `CLT`.
- [ ] CHK-FIX-006 [P1] Hostile global state: `HRT` strips every name before each case and passes with `SYSTEM_SKILL_ADVISOR_DISABLED=1` exported, `TU` names a missing flags file and T006 passes with `HOOK_FLAGS_CONFIG` exported.
- [ ] CHK-FIX-007 [P1] Evidence names `BASE`, `FIX` and the files each number came from (T016).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] `rg -l -F '"prompt"' $SP --glob '!planning/**'` prints nothing, and no task read a row file except through `jq 'del(.prompt)'`.
- [ ] CHK-031 [P0] The disabled envelope carries no prompt text and no flags-file content beyond the switch name: the module and client cases assert its fields.
- [ ] CHK-032 [P1] No task created, edited, opened or printed `.skilled/hooks/hook-flags.env` (T013).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `HD`, `CP` and `ENVX` carry the sentences T007 to T009 name, and the lines `plan.md` lists as unchanged or handed on still read as they did.
- [ ] CHK-041 [P1] `implementation-summary.md` and `scratch/repro-after.txt` quote the same matrix lines (T016).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Every before, after and review file lives under `scratch/`, and `scratch/planning/no-such-flags.env` does not exist after a reproduction run.
- [ ] CHK-051 [P1] The fix commit lists only `FILES` and this phase folder (T014).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
