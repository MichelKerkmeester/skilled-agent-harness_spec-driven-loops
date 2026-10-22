# Iteration 7 — fail-closed or fail-open, with evidence

## Focus

Decide the missing-transcript branch by evidence rather than preference: census every caller of compact-pointer, find every adapter that carries the same pointer, and weigh the cost of each wrong answer.

## Actions Taken

- Listed the per-runtime session-relaunch adapters and grepped for any non-Claude compact-pointer or `afterCompaction` producer.
- Read the session-prime source branch that mirrors the pointer's decision, including its directive-lifecycle notification.
- Read `directive-lifecycle-boundary.ts` to see what that notification carries.
- Re-read the three compact-pointer tests to see which ones would change meaning under a fail-closed branch.

## Findings

1. `compact-pointer` exists only in the Claude adapter — there is no codex, pi, hermes or opencode equivalent — so the fix is one adapter plus its tests, and the pointer's own blast radius is Claude-only.
2. Fail-closed on a missing transcript is the asymmetric choice: a wrong emission injects a false "you were compacted" and can get the parent's note claimed, while a wrong suppression only withholds a reminder whose note stays open and reclaimable.
3. Fail-closed changes the meaning of the existing emitting test, which passes a payload with no transcript at all; the fix must extend the payload factory to carry a transcript that holds a boundary, so the emitting path stays covered rather than silently deleted.
4. `session-prime` forwards the payload's source to the directive-lifecycle store as `{session_id, boundary}`, so a fork's SessionStart(source=compact) records a compaction boundary against the parent's session id in a second subsystem.
5. Every one of these writes is keyed by session_id, so a fork can silently rewrite the parent's nudge level, its directive boundary and its gate state; no part of the SessionStart family records which agent performed the write.

## Questions Answered

None new. This iteration settles the branch decision and widens the recorded blast radius.

## Questions Remaining

- The exact test set that proves the fix and the suppression side-effect property.

## Next Focus

Iteration 8: write the concrete test set — input, expected stdout, expected state-file mutation — for the boundary-present, boundary-absent and transcript-missing cases, and name where each assertion lands.

## Ruled Out

- "Apply the same fix to every runtime adapter": ruled out because no other runtime has a compact pointer; the shared hazard is session-keyed state, which is a different finding with a different fix.
- "Fail open on a missing transcript to protect the parent path": ruled out because the parent path is documented to carry `transcript_path`, and a silent fail-open reproduces exactly the observed misfire.

## SCOPE VIOLATIONS

None. Reads covered adapters, hook source and the directive-lifecycle bridge; writes stayed inside this lineage.
