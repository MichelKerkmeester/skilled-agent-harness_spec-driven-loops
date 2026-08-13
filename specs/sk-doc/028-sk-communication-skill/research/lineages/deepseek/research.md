---
title: Communication Projection Deep-Research Synthesis (deepseek lineage)
type: research
status: complete
spec_folder: specs/sk-doc/028-sk-communication-skill
artifact_dir: specs/sk-doc/028-sk-communication-skill/research/lineages/deepseek
session_id: fanout-deepseek-1786568849119-wn6hux
executor: cli-opencode model=opencode-go/deepseek-v4-pro
loop_type: research
iterations_completed: 5
stop_policy: max-iterations
---

# Communication Projection Deep-Research Synthesis

## Executive verdict

The local-tokenize -> model -> local-restore design is the correct privacy and exactness primitive, but the current whole-message projection path gives the model a writing task it is not set up to perform well. The underwhelming DeepSeek smoke is explained by four source-backed constraints, two of which this lineage confirms more sharply than a superficial "tokenization is aggressive" reading:

1. **Prompt-token mismatch.** The wire prompt tells the model to "keep every fact, name, number, and file path," but after protection those values are already opaque `⟦pcp:v1:...⟧` markers. The model is never told what the markers are or that they must be copied verbatim once in order. It is asked to preserve semantic content it can no longer see. [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

2. **Opaque-token inflation with no adjacent-span coalescing.** Every protected range becomes a ~48-character marker; block and inline ranges are only overlap-filtered, never merged, so adjacent technical spans multiply the exact strings the model must carry. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:396-415] [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:37-46,265-288]

3. **The unchanged echo is structurally accepted.** The validator only runs its Markdown-structure and semantic-veto stages when `restored.text !== sourceText`; a verbatim echo skips every check and is accepted. "Some barely changed" is rewarded, not detected. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-222]

4. **The meaning judge is not wired, and the control knobs are gated fail-closed.** `executeProviderRoute` returns a candidate and `decideRender` consumes a validation result; no production source connects the candidate to the optional judge. And the shipped DeepSeek preset marks `temperature-control`/`thinking-control` `unknown`, so the reference-like profile returns exact-original *before transport* — temperature/thinking tuning is not even reachable through the shipped path. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:110-138] [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:100-116] [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:171-179]

The best target is a **hybrid**: render a deterministic skeleton from the typed event envelope, and rewrite only bounded prose slots with the existing local protection/restoration primitive. Keep canonical bytes, span digests, ordinals, and order unchanged; validate each slot and the whole candidate; wire a local (or separately privacy-approved) reject-only meaning judge; and lean on the existing exact-original, safe-native, append, and sidecar tiers.

Projection **conditionally earns its complexity** for high-friction, multi-sentence, user-facing warnings, caveats, consequences, and recovery explanations. Short statuses, typed lifecycle events, command/result summaries, raw tool data, and incomplete streams should remain deterministic/native or exact-original. This is a value hypothesis grounded in the contracts, not a measured ROI: the package contains no user-value benchmark, and release is gated on a powered, blinded human non-inferiority study that has not been run.

## Scope and evidence posture

This synthesis reconciles five research iterations run to the configured `maxIterations: 5`; the convergence ratios (`0.92 -> 0.84 -> 0.78 -> 0.72 -> 0.70`) were telemetry only and did not terminate the loop early. The implementation and skill were read without modification. Confirmed facts carry exact file/function anchors; recommendations and value judgments are marked as inference where they exceed the current implementation. This detached lineage is the only write surface.

The immutable contract is strong and non-negotiable: canonical events, transcripts, tool inputs/results, and future model context remain byte-for-byte unchanged; privacy is classified before any ranking; every unsafe or failed path returns the exact original; and full-projection claims require complete-message ownership plus an atomic render decision. [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-160]

## 1. Improve quality without weakening privacy or fidelity

### 1a. Root cause is at the representation-prompt boundary

