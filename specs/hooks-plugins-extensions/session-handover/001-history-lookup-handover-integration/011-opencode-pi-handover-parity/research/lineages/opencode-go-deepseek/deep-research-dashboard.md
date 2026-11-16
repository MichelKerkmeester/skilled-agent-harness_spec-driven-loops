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
- Started: 2026-11-16T05:46:33Z
- Status: INITIALIZED
- Iteration: 8 of 10
- Session ID: fanout-opencode-go-deepseek-1794807924469-5jb1x3
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | The prepare text each runtime gives the sender and the claim text the receiver reads | handover-protocol-text | 1.00 | 8 | complete |
| 2 | The OpenCode and Pi session readers, projection shapes, redaction and the 160-character preview cut | session-readers | 1.00 | 8 | complete |
| 3 | Model and effort carry on relaunch, and the two-hook nudge | relaunch-carry | 1.00 | 7 | complete |
| 4 | The AI_SESSION_CHILD leak into launched senders and receivers | environment-hygiene | 1.00 | 5 | complete |
| 5 | Concrete fix per recorded failure mode, with the observable that proves each | fix-set | 0.60 | 12 | insight |
| 6 | Evidence classes and the source ledger for all five answered questions | evidence-coverage | 0.75 | 3 | insight |
| 7 | Why two questions failed the source-diversity guard and which relation the ledger was missing | evidence-coverage | 0.75 | 2 | insight |
| 8 | The two-answering-findings rule behind question coverage and the diversity mean | evidence-coverage | 0.60 | 2 | insight |

- iterationsCompleted: 8
- keyFindings: 47
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does each runtime's prepare text tell the sender about keeping details out of the note, and does it over-promise what a fresh session can recover through the History Lookup?
- [x] What claim text and History Lookup offer does the receiver read on OpenCode versus Pi, and what makes a receiver leave a claim unverified instead of running the lookup?
- [x] How do the OpenCode and Pi session readers feed the History Lookup, including their tool-call argument shapes and secret redaction, and what does each fail to recover?
- [x] Does model and effort carry on relaunch for each runtime, and where can it silently degrade or be dropped?
- [x] Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) cause a hop to fail, and what concrete fix addresses each?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████████▆▃▁▂▃▄▄▄▃▂▁
- score sparkline: █████████▆▃▁▂▃▄▄▄▃▂▁
- Last 3 ratios: 0.75 -> 0.75 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":41,"other":5}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle. (iteration 1)
- "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it. (iteration 1)
- "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`. (iteration 1)
- Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it. (iteration 1)
- "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter. (iteration 2)
- "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity. (iteration 2)
- Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader. (iteration 2)
- "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error. (iteration 3)
- "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header. (iteration 3)
- "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send. (iteration 3)
- Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does. (iteration 3)
- "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all. (iteration 4)
- "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through. (iteration 4)
- Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace. (iteration 4)
- "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it. (iteration 5)
- "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget. (iteration 5)
- Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment. (iteration 5)
- "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class. (iteration 6)
- "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately. (iteration 6)
- Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly. (iteration 6)
- "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard. (iteration 7)
- "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong. (iteration 7)
- Re-running the same code reads as if they were a second class. They are not. (iteration 7)
- "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting. (iteration 8)
- "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports. (iteration 8)
- Adding still more code citations. The gap was relation shape, not source count. (iteration 8)

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
