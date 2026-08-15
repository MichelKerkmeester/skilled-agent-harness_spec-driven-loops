# Iteration 7: Concurrency/failure boundaries and downstream phase decomposition

## Focus

Define the streaming, buffering, ordering, concurrency, cancellation, and retry semantics the portable assembler must honor, and recommend the downstream phase decomposition with dependencies, handoffs, and verification gates.

## Actions Taken

- Read the spec edge-case and state-transition sections (spec.md:203-223), REQ-011/REQ-012 (spec.md:137-138), and NFR-R02 (spec.md:198).
- Read the plan phase map, phase dependencies, and evaluation gates (plan.md:142-255, plan.md:312-329).
- Synthesized across all six iterations: reference buffer semantics (iter 1), runtime stream events (iters 2-4), provider streaming facts (iter 5), and atomic display swap (iter 6).

## Findings

1. **Assembler must reconcile ordering explicitly (confirmed requirement)** — Spec NFR-R02: "unknown stream events are tolerated, ordering/completion is reconciled explicitly, and no partial unvalidated replacement is displayed." Spec edge cases: out-of-order or duplicate chunks must be assembled by stable event identity and sequence with idempotent writes; missing final event or cancellation must expire private state and emit no replacement; concurrent sessions/messages must isolate buffers, locks, notices, cancellation, and cleanup per stable hashed identity. [SOURCE: spec.md:198, spec.md:220-223]

2. **Confirmed per-runtime stream events for ordering (confirmed)** — Claude: `index` + `final` + `delta` per chunk (iter 2). Codex: `item/agentMessage/delta` + `turn/completed` (iter 2). Pi: `message_start`/`message_update`/`message_end`, parallel tool events with source-order start and completion-order end (iter 3). OpenCode: SSE bus events + `{info, parts}` messages (iter 3). Cursor: `session/update` with `agent_message_chunk` (iter 4). Devin: ACP `session/update` (iter 4). The normalized envelope carries `index`/`final`/`sequence` to reconcile ordering. [SOURCE: iterations 2-4]

3. **Ordering strategy (inferred, grounded)** — Where the runtime provides `index`/`final` (Claude, Pi), assemble by those. Where it provides completion events (Codex `turn/completed`), treat arrival + terminal event as the ordering anchor. Where it provides a chunk stream with implicit order (Cursor/OpenCode/Devin), use arrival sequence plus explicit final. Unknown event types are tolerated and skipped (NFR-R02), never fail the whole message. [SOURCE: spec.md:198 + iterations 2-4]

4. **Buffering and lifecycle (inferred, grounded)** — Buffer per stable hashed message identity (never raw ids in paths, per iteration-1 ruling). Buffers are private, locked, bounded, and expired (missing-final → expire and emit nothing). This mirrors the reference's buffer-to-final design (rewrite.sh:102-106) but fixes the filesystem-safety and process-death gaps. [SOURCE: spec.md:220-223 + iteration 1]

5. **Concurrency isolation (confirmed requirement)** — Concurrent sessions/messages need isolated buffers, locks, notices, cancellation, and cleanup per stable hashed identity. Claude fires MessageDisplay per chunk as separate processes (rewrite.sh:5-10) so concurrent messages naturally interleave; the assembler must not share mutable state across identities. [SOURCE: spec.md:222 + rewrite.sh:5-10]

6. **Cancellation semantics (confirmed available)** — Codex App Server: `turn/interrupt` (iter 2). Cursor ACP: `session/cancel` (iter 4). OpenCode server: `POST /session/:id/abort` (iter 3). On cancellation: emit no replacement, expire private state. Pi/SessionStop delivers `session_shutdown` cleanup hooks (iter 3). Claude has no documented message-level cancel for MessageDisplay; the hook simply stops receiving chunks. [SOURCE: iterations 2-4]

7. **Retry policy (inferred, grounded)** — Provider calls are the retryable unit. Reference uses a single curl with `--max-time` and no retry (`rewrite.sh:165-166`); the portable design needs bounded retries with exponential backoff and jitter for transient failures (auth, quota, network), but MUST NOT retry semantic validation failures — a validation rejection selects the original immediately (iteration 6). Capability-discovery probes cache by base URL/model/digest per plan.md:296. [SOURCE: plan.md:295-297 + rewrite.sh:165-166]

