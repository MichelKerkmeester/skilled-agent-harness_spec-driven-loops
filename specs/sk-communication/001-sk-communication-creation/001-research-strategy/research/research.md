# Provider-Neutral CLI Display Projection Research

Canonical synthesis for `001-research-strategy`, compiled from the `deepseek-go` 7-iteration lineage and the `gpt-sol-fast` 3-iteration lineage.

Evidence labels used throughout:

- `[C]` Confirmed by a cited primary source or exact repository evidence.
- `[I]` Inferred architecture or policy derived from confirmed evidence.
- `[U]` Unknown until a version-pinned probe or fixture confirms it.

## 1. Executive Summary

The safest portable architecture is an immutable mirror of canonical CLI events plus a separate display projection. It is not a universal hook and it never rewrites model-visible messages, transcripts, tool calls, tool results, approvals, or runtime state. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-001.md:14] [SOURCE: lineages/deepseek-go/iterations/iteration-004.md:33]

The reference succeeds because it waits for a whole assistant message, supplies bounded conversational context, uses a narrow plain-language copy-editing prompt, disables thinking, uses low sampling, and fails to the original. Its most important weakness is that preservation is prompt-only. Replace mode also suppresses original chunks before a validated rewrite exists, so process death or a missing final event can leave a blank display. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:89] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:109] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:149] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:162]

The recommended system has seven separable boundaries:

1. Runtime adapters normalize immutable events.
2. A versioned message assembler handles ordering, concurrency, completion, cancellation, and retry generations.
3. A context provider selects bounded rewrite context under privacy policy.
4. A protected-span codec removes fragile literals before inference.
5. Model-specific provider adapters normalize hosted and local protocols without treating compatibility as capability or privacy equivalence.
6. A deterministic-first fidelity validator can only veto a rewrite.
7. A render decision atomically selects validated projection or the byte-identical original.

The core recommendation is therefore: preserve canonical state, project only complete messages, validate before replacement, and make the exact original the only universal fallback.

## 2. Method and Provenance

The workflow executed two independent, detached `cli-opencode` lineages with live web access:

| Lineage | Model | Framework | Required iterations | Observed iterations | Stop reason |
|---------|-------|-----------|---------------------|---------------------|-------------|
| `deepseek-go` | `opencode-go/deepseek-v4-flash` | RCAF index-only fallback | 7 | 7 | `maxIterationsReached` |
| `gpt-sol-fast` | `openai/gpt-5.6-sol-fast`, high reasoning | CRISPE | 3 | 3 | `maxIterationsReached` |

Both lineages produced canonical JSONL iteration records, write-once narratives, per-iteration deltas, reducer state, and final synthesis. All ten `verify-iteration.cjs` checks passed. The root merge retained both lineages and reconstructed 97 attributed findings with no skipped registry and no delta corruption. [SOURCE: orchestration-summary.json] [SOURCE: fanout-attribution.md] [SOURCE: resource-map.md]

The DeepSeek lineage wrote future timestamps outside its actual process window. The content and iteration counts passed validation, but those timestamps are not accepted as wall-clock evidence. The orchestration summary preserves the anomaly. [SOURCE: orchestration-summary.json:22] [SOURCE: lineages/deepseek-go/deep-research-state.jsonl]

## 3. Reference Architecture Reverse Engineering

### Confirmed behavior

