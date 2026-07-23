---
title: "Verification Checklist: Compiled Routing Flag Propagation & Effective Consumption"
description: "Implemented-state verification gate for flag propagation and compiled-decision consumption. Commit a1cdb65d90 added both exact-key allowlist entries, native/bridge propagation tests, decision-summary threading, CLI preservation, hook rendering, and serving-state-aware cache invalidation. The repository default remains off; live canary and cutover stay operator-gated in P4/011."
trigger_phrases:
  - "compiled routing flag propagation checklist"
  - "compiledRoute consumption verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled verification evidence to commit a1cdb65d90"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Optional cache hit-rate sampling before cutover"
    answered_questions:
      - "Threaded top-level metadata.compiledRouteSummary in a1cdb65d90"
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

Rows marked Done are backed by `a1cdb65d90`, its committed tests, or the unchanged frozen-scorer digest set. The only unchecked row is optional cache hit-rate sampling; live canary and default-on execution remain outside this child's completed scope and stay operator-gated in P4/011.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-001 [P0] | `002-runtime-promotion-and-status-foundation` is green (promoted closure, tri-state flag, serving-state fingerprint) | Foundation landed first in `4153cbebd8`; consumed by `a1cdb65d90` | Done |
| [x] CHK-002 [P0] | Source anchors re-anchored on symbols (drift-tolerant) | Delivered diff in `a1cdb65d90` identifies both allowlists, bridge, CLI, plugin, and cache seams | Done |
| [x] CHK-003 [P0] | Frozen scorer baseline is captured | Frozen scorer paths absent from `a1cdb65d90`; end-of-run SHA-256 ledger verifies 3/3 unchanged | Done |
| [x] CHK-004 [P1] | ADR-001/002/003 settled (what to thread, fingerprint source, render form) | The commit implements `metadata.compiledRouteSummary`, serving fingerprints, and additive brief rendering | Done |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-010 [P0] | Both allowlists add exactly one literal key; no prefix widening | `a1cdb65d90`; native test rejects a similarly named key and both paths test unset/`0`/`1` | Done |
| [x] CHK-011 [P0] | The brief rebuild passes the decision through and never recomputes a routing field | `buildNativeBrief` derives only the additive summary; four-action and legacy-shape assertions in the committed test | Done |
| [x] CHK-012 [P0] | The CLI `AdvisorRecommendation` interface carries the field and typechecks | `subprocess.ts` adds, coerces, and returns the typed optional `compiledRouteSummary` in `a1cdb65d90` | Done |
| [x] CHK-013 [P1] | The cache fingerprint reuses promoted serving state and adds no spec-tree read | Plugin consumes status rows; promoted engine keys by manifest fingerprint; no new spec-tree import in `a1cdb65d90` | Done |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-020 [P0] | Flag present in the daemon child on the native launcher path | `compiled-routing-flag-propagation.vitest.ts` covers unset/`0`/`1` | Done |
| [x] CHK-021 [P0] | Flag present in the daemon child on the no-dist fallback path | `compiled-routing-consumption.vitest.ts` covers bridge unset/`0`/`1` | Done |
| [x] CHK-022 [P0] | A served compiled decision survives to the injected brief | Bridge summary test plus plugin injected-context test in `a1cdb65d90` | Done |
| [x] CHK-023 [P0] | The decision survives the CLI `subprocess.ts` interface (second drop site) | Typed field, coercion, and returned object are present in `subprocess.ts` at `a1cdb65d90` | Done |
| [x] CHK-024 [P0] | Each 4-action outcome (route/clarify/defer/reject) survives summary construction | Four parameterized action assertions in the committed consumption test | Done |
| [x] CHK-025 [P0] | `SPECKIT_COMPILED_ROUTING=0` disables cached compiled consumption | Plugin test proves `=0` forces a respawn instead of re-serving the cached compiled brief | Done |
| [x] CHK-026 [P0] | A serving-state change or `=0` invalidates a stale compiled brief | Status-signature and plugin cache-miss tests in `a1cdb65d90` | Done |
| [x] CHK-027 [P0] | Compiled routing remains additive to the legacy routing fields | Legacy recommendation yields no summary/compiled line; repeated compiled decisions are byte-identical | Done |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-030 [P0] | Both strip sites (launcher + bridge) are fixed, not one | Both exact-key allowlist changes and both path tests landed in `a1cdb65d90` | Done |
| [x] CHK-031 [P0] | Both drop sites (bridge brief + CLI interface) are fixed, not one | `buildNativeBrief` and `subprocess.ts` both preserve the summary | Done |
| [x] CHK-032 [P0] | The hook render is the third surface and carries the outcome | Plugin injected-context test asserts the rendered compiled line | Done |
| [x] CHK-033 [P0] | No drop site remains between attach and injection on the delivered path | Commit trace covers attach-derived summary, bridge response, CLI type, plugin render, and injected system entry | Done |
| [x] CHK-034 [P1] | The change is additive; legacy brief byte-identical when no decision is served | Legacy-shape tests assert no summary and exactly one legacy brief entry | Done |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-040 [P0] | The allowlist additions forward one literal key and no secret or prompt content | Both sets add only `SPECKIT_COMPILED_ROUTING`; prefix-neighbour test stays excluded | Done |
| [x] CHK-041 [P0] | Missing compiled decision degrades to the legacy brief shape | Legacy recommendation test emits no compiled summary or injected line | Done |
| [x] CHK-042 [P1] | `=0` precedence cannot be overridden by a cached compiled brief | Committed cache fixture changes `1` to `0` and proves a new bridge spawn | Done |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-050 [P1] | The flag's reachable-and-consumed behavior preserves 002's documented tri-state semantics | `4153cbebd8` ENV entry plus `a1cdb65d90` exact-key propagation and `=0` tests | Done |
| [x] CHK-051 [P0] | Checklist and implementation summary agree on the implemented child state | Reconciled to `a1cdb65d90`; default-on cutover remains explicitly separate | Done |
| [x] CHK-052 [P1] | Consumption uses the flowing compiled decision rather than re-deriving routing | Bridge summary is derived from attached `compiledRoute`; plugin only renders that summary | Done |
| [x] CHK-053 [P1] | Strict validation reports zero errors | Final `validate.sh --strict` result recorded after metadata regeneration | Done |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-060 [P0] | No touched runtime path resolves under `.opencode/specs` | `a1cdb65d90` uses promoted runtime/status paths; changed-file inspection introduces no spec import | Done |
| [x] CHK-061 [P0] | The cache-invalidation seam consumes the promoted status/engine closure, not a spec-tree copy | Plugin status probe and promoted engine manifest fingerprint are the committed inputs | Done |
| [x] CHK-062 [P1] | No frozen scorer file is modified | Frozen paths absent from the commit; start/end SHA-256 comparison covers 3/3 | Done |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-100 [P0] | The three ADR choices have explicit implementation consequences | Summary threading, serving fingerprints, and additive rendering are present in `a1cdb65d90` | Done |
| [x] CHK-101 [P0] | No implementation edit precedes the `002` foundation | `4153cbebd8` precedes `a1cdb65d90` in branch history | Done |
| [x] CHK-102 [P1] | A byte-scoped rollback exists for each additive change | Allowlist entries, optional fields, rendered line, and cache inputs are isolated additions in `a1cdb65d90`; `=0` is the operational kill | Done |
| [x] CHK-103 [P0] | Routing-decision identity remains an invariant | Commit changes propagation/metadata/cache plumbing; legacy-shape and repeated-decision tests guard decision drift | Done |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-110 [P1] | The serving-state fingerprint adds no unbounded per-request work | The signature covers the fixed seven-hub status set; engine cache keys one manifest fingerprint | Done |
| [x] CHK-111 [P1] | The brief threading stays off the hot routing-decision path | Summary construction and rendering occur after advisor recommendation output | Done |
| [ ] CHK-112 [P2] | Cache hit-rate is not degraded beyond intended serving-state misses | Optional before/after metric sample was not committed | Deferred (P2) |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-120 [P0] | Repository default remains off; this phase only makes the flag reachable | `a1cdb65d90` changes no default-on cohort or serving manifest | Done |
| [x] CHK-121 [P0] | `=0` kill-switch propagates on both spawn paths and invalidates cached consumption | Native and bridge env tests plus plugin cached-brief kill test | Done |
| [x] CHK-122 [P1] | The additive change has a bounded rollback | Remove the exact-key entries/optional fields/render/cache inputs or set `=0`; no data migration exists | Done |
| [x] CHK-123 [P1] | Native and bridge spawn paths apply the same flag semantics | Both test suites cover unset/`0`/`1` | Done |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-130 [P0] | The flag's semantics remain governed by 002's ENV-REFERENCE entry | This child forwards the same literal tri-state flag and adds no alternate semantics | Done |
| [x] CHK-131 [P0] | Frozen scorer pin is honored across the phase | Commit path audit plus start/end digest ledger | Done |
| [x] CHK-132 [P1] | The injected brief contains no secret or raw-prompt retention | Summary schema contains outcome, hub, targets, authority, fingerprint, and generation only | Done |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-140 [P0] | The authoritative scope stays in `spec.md` and `decision-record.md` | Reconciliation records delivery without expanding runtime scope | Done |
| [x] CHK-141 [P1] | Phase sequence and rollback are synchronized across supporting docs | Summary preserves `002` dependency, additive rollback, `=0` kill, and P4 boundary | Done |
| [x] CHK-142 [P1] | Follow-ups contain only residual operator/performance work | Summary follow-ups retain P4 live execution and optional cache sampling | Done |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Cutover go-ahead owner | Not granted; live P4/011 execution remains gated | 2026-07-21 |
| Runtime owner | Propagation + consumption owner | Implementation landed in `a1cdb65d90` | 2026-07-21 |
| Benchmark owner | Frozen-scorer and parity owner | Frozen paths unchanged; end-of-run digests verified separately | 2026-07-21 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 31 | 31/31 | Verified |
| P1 Items | 16 | 16/16 | Verified |
| P2 Items | 1 | 0/1 | Deferred |

**Verification Date**: 2026-07-21; reconciled to commit `a1cdb65d90`, with final strict validation run after metadata regeneration.

**Verification Scope**: Flag propagation into the daemon child on both spawn paths, decision survival through the native brief + CLI interface + hook render, the 4-action outcome render, cache invalidation on flip/`=0`, route-gold parity, frozen-scorer integrity, the no-spec-read boundary, and reversibility.

**Current Boundary**: The child implementation is delivered. The repository default remains off; no hub was cut over. Live canary/default-on execution remains operator-gated in P4/011, and optional cache hit-rate sampling remains deferred.
<!-- /ANCHOR:summary -->
