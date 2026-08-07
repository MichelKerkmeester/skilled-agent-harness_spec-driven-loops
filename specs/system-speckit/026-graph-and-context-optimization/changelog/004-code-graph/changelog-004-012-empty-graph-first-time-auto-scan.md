---
title: "Code Graph Phase 012: Empty-Graph First-Time Auto-Establish"
description: "Fresh clones no longer need a manual code_graph_scan before the structural graph works. A new gate in ensureCodeGraphReady auto-builds the index on first read when the graph is empty and the active scope is the default end-user scope. Opted-in scopes keep the explicit manual gate."
trigger_phrases:
  - "empty graph auto-establish"
  - "first-time auto scan code graph"
  - "isDefaultEndUserScope predicate"
  - "code graph fresh clone setup"
  - "auto-build index on first read"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/012-empty-graph-first-time-auto-scan` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph`

### Summary

Read tools (`code_graph_query`, `code_graph_context`) returned a `blocked` payload when the code graph had never been built, forcing users of a fresh clone to run `code_graph_scan` by hand before the graph was useful. Building from an empty graph is safe because nothing gets overwritten. Under the default end-user-code scope the scan is also small and predictable.

A `firstTimeAutoEstablish` gate was added to `ensureCodeGraphReady`. The gate requires three conditions: the graph is empty, the caller opts into a guarded inline full scan, `isDefaultEndUserScope()` returns true. A new reusable `isDefaultEndUserScope()` predicate on the scope policy is the single source of truth: it returns true only when no `.opencode` opt-ins are active. Maintainers who have opted `.opencode` in keep the explicit manual gate so a quick query never silently triggers a large all-of-`.opencode` scan. Populated and stale graphs are untouched and continue to use the existing scope-fingerprint guard.

Six tests (4 predicate unit tests, 2 integration tests) were added. One existing stress test was pinned to an opted-in scope so it continues to exercise the blocked contract under the new behavior. The compiled `dist/` was rebuilt to serve the feature on server restart.

### Added

- `isDefaultEndUserScope()` predicate in `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`
- `firstTimeAutoEstablish` branch in `ensureCodeGraphReady` (`.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts`)
- Predicate unit test file `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-default-scope.vitest.ts` (NEW, 4 cases)

### Changed

- `ensureCodeGraphReady` now auto-builds the index on first read when the graph is empty and the active scope is the default end-user scope. Previously it always returned `blocked` on an empty graph.
- `mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` blocked-contract test pinned to an opted-in scope to stay valid under the new gate.

### Fixed

- Fresh clones returned a `blocked` payload on every read until the operator ran an explicit `code_graph_scan`. The `firstTimeAutoEstablish` gate fixes this for the default end-user scope.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p tsconfig.json` | PASS (0 errors) |
| `vitest run` (full suite, repo root) | PASS. 62 files, 583 passed, 1 skipped (+6 new tests) |
| Predicate unit tests | PASS (default true. skills/agents/commands/specs/plugins/list opt-in false) |
| Auto-establish integration (empty + default → indexFiles called, autoRescanSafety allowed) | PASS |
| Still-blocked integration (empty + opted-in → blocked, indexFiles not called) | PASS |
| `verify_alignment_drift.py` | PASS. 139 files, 0 violations |
| `dist` rebuild | PASS. `isDefaultEndUserScope` present in compiled `ensure-ready.js` and `index-scope-policy.js` |
| Strict packet validation (`validate.sh --strict`) | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts` | `isDefaultEndUserScope()` predicate added. Returns true only when no `.opencode` opt-ins are active. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` | `firstTimeAutoEstablish` gate added to the guarded-full-scan path. Allows inline scan on empty + default scope. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-default-scope.vitest.ts` (NEW) | Predicate unit tests. 4 cases: default true, skills opt-in false, agents opt-in false, per-skill allow-list opt-in false. |
| `.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts` | Auto-establish and still-blocked integration tests added. Env-stubbed with `SPECKIT_CODE_GRAPH_INDEX_*`. `vi.unstubAllEnvs()` guard added. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` | Blocked-contract test pinned to an opted-in scope to keep the contract valid under the new gate. |

### Follow-Ups

- Restart the `mk-code-index` MCP server after pulling to load the compiled `dist/` (the `dist/` directory is gitignored and is not shipped in the repo).
- First auto-scan latency: under the default scope a very large `/src` could take a few seconds on first read. The 10s `AUTO_INDEX_TIMEOUT_MS` cap and abort signal bound it (timeout returns `blocked`).
- Opted-in scopes (this repo) keep the manual `code_graph_scan` gate by design. This repo's own empty graph still blocks until an explicit scan.
- Scope is read from env at request time. Flipping `SPECKIT_CODE_GRAPH_INDEX_*` changes whether auto-establish applies on the next read.
