---
title: "Verification Checklist: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "P0/P1/P2 verification gates for the net-new Code Graph seeded-PPR impact-ranking cluster — the active gates this phase verify the gated, sequenced plan (PPR-unbuilt confirmed, 027-substrate-reuse, Q3-C1-core-before-refinements, seed-union CUT). The implementation gates (bounded-budget termination, mode-gate single-hop byte-identity, undirected reach, Q4-C2 decay) are recorded for the build path."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author seeded-PPR verification checklist from 028/002 research"
    next_safe_action: "Verify the gated plan; hold the build gates behind the Q3-C1 core"
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
    completion_pct: 0
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

> **Phase posture**: this is a re-plan. PPR is net-new and UNBUILT (grep-confirmed); none of the cluster shipped in 030. The ACTIVE gates this phase are the plan-time confirmations + the gated-plan docs. The implementation gates (marked "IF built") are recorded for the build path and are NOT exercised now. The PPR ranking-QUALITY claim and the damping/cap/decay parameter VALUES are blocked on a code-graph retrieval benchmark that does not exist campaign-wide — the mechanism ships with safe defaults, the quality claim does not.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007; all PENDING/gated)
- [ ] CHK-002 [P0] PPR-is-unbuilt confirmed: `rg pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits (this is a net-new build, not a wiring of a dormant helper) — spec §2; tasks T001
- [ ] CHK-003 [P0] 027 reuse target confirmed to EXIST: `collectWeightedWalk`/`collectCausalWeightedNeighbors` in `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` — tasks T002; ADR-001
- [ ] CHK-004 [P1] Sequencing defined in plan.md (reuse-confirm → Q3-C1 PPR core → class-gate; undirected + Q4-C2 parallel after the core)
- [ ] CHK-005 [P1] Roadmap caveat corrected: no "old PageRank helper to wire" exists in either MCP; the real reuse target is the weighted-walk substrate — spec §2/§12; tasks T003
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No production code changed this phase (re-plan; ships nothing) — confirmed
- [ ] CHK-011 [P1] (IF built) Typecheck/build passes (`tsc` on the code-graph package)
- [ ] CHK-012 [P1] (IF built) No second graph-walk engine authored — the spread runs over 027's REUSED `collectWeightedWalk` (REQ-001; tasks T011/T065)
- [ ] CHK-013 [P1] (IF built) PPR ranking is reversible by a default-off flag; the cheap single-hop default is byte-identical with the flag off or the gate OFF (NFR-R01)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] (IF built) PPR termination property test: always stops by the iteration cap, inside the 400ms budget; a budget cut returns the best PPR-ranked prefix (REQ-002; SC-003)
- [ ] CHK-021 [P0] (IF built) Mode-gate single-hop byte-identity regression: the single-hop neighborhood/outline output is byte-identical to the captured baseline (REQ-003; NFR-P02; SC-002)
- [ ] CHK-022 [P1] (IF built) Gate-totality property test: every query routes PPR-ON or PPR-OFF; an ambiguous class ⇒ PPR-OFF (REQ-003; spec §8)
- [ ] CHK-023 [P1] (IF built) Undirected-projection test: a leaf seed reaches its blast-radius callers (REQ-004; SC-001)
- [ ] CHK-024 [P1] (IF built) Q4-C2 decay test: an INFERRED 2-hop path ranks below an OBSERVED 1-hop path via the reused `reliability` factor (REQ-005; US-004)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: Q3-C1 / Q3-C1-seeded-PPR = `ranking (net-new primitive)`; CG-class-gated-expansion = `precision-gate (new taxonomy)`; CG-undirected-projection = `directionality (associative reach)`; Q4-C2 = `ranking (transition-weight decay)`; CG-lexical-vector-seed-union = `scope-violation (CUT/NO-GO)`.
- [ ] CHK-FIX-002 [P0] Producer inventory for the impact-walk order: `rg -n 'expandAnchor|queryEdgesTo|blast_radius' .opencode/skills/system-code-graph/mcp_server --glob '*.ts'` (every site that orders impact results must read PPR-ordered when the gate is ON).
- [ ] CHK-FIX-003 [P0] Reuse-target inventory: read the `collectWeightedWalk`/`collectCausalWeightedNeighbors` signatures in `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` and confirm node/edge-shape compatibility BEFORE writing PPR (the reuse-confirmation gate fails CLOSED) — tasks T005.
- [ ] CHK-FIX-004 [P0] Cluster contract stated: Q3-C1 core lands FIRST; class-gate + undirected + Q4-C2 refine the built core (they "refine a non-existent feature" if built first, iter-14); seed-union is CUT, not deferred.
- [ ] CHK-FIX-005 [P1] Adversarial cases listed: isolated-seed (no spread), leaf-seed-under-directed (mass sinks → undirected fix), no-trust-metadata edge (neutral, no demotion), `invalid_at` absent (degrade to physical-presence), non-converging power-method (best-so-far at the cap), ambiguous class (PPR-OFF), 027-API-not-reusable (fail CLOSED).
- [ ] CHK-FIX-006 [P1] Gate axes confirmed: {Q3-C1 core: unbuilt} × {new query-class taxonomy: unbuilt} × {code-graph retrieval benchmark: does-not-exist} × {Q1-C1 `invalid_at` columns: absent}.
- [ ] CHK-FIX-007 [P1] Evidence pinned: 030 §3/§14 (Q4-C1 trust blend shipped `e21caf5de6`; Q3-C1 seeded PPR Wave-2 Out of Scope / NO-GO); research iter-2 findings 12-14, iter-8, iter-14 cited.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced (no code changed this phase)
- [ ] CHK-031 [P0] PPR is a ranking re-order over EXISTING structural edges — no new external data sink or content path (NFR-S01)
- [ ] CHK-032 [P1] No new untrusted-content read path; the context render stays JSON-escaped/trusted-source (the broad C8 render generalization was refuted/reachability-gated for code-graph; `synthesis/04`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [ ] CHK-041 [P1] PENDING/CUT posture consistent across spec §3, tasks Phase 2, and the 030 §3/§14 reference
- [ ] CHK-042 [P2] Comment hygiene: no spec/packet ids embedded in production comments (N/A — no code changed this phase)
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
| P1 Items | 14 | [ ]/14 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 reuse 027's weighted-walk substrate, ADR-002 GATE PPR to impact/multi-hop + defer parameter VALUES to a benchmark, ADR-003 seed-union CUT/NO-GO)
- [ ] CHK-101 [P1] All ADRs have status (ADR-001/002/003 = Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (second-walker, PPR-default-on, shipping-guessed-parameters, wire-a-vector-backend all weighed + rejected)
- [ ] CHK-103 [P2] No schema migration — the change re-orders an existing walk and adds a gated walk variant; reversible by mode-gate/flag (no data reversal)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P0] (IF built) PPR runs inside the existing 400ms `expandAnchor` budget (`code-graph-context.ts:401-403`); the bounded power-method cap is the hard guard (REQ-002; NFR-P01)
- [ ] CHK-111 [P1] (IF built) The single-hop neighborhood/outline path adds ZERO PPR cost — the gate short-circuits before any walk (NFR-P02)
- [ ] CHK-112 [P2] No load regression this phase (no code changed)
- [ ] CHK-113 [P2] Ranking-quality benefit number is structural inference only — NO code-graph retrieval benchmark exists campaign-wide (research §6); the mechanism ships with safe defaults, the quality claim + parameter VALUES are gated on a benchmark that must be built first
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented: this phase ships nothing; IF built, disable the PPR default-off flag (the flat enumeration returns byte-identical) + `git revert` the scoped undirected/Q4-C2 commits independently (plan.md §7)
- [ ] CHK-121 [P1] Build gates confirmed un-startable before the Q3-C1 core lands (the refinements refine a non-existent feature otherwise)
- [ ] CHK-122 [P2] No new monitoring surface introduced
- [ ] CHK-123 [P2] Branch-only; nothing pushed/deployed without explicit user go
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No new untrusted-content read path (PPR re-orders existing structural edges)
- [ ] CHK-131 [P2] No new external dependency / license surface (027's traversal is reused, not vendored)
- [ ] CHK-132 [P2] CG-lexical-vector-seed-union is CUT — no vector backend introduced (the code-graph deliberately disowned its semantic backend)
- [ ] CHK-133 [P2] Data handling unchanged (no code changed this phase)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [ ] CHK-141 [P1] Candidate status (4 BUILD PENDING + 1 CUT) consistent across spec §3, tasks Phase 2, and the 030 §3/§14 reference
- [ ] CHK-142 [P2] The PPR-unbuilt + roadmap-caveat correction carried into both spec.md §2 and decision-record context
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