- `[C]` `MessageDisplay` runs `rewrite.sh` with a 60-second hook timeout. `PostToolUse` runs `rewrite-md.sh` after `Write|Edit` with a 180-second timeout. [SOURCE: ../../context/claudish-to-english-main/hooks/hooks.json:3] [SOURCE: ../../context/claudish-to-english-main/hooks/hooks.json:14]
- `[C]` The display hook reads `message_id`, `session_id`, `index`, `final`, `transcript_path`, and the chunk `delta`. It writes indexed part files and reconstructs the message only on `final:true`. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:89] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:102] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:117]
- `[C]` It reads the last non-meta user message from the transcript and truncates it to 800 codepoints for context. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:151]
- `[C]` The prompt asks for simpler plain English while retaining facts, names, numbers, paths, and fenced code. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:149]
- `[C]` The provider call is Ollama-native `/api/chat` with `stream:false`, `think:false`, temperature `0.3`, and response extraction from `.message.content`. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:162]
- `[C]` Append mode keeps the streamed original and adds the rewrite. Replace mode blanks intermediate chunks and publishes the rewrite on the final event. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:109] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:215]
- `[C]` The Markdown hook is opt-in by directory, separates frontmatter, and writes through a temporary file plus rename. It changes durable bytes and is not a display-only surface. [SOURCE: ../../context/claudish-to-english-main/rewrite-md.sh:100] [SOURCE: ../../context/claudish-to-english-main/rewrite-md.sh:115] [SOURCE: ../../context/claudish-to-english-main/rewrite-md.sh:200]

### Confirmed risks

- `[C]` Replace mode suppresses output before final rewrite validation. A missing final event or killed hook can violate fail-open behavior. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:109]
- `[C]` Raw external session and message identifiers become directory names and later recursive-deletion targets. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:99] [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:102]
- `[C]` No deterministic protected-span or semantic validator exists. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:149] [SOURCE: lineages/gpt-sol-fast/iterations/iteration-002.md:24]
- `[I]` The 1:1 communication feel most likely comes from whole-message context, narrow copy-editing scope, short sentences, low sampling, and the original user question as bounded context. Perceptual evaluation must confirm this rather than treating the prompt as proof. [SOURCE: ../../context/claudish-to-english-main/rewrite.sh:149]

## 4. Six-CLI Integration Matrix

| Runtime | Safest integration boundary | Confirmed event/render facts | Required emulation or probe | Status |
|---------|-----------------------------|------------------------------|-----------------------------|--------|
| Claude CLI | `MessageDisplay` when version-pinned; headless `stream-json` wrapper when owning the whole presentation pipeline | Display-specific hook and chunk identity are documented; the reference proves whole-message assembly | Probe current timeout, exact payload fields, transcript lag, and subagent ancestry | `[C]` boundary, `[U]` version fixture |
| Codex CLI | App Server JSON-RPC client | Thread/turn/item deltas, completion, interrupt, and steering are client-visible; the client owns rendering | Pin schemas and reconnect/cancellation fixtures; do not use context injection for display | `[C]` boundary |
| Pi CLI | Extension custom renderers or JSON/RPC-owned UI | Tool/message lifecycle and custom rendering are documented | Exclude finalized-message replacement from the canonical lane; pin release and renderer semantics | `[C]` rendering, `[I]` safety restriction |
| OpenCode CLI | Server/SDK session APIs plus SSE; ACP is an optional adapter family | Sessions, parts, events, abort, and server APIs are documented; client owns presentation | Pin OpenAPI/event schemas and SSE replay/reconnect behavior; do not assume plugins replace arbitrary output | `[C]` boundary |
| Devin CLI | `devin acp` client | ACP transport is documented | Capture Devin-specific `session/update`, tool, permission, cancellation, and terminal fixtures | `[C]` transport, `[U]` exact schema |
| Cursor CLI | ACP client | JSON-RPC session lifecycle, updates, permission requests, cancellation, and Cursor extension events are documented | Pin current fields and preserve Cursor-specific plan/task events | `[C]` boundary |

