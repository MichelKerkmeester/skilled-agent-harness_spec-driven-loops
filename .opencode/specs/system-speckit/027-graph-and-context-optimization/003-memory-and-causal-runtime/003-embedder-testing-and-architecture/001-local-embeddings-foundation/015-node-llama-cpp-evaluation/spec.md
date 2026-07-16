---
title: "Feature Specification: 015 node-llama-cpp Memory MCP embedding evaluation"
description: "Opt-in llama-cpp GGUF provider evaluation for Spec Kit Memory embeddings, with parity, benchmark, documentation, and default-flip decision gates."
trigger_phrases:
  - "015 node llama cpp evaluation"
  - "llama-cpp memory embeddings"
  - "node-llama-cpp embeddinggemma"
  - "Memory MCP GGUF provider"
  - "llama-cpp default flip"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation"
    last_updated_at: "2026-05-13T09:56:14Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Measured llama-cpp; parity failed"
    next_safe_action: "Keep hf-local as default; revisit only with a parity-preserving GGUF/tokenizer path"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "scratch/bench-results.json"
      - "scratch/parity-results.txt"
    session_dedup:
      fingerprint: "sha256:0150150150150150150150150150150150150150150150150150150150150150"
      session_id: "015-node-llama-cpp-evaluation-2026-05-13"
      parent_session_id: "015-node-llama-cpp-evaluation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered this packet."
      - "Use subagents? -> User forbade delegation; SPAWN_AGENT_USED=no."
      - "Flip default? -> No; llama-cpp is faster but fails the cosine parity gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: 015 node-llama-cpp Memory MCP embedding evaluation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 15 |
| **Predecessor** | `014-onnx-cross-platform-backend` |
| **Outcome** | **Rejected for default flip**: llama-cpp is faster but misses parity |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP local embedding path currently defaults to `hf-local`, which uses `@huggingface/transformers` with the ONNX EmbeddingGemma export and q8 dtype. A prior cocoindex ONNX packet was rejected after measurement, but Memory MCP is a Node/TypeScript surface and already has `node-llama-cpp` installed as an optional dependency. The open question is whether a Node-native llama-cpp provider can improve local Gemma performance without corrupting vector-index compatibility.

### Purpose
Add and evaluate an opt-in `EMBEDDINGS_PROVIDER=llama-cpp` provider for Memory MCP. The current default remains `hf-local`; llama-cpp can only become a future default if it satisfies vector parity and benchmark evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `LlamaCppProvider` implementing the shared `IEmbeddingProvider` contract.
- Lazy dynamic import of `node-llama-cpp` and lazy GGUF model loading.
- GGUF model discovery and model metadata capture.
- Prefix-registry reuse so document/query embeddings follow the same task-prefix rules as `hf-local`.
- Factory support for explicit `EMBEDDINGS_PROVIDER=llama-cpp`.
- Smoke, factory, and parity tests.
- Query/load benchmark harness comparing `hf-local` and `llama-cpp`.
- `.env.example` and Memory MCP README documentation for the opt-in provider.
- Level 2 packet docs, metadata, and strict validation.

