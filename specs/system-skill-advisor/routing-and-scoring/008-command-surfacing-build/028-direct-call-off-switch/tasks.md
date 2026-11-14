---
title: "Tasks: Phase 28: direct-call-off-switch"
description: "Ordered worker-sized tasks that record the before-state and reproduce the bug, move the advisor switch list and the disabled envelope into one shared module, make the handler and the CLI client both decide through it with the client deciding before any daemon or local scorer, strip every switch name from the CLI test scope, correct three documents, then prove the fix, commit it, review it and close the phase."
trigger_phrases:
  - "direct call off switch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 28: direct-call-off-switch

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

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy SAD=.skilled/skills/system-skill-advisor PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/028-direct-call-off-switch SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/028-direct-call-off-switch/scratch`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records and `FIX` the one T014 records.
- `AD` is `$ADV/lib/advisor-disabled.ts` and `ADT` is `$ADV/tests/advisor-disabled.vitest.ts`, both new. `HR` is `$ADV/handlers/advisor-recommend.ts` and `HRT` is `$ADV/tests/handlers/advisor-recommend.vitest.ts`. `CLI` is `$ADV/skill-advisor-cli.ts` and `CLT` is `$ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`. `TU` is `$ADV/tests/skill-advisor-cli-test-utils.ts` and `DC` is `$ADV/tests/skill-advisor-cli-dual-client.vitest.ts`, which no task edits.
- `HD` is `$SAD/hooks/skill-advisor-hook.md`, `CP` is `$SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` and `FA` is `$SAD/feature-catalog/cli-surface/advisor-recommend.md`.
- `LB` is `.skilled/bin/system-skill-advisor-launcher.cjs` (in commands written `$LB`, set `LB=.skilled/bin/system-skill-advisor-launcher.cjs`) and `LBT` is `$ADV/tests/launcher-bootstrap.vitest.ts`.
- `FILES` is the eleven files above that a task edits: `AD`, `ADT`, `HR`, `CLI`, `CLT`, `TU`, `HD`, `CP`, `FA`, `LB` and `LBT`. Phase 026's lanes edit the files its own notation names `$R $A $S $CBG $CTS $RA $FP`, and none of them is in `FILES`.
- `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed. `TC` is `npm run typecheck` in `ADV` and `BUILD` is `npm run build` in `ADV`, which must each exit 0. `BUILD` runs before every probe after an edit, because the shim runs the compiled `dist` and refuses a stale one. `DT` is `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` and `VP` is `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs`, which must each report `fail 0`.
- `FLOOR` is `node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.holdout'`, three lines. `EVAL` is `node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, one line. Each prints counts and no row id and no prompt text.
- `REPRO` is `zsh $SP/planning/direct-call-matrix.sh`, nine lines, which writes nothing inside the repository. `LEASE` is `jq -c '{pid, ownerPid, socketPath}' $ADV/database/.system-skill-advisor-launcher.json`. `CLOSURE <entries>` is `node $SP/planning/import-closure.mjs $ADV <entries>`.
- `TIME` is `for i in 1 2 3 4 5; do /usr/bin/time -p env -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a readme for the utils folder"}' --format json 2>&1 >/dev/null | rg '^real'; done`, five `real` lines. Its median is the third value in sorted order. It is recorded for the reviewer with no bound, because samples taken while phase 026's workers run cannot hold a tight one.
- `PLOG "<item> | <state> | <evidence>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<item> | <state> | <evidence>" --workspace .`.

