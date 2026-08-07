---
title: "Byte-Aware Health Telemetry"
description: "Byte-aware V8 and cache memory attribution added to context-server health reporting. Operators can request a full memory breakdown via includeFullReport. Heap snapshots and old-space caps are gated behind explicit opt-in env vars."
trigger_phrases:
  - "byte-aware health telemetry"
  - "heap profiler implementation"
  - "memory_health includeFullReport"
  - "context server old space cap"
  - "heap snapshot opt-in"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The `memory_health` tool collapsed all retained memory into RSS, making it impossible to attribute pressure to V8 heap, external allocations or ArrayBuffers. Without byte-aware telemetry, future memory reduction work could not verify what was retained versus resident in native or SQLite pages.

A new `heap-profiler.ts` module exposes process and V8 memory snapshots plus an opt-in heap snapshot writer and per-cache byte estimates. The `memory_health` handler accepts `includeFullReport: true` to add the full telemetry payload while keeping default responses compact and backward compatible. The launcher gained support for `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` to allow an explicit old-space ceiling on the context-server child process. A six-test Vitest suite covers the profiler and health payload compatibility.

### Added

- `heap-profiler.ts` exposing `getDetailedMemorySnapshot()` with seven fields (RSS, heap used, heap total, external, ArrayBuffers, V8 malloc, estimated total) plus `writeHeapSnapshot()` with opt-in path guard and private file permissions plus `getCacheByteEstimates()`
- Tool cache byte estimate helper in `tool-cache.ts`
- Trigger matcher regex and cache byte estimate helper in `trigger-matcher.ts`
- `includeFullReport` schema field in `tool-schemas.ts` for the `memory_health` tool
- Vitest suite `heap-profiler.vitest.ts` covering profiler snapshot shape and health payload gating (1 file, 6 tests)

### Changed

- `memory-crud-health.ts` extended to gate the full telemetry payload and `recommended_action` behind `includeFullReport: true`
- `mk-spec-memory-launcher.cjs` wired to read `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` and pass `--max-old-space-size=<mb>` only to the spawned context-server child
- `embedder_architecture.md` updated with memory diagnostics guidance and snapshot sensitivity notes
- `ENV_REFERENCE.md` updated with `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` and `SPECKIT_HEAP_SNAPSHOT_DIR` entries

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <008> --strict` | PASS |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run heap-profiler` | PASS, 1 file / 6 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Live import probe for `getDetailedMemorySnapshot()` | PASS, all seven fields present. Sample: `rss_mb=68.86`, `heap_used_mb=15.49`, `heap_total_mb=20.59` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts` | Created (NEW) | Process and V8 memory snapshot, heap snapshot writer with opt-in guard, cache byte estimates |
| `.opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts` | Created (NEW) | Profiler snapshot shape and health payload gating tests |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Gated full telemetry payload and recommended action behind `includeFullReport` |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Added `includeFullReport` schema field |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts` | Modified | Added tool cache byte estimate helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | Modified | Added trigger regex and cache byte estimate helper |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Optional old-space cap passed to context-server child only |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Memory diagnostics guidance and snapshot sensitivity notes |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | New env var entries for old-space cap and heap snapshot dir |

### Follow-Ups

- Byte estimates are approximate. They are intended to compare retained-cache trends, not replace V8 retained-size analysis from a heap snapshot.
- Heap snapshots require operator opt-in. Set `SPECKIT_HEAP_SNAPSHOT_DIR` before launching the daemon when an investigation needs snapshot artifacts.
