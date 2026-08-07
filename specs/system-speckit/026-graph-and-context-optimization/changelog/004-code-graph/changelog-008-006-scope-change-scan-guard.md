---
title: "Changelog: Scope-Change Guard [008-real-world-usefulness-test-planning/006-scope-change-scan-guard]"
description: "Chronological changelog for the Scope-Change Guard phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/006-scope-change-scan-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

Phase 005 broadens the F-002 safety guard from "candidate scan has zero nodes" to "candidate scan comes from a different scope fingerprint." That closes the live failure where a default-scope scan with a handful of fixture nodes could replace a populated skill-inclusive graph.

### Added

- Scope-change promotion guard in scan.ts compares stored and candidate scope fingerprints before full-scan reconciliation.
- forceScopeChange option exposed in public MCP schema, internal Zod schema, and allowed-key list.
- Regression tests for scope-mismatched nonzero scans, forced scope replacement, and same-scope dramatic shrink behavior.

### Changed

- Full-scan promotion now blocks with scope_change_scan_rejected when scope fingerprints differ over a populated graph, preserving prior graph totals.
- Scope-mismatched scans that also return zero candidate nodes report scope_change_scan_rejected rather than zero_node_scan_rejected for a more informative root cause.
- Legacy databases without stored scope metadata are not blocked; the next successful scan establishes metadata.

### Fixed

- Live failure where a default-scope scan with a handful of fixture nodes could replace a populated skill-inclusive graph.

### Verification

- Pre-change failing test run - PASS: new mismatch test failed before implementation with received ok.
- npm run build - PASS: exit 0.
- npx vitest run code_graph/tests/code-graph-scan.vitest.ts - PASS: 1 file, 36 tests.
- npx vitest run code_graph/tests/ - PASS: 20 files, 265 tests.
- npx vitest run tests/tool-input-schema.vitest.ts - PASS: 1 file, 86 tests.
- python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server - PASS with 6 warnings outside changed files.
- Child strict validation - PASS: exit 0.
- Parent strict validation - PASS: exit 0.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Add scope-change guard and blocked response. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Expose forceScopeChange. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Validate and allow forceScopeChange. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modified | Add scope guard regression tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Add schema acceptance coverage. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/006-scope-change-scan-guard/*` | Created | Add Phase 005 planning, ADR, checklist, and summary docs. |

### Follow-Ups

- Glob narrowing remains separate. The reused scope fingerprint does not include includeGlobs or excludeGlobs; that matches the council plan and can be hardened separately.
- Legacy DB first scan is allowed. Missing stored fingerprints do not block so existing databases can establish metadata on their next successful scan.
