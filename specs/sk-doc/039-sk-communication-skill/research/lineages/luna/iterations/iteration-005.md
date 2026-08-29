# Iteration 5: User value, adoption boundary, and operational cost

## Focus

Assess where plain-English projection earns its complexity over deterministic formatting or exact-original output, and identify a safe first adoption boundary.

## Actions Taken

- Re-read the iteration state and strategy before starting the final research pass.
- Inspected the skill contract and the package configuration, privacy, support, runbook, and rollback documents.
- Read the compatibility doctor, runtime capability matrix, client presentation contracts, release rollback plan, and evaluation corpus/report types.
- Searched the package for a separate deterministic prose renderer or a production user-value benchmark; no such source-backed implementation or benchmark was found.

## Findings

1. The capability has a deliberately narrow product promise: make supported terse CLI and agent output read like careful plain English while leaving canonical events, transcripts, tool data, and model context unchanged. The skill explicitly activates for terse status, provider-neutral cross-CLI rewriting, privacy-aware local/hosted routing, runtime wiring, presentation tiers, and blind evaluation; it explicitly excludes rewriting durable Markdown or on-disk files. This makes projection a presentation aid for live user-facing communication, not a general text transformation service. [SOURCE: .opencode/skills/sk-communication/SKILL.md:1-39] [SOURCE: .opencode/skills/sk-communication/SKILL.md:43-67] [INFERENCE: the strongest value case is repeated live output whose meaning is hard to scan, not canonical or durable content]

2. Deterministic formatting is sufficient for short, typed, and repetitive messages. The package already assembles terminal events with kind, phase, status, ordering, canonical references, payload, and extensions, and its runtime/client contracts can preserve the original while appending or placing a sidecar. A deterministic skeleton can therefore cover lifecycle labels, command/result sections, warnings, recovery headings, and known status fields without a model call. The current package has no separate deterministic natural-language renderer, so this is a proposed use of an existing substrate rather than a measured feature. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87] [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-259] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113,145-182] [SOURCE: packages/cli-communication-projection/src/clients/types.ts:74-105] [INFERENCE: model projection has little incremental value when a stable event template already communicates the same facts]

3. Projection genuinely helps when a user must understand a multi-sentence, technical, or fragmented explanation rather than merely observe a state change. High-value candidates are agent status messages that combine progress, caveats, consequences, and next steps; warning and recovery explanations; and repeated cross-runtime output where users otherwise learn several terse dialects. The value claim is an inference, not a package measurement: it should be tested with task completion, comprehension, time-to-answer, and error-rate comparisons against deterministic formatting and exact original. [SOURCE: .opencode/skills/sk-communication/SKILL.md:7-22] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:40-67,96-138] [SOURCE: packages/cli-communication-projection/src/evaluation/report.ts:15-108] [INFERENCE: these are the journeys where rewriting can reduce cognitive translation work enough to justify latency and fallback complexity]

4. Projection has low or negative incremental value for one-line statuses, already-structured lifecycle events, raw tool input/output, secret-heavy diagnostics, incomplete streams, and messages whose display surface cannot safely own the complete message. Those cases are either already readable through labels/templates, are safer when shown byte-for-byte, or cannot make a full-projection parity claim. The client contract makes append/sidecar possible while retaining the original, and it makes failed application exact-original; the runtime matrix likewise recomputes uncertain capability to safe-native/original-only. [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-45,64-105] [SOURCE: packages/cli-communication-projection/src/clients/display.ts:18-74] [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56] [SOURCE: packages/cli-communication-projection/src/runtimes/matrix.ts:74-99] [INFERENCE: a projection trigger should require enough prose complexity and a safe presentation boundary; it should not run indiscriminately on every CLI line]

