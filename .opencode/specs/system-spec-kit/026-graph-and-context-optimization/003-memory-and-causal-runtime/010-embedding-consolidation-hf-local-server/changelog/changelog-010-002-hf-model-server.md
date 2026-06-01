

---
title: "Changelog: Build hf-model-server.cjs local HTTP model server [010-embedding-consolidation-hf-local-server/002-hf-model-server]"
description: "Chronological changelog for the Build hf-model-server.cjs local HTTP model server phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

A pure-Node CommonJS local HTTP and Unix domain socket embedding model server was built at .opencode/bin/hf-model-server.cjs. It wraps @huggingface/transformers and ports the existing HfLocalProvider.getModel() load logic with MPS to CPU device fallback, 120 second load timeout, and q8 dtype resolution. The server binds its listener before model load completes so GET /api/health returns loading state during cold start and ready state after. POST /api/embed awaits the in-flight load and returns embeddings with runtime-derived dimension. Default socket is at dbDir/hf-embed.sock with a tcp fallback. The server is not yet wired into any provider or launcher, phases 003 and 004 handle client integration and supervision.

### Added

- Pure-Node HTTP and Unix domain socket model server at .opencode/bin/hf-model-server.cjs with ollama-shaped /api/embed and /api/health endpoints.
- Loading state health endpoint that returns state:loading during cold start and state:ready after model load completes.
- Runtime dimension derivation from the first embedding vector length in POST /api/embed responses.
- Unix domain socket transport at dbDir/hf-embed.sock with mkdir 0o700 and unlink-before-listen, with tcp fallback.

### Changed

- Existing transformers load logic relocated into the server with no algorithm changes.
- Two minor non-defects addressed during adversarial review: self-warm failure no longer pins error state, and null or non-object embed body now returns 400 instead of 500.

### Fixed

- No fixes recorded.

### Verification

- node --check .opencode/bin/hf-model-server.cjs - PASS
- vitest run tests/embedders/hf-model-server.vitest.ts - PASS (7/7)
- npm run build --workspace=@spec-kit/mcp-server - PASS
- 4-lens opus adversarial review covering load-port fidelity, readiness, transport dimension, and test scope - PASS, 0 confirmed defects, 2 minor non-defects fixed
- validate.sh --strict on this packet - PASS
- Live model load and RSS check - DEFERRED to phase 004 when server is wired into supervision

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | Create | Pure-Node HTTP/UDS model server with /api/embed and /api/health, ported load logic, runtime dim derivation, prefix-agnostic design, injectable for tests via require.main guard |
| `mcp_server/tests/embedders/hf-model-server.vitest.ts` | Create | 7 headless tests covering require safety, listen target resolution, loading-then-ready health, mid-load embed await with runtime dim, single-session dispose assertion, self-warm failure handling, null-body error handling |

### Follow-Ups

- Server is standalone and not yet wired into any provider or launcher, phase 003 adds the HTTP client and phase 004 adds launcher supervision.
- Live model load not exercised, tests use mock load with no real 274MB model or 15-30s cold start, live verification deferred to phase 004 supervision.
- Single-resident-model constraint means requests for a different model than loaded return 404, multi-model residency is out of scope by design.
