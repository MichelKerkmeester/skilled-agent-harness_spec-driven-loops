---
title: "Code Graph Phase 008/005: Scope-Change Scan Guard"
description: "The F-002 scan-promotion guard was broadened from zero-node detection to scope-fingerprint comparison. Scope-mismatched full scans over populated graphs are now blocked unless the operator passes forceScopeChange: true."
trigger_phrases:
  - "scope-change guard"
  - "scope_change_scan_rejected"
  - "forceScopeChange"
  - "F-002 scope fingerprint guard"
  - "scan promotion blocked scope mismatch"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/005-scope-change-scan-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The F-002 zero-node scan-promotion guard only blocked the literal-zero edge case. Live MCP verification showed the original data-loss mode was still reachable when a default-scope scan returned a small nonzero graph and promoted over a populated broad-scope graph with tens of thousands of nodes.

The guard was broadened using a scope-fingerprint comparison. Before any full-scan reconciliation the handler reads the stored scope fingerprint and compares it to the candidate fingerprint. A mismatch over a populated graph returns `scope_change_scan_rejected`, preserves the prior graph totals. The operator is told to rerun with `forceScopeChange: true` when replacement is intentional. The `forceScopeChange` field was added to the public JSON schema, the internal Zod schema, plus the allowed-key list alongside the existing `forceZeroNodeReset`. Legacy databases without stored fingerprints are not blocked so first-scan behavior is preserved.

### Added

- `scopeChangePromotionBlocked` predicate in `scan.ts` applied before the zero-node guard
- Blocked response preserving prior graph totals and including `scope_change_scan_rejected` reason
- `forceScopeChange` boolean field on the public `code_graph_scan` JSON schema
- `forceScopeChange` field in the internal Zod input validation schema and allowed-key list
- Regression test: nonzero scope-mismatch full scan blocked without `forceScopeChange`
- Regression test: forced scope replacement with `forceScopeChange: true` succeeds and updates stored scope metadata
- Regression test: same-scope dramatic shrink is allowed (proves the guard is not ratio-based)

### Changed

- Scan-promotion guard order: scope-mismatch check now runs before zero-node check so `scope_change_scan_rejected` is returned when both conditions apply (more informative root cause first)

### Fixed

- Full scans from a different scope (fewer directories, no skill paths) could silently replace a populated broad-scope graph when the candidate node count was nonzero. The scope-fingerprint guard closes this data-loss path.

### Verification

| Check | Result |
|-------|--------|
| Pre-change failing test | PASS: new mismatch test failed before implementation with `expected 'ok' to be 'blocked'` |
| `npm run build` | PASS: exit 0 |
| `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` | PASS: 1 file, 36 tests |
| `npx vitest run code_graph/tests/` | PASS: 20 files, 265 tests |
| `npx vitest run tests/tool-input-schema.vitest.ts` | PASS: 1 file, 86 tests |
| `verify_alignment_drift.py --root mcp_server` | PASS with 6 warnings outside changed files |
| Child strict validation (`validate.sh --strict`) | PASS: exit 0 |
| Parent strict validation (`validate.sh --strict`) | PASS: exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Added `scopeChangePromotionBlocked` guard and blocked response before the zero-node guard. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Modified | Exposed `forceScopeChange` on `code_graph_scan`. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Added three scope-guard regression tests (mismatch, forced replacement, same-scope shrink). |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Added `forceScopeChange` to Zod schema and allowed-key list. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Added schema acceptance coverage for `forceScopeChange`. |

### Follow-Ups

- Glob narrowing remains a separate hardening item. The scope fingerprint does not include `includeGlobs` or `excludeGlobs`. The council marked that as a follow-on task.
- Legacy DB first-scan behavior relies on `getStoredCodeGraphScope()` returning null to skip the guard. Verify this path is covered once the code-graph package has full isolation tests.