Primary source set: [Claude hooks](https://code.claude.com/docs/en/hooks), [Codex App Server](https://learn.chatgpt.com/docs/app-server), [Pi extensions](https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md), [OpenCode server](https://opencode.ai/docs/server/), [Devin commands](https://docs.devin.ai/cli/reference/commands), and [Cursor ACP](https://cursor.com/docs/cli/acp). [SOURCE: lineages/gpt-sol-fast/iterations/iteration-001.md]

`[I]` ACP is a reusable transport family across Devin, Cursor, and OpenCode, but shared transport does not imply identical event schemas or semantics. Each adapter retains runtime-specific extension fields and confidence metadata.

## 5. Normalized Event and Message Model

The core receives immutable envelopes rather than runtime objects:

```text
CanonicalEvent {
  runtime, runtimeVersion, adapterSchemaVersion,
  sessionId, turnId, messageId, itemId, partId, toolCallId, parentId,
  kind, phase, eventId,
  sourceSequence, arrivalOrdinal, sourceTimestamp,
  canonicalPayloadRef, canonicalPayloadHash,
  terminalStatus, capabilityConfidence
}
```

Projection state is separate:

```text
ProjectionAttempt {
  canonicalPayloadHash,
  providerId, modelId, providerConfigHash,
  promptPolicyVersion, protectedSpanPolicyVersion,
  attemptId, generation,
  validationResults, fallbackReason, projectedTextRef
}
```

`[I]` Missing native fields remain `null`. Adapters never invent ancestry, sequence, finality, or tool relationships. Canonical text, tools, approvals, status, and extension events remain immutable typed references. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-001.md:28]

## 6. Streaming, Ordering, Concurrency, Cancellation, and Retry

Each logical message has a versioned key and generation:

```text
COLLECTING -> QUIESCING -> PROJECTING -> VALIDATING -> COMMITTED_PROJECTION
     |             |             |             |
     +-------------+-------------+-------------+-> COMMITTED_ORIGINAL
     +-> CANCELLED | TIMED_OUT | FAILED | OVERFLOWED | INCOMPLETE
```

Required rules:

- Track source sequence, arrival order, and assembly order independently.
- Deduplicate exact `(eventId, canonicalPayloadHash)` repeats.
- Treat one stable identity with conflicting hashes as corruption and select the original.
- Isolate each session, turn, message, part, tool, and retry generation.
- Use bounded quiescence for sequence gaps or missing-final uncertainty.
- Invalidate provider attempts on cancellation, timeout, or superseding generation.
- Ignore late events and provider responses after terminal commit.
- Enforce per-message and global event, byte, time, and concurrency limits.
- Retry only transport-safe, policy-approved attempts with idempotency keys.
- Never retry a semantic or deterministic validation rejection; select the original immediately.

SSE reconnection and JSON-RPC request correlation support these rules but do not create a universal ordering contract. [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: lineages/gpt-sol-fast/iterations/iteration-002.md:16]

## 7. Provider-Neutral Model

Providers are model-specific records, not protocol aliases:

```text
ProviderRecord {
  providerId, deploymentMode, protocol, baseUrl, modelId,
  credentialRef, credentialBoundary,
  discoveryMethod, providerVersion, modelArtifactHash,
  capabilities, capabilityConfidence,
  timeout, retryPolicy, cost,
  privacyClass, egressConsent, trainingUse, retentionDays, residency,
  termsCheckedAt, termsExpiresAt,
  fallbackPolicy
}
```

