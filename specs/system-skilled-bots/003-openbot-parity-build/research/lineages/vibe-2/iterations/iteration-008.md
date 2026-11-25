# Iteration 8: Shared-module landing order — nine phases, one runner

## Focus

Frontier node F-2-009 (depth 2): "Which runtime modules do more than one phase modify, and in what order must those phases land so the parser, record and index shapes do not collide?"

The iteration counted every `runtime/lib`, `bin/bots.cjs` and `bot-check.cjs` row in each phase's Files to Change table, then read the parent's phase map to see whether the declared order covers the overlaps.

## Findings

1. **Nine of the eleven phases modify `runner.ts`, nine modify `.skilled/bin/bots.cjs`, and nine modify `runtime/lib/README.md`; the numeric order is the only thing that keeps them apart and no document says so.** The Files to Change tables give `runner.ts` to 001, 002, 004, 005, 006, 007, 008, 009 and 010, `bots.cjs` to 001, 002, 003, 005, 006, 008, 009, 010 and 011, and `README.md` to 001, 002, 004, 005, 006, 008, 009, 010 and 011. The parent's Phase Transition Rules say only that each phase must pass `validate.sh` before the next begins (`spec.md:139`), which implies serial order without naming the three files that make serial order mandatory. **Severity P1.** Fix: add a Phase Transition Rule to `spec.md` §Phase Documentation Map reading "`runtime/lib/runner.ts`, `.skilled/bin/bots.cjs` and `runtime/lib/README.md` are serial merge points: nine phases each modify all three, so no two phases may be built in parallel and each phase rebases on the one before."

2. **`buildBotPrompt` gains a positional input from three phases and a fourth changes its environment, so each phase's prompt tests break on the next phase's signature.** Phase 004 makes the function "take the working place as an input rather than reading it" (`004-computer-exposure/plan.md:62`), phase 005 adds "one input, one insert and one marker" (`005-memory/plan.md:61`), phase 009 makes it "take an optional `skills` list" (`009-skills/plan.md:65`), and phase 008 merges `secretEnv` into `dispatchEnv` (`008-vault/spec.md:122`). Four phases, one function, and no phase states that its input is optional. **Severity P1.** Fix: add one sentence to each of the four plans — "the new input is optional with a default, so every earlier caller and test compiles unchanged" — and one acceptance row per phase asserting the three earlier phases' prompt tests still pass.

3. **Phase 009 branches on the proposal item phase 005 introduces, but 009's Dependencies name only 001.** `009-skills/plan.md:67` has `answer.ts` call `settleProposalAnswer` "after the secret check and before the resume enqueue", and the proposal item is 005's `kind` and `proposal` fields (`005-memory/spec.md:116`). 009's Dependencies list names "Phase 001-activity-and-actor" and the unchanged runtime modules, and nothing else (`009-skills/spec.md` §Dependencies). The numeric order satisfies the real edge, so the build works; the declared graph is wrong, which is what a resumer reads. **Severity P1.** Fix: add "Phase 005-memory, whose proposal item this phase's answer branch reads" to 009's Dependencies and change the map's Depends on cell for 009 from `001` to `001, 005`.

4. **`FRONTMATTER_KEYS` gains five keys from five phases and no document states the allowlist's final contents.** Phase 002 adds `routine` (`002-routine-layer/plan.md:63`), 005 adds `memory` as a boolean (`005-memory/spec.md:118`), 007 adds `apps` (`007-per-bot-apps/plan.md:61`), 008 adds `secrets`, and 009 adds `skills` (`009-skills/plan.md:64`). Each phase's Definition of Done greps for its own key, so five phases can each pass while the allowlist holds a key nobody meant to keep. **Severity P2.** Fix: add one row to `spec.md` §Phase Documentation Map listing the five keys and the phase that adds each, and change each phase's DoD from `rg -n '<key>'` to a command that prints the whole `FRONTMATTER_KEYS` array so the reader sees every key at once.

