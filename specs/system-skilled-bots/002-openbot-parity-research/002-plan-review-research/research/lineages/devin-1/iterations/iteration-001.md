# Iteration 1: Plan versus runtime — phases 001-activity-and-actor and 002-routine-layer

## Focus
Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.

This iteration covered the first two phases only (001-activity-and-actor, 002-routine-layer): every file, symbol, line citation, CLI refusal and verify command they name was checked against the built runtime. Later iterations cover phases 003-011.

## Actions Taken
1. Read phase 001 `plan.md`, `tasks.md`, `acceptance-criteria.md` and the requirement/measured-behavior blocks of `spec.md`.
2. Probed the live CLI: `bots activity`, `bots inbox --json`, `bots answer --as` (all three refusals reproduce verbatim).
3. Read the runtime symbols phase 001 assumes: `SCHEMA_VERSION`, `ITEM_KEYS`, `FIELD_GROUPS`, `VERB_SPECS`, `FLAG_OPTIONS`, `RunRow`, `NeedsYouAnswer`, `answer.ts`, `run-record.ts` validation.
4. Read phase 002 `plan.md`, `tasks.md` and its measured-behavior block; checked every line citation (`definition.ts:142`, `slot-accounting.ts:102`, `state-root.ts:117-132`, `runner.ts:535`, `runner.ts:822`, `switches.ts:25`, `installer.ts:547-548`, `bots.cjs:513-514`).
5. Checked command runnability: runtime `package.json` scripts, `node_modules/.bin`, the `tsc` target, test-file existence, fixture and doc paths, and both `rg -c` inventory counts the 002 plan states.

## Findings
1. **P1 — phase 001, `tasks.md:138` (CHK-010): the typecheck verify command is not runnable as written.** `cd .skilled/skills/system-skilled-bots/runtime && npx tsc --noEmit` cannot resolve a local `tsc`: `runtime/node_modules/.bin` holds `esbuild nanoid prebuild-install rc rolldown semver tsx vite vitest why-is-node-running` and no `tsc`. The repo's own typecheck script is `../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json`, and that binary exists. `npx tsc` would fetch the unrelated deprecated `tsc` package or fail offline, so CHK-010 either fails or checks the wrong compiler. **Exact edit:** replace the CHK-010 Verify with `cd $RT && npm run typecheck` and add that same command to the phase-001 Definition of Done. [SOURCE: .skilled/skills/system-skilled-bots/runtime/package.json:13] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55]

2. **P2 — phase 001, `spec.md:132`, `tasks.md:67` (T025), `acceptance-criteria.md:59` (AC-006): the MIT notice file has no stated location and does not exist anywhere in the repository.** `fd -HI THIRD_PARTY_NOTICES` returns nothing, so the file is created by this phase, yet the spec's Files to Change names it as the bare `THIRD_PARTY_NOTICES.md` and both verify clauses `rg` a bare filename from an unstated working directory. Two implementers can create it at the repo root and under `.skilled/skills/system-skilled-bots/` and both "pass" their own check. **Exact edit:** in the spec's Files to Change row, T025 and AC-006, write the exact target path (proposed: `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`, beside the runtime the lifted files land in) and make each verify `rg -n 'activity-groups.ts|activity-rows.ts' <that path>`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:1]

3. **P1 — phase 002, `plan.md:88`: the affected-surface row misstates `status.ts`'s current role, so the task that adds the `completed` row state understates the change.** The row says `status.ts` "Reads the switches to build a row state" and needs only "update: report `completed`". The module imports no switch reader and builds `flags` from retired/path state, `checkInstalls` status, an open needs-you item, launchd presence and the last index row; `BOT_ROW_STATES` contains no `completed`. The work is therefore a new switch read plus a new state in the precedence list, not a reporting tweak. **Exact edit:** change the row's Current Role to "Reads install checks, path state, launchd, the last index row and open needs-you items; does not read switches", and add to T019: "import `readSwitch` and insert `completed` into `BOT_ROW_STATES` after `held`". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:41-52] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:270-282]

