---
title: Communication Projection Deep-Research Synthesis
type: research
status: complete
spec_folder: specs/sk-doc/028-sk-communication-skill
artifact_dir: specs/sk-doc/028-sk-communication-skill/research/lineages/luna
session_id: fanout-luna-1786567036073-2o1pe1
executor: cli-codex model=gpt-5.6-luna
loop_type: research
iterations_completed: 5
stop_policy: max-iterations
---

# Communication Projection Deep-Research Synthesis

## Executive verdict

The local-tokenize → model → local-restore design is the right privacy and exactness primitive, but the current whole-message projection path gives the model an unnecessarily difficult writing task. The underwhelming smoke is explained by four source-backed constraints: broad protection creates many long opaque markers; adjacent technical spans are not coalesced; the provider receives one encoded message with a minimal instruction and no token-aware examples or rubric; and the optional meaning judge is not composed into the production provider/runtime path. The deterministic semantic layer is a reject-only safety veto, not a clarity scorer.

The best target is a hybrid: render a deterministic skeleton from assembled events and safe metadata, then rewrite only bounded prose slots with the existing local protection/restoration primitive. Keep local canonical bytes, span digests, ordinals, and order unchanged; validate each slot and the complete candidate; and use the existing exact-original, safe-native, append, and sidecar fallbacks. Do not replace the security primitive with remote structured rendering or semantic diffing.

Projection conditionally earns its complexity for high-friction, user-facing, multi-sentence warnings, caveats, consequences, and recovery explanations. Short statuses, typed lifecycle events, command/result summaries, raw tool data, incomplete streams, and surfaces without complete-message ownership should remain deterministic/native or exact-original. This is a value hypothesis, not a measured ROI claim: the package contains no user-value benchmark or deterministic prose baseline, and the supplied live DeepSeek smoke is context rather than a statistically complete experiment.

## Scope and evidence posture

This synthesis reconciles five research iterations, run to the configured `maxIterations: 5`; the convergence ratios (`0.90 → 0.86 → 0.82 → 0.79 → 0.74`) were telemetry only and did not terminate the loop early. The implementation and skill sources were read without modification. Confirmed facts below are marked with exact file/function anchors. Recommendations and value judgments are explicitly marked as inference where they go beyond the current implementation. The lineage is the only write surface.

The immutable contract is unusually strong: canonical events, transcripts, tool inputs/results, and future model context remain byte-for-byte unchanged; privacy is checked before transport; failed, unsupported, timed-out, cancelled, or unsafe paths return the exact original; and full-projection claims require a complete-message owner and atomic render decision. [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-160,189-195]

## Confirmed current path and quality ceiling

### 1. Protection is safe but model-hostile at current granularity

`collectProtectedRanges` protects more than secrets and paths: structural blocks, commands, list markers, links, URLs, flags, hashes, variables, numbers, and several identifier forms are included. Block ranges are collected before inline patterns, and accepted ranges are only overlap-filtered; there is no adjacent-range merge. `protectMarkdown` emits one opaque indexed token per accepted range. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-243,246-301] [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114]

Each token is 48 characters and carries a namespace, ordinal, and digest prefix. A read-only probe recorded a representative sentence growing from 95 source characters to 270 encoded characters with five tokens; other probes grew 33 to 157 characters with three spans and 36 to 204 with four spans. The model must copy exact, semantically opaque strings while also paraphrasing surrounding prose. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:396-415] [SOURCE: iterations/iteration-001.md:17] [SOURCE: iterations/iteration-002.md:16]

The privacy boundary must not be weakened to improve readability. `restoreProtectedSpans` rejects duplicate, changed, unexpected, missing, or reordered markers before restoring the original bytes. Any representation optimization must preserve a local one-to-one map of canonical bytes, digest, ordinal, and order. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-217]

### 2. The prompt does not actively teach the model how to carry tokens

`executeProviderRoute` sends one system instruction and one user message containing the entire encoded text. The reference-like prompt requests simpler English, preserved facts/names/numbers/paths, short sentences, unchanged fenced code, and output-only rewriting, but the current profile has no token inventory/schema, preservation checklist, section plan, or before/after examples. `PromptProfileRecord` is versioned, so adding examples or token-aware controls should be a deliberate profile/assembler contract revision rather than an untracked string edit. [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:11-32] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

### 3. Validation protects fidelity but does not select better prose

`validateProjectionCandidate` stages source digest, provider state, completeness, size, restoration, Markdown structure, deterministic semantic checks, and an optional judge. The semantic comparator checks bounded signatures such as numbers/entities, polarity, requirement strength, priority, uncertainty, caveats, and directives, then returns a veto; unchanged prose can pass, and a candidate is not ranked for fluency or directness. A required judge fails closed when missing, rejected, timed out, cancelled, or failed. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:113-244,315-370] [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179]

