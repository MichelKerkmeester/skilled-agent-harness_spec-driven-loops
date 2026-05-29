---
title: "Feature Specification: empty-graph first-time auto-establish (default scope only)"
description: "On a read, auto-build the code graph the first time it is empty — but only under the default end-user-code scope. A fresh clone 'just works'; a maintainer who opted .opencode in keeps the explicit code_graph_scan gate so a quick query never triggers a large scan."
trigger_phrases:
  - "empty graph auto scan"
  - "code graph first-time auto-establish"
  - "026 004 012 auto scan"
  - "auto reindex empty graph"
  - "isDefaultEndUserScope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/012-empty-graph-first-time-auto-scan"
    last_updated_at: "2026-05-29T11:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + verified empty-graph auto-establish"
    next_safe_action: "Optional: restart the mk-code-index MCP server to load the rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Auto-scan always, or gated? Gated: only empty + default end-user scope (operator-confirmed)."
      - "Change the default scope? No — default (end-user code, .opencode opt-in) is correct for cloners; this repo intentionally overrides it on."
---
# Feature Specification: Empty-Graph First-Time Auto-Establish

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/004-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When the code graph is empty (never built, or reset), the read tools (`code_graph_query`, `code_graph_context`) return `status:"blocked"` with `requiredAction: code_graph_scan` — they never build the index themselves. For a fresh repo clone (whose scope is just its own `/src` code), that forces a manual scan before the graph is useful, even though building from empty is safe (nothing to overwrite).

### Purpose
Make a fresh clone "just work": on the first read of an empty graph, auto-build the index — but only under the default end-user-code scope, so maintainers who opted `.opencode` in (a large scope) keep the explicit manual gate and a quick query never silently triggers a big scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-path gate that allows a guarded inline full scan when the graph is empty AND the active scope is the default end-user-code scope.
- A reusable `isDefaultEndUserScope()` predicate on the scope policy.
- Regression tests for the predicate and the gate (both the auto-establish and the still-blocked path).

### Out of Scope
- Changing the default scope config (it is already correct: end-user code, `.opencode` opt-in). Not touched.
- Auto-scanning populated/stale graphs (the existing scope-fingerprint guard still governs those).
- Auto-scanning when `.opencode` is opted in (large scope keeps the manual gate by design).
- `detect_changes` (it deliberately opts out of inline indexing and stays strict).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/index-scope-policy.ts` | Modify | Add `isDefaultEndUserScope()` predicate |
| `mcp_server/lib/ensure-ready.ts` | Modify | `firstTimeAutoEstablish` gate in the guarded-full-scan path |
| `mcp_server/tests/code-graph-default-scope.vitest.ts` | Create | Unit tests for the predicate |
| `mcp_server/tests/ensure-ready.vitest.ts` | Modify | Integration tests (auto-establish + still-blocked) |
| `mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts` | Modify | Pin its blocked-contract test to an opted-in scope |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Auto-establish must never run on a populated graph (no data loss) | Gate requires `freshness === 'empty'`; populated/stale graphs keep the scope-fingerprint guard (verified by existing guarded tests) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Auto-establish only under the default end-user-code scope | `isDefaultEndUserScope` true only when no `.opencode` opt-ins; empty + opted-in still blocks (test) |
| REQ-003 | Empty + default scope + guarded read path auto-scans without an explicit `code_graph_scan` | Integration test asserts `indexFiles` called + `autoRescanSafety: 'allowed'` |
| REQ-004 | The default scope config is unchanged | No edit to scope defaults; cloners keep end-user-code scope, `.opencode` stays opt-in |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh clone (default scope) gets an answer on first read of an empty graph instead of a `blocked` payload.
- **SC-002**: A `.opencode`-opted-in (large) scope still returns `blocked` on an empty graph (no surprise big scan).
- **SC-003**: `tsc` clean, full vitest suite green, alignment-drift PASS, packet `validate.sh --strict` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A first auto-scan under default scope could still be large for a big `/src` | Low | 10s `AUTO_INDEX_TIMEOUT_MS` caps it (+ the BUG-06 abort signal); times out → returns blocked |
| Risk | Auto-establishing on the wrong (mismatched) scope | Low | Gated to empty graphs (nothing to overwrite) + default scope only; populated graphs keep the fingerprint guard |
| Dependency | `resolveIndexScopePolicy()` reads env to determine the active scope | Low | Already the source of truth; tests stub env deterministically |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate adds only a cheap flag check (`isDefaultEndUserScope`) on the read path; no filesystem walk is added to the decision.

### Security
- **NFR-S01**: No new write surface — auto-establish reuses the existing guarded full-scan path and timeout; populated graphs are never auto-replaced.

### Reliability
- **NFR-R01**: The false-safe contract holds — auto-establish makes the graph fresh BEFORE answering; it never answers over a non-fresh graph.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty graph + default scope: auto-establishes (scans, then answers).
- Empty graph + `.opencode` opted in: blocks (manual gate).
- Populated/stale graph: unchanged — scope-fingerprint guard governs.

### Error Scenarios
- Auto-scan times out (10s): returns the existing blocked/stale envelope; no partial data is served as authoritative.
- `detect_changes` on empty: still blocks (does not opt into guarded inline scan).

### State Transitions
- First read after a reset (empty, default scope) → auto-establish → fresh → answers.
- Per-call scan scope (`scan-argument`) is unaffected (handled by the existing FIX-009-v3 path).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 2 source files (~30 LOC) + 3 test files; 1 skill |
| Risk | 14/25 | Touches the safety-sensitive auto-rescan path; mitigated by empty-only + default-scope gating |
| Research | 6/20 | Behavior + scope policy already understood from the 004 audit |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope-config intent (cloners = end-user code; this repo opts `.opencode` in) is recorded in memory `code-graph-scope-intent`.
<!-- /ANCHOR:questions -->
