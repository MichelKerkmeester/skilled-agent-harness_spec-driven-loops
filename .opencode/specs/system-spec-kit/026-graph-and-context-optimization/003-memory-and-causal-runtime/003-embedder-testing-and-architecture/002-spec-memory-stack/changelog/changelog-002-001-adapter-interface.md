---
title: "016/001: EmbedderAdapter Interface and EmbedderRegistry"
description: "Foundational TypeScript types for the pluggable embedder architecture: EmbedderAdapter interface, EmbedderManifest types, EmbedderRegistry with 6 skeleton manifests and a vitest registry battery."
trigger_phrases:
  - "embedder adapter interface"
  - "EmbedderRegistry 016/001"
  - "pluggable embedder types"
  - "BackendKind EmbedderManifest"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The mk-spec-memory MCP server had no abstraction over its embedding backend. Every call site referenced the Ollama HTTP endpoint directly, making it impossible to swap or test alternative models without touching scattered search code. Phase 016/001 defined the foundational contract: an `EmbedderAdapter` TypeScript interface with four manifest properties and two methods, a `BackendKind` union covering four backend families and an `EmbedderRegistry` holding six frozen manifests covering the initial candidate model set. No runtime wiring shipped in this phase, keeping the deliverable to pure types that downstream phases can implement against without breaking changes. A 10-test vitest battery locked the registry lookup contract from day one.

### Added

- `adapter.ts` with the `EmbedderAdapter` interface: `name`, `dim`, `backend`, optional `prefixQuery` and `prefixDocument`, `embed()` and `ready()` (55 LOC at delivery)
- `types.ts` with `BackendKind` union (`ollama`, `llama-cpp`, `api`, `sentence-transformers`) and `EmbedderManifest` shape (60 LOC at delivery)
- `registry.ts` with `getManifest()`, `listManifests()` and `listSupportedDimensions()` backed by a `Object.freeze`-locked array of 6 manifests (95 LOC at delivery)
- `index.ts` barrel re-exporting the public surface (12 LOC at delivery)
- `tests/embedder-registry.vitest.ts` with 10 cases covering hit, miss, dimension listing and manifest shape (90 LOC at delivery)

### Changed

- None.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/embedder-registry.vitest.ts` | 10 of 10 pass |
| `npx tsc --noEmit` | Clean |
| `npm run build` | Clean |
| strict-validate 016/001 packet | exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` (NEW) | Created | `EmbedderAdapter` interface with TSDoc, 55 LOC |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` (NEW) | Created | `BackendKind` union and `EmbedderManifest` type, 60 LOC |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` (NEW) | Created | Frozen manifest array and three registry query functions, 95 LOC |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` (NEW) | Created | Barrel export for public adapter surface, 12 LOC |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-registry.vitest.ts` (NEW) | Created | 10-case registry vitest battery, 90 LOC |

### Follow-Ups

- Implement the concrete Ollama adapter against the `EmbedderAdapter` interface in phase 016/002.
- Extend the registry with dimension-tagged vector schema selection once phase 016/002 ships.
- Backfill `implementation-summary.md` with actual shipped state to retire the pre-execution stub.
