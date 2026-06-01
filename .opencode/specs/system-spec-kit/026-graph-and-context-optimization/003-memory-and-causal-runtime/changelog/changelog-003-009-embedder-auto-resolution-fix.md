---
title: "Embedder Auto-Resolution Fix: node:sqlite Metadata Read"
description: "factory.ts no longer shells out to a sqlite3 binary to read active-embedder metadata. The fix replaced the subprocess probe with a guarded in-process node:sqlite read. Provider and shard-path resolution was generalized. The interim EMBEDDINGS_PROVIDER=ollama pin was reverted to auto."
trigger_phrases:
  - "embedder auto resolution fix"
  - "node sqlite factory metadata read"
  - "revert embeddings provider pin"
  - "sqlite3 shell-out replacement"
  - "factory auto resolution vitest"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/009-embedder-auto-resolution-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

Phase 008 proved that `EMBEDDINGS_PROVIDER=auto` silently degraded to the unhealthy `hf-local` fallback because `factory.ts` resolved active-embedder metadata by shelling out to a bare `sqlite3` binary, which returned null whenever the binary was absent from the daemon's restricted PATH. This phase replaced that shell-out with a guarded in-process `node:sqlite` (`DatabaseSync`, read-only) read, generalizing provider and shard-path resolution so the path is built from `active_embedder_provider`, model name and dimension rather than a hardcoded ollama pattern. The interim `EMBEDDINGS_PROVIDER=ollama` config pin was reverted to `auto` after a full verification pass confirmed that the live daemon resolves `ollama` correctly with no subprocess dependency remaining.

### Added

- Guarded `node:sqlite` readonly reader helper in `shared/embeddings/factory.ts` replacing the `execFileSync` shell-out path
- Regression test `factory-auto-resolution.vitest.ts` that builds a temp DB, clears PATH then asserts `resolveProvider()` returns `ollama`
- Warn-once behavior on metadata probe failure so errors surface rather than silently returning null

### Changed

- `querySqliteScalar` and related metadata helpers in `factory.ts` now route through the in-process `node:sqlite` reader
- Provider and shard-path resolution generalized to read `active_embedder_provider` from `vec_metadata` with a default of `ollama` for back-compat
- Orphaned `execFileSync` and `child_process` import removed from `factory.ts`
- `EMBEDDINGS_PROVIDER` reverted from `ollama` to `auto` in `.claude/mcp.json` and `opencode.json` after verification

### Fixed

- `EMBEDDINGS_PROVIDER=auto` silently fell through to `hf-local` when `sqlite3` was absent from the restricted MCP daemon PATH. The in-process read eliminates the PATH dependency entirely.

### Verification

| Test | Status | Evidence |
|------|--------|----------|
| Typecheck (`npm run build`, shared + mcp_server) | Pass | Both builds exit 0 |
| Regression test (`factory-auto-resolution.vitest.ts`) | Pass | 1 of 1 passed with `PATH=''` |
| Sibling embedder suites (reconcile + vector-coverage-hygiene) | Pass | 16 of 16 passed |
| Integration (`/tmp/verify-009-s6.mjs`, restricted PATH, live DB) | Pass | `resolveProvider()` returned `ollama / nomic-embed-text-v1.5 / 768` |
| Strict packet validate (`validate.sh --strict`) | Pass | Exit 0, zero errors, zero warnings |
| Live reconnect with `EMBEDDINGS_PROVIDER=auto` | Pass | Daemon pid 14399 reported `embeddingProvider: ollama / nomic-embed-text-v1.5 / 768, healthy:true` with failed=0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Subprocess shell-out replaced with `node:sqlite` `DatabaseSync` read. Parameterized probes, warn-once on failure, generic provider and shard resolution, dropped `execFileSync` import. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/factory-auto-resolution.vitest.ts` (NEW) | Create | Regression test: builds temp DB, sets `PATH=''`, asserts `resolveProvider()` returns `ollama`. |
| `.claude/mcp.json` | Modify | `EMBEDDINGS_PROVIDER` reverted from `ollama` to `auto`. |
| `opencode.json` | Modify | `EMBEDDINGS_PROVIDER` reverted from `ollama` to `auto`. |

### Follow-Ups

- Hosts running Node below 22.5 degrade to the cascade graceful null rather than the active pointer. Document the Node version floor prominently if the skill is deployed on older runtimes.
- The `node:sqlite` experimental warning is emitted by the runtime on each startup. Suppress it via `--no-warnings=ExperimentalWarning` or a process flag if the noise becomes a problem.
- Manifest validation in `readActiveOllamaEmbedderFromDb` still calls `getOllamaManifest`. The generic shard path is forward-looking. Extend manifest validation to non-ollama providers in a follow-on packet.