5. **Two phases widen a security allowlist inside another skill's runtime, and neither asserts the filter still refuses everything else.** Phase 007 sets `UTCP_CONFIG_FILE` for the child (`007-per-bot-apps/plan.md:62`) and phase 008 admits the `SKILLED_BOT_SECRET_` prefix in `assertDispatchEnvAllowed` (`008-vault/plan.md:70`). That function is the deep-loop's per-kind environment filter (`executor-audit.ts:1508`), and both phases list `executor-audit.ts` in their Files to Change tables. A widened filter that stops refusing is a secret-leak path, and no acceptance row in either phase tests the refusal. **Severity P1.** Fix: add one acceptance row to 007 and one to 008 asserting that an environment key matching neither the new allowance nor an existing one is still refused, and name `executor-audit.ts` in the parent's Phase Transition Rules as a cross-skill write that two phases share.

6. **`state-root.ts` gains six folders from six phases and no phase states the mode each folder is created with.** Phase 002 adds `routines/` (`002-routine-layer/plan.md:62`), 005 adds the shared and per-bot memory files (`005-memory/plan.md:60`), 008 adds the secret index, 009 adds `proposals/` (`009-skills/plan.md:63`), 010 adds `conversations/` (`010-conversations/spec.md:114`) and 011 adds `channels/` with its `queue/` and `seen/` folders (`011-messaging-channels/spec.md:141`). `state-root.ts` owns the state root's 0700 mode today, and the six new folders inherit whatever the creating call passes. **Severity P2.** Fix: add one row to `spec.md` §Phase Documentation Map naming the six folders and requiring 0700 on each, and one acceptance row per phase asserting the created folder's mode.

## Ruled Out

- **Treating the numeric order as unsound.** Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in order satisfies all of them. The defects are in the declared graph and in the missing serial-order rule, not in the order itself.
- **Treating `README.md` as a merge risk worth a finding of its own.** It is documentation; it is named in finding 1 only because it shares the nine-phase count.
- **Treating `status-index.ts` as a landing-order problem.** Phase 001 bumps `SCHEMA_VERSION` to `'3'` and phase 004 adds a JSON column with no bump, which is a Definition-of-Done contradiction already recorded as a P0 in iteration 1; the order does not change it.
- **Treating `needs-you.ts` as a landing-order problem.** The three phases that extend `ITEM_KEYS` land in numeric order; the defect is the `kind` collision recorded in iteration 6, which order cannot fix.

## Dead Ends

- **Looking for a phase that declares a parallel build.** None does; the map's transition rules already imply serial order, which is why finding 1 is a missing statement rather than a wrong one.
- **Looking for a shared-module owner document.** The parent spec has no section listing which runtime module each phase touches; the only such list is each phase's own Files to Change table.

## Edge Cases

- **Ambiguous input:** "in what order must those phases land" could be read as asking for a new order. The map already fixes the order, so the iteration tests whether the fixed order is sufficient and whether the declared graph matches it.
- **Contradictory evidence:** none. The map's dependency column and the phases' own Dependencies blocks disagree for 009, which is finding 3.
- **Missing dependencies:** none.
- **Partial success:** the count is from the Files to Change tables only; a phase that modifies a module without listing it would be missed. The tables are the contract, so the count is the contract's count.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:119-145`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62-63`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60-61`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:116,118`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:61-62`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:70`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:122`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:63-67`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:114`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:141`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508`

## Assessment

- New information ratio: 0.92 (five findings fully new; the `state-root.ts` mode finding is partially new because iteration 5 already recorded that every phase defers the shared-host mode)
- Questions addressed: F-2-009
- Questions answered: F-2-009

## Reflection

- **What worked and why:** counting the Files to Change rows mechanically, rather than reading the plans' prose about what they touch, produced the nine-phase overlap in one pass. Prose understates it: no plan says "this is the ninth phase to edit `runner.ts`".
- **What did not work and why:** the first attempt counted mentions of a module path anywhere in `spec.md`, which ranked `delivery.ts` and `bots.cjs` by how often they are discussed rather than by whether a phase changes them. Restricting to the Files to Change table gave the real set.
- **What I would do differently:** for every shared module, read the *function* each phase changes inside it, not just the file. That is what turned `buildBotPrompt` from one row in a table into a four-phase signature collision.

## Recommended Next Focus

The carried-forward question from iteration 6: the `until` timeout and the `until` failure path in phase 002, plus a sweep for any remaining P0 that no iteration has recorded.
