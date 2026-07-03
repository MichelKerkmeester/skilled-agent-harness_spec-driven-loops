---
title: "Verification Checklist: Phase 10 - Search Hot Path Performance"
description: "Level 2 verification gates for the search hot path performance phase - baseline-before-changes, perf targets, rank parity, cache correctness, and scan event-loop checks."
trigger_phrases:
  - "search hot path checklist"
  - "perf verification gates"
  - "rank parity check"
  - "p50 800ms gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/010-search-hot-path-performance"
    last_updated_at: "2026-07-03T11:54:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied plan-review remediation (008↔010 fence, REQ-003 FTS gate, continuity populated)"
    next_safe_action: "Capture latency baselines, then run the confirm-before-fix pass on 🟡 items"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-search-hot-path-performance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 10: search-hot-path-performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 with acceptance criteria)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (batch ordering + FIX ADDENDUM surfaces)
- [ ] CHK-003 [P1] Dependencies identified and available: 006 decision-record read (rescue + interference dispositions), 005 status known, corpus snapshot pinned for benchmarking
- [ ] CHK-004 [P0] Baseline captured BEFORE first hot-path commit: harness numbers (warm p50/p95, stage1/stage2, match_triggers, auto-surface, cold init, RSS, row count) + vitest whole-gate baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings (daemon logs clean during harness runs)
- [ ] CHK-012 [P1] Error handling implemented: cache miss/invalidation degrades to a correct rebuild path; embedder outage during memoization does not poison the cache
- [ ] CHK-013 [P1] Code follows project patterns: parameterized SQL only, chunked `id IN` lists, no ephemeral artifact labels (spec/finding ids) in code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-011; REQ-012 completed or deferred with reason)
- [ ] CHK-021 [P0] Manual testing complete: warm/cold CLI measurement, full-scan daemon log inspection
- [ ] CHK-022 [P1] Edge cases tested: empty candidate set, oversized `id IN` chunking, FTS adversarial tokens (quotes, NEAR/OR/-, unicode, empty), mtime change + rollback, DB rebind
- [ ] CHK-023 [P1] Error scenarios validated: cache invalidation on DB rebind, weak-result gate no-op case equals current behavior
- [ ] CHK-024 [P0] GATE: memory_search p50 < 800ms warm @33k rows on the fixed query set (baseline 2.0-2.9s)
- [ ] CHK-025 [P0] GATE: rank-parity fixture green across all batches; the FTS-routed backfill passes the adversarial token-equivalence table (matches the LIKE substring semantics it replaces — quotes, NEAR/OR/-, unicode, empty, no-op gate; divergence blocks completion, REQ-003); any weak-result-gate delta documented against the 006 contract
- [ ] CHK-026 [P1] match_triggers measured < 300ms warm on the same harness, or deviation recorded and attributed to phase 005 (baseline 2.3s warm / 17s cold)
- [ ] CHK-027 [P1] GATE: full scan completes with zero event-loop-lag warnings; scan wall time recorded before/after
- [ ] CHK-028 [P1] Before/after delta table recorded in implementation-summary.md (all report-class metrics included: stage split, auto-surface, cold init, RSS)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (N+1 SELECT, readFileSync-per-result, JSON round-trip, statSync classes — commands in plan.md FIX ADDENDUM).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (envelope consumers: formatters, hooks, CLI renderers).
- [ ] CHK-FIX-004 [P0] GATE: Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases; the FTS MATCH token-equivalence table proves the FTS-routed backfill matches the LIKE substring semantics it replaces — a divergence blocks completion (REQ-003), not report-only.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (query type x daemon state x corpus snapshot — plan.md FIX ADDENDUM).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (cache behavior across DB rebind; env-flag states for any gate flag).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: parameterized `id IN` batching; user tokens sanitized before FTS5 MATCH interpolation
- [ ] CHK-032 [P1] Cache isolation correct: all new caches keyed by DB identity, no cross-DB leakage after rebind; the NEW adjacency cache reuses 008's DB-identity keying scheme (008 T026, lands first) rather than re-fixing the memoryId-only bug here
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (targets, gate thresholds, and dispositions match across docs)
- [ ] CHK-041 [P1] Code comments adequate: durable WHY only; no packet/phase/finding ids in comments (comment-hygiene HARD BLOCK)
- [ ] CHK-042 [P2] README/ENV_REFERENCE updated if any new env flag was introduced (weak-result gate A/B flag, if 006 requires one)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (harness outputs, timing captures)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (keep only the baseline/after capture referenced by implementation-summary.md)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending — set when Phase 3 verification runs
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
