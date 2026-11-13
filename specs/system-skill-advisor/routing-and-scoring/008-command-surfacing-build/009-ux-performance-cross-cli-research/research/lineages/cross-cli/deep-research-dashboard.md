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
- Topic: Cross-CLI command surfacing after planned phases 005-008: per-runtime (claude, codex, opencode, pi, devin, dsh) evidence of whether a model starts an offered advisor command, what stops it, and which fix raises start rate.
- Started: 2026-11-12T22:50:26.300Z
- Status: COMPLETE
- Iteration: 3 of 5
- Session ID: fanout-cross-cli-1794523629654-v541y3
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Wiring map, live pre-arm score, and what phases 005-008 already cover | cross-cli | 1.00 | 6 | complete |
| 2 | The G5 layout fix and the measurement that decides whether a start-rate gain is real | cross-cli | 0.90 | 5 | complete |
| 3 | Ranked post-008 changes, and the install steps that decide whether a runtime is reachable at all | cross-cli | 0.70 | 5 | complete |

- iterationsCompleted: 3
- keyFindings: 16
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which hook or pointer surface must each of the six runtimes have before an advisor recommendation is even offered, and which runtimes are unwired in the pre-arm log?
- [x] Why does the model start so few offered commands on each runtime (claude 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7), and what does the missing COMMAND line prove about the brief?
- [x] Which change to the brief contract or hook wiring raises start rate per runtime, and how does it extend rather than duplicate planned phases 005-008?
- [x] How must command files be laid out and installed so a fresh external repository exposes every command on every runtime, given the g5 skill.md folder-shadowing result?
- [x] What is the cheapest reliable way to measure start rate across six runtimes without running pi, ollama, or the full test suite?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁▁
- score sparkline: ███▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 1.00 -> 0.90 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"other":55}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] (iteration 1)
- **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] (iteration 1)
- Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81] (iteration 1)
- Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate. (iteration 1)
- **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] (iteration 2)
- **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54] (iteration 2)
- A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path. (iteration 2)
- The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time. (iteration 2)
- **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry. (iteration 3)
- **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases. (iteration 3)
- No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed. (iteration 3)

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
