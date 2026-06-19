---
title: "Verification Checklist: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "P0/P1/P2 verification gates for the DEFER-speculative Code Graph schema-migration cluster — the active gates this phase verify the DEFER decision and the gated plan; the implementation gates are recorded for the un-defer path (atomic co-ship, apply-once G2 invariant, live-view chokepoint)."
trigger_phrases:
  - "code edge bitemporal checklist"
  - "q1-c1 cluster verification"
  - "apply-once g2 invariant checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author code-edge-bitemporal verification checklist from 028/002 research"
    next_safe_action: "Verify the DEFER decision + gated plan; hold implementation gates"
    blockers:
      - "Implementation gates blocked on Q6-C1 + a named as-of consumer"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Phase posture**: this cluster is DEFER-speculative and ships no migration. The ACTIVE gates this phase are the DEFER decision + the gated-plan docs. The implementation gates (marked "IF un-deferred") are recorded for the un-defer path and are NOT exercised now.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..008, all gated)
- [ ] CHK-002 [P0] DEFER-speculative decision recorded with evidence (no as-of consumer; redundant with readiness gate; does not fix the real bug) — decision-record.md ADR-001
- [ ] CHK-003 [P1] Sequencing defined in plan.md (Q6-C1 + closed-vocab first → Q1-C1 + views atomic → edge-lifecycle → timeline)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No production code changed this phase (cluster deferred; ships nothing) — confirmed
- [ ] CHK-011 [P1] (IF un-deferred) Typecheck/build passes (`tsc` on the code-graph package)
- [ ] CHK-012 [P1] (IF un-deferred) Additive columns nullable + forward-compatible; views droppable
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] (IF un-deferred) apply-once G2 invariant test: no-change rescan = no-op (same ids, windows, generation)
- [ ] CHK-021 [P0] (IF un-deferred) non-destructive supersede test: reindex UPDATEs `invalid_at`, INSERTs new, deletes nothing; as-of read resolves the closed edge
- [ ] CHK-022 [P1] (IF un-deferred) live-view chokepoint test: default reads see only `invalid_at IS NULL`; only the timeline reader bypasses
- [ ] CHK-023 [P1] (IF un-deferred) unsatisfiable-generation test: surfaces ERROR, never silently-stale
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: Q1-C1 = `schema/matrix`; Q1-C1-views = `architecture (read chokepoint)`; CG-edge-bitemporal-lifecycle = `schema/matrix (REFUTED standalone)`; CG-symbol-timeline-query = `read (no-consumer)`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'DELETE FROM code_edges|DELETE FROM code_nodes|pruneDanglingEdges|replaceEdges|replaceNodes' .` (every site that physically removes an edge must be rerouted IF un-deferred).
- [ ] CHK-FIX-003 [P0] Consumer inventory for `invalid_at`/`valid_at`/`code_edges_live`/`code_nodes_live`/`generation` across `*.ts` (default readers must route through the live-view).
- [ ] CHK-FIX-004 [P0] apply-once G2 invariant stated as the unifying constraint (rescan of unchanged content = no-op); adversarial cases (crash mid-migration rollback, non-existent generation, legacy out-of-vocab edge_type) listed.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {edge changed | unchanged} × {current | superseded} × {default read | as-of read}.
- [ ] CHK-FIX-006 [P1] DEFER gate axes confirmed unmet: {as-of consumer: none} × {Q6-C1: not built} × {closed-vocab: not built}.
- [ ] CHK-FIX-007 [P1] Evidence pinned: 030 §14 (Q4-C1 only shipped; Q1-C1 DEFER-speculative); 002 iter-013/018/023 cited.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced (no code changed)
- [ ] CHK-031 [P0] Temporal columns would carry generation values/timestamps only — no recalled-content surface
- [ ] CHK-032 [P1] No new untrusted-content read path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [ ] CHK-041 [P1] DEFER-speculative posture consistent across spec §3, tasks notation, and 030 §14 reference
- [ ] CHK-042 [P2] Comment hygiene: no spec/packet ids embedded in production comments (N/A — no code changed)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 DEFER-speculative, ADR-002 atomic co-ship + live-view chokepoint, ADR-003 standalone lifecycle REFUTED, ADR-004 shared C3-B shape)
- [ ] CHK-101 [P1] All ADRs have status (ADR-001/002/003/004 = Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (build-now-speculatively, Q1-C1-without-views, standalone-edge-versioning, fork-the-shape all scored + rejected)
- [ ] CHK-103 [P2] Migration path documented: Q1-C1 columns additive/nullable, views droppable, one atomic SCHEMA_VERSION 5->6 commit
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] (IF un-deferred) live-view layer + apply-once invariant: no-change rescan = no write amplification
- [ ] CHK-111 [P2] (IF un-deferred) as-of read path adds no required index on the default read
- [ ] CHK-112 [P2] No load regression this phase (no code changed)
- [ ] CHK-113 [P2] Benefit number is structural inference only (no benchmark exists per research §6) — documented, not claimed
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented: this phase ships nothing; IF built, revert the single atomic SCHEMA_VERSION 5->6 migration (plan.md §7)
- [ ] CHK-121 [P1] Gate dependencies confirmed unmet (Q6-C1, closed-vocab, named consumer) before any implementation task starts
- [ ] CHK-122 [P2] No new monitoring surface introduced
- [ ] CHK-123 [P2] Branch-only; nothing pushed/deployed without explicit user go
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No new untrusted-content read path
- [ ] CHK-131 [P2] No new external dependency / license surface
- [ ] CHK-132 [P2] Temporal columns would carry generation values/timestamps only — no PII / content
- [ ] CHK-133 [P2] Data handling unchanged (no code changed this phase)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [ ] CHK-141 [P1] Candidate status (all PENDING gated) consistent across spec §3, tasks Phase 2, and 030 §14 reference
- [ ] CHK-142 [P2] Standalone-REFUTED note carried into both spec.md §3 and decision-record ADR-003
- [ ] CHK-143 [P2] Research citations (file:line + [CONFIRMED]/[INFERRED] + iter refs) preserved
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Pending] | Code Graph maintainer | [ ] Approved | |
| [Pending] | 028 packet owner | [ ] Approved | |
| [Pending] | Reviewer (adversarial verify) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
