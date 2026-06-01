---
title: "Embedding stack observability, safe model-switch and cold-start timeout"
description: "Shipped a read-only embeddings observability surface, a safe model-switch path with dimension drift warning, and a two-tier cold-start timeout that keeps retrying while the server reports loading."
trigger_phrases:
  - "embedding stack observability"
  - "safe model switch embeddings"
  - "cold-start timeout embeddings"
  - "doctor embeddings route"
  - "dimension drift warning"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

The embedding stack lacked an operator-visible diagnostics surface and would dead-reckon on model-switch correctness. Cold starts with a first-embed model download were falsely declared failed because the client timeout did not distinguish an unreachable server from one that was reporting loading. Three features were shipped on top of the selector, shared socket, client resilience, server liveness and supervision foundations from prior phases.

### Added

- A read-only embeddings observability surface via the `/doctor embeddings` route, reporting provider resolution, model metadata and health state with no restart or kill operations.
- An embeddings doctor workflow definition (`doctor_embeddings.yaml`) that surfaces the embedder status payload for operator diagnostics.

### Changed

- The embedder status handler now reports the resolved embedding provider, effective model, server state, load timing and dimension information, degrading gracefully when provider info cannot be collected.
- The `HF_EMBEDDINGS_MODEL` environment variable is now in the advisor launcher allowlist so the two launchers cannot structurally disagree on the model.
- The huggingface local provider surfaces the server-loaded model name on 404 errors and warns on dimension drift against the persisted active embedder, checked at both create-time and first-embed.
- The client wait-for-ready uses a two-tier timeout: it fails fast at 45 seconds while the server is unreachable but extends to 150 seconds when the server reports loading, keeping the actionable message from the prior phase.

### Fixed

- A dimension drift check that only ran at create-time, before the server reported dimensions for a custom model, now also fires at first-embed through an injected callback.
- A misconfigured `EMBEDDINGS_PROVIDER` value no longer crashes the entire `embedder_status` call and instead degrades to a reported error in the status payload.
- The cold-start deadline no longer declares a healthy but downloading server dead by using separate timeouts for the unreachable and loading states.

### Verification

- `tsc` (`@spec-kit/shared` plus `@spec-kit/mcp-server`), PASS
- `node --check` (`hf-model-server.cjs`, `mk-skill-advisor-launcher.cjs`), PASS
- Embedder vitest suites (status, hf-local-client, auto-selection, embeddings), PASS, 45 passed and 8 skipped
- 4-lens adversarial review, 8 raised, 7 confirmed (1 P1 plus 3 P2 dedup), all fixed and 1 refuted
- `validate.sh --strict` on this packet, PASS, 0 errors
- Tasks complete, 14 completed task items recorded

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/handlers/embedder-status.ts` | Modified | Extended with model-server state and provider info, graceful degrade on error |
| `shared/embeddings/providers/hf-local.ts` | Modified | 404 loaded model surfacing, on-dimension-resolved hook, two-tier wait-for-ready and get-metadata server-state fields |
| `shared/embeddings/factory.ts` | Modified | Dimension drift reporting at create-time and first-embed callback |
| `shared/types.ts` | Modified | ProviderMetadata optional server-state, load-started-at and load-progress-at fields |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | HF_EMBEDDINGS_MODEL added to child environment allowlist |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Read-only embeddings route registered |
| `.opencode/commands/doctor/assets/doctor_embeddings.yaml` | Added | Read-only embeddings doctor workflow definition |
| `.opencode/commands/doctor/speckit.md` | Modified | Router manifest tables and menu renumbering for new embeddings route |
| `mcp_server/ENV_REFERENCE.md` | Modified | First-embed download docs, health states and new environment variable |
| `mcp_server/INSTALL_GUIDE.md` | Modified | First-embed download docs, health states and new environment variable |
| `mcp_server/tests/embedder-status.vitest.ts` | Modified | Status payload, degrade-on-throw and model-state test coverage |
| `mcp_server/tests/embedders/hf-local-client.vitest.ts` | Modified | 404 surfacing, cold-start retry and dimension drift hook test coverage |

### Follow-Ups

- Live model-server probe deferred to phases 004 and 005. The `embedder_status` handler was verified against mocked transports and an end-to-end live two-launcher probe lands in phase 005.
- The dimension drift warning relies on the database-layer dimension constraint as the hard backstop. The warning is diagnostic. The vector store still rejects a dimension-mismatched insert, so the warning improves the error message rather than being the sole guard.
