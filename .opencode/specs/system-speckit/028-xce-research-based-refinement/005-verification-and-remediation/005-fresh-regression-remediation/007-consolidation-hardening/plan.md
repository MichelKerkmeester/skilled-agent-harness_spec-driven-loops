---
title: "Implementation Plan: Consolidation Cycle Hardening"
description: "Reorder the consolidation cycle so the read-only scan runs before the write lock, and unify the DB handle, each behind a regression test. Default-ON path — concurrency-gated."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded consolidation-hardening plan"
    next_safe_action: "Implement R1 lock-ordering then R2 handle-consistency, each test-gated"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-consolidation-hardening-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Consolidation Cycle Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two fixes in `consolidation.ts` (+ a minimal `causal-edges.ts` change for R2): move the read-only scan ahead of `BEGIN IMMEDIATE`, and use one DB connection consistently. Each ships behind a regression test; cadence/atomicity semantics preserved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Capture the consolidation test baseline BEFORE edits; re-run after each fix; report baseline→after delta.
- A new concurrency test must FAIL on the old lock-ordering and PASS on the fix.
- No working-tree change outside `consolidation.ts`, `causal-edges.ts`, and the test files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`runConsolidationCycleIfEnabled` currently wraps the whole cycle (scan + cluster + bounds + Hebbian writes) under one immediate-lock transaction. The refactor splits it into a read-only PHASE 1 (no lock) and a write PHASE 2 (immediate lock, with a cadence re-check so a racing cycle cannot double-apply). The handle fix removes the read/write connection split that only works by coincidence today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **R1 lock-ordering**: locate the current `BEGIN IMMEDIATE` + scan (line numbers drifted after 001's Hebbian fixes — find by symptom); hoist the read-only scan/cluster/bounds before the lock; re-check cadence after acquiring it; commit with the concurrency test.
- **R2 handle-consistency**: make `getStaleEdges`/`updateEdge`/`countEdgesForNode` share the cycle's connection (drop unused params or thread the handle); commit with a handle/atomicity test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Vitest: (1) concurrency — start a cycle, assert a concurrent `INSERT`/write is not blocked during the scan window (fails on old code); (2) handle — assert the cycle's reads and writes occur on one connection / the transaction is atomic across them. Run the existing consolidation suite for the regression delta. No live-daemon recycle.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `mcp_server/lib/storage/consolidation.ts` + `mcp_server/lib/storage/causal-edges.ts` (for R2 handle threading).
- The existing consolidation vitest suite for the baseline.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is an isolated, test-gated commit — revert the commit to roll back. No schema/data migration. Validated entirely in tests; the live consolidation daemon path is untouched until a separate dist rebuild + recycle.
<!-- /ANCHOR:rollback -->
