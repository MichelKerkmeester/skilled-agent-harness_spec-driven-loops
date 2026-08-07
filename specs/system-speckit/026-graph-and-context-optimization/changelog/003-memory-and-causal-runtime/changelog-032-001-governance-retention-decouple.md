---
title: "032-001 Governance Retention Decouple (ADR-002 Option A)"
description: "Decoupled retentionPolicy ephemeral from governed-ingest audit enforcement. Added DEFAULT_EPHEMERAL_TTL_MS, patched source plus runtime dist. Shipped focused vitest coverage for three required cases."
trigger_phrases:
  - "governance retention decouple"
  - "ADR-002 Option A implementation"
  - "DEFAULT_EPHEMERAL_TTL_MS"
  - "scope-governance ephemeral fix"
  - "ephemeral TTL decouple"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups`

### Summary

Callers passing `retentionPolicy: "ephemeral"` to `memory_save` were silently rejected by governed-ingest validation because ephemeral retention shared the same trigger path as full audit governance. Any caller wanting temporary retention without audit fields received an E085 governance rejection with no clear recovery.

ADR-002 Option A was implemented in `scope-governance.ts`: ephemeral retention is now treated as a retention concern rather than an audit-governance concern. The `requiresGovernedIngest()` guard was updated so that a bare ephemeral call is allowed through. A `DEFAULT_EPHEMERAL_TTL_MS` constant (24 hours) was added and wired so that ephemeral saves without an explicit `deleteAfter` receive a concrete default TTL. Explicit caller `deleteAfter` values are preserved unchanged. The runtime dist mirror was patched directly because the build pipeline was intentionally frozen for this packet. Three focused vitests covering the new behavior were added and pass alongside the full governance regression suite.

### Added

- `DEFAULT_EPHEMERAL_TTL_MS` constant exported from `scope-governance.ts` (24-hour TTL)
- `governance-ephemeral-decouple.vitest.ts` with three cases: ephemeral-alone allowed, default TTL populated, explicit TTL preserved

### Changed

- `requiresGovernedIngest()` in `scope-governance.ts` now returns false for bare ephemeral retention without scope or provenance fields
- Default `deleteAfter` computed and attached when ephemeral caller omits it
- Runtime dist `scope-governance.js` mirrored with the same behavioral patch

### Fixed

- `memory_save` with `retentionPolicy: "ephemeral"` and no governance fields no longer returns E085 governance rejection
- Ephemeral saves without `deleteAfter` no longer receive a null TTL

### Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Focused vitest (`governance-ephemeral-decouple.vitest.ts`) | PASS | 1 file passed. 3 tests passed. |
| Governance regression vitests | PASS | 4 files passed. 30 tests passed. |
| Live `memory_save` without governance fields | PASS | Dist handler accepted `retentionPolicy: "ephemeral"` and returned id 3372 with no E085 rejection. |
| Stored `delete_after` | PASS | Query on id 3372 verified `delete_after` was non-null before cleanup. |
| Live `memory_search` top-3 | FAIL | Local llama-cpp could not initialize the Metal backend for query embeddings. Provider failure documented as a known limitation. |
| Cleanup | PASS | Id 3372 deleted. Follow-up check returned null. Sandbox directory removed. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | `requiresGovernedIngest()` updated. `DEFAULT_EPHEMERAL_TTL_MS` constant added and default TTL wired for bare ephemeral callers. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Runtime mirror patched to match source behavior. Applied directly because build pipeline is frozen. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/governance-ephemeral-decouple.vitest.ts` (NEW) | Three focused vitest cases covering ephemeral-alone allowed, default TTL populated, explicit TTL preserved. |

### Follow-Ups

- Investigate `memory_search` lexical-only fallback for when the local llama-cpp embedding provider cannot initialize the Metal backend.
- Run `npm run build` once the build pipeline constraint is lifted to replace the direct dist patch with a compiled output.
