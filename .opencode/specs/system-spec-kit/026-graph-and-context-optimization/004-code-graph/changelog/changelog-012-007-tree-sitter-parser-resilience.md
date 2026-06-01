---
title: "Code Graph Phase 012/007: Tree-sitter parser resilience"
description: "Broad-scope scans crashed on 17.5% of files because the bash grammar lacks an exported symbol that web-tree-sitter silently masks. After 7 iterations of deep research and a skip-list fix, the parser-error rate dropped to 0.72%, a 24x improvement."
trigger_phrases:
  - "phase 012/007 changelog"
  - "tree-sitter skip-list"
  - "parser quarantine sentinel"
  - "external_scanner_reset bash"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

Broad-scope scans (your code plus framework folders) crashed on roughly **17.5 percent of files** in production. The error was always `RuntimeError: memory access out of bounds`. Skills-only scope was clean. Nobody knew the mechanism.

A 7-iteration deep research session converged on the cause:

1. The bash grammar (`tree-sitter-bash.wasm`, vendored via `tree-sitter-wasms@0.1.13`) is missing one exported function called `external_scanner_reset`. Every other vendored grammar exports it.
2. The WASM loader (`web-tree-sitter@0.24.7`) sets `allowUndefined: true` at one specific line. That setting tells the loader to silently substitute a proxy stub for any missing exported symbol instead of failing loudly at load time.
3. When the parser actually tries to call that missing function on certain bash content, the proxy stub throws `TypeError: resolved is not a function` (the B1 error).
4. Each B1 throw leaks a tiny bit of corruption into the WASM module's shared linear memory.
5. After approximately **80 cumulative B1 throws** (the iso-corruption budget), the corruption tips over a threshold and **every subsequent parse on any language** throws `memory access out of bounds` (the B2 cascade).
6. The corruption is at the WASM module level, not the parser instance level. Calling `parser.delete()` and constructing `new Parser()` does not recover. Even `new Parser()` itself traps after the budget is spent.

Bash is necessary AND sufficient. A 900-parse run that excluded all bash files produced zero B1 and zero B2 events. A bash-only run reproduced the cascade reliably.

### Added

