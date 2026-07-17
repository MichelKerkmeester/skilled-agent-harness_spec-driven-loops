# Iteration 1: Contrarian and Live-Routing Pass

## Focus

This iteration steelmanned named defaults, inspected deterministic replay semantics, and defined a live-model experiment that can falsify either the named-default or null-default policy. The narrow interpretation was zero-signal parent-hub routing; migration mechanics and the third-archetype schema remain deferred.

## Findings

1. **Deterministic replay does not actually select `routerPolicy.defaultMode` on a zero-signal request.** `selectIntents()` returns an empty array when no mode scores; hub telemetry then reports `workflowMode: null`, `defaultApplied: true` when a named default is configured, and `deferReason: "no-mode-scored"`. The subsequent resource assembly receives the empty intent set. Therefore `defaultApplied` is currently an observation about configuration, not proof that replay routed to the named child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:476-480] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]

2. **The strongest repository-backed case for a named default is a declared prior or recommended action, not deterministic selection.** `sk-prompt` has only two modes: the broad, mutating prompt-engine workflow and a read-only per-model profile lookup whose aliases name model-specific tasks. Its playbook explicitly treats `prompt-improve` as the expected workflow for an ambiguous model-adjacent request while allowing defer rather than a silent wrong-mode resolution. This supports retaining `prompt-improve` as a recommendation when specificity is absent, but it does not establish an approximately 80% live traffic share. [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:17-40] [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:17-27] [INFERENCE: a broad action mode plus a narrow lookup mode makes a named recommendation coherent even when the router still asks for clarification.]

3. **Current gold artifacts already separate configured defaults from expected behavior.** The CLI hub's ambiguous scenario requires `defer` rather than silently choosing `cli-opencode`, and the MCP hub's scenario requires the same despite a configured Chrome default; the latter explicitly calls the default only a defer-time suggestion. This is evidence against treating removal of the name as necessary to obtain defer behavior, while also showing that a named field is semantically misleading if readers assume it controls selection. [SOURCE: .opencode/skills/cli-external-orchestration/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-24] [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-26] [INFERENCE: run 1 overreaches if it equates a configured name with an observed silent route; the implementation and gold currently permit configured-name-plus-defer.]

4. **A live paired experiment can falsify both policy positions.** For each hub, construct matched zero-signal prompts and run each prompt under two otherwise identical router packets: named `defaultMode` versus `null`, both exposing the same compressed mode card. Blind-grade whether the model selects a mode, asks one targeted question, invents a mode, or freezes; then replay the same corpus deterministically. Named defaults are falsified as harmless metadata if they significantly increase unsupported single-mode picks; null defaults are falsified as preferable if they significantly increase freezes, arbitrary picks, or unnecessary questions without reducing wrong picks. The repository already distinguishes deterministic router replay from advisory live `cli-opencode` traces, so the experiment should report both rather than treating replay as a live-model proxy. [SOURCE: .opencode/commands/deep/skill-benchmark.md:142-146] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:7-24] [INFERENCE: a randomized paired comparison controls prompt wording and isolates the policy field plus its presented fallback guidance.]

## Ruled Out

- Treating `routeTelemetry.defaultApplied` as evidence that replay selected the default child: `workflowMode` remains null and `deferReason` is `no-mode-scored` on that branch. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-355]
- Using deterministic replay alone to settle live-model behavior: the benchmark surface explicitly distinguishes deterministic router traces from advisory live traces. [SOURCE: .opencode/commands/deep/skill-benchmark.md:142-146]

## Dead Ends

- Re-deriving the run-1 per-hub keep/flip table was not pursued because it is explicitly saturated in strategy. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-ultra/deep-research-strategy.md:40-54]

## Edge Cases

- Ambiguous input: "actual replay/default semantics" could mean telemetry or selected workflow; both were inspected and the distinction is the main finding.
- Contradictory evidence: configured named defaults coexist with gold scenarios that require defer. This is preserved as a configuration-versus-behavior distinction, not collapsed into either policy verdict.
- Missing dependencies: no zero-signal live-model corpus or traffic-frequency dataset was found in the focused repository pass; dominance remains unproven.
- Partial success: replay semantics and a falsification design are resolved, but no live model was executed in this iteration.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:7-24,315-356,391-429,432-480,580-702`
- `.opencode/skills/sk-prompt/mode-registry.json:17-40`
- `.opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/ambiguous_default.md:17-27`
- `.opencode/skills/cli-external-orchestration/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-24`
- `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-26`
- `.opencode/commands/deep/skill-benchmark.md:142-146`

## Assessment

- New information ratio: 1.0
- Novelty justification: All four findings are new to this lineage; they distinguish configuration telemetry from selected behavior, establish the strongest bounded named-default case, expose contradictory gold semantics, and define a paired live falsification experiment.
- Questions addressed: strongest case for named defaults and run-1 overreach; live-model and fallback evaluation.
- Questions answered: the strongest repository-backed named-default case and the exact deterministic zero-signal replay behavior.
- Confidence: high for replay semantics; medium for policy implications until the live paired experiment runs.

## Reflection

- What worked and why: tracing selection, telemetry, and assembly separately exposed a semantic gap hidden by the `defaultApplied` field name.
- What did not work and why: repository scenarios cannot establish the claimed 80% dominance threshold because they are designed fixtures, not traffic samples.
- What I would do differently: run the same zero-signal corpus in router and live trace modes and retain raw model rationales for blind grading.

## Recommended Next Focus

Specify the paired live experiment as a runnable benchmark matrix: prompt corpus construction, named-versus-null packet variants, blind grading rubric, minimum sample size, and falsification thresholds per hub.
