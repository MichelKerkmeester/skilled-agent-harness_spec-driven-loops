---
title: "Verification Checklist: Compiled Routing Default-On Safe Cutover"
description: "Planned verification gate for the default-on ruling and P0-to-P4 migration. Every item remains unchecked until implementation evidence exists."
trigger_phrases:
  - "compiled routing default-on checklist"
  - "P0 P4 safe cutover verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Prepared the unchecked Planned verification matrix"
    next_safe_action: "Collect implementation evidence only after ratification"
    blockers:
      - "Operator ratification is pending"
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
      - "Which canary environment profile is approved?"
    answered_questions: []
---
# Verification Checklist: Compiled Routing Default-On Safe Cutover

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
| **[P0]** | Hard blocker | The migration cannot advance while unchecked |
| **[P1]** | Required | Must be verified or explicitly deferred by the operator |
| **[P2]** | Optional | May defer with an owner and reason |

All rows are **Planned** and unchecked. The evidence column names what must exist later; it is not current evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-001 [P0] | Operator ruling is recorded verbatim | Updated ruling status in `decision-record.md` | Planned |
| [ ] CHK-002 [P0] | Source receipts remain accurate and confirmed | File:line receipt audit | Planned |
| [ ] CHK-003 [P0] | Frozen scorer baseline is captured | Three SHA-256 values | Planned |
| [ ] CHK-004 [P1] | Canary profile and promotion owner are named | Environment-profile decision record | Planned |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-010 [P0] | Flag parsing has explicit off/on behavior and no ambiguous truthiness | Unit tests for unset, `0`, `1`, and invalid values | Planned |
| [ ] CHK-011 [P0] | Status classification separates drift from resolver breakage | Fresh/stale/malformed fixture matrix | Planned |
| [ ] CHK-012 [P0] | Eligibility is defined once and reused by both consumers | Import/call-site inventory and parity test | Planned |
| [ ] CHK-013 [P1] | Resolver promotion does not duplicate runtime logic | Dependency inspection and build/copy freshness test | Planned |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-020 [P0] | Flag-off remains inert | Front-door legacy sentinel with flag unset and `0` | Planned |
| [ ] CHK-021 [P0] | Flag-on serves a fresh eligible hub | Compiled decision and `compiled-serving` readout | Planned |
| [ ] CHK-022 [P0] | Missing manifest follows legacy | No-manifest fixture and `legacy-fallback` readout | Planned |
| [ ] CHK-023 [P0] | Stale manifest is identified as drift | Hash-mismatch fixture and re-mint-required output | Planned |
| [ ] CHK-024 [P0] | Resolver failure is not mislabeled as normal drift | Broken-resolver fixture and hard-failure result | Planned |
| [ ] CHK-025 [P0] | Compiled routing equals legacy routing | Route-gold normalized decision parity report | Planned |
| [ ] CHK-026 [P1] | One-profile canary does not change other profiles | Environment matrix | Planned |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-030 [P0] | Every flag consumer is updated or explicitly unchanged | Flag-read inventory | Planned |
| [ ] CHK-031 [P0] | Both eligibility consumers move together | Before/after consumer map | Planned |
| [ ] CHK-032 [P0] | All seven hub directives are included in P4 lockstep | Seven-hub directive matrix | Planned |
| [ ] CHK-033 [P0] | Resolver spec-tree coupling is removed or loudly guarded | Stable-path test or approved exception evidence | Planned |
| [ ] CHK-034 [P1] | Sibling alignment packets consume the same contracts | Cross-link review | Planned |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-040 [P0] | No environment secret or prompt content is persisted by observability | Output-schema review | Planned |
| [ ] CHK-041 [P0] | Failures return to legacy rather than throwing into the routing path | Error-injection tests | Planned |
| [ ] CHK-042 [P1] | Kill-switch precedence cannot be overridden by per-hub state | Flag `=0` with compiled manifests fixture | Planned |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-050 [P0] | Environment reference documents default, enablement, and kill-switch | Reviewed flag entry | Planned |
| [ ] CHK-051 [P0] | Spec, plan, tasks, checklist, and summary agree on Planned status | Cross-document status audit | Planned |
| [ ] CHK-052 [P1] | Dependent packets reference contracts without restating them | Link and duplication review | Planned |
| [ ] CHK-053 [P1] | Strict validation reports zero errors | Three-folder validation log | Planned |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-060 [P0] | Runtime resolver no longer depends silently on mutable spec-tree layout | Resolved module path inspection | Planned |
| [ ] CHK-061 [P0] | Manifest and status artifacts use the canonical location chosen by P3 | Path contract test | Planned |
| [ ] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Planned |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-100 [P0] | The three proposed decisions have explicit implementation consequences | Decision-to-task traceability matrix | Planned |
| [ ] CHK-101 [P0] | No P4 action begins before P0-P3 gates are green | Stage gate records | Planned |
| [ ] CHK-102 [P1] | Rollback exists at every migration stage | Per-stage rollback drill output | Planned |
| [ ] CHK-103 [P1] | Routing-decision identity remains an invariant | Full normalized parity result | Planned |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-110 [P1] | Freshness checks do not add unbounded work per request | Bounded cache/read profile | Planned |
| [ ] CHK-111 [P1] | Status readout remains diagnostic and outside the hot decision path | Call graph or timing evidence | Planned |
| [ ] CHK-112 [P2] | Canary latency delta is recorded | Before/after canary measurement | Planned |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-120 [P0] | Repository default remains off through P2 | Config search and profile matrix | Planned |
| [ ] CHK-121 [P0] | `=0` kill-switch is documented and exercised | Fleet-wide rollback probe | Planned |
| [ ] CHK-122 [P0] | Per-hub prior manifests are retained before P4 | Manifest inventory | Planned |
| [ ] CHK-123 [P1] | Stop-on-first-failure promotion rule is enforced | Cutover driver or runbook evidence | Planned |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-130 [P0] | Environment flag documentation satisfies repository governance | Reference review | Planned |
| [ ] CHK-131 [P0] | Frozen scorer pin is honored across all stages | Digest ledger | Planned |
| [ ] CHK-132 [P1] | Observability output contains no secrets or raw prompt retention | Schema and fixture review | Planned |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Cross-document ownership review | Planned |
| [ ] CHK-141 [P1] | P0-to-P4 sequence and rollback are synchronized across supporting docs | Spec-doc diff review | Planned |
| [ ] CHK-142 [P1] | Follow-ups list every external implementation surface not changed here | `implementation-summary.md` review | Planned |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decision owner | [ ] Planned ratification | |
| Runtime owner | P0-P4 implementation owner | [ ] Planned review | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Planned review | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 30 | 0/30 | Planned |
| P1 Items | 16 | 0/16 | Planned |
| P2 Items | 1 | 0/1 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: The ruling, P0-to-P4 stage gates, fallback and observability behavior, manifest freshness, route parity, frozen-scorer integrity, and reversible cutover.

**Current Boundary**: Documentation is in Planned state. No runtime default, manifest eligibility consumer, CI gate, canary profile, or hub directive has been changed by this packet.
<!-- /ANCHOR:summary -->

