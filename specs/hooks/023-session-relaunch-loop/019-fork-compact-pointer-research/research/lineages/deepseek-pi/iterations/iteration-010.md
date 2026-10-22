# Iteration 10 — consolidated mechanism, hazard table and fix

## Focus

Consolidate nine iterations of evidence into one statement of the mechanism, one per-path hazard table, the two-clause fix with its tests, the residual risks, and the scope limits this lineage worked under.

## Actions Taken

- Re-read the iteration conclusions and checked each load-bearing claim against the evidence already gathered rather than re-reading sources.
- Reconciled the fire timestamps across three independent artifacts: `relaunch.log`, the fork transcripts' `hook_success` attachments, and the parent transcript's boundary records.
- Fixed the final fix shape: boundary evidence, strict ordering, one delivery per boundary, and the state-write reorder.

## Findings

1. The mechanism in one sentence: a fork inherits the parent's `session_id` and the platform emits `SessionStart` with `source: compact` inside it, so every session-keyed path resolves the parent's state while the hook's only gate is the very value the platform sets for a fork.
2. The hazard table: compact-pointer emits the parent's pointer and zeroes the parent's nudge level; session-prime injects the parent's compact brief and records a compaction boundary for the parent's session; spec-gate shares the parent's gate record; `claim` would accept a fork's claim of the parent's note; stop-arm and the PostToolUse nudge share the same keying but are not dispatched inside forks today.
3. The parent never compacted on 2026-10-21: six compact_boundary records exist, the last at 2026-10-20T16:19:05.871Z, and the parent transcript's last `SessionStart:compact` attachment is 2026-10-20T16:19:06.293Z, while three forks fired the pointer at 14:44, 15:30 and 17:42.
4. The fix is two clauses plus a reorder: emit only when the payload's transcript holds a compact_boundary strictly after the note's `created_at`, record one delivery per (note, boundary) so later fires for the same boundary stay silent, and move `writeState(sessionId, 0)` below every guard.
5. Four tests prove it: boundary-after-note emits and resets the level; no-boundary emits nothing and leaves the level intact; boundary-before-note emits nothing; a missing transcript emits nothing and logs `compact-pointer-skipped reason=no-transcript`.
6. The residual risk after the fix is a parent that compacts, ignores its own pointer and leaves the note open, which clause two covers by suppressing the repeat rather than by re-emitting it to a fork.
7. The fix does not depend on the one value still unproven locally, the fork's `transcript_path`, because the boundary guard behaves identically whether that path names the fork's transcript or the parent's.

## Questions Answered

- None outstanding. All five key questions are answered across iterations 1-9; this iteration only consolidates.

## Questions Remaining

- The fork's exact `transcript_path` value, which no local artifact records. It does not change the recommended fix.

## Next Focus

Synthesis. No further research iteration is planned; the loop stops at the configured cap.

## Ruled Out

- "Add an agent-identity check to the payload": ruled out for the third time by the documented payload contract, which carries no agent field.
- "Disable the pointer for all forks by registering a SubagentStart marker": ruled out as the smallest fix, because it adds a new hook registration where a transcript check inside the existing hook suffices.

## SCOPE VIOLATIONS

Recorded for the record, not executed: the workflow's post-synthesis `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` write into `{spec_folder}/spec.md`, which is outside this lineage's write authority. Both were left unrun; the packet-level synthesis remains the parent run's responsibility.
