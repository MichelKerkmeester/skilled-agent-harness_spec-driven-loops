# Parent-Hub `defaultMode` Policy: Run 2 Terra-Max Research

Detached fan-out lineage: `terra-max`.

## 1. Executive Summary

This forced-depth run examined five divergent questions without re-litigating Run 1's per-hub keep/flip verdict. The strongest confirmed result is that the current deterministic replay does not use `defaultMode` to score intents or derive `workflowMode`, packet, or backend identity. It reads the field only after selection to calculate `defaultApplied` telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480]

The proposed policy consequence is not "default everything to null." It is: treat a named default as a behavior proposal that needs counterfactual evidence; use `defer` when a request has no unique signal; and make discoverability explicit rather than allowing fallback metadata to synthesize a child selection. The evidence supports a compact, neutral helper after defer, but does not establish its optimal token size or live routing lift. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35] [SOURCE: .opencode/skills/sk-doc/shared/references/smart_routing.md:207-214] [INFERENCE: based on the inspected routing contracts and payload topology]

## 2. Scope And Guardrails

- This lineage investigated policy, benchmark, and migration design only.
- It did not change any shipped `defaultMode`, router signal, registry, benchmark, or canonical parent-packet document.
- It treats Run 1's per-hub verdict as a baseline to stress-test, not a conclusion to reproduce. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:87-103]
- All artifacts are confined to the detached lineage directory.

## 3. Method

Five isolated iterations inspected the actual hub router, mode registry, deterministic replay, route-gold benchmark, and existing ambiguity playbook. Each iteration wrote cited evidence, an append-only state record, and a delta before reducer refresh. The investigation used the packet's divergent agenda threads 1, 3, 4, 8, and 10. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:86-103]

## 4. Confirmed Runtime Behavior

| Confirmed fact | Evidence |
| --- | --- |
| Intent scores come from `intentSignals`; selected modes are chosen from scored candidates within the ambiguity boundary. | [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] |
| `defaultMode` is read after selection only to set `defaultApplied` when no modes were selected and the configured value is non-null. | [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] |
| `sk-doc` keeps discovery signals, `defaultMode`, and `defaultResource` as separate policy fields; null/default defer behavior is not itself a workflow mode. | [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35] |
| The benchmark provides D5 and enforced route-gold seams, but the inspected code does not prove it already asserts the proposed null-hub telemetry fields. | [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:246-298] |

## 5. Fallback-Resource Finding

The full registry is not a minimum defer helper because it contains broad workflow metadata beyond choice support. Unconditional child hints are also unsuitable before a child is ranked because child fallback questions presuppose the child domain. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124]

The source-supported candidate is a compressed, neutral disambiguation card: defer reason; zero to two ranked candidates; one discriminator per candidate; the hub's common confirmation fields; and a child hint only after ranking. This is a proposal, not a measured optimum. [SOURCE: .opencode/skills/sk-doc/SKILL.md:77-97] [SOURCE: .opencode/skills/sk-doc/shared/references/smart_routing.md:207-214] [INFERENCE: based on the observed source topology]

## 6. Controlled Experiment Design

Evaluate three blinded fixture strata:

| Stratum | Expected outcome | Key measures |
| --- | --- | --- |
| Z: zero signal | `defer` with a discriminating clarification | wrong-mode rate, false-positive resources, clarification adequacy |
| W: weak but discriminating signal | one named signal-selected mode | exact-mode correctness, alias stability |
| A: two-mode request that requires only one outcome | `defer` while retaining candidates | wrong-mode rate, candidate-retention recall, alias-order and paraphrase invariance |

Use an explicit compatible two-task request as the positive `orderedBundle` control. Run deterministic replay as the mechanical baseline and a separately scored live run for actual model behavior; replay alone cannot assess semantic handling of the contradictory single-choice wording. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:37-42] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:174-206]

## 7. Migration And Rollback

Make one policy-field change at a time. Freeze the baseline corpus, add private candidate gold for the intentional behavior, run D5 plus route-gold replay, then run bounded private-gold live scenarios. Promote sequentially only if the candidate meets predeclared quality and cost bounds. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:246-298] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:503-513]

Rollback by restoring the recorded single `defaultMode` value and rerunning the unchanged baseline corpus when a hard benchmark block, topology drift, invariant-fixture failure, unplanned default application, or live private-gold regression occurs. No inspected contract exposes a runtime percentage canary, so a bounded candidate run is the evidence-backed safety mechanism. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:301-388] [INFERENCE: single-variable restoration preserves causal attribution]

## 8. Co-Dominant Modes

The demonstrated outcomes are `single`, `orderedBundle`, and `defer`. A tie-break list is deterministic ordering metadata, not evidence of semantic dominance. An explicit two-task request can justify `orderedBundle`; an ambiguous or contradictory one should defer. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md:73-88]

Proposed decision ladder:

1. Use a contextual discriminator for `single` only when it gives a unique, predeclared answer.
2. Use `orderedBundle` only for independently requested, compatible tasks covered by an explicit bundle rule.
3. Otherwise return `defer` with a non-binding ranked helper.

