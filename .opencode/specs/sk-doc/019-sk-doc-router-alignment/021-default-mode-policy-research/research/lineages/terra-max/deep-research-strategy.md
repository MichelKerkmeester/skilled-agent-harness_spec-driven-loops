---
title: "Deep Research Strategy - terra-max lineage (Run 2 divergent)"
description: "A detached GPT-5.6-Terra divergent lens over the defaultMode exploration agenda."
trigger_phrases:
  - "defaultMode divergent strategy terra"
importance_tier: normal
contextType: planning
version: 1.14.0.19
lineage: terra-max
---

# Deep Research Strategy - terra-max Lineage (Run 2, divergent)

**Lineage:** `terra-max` (executor `cli-opencode`, model `openai/gpt-5.6-terra-fast`). This is an isolated fan-out packet; all artifacts remain under this lineage directory.

## 2. TOPIC

Parent-hub `defaultMode` policy, Run 2 divergent: stress-test and extend the prior verdict across new angles from the packet's Divergent Exploration Agenda. Do not re-litigate the Run 1 verdict.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] **Q1 (thread 1):** When a null hub defers, what routing-helper payload actually improves live routing: a full mode registry, a compressed disambiguation card, or a child hint? What measurable tradeoff establishes the minimum useful payload?
- [ ] **Q2 (thread 3):** What controlled experiment would distinguish clean model disambiguation from arbitrary mode picking on a null hub, including zero-signal, weak-signal, and adversarially ambiguous requests?
- [x] **Q3 (thread 4):** What safe migration and rollback sequence could flip proposed defaults while detecting regressions before live routing behavior is broadly affected?
- [x] **Q4 (thread 8):** How should a hub with two genuinely co-dominant modes behave: ordered bundle, ranked helper, contextual detector, or defer? What evidence rule prevents a false dominant default?
- [x] **Q5 (thread 10):** If `defaultMode` currently anchors hub identity or catch-all scoring, what exact replacement contracts and benchmark assertions keep a null hub discoverable without recreating hidden auto-default bias?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Re-derive Run 1's keep/flip verdict or modify shipped `defaultMode` values.
- Re-confirm basic router replay semantics already settled by Run 1.
- Propose a parent mode for a pure router.
- Write outside this detached lineage or mutate the parent packet's canonical documents.

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations`; execute all five iterations.
- Treat convergence as telemetry only. A low novelty signal requires a broader unexplored angle, not early synthesis.
- Stop early only for unrecoverable state corruption or three consecutive failed iterations.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **Q3 (thread 4):** What safe migration and rollback sequence could flip proposed defaults while detecting regressions before live routing behavior is broadly affected?
- **Q4 (thread 8):** How should a hub with two genuinely co-dominant modes behave: ordered bundle, ranked helper, contextual detector, or defer? What evidence rule prevents a false dominant default?
- **Q5 (thread 10):** If `defaultMode` currently anchors hub identity or catch-all scoring, what exact replacement contracts and benchmark assertions keep a null hub discoverable without recreating hidden auto-default bias?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing the hub’s explicit defer branch with registry topology and two child fallback patterns separated selection metadata from post-selection guidance, avoiding a repeat of the Run 1 default-policy verdict. (iteration 1)
- replaying one prompt from each signal stratum against the same committed hub made the null-default behavior observable through stable telemetry instead of inferring it from prose alone. (iteration 2)
- following the replay telemetry into its resource-assembly path exposed the crucial distinction between observing a configured default and proving a live default route; pairing that limitation with the benchmark's hard exit gates yields a sequence that is testable before broad exposure. (iteration 3)
- separating outcome policy, registry schema, and fixture acceptance exposed that a score tie, a deterministic ordering list, and an explicit two-task bundle are different facts. (iteration 4)
- tracing `defaultMode` from policy through the replay's scoring, selection, telemetry, identity, and benchmark boundaries isolated its one current use instead of inferring behavior from configuration names. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the optional memory trigger timed out, and source inspection cannot measure whether a card changes live model decisions; the necessary behavioral evidence is absent from committed documents. (iteration 1)
- deterministic replay cannot understand the semantic contradiction in “only one,” so its candidate list is necessary baseline evidence but not a sufficient behavioral verdict. (iteration 2)
- the local contracts expose deterministic replay and an opt-in live path, but no existing per-hub rollout selector or numeric live-regression budget; inventing either would turn a migration design into an unsupported implementation claim. (iteration 3)
- local contracts offer deterministic gates but no empirical dominance corpus or live outcome result, so they cannot establish a numeric threshold or certify a real default. (iteration 4)
- the inspected benchmark runner establishes the route-gold execution seam but not the proposed expected-field schema, so asserting that those exact checks already exist would overclaim implementation evidence. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `defaultApplied` alone cannot prove a mode was selected or a child was loaded: it is true only for zero selected modes with a non-null policy value, while runtime identity arrays are derived from the selected modes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:325-355] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `defaultApplied` alone cannot prove a mode was selected or a child was loaded: it is true only for zero selected modes with a non-null policy value, while runtime identity arrays are derived from the selected modes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:325-355]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `defaultApplied` alone cannot prove a mode was selected or a child was loaded: it is true only for zero selected modes with a non-null policy value, while runtime identity arrays are derived from the selected modes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:325-355]

### A multi-hub flip combined with changes to router signals, registry projections, fallback resources, or tie-break order: the resulting outcome cannot be attributed to the `defaultMode` change and cannot be cleanly rolled back. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: coupled policy edits remove the single-variable comparison] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A multi-hub flip combined with changes to router signals, registry projections, fallback resources, or tie-break order: the resulting outcome cannot be attributed to the `defaultMode` change and cannot be cleanly rolled back. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: coupled policy edits remove the single-variable comparison]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A multi-hub flip combined with changes to router signals, registry projections, fallback resources, or tie-break order: the resulting outcome cannot be attributed to the `defaultMode` change and cannot be cleanly rolled back. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97] [INFERENCE: coupled policy edits remove the single-variable comparison]

### A neutral fallback resource must not be treated as a covert mode: the hub policy models `defaultResource` separately from `defaultMode` and `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A neutral fallback resource must not be treated as a covert mode: the hub policy models `defaultResource` separately from `defaultMode` and `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A neutral fallback resource must not be treated as a covert mode: the hub policy models `defaultResource` separately from `defaultMode` and `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35]

