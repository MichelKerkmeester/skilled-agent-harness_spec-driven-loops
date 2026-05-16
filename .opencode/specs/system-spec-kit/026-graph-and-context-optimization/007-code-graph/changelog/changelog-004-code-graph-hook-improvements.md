---
title: "Code Graph Phase 004: Hook Improvement Implementation"
description: "Eight implementation streams shipped: CALLS resolution correctness, blocked-read contracts, CocoIndex ranking fidelity, scan metadata lifecycle, graph-quality observability, startup payload parity across 4 runtime hooks, bounded-context contracts, and deadline/partial-output metadata. 39 tests pass with zero regressions."
trigger_phrases:
  - "phase 004 changelog"
  - "code graph hook improvements"
  - "CALLS resolution"
  - "blocked-read contracts"
  - "startup payload parity"
  - "graph quality observability"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `026-graph-and-context-optimization/007-code-graph/003-code-graph-hook-improvements` (Level 2)
> Parent packet: `026-graph-and-context-optimization/007-code-graph`

### Summary

Four deep-research investigations (28, 13-pt-02, 13-pt-03, 30) produced 22 findings across the code-graph and hook surfaces. The findings fell into a clear pattern: information existed in one layer but was dropped before the next layer could use it. Eight implementation streams addressed the contract leakage:

1. **CALLS resolution correctness.** The `calls_from` and `calls_to` query paths now resolve symbol names through the index with FQN disambiguation. Previously returned edges for wrong symbols when simple names collided.
2. **Blocked-read contracts.** When the code-graph is blocked (no scan ever run, or index empty), all read operations now return a typed `BlockedResult` with a `requiredAction` field instead of returning empty arrays that looked like valid-but-empty results.
3. **CocoIndex ranking fidelity.** The CocoIndex bridge now preserves semantic relevance scores from the search engine instead of discarding them. Query responses carry the original rank.
4. **Scan metadata lifecycle.** Scan diagnostic and detector-summary metadata is now cleared on re-scan. Previously, stale metadata from prior scans accumulated without being reset.
5. **Graph-quality observability.** A new `graphQualitySummary` object exposes node/edge counts by kind, parse-error rate, and coverage metrics at the status and scan response level.
6. **Startup payload parity.** The structured startup payload produced by `buildStartupBrief()` is now transported through Claude, Gemini, Copilot, and Codex runtime hooks. Previously, three of four hooks dropped the structured payload and fell back to text-only.
7. **Bounded-context contracts.** The `deadlineMs` and `partialOutput` metadata contract is now wired from the handler through the response payload. Previously, the contract was defined in the type system but never populated.
8. **Deadline and partial-output metadata.** Query and context operations now return `deadlineMs` (the budget that was applied) and `partialOutput` (whether results were truncated) in every response.

### Added

- `BlockedResult` type with `requiredAction` field for read operations on empty or absent graphs
- `graphQualitySummary` object with node/edge counts by kind, parse-error rate, and coverage percentages
- `deadlineMs` and `partialOutput` fields in all `code_graph_query` and `code_graph_context` response payloads
- Structured startup brief transport through all four runtime hook adapters
- Direct startup regression tests for Claude, Gemini, Copilot, and Codex hook paths

### Changed

- `calls_from` and `calls_to` now use FQN disambiguation (same mechanism as Phase 001)
- CocoIndex bridge preserves and returns semantic relevance scores
- Scan handler clears diagnostic and detector-summary metadata on re-scan
- Status handler exposes `graphQualitySummary` in the response payload
- All four runtime hook adapters transport structured startup payloads instead of text-only

### Fixed

- Empty code-graph queries returned empty arrays that looked like valid results. Now return `BlockedResult` with an explicit `requiredAction`.
- CocoIndex relevance scores were discarded between search and query response. Now preserved.
- Stale scan diagnostics accumulated across scans because metadata was never cleared. Now reset on each scan.
- Three of four runtime hooks dropped the structured startup payload. All four now transport it.

### Verification

- Vitest: 39 tests pass across 5 test files (code-graph specific).
- Typecheck (`npm run typecheck`): exit 0.
- ESLint: zero new violations.
- Cross-consistency grep for stale import paths: zero found.
- Startup payload regression tests: all four runtime hooks verified.
- Strict packet validation (`validate.sh --strict`): passed with pre-existing template/link warnings in immutable spec docs (out of scope).

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/code-graph-query.ts` | FQN disambiguation, `BlockedResult` contracts, `deadlineMs`/`partialOutput` wiring |
| `code_graph/handlers/context.ts` | `deadlineMs`/`partialOutput` fields, blocked-read gate |
| `code_graph/handlers/query.ts` | `deadlineMs`/`partialOutput` fields, blocked-read gate |
| `code_graph/handlers/status.ts` | `graphQualitySummary` field |
| `code_graph/handlers/scan.ts` | Metadata clearing on re-scan |
| `code_graph/lib/cocoindex-bridge.ts` | Relevance score preservation |
| `code_graph/lib/graph-quality.ts` (NEW) | `graphQualitySummary` computation |
| `hooks/claude/`, `hooks/gemini/`, `hooks/copilot/`, `hooks/codex/` | Structured startup brief transport through 4 adapters |
| `code_graph/tests/` (5 test files updated) | 39 test cases across blocked-read, FQN, metadata, and startup-payload paths |

### Follow-Ups

- **Validator residuals.** The strict validator still reports pre-existing template/link issues in spec.md, plan.md, and tasks.md. These are immutable spec-doc issues that were out of scope for this packet. A follow-up doc-cleanup packet should address them.
- **Research packet handoff.** The four deep-research investigations (phases 004-research-013-pt-02, 004-research-013-pt-03, 004-research-028, 004-research-030) produced 22 findings total. Findings not addressed by this implementation packet are filed as follow-up items in their respective sub-phase changelogs.
