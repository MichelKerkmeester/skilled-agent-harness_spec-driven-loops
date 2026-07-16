---
title: "Implementation Summary: Rewrite hf-local as an HTTP model-server client"
description: "Implemented. hf-local rewritten from in-process transformers to an ollama-shaped HTTP client against the 002 model server, keeping the IEmbeddingProvider surface, client-side prefixes, two-layer readiness, and server-adopted dim. Headless-verified (tsc + 86 embedding vitest) and adversarially reviewed."
trigger_phrases:
  - "hf-local HTTP client rewrite implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote hf-local as HTTP client against 002 server; surface stable; 86 vitest green"
    next_safe_action: "Phase 004: launcher supervision (launchModelServer + watchdog + probeModelServer)"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000593"
      session_id: "029-003-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hf-local-http-client |
| **Completed** | 2026-05-29 (implemented + headless-verified; wired live to the 002 server in phase 004) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`hf-local.ts` was rewritten from an in-process `@huggingface/transformers` provider into an **ollama-shaped HTTP client** against the Phase-002 model server. It no longer imports transformers or loads a model in-process (SC-001). The public `IEmbeddingProvider` surface is unchanged (embedDocument/embedQuery/generateEmbedding/warmup/healthCheck/getMetadata/getProfile/canLoad), so factory + all importers compile untouched; `dispose()` is now a client no-op (the server owns the model). The nomic `search_query:`/`search_document:` prefixes stay client-side (`PREFIX_REGISTRY`/`getPrefixFor`) and are applied once before POST `/api/embed`. Two-layer readiness retries ECONNREFUSED/ENOENT/503-loading up to `HF_EMBED_SERVER_READY_TIMEOUT_MS` (~45s) — bounded, then gives up cleanly — while `EMBEDDING_TIMEOUT` applies only to a post-ready request. The dim is adopted from the server (`/api/health` or embed response); a 404 maps to the ollama-style model-missing cascade. A provisional default dim (768 for nomic) seeds `getMetadata().dim` before the server is reached (server adoption overrides) so the metadata contract holds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/embeddings/providers/hf-local.ts` | Modify | Rewrite as an ollama-shaped HTTP/socket client (readiness retry, server-adopted dim, client prefixes, dispose no-op, provisional default-dim seed) |
| `mcp_server/tests/embedders/hf-local-client.vitest.ts` | Create | Client tests: prefix-before-POST, readiness retry, dim adoption, 404 cascade, canLoad health probe |
| `mcp_server/tests/embeddings.vitest.ts` | Modify | Updated to the HTTP-client provider |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Modify | Removed the obsolete in-process HfLocalProvider.dispose tests (server owns dispose now) |
| `mcp_server/tests/local-llm-features/health-reporting.vitest.ts` | Modify | T2 rewritten to probe server health; T1/T3 pass via the provisional default-dim seed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-codex` dispatch (`gpt-5.5`, xhigh reasoning, fast tier, `--sandbox workspace-write`) fenced to hf-local.ts + the client tests (ollama.ts/factory.ts/launcher/sidecar reference-only). Independent verification (tsc builds + vitest) + a 4-lens opus adversarial review confirmed the rewrite functionally correct (prefixes/readiness/dim/404/transport) and the surface stable, and caught that 5 stale tests still asserted the removed in-process semantics + a P1 dim-contract change (default getMetadata().dim went 768→0). The orchestrator fixed those: a provisional default-dim seed restores the 768 contract (server adoption overrides), the obsolete in-process dispose tests were retired, and health-reporting T2 was rewritten to probe server health. Final: 86 embedding tests pass / 0 fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep implementation status pending | This pass is spec authoring only; implementation must occur in a later scoped session |
| Preserve Level-1 anchors and phase headers from the reference packet | The validator enforces template shape and anchor consistency |
| Include concrete verification command tokens | Future implementers need runnable checks, and implementation-summary verification must not be vague |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/shared` + `@spec-kit/mcp-server` (tsc; factory/importers compile unchanged) | PASS (exit 0) |
| `vitest run` 11 embedding/embedder/prefix/health/client files | PASS (86 passed / 8 skipped / 0 failed) |
| SC-001: no `@huggingface/transformers`/`pipeline(` in hf-local.ts | PASS (pure HTTP client) |
| 4-lens opus adversarial review (surface / prefixes / readiness / dim-404-transport) | PASS functional — 5 stale tests + 1 P1 dim-contract issue found + fixed |
| `validate.sh --strict` on this packet | PASS |
| SC: live embed against a running server | DEFERRED — wired live in phase 004 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not wired to a live server yet** — phase 004 makes the launcher spawn/supervise the 002 server; until then hf-local's HTTP calls have no server to reach at runtime (verified headlessly via injected transport).
2. **Provisional default dim (768)** is a startup convenience for the canonical nomic model; the server-reported dim is the runtime authority (adopted on first health/embed).
3. **Live embed not exercised** — the readiness retry, 404 cascade, and dim adoption are covered by mocked-transport tests; a live round-trip is the phase-004 follow-up.
<!-- /ANCHOR:limitations -->

