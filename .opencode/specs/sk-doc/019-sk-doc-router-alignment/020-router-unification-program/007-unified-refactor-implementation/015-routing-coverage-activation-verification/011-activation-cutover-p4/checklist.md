---
title: "Verification Checklist: Compiled Routing Staged Activation Cutover (P4)"
description: "Planned verification gate for the P4 cutover controller: the coverage-closure join gate, the per-hub five-check stop-on-first-failure loop, atomic lockstep rewrites, cohort resolution and =0 precedence, non-hub exclusion, frozen-scorer integrity, and byte-exact rollback. Every item remains unchecked until implementation evidence exists."
trigger_phrases:
  - "compiled routing P4 cutover checklist"
  - "staged activation verification gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-20T21:44:54Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the unchecked Planned verification matrix"
    next_safe_action: "Collect cutover evidence after the join gate is green"
    blockers:
      - "Depends on 015 children 002-010 and siblings 013/014 implemented-and-verified"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Concrete hub order within the ascending-blast-radius principle."
    answered_questions: []
---
# Verification Checklist: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
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
| **[P0]** | Hard blocker | The cutover cannot advance while unchecked |
| **[P1]** | Required | Must be verified or explicitly deferred by the operator |
| **[P2]** | Optional | May defer with an owner and reason |

