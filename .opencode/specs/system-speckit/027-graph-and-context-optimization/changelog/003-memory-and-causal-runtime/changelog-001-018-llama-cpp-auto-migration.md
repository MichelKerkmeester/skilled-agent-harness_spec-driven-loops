---
title: "Local Embeddings Foundation 018: llama-cpp auto-migration"
description: "Memory MCP startup upgraded from warn-only to synchronous auto-migrate then validate then delete when switching from hf-local to llama-cpp. Five Vitest scenarios cover all branch paths. This packet is superseded by the Ollama to hf-local Nomic cascade work."
trigger_phrases:
  - "llama-cpp auto-migration"
  - "MEMORY_AUTO_MIGRATE_HF_TO_LLAMA"
  - "runAutoMigrationIfNeeded"
  - "hf-local to llama-cpp startup migration"
  - "018 auto-migration changelog"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Memory MCP startup previously only warned when a populated hf-local sqlite existed while the active profile pointed at the llama-cpp store. That left operators with a manual migration step and a stale source sqlite that was rediscovered on every restart.

The migration gate was upgraded to run synchronously during startup before database initialization. When the active resolved provider is llama-cpp, the gate detects the largest populated hf-local sqlite, checks whether the llama-cpp target is already current, invokes the refactored `runMigration()` runner when needed, validates row count and sample mismatch status, deletes the source sqlite plus `-shm` and `-wal` companions on success then writes `.auto-migration-complete.json`. On failure the source is preserved and the current process switches to `hf-local` before initialization. An opt-out env var (`MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false`) restores the pre-018 warning text.

Live smoke during this dispatch found the 2488-row llama-cpp target already current, so no destructive deletion occurred. A temp-sqlite fixture smoke exercised the full success path including deletion and marker writing. All five Vitest branch scenarios passed.

This packet is superseded. The live local-first path is now Ollama to hf-local Nomic. Do not treat this packet as current implementation guidance.

### Added

- `runAutoMigrationIfNeeded()` exported from `shared/embeddings/factory.ts` replacing the warn-only `warnIfMigrationPending()` call
- `runMigration()` and status/result types exported from `scripts/migrate-embeddings-to-llama-cpp.ts` with a no-op path for already-migrated targets
- `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` opt-out with exact pre-018 warning text preserved
- Five targeted Vitest scenarios in `mcp_server/tests/embeddings-auto-migration.vitest.ts` (NEW) covering no-source skip, opt-out, success/delete, validation failure/fallback and already-migrated no-op
- `.auto-migration-complete.json` marker written on successful destructive migration

### Changed

- `scripts/migrate-embeddings-to-llama-cpp.ts` refactored to export `runMigration()` with configurable logger and a no-op path when target rows already meet source count
- `shared/embeddings/factory.ts` replaced warn-only logic with the auto-migration detection, opt-out, deletion, marker write and fallback envelope
- `mcp_server/context-server.ts` wired to await auto-migration before `vectorIndex.initializeDb()` and switch to `hf-local` on failure
- `.env.example` and runtime config notes updated to document destructive migration and the opt-out flag
- `mcp_server/README.md` extended with a migration section

### Fixed

- Startup warned but did not migrate when hf-local sqlite existed and llama-cpp was active. Automated gate now handles this without operator intervention.
- Stale source sqlite was rediscovered on every restart because deletion only happened manually. Success path now deletes source plus companions atomically.
- Package-root detection could resolve to `shared/mcp_server/database` instead of the real Memory MCP database directory. Root-marker detection corrected this.

### Verification

| Check | Result |
|-------|--------|
| T001 sanity: ESM import ok, GGUF file present | PASS |
| Targeted Vitest: 5 scenarios | 5 passed |
| Shared build | exit 0 |
| Scripts build | exit 0 |
| MCP build | exit 0 |
| Packet strict validation | exit 0 |
| Fixture migration smoke: 5 source rows to 5 target rows, 0 mismatches | PASS |
| Live startup probe: 2488-row target already current | SKIP (already migrated) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` | Exported `runMigration()`, status union, configurable logger, no-op path for already-migrated targets (removed in 016/002/007 when llama-cpp surface was purged) |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Auto-migration detection, opt-out, deletion, marker write and fallback envelope replacing warn-only logic |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Awaits migration before DB initialization. Switches to `hf-local` on failure. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts` (NEW) | Five scenario Vitest coverage for startup auto-migration (removed in 016/002/007) |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Added migration section with destructive behavior and opt-out documentation |

### Follow-Ups

- The success test injects a fixture migration runner instead of running llama-cpp inference to keep the destructive path deterministic and fast. A live integration test remains unexercised.
- The implementation contract referenced `mcp_server/src/context-server.ts`. The actual repo source is `mcp_server/context-server.ts`. Future spec authors should verify entrypoint paths before authoring.
- This packet is superseded by the Ollama to hf-local Nomic cascade work. The auto-migration contract should be evaluated against the new default provider path if a similar gate is ever needed.