Rules for every task:
- Each task is one change to the files it names: one function, or one helper and its one call. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- The disabled envelope keeps every field name and value the handler returns today. A task adds no field and renames none.
- No task reads or prints the prompt text of a row whose `split` is `holdout`. `command-prompts.jsonl` and `holdout-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, every `git diff`, `show` or `log -p` over a path that includes a row file adds `':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl'`, and `capture-scorer-eval-baseline.mjs --misses` is piped through `jq 'del(.prompt)'`.
- No worker runs the full suite, a capture, the reproduction, a daemon outside the isolated scopes the CLI suites start and clean up themselves, or a model session, and no worker writes under the home folder or under another phase folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, a decision id, an ADR or a REQ id. T013 checks it.
- Do not edit `AGENTS.md`, another phase folder, any `package.json`, any row file, any committed baseline, the launcher, a hook, a plugin or any file of phase 026. Add no dependency.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. A doc sentence holds no em dash and no semicolon. A doc task changes no line it does not name.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane M owns `AD`, `ADT` and `HR` and runs T003 then T004. Lane C owns `CLI`, `CLT` and `TU` and runs T005 after T003, then T006. Lane D owns `HD`, `CP` and `FA` and runs T007 to T009 in order after T005. Lane L owns `LB` and `LBT` and runs T017 after T003. The four lanes share no file. `[P]` marks the first task of each lane. Every lane task is built by DeepSeek v4.1 flash max on OpenCode Go, one task per session, and checked by an Opus verifier before the next task in its lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 [C] Confirm the phase can start and record the before-state (`$SP/before.txt`, `$SP/floor-before.txt`, `$SP/eval-before.txt`). Run `rg -c '\*\*Status\*\* \| Complete' $PK/027-review-pass-four-remediation/spec.md`, `G status --porcelain -- FILES`, `G rev-parse --short HEAD`, `BUILD`, `TC`, `VX tests/handlers/advisor-recommend.vitest.ts`, `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `VX tests/skill-advisor-cli-dual-client.vitest.ts`, `VALL`, `DT` and `VP`, then `FLOOR > $SP/floor-before.txt` and `EVAL > $SP/eval-before.txt`, and write each command with its last lines or exit code into `before.txt`. The short hash is `BASE`. Run `VALL` only while no phase 026 worker session is open, so the tree holds no half-written 026 edit. When `VALL` fails, write the failing files into `before.txt` and rerun each alone once. When phase 027 is not Complete or the status prints a line, stop and mark the phase `[B]` with that line. Verify: the `rg` prints 1, the status prints nothing, `BUILD` and `TC` exit 0, the three `VX` files report 0 failed, `VALL` reports 0 failed or names only files phase 026's lanes own, `DT` and `VP` report `fail 0`, `floor-before.txt` reads `{"correct":24,"total":44}`, `{"count":0,"total":35}` and `{"own":1,"attached":0,"combined":1,"total":44}`, and `eval-before.txt` reads `[160,51,21,5]`. Evidence: before.txt: 027 Complete 1, status of FILES empty, BASE 8bac97d71c, BUILD and TC exit 0, VX handler 22 of 22, stale-daemon-retry 2 of 2, dual-client 1 of 1, launcher-bootstrap 20 of 20, VALL 2106 passed 0 failed, DT 1221 of 1221, VP 45 of 45. floor-before 24/44, 0/35, 1/44. eval-before [160,51,21,5]
- [x] T002 [C] Reproduce the bug and time the warm call (`$SP/repro-before.txt`, `$SP/timing-before.txt`). After T001. Run `LEASE`, `ps -p <its pid> -o pid=` and `REPRO`, and write each command with its output into `repro-before.txt`. Run `TIME > $SP/timing-before.txt`. `REPRO` warms the daemon with an unflagged status call first, because after T001's `BUILD` the live daemon predates the build and a flagged first call would recycle it under the switch. Verify: `ps` prints the lease pid, so the warm lines test a warm daemon, and the `lease before` and `lease after` lines of `repro-before.txt` are equal. `rg -c 'disabledCount=none' $SP/repro-before.txt` prints 9, `rg -c -F '"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start"' $SP/repro-before.txt` prints 5 and `rg -c -F '"source":"local-scorer"' $SP/repro-before.txt` prints 4, matching the Measured Behavior block of `spec.md`, and `timing-before.txt` holds five `real` lines. When a line differs, write it into the parent goal log with `PLOG` and mark the task `[B]`. Evidence: repro-before.txt: lease pid 59115 alive, lease before equals after, disabledCount=none 9, live readme start 5, local-scorer 4, matching the Measured Behavior block. timing-before.txt holds five real lines, median 0.15
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane M: the shared module and the handler

