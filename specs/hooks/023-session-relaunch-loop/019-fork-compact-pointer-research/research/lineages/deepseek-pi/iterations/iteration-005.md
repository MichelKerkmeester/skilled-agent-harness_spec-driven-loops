# Iteration 5 — transcript consumption and the missing discriminator

## Focus

Read `stop-arm.mjs` and `context-usage.cjs` to see how each adapter consumes `transcript_path` and `session_id`, and try to recover the fork's `transcript_path` value from local records.

## Actions Taken

- Read `stop-arm.mjs` lines 80-170: the arm path, its env gate, and what it passes to the killer.
- Read `readClaudeFill` in `context-usage.cjs:120-137`.
- Searched the Claude state tree outside `projects/` for any stored `subagents/agent-` path.
- Counted sidechain records in the parent transcript to see whether a fork writes into the parent file.

## Findings

1. `stop-arm` gates its arm path on `SKILLED_LOOP_ID`, requires `payload.transcript_path`, and hands that path to the killer it spawns, so if Stop dispatch ever reached a fork the killer would watch a fork transcript while arming the parent's loop record.
2. `context-nudge` derives the fill ratio from `payload.transcript_path` and persists the level under `payload.session_id`, the same parent-state write compact-pointer performs at level 0 — the difference is only which level it writes.
3. No local record of a fork's `transcript_path` exists: a search of the Claude state tree outside the project transcripts found no stored `subagents/agent-` path, so neither a fork's own jsonl nor the parent transcript can be confirmed as the value a fork's payload carries.
4. The parent transcript contains zero sidechain records, so a fork never writes its turns into the parent file; the fork transcript and the parent transcript are disjoint files, which means a transcript-based check reads exactly one of them and never a blend.
5. `readClaudeFill` already filters `entry.isSidechain !== true`, so the repo's transcript reader was written expecting sidechain entries to be possible in a transcript it reads — the notion that a transcript can contain fork turns already exists in the code, but no reader exposes it to the compact path.

## Questions Answered

None new. This iteration establishes a negative result that constrains the fix.

## Questions Remaining

- The smallest correct fix, given that `transcript_path` may name either transcript.
- The test that would prove the fix.

## Next Focus

Iteration 6: design the candidate fix against the existing adapter test harness — read `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` to see how compact-pointer is exercised, and check whether a compaction-evidence check can reuse an existing transcript reader.

## Ruled Out

- "Key the fix on transcript_path matching a `/subagents/` segment": not refuted, but unprovable from local evidence, and it would be wrong if the payload names the parent transcript. Recorded as a candidate with a known risk rather than the recommendation.
- "Fork writes its turns into the parent transcript, so one path covers both": ruled out by the zero sidechain count in the parent transcript.

## SCOPE VIOLATIONS

None. Reads covered hook libraries and Claude state outside `projects/`; writes stayed inside this lineage.
