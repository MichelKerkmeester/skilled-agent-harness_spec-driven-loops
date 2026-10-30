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
- Topic: How should sk-prompt (.skilled/skills/sk-prompt) be rebuilt without the DEPTH thinking framework? Validate, refute or extend the ranked recommendations REQ-002 to REQ-011 in specs/sk-prompt/010-sk-prompt-improvements/spec.md and the source ledger scratch/prompt-improver-survey.md: what exactly replaces DEPTH (one-pass checklist contents), whether the seven named frameworks should collapse into one component skeleton, how quality should be judged (CLEAR self-score vs test inputs), deliver-first vs ask-first, model profiles, and what the callers .skilled/agents/prompt-improver.md and .skilled/commands/prompt/ need. Compare against the AI Systems Prompt Improver (../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver) and public prompt improvers. Read-only research: write only inside the research lineage directory.
- Started: 2026-10-30T05:47:03.000Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: fanout-devin-swe2-1793339054661-ddx0ri
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Current-state contract: what DEPTH does inside sk-prompt vs what REQ-002..011 demand | - | 0.90 | 10 | complete |
| 2 | AI Systems sibling divergence + caller contract DEPTH couplings | - | 0.90 | 10 | complete |
| 3 | Public-improver validation of REQ-002..011 rankings | - | 0.90 | 10 | complete |

- iterationsCompleted: 3
- keyFindings: 30
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What exactly replaces DEPTH: what are the contents of the one-pass checklist (which components, yes/no+reason marking, the self-check step), and does REQ-002's ~10-component list match what surveyed improvers and sk-prompt's own references actually check?
- [x] Should the seven named frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) collapse into one component skeleton, and should the names survive as user-facing aliases or be removed outright (REQ-008 + spec Open Question 1)?
- [x] How should quality be judged: CLEAR self-score vs test inputs first — what does REQ-007's "quick test" concretely look like, and does CLEAR survive as a short screen?
- [x] Deliver-first vs ask-first plus the early exit for already-good prompts: what are the exact interaction rules, and do they hold for both interactive and agent (non-interactive) runs (REQ-003, REQ-004)?
- [x] What do the callers need — .skilled/agents/prompt-improver.md structured output block + model eligibility, and .skilled/commands/prompt/ modes — for the rebuild to stay compatible, and do per-model output profiles (REQ-010) and the change report/length cap (REQ-011) fit that contract?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 0.90 -> 0.90 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"ai.google.dev":2,"code":15,"developers.openai.com":2,"other":24,"platform.claude.com":2,"raw.githubusercontent.com":4}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=3 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 0.9 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=3 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo. (iteration 1)
- None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed). (iteration 1)
- Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7] (iteration 1)
- `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler). (iteration 2)
- Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3). (iteration 2)
- Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1). (iteration 2)
- A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule. (iteration 3)
- Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design. (iteration 3)
- melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget). (iteration 3)
- Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed. (iteration 3)
- Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence. (iteration 3)

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
