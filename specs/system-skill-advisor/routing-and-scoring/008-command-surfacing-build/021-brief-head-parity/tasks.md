---
title: "Tasks: Phase 21: brief-head-parity"
description: "Ordered worker-sized tasks that give every runtime the same brief head: the head row keeps its command under every request shape, the companion line prints its policy word and never repeats a command, and the OpenCode head is labelled from the first passing row, each with a test written first."
trigger_phrases:
  - "brief head parity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: brief-head-parity

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
| `[C]` | Coordinator task: a gate, a rebuild, a full-suite run, a probe run or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy SKA=.skilled/skills/system-skill-advisor PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/scratch PL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/scratch/planning`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records. `TSX` is `--import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs`.
- `TC` is `npm run typecheck` in `ADV`, which must exit 0. `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed. `VP` is `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs`, which must report `fail 0`.
- `FLOOR` is `node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`, five lines whose last is the sealed plain count, a number with no row id and no prompt text. `REAL` is `node $RAD/capture-command-routing-baseline.mjs --real-embedding | jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`, which needs the local embedder and is recorded as `embedder not live` with the error line when it refuses. `EVAL` is `node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`.
- `HR` is `$ADV/handlers/advisor-recommend.ts` and `HRT` is `$ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`. `RN` is `$ADV/lib/render.ts` and `DBR` is `$ADV/tests/doctor-brief-render.vitest.ts`. `PJ` is `.opencode/plugins/system-skill-advisor.js` and `PJT` is `.opencode/plugins/tests/system-skill-advisor.test.cjs`. `RM` is `$SKA/README.md` and `HK` is `$SKA/hooks/skill-advisor-hook.md`.
- `HEADS` is `node TSX $PL/probe-heads.mts`. The probe removes `AI_SESSION_CHILD` from its own environment, loads the real plugin and writes nothing.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- No task reads or prints the prompt text of a row whose `split` is `holdout`. `HRT` already reads one tune row by id, and no task adds another corpus read.
- No worker runs a build, the full suite, a daemon or a model session, and no worker writes under the home folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, an ADR or a REQ id. T012 checks it.
- Do not edit `AGENTS.md`, another phase folder, any `package.json`, any routing corpus, any committed baseline, `lib/command-attach.ts` or `lib/scorer/fusion.ts`. Add no dependency. Change no head wording: the strings `Advisor: `, `use `, `ambiguous: `, ` vs `, ` → ` and ` pass.` stay as they are.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. A doc sentence holds no em dash and no semicolon.
- A row written with `goal.cjs packet-log` is cut by that command: the item at 200 characters, the state at 40 and the evidence at 400, with `...` in place of the rest. Keep each cell inside its limit and write a second row rather than a longer one. After the command, `rg -c -e '\.\.\. \|$'` over the parent `goal.md` must print the count it printed before the command.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane H owns `HR` and `HRT` and runs T003. Lane R owns `RN` and `DBR` and runs T004 then T005. Lane P owns `PJ` and `PJT` and runs T006 then T014. Lane D owns `RM` and `HK` and starts after T004. The lanes own different files and run in parallel after T002. `[P]` marks a task that may start beside another lane's task. T005 and T014 carry no `[P]`, because each waits for the task before it in its lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 [C] Record the before numbers (`$SP/before.txt`). Run `G rev-parse --short HEAD`, `G status --porcelain -- $HR $RN $PJ $HRT $DBR $PJT $RM $HK`, `npm run build` in `ADV`, `TC`, `VALL`, `VP`, `FLOOR`, `EVAL` and `REAL`, and write each command with its last output lines or its exit code into `before.txt`. When a gate is red, stop and mark the phase `[B]` with that line. Verify: the `status` prints nothing, the build and `TC` exit 0, `VALL` reports 0 failed, `VP` reports `fail 0`, `FLOOR` prints five lines and `wc -l < $SP/before.txt` prints at least 10.
- [ ] T002 [C] Record the reproductions (`$SP/repro-before.txt`). Run `HEADS` after the build and write its output. Verify: `rg -c -F 'same head: false' $SP/repro-before.txt` prints 4, `rg -c -F 'vs sk-doc → /create:readme (start) 0.93/0.12 pass.' $SP/repro-before.txt` prints 1, which is the partner that carries a command on OpenCode alone, `rg -c -F 'opencode: Advisor: live; use sk-doc 0.95/0.12 pass.' $SP/repro-before.txt` prints 1 and `rg -c -e 'Also: /[a-z:-]+( [a-z-]+)?\s*$' $SP/repro-before.txt` prints at least 2. When phase 020 has landed first, the raw-id line and some companion lines are already gone: record the counts found and keep the T011 expectations, which hold either way.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane H: the recommend handler
- [ ] T003 [P] Keep the command on the head row under every request shape (`HR`, `HRT`). Test first: in `HRT`, in the case `lets the top hub carry a command only a lower row would offer`, replace the last assertion `expect(everyRow.find((row) => row.skillId === 'sk-doc')?.command).toBeUndefined();` with `expect(everyRow[0]?.skillId).toBe('sk-doc');`, `expect(everyRow[0]?.command).toBe(command);` and `expect(everyRow[0]?.command).toBe(topOnly[0]?.command);`, and rename the case to `lets the top hub carry its command under every request shape`. Leave the case `never offers one command through both its own row and the owning hub` as it is, because it pins a hub that is not the head. Run `VX tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` and see the renamed case fail with `everyRow[0].command` undefined. Then in `HR`'s `enrichCompiledRoutes`, replace `(topOnly && index === 0)` with `index === 0`, and replace the three comment lines that start `// A caller that asks for the top pick alone renders that head` with a comment saying every caller renders the head and at most one partner, so a command only a lower row carries would never reach the reader, and the head keeps it whichever shape the caller asked for. Verify: the first run fails as described, then `VX tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` reports 0 failed, `rg -c "topOnly && index === 0" $HR` prints nothing and `TC` exits 0. When the untouched case fails because its hub now leads, mark the task `[B]` with the row order printed.

