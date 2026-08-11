# Provider-Neutral CLI Display Projection

## 1. Executive Summary

The portable design is not a universal rewrite hook. It is an immutable mirror of canonical runtime events plus a separate, replaceable display projection. Claude Code can use its documented `MessageDisplay` surface. Codex, OpenCode, Devin, and Cursor are safest behind client protocols or servers. Pi can use custom rendering, but its finalized-message replacement capability must stay outside the canonical lane. [SOURCE: iterations/iteration-001.md:16] [SOURCE: iterations/iteration-001.md:18] [SOURCE: iterations/iteration-001.md:20] [SOURCE: iterations/iteration-001.md:22] [SOURCE: iterations/iteration-001.md:24] [SOURCE: iterations/iteration-001.md:26]

Every non-success path selects the exact original. A projection may replace visible output only after the runtime message is complete, provider output is complete, protected spans are byte-identical, Markdown structure is valid, semantic veto checks pass, and an atomic compare-and-swap confirms the canonical payload is unchanged. [SOURCE: iterations/iteration-002.md:18] [SOURCE: iterations/iteration-002.md:22] [SOURCE: iterations/iteration-002.md:26] [SOURCE: iterations/iteration-002.md:28]

Provider routing separates wire protocol from deployment and privacy. OpenAI compatibility does not prove capability parity, local execution, retention, training policy, residency, or consent. OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and future providers therefore use explicit model-specific records with dated policy and probe evidence. [SOURCE: iterations/iteration-003.md:16] [SOURCE: iterations/iteration-003.md:18] [SOURCE: iterations/iteration-003.md:20] [SOURCE: iterations/iteration-003.md:22]

## 2. Scope and Method

This lineage completed exactly three iterations under `stopPolicy: max-iterations`:

| Iteration | Focus | newInfoRatio | Result |
|-----------|-------|--------------|--------|
| 1 | Six CLI boundaries and normalized events | 0.69 | 8 findings |
| 2 | Assembly and fidelity validation | 0.86 | 7 findings |
| 3 | Providers, privacy, evaluation, and phases | 0.81 | 8 findings |

The work combined local reference inspection, current official runtime/provider documentation, protocol standards, security guidance, and architecture inference. Confirmed claims cite primary sources. Derived designs are marked as inference in the iteration evidence. The reference and phase packet remained read-only.

## 3. Reference Architecture Reverse Engineering

The `claudish-to-english` prototype has four useful ideas:

1. It changes display while leaving Claude's canonical reasoning and transcript untouched. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/README.md:3]
2. It buffers `MessageDisplay` deltas by message and rewrites only after the final chunk. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:89]
3. It supplies bounded user-question context to keep the copy edit on topic. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:151]
4. Append mode naturally fails open because the original already streamed. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:109]

Its unsafe assumptions must not carry forward:

- Replace mode suppresses original chunks before a valid rewrite exists. A process death or missing final event can therefore violate the claimed fail-open behavior. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:109]
- Raw session and message identifiers become directory names and recursive-deletion targets. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:99] [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:126]
- Prompt instructions request fidelity but do not validate it deterministically. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:149]
- The Ollama-native request is hard-coded rather than represented as a model-specific provider capability. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:162]
- Markdown-file rewriting mutates bytes and is a separate product surface, not display projection. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite-md.sh:200]

The communication feel appears to come from whole-message context, a narrow copy-editing instruction, low sampling, and short plain-language phrasing. That is an inference to test perceptually, not a guarantee from the implementation. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:149]

## 4. Six-Runtime Integration Matrix

