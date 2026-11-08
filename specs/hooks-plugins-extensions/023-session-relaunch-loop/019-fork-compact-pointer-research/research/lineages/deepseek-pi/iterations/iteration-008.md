# Iteration 8 — the test set that proves it

## Focus

Turn the fix into a concrete, runnable test set: exact payload, exact expected stdout, exact expected state mutation, and where each assertion lands.

## Actions Taken

- Re-read the harness factory `createSandbox`, `runAdapter`, `writeTranscript`, `writeOpenNote`, `compactPayload` (`claude-adapters.test.cjs:20-69, 861-905`).
- Grepped the whole hook and spec-kit runtime source for any existing `compact_boundary` reader to reuse.
- Checked which helpers `context-usage.cjs` exports.

## Findings

1. No code in the hooks tree or the spec-kit runtime reads a `compact_boundary` record today, so the guard needs a new small reader and cannot borrow correctness from an existing tested one.
2. `latestTailEntry` is private to `context-usage.cjs` and not exported, so a boundary reader either exports that helper or reads the transcript tail on its own — the cheaper option is a dedicated tail scan in the relaunch lib.
3. Test A (boundary newer than the note): payload `{hook_event_name: 'SessionStart', source: 'compact', session_id, transcript_path}` where the transcript holds a boundary after the note's `created_at`; expects the compacted-session context and the claim command, and expects the nudge file reset to `{level:0}`.
4. Test B (boundary absent — the reproduced fork case): the same payload with a transcript that has no boundary; expects empty stdout and the nudge file still `{level:2}`, which is the regression test for the observed misfire and for the side-effect reorder.
5. Test C (stale boundary): a boundary timestamped before the note's `created_at`; expects empty stdout, because a compaction that predates the note cannot be the one that lost the note's detail.
6. Test D (missing transcript): no `transcript_path` in the payload; expects empty stdout and a `compact-pointer-skipped reason=no-transcript` row in `relaunch.log`, so a silent disable is impossible.
7. The harness needs one new fixture helper that writes a transcript containing a `{"type":"system","subtype":"compact_boundary","timestamp":...}` record, because `writeTranscript` emits a single assistant record with no timestamp control.

## Questions Answered

- What test or observable evidence would prove the fork misfire is gone?

## Questions Remaining

- Whether the boundary guard still lets a fork through after a genuine parent compaction, and how large that residual window is.

## Next Focus

Iteration 9: attack the fix — enumerate every residual path where a fork still receives the pointer, and decide whether a second clause is needed to close the repeat-fire window.

## Ruled Out

- "Reuse the existing transcript reader": ruled out because nothing in the tree parses compaction boundaries and the tail helper is not exported.
- "Assert on the log row alone": ruled out as the primary evidence, because a log row proves a decision was recorded, not that the parent path still emits.

## SCOPE VIOLATIONS

None. Reads covered the test harness and runtime source; writes stayed inside this lineage.