### Lane R: the renderer
- [ ] T004 [P] Print the policy word on the companion line (`RN`, `DBR`). Test first: in `DBR`, import `commandRowFor` from `../lib/command-attach.js` when absent. In the case `keeps the complete companion before directives under the default cap`, change the expected head to `` `Advisor: live; use sk-git 0.82/0.20 pass.\nAlso: /doctor:git setup (${commandRowFor(<the bridge id that case passes>)?.policy})` ``, and in the case `uses the first doctor bridge after the top pick, past other skills`, change `'\nAlso: /doctor:update'` to `'\nAlso: /doctor:update (ask)'`. Add `it('prints the policy word of a companion and the child marker in a child session')`, which renders `advisorResult([{ skill: 'system-spec-kit', kind: 'skill', confidence: 0.95, uncertainty: 0.12 }, { skill: 'command-doctor-env', kind: 'command', confidence: 0.82, uncertainty: 0.2 }])` twice, with `{ childSession: false }` and with `{ childSession: true }`, expecting `\nAlso: /doctor:env list (run)` both times because a read-only run stays visible to a child, and renders the same head with `command-doctor-update` under `{ childSession: true }` expecting `\nAlso: /doctor:update (parent-named only)`. Run `VX tests/doctor-brief-render.vitest.ts` and see the three expectations fail on the missing policy word. Then in `RN`'s `companionCommandLabel`, build the label as the command followed by ` (<word>)`, where the word is `policyWord(row?.policy, row?.mutating, childSession)`, and return the command alone when that word is `null`. Replace the comment above the function with one saying a companion is a command the reader may act on, so it carries the same policy word the head carries, and a child still gets the downgrade marker. Verify: the first run fails as described, then `VX tests/doctor-brief-render.vitest.ts`, `VX tests/render-child-session.vitest.ts`, `VX tests/command-head-length.vitest.ts` and `VX tests/command-brief-golden.vitest.ts` report 0 failed and `TC` exits 0. When a golden brief in another file pins a companion with no policy word, update that one expectation and name the file in the task note.
- [ ] T005 Drop a companion that repeats a printed command (`RN`, `DBR`). After T004. Test first: in `DBR`, add `it('prints a command once when the head already names it')`, which renders a head row `{ skill: 'system-skilled-doctor', kind: 'skill', confidence: 0.82, uncertainty: 0.26, command: '/doctor:update', policy: 'ask', ownerSkillId: 'system-skilled-doctor' }` followed by `{ skill: 'command-doctor-update', kind: 'command', confidence: 0.82, uncertainty: 0.2 }`, widening `RecommendationInput` with the three optional fields, and expects the brief to contain `/doctor:update` exactly once and no `Also:`. Add `it('prints a second doctor bridge when the first repeats the head')`, with a third row `command-doctor-env`, expecting `\nAlso: /doctor:env list (run)`. Run `VX tests/doctor-brief-render.vitest.ts` and see the first case print `Also: /doctor:update (ask)`. Then in `RN`'s `renderAdvisorBrief`, compute the head's printed command as `top.command ?? (top.needsMode === true ? undefined : commandRowFor(top.skill)?.command)`, and make the companion pick skip a row whose `doctorCommandString(row.skill)` equals it. In the ambiguous branch, also print no companion whose command equals the partner's `vs.command ?? commandRowFor(vs.skill)?.command`. Add a comment saying a command printed twice reads as two offers. Verify: the first run fails as described, then `VX tests/doctor-brief-render.vitest.ts` and `VX tests/command-brief-golden.vitest.ts` report 0 failed and `TC` exits 0.