### A single ambiguous fixture without alias-order and paraphrase counterparts cannot attribute a resulting pick to evidence rather than incidental ordering; use paired variants as the minimum adversarial unit. [INFERENCE: based on the equal-score replay result and the ordered hub tie-break policy] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A single ambiguous fixture without alias-order and paraphrase counterparts cannot attribute a resulting pick to evidence rather than incidental ordering; use paired variants as the minimum adversarial unit. [INFERENCE: based on the equal-score replay result and the ordered hub tie-break policy]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single ambiguous fixture without alias-order and paraphrase counterparts cannot attribute a resulting pick to evidence rather than incidental ordering; use paired variants as the minimum adversarial unit. [INFERENCE: based on the equal-score replay result and the ordered hub tie-break policy]

### An unconditional child-specific hint before ranking a candidate: each inspected child asks for information that presupposes its own domain, so it cannot resolve a genuine zero-signal hub request. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: An unconditional child-specific hint before ranking a candidate: each inspected child asks for information that presupposes its own domain, so it cannot resolve a genuine zero-signal hub request. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An unconditional child-specific hint before ranking a candidate: each inspected child asks for information that presupposes its own domain, so it cannot resolve a genuine zero-signal hub request. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124]

### Committed sources provide byte-size proxies, not a token budget or route-accuracy experiment; they cannot establish an exact numerical minimum payload. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Committed sources provide byte-size proxies, not a token budget or route-accuracy experiment; they cannot establish an exact numerical minimum payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Committed sources provide byte-size proxies, not a token budget or route-accuracy experiment; they cannot establish an exact numerical minimum payload.

### Inferring that `defaultMode` anchors runtime identity or catch-all scoring from its field name: in the inspected replay it is read only after selection to compute telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Inferring that `defaultMode` anchors runtime identity or catch-all scoring from its field name: in the inspected replay it is read only after selection to compute telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring that `defaultMode` anchors runtime identity or catch-all scoring from its field name: in the inspected replay it is read only after selection to compute telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480]

