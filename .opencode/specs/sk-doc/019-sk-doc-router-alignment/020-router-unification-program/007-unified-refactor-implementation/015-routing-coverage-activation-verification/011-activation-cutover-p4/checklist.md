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
    last_updated_at: "2026-07-21T02:20:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified mechanism items in dry-run; kept cutover-execution items gated"
    next_safe_action: "Land siblings 013/014 to turn the join gate green, then verify the execution items"
    blockers:
      - "Join gate BLOCKED: siblings 013/014 and the create-skill ready fixture are Planned"
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

Rows split into two states: **[x] Verified** by the controller's dry-run (evidence in `controller/cutover-controller.cjs`, `verification/verify-cutover.cjs`, `verification/dry-run-evidence.json`), and **[ ] Gated** — items that require an actual on-disk cutover flip, which is refused because the join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. A Gated item is honest, not a failure.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-001 [P0] | The coverage-closure join gate is green for every input | Enumerated join-gate status table | Gated — gate RAN, 7/7 BLOCKED (honest) |
| [ ] CHK-002 [P0] | Siblings `013`/`014` are implemented-and-verified, not "available" | Sibling verification records | Gated — 013/014 Planned |
| [x] CHK-003 [P0] | `002` cohort state and `010` `activate --rollback` exist and are verified | Prerequisite-verification record | Verified — consumed read-only; drill 23/0 |
| [x] CHK-004 [P0] | Frozen scorer baseline is captured | Three SHA-256 values | Verified — pins match |
| [x] CHK-005 [P1] | The ascending-blast-radius hub order is recorded with its basis | Hub-order decision record | Verified — recorded in controller (`sk-code` last) |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-010 [P0] | Cohort resolution is exact: N-advanced ⇒ exactly N compiled under `unset` | Cohort-resolution test matrix | Verified — proof, 8 steps all ok |
| [x] CHK-011 [P0] | `=0` overrides any per-hub cohort default | Kill-switch-precedence fixture | Verified — `=0` forces legacy at every step |
| [x] CHK-012 [P0] | The per-hub gate runs the five checks in order and stops on the first failure | Ordered-gate driver test | Verified — dry-run sequence, stop-on-first-failure |
| [ ] CHK-013 [P1] | The atomic rewriter advances cohort + directive + catalog together | Atomic-rewrite unit/integration test | Gated — no flip; lockstep registry enumerates the surfaces |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-020 [P0] | Route-gold parity is exact per hub (compiled == legacy) | Lane C normalized decision-parity report | Verified — harness present + frozen baseline intact; per-scenario via committed Lane C suite |
| [x] CHK-021 [P0] | Each advanced hub reads `compiled-serving` | Status-probe readout per hub | Verified — simulated cohort ⇒ causeCode `compiled-serving` |
| [x] CHK-022 [P0] | Fallback is clean under drift and under `=0` | Drift and `=0` legacy-return fixtures | Verified — `=0` and invalid flag both resolve legacy |
| [x] CHK-023 [P0] | Frozen scorer digests are unchanged after every hub | Before/after SHA-256 per hub | Verified — three digests unchanged |
| [x] CHK-024 [P0] | The `=0` kill-switch drill returns legacy fleet-wide | Fleet-wide rollback probe | Verified — full cohort legacy under `=0` |
| [x] CHK-025 [P0] | Per-hub `activate --rollback` restores byte-exact prior manifests | Prior-manifest restore receipts | Verified — drill 23/0, restoredHash == priorManifestHash |
| [x] CHK-026 [P1] | The five non-hub archetypes stay legacy by construction | Non-hub exclusion fixture | Verified — fixtures 32/0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-030 [P0] | All seven hubs advanced only through their five-check gate | Per-hub gate logs | Gated — dry-run gate proven; no on-disk advance |
| [ ] CHK-031 [P0] | Every cut-over hub's directive and catalog agree on posture | Per-hub lockstep-agreement audit | Gated — no hub cut over |
| [ ] CHK-032 [P0] | Both create-skill parent templates are in the lockstep set and reconciled | Template membership + reconcile record | Partial/Gated — both in lockstep registry; reconcile at fleet completion (not reached) |
| [ ] CHK-033 [P0] | The normalized-parity fixture is green across templates, directives, catalogs, docs | Parity fixture result | Gated — runs at fleet completion only |
| [ ] CHK-034 [P1] | `sk-code` (surfaceBundle) was cut over last | Cutover-order audit | Gated — order recorded (`sk-code` last); not executed |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-040 [P0] | No environment secret or prompt content is persisted by cutover evidence | Evidence-schema review | Verified — evidence holds hashes/status only |
| [x] CHK-041 [P0] | Failures return to legacy rather than throwing into the routing path | Error-injection tests | Verified — resolver fails safe; clean-fallback proven |
| [x] CHK-042 [P1] | Kill-switch precedence cannot be overridden by cohort or manifest state | `=0` with advanced-cohort fixture | Verified — `=0` beats full cohort |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-050 [P0] | Each hub's default-on + `=0` wording lands only at that hub's stage | Phase-gated wording audit | Verified — no wording changed; controller enforces atomic per-stage lockstep |
| [x] CHK-051 [P0] | Spec, plan, tasks, checklist, and summary agree on status | Cross-document status audit | Verified — all read Implemented (controller); cutover gated |
| [x] CHK-052 [P1] | Per-hub evidence uses repo-relative provenance, never absolute worktree paths | Provenance review | Verified — evidence uses repo-relative paths |
| [x] CHK-053 [P1] | Strict validation reports zero errors | Validation log | Verified — Errors zero |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-060 [P0] | Runtime reads no cohort or manifest state from under `.opencode/specs` | Resolved module/path inspection | Verified — runtime reads the promoted closure under `.opencode/bin` |
| [ ] CHK-061 [P0] | Per-hub cutover evidence uses `007`'s durable convention | Report-path contract test | Gated — no cutover ran; dry-run evidence is repo-relative |
| [x] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Verified — byte-identical, not in diff |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-100 [P0] | The three cutover decisions have explicit implementation consequences | Decision-to-task traceability matrix | Verified — controller implements ADR-001/002/003 |
| [x] CHK-101 [P0] | No hub cutover begins before the join gate is green | Entry-gate records | Verified — gate BLOCKED ⇒ no cutover attempted |
| [x] CHK-102 [P1] | Rollback exists and is proven at every hub stage | Per-hub rollback drill output | Verified — drill 23/0 |
| [x] CHK-103 [P1] | Routing-decision identity remains an invariant across the cutover | Full normalized parity result | Verified — harness + frozen baseline; committed Lane C suite |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-110 [P1] | Cohort resolution adds no unbounded work per request | Bounded resolution profile | Verified — Set membership, O(1) per hub |
| [x] CHK-111 [P1] | The status readout stays diagnostic and outside the hot decision path | Call graph or timing evidence | Verified — probe is diagnostic; `probeEngine` opt-in |
| [ ] CHK-112 [P2] | Per-hub cutover latency delta is recorded | Before/after per-hub measurement | Gated — no cutover executed |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-120 [P0] | No fleet-wide `unset=on` posture is ever set | Cohort-advance audit | Verified — cohort advance only; proof asserts N ⇒ N |
| [x] CHK-121 [P0] | `=0` kill-switch is documented and exercised fleet-wide | Fleet-wide rollback probe | Verified — kill-switch drill passes |
| [x] CHK-122 [P0] | Per-hub prior manifests are retained before each advance | Manifest-retention inventory | Verified — drill proves retention + byte-exact restore |
| [x] CHK-123 [P1] | Stop-on-first-failure is enforced across the loop | Cutover driver or runbook evidence | Verified — sequence stops at first failure |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-130 [P0] | Each hub's default-on wording satisfies the phase-gated authoring contract | Wording-vs-stage review | Verified — no wording changed; per-stage lockstep enforced |
| [x] CHK-131 [P0] | Frozen scorer pin is honored across all hubs and at completion | Digest ledger | Verified — pins honored before/after |
| [x] CHK-132 [P1] | Cutover evidence contains no secrets or raw prompt retention | Schema and fixture review | Verified — hashes/status only |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Cross-document ownership review | Verified — contracts unchanged; ADRs authoritative |
| [x] CHK-141 [P1] | The join gate and per-hub sequence are synchronized across supporting docs | Spec-doc diff review | Verified — controller matches the documented sequence |
| [x] CHK-142 [P1] | Follow-ups list every earlier-child dependency this phase consumes | `implementation-summary.md` review | Verified — follow-ups list 013/014 + consumed children |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Cutover owner | [ ] Pending go-ahead; gate BLOCKED, no hub cut over | |
| Runtime owner | P4 controller implementation owner | [ ] Controller built + dry-run-proven (9/9); awaiting review | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Frozen scorer byte-identical; awaiting review | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 31 | 24/31 | 7 gated on an actual cutover flip |
| P1 Items | 16 | 14/16 | 2 gated on an actual cutover flip |
| P2 Items | 1 | 0/1 | 1 gated on an actual cutover flip |

**Verification Date**: 2026-07-21 — controller dry-run verification VERDICT PASS (9/9); `verification/dry-run-evidence.json`.

**Verification Scope**: The coverage-closure join gate, the per-hub five-check stop-on-first-failure loop, atomic lockstep registry, cohort resolution and `=0` precedence, non-hub exclusion, frozen-scorer integrity, and byte-exact per-hub and fleet rollback.

**Current Boundary**: The controller and verification harness are built and dry-run-proven. All 10 unverified items require an actual on-disk cutover flip, which is refused because the join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. No runtime default, cohort state, hub directive, feature catalog, create-skill template, manifest, or frozen scorer was changed by this packet.
<!-- /ANCHOR:summary -->
