---
title: "code_graph Fail-Fast Routing with fallbackDecision"
description: "Adds machine-readable fallbackDecision routing to blocked and degraded code_graph_query read payloads. Callers now receive a nextTool instruction pointing at code_graph_scan instead of silently falling through to slow grep loops. The allowInlineFullScan:false boundary is preserved."
trigger_phrases:
  - "code graph fail fast routing"
  - "fallbackDecision nextTool"
  - "code_graph_query blocked routing"
  - "code graph scan routing contract"
  - "REQ-017 structural graph routing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/005-code-graph-fail-fast-routing` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

A stress-test run (packet 006) recorded 249.8 seconds spent on a single `code_graph_query` call because the structural code graph was empty. The read path correctly blocked the query, but the caller had no machine-readable instruction telling it to run `code_graph_scan` first. It fell through to multi-minute `rg` grep loops instead. The existing `requiredAction:"code_graph_scan"` hint in blocked payloads was too soft for autonomous callers.

This packet implemented the fail-fast routing contract from 007/Q6. A `fallbackDecision` field was added to all blocked and degraded `code_graph_query` read payloads. The field carries `nextTool`, `reason`, plus an optional `retryAfter` so callers can route directly to a scan or grep fallback without guessing. The `allowInlineFullScan:false` boundary was kept intact so read paths never trigger a full scan inline.

A naming collision between "Code Graph" (structural index) and the memory causal graph was also resolved with a disambiguation comment in `startup-brief.ts`.

### Added

- `FallbackDecision` type in `code_graph/handlers/query.ts` with fields `nextTool`, `reason`, plus optional `retryAfter`
- Readiness-to-fallback routing helper that maps each readiness state to the correct `fallbackDecision` output
- `code-graph-query-fallback-decision.vitest.ts` covering empty, stale full-scan, stale selective, fresh, unavailable/error, plus the `allowInlineFullScan:false` regression case

### Changed

- `code_graph_query` handler now attaches `fallbackDecision` to blocked payloads when the graph is empty or requires a full scan
- `code_graph_query` handler emits `nextTool:"rg"` with `reason:"scan_failed"` on unavailable or error states
- `startup-brief.ts` now carries a disambiguation comment distinguishing the structural code graph from the memory causal graph

### Fixed

- Blocked `code_graph_query` responses gave callers no machine-readable routing hint. Now emit `fallbackDecision` with `nextTool:"code_graph_scan"` on empty and full-scan-required states.
- Unavailable or errored graph state left callers without a fallback path. Now emits `nextTool:"rg"` with `reason:"scan_failed"`.
- Naming collision between "Code Graph" startup hook context and "causal graph" memory stats caused operator confusion. Disambiguation comment added to `startup-brief.ts`.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/code-graph-*.vitest.ts` | PASS. 2 files, 8 tests. |
| `npx vitest run tests/code-graph-*.vitest.ts code_graph/tests/code-graph-query-handler.vitest.ts` | PASS. 3 files, 36 tests. |
| Empty graph test | PASS. `fallbackDecision.nextTool === "code_graph_scan"` and `retryAfter === "scan_complete"`. |
| Stale full-scan test | PASS. `fallbackDecision.nextTool === "code_graph_scan"` and `reason === "full_scan_required"`. |
| Stale selective-reindex test | PASS. No `fallbackDecision` emitted. |
| Fresh graph test | PASS. No `fallbackDecision` emitted. |
| Unavailable or error test | PASS. `fallbackDecision.nextTool === "rg"` and `reason === "scan_failed"`. |
| `allowInlineFullScan:false` regression test | PASS. `ensureCodeGraphReady(..., { allowInlineIndex: true, allowInlineFullScan: false })` preserved. |
| `npm run build` (tsc --build) | PASS. Completed without error. |
| `grep -l fallbackDecision dist/code_graph/handlers/query.js` | PASS. Match confirmed in dist. |
| `validate.sh --strict` | PASS. 0 errors, 0 warnings. |
| Live `code_graph_query` probe | PASS. Fresh-graph branch returned `freshness:"fresh"`. No `fallbackDecision` on fresh state. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Modified | Added `FallbackDecision` type. Added readiness routing helper. Added blocked-payload attachment. Added readiness-error fallback. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Modified | Added REQ-017 disambiguation comment for structural code graph vs memory causal graph |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Modified | Updated existing readiness-crash assertion for the new `rg` fallbackDecision shape |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts` (NEW) | Added | Six test cases covering all readiness states and the `allowInlineFullScan:false` regression boundary |

### Follow-Ups

- Implement caller-side enforcement so CLI runtimes honor `fallbackDecision.nextTool` automatically. This packet adds the routing field only. Callers still need their own contract.
- Confirm whether `fallbackDecision` should also appear in autoprime and startup surfaces. The current scope is query and context only. The 007 §12 open question tracks this.
