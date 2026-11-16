# Iteration 4: The AI_SESSION_CHILD Leak Into Launched Sessions

## Focus

The one known limit not yet examined: `AI_SESSION_CHILD` reaching a launched sender or receiver. Read the flag's consumer, the wrapper's environment handling, and the live-hop harness that produced the base1 runs.

## Actions Taken

- Read the nudge decision's child-session branch and the helper it calls.
- Read the wrapper's environment scrubbing.
- Read the live-hop harness's `tmux` launch line and its unset list.
- Confirmed which paths honour the flag and which do not.

## Findings

1. The child flag is a single environment string comparison, and it is the first gate in the nudge decision. `relaunchSessionIsChild` returns true only when `AI_SESSION_CHILD` is exactly `1`, and `nudgeDecision` returns `child-session` before it looks at the fill ratio, the threshold, the hop cap or any record. A leaked flag therefore does not weaken the nudge; it removes it. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:1191]

2. The wrapper does not scrub `AI_SESSION_CHILD` from the environment it launches a runtime with. Its unset lists cover `SKILLED_LOOP_*`, `SESSION_HANDOVER_GOAL_PACKET` and `SKILLED_LOOP_CLAIM_SEED`; the child flag is not among them, so a receiver inherits it from whatever launched the wrapper. [SOURCE: .skilled/bin/skilled-loop:911]

3. The live-hop harness unsets loop and Claude variables but not the child flag, so a harness run started from a dispatched worker produces a sender that is never nudged. The launch line unsets `SKILLED_LOOP_HOPS`, `SKILLED_LOOP_ID`, `CLAUDECODE` and `CLAUDE_CODE_SESSION_ID`, then adds the runtime-specific `unset_envs`; `AI_SESSION_CHILD` is absent from both lists. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:63]

4. The base1 runs prove the leak was absent there, not that it is impossible. Both senders were nudged and prepared, which cannot happen with the flag set, so those two runs started from a shell that did not carry it. A rerun from inside a dispatched worker, a deep-research executor or a fan-out child would measure a session that never hands over. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log:1]

5. The damage is asymmetric: the sender loses the nudge, but the claim path does not check the flag. `seedInstructions` parses the seed and builds the claim text with no child check, so a receiver that inherits the flag still receives and can still claim a note. The leak therefore breaks the start of a hop, not the claim of one already started. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:389]

## Ruled Out

- "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all.
- "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through.

## Dead Ends

- Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace.

## Edge Cases

- Ambiguous input: "leaking into test sandboxes" could mean the harness or the wrapper. Both are true and both are cited; the wrapper is the one that also affects live hops.
- Contradictory evidence: none. The flag's consumer, the wrapper's unset list and the harness's launch line agree.
- Missing dependencies: none.
- Partial success: none.

## Questions Answered

None of the five key questions is closed by this iteration alone; it supplies the last known limit that the fifth question lists.

## Questions Remaining

1 of 5 remains open: the concrete fix set for the known limits.

## Sources Consulted

- .skilled/hooks/goal/lib/goal-core.cjs:1191
- .skilled/hooks/session-handover/lib/nudge.cjs:704
- .skilled/hooks/session-handover/lib/nudge.cjs:389
- .skilled/bin/skilled-loop:911
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:63
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log:1

## Assessment

- New information ratio: 1.0
- Questions addressed: the AI_SESSION_CHILD limit
- Questions answered: none in full

## Reflection

- What worked and why: reading the consumer before the producer. Seeing that the flag is the first gate, not a modifier, turned an environment-hygiene note into a "the hop never starts" failure.
- What did not work and why: assuming the harness sanitized its environment because it named four variables. It names exactly four, and the child flag is not one of them.
- What I would do differently: for every environment-flag finding, list every unset site and diff it against the flag's consumer; a partial sanitizer reads like a complete one.

## Recommended Next Focus

Iteration 5: assemble the fix set. For each failure mode recorded in iterations 1 to 4, name the file and function that must change and the observable that would prove the fix, then answer the known-limits question in full.
