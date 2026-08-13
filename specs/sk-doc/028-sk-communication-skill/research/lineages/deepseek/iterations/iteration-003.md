# Iteration 3: Meaning-preservation judge wiring and the semantic-veto layer

## Focus

Determine whether the meaning-preservation judge is actually composed into the production provider/runtime/render path, what plaintext its input boundary exposes, and how the reject-only semantic layer behaves when a rewrite barely changes. Angle: IMPROVE QUALITY (judge wiring) with an ARCHITECTURE seam.

## Actions Taken

- Traced `executeProviderRoute` -> candidate, `validateProjectionCandidate` -> judge seam, and `decideRender` -> presentation for a production composition call.
- Read the evaluation fidelity veto and the masked LLM proxy judge to separate runtime validation from evaluation evidence.
- Re-read the deterministic semantic comparator to establish its veto-only scope and its interaction with the unchanged-echo short-circuit.

## Findings

1. The optional meaning judge is not composed into production. `executeProviderRoute` returns a candidate (or exact-original) and never calls `validateProjectionCandidate`; `decideRender` consumes an already-produced validation result and never invokes a judge. The judge is only reachable by explicitly calling `validateProjectionCandidate(input, judge)` with `judgeMode: 'required'`. No source path wires a judge between the provider candidate and render decision. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:110-138] [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:229-244] [SOURCE: packages/cli-communication-projection/src/render/decision.ts:40-91]

2. The evaluation fidelity veto explicitly disables the judge. `evaluateFidelityVeto` calls `validateProjectionCandidate` with `judgeMode: 'disabled'`, so even the evaluation harness's deterministic veto lane never exercises the meaning judge. The judge exists as a validator option but is not exercised by any checked-in producer. [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:30-50]

3. The judge's input boundary is plaintext restored values. `runJudge` passes `sourceText` (decoded original) and `restored.text` (candidate with protected spans already restored) to the injected judge. A hosted judge at that seam would therefore be a second egress of real paths, numbers, and identifiers — it must be local or given a separately privacy-approved representation. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:175-181,317-357]

4. The judge is reject-only, not a quality ranker. It returns `'accept'` or `'reject'` (with timeout/cancelled/failed mapped to exact-original); there is no scoring, no candidate ranking, and no readability signal. It can veto meaning loss but cannot select a clearer paraphrase. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:315-370]

5. The deterministic semantic comparator is a veto, not an evaluator. `compareSemanticMeaning` compares fact maps (numbers + capitalized entities) and lexical buckets for polarity, requirement strength, priority, uncertainty, caveats, and directives, returning the first mismatch. Because it runs on restored text, protected values (numbers, identifiers) are already guaranteed unchanged by restoration; the comparator can only veto prose-level semantic drift. It cannot detect awkwardness, verbosity, or that a rewrite "barely changed". [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179]

6. The offline masked proxy judge is provisional evidence, not a runtime gate. `scoreMaskedReviewPacketWithProxy` returns `evidenceClass: 'llm-proxy'`, and `assertHumanCertifiable` throws on any `llm-proxy` result. Proxy ratings rank masked presentations for choosing profiles/models; they are never a reject-only runtime validator and never authorize a release. [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:32-58] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:28-38]

## Ruled Out

- Treating `evaluateFidelityVeto` as meaning-judge wiring: it hard-codes `judgeMode: 'disabled'`.
- Using the masked LLM proxy reviewer as the runtime meaning gate: it is comparative provisional evidence, not a privacy-scoped reject-only validator.
- Calling a judge after suppression/restoration on a hosted boundary: it would egress restored plaintext values.

## Dead Ends

- A source-wide search for a production call connecting the provider candidate to `validateProjectionCandidate`/`runJudge`/`decideRender` found none outside the evaluation modules; the composition gap is confirmed, not inferred.

## Edge Cases

- The judge is genuinely fail-closed when wired: missing/reject/timeout/cancelled all map to exact-original, so wiring it cannot weaken safety — it can only add rejections.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:110-138]
- [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:175-181,229-244,315-370]
- [SOURCE: packages/cli-communication-projection/src/render/decision.ts:40-91]
- [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:30-50]
- [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:32-58]
- [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:28-38]
- [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179]

## Assessment

- New information ratio: 0.78
- Novelty justification: confirming the evaluation veto hard-disables the judge (fidelity-veto.ts:39) and that the judge's plaintext-restored input makes a hosted judge a second egress, plus the semantics-on-restored-text nuance, are concrete new wiring facts.

## Reflection

- What worked: tracing the producer (executor), the validator (judge seam), and the consumer (render decision) as one graph proved the composition gap rather than asserting it.
- What did not work: no checked-in caller exercises the judge, so its behavior in production is unobservable until someone composes it.
- What I would do differently: next, pivot to the architecture question — whether the local primitive should be supplemented with deterministic/templated rendering given the raw-text nature of the assembled payload.

## Recommended Next Focus

Iteration 4: compare local-tokenize -> model -> restore against structured/templated rendering, semantic diffing, and a hybrid, grounded in the typed event contract and the raw-text terminal assembly.