### No inspected hub or benchmark contract defines a runtime `defaultMode` canary/percentage selector. Do not assume one exists; use a bounded candidate run and explicitly scoped live scenarios until such a control is authored. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:372-388] [INFERENCE: the inspected contracts expose a policy field and trace-mode selection, not a per-hub rollout selector] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No inspected hub or benchmark contract defines a runtime `defaultMode` canary/percentage selector. Do not assume one exists; use a bounded candidate run and explicitly scoped live scenarios until such a control is authored. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:372-388] [INFERENCE: the inspected contracts expose a policy field and trace-mode selection, not a per-hub rollout selector]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No inspected hub or benchmark contract defines a runtime `defaultMode` canary/percentage selector. Do not assume one exists; use a bounded candidate run and explicitly scoped live scenarios until such a control is authored. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:372-388] [INFERENCE: the inspected contracts expose a policy field and trace-mode selection, not a per-hub rollout selector]

### No inspected local contract supplies a numeric dominance threshold, a recorded contextual-detector result, or a live outcome corpus. Do not invent a percentage threshold or call a ranked helper current behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18-20,301-363] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No inspected local contract supplies a numeric dominance threshold, a recorded contextual-detector result, or a live outcome corpus. Do not invent a percentage threshold or call a ranked helper current behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18-20,301-363] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No inspected local contract supplies a numeric dominance threshold, a recorded contextual-detector result, or a live outcome corpus. Do not invent a percentage threshold or call a ranked helper current behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18-20,301-363] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15]

### SD-007 alone cannot establish a generic co-dominance rule because its acceptance deliberately permits either a combined route or explicit disambiguation for an explicit two-task prompt. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: SD-007 alone cannot establish a generic co-dominance rule because its acceptance deliberately permits either a combined route or explicit disambiguation for an explicit two-task prompt. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SD-007 alone cannot establish a generic co-dominance rule because its acceptance deliberately permits either a combined route or explicit disambiguation for an explicit two-task prompt. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88]

### The existing shared quick reference is not a neutral fallback-menu specimen, so its size cannot be treated as the target card size. [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The existing shared quick reference is not a neutral fallback-menu specimen, so its size cannot be treated as the target card size. [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The existing shared quick reference is not a neutral fallback-menu specimen, so its size cannot be treated as the target card size. [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145]

### The inspected contracts do not set a numeric tolerance for live route-quality regression. Structural and route-gold failures are zero-tolerance gates; any live pass-rate or cost tolerance must be predeclared with the candidate rather than invented after observing results. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The inspected contracts do not set a numeric tolerance for live route-quality regression. Structural and route-gold failures are zero-tolerance gates; any live pass-rate or cost tolerance must be predeclared with the candidate rather than invented after observing results. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The inspected contracts do not set a numeric tolerance for live route-quality regression. Structural and route-gold failures are zero-tolerance gates; any live pass-rate or cost tolerance must be predeclared with the candidate rather than invented after observing results. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513]

### The legacy public/private fixture directory is supported only by explicit `--fixtures-dir` and is superseded by each skill's manual-testing playbook, so it is not the default seam for this experiment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The legacy public/private fixture directory is supported only by explicit `--fixtures-dir` and is superseded by each skill's manual-testing playbook, so it is not the default seam for this experiment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The legacy public/private fixture directory is supported only by explicit `--fixtures-dir` and is superseded by each skill's manual-testing playbook, so it is not the default seam for this experiment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/README.md:18-26,50-58]

### Treating `routerPolicy.tieBreak` order or an already-configured `defaultMode` as proof of semantic dominance. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [INFERENCE: both are policy controls, not independently scored user outcomes] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `routerPolicy.tieBreak` order or an already-configured `defaultMode` as proof of semantic dominance. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [INFERENCE: both are policy controls, not independently scored user outcomes]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `routerPolicy.tieBreak` order or an already-configured `defaultMode` as proof of semantic dominance. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [INFERENCE: both are policy controls, not independently scored user outcomes]

