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
- Topic: Identify concrete improvements, refinements, and upgrade opportunities for the system-deep-loop skill: its shared runtime (.opencode/skills/system-deep-loop/runtime/**), all four subskills (deep-research, deep-review, deep-ai-council, deep-improvement), the deep/* commands (.opencode/commands/deep/**), and their agent definitions (.claude/agents/deep-research.md, .claude/agents/deep-review.md, and OpenCode equivalents). Look across correctness, ergonomics, cost/performance, documentation accuracy, and test coverage. Rotate focus across these areas iteration to iteration rather than fixating on one.
- Started: 2026-07-11T06:21:34.834Z
- Status: INITIALIZED
- Iteration: 8 of 10
- Session ID: dr-008-divergent-retry-1783750894834
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Shared runtime correctness, edge cases, documentation drift, and test gaps | - | 0.86 | 0 | insight |
| undefined | Where command contracts and runtime-specific agent definitions diverge from current behavior | - | 0.92 | 0 | complete |
| undefined | Do deep-review and deep-ai-council prompt packs have equivalent schema, delta, or reducer-ownership drift against their agents? | - | 0.90 | 0 | insight |
| undefined | Does any supported OpenCode CLI flag select ai-council while preserving the current isolated seat process, or should route proof identify a generic council-seat executor instead? | - | 0.78 | 0 | insight |
| undefined | Which cost and operator-friction defects dominate after route proof and unrestricted council seat startup are corrected? | - | 0.88 | 0 | insight |
| undefined | Should the council seat executor schema separate executor family, effective primary agent, requested mode, seat id, lens, and model? | - | 0.84 | 0 | insight |
| undefined | Which shared-runtime and command-contract tests are missing for executor-family/model separation, per-seat model selection, and requested-versus-effective provenance? | - | 0.76 | 0 | insight |
| undefined | Which shared-runtime and command-contract tests are missing for the four cost/liveness defects from iteration 5? | - | 0.82 | 0 | insight |

- iterationsCompleted: 8
- keyFindings: 0
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What correctness bugs or edge-case gaps exist in the shared runtime (convergence.cjs, executor-audit.ts, divergent-pivot.ts, prompt-pack.ts) and the four subskills? [legacy-import]
- [ ] Where does documentation (SKILL.md files, command contracts, agent definitions) drift from actual runtime behavior? [legacy-import]
- [ ] What ergonomics friction exists for operators driving these loops (setup, dispatch, convergence, resume, fan-out)? [legacy-import]
- [ ] What cost/performance issues exist (redundant dispatches, token waste, inefficient tool-call budgets, timeout tuning)? [legacy-import]
- [ ] What test coverage gaps exist across the runtime scripts, subskills, and commands? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What correctness bugs or edge-case gaps exist in the shared runtime (convergence.cjs, executor-audit.ts, divergent-pivot.ts, prompt-pack.ts) and the four subskills?
- [ ] Where does documentation (SKILL.md files, command contracts, agent definitions) drift from actual runtime behavior?
- [ ] What ergonomics friction exists for operators driving these loops (setup, dispatch, convergence, resume, fan-out)?
- [ ] What cost/performance issues exist (redundant dispatches, token waste, inefficient tool-call budgets, timeout tuning)?
- [ ] What test coverage gaps exist across the runtime scripts, subskills, and commands?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▆▇██▇▆▄▂▃▅▆▆▅▄▃▁▂▃▄
- score sparkline: ▅▆▇██▇▆▄▂▃▅▆▆▅▄▃▁▂▃▄
- Last 3 ratios: 0.84 -> 0.76 -> 0.82
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.82
- coverageBySources: {"other":10}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Requiring deep-ai-council to emit review/research-style iteration delta files was ruled out. Council's session/topic/round event hierarchy is intentionally different and already gives the host deterministic state ownership; parity should be semantic, not filename/schema cloning. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md:38-103] (iteration 3)

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
Which operator-facing defaults should become hard safety limits versus explicit opt-in overrides?

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
- graphConvergenceScore: 0.51
- graphDecision: STOP_BLOCKED
- Blocker: unnamed-blocker (blocking): count=1, description=Source diversity (0.00) is below the blocking threshold (1.5). STOP is blocked until diverse sources cover key questions., type=source_diversity_guard
- Blocker: unnamed-blocker (blocking): count=3, description=3 claim(s) remain unverified, type=unverified_claims

<!-- /ANCHOR:graph-convergence -->