| Runtime | Confirmed safest boundary | Projection consequence | Confidence |
|---------|---------------------------|------------------------|------------|
| Claude CLI | `MessageDisplay`; headless output is an alternative wrapper surface | Assemble final display text separately; never suppress original before validation | Confirmed, version pin required |
| Codex CLI | App Server rich-client protocol | Mirror thread/turn/item/delta/completion/interrupt events in a custom client | Confirmed |
| Pi CLI | Extension custom rendering or JSON/RPC-controlled UI | Use rendering only; exclude finalized-message replacement from the canonical lane | Confirmed |
| OpenCode CLI | Server/SDK session APIs and SSE event bus | Separate client projects canonical session events; plugins are not assumed to replace arbitrary rendering | Confirmed |
| Devin CLI | `devin acp` stdio JSON-RPC boundary | Use an ACP client, but probe Devin-specific update fields and cancellation | Transport confirmed; schema inferred |
| Cursor CLI | ACP stdio JSON-RPC and `session/update` | Preserve permission, task, cancellation, and stop-reason events instead of flattening them into prose | Confirmed |

Primary evidence and caveats are recorded in iteration 1. [SOURCE: iterations/iteration-001.md:14]

## 5. Normalized Event and Message Model

The core consumes immutable event envelopes:

```text
CanonicalEvent {
  runtime, runtimeVersion, adapterSchemaVersion,
  sessionId, turnId, messageId, itemId, partId, toolCallId, parentId,
  kind, phase, eventId, sourceSequence, arrivalOrdinal, sourceTimestamp,
  canonicalPayloadRef, canonicalPayloadHash, terminalStatus,
  capabilityConfidence
}
```

Missing native fields stay `null`. Adapters must not invent ancestry, ordering, completion, or tool relationships. Canonical text, tool inputs/results, approvals, status, and extension payloads remain typed immutable references. Projection metadata is separate:

```text
Projection {
  canonicalPayloadHash, providerId, modelId, providerConfigHash,
  promptPolicyVersion, protectedSpanPolicyVersion,
  validationResults, attemptId, fallbackReason, projectedTextRef
}
```

[INFERENCE: normalized from Claude chunk identity, Codex App Server items, Pi events, OpenCode sessions/SSE, and ACP session updates; see iterations/iteration-001.md:28]

## 6. Assembly State Machine

Each logical message uses a versioned key and independent generation:

```text
COLLECTING -> QUIESCING -> VALIDATING -> COMMITTED_PROJECTION
     |             |             |
     +-------------+-------------+-> COMMITTED_ORIGINAL
     +-> CANCELLED | TIMED_OUT | FAILED | OVERFLOWED | INCOMPLETE
```

Required behavior:

- Keep runtime/schema version in the assembly key and reconnect/retry attempts in `generation`.
- Track source sequence, arrival order, and assembly order independently.
- Deduplicate exact `(eventId, canonicalPayloadHash)` repeats.
- Treat one ID with conflicting hashes as corruption and commit the original.
- Isolate concurrent messages, parts, tools, and sessions in separate bounded buffers.
- Enter bounded quiescence for sequence gaps or missing-final uncertainty.
- Invalidate provider attempt tokens on cancellation, timeout, or superseding generation.
- Ignore late events and provider responses after a terminal commit.
- On event/byte/deadline/global-budget overflow, release working buffers and retain the immutable original.
- Retry only transport-safe, policy-approved attempts with an idempotency key over canonical payload and policy/config versions.

