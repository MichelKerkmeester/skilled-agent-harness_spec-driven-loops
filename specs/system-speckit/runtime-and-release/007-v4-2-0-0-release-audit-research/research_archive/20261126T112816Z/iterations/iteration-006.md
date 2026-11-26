# Iteration 6: Q4 session hooks and spec tooling, diff-first

## Focus
Q4: the in-window hunks for the Claude Stop decision auto-record (`autoRecordDecisions`, commit `d57563b175a`), tail packet detection (`collectTailSpecFolders`, same commit), and nested sub-tracks in create, validate and relocate (commit `b0b3c8d9bf1`). The documented limits (Claude only, exactly one tail packet, late-switch misfiling, rows with no reason) are excluded. Interpretation: look for defects in how the one-packet rule is counted and in what happens around the write, not in the rule itself.

## Actions Taken
1. `git log v4.1.0.0..v4.2.0.0` over `session-stop.ts` and `.skilled/hooks/decision-capture/`, then `git show d57563b175a` for the full `session-stop.ts` hunk.
2. Read the decision-record writer's write path, row insert and consumed-key append (`decision-record-writer.ts`), which the new Stop code calls.
3. Reproduced the tail normalizer against the compiled hook: imported `dist/hooks/claude/session-stop.js` and ran its exported `detectSpecFolder` (same `collectTailSpecFolders` and `normalizeSpecFolderPath`, no punctuation trim) on scratch JSONL transcripts written with `JSON.stringify`, the way Claude writes them. Scratch files only, under the session scratchpad.
4. Read the live auto-recorded rows in this packet's `decision-record.md` (read only).
5. `git show b0b3c8d9bf1` for `track-roots.mjs`, then grepped the create, validate and relocate hunks for depth logic and read `validate.sh`'s sub-track detection and walk.

## Findings
1. **P2 (`d57563b175a`): the one-packet check reads a packet path that ends at a JSON escape in the transcript wrong, so answers can land in the parent phase or in the only other packet named.** The transcript is JSONL, so a newline after a path is stored as the two characters `\n`. The path regex stops only at whitespace and quotes [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:49], so the match keeps the trailing `\n`. The leaf segment then fails `^\d{2,3}(?:--|-)[\w-]+$` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:52], and the normalizer breaks at it, keeping the segments before it [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:881]. The auto-record trim strips `.,;:!?)]}>` but not a backslash [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:831]. Reproduced on the compiled detector: a transcript line `A) specs/hooks-plugins-extensions/decision-capture/001-decision-capture/016-stop-hook-auto-record\nproceeding` resolves to the parent `.../001-decision-capture`, which has a `spec.md`, so the `no_spec` guard does not catch it [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:205]. A top-level packet ending the same way drops out entirely. A transcript naming this packet and `specs/mcp/mcp-tooling/001-foo\n` reports one packet, not two, which defeats the comment's stated intent that "a second packet named that way still counts against the one-packet rule" [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:808]. The auto-record path shares the normalizer and the trim does not touch `\`, so it gives the same result. That part is [INFERENCE: based on the shared code at session-stop.ts:829-835 and the compiled run], because `autoRecordDecisions` itself was not run (it writes consumed keys into the real state directory). The normalizer predates the window and the autosave retarget has the same flaw. The in-window change is that a decision write now depends on it.
2. **P2, inferred, not reproduced (`d57563b175a`): Stop's auto-record races a concurrent save on the same packet, and the answers that lose the race are still marked consumed.** `writeDecisionRecord` reads the record [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:787], rebuilds it in memory and writes it with temp-file-then-rename [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:533] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:819], with no lock. The writer has no lock anywhere. The Stop hook then appends the consumed keys [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:215] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:216]. The save workflow does the same sequence [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:795] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:805]. Suppose a second session's Stop or save writes the same `decision-record.md` between one writer's read and its rename. The rename then drops the other writer's rows, while both writers append their keys to the consumed log. The dropped answers are then never offered again by the nudge or a later save. This is a lost-update window, not a confirmed occurrence. Stop runs at every turn end, which makes it wider than it was when only explicit saves wrote. To confirm, run two writers in a loop against one scratch folder and check whether every consumed key's id is still in the record.
3. **P3 (`d57563b175a`): if the consumed-key append fails after the record write, the next Stop rewrites the row and drops a reason a person added.** The record write and the consumed append are two steps [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:215] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:216]. A throw in the second leaves the answers pending, and the comment says any failure does [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:162]. The next Stop reuses the id through `keyToId` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], so no duplicate row appears. But `insertDecisionRow` replaces the existing row with `Recorded automatically: ...` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:323], wiping the documented "a person edits the row to add one" edit. Until the append succeeds, the nudge also keeps asking for a save the record already holds [INFERENCE: based on session-stop.ts:162 and the pending filter at session-stop.ts:184].

## Ruled Out
- Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936].
- The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43].
- Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read.

## Dead Ends
- None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: `autoRecordDecisions` was not run end to end, because it writes consumed keys into the real state directory. The exported `detectSpecFolder` stood in, since it shares the tail reader and normalizer.
- Partial success: finding 2 is inferred from code, and relocate was read shallowly.

## Sources Consulted
- `git show d57563b175a` (session-stop.ts hunk), `git show b0b3c8d9bf1` (track-roots.mjs, create.sh, validate.sh, relocate.mjs hunks)
- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:49-53, 156-221, 765-771, 829-835, 856-890
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:313-338, 478-540, 748-822, 920-952
- .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:795-805
- .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:191-256, 425-455
- .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js (compiled `detectSpecFolder` probe)
- specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37-43, 54-171

## Assessment
- New information ratio: 1.0
- Questions addressed: Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- Questions answered: same, with a verdict. Two P2s (one reproduced, one inferred) and one P3, all in the Stop auto-record. No defect was found in the sub-track reader or in validate at two levels.

## Questions Answered
- Q4: yes. The auto-record's one-packet count misreads JSON-escaped path endings (P2, reproduced). Its unlocked record write can lose answers that are still marked consumed (P2, inferred). A failed consumed append lets the next Stop overwrite an edited row (P3). The sub-track tooling read clean.

## Questions Remaining
- Q5: operator UX across the new v4.2.0.0 commands and hooks (silent failures, misleading messages, unsafe defaults, dead ends).

## Reflection
- What worked and why: the probe through the compiled exported detector, fed transcripts built with `JSON.stringify`, exposed a gap the unit tests miss. The tests feed raw text, not JSON-escaped lines.
- What did not work and why: the race could not be shown without running the writer against real state, so it stays an inference.
- What I would do differently: build a scratch project root holding its own `.skilled/hooks/decision-capture` copy, so `autoRecordDecisions` can run end to end without touching real state.

## Recommended Next Focus
Q5 operator UX, diff-first. Read the user-facing messages the new v4.2.0.0 commands and hooks print: Stop nudge and auto-record log lines, doctor overlay refusals, the `--extend` and fan-out stop messages, `create.sh` sub-track errors. Look for silent failures, such as `autoRecordDecisions` returning `failed` with only a hook-log line. Also look for misleading text and dead ends. Optional follow-ups: a scratch-root end-to-end run of `autoRecordDecisions` to confirm finding 2, and a deep read of `relocate.mjs` at two sub-track levels.
