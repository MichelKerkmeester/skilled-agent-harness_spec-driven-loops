---
title: "Verification Checklist: Runtime Promotion & Status Foundation (P0)"
description: "Planned verification gate for the compiled-routing P0 foundation. Every item is unchecked until implementation evidence exists; the frozen scorer is read-only and no routing decision changes."
trigger_phrases:
  - "runtime promotion status foundation checklist"
  - "compiled routing P0 verification gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the unchecked Planned verification matrix"
    next_safe_action: "Collect implementation evidence only after the go-ahead to begin"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which stable runtime directory hosts the promoted closure?"
    answered_questions: []
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

All rows are **Planned** and unchecked. The evidence column names what must exist later; it is not current evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-001 [P0] | Load-bearing receipts re-anchored on symbols (`file:line` +/-10) | Confirmed-vs-inferred receipt audit | Planned |
| [ ] CHK-002 [P0] | Frozen scorer baseline captured | Three SHA-256 values | Planned |
| [ ] CHK-003 [P0] | Runtime inventory complete (flag reads, eligibility, engine entrypoints, manifests, bundles) | Inventory table | Planned |
| [ ] CHK-004 [P1] | Stable runtime directory chosen | Runtime-directory decision record | Planned |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-010 [P0] | Flag parsing is tri-state with explicit off/on/invalid behavior and no ambiguous truthiness | Unit tests for unset, `0`, `1`, `false`, `off`, invalid | Planned |
| [ ] CHK-011 [P0] | Eligibility is derived from manifest freshness and separate from the engine map | Import/call-site inventory and cross-check test | Planned |
| [ ] CHK-012 [P0] | The promotion does not duplicate resolver/engine logic; one authored source builds/copies into place | Dependency inspection and build/copy freshness note | Planned |
| [ ] CHK-013 [P1] | Breadcrumbs are emit-only and add no throw into the routing path | Catch-path review and error-injection fixtures | Planned |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-020 [P0] | Flag-off and unset (empty cohort) remain inert | Front-door legacy sentinel with unset and `0` | Planned |
| [ ] CHK-021 [P0] | Flag-on serves a fresh eligible hub | Compiled decision and `compiled-serving` readout | Planned |
| [ ] CHK-022 [P0] | Missing manifest follows legacy with the right cause | No-manifest fixture and `missing-manifest` causeCode | Planned |
| [ ] CHK-023 [P0] | Stale manifest reads as drift, not breakage | Hash-mismatch fixture and `legacy-authority` causeCode | Planned |
| [ ] CHK-024 [P0] | Resolver/engine failure reads as broken, not routine drift | Broken-resolver fixture and `engine-throw` causeCode | Planned |
| [ ] CHK-025 [P0] | Compiled routing equals legacy routing byte-for-byte | Route-gold normalized decision parity report | Planned |
| [ ] CHK-026 [P1] | Cross-check names the diverging hub on allowlist divergence | Seeded-divergence fixture failing with the hub named | Planned |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-030 [P0] | Every flag read site is tri-state (both `resolve.cjs` and `advisor-recommend.ts`) | Flag-read inventory before/after | Planned |
| [ ] CHK-031 [P0] | All three silent catches emit a breadcrumb | Catch inventory and captured stderr | Planned |
| [ ] CHK-032 [P0] | The residual-coupling branch is deleted and the parent summary line is corrected | Diff of `../../012-default-on-decision/implementation-summary.md` | Planned |
| [ ] CHK-033 [P1] | The status contract field set and causeCode enum are documented as stable for downstream | Contract note in `decision-record.md` | Planned |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-040 [P0] | No environment secret or raw prompt content is persisted by the status readout | Output-schema review | Planned |
| [ ] CHK-041 [P0] | Failures return to the legacy sentinel rather than throwing into routing | Error-injection tests | Planned |
| [ ] CHK-042 [P1] | Kill-switch precedence: `=0` overrides any per-hub cohort state | Flag `=0` with compiled manifests fixture | Planned |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-050 [P0] | ENV-REFERENCE documents default-off, tri-state, `=0` kill-switch, and eligibility gating | Reviewed flag entry | Planned |
| [ ] CHK-051 [P0] | Spec, plan, tasks, checklist, decision-record, and summary agree on Planned status | Cross-document status audit | Planned |
| [ ] CHK-052 [P1] | ENV wording is phase-accurate (opt-in now; default-on is the P4 outcome) | Wording review | Planned |
| [ ] CHK-053 [P1] | Strict validation reports zero errors | Validation log | Planned |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-060 [P0] | No runtime path reads under `.opencode/specs` | Spec-tree-move simulation and resolved-module-path inspection | Planned |
| [ ] CHK-061 [P0] | The promoted closure lives at the chosen stable runtime path | Path contract test | Planned |
| [ ] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Planned |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-100 [P0] | The five local decisions have explicit implementation consequences | Decision-to-task traceability matrix | Planned |
| [ ] CHK-101 [P0] | No hub is lit; the per-hub default-on cohort ships empty | Cohort-state inspection | Planned |
| [ ] CHK-102 [P1] | A byte-exact or flag rollback exists for every change | Per-step rollback drill output | Planned |
| [ ] CHK-103 [P1] | Routing-decision identity remains an invariant | Full normalized parity result | Planned |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-110 [P1] | Freshness/status reads add no unbounded work per request | Bounded cache/read profile | Planned |
| [ ] CHK-111 [P1] | The status readout stays outside the hot routing decision path | Call graph or timing evidence | Planned |
| [ ] CHK-112 [P2] | Promotion adds no measurable resolve-latency regression | Before/after resolve measurement | Planned |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-120 [P0] | Repository default remains off; unset stays byte-identical to today | Config search and truth-table result | Planned |
| [ ] CHK-121 [P0] | `=0` kill-switch is documented and exercised | Fleet-wide legacy-serving probe | Planned |
| [ ] CHK-122 [P0] | The spec-tree closure copy is retained as the rollback source before promotion lands | Source-retention inventory | Planned |
| [ ] CHK-123 [P1] | The durable no-spec-import rule is wired into CI | CI job reference and passing fixtures | Planned |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-130 [P0] | ENV-REFERENCE flag documentation satisfies repository governance | Reference review | Planned |
| [ ] CHK-131 [P0] | Frozen scorer pin is honored across all steps | Digest ledger | Planned |
| [ ] CHK-132 [P1] | Status output contains no secrets or raw prompt retention | Schema and fixture review | Planned |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Cross-document ownership review | Planned |
| [ ] CHK-141 [P1] | The build sequence and rollback are synchronized across supporting docs | Spec-doc diff review | Planned |
| [ ] CHK-142 [P1] | Follow-ups list every external implementation surface not changed here | `implementation-summary.md` review | Planned |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Execution owner | [ ] Planned go-ahead to begin | |
| Runtime owner | Promotion + flag + status implementation owner | [ ] Planned review | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Planned review | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 29 | 0/29 | Planned |
| P1 Items | 16 | 0/16 | Planned |
| P2 Items | 1 | 0/1 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: The closure promotion, eligibility/engine-dispatch split, per-hub status readout, flag governance and tri-state semantics, stderr breadcrumbs, the durable no-spec-import rule, frozen-scorer integrity, and byte-identical legacy parity.

**Current Boundary**: Documentation is in Planned state. No runtime resolver, engine map, flag read site, status surface, ENV entry, or CI rule has been changed by this packet, and no hub has been lit.
<!-- /ANCHOR:summary -->
