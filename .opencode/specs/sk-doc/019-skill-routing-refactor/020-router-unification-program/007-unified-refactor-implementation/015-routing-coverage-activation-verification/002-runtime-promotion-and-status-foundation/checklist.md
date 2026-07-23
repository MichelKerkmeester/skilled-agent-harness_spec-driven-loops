---
title: "Verification Checklist: Runtime Promotion & Status Foundation (P0)"
description: "Verification gate for the compiled-routing P0 foundation, reconciled to the implemented+committed state (landed in 4153cbebd8). Functional and integrity items are verified with the git ref, on-disk artifacts, and the program-wide invariants; performance-profiling items remain open. The frozen scorer stayed read-only and no routing decision changed."
trigger_phrases:
  - "runtime promotion status foundation checklist"
  - "compiled routing P0 verification gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled verification evidence to commit 4153cbebd8"
    next_safe_action: "None; the two performance-profiling items and the P2 latency item stay open pending measurement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: the promoted closure is hosted at .opencode/bin/lib/compiled-routing/ (landed in 4153cbebd8)"
---
# Verification Checklist: Runtime Promotion & Status Foundation (P0)

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
| **[P0]** | Hard blocker | The foundation cannot be declared done while unchecked |
| **[P1]** | Required | Must be verified or explicitly deferred by the operator |
| **[P2]** | Optional | May defer with an owner and reason |

