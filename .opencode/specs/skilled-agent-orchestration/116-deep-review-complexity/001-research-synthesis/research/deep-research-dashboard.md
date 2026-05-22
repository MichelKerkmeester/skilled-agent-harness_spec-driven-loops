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
- Topic: Investigate why focused deep-research bug-finding can surface more bugs than the deep-review workflow, and identify changes that would make deep-review less surface-level.
- Started: 2026-05-22T05:55:00Z
- Status: INITIALIZED
- Iteration: 15 of 15
- Session ID: 116-deep-review-complexity-auto-research
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Inventory deep-review/deep-research surfaces and first shallowness hypotheses | - | 1.00 | 7 | complete |
| undefined | Reducer, state format, convergence references, and tests: documented rigor versus machine-checked guarantees | - | 0.74 | 9 | complete |
| undefined | Real completed deep-review artifact survey for rich field presence and bug-class coverage | - | 0.68 | 8 | complete |
| undefined | Deep-review prompt-pack and agent candidate-generation pressure | - | 0.72 | 8 | complete |
| undefined | Deep-research mechanics to transfer into deep-review | - | 0.66 | 10 | complete |
| undefined | Deep-review scope selection and file/resource targeting | - | 0.61 | 8 | complete |
| undefined | Evaluate deep-review output contracts and synthesis behavior | - | 0.57 | 9 | complete |
| undefined | Turn accumulated evidence into ranked design options and acceptance criteria | - | 0.49 | 8 | complete |
| undefined | Define verification strategy for highest-leverage deep-review improvements | - | 0.43 | 9 | complete |
| undefined | Final convergence pass: synthesize accumulated evidence, resolve weak claims, close remaining questions, and produce roadmap inputs | - | 0.31 | 9 | complete |
| undefined | Stress-test the versioned searchLedger and targetSelection recommendation: required fields, naming, minimal row shape, trivial-review exemptions, and backwards compatibility. | - | 0.37 | 8 | insight |
| undefined | Stress-test post-dispatch validation: what must fail, warn, or pass for findingsNew, findingDetails, searchLedger rows, evidenceRefs, dispositions, and versioned enforcement. | - | 0.34 | 7 | insight |
| undefined | Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis. | - | 0.28 | 5 | insight |
| undefined | Stress-test graph vocabulary and convergence gates: candidate saturation, BUG_CLASS/INVARIANT/PRODUCER/CONSUMER/TEST nodes, graphless fallback, and STOP_BLOCKED behavior. | - | 0.25 | 6 | insight |
| undefined | Final continuation convergence: refine implementation order, seeded behavior tests, rollout thresholds, residual risks, and exact follow-up acceptance criteria across all recommendations. | - | 0.22 | 7 | complete |

- iterationsCompleted: 15
- keyFindings: 112
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Which deep-review prompt, agent, or YAML constraints reduce bug-finding depth?
- [ ] Which deep-research mechanics produce stronger bug discovery and can transfer to deep-review?
- [ ] Does deep-review's convergence logic stop before adversarial class-of-bug coverage is complete?
- [ ] Does deep-review require enough file-line evidence, producer/consumer inventory, and hypothesis rotation?
- [ ] What target surfaces should a follow-up implementation packet change first?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.28 -> 0.25 -> 0.22
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.22
- coverageBySources: {"other":25}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes. (iteration 11)
- **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first. (iteration 11)
- **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter. (iteration 11)
- Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature. (iteration 11)
- Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection. (iteration 11)
- **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened. (iteration 12)
- **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records. (iteration 12)
- **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics. (iteration 12)
- Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append. (iteration 12)
- Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today. (iteration 12)
- Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1180] (iteration 13)
- Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69] (iteration 13)
- Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936] (iteration 13)
- Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code. (iteration 13)
- Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records. (iteration 13)
- Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning. (iteration 14)
- Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677] (iteration 14)
- Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses. (iteration 14)
- Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support. (iteration 14)
- Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail. (iteration 14)
- Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible. (iteration 15)
- Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds. (iteration 15)
- Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements. (iteration 15)
- Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt. (iteration 15)
- Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces. (iteration 15)
- Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets. (iteration 15)
- Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker. (iteration 15)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Open a follow-up implementation packet for `deep-review` review-depth v2. Start with failing seeded validator and reducer fixtures, add the v2 schema/prompt contract, implement warn-capable validation, persist search coverage in reducer/dashboard/report, then add candidate STOP gates and graph vocabulary in separate gated slices.

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
