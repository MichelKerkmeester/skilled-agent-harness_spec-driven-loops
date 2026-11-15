# Iteration 6 — maintainability

## Dimension

Maintainability: wrapper exit and decision contract, cwd/model/flag carry, seed generation, and receiving-session claim.

## Files Reviewed

- .skilled/bin/skilled-loop:112-120, 169-239, 423-514
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:444-479, 481-495, 536-575
- .skilled/hooks/session-relaunch/lib/nudge.cjs:191-235
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:329-354, 485-505, 525-542
- .skilled/hooks/session-relaunch/README.md:23-33
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:930-965, 1049-1084, 1251-1275, 1596-1645
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-26

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Correction to Iteration 3

LUNA-FANOUT-P1-002 is retracted and recorded as resolved in this iteration. Iteration 3 observed that preparePending does not serialize spec_folder, but incorrectly concluded that the receiver therefore loses the Gate 3 answer. The live consume path reads the handoff note at session-relaunch.cjs:536-555, accepts its spec_folder, and emits it in the consumed JSON at :572-573. skilled-loop reads that emitted field at :507-510, adds it to the seed, and the receiver parses it at nudge.cjs:191-204. The claim that no alternate source carries the answer was incorrect. The receiving claim also checks that the note remains open and then marks it claimed at session-relaunch.cjs:481-495 and relaunch-core.cjs:525-541.

## Review Evidence

- The relaunch decision serializes the armed record's cwd and handoff path. The wrapper rejects unusable paths, restores cwd, preserves exit 130 with a manual claim command, consumes only an open note, and builds the receiving seed from the consumed record.
- Runtime arguments are rebuilt according to the documented adapter matrix: model for each runtime; Pi and Hermes provider; Claude and Pi name; Pi extension flags; Codex no-daemon. The inspected wrapper tests cover exit 130, Codex no-daemon behavior, flag-like values, manual-command parity, and runtime-specific argument carry.
- The receiving seed parser validates the absolute note path and parses the packet or Skip suffix. The receiving claim rejects non-open notes before changing status.
- No additional wrapper, carry, or receiving-claim defect was identified in this pass.

## Traceability Checks

- spec_code: the receiver and wrapper path was traced against the handover requirement; no mismatch found in this dimension.
- checklist_evidence: deferred to a later traceability pass.
- skill_agent: deferred to iteration 9 for the handoff command contract.
- agent_cross_runtime: inspected documented argument carry across Claude, Pi, OpenCode, Codex, Cursor, Hermes, and Devin.

## Edge Cases and Ruled Out

- Missing spec_folder in the pending record does not drop the Gate 3 answer when the handoff note remains readable: consume derives the value from the note itself.
- A consumed record whose note is not open declines the relaunch and prints the manual claim command.
- Exit 130 declines automatic relaunch and preserves the manual claim path.
- Codex receives one --no-daemon argument on relaunch; operator-provided --no-daemon is not duplicated.

## SCOPE VIOLATIONS

- scope_violation: the workflow step_graph_upsert would write shared coverage-graph storage outside this lineage; it was skipped under the lineage-only write boundary.
- scope_violation: the workflow step_graph_convergence would append observability data to the shared graph database; no write-mode graph command was run. Graph work remains graphless_fallback under the configured max-iterations policy.

## EXECUTION CONFLICT

The reducer strategy continues to label some deferred directions as BLOCKED after one pass. The lead steer requires coverage of all runtimes and chain stages, so this iteration follows the steer and continues the review.

## Next Focus

Trace shell-shim wrapper discovery and argument classification from the starting directory, including a repository whose .skilled directory is a symlink to this checkout, TTY handling, and Hermes plugin environment.

Review verdict: PASS

