---
title: "Implementation Plan: Spec Kit Code Graph Decoupling"
description: "Plan for removing system-code-graph source imports from system-spec-kit MCP server."
trigger_phrases:
  - "020 plan"
  - "codegraph decoupling plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed through typecheck"
    next_safe_action: "Run vitest and strict validation"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spec Kit Code Graph Decoupling

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. Summary

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript, Node ESM, MCP stdio |
| Storage | SQLite plus readiness JSON marker |
| Testing | TypeScript typecheck and Vitest |
| Boundary | Shared contracts, file marker, MCP RPC |

The plan mirrors packet 019: remove runtime source coupling, preserve stable tool ids, and make the boundary auditable. The key design split is marker reads for startup paths and MCP RPC for request-time graph reads.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

- Definition of ready: import audit captured, 019 pattern read, 014/007 ADR-002 supersession documented.
- Definition of done: import audit returns 0, typechecks pass, moved tests compile under code-graph ownership, packet and parent validate.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. Architecture

### Components

- `@spec-kit/shared/code-graph-contracts`: neutral readiness/status/startup/ops contract types.
- `system-code-graph/mcp_server/lib/readiness-marker.ts`: marker writer refreshed on startup and status calls.
- `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`: marker reader plus `mk_code_index` MCP RPC wrapper.
- Spec-kit hooks: consume marker startup brief.
- Spec-kit handlers/session helpers: consume boundary marker/RPC functions.

### Data Flow

Code graph computes readiness and writes `.code-graph-readiness.json`. Spec-kit startup hooks read that file synchronously. Request-time code calls `code_graph_status` or `code_graph_context` through the MCP child process wrapper.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. Implementation Phases

| Phase | Work | Status |
|-------|------|--------|
| 1 | Audit imports, scaffold packet, write ADR | Complete |
| 2 | Move neutral types/contracts to shared | Complete |
| 3 | Move code-graph-owned tests | Complete |
| 4 | Add readiness marker write/read | Complete |
| 5 | Retrofit handlers and hooks to boundary/RPC | Complete |
| 6 | Verify import audit, typecheck, tests, strict validate | In progress |
| 7 | Commit and push scoped changes | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tool |
|-----------|-------|------|
| Static | Shared, spec-kit MCP, code-graph TS | `tsc --noEmit` |
| Audit | Spec-kit codegraph imports | `rg -n 'from.*system-code-graph' ...` |
| Unit | Updated spec-kit boundary consumers | Vitest targeted suites |
| Integration | Code-graph moved tests | Code-graph Vitest |
| Runtime | MCP list and hook smoke | CLI smoke commands |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk-code-index MCP launcher | Internal | Green | RPC verification cannot complete. |
| readiness marker path | Internal | Green | Startup hooks report unavailable graph state. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

Trigger rollback if typecheck or import audit cannot be restored without expanding scope. Revert the 020 commit(s) as a unit, then restore the previous ADR-002 sibling import policy. Do not roll back only the marker or only test moves.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Audit -> Shared contracts -> Marker/RPC -> Tests -> Validation -> Commit.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Medium | Complete |
| Implementation | High | Complete |
| Verification | Medium | In progress |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Revert the 020 commit(s), rebuild shared package, rerun import audit and typecheck.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
shared contracts
      |
      +-- code-graph marker writer
      |        |
      |        +-- marker JSON
      |
      +-- spec-kit boundary reader/RPC
               |
               +-- hooks
               +-- handlers
               +-- session helpers
```
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Import audit, typecheck, targeted Vitest, strict validation, commit.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- Audit clean.
- Static checks green.
- Validation green.
- Commit pushed.
<!-- /ANCHOR:milestones -->
