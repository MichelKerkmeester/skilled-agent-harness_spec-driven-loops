# Changelog , , ,  002: Build hf-model-server.cjs local HTTP model server

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Created `.opencode/bin/hf-model-server.cjs` , , ,  a pure-Node CommonJS local HTTP/UDS embedding model server (~770 LOC)
- Server dynamic-imports @huggingface/transformers and ports the HfLocalProvider.getModel() load logic verbatim
- Binds listener BEFORE model load resolves: GET /api/health answers {state:'loading'} during cold start, 'ready' after
- POST /api/embed {model,input} awaits in-flight load mid-request then returns {embeddings,dim} with runtime-derived dim
- Default UDS at <dbDir>/hf-embed.sock (mkdir 0o700, unlink-before-listen) with tcp:// fallback
- Server is prefix-agnostic (clients own PREFIX_REGISTRY)
- Created `mcp_server/tests/embedders/hf-model-server.vitest.ts` with 7 headless tests

## Why
hf-local currently owns transformers model loading inside provider/sidecar execution paths. The next architecture needs a single local service that binds before model load completes, reports readiness during cold start, and centralizes the existing MPS-to-CPU fallback, load timeout, dtype resolution, single-flight loading, and dispose-drain assertions.

## Verification
- `node --check .opencode/bin/hf-model-server.cjs`: PASS
- `vitest run tests/embedders/hf-model-server.vitest.ts`: PASS (7/7)
- `npm run build --workspace=@spec-kit/mcp-server` (tsc unaffected by the new .cjs): PASS
- 4-lens opus adversarial review (load-port / readiness / transport-dim / test-scope): PASS , , ,  0 confirmed defects, load-port faithful, 2 minor non-defects fixed
- `validate.sh --strict` on this packet: PASS
