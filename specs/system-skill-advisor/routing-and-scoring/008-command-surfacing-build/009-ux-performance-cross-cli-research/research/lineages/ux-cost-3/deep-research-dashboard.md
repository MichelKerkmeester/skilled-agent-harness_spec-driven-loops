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
- Topic: UX and cost lane, segment three: should hook health be on by default, what the brief and the cold path cost per prompt after phases 011, 012 and 013 are built, and which brief bytes can go without losing the command, policy and skill
- Started: 2026-11-13T07:20:00Z
- Status: COMPLETE
- Iteration: 5 of 6
- Session ID: fanout-ux-cost-3-1794550139177-nft9c6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: all_questions_answered

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | KQ1: the hook-health default and what a default-on diagnostic record costs in bytes, latency, file growth and privacy | hook-health | 0.88 | 9 | complete |
| 2 | KQ2: the live brief cost per prompt, the cold path, and whether any brief byte can be cut without losing the command, policy or skill | brief-cost | 0.82 | 8 | complete |
| 3 | KQ3: rank the lane's changes by expected gain per unit of risk, with file, measurable gain, verification and floor risk | ranking | 0.60 | 8 | complete |
| 4 | Verification pass: exact change sites, test surfaces, and the strict-schema and 30-record constraints that change the ranking | implementation-map | 0.72 | 7 | complete |
| 5 | Per-runtime brief bytes and whether plugin-shaped runtimes can carry a health record | runtime-parity | 0.58 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] KQ1: What should the hook-health default be, and what does a default-on record cost per prompt in bytes written, latency, file growth and privacy of what is recorded?
- [x] KQ2: What do the brief and the cold path cost per prompt at HEAD, and which brief bytes can be cut with the same command, policy and skill still reaching the model?
- [x] KQ3: Which ranked changes follow from the answers, by expected gain per unit of risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [160,50,21,5])?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▅▄▃▂▂▂▃▄▄▄▃▂▂▁
- score sparkline: ██▇▇▇▆▅▄▃▂▂▂▃▄▄▄▃▂▂▁
- Last 3 ratios: 0.60 -> 0.72 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {"code":30,"other":32}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit. (iteration 1)
- **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count. (iteration 1)
- **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it. (iteration 1)
- A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta. (iteration 1)
- Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state. (iteration 1)
- **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets. (iteration 2)
- **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it. (iteration 2)
- **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session. (iteration 2)
- Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is. (iteration 2)
- Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD. (iteration 2)
- **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue. (iteration 3)
- **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive. (iteration 3)
- **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count. (iteration 3)
- Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one. (iteration 3)
- Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause. (iteration 3)
- **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies. (iteration 4)
- **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift. (iteration 4)
- Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there. (iteration 4)
- **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut. (iteration 5)
- **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build. (iteration 5)
- Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost. (iteration 5)

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
