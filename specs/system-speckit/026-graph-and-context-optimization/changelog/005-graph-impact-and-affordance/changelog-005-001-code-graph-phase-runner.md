---
title: "Code Graph Phase Runner and detect_changes Preflight"
description: "Typed phase-DAG runner wraps the structural-indexer scan flow. New read-only detect_changes handler maps git diff hunks to indexed symbols and refuses to answer when the graph is stale."
trigger_phrases:
  - "code graph phase runner"
  - "detect_changes preflight handler"
  - "phase DAG runner code graph"
  - "diff hunk symbol attribution"
  - "012/002 shipped"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/001-code-graph-phase-runner` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

The code-graph scan flow in `structural-indexer.ts` had all scan stages inlined with no phase abstraction. There was no way to declare phase dependencies, validate ordering or surface failure attribution. Separately, no handler existed to map a git diff to affected symbols. The entire `detect_changes` capability was missing from `code_graph/handlers/`.

A typed phase-DAG runner (`phase-runner.ts`) was introduced with a `Phase<I, O>` interface, Kahn's topological sort plus rejection of duplicate names, missing dependencies and cycles. The existing `indexFiles()` body was wrapped in four declared phases so backward-compatible exports are preserved. A custom unified-diff parser (`diff-parser.ts`) was built without adding a new npm dependency. A read-only `detect_changes` handler was built that maps diff hunks to overlapping indexed symbols and returns `status: 'blocked'` immediately when graph freshness is anything other than fresh. Four feature catalog and manual testing playbook entries were authored to document both the runner and the handler. All 19 tasks shipped and Wave-3 canonical verification captured `tsc --noEmit` at exit 0 and vitest at 90 passed with 3 skipped across 93 tests.

### Added

- `mcp_server/code_graph/lib/phase-runner.ts` with `Phase<I,O>` interface, `runPhases`, `topologicalSort` and `PhaseRunnerError` carrying `kind` discriminant and `phaseName` for failure attribution
- `mcp_server/code_graph/lib/diff-parser.ts` with `parseUnifiedDiff` returning a discriminated `DiffParseResult` union and `rangesOverlap` covering zero-length pure-add and pure-delete hunks
- `mcp_server/code_graph/handlers/detect-changes.ts` read-only preflight handler returning `{ status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`
- `mcp_server/code_graph/tests/phase-runner.test.ts` covering topological correctness, duplicate-name rejection, missing-dependency rejection, cycle detection, dependency-only output visibility and failure attribution (12 cases)
- `mcp_server/code_graph/tests/detect-changes.test.ts` covering blocked state on stale and empty readiness, symbol attribution for an overlap hunk, parse-error paths, output-contract shape and six diff-parser unit cases (15 cases)
- Feature catalog entries for `detect_changes` and the phase-DAG runner in `feature_catalog/03--discovery/` and `feature_catalog/14--pipeline-architecture/`
- Manual testing playbook entries for the same two categories in `manual_testing_playbook/03--discovery/` and `manual_testing_playbook/14--pipeline-architecture/`

### Changed

- `mcp_server/code_graph/lib/structural-indexer.ts` wraps the `indexFiles()` body in `runPhases` via four declared phases. Public exports and `IndexFilesResult` shape are preserved.
- `mcp_server/code_graph/handlers/index.ts` exports `handleDetectChanges` alongside the existing seven handler exports
- `detect_changes` blocks immediately on any non-fresh graph state and never returns an empty `affectedSymbols[]` without a `blockedReason`

### Fixed

- `indexFiles()` scan stages had no declared ordering contract, which meant phase failures gave no attribution. The phase runner now surfaces `phaseName` and `cause` in every failure.
- No existing callers were broken. The `IndexFilesResult` array-with-`preParseSkippedCount` shape was reattached after `runPhases` completes.

### Verification

- `tsc --noEmit` (mcp_server): exit 0 after the type-widening fix in commit c6e766dc5
- Vitest (Wave-3 canonical, 2026-04-25): 9 passed | 1 skipped (10 test files), 90 passed | 3 skipped (93 tests), 1.34s. The 1 skipped file is the documented SQL-mock describe block in `tests/memory/trust-badges.test.ts`. Both `phase-runner.test.ts` and `detect-changes.test.ts` are inside the 9 passed files with all cases passing.
- `validate.sh --strict`: FAILED on cosmetic template-section conformance only. Required Level-2 files are present, no `[TBD]` placeholders remain. Anchors balance. Tracked as deferred P2 cleanup.
- Pre-flight self-check (27 items): all PASS including handler registration, export preservation, stale-state guard wiring. Sub-phase 003 zone untouched at lines 80-100 of `structural-indexer.ts`.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/code_graph/lib/phase-runner.ts` | Created (NEW) | `Phase<I,O>` interface, `runPhases`, `topologicalSort`, `PhaseRunnerError` |
| `mcp_server/code_graph/lib/diff-parser.ts` | Created (NEW) | Custom unified-diff parser and `rangesOverlap` helper |
| `mcp_server/code_graph/handlers/detect-changes.ts` | Created (NEW) | Read-only preflight handler with P1 stale-guard |
| `mcp_server/code_graph/tests/phase-runner.test.ts` | Created (NEW) | 12 runner unit test cases |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | Created (NEW) | 15 handler safety and diff-parser unit cases |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Modified | `indexFiles()` body wrapped in `runPhases`. Public exports unchanged. |
| `mcp_server/code_graph/handlers/index.ts` | Modified | `handleDetectChanges` exported |
| `feature_catalog/03--discovery/04-detect-changes-preflight.md` | Created (NEW) | Feature catalog entry for `detect_changes` |
| `feature_catalog/14--pipeline-architecture/25-code-graph-phase-dag-runner.md` | Created (NEW) | Feature catalog entry for the phase-DAG runner |
| `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | Created (NEW) | Playbook entry EX-014 for `detect_changes` stale vs fresh walkthrough |
| `manual_testing_playbook/14--pipeline-architecture/271-code-graph-phase-dag-runner.md` | Created (NEW) | Playbook entry 271 for runner rejection and regression coverage |

### Follow-Ups

- Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <doc> --json` for each of the four catalog and playbook entries to confirm DQI score of 85 or higher. Structural template adherence was verified but no script-backed numeric score was captured.
- Add `detect_changes` to `tool-schemas.ts` MCP catalog so external clients see it in the tool list. The handler is exported but schema registration was intentionally out of scope for this phase.
- Combine `detect_changes` output with `code_graph_query({ operation: 'blast_radius' })` for full indirect-impact coverage. Symbol attribution in this phase uses pure line-range overlap only.
- Resolve cosmetic `validate.sh --strict` failure caused by extra section headers in the per-sub-phase scaffold. Tracked as deferred P2 cleanup.
