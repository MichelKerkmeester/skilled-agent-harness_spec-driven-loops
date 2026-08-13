# Iteration 4: Architecture — local primitive vs structured/templated/semantic-diff/hybrid

## Focus

Determine whether local-tokenize -> model -> restore is the right architecture, or whether structured/templated rendering, semantic diffing, or a hybrid would produce better readable and safe output. Angle: ARCHITECTURE.

## Actions Taken

- Read the canonical event contract (`EventEnvelope`, `EventKinds`, `EventPhases`, `TerminalStatuses`), the terminal assembly (`completeAssembly`), the generation-keyed assembler, and the Codex runtime adapter's payload mapping and capability record.

## Findings

1. The assembled projection payload is raw text, not a typed tree. `completeAssembly` locates the final completed assistant message and decodes its `original` exact bytes to text; the output is a string, not structured fields. `EventEnvelope.payload` is an opaque `JsonObject`, and the Codex adapter maps assistant/tool content to canonical references (`{ textOriginalId }`, `{ toolInputOriginalId }`, `{ toolResultOriginalId }`), not typed semantic fields. [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:66-99] [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:23-46] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:271-294]

2. A deterministic skeleton IS available for known event classes. `EventEnvelope` carries typed `kind` (assistant-message, tool-call, tool-result, error, cancellation, extension), `phase`, and `terminalStatus`, plus order coordinates and canonical refs. A deterministic renderer can format the shell of a typed status/error/lifecycle message without any model, preserving exact technical fields. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:52-87] [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-260]

3. A pure template replacement is NOT sufficient. Because the assembled payload is raw assistant prose (not typed fields), and the Codex adapter references text IDs rather than semantic content, a template cannot cover arbitrary assistant prose. Templates cover the structured envelope, not the message body. [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:271-294] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:66-99]

4. Semantic diffing is a safety gate, not a renderer. `compareSemanticMeaning` is a deterministic reject-only comparator; it produces no prose and cannot improve readability. Its correct role is a fail-closed meaning gate, not a projection strategy. [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107]

5. The local-tokenize -> model -> restore primitive remains the right security boundary, but whole-message projection is the wrong default granularity. The primitive guarantees exactness and privacy (values never leave locally; restoration is fail-closed). The problem is that the model is asked to carry every structural and technical span as an opaque token while also rewriting prose. A hybrid — deterministic skeleton for the structured shell plus bounded prose slots (each protected locally) for the raw-text regions — concentrates model work on the text that can actually benefit, and reduces the opaque-token burden per message. [INFERENCE: the hybrid follows from (1)-(4); the primitive is retained, only its granularity and prompt contract change]

6. Presentation tiers already encode the safe rollout. `canClaimFullProjectionParity` requires `ownsCompleteMessage && ownsAtomicRenderDecision`; the Codex App Server client is the only checked-in path with both `completeMessage` and `atomicRenderDecision` CONFIRMED_YES (its `append` and `sidecar` are CONFIRMED_NO). Degraded append/sidecar and original-only are first-class safe tiers. [SOURCE: packages/cli-communication-projection/src/clients/types.ts:101-105] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:116-135]

## Ruled Out

- Replacing local exact restoration with remote structured rendering: it moves exactness/privacy responsibility across the provider boundary without solving arbitrary assistant prose.
- Assuming event kind alone supports universal templates: the projected body is raw text, not typed fields.
- Using semantic diff as a readability generator: it is a deterministic rejection/diagnostic layer.

## Dead Ends

- No structured prose renderer exists in the package; a hybrid would require new slot contracts, per-slot validation, and test coverage. That gap is a design finding, not a bug.

## Edge Cases

- The Codex adapter is the only full-projection path; a hybrid that starts with append/sidecar on safe-native surfaces is consistent with the current capability matrix, not a regression.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:23-46,52-87]
- [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113]
- [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-260]
- [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:116-135,271-294,311-339]
- [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-105]
- [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107]

## Assessment

- New information ratio: 0.72
- Novelty justification: pinning the "raw text payload + canonical-reference-only Codex mapping + Codex-is-the-only-full-projection-path" evidence turns the architecture debate from opinion into a concrete hybrid recommendation with a safe first deployment tier.

## Reflection

- What worked: reading the event contract, assembly output, and the Codex capability record together established exactly where typed structure ends and raw prose begins.
- What did not work: no existing structured prose renderer could be compared; the hybrid remains a design recommendation needing slot-contract work.
- What I would do differently: next, test the value question — which user-facing messages justify the hybrid's complexity versus deterministic formatting, grounded in the docs, evaluation, and release gates.

## Recommended Next Focus

Iteration 5: establish where projection genuinely earns its complexity (complex multi-sentence warnings/recovery vs short status), grounded in the skill contract, evaluation evidence classes, privacy/rollback docs, and the release gate.
