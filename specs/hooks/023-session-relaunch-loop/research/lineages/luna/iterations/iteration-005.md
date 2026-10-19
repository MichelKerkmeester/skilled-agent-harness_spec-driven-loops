# Iteration 5: Core privacy boundary and phase 008 evidence

## Focus

Make a final pass over the handoff directory's filesystem boundary and compare phase 008's closure claims with the current helper, CLI containment logic, tests and standards.

## Actions Taken

- Re-read the handoff directory creation and planned-path code, the CLI's realpath checks and the focused directory-permission test.
- Compared those paths with phase 008 acceptance criterion AC-003, its implementation summary and the README's path-validation guidance.
- Checked the filesystem mutation requirements in the universal sk-code-skilled checklist. No tests or validators were run.

## Findings

1. **LUNA-R5-001 — Phase 008 overstates the handoff directory's privacy guarantee (CONFIRMED code/documentation gap; corroborates LUNA-R1-001).** The summary says the nudge creates an owner-only directory and that a failed create makes the model's write fail visibly; however, `ensureHandoffDir` suppresses mkdir/chmod errors and returns the path anyway. The CLI checks that a note is under the resolved handoffs directory, but never verifies that this resolved directory is beneath the canonical repository root. A pre-existing symlink can therefore redirect the note and chmod outside the repository, and a writable non-private target can still accept the note. The focused test checks only that a fresh directory has mode 0700. Reject symlinked path components and repo escapes, verify ownership and mode before returning a note path, add outside-symlink and chmod-failure cases, and revise the phase summary/README to describe the verified guarantee. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:219-225] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:267-273] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-190] [SOURCE: .skilled/hooks/session-relaunch/tests/nudge.test.cjs:495-506] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/acceptance-criteria.md:56] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md:52] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md:91] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:101-108]

## Questions Answered

- **Does the core preserve session ownership, file privacy, time-boundary and lock invariants after phase 008?** The inspected filesystem path does not establish the file-privacy invariant for symlink or chmod-failure cases. The timestamp and lock changes were reviewed statically in Iteration 1; no tests were run in this lineage.

## Questions Remaining

- Runtime verification of the symlink and chmod-failure cases remains open because this lineage does not run tests.
- The document quality-control extractor was not run, so no structural checklist result or DQI score is claimed.

## Workflow Conflicts

- The Iteration 5 completion event was committed to the event ledger (sequence 6), but the append gateway rejected projection with `PROJECTION_FAILED: Projection replace would drop keys from the existing config row`. The canonical state JSONL remains at its initial config record and Iteration 1 only. I did not bypass the gateway's state-writing contract; synthesis will report this projection conflict.
- The dispatcher requires canonical state `findingsCount` to equal the narrative count, while the deep-research delta and projection contracts omit `findingsCount`. This remains a contract mismatch; per-iteration deltas carry the exact count, but the projection gateway is the only permitted state writer.

## Next Focus

Synthesize all five iterations, consolidate the repeated privacy-boundary evidence, preserve confirmed versus inferred status, and record the required `maxIterationsReached` stop reason.
