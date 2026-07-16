---
title: "Implementation Summary: Review Remediation (006/007)"
description: "Placeholder. Populated after the 6-theme remediation pass completes."
trigger_phrases:
  - "006/007 implementation summary"
  - "006 remediation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/005-graph-impact-and-affordance/004-deep-review-findings"
    last_updated_at: "2026-04-25T19:00:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator-wave-1-integration"
    recent_action: "Wave 1 fully integrated. All 6 batches (T-A through T-F) cherry-picked onto main. T-F closes 11 cleanup findings (R-007-12/16/17/18/P2-2/4/5/6/7/9/12) via cache-key generation counter, INSTALL_GUIDE Python path fix, tool-count canonicalization (51), query.ts micro-fixes (true overflow detection via full-traversal-then-slice; semantically equivalent to `limit + 1`, multi-subject seed preservation, failureFallback.code, shared edge-mapper dedup), affordance debug counters, phase alias note."
    next_safe_action: "Run final tsc + vitest sweep; commit Wave 2 integration meta if needed; push"
    completion_pct: 95
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../../mcp_server/schemas/tool-input-schemas.ts"
      - "../../mcp_server/tool-schemas.ts"
      - "../../mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
      - "../../mcp_server/tests/tool-input-schema.vitest.ts"
      - "../../mcp_server/code_graph/handlers/detect-changes.ts"
      - "../../mcp_server/code_graph/lib/diff-parser.ts"
      - "../../mcp_server/skill_advisor/lib/affordance-normalizer.ts"
      - "../../mcp_server/skill_advisor/scripts/skill_graph_compiler.py"
      - "../../mcp_server/formatters/search-results.ts"
      - "../../mcp_server/code_graph/lib/phase-runner.ts"
      - "../../mcp_server/tests/memory/trust-badges.test.ts"
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Review Remediation (006/007)

<!-- SPECKIT_LEVEL: 2 -->

## Status
**Wave 1 fully integrated.** T-A, T-B, T-C, T-D, T-E, T-F all complete and on main.

