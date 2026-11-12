---
title: "Tasks: Phase 3: plain-chat-command-reach"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "plain chat command reach tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: plain-chat-command-reach

<!-- SPECKIT_LEVEL: 3+ -->

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

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `G` is `$ADV/scripts/command-bridges/command-bridges.generated.json`. `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `B` is `$ADV/scripts/routing-accuracy/command-routing-baseline.json`. `P` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`. `S` is this packet's `scratch/` folder. `A` is `$ADV/lib/command-attach.ts`.

The umbrella-id tasks carry out the operator's decision of 2026-11-12 (plan.md ADR-005). `R` is `.skilled/commands/doctor/_routes.yaml`. `PR` is `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`. Rebuild with `npm run build` in `$ADV` before every measurement.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Rebuild and confirm the phase 1 baseline reproduces (`$B`). Verify: in `$ADV`, `npm run build` exits 0, then `diff <(node $C | jq -c .metrics) <(jq -c .metrics $B)` prints nothing.
- [ ] T002 Confirm the four pinned numbers (`$ADV/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `$P` prints `[158,50,20,5]`.
- [ ] T003 Save the baseline's routing parts for later comparison (`$S/baseline-before.json`). Verify: `jq -c '{rows,metrics,commands,unreachable}' $B > $S/baseline-before.json` exits 0 and `jq '.rows | length' $S/baseline-before.json` prints 175.
- [ ] T004 Confirm the deriver and the skill root metadata gate are green (`$G`). Verify: `node $D --check | jq -r .status` prints `fresh` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1` reports `failed=0`.
- [ ] T005 Write a timing script that runs the Claude hook entry `node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` once per tune prompt with the prompt on stdin, and record the before run (`$S/hook-latency.mjs`). Verify: `node $S/hook-latency.mjs > $S/hook-latency-before.json` exits 0 and `jq -c '[.n,.medianMs,.p95Ms]' $S/hook-latency-before.json` prints 44 as the first value and two numbers.
- [ ] T045 Record the doctor starting state and the 17 doctor tune outcomes (`$S/doctor-before.json`). Verify: `$PR --json | jq -c '{status,bridges,missed}'` prints `{"status":"ok","bridges":35,"missed":0}`, in `$ADV` `npx vitest run tests/doctor-routing-slice.vitest.ts` reports 0 failed, and `jq -c '[.rows | to_entries[] | select(.key | test("^cmd-doctor-.*-plain-tune-")) | {(.value.expected_command): .value.top}] | add' $B > $S/doctor-before.json` exits 0 with `jq 'length' $S/doctor-before.json` printing 17.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**W1 Harness**

- [ ] T006 Create the module with the exported pure `attachCommand(skillId, compiledRoute, prompt)` and an empty generated `MODE_COMMANDS` block between begin and end markers (`$A`). Verify: in `$ADV`, `npm run build` exits 0 and `node --input-type=module -e "const m=await import(process.cwd()+'/dist/runtime/lib/command-attach.js');console.log(m.attachCommand('sk-doc',{action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-readme'}]},'x'))"` prints `undefined`.
- [ ] T007 Extend the harness: for each row whose top recommendation is a compiled hub, ask `.skilled/bin/compiled-route.cjs --hub <id> --prompt-stdin` for the route, call `attachCommand` and write a new top-level `attachedMetrics` key with own-row, attached and combined plain reach per split, the ceiling 44, false offers that count an attached command and the typed rows that are ambiguous with their own owner (`$C`). Verify: `node $C | jq -c '.attachedMetrics | keys'` lists those keys, and attached reach reads 0 on both splits.
- [ ] T008 Prove the extension neutral before any scorer change (`$C`). Verify: `diff <(node $C | jq -c '{rows,metrics,commands,unreachable}') $S/baseline-before.json` prints nothing.

**W2 Attach**

- [ ] T009 Generate `MODE_COMMANDS` from the `mode-registry.json` of `sk-doc`, `sk-design` and `system-deep-loop` into the block in `$A` (`$D`). Verify: `node $D` exits 0, `node $D --check | jq -r .status` prints `fresh`, and `rg -o "'/(create|design|deep):[a-z-]+'" $A | sort -u | wc -l` prints 19.
- [ ] T010 Make `--check` hold the new block to the registries (`$D`). Verify: after a hand edit inside the block, `node $D --check | jq -r .status` prints `stale`, and after `node $D` it prints `fresh`.
- [ ] T011 Implement the attach rule: `action` `route`, `selectionKind` `single`, one target, mode found in `MODE_COMMANDS` (`$A`). Verify: after `npm run build`, the T006 one-liner prints `/create:readme`, and with `selectionKind:'multi'` or `action:'ask'` it prints `undefined`.
- [ ] T012 Add the decision D3 depth gate for `system-deep-loop`, with a short word list authored against the 3 tune `/deep` rows (`$A`). Verify: the T006 one-liner for `system-deep-loop` with `workflowMode:'research'` prints `undefined` for `what is caching` and `/deep:research` for `research caching strategies in depth over several iterations`.
- [ ] T013 [P] Add an optional `command` string to the recommendation schema (`$ADV/schemas/advisor-tool-schemas.ts`). Verify: `rg -n 'command: z.string' $ADV/schemas/advisor-tool-schemas.ts` prints one line.
- [ ] T014 Call `attachCommand` in `enrichCompiledRoutes` and pass `command` through `publicRecommendation` (`$ADV/handlers/advisor-recommend.ts`). Verify: after `npm run build`, `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the utils folder"}' --format json | jq -c '[.. | objects | select(.skillId=="sk-doc") | .command] | first'` prints `"/create:readme"`, or the route it got is listed in `implementation-summary.md`.
- [ ] T015 [P] Make the hook ask for the compiled route of the top passing hub only, choosing between an option on the recommend call and a hook-side call, and record the choice (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`). Verify: `rg -n 'includeCompiledRoute: false' .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` prints nothing, and the choice is named in `implementation-summary.md`.
- [ ] T016 Keep a string `command` in `recommendationFromCli` (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`). Verify: `rg -n "typeof value.command === 'string'" .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` prints one line.
- [ ] T017 Add the test: the attach rule rows, the D3 gate, the schema with and without `command` and the hook carry-through with a stubbed CLI result (`$ADV/tests/command-attach.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/command-attach.vitest.ts` reports 0 failed.
- [ ] T018 Measure after W2 (`$S/after-w2.json`). Verify: after `npm run build`, `$P` prints values no worse than `[158,50,20,5]`, and `node $C | jq -c .attachedMetrics > $S/after-w2.json` exits 0.

**W3 Phrases**

- [ ] T019 [P] Author intent phrases for the 7 `/speckit` commands in `userIntent.ownedSignals`, written as words users type and checked against `split: tune` rows only (`.skilled/skills/system-spec-kit/command-metadata.json`). Verify: `jq '[.[] | (.userIntent.ownedSignals | length) > 1] | all' .skilled/skills/system-spec-kit/command-metadata.json` prints `true`.
- [ ] T020 [P] Author intent phrases for `/prompt:improve` the same way (`.skilled/skills/sk-prompt/command-metadata.json`). Verify: `jq '.[0].userIntent.ownedSignals | length > 1' .skilled/skills/sk-prompt/command-metadata.json` prints `true`.
- [ ] T021 Project one active scored row per non-hub command into both generated scorer blocks (`$D`). Verify: after `node $D`, `jq '[.entries[] | select(.command | test("^/(speckit|prompt):")) | select(.runtime.typescript.enabled and .runtime.python.enabled)] | length' $G` prints 8.
- [ ] T022 Retire the umbrella ids from activation and move the boosts at `:92-99` and the penalty at `:351-354` to the per-command ids (`$ADV/lib/scorer/lanes/explicit.ts`). Verify: `jq '[.entries[] | select(.id == "command-spec-kit" or .id == "memory:save" or .id == "command-memory-save") | select(.runtime.typescript.enabled or .runtime.python.enabled)] | length' $G` prints 0, and `rg -c "'command-spec-kit'|'memory:save'|'command-memory-save'" $ADV/lib/scorer/lanes/explicit.ts` prints nothing.
- [ ] T023 Measure with the gold labels still unchanged (`$S/before-relabel.json`). Verify: after `npm run build`, `$P > $S/before-relabel.json` exits 0, and its four values are recorded in `implementation-summary.md`.
- [ ] T024 Relabel the gold lines that name an umbrella id and list each with file, id, old and new value (`$ADV/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`). Verify: for each file `jq -r '.skill_top_1' <file> | grep -cE '^(command-spec-kit|memory:save|command-memory-save)$'` prints 0, and `wc -l < $S/relabels.tsv` prints 17.
- [ ] T025 Replace the umbrella ids in the three test files that name them (`$ADV/tests/scorer/native-scorer.vitest.ts`, `$ADV/tests/python/test_skill_advisor.py`, `$ADV/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: `rg -c "command-spec-kit\b|\"memory:save\"|'memory:save'|command-memory-save" <the three files>` prints nothing, and in `$ADV` `npx vitest run tests/scorer/native-scorer.vitest.ts` reports 0 failed.
- [ ] T026 Measure after the relabel (`$S/after-relabel.json`). Verify: after `npm run build`, `$P > $S/after-relabel.json` exits 0, and `implementation-summary.md` shows the T023 and T026 values side by side.

**W4 One activation source**

- [ ] T027 Enable a non-doctor metadata command by construction in `runtimeCompatibility`, with a default `order` and default Python slash markers (`$D`). Verify: a fixture case in `tests/command-attach.vitest.ts` with a metadata command and no compatibility row reports the command active, and `node $D --check | jq -r .status` prints `fresh`.
- [ ] T028 Remove the hand-written activation rows that the metadata now decides for the 8 non-hub commands, and the umbrella rows under option A (`$ADV/scripts/command-bridges/scoring-compatibility.json`). Verify: `jq -r '.typescript[], .python[] | .inventoryId' $ADV/scripts/command-bridges/scoring-compatibility.json | grep -cE '^command-spec-kit-(plan|implement|complete|resume)$|^command-speckit-|^command-prompt-improve$'` prints 0, and after `node $D` the T021 check still prints 8.
- [ ] T029 Update the pinned active non-doctor counts to the generated activation (`$ADV/tests/command-bridges-drift-guard.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/command-bridges-drift-guard.vitest.ts` reports 0 failed, and the new counts from `jq '[.entries[] | select((.id | startswith("command-doctor") | not) and .runtime.typescript.enabled)] | length' $G` and the Python equivalent are recorded in `implementation-summary.md`.

**W5 Read-only from the class**

- [ ] T030 Call `isReadOnlyRoute` for non-doctor rows too (`$D`). Verify: after `node $D`, `rg -A14 "'command-speckit-search'" $ADV/lib/scorer/projection.ts | grep -c 'readOnly: true'` prints 1, and no other non-doctor row in that block carries `readOnly: true`.
- [ ] T031 Prove the review's L3 case (`$ADV/lib/scorer/fusion.ts`, read only). Verify: after `npm run build`, scoring `show me which packets mention the token cap` with the spec.md section 2 one-liner prints `command-speckit-search` as the top skill, and the same wording does not lift a `mutates` command to 0.82.

**W6 Same-owner collapse**

- [ ] T032 Keep a command row and its own owner skill out of one cluster in `clustersWithTop` (`$ADV/lib/scorer/ambiguity.ts`). Verify: a case in `tests/command-attach.vitest.ts` with a command row and its owner within 0.05 reports `ambiguous: false`.
- [ ] T033 Collapse rows that resolve to one command into one entry before the top-K cut (`$ADV/lib/scorer/fusion.ts`). Verify: after `npm run build`, scoring `save context` prints at most one id for `/speckit:save` in the top 3.
- [ ] T034 Apply the same collapse and the same-owner ambiguity rule in the Python ranking (`$ADV/scripts/skill_advisor.py`). Verify: in `$ADV`, the Python tests run by `npm test` report 0 failed, and the parity divergence ratchet reports no new divergence.
- [ ] T035 Check every typed row for same-owner ambiguity (`$C`). Verify: `node $C | jq '.attachedMetrics.typed_same_owner_ambiguous | length'` prints 0, and scoring `/speckit:plan add a login page` prints `"ambiguous":false`.

**W7 Doctor phrases** (authoring runs beside W2 to W5, the regenerate joins the deriver sequence after T030)

- [ ] T046 [P] Add diagnostic `trigger_phrases` of three or more words, written as users type them and checked against `split: tune` rows only, to the routes of `/doctor:agents-md`, `/doctor:ci`, `/doctor:overlay` and `/doctor:runtime-mirrors`, where `command-doctor-helper` wins today (`$R`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | tail -1` starts with `OK: route-validate`.
- [ ] T047 [P] Add diagnostic `trigger_phrases` to `/doctor:deep-loop`, `/doctor:env`, `/doctor:git`, `/doctor:sk-code`, `/doctor:sk-skill`, `/doctor:skill-advisor` and the `/doctor:mcp` entries under `mcp_subroutes`, where an owner skill wins today, and add `lead_phrases` only where the doctor command must lead a passing skill (`$R`). Verify: the T046 command starts with `OK: route-validate`, and `git diff --stat -- $ADV/lib/scorer` shows no change made for a doctor command.
- [ ] T048 [P] Add diagnostic `trigger_phrases` to `/doctor:install`, `/doctor:setup`, `/doctor:speckit`, `/doctor:symlink` and `/doctor:update`, which get no recommendation today (`$R`). Verify: the T046 command starts with `OK: route-validate`.
- [ ] T049 Add `/doctor:helper` phrases only where they name no specific route's subject, such as asking which doctor command to run (`$R`). Verify: the T046 command starts with `OK: route-validate`, and `git diff -U0 $R` shows each new helper phrase with no route name or route subject in it.
- [ ] T050 Regenerate after T030, in the deriver sequence (`$G`). Verify: `node $D` exits 0, `node $D --check | jq -r .status` prints `fresh`, and `jq '[.entries[] | select((.id | startswith("command-doctor")) and .runtime.typescript.enabled)] | length' $G` prints 35.
- [ ] T051 Rebuild and run the doctor gates (`$ADV/tests/doctor-routing-slice.vitest.ts`). Verify: after `npm run build` in `$ADV`, `$PR; echo $?` ends with 0, and `npx vitest run tests/doctor-routing-slice.vitest.ts` reports 0 failed.
- [ ] T052 Measure doctor reach and the helper guard (`$S/doctor-after.json`). Verify: `node $C > $S/doctor-after.json` exits 0, `jq '[.rows | to_entries[] | select(.key | test("^cmd-doctor-.*-plain-tune-")) | select(.value.top1)] | length' $S/doctor-after.json` prints a number above 0, `jq '[.rows | to_entries[] | select((.key|test("^cmd-doctor-")) and (.key|test("doctor-helper")|not) and .value.top=="command-doctor-helper")] | length' $S/doctor-after.json` prints 7 or less, and `$P` prints values no worse than `[158,50,20,5]`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T036 Rebuild and run the whole advisor suite, including the ratchet, holdout and ambiguity slice tests (`$ADV/package.json`). Verify: in `$ADV`, `npm run build && npm test` reports 0 failed.
- [ ] T037 Report reach against the baseline (`$S/after.json`). Verify: `node $C > $S/after.json` exits 0, `jq -c .attachedMetrics $S/after.json` shows own-row, attached and combined plain reach above 0 of 44 on tune and on holdout with the ceiling 44 and the doctor rows on their own line, and `jq -c .metrics.false_offer $S/after.json` prints `{"count":0,"total":35}`.
- [ ] T038 Confirm the 10 `d3-plain` rows are not offered (`$S/after.json`). Verify: `jq '[.rows[] | select(.source == "d3-plain" and .offered == true)] | length' $S/after.json` prints 0, using the per-row field name the harness writes.
- [ ] T039 Confirm the four pinned numbers (`$ADV/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `$P` prints values no worse than `[158,50,20,5]`.
- [ ] T040 Re-capture the routing baseline after the operator has read the delta from T037 (`$B`). Verify: `node $C --write > /dev/null` exits 0, and in `$ADV` `npx vitest run tests/command-routing-slice.vitest.ts` reports 0 failed.
- [ ] T041 Time the hook after the change (`$S/hook-latency-after.json`). Verify: `node $S/hook-latency.mjs > $S/hook-latency-after.json` exits 0, and `implementation-summary.md` shows the before and after median and p95 side by side.
- [ ] T042 Confirm the deriver and the skill root metadata gate (`$G`). Verify: `node $D --check | jq -r .status` prints `fresh`, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1` reports `failed=0`.
- [ ] T043 Confirm the brief and `AGENTS.md` are untouched (`$ADV/lib/render.ts`). Verify: `git diff --stat -- $ADV/lib/render.ts AGENTS.md` prints nothing.
- [ ] T044 Confirm the changed files match `spec.md` section 3 (`spec.md`). Verify: `git status --short .skilled` lists only those files.
- [ ] T053 Confirm no scorer change was made for a doctor command (`$ADV/lib/scorer`). Verify: `git diff -- $ADV/lib/scorer | rg -c 'doctor'` prints nothing, and a final `$PR; echo $?` ends with 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$S/after.json` shows plain reach above the baseline on both splits against the ceiling 44 with false offers 0 of 35, `$P` is no worse than `[158,50,20,5]`, the phrase reach probe exits 0 and the T036 suite reports 0 failed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-004.
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Each line below names the command or task that answers it.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocking fact, and the phase does not close while one remains. Doctor phrase tasks never edit a file outside `$R`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The build is fresh and the baseline reproduces before the first edit: T001
- [ ] CHK-002 [P0] The four pinned numbers read `[158,50,20,5]` before the first edit: T002
- [ ] CHK-003 [P1] The baseline's routing parts and the hook timing are saved: T003 and T005
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check $D` exits 0 and `npm run build` in `$ADV` exits 0
- [ ] CHK-011 [P0] `jq empty` exits 0 on the two metadata files, `scoring-compatibility.json`, `$G` and the three corpora
- [ ] CHK-012 [P1] A missing or malformed compiled route attaches nothing and raises nothing: T017
- [ ] CHK-013 [P1] `rg -n 'specs/|REQ-|ADR-|T0[0-9][0-9]|008-command' $A $D $ADV/handlers/advisor-recommend.ts $ADV/lib/scorer/ambiguity.ts $ADV/lib/scorer/fusion.ts` prints nothing new from this phase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met` with observed evidence
- [ ] CHK-021 [P0] The harness extension is neutral before any scorer change: T008
- [ ] CHK-022 [P0] False offers stay 0 of 35 and the four pinned numbers are no worse: T037 and T039
- [ ] CHK-023 [P1] No typed row is ambiguous with its own owner: T035
- [ ] CHK-024 [P0] The phrase reach probe exits 0, the doctor slice passes and doctor tune recall at 1 is above 0: T051 and T052
- [ ] CHK-025 [P1] `/doctor:helper` takes no row from a specific route and no scorer change serves a doctor command: T052 and T053
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A as a finding fix. The phase builds the review's R2, R10a, L2 and L3, so the class and consumer checks below apply to the changed field and rules.

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: R2 and L2 are `cross-consumer`, R10a is `algorithmic`, L3 is `class-of-bug`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'isReadOnlyRoute' $D` lists every call site, and each non-doctor call is new in this phase.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the `command` field: `rg -n '\bcommand\b' $ADV/handlers/advisor-recommend.ts $ADV/schemas/advisor-tool-schemas.ts .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts $ADV/lib/render.ts` matches the plan's affected surfaces table.
- [ ] CHK-FIX-004 [P0] N/A: no path, parser, redaction or security fix. The attach function reads only generated strings.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: route action, selection kind, target count, lookup hit and hub id for the attach rule.
- [ ] CHK-FIX-006 [P1] Hostile global state: the attach test runs with `SPECKIT_COMPILED_ROUTING=0` and the hook returns no `command`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase's commit range, named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No prompt text reaches the `command` field: T017 asserts the field is always a `MODE_COMMANDS` value or a metadata command
- [ ] CHK-031 [P1] N/A for secrets and auth: the phase reads no credential and opens no socket.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` section 3, `plan.md` and T044 name the same files
- [ ] CHK-041 [P1] The relabel list, the hook timing and the reach numbers are in `implementation-summary.md`: T024, T041 and T037
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The saved baseline, the timing script and its outputs, the measurements and `relabels.tsv` live under this packet's `scratch/`
- [ ] CHK-051 [P1] No fixture or hand edit is left in `$A` or `$G`: `node $D --check | jq -r .status` prints `fresh` at close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 19 | 0/19 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not verified yet
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 are followed: the 17 disabled hub rows stay disabled in `$G`, and `rg -n 'attachCommand' $C $ADV/handlers/advisor-recommend.ts` prints a call in each
- [ ] CHK-101 [P1] ADR-003 and ADR-004 are followed: T008 and T012 pass
- [ ] CHK-102 [P1] ADR-005 and ADR-006 are followed: T022, T024 and T025 pass, and W7 edits only `$R`
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The hook's median and p95 time per prompt are recorded before and after (NFR-P01): T005 and T041. No budget is checked until the operator sets one.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The rollback in `plan.md` section 7 is written with its regenerate and rebuild commands
- [ ] CHK-121 [P1] The hook runs on the rebuilt `dist`: the T041 run exits 0 for all 44 prompts
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No dependency is added: `git diff --stat -- '*package.json' '*package-lock.json'` prints nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] The parent `spec.md` phase map row for this phase and this packet's `spec.md` state the same handoff criterion
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Answers the two open questions, reads the delta and decides the commit and the start of phase 004 | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