- `[C]` OpenCode Go documents `deepseek-v4-flash` through an OpenAI-compatible Chat Completions route. The Go catalog is protocol-heterogeneous across models, so protocol belongs to the model record. Its privacy statements are dated and the researched ZDR agreement was time-bounded through 2026-08-31. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: lineages/deepseek-go/iterations/iteration-005.md]
- `[C]` Ollama `/api/show` exposes model details and capabilities. Prefer `ollama-native` when local discovery, timings, thinking controls, and keep-alive matter. Treat Ollama Cloud as a separate hosted deployment. [SOURCE: https://docs.ollama.com/api-reference/show-model-details]
- `[C]` Ollama also exposes an OpenAI-compatible surface, but compatibility is partial and version/model dependent. [SOURCE: https://docs.ollama.com/api/openai-compatibility]
- `[C]` llama.cpp provides OpenAI-compatible server endpoints and build-specific capabilities. Pin build, model artifact, quantization, template, context, and stream behavior. [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]
- `[U]` Reasoning controls, structured output, streaming details, token accounting, timing fields, and error shapes remain model/build-specific until discovered or probed.

## 8. Privacy-Aware Routing

Routing evaluates privacy eligibility before quality, latency, or price:

1. Classify the source content.
2. Require explicit egress consent for any off-device route.
3. Verify credential boundary and dated retention, training, and residency facts.
4. Reject stale or unknown load-bearing privacy fields.
5. Verify model-specific protocol and capability confidence.
6. Rank quality, latency, and cost only among eligible routes.
7. Permit fallback only when explicitly named and no weaker on privacy.

Recommended privacy classes are `local-offline`, `local-networked`, `hosted-zdr`, `hosted-retained`, and `unknown`. A localhost URL does not prove offline execution. An OpenAI-compatible endpoint does not prove local or hosted deployment. Local-to-hosted fallback is never implicit. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-003.md:22]

## 9. Protected-Span Codec

Protection is deterministic and conservative:

1. Parse the pinned Markdown dialect and protect fenced/indented code, inline code, headings, links and destinations, HTML, lists, tables, and runtime extensions.
2. Lex paths, commands, flags, variables, URLs, hashes, identifiers, quoted literals, names, numbers, and number-unit pairs.
3. Replace spans with collision-resistant opaque placeholders before inference.
4. Require exact placeholder set, count, order, and one-to-one mapping.
5. Restore from the immutable original span table, never from model output.

False positives reduce rewrite freedom and fail safely. False negatives can change meaning and therefore require corpus expansion. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-002.md:20]

## 10. Fidelity Validation and Render Decision

Validation is deterministic first and veto-only:

1. Provider completion has an allowed terminal state.
2. Output is non-empty, non-refusal, non-truncated, bounded, and decodable.
3. Placeholder bijection and order match.
4. Restored protected bytes match original ranges.
5. Markdown structure and protected nodes match the pinned dialect.
6. Entity, fact, omission, polarity, uncertainty, caveat, requirement-strength, priority, and next-step checks run as vetoes.
7. Atomic compare-and-swap confirms the canonical payload hash is unchanged.

A model judge may reject but may never authorize by itself. An unavailable or disagreeing validator selects the original. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: lineages/gpt-sol-fast/iterations/iteration-002.md:24]

```text
replace_allowed =
  source_terminal == completed
  && canonical_hash_unchanged
  && all_parts_complete
  && provider_terminal == success
  && all_validators_pass
  && runtime_supports_atomic_display_replace
```

If false, retain or emit the byte-identical canonical original. Do not reconstruct the original from placeholders, parsed Markdown, normalized text, or provider output. Runtime fallback negotiation is `atomic-replace`, `append-after-original`, `sidecar/custom-client`, or `exact-original-only`. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-002.md:28]

## 11. Observability

Emit content-free events for assembly lifecycle, provider selection and attempts, validation layers, render decisions, cancellation, timeout, overflow, duplicate conflict, backpressure, and fallback.

