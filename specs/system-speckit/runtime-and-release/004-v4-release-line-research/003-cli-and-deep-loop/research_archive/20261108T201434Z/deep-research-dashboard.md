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
- Topic: Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the CLI and deep-loop cluster: .skilled/skills/cli-external-orchestration/**, .skilled/skills/cli-classifier/**, .skilled/skills/system-deep-loop/** and .skilled/commands/deep/**. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.
- Started: 2026-11-08T19:56:53.000Z
- Status: INITIALIZED
- Iteration: 3 of 10
- Session ID: 2026-11-08T19:56:53.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | v4.0.2.0: Hermes removal live-reference audit and DeepSeek Harness release-note parity | - | 0.55 | 0 | insight |
| 2 | v4.0.2.0 DSH hard-rule enforcement, model and version parity, and the v4.0.0.13 OpenCode default claim | - | 0.62 | 0 | insight |
| 3 | unknown | - | 0.00 | 0 | error |

- iterationsCompleted: 3
- keyFindings: 44
- openQuestions: 10
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/12
- [x] Hermes removal (v4.0.2.0): which live references to cli-hermes, .hermes/ or the hermes shell function remain in .skilled/skills/cli-external-orchestration/**, .skilled/skills/system-deep-loop/** or .skilled/commands/deep/**?
- [x] DeepSeek Harness (v4.0.2.0): does .skilled/skills/cli-external-orchestration/cli-deepseek-harness/** match its release-note claims (thirteen dispatch rules, three patches, pinned dsh release, two-id model roster) and the cli-deepseek-harness builder in .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs?
- [ ] Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree? [legacy-import]
- [ ] Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run? [legacy-import]
- [ ] Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests? [legacy-import]
- [ ] Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents? [legacy-import]
- [ ] Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims? [legacy-import]
- [ ] cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md? [legacy-import]
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md? [legacy-import]
- [ ] Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed? [legacy-import]
- [ ] UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user? [legacy-import]
- [ ] Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 10
- [ ] Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree?
- [ ] Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run?
- [ ] Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?
- [ ] Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents?
- [ ] Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims?
- [ ] cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md?
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md?
- [ ] Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed?
- [ ] UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user?
- [ ] Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▇▇███████▇▆▅▅▄▃▂▂▁
- score sparkline: ▇▇▇▇███████▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.55 -> 0.62 -> 0.00
- Stuck count: 1
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.00
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

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
Fan-out parity: for every executor kind, do `LINEAGE_COMMAND_ADAPTERS`, `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, the model allowlists in `executor-config.ts`, and each `cli-*/SKILL.md` agree? (next focus)

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- Latest iteration reported error status.

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