A named default is demonstrated only after a null-held, private-gold counterfactual corpus preserves the unique desired result across paraphrase, alias-order, and context variants. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-89] [INFERENCE: this prevents policy metadata from serving as its own evidence]

## 9. Identity And Catch-All Boundary

`defaultMode` does not currently anchor replay identity or catch-all scoring. `workflowMode`, packet, and backend fields derive from selected modes before `defaultApplied` is computed. A null hub can therefore remain discoverable through its signal map and a neutral fallback resource without inventing a child route. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35]

## 10. Policy Recommendation

Adopt a three-archetype policy at the router-canon level:

| Archetype | Correct outcome when no unique mode is established |
| --- | --- |
| Dominant-child hub | retain a named default only after counterfactual evidence establishes dominance |
| Defer-routed keyword hub | `defaultMode: null`; explain and ask through a neutral helper |
| Detection-routed hub | route from a declared contextual detector; defer if its detector is inconclusive |

This preserves the existing pure-router boundary: the parent does not become a mode and no fallback secretly selects a child. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:59-63] [INFERENCE: derived from the confirmed outcome and identity boundaries]

## 11. Contract And Benchmark Proposal

Define a `HubDefer` result with `workflowMode: null`, scored `candidateModes`, `matchedAliases`, and a `deferReason`; keep packet and backend empty until a signal-selected mode exists. Pair it with a `DiscoverabilityHelper` that can ask one discriminating question but cannot carry a mode id, child packet path, synthetic alias, or score. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [INFERENCE: proposed contract preserving observed separation]

Add route-gold assertions:

- Z: null mode, empty aliases/packet/backend, `defaultApplied: false`, and `no-mode-scored`.
- W: exactly the signal-selected mode and no default.
- A: defer with retained candidates and no child-mode resource load.
- Mutation control: a non-null default on a defer-routed hub fails a static anti-implicit-selection lint or these invariants.

The create-skill parent-hub template should require an explicit archetype, the fallback contract, and one zero-signal fixture rather than treating `defaultMode` as an imitation-friendly default field. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json] [INFERENCE: proposed canon extension]

## 12. Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Unconditional full registry injection | Includes broad metadata rather than only choice support. | [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] | 1 |
| Unconditional child hint | Presupposes the child domain before ranking. | [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] | 1 |
| Replay-only proof of model behavior | Replay cannot score semantic clarification quality. | [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] | 2 |
| Multi-field or multi-hub flip | Removes causal attribution and clean rollback. | [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] | 3 |
| Tie-break as dominance proof | Ordering is policy metadata, not outcome evidence. | [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] | 4 |
| `defaultApplied` as a route proof | It is post-selection telemetry only. | [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] | 5 |

## 13. Divergence Map

| Iteration | Agenda thread | Net-new result |
| --- | --- | --- |
| 1 | Fallback-resource rule | Full registry and pre-ranking child hints are unsuitable; compact card remains a testable proposal. |
| 2 | Live-mode reality | Z/W/A fixture matrix separates replay control from live behavioral measurement. |
| 3 | Migration and rollback | One-field candidate, frozen corpus, private-gold live trace, and immediate restoration path. |
| 4 | Multi-dominant hubs | Distinguish `single`, explicit bundle, and defer; require counterfactual dominance evidence. |
| 5 | Catch-all coupling | `defaultMode` does not currently drive scoring or identity; add explicit anti-bias invariants. |

## 14. Open Questions

- What compact-card content and token budget measurably improve post-defer resolution without increasing wrong-mode selection?
- Does the proposed Z/W/A matrix demonstrate stable model behavior under live, blinded scoring?
- The first state record has `iteration: 1` but `run: 2`; completion and synthesis use the canonical iteration count, while the dashboard displays the duplicate run number. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/terra-max/deep-research-state.jsonl:2]

## 15. Evidence Limits

No inspected source contains a numeric dominance threshold, a live routing outcome corpus, a runtime canary, or the proposed null-hub route-gold expectation schema. The claims above therefore distinguish confirmed current behavior from proposed contracts and do not claim that a shipped change is already safe. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:301-388] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:5-15]

## 16. References

- Parent research packet and divergent agenda: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md`
- Hub policy and modes: `.opencode/skills/sk-doc/hub-router.json`, `.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/SKILL.md`
- Router and benchmark seams: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`
- Existing ambiguity playbook: `.opencode/skills/sk-doc/manual_testing_playbook/unknown_fallback/ambiguous_multi_intent.md`
- Iteration evidence: `iterations/iteration-001.md` through `iterations/iteration-005.md`

## 17. Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 5 of 5.
- Registry question coverage: 3/5; Q1 and Q2 remain empirical rather than unresearched.
- New-information trend: 0.88, 0.88, 0.88, 0.98, 0.85; arithmetic mean 0.894.
- Convergence threshold: 0.05, recorded as telemetry only under the forced `max-iterations` policy.
- No graph convergence or pivot was used because detached containment excludes graph persistence.
