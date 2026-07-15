---
title: "Embedder selector fix, shared socket pinning, and client resilience hardening"
description: "The hf-local embedder selector required a local Python installation with sentence_transformers, breaking the zero-install fallback on Node-only machines. The probe was swapped to a pure HTTP health check, a shared Unix socket was pinned across all five runtime configs, and the client was hardened against transient connection resets."
trigger_phrases:
  - "hf-local selector probe fix"
  - "shared HF_EMBED_SERVER_URL socket"
  - "ECONNRESET EPIPE readiness retry"
  - "embedder auto-select health probe"
  - "cross-launcher shared embedding socket"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

The hf-local embedder selector required a local Python installation with `sentence_transformers`, which broke the zero-install fallback on Node-only machines. The probe was swapped to a pure HTTP health check via `HfLocalProvider.canLoad`, the stale Python import probe and its seam were deleted, and a shared Unix socket was pinned across all five runtime configs so both launchers converge on one resident server. The client was hardened to retry `ECONNRESET` and `EPIPE` on readiness checks and to retry embed POST requests up to twice so a mid-request server reap recovers against the respawned daemon instead of tripping the circuit breaker.

### Added
- `probeHfLocalServer` seam and `HfLocalServerAvailability` type for transport-injected health probing in the auto-select module
- Regression tests for `ECONNRESET`/`EPIPE` readiness retry, embed-POST retry, loading timeout message, and unreachable timeout message

### Changed
- The hf-local selector probe now calls `HfLocalProvider.canLoad` via `/api/health` instead of a Python `sentence_transformers` import subprocess, restoring the zero-install fallback on Node-only machines
- The Python import probe, its seam, and the underlying `execFile`/`promisify` imports deleted from the auto-select module
- `HF_EMBED_SERVER_URL` pinned to a shared Unix socket in the `mk-spec-memory` and `mk_skill_advisor` env blocks of all five runtime configs
- `waitForReady` timeout message branches on whether the server was ever observed loading, producing an actionable diagnosis instead of a generic error
- Documentation updated to describe the pure-Node `/api/health` selection model and first-embed download behavior

### Fixed
- `ECONNRESET` and `EPIPE` are now retryable during readiness checks instead of immediately tripping the circuit breaker
- Embed POST requests bounded to two retry attempts so a mid-request server reap recovers against the respawned daemon

### Verification
- `tsc --build` @spec-kit/shared + @spec-kit/mcp-server: PASS (both)
- `vitest` embedder-auto-selection + hf-local-client + embeddings: PASS (38 passed)
- JSON validity across `.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.vscode/mcp.json` and TOML validity for `.codex/config.toml`: PASS
- `HF_EMBED_SERVER_URL` pin count across five runtimes: 10 (2 services x 5 configs)
- No Python-probe or `execFile` residue in `auto-select.ts`: confirmed clean
- Four-lens adversarial review via 17 agents: 9 defects found, 3 P1s fixed, P2s documented and accepted, re-verified green
- `validate.sh --strict` on this phase folder: PASS
- Live Node-only selection and cross-launcher shared resident: DEFERRED to phase 005 (requires running daemons)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `shared/embeddings/auto-select.ts` | Modified | probeHfLocal swapped to /api/health via canLoad, Python probe and seam deleted, execFile/promisify imports removed, new probeHfLocalServer seam and HfLocalServerAvailability type added |
| `shared/embeddings/providers/hf-local.ts` | Modified | ECONNRESET/EPIPE added to retryable errors, sawLoading-branched readiness timeout message, bounded two-attempt embed-POST retry |
| `.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`, `.vscode/mcp.json` | Modified | Shared HF_EMBED_SERVER_URL pinned in both service env blocks across all five runtimes, stale _NOTE_3_PROVIDERS fixed |
| `INSTALL_GUIDE.md`, `references/memory/embedder_architecture.md` | Modified | Python/sentence_transformers selector docs replaced with pure-Node /api/health model, first-embed download documented |
| `tests/embedder-auto-selection.vitest.ts` | Modified | runPythonImportProbe injections migrated to probeHfLocalServer |
| `tests/embedders/hf-local-client.vitest.ts` | Modified | Four new tests added for ECONNRESET/EPIPE readiness retry, embed-POST retry, sawLoading timeout message, and unreachable timeout message |

### Follow-Ups
- Reset-retry latency tradeoff (accepted): treating `ECONNRESET`/`EPIPE` as retryable means a permanently resetting server may consume the full `HF_EMBED_SERVER_READY_TIMEOUT_MS` (default 45s) per attempt before failing. The embed-POST retry is bounded at two attempts to cap worst-case latency. Documented in the spec risk table.
- Cascade-probe-timeout divergence (documented): spec-memory probes the shared socket at 5000ms while skill-advisor uses 2500ms. Marginal impact since a local `/api/health` GET completes in under 50ms. `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` aligns both. Threading an explicit shared timeout into the skill-advisor package is deferred.
- Live selection not exercised end-to-end: the probe swap and five-runtime convergence are covered by unit tests with injected transports. A live Node-only daemon selecting hf-local with two launchers sharing one resident server is verified in phase 005.
