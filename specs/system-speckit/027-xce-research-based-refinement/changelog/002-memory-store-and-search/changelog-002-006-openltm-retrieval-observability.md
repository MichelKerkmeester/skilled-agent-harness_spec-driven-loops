---
title: "OpenLTM Retrieval Observability: Additive Opt-In Diagnostics for Ranking, Conflicts, and Maintenance"
description: "Memory retrieval exposes why_ranked from the actual ranker, inline contradiction and supersession warnings, degraded-vector state, and last-run maintenance counters — all behind existing opt-ins with no ranking, schema, or write-path change."
trigger_phrases:
  - "002/006 openltm retrieval observability changelog"
  - "why_ranked opt-in shipped"
  - "retrieval diagnostics additive"
  - "027 002/006 shipped"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/006-openltm-retrieval-observability` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Memory retrieval is now inspectable without touching ranking, scoring, decay, schema, or write behavior. The work adds four categories of diagnostic information — all behind existing per-call opt-ins or existing diagnostic tools. Operators calling `memory_search(includeTrace: true)` receive a `why_ranked` breakdown keyed to document path and anchor, derived from the ranker's own row intermediates rather than a parallel display formula. When returned documents are linked by existing `contradicts` or `supersedes` causal edges, a compact inline warning appears in the formatted results. Health and embedder-status responses now surface degraded-vector state directly. Maintenance handlers for index scan, embedding reconcile, and retention sweep each record their last-run counters in process memory so health can report them without a schema bump or persisted write path. A focused vitest suite of six tests proves each surface fires under its opt-in and that no ranking or state mutation occurs.

### Added

- `lib/observability/retrieval-observability.ts` — shared read-only observability helpers used by all modified surfaces
- `tests/openltm-retrieval-observability.vitest.ts` — 6-test focused suite covering `why_ranked`, inline conflict warnings, degraded-vector signal, and maintenance counter reads

### Changed

- `formatters/search-results.ts` — emits `why_ranked` per result and a compact conflict warning when the causal graph links any returned pair by `contradicts` or `supersedes`; both changes are gated on the existing `includeTrace` opt-in
- `handlers/memory-search.ts` — adds degraded-vector trace metadata to the search response under `includeTrace`
- `handlers/memory-context.ts` — treats the `debug` profile as a `includeTrace` opt-in so debug-context responses expose retrieval diagnostics from the nested search path
- `handlers/memory-crud-health.ts` — surfaces recall degradation state and exposes last-run counters for index scan, embedding reconcile, and retention sweep
- `handlers/embedder-status.ts` — surfaces recall degradation alongside existing embedder status
- `handlers/memory-index.ts` — records latest scan counters in process memory after each run
- `handlers/memory-embedding-reconcile.ts` — records latest reconcile counters in process memory after each run
- `handlers/memory-retention-sweep.ts` — records latest retention counters in process memory after each run

### Fixed

None. All changes are additive.

### Verification

| Check | Result |
|-------|--------|
| Focused observability suite | PASS: 1 file, 6 tests |
| Recall canaries | PASS: 2 files, 116 tests |
| MCP TypeScript no-emit | PASS: `npx tsc --noEmit -p tsconfig.json` from `mcp_server/` |
| Root TypeScript no-emit | NOT RUN: root `tsconfig.json` missing, TS5058 |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts` | Modified |

### Follow-Ups

- Process-local maintenance counters reset on MCP process restart. A future phase may introduce a lightweight persisted counter if last-run observability across restarts becomes necessary.
- The root `tsconfig.json` (TS5058) was pre-existing and out of scope for this phase.
