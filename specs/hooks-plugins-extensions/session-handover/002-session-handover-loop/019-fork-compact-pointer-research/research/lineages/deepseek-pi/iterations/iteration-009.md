# Iteration 9 — attacking the proposed fix

## Focus

Try to break the boundary guard: enumerate every residual path where a fork still receives the parent's pointer, and decide whether one more small clause is needed.

## Actions Taken

- Traced the residual case "parent compacted for real, then spawned a fork" through `openNotePathFor` and the boundary test.
- Re-read the note's `created_at` (2026-10-21T14:07:33.138Z) against the boundary timestamps for ordering-ambiguity risk.
- Checked whether a delivery marker could live inside `nudge-<session>.json` without breaking the existing assertion.
- Investigated who wrote the compact cache for the 15:30 fork by scanning the parent transcript for records at 15:29.

## Findings

1. Residual window A: when the parent genuinely compacts after writing a note and never claims it, every later fork still finds a boundary and still receives the parent's pointer, so the boundary guard narrows the failing class rather than closing it.
2. Residual window B: a boundary and a note created within the same second make ordering ambiguous, and a "boundary at or after the note" comparison resolves that ambiguity in the fork's favour, so the guard should require the boundary to be strictly after the note's `created_at`.
3. A second, equally small clause closes window A: record one delivery per (note path, boundary timestamp) in the relaunch state directory and skip a repeat, which suppresses the second and third fork fires while letting the parent's next genuine compaction re-arm the pointer.
4. The delivery marker must be its own state file rather than a field inside `nudge-<session>.json`, because the existing emitting test asserts that file deep-equals `{level:0}` and widening the record would break that assertion without adding coverage.
5. A compact cache for the parent session existed with `cachedAt` 2026-10-21T15:29:16.367Z while the parent transcript carries no record at 15:29 at all and no boundary on 2026-10-21, so the presence of a compact cache is not evidence that a compaction happened.
6. The `writeState(sessionId, 0)` reorder is required whichever clause lands: without it every suppressed fork fire still resets the parent's ladder, so the suppression would be visible only in stdout and invisible in state.

## Questions Answered

None new. This iteration converts the fix from "suppresses the observed fires" to "suppresses the class, with one named residual and a second clause for it".

## Questions Remaining

- Whether the second clause belongs in the same change or a follow-up, and the final consolidated recommendation.

## Next Focus

Iteration 10: consolidate the mechanism, the per-path hazard table, the two-clause fix, the test set, the residual risks and the scope note into the final research report.

## Ruled Out

- "The boundary guard alone is sufficient": ruled out by residual window A, which the guard structurally cannot see.
- "Store the delivery marker in the note frontmatter": ruled out because the note is the parent's artifact and the marker would then travel with it into a future claim, confusing `status` semantics.

## SCOPE VIOLATIONS

None. Reads covered the parent transcript, hook source and tests; writes stayed inside this lineage.