`protectMarkdown` replaces each accepted range with `⟦pcp:v1:{24-hex-namespace}:{index}:{12-hex-digest}⟧` (~48 chars), then `messages()` emits one system instruction plus one user message containing the entire encoded text. The system instruction describes values ("keep every fact, name, number, and file path") that the model no longer sees, and never names the token contract. A model that cannot see a value can only guess how to treat its placeholder; the safe guess is to copy everything verbatim, which explains the "barely changed" results. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,396-415] [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

**Priority A — make the prompt a token-contract copy-editing contract.** Rewrite the system instruction to say, explicitly: "The message contains `⟦pcp:v1:...⟧` placeholders. Copy each placeholder exactly once, in order, with no surrounding whitespace changes. Rewrite only the words between placeholders into simpler plain English." Add a synthetic few-shot before/after pair using synthetic markers only (never real protected bytes). This is a versioned `PromptProfileRecord` revision plus profile/assembler work, not a string tweak — the profile today has no examples or rubric field. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:21-32]

**Priority B — reduce the model-facing burden without weakening the local map.** Keep the protected categories and strict restoration. Add a model-facing representation layer that (a) coalesces bounded adjacent protected spans within a prose clause, or (b) replaces long canonical markers with short collision-resistant aliases on the wire, while the local `ProtectedDocument` retains canonical bytes, digests, ordinals, member order, and one-to-one restoration. Structural blocks, code, and table boundaries must remain separately protected where grouping could change syntax. Any alias schema may itself disclose categories and needs a privacy-policy decision. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-288] [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-217] [INFERENCE: grouping/aliasing is safer than deleting protection, but the alias format is a privacy-policy surface]

**Priority C — wire the meaning gate at the correct boundary.** Compose the missing path explicitly: protect locally -> privacy route + provider rewrite -> deterministic fidelity/restoration checks -> local or separately-approved reject-only meaning judge -> render decision. The judge should run after restoration only when its boundary is local (it receives decoded source and restored candidate, i.e., real values, so a hosted judge is a second egress); any failure remains exact-original. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:229-244,315-370] [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:30-50]

**Priority D — remove the unchanged-echo acceptance for the quality path.** Either keep a no-op rewrite as an explicit "no improvement" outcome that falls back to deterministic formatting, or require a minimal edit distance from source before a candidate may be presented as a projection. The current `restored.text === sourceText` short-circuit silently accepts a no-op; a quality projection should not be indistinguishable from the original. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-222] [INFERENCE: this is a product-policy choice, not a fidelity requirement]

**Priority E — unblock the control knobs with fresh evidence.** The shipped DeepSeek preset marks `temperature-control` and `thinking-control` `unknown`, so `compilePromptControls` returns `unsupported('temperature')` and the profile returns exact-original before the model is ever called. Temperature/thinking/model-tier experiments are impossible through the shipped preset until fresh confirmed capability evidence is supplied; the live smoke's evidence profile is the missing artifact. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:71-116] [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:171-179] [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:150-185]

Per-model prompt profiles are justified only once a provider's capability and prompt mapping are confirmed; use a conservative profile for small/local models and a structured profile for higher-capacity models, and never assume a control is active when the compiler says unknown. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-68]

## 2. Architecture comparison

| Architecture | Readability opportunity | Privacy/fidelity posture | Tradeoff |
|---|---|---|---|
| Whole-message local tokenize -> model -> restore | Broadest free-form rewrite | Strong existing local restoration and exact-original fallback | Highest opaque-marker burden; prompt-token mismatch; unchanged-echo acceptance; judge not wired |
| Deterministic structured/templates | Excellent for typed lifecycle, status, command/result, error shells | No model egress for covered fields; trivially testable | Projected payload is raw text, and the Codex adapter references canonical text IDs, so templates cannot cover arbitrary assistant prose |
| Semantic diff | Stronger rejection diagnostics and meaning safety | Local deterministic gate fails closed | Produces no clearer prose; it is a veto, not a generator or readability score |
| Hybrid skeleton + bounded prose slots | Concentrates model work on the prose that can benefit | Keeps canonical values local; validates slots and whole message; reuses tiers | Needs slot contracts, composition, per-slot evidence, and new release/test coverage |

The package already has a deterministic substrate: the runtime-neutral `EventEnvelope` carries typed `kind` (assistant-message, tool-call, tool-result, error, cancellation, extension), `phase`, `terminalStatus`, order coordinates, and canonical payload references. A deterministic renderer can format the shell of a typed status/error/lifecycle message with no model. But `completeAssembly` reduces the terminal message to raw text, and the Codex adapter maps content to canonical references (`{ textOriginalId }`, `{ toolInputOriginalId }`, `{ toolResultOriginalId }`) rather than typed semantic fields — so a template-only replacement would need a broader upstream contract or a semantic parser. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:23-46,52-87] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:66-99] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:271-294]