Allowed attributes include pseudonymous scoped IDs, runtime/provider/model versions, configuration and policy hashes, privacy class, result enums, latency, byte/token counts, cost, retries, and fallback reason. Prohibit prompts, outputs, canonical bytes, protected literals, credentials, raw paths, and unredacted provider errors. Use rotating keyed digests only where correlation is required. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [SOURCE: lineages/gpt-sol-fast/iterations/iteration-003.md:24]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Universal lifecycle hook | Only Claude confirms a dedicated display surface; other runtimes need clients or renderer ownership | `lineages/gpt-sol-fast/iterations/iteration-001.md` | GPT 1 |
| Canonical message mutation for display | Changes model-visible or persisted state | `lineages/deepseek-go/iterations/iteration-004.md` | DeepSeek 4 |
| Pi finalized-message replacement in the portable core | Can alter lifecycle state instead of presentation only | `lineages/gpt-sol-fast/iterations/iteration-001.md:20` | GPT 1 |
| Codex context injection or item injection for rendering | Mutates context and does not provide a generic renderer | `lineages/deepseek-go/iterations/iteration-002.md` | DeepSeek 2 |
| OpenCode plugin events as arbitrary renderer replacement | No documented generic replacement output | `lineages/deepseek-go/iterations/iteration-003.md` | DeepSeek 3 |
| Raw external IDs in filesystem paths | Path traversal and unsafe recursive cleanup risk | `../../context/claudish-to-english-main/rewrite.sh:99` | DeepSeek 1, GPT 1 |
| Arrival order as canonical order | Concurrent JSON-RPC and reconnectable SSE invalidate the assumption | `lineages/gpt-sol-fast/iterations/iteration-002.md` | GPT 2 |
| Suppress original before validation | Missing-final, timeout, cancellation, or process death can swallow output | `../../context/claudish-to-english-main/rewrite.sh:109` | Both |
| Reconstruct original from parsed or transformed text | Parsing can erase byte distinctions | `lineages/gpt-sol-fast/iterations/iteration-002.md` | GPT 2 |
| Prompt-only fidelity | Cannot prove literal, structural, or semantic preservation | `../../context/claudish-to-english-main/rewrite.sh:149` | Both |
| LLM judge as authorization | Probabilistic validation cannot prove fidelity | `lineages/gpt-sol-fast/iterations/iteration-002.md` | GPT 2 |
| Provider name as protocol or privacy class | Compatibility does not establish capabilities, deployment, retention, residency, or consent | `lineages/gpt-sol-fast/iterations/iteration-003.md` | Both |
| Automatic local-to-hosted fallback | Crosses an egress boundary without explicit consent | `lineages/deepseek-go/iterations/iteration-005.md` | Both |
| Content-bearing telemetry | Creates another sensitive persistence surface | `lineages/gpt-sol-fast/iterations/iteration-003.md` | GPT 3 |
| Automatic metrics as parity proof | Diagnostic metrics cannot override deterministic or human failures | `lineages/gpt-sol-fast/iterations/iteration-003.md` | Both |

## Divergence Map

No divergent Council pivots ran because the configured mode was `default` and the stop policy forced each lineage to its cap. The lineages independently converged on immutable canonical state, client-owned rendering where hooks are insufficient, deterministic protected spans, exact-original fallback, and privacy-first provider routing.

Two differences were resolved:

- Pi: the portable core uses custom renderer or JSON/RPC presentation. It does not use finalized-message replacement because that can participate in Pi lifecycle state. This adopts the stricter GPT finding.
- Downstream decomposition: the fixtures-first GPT ordering is retained, while the DeepSeek component split is preserved inside implementation stages. Packaging and release hardening remain a separate final stage.

The remaining frontier is executable fixture evidence, not another high-level architecture branch.

## 12. Open Questions

- `[U]` Exact version-pinned event and completion schemas for every runtime, especially Devin ACP and OpenCode/Codex reconnect behavior.
- `[U]` Whether each native surface can perform a truly atomic display replacement or must use append, sidecar, or a custom client.
- `[U]` Runtime-specific Markdown dialect and extension-node behavior.
- `[U]` Hosted-model reasoning controls and exact malformed-stream/error semantics per provider route.
- `[U]` Ollama native timing and keep-alive behavior across selected local models.
- `[U]` llama.cpp streaming, structured-output, cancellation, and token-accounting behavior per pinned build/model.
- `[U]` The protected-literal lexer grammar and the non-inferiority margin for perceptual parity.
- `[U]` Whether Markdown-file rewriting should become a separate opt-in product rather than part of display projection.

