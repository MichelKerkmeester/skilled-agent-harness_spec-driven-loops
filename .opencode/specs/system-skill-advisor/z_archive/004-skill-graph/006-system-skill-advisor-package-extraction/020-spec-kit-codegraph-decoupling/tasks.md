---
title: "Tasks: Spec Kit Code Graph Decoupling"
description: "Task list for packet 020."
trigger_phrases:
  - "020 tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation tasks mostly complete"
    next_safe_action: "Run verification and mark checklist evidence"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Tasks: Spec Kit Code Graph Decoupling

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run spec-kit import audit and record Bucket A-E classification.
- [x] T002 Scaffold Level 3 packet 020 under canonical post-dissolution parent.
- [x] T003 Write ADR-001 superseding 014/007 ADR-002 direct-import allowance.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add `@spec-kit/shared/code-graph-contracts`.
- [x] T011 Move code-graph readiness/startup/status/ops contract types to shared.
- [x] T012 Update spec-kit and code-graph imports to the neutral package.

## Phase 3: Test Ownership

- [x] T020 Move code-graph-owned unit tests to `system-code-graph/mcp_server/tests`.
- [x] T021 Move degraded readiness stress test to `system-code-graph/mcp_server/stress_test/code-graph`.
- [x] T022 Update remaining spec-kit tests to mock the boundary rather than code-graph internals.

## Phase 4: Readiness Marker

- [x] T030 Add code-graph readiness marker writer.
- [x] T031 Refresh marker on code-graph startup and status calls.
- [x] T032 Add spec-kit marker reader and startup brief fallback.

## Phase 5: RPC Retrofit

- [x] T040 Add spec-kit `lib/code-graph-boundary.ts`.
- [x] T041 Convert memory context/search/session handlers to marker or MCP RPC.
- [x] T042 Convert startup hooks to marker-backed startup brief.
- [x] T043 Replace passive enrichment DB reads with `code_graph_context` RPC.
- [x] T044 Remove spec-kit `tsconfig` inclusion of code-graph sources.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Verify import audit returns 0.
- [x] T051 Run shared build.
- [x] T052 Run system-spec-kit typecheck.
- [x] T053 Run system-code-graph typecheck.
- [x] T054 Run target Vitest matrix.
- [x] T055 Strict validate packet and parent.
- [x] T056 Run MCP and hook smoke checks.
<!-- /ANCHOR:phase-3 -->

## Phase 7: Commit And Push

- [ ] T060 Stage only scoped 020 files.
- [ ] T061 Commit without `--no-verify`.
- [ ] T062 Push `main` to origin.

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification checks passed.
- [ ] Scoped commit created.
- [ ] Push to origin complete.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- ADR: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