**Recommendation: adopt the hybrid.** Retain the local protection/restoration primitive as the security boundary; add a deterministic skeleton for the structured shell and bounded protected prose slots for raw-text regions; keep semantic diffing as the fail-closed meaning gate, not a renderer. Start in safe-native append/sidecar mode. Only claim atomic full projection where complete-message ownership and an atomic render decision are confirmed — today that is the Codex App Server client alone (`completeMessage` and `atomicRenderDecision` are `CONFIRMED_YES`; its `append`/`sidecar` are `CONFIRMED_NO`). [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:116-135] [SOURCE: packages/cli-communication-projection/src/clients/types.ts:101-105]

## 3. Value versus deterministic formatting

### Decision matrix

| Input/surface | Recommended default | Projection value | Reason |
|---|---|---|---|
| Short status or typed lifecycle event | Native/deterministic | Low | A model adds latency and failure modes without much translation work |
| Command/result or structured warning with known fields | Deterministic skeleton | Low to medium | Templates preserve exact technical fields and make sections scannable |
| Multi-sentence warning, caveat, consequence, or recovery explanation | Hybrid slot projection, initially append/sidecar | High candidate | Prose clarity can reduce cognitive translation effort; must be measured |
| Long technical agent status with complete assembled ownership | Hybrid; full projection only after evidence | Medium to high candidate | Repeated cross-runtime terse dialects create a plausible user benefit |
| Raw tool data, secret-heavy diagnostic, or unsupported/unknown privacy | Exact original | Negative | Fidelity/privacy risk dominates presentation benefit |
| Incomplete stream or non-atomic native surface | Append/sidecar or exact original | Conditional | Original must remain authoritative; no full-parity claim |
| Durable Markdown, transcript, tool data, or model context | Do not use this capability | Out of scope | The skill excludes canonical/on-disk rewriting |

The complexity ledger is real and gate-heavy: protected-span representation, privacy classification before ranking, provider routing, prompt profiles, capability freshness, restoration, deterministic semantic vetoes, an optional judge, runtime/client ownership, content-free telemetry, a compatibility doctor, a six-runtime injected rehearsal, a real credentialed provider smoke, and a powered, blinded human non-inferiority study. That investment is justified only for messages complex enough that deterministic presentation does not remove the user's translation burden. [SOURCE: .opencode/skills/sk-communication/SKILL.md:33-40,143-160] [SOURCE: packages/cli-communication-projection/docs/runbook.md:3-29]

The value question cannot be settled by another model's opinion. `assertHumanCertifiable` throws on any `llm-proxy` or provisional result, and the runbook's step 8 requires a human non-inferiority study before release; proxy and synthetic scores are diagnostic only. [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:28-38] [SOURCE: packages/cli-communication-projection/docs/runbook.md:19-21]

### Privacy and rollout boundary

Local-only routes permit only `local-offline`/approved `local-networked` and forbid hosted identifiers; hosted routes require a named provider/model, operator consent, and fresh retention/training facts; mixed routes require an explicit ordered fallback list. Any missing/stale/contradictory fact fails closed to the exact original. The practical first rollout is therefore deterministic-first selection, local protected prose slots for a narrow high-complexity corpus, safe-native append/sidecar so the original remains visible, and full atomic replacement only after fresh evidence and human non-inferiority. Rollback disables projections, selects `OriginalOnlyEmergencyMode`, reinstalls the previous exact tarball offline, and verifies the canonical transcript digest without a provider call or canonical mutation — so the experiment is reversible by construction. [SOURCE: packages/cli-communication-projection/docs/privacy.md:7-32] [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-15] [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37]

## Concrete implementation and evaluation sequence

