# Iteration 4: Decision Framework and Promotion Gates

## Focus

Convert the evidence into a weighted, reversible choice. Stress-test the argument that recent implementation effort or future capabilities should override present consumer fit.

## Findings

1. Present consumers do not use persistent-only request features. A scoped search for `queryVector`, `vectorProfile`, `cursor`, `candidateK`, and channel controls found those tokens in database/oracle/tests, not in the four corpus consumer calls. The future JS-capabilities packet explicitly keeps new features shadow/flag-gated and away from the default path. [SOURCE: scoped Grep result over `.opencode/skills/sk-design/design-*`] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/002-js-capabilities/spec.md:55-79] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/002-js-capabilities/spec.md:99-132]
2. The roadmap's own governance favors conditional adoption: native work requires a named measured SLO crossing and accepts "no Rust" as a valid outcome; growth work is out of scope at today's 1,290 bundles. The same evidence discipline should apply one level earlier to making SQLite the default. [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/003-measured-native/spec.md:54-74] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/003-measured-native/spec.md:95-123] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/004-growth/spec.md:55-83]
3. Weighted present-state score (1=poor, 5=strong) favors formal shelving 85/100 over wiring 54/100:

| Criterion | Weight | Wire | Shelf | Evidence basis |
|---|---:|---:|---:|---|
| Current consumer fit | 25 | 3 | 5 | Shared bounded facade works; no persistent-only consumer demand |
| Measured material value | 20 | 1 | 4 | Only directional 20-style timing; no workload/SLO/relevance proof |
| Operational simplicity/ownership | 20 | 1 | 5 | Wire adds publication/freshness/migration/repair state |
| Integrity and rollback | 15 | 5 | 4 | DB generation model is stronger; flat manifest guards are simpler but less atomic |
| Future capability leverage | 10 | 5 | 2 | DB enables vectors/cursors/multimodal roadmap |
| Reversibility and option value | 10 | 3 | 4 | Shelf can recover from Git; wire creates consumers and generated-state coupling |

   Weighted formula is `sum(weight * rating / 5)`. Ratings are decision aids, not measurements; changing reasonable ratings does not close the 31-point gap without assuming future demand or unmeasured materiality. [INFERENCE: iterations 1-3]
4. Recommendation: formally shelve the SQLite runtime now and make the flat-file engine the sole supported path. "Formally" means remove live mode claims and dormant runtime ownership, not merely retain `legacy` as a default beside unused alternatives. Recent DB work is a sunk cost; its best return is captured design evidence and Git history, not indefinite maintenance. [INFERENCE: weighted framework and gap-analysis requirement at .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:168-171]
5. Reactivation should require all gates, not any one gate: (a) representative legacy workload with query count and warm/cold p50/p95; (b) an approved SLO breach or persistent improvement of at least 30% and 25 ms absolute at p95; (c) full-corpus build size/time and deterministic refresh ownership; (d) 100% facade/refusal/generation parity plus no statistically material relevance regression on human judgments; (e) successful shadow operation and rollback; and (f) either two consumers needing a persistent-only capability or a proven latency need. These are proposed gates, not observed results. [INFERENCE: current evidence gaps and roadmap gate patterns]
6. Wiring remains a valid contingent plan, but only after the gates clear. The existing facade, operator, telemetry, oracle, and generation machinery make later revival technically credible; they do not justify retaining a dormant production surface indefinitely. [SOURCE: iterations 1-3]

## Ruled Out

- Keep all database code indefinitely "for optionality": Git history and decision artifacts preserve optionality without active maintenance claims.
- Promote because Phase 0 was recently built: sunk cost is not present demand.
- Promote on one fast benchmark: operations, parity, relevance, and ownership are conjunctive gates.

## Dead Ends

- A compromise where `legacy` remains default and `shadow|persistent` remain undocumented-but-live does not remediate the identified dormancy gap; it preserves the current ambiguity.

## Edge Cases

- Ambiguous input: "shelve" might mean leave code dormant. This framework defines it more strongly: remove supported runtime surface while preserving evidence and recoverability in version control.
- Contradictory evidence: the database scores highest on integrity and future leverage but still loses because current demand, evidence, and ownership carry greater weight.
- Missing dependencies: operator risk tolerance could alter weights, but the result is robust unless future capability is weighted above current use and operations combined.
- Partial success: exact promotion thresholds require operator approval; proposed values are explicit starting gates.

## Sources Consulted

- Detached state/config/strategy through iteration 3.
- Scoped consumer feature-token search.
- `.opencode/specs/sk-design/015-styles-database-evolution/002-js-capabilities/spec.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/003-measured-native/spec.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/004-growth/spec.md`
- Parent gap analysis.

## Assessment

- New information ratio: 0.58
- Novelty justification: The scoring model, formal shelf definition, and conjunctive promotion gates are new; underlying evidence is synthesized from prior iterations.
- Questions addressed: decision criteria and thresholds.
- Questions answered: current evidence favors formal shelving 85/100 to 54/100, with explicit gates for reversal.
- Confidence: medium-high; scoring contains judgment, but the direction is robust to moderate weight/rating changes.

## Reflection

- What worked and why: weighted scoring made value judgments inspectable and exposed where a pro-wire conclusion would depend on future assumptions.
- What did not work and why: the broad wildcard scope in the feature-token search also surfaced database internals; the absence claim was therefore limited to verified consumer call sites rather than the whole glob output.
- What I would do differently: final iteration should produce both executable plans so the recommendation remains useful even if the operator chooses the lower-scoring option.

## Recommended Next Focus

Adversarially validate the recommendation and produce complete wiring and deprecation plans, including sequencing, rollback, preserved assets, and roadmap/spec consequences.