### Treating deterministic `defaultApplied` telemetry as proof that live dispatch selected or loaded the candidate child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating deterministic `defaultApplied` telemetry as proof that live dispatch selected or loaded the candidate child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating deterministic `defaultApplied` telemetry as proof that live dispatch selected or loaded the candidate child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]

### Treating deterministic replay alone as proof of model-level clean disambiguation: it records scored candidates and telemetry but does not grade the model's clarification or semantic handling of the “only one” constraint. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:84-86] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating deterministic replay alone as proof of model-level clean disambiguation: it records scored candidates and telemetry but does not grade the model's clarification or semantic handling of the “only one” constraint. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:84-86]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating deterministic replay alone as proof of model-level clean disambiguation: it records scored candidates and telemetry but does not grade the model's clarification or semantic handling of the “only one” constraint. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480,643-702] [SOURCE: .opencode/skills/sk-doc/SKILL.md:84-86]

### Treating every within-delta two-mode score as an ordered bundle. The policy and SD-007 distinguish explicit separate tasks from unclear or contradictory alternatives. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating every within-delta two-mode score as an ordered bundle. The policy and SD-007 distinguish explicit separate tasks from unclear or contradictory alternatives. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every within-delta two-mode score as an ordered bundle. The policy and SD-007 distinguish explicit separate tasks from unclear or contradictory alternatives. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]

### Treating the current route-gold runner as proof that it already enforces the proposed null-hub telemetry assertions: the inspected runner invokes route gold and hard-gates its verdict, but does not itself establish those new expectation fields. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the current route-gold runner as proof that it already enforces the proposed null-hub telemetry assertions: the inspected runner invokes route gold and hard-gates its verdict, but does not itself establish those new expectation fields. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current route-gold runner as proof that it already enforces the proposed null-hub telemetry assertions: the inspected runner invokes route gold and hard-gates its verdict, but does not itself establish those new expectation fields. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298]

### Treating the existing SD-007 multi-intent scenario as the adversarial fixture: its contract deliberately permits a combined route or an explicit disambiguation, so it cannot detect an arbitrary single pick where the user said only one mode is wanted. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the existing SD-007 multi-intent scenario as the adversarial fixture: its contract deliberately permits a combined route or an explicit disambiguation, so it cannot detect an arbitrary single pick where the user said only one mode is wanted. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the existing SD-007 multi-intent scenario as the adversarial fixture: its contract deliberately permits a combined route or an explicit disambiguation, so it cannot detect an arbitrary single pick where the user said only one mode is wanted. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]

### Unconditional full-registry injection as the null fallback: it includes routing-adjacent metadata and all child surfaces, while the hub contract already separates classification from entry resolution. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Unconditional full-registry injection as the null fallback: it includes routing-adjacent metadata and all child surfaces, while the hub contract already separates classification from entry resolution. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unconditional full-registry injection as the null fallback: it includes routing-adjacent metadata and all child surfaces, while the hub contract already separates classification from entry resolution. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95]

### Using SD-007’s legacy intent labels as current executable route gold without mapping them to current registry identifiers. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:2-13] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using SD-007’s legacy intent labels as current executable route gold without mapping them to current registry identifiers. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:2-13] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using SD-007’s legacy intent labels as current executable route gold without mapping them to current registry identifiers. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:2-13] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Proposed replacement contracts and assertions:** (a) define a `HubDefer` result with `workflowMode: null`, scored `candidateModes`, `matchedAliases`, and a `deferReason`; `packet` and `backendKind` remain empty unti...

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The packet spec defines the seven parent hubs, five child defaults, two null models, and the divergent threads. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:19-103]
- Run 1 is a baseline to challenge, not a conclusion to reproduce. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:87-103]
- `resource-map.md` is absent at the parent packet; resource-map coverage is informational only for this detached lineage.
- The workflow's normal parent-spec, graph, memory, and continuity operations are intentionally excluded to honor the detached write boundary.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5.
- Convergence threshold: 0.05, telemetry only.
- Per-iteration budget: 12 tool calls and 10 minutes.
- Progressive synthesis: true.
- All writes are limited to this lineage directory.
- Reducer-owned state is refreshed only through the workflow reducer binding, never by a leaf iteration.