5. Privacy and operational controls make the adoption bar materially higher than for a local formatter. Privacy is evaluated before transport; local-only routes forbid hosted identifiers, hosted routes require named providers, consent, fresh retention/training facts, and credential references, and any unknown or stale fact returns the exact original. Compatibility checks also require fresh runtime, protocol, provider, model, and presentation evidence; a blocked doctor report selects original-only and remains content-free. These controls support a local-offline first rollout, but they make a hosted model an explicit product choice rather than a transparent quality upgrade. [SOURCE: packages/cli-communication-projection/docs/privacy.md:1-32] [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-15] [SOURCE: packages/cli-communication-projection/src/doctor/checks.ts:25-90,93-160,229-301] [SOURCE: packages/cli-communication-projection/src/doctor/doctor.ts:18-45] [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:1-26]

6. The release process treats readability as an evidence question, not a subjective “looks nicer” feature. The automated six-runtime rehearsal is injected and content-free; a real credentialed provider smoke is separate; proxy or synthetic scores are diagnostic only; and release requires a powered, blinded human non-inferiority study plus fresh provider/runtime/fidelity/privacy/evaluation evidence. The report model also keeps latency, provider cost, rejection, fallback, timeout, and degraded-render rates alongside quality dimensions. Therefore the capability earns its complexity only if a fixed corpus shows a meaningful user outcome improvement after those costs are included. [SOURCE: packages/cli-communication-projection/docs/runbook.md:1-29] [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:19-26] [SOURCE: packages/cli-communication-projection/src/evaluation/report.ts:15-108] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:11-37] [INFERENCE: the decision metric should be net user benefit per accepted projection, not raw rewrite quality alone]

7. Rollout risk is bounded if projection remains an optional presentation layer. The package has an original-only emergency mode, a provider-free rollback plan, an immutable canonical-transcript digest check, and a previous-tarball restore path. This supports a staged adoption: deterministic skeleton and safe-native append/sidecar first; local protected free-text slots only for selected high-complexity messages; full atomic replacement only where complete-message and atomic-render ownership are confirmed. Hosted or broad full-projection rollout should wait for live smoke, human evidence, and fresh support facts. [SOURCE: packages/cli-communication-projection/src/release/rollback.ts:7-27,29-135] [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37] [SOURCE: packages/cli-communication-projection/src/runtimes/matrix.ts:74-99] [SOURCE: packages/cli-communication-projection/src/clients/types.ts:64-105] [INFERENCE: reversibility makes a narrow experiment reasonable, but it does not make universal projection worthwhile]

## Concrete Value and Adoption Recommendation

Use a deterministic-first hybrid admission policy:

| Message or surface | Default presentation | Why | Evidence needed to promote |
|---|---|---|---|
| Short status, typed lifecycle, command/result summary | Deterministic native formatting or exact original | The facts are already structured; a model adds latency and failure modes | None beyond existing conformance and fidelity checks |
| Multi-sentence warning, caveat, consequence, or recovery explanation with a complete assembled message | Deterministic skeleton plus bounded local-tokenized prose slots | Model effort is concentrated on the part where readability can change; technical values stay locally restorable | Fixed-corpus human non-inferiority, fidelity/fallback/latency and cost strata |
| Safe-native or incomplete/streaming surface | Append or sidecar; original remains visible | The client cannot claim atomic full-message parity | Runtime ownership and presentation evidence; no full-projection claim |
| Secret-heavy, unknown-privacy, stale-capability, failed, cancelled, or timed-out route | Exact original only | The privacy and fail-closed contracts dominate any readability benefit | Fresh evidence and explicit operator policy before retry |
| Durable Markdown, transcript, tool data, or model context | Never project through this capability | The skill excludes canonical/on-disk rewriting and requires byte preservation | Separate product contract, if ever requested |

The first experiment should therefore select a small corpus of user-facing multi-sentence warnings and recovery messages, compare deterministic skeleton, current whole-message projection, and proposed slot-based projection, and report both quality and operational outcomes. Triggering should be based on measured message complexity rather than a permanent arbitrary length threshold. The quality target remains open until that experiment exists; the value conclusion is conditional but positive for the high-complexity slice.

## Ruled Out

