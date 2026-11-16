---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Find every reason a session hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and name a concrete fix for each. Known case: a live Pi hop on DeepSeek V4.1 Flash at max scored 4/5. The sender kept a side word out of its note as told, then wrote that a fresh session could not recover it. The receiver was offered a working History Lookup, did not run it, asked the operator and left the note claimed. The same task on OpenCode scored 5/5. Check: the prepare text each runtime gives the sender, the claim text and lookup offer the receiver reads, the OpenCode and Pi session readers that feed the lookup (including secret redaction of their tool-call argument shapes), model and effort carry on relaunch, and these known limits: an OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks. Code: .skilled/hooks/session-handover/, .skilled/hooks/shared/session-readers/, .pi/extensions/session-handover.ts, .opencode/plugins/. Evidence: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/.
- Started: 2026-11-16T05:46:01.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-vibe-deepseek-1794807924469-5jb1x3
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Prepare text and claim text asymmetry across OpenCode and Pi | prepare-claim-text | 0.79 | 7 | complete |
| 2 | Session readers, redaction of tool-call arguments, and the preview cut | session-readers | 0.88 | 8 | complete |
| 3 | Model and reasoning effort carry on relaunch | model-effort-carry | 0.85 | 9 | complete |
| 4 | AI_SESSION_CHILD suppression and the double nudge from two hooks | known-limits | 0.82 | 9 | complete |
| 5 | Live-run evidence consolidation and the scorecard recall measurement | live-evidence | 0.62 | 7 | insight |
| 6 | The claim-to-complete lifecycle and the question-hold guard | note-lifecycle | 0.70 | 7 | complete |
| 7 | The relaunch decision and the killer's idle detection | relaunch-killer | 0.75 | 8 | complete |
| 8 | The History Lookup CLI's own failure surface | lookup-cli | 0.72 | 8 | complete |
| 9 | The redaction contract end to end | redaction | 0.78 | 9 | complete |
| 10 | Consolidated failure modes, one fix each, and the residual proof gap | synthesis | 0.35 | 10 | insight |

- iterationsCompleted: 10
- keyFindings: 82
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does the prepare text each runtime gives the sender say, and where does it let the sender drop a detail the receiver must later recover?
- [x] What claim text and History Lookup offer does the receiver read, and why would a receiver skip the lookup and ask the operator instead?
- [x] How do the OpenCode and Pi session readers feed the History Lookup, and do they redact secrets in tool-call argument shapes?
- [x] Does model and reasoning effort carry across the relaunch on each runtime, and what breaks when it does not?
- [x] Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) can make a hop fail, and what is the concrete fix for each?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇███▇▇▆▅▅▅▆▆▆▆▆▆▆▄▁
- score sparkline: ▇▇███▇▇▆▅▅▅▆▆▆▆▆▆▆▄▁
- Last 3 ratios: 0.72 -> 0.78 -> 0.35
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.35
- coverageBySources: {"code":128,"other":19}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