## 13. Perceptual 1:1 Parity Evaluation

Build a secret-free, versioned corpus covering progress updates, final summaries, plans, blockers, corrections, reviews, terse messages, Markdown structures, protected literals, tools, concurrency, duplicated/reordered events, cancellation, timeout, missing completion, malformed streams, refusals, and truncation.

For each pinned runtime, provider, model, prompt, and policy version:

1. Run exact-original negative controls and deterministic protected-span, structure, completion, and fallback gates.
2. Run at least three repetitions, recording supported seeds or explicit nondeterminism.
3. Randomize and blind surviving output pairs against the reference style.
4. Score meaning preservation, directness/plainness, fluency, reference-likeness, and pairwise indistinguishability separately.
5. Pre-register a non-inferiority margin only after measuring reference-to-reference and human-to-human baseline variance.
6. Record p50/p95 first-token and full-rewrite latency, local cold/warm latency, fallback rate, token use, cost, privacy class, and validator-failure distribution.
7. Block release on any deterministic fidelity failure or human-adjudicated semantic regression.

SARI, LENS, readability, embeddings, and model-judge scores are investigation signals only. They do not prove fidelity or perceptual parity. [SOURCE: lineages/gpt-sol-fast/iterations/iteration-003.md:26] [SOURCE: lineages/deepseek-go/iterations/iteration-006.md]

## 14. Cross-Lineage Triangulation

| Claim | DeepSeek | GPT | Resolution |
|-------|----------|-----|------------|
| Preserve canonical state and project display only | Confirmed architecture invariant | Confirmed architecture invariant | Accepted |
| Safest boundaries for six CLIs | Claude/Pi native; clients for others | Claude native; clients/renderers for others | Accepted with Pi restriction |
| Normalized model | Compact event envelope | Rich versioned immutable envelope | Adopt rich envelope; compact fields remain the minimum subset |
| Assembly | Hashed identity, ordering, cancellation, bounded retry | Explicit generation state machine and compare-and-swap | Adopt GPT state model plus DeepSeek failure inventory |
| Provider routing | Protocol-heterogeneous, dated privacy, no local-hosted cascade | Model-specific records and privacy-first eligibility | Accepted |
| Fidelity | Protected spans, deterministic gates, exact original | Deterministic-first veto pipeline and immutable-byte store | Accepted |
| Evaluation | Blind rubric plus operational metrics | Repeated blind non-inferiority evaluation | Accepted; thresholds require baseline |
| Phase map | Five component-oriented children | Six fixtures-first stages | Seven stages: fixtures, components, and release hardening |

No load-bearing disagreement was averaged away. Unknowns remain explicit probe gates.

## 15. Recommended Downstream Phases

| Phase | Scope | Depends on | Handoff | Authoritative gate |
|-------|-------|------------|---------|--------------------|
| 002 Contracts and fixtures | Event, provider, privacy, projection, and error schemas; six runtime captures; provider fixtures; exact-original goldens | Phase 001 | Versioned fixture package | Provenance-tagged fixtures with deterministic expected normalization and fallback |
| 003 Core normalization and assembly | Immutable event mirror, canonical byte store, state machine, ordering, dedup, bounds, cancellation, retry generations | 002 | Complete assembled canonical messages | Reorder, duplicate, concurrency, missing-final, cancellation, timeout, retry, and corruption tests preserve exact original |
| 004 Protected spans, fidelity, and render decisions | Markdown dialect, span codec, deterministic validators, semantic vetoes, compare-and-swap, fallback negotiation | 002-003 | Validation verdict and render decision | Zero protected-span drift; every rejected path emits byte-identical original; negative controls fail as expected |
| 005 Provider adapters and privacy router | OpenCode Go DeepSeek, Ollama, llama.cpp, generic hosted adapters, capability discovery, policy eligibility | 002, interface from 004 | Eligible provider attempt or policy rejection | Fresh capability and terms probes; no route or fallback weakens privacy |
| 006 Runtime adapters and clients | Claude, Codex, Pi, OpenCode, Devin, and Cursor integration surfaces | 002-005 | Display projection over unchanged canonical state | Pinned event replay is lossless; unsupported replacement stays append/sidecar/original-only |
| 007 Evaluation and observability | Corpus runner, blind rubric, parity statistics, redacted telemetry, operational reporting | 003-006 | Release evidence packet | Deterministic gates, redaction canaries, predeclared semantic/style criteria, and latency/cost reporting pass |
| 008 Packaging and release hardening | Configuration, supported-version matrix, local/hosted policy UX, rollback, compatibility doctor | 002-007 | Installable supported release | Clean install, six-runtime fixture smoke tests, privacy review, negative controls, and rollback pass |