### Lane P: the OpenCode plugin
- [ ] T006 [P] Label the OpenCode head from the first passing row (`PJ`, `PJT`). Test first: in `PJT`, add `test('names the first passing row when the first row does not pass')`, which saves and deletes `process.env.AI_SESSION_CHILD`, builds the plugin with `makePlugin({ spawnOverride: spawnSequence([fakeChild({ stdout: cliEnvelope({ recommendations: [{ skillId: 'command-doctor-sk-skill-convert', score: 0.5, confidence: 0.8, uncertainty: 0.42, command: '/doctor:sk-skill convert', policy: 'ask', ownerSkillId: 'sk-doc' }, { skillId: 'sk-doc', score: 0.8, confidence: 0.95, uncertainty: 0.12 }] }) })]) })`, awaits `runPrompt(hooks)`, restores the variable in a `finally` and asserts that `output.system[0]` contains `use sk-doc 0.95/0.12 pass.` and does not contain `command-doctor-`. Run `VP` and see it fail with `use command-doctor-sk-skill-convert 0.95/0.12 pass.` Then in `PJ`, in the function that parses the CLI payload, replace `const top = recommendations[0] ?? null;` with `const top = recommendations.find((recommendation) => recommendation.passes_threshold) ?? recommendations[0] ?? null;` and add a comment saying the renderer leads with the first passing row, so a label taken from a row that does not pass would name one row and score another. Verify: the first run fails as described, then `VP` reports `fail 0`, `node --check $PJ` exits 0 and `rg -c "const top = recommendations\[0\] \?\? null;" $PJ` prints nothing.
- [ ] T014 Send the top-only route option from the OpenCode plugin (`PJ`, `PJT`). After T006. This task changes the function `advisorCliRequest` and nothing else. Test first: in `PJT`, add `test('asks the advisor for the route of the top pick alone, as the hooks do')`, which builds `const child = fakeChild({ stdout: cliEnvelope({ freshness: 'live', recommendations: [] }) });` and `const hooks = await makePlugin({ spawnOverride: spawnSequence([child]) });`, awaits `runPrompt(hooks)` and asserts `assert.equal(JSON.parse(child.stdinPayload).options.compiledRouteTopOnly, true);`. Run `VP` and see the new test fail because the value is `undefined`. Then in `PJ`'s `advisorCliRequest`, inside the `requestOptions` object, directly after the line `includeAbstainReasons: true,`, add the line `compiledRouteTopOnly: true,` and above it a comment saying the brief prints the head and at most one partner, and every hook asks for the route of the top pick alone, so a partner that carried a command here and none there would give two runtimes two heads for one request. Verify: the first run fails as described, then `VP` reports `fail 0`, `node --check $PJ` exits 0 and `rg -c -F 'compiledRouteTopOnly: true,' $PJ` prints 1. When another `PJT` test fails because it pins the request options, update that one expectation to hold the new key and name the test in the task note.

