---
title: "Changelog: Code Graph Gold-Query Battery Repair [004-code-graph/014-gold-query-battery-repair]"
description: "Chronological changelog for the Code Graph Gold-Query Battery Repair phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/014-gold-query-battery-repair` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph`

### Summary

The Code Graph gold-query battery now matches the extracted system-code-graph and system-skill-advisor source layout. Verification also exposed and fixed a runtime recovery bug: a persisted failed gold-query baseline blocked the verifier's own outline probes, preventing recovery. The fix adds an internal verifier-only bypass while preserving public code_graph_query fail-closed behavior.

### Added

- Create the `014-gold-query-battery-repair` phase folder with Level 2 spec, plan, tasks, checklist, and implementation-summary docs.
- Add verifier-recovery regression test in `code-graph-verify.vitest.ts` covering a persisted failed baseline scenario.

### Changed

- Update stale pre-extraction source anchors in `code-graph-gold-queries.json` to match current `system-code-graph` and `system-skill-advisor` paths; rewrite `GQ-REG-003` to standalone tool-schema ownership.
- Refresh evidence paths and source ranges in `exclude-rule-confidence.json` for moved Code Graph and Skill Advisor code.
- Add verifier-only bypass in `query.ts` for the failed gold-query gate, preserving public `code_graph_query` fail-closed behavior.
- Route verifier probes through the internal bypass in `gold-query-verifier.ts`.
- Type the verifier probe argument in `gold-battery-runner.ts`.

### Fixed

- Fix verifier self-blocking recovery where a persisted failed gold-query baseline prevented the verifier from running the probes needed to repair it.
- Fix stale path references in gold-query fixtures that broke after Code Graph and Skill Advisor extraction.

### Verification

- Phase scaffold created - PASS - 014-gold-query-battery-repair exists under the Code Graph parent
- Asset repair - PASS - stale extraction path grep returned no asset hits
- Targeted regression tests - PASS - npm test -- mcp_server/tests/code-graph-verify.vitest.ts returned 17 passed
- TypeScript typecheck - PASS - npm run typecheck completed successfully
- Build - PASS - npm run build completed successfully
- code_graph_scan - PASS - broad incremental scan completed with the established all-.opencode scope and known non-blocking shell parse warnings
- code_graph_verify - PASS - full 28-query battery passed with overall_pass_rate: 1, edge_focus_pass_rate: 1, missingSymbols: [], and unexpectedErrors: []
- Representative code_graph_query - PASS - normal outline query returned status: "ok" after the verified pass

### Files Changed

| File | Action | What changed |
|---|---|---|
| `014-gold-query-battery-repair/spec.md` | Created | Defines repair scope, requirements, and success gates |
| `014-gold-query-battery-repair/plan.md` | Created | Defines fixture-repair and verification approach |
| `014-gold-query-battery-repair/tasks.md` | Created and finalized | Tracks setup, asset repair, verification, and timeline work |
| `014-gold-query-battery-repair/checklist.md` | Created and finalized | Tracks P0/P1 verification evidence |
| `014-gold-query-battery-repair/implementation-summary.md` | Created and finalized | Records final delivery evidence and limitations |
| `014-gold-query-battery-repair/description.json` | Created and updated | Provides spec metadata for discovery |
| `014-gold-query-battery-repair/graph-metadata.json` | Created and updated | Marks phase status and related assets |
| `004-code-graph/spec.md` | Modified | Adds the new child phase to the parent map and marks it complete |
| `004-code-graph/graph-metadata.json` | Modified | Points the parent to the active child phase |
| `code-graph-gold-queries.json` | Modified | Replaces stale pre-extraction source anchors and rewrites GQ-REG-003 to current standalone tool-schema ownership |
| `exclude-rule-confidence.json` | Modified | Replaces stale evidence paths and refreshes source ranges for moved Code Graph and Skill Advisor code |
| `query.ts` | Modified | Adds verifier-only bypass for the failed gold-query gate while preserving public read blocking |

### Follow-Ups

- Runtime restart required. The currently loaded mk-code-index MCP server may need a restart before it uses the verifier-only bypass code.
- Docs can make the graph stale again. Final documentation edits may require a follow-up incremental code_graph_scan before structural reads are fresh.
- Known parse warnings remain. Existing shell parser skip-list warnings are unrelated to this repair and remain non-blocking.
- Deep-context packet remains limited evidence. The prior recovery packet was native-only and is not treated as a completed deep-context loop.
