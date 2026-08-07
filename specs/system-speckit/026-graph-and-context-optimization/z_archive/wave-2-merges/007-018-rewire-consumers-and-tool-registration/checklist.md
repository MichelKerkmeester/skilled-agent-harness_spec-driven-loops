---
title: "Checklist: Rewire consumers and tool registration"
description: "QA gates for Phase 004 import rewiring, test discovery, and plugin bridge path."
trigger_phrases:
  - "004 rewire consumers checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 004 verification checklist"
    next_safe_action: "Use green typecheck and Vitest smoke as baseline for later cleanup"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Rewire consumers and tool registration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. (final command exit recorded separately)
- [x] CHK-201 [P0] system-spec-kit typecheck exits 0. (`npx tsc --noEmit -p mcp_server/tsconfig.json`)
- [x] CHK-202 [P0] system-code-graph Vitest smoke exits 0. (1 file, 39 tests passed)
- [x] CHK-203 [P0] No stale TypeScript imports point to removed `system-spec-kit/mcp_server/code_graph/`. (`rg` old relative imports = 0)
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] ADR-001 Q3/Q4/Q5 reviewed. (co-resident MCP, stable IDs, sibling imports)
- [x] CHK-211 [P0] Import inventory completed with `rg`. (194 old consumer occurrences before rewrite)
- [x] CHK-212 [P1] Plugin loader path verified. (`.opencode/plugins/README.md`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Tool IDs unchanged. (`code_graph_*`, `ccc_*`, `detect_changes` preserved)
- [x] CHK-011 [P0] Tool schemas remain inline and behavior-neutral. (`tool-schemas.ts` not semantically changed)
- [x] CHK-012 [P1] Rewrites are path-only; no unrelated refactors. (imports/config/test discovery only)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] system-spec-kit typecheck run. (exit 0)
- [x] CHK-021 [P0] system-code-graph Vitest smoke run. (exit 0)
- [x] CHK-022 [P1] Import rewrite count recorded. (214 total import/path rewires)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Handlers rewired. (5 cross-subsystem handlers)
- [x] CHK-FIX-002 [P0] Hooks rewired. (memory surface, Claude, Gemini, Codex freshness)
- [x] CHK-FIX-003 [P0] External tests/mocks rewired. (all old relative code_graph imports cleared)
- [x] CHK-FIX-004 [P1] skill_advisor refs rewired. (freshness type and benches)
- [x] CHK-FIX-005 [P1] Vitest configs updated. (system-spec-kit excludes moved suites; system-code-graph includes them)
- [x] CHK-FIX-006 [P1] Plugin bridge path updated. (`BRIDGE_PATH` points to system-code-graph bridge)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets surfaced. (only local paths/counts)
- [x] CHK-221 [P0] No external network calls. (`npx` used installed local packages)
- [x] CHK-222 [P1] MCP server was not run. (typecheck/Vitest only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized. (all Phase 004 docs patched)
- [x] CHK-041 [P1] Implementation summary records command exits. (TS=0, Vitest=0)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] system-spec-kit no longer owns code-graph test discovery. (patterns removed from primary config)
- [x] CHK-231 [P0] system-code-graph owns moved test discovery. (tests and stress patterns enabled)
- [x] CHK-232 [P1] Plugin entrypoint placement matches loader expectations. (entrypoint remains in `.opencode/plugins/`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS |
| All P1 items | PASS |
| Strict validation | PASS |
| Typecheck | PASS (exit 0) |
| Vitest smoke | PASS (exit 0) |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] No runtime round trips added; direct imports remain direct function calls. (co-resident topology preserved)
<!-- /ANCHOR:perf-verify -->
