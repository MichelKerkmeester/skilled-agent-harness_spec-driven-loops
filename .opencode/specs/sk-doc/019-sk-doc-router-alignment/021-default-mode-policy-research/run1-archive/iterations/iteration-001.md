# Iteration 1: Deterministic Router-Replay Fallback Semantics

## Focus

This iteration investigated the current deterministic replay contract when no hub mode scores: whether a named child `routerPolicy.defaultMode` changes the observed mode set relative to `defaultMode: null`, how exact-set (`sameSet`) evaluation treats that result, and which constraints this places on later per-hub verdicts. “Fallback semantics” is interpreted narrowly as the shipped deterministic replay behavior; parent `SKILL.md` prose and intended live-agent behavior remain separate evidence surfaces for later iterations.

## Actions Taken

1. Searched the repository for `sameSet`, `AMBIGUITY_DELTA`, and `defaultMode` anchors to locate replay code and canonical exact-set documentation.
2. Read the replay parser, scorer, selector, and hub telemetry implementation around no-score handling.
3. Read the core route/resource assembly path to determine whether a configured default is injected downstream or can affect resources indirectly.
4. Searched the skill-benchmark CJS directory for a concrete `sameSet` helper; no helper was found there, so the exact-set contract was verified from the packet's benchmark documentation instead.

## Findings

1. **A configured child default is not inserted into replay's selected intents.** `routeSkillResources()` computes `intents` only as `selectIntents(scoreIntents(...))`; the subsequent hub telemetry call does not mutate that array, and the return path preserves it unchanged. Therefore a zero-score prompt produces `intents: []` for both a named child default and `null`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-659] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:665-702]
2. **The only replay-visible no-score difference is telemetry, and that telemetry exposes a naming tension.** With zero selected modes, a non-null policy sets `defaultApplied: true`, while `workflowMode` remains `null` and `deferReason` is `no-mode-scored`; a null policy changes only `defaultApplied` to `false`. Thus `defaultApplied` currently means “a default is configured/applicable,” not “the child was emitted as the workflow mode.” [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [INFERENCE: based on the simultaneous `defaultApplied`, `workflowMode`, and `deferReason` assignments at lines 342-353]
3. **Exact-set intent evaluation cannot presently distinguish child-default behavior from null behavior on a zero-score scenario.** The benchmark contract defines `sameSet(observed, expected)` as exact equality: one missing or extra mode fails. Because replay observes `[]` in both configurations, a gold expectation of the child fails and an empty expectation passes for both; only an assertion over telemetry could distinguish them. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-fleet-routing-consistency/implementation-summary.md:51-52] [INFERENCE: based on Finding 1 plus the documented exact-set contract]
4. **A child default neither resolves near-score ambiguity nor participates once anything scores.** Selection keeps every positive-scoring intent within the hard-coded delta of 1, while `defaultApplied` is true only when the selected set is empty. Later hub verdicts must therefore evaluate ambiguity policy independently from no-signal default policy. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-479] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-345]
5. **Later per-hub verdicts cannot use current intent `sameSet` success as proof that a named default is genuine or safe.** Each verdict must separately establish (a) the semantic/live-agent rule for a generic no-signal request, (b) whether the default child is dominant enough to justify guessing rather than deferring, and (c) an observable benchmark expectation for fallback/defer telemetry. Otherwise changing child versus null is behaviorally invisible to current intent-set gold. [INFERENCE: based on .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356,643-702 and .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147]

## Questions Answered

- **Router replay fallback semantics and sameSet behavior:** answered for the current deterministic implementation. Named child and null defaults produce the same zero-score intent set; only `routeTelemetry.defaultApplied` differs, while exact-set intent evaluation sees no distinction.

## Questions Remaining

1. What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default?
2. Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`?
3. How do the `sk-doc` defer model and `sk-code` detection model constrain fleet policy?
4. What exact create-skill canon and route-gold schema should encode default, defer, and detect outcomes deliberately?

## Ruled Out

- A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147]
- Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353]

## Dead Ends

None should be promoted as an exhausted research category. The failed helper-name search was narrow; the underlying exact-set question was answered through canonical documentation.

## Edge Cases

- Ambiguous input: “fallback semantics” could mean intended parent prose or deterministic replay. This iteration selected replay behavior and deferred live-agent semantics.
- Contradictory evidence: `defaultApplied: true` coexists with `workflowMode: null`; the code supports a telemetry-only interpretation, but the field name can overstate what replay actually emitted.
- Missing dependencies: none. The prompt's three-artifact scope lock intentionally overrides progressive synthesis for this leaf execution, so `research.md` was not touched.
- Partial success: the concrete `sameSet` helper was not located in the bounded script search, but two canonical packet documents independently state exact-set behavior; the in-scope question is still adequately answered.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-479`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:592-702`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-fleet-routing-consistency/implementation-summary.md:51-52`

## Assessment

- New information ratio: 1.0
- Novelty calculation: 5 fully new findings, 0 partially new, 0 redundant; `(5 + 0.5 × 0) / 5 = 1.0`.
- Questions addressed: router replay fallback semantics and `sameSet` behavior.
- Questions answered: router replay fallback semantics and `sameSet` behavior.

## Reflection

- What worked and why: reading the score-to-return data path established the behavior directly and avoided inferring fallback from policy names.
- What did not work and why: the bounded helper-name search found no `sameSet` implementation in the benchmark CJS directory, indicating the comparison is implemented elsewhere or expressed through another helper name.
- What I would do differently: in the encoding iteration, trace the route-gold evaluator from its scenario loader rather than searching by the prose helper name.

## Next Focus

Define the dominant-child decision rule while keeping three evidence layers separate: live parent routing semantics, replay-observed intent sets, and telemetry-observed fallback/defer state. The rule must not treat current `sameSet` success as fallback proof.

## Recommended Next Focus

Derive a falsifiable dominant-child rule using generic-request prevalence, misroute cost, reversibility/disambiguation cost, and whether a hub has deterministic detection. Use that rule before assigning any of the five per-hub verdicts.
