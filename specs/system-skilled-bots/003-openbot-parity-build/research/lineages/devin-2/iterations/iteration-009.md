# Iteration 9: The `--json` contracts between producers and consumers (angle 1, interface layer)

**Iteration**: 9 of 13
**Focus**: The `--json` payloads the terminal and the channels consume. Phase 001 produces `activity --json` and `inbox --json`; phase 002 produces `routines --json`; phase 010 produces `chat --transcript --json`; phases 003 and 011 consume them. Does each producer promise the keys its consumer parses?

## Focus

A JSON contract has two halves and the packet writes them in different phases. This pass compared the producer's requirement text to the consumer's requirement text for every `--json` surface the terminal and the channels read, looking for a key the consumer needs that the producer never promises, and for a value vocabulary that does not line up.

## Actions Taken

1. Read phase 001's `activity --json` and `inbox --json` requirements and its plan's grouping rule.
2. Read phase 002's `routines --json` requirement.
3. Read phase 003's three pane requirements and its `activity.rs` mapping note.
4. Read phase 010's `chat --transcript --json` requirement and its message shape.
5. Read phase 011's inbox consumption and its `options` assumption.
6. Read `status.ts` for the header's staleness flag that 003's plan assumes.

## Findings

1. **P2 — Phase 003's six activity markers do not cover phase 001's seven groups, and the per-row value the markers need is never promised.** Phase 001 groups rows under seven ids — `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed` and `recurring` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143] — and its JSON requirement says each group carries "its id, its title and its rows" without naming a row field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:144]. Phase 003 draws "one of six markers: `·` running, `✓` done, `✗` failed, `!` needs input, `–` cancelled, `?` stale" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165] and its plan maps "the runtime's exit vocabulary" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:65]. Two groups have no marker (`scheduled`, `recurring`), one marker has no group (`stale`), and no producer requirement promises an exit value on a row, so the mapping has no input for a row that has not run. **Exact edit**: in `001-activity-and-actor/spec.md` REQ-002 name the row keys — `runId`, `botId`, `status`, `actor`, `at` — and in `003-terminal-screen/spec.md` REQ-005 extend the table to seven groups plus the stale header flag, with `scheduled` and `recurring` markers of their own.
2. **P2 — Phase 002's `routines --json` never names `botId`, which phase 003's routines pane requires.** Phase 002 says the verb lists "every bot in the checkout that carries a routine block, with its `what`, rendered starts, `does`, `until`, `untilMetAt`, failure streak and switch state" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171] — no bot identifier among the named fields. Phase 003 draws "the bot id, the four-part routine sentence and the routine's state" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:167]. A consumer cannot render the first column from a field the producer does not promise. **Exact edit**: add `botId` to `002-routine-layer/spec.md` REQ-007's field list and to its acceptance row for `--json`.
3. **P2 — Phase 001's `inbox --json` names its fields in prose where its consumers parse exact keys.** The requirement says each item carries "its id, bot, state, question, options, timestamps and answer" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:145], while the item file's real keys are `id`, `botId`, `question`, `options`, `createdAt`, `expiresAt` and `answer` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29]. Phase 003 parses the inbox for its pane and overlay [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:166] and phase 011 reads the item's `options` for its buttons [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:179]. "bot" and "timestamps" are not keys, so two consumers can pick two names for the same value. **Exact edit**: replace the prose with the exact key list in REQ-003, and add `--json` key assertions to phase 001's acceptance table.

## Ruled Out

- **Treating the status header's staleness flag as missing.** `status.ts` carries a `stale` boolean and a `staleIdentities` list in its snapshot [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:106], so 003's header assumption is sound.
- **Treating `chat --transcript --json` as underspecified.** Phase 010 names the message keys in REQ-003 and says `--json` prints the messages as an array in REQ-006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150], which is enough for 003's chat pane and for 010's own pane requirement.
- **Treating 011's `options` read as a shape risk.** `options` is `string[] | null` on the item [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:36] and 011's YES/NO fallback covers the null case [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:179].

## Dead Ends

- Comparing only the producer's spec to the consumer's spec finds the missing keys but not the vocabulary mismatch; the seven-versus-six marker gap only appears when 001's group list and 003's marker list are laid side by side.

## Edge Cases

- **Ambiguous input**: "the `--json` contracts" was read as the four surfaces the terminal and channels read (`activity`, `inbox`, `routines`, `chat --transcript`). `status --json` was checked only for the header's two values.
- **Contradictory evidence**: none; the producers and consumers simply name different things.
- **Missing dependencies**: none.
- **Partial success**: the Rust consumer's parser was not compiled; the comparison is textual.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143, :144, :145
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165, :166, :167
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:65
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:179
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts:106
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 1, JSON interface layer
- Questions answered: the `chat --transcript --json` contract is complete; the `activity`, `inbox` and `routines` contracts each miss a key or a value vocabulary their consumer needs.

## Reflection

- **What worked and why**: Laying the producer's group list beside the consumer's marker list exposed the seven-versus-six gap in one line. Two documents can each be internally consistent and still not meet.
- **What did not work and why**: Reading the consumer's requirement alone suggested it was self-contained ("the rows `bots activity --json` returns"); the dependency only appears when the producer is read.
- **What I would do differently**: Build a producer-to-consumer key matrix for every `--json` surface before reading any single requirement, so a missing key is visible as an empty cell rather than inferred.

## Recommended Next Focus

Return to angle 2's remaining half: the phase handoff criteria. Each phase declares a handoff that the next phase depends on; check that every handoff names an observable state the next phase's setup step can test, and that no handoff is satisfied only by a phase that runs later.