4. **P2 — phase 001, `plan.md:140`: the rollback claim about a post-revert record is wrong.** It says a record carrying `actor` "reads as an unknown key only if the revert lands after a run wrote one, and `bots status --rebuild` then skips that record and names it". `validateRunRecord` checks only the eight required groups and a fixed set of nested fields; it rejects neither unknown top-level keys nor unknown keys inside a group, so a reverted reader ignores `actor` and the record is not skipped. **Exact edit:** reword the rollback to "the reverted reader ignores the extra field, so the record still reads and rebuilds". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:234-248]

## Ruled Out
- Suspected 001 contradiction between Definition of Ready (`SCHEMA_VERSION` prints `'2'`) and the affected-surface verification (`'3'`): ruled out. The first is the pre-change baseline, the second the post-change check, and `status-index.ts:55` currently holds `'2'`.
- Suspected 002 inventory miscounts in the "Required inventories" block: ruled out. `rg -c 'trigger'` returns exactly definition.ts:14, slot-accounting.ts:5, installer.ts:5, request-queue.ts:3, runner.ts:2, repo-config.ts:1, and the switch-consumer count returns switches.ts:4, installer.ts:3, runner.ts:3, bots.cjs:2, as written.
- Suspected 002 citation drift: ruled out. `parseTrigger` is at `definition.ts:142`, `schedulePeriodSeconds` at `slot-accounting.ts:102`, `identityStatePaths` at `state-root.ts:117-132`, `runPrecheck` at `runner.ts:535`, the `disabled` read at `runner.ts:822`, `SWITCH_KINDS` at `switches.ts:25`, and the `disabled`/`paused` reads at `installer.ts:547-548`.
- Running the full vitest suite was not attempted: it writes caches and temp fixtures outside this lineage, which this run forbids. Runnability was established statically (`vitest` present in `node_modules/.bin`, `test` script declared, every named test file present).

## Dead Ends
- No dead ends this iteration; every citation checked resolved.

## Edge Cases
- Ambiguous input: none. The frontier focus named the angle and the phase scope was narrowed to 001-002 for this pass.
- Contradictory evidence: none between sources. One internal contradiction (001 DoR vs affected surfaces) was resolved as pre/post state.
- Missing dependencies: `THIRD_PARTY_NOTICES.md` is absent, which is expected for a create task; recorded as finding 2 because its target path is unstated, not because it is missing.
- Partial success: none. The live CLI probes reproduced every refusal phase 001 claims.
- Operational observation (not a phase finding): this lineage's config carries `antiConvergence.stopPolicy: "max-iterations"` (template shape) while `convergence.cjs` reads a top-level `config.stopPolicy` and reported `"stopPolicy":"convergence"`; the 13-iteration cap is still enforced first, and both frontier nodes stay open, so the run reaches the cap either way.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md
- .skilled/skills/system-skilled-bots/runtime/package.json
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-skilled-bots/runtime/lib/switches.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/installer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
- .skilled/bin/bots.cjs
- Live CLI output: `bots activity`, `bots inbox --json`, `bots answer item-1 yes --as ada`

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-001 for phases 001 and 002
- Questions answered: none fully (the node spans all eleven phases)

## Reflection
- What worked and why: probing the live CLI first made the 001 measured-behavior block cheap to confirm, and reading the exact cited line ranges turned three suspected drifts into verified non-findings; the plans' line citations are unusually accurate.
- What did not work and why: the failed first read of `001/tasks.md` came from a mistyped path (`system-skills-bots`); re-copying the lineage path fixed it. Cost one call.
- What I would do differently: check the runnability of every `npx`-based verify clause by resolving the binary in `node_modules/.bin` before reading the prose around it, so a missing tool is caught on the first pass.

## Recommended Next Focus
Continue F-1-001 on phases 003-terminal-screen and 004-computer-exposure: verify the Rust screen crate, its `cargo` commands and every runtime symbol those plans cite, then proceed to 005-011 in later passes.