- **T-A (detect_changes MCP wiring):** detect_changes registered as MCP tool across dispatcher, JSON schema, Zod validator, allowed-parameter ledger, and 6 umbrella docs. Closes R-007-2, R-007-14.
- **T-B (verification evidence sync):** Wave-3 canonical evidence (`tsc --noEmit` exit 0; `vitest run` 9 passed | 1 skipped (10), 90 passed | 3 skipped (93), 1.34s; per-sub-phase `validate.sh --strict` results) synced across 006/001/002/003/005/006 sub-phase implementation-summary.md + checklist.md files. Premature `[x]` PASS marks unchecked and rewritten with the 3-state convention (`[x]` real evidence captured | `[ ] OPERATOR-PENDING` command can't run from this context | `[ ] BLOCKED` blocked with reason). Closes R-007-1, R-007-5, R-007-7, R-007-15, R-007-19, R-007-20, R-007-21.
- **T-C (public API surface gaps):** `minConfidence` exposed end-to-end on `code_graph_query` (Zod schema, JSON schema, allowed-parameter ledger, accept/reject tests). `affordances` DEFER decision: stays compile-time-only scorer seam (prompt-injection surface concern). Closes R-007-6, R-007-10.
- **T-D (sanitization hardening):** 7 files hardened (`detect-changes.ts` canonical-root path containment, `diff-parser.ts` per-side hunk counters, `skill_graph_compiler.py` validate-reject `conflicts_with` + broadened denylist, `affordance-normalizer.ts` broadened denylist, `formatters/search-results.ts` merge-per-field trustBadges + allowlisted age strings + trace flag, `phase-runner.ts` duplicate-output rejection, `code-graph-db.ts`/`query.ts:614-615`/`code-graph-context.ts` `reason`/`step` allowlist on read path). New shared adversarial fixture `affordance-injection-fixtures.json` consumed by both TS and Python tests. Closes R-007-3, 4, 8, 9, 11, P2-1, P2-3, P2-8, P2-10, P2-11. Verify: tsc clean; vitest 37/37 PASS; pytest 57/57 PASS.
- **T-E (test rig fix — DI strategy):** `fetchTrustBadgeSnapshots` exposes optional `dbGetter` parameter (defaults to `requireDb`). Three previously-skipped trust-badges tests unskipped (3/3 pass). **Precision correction (008/D15):** of those 3, two exercise the SQL-derivation pipeline directly via the DI getter and one is the explicit-pass-through test (formatter-only, DB-independent). Latent production bug fixed: `resultIds.map(String)` at bind time so `CAST(rid.memory_id AS TEXT)` matches TEXT-typed `causal_edges.{source_id,target_id}` columns (better-sqlite3 was binding JS numbers as REAL → `'11.0'` instead of `'11'`). Formatter return type harmonized to T-D's `TrustBadgeFetchResult` shape during integration; tests now dereference `fetchResult.snapshots.get(...)`. Closes R-007-13.
- **T-F (doc cleanup + query.ts micro-fixes + cache invalidation):** memory_search cache key includes causal-edge generation counter (folded only when `enableCausalBoost=true`); INSTALL_GUIDE Python smoke-test path fixed; tool count canonicalized to 51 (`TOOL_DEFINITIONS.length`) across all umbrella docs with explicit deferred-handlers-do-not-count note; broken `FEATURE_CATALOG_IN_SIMPLE_TERMS` link removed; `structural-indexer.ts` `runPhases` wrapped in try/catch/finally so error outcome metric emits; `query.ts` detects true overflow by comparing full-BFS-traversal size against `limit` BEFORE slicing (semantically equivalent to `limit + 1` — the BFS frontier is already over-collected, so no extra SQL request is needed; 008/D8 doc-fix correction), preserves seed nodes on multi-subject sibling failures, adds stable `failureFallback.code` + new `spec_kit.graph.blast_radius_failure_total` metric, and dedupes 4 switch branches via shared edge mapper; affordance debug counters (received/accepted/dropped_unsafe/dropped_empty/dropped_unknown_skill) added to TS + Python; 006/006 alias note for renumber. Closes R-007-12, 16, 17, 18, P2-2, P2-4, P2-5, P2-6, P2-7, P2-9, P2-12.

## Findings Closed

### R-007-2 — `detect_changes` MCP wiring decision (T-A)

**Decision:** WIRE — register `detect_changes` as a callable MCP tool.

**Rationale:**
- Handler at `mcp_server/code_graph/handlers/detect-changes.ts` is fully implemented (canonical-root sanitization, readiness probe, diff parser, line-range overlap attribution) and unit-tested (`code_graph/tests/detect-changes.test.ts`) since 006/002.
- Docs already describe it as an operator-callable surface: feature catalog `03--discovery/04-detect-changes-preflight.md`, manual testing playbook `03--discovery/014-detect-changes-preflight.md`, and `INSTALL_GUIDE.md §4a` smoke test all demonstrate calling the tool with `{ diff, rootDir? }`.
- ADR-012-003 (deferred route/tool/shape contract safety) governs the **new** graph-entity surfaces (`route_map`, `tool_map`, `shape_check`, `api_impact`), not the routine MCP exposure of an existing read-only preflight handler. The 002 implementation summary's appeal to ADR-012-003 to defer registration was a misapplication — re-reading the ADR confirms its scope is route/tool/consumer extraction, not handler-to-MCP wiring.
- Wiring is a mechanical 4-touchpoint addition, parallel to existing patterns (`codeGraphScan`, `codeGraphContext`, `cccStatus`): no new schema infrastructure, no new validation primitives, no new dispatcher patterns.
- Marking the handler INTERNAL would require rewriting 8 doc surfaces to disclaim a capability that is otherwise complete and tested — strictly more work than wiring it, and contrary to the operator-facing experience already published in 006/006.

**Evidence — files modified (WIRE path):**

| File | Change |
|------|--------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Added `'detect_changes'` to `TOOL_NAMES`; imported `handleDetectChanges`; added `case 'detect_changes'` dispatcher with `parseArgs` |