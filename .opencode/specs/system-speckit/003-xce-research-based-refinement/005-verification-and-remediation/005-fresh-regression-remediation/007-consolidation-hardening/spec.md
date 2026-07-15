---
title: "Feature Specification: Consolidation Cycle Hardening"
description: "Remediate the two deep-review consolidation.ts findings deferred from 001 as a structural refactor: the read-only contradiction scan holds the BEGIN IMMEDIATE write lock (blocking other writers ~5s/cycle), and the DB handle is threaded inconsistently (latent atomicity risk). Both on the default-ON weekly consolidation cycle, so they need their own concurrency safety gate."
trigger_phrases:
  - "consolidation hardening"
  - "consolidation write-lock ordering"
  - "consolidation db handle consistency"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Implemented lock-ordering + handle-consistency, regression-tested"
    next_safe_action: "Orchestrator commits scoped; dist rebuild + recycle deferred"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-consolidation-hardening-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Consolidation Cycle Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented and test-gated (live activation deferred to a separate dist rebuild + recycle) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Source findings** | 2 (consolidation.ts read-only-scan-under-write-lock; inconsistent DB handle) |
| **Handoff Criteria** | Read-only scan no longer holds the write lock (concurrency test proves a concurrent write is not blocked during the scan); one DB connection used consistently; existing consolidation suite green with a captured baseline→after delta. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

These two findings were surfaced by the 027 fresh+regression deep-review (`../../review/fresh-regression-75/`) in sub-phase 001 and deferred there because they require a structural refactor of the exported consolidation cycle on a **default-ON path** — disproportionate to fold into a broad sweep, warranting a dedicated packet with its own concurrency gate.

**Scope Boundary**: only the two cited consolidation findings. No new consolidation behavior; cadence and decision semantics are preserved.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The weekly consolidation cycle (`mcp_server/lib/storage/consolidation.ts`) takes the exclusive `BEGIN IMMEDIATE` write lock and then, while holding it, runs an expensive read-only contradiction scan (O(n²) over up to 500 memories, ~5s budget) before any write — blocking every other writer (including this epic's new CLI front-doors sharing the DB) for the whole scan and risking `SQLITE_BUSY`. Separately, several functions accept a `database` parameter but read/write via the module-global handle; atomicity holds today only because they are the same connection — a latent landmine if init ever diverged. This packet removes both.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: `consolidation.ts` lock-ordering and handle-consistency; the minimal `causal-edges.ts` change needed to thread one handle (`getStaleEdges`/`updateEdge`/`countEdgesForNode`); regression tests.
**Out of scope**: changing consolidation cadence, decision rules, or the Hebbian math; anything outside the cited functions.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 — lock ordering**: run the read-only scan / cluster / bounds work BEFORE `BEGIN IMMEDIATE`; take the immediate lock only for the cadence re-check + Hebbian writes + `last_run_at`. Re-check the cadence guard after acquiring the lock (a concurrent cycle may have run).
- **R2 — handle consistency**: make consolidation use a single connection for both reads and writes — either drop the unused `database` params and rely on the module-global, or thread the handle into `updateEdge`/`countEdgesForNode`/`getStaleEdges` so the transaction provably covers its own reads.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A concurrency regression test proves a concurrent memory write is NOT blocked while the read-only scan runs (and was blocked before the fix).
- A handle-consistency test (or assertion) proves reads and writes share one connection within the cycle's transaction.
- Existing consolidation tests stay green; whole-area baseline→after delta reported (no regressions).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Default-ON path: a mistake changes cadence or transaction atomicity. Mitigate with the cadence re-check after lock acquisition and the concurrency + handle tests before any deploy.
- Daemon-lifecycle adjacency: verify via tests, never by recycling a live daemon.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Prefer dropping the unused `database` params (simpler) vs threading the handle (more explicit) for R2 — implementer picks based on the smallest safe diff.
<!-- /ANCHOR:questions -->
