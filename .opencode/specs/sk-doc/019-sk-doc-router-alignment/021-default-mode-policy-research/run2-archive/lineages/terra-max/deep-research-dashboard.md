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
- Topic: Parent-hub defaultMode policy, run 2: a divergent multi-model deep dive over the Divergent Exploration Agenda in the packet spec.md.
- Started: 2026-07-17T18:45:05Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-terra-max-1784313510669-wn3vsj
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
| 2 | Q1/thread 1 — minimum useful null-hub fallback-resource payload | routing-helper-payload | 0.88 | 4 | complete |
| 2 | Q2/thread 3 — controlled null-hub disambiguation experiment | null-hub-disambiguation-experiment | 0.88 | 4 | complete |
| 3 | Q3/thread 4 — safe defaultMode migration and rollback sequence | default-mode-migration-rollback | 0.88 | 4 | complete |
| 4 | Q4/thread 8 — co-dominant mode policy and dominant-default evidence rule | co-dominant-mode-policy | 0.98 | 4 | complete |
| 5 | Q5/thread 10 — defaultMode identity/catch-all boundary and null-hub replacement contracts | null-hub-identity-anti-bias-contract | 0.85 | 4 | complete |

- iterationsCompleted: 5
- keyFindings: 20
- openQuestions: 2
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/5
- [x] **Q3 (thread 4):** What safe migration and rollback sequence could flip proposed defaults while detecting regressions before live routing behavior is broadly affected?
- [x] **Q4 (thread 8):** How should a hub with two genuinely co-dominant modes behave: ordered bundle, ranked helper, contextual detector, or defer? What evidence rule prevents a false dominant default?
- [x] **Q5 (thread 10):** If `defaultMode` currently anchors hub identity or catch-all scoring, what exact replacement contracts and benchmark assertions keep a null hub discoverable without recreating hidden auto-default bias?
- [ ] **Q1 (thread 1):** When a null hub defers, what routing-helper payload actually improves live routing: a full mode registry, a compressed disambiguation card, or a child hint? What measurable tradeoff establishes the minimum useful payload? [legacy-import]
- [ ] **Q2 (thread 3):** What controlled experiment would distinguish clean model disambiguation from arbitrary mode picking on a null hub, including zero-signal, weak-signal, and adversarially ambiguous requests? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] **Q1 (thread 1):** When a null hub defers, what routing-helper payload actually improves live routing: a full mode registry, a compressed disambiguation card, or a child hint? What measurable tradeoff establishes the minimum useful payload?
- [ ] **Q2 (thread 3):** What controlled experiment would distinguish clean model disambiguation from arbitrary mode picking on a null hub, including zero-signal, weak-signal, and adversarially ambiguous requests?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▃▃▃▃▃▃▃▃▃▃▃▄▅▇█▇▅▄▂▁
- score sparkline: ▃▃▃▃▃▃▃▃▃▃▃▄▅▇█▇▅▄▂▁
- Last 3 ratios: 0.88 -> 0.98 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":36,"other":13}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- An unconditional child-specific hint before ranking a candidate: each inspected child asks for information that presupposes its own domain, so it cannot resolve a genuine zero-signal hub request. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124] (iteration 1)
- Committed sources provide byte-size proxies, not a token budget or route-accuracy experiment; they cannot establish an exact numerical minimum payload. (iteration 1)
- The existing shared quick reference is not a neutral fallback-menu specimen, so its size cannot be treated as the target card size. [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145] (iteration 1)
- Unconditional full-registry injection as the null fallback: it includes routing-adjacent metadata and all child surfaces, while the hub contract already separates classification from entry resolution. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95] (iteration 1)
- A single ambiguous fixture without alias-order and paraphrase counterparts cannot attribute a resulting pick to evidence rather than incidental ordering; use paired variants as the minimum adversarial unit. [INFERENCE: based on the equal-score replay result and the ordered hub tie-break policy] (iteration 2)
- The legacy public/private fixture directory is supported only by explicit `--fixtures-dir` and is superseded by each skill's manual-testing playbook, so it is not the default seam for this experiment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58] (iteration 2)
- Treating deterministic replay alone as proof of model-level clean disambiguation: it records scored candidates and telemetry but does not grade the model's clarification or semantic handling of the “only one” constraint. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:84-86] (iteration 2)
- Treating the existing SD-007 multi-intent scenario as the adversarial fixture: its contract deliberately permits a combined route or an explicit disambiguation, so it cannot detect an arbitrary single pick where the user said only one mode is wanted. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] (iteration 2)
- A multi-hub flip combined with changes to router signals, registry projections, fallback resources, or tie-break order: the resulting outcome cannot be attributed to the `defaultMode` change and cannot be cleanly rolled back. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: coupled policy edits remove the single-variable comparison] (iteration 3)
- No inspected hub or benchmark contract defines a runtime `defaultMode` canary/percentage selector. Do not assume one exists; use a bounded candidate run and explicitly scoped live scenarios until such a control is authored. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:372-388] [INFERENCE: the inspected contracts expose a policy field and trace-mode selection, not a per-hub rollout selector] (iteration 3)
- The inspected contracts do not set a numeric tolerance for live route-quality regression. Structural and route-gold failures are zero-tolerance gates; any live pass-rate or cost tolerance must be predeclared with the candidate rather than invented after observing results. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513] (iteration 3)
- Treating deterministic `defaultApplied` telemetry as proof that live dispatch selected or loaded the candidate child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702] (iteration 3)
- No inspected local contract supplies a numeric dominance threshold, a recorded contextual-detector result, or a live outcome corpus. Do not invent a percentage threshold or call a ranked helper current behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18-20,301-363] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15] (iteration 4)
- SD-007 alone cannot establish a generic co-dominance rule because its acceptance deliberately permits either a combined route or explicit disambiguation for an explicit two-task prompt. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88] (iteration 4)
- Treating `routerPolicy.tieBreak` order or an already-configured `defaultMode` as proof of semantic dominance. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [INFERENCE: both are policy controls, not independently scored user outcomes] (iteration 4)
- Treating every within-delta two-mode score as an ordered bundle. The policy and SD-007 distinguish explicit separate tasks from unclear or contradictory alternatives. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] (iteration 4)
- Using SD-007’s legacy intent labels as current executable route gold without mapping them to current registry identifiers. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:2-13] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163] (iteration 4)
- `defaultApplied` alone cannot prove a mode was selected or a child was loaded: it is true only for zero selected modes with a non-null policy value, while runtime identity arrays are derived from the selected modes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:325-355] (iteration 5)
- A neutral fallback resource must not be treated as a covert mode: the hub policy models `defaultResource` separately from `defaultMode` and `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35] (iteration 5)
- Inferring that `defaultMode` anchors runtime identity or catch-all scoring from its field name: in the inspected replay it is read only after selection to compute telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] (iteration 5)
- Treating the current route-gold runner as proof that it already enforces the proposed null-hub telemetry assertions: the inspected runner invokes route gold and hard-gates its verdict, but does not itself establish those new expectation fields. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] (iteration 5)

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
Follow up on: **Proposed replacement contracts and assertions:** (a) define a `HubDefer` result with `workflowMode: null`, scored `candidateModes`, `matchedAliases`, and a `deferReason`; `packet` and `backendKind` remain empty unti...

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
