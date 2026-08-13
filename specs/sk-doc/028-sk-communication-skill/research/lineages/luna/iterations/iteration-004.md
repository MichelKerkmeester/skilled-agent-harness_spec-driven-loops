# Iteration 4: Architecture alternatives and ownership boundaries

## Focus

Compare the existing local-tokenize/model/restore primitive with structured, templated, semantic-diff, and hybrid rendering using the package's actual event, assembly, render, runtime, and client contracts.

## Actions Taken

- Re-read the iteration state and strategy before opening the architecture surfaces.
- Inspected the runtime-neutral event envelope, generation-keyed assembler, terminal assembly output, render decision, runtime capability mapping, client display/sidecar contracts, and deterministic fidelity signatures.
- Read assembly, runtime, and client tests to verify ordering, canonical immutability, ownership, and safe-native behavior.
- Searched for existing structured/template/diff renderers and found no separate deterministic prose renderer in the package.

## Findings

1. The package already has a strong deterministic substrate for a safer renderer. Runtime adapters normalize events into a typed envelope with kind, phase, terminal status, independent source/arrival/assembly order, canonical payload reference, payload, and extensions. `MessageAssembler` validates generation identity, canonical references, duplicates, order, byte/event bounds, and terminal state; its terminal snapshot preserves all three order domains. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87] [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-259] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-63,145-182]

2. Exact original bytes are not an incidental fallback; they are the stable source for both assembly and display. A completed assembly decodes the selected final assistant message or ordered deltas, while every non-completed terminal reason returns an exact-original assembly. Runtime conformance checks that adapters do not mutate canonical input and that emitted events point back to the canonical original. This makes a local deterministic/templated renderer architecturally compatible if it consumes the assembled view and emits a candidate alongside the same immutable original. [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:65-113] [SOURCE: packages/cli-communication-projection/src/runtimes/adapter.ts:82-140] [SOURCE: packages/cli-communication-projection/src/core/assembly-types.ts:78-106]

3. A pure structured/template renderer would be strongest for known lifecycle and technical events, but the current event payloads often carry only references to raw text. For example, the Codex adapter maps assistant messages to `textOriginalId`, tool calls to `toolInputOriginalId`, and tool results to `toolResultOriginalId`; it does not expose a typed command result, error cause, or natural-language sentence tree. Templates could therefore produce reliable labels, statuses, and sections for typed metadata, but they cannot replace a model for arbitrary assistant prose without adding upstream semantic extraction or richer event payload contracts. [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:198-238,271-294] [INFERENCE: a template-first architecture is valuable for known event classes but would underperform on free-form messages unless the canonical event contract grows]

4. The current local-tokenize/model/restore architecture remains the right privacy and exactness primitive for unstructured free text: the provider sees only protected encoded text, restoration is local and ordered, and the validator can fall back to exact original. Its weakness is presentation quality, not the security boundary. Replacing it wholesale with a template renderer would trade opaque-token copying burden for a larger semantic parser/event-contract migration and would still leave arbitrary prose unsolved. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217] [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:150-258] [INFERENCE: retain local protection/restoration as a primitive while moving model work to narrower prose slots]

5. A hybrid is the best fit for the existing boundaries. First render a deterministic skeleton from event kind, lifecycle, order, local status, and safe metadata; keep paths, flags, numbers, identifiers, code, and secrets in local protected slots; then ask a model to rewrite only bounded prose slots, not the entire event/message. Restore each slot locally, run structure/semantic/token checks per slot plus a whole-message digest/order check, and assemble the final candidate only after all slots pass. This reduces the number of opaque markers carried in each prompt and lets deterministic output handle commands, warnings, errors, and recovery steps. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:23-46] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:32-63] [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-288] [INFERENCE: slot-level rewriting is a proposed composition pattern; the current package does not implement slot contracts]

6. Semantic diffing should be an additional gate and diagnostic, not the renderer's sole architecture. The validator already compares Markdown structure and a bounded set of semantic categories after restoration, but `compareSemanticMeaning` returns a first deterministic veto rather than an alignment or quality score. A richer local semantic diff could compare typed facts, polarity, requirements, priority, uncertainty, caveats, directives, and slot identity before accepting a candidate; it still cannot decide whether prose is clearer, so it should be paired with a local reject-only judge or offline readability study. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-228] [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179] [INFERENCE: semantic diff improves safety observability and rejection precision but does not replace a readability producer]

