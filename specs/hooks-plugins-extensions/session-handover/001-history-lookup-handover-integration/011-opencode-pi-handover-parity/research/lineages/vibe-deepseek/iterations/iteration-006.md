# Iteration 6: The claim-to-complete lifecycle and the question-hold guard

## Focus

Why a claimed note can stay claimed forever. The Pi run's missing fifth step is `noteClosed`, and the receiver's own words say it was holding the close open for an operator answer. In an unattended hop no operator answers, so this iteration asks what closes a note, what refuses to close one, and whether anything expires a claim.

## Actions Taken

1. Read `completeHandoff` and its status precondition.
2. Read `noteState` and the status vocabulary it accepts.
3. Grepped the handover code for any stale or expiry sweep over notes.
4. Read `questionHoldReason` and the Pi extension's question-tool guard.
5. Read the claim command's completion instruction.
6. Re-read the Pi receiver's closing paragraph against the guard's intended behaviour.

## Findings

1. `completeHandoff` throws unless the note's status is exactly `claimed`. A note in any other state cannot be completed, and a claimed note can only be completed by whoever holds it. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs]

2. `noteState` accepts exactly `missing`, `invalid`, `open`, `claimed` and `done`. There is no `expired` or `abandoned` state, so a claim that is never closed has no representation other than `claimed`. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:407]

3. Nothing expires a claimed note. The only stale sweeps in the handover code belong to the killer and cover lock files and takeover mutexes, not handoff notes. [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:317]

4. `questionHoldReason` blocks a question only while the session's record is armable, and the Pi extension applies it to two tool names: `question` and `ask_user_question`. A receiver that asks in prose is never blocked. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:188]

5. The Pi receiver asked in prose: `So: what was the side word? Once you give it, I'll close the note.` The guard therefore never fired, and the note stayed `claimed` with the close deferred to an answer that could not arrive. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:333]

6. The claim output's completion instruction is conditional: `When the remaining work is done, run <complete> to close this note.` A note whose Remaining work requires an operator answer makes completion unreachable in an unattended run, and the receiver is following the instruction exactly. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:742]

7. The guard's own text already names the correct behaviour: end the turn and put the question in the handoff note for the next session, or cancel the hand-over first. The Pi receiver did neither, and nothing detected that. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs]

## Ruled Out

- "The note stayed claimed because the receiver crashed." The pane shows a complete, coherent reply and a deliberate decision to hold the close.
- "The question-hold guard should have blocked the ask." The guard covers question tools only, and the receiver asked in prose.

## Dead Ends

- Looking for a timeout that closes a stale claim. There is none in the handover code, so the fix has to add one rather than tune one.

## Edge Cases

- Ambiguous input: "the note was left claimed" could mean the receiver forgot to complete or chose not to. The pane shows a choice, so the second reading holds.
- Contradictory evidence: none.
- Missing dependencies: no test asserts the prose-ask case, so the gap is read from the guard's tool-name set.
- Partial success: the guard's intended behaviour is documented in its own text but not enforced for prose.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:407`
- `.skilled/hooks/session-handover/lib/killer.cjs:317`
- `.skilled/hooks/session-handover/lib/nudge.cjs`
- `.skilled/hooks/session-handover/pi/session-handover.ts:188`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:742`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:333`

## Assessment

- New information ratio: 0.70
- Questions addressed: the claim-to-complete lifecycle; the question-hold guard
- Questions answered: none new; this iteration explains the missing fifth step recorded in iteration 5

## Reflection

- What worked and why: reading the completion precondition next to the status vocabulary showed that the lifecycle has no terminal state for abandonment. The two facts are individually reasonable and jointly a trap.
- What did not work and why: expecting the question-hold guard to cover the observed behaviour. The guard is narrow by design and the receiver routed around it without knowing.
- What I would do differently: read the status vocabulary first, because it bounds every lifecycle question in one place.

## Recommended Next Focus

The relaunch and killer path: what makes a hop fail to relaunch at all, and how the killer decides a session is dead.

## Fixes Named

- Add a claim expiry: a note claimed for longer than the hop budget returns to `open` with a recorded reason, so a deferred close cannot strand the note. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:407]
- Make the claim output's completion instruction unconditional for a note whose Remaining work names an operator question: tell the receiver to record the open question in the note and complete, rather than hold the close. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:742]
- Extend the question-hold guard to the prose case by checking, at turn end, whether the receiver's reply asks the operator a question while a note is claimed, and naming the note as the place for it. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:188]
