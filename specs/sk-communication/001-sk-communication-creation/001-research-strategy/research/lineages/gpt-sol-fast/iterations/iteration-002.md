# Iteration 2: Version-Aware Assembly and Fidelity Validation

## Focus

This iteration specified the version-aware message assembly state machine and layered fidelity validator for the immutable event mirror established in iteration 1. It selected the prompt pack's narrower assembly-and-validation interpretation over the reducer's field-version question; exact field mapping remains a fixture prerequisite rather than a reason to repeat the six-CLI survey. Sources were accessed on 2026-08-11.

## Actions Taken

1. Read the lineage config, append-only state, reducer strategy, findings registry, iteration 1, and the iteration-2 prompt before choosing the focus.
2. Examined the WHATWG Server-Sent Events standard for reconnection identity, ordered parsing, incomplete-event behavior, and terminal closure.
3. Examined JSON-RPC 2.0 for version markers, request/response correlation, notification limitations, and out-of-order concurrent batch responses.
4. Examined CommonMark 0.31.2 and OWASP LLM01:2025 to derive syntax-aware protected spans and a fail-closed untrusted-content validation boundary.

## Findings

1. **Assembly identity must include runtime/schema versions and separate logical-message identity from stream attempts.** Use `assemblyKey = (runtime, runtimeVersion, adapterSchemaVersion, sessionId, turnId, messageId|itemId, partId)` and a distinct `generation` for reconnects or runtime retries. Each accepted event also records `eventId`, `arrivalOrdinal`, optional runtime `sourceSequence`, canonical payload hash, and adapter capability evidence. JSON-RPC requires an exact `"2.0"` version and correlates responses by request `id`; SSE retains a last-event ID across reconnects. These are evidence for preserving native identity, not for inventing a universal sequence. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [INFERENCE: assembly key derived from the immutable event envelope in iteration 1 and the two standards' identity/version rules]

2. **The assembler is a per-key state machine, not a shared text buffer.** The states are `COLLECTING -> QUIESCING -> VALIDATING -> COMMITTED_ORIGINAL|COMMITTED_PROJECTION`, with terminal side paths `CANCELLED`, `TIMED_OUT`, `FAILED`, `OVERFLOWED`, and `INCOMPLETE`; every side path commits the original. Concurrent message, part, and tool streams receive independent keyed buffers. Runtime sequence gaps, conflicting duplicates, or a stream ending without its required final event enter bounded `QUIESCING`; expiry becomes `INCOMPLETE`. SSE processes lines in receipt order, discards a final incomplete event, and reconnects with `Last-Event-ID`, while JSON-RPC batches may execute concurrently and return responses in any order, so arrival order alone cannot prove message order. [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [SOURCE: https://www.jsonrpc.org/specification] [INFERENCE: state transitions and gap policy combine these transport guarantees with iteration 1's terminal-state model]

3. **Deduplication, retry, late-event, and backpressure rules must be generation-safe.** Exact duplicate `(eventId, canonicalPayloadHash)` pairs are no-ops; a repeated ID with a different hash is a conflict and forces original fallback. Provider attempts use an idempotency key over `(assemblyKey, generation, canonicalPayloadHash, policyVersion, providerConfigHash)` and accept only the currently active attempt token. Cancellation or deadline expiry invalidates that token, and late responses/events cannot mutate a terminal commit. Per-key byte/event/deadline limits plus a global budget trigger immediate original pass-through and buffer release rather than dropping canonical content. SSE explicitly allows reconnection/backoff and distinguishes `CLOSED` from reconnecting; JSON-RPC notifications are unconfirmable and concurrent results may be unordered, which makes explicit generation and terminal guards necessary. [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [SOURCE: https://www.jsonrpc.org/specification] [INFERENCE: retry idempotency, bounds, and late-event quarantine are fail-closed architecture rules]

4. **Atomic render commitment is a compare-and-swap against an immutable canonical payload, never pre-final suppression.** The renderer may stream the canonical original immediately. A projection may replace it only once when the source terminal status is successful, the canonical hash still matches, all expected parts are complete, the provider attempt succeeded without truncation/refusal, and every validation layer passes. If the surface cannot atomically replace the already visible original, projection replacement is disabled for that surface. All cancellation, error, timeout, overflow, gap, duplicate conflict, missing-final, stale-attempt, or validator outcomes leave or restore the exact original reference. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [INFERENCE: compare-and-swap closes iteration 1's pre-final suppression failure mode]

5. **Protected-span validation needs a source-range parser plus a conservative literal lexer.** First parse the pinned Markdown dialect and protect raw source ranges for fenced/indented code, inline code, headings, links and destinations, HTML, lists, and dialect tables; CommonMark defines block-before-inline precedence and literal code contents, but does not standardize tables, so each runtime dialect must declare that extension. Then lex and protect paths, commands/flags, variables, URLs, hashes, identifiers, quoted literals, names, numbers, and number-unit pairs. Replace ranges with opaque placeholders and require exact placeholder set, count, order, and one-to-one source mapping before restoration. [SOURCE: https://spec.commonmark.org/0.31.2/] [INFERENCE: conservative lexer categories come from the iteration-2 protected-span requirement; false positives reduce rewriting but preserve fidelity]

6. **Validation must be layered, deterministic first, and fail closed because semantic equivalence is not perfectly decidable by another model.** Gate order is: provider success and complete response; output size/termination/refusal checks; placeholder bijection and order; protected-byte equality after restoration; Markdown AST shape and protected-node equality; then semantic comparisons for entities/facts, omissions, polarity/negation, uncertainty and caveats, requirement strength, priority, and next steps. Any mismatch, unavailable validator, low-confidence semantic result, or disagreement between validators rejects the projection. OWASP states that prompt injection lacks fool-proof prevention and recommends deterministic output-format validation, filtering, and segregation of untrusted content; therefore a semantic model may veto a rewrite but may never authorize one by itself. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [SOURCE: https://spec.commonmark.org/0.31.2/] [INFERENCE: layered validator ordering minimizes probabilistic authority]

7. **Exact-original fallback must preserve the pre-parse canonical bytes or an immutable byte-addressed reference.** CommonMark operates on characters rather than bytes and permits parsers not to retain whether source text used literal characters or entity references; SSE decoding is UTF-8 and strips a leading BOM. Consequently, neither a Markdown AST nor decoded/transformed text can reconstruct the exact original in every case. Store `canonicalPayloadRef`, byte length, encoding metadata, and cryptographic hash before parsing or provider submission; fallback emits that immutable payload directly and records only the rejected projection and reason separately. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] [INFERENCE: byte-preserving fallback follows from the standards' lossy parse/decode transformations]

## Ruled Out

- Arrival order as canonical assembly order: JSON-RPC permits concurrent batch responses in any order, and SSE reconnects can replay from `Last-Event-ID`. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]
- Reconstructing the original from placeholders, a Markdown AST, or decoded text: parsing and decoding can erase byte-level distinctions. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]
- Treating an LLM judge as a deterministic semantic proof: OWASP describes prompt injection prevention as non-fool-proof and recommends deterministic validation boundaries. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/]
- Suppressing original chunks until a rewrite succeeds: it turns missing-final, timeout, cancellation, and validator failure into blank or reconstructed output rather than exact fallback. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30]

## Dead Ends

- A universal table parser is not available from CommonMark because tables are a dialect extension. Version-pinned runtime fixtures must declare Markdown dialect and parser version before implementation. [SOURCE: https://spec.commonmark.org/0.31.2/]
- A deterministic gate cannot prove every semantic equivalence claim. The safe resolution is asymmetric: deterministic checks can approve literal/structural invariants, while semantic uncertainty can only reject and fall back. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: fail-closed consequence of non-fool-proof model behavior]

## Edge Cases

- Ambiguous input: the reducer's `Next Focus` asked only for Devin/Claude field-version caveats, while the explicit iteration prompt required assembly and fidelity validation. The prompt's narrower dispatch contract prevailed; version fields became assembly-key and fixture requirements.
- Contradictory evidence: none. SSE's ordered line parsing and JSON-RPC's unordered concurrent batch responses apply at different layers and support separate source and assembly ordering.
- Missing dependencies: version-pinned event fixtures and runtime-specific Markdown dialect declarations were not present in the detached lineage. The architecture defines their required contract but does not claim field-level implementation readiness.
- Partial success: assembly and validator questions are answered at architecture-selection level, but semantic equivalence remains intentionally non-provable and runtime fixtures remain required. Status is `complete` because every uncertain/non-success path has a specified exact-original outcome.

## Sources Consulted

- [WHATWG HTML Living Standard: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html), last updated 2026-07-20 and accessed 2026-08-11.
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification), accessed 2026-08-11.
- [CommonMark Specification 0.31.2](https://spec.commonmark.org/0.31.2/), accessed 2026-08-11.
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), accessed 2026-08-11.
- `specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:28`.

## Assessment

- New information ratio: 0.86 (5 fully new findings and 2 partially new findings across 7 total; `(5 + 0.5 × 2) / 7 = 0.857`, rounded).
- Questions addressed: streaming/ordering/concurrency/cancellation/retry assembly; protected-span and semantic fidelity gates; exact-original fallback.
- Questions answered: key questions 2 and 3 at architecture-selection level, with version-pinned fixtures required for implementation.

## Reflection

- What worked and why: transport standards separated source ordering, correlation, reconnection, and terminal behavior; CommonMark exposed where parsed structure loses source bytes; OWASP supported an asymmetric deterministic-first trust boundary.
- What did not work and why: no standard can make probabilistic semantic comparison a proof, and CommonMark cannot define runtime-specific table syntax. Both gaps must become fail-closed capability/fixture requirements rather than optimistic assumptions.
- What I would do differently: start from executable, version-pinned event and Markdown fixtures so each transition, duplicate, gap, and protected span can be expressed as a deterministic acceptance test.

## Questions Answered

- How should assembly handle streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic render commitment? With versioned per-key generations, independent source/arrival/assembly order, conflict-aware deduplication, bounded fail-open-to-original buffers, terminal attempt tokens, and a one-time compare-and-swap commit.
- Which protected-span and semantic fidelity gates can reject unsafe rewrites and return the exact original? Syntax-range plus conservative literal placeholders, deterministic structural and completion gates, veto-only semantic checks, and direct fallback to immutable canonical bytes.

## Questions Remaining

1. How should privacy-aware provider routing cover OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and other hosted/local providers without unapproved egress or capability assumptions?
2. Which observability, perceptual-parity evaluation, and downstream phase boundaries make the architecture testable and implementable?
3. Which exact event fields and Markdown dialect capabilities appear in version-pinned fixtures for Claude, Devin, and the other four adapters?

## Recommended Next Focus

Define privacy-aware hosted/local provider routing and the evaluation/observability contract, using the assembly terminal reasons and validator layer outcomes as stable telemetry. Include a version-pinned fixture matrix as the implementation handoff boundary rather than reopening the six-CLI integration survey.