SSE reconnection and JSON-RPC correlation support these rules but do not provide one universal ordering contract. [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [SOURCE: https://www.jsonrpc.org/specification] [INFERENCE: iterations/iteration-002.md:16]

## 7. Protected Spans and Fidelity Validation

Protection uses two layers:

1. Parse the pinned Markdown dialect and protect source ranges for fenced/indented code, inline code, headings, links/destinations, HTML, lists, tables, and runtime extensions.
2. Conservatively lex paths, commands, flags, variables, URLs, hashes, identifiers, quoted literals, proper names, numbers, and number-unit pairs.

Opaque placeholders require exact set, count, order, and one-to-one mapping. False positives are safe because they reduce rewriting freedom; false negatives can change meaning.

Validation order is deterministic first:

1. Provider request completed successfully with an allowed terminal status.
2. Output is non-empty, non-refusal, non-truncated, within bounds, and syntactically decodable.
3. Placeholder set/count/order/bijection matches.
4. Restored protected bytes match the original ranges.
5. Markdown AST shape and protected nodes match the pinned dialect.
6. Entity, fact, omission, polarity, uncertainty, caveat, requirement-strength, priority, and next-step checks run as vetoes.

A model judge can reject, but never authorize by itself. Unavailable or disagreeing validators select the original. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: iterations/iteration-002.md:24]

## 8. Render Decision and Exact-Original Fallback

Projection replacement is a one-time compare-and-swap:

```text
replace_allowed =
  source_terminal == completed
  && canonical_hash_unchanged
  && all_parts_complete
  && provider_terminal == success
  && all_validators_pass
  && runtime_supports_atomic_display_replace
```

If false, the renderer emits or retains the immutable canonical payload. It does not reconstruct the original from placeholders, an AST, decoded stream text, or projected text. The original store records pre-parse bytes, byte length, encoding metadata, and a cryptographic hash. [SOURCE: iterations/iteration-002.md:22] [SOURCE: iterations/iteration-002.md:28]

Runtime fallback modes are capability negotiated:

- Atomic replace only when a documented display surface supports it safely.
- Append after the original when replacement is unavailable but extra display is acceptable.
- Sidecar/custom client when the native CLI cannot host a safe projection.
- Exact original only for every unsupported, incomplete, cancelled, timed-out, retried, refused, truncated, malformed, conflicted, or validation-failed path.

## 9. Provider-Neutral Architecture

Provider records are model-specific:

```text
ProviderRecord {
  providerId, deploymentMode, protocol, baseUrl, modelId,
  credentialRef, credentialBoundary,
  discoveryMethod, providerVersion, modelArtifactHash,
  capabilities, capabilityConfidence,
  timeout, cost,
  privacyClass, egressConsent, trainingUse, retentionDays, residency,
  termsCheckedAt, termsExpiresAt,
  fallbackPolicy
}
```

Confirmed provider facts:

- OpenCode Go documents `deepseek-v4-flash` on an OpenAI-compatible Chat Completions endpoint and a models discovery route. Its price and privacy statements are dated; the documented ZDR agreement is time-bounded through 2026-08-31. Reasoning-control and residency behavior remain unknown until probed/reviewed. [SOURCE: https://opencode.ai/docs/go/]
- Ollama `/api/show` exposes model details and capabilities. Its OpenAI-compatible surface is partial and version/model dependent, so native and compatibility probes remain separate. [SOURCE: https://docs.ollama.com/api-reference/show-model-details] [SOURCE: https://docs.ollama.com/api/openai-compatibility]
- llama.cpp documents multiple compatible endpoint families, streaming, constrained JSON, reasoning controls, context/timeouts, monitoring, and build/version output. Behavior must be pinned by build, model hash, quantization, template, and probe. [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]

## 10. Privacy-Aware Routing

Routing evaluates policy before model preference:

1. Match source-content privacy class.
2. Require explicit egress consent for any off-device route.
3. Verify credential boundary and dated training/retention/residency facts.
4. Reject unknown or expired load-bearing privacy fields.
5. Verify model-specific protocol and capability confidence.
6. Apply timeout and cost preferences only among eligible routes.
7. Permit fallback only when explicitly named and no weaker on privacy.

Privacy classes should distinguish `local-offline`, `local-networked`, `hosted-zdr`, `hosted-retained`, and `unknown`. A localhost URL does not prove offline execution. An OpenAI-compatible endpoint does not prove hosted or local deployment. Local-to-hosted fallback is never implicit. [SOURCE: iterations/iteration-003.md:22] [SOURCE: iterations/iteration-003.md:41]

## 11. Observability

Emit content-free spans/events for:

- assembly start, quiescence, and terminal state;
- provider selection, attempt, retry, and terminal state;
- each validation-layer outcome;
- compare-and-swap commit or exact-original fallback;
- cancellation, timeout, overflow, duplicate conflict, and backpressure.

Allowed attributes include pseudonymous scoped IDs, runtime/provider/model versions, policy/capability hashes, privacy class, result enums, latency, byte/token counts, cost, retries, and fallback reason. Prohibit prompts, outputs, canonical bytes, protected literals, credentials, raw paths, and unredacted provider errors. Use rotating keyed digests only when correlation is necessary. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [INFERENCE: iterations/iteration-003.md:24]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Universal lifecycle hook | Only Claude confirms a dedicated display-only hook; other runtimes need clients/renderers | `iteration-001.md:32` | 1 |
| Pi finalized-message replacement | Can alter lifecycle state rather than presentation only | `iteration-001.md:34` | 1 |
| Reuse Cursor ACP schema for Devin | Shared transport does not prove identical runtime fields | `iteration-001.md:35` | 1 |
| Arrival order as canonical order | JSON-RPC concurrency and SSE reconnect/replay invalidate the assumption | `iteration-002.md:32` | 2 |
| Reconstruct original from parsed text | Parsing/decoding can erase byte distinctions | `iteration-002.md:33` | 2 |
| LLM judge as fidelity proof | Probabilistic validation cannot authorize semantic safety | `iteration-002.md:34` | 2 |
| Suppress original before validation | Missing-final, timeout, or cancellation can swallow output | `iteration-002.md:35` | 1-2 |
| Provider/protocol name as privacy class | Compatibility does not establish deployment, retention, residency, or consent | `iteration-003.md:34` | 3 |
| Automatic local-to-hosted fallback | Crosses an egress boundary without explicit consent | `iteration-003.md:35` | 3 |
| Content-bearing telemetry | Creates a second sensitive persistence surface | `iteration-003.md:36` | 3 |
| Automatic metrics as parity proof | Diagnostic scores cannot override deterministic or human failures | `iteration-003.md:37` | 3 |

## Divergence Map

No divergent pivots ran. The forced-depth lineage broadened sequentially from runtime boundaries, to assembly/fidelity, to providers/evaluation. The remaining frontier is executable version-pinned fixtures, not an unresolved architecture branch. [SOURCE: deep-research-dashboard.md:94]

## 12. Open Questions

The five architecture questions are evidence-backed at selection level. One implementation question remains:

- Which exact runtime fields, Markdown dialect/parser behaviors, provider request/stream/error shapes, Ollama native timing/keep-alive fields, and llama.cpp build/model capability outcomes appear in pinned executable fixtures?

Unknowns must remain `unknown` and select exact-original fallback until their fixture or probe passes. [SOURCE: iterations/iteration-003.md:81]

## 13. Perceptual 1:1 Parity Evaluation

Build a secret-free, versioned corpus containing progress updates, final summaries, plans, blockers, reviews, terse messages, Markdown structures, protected literals, tools, concurrency, duplicate/reordered events, cancellation, timeout, malformed streams, refusals, and truncation.

For each pinned runtime/provider/model/prompt/policy version:

1. Run deterministic protected-span, structure, completion, and exact-original gates.
2. Run at least three repetitions, recording supported seeds or explicit nondeterminism.
3. Randomize and blind surviving pairs.
4. Score meaning preservation, directness/plainness, fluency, reference-likeness, and pairwise indistinguishability separately.
5. Record fallback rate, p50/p95 first-token and full latency, cold/warm local latency, token use, cost, privacy class, and validator failure distribution.

Automatic readability, simplification, embedding, or model-judge metrics are diagnostic only. Human-adjudicated semantic regression and any deterministic fidelity failure block release. [SOURCE: iterations/iteration-003.md:26]

## 14. Recommended Downstream Phases

| Phase | Scope | Depends On | Authoritative Gate |
|-------|-------|------------|--------------------|
| 1. Contracts and fixtures | Event/provider/privacy schemas; six runtime captures; Markdown dialect and provider fixtures; exact-original goldens | None | Every fixture is versioned, provenance-tagged, and has deterministic expected normalization/fallback |
| 2. Core assembly and validation | State machine, canonical store, protected spans, validators, atomic commit | Phase 1 | Reorder/duplicate/concurrency/cancel/timeout/retry/corruption tests preserve byte-identical original fallback |
| 3. Providers and privacy | OpenCode Go, Ollama, llama.cpp, generic adapters, policy router | Phases 1-2 contracts | Capability probes and fresh terms pass; no route/fallback weakens privacy or egress policy |
| 4. Runtime adapters and clients | Six runtime integration boundaries | Phases 1-2; provider interface from 3 | Pinned fixtures map losslessly; canonical state remains unchanged; unsupported replacement stays original-only |
| 5. Evaluation and observability | Redacted telemetry, corpus runner, blind rubric, operational reporting | Phases 2-4 | Redaction canaries and predeclared safety/parity thresholds pass |
| 6. Packaging and release hardening | Supported-version matrix, configuration, rollback, compatibility checks | Phases 1-5 | Clean install, six-runtime smoke fixtures, privacy review, negative controls, and rollback pass |

[SOURCE: iterations/iteration-003.md:89]

## 15. Risks and Mitigations

| Risk | Failure | Mitigation |
|------|---------|------------|
| Runtime API drift | Event loss, wrong terminal state, canonical mutation | Pin versions and replay fixtures before enabling replacement |
| Prompt-only fidelity | Changed facts, caveats, or requirements | Protected spans, deterministic gates, semantic veto, exact-original fallback |
| Pre-final suppression | Blank output on failure | Stream/retain original; commit projection atomically only after validation |
| Provider capability drift | Unsupported controls or malformed streams | Model/build-specific discovery and probes with `yes/no/unknown` confidence |
| Privacy policy staleness | Unapproved retention, training, residency, or egress | Dated terms with expiry; reject stale/unknown routes |
| Concurrency collision | Cross-message or cross-session corruption | Versioned per-key generations and bounded isolated buffers |
| Observability leakage | Sensitive content persists in telemetry | Content-free enums/hashes, rotating keyed IDs, redaction canaries |
| Perceptual overfitting | Looks like reference but changes meaning | Separate meaning, style, fluency, and parity scores; meaning failures block |

## 16. Confirmed Facts and Inferences

Confirmed:

- Each runtime boundary in Section 4 is supported by its cited official documentation, with Devin limited to ACP transport confirmation.
- OpenCode Go, Ollama, and llama.cpp expose the provider surfaces cited in Section 9.
- SSE, JSON-RPC, CommonMark, and OWASP establish the transport, parsing, and trust limitations cited in Sections 6-7.
- The lineage produced three canonical iteration records, three narratives, three delta files, a reducer registry with 23 findings, and five resolved architecture questions.

Inferred design decisions requiring fixture proof:

- The exact normalized envelope and state transitions.
- Which runtime surfaces can commit a true atomic replacement rather than append/sidecar output.
- The protected literal lexer and runtime-specific Markdown dialect behavior.
- Model-specific reasoning, structured-output, stream, timing, and keep-alive capabilities where official docs are incomplete.
- Human thresholds that define acceptable 1:1 communication parity.

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
- [WHATWG SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/)
- [OWASP LLM01 prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai)
- [Lineage resource map](resource-map.md)

### Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining architecture questions: 0
- Remaining implementation fixture question: 1
- newInfoRatio trend: `0.69 -> 0.86 -> 0.81`
- Mean newInfoRatio: `0.7867`
- Convergence threshold: `0.05`
- Stop policy: `max-iterations`; convergence signals were telemetry before the hard cap
- Source diversity: runtime docs, provider docs, protocol standards, security guidance, local reference, and phase packet
- Reducer state: 23 key findings, zero open tracked questions, zero corruption warnings
- Divergence summary: no pivots; no saturated-direction override
