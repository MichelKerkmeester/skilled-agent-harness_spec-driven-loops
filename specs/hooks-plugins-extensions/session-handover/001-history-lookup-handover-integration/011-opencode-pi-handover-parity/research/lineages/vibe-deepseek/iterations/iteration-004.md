# Iteration 4: AI_SESSION_CHILD suppression and the double nudge from two hooks

## Focus

The two remaining known limits. `AI_SESSION_CHILD` decides whether a session is nudged at all, so a leaked value silently disables the hand-over path in any test sandbox that inherits it. The double nudge decides whether a sender is asked twice, which spends a hop and can arm a second record. Both are environment-and-concurrency failures rather than text failures, so they need the guard code read rather than the run transcripts.

## Actions Taken

1. Read `nudgeDecision` and located the child-session branch.
2. Read `relaunchSessionIsChild` in the goal core.
3. Read the test that pins the child-session behaviour and the completion criterion that names the workaround.
4. Read `commitNudge` and the claim it takes.
5. Grepped every adapter for `commitNudge` and compared the ones that use it with the ones that do not.
6. Read the Claude hook registration to find the two-hook shape the claim exists for.

## Findings

1. `AI_SESSION_CHILD=1` short-circuits `nudgeDecision` before the ratio, the loop check and the level: `if (relaunchSessionIsChild(env)) return quiet('child-session')`. A sandbox that inherits the value gets no nudge at any fill. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707]

2. `relaunchSessionIsChild` is a bare environment read: `String(env[CHILD_SESSION_ENV] ?? '').trim() === '1'`. Nothing distinguishes a real dispatched child from a test process that inherited the variable, so the suppression cannot be narrowed from inside the decision. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs]

3. The suppression is deliberate and correct for its purpose: a dispatched child owns no hand-over, and a nudge there would ask a worker to save continuity into the parent's packet, which is the write its brief forbids. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:703]

4. The packet's completion criterion therefore runs the history engine, hooks vitest, session readers and handover suites under `env -u AI_SESSION_CHILD`, which is the only way to get a nudge-capable environment from inside a child session. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/goal.md:62]

5. `commitNudge` is the double-nudge guard: it takes a per-session claim, re-runs `nudgeDecision` under that claim, writes the level, and releases in a `finally`. Two hooks racing therefore produce one delivery, because the loser re-decides against the level the winner wrote. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs]

6. Only three adapters use it: `claude/context-nudge.mjs`, `codex/shared.mjs` and `vibe/handover-parts.mjs`. Pi and OpenCode call `nudgeDecision` directly and never take the claim. [SOURCE: .skilled/hooks/session-handover/claude/context-nudge.mjs:157]

7. Pi's substitute guard is the in-process `heldNudges` map, and `deliverHeldNudge` deletes the entry before sending, so `turn_end` followed by `agent_end` cannot deliver the same text twice within one process. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:652]

8. OpenCode's substitute guard is `state.pendingNudge`, also in-process: `queueNudge` returns early when it is set. A plugin reload or a second host instance starts with it null and can deliver again. [SOURCE: .opencode/plugins/session-handover.js:181]

9. The two-hook shape the claim exists for is real on Claude: `context-nudge.mjs` is registered on both `UserPromptSubmit` and `PostToolUse`, so one turn that submits a prompt and then runs a tool reaches the nudge code twice. [SOURCE: .claude/settings.json:169]

## Ruled Out

- "The double nudge is unguarded everywhere." Three adapters take the claim and are safe; the gap is Pi and OpenCode only.
- "`AI_SESSION_CHILD` can be ignored in tests because the nudge is not under test." The nudge is the entry point of the whole hop, so a suppressed nudge means no note, no prepare and no hop.

## Dead Ends

- Searching the handover tests for a case named after the double nudge. No test carries that name; the guard is proven by `commitNudge`'s claim and by the adapters that call it.

## Edge Cases

- Ambiguous input: "a double nudge from two hooks" could mean two hook events in one host or two hosts. Both were traced; the claim covers the first, and the in-process maps cover neither across a reload.
- Contradictory evidence: none.
- Missing dependencies: no test asserts the Pi or OpenCode double-delivery case, so the gap is read from the code rather than observed.
- Partial success: the Claude two-hook registration was read from the settings file, not exercised.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/nudge.cjs:703`
- `.skilled/hooks/session-handover/lib/nudge.cjs:707`
- `.skilled/hooks/goal/lib/goal-core.cjs`
- `.skilled/hooks/session-handover/claude/context-nudge.mjs:157`
- `.skilled/hooks/session-handover/codex/shared.mjs:142`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:304`
- `.skilled/hooks/session-handover/pi/session-handover.ts:652`
- `.opencode/plugins/session-handover.js:181`
- `.claude/settings.json:169`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/goal.md:62`

## Assessment

- New information ratio: 0.82
- Questions addressed: the known limits, specifically `AI_SESSION_CHILD` and the double nudge
- Questions answered: Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) can make a hop fail, and what is the concrete fix for each?

## Reflection

- What worked and why: grepping every adapter for one function name (`commitNudge`) turned a vague "two hooks" concern into a precise list of which adapters are guarded. The presence or absence of one call is the whole finding.
- What did not work and why: looking for a test named after the double nudge. The behaviour is pinned by the claim's implementation, not by a named case.
- What I would do differently: read `commitNudge` before the adapters, so the grep would have been aimed at the guard rather than at the symptom.

## Recommended Next Focus

Consolidate the live-run evidence across both runtimes and check convergence: which of the named failure modes the two recorded runs actually exercised, and which remain unproven.

## Fixes Named

- Route Pi and OpenCode through `commitNudge` instead of calling `nudgeDecision` directly, so the claim covers every adapter and a reloaded host cannot deliver a second nudge. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:652]
- Have the test harnesses clear `AI_SESSION_CHILD` in the child environment they build, so a suite run from inside a child session does not silently lose the nudge path. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs]
- Record the child-session suppression in the nudge log with the variable's source, so a suppressed nudge in a sandbox is diagnosable rather than silent. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707]
