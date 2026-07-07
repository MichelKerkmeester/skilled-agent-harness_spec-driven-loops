---
title: "Implementation Summary: empty-graph first-time auto-establish"
description: "A fresh clone's empty code graph now builds itself on first read under the default end-user scope; maintainers who opted .opencode in keep the explicit scan gate. Verified with tsc, full vitest, alignment, and a dist rebuild."
trigger_phrases:
  - "empty graph auto scan summary"
  - "code graph auto-establish implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/012-empty-graph-first-time-auto-scan"
    last_updated_at: "2026-05-29T11:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Auto-establish shipped + verified"
    next_safe_action: "Restart the mk-code-index MCP server to load the rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `012-empty-graph-first-time-auto-scan` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh clone no longer has to run `code_graph_scan` by hand before the structural graph works. When the graph is empty and the active scope is the default end-user-code scope, the first read (`code_graph_query` / `code_graph_context`) now builds the index inline and answers — instead of returning a `blocked` payload. Maintainers who opt `.opencode` in (a large scope, like this repo) keep the explicit manual gate, so a quick query never silently kicks off a big all-of-`.opencode` scan.

### The gate
`ensureCodeGraphReady` gained a `firstTimeAutoEstablish` branch: it allows the guarded inline full scan when the graph is `empty`, the caller opted into a guarded inline full scan, and `isDefaultEndUserScope(resolveIndexScopePolicy())` is true. An empty graph has nothing to overwrite, so establishing it is safe; the default-scope check keeps it cheap and unsurprising. Populated/stale graphs are untouched — they keep the existing scope-fingerprint guard that protects against unsafe scope-mismatched rescans.

### The predicate
`isDefaultEndUserScope(policy)` returns true only when there are no `.opencode` opt-ins (skills/agents/commands/specs/plugins all off, and no per-skill allow-list). It is the single source of truth for "this is the cheap, safe-to-auto-build scope a fresh clone gets."

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/index-scope-policy.ts` | Modified | Added `isDefaultEndUserScope()` predicate |
| `mcp_server/lib/ensure-ready.ts` | Modified | `firstTimeAutoEstablish` gate in the guarded-full-scan path |
| `mcp_server/tests/code-graph-default-scope.vitest.ts` | Created | Predicate unit tests (4 cases) |
| `mcp_server/tests/ensure-ready.vitest.ts` | Modified | Auto-establish + still-blocked integration tests (env-stubbed); `vi.unstubAllEnvs()` guard |
| `mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` | Modified | Pinned the blocked-contract test to an opted-in scope |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly (one focused gate + a predicate), then verified: the predicate has deterministic unit tests using explicit env objects, and the gate has integration tests that stub `SPECKIT_CODE_GRAPH_INDEX_*` to drive both the auto-establish (default) and still-blocked (opted-in) paths. One existing stress test ("blocked-output contract on an empty graph") assumed empty-always-blocks; it was pinned to an opted-in scope so it still exercises the blocked contract under the new behavior. The gitignored `dist/` was rebuilt so a server restart serves the feature.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate auto-scan on empty + default scope only | Empty has nothing to overwrite (safe); default scope is small (cheap) and is the cloner case the operator wants to "just work" |
| Keep the manual gate when `.opencode` is opted in | A quick query must not silently trigger a large all-of-`.opencode` scan for maintainers |
| Did not change the default scope config | It is already correct: cloners get end-user code; `.opencode` stays opt-in. This repo's "everything" is an intentional env override |
| Excluded `detect_changes` | It deliberately opts out of inline indexing; staying strict (block on empty) is correct for a diff preflight |
| Reused the existing guarded full-scan path + 10s timeout | No new write surface or unbounded work; populated graphs keep the fingerprint guard |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p tsconfig.json` | PASS (0 errors) |
| `vitest run` (full suite, repo root) | PASS — 62 files, 583 passed, 1 skipped (+6 new tests) |
| Predicate unit tests | PASS (default true; skills/agents/commands/specs/plugins/list opt-in false) |
| Auto-establish integration (empty + default → indexFiles called, autoRescanSafety allowed) | PASS |
| Still-blocked integration (empty + opted-in → blocked, indexFiles not called) | PASS |
| `verify_alignment_drift.py` | PASS — 139 files, 0 violations |
| `dist` rebuild | PASS — `isDefaultEndUserScope` present in compiled `ensure-ready.js` + `index-scope-policy.js` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`dist/` is gitignored.** A running `mk-code-index` server must be restarted to pick up the feature.
2. **First auto-scan latency.** Under the default scope a very large `/src` could still take a few seconds on the first read; the 10s timeout + abort signal bound it (times out → returns blocked).
3. **`.opencode`-opted-in scopes (this repo) are unchanged** — they keep the manual `code_graph_scan` gate by design, so this repo's own empty graph still blocks until an explicit scan.
4. **Scope is read from env at request time.** Flipping `SPECKIT_CODE_GRAPH_INDEX_*` changes whether auto-establish applies on the next read.
<!-- /ANCHOR:limitations -->