The production composition gap is confirmed: `executeProviderRoute` returns a candidate, `decideRender` consumes an already validated result, and the Codex runtime presents that decision. A source search found no production call connecting the provider candidate to `validateProjectionCandidate`, `evaluateFidelityVeto`, or `runProxyReviewers` outside the evaluation modules. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147] [SOURCE: packages/cli-communication-projection/src/render/decision.ts:39-90] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:311-338] [SOURCE: source search: packages/cli-communication-projection/src excluding evaluation/]

When enabled, the injected meaning judge receives decoded source text and restored candidate text. A hosted judge at that seam would therefore be a second egress of real protected values unless it is local or given a separately approved redacted representation. The offline masked proxy judge is a different, comparative evidence lane and is explicitly provisional; it is not a runtime reject-only validator. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:175-181,229-244,315-329] [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:11-37]

### 4. Provider and model claims require fresh evidence

`compilePromptControls` fails closed unless capability, mapping, freshness, and control evidence are confirmed. The DeepSeek preset marks relevant control facts unknown, and no package source establishes a model quality tier. A larger or more instruction-tuned model is a plausible hypothesis for reducing copying failures, not a confirmed result. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-116] [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178] [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147]

## 1. Improve quality without weakening privacy or fidelity

### Priority A: reduce model-facing burden while retaining the local canonical map

1. Keep the protected-value categories and strict local restoration checks. Add a model-facing representation layer that can coalesce bounded adjacent protected spans within a prose clause or replace long canonical wire markers with short collision-resistant aliases. Do not expose the local span map, raw values, or unapproved type labels. Preserve canonical bytes, digests, ordinals, member order, and one-to-one restoration locally. Structural blocks, code, and table boundaries should remain separately protected where grouping could change syntax. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-243] [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-181,396-415] [INFERENCE: grouping or aliasing is safer than deleting protection, but an alias schema may itself disclose categories and needs a privacy-policy decision]

2. Measure token count, encoded/source inflation, marker adjacency, restoration rejection, and output quality on a fixed corpus before choosing a granularity strategy. The useful optimization target is semantic chunk burden, not merely fewer protected spans. [INFERENCE: the existing probes establish a measurement method but not a winning grouping algorithm]

### Priority B: make the prompt a constrained copy-editing contract

Extend the versioned prompt profile with a small synthetic example set and an explicit rubric: preserve every marker exactly once and in order; rewrite only surrounding prose; retain Markdown structure, commands, code, facts, caveats, and directive strength; avoid commentary; and return only the candidate. Examples should contain synthetic opaque markers and no local span map or real protected bytes. Store prompt profile version/digest with evaluation strata so per-model profiles are reproducible. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:11-32] [SOURCE: packages/cli-communication-projection/src/contracts/validate-policy.ts:124-221] [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [INFERENCE: few-shot examples require a schema or prompt-assembler revision, not an ad hoc system-string change]

Use per-model prompt profiles only when the provider capability and prompt mapping are confirmed. Keep a conservative profile for small or locally hosted models and test a more structured profile for higher-capacity models; do not assume a temperature or thinking control is active when the control compiler says unknown. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-116] [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178]

### Priority C: wire the meaning gate at the correct boundary

The missing composition should be explicit:

```text
assemble terminal message
  -> protect locally
  -> privacy route and provider rewrite
  -> deterministic fidelity/restoration checks
  -> local or privacy-approved reject-only meaning judge
  -> render decision
  -> full replacement, append, sidecar, or exact original
```

The judge should run after restoration only when its boundary is local or separately approved; any failure remains exact-original. It should reject meaning loss, not rank variants. Offline masked proxy review and human non-inferiority remain separate evaluation lanes for choosing profiles and models. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:113-244,315-370] [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:12-50] [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84] [SOURCE: packages/cli-communication-projection/src/render/decision.ts:39-90]

### Priority D: choose model tier by a paired, gated experiment

Run current whole-message and proposed slot-based prompts across evidence-backed provider/model/prompt strata. Record deterministic pass rate, meaning-judge rejection, human directness/fluency/meaning/reference-likeness, p50/p95 latency, provider cost, timeout/fallback/degraded-render rates, and privacy/fidelity failures. The package's release report already has fields for these operational dimensions; the missing piece is a live producer-to-validator-to-render composition and a content-bearing evaluation harness whose artifacts remain content-free. [SOURCE: packages/cli-communication-projection/src/evaluation/report.ts:15-108] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:40-67,96-138] [INFERENCE: a higher model tier is justified only when its accepted-projection benefit exceeds its cost and does not increase unsafe fallback pressure]

## 2. Architecture comparison

