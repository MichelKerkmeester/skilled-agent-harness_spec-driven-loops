---
title: Deep Research Strategy - Communication Projection Lineage
description: Research state for the detached communication-projection investigation.
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Communication Projection Lineage

## 1. OVERVIEW

This lineage investigates the real package and skill contract, with findings externalized after every iteration. The lineage is read-only against the implementation and writes only its own research packet.

## 2. TOPIC

Deep-research the communication-projection capability (packages/cli-communication-projection/) and the sk-communication skill. Context: local protected-span tokenization sends only tokenized prose to a model, restores values locally, and fails closed to the exact original when fidelity breaks. A live DeepSeek smoke produced modest rewrites, with some unchanged and one containing prose artifacts.

## 3. KEY QUESTIONS (remaining)

- [ ] Which tokenization, prompting, model, judge, and evaluation changes improve readability without weakening privacy or exact fidelity?
- [x] Is local-tokenize -> model -> local-restore the right architecture, or should structured, templated, semantic-diff, or hybrid rendering carry more of the readability burden? (iteration 4: retain the primitive, add a hybrid skeleton and prose slots)
- [x] Does projection earn its complexity over deterministic formatting, and which user journeys justify it? (iteration 5: conditionally yes for complex multi-sentence user-facing warnings, caveats, consequences, and recovery explanations; deterministic/native output remains the default elsewhere; net quality benefit is still unmeasured)
- [x] How do the package and skill contracts constrain prompt profiles, provider controls, and model-tier experiments? (iteration 2)

## 4. NON-GOALS

- Implementing changes in the package or skill.
- Treating the supplied smoke anecdote as a statistically complete benchmark.
- Rewriting canonical events, transcripts, tool data, model context, or repository files outside this lineage.

## 5. STOP CONDITIONS

- Run exactly five iterations because stopPolicy is max-iterations; convergence is telemetry only.
- Synthesize the strongest evidence-backed findings and record unresolved questions rather than stopping early.

## 6. ANSWERED QUESTIONS

The current quality ceiling is structurally explained by broad span protection, opaque token copying burden, a minimal whole-message prompt, and a reject-only semantic gate; typed assembly supports a deterministic skeleton while raw-text references still require bounded model prose slots. Iteration 5 found that value is conditional: complex multi-sentence user-facing explanations can justify projection, while short and structured output should remain deterministic/native. (iterations 1-5)

## 7. WHAT WORKED

Reading producer and consumer together exposed the full causal path from protection to provider prompt to validator; a built-package probe made adjacent-span inflation observable, the control compiler distinguished synthetic fixture capability from the DeepSeek preset, a negative import/call search exposed the judge composition gap, event/client contracts exposed a hybrid architecture seam, and privacy/doctor/release/rollback documents converted value into a reversible deterministic-first adoption boundary. (iterations 1-5)

## 8. WHAT FAILED

No direct live-provider artifact, product quality tier, user-value benchmark, or deterministic prose baseline was available in the package; no production composition call connects candidates to the optional judge, and no structured prose renderer exists. Model-quality, net-value, and hybrid-architecture claims therefore require an explicit integration test and fixed evaluation corpus. (iterations 1-5)

## 9. EXHAUSTED APPROACHES (do not retry)

Do not retry the ruled-out ideas of weakening placeholder identity checks or removing protected categories without a replacement privacy policy.

## 10. RULED OUT DIRECTIONS

- Treat deterministic fidelity validation as a readability evaluator: it accepts unchanged prose and only vetoes a bounded set of semantic changes. (iteration 1, evidence: packages/cli-communication-projection/src/fidelity/validator.ts:200-244; src/fidelity/semantics.ts:61-107)
- Remove protection categories merely to reduce token count: that would send values outside the current privacy boundary to the provider. (iteration 2, evidence: packages/cli-communication-projection/src/providers/adapters.ts:96-100; packages/cli-communication-projection/src/fidelity/protected-spans.ts:77-112)
- Use the offline masked LLM proxy reviewer as a runtime meaning gate: it produces comparative provisional ratings, not a privacy-scoped reject-only validation result. (iteration 3, evidence: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-57; packages/cli-communication-projection/src/evaluation/types.ts:21-37)
- Enable projection for every message: short and structured output has little incremental value while every route adds model, latency, validation, and fallback cost. (iteration 5, evidence: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87)
- Use hosted routing as the default quality upgrade: hosted routing requires explicit consent and fresh privacy evidence, and no source-backed provider/tier winner was established. (iteration 5, evidence: packages/cli-communication-projection/docs/privacy.md:14-32)

## 11. CARRIED-FORWARD OPEN QUESTIONS

- The exact restoration checks are load-bearing and must remain fail-closed. (iteration 1)
- Any wire alias or bounded coalescing must preserve local canonical bytes, digests, ordinals, and ordered one-to-one restoration. (iteration 2)
- Model-tier and temperature claims require fresh provider capability evidence and a corpus-level readability measurement. (iteration 2)
- The judge must run before render selection, and its real-text input requires a local or separately privacy-approved boundary. (iteration 3)
- A hybrid should consume the same terminal assembly/order and ownership contracts; streaming arrival order or a template-only assumption would violate existing boundaries. (iteration 4)
- The first value experiment should compare deterministic skeleton, current whole-message projection, and bounded slot projection on multi-sentence warnings/recovery messages with quality and operational metrics. (iteration 5)
- Quality efficacy remains open until a fixed-corpus comparison and human non-inferiority study show net comprehension benefit after latency, cost, fallback, and privacy constraints. (iteration 5)

## 12. NEXT FOCUS

Phase synthesis: reconcile the five iterations into `research.md` and `resource-map.md`, preserving the open quality-efficacy question and the conditional deterministic-first value recommendation.

## 13. KNOWN CONTEXT

- Primary implementation: packages/cli-communication-projection/src/{core,context,fidelity,render,privacy,providers,evaluation,runtimes,clients}.
- Public skill contract: .opencode/skills/sk-communication/SKILL.md.
- Existing package docs and fixtures cover privacy, support, prompt profiles, providers, runtime adapters, fidelity, evaluation, and release gates.
- The spec packet is a read-only context source; this detached lineage writes only under its own artifact directory.

## 14. RESEARCH BOUNDARIES

- Max iterations: 5.
- Convergence threshold: 0.05; convergence before the cap is telemetry only.
- Stop policy: max-iterations.
- Per-iteration budget: 12 tool calls maximum.
- Evidence rule: cite exact source files and line anchors, or mark derived claims as inference.
- Reducer-owned files are updated by the workflow after each iteration; the leaf writes iteration narrative, state delta, and canonical iteration record.

## 15. SYNTHESIS STATUS

- Iterations completed: 5 of 5; convergence telemetry did not terminate the loop early.
- Value conclusion: conditional positive for complex user-facing prose; deterministic/native output is the default for short and structured messages.
- Architecture conclusion: retain local protection/restoration and add deterministic skeleton plus bounded prose slots.
- Quality conclusion: causal limitations are identified, but efficacy of proposed improvements remains unmeasured.
- Synthesis outputs: `research.md` and `resource-map.md` are complete under the lineage artifact root.
