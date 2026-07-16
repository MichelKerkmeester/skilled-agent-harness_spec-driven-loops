---
title: "Verification Checklist: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "P0/P1/P2 verification gates for the net-new Code Graph seeded-PPR impact-ranking cluster - the active gates this phase verify the gated, sequenced plan (PPR-unbuilt confirmed, 027-substrate-reuse, Q3-C1-core-before-refinements, seed-union CUT). The implementation gates (bounded-budget termination, mode-gate single-hop byte-identity, undirected reach, Q4-C2 decay) are recorded for the build path."
trigger_phrases:
  - "seeded ppr impact ranking checklist"
  - "q3-c1 cluster verification"
  - "ppr termination budget checklist"
  - "class gated expansion mode gate checklist"
  - "027 weighted walk reuse verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author seeded-PPR verification checklist from 028/002 research"
    next_safe_action: "Verify the gated plan, hold the build gates behind the Q3-C1 core"
    blockers:
      - "Build gates blocked on the Q3-C1 PPR core + a code-graph retrieval benchmark"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)

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

> **Phase posture**: the PPR mechanism is built behind `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` (default OFF). Ranking-quality benefit, tuned damping/cap/decay values and temporal `invalid_at` current-set semantics remain pending because they require a retrieval benchmark or schema migration. Packet 030 was not touched.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md and updated to DONE-mechanism/default-off posture for implemented candidates
- [x] CHK-002 [P0] PPR-is-unbuilt baseline confirmed before implementation: `rg pagerank|personaliz|teleport|damping|ppr|random-walk` over the live code-graph returned no hits
- [x] CHK-003 [P0] 027 reuse target confirmed to exist and to accept generic string/number nodes through caller-provided weighted edge readers
- [x] CHK-004 [P1] Sequencing honored: Q3-C1 core, then class-gate, then undirected/Q4-C2 refinements
- [x] CHK-005 [P1] Roadmap caveat corrected: no old PageRank helper exists, the real reuse target is the weighted-walk substrate
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Production code changed only in the code-graph MCP scope requested: `code-graph-context.ts` and `query-intent-classifier.ts`
- [x] CHK-011 [P1] Typecheck passes: `npm run typecheck`
- [x] CHK-012 [P1] No second graph-walk engine authored - PPR spread calls the reused `collectWeightedWalk` built artifact
- [x] CHK-013 [P1] PPR ranking is reversible by the default-off `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag, single-hop stays flat when the gate is OFF
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] PPR termination property test passes in `code-graph-seeded-ppr-ranking.vitest.ts`
- [x] CHK-021 [P0] Mode-gate single-hop regression passes with the flag enabled, default flag-off baseline also stayed green
- [x] CHK-022 [P1] Gate-totality tests pass in `query-intent-classifier.vitest.ts`, ambiguous text fails PPR-OFF
- [x] CHK-023 [P1] Undirected-projection behavior covered by flagged multi-hop caller test
- [x] CHK-024 [P1] Q4-C2 decay test passes: INFERRED 2-hop ranks below OBSERVED 1-hop
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a finding class and status in spec.md/tasks.md, build candidates are DONE mechanism where implemented, with benchmark gates named
- [x] CHK-FIX-002 [P0] Producer inventory run before implementation: `rg -n 'expandAnchor|queryEdgesTo|blast_radius' .opencode/skills/system-code-graph/mcp_server --glob '*.ts'`
- [x] CHK-FIX-003 [P0] Reuse-target inventory read: Memory weighted-walk signatures are generic enough for a code-graph adapter
- [x] CHK-FIX-004 [P0] Cluster contract honored: Q3-C1 core landed before class-gate/undirected/Q4-C2 refinements, seed-union remains CUT
- [x] CHK-FIX-005 [P1] Adversarial cases covered or gated: isolated seed (empty result), undirected reach, neutral metadata, no schema migration, cap termination, ambiguous class PPR-OFF
- [x] CHK-FIX-006 [P1] Gate axes updated: Q3-C1 core/taxonomy built default-off, retrieval benchmark and temporal columns remain absent
- [x] CHK-FIX-007 [P1] Evidence pinned without touching packet 030, 030 remains a read-only shipped-record reference
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] PPR is a ranking re-order over existing structural edges - no new external data sink or content path
- [x] CHK-032 [P1] No new untrusted-content read path, context render path unchanged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/tasks/checklist/implementation-summary synchronized to implemented-default-off posture, decision-record remains valid
- [x] CHK-041 [P1] DONE-mechanism / benchmark-PENDING / CUT posture consistent across spec §3 and tasks Phase 2
- [x] CHK-042 [P2] Comment hygiene: no new spec/packet ids embedded in production comments
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created in the spec packet
- [x] CHK-051 [P1] No scratch cleanup required
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [x]/11 |
| P1 Items | 14 | [x]/14 |
| P2 Items | 5 | [x]/5 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] No schema migration - change re-orders existing edges and is reversible by flag/gate
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P0] PPR has a hard iteration cap and deadline checks inside the existing impact budget
- [x] CHK-111 [P1] Single-hop neighborhood/outline path adds zero PPR cost, gate short-circuits before any PPR walk
- [x] CHK-112 [P2] No live load benchmark run by instruction, broad deterministic vitest suite is green
- [x] CHK-113 [P2] Ranking-quality benefit number remains unclaimed, no code-graph retrieval benchmark exists campaign-wide
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented: leave `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` unset/false to retain flat path
- [x] CHK-121 [P1] Build gates resolved in order: Q3-C1 core before refinements
- [x] CHK-122 [P2] No new monitoring surface introduced
- [x] CHK-123 [P2] Branch-only, nothing pushed/deployed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No new untrusted-content read path
- [x] CHK-131 [P2] No new external dependency / license surface, existing local built artifact reused
- [x] CHK-132 [P2] CG-lexical-vector-seed-union is CUT - no vector backend introduced
- [x] CHK-133 [P2] Data handling unchanged, no schema/data migration
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] spec/tasks/checklist/implementation-summary synchronized, decision-record still describes the decisions
- [x] CHK-141 [P1] Candidate status consistent: five mechanism items done/default-off, vector seed union CUT
- [x] CHK-142 [P2] Baseline PPR-unbuilt + roadmap-caveat correction preserved as historical context
- [x] CHK-143 [P2] Research citations preserved
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Code Graph maintainer | Not requested for this in-session code change | 2026-06-19 |
| N/A | 028 packet owner | Not requested for this in-session code change | 2026-06-19 |
| Codex | Reviewer (adversarial verify) | Completed via deterministic tests + broad related suite | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
