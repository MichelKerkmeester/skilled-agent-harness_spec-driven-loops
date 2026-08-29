---
title: Deep Research Strategy - Communication Projection (deepseek lineage)
description: Research state for the detached deepseek communication-projection investigation.
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Communication Projection (deepseek lineage)

## 1. OVERVIEW

This lineage investigates the real package (`packages/cli-communication-projection/`) and skill (`.opencode/skills/sk-communication/`) contract across three named angles — IMPROVE QUALITY, ARCHITECTURE, VALUE — with findings externalized after every iteration. The lineage is read-only against the implementation and writes only its own research packet.

## 2. TOPIC

Deep-research the communication-projection capability and the sk-communication skill. The pipeline tokenizes protected spans locally, sends only tokenized prose to a model, restores real values locally, and fails closed to the exact original when fidelity breaks. A live DeepSeek smoke produced only modestly improved rewrites: some barely changed, one with prose artifacts. Root cause is attributed to aggressive tokenization (many opaque tokens the model must carry verbatim) and a meaning-preservation judge not wired into the path. This lineage must verify and refine that attribution from the real source.

## 3. KEY QUESTIONS (remaining)

- [x] Why do rewrites underwhelm, and which tokenization, prompt, profile, model-tier, and judge changes improve readability without weakening privacy or exact fidelity? (iterations 1-3)
- [x] Is local-tokenize -> model -> local-restore the right architecture, or would structured/templated rendering, semantic diffing, or a hybrid produce better readable and safe output? (iteration 4)
- [x] Does projection earn its complexity over deterministic formatting, and which use cases justify it? (iteration 5)
- [ ] Quality efficacy versus the deterministic baseline still requires a fixed-corpus comparison and human evidence. (open)

## 4. NON-GOALS

- Implementing changes in the package or skill.
- Treating the supplied smoke anecdote as a statistically complete benchmark.
- Rewriting canonical events, transcripts, tool data, model context, or repository files outside this lineage.

## 5. STOP CONDITIONS

- Run exactly five iterations because stopPolicy is max-iterations; convergence is telemetry only.
- Synthesize the strongest evidence-backed findings and record unresolved questions rather than stopping early.

## 6. ANSWERED QUESTIONS

The underwhelming rewrite has a source-backed root cause at the representation boundary: the dialect tokenizes every protected range into an opaque ~48-character `⟦pcp:v1:...⟧` marker, the wire body is a two-message prompt, and the instruction asks the model to preserve facts/names/numbers/paths it can no longer see. Separately, `validateProjectionCandidateInternal` accepts an unchanged echo because the semantic/structure stages run only when `restored.text !== sourceText`. (iteration 1)

Temperature and thinking controls are gated fail-closed for the shipped DeepSeek preset (`temperature-control`/`thinking-control` are `unknown`), so the reference-like profile returns exact-original before transport; the profile has no few-shot/token-rubric field, and adjacent spans are not coalesced. (iteration 2)

The optional meaning judge is not composed into production (`executeProviderRoute` -> candidate -> `decideRender` never invokes it; `evaluateFidelityVeto` hard-disables it); the judge sees restored plaintext values, so a hosted judge is a second egress; the offline proxy reviewer is provisional evidence, never a runtime validator. (iteration 3)

The local primitive is the right security boundary but whole-message projection is the wrong granularity: the assembled payload is raw assistant text (not typed fields), the Codex adapter references canonical text IDs rather than semantic content, so a hybrid deterministic skeleton plus bounded prose slots is the best fit; semantic diff is a safety gate, not a renderer; Codex is the only checked-in full-projection path. (iteration 4)

Projection conditionally earns its complexity for complex multi-sentence user-facing warnings, caveats, consequences, and recovery explanations; short/structured output should stay deterministic/native; release requires a powered blinded human non-inferiority study (proxy scores never authorize it); the provider-free rollback contract makes a safe-native deterministic-first rollout reversible. (iteration 5)

## 7. WHAT WORKED

Reading the codec, the wire adapter, and the prompt fixture together exposed a three-way mismatch (broad tokenization + two-message body + value-centric instruction) that jointly explains the modest rewrite. (iteration 1)

Tracing the control compiler against the preset's declared capabilities turned "model controls are uncertain" into a concrete fail-closed short-circuit. (iteration 2)

Tracing the producer (executor), validator (judge seam), and consumer (render decision) as one graph proved the judge composition gap rather than asserting it. (iteration 3)

Reading the event contract, assembly output, and the Codex capability record together established exactly where typed structure ends and raw prose begins. (iteration 4)

Reading the runbook, privacy, configuration, support-matrix, and rollback docs as a set turned value into a gated, reversible decision boundary. (iteration 5)

## 8. WHAT FAILED

The exact capability-evidence profile used by the live DeepSeek smoke is not reconstructable from source alone; that remains open for iteration 2. (iteration 1)

## 9. EXHAUSTED APPROACHES (do not retry)

None yet.

## 10. RULED OUT DIRECTIONS

