---
title: "Release Readiness 006: P1 and P2 Stress-Test Coverage Gap Closure"
description: "Eighteen vitest stress files added across code_graph and skill_advisor. All 36 P1 and P2 coverage gaps from the 042 audit are now closed. The stress suite grew from 38 files and 94 tests to 56 files and 159 tests, all passing in 46 seconds."
trigger_phrases:
  - "p1 p2 stress test remediation"
  - "fix stress test coverage gap"
  - "close 36 coverage gaps"
  - "stress suite p1 p2 closure"
  - "006-fix-stress-test-coverage-gap"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/006-fix-stress-test-coverage-gap` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness`

### Summary

After the 042 audit identified 54 total stress coverage gaps and packet 043 closed the 10 highest-priority ones, 36 P1 and P2 gaps remained: 6 features with thin direct coverage and 30 features with bounded but untested runtime surface. The stress backlog represented the final release-readiness risk for `code_graph` and `skill_advisor`.

Four sequential batches of cli-codex high-reasoning generation produced 18 new vitest stress files. Consolidation was applied wherever features share a natural test surface: one CCC integration file covers three features, one hooks-parity file covers four, one lifecycle file covers five. Each feature_id in 042's coverage matrix now reads `gap_classification=none`.

The stress suite grew from 38 files and 94 tests to 56 files and 159 tests, all passing at exit code 0 in 46 seconds. The release-readiness stress backlog for both subsystems is empty.

### Added

- Six direct stress files for P1 features: `code-graph-scan-stress.vitest.ts` (cg-003), `code-graph-context-stress.vitest.ts` (cg-007), `context-handler-normalization-stress.vitest.ts` (cg-008), `five-lane-fusion-stress.vitest.ts` (sa-019), `skill-projection-stress.vitest.ts` (sa-020), `advisor-recommend-handler-stress.vitest.ts` (sa-025)
- Five consolidated files for 10 P2-cg features: `manual-diagnostics-stress.vitest.ts`, `detect-changes-preflight-stress.vitest.ts`, `deep-loop-crud-stress.vitest.ts`, `ccc-integration-stress.vitest.ts`, `doctor-apply-mode-stress.vitest.ts`
- Seven consolidated files for 20 P2-sa features: `auto-indexing-derived-sync-stress.vitest.ts`, `lifecycle-routing-stress.vitest.ts`, `scorer-extras-stress.vitest.ts`, `mcp-diagnostics-stress.vitest.ts`, `hooks-parity-stress.vitest.ts`, `opencode-plugin-bridge-stress.vitest.ts`, `python-compat-stress.vitest.ts`
- `stress-test-synthesis.md` packet-local coverage report listing every file in `stress_test/` with results

### Changed

- 042 `coverage-matrix.csv`: 36 rows updated from P1 or P2 to `gap_classification=none`
- 042 `coverage-audit.md`: section 4.2 "Closed by 044" subsection added to record which packet resolved each gap

### Fixed

- `code_graph` and `skill_advisor` features with absent or thin stress coverage blocked release-readiness sign-off. All 36 gaps are now closed and the matrix confirms zero P1 or P2 rows remain.

### Verification

| Check | Result |
|-------|--------|
| 18 new `.vitest.ts` files exist on disk | PASS |
| Each file imports from real product source under `mcp_server/` | PASS |
| `npm run stress` exit code 0 | PASS |
| Test Files 56 passed (56) | PASS |
| Tests 159 passed (159) | PASS |
| Total stress-run duration at or below 120s NFR | PASS. 46.09s |
| 042 matrix updated for all 36 P1 and P2 ids | PASS. Python csv reader confirms 0 P1 or P2 rows |
| 042 audit section 4.2 "Closed by 044" subsection present | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts` (NEW) | Created | P1 direct stress for cg-003 code_graph_scan |
| `system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts` (NEW) | Created | P1 direct stress for cg-007 code_graph_context |
| `system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` (NEW) | Created | P1 direct stress for cg-008 context handler |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts` (NEW) | Created | P1 direct stress for sa-019 five-lane analytical fusion |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/skill-projection-stress.vitest.ts` (NEW) | Created | P1 direct stress for sa-020 skill-nodes projection |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts` (NEW) | Created | P1 direct stress for sa-025 advisor_recommend MCP handler |
| `system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for cg-004 verify and cg-005 status |
| `system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts` (NEW) | Created | P2 stress for cg-006 detect-changes preflight |
| `system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` (NEW) | Created | P2 stress for cg-017 doctor apply mode |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-008 through sa-011 |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-014 through sa-018 |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-022 and sa-023 |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-027 and sa-028 |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-030 through sa-033 |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` (NEW) | Created | P2 stress for sa-034 opencode plugin bridge |
| `system-skill-advisor/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts` (NEW) | Created | P2 consolidated stress for sa-035 and sa-036 |
| `stress-test-synthesis.md` (NEW) | Created | Comprehensive coverage report for every file in `stress_test/` |
| `005-stress-test/006-stress-coverage-audit-and-run/coverage-matrix.csv` | Modified | 36 rows updated to `gap_classification=none` |
| `005-stress-test/006-stress-coverage-audit-and-run/coverage-audit.md` | Modified | Section 4.2 "Closed by 044" subsection added |

### Follow-Ups

- Reconcile the catalog claim that sa-036 covers 52 cases against the checked-in regression fixture which has 51 cases. A docs packet can resolve the catalog-fixture drift without changing the test.
- The FIXME-tagged loose assertion in sa-011 (`syncDerivedMetadata` idempotence) requires a product change to sharpen. Track in a follow-on product packet.
- Perform a flake-soak run if CI reports intermittent failures. A single clean run was accepted. Repeated runs were deferred.