| Architecture | Readability opportunity | Privacy/fidelity posture | Tradeoff |
|---|---|---|---|
| Whole-message local tokenize → model → restore | Broadest free-form rewrite | Strong existing local restoration and exact-original fallback | Highest opaque-marker copying burden; current judge wiring gap; model must preserve technical structure and rewrite prose simultaneously |
| Deterministic structured/templates | Excellent for typed lifecycle, status, command/result, warning, and recovery shells | No model egress for covered fields; easy to test | Current payloads often reference raw text rather than typed semantic fields, so templates cannot cover arbitrary assistant prose |
| Semantic diff | Stronger rejection diagnostics and meaning safety | Local deterministic gate can fail closed | Produces no clearer prose; current comparator is a veto, not a generator or readability score |
| Hybrid skeleton + bounded prose slots | Concentrates model work on the prose that can benefit from rewriting | Keeps canonical values local; validates slots and whole message; uses existing tiers | Needs slot contracts, composition, per-slot evidence, and new release/test coverage |

The package already has the deterministic substrate: runtime-neutral event kind/phase/status/order, canonical references, payload/extensions, terminal assembly, and client ownership. However, the Codex adapter commonly maps assistant and tool content to canonical text IDs, not typed semantic fields, so a template-only replacement would need a broader upstream contract or a semantic parser. [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87] [SOURCE: packages/cli-communication-projection/src/core/assembler.ts:122-259] [SOURCE: packages/cli-communication-projection/src/core/assembly-output.ts:25-113,145-182] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:198-238,271-294]

Recommendation: adopt the hybrid as the target architecture while retaining the current local protection/restoration primitive. Start with deterministic shells and bounded prose slots in safe-native append/sidecar mode. Only claim atomic full projection when complete-message ownership and atomic render decision are both confirmed. [SOURCE: packages/cli-communication-projection/src/clients/types.ts:18-105] [SOURCE: packages/cli-communication-projection/src/clients/display.ts:18-74] [SOURCE: packages/cli-communication-projection/src/clients/sidecar.ts:15-56] [SOURCE: packages/cli-communication-projection/src/runtimes/matrix.ts:74-99]

## 3. Value versus deterministic formatting

### Decision matrix

| Input/surface | Recommended default | Projection value | Reason |
|---|---|---|---|
| Short status or typed lifecycle event | Native/deterministic | Low | A model adds latency and failure modes without much translation work |
| Command/result or structured warning with known fields | Deterministic skeleton | Low to medium | Templates can preserve exact technical fields and make sections scannable |
| Multi-sentence warning, caveat, consequence, or recovery explanation | Hybrid slot projection, initially append/sidecar | High candidate | This is where prose clarity can reduce cognitive translation effort; must be measured |
| Long technical agent status with complete assembled ownership | Hybrid; full projection only after evidence | Medium to high candidate | Repeated cross-runtime terse dialects create a plausible user benefit |
| Raw tool data, secret-heavy diagnostic, or unsupported/unknown privacy | Exact original | Negative | Fidelity/privacy risk dominates presentation benefit |
| Incomplete stream or non-atomic native surface | Append/sidecar or exact original | Conditional | Original must remain authoritative; no full-parity claim |
| Durable Markdown, transcript, tool data, or model context | Do not use this capability | Out of scope | The skill explicitly excludes canonical/on-disk rewriting |

The high-value claim is an inference grounded in the product contract and evaluation dimensions, not an observed user metric. A fair experiment should compare deterministic skeleton, current whole-message projection, and hybrid slot projection on the same terminal messages. Outcomes should include task completion, comprehension/time-to-answer, error rate, human non-inferiority dimensions, accepted projection rate, latency, provider cost, fallback rate, timeout rate, and degraded-render rate. [SOURCE: .opencode/skills/sk-communication/SKILL.md:1-39,43-67] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:40-67,96-138] [SOURCE: packages/cli-communication-projection/src/evaluation/report.ts:15-108]

The complexity ledger is real: protected-span representation, provider/privacy routing, prompt profiles, model capability freshness, restoration, semantic checks, optional judge, runtime/client ownership, content-free telemetry, compatibility doctor, six-runtime rehearsal, live smoke, human release evidence, and rollback. That investment is justified only when the message is complex enough that deterministic presentation does not remove the user's translation burden. [SOURCE: packages/cli-communication-projection/docs/runbook.md:1-29] [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:1-26]

### Privacy and rollout boundary

Local-only routes permit only local-offline or explicitly approved local-networked providers and forbid hosted identifiers. Hosted routes require named provider/model, operator consent, fresh retention/training facts, and a credential reference. Mixed routes require an explicit ordered fallback list; ranking never creates a fallback; missing, unknown, contradictory, or stale facts fail closed to the exact original. [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-15] [SOURCE: packages/cli-communication-projection/docs/privacy.md:1-32]