- [x] T003 [P] Create the shared switch module (`ADT`, then `AD`, new). After T002. Test first: create `ADT` with the header comment `// MODULE: Advisor Disabled Switch Tests` in the style of the other test files, importing `advisorDisabledBy` and `disabledRecommendOutput` from `../lib/advisor-disabled.js` and `resolvedUncertaintyThreshold` from `../lib/compat/contract.js`. Add `describe('advisorDisabledBy')` with `it('returns null when no switch is set')` expecting `advisorDisabledBy({})` to be `null`, `it.each([['SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'], ['SPECKIT_SKILL_ADVISOR_HOOK_DISABLED']])('names %s when it is set to 1', ...)` expecting the name, `it('names the canonical switch when both are set')` expecting `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, and `it.each([[{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true' }], [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '0' }], [{ SYSTEM_SKILL_ADVISOR_DISABLED: '1' }], [{ SYSTEM_HOOKS_DISABLED: '1' }]])('ignores %o, as the handler always has', ...)` expecting `null`. Add `describe('disabledRecommendOutput')` with `it('returns null when no switch is set')` expecting `disabledRecommendOutput({ prompt: 'x' }, {})` to be `null`, and `it('builds the empty envelope that names the switch')`, which makes a temp folder with `mkdtempSync(join(tmpdir(), 'adv-off-'))`, calls `disabledRecommendOutput({ prompt: 'x', workspaceRoot: <temp folder>, options: { confidenceThreshold: 0.7 } }, { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1' })` and expects it `toMatchObject({ workspaceRoot: realpathSync.native(<temp folder>), recommendations: [], freshness: 'unavailable', warnings: ['ADVISOR_DISABLED'], abstainReasons: ['Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.'], effectiveThresholds: { confidenceThreshold: 0.7, uncertaintyThreshold: resolvedUncertaintyThreshold(), confidenceOnly: false }, trustState: { state: 'unavailable', reason: 'ADVISOR_DISABLED' } })`, removing the folder in a `finally`. Run `VX tests/advisor-disabled.vitest.ts` and see it fail because `../lib/advisor-disabled.js` cannot be resolved. Then create `AD` with the header comment `// MODULE: Advisor Disabled Switch` and a comment saying the switch belongs to whoever makes the request: the handler reads it in the daemon, the CLI client reads it in the caller's own process before it connects, both build the same envelope here, and the client cannot import the handler because the handler loads the native database module and the scorer. Import `realpathSync` from `node:fs`, `resolve` from `node:path`, `AdvisorRecommendOutputSchema` and the type `AdvisorRecommendOutput` from `../schemas/advisor-tool-schemas.js`, `resolvedConfidenceThreshold` and `resolvedUncertaintyThreshold` from `./compat/contract.js` and `findAdvisorWorkspaceRoot` from `./utils/workspace-root.js`, and nothing else. Export `ADVISOR_DISABLED_FLAGS`, copied with its comment from `HR:163-167`. Export `advisorDisabledBy(env: NodeJS.ProcessEnv = process.env): string | null`, which returns `ADVISOR_DISABLED_FLAGS.find((flag) => env[flag] === '1') ?? null`. Export `requestWorkspaceRoot(workspaceRoot?: string): string`, which returns the body of `canonicalizeWorkspaceRoot` (`HR:79-86`, with its comment) for a non-empty argument and `findAdvisorWorkspaceRoot(process.cwd(), { maxDepth: 12 })` otherwise, as `HR:71-73` does. Copy `unavailableTrustState` (`HR:96-104`) unexported and export `emptyOutput` (`HR:138-161`), both unchanged. Export `disabledRecommendOutput(input: { readonly workspaceRoot?: unknown; readonly options?: unknown }, env: NodeJS.ProcessEnv = process.env): AdvisorRecommendOutput | null`, which returns `null` when `advisorDisabledBy(env)` is `null`, and otherwise returns the body of `disabledOutput` (`HR:169-181`) with `workspaceRoot` from `requestWorkspaceRoot` of a string `input.workspaceRoot`, and `effectiveThresholds` holding `confidenceThreshold` and `uncertaintyThreshold` from `input.options` when each is a number, else `resolvedConfidenceThreshold()` and `resolvedUncertaintyThreshold()`, and `confidenceOnly: false`. Leave `HR` unchanged in this task. Verify: the first run fails as described, then `VX tests/advisor-disabled.vitest.ts` reports 0 failed, `TC` exits 0, `rg -c "handlers/|skill-advisor-brief" $AD` prints nothing and `CLOSURE lib/advisor-disabled.ts` prints no `better-sqlite3`. Evidence: Opus verifier PASS: first run failed on the missing module, then 10 of 10. typecheck 0, closure lists only zod, default thresholds equal the handler's
- [x] T004 Make the handler decide through the shared module (`HR`). After T003. This task adds no test, because the handler's output does not change: the two disabled cases of `HRT`, `honors the disabled flag as a fail-open empty recommendation` and `honors the canonical SYSTEM_ disable flag on the daemon path`, are the guard. Run `VX tests/handlers/advisor-recommend.vitest.ts` first and record its passed count. In `HR`, import `disabledRecommendOutput`, `emptyOutput` and `requestWorkspaceRoot` from `../lib/advisor-disabled.js`. Delete `findWorkspaceRoot`, `canonicalizeWorkspaceRoot`, `unavailableTrustState`, `emptyOutput`, `ADVISOR_DISABLED_FLAGS` with its comment and `disabledOutput`. In `computeRecommendationOutput`, replace the expression `input.workspaceRoot ? canonicalizeWorkspaceRoot(input.workspaceRoot) : findWorkspaceRoot()` with `requestWorkspaceRoot(input.workspaceRoot)`. In `handleAdvisorRecommend`, delete the `workspaceRoot`, `effectiveThresholds` and `disabledBy` constants and write `const data = disabledRecommendOutput(input) ?? await computeRecommendationOutput(input);`. Remove each import `TC` then reports as unused, and nothing else. Verify: the first and the last run of `VX tests/handlers/advisor-recommend.vitest.ts` report the same passed count and 0 failed, `TC` exits 0, `rg -n "ADVISOR_DISABLED_FLAGS = \[" $ADV --glob '!**/dist/**'` prints one line, in `lib/advisor-disabled.ts`, `rg -c "function (emptyOutput|disabledOutput|unavailableTrustState|findWorkspaceRoot|canonicalizeWorkspaceRoot)\(" $HR` prints nothing and `rg -c -F "disabledRecommendOutput(input)" $HR` prints 1. Evidence: Opus verifier PASS: handler tests 22 of 22 before and after, ADVISOR_DISABLED_FLAGS defined only in lib/advisor-disabled.ts, disabledRecommendOutput(input) once, typecheck 0

### Lane C: the CLI client and its test scope

- [x] T005 [P] Abstain in the CLI client before any socket, launcher or local scorer (`CLT`, then `CLI` function `invokeAdvisorRecommendPayload`). After T003. Test first, in `CLT`: add `'answer'` to `FakeDaemonBehavior` and make the fake daemon's `errorMessage` `null` for it, keeping the two existing branches. Give `runRecommend` a second parameter `env: NodeJS.ProcessEnv = scope.env` and use it in place of `scope.env` in `Object.assign(process.env, scope.env)`. Import `existsSync` beside `mkdirSync`, `readSkillAdvisorLauncherPid` from `./skill-advisor-cli-test-utils.js` and `ADVISOR_DISABLED_FLAGS` from `../lib/advisor-disabled.js`, and add `abstainReasons`, `warnings` and `freshness` to the `data` of `CliPayload`. Add a local `switchEnv(scope: IsolatedCliScope, flag?: string): NodeJS.ProcessEnv` that copies `scope.env`, deletes every name in `ADVISOR_DISABLED_FLAGS` and sets `flag` to `'1'` when given. Add `describe('skill-advisor CLI disable switch')` with three cases. First, `it.each(ADVISOR_DISABLED_FLAGS.map((flag) => [flag]))('abstains under %s before it asks a warm daemon', ...)`: start the fake daemon with `'answer'` on `scope.socketPath`, run `runRecommend(scope, switchEnv(scope, flag))`, and expect exit code 0, `status` `ok`, `recommendations` `[]`, `abstainReasons` equal to a one-item array that holds `Skill advisor disabled by <flag>.`, `warnings` `['ADVISOR_DISABLED']`, `freshness` `unavailable` and `daemon.calls` of length 0. Second, `it('still asks a warm daemon when no switch is set')`: the same daemon and `runRecommend(scope, switchEnv(scope))`, expecting exit code 0, the first recommendation `sk-code` and `daemon.calls` of length 1. This control passes before the change and after it. Third, `it('abstains with no daemon and starts no launcher', ..., 30_000)`: no fake daemon, `runRecommend(scope, switchEnv(scope, 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'))`, expecting exit code 0, `recommendations` `[]`, the `SYSTEM_` abstain reason, `readSkillAdvisorLauncherPid(scope.skillAdvisorDbDir)` `null` and `existsSync(scope.socketPath)` `false`. Run `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` and see the two flagged cases fail with one daemon call and an `sk-code` row, and the no-daemon case fail on a recommendation row from the local scorer or a launcher lease, while the control and the two existing cases pass. That pre-fix run of the no-daemon case starts a real launcher in the isolated scope, and the file's `cleanup`, through `cleanupSkillAdvisorScope`, ends it. Then in `CLI`, import `disabledRecommendOutput` from `./lib/advisor-disabled.js`, and make the first statements of `invokeAdvisorRecommendPayload`, before its `try`, `const disabled = disabledRecommendOutput(args);` and `if (disabled) return { payload: { status: 'ok', data: disabled }, isError: false };`, under a comment saying the switch belongs to the caller, a daemon reads its own environment and the local scorer reads none, so the client answers before it touches either. Verify: the first run fails as described, then `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` reports 0 failed, `TC` and `BUILD` exit 0, `rg -c -F "disabledRecommendOutput(args)" $CLI` prints 1, `rg -c "from '\./handlers" $CLI` prints nothing and `CLOSURE skill-advisor-cli.ts` prints no `better-sqlite3`. Evidence: Opus verifier PASS: first run 3 failed of 6 (the flagged cases got a row, the no-daemon case a local scorer row), then 6 of 6. typecheck 0, disabledRecommendOutput(args) once, closure lists only zod, the flagged shim returns the ADVISOR_DISABLED envelope with exit 0
- [x] T006 Strip every switch name from the isolated CLI test scope (`TU` function `createIsolatedCliScope`). After T005, whose `BUILD` this run needs. Test first: run `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 env -u AI_SESSION_CHILD npx vitest run tests/skill-advisor-cli-dual-client.vitest.ts` in `ADV` and see `serves two concurrent CLI shim calls from one resident daemon` fail, because the scope copies the shell's `SYSTEM_` name, the shim now abstains and the case expects `sk-code`. Then in `TU`, import `ADVISOR_DISABLED_FLAGS` from `../lib/advisor-disabled.js` and replace `delete env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;` with `for (const flag of ADVISOR_DISABLED_FLAGS) delete env[flag];` under a comment saying a switch exported in the shell would make every isolated call abstain. Verify: the first run fails as described, then the same command and `VX tests/skill-advisor-cli-dual-client.vitest.ts` both report 0 failed, and `TC` exits 0. Evidence: Opus verifier PASS: under the shell's switch the dual-client case failed first (the shim abstained), then 1 of 1 flagged and plain, stale-daemon-retry 6 of 6, typecheck 0

### Lane D: three documents

- [x] T007 [P] State where the direct call decides (`HD` section 6). After T005. In the table, replace the row text `Alias. Disables the native adapters. |` of `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` with `Alias. Disables the native adapters and makes the \`advisor_recommend\` direct call abstain. |`, and in the `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` row replace `Legacy alias for the native adapters.` with `Legacy alias for the native adapters and the \`advisor_recommend\` direct call.`. After the table's last row, the `SYSTEM_HOOKS_DISABLED=1` row, add one blank line and this paragraph: `The direct call decides in the caller's own process. \`node .skilled/bin/skill-advisor.cjs advisor_recommend\` reads the two \`_HOOK_DISABLED\` names, each set to exactly \`1\`, before it connects to a daemon or runs the local scorer, and prints the empty envelope with \`ADVISOR_DISABLED\`, so a daemon started without the switch never answers a caller who set it. The other names in this table and the values \`true\`, \`yes\` and \`on\` act on the adapters only, and the direct call still answers under them.` Verify: `rg -c "makes the \`advisor_recommend\` direct call abstain" $HD` prints 1, `rg -c "The direct call decides in the caller's own process" $HD` prints 1, `rg -c "Alias. Disables the native adapters. \|" $HD` prints nothing and `G diff --stat -- $HD` shows one file changed. Evidence: Opus verifier PASS, doc-only: both rows and the paragraph verbatim, rg checks print 1, 1 and nothing
- [x] T008 Run the disable-flag playbook step against the warm daemon (`CP`). After T007. In section 2, replace the bullet that starts `- Never stop the live daemon. Step 1's teardown sends no signal.` with `- Never stop the live daemon. Step 1 reads the warm workspace daemon and sends it no signal.`. In section 3, replace step 1, from the line that starts `1. Native CLI (isolate both the socket and the DB` through the closing fence of its bash block, with the line `1. Native CLI against the warm workspace daemon, which runs without the switch. The client reads the switch in its own process before it connects, so the flagged call must abstain although the daemon would answer, and the unflagged call after it must still recommend:`, a blank line and a bash block holding these three commands: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --no-warm-only > /dev/null`, then `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000`, then `env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1}' --format json --timeout-ms 30000`. Under Expected Signals, replace the line that starts `- Native \`advisor_recommend\` returns` with `- Step 1's flagged call returns \`recommendations: []\`, \`freshness: "unavailable"\` and \`ADVISOR_DISABLED\`, although the warm daemon would have answered.`, and the line that starts `- Step 1 then prints \`sandbox advisor exited` with `- Step 1's unflagged call that follows returns at least one recommendation, so the switch did not reach the daemon.`. Under Failure Triage, delete the three rows that start `| Sandbox advisor outlives the wait |`, `` | `lsof` cannot run | `` and `| Step 1 ran in pieces |`. Under Evidence, replace the line that starts `- Record whether the native response has empty recommendations` with `- Record whether the flagged native response has empty recommendations, freshness unavailable and ADVISOR_DISABLED, and whether the unflagged call that follows still recommends.`. In section 4, below the `handlers/advisor-recommend.ts` line, add `` - `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` `` and `` - `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` ``. Verify: `rg -c "against the warm workspace daemon" $CP` prints 1, `rg -c "SANDBOX|cp003|lsof" $CP` prints nothing, `rg -c "unflagged call" $CP` prints 3 and `rg -c "lib/advisor-disabled.ts" $CP` prints 1. Evidence: Opus verifier PASS, doc-only: step 1 holds the three warm-daemon commands, rg checks print 1, nothing, 3 and 1, and the old cold-daemon step that said the daemon inherits the flag is gone
- [x] T009 Name the client's early check on the catalog page (`FA` sections 2 and 3). After T008. In section 2, after the sentence that ends `even when no recommendations are returned.`, add: `The disabled envelope is built by \`lib/advisor-disabled.ts\`, which the handler and the CLI client both call. The client calls it first, in the caller's own process, so \`SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1\` or \`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1\` makes the direct call abstain before it reaches a daemon started without the switch and before the local scorer runs.` In the Implementation table, below the `handlers/advisor-recommend.ts` row, add the row `` | `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` | Shared | The disable switch list, its lookup and the disabled envelope the handler and the CLI client both return. | ``. In the Validation And Tests table, below the `tests/handlers/advisor-recommend.vitest.ts` row, add `` | `.skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts` | Automated test | The switch names, the exact-`1` value rule and the envelope fields. | `` and `` | `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Automated test | The client abstains under the switch with no call to a warm daemon and no launcher, and still asks the daemon without it. | ``. Verify: `rg -c "lib/advisor-disabled.ts" $FA` prints 2, `rg -c "makes the direct call abstain before it reaches a daemon" $FA` prints 1 and `rg -c "tests/advisor-disabled.vitest.ts" $FA` prints 1. Evidence: Opus verifier PASS, doc-only: two sentences and three rows verbatim, rg checks print 2, 1 and 1
- [x] T017 [P] Keep the per-request switch out of the daemon's environment (`LBT`, then `LB` constant `CHILD_ENV_ALLOWLIST`). After T003. Added by the coordinator for residual A6: the launcher forwards `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` to any daemon it starts, so one command run under the switch, such as `advisor_status`, can start a shared daemon that abstains for every later caller in the checkout, hooks and Gate 2 calls included. Once the client decides per request, the daemon has no reason to see the switch. Remove both names from `CHILD_ENV_ALLOWLIST`, and put a comment where they stood saying the switch is read by each caller and never by the shared daemon, so a flagged call cannot silence everyone else's. Change nothing else in `LB`. Test first: in `LBT`, add the case `keeps the per-request advisor switch out of the daemon env` in the shape of the case `filters parent environment before spawning npm or the advisor server`, with a source env of `PATH: '/bin'`, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '1'` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1'`, expecting `createChildEnv` to return `PATH`, `MEMORY_DB_PATH`, `SPECKIT_IPC_SOCKET_DIR` and `HF_EMBED_SERVER_URL` only. Run `VX tests/launcher-bootstrap.vitest.ts` and see the case fail because both names pass through, then make the change and see the file pass. Verify: `VX tests/launcher-bootstrap.vitest.ts` reports 0 failed with 1 more test than before, `node --check $LB` exits 0, and `rg -c -e "'(SYSTEM|SPECKIT)_SKILL_ADVISOR_HOOK_DISABLED'" $LB` prints nothing. Evidence: Opus verifier PASS: first run 1 failed of 21 (both switch names passed through), then 21 of 21. node --check 0, the switch-name rg finds nothing in the launcher
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 [C] Run every gate (`$SP/after.txt`). After every lane, and only while no phase 026 worker session is open. Run `BUILD`, `VX tests/advisor-disabled.vitest.ts`, `VX tests/handlers/advisor-recommend.vitest.ts`, `VX tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `VX tests/skill-advisor-cli-dual-client.vitest.ts`, `TC`, `VALL`, `DT` and `VP`, and write each command with its result lines into `after.txt`. When `VALL` fails on a timing or load case, rerun that file alone twice and then `VALL` once, and record all three. A `VALL` failure in a file phase 026's lanes own counts against this phase unless it also failed in `before.txt` and `rg -l "advisor-disabled|skill-advisor-cli|advisor-recommend" <that file>` prints nothing. Verify: every run reports 0 failed, `fail 0` or exit 0 under that rule, and `VALL` reports more passed tests than its line in `before.txt`. Evidence: after.txt: BUILD, TC exit 0; VX advisor-disabled 10/10, advisor-recommend 22/22, stale-daemon-retry 6/6, dual-client 1/1, launcher-bootstrap 21/21; VALL 2121 passed, 6 skipped (before 2106); DT and VP fail 0
- [x] T011 [C] Prove the floors did not move (`$SP/floor-after.txt`, `$SP/eval-after.txt`). After T010. Run `FLOOR > $SP/floor-after.txt` and `EVAL > $SP/eval-after.txt`. Verify: `cmp` of each after file with its before file prints nothing and exits 0. When a line differs, write the moved counts into the parent goal log with `PLOG` and mark the task `[B]`. Evidence: floor-after.txt and eval-after.txt cmp exit 0 against before: 24/44, 0/35, combined 1/44, eval [160,51,21,5]
- [x] T012 [C] Rerun the reproduction, the closure probe, the timing and the playbook step (`$SP/repro-after.txt`, `$SP/closure-after.txt`, `$SP/timing-after.txt`, `$SP/playbook-after.txt`). After T011, on the `dist` T010 built. Run `LEASE` and `REPRO` into `repro-after.txt`, `CLOSURE skill-advisor-cli.ts lib/advisor-disabled.ts handlers/advisor-recommend.ts > $SP/closure-after.txt`, `TIME > $SP/timing-after.txt`, and the three commands of `CP` step 1 into `playbook-after.txt`. Verify: `rg -c ' off disabledCount=1 ' $SP/repro-after.txt` prints 5 and `rg -c -F '"abstain":["Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED."],"recs":[]' $SP/repro-after.txt` prints 5, `diff <(rg ' on disabledCount' $SP/repro-before.txt) <(rg ' on disabledCount' $SP/repro-after.txt)` prints nothing, the `skill-advisor-cli.ts` line of `closure-after.txt` names no `better-sqlite3`, the `lease before` and `lease after` lines of `repro-after.txt` are equal, `timing-after.txt` holds five `real` lines, and in `playbook-after.txt` the flagged call holds `ADVISOR_DISABLED` and the unflagged call holds at least one `skillId`. Evidence: repro-after.txt: 5 off disabledCount=1, 5 abstain lines with recs [], on-lines diff empty, lease before = lease after (pid 12311); closure-after: CLI line names zod only, no better-sqlite3; timing-after 5 real lines (median 0.22s, before 0.15s); playbook-after: flagged call ADVISOR_DISABLED, unflagged call skillId sk-git
- [x] T013 [C] Check the boundaries (`$SP/boundaries.txt`). After T012. Write each command below with its output or exit code into `boundaries.txt`. Verify: `G diff --quiet BASE -- AGENTS.md` exits 0. `test "$(G rev-parse BASE:$RAD/command-prompts.jsonl)" = "$(G hash-object $RAD/command-prompts.jsonl)"` and the same for `$RAD/holdout-prompts.jsonl` exit 0, so neither row file is diffed. `G diff --quiet BASE -- $RAD/command-routing-baseline.json` exits 0. `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing. `G diff BASE -U0 -- $HR $CLI $CLT $TU | rg -e '^\+\s*(//|#|\*|/\*)' | rg -c -e 'specs/|[0-9]{3}-[a-z]|\b(T|P|Q|A)[0-9]{3}\b|\b(REQ|AC|CHK|ADR|SC|NFR)-[0-9]+|\bphase [0-9]+'` and the same `rg -e` pair over `rg -n -e '^\s*(//|\*|/\*)' $AD $ADT` print nothing. `G diff BASE -U0 -- $HD $CP $FA | rg -c '^\+.*\x{2014}'` prints nothing. `G status --porcelain --untracked-files=all -- .skilled .opencode` names only `FILES` and the paths phase 026's notation names. Evidence: boundaries.txt: AGENTS.md, both row-file hashes and baseline unchanged (exit 0); package diff empty; comment-id and em-dash rg print nothing (exit 1); status names only FILES plus the phase 026 harness paths
- [x] T014 [C] Commit the fix (`FILES` and this phase folder). After T013. Stage by path with `G add -- FILES $PH`, never with `-a` or a folder above `$PH`, and commit with a conventional message. The parent `spec.md`, `../decision-record.md` and the phase 026 documents this plan changed are not part of this commit. Record the short hash as `FIX`. Verify: `G status --porcelain -- FILES $PH` prints nothing, `G log -1 --format=%h` prints `FIX` and `G show --stat --format= FIX` lists only paths in `FILES` or under `$PH`. Evidence: FIX 88d8bebcd7: status of FILES and PH clean after commit; show --stat lists only the eleven FILES and paths under PH
- [x] T015 [C] Review the fix diff (`$SP/review/brief.txt`, `$SP/review/report.txt`). After T014. Write `brief.txt` naming the diff `G diff BASE FIX -- FILES`, the REQ tables, the Mechanism per Path table and assumptions A3 to A6 of `spec.md`, and asking whether the client decides before any socket probe, spawn or scorer run, whether the client and the handler can return different envelopes, whether any unflagged path changes, whether an added comment names an id, and whether the three documents state the shipped behaviour. One Opus reviewer reads it read-only and writes `report.txt` with a verdict line and each item at P0, P1 or P2. Reproduce each P0 and P1 by running its cited input. A reproduced one becomes a new task with the next free id in the lane that owns the file, test first and checked by an Opus verifier, then a new fix commit whose diff the reviewer reads again. A P1 that does not reproduce is recorded with the command that showed it, and each P2 is recorded on this line with its fix or its reason. Verify: `report.txt` exists and holds a verdict line, and every P0 and P1 it names is named by a task line or recorded here as not reproduced. Evidence: report.txt VERDICT: SHIP, 0 P0, 0 P1, 4 P2. P2-1 (client loads zod and the schema module on every call, warm median 0.15s to 0.22s): kept, NFR-R01 allows exactly this closure and NFR-P02 sets no bound; a lazy import would add a second load path for no measured need. P2-2 (flagged thresholds read from the caller's env, which the launcher does not forward): kept, metadata only on an envelope with no recommendations. P2-3 (flagged input the daemon schema refuses gets an ok abstain): kept as the switch's meaning; the spec edge-case example now names the topK case and says the CLI cannot send workspaceRoot. P2-4 (no doc states the launcher change): fixed, the hook doc now says the launcher does not pass the two _HOOK_DISABLED names to a daemon it starts
- [ ] T016 [C] Write the results and close the phase (`$PH/implementation-summary.md`, the parent goal log through `PLOG` only). After T015. Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, `FIX` and any later fix commit, the nine files, the reproduction lines before and after, the floors, the suite counts, the two timing medians, the review verdict, the residual of assumption A6 and every `[B]` task. Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 28 row of `../spec.md` to `Complete`, write `PLOG "Phase 028 direct-call off switch | Complete | <FIX>: the direct call abstains on 5 of 5 off lines, warm and fresh, both orders. Phase 026 T032 may rerun"`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED`, and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/repro-after.txt` prints `disabledCount=1` on all five `off` lines and the before rows on all four `on` lines
- [ ] `scratch/review/report.txt` holds a verdict with no open P0 or P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The blocked probe**: `../026-untuned-behaviour-arm/tasks.md` T032 and `../026-untuned-behaviour-arm/scratch/switch-probe.txt`
- **Decision**: P053 in `../decision-record.md`
- **Planning probes**: `scratch/planning/direct-call-matrix.sh` and `scratch/planning/import-closure.mjs`
- **The phase that runs next**: `../026-untuned-behaviour-arm/`, whose T032 reruns after this phase closes
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

- [ ] CHK-001 [P0] Phase 027 reads `Complete` and `FILES` are clean in `git status` (T001).
- [ ] CHK-002 [P0] The floors, the eval line and the suite lines are recorded before the first edit (T001).
- [ ] CHK-003 [P1] `$SP/repro-before.txt` matches the Measured Behavior block and the lease pid is running (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `BUILD` and `TC` exit 0 (T010).
- [ ] CHK-011 [P0] `ADVISOR_DISABLED_FLAGS` is defined once and both callers use `disabledRecommendOutput` (T004, T005).
- [ ] CHK-012 [P1] No added comment names a spec path or an id, and no added doc line holds an em dash (T013).
- [ ] CHK-013 [P1] `AD`, the early call in `CLI` and the strip in `TU` each carry one reason comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` reports 0 failed under the T010 rule, and `DT` and `VP` report `fail 0` (T010).
- [ ] CHK-021 [P0] The floor and eval after files equal their before files (T011).
- [ ] CHK-022 [P0] T003, T005 and T006 each recorded a failing first run for the reason their lines name.
- [ ] CHK-023 [P0] The reproduction prints the abstain reason on five of five `off` lines and the before rows on four of four `on` lines (T012).
- [ ] CHK-024 [P1] The client's closure names no native package, and both timing files hold five warm call times (T002, T012).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding class: the ignored switch is `cross-consumer`, one decision read by two callers in two processes, the handler and the client, with the warm and the fallback paths as two routes to the same miss. The test scope strip is `test-isolation`, and the three documents are `instance-only`.
- [ ] CHK-FIX-002 [P0] Same-class producers: `rg -n "HOOK_DISABLED" $ADV --glob '*.ts' --glob '!**/dist/**' --glob '!tests/**'` lists the handler's list and the compat probe at BASE, and the shared module and the compat probe after the fix.
- [ ] CHK-FIX-003 [P0] Consumers: `rg -n "ADVISOR_DISABLED_FLAGS|advisorDisabledBy|disabledRecommendOutput|requestWorkspaceRoot|emptyOutput\(|disabledOutput\(" $ADV --glob '*.ts' --glob '!**/dist/**'` is read at close, and every caller still receives the fields it reads (T010).
- [ ] CHK-FIX-004 [P0] Adversarial table tests: the delimiter (each switch name alone and both together), the joined input (a flagged call followed by an unflagged one in the reproduction), the outside root (a temp `workspaceRoot` behind a symlinked temp folder), the no-op (`true`, `0`, `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_HOOKS_DISABLED`) and the fallback (no daemon at all) each hold a row (T003, T005, T012).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count: the switch (none, `SYSTEM_`, `SPECKIT_`, both, four no-op values) by the backend (warm fake daemon, no daemon) in the tests, and the switch (off, on) by the socket folder (default, fresh) by the call order (flagged first, plain first) plus the stdin form in the reproduction, nine lines.
- [ ] CHK-FIX-006 [P1] Hostile global state: the new client cases build their environment with `switchEnv`, which deletes every switch name, and T006 runs a suite with the `SYSTEM_` name exported in the shell.
- [ ] CHK-FIX-007 [P1] Evidence names `BASE`, `FIX` and the files each number came from (T016).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] `rg -l -F '"prompt"' $SP --glob '!planning/**'` prints nothing, and no task read a row file except through `jq 'del(.prompt)'`.
- [ ] CHK-031 [P0] The disabled envelope carries no prompt text: the module case and the client cases assert its fields, none of which holds the prompt.
- [ ] CHK-032 [P1] The edge-case behaviour for a `workspaceRoot` under the switch is stated in `spec.md` and the reviewer saw it (T015).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `HD`, `CP` and `FA` carry the sentences T007 to T009 name, and the lines the plan lists as unchanged still read as they did.
- [ ] CHK-041 [P1] `implementation-summary.md` and `scratch/repro-after.txt` quote the same `off` and `on` lines (T016).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Every before, after and review file lives under `scratch/`, and no `/tmp/s028.*` folder is left after a reproduction run.
- [ ] CHK-051 [P1] The fix commit lists only `FILES` and this phase folder (T014).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 12 | 0/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
