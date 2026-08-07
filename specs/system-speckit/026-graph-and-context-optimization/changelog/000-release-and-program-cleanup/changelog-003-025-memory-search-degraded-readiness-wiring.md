---
title: "memory_search degradedReadiness Wiring via Handler-Side Snapshot"
description: "Wire SearchDecisionEnvelope.degradedReadiness into memory_search via a shared mapper and a non-mutating code graph readiness snapshot. Closes PP-1 TC-3 expected_fail and the v1.0.3 stress test envelope completeness gap."
trigger_phrases:
  - "memory search degraded readiness wiring"
  - "SearchDecisionEnvelope degradedReadiness"
  - "graph readiness snapshot envelope"
  - "mapGraphReadinessToTelemetry helper"
  - "PP-1 TC-3 expected fail flip"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/025-memory-search-degraded-readiness-wiring` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

`SearchDecisionEnvelope.degradedReadiness` was always undefined when emitted by `memory_search`. The handler built the envelope without any code graph readiness telemetry. Operators had no visibility into the graph state the search pipeline ran against. PP-1 TC-3 was marked `it.fails` to document the gap.

An initial gpt-5.5 architectural recommendation assumed the search pipeline routes through `handleCodeGraphQuery`. Direct code inspection showed it does not. The pipeline reads graph topology only as scoring boosts inside `stage2-fusion.ts` and never invokes the code-graph handler. Option C, a handler-side non-mutating snapshot call, was the correct path.

A shared `mapGraphReadinessToTelemetry()` helper was created in `mcp_server/lib/search/graph-readiness-mapper.ts`. The `handleMemorySearch` handler now calls `getGraphReadinessSnapshot(process.cwd())` after the search pipeline. It maps the result via the shared helper then supplies `degradedReadiness` to `buildSearchDecisionEnvelope`. PP-1 TC-3 flips from `it.fails` to a passing assertion. The change ships with focused mapper unit tests and leaves all existing search-quality vitest suites green.

### Added

- Shared `mapGraphReadinessToTelemetry()` helper in `mcp_server/lib/search/graph-readiness-mapper.ts`. Accepts a `GraphReadinessSnapshot` and returns `DegradedReadinessTelemetry` with `freshness`, `action`, `reason` plus a derived `degraded` field.
- Focused mapper unit test `mcp_server/tests/graph-readiness-mapper.vitest.ts` with four cases: fresh snapshot, stale snapshot, empty snapshot, error snapshot.

### Changed

- `mcp_server/handlers/memory-search.ts` now calls `getGraphReadinessSnapshot(process.cwd())` post-pipeline and passes the mapped result as `degradedReadiness` into `buildSearchDecisionEnvelope`.
- `mcp_server/tests/handler-memory-search-live-envelope.vitest.ts`: TC-3 converted from `it.fails` to a passing assertion that proves `envelope.degradedReadiness.freshness` is defined and matches the mocked snapshot.
- `mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`: inline snapshot mapping replaced by a call to the shared helper, reducing duplication.

### Fixed

- `SearchDecisionEnvelope.degradedReadiness` was always undefined on envelopes emitted by `memory_search`. Handler-side snapshot wiring populates the field on every call.
- PP-1 TC-3 (`handler-memory-search-live-envelope.vitest.ts`) was encoded as `it.fails`, treating the gap as expected behavior. The field is now populated and the test passes without the failure annotation.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts stress_test/search-quality/ tests/graph-readiness-mapper.vitest.ts` | PASS. 17 test files, 34 tests. |
| `npx tsc --noEmit` | FAIL on out-of-scope missing exports (`isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`) from `core/index.js` used by `memory-crud*` and `shadow-evaluation-runtime`. No packet-owned type errors. |
| Strict validator on packet (`validate.sh --strict`) | PASS. Exit 0 after adding acceptance scenarios and fixing Spec Folder metadata. |
| REQ-001 | Met. Shared mapper exists with focused unit coverage. |
| REQ-002 | Met. Handler invokes snapshot, maps telemetry, passes `degradedReadiness`. |
| REQ-003 | Met. PP-1 TC-3 `it.fails` removed. Assertion proves snapshot-derived freshness is present. |
| REQ-004 | Met for focused Vitest scope. Full typecheck blocked by out-of-scope export drift. |
| REQ-005 | Met. `validate.sh` exits 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts` | Created (NEW) | Shared mapper. Converts `GraphReadinessSnapshot` to `DegradedReadinessTelemetry`. Supports richer `code_graph_query` payloads for W10 path. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts` | Created (NEW) | Mapper unit tests. Four cases: fresh snapshot, stale snapshot, empty snapshot, error snapshot. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | Calls `getGraphReadinessSnapshot` post-pipeline. Maps result via shared helper. Passes `degradedReadiness` into envelope builder. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Modified | TC-3 converted from `it.fails` to a passing assertion on snapshot-derived readiness. |

### Follow-Ups

- Resolve out-of-scope `core/index.js` export drift (`isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`) so `npx tsc --noEmit` can run clean across the full mcp_server surface. Those exports are used by `memory-crud*` and `shadow-evaluation-runtime`, which are outside the 025 target authority.
- Snapshot telemetry is intentionally sparse. `memory_search` does not populate the `blocked`, `graphAnswersOmitted`, `requiredAction`, `fallbackDecision` fields because `getGraphReadinessSnapshot` does not own those semantics. A future packet can extend the richer payload path if operator demand arises.