### Lane D: the two documents that show the line
- [ ] T007 [P] Show the companion line with its policy word in the skill README (`RM`). After T004. Replace ``the brief adds `Also: /doctor:<command> <target>` as its second line`` with ``the brief adds `Also: /doctor:<command> <target> (<policy>)` as its second line, where the policy is run, start or ask, and leaves the line out when the head already names that command``. Verify: `rg -c -F 'Also: /doctor:<command> <target> (<policy>)' $RM` prints 1.
- [ ] T008 [P] Show the companion line with its policy word in the hook reference (`HK`). After T004. In the paragraph that starts `The injected brief begins with`, find the sentence that says a doctor command appears on the top line or under a skill, and add after it: ``The line under a skill reads `Also: <command> (<policy>)`, and it is left out when the head or its partner already names that command.`` Verify: `rg -c -F 'Also: <command> (<policy>)' $HK` prints 1 and the added sentence holds no em dash and no semicolon.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T009 [C] Rebuild and run every suite (`$SP/after.txt`). Run `npm run build` in `ADV`, `TC`, `VALL`, `AI_SESSION_CHILD=1 npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts tests/render-child-session.vitest.ts` in `ADV` and `VP`, and write each command with its result lines into `after.txt`. Verify: the build and `TC` exit 0, `VALL` reports 0 failed with more passed tests than `$SP/before.txt`, the child-flag run reports 0 failed and `VP` reports `fail 0`. Then run `REAL` and write its lines beside their `before.txt` lines, or `embedder not live`. A lower real count does not block this task: when the `combined` count of the real sealed plain line is lower, write `DROP: real plain holdout <before> to <after>` and report the line to the coordinator's goal log row in T013.
- [ ] T010 [C] Hold every floor (`$SP/after.txt`). Run `FLOOR` and `EVAL` and write each beside its `before.txt` line. The typed recall, false offer and typed delivery lines and the `EVAL` line must equal their before lines. The plain tune line and the sealed plain line may each differ only by a higher `attached` or `combined` count, which is written as `GAIN: plain tune <before> to <after>` or `GAIN: plain holdout <before> to <after>` and reported to the coordinator, who recaptures the committed baseline with its own script. A sealed plain `combined` count below its before line means the change lowered reach on requests nobody tuned for, and it blocks. Verify: three `FLOOR` lines and the `EVAL` line equal their `before.txt` lines character for character, the plain tune `combined` and the sealed plain `combined` are not lower, and `rg -c -e "^RESULT: every floor holds$" $SP/after.txt` prints 1. When a line is lower, mark this task `[B]`.
- [ ] T011 [C] Rerun the head probe (`$SP/repro-after.txt`). Run `HEADS` after the build. Verify: `rg -c -F 'same head: true' $SP/repro-after.txt` prints 17, `rg -c -F 'same head: false' $SP/repro-after.txt` prints nothing, `rg -c -F 'use sk-doc → /create:manual-testing-playbook (start) 0.95/0.12 pass.' $SP/repro-after.txt` prints 2, `rg -c -F 'command-doctor-' $SP/repro-after.txt` prints nothing, `rg -c -e 'Also: /[a-z:-]+( [a-z-]+)?\s*$' $SP/repro-after.txt` prints nothing `rg -c -F 'Also: /doctor:update' $SP/repro-after.txt` prints nothing, `rg -c -F 'vs sk-doc 0.93/0.12 pass.' $SP/repro-after.txt` prints 2, `rg -c -F 'vs sk-doc → /create:readme (start)' $SP/repro-after.txt` prints nothing and `rg -c -F 'ambiguous: sk-doc → /create:manual-testing-playbook (start) 0.95/0.16 vs system-deep-loop 0.92/0.12 pass.' $SP/repro-after.txt` prints 2. The last three checks read the two ambiguous prompts: after T014 the partner row is the same on both paths.
- [ ] T012 [C] Check the boundaries (`$SP/boundaries.txt`). Write each command below with its output or exit code into `boundaries.txt`. Verify: `G diff --quiet BASE -- AGENTS.md` exits 0, `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing, `G diff BASE -U0 -- .skilled .opencode | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9]|A-[0-9]|B-[0-9])"` prints nothing and `G diff --name-only BASE -- .skilled .opencode` names only `HR`, `RN`, `PJ`, `HRT`, `DBR`, `PJT`, `RM` and `HK`, plus one golden test file when T004 named it.
- [ ] T013 [C] Write the results and close the phase (`$PH/implementation-summary.md`). Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, the files changed, the before and after head lines for the two prompts that differed, the floor lines and any `GAIN` or `DROP` line. Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 21 row of `../spec.md` to `Complete`, append one row to the parent goal log with `node .skilled/hooks/goal/bin/goal.cjs packet-log specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build "<item> | <state> | <evidence>" --workspace "$PWD"`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/after.txt` ends with `RESULT: every floor holds`
- [ ] `scratch/repro-after.txt` prints `same head: true` 17 times
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings**: `../review/fable-alignment-2026-11-14/report-code-logic.txt` and `report-purpose-alignment.txt`
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

A `[B]` task stops its lane. The coordinator records the printed line in the parent goal log and decides.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] `$SP/before.txt` holds `BASE`, 0 failed, `fail 0` and the floor lines (T001).
- [ ] CHK-002 [P0] `$SP/repro-before.txt` holds the four differing heads, or the counts found when phase 020 landed first (T002).
- [ ] CHK-003 [P1] `rg -c "FIX ADDENDUM" $PH/plan.md` prints 1 and its table names every reader of the head row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `TC` exits 0 and `node --check $PJ` exits 0.
- [ ] CHK-011 [P0] No head wording string changed: `G diff BASE -U0 -- $RN | rg -c "^[-+].*(Advisor: |; use |ambiguous: | pass\.)"` prints nothing.
- [ ] CHK-012 [P1] No added comment names a spec path or an id (T012).
- [ ] CHK-013 [P1] The policy word comes from `policyWord`, the function the head uses, not from a second copy.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` reports 0 failed and `VP` reports `fail 0` (T009).
- [ ] CHK-021 [P0] The floors hold and the sealed plain count under the fixture regime is not lower (T010).
- [ ] CHK-022 [P0] Each of T003 to T006 and T014 recorded a failing first run for the reason its line names.
- [ ] CHK-023 [P1] The child-flag run reports 0 failed, so the companion keeps its child marker (T009).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding classes: A-2 and A-3 are `cross-consumer` (one handler, two request shapes), the OpenCode label is `instance-only`, A-7 and the second half of B-9 are `class-of-bug` in the companion line.
- [ ] CHK-FIX-002 [P0] Same-class producers: `rg -n "recommendations\[0\]" .opencode/plugins/system-skill-advisor.js .skilled/skills/system-skill-advisor/hooks --glob '!**/tests/**'` is read, and every hit that labels a head takes a passing row.
- [ ] CHK-FIX-003 [P0] Consumers: `rg -n "compiledRouteTopOnly" .skilled .opencode --glob '!**/tests/**' --glob '!**/dist/**'` lists every caller of the option, and each still gets the head it got or a head with the command restored.
- [ ] CHK-FIX-004 [P1] Matrix: request shape (top only, every row) by head kind (hub with a route, command row, doctor bridge) by companion (none, distinct, repeat), covered by T003 to T005 and the probe.
- [ ] CHK-FIX-005 [P1] Hostile state: the child-flag run in T009 proves the companion under `AI_SESSION_CHILD=1`.
- [ ] CHK-FIX-006 [P1] Evidence names `BASE`: `$PH/implementation-summary.md` names the commit T001 recorded.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] `VX tests/doctor-brief-render.vitest.ts` still passes the case `every generated doctor string passes the label sanitizer and an instruction-shaped label is rejected`.
- [ ] CHK-031 [P1] The probe writes no file and starts no model session.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `RM` and `HK` both show `(<policy>)` on the companion line (T007, T008).
- [ ] CHK-041 [P1] `implementation-summary.md` quotes the two head lines before and after (T013).
- [ ] CHK-042 [P2] `rg -n "Also:" $SKA/feature-catalog/scorer-fusion/doctor-command-routing.md $SKA/runtime/scripts/command-bridges/README.md $SKA/ROUTER.md` is read once, and a sentence that shows the line's literal form without a policy word is listed in `implementation-summary.md` for the packet close.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The probe and its outputs live under `scratch/planning/`, and the run records under `scratch/`.
- [ ] CHK-051 [P1] `G status --short -- .skilled .opencode` names no file outside the ones this phase edits (T012).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
