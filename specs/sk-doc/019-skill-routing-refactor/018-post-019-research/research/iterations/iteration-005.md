# Iteration 5: Authored fixtures versus unseen natural prompts

## Focus

Determine whether authored route-gold scenarios and typed advisor fixtures predict routing on unseen natural prompts, or whether their results mainly reflect corpus authoring and replay coherence.

## Actions Taken

1. Inspected the prior sk-doc generalization experiment that compared rehearsed prompts, blind natural phrasing, deterministic replay, and live LLM routing.
2. Audited the skill-benchmark fixture schema and its T1/T2/T3 anti-circularity tiers.
3. Examined both advisor intent corpora for provenance, label leakage, and how “harder” examples are constructed.
4. Traced the benchmark harness and route-gold gate to distinguish evaluator correctness from evidence about the operational prompt distribution.

## Findings

### 1. Blind authored prompts detect replay overfit, but the existing positive result is narrow

The strongest direct evidence is the sk-doc held-out comparison: deterministic keyword replay scored `1/8` on blind natural phrasing while an LLM reading the same intent-to-leaf map scored `8/8`. The prompts were authored by agents blind to the keyword list, so this is credible evidence that literal keyword replay was overfit to rehearsed wording and that semantic routing transferred within that sk-doc slice. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:17]

That result does not establish fleet-wide predictive validity. It used one hub, one intent-to-leaf map, and eight reported held-out requests. The same note calls a 13-scenario corpus the future live-mode instrument, leaving an unresolved `8` versus `13` scope discrepancy and no reported all-hub estimate. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:40]

### 2. Typed T1/T2/T3 fixtures reduce circularity, but all three tiers remain authored

The fixture contract has useful safeguards: public prompts must avoid skill identities, intent keys, and resource paths; private gold is withheld from dispatch. Yet the tier definitions show the remaining sampling limitation. T1 is mechanically derived and paraphrased, T2 is hand-authored by someone blind to router tables, and T3 is deliberately adversarial. T2 is an independent-author transfer test, not an operationally sampled natural-prompt holdout. T3 measures chosen failure modes, not their prevalence. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scenario-authoring.md:22] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scenario-authoring.md:26] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scenario-authoring.md:46] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scenario-authoring.md:52]

The proposed T1-to-T2 gap is therefore a valid circularity meter, but not by itself a generalization estimate for unseen user traffic. Independence from router vocabulary prevents one leakage channel; it does not make the prompt-generating process representative.

### 3. The advisor corpora are diagnostic fixtures, not natural-prompt samples

The baseline advisor corpus explicitly divides prompts into `today-correct` and `intent-described`; many `today-correct` examples name the desired skill directly, such as “Use sk-code” and “Use system-spec-kit.” Those rows test identity recognition and scorer stability more than natural intent inference. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/README.md:18] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/README.md:23] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/intent-prompt-corpus.ts:13] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/intent-prompt-corpus.ts:23]

The harder corpus is also intentionally designed: every row is classified `lexical-mis-route` and includes an author-written reason explaining the anticipated confusion. This is valuable adversarial coverage, but it over-samples known ambiguity classes and cannot estimate real-world routing error without a separate sampling frame. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/README.md:24] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:5] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:12]

### 4. Route-gold proves contract conformance; it does not supply external validity

The benchmark defaults to scenarios from each skill’s manual testing playbook, and the route-gold lane evaluates rows carrying authored gold. Its tests correctly enforce exact intent/resource comparisons, rejection semantics, forbidden resources, and fail-closed gold parsing. Those are evaluator and contract-coherence properties. They say whether the router matches the author’s expected route on the supplied cases, not how often those cases occur or whether the corpus covers unseen natural demand. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:201] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:221] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:75] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/route-gold-gate.vitest.ts:145]

The current evidence supports a qualified answer: authored route-gold and typed fixtures predict behavior on other authored fixtures when provenance separation is strong, and they are effective at finding structural and lexical failures. They do not yet predict behavior on unseen natural prompts across all 12 hubs. The sk-doc blind experiment is encouraging for LLM semantic routing, but it is a small, hub-specific transfer result rather than an operational validation.

## Questions Answered

- **Do authored route-gold and typed fixtures predict behavior on unseen natural prompts, or are they overfit?** Partially. T1/rehearsed fixtures are visibly overfit for deterministic replay. Blind T2-style authoring reduces that overfit and found strong sk-doc LLM transfer (`8/8`), but there is no fleet-wide, prevalence-weighted, naturally sampled holdout. Existing fixture scores should be interpreted as coherence and adversarial-transfer evidence, not operational accuracy.

## Questions Remaining

- Does the sk-doc `8/8` result reproduce across the other 11 hubs and across routing archetypes?
- Why does the generalization note report eight evaluated held-out requests but describe a 13-scenario live instrument?
- What privacy-preserving source can provide a temporally sealed sample of naturally occurring prompts without retaining raw user text?
- How large must each hub/archetype stratum be to bound false-route and false-defer rates at the risk levels identified in iteration 2?
- Can fixture-to-natural score gaps be joined to the causal leaf-use telemetry from iteration 3 rather than stopping at route selection?

## Assessment

- `newInfoRatio`: `0.76`
- Novelty justification: Prior iterations established the need for sealed evaluation; this pass located the only direct blind-natural comparison, separated independent authoring from representative sampling, and showed why the current advisor and route-gold corpora cannot estimate operational accuracy.
- Confidence: High that current fleet evidence is insufficient for operational predictive claims; medium on the sk-doc transfer magnitude because the underlying eight-prompt corpus and the stated 13-scenario instrument are not reconciled in the inspected evidence.

## Reflection

What worked: triangulating the generalization note, fixture-authoring contract, advisor corpora, and harness implementation exposed the exact boundary between anti-circularity and external validity.

What failed: repository evidence did not identify a production-derived or temporally sampled natural-prompt corpus, and the reported eight-versus-thirteen held-out scope could not be reconciled.

Ruled out: treating T2 hand-authored prompts, the harder lexical corpus, or route-gold pass rate alone as a proxy for operational natural-prompt accuracy.

## Next Focus

Specify a privacy-preserving, provenance-stratified, temporally sealed natural-prompt evaluation that can be run across all 12 hubs and joined to successful leaf-use outcomes.