Rows are reconciled to the implemented+committed state (landed in 4153cbebd8). Verified rows cite the git ref, on-disk artifacts, or the program-wide invariants; the three performance-profiling rows (CHK-110, CHK-111, CHK-112) remain open because no timing/profile evidence was produced.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-001 [P0] | Load-bearing receipts re-anchored on symbols (`file:line` +/-10) | Receipts re-anchored during implementation; landed 4153cbebd8 | Done |
| [x] CHK-002 [P0] | Frozen scorer baseline captured | Baseline captured; the three scorer SHA-256 stayed unchanged, 3/3 (4153cbebd8) | Done |
| [x] CHK-003 [P0] | Runtime inventory complete (flag reads, eligibility, engine entrypoints, manifests, bundles) | Full closure inventoried and promoted to `.opencode/bin/lib/compiled-routing/`; 4153cbebd8 | Done |
| [x] CHK-004 [P1] | Stable runtime directory chosen | `.opencode/bin/lib/compiled-routing/` (on disk); 4153cbebd8 | Done |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-010 [P0] | Flag parsing is tri-state with explicit off/on/invalid behavior and no ambiguous truthiness | Tri-state flag via a shared flag module in both read sites + truth-table test; 4153cbebd8 | Done |
| [x] CHK-011 [P0] | Eligibility is derived from manifest freshness and separate from the engine map | Eligibility split from `HUB_CHILD` + `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` cross-check; 4153cbebd8 | Done |
| [x] CHK-012 [P0] | The promotion does not duplicate resolver/engine logic; one authored source builds/copies into place | Authored source builds/copies via `.opencode/bin/compiled-route-sync.cjs` (on disk); 4153cbebd8 | Done |
| [x] CHK-013 [P1] | Breadcrumbs are emit-only and add no throw into the routing path | DEBUG-gated breadcrumbs in the three catches; failures fail-safe to legacy (invariant); 4153cbebd8 | Done |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-020 [P0] | Flag-off and unset (empty cohort) remain inert | Flag default-off; unset byte-identical, no hub lit (invariant); 4153cbebd8 | Done |
| [x] CHK-021 [P0] | Flag-on serves a fresh eligible hub | Foundation test suite (landed 4153cbebd8); compiled byte-identical to legacy on all seven hubs | Done |
| [x] CHK-022 [P0] | Missing manifest follows legacy with the right cause | `.opencode/bin/compiled-route-status.cjs` `missing-manifest` causeCode (on disk); 4153cbebd8 | Done |
| [x] CHK-023 [P0] | Stale manifest reads as drift, not breakage | `legacy-authority` causeCode in the status probe; 4153cbebd8 | Done |
| [x] CHK-024 [P0] | Resolver/engine failure reads as broken, not routine drift | `engine-throw` causeCode in the status probe; 4153cbebd8 | Done |
| [x] CHK-025 [P0] | Compiled routing equals legacy routing byte-for-byte | Compiled byte-identical to legacy on all seven hubs (invariant); 4153cbebd8 | Done |
| [x] CHK-026 [P1] | Cross-check names the diverging hub on allowlist divergence | Cross-check test names the diverging hub; 4153cbebd8 | Done |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-030 [P0] | Every flag read site is tri-state (both `resolve.cjs` and `advisor-recommend.ts`) | Tri-state in both read sites via a shared flag module; 4153cbebd8 | Done |
| [x] CHK-031 [P0] | All three silent catches emit a breadcrumb | DEBUG-gated stderr breadcrumbs in the three catches; 4153cbebd8 | Done |
| [x] CHK-032 [P0] | The residual-coupling branch is deleted and the parent summary line is corrected | `../../012-default-on-decision/implementation-summary.md` corrected to bind ADR-003; 4153cbebd8 | Done |
| [x] CHK-033 [P1] | The status contract field set and causeCode enum are documented as stable for downstream | Status contract shipped and consumed by children 003-011; 4153cbebd8 | Done |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-040 [P0] | No environment secret or raw prompt content is persisted by the status readout | Fixed field-set status contract (no prompt/secret persisted); 4153cbebd8 | Done |
| [x] CHK-041 [P0] | Failures return to the legacy sentinel rather than throwing into routing | All failure paths fail-safe to the legacy sentinel (invariant); 4153cbebd8 | Done |
| [x] CHK-042 [P1] | Kill-switch precedence: `=0` overrides any per-hub cohort state | Tri-state `=0` force-legacy in the flag module + truth-table; 4153cbebd8 | Done |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-050 [P0] | ENV-REFERENCE documents default-off, tri-state, `=0` kill-switch, and eligibility gating | `SPECKIT_COMPILED_ROUTING` entry present in ENV-REFERENCE.md (on disk); 4153cbebd8 | Done |
| [x] CHK-051 [P0] | Spec, plan, tasks, checklist, decision-record, and summary agree on the reconciled Implemented status | Cross-document status reconciled to implemented+committed (this pass); 4153cbebd8 | Done |
| [x] CHK-052 [P1] | ENV wording is phase-accurate (opt-in now; default-on is the P4 outcome) | ENV entry documents current default-off; default-on deferred to P4/011; 4153cbebd8 | Done |
| [x] CHK-053 [P1] | Strict validation reports zero errors | `validate.sh --strict` Errors 0 on this folder (re-run this pass) | Done |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-060 [P0] | No runtime path reads under `.opencode/specs` | Zero runtime reads under specs (invariant) + `.opencode/bin/check-no-spec-imports.cjs` guard (on disk); 4153cbebd8 | Done |
| [x] CHK-061 [P0] | The promoted closure lives at the chosen stable runtime path | Closure at `.opencode/bin/lib/compiled-routing/` (on disk); 4153cbebd8 | Done |
| [x] CHK-062 [P1] | No frozen scorer file is modified | The three scorer SHA-256 unchanged, 3/3 (invariant); 4153cbebd8 | Done |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-100 [P0] | The five local decisions have explicit implementation consequences | ADR-001..ADR-005 all implemented; 4153cbebd8 | Done |
| [x] CHK-101 [P0] | No hub is lit; the per-hub default-on cohort ships empty | Empty cohort, no hub lit (invariant); 4153cbebd8 | Done |
| [x] CHK-102 [P1] | A byte-exact or flag rollback exists for every change | Flag stays default-off and reversible (invariant); 4153cbebd8 | Done |
| [x] CHK-103 [P1] | Routing-decision identity remains an invariant | Compiled byte-identical to legacy on all seven hubs (invariant); 4153cbebd8 | Done |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-110 [P1] | Freshness/status reads add no unbounded work per request | Open: no bounded read profile was produced | Open |
| [ ] CHK-111 [P1] | The status readout stays outside the hot routing decision path | Open: no call-graph/timing evidence was produced (structurally a separate CLI + bootstrap surface) | Open |
| [ ] CHK-112 [P2] | Promotion adds no measurable resolve-latency regression | Open: no before/after resolve measurement was produced | Open |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-120 [P0] | Repository default remains off; unset stays byte-identical to today | Flag default-off, unset byte-identical (invariant); 4153cbebd8 | Done |
| [x] CHK-121 [P0] | `=0` kill-switch is documented and exercised | Documented in ENV-REFERENCE + truth-table exercises `=0`; 4153cbebd8 | Done |
| [x] CHK-122 [P0] | The spec-tree closure copy is retained as the rollback source before promotion lands | Authored spec-tree source retained as build/copy source and rollback target; 4153cbebd8 | Done |
| [x] CHK-123 [P1] | The durable no-spec-import rule is wired into CI | `.opencode/bin/check-no-spec-imports.cjs` + `.github/workflows/runtime-no-spec-import.yml` (on disk); 4153cbebd8 | Done |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-130 [P0] | ENV-REFERENCE flag documentation satisfies repository governance | `SPECKIT_COMPILED_ROUTING` documented in ENV-REFERENCE (on disk); 4153cbebd8 | Done |
| [x] CHK-131 [P0] | Frozen scorer pin is honored across all steps | The three scorer SHA-256 unchanged, 3/3 (invariant); 4153cbebd8 | Done |
| [x] CHK-132 [P1] | Status output contains no secrets or raw prompt retention | Fixed field-set status contract; no secret/prompt persisted; 4153cbebd8 | Done |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Contracts retained in spec.md and decision-record.md; 4153cbebd8 | Done |
| [x] CHK-141 [P1] | The build sequence and rollback are synchronized across supporting docs | Supporting docs reconciled to the implemented+committed state (this pass) | Done |
| [x] CHK-142 [P1] | Follow-ups list every external implementation surface not changed here | implementation-summary Follow-ups list downstream handoffs (003-011; 010 freshness CI) | Done |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Execution owner | [x] Go-ahead given; implementation landed in 4153cbebd8 | 2026-07-21 |
| Runtime owner | Promotion + flag + status implementation owner | [x] Promotion, tri-state flag, and status probe implemented (4153cbebd8) | 2026-07-21 |
| Benchmark owner | Frozen-scorer and parity owner | [x] Frozen scorer SHA-256 unchanged (3/3) and compiled byte-identical to legacy (4153cbebd8) | 2026-07-21 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 29 | 29/29 | Done |
| P1 Items | 16 | 14/16 | 2 open (CHK-110, CHK-111 performance profiling) |
| P2 Items | 1 | 0/1 | Open (CHK-112 latency measurement) |

**Verification Date**: 2026-07-21 (reconciled to the committed state; code landed in 4153cbebd8).

**Verification Scope**: The closure promotion, eligibility/engine-dispatch split, per-hub status readout, flag governance and tri-state semantics, stderr breadcrumbs, the durable no-spec-import rule, frozen-scorer integrity, and byte-identical legacy parity.

**Current Boundary**: Implemented and committed in 4153cbebd8 behind the still-off `SPECKIT_COMPILED_ROUTING` flag; no hub is lit and no routing decision changed. The three performance-profiling items (CHK-110, CHK-111, CHK-112) remain open pending measurement. The staged default-on cutover is operator-gated (P4/011) and is not done.
<!-- /ANCHOR:summary -->