- Enabling model projection for every message: it spends provider, latency, and validation budget where deterministic formatting is already adequate. [INFERENCE: based on the structured event and tier contracts]
- Making a hosted provider the default quality solution: privacy consent, fresh retention/training facts, credentials, and support evidence are explicit prerequisites. [SOURCE: packages/cli-communication-projection/docs/privacy.md:14-32]
- Treating safe-native append/sidecar output as proof of full-projection value or parity. [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-127] [SOURCE: packages/cli-communication-projection/src/clients/types.ts:74-105]
- Using the injected rehearsal, content-free corpus, or LLM proxy alone as product-value proof. [SOURCE: packages/cli-communication-projection/docs/runbook.md:13-24] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:11-37]
- Replacing the exact-original rollback path with a more complex recovery mechanism. [SOURCE: packages/cli-communication-projection/src/release/rollback.ts:29-135]

## Dead Ends

- No source-backed deterministic prose renderer or user telemetry benchmark was available, so the value ranking remains an evidence-backed adoption hypothesis rather than a measured ROI result.
- The supplied live DeepSeek smoke is useful context for the quality problem, but it does not identify the marginal user benefit of projection versus a deterministic baseline and was not treated as a benchmark.

## Edge Cases

- A local model can reduce egress risk but still requires capability, latency, fidelity, and rollback checks; “local” is not synonymous with “quality proven.” [SOURCE: packages/cli-communication-projection/docs/configuration.md:3-15] [SOURCE: packages/cli-communication-projection/src/doctor/checks.ts:93-226]
- A hosted route that has stale or contradictory privacy facts must remain original-only even if the model would produce a more readable answer. [SOURCE: packages/cli-communication-projection/docs/privacy.md:22-32]
- Streaming output should wait for the same terminal assembly boundary used by the current runtime contracts before attempting a multi-sentence projection; otherwise a model may rewrite an incomplete message. [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113] [INFERENCE: terminal assembly is the safe unit for a whole-message quality comparison]
- A sidecar can expose useful readability gains without suppressing the original, but it must be counted as degraded presentation and measured separately from atomic replacement. [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56]

## Sources Consulted

- [SOURCE: .opencode/skills/sk-communication/SKILL.md:1-39,43-67,117-160,189-195]
- [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-23]
- [SOURCE: packages/cli-communication-projection/docs/privacy.md:1-32]
- [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:1-26]
- [SOURCE: packages/cli-communication-projection/docs/runbook.md:1-29]
- [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37]
- [SOURCE: packages/cli-communication-projection/src/doctor/checks.ts:25-90,93-160,163-226,229-301,303-340]
- [SOURCE: packages/cli-communication-projection/src/doctor/doctor.ts:18-45]
- [SOURCE: packages/cli-communication-projection/src/runtimes/matrix.ts:23-102]
- [SOURCE: packages/cli-communication-projection/test/runtimes/matrix.test.ts:26-129]
- [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-105]
- [SOURCE: packages/cli-communication-projection/src/clients/display.ts:18-74]
- [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56]
- [SOURCE: packages/cli-communication-projection/src/release/rollback.ts:7-27,29-135]
- [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:11-37,40-67,96-138]
- [SOURCE: packages/cli-communication-projection/src/evaluation/report.ts:15-108]
- [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113,145-182]

## Assessment

- New information ratio: 0.74
- Focus track: value and adoption
- Questions addressed: user journeys, deterministic baseline, privacy/operational cost, evidence bar, rollout and rollback
- Questions answered: projection conditionally earns its complexity for high-complexity, user-facing, multi-sentence communication; deterministic formatting or exact original is the default elsewhere
- Open validation: the quality question remains unresolved until a fixed-corpus comparison measures net comprehension benefit and operational cost

## Reflection

- What worked and why: reading the product contract together with privacy, doctor, release, client, and rollback surfaces turned “value” into a concrete admission and evidence problem.
- What did not work and why: the repository has no user-outcome telemetry or deterministic prose baseline, so no empirical ROI or model-tier winner can be claimed.
- What should carry into synthesis: present a hybrid deterministic-first recommendation, keep quality efficacy explicitly open, and treat safe-native rollout plus original-only rollback as the practical boundary.

## Recommended Next Focus

Phase synthesis: reconcile the five iterations into one evidence-backed report and resource map, preserving unresolved quality efficacy and the conditional value conclusion.