All rows are **Planned** and unchecked. The evidence column names what must exist later; it is not current evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-001 [P0] | The coverage-closure join gate is green for every input | Enumerated join-gate status table | Planned |
| [ ] CHK-002 [P0] | Siblings `013`/`014` are implemented-and-verified, not "available" | Sibling verification records | Planned |
| [ ] CHK-003 [P0] | `002` cohort state and `010` `activate --rollback` exist and are verified | Prerequisite-verification record | Planned |
| [ ] CHK-004 [P0] | Frozen scorer baseline is captured | Three SHA-256 values | Planned |
| [ ] CHK-005 [P1] | The ascending-blast-radius hub order is recorded with its basis | Hub-order decision record | Planned |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-010 [P0] | Cohort resolution is exact: N-advanced ⇒ exactly N compiled under `unset` | Cohort-resolution test matrix | Planned |
| [ ] CHK-011 [P0] | `=0` overrides any per-hub cohort default | Kill-switch-precedence fixture | Planned |
| [ ] CHK-012 [P0] | The per-hub gate runs the five checks in order and stops on the first failure | Ordered-gate driver test | Planned |
| [ ] CHK-013 [P1] | The atomic rewriter advances cohort + directive + catalog together | Atomic-rewrite unit/integration test | Planned |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-020 [P0] | Route-gold parity is exact per hub (compiled == legacy) | Lane C normalized decision-parity report | Planned |
| [ ] CHK-021 [P0] | Each advanced hub reads `compiled-serving` | Status-probe readout per hub | Planned |
| [ ] CHK-022 [P0] | Fallback is clean under drift and under `=0` | Drift and `=0` legacy-return fixtures | Planned |
| [ ] CHK-023 [P0] | Frozen scorer digests are unchanged after every hub | Before/after SHA-256 per hub | Planned |
| [ ] CHK-024 [P0] | The `=0` kill-switch drill returns legacy fleet-wide | Fleet-wide rollback probe | Planned |
| [ ] CHK-025 [P0] | Per-hub `activate --rollback` restores byte-exact prior manifests | Prior-manifest restore receipts | Planned |
| [ ] CHK-026 [P1] | The five non-hub archetypes stay legacy by construction | Non-hub exclusion fixture | Planned |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-030 [P0] | All seven hubs advanced only through their five-check gate | Per-hub gate logs | Planned |
| [ ] CHK-031 [P0] | Every cut-over hub's directive and catalog agree on posture | Per-hub lockstep-agreement audit | Planned |
| [ ] CHK-032 [P0] | Both create-skill parent templates are in the lockstep set and reconciled | Template membership + reconcile record | Planned |
| [ ] CHK-033 [P0] | The normalized-parity fixture is green across templates, directives, catalogs, docs | Parity fixture result | Planned |
| [ ] CHK-034 [P1] | `sk-code` (surfaceBundle) was cut over last | Cutover-order audit | Planned |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-040 [P0] | No environment secret or prompt content is persisted by cutover evidence | Evidence-schema review | Planned |
| [ ] CHK-041 [P0] | Failures return to legacy rather than throwing into the routing path | Error-injection tests | Planned |
| [ ] CHK-042 [P1] | Kill-switch precedence cannot be overridden by cohort or manifest state | `=0` with advanced-cohort fixture | Planned |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-050 [P0] | Each hub's default-on + `=0` wording lands only at that hub's stage | Phase-gated wording audit | Planned |
| [ ] CHK-051 [P0] | Spec, plan, tasks, checklist, and summary agree on Planned status | Cross-document status audit | Planned |
| [ ] CHK-052 [P1] | Per-hub evidence uses repo-relative provenance, never absolute worktree paths | Provenance review | Planned |
| [ ] CHK-053 [P1] | Strict validation reports zero errors | Validation log | Planned |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-060 [P0] | Runtime reads no cohort or manifest state from under `.opencode/specs` | Resolved module/path inspection | Planned |
| [ ] CHK-061 [P0] | Per-hub cutover evidence uses `007`'s durable convention | Report-path contract test | Planned |
| [ ] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Planned |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-100 [P0] | The three cutover decisions have explicit implementation consequences | Decision-to-task traceability matrix | Planned |
| [ ] CHK-101 [P0] | No hub cutover begins before the join gate is green | Entry-gate records | Planned |
| [ ] CHK-102 [P1] | Rollback exists and is proven at every hub stage | Per-hub rollback drill output | Planned |
| [ ] CHK-103 [P1] | Routing-decision identity remains an invariant across the cutover | Full normalized parity result | Planned |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-110 [P1] | Cohort resolution adds no unbounded work per request | Bounded resolution profile | Planned |
| [ ] CHK-111 [P1] | The status readout stays diagnostic and outside the hot decision path | Call graph or timing evidence | Planned |
| [ ] CHK-112 [P2] | Per-hub cutover latency delta is recorded | Before/after per-hub measurement | Planned |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-120 [P0] | No fleet-wide `unset=on` posture is ever set | Cohort-advance audit | Planned |
| [ ] CHK-121 [P0] | `=0` kill-switch is documented and exercised fleet-wide | Fleet-wide rollback probe | Planned |
| [ ] CHK-122 [P0] | Per-hub prior manifests are retained before each advance | Manifest-retention inventory | Planned |
| [ ] CHK-123 [P1] | Stop-on-first-failure is enforced across the loop | Cutover driver or runbook evidence | Planned |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-130 [P0] | Each hub's default-on wording satisfies the phase-gated authoring contract | Wording-vs-stage review | Planned |
| [ ] CHK-131 [P0] | Frozen scorer pin is honored across all hubs and at completion | Digest ledger | Planned |
| [ ] CHK-132 [P1] | Cutover evidence contains no secrets or raw prompt retention | Schema and fixture review | Planned |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Cross-document ownership review | Planned |
| [ ] CHK-141 [P1] | The join gate and per-hub sequence are synchronized across supporting docs | Spec-doc diff review | Planned |
| [ ] CHK-142 [P1] | Follow-ups list every earlier-child dependency this phase consumes | `implementation-summary.md` review | Planned |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Cutover owner | [ ] Planned; go-ahead gates hub 1 | |
| Runtime owner | P4 controller implementation owner | [ ] Planned review | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Planned review | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 31 | 0/31 | Planned |
| P1 Items | 16 | 0/16 | Planned |
| P2 Items | 1 | 0/1 | Planned |

**Verification Date**: Not run; cutover has not begun.

**Verification Scope**: The coverage-closure join gate, the per-hub five-check stop-on-first-failure loop, atomic lockstep rewrites, cohort resolution and `=0` precedence, non-hub exclusion, frozen-scorer integrity, and byte-exact per-hub and fleet rollback.

**Current Boundary**: Documentation is in Planned state. No runtime default, cohort state, hub directive, feature catalog, create-skill template, or manifest has been changed by this packet.
<!-- /ANCHOR:summary -->
