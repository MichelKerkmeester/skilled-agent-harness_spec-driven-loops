---
title: "Phase 013: v4 Cleanup - Voyage Guard Timing, dtype Health Visibility, Doc Currency"
description: "Closed six v4 deep-review findings: early Voyage shadow guard in startup paths. dtype exposure in memory_health and provider options. Mutable Python list default fix. Doc-currency alignment for 012 state and Setup A filename examples."
trigger_phrases:
  - "013 v4 cleanup"
  - "voyage shadow guard timing"
  - "memory health dtype"
  - "hf-local dtype options"
  - "searchresult mutable default fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The v4 deep-review cycle surfaced one remaining startup path where the Voyage auto-shadow warning fired after provider resolution rather than before it, leaving a window where the wrong provider could silently activate. The health response had no visibility into the hf-local dtype. Programmatic callers had no way to pass dtype at construction time. The CocoIndex `SearchResult.rankingSignals` field used a bare mutable list default, a Python shared-state hazard. Documentation for the 012 state and Setup A q8 filename examples was stale.

Six findings were closed in a single commit. The startup guard in `getStartupEmbeddingProfile()` and `resolveStartupEmbeddingConfig()` now calls `warnIfVoyageWouldShadowLocal()` before `resolveProvider()`. `memory_health` now returns `data.embeddingProvider.dtype`. `CreateProviderOptions` and `HfLocalProvider.getMetadata()` now carry `dtype`. `SearchResult.rankingSignals` uses `msgspec.field(default_factory=list)`. The 012 docs, handover, SETUP_A_RECIPE file plus a stale tcpdump comment were aligned to the shipped 42aa114e3 state. The `.codex/config.toml` note patch was blocked by the sandbox TCC guard and was recorded in `scratch/codex-config-patch.md`.

### Added

- Early Voyage shadow guard call in `getStartupEmbeddingProfile()` before provider resolution (`factory.ts`)
- Early Voyage shadow guard call in `resolveStartupEmbeddingConfig()` and `validateApiKey()` before provider resolution (`factory.ts`)
- `dtype` field on `HfLocalProviderMetadata` and `HfLocalProvider.getMetadata()` output (`hf-local.ts`, `types.ts`)
- `dtype?: HfLocalDtype` option on `CreateProviderOptions` with pass-through to `HfLocalProvider` (`types.ts`, `factory.ts`)
- `data.embeddingProvider.dtype` field in the `memory_health` response (`memory-crud-health.ts`, `memory-crud-types.ts`)
- `scratch/codex-config-patch.md` recording the blocked `.codex/config.toml` note patch

### Changed

- `SearchResult.rankingSignals` default changed from bare mutable `[]` to `msgspec.field(default_factory=list)` (`protocol.py`)
- Setup A recipe q8 filename example aligned to runtime-derived slug `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`
- 012 implementation-summary, plan, spec plus tasks updated to reflect commit 42aa114e3 as shipped
- Parent handover updated to 13 packets shipped with 4 commits and post-013 terminal state
- tcpdump comment in `007/scratch/tcpdump-verify.sh` updated to reference EmbeddingGemma (removed stale Qwen3 text)

### Fixed

- Voyage auto-shadow warning fired after provider resolution in `getStartupEmbeddingProfile()`. Guard now runs before resolution, closing the late-guard gap.
- `memory_health` response omitted hf-local dtype. Now includes nullable `dtype` field for all embedding providers.
- Programmatic `createEmbeddingProvider()` callers could not specify dtype. `CreateProviderOptions.dtype` now passes through to the hf-local adapter.
- `SearchResult.rankingSignals` shared mutable list default across instances. Fixed with `default_factory=list`.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Shared build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| MCP server build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | PASS |
| Dist/source evidence | `rg "warnIfVoyageWouldShadowLocal\|dtype\|default_factory" ...` | PASS |
| Parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a --strict` | PASS - 0 errors / 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Early Voyage shadow guard added to three startup entry points. `dtype` option threaded through `createEmbeddingProvider()`. |
| `.opencode/skills/system-spec-kit/shared/types.ts` | `HfLocalDtype` type and `dtype` field added to provider metadata and options interfaces. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | `getMetadata()` returns dtype. Constructor accepts and stores dtype from options. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | `embeddingProvider` response object now includes nullable `dtype` field. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Response type updated to include `dtype` on the embedding provider shape. |
| `scratch/codex-config-patch.md` (NEW) | Records the blocked `.codex/config.toml` note-only patch for manual application. |

### Follow-Ups

- Apply the `.codex/config.toml` note patch from `scratch/codex-config-patch.md` manually when outside the sandbox TCC guard.
- GitHub PAT rotation remains a user-managed manual action outside the scope of this packet.