- New SQLite table `parser_skip_list` at schema v5 with seven columns (file_path, error_class, error_message, added_at, last_seen_at, attempt_count, source).
- Idempotent v4 to v5 migration that backfills the skip-list with **70 production B1 file paths** from the existing `parse_diagnostics` table. These are the actual `.sh` files that have been throwing `resolved is not a function` in live scans.
- New module `code_graph/lib/parser-skip-list.ts` (142 lines) with five public functions: `lookupSkipList`, `addToSkipList`, `recordSuccess` (no-op by design), `getSkipListSummary`, `seedFromProduction`. All operations fail open on SQLite errors so the parse path stays robust.
- New module-level singleton `parserHealth: 'ok' | 'quarantined'` in `tree-sitter-parser.ts`.
- New env flag `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default true) that lets operators disable the skip-list at runtime to fall back to legacy behavior.
- New status response fields: `parserSkipList: { count, lastSeenAt, sample }` and `parserHealth: 'ok' | 'quarantined'`.
- New scan response fields: `parserSkipList: { added, healed, totalAfterScan }`.
- New `getParserHealth()` and `classifyError()` exports for handlers and tests.
- Test-only `__resetParserHealth()` export for vitest module-isolation hardening (added in the post-implementation follow-up commit).

### Changed

- The parse path in `tree-sitter-parser.ts` now starts with a skip-list lookup. Files matching the skip-list return an early sentinel without reaching the parser. Files in a quarantined process also return the sentinel.
- The catch block at the parse site now classifies the thrown error as B1, B2, or OTHER. B1 and B2 errors are upserted into the skip-list. A B2 also flips `parserHealth` to `quarantined` so subsequent files fail fast until the MCP server restarts.
- Self-heal policy is **manual review only**. Files added at runtime do not auto-unskip on N consecutive successes. A future operator workflow does the quarterly review and `DELETE` if the upstream bug is fixed.
- The `recordSuccess()` function is documented in code as a no-op for forward compatibility. It exists so future packets can wire in self-heal without a breaking export change.

### Fixed

- The 17.5 percent crash rate on broad-scope scans dropped to 0.72 percent after the skip-list seeded.
- The B2 cascade is gone in production. Live verification recorded zero B2 events across a 9,314-file scan.
- `parserHealth` stays `ok` throughout broad-scope scanning because the skip-list pre-filters the bash files that would have triggered B1.

### Verification

- Build: `npm run build` exit 0.
- Targeted vitest: 14 cases for `parser-skip-list.vitest.ts`, all pass. Coverage includes fresh add, duplicate add (attempt_count increments), lookup hit and miss, recordSuccess no-op, v4-to-v5 migration round-trip, backfill seed, concurrent-scan idempotence, corrupted-state fail-open, env kill switch, B1 vs B2 classification, quarantine sentinel propagation, and explicit `__resetParserHealth()` reset.
- Full code_graph suite: 294 of 294 tests pass (was 280 before this phase, 14 new cases added).
- Strict packet validation: passed with zero errors and zero warnings.
- **External CLI live verification.** A fresh process invoked the broad-scope scan against the populated database. Result: `status: ok`, 9,314 of 9,391 files indexed in 121.5 seconds, parser-error rate 0.72 percent (well under the 2 percent target), zero B2 events, parserHealth stayed `ok` throughout. The skip-list grew from 70 seed entries to 79 (9 new bash B1 throwers discovered in the broader scope, no B2 cascade).

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/code-graph-db.ts` | Schema bumped from v4 to v5. New `parser_skip_list` table and index. New idempotent migration with backfill from `parse_diagnostics`. |
| `code_graph/lib/parser-skip-list.ts` (NEW, 142 lines) | The five public skip-list functions. Fail-open on SQLite errors. UPSERT semantics on duplicate add. |
| `code_graph/lib/tree-sitter-parser.ts` | Module-level `parserHealth` singleton. New `SKIP_LIST_ENABLED` gate. Pre-parse skip-list lookup at the parse site. Catch hook upserts on B1 and B2 and quarantines on B2. New `getParserHealth`, `classifyError`, `__resetParserHealth` exports. |
| `code_graph/lib/structural-indexer.ts` | `filePath` parameter threaded through `ParserAdapter.parse()` so the parser knows which file is being parsed. |
| `code_graph/handlers/scan.ts` | New `parserSkipList: { added, healed, totalAfterScan }` response field. |
| `code_graph/handlers/status.ts` | New `parserSkipList` and `parserHealth` response fields. |
| `code_graph/tests/parser-skip-list.vitest.ts` (NEW, 303 lines) | 14 cases covering the skip-list module, the wrapper integration, the env kill switch, and the quarantine sentinel reset. |
| `code_graph/tests/code-graph-scan.vitest.ts` | Mock additions for the new skip-list and parserHealth imports. |
| `code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Same pattern as above. |

Five commits: `540f9329b` (packet scaffold), `671dbfe27` (7-iteration deep research convergence), `81b3e7ce9` (Phase 2 skip-list MVP), `7fc492b5d` (post-implementation remediation across 3 audit tiers), `08a6ec18b` (test-only `__resetParserHealth` follow-up).

### Follow-Ups

- **R-2 grammar rebuild (deferred to Phase 3 epic).** The permanent fix is to rebuild `tree-sitter-bash.wasm` with `external_scanner_reset` exported, or to co-bump `web-tree-sitter@0.26.x` together with all four vendored grammars rebuilt against it. Iter 4 of the research proved that bumping `web-tree-sitter` alone hard-rejects the existing `tree-sitter-wasms@0.1.13` artifacts with `Error: need dylink section`. This is infrastructure work, not a one-line fix.
- **T022 manual playbook scenario.** A "broad-scope scan with skip-list verification" scenario for `manual_testing_playbook/02--manual-scan-verify-status/` is filed as a follow-up. The implementation is verified end-to-end via the live driver, so the playbook is documentation rather than a blocker.
- **Test-isolation hardening.** The `__resetParserHealth` export was added in commit `08a6ec18b` after the audit caught the gap. Vitest cases that previously relied on `vi.resetModules()` for module-isolation can now call the explicit reset.
