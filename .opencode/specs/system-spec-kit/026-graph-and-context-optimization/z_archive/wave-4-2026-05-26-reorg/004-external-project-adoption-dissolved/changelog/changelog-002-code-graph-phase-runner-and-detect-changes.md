---
title: "Phase 002: code-graph-phase-runner-and-detect-changes"
description: "Code Graph gained a typed phase runner, a custom unified-diff parser, a read-only detect_changes handler and packet-local docs."
trigger_phrases:
  - "phase 002 changelog"
  - "code graph phase runner detect_changes"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes` (Level 2)
> Parent packet: `026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 002 built the Code Graph foundation for changed-impact analysis. `indexFiles()` now runs through a typed phase runner with explicit dependencies and failure attribution. A custom unified-diff parser and read-only `detect_changes` handler map fresh diff hunks to indexed symbols. The handler blocks on stale graph readiness instead of returning false-safe empty impact.

### Added

- `Phase<I, O>` contract, `topologicalSort()` and `runPhases()` in `code_graph/lib/phase-runner.ts`.
- Custom `parseUnifiedDiff()` and `rangesOverlap()` helpers in `code_graph/lib/diff-parser.ts`.
- Read-only `handleDetectChanges` handler with `status`, `affectedSymbols`, `affectedFiles`, `blockedReason`, `timestamp` and readiness output.
- Four packet-local docs under feature catalog and manual testing playbook paths.

### Changed

- `indexFiles()` now declares `find-candidates`, `parse-candidates`, `finalize` and `emit-metrics` phases.
- Existing `IndexFilesResult` shape stays backward compatible after runner wrapping.
- Handler registration exports `handleDetectChanges` from `code_graph/handlers/index.ts`.
- Review remediation later wired `detect_changes` as a callable MCP tool across schemas and dispatcher.

### Fixed

- Code Graph scan failures now carry phase-level attribution.
- Stale graph readiness now returns `status: "blocked"` before diff parsing or outline lookup.
- Review remediation later fixed canonical-root path containment and multi-file hunk boundaries.
- Review remediation later added duplicate-output rejection to the phase runner.

### Verification

- Wave-3 evidence: `cd mcp_server && npx --no-install tsc --noEmit` exited 0.
- Wave-3 evidence: phase test set reported 9 passed and 1 skipped test file, with 90 passed and 3 skipped tests.
- 002 surfaces `phase-runner.test.ts` and `detect-changes.test.ts` were inside the passed files.
- `validate.sh --strict` failed on template-section conformance only, classified as cosmetic.
- Git history for this directory includes `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code_graph/lib/phase-runner.ts` | Typed runner, topo sort and runner errors. |
| `mcp_server/code_graph/lib/diff-parser.ts` | Unified-diff parser and overlap helper. |
| `mcp_server/code_graph/handlers/detect-changes.ts` | Read-only impact preflight handler. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | `indexFiles()` wrapped in declared phases. |
| `mcp_server/code_graph/handlers/index.ts` | `handleDetectChanges` exported. |
| `mcp_server/code_graph/tests/phase-runner.test.ts` | Runner rejection and success cases. |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | Safety, parser and attribution coverage. |
| `feature_catalog/03--discovery/04-detect-changes-preflight.md` | Catalog entry. |
| `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | Manual scenario. |

### Follow-Ups

- Historical strict validator debt remains template-section style, not missing content.
- 008 research later found a mixed-header diff path bypass for downstream remediation.
