---
title: "Code Graph Phase 004-003: Resolver Correctness and Hook Startup Parity"
description: "Eight hardening streams shipped: CALLS resolution correctness for ambiguous subjects, blocked-read contracts for suppressed-scan reads, CocoIndex ranking fidelity through seed resolution, stale enrichment-summary clearing on re-scan, graphQualitySummary observability through status and startup, startup shared-payload transport across all four runtime hooks. deadlineMs plus partialOutput are now real context response metadata. 39 tests pass."
trigger_phrases:
  - "resolver and hook improvements"
  - "CALLS resolution correctness"
  - "blocked-read contract"
  - "startup payload parity hooks"
  - "graphQualitySummary startup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/003-resolver-and-hook-improvements` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan`

### Summary

Four deep-research sub-phases (001 through 004 under `research/`) produced a set of findings covering CALLS subject selection, blocked-read contract gaps, CocoIndex ranking loss, stale scan metadata, missing graph-quality observability and startup payload fragmentation across runtime hooks.

Eight streams addressed those findings. The `calls_from` and `calls_to` query paths now use operation-aware subject resolution that prefers callable implementation nodes over wrapper shadows when ambiguous `handle*` subjects are present. Query and context handlers now return a typed `status: "blocked"` result with a `requiredAction` field when a suppressed full scan prevents a valid read, replacing the prior behavior of returning an empty array that callers could not distinguish from a valid empty result. The CocoIndex seed resolver now preserves semantic relevance scores, snippet text, range and provider through the resolution step so downstream ranking is not lost. Scan handlers clear stale enrichment summaries on successful re-scans. A new `graphQualitySummary` object surfaces node and edge counts by kind, parse-error rate and coverage metrics through the status handler and the startup brief. All four runtime hook adapters (Claude, Gemini, Copilot, Codex) now transport the compact startup shared-payload contract instead of falling back to text-only output. Context operation responses now carry real `deadlineMs` and `partialOutput` fields so callers can detect truncated results without relying on text markers.

### Added

- Operation-aware CALLS subject resolution that prefers callable implementation nodes over wrapper shadows when `handle*` ambiguity is detected
- `status: "blocked"` response with `requiredAction` field for query and context reads on suppressed-scan graphs
- `graphQualitySummary` object exposing node and edge counts by kind, parse-error rate and coverage metrics
- Startup shared-payload contract section in Claude, Gemini, Copilot and Codex runtime hook adapters
- `ambiguityWarning` and `selectedCandidate` metadata fields in query responses
- Regression tests for blocked-read, CALLS ambiguity, seed fidelity and startup payload transport (39 tests across 5 files)

### Changed

- `calls_from` and `calls_to` now apply operation-aware edge-count ranking to resolve ambiguous subjects. Previously selected the first candidate regardless of callable kind.
- Seed resolver preserves CocoIndex score, snippet, range and provider through resolution. Previously discarded them.
- Scan handler clears enrichment-summary metadata on successful scans. Previously left stale summaries from prior runs.
- Status handler exposes `graphQualitySummary` in the response payload.
- Context handler populates `deadlineMs` from the applied budget and `partialOutput` from truncation state. Previously left both fields undefined.

### Fixed

- `calls_from` and `calls_to` returned edges for wrapper shadows instead of callable implementations when symbol names were ambiguous. Operation-aware resolution now selects the callable node.
- Empty-graph queries returned empty arrays that callers could not distinguish from valid absent results. Now returns `status: "blocked"` with `requiredAction`.
- CocoIndex semantic relevance scores were discarded at the seed resolver boundary, causing downstream ranking loss. Now preserved through the full resolution path.
- Stale enrichment summaries from prior scans accumulated without being cleared. Scan handler now resets them on re-scan.
- Three of four runtime hooks dropped the structured startup payload and fell back to text-only output. All four now transport the compact shared-payload section.

### Verification

| Check | Result | Evidence |
|---|---|---|
| Focused Vitest packet suites | Pass | 5 files, 39 tests |
| Targeted ESLint on modified files | Pass | `npx eslint` over all touched files |
| TypeScript compile (`mcp_server`) | Pass | `npx tsc --noEmit` |
| Cross-consistency grep | Pass | `full_scan`, `selectedCandidate`, `graphQualitySummary`, `sharedPayload`, `deadlineMs`, `partialOutput` found in expected surfaces |
| Packet-local audit trail | Pass | `tasks.md`, `checklist.md`, `resource-map.md`, `review/review-report.md` present |
| Workspace `npm run check` | Fail | Pre-existing lint errors in untouched files outside this packet |
| Packet validator | Fail | Residual template/link issues in `spec.md`, `plan.md`, `tasks.md` (out of scope) |

### Files Changed

| File | What changed |
|---|---|
| `system-code-graph/mcp_server/handlers/query.ts` | Operation-aware subject resolution, `ambiguityWarning` metadata, blocked query contract |
| `system-code-graph/mcp_server/handlers/context.ts` | Blocked context contract, deadline defaults, richer anchor metadata |
| `system-code-graph/mcp_server/lib/seed-resolver.ts` | CocoIndex score, snippet, range and provider preservation through resolution |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | Deadline enforcement and structured `partialOutput` metadata |
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | `graphQualitySummary` readers and enrichment-summary clearing helper |
| `system-code-graph/mcp_server/handlers/scan.ts` | Null-summary clearing on successful scans |
| `system-code-graph/mcp_server/handlers/status.ts` | `graphQualitySummary` reader exposure |
| `system-code-graph/mcp_server/lib/startup-brief.ts` | Graph-quality startup rendering and shared-payload transport |
| `system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Startup payload contract section |
| `system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Startup payload contract section |
| `system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Startup payload contract transport for Codex |
| `system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Resolver ambiguity and blocked-read regressions |
| `system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Blocked-read, seed-fidelity and partial-output regressions |
| `system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Overwrite-then-clear enrichment summary regression |
| `system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | Claude, Gemini and Copilot startup payload contract regressions |
| `system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` | Codex startup payload contract regression |
| `system-spec-kit/mcp_server/ENV_REFERENCE.md` | Operator note for `graphQualitySummary` |

### Follow-Ups

- Address residual template-anchor and link issues in `spec.md`, `plan.md` and `tasks.md` in a dedicated doc-cleanup packet. These were explicitly out of scope for this implementation packet.
- Resolve pre-existing workspace-wide lint errors that block `npm run check --workspace=@spec-kit/mcp-server`. These are in untouched files outside this packet's scope.
- Verify Copilot hook startup payload transport once a dedicated `hooks/copilot/session-prime.ts` path is established. The current copilot wiring routes through a shared test fixture.
