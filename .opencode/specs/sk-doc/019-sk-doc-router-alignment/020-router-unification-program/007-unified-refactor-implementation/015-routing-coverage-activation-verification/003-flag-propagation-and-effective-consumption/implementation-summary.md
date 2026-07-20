---
title: "Implementation Summary: Compiled Routing Flag Propagation & Effective Consumption"
description: "Planned-state record for the flag-propagation and effective-consumption phase. The Level-3 planning set is authored; all runtime implementation is future work gated on 002 landing green and an operator go-ahead."
trigger_phrases:
  - "compiled routing flag propagation planned summary"
  - "compiledRoute consumption current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the Level-3 planning set; validated the folder to Errors:0"
    next_safe_action: "Begin Phase 1 once 002 lands green and the operator gives the go-ahead"
    blockers:
      - "002 promotion + tri-state flag must land before Phase 2 threading is meaningful"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary?"
    answered_questions: []
---
# Implementation Summary: Compiled Routing Flag Propagation & Effective Consumption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned. The Level-3 planning set is authored; no runtime implementation started. Gated on `002-runtime-promotion-and-status-foundation` landing green and a separate operator go-ahead. |
| **Date** | 2026-07-20 |
| **Level** | 3 |
| **Runtime change** | None authored by this documentation phase |
| **Repository default** | Unchanged; `SPECKIT_COMPILED_ROUTING` remains default-off. This phase only makes it reachable and consumable when enabled. |
| **Verification** | Spec-folder strict validation run; Errors zero on this folder (missing `description.json`/`graph-metadata.json` are expected warnings for a freshly-authored child) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This phase closes the two structural reasons default-on is a no-op end-to-end (CF-ACT-1, CF-ACT-2) plus the CF-ACT-10 cache slice: the flag is stripped by both child-env allowlists so it never reaches the advisor daemon, and the compiled decision the advisor attaches additively is dropped at two independent rebuild sites (the bridge `buildNativeBrief` and the CLI `AdvisorRecommendation` interface). All four drop/strip sites were CONFIRMED against source this session (zero flag hits in both allowlists; zero `compiledRoute` hits in the bridge and in `subprocess.ts`).

No runtime work has begun. The planning set specifies adding the flag to both allowlists; threading the compiled decision (as a top-level `metadata.compiledRouteSummary`, ADR-001) through the native brief, the CLI interface, and the hook render; folding 002's serving-state fingerprint into both cache keys (ADR-002) so a flip or `=0` invalidates a stale brief; and rendering the 4-action outcome as an additive brief line (ADR-003). Every change is additive and byte-identical to legacy on routing fields, the three frozen scorer files stay pinned, every step names a byte-scoped or flag-based rollback, and no touched runtime path reads under `.opencode/specs`.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 1: Readiness and Inventory

Confirm 002 is green (promoted closure, tri-state flag, serving-state fingerprint), re-anchor the six runtime symbols against the live checkout (drift is expected), capture the frozen-scorer baselines, and settle the three ADRs.

### Phase 2: Propagate, Consume, Invalidate

Add `SPECKIT_COMPILED_ROUTING` to both `CHILD_ENV_ALLOWLIST` sets; thread the compiled decision summary through `buildNativeBrief`, the CLI `AdvisorRecommendation` interface, and the hook render; fold 002's serving-state fingerprint into `cacheKeyForPrompt` and the `engineCache` invalidation input.

### Phase 3: Prove

Child-env probes on both spawn paths, bridge+plugin e2e with a real compiled decision, the `=0` propagation kill test, cache-invalidation fixtures, route-gold parity, frozen-digest equality, and the no-spec-read assertion.

No runtime file, allowlist, brief surface, CLI interface, hook render, cache key, or frozen scorer file was changed while authoring this record.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery follows the ordered gates in `plan.md`: 002 green, then Phase 1 readiness, Phase 2 propagate/consume/invalidate, and Phase 3 e2e/parity/kill. Each phase records env-probe, e2e, parity, cache, and scorer-integrity evidence before the next begins. Every propagation and consumption claim is proven on BOTH the native launcher and the no-dist launcher fallback. Implementation stops at the first failed gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences remain authoritative in `decision-record.md`.

