# Iteration 5: The Fix Set (One Concrete Change Per Failure Mode)

## Focus

Turn the failure modes recorded in iterations 1 to 4 into one concrete change each, naming the file and function and the observable that would prove the fix. This is the analytical pass the fifth key question asks for; no new external source was needed beyond the lines already cited, each re-read at its named location.

## Actions Taken

- Re-read each cited location against the fix it implies.
- Ordered the fixes by whether they change what the sender knows, what the receiver is told, what the reader can return, or what the run can prove.

## Findings

1. **Sender over-promise.** Change `handoffText` in `.skilled/hooks/session-handover/lib/nudge.cjs` to state that a detail kept out of the note is still recoverable by the receiver through the claim's History Lookup, and to forbid the sender from writing that a fresh session cannot recover it. Observable: a hop whose note deliberately omits a value no longer contains an "unrecoverable" instruction, and the receiver recovers the value. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:193]

2. **No verification step in the seed.** Add one step to `seedText` before "Continue the work": when Remaining work names a detail the note does not carry, run the printed History Lookup before asking the operator or closing the note. Observable: the receiver's transcript shows a `history-lookup.mjs` call before any operator question. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:296]

3. **The offer loses to the note.** Add one sentence to `buildHistoryLookupBody` in `.skilled/hooks/session-handover/history/lib/lookup-offer.ts`: the note is not authoritative about what the sender's history holds, so try the lookup before concluding a detail is unrecoverable. Observable: a receiver facing a note that says "cannot recover" runs the lookup instead of repeating the note's claim. [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:82]

4. **Preview cut.** Make `browse` previews carry the whole first part up to the reply budget, or attach an explicit `load` pointer to every reference in the browse reply. Observable: the live prompt's side word at character 295 appears in a browse reply without a second call. [SOURCE: .skilled/hooks/session-handover/history/lib/navigator.ts:265]

5. **Arguments dropped by shape.** Change `toolCallBlock` in `.skilled/hooks/shared/session-readers/project.mjs` to preserve a string argument, for example by parsing JSON or keeping it under a value key, instead of replacing it with `{}`. Observable: a session whose tool input is a JSON string returns the input in a loaded turn. [SOURCE: .skilled/hooks/shared/session-readers/project.mjs:40]

6. **One bad pair costs the session.** Give projection defects their own refusal code and skip the offending pair instead of failing the read, in `projectEntries` and the dispatcher's `readSession` mapping. Observable: a session with one orphaned tool result still returns every other turn, and the refusal code names the pairing rather than the store. [SOURCE: .skilled/hooks/shared/session-readers/index.mjs:127]

7. **Folder proof on OpenCode.** When the session table has no `directory` column, fail closed at mint (`readerFindsSession`) or record the folder on the locator at arm time and verify it against store metadata, in `.skilled/hooks/shared/session-readers/opencode.mjs`. Observable: a note from another folder gets no lookup offer rather than another project's turns. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]

8. **Pi cwd keying.** Record the Pi store key on the locator at mint and fall back to an exact-id scan of project directories when the note's `cwd` misses, in `.skilled/hooks/shared/session-readers/pi.mjs`. Observable: a session started in a subdirectory is still found when the note records a later cwd. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:222]

9. **Carry cannot be audited.** Append one `relaunch-args` line to `relaunch.log` from `skilled-loop` with model, provider, effort and name, and have `score.cjs` read a Pi receiver's session header for the same fields. Observable: `carry` reads `kept` or `dropped`, never `unobservable`. [SOURCE: .skilled/bin/skilled-loop:744]

10. **OpenCode 2 starts on the default.** There is no model flag to replay, so emit one warning line when the receiver's effective model differs from the sender's, and state the limitation in the runtime matrix. Observable: an OpenCode 2 hop that changed model prints the warning instead of passing silently. [SOURCE: .skilled/bin/skilled-loop:778]

11. **Pi loses a held nudge.** Persist the held text, or defer the `writeState` level bump until delivery, in `.skilled/hooks/session-handover/pi/session-handover.ts`, and deliver any held text on the next `agent_settled`. Observable: a host reload between hold and delivery still produces the nudge. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:594]

12. **The child flag leaks.** Unset `AI_SESSION_CHILD` in `skilled-loop` before launching a runtime and in the live-hop harness's `tmux` line, so the flag describes the worker that owns it and never the session it launches. Observable: a hop started from a dispatched worker still nudges, prepares and claims. [SOURCE: .skilled/bin/skilled-loop:911]

## Ruled Out

- "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it.
- "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget.

## Dead Ends

- Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment.

## Edge Cases

- Ambiguous input: "concrete fix" could mean a patch or a direction. Chose one function per fix plus an observable, without editing the researched code.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: fixing 1 to 3 changes the text path; 4 to 8 change the reader path; 9 to 12 change evidence and environment. A partial application still yields a measurable improvement, but only 1 to 3 address the recorded 4/5 case directly.

## Questions Answered

- Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) cause a hop to fail, and what concrete fix addresses each?

## Questions Remaining

None. All five key questions now have cited answers.

## Sources Consulted

- .skilled/hooks/session-handover/lib/nudge.cjs:193
- .skilled/hooks/session-handover/lib/nudge.cjs:296
- .skilled/hooks/session-handover/history/lib/lookup-offer.ts:82
- .skilled/hooks/session-handover/history/lib/navigator.ts:265
- .skilled/hooks/shared/session-readers/project.mjs:40
- .skilled/hooks/shared/session-readers/index.mjs:127
- .skilled/hooks/shared/session-readers/opencode.mjs:256
- .skilled/hooks/shared/session-readers/pi.mjs:222
- .skilled/bin/skilled-loop:744
- .skilled/bin/skilled-loop:778
- .skilled/bin/skilled-loop:911
- .skilled/hooks/session-handover/pi/session-handover.ts:594
- .skilled/hooks/session-handover/pi/session-handover.ts:620

## Assessment

- New information ratio: 0.6
- Questions addressed: the known-limits fix set
- Questions answered: known limits and their fixes

## Reflection

- What worked and why: ordering the fixes by the layer they change (sender text, receiver text, reader, evidence) kept each one attributable to a single recorded failure instead of producing a wish list.
- What did not work and why: an early attempt to write one combined "protocol hardening" fix collapsed four distinct causes into one unverifiable change; split per failure mode is what makes each observable.
- What I would do differently: state the observable before the change. Two candidate fixes (raise the preview, add a lookup step) only became precise once the observable was named.

## Recommended Next Focus

Synthesis. All five questions are answered; the remaining work is to consolidate the findings into one report, keep the fix set attached to its evidence, and record the convergence outcome.
