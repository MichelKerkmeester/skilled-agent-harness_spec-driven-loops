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
- Topic: UX and cost lane: what the person and the model read and what it costs after phases 005, 006, 008 and 010 are built and 011 is being built — brief wording and bytes, ask and start wording, install and setup for an external repository, embedder keep-alive against cold start
- Started: 2026-11-13T05:05:00Z
- Status: COMPLETE
- Iteration: 3 of 4
- Session ID: fanout-ux-cost-2-1794539443568-6stapj
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
| 1 | KQ1 and KQ2: the brief words and bytes, where the run/start/ask definition lives, and what the constant block costs per prompt | ux-cost | 0.62 | 8 | complete |
| 2 | KQ3: the external-repository install path, the two instruction-file shapes, and the install's final status against measured brief delivery | install-setup | 0.72 | 7 | complete |
| 3 | KQ4 and KQ5: the embedder cold start and keep-alive decision, and the five-item ranking by expected gain per unit of risk | embedder-cost | 0.60 | 11 | complete |

- iterationsCompleted: 3
- keyFindings: 26
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] KQ1: Which words in the delivered brief and its policy definition reach the model, and which reach only AGENTS.md?
- [x] KQ2: What does the brief cost per prompt after phase 005, and which repeated bytes can move to once per session?
- [x] KQ3: What must an external repository install do so a plain request gets an offered command with a usable policy?
- [x] KQ4: Should the semantic embedder be kept warm, and at what memory and latency cost against the 750 ms deadline?
- [x] KQ5: Which ranked changes raise started-when-useful per unit of risk without lowering any floor?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▂▃▃▄▅▅▆▆▇██▇▆▅▅▄▃▂▂▁
- score sparkline: ▂▃▃▄▅▅▆▆▇██▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.62 -> 0.72 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"other":45}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406] (iteration 1)
- Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] (iteration 1)
- Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453] (iteration 1)
- Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82] (iteration 1)
- Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127] (iteration 1)
- Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744] (iteration 2)
- Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54] (iteration 2)
- Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217] (iteration 2)
- Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57] (iteration 2)
- Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777] (iteration 2)
- Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588] (iteration 3)
- Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3] (iteration 3)
- Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110] (iteration 3)
- Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] (iteration 3)
- Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] (iteration 3)
- Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159] (iteration 3)

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