The compatibility doctor checks versions, capabilities, endpoint reachability, credential references, hosted privacy facts, and presentation tier; a blocked report selects original-only and remains content-free. The support matrix distinguishes supported, provisional, and blocked/stale evidence, and the injected six-runtime rehearsal cannot substitute for a real credentialed smoke. [SOURCE: packages/cli-communication-projection/src/doctor/checks.ts:25-90,93-160,163-226,229-301,303-340] [SOURCE: packages/cli-communication-projection/src/doctor/doctor.ts:18-45] [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:19-26]

The practical first rollout is therefore: deterministic-first selection; local protected prose slots for a narrow high-complexity corpus; safe-native append/sidecar so the original remains visible; and full atomic replacement only after fresh runtime/provider/privacy evidence and human non-inferiority. Rollback disables projections, selects `OriginalOnlyEmergencyMode`, restores a previous exact tarball offline, and verifies the canonical transcript digest without a provider call or canonical mutation. [SOURCE: packages/cli-communication-projection/docs/runbook.md:15-29] [SOURCE: packages/cli-communication-projection/src/release/rollback.ts:7-27,29-135] [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37]

## Concrete implementation and evaluation sequence

1. Add a versioned model-facing span representation that supports bounded adjacency grouping or short aliases while retaining the canonical local map and strict restore checks.
2. Extend prompt profiles with synthetic-token examples, explicit one-to-one marker rules, prose-only rewrite scope, and a readability/meaning rubric; validate and digest the profile.
3. Compose provider execution, deterministic validation, the local/privacy-approved reject-only meaning judge, and render selection in one production path; keep exact-original on every failure.
4. Add deterministic skeletons for typed event/lifecycle/status classes and bounded prose-slot contracts for raw-text regions; begin in append/sidecar mode.
5. Run a fixed-corpus paired study across current whole-message, deterministic-only, and hybrid candidates. Include five existing content-free case categories as metadata coverage, but keep actual test text and candidate values ephemeral or privacy-approved. Measure fidelity, semantic veto, meaning judge, human dimensions, latency, cost, rejection, fallback, timeout, and degraded rendering.
6. Run the live credentialed provider smoke and powered blinded human non-inferiority gate required by the runbook; do not promote based on injected rehearsal, synthetic scores, or LLM-proxy evidence alone.

## Ruled-out directions

- Removing protected categories or weakening token identity/order checks to make prompts shorter would violate the current privacy/fidelity boundary. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-181] [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100]
- Treating deterministic semantic validation as a readability evaluator would not solve unchanged or awkward rewrites. [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179]
- Treating the offline masked LLM proxy reviewer as the runtime meaning judge would mix a comparative provisional evidence lane with a privacy-scoped reject-only gate. [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:11-37]
- Replacing the local primitive with remote structured rendering would move exactness and privacy responsibility across the provider boundary without solving arbitrary assistant prose. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217]
- Enabling projection for every message or making hosted routing the default would spend complexity where deterministic/native output is adequate and would conflict with explicit privacy/evidence gates. [SOURCE: packages/cli-communication-projection/docs/privacy.md:1-32] [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:16-46,52-87]

## Remaining uncertainty

The causal explanation for the quality ceiling is confirmed, and the architecture/value recommendation is well supported by the contracts. The efficacy of any particular coalescing scheme, alias format, prompt profile, model tier, judge, or hybrid slot schema is not confirmed. The open question is whether a fixed-corpus, human-rated hybrid materially improves comprehension over deterministic formatting after latency, cost, fallback, privacy, and fidelity constraints. No completion claim should be made for that product question until the prescribed evidence exists.

## Iteration record

| Iteration | Focus | New-information ratio | Result |
|---:|---|---:|---|
| 1 | Pipeline mechanics and quality ceiling | 0.90 | Broad protection, token inflation, minimal prompt, reject-only semantics |
| 2 | Granularity, prompt profiles, and model controls | 0.86 | Adjacent-span inflation, admissible prompt/profile levers, unconfirmed DeepSeek controls |
| 3 | Judge wiring and evaluation boundaries | 0.82 | No production judge composition; proxy/human evidence separation |
| 4 | Architecture alternatives and ownership boundaries | 0.79 | Typed deterministic substrate plus hybrid slot recommendation |
| 5 | User value, adoption boundary, and operational cost | 0.74 | Conditional value for complex prose; deterministic-first rollout and open efficacy test |

## Synthesis status

Phase synthesis completed for the detached `luna` lineage. All five configured research iterations ran before synthesis; the convergence threshold was telemetry only. `resource-map.md` inventories the evidence surfaces and known gaps.
