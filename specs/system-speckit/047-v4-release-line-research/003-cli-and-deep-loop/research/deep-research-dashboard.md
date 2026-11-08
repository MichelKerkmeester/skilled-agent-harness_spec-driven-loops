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
- Started: 2026-11-08T20:14:35.000Z
- Status: INITIALIZED
- Iteration: 26 of 30
- Session ID: 2026-11-08T20:14:35.000Z
- Parent Session: 2026-11-08T20:14:35.000Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Fan-out parity: EXECUTOR_KINDS vs LINEAGE_COMMAND_ADAPTERS vs EXECUTOR_KIND_FLAG_SUPPORT vs duplicated model allowlists vs cli-*/SKILL.md defaults vs if_cli_* branches | - | 0.72 | 0 | insight |
| 2 | Releases v4.0.0.6 and v4.0.0.7 in the deep loop: mode-retirement remnants, the fan-out reducer-stamp guard, and the deep-review Case-line enforcement | - | 0.68 | 0 | insight |
| 3 | Convergence and stop policy: whether convergence.cjs and reduce-state.cjs own stopPolicy, minIterations and the four convergence modes, vs convergence.md and the step_check_convergence algorithm | - | 0.78 | 0 | insight |
| 4 | Correct iteration 3's stopPolicy/minIterations claim, then verify v4.0.0.16 lane resume and write containment | - | 0.74 | 0 | insight |
| 5 | cli-classifier and cli-jev: router phrases vs release notes, Jev feature switches, stored-key behaviour, hub canon across hub-router.json, mode-registry.json and ROUTER.md | - | 0.72 | 0 | insight |
| 6 | Hub canon for cli-external-orchestration: three-surface intent vocabulary diff, advisor ranking of hub-owned route phrases, version skew, v4.0.0.1 fan-out scoping residue | - | 0.63 | 0 | insight |
| 7 | Over-engineering census of system-deep-loop: divergent pivot, legacy projections + watermark, idea lifecycle, dual telemetry, wave planner, if_cli_copilot; count production callers and name what breaks on removal | - | 0.81 | 0 | insight |
| 8 | UX for the operator and the AI user who executes /deep:research:auto: verify the six orchestrator-reported defects (dispatchId generation token, executor.type vs kind, quota-error iteration slot + archive-on-executor-change, 12-vs-24 tool-call budget, undefined focus in the state summary, missing persona block) and rank by operator cost | - | 0.74 | 0 | insight |
| 9 | Unread releases for CLI dispatch: v4.0.0.13 OpenCode 1/2 preference in the single-executor branch, v4.0.0.2 Grok 4.7 Cursor roster, v4.0.0.16 pi Terra and fast tier | - | 0.72 | 0 | insight |
| 10 | Close the remaining questions: v4.0.0.3 lock clauses, ai-council executor dispatch, three extensions | - | 0.66 | 0 | insight |
| 11 | v4.0.0.15 (bb9b9d1c09..22c3a9b2c7, 250 files) and v4.0.0.14 (42b41dd286..bb9b9d1c09, 68 files) drift verification for the CLI + deep-loop cluster | - | 0.60 | 0 | insight |
| 12 | Unread releases v4.0.0.1, .8, .9, .10, .11 against the CLI + deep-loop cluster | - | 0.66 | 0 | insight |
| 13 | Unread releases v4.0.0.0 and v4.0.0.16, cluster paths only: verify up to three cluster claims each against the tree. | - | 0.55 | 0 | insight |
| 14 | v4.0.0.4, v4.0.0.5, v4.0.0.12 and v4.0.1.0 cluster claims: tag-diff attribution method, one-line ROUTER link claim, hub-canon strict packaging, package_skill --strict write side effect | - | 0.60 | 0 | insight |
| 15 | Final iteration: re-verify nine P1 findings at their cited path:line, record the repo-wide write-containment baseline as a cross-lane defect, and name the strongest finding per type. | - | 0.45 | 0 | insight |
| 16 | Verify the ai-council external-cli dispatch finding and the max-iterations post-dispatch finding with path:line and a command each | - | 0.35 | 0 | insight |
| 17 | Settle B3 (--pure flag), rerun skill advisor for opencode routing, and produce improvement/extension findings for the single-executor YAML branches. | - | 0.50 | 0 | insight |
| 18 | Confirm-mode assets deep-research-confirm.yaml and deep-review-confirm.yaml: test each auto-twin defect against them, then report confirm-unique defects | - | 0.60 | 0 | insight |
| 19 | ai-council runtime: adjudication, stability, stop logic, seat subprocess | - | 0.62 | 0 | insight |
| 20 | Hard-rule enforcement sweep for cli-codex, cli-cursor, cli-claude-code, cli-devin and cli-pi against buildLineageCommand and the per-kind adapters in fanout-run.cjs. | - | 0.55 | 0 | complete |
| 21 | Unread ground: cli-classifier and the cli-jev transport — request building, timeouts, error handling, key storage and the documented switches checked against code with path:line, plus the v4.0.0.2/v4.0.0.3/v4.0.1.0 Jev notes | - | 0.58 | 0 | insight |
| 22 | Auto/confirm YAML twins as pairs: deep-review and deep-ai-council differential, then the review YAML's synthesis and verdict steps against deep-review/references | - | 0.60 | 0 | insight |
| 23 | Unread ground: edge cases in the reducer and the append gateway — duplicate iteration number, status error row, delta finding rows without type finding, empty or malformed delta line, two concurrent writers | - | 0.60 | 0 | insight |
| 24 | Deep-review runtime: reducer, verdict and severity logic, report writer, review state references | - | 0.62 | 0 | insight |
| 25 | Unread ground: /deep command flag bindings vs the auto YAML and fanout-run.cjs, and three-way agreement of hub-router.json, mode-registry.json and ROUTER.md on modes, aliases and versions | - | 0.58 | 0 | insight |
| 26 | Hub shared code and assets: only cli-opencode ships executable code; audit of cli-claude-code, cli-cursor and cli-opencode reference command lines against the fanout-run.cjs argv builders | - | 0.54 | 0 | insight |

- iterationsCompleted: 26
- keyFindings: 217
- openQuestions: 2
- resolvedQuestions: 9

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 9/11
- [x] Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree?
- [x] Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run?
- [x] Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?
- [x] Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents?
- [x] Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims?
- [x] cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md?
- [x] Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed?
- [x] UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user?
- [x] Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster?
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md? [legacy-import]
- [ ] Executor failure handling (v4.0.0.3, v4.0.0.16): when a CLI executor returns a quota error (devin resource_exhausted) or a builder throws, what does the single-executor workflow record, and can a run change executor without archiving its research tree? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md?
- [ ] Executor failure handling (v4.0.0.3, v4.0.0.16): when a CLI executor returns a quota error (devin resource_exhausted) or a builder throws, what does the single-executor workflow record, and can a run change executor without archiving its research tree?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▇▇▆▇▇▆▅▄▄▂▃▅▅▄▅▅▅▄
- score sparkline: ▇▇▇▇▆▇▇▆▅▄▄▂▃▅▅▄▅▅▅▄
- Last 3 ratios: 0.62 -> 0.58 -> 0.54
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.54
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract. (iteration 6)
- **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them. (iteration 6)

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
New: does any test exercise the Flash pin? `pinReasoningEffortForModel` is described as mirroring `executor-config.ts`, so a divergence between the two copies would be silent.

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
