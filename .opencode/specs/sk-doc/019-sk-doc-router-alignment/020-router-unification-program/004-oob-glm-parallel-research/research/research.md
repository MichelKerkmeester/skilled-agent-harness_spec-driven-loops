---
title: "Fan-Out Synthesis: Out-of-Box GLM Parent-Hub Routing Research"
description: "Canonical synthesis of the five-iteration GLM-5.2 lineage exploring lateral alternatives to current parent-hub routing policy."
trigger_phrases:
  - "glm parent hub routing synthesis"
  - "typed handoff routing"
  - "threshold recovery provenance routing"
importance_tier: important
contextType: research
---

# Fan-Out Synthesis: Out-of-Box GLM Parent-Hub Routing Research

## 1. Executive Summary

The five forced-depth iterations produced three related design hypotheses:

1. Add a typed handoff record so a selected mode can explicitly transfer a request to a better mode.
2. Model routing policy as three independent concerns: threshold, recovery, and provenance.
3. Re-evaluate `defaultMode` as compensation for missing recovery rather than as an independent policy knob.

The strongest source-backed observations are narrower: routing weights are uniform across the reviewed hub routers, discrimination primarily resides in vocabulary-to-mode assignments, and the skill advisor already contains one specialized mode-pre-resolution precedent. The broader architecture remains design inference from one GLM lineage and requires independent validation before adoption.

## 2. Research Scope

- Topic: radical lateral alternatives for parent-hub routing.
- Executor: `cli-opencode` with `zai-coding-plan/glm-5.2` and requested `max` reasoning effort.
- Stop policy: forced five iterations; convergence was telemetry only.
- Implementation: excluded.
- Full narrative: `lineages/glm-oob/research.md`.

## 3. Method

Each iteration addressed a distinct part of the packet agenda and wrote a narrative, structured delta, and route-proven iteration record. The five mechanical iteration checks passed. The lineage report was then merged into the root findings registry and this canonical synthesis.

## 4. Finding: Typed Handoff

The lineage proposes a five-field handoff record:

- `routeId`
- `fromMode`
- `toMode`
- `reason`
- `evidence`

This would turn routing from an open-loop decision into a recoverable process. It would also provide a more useful feedback signal than inferring a routing failure from a later operator re-prompt.

The proposal is not implementation-ready. It changes every mode's return contract, needs loop prevention, and requires evidence that one handoff costs less than one clarification turn.

## 5. Finding: Threshold, Recovery, Provenance

The lineage decomposes policy into:

| Axis | Question | Example values |
|------|----------|----------------|
| Threshold | When is evidence strong enough to select a mode? | low, calibrated, defer below threshold |
| Recovery | What happens after an uncertain or wrong selection? | none, handoff, card, ordered bundle |
| Provenance | Where does vocabulary-to-mode evidence come from? | static, prior, offline learned |

This decomposition explains why a single `defaultMode` value cannot express aggressive selection with cheap recovery or conservative selection with learned evidence.

## 6. Finding: Vocabulary Assignment Over Weights

The inspected hub routers use uniform signal weights. On that evidence, learning numeric weights would add machinery without changing discrimination. A future adaptive experiment should instead evaluate vocabulary-to-mode assignment while keeping runtime behavior deterministic and offline-generated.

## 7. Finding: Minimal Router Hypothesis

The most aggressive simplification is a policy triple plus a vocabulary table. Under that hypothesis, `defaultMode`, tie-break behavior, ambiguity handling, and bundle fallback are redistributed across the three axes rather than accumulated in one policy object.

This is a design hypothesis, not a recommendation to migrate. The lineage itself identifies non-mechanical migration, bundle semantics, and fleet-wide contract changes as substantial costs.

## 8. Contrarian Reframe

The lineage's frame-break is that `defaultMode` may be a documented workaround for unrecoverable routing. If typed recovery exists, the field may become redundant. This claim usefully challenges the current framing, but it is contingent on proving that handoff is safe, cheaper, and operationally bounded.

## 9. Eliminated Alternatives

| Approach | Why it was ruled out |
|----------|-----------------------|
| Set every default to null and call that abolition | It preserves the surrounding routing architecture and merely selects a different fallback corner. |
| Generalize the specialized deep-loop regex path to every hub | It centralizes domain vocabularies in the advisor and creates a distributed maintenance burden. |
| Transfer scheduler or IP-routing mechanics literally | Priority and prefix matching largely duplicate existing weights and vocabulary classes. |
| Add full live health scoring immediately | It requires a grader, creates cold-start and Goodhart risks, and expands state by prompt class. |
| Learn weights | Uniform current weights provide no useful target; assignment carries the discrimination. |
| Update routing online | It would undermine deterministic replay and promotion review. |
| Add new axes while retaining `defaultMode` | It preserves the original conflation instead of testing the decomposition. |

## 10. Recommendations

1. Carry the source-backed observations into the related synthesis: uniform weights and the existing advisor-side mode-pre-resolution precedent.
2. Use threshold, recovery, and provenance as an evaluation vocabulary, not yet as a schema migration.
3. Evaluate typed handoff separately with a bounded contract, loop cap, and measured handoff-versus-clarification cost.
4. Keep any adaptive routing offline, deterministic, reviewable, and replayable.
5. Do not implement the minimal-router hypothesis without independent research and a migration design.

## 11. Open Questions

1. What is the observed base rate of correct default selections?
2. Is one bounded handoff cheaper than one clarification turn in latency, tokens, and operator effort?
3. How would every mode expose handoff without broadening its artifact contract unsafely?
4. What protects offline learning from malicious or low-quality handoff records?
5. Does an independent model or executed replay support the three-axis decomposition?

## 12. Evidence Limits

- This run contained one isolated GLM lineage. It did not perform a same-run cross-lineage confirmation.
- The lineage performed repository reading and design inference; it did not execute live router behavior.
- Eight lineage records carried timestamps outside the observed subprocess window and one record lacked a timestamp. The orchestration summary preserves this anomaly; iteration ordering and artifacts still passed mechanical validation.
- Claims about a sibling `sol-ultra` lineage in the lineage-authored report are contextual references to related work, not evidence produced or merged by this invocation.

## 13. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered by the lineage: 5/5
- Novelty trend: `1.0, 0.8, 0.9, 0.7, 0.6`
- Average reported novelty: `0.8`
- Route-proof checks: 5/5 passed
- Fan-out lineages: 1 succeeded, 0 failed

## 14. References

- `lineages/glm-oob/research.md`
- `lineages/glm-oob/iterations/iteration-001.md` through `iteration-005.md`
- `lineages/glm-oob/deep-research-state.jsonl`
- `lineages/glm-oob/findings-registry.json`
- `deep-research-findings-registry.json`
- `fanout-attribution.md`
- `orchestration-summary.json`
- `resource-map.md`

## 15. Canonical Status

This file is the root synthesis for this invocation. The lineage report remains the detailed source; the root registry and attribution preserve merge provenance.
