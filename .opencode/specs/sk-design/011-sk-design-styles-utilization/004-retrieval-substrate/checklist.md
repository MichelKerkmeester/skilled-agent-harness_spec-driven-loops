---
title: "Verification Checklist: styles-library retrieval substrate"
description: "Level 3 verification checklist for the Phase A retrieval engine — manifest, eligibility, ranking, hydration, proof gate, and CI invalidation. All items pending; nothing is built yet."
trigger_phrases:
  - "retrieval substrate checklist"
  - "verification checklist retrieval"
  - "corpus use proof checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate L3 checklist"
    next_safe_action: "Verify items as each engine module lands under styles/_engine/"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: styles-library retrieval substrate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- STATUS: Planned — scaffold; implementation not started. Every item is intentionally UNCHECKED. -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Research §4/§5/§9/§15 substrate contract frozen as build target
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Engine modules pass lint/format checks
- [ ] CHK-011 [P0] No volatile timestamps in byte-stable generated manifest
- [ ] CHK-012 [P1] Error handling for `corpus-changing`, `generation-mismatch`, `unavailable`, `degraded`
- [ ] CHK-013 [P1] Engine follows sk-design module conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `build --check` byte-stable on unchanged corpus (REQ-001, SC-001)
- [ ] CHK-021 [P0] Add/change/delete invalidation flags exact mutated ids (REQ-008)
- [ ] CHK-022 [P1] Eligibility proven to run before ranking (REQ-002, SC-002)
- [ ] CHK-023 [P1] Deterministic card ordering + tie-breaking
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each engine surface has a stated class (manifest, eligibility, ranking, hydration, proof, fixtures).
- [ ] CHK-FIX-002 [P0] Corpus-input inventory completed: every canonical artifact path feeding the generation hash is enumerated.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the manifest schema (cards, hydration, proof card) before it is frozen.
- [ ] CHK-FIX-004 [P0] Hydration guard includes adversarial tests for generation-mismatch, stale-artifact, and unknown-rights cases.
- [ ] CHK-FIX-005 [P1] Fixture matrix axes listed (add/change/delete, stale/absent FTS, mismatch, valid/invalid proof) before completion.
- [ ] CHK-FIX-006 [P1] Corpus-mutating-mid-build (`corpus-changing`) variant executed.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Provenance/rights gate excludes unknown-rights styles from exact-reuse hydration (NFR-S01)
- [ ] CHK-031 [P0] `CORPUS_USE_PROOF v1` blocks unproven corpus-influenced ready claims (REQ-004, SC-004)
- [ ] CHK-032 [P1] No source-specific literals/assets reused under unknown rights
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/decision-record synchronized
- [ ] CHK-041 [P1] Engine command usage documented (`build`/`query`/`hydrate`)
- [ ] CHK-042 [P2] Manifest schema documented for downstream phases
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Engine under `styles/_engine/`; manifest at `styles/_retrieval-manifest.json`
- [ ] CHK-051 [P1] FTS projection never committed (disposable)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 16 | 0/16 |
| P2 Items | 6 | 0/6 |

**Verification Date**: pending (scaffold — nothing built)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — currently all Proposed
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (semantic reranker, watcher/daemon, DB-as-truth)
- [ ] CHK-103 [P2] Component + data-flow diagrams match implementation
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Generation load+hash sub-second (NFR-P01)
- [ ] CHK-111 [P1] Deterministic metadata query ~1 ms (NFR-P02)
- [ ] CHK-112 [P2] Top-five card payload under ~2 KB (NFR-P03)
- [ ] CHK-113 [P2] FTS projection build cost measured before enabling
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (delete `_engine/` + manifest)
- [ ] CHK-121 [P0] `corpus-changing` abort verified under mid-build mutation
- [ ] CHK-122 [P1] CI selectors on `styles/**`, engine, and mode contracts
- [ ] CHK-123 [P1] No mode wired to the engine until `../005-md-generator-schema-contract/`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Provenance/rights evidence scope travels on every card
- [ ] CHK-131 [P1] No corpus-averaged token values in any output path
- [ ] CHK-132 [P2] Anti-copy gate covers exact text/asset/screenshot reuse under unknown rights
- [ ] CHK-133 [P2] Trope-budget default (one high-salience device/surface) enforced by the proof gate
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Manifest schema + candidate-card shape documented for downstream phases
- [ ] CHK-142 [P2] Mode request/hydration adapter contract documented
- [ ] CHK-143 [P2] Knowledge transfer to `../005-md-generator-schema-contract/` documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| pending | Technical Lead | [ ] Approved | |
| pending | Design Owner | [ ] Approved | |
| pending | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist — Planned scaffold.
All items UNCHECKED until the engine is built.
P0 must complete, P1 need approval to defer.
-->
</content>
