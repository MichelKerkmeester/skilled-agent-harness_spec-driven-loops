# Iteration 3 — what a fork's pointer call mutates

## Focus

Read `lib/nudge.cjs` in full: note selection, the pending-handoff guard, the seed text, and the nudge-level state file. Question: what does a fork firing compact-pointer actually touch on the parent's behalf?

## Actions Taken

- Read `nudge.cjs` sections 276-360 (note directory, `openNotePathFor`, `plannedNotePath`), 405-470 (`armedRecordStillCurrent`, `handoffPending`, `insideLoop`), 505-560 (`stateFilePath`, `readState`, `writeState`).
- Read `seedText` (185-235) for the exact sentence the forks quoted.
- Read `claimHandoff` in `relaunch-core.cjs` to see whether the claim command validates the caller against the note's owner.
- Listed the relaunch state directory for `nudge-<session>.json` and read the parent session's file.

## Findings

1. `openNotePathFor` selects a note by filename suffix `-<first 8 characters of session_id>.md` plus `status: open` and a frontmatter `session_id` match, so a fork carrying the parent's session id resolves the parent's open note and no agent check exists anywhere on that path.
2. The only guard that could have suppressed the fork fire, `handoffPending`, returns false unless `SKILLED_LOOP_ID` is set, and the parent's note carries an empty `loop_id:` because prepare ran outside the wrapper, so the guard short-circuits and the pointer is emitted.
3. `seedText({ afterCompaction: true })` asserts "This session was compacted after it wrote a handoff note", a false claim when the emitter is a fork that never compacted, and it produces exactly the claim invocation the two fork replies refused.
4. The hook calls `writeState(sessionId, 0)` before any fork-shaped guard, and `stateFilePath` builds `nudge-<session>.json` from the payload session id, so each fork fire rewrites the parent's own nudge ladder to level 0 — the parent then nudges again sooner than its real context fill warrants.
5. `claimHandoff` validates only that the supplied session id is well formed and that the note is open; it never compares the caller's session against the note's `session_id`, so a fork passing `--session <parent>` would have claimed the parent's note successfully and marked it claimed.
6. Note identity is only eight characters of session id, so the note lookup's own filter is coarser than the note's full session identity — a second session whose id shares those eight characters would match the same note.

## Questions Answered

- Which hook paths (nudge, note-keep, claim, Stop-arm) key off session_id and therefore share the fork hazard?

## Questions Remaining

- Whether the Stop-arm and the UserPromptSubmit/PostToolUse nudge paths fire inside forks at all, and what they would do there.
- Whether a fork's transcript_path differs from the parent's — the deciding detail for a transcript-based fix.
- The smallest correct fix and its proof test.

## Next Focus

Iteration 4: test the remaining claude adapters — `context-nudge.mjs` and `stop-arm.mjs` — against the fork transcripts to see whether they fired in the same forks, and read their session and transcript handling.

## Ruled Out

- "The fork is protected because a model refuses the instruction": ruled out as a control, since `claimHandoff` would have accepted the claim; the refusals observed were model judgment, not an enforced guarantee.
- "The pending-handoff guard covers the unwrapped case": ruled out because the guard is keyed on `SKILLED_LOOP_ID` and the observed note has an empty `loop_id`.

## SCOPE VIOLATIONS

None. Reads covered hook libraries, the relaunch CLI and the shared state directory; the only writes were this lineage's iteration artifacts.
