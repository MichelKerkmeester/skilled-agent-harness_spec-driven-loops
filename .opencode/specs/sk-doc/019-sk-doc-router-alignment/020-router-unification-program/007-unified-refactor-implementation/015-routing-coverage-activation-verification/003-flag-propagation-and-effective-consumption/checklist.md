---
title: "Verification Checklist: Compiled Routing Flag Propagation & Effective Consumption"
description: "Planned verification gate for un-stripping the flag in both child-env allowlists and un-dropping the compiled decision through the native brief, CLI interface, and hook render, with cache invalidation and a =0 kill. Every item remains unchecked until implementation evidence exists."
trigger_phrases:
  - "compiled routing flag propagation checklist"
  - "compiledRoute consumption verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the unchecked Planned verification matrix"
    next_safe_action: "Collect implementation evidence only after 002 is green and the go-ahead is given"
    blockers:
      - "002 must land green before evidence collection is meaningful"
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
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary?"
    answered_questions: []
---
# Verification Checklist: Compiled Routing Flag Propagation & Effective Consumption

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
| **[P0]** | Hard blocker | The phase cannot complete while unchecked |
| **[P1]** | Required | Must be verified or explicitly deferred by the operator |
| **[P2]** | Optional | May defer with an owner and reason |

All rows are **Planned** and unchecked. The evidence column names what must exist later; it is not current evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-001 [P0] | `002-runtime-promotion-and-status-foundation` is green (promoted closure, tri-state flag, serving-state fingerprint) | Upstream-phase status + fingerprint interface | Planned |
| [ ] CHK-002 [P0] | Source anchors re-anchored on symbols (drift-tolerant) | Confirmed symbol/line table for the six runtime targets | Planned |
| [ ] CHK-003 [P0] | Frozen scorer baseline is captured | Three SHA-256 values | Planned |
| [ ] CHK-004 [P1] | ADR-001/002/003 settled (what to thread, fingerprint source, render form) | Decision-record entries | Planned |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-010 [P0] | Both allowlists add exactly one literal key; no prefix widening | Set-membership diff on both files | Planned |
| [ ] CHK-011 [P0] | The brief rebuild passes the decision through and never recomputes a routing field | Code review of `buildNativeBrief`; field-set assertion | Planned |
| [ ] CHK-012 [P0] | The CLI `AdvisorRecommendation` interface carries the field and typechecks | TypeScript build; grep-for-field | Planned |
| [ ] CHK-013 [P1] | The cache fingerprint reuses 002's serving-state hash and adds no spec-tree read | Dependency inspection; resolved-path check | Planned |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-020 [P0] | Flag present in the daemon child on the native launcher path | Native child-env probe (unset/`0`/`1`) | Planned |
| [ ] CHK-021 [P0] | Flag present in the daemon child on the no-dist fallback path | Fallback child-env probe | Planned |
| [ ] CHK-022 [P0] | A real compiled decision survives to the injected brief (native) | Bridge+plugin e2e capture | Planned |
| [ ] CHK-023 [P0] | The decision survives the CLI `subprocess.ts` interface (second drop site) | CLI-path e2e capture | Planned |
| [ ] CHK-024 [P0] | Each 4-action outcome (route/clarify/defer/reject) renders in system-context | Per-outcome injected-context fixture | Planned |
| [ ] CHK-025 [P0] | `SPECKIT_COMPILED_ROUTING=0` disables consumption end-to-end | `=0` kill test log | Planned |
| [ ] CHK-026 [P0] | A manifest flip or `=0` invalidates a stale compiled brief | Cache-miss fixture on both caches | Planned |
| [ ] CHK-027 [P0] | Compiled routing equals legacy routing (additive only) | Route-gold normalized decision parity report | Planned |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-030 [P0] | Both strip sites (launcher + bridge) are fixed, not one | Both-file allowlist diff | Planned |
| [ ] CHK-031 [P0] | Both drop sites (bridge brief + CLI interface) are fixed, not one | Both-surface field presence | Planned |
| [ ] CHK-032 [P0] | The hook render is the third surface and carries the outcome | Injected-context review | Planned |
| [ ] CHK-033 [P0] | No third/undiscovered drop site remains between attach and injection | End-to-end trace of the brief shape | Planned |
| [ ] CHK-034 [P1] | The change is additive; legacy brief byte-identical when no decision is served | Absent-decision brief diff | Planned |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-040 [P0] | The allowlist additions forward one literal key and no secret or prompt content | Child-env schema review | Planned |
| [ ] CHK-041 [P0] | A resolver/consumption failure returns to legacy rather than throwing into routing | Error-injection test | Planned |
| [ ] CHK-042 [P1] | `=0` precedence cannot be overridden by a cached compiled brief | `=0`-with-cached-brief fixture | Planned |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-050 [P1] | The flag's reachable-and-consumed behavior is reflected where 002 documented it | Cross-reference to 002's ENV-REFERENCE entry | Planned |
| [ ] CHK-051 [P0] | Spec, plan, tasks, checklist, decision-record, and summary agree on Planned status | Cross-document status audit | Planned |
| [ ] CHK-052 [P1] | Downstream children reference this phase's flowing decision rather than re-deriving it | Link review | Planned |
| [ ] CHK-053 [P1] | Strict validation reports zero errors | Validation log | Planned |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-060 [P0] | No touched runtime path resolves under `.opencode/specs` | Resolved-module-path inspection per file | Planned |
| [ ] CHK-061 [P0] | The cache-invalidation seam consumes 002's promoted closure, not a spec-tree copy | Import/require inspection | Planned |
| [ ] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Planned |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-100 [P0] | The three ADRs have explicit implementation consequences | Decision-to-task traceability | Planned |
| [ ] CHK-101 [P0] | No Phase 2 edit begins before 002 is green | Dependency-gate record | Planned |
| [ ] CHK-102 [P1] | A byte-scoped rollback exists for each addition | Per-addition revert drill | Planned |
| [ ] CHK-103 [P0] | Routing-decision identity remains an invariant | Full normalized parity result | Planned |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-110 [P1] | The serving-state fingerprint adds no unbounded per-request work | Reused-hash inspection | Planned |
| [ ] CHK-111 [P1] | The brief threading stays off the hot routing-decision path | Call-graph review | Planned |
| [ ] CHK-112 [P2] | Cache hit-rate is not degraded beyond the intended flip-driven misses | Before/after cache-metric sample | Planned |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-120 [P0] | Repository default remains off; this phase only makes the flag reachable | Config search; flag-default assertion | Planned |
| [ ] CHK-121 [P0] | `=0` kill-switch is exercised end-to-end on both spawn paths | Kill-test log | Planned |
| [ ] CHK-122 [P1] | The change is reversible by removing the additions | Revert drill output | Planned |
| [ ] CHK-123 [P1] | Both native and no-dist fallback paths behave identically | Dual-path e2e matrix | Planned |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-130 [P0] | The flag's semantics remain governed by 002's ENV-REFERENCE entry | Reference cross-check | Planned |
| [ ] CHK-131 [P0] | Frozen scorer pin is honored across the phase | Digest ledger | Planned |
| [ ] CHK-132 [P1] | The injected brief contains no secret or raw-prompt retention | Schema and fixture review | Planned |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [ ] CHK-140 [P0] | The authoritative scope stays in `spec.md` and `decision-record.md` | Cross-document ownership review | Planned |
| [ ] CHK-141 [P1] | Phase sequence and rollback are synchronized across supporting docs | Spec-doc diff review | Planned |
| [ ] CHK-142 [P1] | Follow-ups list every runtime surface not changed by this authoring pass | `implementation-summary.md` review | Planned |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Go-ahead owner | [ ] Planned (gated on 002 green) | |
| Runtime owner | Propagation + consumption owner | [ ] Planned review | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Planned review | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 27 | 0/27 | Planned |
| P1 Items | 15 | 0/15 | Planned |
| P2 Items | 1 | 0/1 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Flag propagation into the daemon child on both spawn paths, decision survival through the native brief + CLI interface + hook render, the 4-action outcome render, cache invalidation on flip/`=0`, route-gold parity, frozen-scorer integrity, the no-spec-read boundary, and reversibility.

**Current Boundary**: Documentation is in Planned state. No allowlist, brief surface, CLI interface, hook render, cache key, or test has been changed by this packet. This phase depends on `002-runtime-promotion-and-status-foundation` landing green first.
<!-- /ANCHOR:summary -->
