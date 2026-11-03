# Iteration 2: Save-time readers, writer and matcher (gaps 1, 5, 6; maintainability of the parse surface)

## Focus

The save half of decision capture: how `/speckit:save` discovers queued answers, which reader parses which store, where chat-answer pairing is decided, whether the process-question filter is re-applied at save time, and how many independent implementations of the queue and consumed-log formats exist. Gaps in scope: (1) answers only reach a record at save, (5) pairing depends on the saving model's judgment, (6) process questions filtered by keyword.

## Actions Taken

1. Read `.skilled/commands/speckit/save.md` end to end: procedure, per-runtime sweep selection, matcher invocation, the `operatorDecisions` entry rules.
2. Read `lib/chat-questions.mjs` candidate detection and traced every `isProcessQuestion` caller.
3. Mapped `decision-record-writer.ts` (anchors, id allocation, level guard, consumed log) and `decision-table-matcher.ts` (parse, answer gate, weighted score, refusals).
4. Mapped `match-decision-table.ts` CLI modes and its own queue/consumed readers.
5. Checked the Claude Stop hook's autosave path and whether its payload can carry `operatorDecisions`.
6. Traced `operatorDecisions` through `input-normalizer.ts` and `core/workflow.ts`.

## Findings

1. No live adapter and no sweep ever writes a decision record. The only writer is a `--full-auto` save whose JSON carries `operatorDecisions`, validated by the normalizer and routed per packet by the save pipeline; this is gap 1 exactly. [SOURCE: .skilled/commands/speckit/save.md:19] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:288] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:644]
2. The Claude Stop hook already spawns a context autosave through `generate-context.js` (`autosaveMode` defaults to enabled, outcome recorded as ran/skipped/failed), and that payload carries no `operatorDecisions`. On Claude, gap 1's smallest change is therefore to attach the session's pending queue records to an autosave that already runs, not to build a new writer. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:148] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:603] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:107]
3. Gap 5 is a prose contract, not a detection gap: the detector already emits candidates carrying a stable `key`, and the save instruction then asks the model to decide, per candidate, whether the reply "clearly replies" to the question. The data needed is complete; only the decision is delegated. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] [SOURCE: .skilled/commands/speckit/save.md:70]
4. Gap 6 is one executable filter plus one prose restatement of it: `isProcessQuestion` runs at capture and again on chat candidates, while the save instruction re-states the same exclusion in prose for the model. The two copies live in different languages and only one of them is testable. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:161] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:97] [SOURCE: .skilled/commands/speckit/save.md:72]
5. The parse surface is five store readers, each owning a store-specific `sessionIdOf` and `chatTurnsOf` plus its own record mapping: `sweep-transcript`, `sweep-opencode`, `sweep-devin`, `sweep-codex`, `sweep-pi`. Codex and Pi hold four identically named functions (`parseTranscriptLines`, `sessionIdOf`, `recoveredRecords`, `chatTurnsOf`) with different bodies, which is the clearest merge candidate. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:60] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:39]
6. The shared-detector seam already exists and works: every sweep calls `chatCandidatesFromTurns` from `chat-questions.mjs`, so pairing logic is written once and only *turn extraction* is duplicated across the five stores. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:293]
7. The queue row schema is declared twice in two languages — an object literal in the capture core and a TypeScript `DecisionQueueRecord` interface in the matcher CLI — so a field added to a captured record is invisible to its only save-time consumer until both are edited. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:163] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:17]
8. The consumed log has three implementations: the capture core reads it (`CONSUMED_FILE`, `readConsumedKeys`), the writer reads and appends it (`readConsumedKeySet`, `recordConsumedKeys`), and the matcher CLI declares its own `CONSUMED_FILENAME`, `consumedPath` and `readConsumedLines` while reusing only the writer's append. Three readers of one file, in two languages. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:40] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:782] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:38]
9. There is a second silent adjudicator between capture and the record: the table matcher's answer gate plus weighted score (threshold 0.4, tie margin) decides that an answer is already recorded. The save instruction tells the model to run it, but nothing enforces that it ran, and a match consumes the key without the model seeing the pairing rationale. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:65] [SOURCE: .skilled/commands/speckit/save.md:68]
10. Sweep selection is prose, not detection: the save instruction branches on runtime name and names five scripts, so a sixth runtime adds a sixth prose branch and a sixth reader. No shared entry point resolves "the reader for this session". [SOURCE: .skilled/commands/speckit/save.md:64] [SOURCE: .skilled/commands/speckit/save.md:107]
11. Gap 8 has a save-time consequence that makes it more than cosmetic: the instruction tells the model the Codex and Pi sweeps "print nothing at all when both are empty", and an unreadable transcript now produces the same silence, so the model cannot tell a clean run from a failed read. [SOURCE: .skilled/commands/speckit/save.md:67] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:283]

## Questions Answered

- How many independent storage-format parsers exist across the live adapters and save-time readers, and which can be deleted or merged rather than fixed: five store readers with five turn extractors, one shared pairing detector, a doubly declared queue schema, and a thrice-implemented consumed log.

## Questions Remaining

- Worth closing versus worth documenting, per gap, with the smallest change.
- Which gaps close by deleting a surface instead of adding one.
- Test coverage and the single refactor that collapses the most duplicated tests.

## Ruled Out

- **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding.
- **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for.

## Dead Ends

- Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone.

## Edge Cases

- Ambiguous input: "five save-time readers" versus five sweeps is consistent, but "five live adapters" is four producers (iteration 1). Not reconciled again here.
- Contradictory evidence: none this iteration.
- Missing dependencies: `decision-record-writer.ts` internals were read at signature granularity rather than line by line; the anchor and consumed-log claims rest on the declarations at the cited lines.
- Partial success: the autosave attachment (finding 2) was verified as "the payload carries no operatorDecisions", not by testing an attachment.

## Sources Consulted

- `.skilled/commands/speckit/save.md`
- `.skilled/hooks/decision-capture/lib/chat-questions.mjs`
- `.skilled/hooks/decision-capture/lib/capture-core.mjs`
- `.skilled/hooks/decision-capture/bin/sweep-*.mjs` (five)
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`

## Assessment

- New information ratio: 0.8
- Questions addressed: 1, 2, 5, 6
- Questions answered: 1

## Reflection

- What worked and why: grepping for the process filter's callers settled gap 6 in one call, because a rule stated in prose and in code shows up as exactly one executable call site plus one prose line.
- What did not work and why: expecting the writer to re-validate process questions failed because the writer trusts the payload; the absent guard is itself the finding about where enforcement lives.
- What I would do differently: read the Stop hook's autosave earlier, since finding 2 substantially changes the cost of gap 1 and should have framed the iteration.

## Recommended Next Focus

Synthesis: per gap, worth closing or worth deleting, the smallest change, and the single refactor that collapses the duplicated queue/consumed/reader surfaces — plus the test coverage that would have to move with each change.