7. The render/client contracts already provide a safe degradation ladder for a hybrid. Full projection requires a complete-message owner and atomic render decision; append and sidecar keep the original visible; any failed commit returns original-only. Runtime capability mapping turns unknown or unconfirmed safe boundaries into `safe-native` and original-only defaults. A hybrid can therefore ship in safe-native append/sidecar first and claim full-projection only on paths with explicit ownership and evidence. [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-105] [SOURCE: packages/cli-communication-projection/src/clients/display.ts:18-74] [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56] [SOURCE: packages/cli-communication-projection/src/runtimes/capability.ts:16-60,63-100] [SOURCE: packages/cli-communication-projection/src/runtimes/types.ts:166-215]

## Architecture Comparison

| Design | Readability potential | Privacy/fidelity posture | Main cost or limit |
|---|---|---|---|
| Whole-message local tokenize -> model -> restore | Broad free-form rewrite | Strong existing exact-original and ordered restore boundary | Opaque-marker copying burden; judge/wiring gap; model sees a hard whole-message task |
| Deterministic structured/templates | Predictable status, errors, commands, recovery steps | Best for typed fields; no model egress for covered cases | Current payloads often point to raw text, so arbitrary prose needs richer contracts or parsing |
| Semantic diff only | Better rejection/diagnostics | Strengthens acceptance safety | Produces no clearer prose and current comparator is veto-only |
| Hybrid skeleton + prose slots | High potential with smaller prompts and deterministic technical fields | Keeps canonical bytes/local slots and can degrade to safe-native/original | Requires slot schema, composition, per-slot validation, and additional test/release evidence |

## Recommendation

Adopt a hybrid as the target architecture, with deterministic structured rendering for typed event/lifecycle cases and the current protected rewrite primitive retained for bounded free-text slots. Do not make a semantic diff or a template parser the sole replacement. Start with safe-native append/sidecar on a small set of event classes, measure readability/fallback/latency, and only promote a path to full-projection after the ownership and human-evidence gates pass.

## Ruled Out

- Replacing the exact-original and local restoration boundary with a remote structured renderer.
- Assuming event kind alone supplies enough semantic fields for universal templates.
- Using semantic diff as a readability generator or as a substitute for human quality evidence.

## Dead Ends

- No existing deterministic natural-language renderer or semantic-diff package was found; no implementation change was attempted.

## Edge Cases

- Streaming deltas must be assembled in source order before slot projection; arrival order is intentionally retained separately and cannot become display order.
- A final assistant message can supersede deltas in `completeAssembly`; a hybrid must use the same terminal selection rule or it may rewrite a different text than the canonical source.
- A sidecar/append projection can be useful even when a full replacement is unsafe because the original remains visible; it must not be counted as full 1:1 parity.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87]
- [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-259]
- [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113,145-182]
- [SOURCE: packages/cli-communication-projection/src/core/assembly-types.ts:78-106]
- [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:198-238,271-294]
- [SOURCE: packages/cli-communication-projection/src/runtimes/adapter.ts:82-140]
- [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217]
- [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-288]
- [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:150-258]
- [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179]
- [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-105]
- [SOURCE: packages/cli-communication-projection/src/clients/display.ts:18-74]
- [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56]
- [SOURCE: packages/cli-communication-projection/src/runtimes/capability.ts:16-60,63-100]
- [SOURCE: packages/cli-communication-projection/src/runtimes/types.ts:166-215]
- [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-160]

## Assessment

- New information ratio: 0.79
- Questions addressed: structured data availability, template limits, semantic-diff role, hybrid composition, and presentation-tier safety
- Questions answered: local protection/restoration is the right safety primitive; a hybrid skeleton plus bounded prose slots is the strongest architecture for quality without discarding existing invariants

## Reflection

- What worked and why: reading assembly, runtime, and client contracts together exposed a natural deterministic skeleton and a separate free-text boundary.
- What did not work and why: no existing structured prose renderer means the hybrid remains a proposed architecture, not a measured result.
- What I would do differently: quantify the user-facing value and operational cost of projection against deterministic formatting and original-only behavior.

## Recommended Next Focus

Iteration 5: assess where plain-English projection helps users, where deterministic formatting is sufficient, and which use cases, tiers, privacy classes, and release/rollback controls justify the extra model and validation complexity.
