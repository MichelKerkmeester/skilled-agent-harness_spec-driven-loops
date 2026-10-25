# Iteration 10: Goal switch semantics and receiver coverage

## Focus

Close the goal-persistence review across sender sources, receiver rebinding, switch-off behavior, and later-hop environment restoration.

## Findings

1. **P3 — Switch-off tests do not cover a note that already has a goal packet.** The CLI returns before recomputing the field when `SESSION_RELAUNCH_GOAL` is off, and the README explicitly says `prepare` and `keep` then leave the existing field unchanged; that preservation is specified behavior, not a confirmed defect. The current switch-off CLI test starts with a blank note, while the receiver test consumes a populated note with the switch still off. Neither checks reuse of an already-populated note or a switch re-enabled before a later consume. Since each CLI call resolves current environment/config values, an old packet can become usable again if the switch changes between prepare and consume; this timing case is an inference and needs an interleaving test to confirm. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-129,374-399; .skilled/hooks/session-relaunch/README.md:164-174; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125,2477-2516]

## Coverage checked

Claude sender goals come from its session log and are rendered as a start prompt; Pi, OpenCode, Cursor, Devin, and Hermes senders resolve goal records; Codex goal capture remains an intentional, tested limitation. Claude, Pi, OpenCode, Cursor, Devin, and Hermes have receiver binding paths with switch/child/own-goal guards; Hermes uses `HERMES_SPEC_FOLDER`, and tests cover restore of the operator's value after a hop without a packet. The automatic Cursor and Devin loop is unavailable in the shipped command-trigger adapters, so their printed manual claim path does not carry the packet, as recorded in iteration 2. No new receiver defect was found in this pass.

## Reconciliation

Iteration 1 described leaving an existing `goal_packet` untouched under the disabled switch as a defect. The README at lines 164-174 makes that preservation intentional. This report treats it as a coverage gap around reused notes and a switch transition, not as a confirmed defect.

## SCOPE VIOLATIONS

The workflow YAML's post-synthesis spec writeback and strict validation target the parent packet outside this lineage, and the save phase writes a temporary payload under /tmp before updating canonical continuity outside the lineage. The dispatch write boundary forbids those actions. They are deferred and recorded through the synthesis-deferred gateway event; lineage-local synthesis continues. No parent packet or outside temp file is written.

## Sources

- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-129,374-399
- .skilled/hooks/session-relaunch/README.md:164-184,190-193
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125,2477-2516
- .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2634-2720,2833-2887
- .skilled/hooks/goal/lib/goal-core.cjs:1248-1290
- .skilled/hooks/goal/lib/goal-core.test.cjs:1251-1320
- .opencode/plugins/opencode-goal.js:2224-2269
- .opencode/plugins/tests/opencode-goal-handover.test.cjs:68-142

## Iteration outcome

The seven-runtime goal matrix is reconciled. The switch-off preservation behavior is by contract; its reused-note and switch-toggle coverage remains open.
