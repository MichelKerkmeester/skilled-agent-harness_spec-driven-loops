# Iteration 1: Goal packet sender path

## Focus
Trace sender-side goal discovery, writing goal_packet to the handoff note, switch-off behavior, and the coverage for Codex.

## Actions Taken
Read the shared goal resolver and handoff CLI, checked the note and loop-record data flow, compared the switch-off and Codex tests, and reviewed the phase 027 decision and current handoff guidance.

## Findings
1. **P2 — Turning SESSION_RELAUNCH_GOAL off during prepare or keep can leave an old goal_packet in the note.** The CLI returns before it calls the note writer when the switch is off, so a previously populated note is not cleared [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:383-399]; the lower-level writer would remove the field if it received an empty packet [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:703-713]. The current switch-off tests start from a fresh note with no goal_packet and prove only that no new field is added [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:143-157]. Claim and consume suppress a packet while the switch remains off [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2477-2512], but there is no test for re-preparing a populated note with a per-invocation switch-off and then claiming it when the switch is on again.
2. **Known capability gap, intentional and test-covered — Codex cannot put a goal packet in a handoff.** The resolver supports Claude logs and goal records for OpenCode, Pi, Devin, Cursor, and Hermes, while Codex returns an empty packet [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:662-691]. The phase 027 decision explicitly deferred Codex until its goal store can map a thread goal to a packet, and the test pins the empty result [SOURCE: specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/implementation-summary.md:57; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090-2100]. This is a documented runtime limitation, not a regression or a missing test.

## Questions Answered
- Partial: sender-side note creation and the Codex boundary are established. The full seven-runtime persistence question remains open until receiver rebind and manual first-launch paths are checked.

## Questions Remaining
- Do all receiver adapters bind the consumed packet, and what happens on runtimes whose printed manual command starts a new process?
- Are SESSION_RELAUNCH_GOAL_PACKET and HERMES_SPEC_FOLDER cleared or restored correctly across later hops?

## Ruled Out
- The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression.
- The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516].

## Dead Ends
- None.

## Edge Cases
- Parent packet spec mutation is ambiguous because the required Research Context anchor is absent; see SCOPE VIOLATIONS below.
- steer.md was absent at iteration start.

## Sources Consulted
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:374-399
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:662-713
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:143-157
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2477-2516
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090-2100
- specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/implementation-summary.md:57
- .skilled/commands/speckit/handoff.md:97

## Assessment
- New information ratio: 0.75
- Questions addressed: sender-side packet capture; switch-off stale-note behavior; Codex sender limitation
- Questions answered: none of the four strategy questions in full
- Novelty: one new switch-off defect; one known Codex limitation corroborated against its decision and test

## Reflection
- What worked and why: comparing the producer's early return with the note writer and test setup exposed the untested stale-field case.
- What did not work and why: the phase records describe intended behavior but do not replace tracing the current receiver path.
- What I would do differently: split receiver binding from sender resolution and inspect manual command construction directly.

## Recommended Next Focus
Inspect Claude, Pi, OpenCode, Codex, Cursor, Devin, and Hermes receiver binding, including switch-off cleanup, manual first launches, and environment restoration.

## SCOPE VIOLATIONS
The init workflow's pre-init branch would write the normalized topic and Research Context note into the parent packet spec [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:502-518], then run strict validation outside this lineage [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:530-534]. The parent spec has an Open Questions anchor but no Research Context anchor [SOURCE: specs/hooks/023-session-relaunch-loop/spec.md:185-191]. The workflow recorded spec_check_result and spec_mutation_conflict through the append gateway; this worker skipped the parent-spec mutation and validation and continued under the dispatched write boundary.
