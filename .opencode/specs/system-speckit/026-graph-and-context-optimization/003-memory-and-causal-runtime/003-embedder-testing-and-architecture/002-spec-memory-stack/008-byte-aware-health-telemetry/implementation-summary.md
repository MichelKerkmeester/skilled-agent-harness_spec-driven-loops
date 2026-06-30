---
title: "Implementation Summary: Byte-Aware Health Telemetry"
description: "Context-server health can now report byte-aware V8 and cache memory attribution on demand, with heap snapshots and old-space caps kept behind explicit operator opt-ins."
trigger_phrases:
  - "byte-aware telemetry summary"
  - "heap profiler implementation summary"
  - "memory diagnostics commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry"
    last_updated_at: "2026-05-18T21:10:00Z"
    last_updated_by: "codex"
    recent_action: "Verified byte-aware telemetry packet"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0160020083333333333333333333333333333333333333333333333333333333"
      session_id: "phase-016-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry` |
| **Completed** | 2026-05-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Context-server can now explain its memory shape instead of collapsing everything into RSS. Operators can request a full `memory_health` report for V8 heap, external memory, ArrayBuffers, V8 malloc counters, cache byte estimates, and a threshold-based next action while default health responses stay compact.

### Heap Profiler

`heap-profiler.ts` exposes `getDetailedMemorySnapshot()`, `writeHeapSnapshot(reason)`, and `getCacheByteEstimates()`. Heap snapshots are refused unless `SPECKIT_HEAP_SNAPSHOT_DIR` is set, and snapshot directories/files are forced to private `0700`/`0600` permissions.

### Health Telemetry

`memory_health` accepts `includeFullReport`. When false or omitted, the response omits every new telemetry field. When true, it adds `memory_snapshot`, `cache_byte_estimates`, and `recommended_action`.

### Launcher Cap

`mk-spec-memory-launcher.cjs` reads `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` and passes `--max-old-space-size=<mb>` only to the spawned context-server child. Invalid values are ignored with a launcher log line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts` | Created | Process/V8 memory snapshot, heap snapshot writer, cache byte estimates |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Gated full memory report and recommended action |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | `includeFullReport` schema |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts` | Modified | Tool cache byte estimate helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | Modified | Trigger regex/cache byte estimate helper |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Optional context-server old-space cap |
| `.opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts` | Created | Profiler and health payload tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Memory diagnostics docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | New env var reference |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry/` | Created | Level 1 packet docs and metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The implementation keeps measurement code isolated in a telemetry module, adds cache estimates at the cache owners, and composes the extended health payload only when the caller opts in.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Gate new health fields behind `includeFullReport` | Existing callers keep the same default payload and token footprint |
| Keep snapshots outside default health execution | Heap snapshots pause the process and can contain sensitive memory |
| Apply old-space caps only in the child process | A broad `NODE_OPTIONS` cap would affect launcher/bootstrap/npm subprocesses |
| Estimate bytes in cache modules | Cache owners know retained shapes better than the health handler |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <008> --strict` | PASS |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run heap-profiler` | PASS, 1 file / 6 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Live import probe for `getDetailedMemorySnapshot()` | PASS, all seven fields present; sample `rss_mb=68.86`, `heap_used_mb=15.49`, `heap_total_mb=20.59` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **Byte estimates are approximate.** They are intended to compare retained-cache trends, not replace V8 retained-size analysis from a heap snapshot.
2. **Heap snapshots require operator opt-in.** Set `SPECKIT_HEAP_SNAPSHOT_DIR` before launching the daemon when an investigation needs snapshot artifacts.

## Commit Handoff

Codex sandbox blocks direct `.git/index.lock` writes in some sessions, so stage these exact paths from a normal shell:

```bash
git add \
  .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts \
  .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts \
  .opencode/bin/mk-spec-memory-launcher.cjs \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry/

git add -f \
  .opencode/skills/system-spec-kit/mcp_server/dist/

git commit -m "feat(016/002/008): byte-aware health telemetry + heap snapshot opt-in"
```
<!-- /ANCHOR:limitations -->
