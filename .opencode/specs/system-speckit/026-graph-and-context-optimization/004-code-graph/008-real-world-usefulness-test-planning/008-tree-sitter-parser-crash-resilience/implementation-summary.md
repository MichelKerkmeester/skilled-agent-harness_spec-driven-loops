---
title: "Implementation Summary: Tree-sitter parser resilience (Phase 2 skip-list MVP)"
description: "Phase 2 shipped a schema v5 parser skip-list and quarantine sentinel, dropping broad-scope parser errors from about 17.5% to 0.72% with zero B2 events."
trigger_phrases:
  - "parser-resilience implementation"
  - "skip-list MVP"
  - "schema v5 migration"
  - "parser quarantine sentinel"
  - "B1 cascade fix"
  - "tree-sitter parser resilience"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/008-tree-sitter-parser-crash-resilience"
    last_updated_at: "2026-05-06T19:30:00Z"
    last_updated_by: "phase-2-implementation-summary"
    recent_action: "Phase 2 skip-list MVP shipped"
    next_safe_action: "Refresh continuity via memory:save"
    blockers: []
    key_files:
      - "mcp_server/code_graph/lib/parser-skip-list.ts"
      - "mcp_server/code_graph/lib/code-graph-db.ts"
      - "mcp_server/code_graph/lib/tree-sitter-parser.ts"
      - "mcp_server/code_graph/lib/structural-indexer.ts"
      - "mcp_server/code_graph/handlers/status.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-phase-2-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mechanism root cause: bash B1 throws corrupt shared WASM module state and trigger later B2 memory access failures."
      - "Skip-list beats reset-on-throw because parser.delete() plus new Parser() does not clear module-level WASM corruption."
      - "The 70-file production B1 cohort is the correct schema v5 seed, while the 9-file subset was replay-stable only."
      - "R-2 grammar rebuild stays deferred because web-tree-sitter 0.26.x rejects the current vendored WASM artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-tree-sitter-parser-crash-resilience |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The broad-scope `code_graph_scan` now completes cleanly across 9,300+ files. The bash B1 cascade that previously corrupted parser memory after about 80 throws no longer fires. Parser-error rate dropped from about 17.5% to 0.72%, a >24x improvement.

### Persistent Skip-List

Phase 2 added a SQLite `parser_skip_list` table at schema v5. The v4 to v5 migration seeds 70 production B1 paths from `parse_diagnostics`, so known bash trigger files return an early sentinel before tree-sitter touches them.

The new `parser-skip-list.ts` module exports `lookupSkipList`, `addToSkipList`, `recordSuccess`, `getSkipListSummary` and `seedFromProduction`. SQLite errors fail open, so a skip-list storage problem does not break the parse path.

### Parser Quarantine Sentinel

The parser now tracks a module-level `parserHealth` flag. The first B2 error, `memory access out of bounds`, flips that flag to `quarantined`.

Once quarantined, subsequent parse calls return an early sentinel until the MCP server restarts. Operators can inspect `parserHealth` through `code_graph_status` to spot the condition.

### Response Surface Updates

`code_graph_status` now returns `parserSkipList: { count, lastSeenAt, sample }` and `parserHealth`. `code_graph_scan` returns `parserSkipList: { added, healed, totalAfterScan }` for each scan.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/code_graph/lib/parser-skip-list.ts` | Created | Adds skip-list lookup, write, summary and seed backfill helpers. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Bumps schema to v5, adds `parser_skip_list` and seeds from `parse_diagnostics`. |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Modified | Adds pre-parse skip-list lookup, B1 and B2 catch handling, env gate and parser health exports. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Modified | Threads file paths through the parser adapter so skip-list decisions use the current path. |
| `mcp_server/code_graph/handlers/status.ts` | Modified | Surfaces parser skip-list summary and parser health in status responses. |
| `mcp_server/code_graph/handlers/scan.ts` | Modified | Surfaces skip-list scan deltas in scan responses. |
| `mcp_server/code_graph/tests/parser-skip-list.vitest.ts` | Created | Covers skip-list operations, fail-open behavior, migration seeding and quarantine early returns. |
| `mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modified | Updates scan mocks for the new skip-list response shape. |
| `mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Modified | Updates readiness mocks for parser skip-list and parser health fields. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven deep-research iterations using `cli-codex gpt-5.5 high fast` converged on 0.95 confidence in the mechanism. `cli-codex` then implemented Phase 2 autonomously in about 22 minutes of wall-clock time with 198,915 tokens. External live verification across the full active scope, `agents+commands+specs+plugins=all`, returned `status: ok` with 0 B2 events.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip-list over reset-on-throw | Iteration 6 empirically rejected R-1 reset-on-throw. WASM module-level corruption survives `parser.delete()` plus `new Parser()`. The skip-list eliminates B1 events at the source, so B2 never fires. |
| 70-file production seed over 9-file replay-stable subset | The 70-file production cohort is the source of truth from live SQLite `parse_diagnostics`. The 9-file subset was an iteration 5 replay artifact, not the empirical truth. |
| Manual-review-only self-heal | Auto-unskipping on N consecutive successes risks reintroducing the corruption trigger if the bash WASM has not changed. Quarterly manual review keeps the skip-list audit trail intact. |
| Quarantine cleared by MCP restart only | Module-level WASM state is unrecoverable in process. A restart guarantees fresh module memory. |
| R-2 grammar bump deferred | Iteration 4 proved that bumping `web-tree-sitter` alone hard-rejects vendored WASMs with `Error: need dylink section`. Co-bumped grammar rebuild is a Phase 3 epic, not a one-line fix. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS, exit 0 |
| `vitest parser-skip-list.vitest.ts` | PASS, 13 of 13 cases |
| `vitest full code_graph suite` | PASS, 293 of 293 cases, previously 280 with 13 new cases |
| `bash validate.sh --strict` | PASS, 0 errors and 0 warnings |
| Live driver status | PASS, `schemaVersion=5`, `parserHealth='ok'`, `parserSkipList.count=70` seed |
| Live broad-scope scan | PASS, `status: ok`, 9,314 of 9,391 files indexed, 0 B2 events, `parserHealth` stayed `ok`, 0.72% parse-error rate |
| SQLite skip-list state | PASS, 70 seed B1 rows plus 9 runtime B1 rows equals 79 total, 0 B2 rows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Self-heal stays disabled by design.** Files added to the skip-list stay there until manual quarterly review removes them. Operator workflow: inspect `parser_skip_list` rows where `source='runtime'`, validate the upstream bug is fixed and manually `DELETE`.
2. **Quarantine sentinel clears only through MCP server restart.** There is no programmatic clear endpoint. Operator workflow: notice `parserHealth='quarantined'` in status, inspect the most recent B2 cohort via `parse_diagnostics` and restart the MCP server.
3. **R-2 grammar rebuild is deferred to Phase 3.** The skip-list is a workaround. The permanent fix is to rebuild `tree-sitter-bash.wasm` with the missing `external_scanner_reset` symbol exported, which requires co-bumped `web-tree-sitter` and grammar rebuild infrastructure.
4. **Test-isolation defensive surface is not exported yet.** The `parserHealth` singleton has no `__resetParserHealth()` for vitest module-isolation hardening. Current tests use `vi.resetModules()`, which works correctly. A future test-quality pass should add the explicit reset surface.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/global/hvr_rules.md
-->
