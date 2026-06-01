---
title: "Phase 007: review-remediation"
description: "Review remediation integrated six task groups across MCP wiring, verification evidence, public schemas, sanitizers, test rigs, docs and label cleanup."
trigger_phrases:
  - "phase 007 changelog"
  - "review remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/007-review-remediation` (Level 2)
> Parent packet: `026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 007 integrated the review remediation pass across six task groups, T-A through T-F. It wired `detect_changes` as a callable MCP tool, synced real verification evidence, exposed `minConfidence`, kept public affordance input deferred, hardened sanitizer and parser boundaries, fixed trust-badge tests and cleaned docs. The implementation summary records 33 closure claims and distinguishes code fixes from doc-only sync. The later deep-research review found five closure-integrity gaps, so this phase is substantial but not the final word.

### Added

- MCP tool wiring for `detect_changes` across dispatcher, JSON schema, Zod schema and allowed-parameter ledger.
- Public schema support for `minConfidence` on `code_graph_query`.
- Shared adversarial affordance fixture consumed by TypeScript and Python tests.
- Trust-badge DI seam for direct SQL pipeline tests.
- Causal-edge generation counter folded into memory-search cache keys when causal boost is enabled.

### Changed

- Verification evidence across phases 001, 002, 003, 005 and 006 now uses a 3-state checklist convention.
- Affordance `conflicts_with` stays reserved in compiler validation and public request affordances remain deferred.
- Diff parsing tracks per-side hunk counters and canonical-root validation rejects escaped paths.
- Trust-badge explicit payloads merge per field and trace fields report derivation attempts.
- Umbrella docs canonicalized the tool count and removed the broken simple-terms link.

### Fixed

- R-007-2 and R-007-14: `detect_changes` story now matches callable MCP reality.
- R-007-13: previously skipped trust-badge SQL tests were unskipped through DI.
- R-007-P2-4 and R-007-P2-5: blast-radius overflow and multi-subject partial fallback behavior were corrected.
- R-007-P2-6 and R-007-P2-7: failure fallback codes, metric emission and edge mapping duplication were addressed.
- R-007-16, R-007-17 and R-007-18: install-guide path bug, tool-count drift and broken link were cleaned up.

### Verification

- T-A reused Wave-3 `tsc --noEmit` exit 0 and passed handler tests already inside the phase set.
- T-C verified `tool-input-schema.vitest.ts`: 1 passed file and 79 passed tests.
- T-D verified TypeScript hardening tests: 37 passed tests across 3 files.
- T-D verified Python Skill Advisor tests: 57 passed tests.
- T-E verified trust badges: 3 passed tests plus response-profile 2 passed tests and causal suites 9 passed tests.
- Git history for this directory includes `8c8c3fcc42`, `4a32dc78fe`, `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | `detect_changes` dispatcher wiring. |
| `mcp_server/tool-schemas.ts` | `detect_changes` and `minConfidence` schema surface. |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod schemas and allowed parameters. |
| `mcp_server/code_graph/handlers/detect-changes.ts` | Path containment hardening. |
| `mcp_server/code_graph/lib/diff-parser.ts` | Hunk-boundary parsing fix. |
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Denylist and debug counters. |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Reserved relation validation and counters. |
| `mcp_server/formatters/search-results.ts` | Trust-badge merge, trace and DI seam. |
| `mcp_server/tests/memory/trust-badges.test.ts` | Unskipped DI-backed SQL tests. |
| `007-review-remediation/implementation-summary.md` | Closure record and evidence ledger. |

### Follow-Ups

- 008 research later identified P1 D1 and selected P2 issues for downstream packets.
- Some historical tasks and checklist state still read stale compared with the implementation summary.
