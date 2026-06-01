# Changelog , , ,  001: Selector fix + shared socket + client resilience

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Swapped hf-local selector probe from Python sentence_transformers import to /api/health canLoad probe (restoring zero-install fallback)
- Deleted defaultPythonImportProbe, runPythonImportProbe seam, and execFile/promisify imports from auto-select.ts
- Pinned shared HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock across all 5 runtime configs (.claude/mcp.json, opencode.json, .gemini/settings.json, .codex/config.toml, .vscode/mcp.json)
- Hardened client: isRetryableReadinessError now retries ECONNRESET/EPIPE, waitForReady final throw branches on sawLoading flag for actionable messages
- Added bounded (2-attempt) embed-POST retry so mid-request reap retries against respawned server
- Updated INSTALL_GUIDE.md and embedder_architecture.md to replace Python/sentence-transformers selector docs with pure-Node /api/health model
- Added 4 regression tests for ECONNRESET/EPIPE readiness retry, embed-POST retry, and sawLoading timeout messages

## Why
The zero-install fallback was silently broken: probeHfLocal still gated hf-local selection on a Python import probe, but the post-029 server is pure-Node. Cross-launcher sharing was dormant: runtime configs pinned different per-service dirs with HF_EMBED_SERVER_URL unset. The client tripped its circuit breaker on transient ECONNRESET/EPIPE reaps and threw unhelpful readiness-timeout messages.

## Verification
- `tsc --build` @spec-kit/shared + @spec-kit/mcp-server: PASS (both)
- `vitest` embedder-auto-selection + hf-local-client + embeddings: PASS (38 passed / 8 skipped)
- JSON validity (.claude/mcp.json, opencode.json, .gemini/settings.json, .vscode/mcp.json) + TOML (.codex): PASS
- HF_EMBED_SERVER_URL pin count across 5 runtimes: 10 (2 services Ã— 5 configs)
- No Python-probe / execFile residue in auto-select.ts: Clean
- 4-lens opus adversarial review (find , †’ verify, 17 agents): 9 defects , , ,  3 P1 fixed, P2s documented/accepted
- `validate.sh --strict` on this phase folder: PASS