Rollback remains stage-local. No phase may require mutation of canonical transcripts or model context to simulate display replacement.

## 16. Risks and Mitigations

| Risk | Failure | Mitigation |
|------|---------|------------|
| Runtime API drift | Event loss, wrong finality, or accidental canonical mutation | Pin versions, replay fixtures, and fail to original on unknown events |
| Prompt-only fidelity | Changed facts, caveats, requirements, paths, or code | Protected spans, deterministic validation, semantic veto, exact-original fallback |
| Pre-final suppression | Blank output after process death or missing final event | Retain/stream original and commit projection only after validation |
| Provider capability drift | Unsupported controls or malformed streams | Model/build-specific discovery and probes with `yes/no/unknown` confidence |
| Privacy-policy staleness | Unapproved retention, training, residency, or egress | Dated terms with expiry; reject stale or unknown eligible routes |
| Concurrency collision | Cross-message/session corruption | Versioned per-key generations, locks, and bounded isolated buffers |
| Telemetry leakage | Sensitive content persists outside transcript policy | Content-free enums/hashes, rotating keyed IDs, and redaction canaries |
| Perceptual overfitting | Output resembles the reference but changes meaning | Separate meaning, directness, fluency, and parity scores; meaning failures block |
| Exact-original reconstruction | Parser normalization changes bytes | Preserve immutable pre-parse bytes and hash; never reconstruct fallback |

## 17. References and Convergence Report

Primary references:

- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
- [Codex App Server](https://learn.chatgpt.com/docs/app-server)
- [Pi extensions](https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md)
- [OpenCode server](https://opencode.ai/docs/server/)
- [Devin CLI commands](https://docs.devin.ai/cli/reference/commands)
- [Cursor CLI ACP](https://cursor.com/docs/cli/acp)
- [OpenCode Go](https://opencode.ai/docs/go/)
- [Ollama model details](https://docs.ollama.com/api-reference/show-model-details)
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
- [llama.cpp server](https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md)
- [WHATWG Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/)
- [OWASP LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai)
- [Workflow resource map](resource-map.md)
- [DeepSeek lineage synthesis](lineages/deepseek-go/research.md)
- [GPT lineage synthesis](lineages/gpt-sol-fast/research.md)

Convergence report:

- Stop policy: `max-iterations`; convergence was telemetry only.
- DeepSeek: 7/7 iterations, `maxIterationsReached`, all iteration validations passed.
- GPT: 3/3 iterations, `maxIterationsReached`, all iteration validations passed.
- Total: 10 iteration narratives, 10 canonical iteration records, and 10 delta files.
- Merge: 2/2 registries merged, 97 attributed findings, 0 skipped registries, 0 resource-map corruption.
- Runtime warning: one stall warning occurred while both lineages ultimately completed.
- Integrity qualification: DeepSeek state timestamps were outside the observed process window and are treated as anomalous metadata, not chronological evidence.
- Synthesis outcome: architecture questions are answered at selection level; version-pinned fixtures and probes remain the implementation gate.
