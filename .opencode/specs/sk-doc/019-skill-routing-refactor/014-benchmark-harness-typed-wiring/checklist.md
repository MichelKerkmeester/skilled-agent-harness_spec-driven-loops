---
title: "Verification Checklist: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Verification Date: pending (Status: Planned). Phase verification gates plus zero-emission, typed-scoring, join, relocation, holdout and gate QA items."
trigger_phrases:
  - "benchmark harness typed wiring checklist"
  - "selection fix verification"
  - "holdout corpus qa items"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rewrote checklist to ten phases; swapped hub-subset invariant for coherence"
    next_safe_action: "Leave unchecked until implementation lands. Verify with evidence, not by inspection"
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md, traced to the verified SOL-redirect ledger (8 confirmed, 3 plausible, 1 refuted)
- [ ] CHK-002 [P0] Technical approach defined in plan.md, ten dependency-ordered phases
- [ ] CHK-003 [P0] Collapse mechanism ratified (ADR-005: one authoritative intent→leaf taxonomy, hub demoted to telemetry) before the router is rewritten
- [ ] CHK-004 [P1] Baseline captured: current skill-benchmark suite failures recorded before Phase 4 (the first runtime change; delta-based regression)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on every changed CJS file
- [ ] CHK-011 [P0] No console errors or warnings during benchmark or parent-skill-check runs
- [ ] CHK-012 [P1] Fail-closed: an invalid or router-inconsistent fixture blocks dispatch with zero denominators
- [ ] CHK-013 [P1] The relocated contract library stays pure. No behavior change beyond the path move and the locale-independent sort
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Phase verification gates.

- [ ] CHK-020 [P0] Zero-to-nonzero: the T008 regression test pins SD-003/015/016/018/020 + a core out-of-fixture sample from zero to non-zero, mode-consistent pairs
- [ ] CHK-021 [P0] Loader surfaces `expected_leaf_resources`/`expected_workflow_mode`/`full_inventory_intent` (T012 unit test)
- [ ] CHK-022 [P0] The runner blocks a synthetic invalid fixture before dispatch (T012)
- [ ] CHK-023 [P0] Live output carries typed pairs and scoring weights actual reads (T014)
- [ ] CHK-024 [P0] The topology validator rejects a fixture whose gold is absent from the authored taxonomy (T013)
- [ ] CHK-025 [P0] `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` passes after the relocation (T002)
- [ ] CHK-026 [P1] Aggregate: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage` shows zero new failures against the captured baseline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-MTX-001 [P0] Coherence: advertised `workflowModes` equals `orderedUnique(pairs[*].workflowMode)` capped at two on every fixture; an empty typed contract with non-empty raw resources raises a hard error, never a silent zero
- [ ] CHK-MTX-002 [P0] Wiring: the loader, runner, live executor and scorer all consume the typed contract; the shipped 5-class taxonomy is no longer dormant
- [ ] CHK-MTX-003 [P0] Join: "topology valid" means "consistent with the authored router", proven by a rejected mismatched fixture
- [ ] CHK-MTX-004 [P0] Relocation: no runtime path outside sk-doc imports the contract library from the sk-doc packet
- [ ] CHK-MTX-005 [P0] SD-015 option C: full-inventory resolves by manifest enumeration; `expected_public_pairs` and `expected_disk_targets` are distinct
- [ ] CHK-MTX-006 [P1] Holdout: 60–80 sealed scenarios exist, authored without router sight, with a leakage-audit report and pre-registered metrics
- [ ] CHK-MTX-007 [P1] Gates: the offline-holdout gate reports the fitted-to-holdout gap; the live 3-gate is runnable; Wave-2 is documented as blocked on both
- [ ] CHK-MTX-008 [P2] Hardening: manifest generation is byte-stable under a permuted enumeration order; version skew across registry/manifest/library fails the guard
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in the harness, fixtures or corpus
- [ ] CHK-031 [P0] `leafResourceId` containment check still rejects any path resolving outside its packet root after the relocation
- [ ] CHK-032 [P1] N/A. Internal routing/measurement change, no auth or authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md and decision-record.md stay synchronized with the verified ledger
- [ ] CHK-041 [P1] The single-pass router carries a doc comment explaining the durable why: the mode is a projection of the selected leaves (via the manifest), not an independent classification
- [ ] CHK-042 [P2] The 012 record correction is cross-referenced (the "18/19 fixed" relabel lives in 012, not here)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only during implementation
- [ ] CHK-051 [P1] scratch/ cleaned before completion is claimed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | [ ]/18 |
| P1 Items | 14 | [ ]/14 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: pending, Status is Planned
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] All five settled decisions documented in decision-record.md (ADR-005 collapse, SD-015 option C, contract-lib relocation, holdout protocol, and the superseded ADR-001)
- [ ] CHK-101 [P1] All ADRs carry a status field (ADR-002/003/004/005 Accepted; ADR-001 Superseded)
- [ ] CHK-102 [P1] The eliminated alternatives (staged coupling, union hub∪surface, hub-scorer tuning) documented with rejection rationale
- [ ] CHK-103 [P2] The hub-deletion successor (remove the telemetry hub once it earns no independent value) documented as an explicit follow-up
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Manifest generation stays deterministic: repeated runs produce byte-identical output after the locale-independent sort
- [ ] CHK-111 [P2] N/A. No throughput target applies, this is not a request-serving path
- [ ] CHK-112 [P2] Offline-gate replay time recorded so the sealed-corpus run stays practical
- [ ] CHK-113 [P2] No performance benchmark beyond determinism and gate-runtime is required
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md Section 7; the router rewrite (Phases 4-5) is gated behind regression + tripwire tests so it reverts cleanly
- [ ] CHK-121 [P1] Wave-2 propagation is explicitly blocked on the offline + live gates; no fitted `smart_routing.md` is copied to another skill first
- [ ] CHK-122 [P1] N/A. No production monitoring surface for this internal tooling change
- [ ] CHK-123 [P2] Runbook: the phase verification commands in order serve as the operational runbook
- [ ] CHK-124 [P2] Runbook reviewed against actual command output before the live gate spend
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No new external dependency added. No license review required
- [ ] CHK-131 [P2] N/A. Internal tooling change, no data-handling compliance surface
- [ ] CHK-132 [P2] N/A. No OWASP-relevant surface, this change touches no network input
- [ ] CHK-133 [P2] N/A. No user data processed by the harness or the corpus
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All five packet docs synchronized before completion is claimed
- [ ] CHK-141 [P2] N/A. No public API for this internal harness change
- [ ] CHK-142 [P2] The holdout corpus authoring protocol documented so a future author can reproduce a sealed set
- [ ] CHK-143 [P2] The verified ledger (this session) referenced as the evidence source in spec.md
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Implementation Authorization | [ ] Approved | |
| Implementer | Technical Lead | [ ] Approved | |
| Verifier | Offline + Live Gate Reviewer | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