8. **Failure classes and fallback routing (confirmed requirement)** — Auth, quota, model-unavailable, network, timeout, refusal, malformed stream, empty result, token limit: select the original and record a redacted reason (spec.md:214). Unsupported runtime interception: use append, sidecar, or custom client; never alter canonical data to fake display replacement (spec.md:216). Every rejected rewrite renders the exact original (NFR-R01). [SOURCE: spec.md:214-216]

9. **Downstream phase map (inferred, grounded in REQ-012)** — Recommend five scoped children under the parent epic, each with inheritance and gates:
   - **Phase A — Runtime adapters + normalized envelope**: per-runtime adapters for the six CLIs (Claude MessageDisplay/stream-json, Codex App Server, Pi extensions/json-rpc, OpenCode server/SSE, Devin ACP, Cursor ACP), normalizing into the envelope from iteration 4. Gate: replay fixtures for each runtime's event stream; schema conformance tests.
   - **Phase B — Assembler + concurrency core**: buffering, ordering, dedup, idempotent writes, isolation, cancellation, expiry. Gate: the full failure/concurrency matrix (out-of-order, duplicate, missing-final, concurrent, oversized, malformed stream; spec REQ-011).
   - **Phase C — Protected-span codec + fidelity validator**: opaque placeholder substitution, deterministic rejection gates (SC-003), exact-original fallback. Gate: zero-span-change corpus; automatic rejection harness.
   - **Phase D — Provider records + privacy routing**: provider record schema, capability discovery (Ollama `/api/show`, Go `/v1/models`, llama.cpp probe), dated privacy facts, local-vs-hosted routing with explicit consent. Gate: re-probe DeepSeek ZDR post-2026-08-31; no-auto-cascade test.
   - **Phase E — Display render + evaluation harness**: RenderDecision (replace/append/sidecar/original), blind human rubric, operational metrics, regression signals. Gate: >=3 runs per provider/model/prompt; semantic adjudication.
   Handoffs: A→B (normalized events), B→C (assembled messages), A→D (runtime capability matrix), C→E (validation verdicts), D→E (provider latency/privacy facts).

10. **Dependencies and rollback (confirmed requirement)** — Downstream phases depend on the confirmed boundaries from iterations 2-4 and the probe-gated facts (Devin chunk schema, OpenCode/Codex message schema, llama.cpp, hosted thinking levers). Rollback boundaries: research artifacts are the only outputs; no source/reference mutation (plan.md:302-307). Verification: strict recursive validation of the parent and children; canonical iteration-count proof (SC-004). [SOURCE: plan.md:312-329, plan.md:302-307]

11. **Architecture freeze (inferred)** — The plan's component set (RuntimeAdapter, MessageAssembler, ContextProvider, RewriteProvider, ProtectedSpanCodec, FidelityValidator, RenderDecision; plan.md:93-100) is confirmed compatible with every finding: A→RuntimeAdapter+ContextProvider, B→MessageAssembler, C→ProtectedSpanCodec+FidelityValidator, D→RewriteProvider(+provider records), E→RenderDecision. No component redesign is required by this lineage; implementation detail is deferred to the named children. [SOURCE: plan.md:93-100]

## Questions Answered

- Q4: Streaming/buffering/ordering/concurrency/cancellation/retry semantics defined from confirmed runtime surfaces and spec requirements.
- Q7 (partial): Observability = operational metrics (p50/p95 latency, fallback rate, tokens, cost, privacy class) + dashboard of rejection reasons; evaluation = deterministic gates + blind rubric + regression signals (fully defined in iteration 6).
- Q8: Recommended downstream phase decomposition A-E with dependencies, handoffs, gates, and rollback.

## Questions Remaining

- Q7: Exact observability schema (event/telemetry shapes) — design detail for Phase E.
- All eight key questions now have at least partial evidence-backed answers.

## Next Focus

Synthesis: compile all seven iterations into research/research.md with the 17-section format, Eliminated Alternatives, convergence report, and downstream phase recommendation.

## Assessment

- newInfoRatio: 0.42
- noveltyJustification: Consolidated the failure/concurrency contract with per-runtime cancellation surfaces and produced a five-child downstream phase map grounded in every prior iteration.
- Confidence: High for confirmed requirements (spec/plan). Phase map and retry policy are evidence-grounded recommendations labeled as inferred.

## Reflection

What worked: threading confirmed runtime stream/cancel surfaces through the spec's failure matrix into a concrete architecture freeze.
What failed / ruled out:
- Retrying semantic validation failures: validation rejection selects the original immediately (iteration 6, ruled out).
- Sharing mutable assembler state across concurrent identities: isolation required (spec.md:222, ruled out).
Ruled out: none additional.