- Relaxing token identity/order/count checks: exact ordered restoration is the fail-closed privacy/fidelity boundary. (iteration 1, evidence: packages/cli-communication-projection/src/fidelity/protected-spans.ts:133-181)
- Assuming the two-message wire body is a sufficient prompt: it carries no token contract or examples. (iteration 1, evidence: packages/cli-communication-projection/src/providers/adapters.ts:96-100)
- Assuming temperature alone fixes readability: temperature cannot be applied through the shipped DeepSeek preset without fresh confirmed capability evidence. (iteration 2, evidence: packages/cli-communication-projection/src/providers/controls.ts:100-116)
- Assuming a model-tier upgrade is source-confirmed: no package source establishes a quality ranking across tiers. (iteration 2, evidence: packages/cli-communication-projection/src/providers/presets.ts:43-84)
- Treating `evaluateFidelityVeto` as meaning-judge wiring: it hard-codes `judgeMode: 'disabled'`. (iteration 3, evidence: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:30-50)
- Using the masked LLM proxy reviewer as the runtime meaning gate: it is comparative provisional evidence, not a privacy-scoped reject-only validator. (iteration 3, evidence: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:32-58)
- Calling a hosted judge after restoration: it would egress restored plaintext values as a second boundary. (iteration 3, evidence: packages/cli-communication-projection/src/fidelity/validator.ts:175-181,317-357)
- Replacing local exact restoration with remote structured rendering: it moves exactness/privacy responsibility across the provider boundary without solving arbitrary assistant prose. (iteration 4, evidence: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114)
- Assuming event kind alone supports universal templates: the projected body is raw text, not typed fields. (iteration 4, evidence: packages/cli-communication-projection/src/runtimes/codex.ts:271-294)
- Using semantic diff as a readability generator: it is a deterministic rejection/diagnostic layer. (iteration 4, evidence: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107)
- Enabling projection for every message: short/structured output has little incremental value while each model route adds latency, provider, validation, and fallback cost. (iteration 5, evidence: packages/cli-communication-projection/src/contracts/event.ts:52-87)
- Using hosted routing as a default quality upgrade: it requires consent and fresh privacy evidence, with no source-backed provider/tier winner. (iteration 5, evidence: packages/cli-communication-projection/docs/privacy.md:7-32)
- Treating proxy/synthetic/injected evidence as product-value proof: release requires a powered blinded human non-inferiority study. (iteration 5, evidence: packages/cli-communication-projection/docs/runbook.md:19-21)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Any representation optimization (coalescing, aliasing) must preserve local canonical bytes, digests, ordinals, and ordered one-to-one restoration. (iteration 1)
- The live smoke's capability-evidence profile is not checked into the package; it is the missing artifact needed to reproduce the smoke's quality. (iteration 2)
- A hosted DeepSeek model-tier experiment is also privacy-gated (consent + fresh retention/training facts), not just capability-gated. (iteration 2)
- The judge must run after restoration only when its boundary is local or separately privacy-approved; its plaintext input makes a hosted judge a second egress. (iteration 3)
- A hybrid should consume the same terminal assembly/order and ownership contracts; a template-only assumption would violate the raw-text payload boundary. (iteration 4)
- The first value experiment should compare deterministic skeleton, current whole-message projection, and hybrid slot projection on multi-sentence warnings/recovery messages with quality and operational metrics. (iteration 5)

## 11. NEXT FOCUS

Phase synthesis: reconcile the five iterations into `research.md` and `resource-map.md`, preserving the open quality-efficacy question and the conditional deterministic-first value recommendation.

## 12. KNOWN CONTEXT

- Primary implementation: packages/cli-communication-projection/src/{core,context,fidelity,render,privacy,providers,evaluation,runtimes,clients,contracts,doctor,release,observability,versioning}.
- Public skill contract: .opencode/skills/sk-communication/SKILL.md.
- The parallel `luna` lineage (cli-codex / gpt-5.6-luna) already completed a synthesis on the same folder; this lineage re-derives findings from first-hand source reads and emphasizes the DeepSeek-specific quality path.

### Bounded Context Snapshot

- Source pointers: `fidelity/protected-spans.ts` (token codec + restore), `fidelity/dialect.ts` (range collection), `providers/adapters.ts` (wire messages), `providers/controls.ts` (control compiler), `providers/presets.ts` (DeepSeek preset), `contracts/prompt.ts` (profile contract), `fidelity/validator.ts` (validation + judge), `fidelity/semantics.ts` (deterministic vetoes), `render/decision.ts`, `core/assembly-output.ts`, `contracts/event.ts`, `clients/types.ts`, `evaluation/types.ts`.
- Reuse candidates: existing deterministic semantic vetoes and markdown structure signature for a quality gate; typed event kind/phase/status for a deterministic skeleton.
- Integration points: `executeProviderRoute` -> `validateProjectionCandidate` -> `decideRender` -> client presentation.
- Constraints: content-free telemetry; privacy-before-ranking; exact-original fallback; fresh capability/privacy evidence required before transport.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5.
- Convergence threshold: 0.05; convergence before the cap is telemetry only.
- Stop policy: max-iterations.
- Per-iteration budget: 12 tool calls maximum.
- Evidence rule: cite exact source files and line anchors, or mark derived claims as inference.
- Reducer-owned files are updated by the workflow after each iteration; the leaf writes iteration narrative, state delta, and canonical iteration record.

## 14. RESEARCH BOUNDARIES (machine)

- Machine-owned sections: reducer controls key-questions, answered-questions, what-worked, what-failed, exhausted-approaches, ruled-out-directions, divergence-frontier, next-focus.
- Lifecycle: new lineage; generation 1.
- Started: 2026-08-12T21:10:32.000Z.

## 15. SYNTHESIS STATUS

- Iterations completed: 5 of 5; convergence telemetry did not terminate the loop early.
- Quality conclusion: causal limitations are confirmed (prompt-token mismatch, opaque-token inflation, unchanged-echo acceptance, fail-closed control gate, unwired judge); efficacy of the proposed fixes remains unmeasured.
- Architecture conclusion: retain local protection/restoration; add a deterministic skeleton plus bounded prose slots; semantic diff stays a safety gate.
- Value conclusion: conditional positive for complex user-facing prose; deterministic/native output is the default elsewhere.
- Synthesis outputs: `research.md` and `resource-map.md` are complete under the lineage artifact root.