1. Add a versioned model-facing span representation that coalesces bounded adjacent spans or uses short wire aliases while retaining the canonical local map and strict restore checks.
2. Extend the versioned prompt profile with a token-contract instruction, synthetic before/after examples, prose-only rewrite scope, and an explicit one-to-one marker rule; validate and digest the profile.
3. Supply fresh confirmed capability evidence for the DeepSeek (or chosen) preset so temperature/thinking controls are reachable; record the evidence profile with the evaluation strata.
4. Compose provider execution -> deterministic validation -> local/privacy-approved reject-only meaning judge -> render decision in one production path; keep exact-original on every failure.
5. Treat a no-op rewrite as "no improvement" (fall back to deterministic), so a projection is never silently identical to the original.
6. Add deterministic skeletons for typed event/lifecycle/status classes and bounded prose-slot contracts for raw-text regions; begin in append/sidecar mode.
7. Run a fixed-corpus paired study across deterministic-only, current whole-message, and hybrid candidates, measuring fidelity, semantic veto, meaning-judge rejection, human directness/fluency/meaning, latency, cost, rejection, fallback, timeout, and degraded rendering.
8. Run the live credentialed provider smoke and the powered, blinded human non-inferiority gate required by the runbook; do not promote on injected rehearsal, synthetic, or LLM-proxy evidence alone.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Relax token identity/order/count checks | Exact ordered restoration is the fail-closed privacy/fidelity boundary | `fidelity/protected-spans.ts:133-181` | 1 |
| Treat the two-message wire body as a sufficient prompt | It carries no token contract or examples | `providers/adapters.ts:96-100` | 1 |
| Assume temperature alone fixes readability | Temperature is gated `unknown` and returns exact-original before transport | `providers/controls.ts:100-116` | 2 |
| Assume a model-tier upgrade is source-confirmed | No package source establishes a quality ranking across tiers | `providers/presets.ts:43-84` | 2 |
| Treat `evaluateFidelityVeto` as meaning-judge wiring | It hard-codes `judgeMode: 'disabled'` | `evaluation/fidelity-veto.ts:30-50` | 3 |
| Use the masked LLM proxy reviewer as the runtime meaning gate | It is comparative provisional evidence, not a reject-only validator | `evaluation/proxy-judge.ts:32-58` | 3 |
| Call a hosted judge after restoration | It would egress restored plaintext values as a second boundary | `fidelity/validator.ts:175-181,317-357` | 3 |
| Replace local restoration with remote structured rendering | Moves exactness/privacy across the provider boundary without solving arbitrary assistant prose | `fidelity/protected-spans.ts:70-114` | 4 |
| Assume event kind alone supports universal templates | The projected body is raw text, not typed fields | `runtimes/codex.ts:271-294` | 4 |
| Use semantic diff as a readability generator | It is a deterministic rejection/diagnostic layer | `fidelity/semantics.ts:61-107` | 4 |
| Enable projection for every message | Short/structured output has little incremental value; every route adds cost | `contracts/event.ts:52-87` | 5 |
| Use hosted routing as a default quality upgrade | Requires consent and fresh privacy evidence; no source-backed provider winner | `docs/privacy.md:7-32` | 5 |
| Treat proxy/synthetic/injected evidence as product-value proof | Release requires a powered, blinded human non-inferiority study | `docs/runbook.md:19-21` | 5 |

## Open questions

1. Does a hybrid skeleton + bounded-slot projection materially improve comprehension over deterministic formatting after latency, cost, fallback, privacy, and fidelity constraints? This requires a fixed-corpus, human-rated comparison that has not been run.
2. Which coalescing/aliasing scheme best reduces the opaque-token burden without leaking category information through the alias schema?
3. Is a higher model tier (e.g., `deepseek-v4-pro` vs `deepseek-v4-flash`) measurably better at the copy-and-rewrite task, and at what privacy/cost? No source-backed tier ranking exists.
4. What does the live smoke's actual capability-evidence profile look like? It is not checked into the package and is required to reproduce the smoke.

## Iteration record

| Iteration | Focus | New-information ratio | Result |
|---:|---|---:|---|
| 1 | Tokenization granularity and the prompt-token mismatch | 0.92 | Broad protection, opaque ~48-char tokens, two-message body, value-centric instruction, unchanged-echo acceptance |
| 2 | Prompt profile contract and the fail-closed control-evidence gate | 0.84 | No few-shot field; adjacent spans not coalesced; DeepSeek temperature/thinking gated fail-closed; smoke not reproducible |
| 3 | Meaning-preservation judge wiring and the semantic-veto layer | 0.78 | Judge not composed; evaluation veto disables it; judge sees restored plaintext; proxy is provisional |
| 4 | Architecture — local primitive vs structured/templated/semantic-diff/hybrid | 0.72 | Raw-text payload; typed deterministic substrate; hybrid recommendation; Codex-only full projection |
| 5 | Value — where projection earns its complexity | 0.70 | Conditional value for complex prose; human-evidence gate; reversible deterministic-first rollout |

## Synthesis status

Phase synthesis completed for the detached `deepseek` lineage. All five configured research iterations ran before synthesis; the convergence threshold was telemetry only. `resource-map.md` inventories the evidence surfaces and known gaps.
