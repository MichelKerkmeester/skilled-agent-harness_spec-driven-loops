# Iteration 4: Q4 / Thread 8 — Co-Dominant Modes and the Dominance Evidence Rule

## Focus

Answer forced Q4 under `max-iterations` without revisiting the earlier helper-payload, experiment-design, migration, or baseline-policy work. “Genuinely co-dominant” is interpreted narrowly as two modes that remain within the policy ambiguity boundary after available signals, while distinguishing an explicit request for two independent tasks from an unresolved request that names two alternatives.

## Findings

1. **Demonstrated policy behavior:** `sk-doc` assigns `single` only to one dominant intent, reserves `orderedBundle` for clearly separate authoring intents, and uses `defer` for unclear or contradictory intent. Its configured default is `null`; the `tieBreak` is an ordered list, while the only explicit bundle rule is `create-skill` plus `create-quality-control`. An ordered tie-break is therefore deterministic ordering metadata, not demonstrated evidence that one candidate is semantically dominant. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-97] [INFERENCE: the policy defines order but no evidence or outcome field that converts tie-break position into dominance]
2. **Demonstrated contract boundary:** the current registry defines mode identity, packet/backend mapping, commands, aliases, and advisor metadata; the routing contract either defers low-confidence/contradictory/no-winner input or loads each already-resolved mode. Neither source defines a `rankedHelper`, a contextual-detector schema, or a dominance-measurement field. A ranked helper or contextual detector is consequently a proposal, not current hub behavior. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15,17-163] [SOURCE: .opencode/skills/sk-doc/SKILL.md:48-97]
3. **Fixture evidence is conditional, not a default proof:** SD-007 treats an explicit two-task request as one where both candidates must be retained; its acceptance allows a union/combined route or an explicit disambiguation and rejects silently discarding either. That supports an ordered bundle only when the request independently asks for both compatible tasks. Its `DOC_QUALITY`/`FLOWCHART` labels are not current `workflowMode` identifiers, so the fixture needs a current-ID mapping before it is executable route gold; it does not demonstrate that a generic co-dominant score should auto-bundle or select a default. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163] [INFERENCE: fixture labels differ from the registry’s current workflow-mode keys]
4. **Proposal — decision ladder and evidence rule:** run a contextual detector first; when it supplies a unique, predeclared discriminator, return `single`. If the prompt independently requests both compatible tasks and an explicit bundle rule supports their order, return `orderedBundle`. If two modes remain co-dominant, or the user requires one but supplies no discriminator, `defer` and show a ranked helper as a non-binding explanation rather than dispatching a mode. Treat a candidate as a true dominant default only after a current-ID, independently private-golded corpus keeps it the unique desired outcome with `defaultMode` held null during measurement, remains invariant under paraphrase/alias-order/context variants, preserves explicit bundle and contradictory-single-choice cases, and passes the hub route-gold/D5 gates; if that counterfactual evidence is absent, the default is a presumption and the correct outcome is `defer`. The inspected benchmark supplies deterministic route-gold enforcement and an opt-in, target-owned live outcome pass, but no numeric dominance threshold or completed live result. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20,65-89,174-208,246-298,301-363] [INFERENCE: the ladder operationalizes the current three outcomes while preventing the fallback policy from supplying its own evidence]

## Ruled Out

- Treating `routerPolicy.tieBreak` order or an already-configured `defaultMode` as proof of semantic dominance. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [INFERENCE: both are policy controls, not independently scored user outcomes]
- Treating every within-delta two-mode score as an ordered bundle. The policy and SD-007 distinguish explicit separate tasks from unclear or contradictory alternatives. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88]
- Using SD-007’s legacy intent labels as current executable route gold without mapping them to current registry identifiers. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:2-13] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-163]

## Dead Ends

- No inspected local contract supplies a numeric dominance threshold, a recorded contextual-detector result, or a live outcome corpus. Do not invent a percentage threshold or call a ranked helper current behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:18-20,301-363] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15]
- SD-007 alone cannot establish a generic co-dominance rule because its acceptance deliberately permits either a combined route or explicit disambiguation for an explicit two-task prompt. [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88]

## Edge Cases

- Ambiguous input: “co-dominant” can mean two independently requested tasks or two alternatives competing for one action. This iteration selected the latter unless the prompt explicitly requests both; the former is the ordered-bundle positive case. [SOURCE: .opencode/skills/sk-doc/hub-router.json:8-20]
- Contradictory evidence: none. SD-007’s union-or-defer allowance is a fixture-level acceptance range, not a directive to auto-bundle every tie.
- Missing dependencies: no local live outcome data or numeric dominance threshold exists. The fallback is an evidence rule and a target-owned measurement design, not a claim that a default has already been proven.
- Partial success: none. Q4 is answered as a policy/evidence-rule recommendation; no implementation or live routing result is claimed.

## Sources Consulted

- .opencode/skills/sk-doc/hub-router.json:4-20
- .opencode/skills/sk-doc/mode-registry.json:5-15,17-163
- .opencode/skills/sk-doc/SKILL.md:48-97
- .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42,73-88
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20,65-89,174-208,246-298,301-363

## Assessment

- New information ratio: 0.98
- Questions addressed: **Q4 (thread 8):** How should a hub with two genuinely co-dominant modes behave: ordered bundle, ranked helper, contextual detector, or defer? What evidence rule prevents a false dominant default?
- Questions answered: **Q4 (thread 8):** How should a hub with two genuinely co-dominant modes behave: ordered bundle, ranked helper, contextual detector, or defer? What evidence rule prevents a false dominant default?
- Demonstrated versus proposed: the current `single|orderedBundle|defer` policy and its fixture acceptance range are demonstrated; the detector/helper ladder and counterfactual dominance rule are proposals.

## Reflection

- What worked and why: separating outcome policy, registry schema, and fixture acceptance exposed that a score tie, a deterministic ordering list, and an explicit two-task bundle are different facts.
- What did not work and why: local contracts offer deterministic gates but no empirical dominance corpus or live outcome result, so they cannot establish a numeric threshold or certify a real default.
- What I would do differently: bind the proposed current-ID fixture matrix to one target hub, keep `defaultMode` null during counterfactual scoring, and add a private-gold live pass only after the deterministic route-gold baseline succeeds.

## Recommended Next Focus

Investigate Q5 / thread 10: identify whether any current `defaultMode` contributes to hub identity or catch-all scoring, then specify replacement assertions that keep a null hub discoverable without recreating hidden auto-default bias. [INFERENCE: Q4 supplies the evidence rule that Q5’s replacement contract must preserve]
