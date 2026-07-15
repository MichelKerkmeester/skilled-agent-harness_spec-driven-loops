---
title: "Verification Checklist: FTS5 Default Lexical With Guardrails"
description: "Level 2 QA checklist for the FTS5 lexical default implementation."
trigger_phrases:
  - "fts5 lexical guardrail checklist"
  - "bm25 engine verification"
importance_tier: "high"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 verification checklist"
    next_safe_action: "Mark evidence after verification commands"
    blockers: []
    key_files:
      - "checklist.md"
---
# Verification Checklist: FTS5 Default Lexical With Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim complete until satisfied |
| **P1** | Required | Must complete or document why deferred |
| **P2** | Optional | May defer with rationale |
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Packet 013 recommendation read.
- [x] CHK-002 [P0] Frozen scope followed.
- [x] CHK-003 [P1] Existing dirty worktree treated as user-owned.
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared normalizer is single source for synonyms/stemming/query expansion.
- [x] CHK-011 [P0] `bm25-index.ts` remains present and backward-compatible.
- [x] CHK-012 [P0] RRF weights unchanged.
- [x] CHK-013 [P1] `packed-inmemory` remains a warning fallback, not a new storage implementation.
- [x] CHK-014 [P1] Full health report includes lexical engine and warm status.
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation passes.
- [x] CHK-021 [P0] Typecheck passes.
- [x] CHK-022 [P0] Golden overlap gate passes for gated classes.
- [x] CHK-023 [P0] `bm25-index`, `hybrid-search`, and `sqlite-fts` test suites pass.
- [x] CHK-024 [P1] Build passes.
- [x] CHK-025 [P1] Warmup integration probe confirms `auto` skips and `legacy-inmemory` warms.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All six requested guardrails implemented.
- [x] CHK-FIX-002 [P0] Golden fixture includes stemmer and identifier edge rows.
- [x] CHK-FIX-003 [P0] Tests that assert warm JS singleton behavior force legacy mode.
- [x] CHK-FIX-004 [P1] Env docs and architecture docs describe rollback behavior.
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added.
- [x] CHK-031 [P1] SQLite query inputs still flow through the shared FTS sanitizer.
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `ENV_REFERENCE.md` documents `SPECKIT_BM25_ENGINE`.
- [x] CHK-041 [P1] `embedder_architecture.md` has a lexical engine section.
- [x] CHK-042 [P1] Implementation summary records verification evidence.
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Writes stay inside frozen source/doc paths.
- [x] CHK-051 [P1] No `dist/` files included.
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-19
<!-- /ANCHOR:summary -->
