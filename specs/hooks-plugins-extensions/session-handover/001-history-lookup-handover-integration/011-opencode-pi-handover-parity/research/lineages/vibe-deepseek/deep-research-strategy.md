---
title: Deep Research Strategy - OpenCode/Pi Handover Parity
description: Session tracking for the vibe-deepseek fan-out lineage investigating why an OpenCode or Pi hand-over hop fails to finish the sender's task or fails to recover a note-omitted detail through the History Lookup.
trigger_phrases:
  - "opencode pi handover parity"
  - "history lookup recovery"
  - "session handover hop failure"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe-deepseek` fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** populated from config and the packet's goal/plan.
- **Per iteration:** the agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Find every reason a session hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and name a concrete fix for each. Known case: a live Pi hop on DeepSeek V4.1 Flash at max scored 4/5. The sender kept a side word out of its note as told, then wrote that a fresh session could not recover it. The receiver was offered a working History Lookup, did not run it, asked the operator and left the note claimed. The same task on OpenCode scored 5/5.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does the prepare text each runtime gives the sender say, and where does it let the sender drop a detail the receiver must later recover?
- [x] What claim text and History Lookup offer does the receiver read, and why would a receiver skip the lookup and ask the operator instead?
- [x] How do the OpenCode and Pi session readers feed the History Lookup, and do they redact secrets in tool-call argument shapes?
- [x] Does model and reasoning effort carry across the relaunch on each runtime, and what breaks when it does not?
- [x] Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) can make a hop fail, and what is the concrete fix for each?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing the fixes. This lineage reports findings and names fixes; implementation is a separate follow-up step.
- Re-scoring the live hops. The packet's `scratch/runs/` evidence is read as data, not re-executed.
- Changing the frozen decisions D1-D4 in the packet goal.

---

## 5. STOP CONDITIONS

- Convergence: newInfoRatio below 0.05 after the minimum iteration count.
- Max iterations: 10.
- All five key questions answered with cited evidence and a named fix per failure mode.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does the prepare text each runtime gives the sender say, and where does it let the sender drop a detail the receiver must later recover?
- What claim text and History Lookup offer does the receiver read, and why would a receiver skip the lookup and ask the operator instead?
- How do the OpenCode and Pi session readers feed the History Lookup, and do they redact secrets in tool-call argument shapes?
- Does model and reasoning effort carry across the relaunch on each runtime, and what breaks when it does not?
- Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) can make a hop fail, and what is the concrete fix for each?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two live notes side by side isolated the variable. Both senders got the same withholding instruction and both obeyed it; only the sentence each wrote about recoverability differed, and that sentence tracked the score. The code then explained where each sentence came from. (iteration 1)
- executing the scrubber against five shapes turned a reading of the regex into a fact. The 20-character floor and the anchored key alternation are both invisible until a short token is put through them. (iteration 2)
- tracing the value from three places at once — the record writer, the record reader and the argument builder — showed that Pi and OpenCode fail at different stages. Pi's writer is the extension and its reader is the wrapper; OpenCode has neither. (iteration 3)
- grepping every adapter for one function name (`commitNudge`) turned a vague "two hooks" concern into a precise list of which adapters are guarded. The presence or absence of one call is the whole finding. (iteration 4)
- recomputing `afterSeed` by hand instead of trusting the card exposed the false positive in one step. The card is a derivation, and a derivation is only as good as its input slice. (iteration 5)
- reading the completion precondition next to the status vocabulary showed that the lifecycle has no terminal state for abandonment. The two facts are individually reasonable and jointly a trap. (iteration 6)
- reading the decline reasons as a closed set made the failure surface finite. Six reasons is a list a test can cover exhaustively, which is what the packet needs. (iteration 7)
- counting the early returns in one function gave an exhaustive list. A function that fails closed by returning null has a finite failure surface, and enumerating it is cheaper than testing each case. (iteration 8)
- running the compiled scrubber instead of reasoning about the regexes turned a guess into a table. The misses were not the ones the pattern comments predict: the hyphen in `sk-fake-` and the 33-character Google tail both defeat a plausible-looking plant. (iteration 9)
- grouping by stage of the hop rather than by file collapsed thirty findings into ten modes and exposed the three shared root causes. The grouping also showed that the scorecard defect is upstream of two criteria, which no single-iteration view made visible. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- grepping the pane for the lookup section produced a false negative, because the capture collapses tool output. Treating a terminal capture as a complete transcript is the mistake. (iteration 1)
- looking for a Pi fixture with a tool call wasted a call; the fixture set covers the message-end event, not a tool-call content item. (iteration 2)
- expecting one shared reader to cover every runtime. `resolveSessionSettings` is a per-runtime switch, so a runtime added later silently gets nothing. (iteration 3)
- looking for a test named after the double nudge. The behaviour is pinned by the claim's implementation, not by a named case. (iteration 4)
- reading the scorecard first and the pane second. The card's `sideWordStated: true` set an expectation the pane then contradicted. (iteration 5)
- expecting the question-hold guard to cover the observed behaviour. The guard is narrow by design and the receiver routed around it without knowing. (iteration 6)
- assuming a decline would be visible. The wrapper deliberately preserves the runtime's exit code, so a declined hop looks exactly like a normal session end. (iteration 7)
- expecting a withheld offer to be diagnosable. The bare `catch {}` at the call site removes the last trace. (iteration 8)
- reading the test file for coverage. The test's fixture set is a list of shapes, not a contract, and the three uncovered paths are exactly the ones a header-shaped plant would use. (iteration 9)
- treating the five criteria as independent checks. Two of them read the same scorecard field, so a fix to the slice changes both verdicts at once. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`AI_SESSION_CHILD` can be ignored in tests because the nudge is not under test." The nudge is the entry point of the whole hop, so a suppressed nudge means no note, no prepare and no hop. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`AI_SESSION_CHILD` can be ignored in tests because the nudge is not under test." The nudge is the entry point of the whole hop, so a suppressed nudge means no note, no prepare and no hop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`AI_SESSION_CHILD` can be ignored in tests because the nudge is not under test." The nudge is the entry point of the whole hop, so a suppressed nudge means no note, no prepare and no hop.

### "A decline is reported to the operator." The decline path preserves the runtime's exit code and prints a warning only when the decision command itself fails, so a normal decline is silent. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "A decline is reported to the operator." The decline path preserves the runtime's exit code and prints a warning only when the decision command itself fails, so a normal decline is silent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A decline is reported to the operator." The decline path preserves the runtime's exit code and prints a warning only when the decision command itself fails, so a normal decline is silent.

### "A withheld offer is visible to the receiver." The claim output prints the section only when it is non-null, and the surrounding `catch {}` swallows any error, so absence is silent. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "A withheld offer is visible to the receiver." The claim output prints the section only when it is non-null, and the surrounding `catch {}` swallows any error, so absence is silent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A withheld offer is visible to the receiver." The claim output prints the section only when it is non-null, and the surrounding `catch {}` swallows any error, so absence is silent.

### "Any planted fake token will be redacted." The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape and passes through. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Any planted fake token will be redacted." The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape and passes through.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Any planted fake token will be redacted." The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape and passes through.

### "Fixing the prepare text alone would close the Pi gap." The Pi receiver had a working offer and did not run it, so the claim text and the note's authority are the binding constraint, not the prepare text. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Fixing the prepare text alone would close the Pi gap." The Pi receiver had a working offer and did not run it, so the claim text and the note's authority are the binding constraint, not the prepare text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fixing the prepare text alone would close the Pi gap." The Pi receiver had a working offer and did not run it, so the claim text and the note's authority are the binding constraint, not the prepare text.

### "Planting the token in an image would exercise redaction." Image blocks are returned unchanged by design. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Planting the token in an image would exercise redaction." Image blocks are returned unchanged by design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Planting the token in an image would exercise redaction." Image blocks are returned unchanged by design.

### "Redaction is per-adapter, so one runtime can miss it." Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so the layer is shared. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Redaction is per-adapter, so one runtime can miss it." Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so the layer is shared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Redaction is per-adapter, so one runtime can miss it." Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so the layer is shared.

### "The 30-minute TTL is a bug." Minting at claim time makes the TTL irrelevant to a normal hop; it only bites a locator minted and redeemed across a long gap, which the design avoids. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The 30-minute TTL is a bug." Minting at claim time makes the TTL irrelevant to a normal hop; it only bites a locator minted and redeemed across a long gap, which the design avoids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 30-minute TTL is a bug." Minting at claim time makes the TTL irrelevant to a normal hop; it only bites a locator minted and redeemed across a long gap, which the design avoids.

### "The 4/5 is the recall failure." The five steps do not include recall; the missing step is `noteClosed`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The 4/5 is the recall failure." The five steps do not include recall; the missing step is `noteClosed`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 4/5 is the recall failure." The five steps do not include recall; the missing step is `noteClosed`.

### "The double nudge is unguarded everywhere." Three adapters take the claim and are safe; the gap is Pi and OpenCode only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The double nudge is unguarded everywhere." Three adapters take the claim and are safe; the gap is Pi and OpenCode only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The double nudge is unguarded everywhere." Three adapters take the claim and are safe; the gap is Pi and OpenCode only.

### "The five criteria are five independent checks." They are not: the first two depend on the scorecard's recall slice, which is the same code path, so fixing the slice changes both. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "The five criteria are five independent checks." They are not: the first two depend on the scorecard's recall slice, which is the same code path, so fixing the slice changes both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The five criteria are five independent checks." They are not: the first two depend on the scorecard's recall slice, which is the same code path, so fixing the slice changes both.

### "The note stayed claimed because the receiver crashed." The pane shows a complete, coherent reply and a deliberate decision to hold the close. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The note stayed claimed because the receiver crashed." The pane shows a complete, coherent reply and a deliberate decision to hold the close.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The note stayed claimed because the receiver crashed." The pane shows a complete, coherent reply and a deliberate decision to hold the close.

### "The OpenCode model carries because the plugin reads `input.model`." It reads only `limit.context`, a number, and writes nothing to the record. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The OpenCode model carries because the plugin reads `input.model`." It reads only `limit.context`, a number, and writes nothing to the record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The OpenCode model carries because the plugin reads `input.model`." It reads only `limit.context`, a number, and writes nothing to the record.

### "The Pi carry is broken because `resolveSessionSettings` has no Pi branch." The Pi extension supplies the values itself, so the missing branch is harmless on Pi. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The Pi carry is broken because `resolveSessionSettings` has no Pi branch." The Pi extension supplies the values itself, so the missing branch is harmless on Pi.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi carry is broken because `resolveSessionSettings` has no Pi branch." The Pi extension supplies the values itself, so the missing branch is harmless on Pi.

### "The Pi hop failed to relaunch." Its relaunch log records a `ready` relaunch 0.2 seconds after the signal. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The Pi hop failed to relaunch." Its relaunch log records a `ready` relaunch 0.2 seconds after the signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi hop failed to relaunch." Its relaunch log records a `ready` relaunch 0.2 seconds after the signal.

### "The Pi lookup was never offered." The packet goal records that the offer was printed and works, and `handoverLookupSection` mints the locator at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries. The pane capture collapses tool output, so its silence is not evidence of absence. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The Pi lookup was never offered." The packet goal records that the offer was printed and works, and `handoverLookupSection` mints the locator at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries. The pane capture collapses tool output, so its silence is not evidence of absence. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi lookup was never offered." The packet goal records that the offer was printed and works, and `handoverLookupSection` mints the locator at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries. The pane capture collapses tool output, so its silence is not evidence of absence. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072]

### "The Pi run proves recall because its card says `sideWordStated: true`." The card's own input is the echoed prompt, and the receiver's reply says the opposite. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The Pi run proves recall because its card says `sideWordStated: true`." The card's own input is the echoed prompt, and the receiver's reply says the opposite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi run proves recall because its card says `sideWordStated: true`." The card's own input is the echoed prompt, and the receiver's reply says the opposite.

### "The Pi sender leaked the side word." Both scorecards record `sideWordInNote: false`, so the withholding instruction held on both runtimes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The Pi sender leaked the side word." Both scorecards record `sideWordInNote: false`, so the withholding instruction held on both runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi sender leaked the side word." Both scorecards record `sideWordInNote: false`, so the withholding instruction held on both runtimes.

### "The preview cut is harmless because search returns the whole turn." It returns a bounded preview plus a read handle; the value is only reachable through the handle. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The preview cut is harmless because search returns the whole turn." It returns a bounded preview plus a read handle; the value is only reachable through the handle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The preview cut is harmless because search returns the whole turn." It returns a bounded preview plus a read handle; the value is only reachable through the handle.

### "The question-hold guard should have blocked the ask." The guard covers question tools only, and the receiver asked in prose. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The question-hold guard should have blocked the ask." The guard covers question tools only, and the receiver asked in prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The question-hold guard should have blocked the ask." The guard covers question tools only, and the receiver asked in prose.

### "The redaction test proves the criterion." The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The redaction test proves the criterion." The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The redaction test proves the criterion." The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths.

### Looking for a `--thinking` flag on OpenCode's CLI. The wrapper's own comment states OpenCode 2 has no model flag on its root command, so there is no flag to append; the fix has to be a config write or a per-session setting, not a launch argument. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a `--thinking` flag on OpenCode's CLI. The wrapper's own comment states OpenCode 2 has no model flag on its root command, so there is no flag to append; the fix has to be a config write or a per-session setting, not a launch argument.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `--thinking` flag on OpenCode's CLI. The wrapper's own comment states OpenCode 2 has no model flag on its root command, so there is no flag to append; the fix has to be a config write or a per-session setting, not a launch argument.

### Looking for a reason code on a withheld offer. There is none; the function returns null rather than a typed refusal. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a reason code on a withheld offer. There is none; the function returns null rather than a typed refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a reason code on a withheld offer. There is none; the function returns null rather than a typed refusal.

### Looking for a redaction count or marker summary in the reply metadata. The reply carries a `preview` and part handles, but no field saying something was removed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a redaction count or marker summary in the reply metadata. The reply carries a `preview` and part handles, but no field saying something was removed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a redaction count or marker summary in the reply metadata. The reply carries a `preview` and part handles, but no field saying something was removed.

### Looking for a retry after a decline. There is none; the wrapper takes the decline path once and exits. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a retry after a decline. There is none; the wrapper takes the decline path once and exits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a retry after a decline. There is none; the wrapper takes the decline path once and exits.

### Looking for a single root cause behind all ten modes. There are three: the note is treated as the only channel (A, B, C), the readers and the scorecard disagree about what a session is (D, F, J), and the relaunch path has no per-runtime settings contract (G, H, I). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a single root cause behind all ten modes. There are three: the note is treated as the only channel (A, B, C), the readers and the scorecard disagree about what a session is (D, F, J), and the relaunch path has no per-runtime settings contract (G, H, I).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a single root cause behind all ten modes. There are three: the note is treated as the only channel (A, B, C), the readers and the scorecard disagree about what a session is (D, F, J), and the relaunch path has no per-runtime settings contract (G, H, I).

### Looking for a timeout that closes a stale claim. There is none in the handover code, so the fix has to add one rather than tune one. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a timeout that closes a stale claim. There is none in the handover code, so the fix has to add one rather than tune one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a timeout that closes a stale claim. There is none in the handover code, so the fix has to add one rather than tune one.

### Looking for a token-planting branch in the harness. There is none, so the redaction criterion cannot be scored from the current harness at all. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a token-planting branch in the harness. There is none, so the redaction criterion cannot be scored from the current harness at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a token-planting branch in the harness. There is none, so the redaction criterion cannot be scored from the current harness at all.

### Looking for an entropy or high-randomness detector in the scrubber. There is none; every pattern is a vendor shape, a fixed length, or an assignment context. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for an entropy or high-randomness detector in the scrubber. There is none; every pattern is a vendor shape, a fixed length, or an assignment context.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an entropy or high-randomness detector in the scrubber. There is none; every pattern is a vendor shape, a fixed length, or an assignment context.

### Reading the pane transcript for the claim command's stdout. The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane. The code path plus the goal's recorded observation is the stronger evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the pane transcript for the claim command's stdout. The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane. The code path plus the goal's recorded observation is the stronger evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the pane transcript for the claim command's stdout. The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane. The code path plus the goal's recorded observation is the stronger evidence.

### Reading the Pi fixture for a tool-call argument shape. `pi-assistant-message-end.json` carries no `toolCall` item, so the argument shape had to be read from the reader's mapping instead. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading the Pi fixture for a tool-call argument shape. `pi-assistant-message-end.json` carries no `toolCall` item, so the argument shape had to be read from the reader's mapping instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the Pi fixture for a tool-call argument shape. `pi-assistant-message-end.json` carries no `toolCall` item, so the argument shape had to be read from the reader's mapping instead.

### Searching the handover tests for a case named after the double nudge. No test carries that name; the guard is proven by `commitNudge`'s claim and by the adapters that call it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching the handover tests for a case named after the double nudge. No test carries that name; the guard is proven by `commitNudge`'s claim and by the adapters that call it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the handover tests for a case named after the double nudge. No test carries that name; the guard is proven by `commitNudge`'s claim and by the adapters that call it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "The Pi lookup was never offered." The packet goal records that the offer was printed and works, and `handoverLookupSection` mints the locator at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries. The pane capture collapses tool output, so its silence is not evidence of absence. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072] (iteration 1)
- "The Pi sender leaked the side word." Both scorecards record `sideWordInNote: false`, so the withholding instruction held on both runtimes. (iteration 1)
- Reading the pane transcript for the claim command's stdout. The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane. The code path plus the goal's recorded observation is the stronger evidence. (iteration 1)
- "Redaction is per-adapter, so one runtime can miss it." Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so the layer is shared. (iteration 2)
- "The preview cut is harmless because search returns the whole turn." It returns a bounded preview plus a read handle; the value is only reachable through the handle. (iteration 2)
- Reading the Pi fixture for a tool-call argument shape. `pi-assistant-message-end.json` carries no `toolCall` item, so the argument shape had to be read from the reader's mapping instead. (iteration 2)
- "The OpenCode model carries because the plugin reads `input.model`." It reads only `limit.context`, a number, and writes nothing to the record. (iteration 3)
- "The Pi carry is broken because `resolveSessionSettings` has no Pi branch." The Pi extension supplies the values itself, so the missing branch is harmless on Pi. (iteration 3)
- Looking for a `--thinking` flag on OpenCode's CLI. The wrapper's own comment states OpenCode 2 has no model flag on its root command, so there is no flag to append; the fix has to be a config write or a per-session setting, not a launch argument. (iteration 3)
- "`AI_SESSION_CHILD` can be ignored in tests because the nudge is not under test." The nudge is the entry point of the whole hop, so a suppressed nudge means no note, no prepare and no hop. (iteration 4)
- "The double nudge is unguarded everywhere." Three adapters take the claim and are safe; the gap is Pi and OpenCode only. (iteration 4)
- Searching the handover tests for a case named after the double nudge. No test carries that name; the guard is proven by `commitNudge`'s claim and by the adapters that call it. (iteration 4)
- "The 4/5 is the recall failure." The five steps do not include recall; the missing step is `noteClosed`. (iteration 5)
- "The Pi run proves recall because its card says `sideWordStated: true`." The card's own input is the echoed prompt, and the receiver's reply says the opposite. (iteration 5)
- Looking for a token-planting branch in the harness. There is none, so the redaction criterion cannot be scored from the current harness at all. (iteration 5)
- "The note stayed claimed because the receiver crashed." The pane shows a complete, coherent reply and a deliberate decision to hold the close. (iteration 6)
- "The question-hold guard should have blocked the ask." The guard covers question tools only, and the receiver asked in prose. (iteration 6)
- Looking for a timeout that closes a stale claim. There is none in the handover code, so the fix has to add one rather than tune one. (iteration 6)
- "A decline is reported to the operator." The decline path preserves the runtime's exit code and prints a warning only when the decision command itself fails, so a normal decline is silent. (iteration 7)
- "The Pi hop failed to relaunch." Its relaunch log records a `ready` relaunch 0.2 seconds after the signal. (iteration 7)
- Looking for a retry after a decline. There is none; the wrapper takes the decline path once and exits. (iteration 7)
- "A withheld offer is visible to the receiver." The claim output prints the section only when it is non-null, and the surrounding `catch {}` swallows any error, so absence is silent. (iteration 8)
- "The 30-minute TTL is a bug." Minting at claim time makes the TTL irrelevant to a normal hop; it only bites a locator minted and redeemed across a long gap, which the design avoids. (iteration 8)
- Looking for a reason code on a withheld offer. There is none; the function returns null rather than a typed refusal. (iteration 8)
- "Any planted fake token will be redacted." The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape and passes through. (iteration 9)
- "Planting the token in an image would exercise redaction." Image blocks are returned unchanged by design. (iteration 9)
- "The redaction test proves the criterion." The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths. (iteration 9)
- Looking for a redaction count or marker summary in the reply metadata. The reply carries a `preview` and part handles, but no field saying something was removed. (iteration 9)
- Looking for an entropy or high-randomness detector in the scrubber. There is none; every pattern is a vendor shape, a fixed length, or an assignment context. (iteration 9)
- "Fixing the prepare text alone would close the Pi gap." The Pi receiver had a working offer and did not run it, so the claim text and the note's authority are the binding constraint, not the prepare text. (iteration 10)
- "The five criteria are five independent checks." They are not: the first two depend on the scorecard's recall slice, which is the same code path, so fixing the slice changes both. (iteration 10)
- Looking for a single root cause behind all ten modes. There are three: the note is treated as the only channel (A, B, C), the readers and the scorecard disagree about what a session is (D, F, J), and the relaunch path has no per-runtime settings contract (G, H, I). (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/session-handover/`, `.skilled/hooks/shared/session-readers/`, `.pi/extensions/session-handover.ts`, `.opencode/plugins/`.
- Evidence: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/`.
- Reuse candidates: existing handover hook modules and shared session readers.
- Integration points: prepare text, claim text, History Lookup offer, session readers, relaunch model/effort carry.
- Constraints and risks: the packet's `scratch/harness/` live-hop harness is the only accepted proof (D1); receivers run DeepSeek V4.1 Flash at max (D2).
- resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-16T05:46:01.000Z