### Out of Scope
- Changing the default provider away from `hf-local`.
- Editing `hf-local.ts`, `embeddings.ts`, or `types.ts`.
- Editing cocoindex or resurrecting the rejected ONNX cocoindex packet.
- Rebuilding existing vector indexes.
- Promoting `node-llama-cpp` from optional dependency to direct dependency unless optional resolution fails.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Create | Opt-in llama-cpp provider |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Explicit provider registration and lazy import |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-parity.vitest.ts` | Create | 50-sample parity gate |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-smoke.vitest.ts` | Create | Provider smoke test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-factory.vitest.ts` | Create | Factory wire-up test |
| `.env.example` | Modify | Opt-in env guidance and GGUF download command |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Provider option documentation |
| Packet docs and `scratch/` | Create/Modify | Evidence, benchmark results, metadata, and validation |
| Parent `graph-metadata.json` | Modify | Register phase 15 and final causal summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001** `LlamaCppProvider.generateEmbedding(text)` returns `Float32Array | null` and rejects invalid text consistently with existing providers.
- **REQ-002** `embedDocument(text)` and `embedQuery(text)` reuse the existing model-prefix registry.
- **REQ-003** `warmup()`, `healthCheck()`, `getMetadata()`, `getProfile()`, and `getProviderName()` satisfy `IEmbeddingProvider`.
- **REQ-004** The provider dynamically imports `node-llama-cpp` and gives a clear install hint if it is missing.
- **REQ-005** The provider loads the GGUF lazily on first embedding call and reuses a singleton runtime for the same model path.
- **REQ-006** Output vectors are L2-normalized and dimension-coerced to 768.
- **REQ-007** Factory support is explicit opt-in only via `EMBEDDINGS_PROVIDER=llama-cpp`.
- **REQ-008** Default provider resolution remains unchanged: no env var still falls through to `hf-local` when no cloud key is set.
- **REQ-009** Profile slug separates llama-cpp indexes from `hf-local` indexes.
- **REQ-010** Tests skip cleanly when the llama-cpp env gate or GGUF file is absent.

### Non-Functional Requirements
- `node-llama-cpp` import cost is avoided on unrelated provider paths.
- No vector mixing between `hf-local` and llama-cpp profiles.
- Benchmark rows include p50/p95/p99 query latency, load time, RSS, and watts when available.
- Parity verdict controls the default-flip recommendation.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. `EMBEDDINGS_PROVIDER=llama-cpp` constructs a llama-cpp provider through the factory without changing default resolution.
2. Smoke test returns a normalized 768-dimensional `Float32Array`.
3. Parity test records mean cosine, min cosine, and sample count for the 50-chunk panel.
4. Benchmark artifact records load and query rows for both `hf-local` and `llama-cpp`.
5. Default flip is recommended only if parity passes and benchmark results justify it.
6. Packet strict validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node-llama-cpp` optional dependency | Provider unusable if not installed | Dynamic import with clear install hint |
| Dependency | GGUF model availability | Tests/benchmark cannot run without model | Download/substitution recorded in `scratch/model-info.json` |
| Risk | Tokenizer or pooling mismatch | High latency win could still be unsafe for existing index rankings | Hard cosine gate and no default flip on failure |
| Risk | Metal runtime warnings | Performance may differ by host and Node runtime | Record host evidence and keep opt-in |
| Risk | Vector mixing | Toggling providers could reuse the wrong sqlite DB | Provider-specific profile slug |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

| Area | Complexity | Notes |
|------|------------|-------|
| Provider wrapper | Medium | Native module import, singleton runtime, model-path handling |
| Parity | Medium | Same 50-panel comparison against `hf-local` |
| Benchmark | Low | Single-query/load timings with existing providers |
| Documentation | Medium | Evaluation must distinguish faster from parity-safe |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Target | Verification |
|-------------|--------|--------------|
| Default path | Unset env still resolves to `hf-local` | Factory test and static review |
| Import laziness | `node-llama-cpp` imported only for llama-cpp provider | Static review of factory lazy import |
| Vector shape | 768-dimensional normalized vectors | Smoke test |
| Index isolation | Separate profile slug | `getProfile()` slug from `EmbeddingProfile` |
| Measurement integrity | Real benchmark/parity artifacts | `scratch/parity-results.txt`, `scratch/bench-results.json` |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Missing GGUF model returns a clear model-path error from the provider and skips parity/smoke tests unless explicitly configured.
- `require('node-llama-cpp')` fails under Node 25 because the package uses ESM top-level await; dynamic import succeeds and is the provider path.
- The requested `bartowski/embeddinggemma-300m-GGUF` artifact was not public from this host; `unsloth/embeddinggemma-300m-GGUF` Q8_0 was used instead.
- BF16/F32 precision probes improved parity but still missed the hard threshold, so quantization alone is not the full issue.
- `powermetrics` requires sudo on this host, so peak watts are recorded as `null`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No packet-blocking questions remain.

Follow-on questions:
- Is there a GGUF export/tokenizer path that reaches mean cosine >= 0.995 and min cosine >= 0.99 against `hf-local` q8?
- Should a future packet compare search-ranking overlap rather than embedding cosine alone?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- Parent packet: `../spec.md`
- Rejected predecessor: `../014-onnx-cross-platform-backend/decision-record.md`
- Model evidence: `scratch/model-info.json`
- Parity evidence: `scratch/parity-results.txt`
- Benchmark artifact: `scratch/bench-results.json`
<!-- /ANCHOR:related-docs -->