| Decision | Status | Planned Effect |
|----------|--------|----------------|
| Thread a top-level `metadata.compiledRouteSummary` (ADR-001) | Proposed, recommended | One small typed shape crosses the CLI interface and both briefs; auditable, byte-stable |
| Consume 002's serving-state fingerprint for cache invalidation (ADR-002) | Proposed, recommended | One source of serving truth; flip/`=0` is a guaranteed cache miss; no spec-tree read |
| Render the 4-action outcome as an additive brief line (ADR-003) | Proposed, recommended | Legacy brief byte-identical when no compiled decision is served |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Depend on 002 rather than re-implement the closure or tri-state flag | Threading is meaningless while the resolver reads under `specs` and the flag is bi-state; 002 owns that foundation. |
| Keep every change additive | The compiled decision is byte-identical to legacy on routing fields, so un-stripping and un-dropping it cannot change what routes. |
| Prove both spawn paths | The flag and the decision must survive on the native launcher AND the no-dist fallback; one path passing is not proof. |
| Pin the three scorer files at every step | The parity baseline must stay stable while the brief/env plumbing around it changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source anchors (both allowlists, both drop sites, attach, hook, caches) | CONFIRMED against source this session (0 flag hits in both allowlists; 0 `compiledRoute` hits in bridge + `subprocess.ts`) |
| Runtime implementation tests | Planned; no runtime implementation exists in this phase |
| Child-env propagation (native + no-dist fallback) | Planned for Phase 3 |
| Bridge+plugin e2e with a real compiled decision | Planned for Phase 3 |
| `=0` propagation kill + cache invalidation | Planned for Phase 3 |
| Route-gold compiled-versus-legacy parity | Planned; consumed read-only from the frozen scorer |
| Frozen scorer digest comparison | Planned per step |
| Spec-folder strict validation | Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption --strict`; Errors zero (missing `description.json`/`graph-metadata.json` are expected warnings) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 ready | Planned | 002 not yet confirmed green in this packet |
| M1 flag reachable | Planned | No allowlist changed |
| M2 decision consumable | Planned | No brief surface changed |
| M3 kill-safe caches | Planned | No cache key changed |
| M4 proven | Planned | No e2e/parity/kill evidence |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This phase is gated on 002.** Un-stripping the flag and un-dropping the decision is meaningless while the resolver reads under `.opencode/specs` and the flag is bi-state; 002 owns that foundation.
2. **The flag is still stripped by both allowlists.** That fix is Phase 2 work, not performed by this authoring pass.
3. **The compiled decision is still dropped at both rebuild sites.** The native brief, CLI interface, and hook render have not been threaded yet.
4. **The caches still key on prompt only.** A serving-state fingerprint has not been folded into `cacheKeyForPrompt` or the `engineCache` yet, so a flip/`=0` could re-serve a stale compiled brief once consumption exists.
5. **The three ADRs are Proposed.** The what-to-thread, fingerprint-source, and render-form decisions should be settled with the operator before Phase 2.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Confirm `002-runtime-promotion-and-status-foundation` is green and expose its serving-state fingerprint before Phase 2.
- [ ] Settle ADR-001 (full object vs `metadata.compiledRouteSummary`), ADR-002 (fingerprint source), and ADR-003 (render form).
- [ ] Add `SPECKIT_COMPILED_ROUTING` to both `CHILD_ENV_ALLOWLIST` sets (launcher + bridge).
- [ ] Thread the compiled decision through the native brief, the CLI `subprocess.ts` interface, and the hook render.
- [ ] Fold the serving-state fingerprint into both cache keys without re-introducing a read under `.opencode/specs`.
- [ ] Add the bridge+plugin e2e (native + no-dist fallback) and the `=0` propagation kill test outside this documentation-only authoring pass.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None recorded. Implementation has not begun, so there is no execution delta to report.
<!-- /ANCHOR:deviations -->
