---
title: "Tree-sitter parser crash resilience: skip-list MVP ships, broad-scope scan error rate drops from 17.5% to 0.72%"
description: "Broad-scope code_graph_scan was crashing on 17.5% of files due to a missing bash WASM symbol that corrupted shared parser memory. A schema v5 SQLite skip-list and quarantine sentinel eliminated the cascade, dropping the error rate to 0.72% with zero B2 events across 9,314 files."
trigger_phrases:
  - "tree-sitter parser crash resilience"
  - "parser skip-list MVP"
  - "bash WASM symbol fault"
  - "memory access out of bounds fix"
  - "schema v5 parser quarantine"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

Broad-scope `code_graph_scan` (agents, commands, specs, plugins all enabled) was crashing on roughly 17.5% of candidate files with `RuntimeError: memory access out of bounds`. The root cause was a missing `external_scanner_reset` export in the vendored `tree-sitter-bash.wasm`. The `web-tree-sitter` loader silently substituted a proxy stub, which threw a `TypeError` on certain bash content. Each throw leaked corruption into the WASM module's shared linear memory. After about 80 cumulative throws the corruption cascaded to every language. Seven deep-research iterations converged on this mechanism at 0.95 confidence.

Phase 2 delivered a SQLite skip-list seeded with 70 production bash files known to trigger the fault, plus a quarantine sentinel that halts further parsing once a B2 event fires. The skip-list eliminates the B1 throws at the source so the B2 cascade never starts. After the fix, a live broad-scope scan across 9,391 files returned `status: ok` with zero B2 events at a 0.72% parser-error rate.

### Added

- New SQLite `parser_skip_list` table at schema v5 with seven columns: `file_path` (PK), `error_class`, `error_message`, `added_at`, `last_seen_at`, `attempt_count`, `source`.
- New module `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts` exporting `lookupSkipList`, `addToSkipList`, `recordSuccess`, `getSkipListSummary`, `seedFromProduction`. All operations fail open on SQLite errors.
- Module-level `parserHealth: 'ok' | 'quarantined'` singleton in `tree-sitter-parser.ts` with new `getParserHealth()` and `classifyError()` exports.
- New env flag `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default true) to disable the skip-list at runtime.
- New `code_graph_status` response fields: `parserSkipList: { count, lastSeenAt, sample }` and `parserHealth`.
- New `code_graph_scan` response fields: `parserSkipList: { added, healed, totalAfterScan }`.
- New test file `parser-skip-list.vitest.ts` with 13 cases covering skip-list operations, fail-open behavior, migration seeding. Quarantine early returns are also covered.

### Changed

- `tree-sitter-parser.ts` parse path now starts with a skip-list lookup. Files in the skip-list return an early sentinel without reaching the parser. Files in a quarantined process return the sentinel until the MCP server restarts.
- The catch block at the parse site classifies the thrown error as B1, B2, otherwise OTHER. B1 and B2 errors are upserted into the skip-list. A B2 also flips `parserHealth` to `quarantined`.
- Self-heal policy set to manual review only. Auto-unskipping on consecutive successes was rejected because the upstream WASM bug persists between runs.
- `structural-indexer.ts` now threads `filePath` through the parser adapter so skip-list decisions use the current path.

### Fixed

- Parser-error rate on broad-scope scans dropped from 17.5% to 0.72%, a greater-than-24x improvement.
- B2 cascade eliminated in production. Live verification across 9,314 files recorded zero B2 events.
- `parserHealth` stays `ok` throughout broad-scope scanning because the skip-list pre-filters the bash files that would have triggered B1 throws.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS, exit 0 |
| `vitest parser-skip-list.vitest.ts` | PASS, 13 of 13 cases |
| `vitest full code_graph suite` | PASS, 293 of 293 cases. Previously 280 with 13 new cases added. |
| `bash validate.sh --strict` | PASS, 0 errors and 0 warnings |
| Live driver status | PASS, `schemaVersion=5`, `parserHealth='ok'`, `parserSkipList.count=70` seed |
| Live broad-scope scan | PASS, `status: ok`, 9,314 of 9,391 files indexed, 0 B2 events, `parserHealth` stayed `ok`, 0.72% parser-error rate |
| SQLite skip-list state | PASS, 70 seed B1 rows plus 9 runtime B1 rows equals 79 total, 0 B2 rows |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts` | Created (NEW) | Skip-list lookup, write, summary and seed backfill helpers. All ops fail open. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Schema bumped to v5. New `parser_skip_list` table with idempotent migration and backfill from `parse_diagnostics`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts` | Modified | Pre-parse skip-list lookup, B1/B2 catch handling, env gate, `parserHealth` singleton. New exports added. |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | `filePath` threaded through the parser adapter for skip-list path routing. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts` | Modified | New `parserSkipList` and `parserHealth` fields in status responses. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | New `parserSkipList: { added, healed, totalAfterScan }` field in scan responses. |
| `.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts` | Created (NEW) | 13 cases for skip-list operations, fail-open behavior, migration seeding. Quarantine early returns covered. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Mock updates for the new skip-list response shape. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | Modified | Mock updates for parser skip-list and parser health fields. |

### Follow-Ups

- R-2 grammar rebuild is deferred to Phase 3. The permanent fix requires rebuilding `tree-sitter-bash.wasm` with `external_scanner_reset` exported, co-bumped with `web-tree-sitter@0.26.x`. Iter 4 of the research proved that bumping `web-tree-sitter` alone rejects the existing vendored WASM artifacts with `Error: need dylink section`.
- Add a manual playbook scenario for broad-scope scan with skip-list verification to `manual_testing_playbook/02--manual-scan-verify-status/`. The implementation is live-verified so this is documentation, not a blocker.
- Quarterly operator workflow: inspect `parser_skip_list` rows where `source='runtime'`, confirm the upstream bash WASM bug is fixed, then manually `DELETE` entries that are safe to re-attempt.
