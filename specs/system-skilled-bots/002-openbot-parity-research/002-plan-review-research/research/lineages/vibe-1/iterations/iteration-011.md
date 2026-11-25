# Iteration 11: The routine layer's three loose ends

## Focus

002 routine layer, the only phase whose runtime behavior had no security or failure-mode pass. The focus file asked whether the `until` check runs a command as the bot, whether a routine's `starts` list can fire twice or never, and whether the 15-minute floor and the ten-failure fatigue switch hold when the status index is stale or a run is parked. The frontier is drained, so the focus comes from iteration 10's recommended next focus. Evidence: 002's spec against `runner.ts`'s precheck helper, the needs-you hold, and `slot-accounting.ts`.

## Findings

1. **P1 — a second non-cron start is accepted and silently ignored, which is the failure mode the phase says it refuses.** REQ-001 says `starts` "holds one or more entries, each a trigger the parser already knows, and `starts[0]` renders into the `trigger`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:160]. REQ-009 refuses more than one cron start and a cron start that is not first [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173], and the Out of Scope says a second cron start "needs a schedule index that `slot-accounting.ts:210` refuses today, so v1 refuses it by name rather than ignoring it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:112]. A `starts: [queue, git-hook]` list passes every requirement: one entry renders, the other is parsed and dropped, and the author believes the bot fires on both. The phase refuses the cron case by name and ignores the identical non-cron case. **Edit:** in `002/spec.md` REQ-009 add "a `starts` list with more than one entry is refused by name `routine-starts-multiple` until the schedule index lands, whatever the trigger kinds", and change REQ-001's "one or more entries" to "exactly one entry in v1"; add the case to `routine.vitest.ts` and one defect fixture.

2. **P1 — the fatigue switch raises a needs-you item that holds the bot, so `bots enable` cannot recover it.** REQ-006 sets the `disabled` switch with reason `failure-streak` and raises one needs-you item, and says `bots enable` clears it and restarts the count [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165]. An open needs-you item for a bot refuses every later run with `awaiting-decision-hold` before the lease is taken [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:832-846], and `bots enable` clears a switch rather than answering an item. So the documented recovery path leaves the bot held by the notification that told the operator about the problem, and the operator has to answer an item whose only content is "this bot failed ten times". **Edit:** in `002/spec.md` REQ-006 add "the item carries the reserved `routine-fatigue` id, which `RESERVED_BOT_IDS` refuses to a definition, so it is listed and never holds the bot, and `bots enable` closes it"; add `runtime/lib/label.ts` to Files to Change for the reserved id and one acceptance criterion that `bots enable` after a fatigue switch lets the next run dispatch.

3. **P2 — the `until` check runs in the checkout, not in the run's worktree, so it cannot see what the run produced.** REQ-004 runs `until` "through the existing precheck helper" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:163], and that helper spawns `/bin/sh -c` with a caller-supplied working directory [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535-537]. The only call site passes `context.checkoutRoot` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:932], so an `until` such as "the build output exists" or "the test passes" inspects the checkout while the run's output sits in a worktree that is removed when the run ends. The check then either fails forever or passes on stale checkout state. **Edit:** in `002/spec.md` REQ-004 add "`until` runs with the run's working directory — the worktree when the run had one, the checkout otherwise — before the worktree is removed, and the record carries the directory it ran in"; add the worktree case to `runner.vitest.ts` and name the ordering in `plan.md`.

4. **P2 — the failure streak's treatment of a parked or skipped run is undefined, so the count can be wrong in both directions.** REQ-006 counts "ten consecutive failures" from the run records the status index is built from [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165]. A run that parks on a needs-you item is recorded as `awaiting-decision`, and a run whose slot was held is recorded as skipped [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:833-836]. Neither is a failure, so a strict reading resets the streak and a loose one ignores it; the phase says neither, and the two readings differ by up to ten runs before the switch fires. **Edit:** in `002/spec.md` REQ-006 add "a parked, skipped or refused run neither increments nor resets the streak, and only a run recorded as failed increments it"; add the three cases to `routine-state.vitest.ts`.

## Ruled Out

- Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule.
- Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118].
- Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way.

## Dead Ends

- Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's.
- Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch.

## Edge Cases

- Ambiguous input: "consecutive failures" could count runs or slots. The narrower reading (runs recorded as failed) is the one the fix states, and the slot reading is named as the alternative in the finding.
- Contradictory evidence: the Out of Scope says a second start is refused by name, while REQ-001 accepts a list. Both are cited; the requirement is the defect and the Out of Scope is the intent.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:106,108,112,118,160,163,165,173
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535-537,832-846,932
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:210
- .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28

## Assessment

- New information ratio: 0.88
- Questions addressed: does `until` run as the bot, can `starts` fire twice or never, do the floor and the fatigue switch hold
- Questions answered: `until` runs as the operator in the checkout, a second non-cron start is silently dropped, the fatigue switch blocks its own recovery, and the streak's parked case is undefined

## Reflection

- What worked and why: reading the Out of Scope first showed the phase's own standard — "refuse it by name rather than ignoring it" — and then checking REQ-001 and REQ-009 against that standard found the non-cron case in one comparison. The fatigue finding came from following the item the phase raises into the hold check that already exists.
- What did not work and why: the first pass looked for a floor gap and found none, because the floor is correctly scoped to cron. The productive question was not "is the floor right" but "what does the phase do with a start it cannot honor".
- What I would do differently: for every list a phase accepts, check what happens to each element after the first. Three phases in this packet accept a list and only one of them renders every element.

## Recommended Next Focus

The synthesis needs the cross-phase conflict list assembled from iterations 1 to 11, and two surfaces remain: 003's Rust crate against the CI workflow and the `.opencode` mirror (partly covered in iteration 5), and 006's ladder against 011's roster (partly covered in iterations 4 and 7). The next iteration should take 006, because the ladder is the one record three phases read and no iteration has read its requirements line by line.
