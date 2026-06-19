---
title: "Changelog: 015-Residual Correctness — RRF-scale + maintenance-grace TTL [001-speckit-memory/021-residual-correctness]"
description: "Chronological changelog for the 015-Residual Correctness — RRF-scale + maintenance-grace TTL phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase implements two always-on correctness residuals the 008 retrieval-evaluation campaign surfaced. Both are Wave-0, independent, schema-free, and reversible. Packet 030 remains untouched; this phase carries the implementation record.

### Added

- Introduce/locate a shared LEASE_TTL_MS (60000) source; derive MAINTENANCE_MARKER_TTL_MS = LEASE_TTL_MS × K (K=3) — byte-identical 180000 (lib/storage/maintenance-marker.ts:23-25)
- Confirm tests/launcher-maintenance-guard.vitest.ts adopt/reap cases still pass; typecheck + build green; A4 before/after magnitude recorded
- CHK-003 Candidate seams identified before implementation.
- CHK-011 Memory MCP build passes for both candidates.
- CHK-030 No secrets introduced.

### Changed

- Route resolveSearchScore through the absolute-relevance read (reuse resolveAbsoluteRelevance / pipeline/types.ts:89-95 where present), gated on typeof row.similarity === 'number' (handlers/memory-search.ts:494-499)
- Effective-score fallback for lexical-only rows (no similarity); never throw on a null similarity (handlers/memory-search.ts:494-499)
- Resolve the > 1 ? candidate / 100 heuristic per the caller inventory — remove if dead, else keep for the raw-cosine path (handlers/memory-search.ts:499)
- Capture the after baseline; record the magnitude delta
- Document the marker-TTL > 2×-lease-reclaim invariant (180s > 120s, 60s margin) in the module comment (lib/storage/maintenance-marker.ts:23-24)
- Document the phase-yield invariant — "any synchronous phase > TTL/2 must call maintenance.refresh()" — in the refresh() doc; confirm the existing 200-row / phase-boundary refresh hooks satisfy it (lib/storage/maintenance-marker.ts:29-31,69-71)

### Fixed

- [P] Read the seams: A4 handlers/memory-search.ts:494-508 vs the 015 fix lib/search/confidence-scoring.ts:343,402-403; A7 lib/storage/maintenance-marker.ts:23-26,44-51 + lease mk-spec-memory-launcher.cjs:419,455-456,524-525
- Independently verify the residual: confirm the 015 fix is confined to confidence-scoring.ts and resolveSearchScore is the unpatched re-route path (handlers/memory-search.ts:494-499)
- [P] Capture the before baseline: computeAverageScore value for a fixed query set (regression-baseline rule)
- [P] A4 unit test: fixture row (RRF ~0.03 + cosine ~0.8) → average on the cosine scale; lexical-only row → effective-score fallback, no throw
- CHK-FIX-001 Each residual has a final disposition.
- CHK-FIX-002 A4 is independently verified, not assumed.

### Verification

- A4-015-residual implemented - DONE — resolveSearchScore now reads cosine-scale absolute relevance for semantic rows and effective score for lexical-only rows
- A7-maintenance-grace-ttl implemented - DONE — MAINTENANCE_MARKER_TTL_MS derives from owner-lease constants and remains 180000
- A4 residual independently verified - DONE (seam read) — 015 fix confined to confidence-scoring.ts:343,402-403; resolveSearchScore (memory-search.ts:494-499) is the unpatched re-route path
- A7 invariant confirmed against live values - DONE (seam read) — lease ttlMs:60000 (mk-spec-memory-launcher.cjs:419), reclaim ×2 = 120s (:455-456); marker 180_000 (maintenance-marker.ts:25) > 120s by 60s
- Packet 030 untouched - DONE — implementation and docs stayed in this phase and MCP-server scope
- npm run typecheck - PASS — baseline and final runs green in .opencode/skills/system-spec-kit/mcp_server
- Focused vitest - PASS — baseline 3 files / 32 tests; final 3 files / 36 tests
- npm run build - PASS — tsc --build && node scripts/finalize-dist.mjs

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified (A4) | Route resolveSearchScore/computeAverageScore through the 015-calibrated absolute-relevance scale; effective-score fallback for lexical-only rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Modified (A7) | Derive MAINTENANCE_MARKER_TTL_MS from owner-lease constants; document the stale-reclaim and refresh invariants |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts` | Modified | Assert cosine-scale average, lexical-only fallback, skipped no-signal rows, and averageSimilarity normalization |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Modified | Assert TTL derivation, reclaim-safe margin, byte-identical value, and activeUntilMs = now + TTL |

### Follow-Ups

- A4 changes recall-confidence magnitudes by design. Reading the calibrated absolute scale instead of the RRF magnitude shifts the numbers computeAverageScore returns. The fixed fixture moved 0.032 -> 0.715.
- Effort is structural inference, not a benchmark. The "S" tags, like every estimate in the 028 roadmap, are reasoning estimates, never build-measured. Both ship for correctness and reversibility, not a promised delta.
- A7's residual risk is a future non-yielding phase. The phase-yield invariant covers the current phases via the existing 200-row / phase-boundary refresh hooks; a new synchronous phase longer than the TTL without a refresh hook would still risk a false reap — the module comment names this as the maintainer's contract.
