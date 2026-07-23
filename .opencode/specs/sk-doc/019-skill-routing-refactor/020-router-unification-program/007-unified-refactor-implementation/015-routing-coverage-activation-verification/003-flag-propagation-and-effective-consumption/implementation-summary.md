---
title: "Implementation Summary: Compiled Routing Flag Propagation & Effective Consumption"
description: "Completion record for the flag-propagation and effective-consumption phase. Implemented and committed in a1cdb65d90 behind the still-off SPECKIT_COMPILED_ROUTING flag: the flag added to both CHILD_ENV_ALLOWLIST sets and the compiled decision threaded through the native brief, the CLI subprocess interface, and the hook render. Routing stays byte-identical to legacy; the staged default-on cutover stays operator-gated (P4/011)."
trigger_phrases:
  - "compiled routing flag propagation implementation summary"
  - "compiledRoute consumption current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled the completion record to the implemented+committed state (code landed in a1cdb65d90)"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers:
      - "None for this child (implemented in a1cdb65d90); the program-level default-on cutover stays operator-gated (P4/011)."
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
    completion_pct: 100
    open_questions:
      - "None blocking — the child scope is complete; cutover timing is an operator decision (P4/011)."
    answered_questions:
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary? Settled: a top-level metadata.compiledRouteSummary (ADR-001), implemented in a1cdb65d90."
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
| **Status** | Implemented — landed in `a1cdb65d90`, behind the still-off `SPECKIT_COMPILED_ROUTING` flag. The flag was added to both `CHILD_ENV_ALLOWLIST` sets and the compiled decision threaded through the native brief, the CLI `subprocess.ts` interface, and the hook render; routing stays byte-identical to legacy. The staged default-on cutover stays operator-gated (P4/011) and is not done. |
| **Date** | 2026-07-20 |
| **Level** | 3 |
| **Runtime change** | Additive propagation and consumption plumbing landed in `a1cdb65d90`: two exact-key env allowlist additions, a typed `compiledRouteSummary`, brief rendering, and serving-state-aware cache invalidation |
| **Repository default** | Unchanged; `SPECKIT_COMPILED_ROUTING` remains default-off. This phase only makes it reachable and consumable when enabled. |
| **Verification** | Commit `a1cdb65d90` contains the native/bridge flag tests, four-outcome brief tests, legacy-shape fallback test, and `=0` cache-invalidation test; packet strict validation is rerun after this reconciliation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This phase closes the two structural reasons default-on is a no-op end-to-end (CF-ACT-1, CF-ACT-2) plus the CF-ACT-10 cache slice: the flag is stripped by both child-env allowlists so it never reaches the advisor daemon, and the compiled decision the advisor attaches additively is dropped at two independent rebuild sites (the bridge `buildNativeBrief` and the CLI `AdvisorRecommendation` interface). All four drop/strip sites were CONFIRMED against source this session (zero flag hits in both allowlists; zero `compiledRoute` hits in the bridge and in `subprocess.ts`).

This work is implemented and committed in `a1cdb65d90`: the flag was added to both allowlists; the compiled decision threaded (as a top-level `metadata.compiledRouteSummary`, ADR-001) through the native brief, the CLI interface, and the hook render; 002's serving-state fingerprint folded into both cache keys (ADR-002) so a flip or `=0` invalidates a stale brief; and the 4-action outcome rendered as an additive brief line (ADR-003). Every change is additive and byte-identical to legacy on routing fields, the three frozen scorer files stay pinned, every step names a byte-scoped or flag-based rollback, and no touched runtime path reads under `.opencode/specs`.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 1: Readiness and Inventory

Confirmed the `002` foundation in `4153cbebd8`, re-anchored the runtime surfaces, preserved the frozen-scorer baseline, and implemented the three selected architecture choices.

### Phase 2: Propagate, Consume, Invalidate

Added `SPECKIT_COMPILED_ROUTING` as one exact key in both `CHILD_ENV_ALLOWLIST` sets. `buildNativeBrief` now derives a top-level `metadata.compiledRouteSummary`; the CLI `AdvisorRecommendation` interface preserves it; and the plugin renders its outcome into injected system context. The plugin cache consumes the serving-state signature, while the promoted engine cache keys by manifest fingerprint.

### Phase 3: Prove

Added native-launcher and bridge child-env probes for unset/`0`/`1`, four-action `buildNativeBrief` coverage, plugin render coverage, legacy-shape fallback coverage, and a `=0` cache-invalidation test. The changed-file set contains no frozen scorer and introduces no runtime import from `.opencode/specs`.

All delivered runtime changes are contained in `a1cdb65d90`; this reconciliation changes documentation only.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the ordered gates in `plan.md`: the `002` foundation landed first, then `a1cdb65d90` added the two allowlist entries, decision-summary threading, CLI preservation, hook rendering, and cache invalidation. The same commit added native-launcher and bridge-path env probes plus bridge/plugin consumption tests. The change stayed additive and left the default off.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences remain authoritative in `decision-record.md`.

| Decision | Status | Delivered Effect |
|----------|--------|----------------|
| Thread a top-level `metadata.compiledRouteSummary` (ADR-001) | Implemented in `a1cdb65d90` | One small typed shape crosses the CLI interface and both briefs; auditable, byte-stable |
| Consume serving-state fingerprints for cache invalidation (ADR-002) | Implemented in `a1cdb65d90` | A flag or serving-state change forces a fresh brief; the promoted engine cache keys by manifest fingerprint |
| Render the 4-action outcome as an additive brief line (ADR-003) | Implemented in `a1cdb65d90` | Legacy brief shape remains unchanged when no compiled decision is served |
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
| Source anchors and delivered diff | Pass — `a1cdb65d90` contains both exact-key allowlist additions, `compiledRouteSummary` threading, CLI preservation, hook rendering, and cache inputs |
| Native child-env propagation | Pass — `.opencode/bin/compiled-routing-flag-propagation.vitest.ts` covers unset/`0`/`1` and rejects prefix widening |
| Bridge child-env propagation | Pass — `compiled-routing-consumption.vitest.ts` covers unset/`0`/`1` on the bridge spawn path |
| Compiled decision survival | Pass — the bridge tests cover the top-level summary and all four actions; `subprocess.ts` preserves the typed field |
| Legacy-shape fallback | Pass — no summary or compiled line is emitted when no compiled decision is served |
| `=0` kill + cache invalidation | Pass — the plugin test proves a cached compiled brief is not re-served after `=0` |
| Frozen scorer digest comparison | Pass — none of the three frozen scorer paths appears in `a1cdb65d90`; end-of-reconciliation SHA-256 is checked separately |
| Spec-folder strict validation | Pending only until final metadata regeneration; final command and result are recorded at handoff |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 ready | Done | `002` foundation landed first in `4153cbebd8`; frozen scorer baseline preserved |
| M1 flag reachable | Done | Both exact-key allowlist additions landed in `a1cdb65d90` with unset/`0`/`1` tests |
| M2 decision consumable | Done | Native brief summary, CLI field, and injected-context render landed in `a1cdb65d90` |
| M3 kill-safe caches | Done | Serving-state and manifest fingerprint inputs landed; `=0` invalidation is tested |
| M4 proven | Done for implementation scope | Commit-local propagation, four-action, legacy-shape, and kill tests exist; live default-on canary remains operator-gated in P4/011 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default remains off.** This child makes the flag reachable and the decision consumable; it does not enable compiled routing by default or cut over any hub.
2. **No live canary was authorized here.** The operator-gated staged canary and default flip remain P4/011 work after the coverage-closure join gate is green.
3. **Performance sampling was not added.** The cache work is bounded by the seven-hub serving-status set, but no before/after hit-rate sample was committed.
4. **Decision-record status text remains a documentation follow-up.** The implemented choices are unambiguous in `a1cdb65d90`; this summary records the delivered state without claiming a live cutover.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] `002` foundation confirmed in `4153cbebd8` before this child landed.
- [x] Both exact-key allowlist additions, decision-summary threading, CLI preservation, hook render, and cache inputs landed in `a1cdb65d90`.
- [x] Native and bridge propagation tests plus four-action/legacy-shape/`=0` consumption tests landed in `a1cdb65d90`.
- [ ] Run the live canary and default-on sequence only through P4/011 after siblings 013/014 satisfy the join gate and an operator authorizes execution.
- [ ] Collect an optional before/after cache hit-rate sample if performance evidence is required for cutover.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

Implemented in `a1cdb65d90` behind the still-off flag. The concrete cache seams are the plugin's seven-hub serving-state signature and the promoted engine's manifest fingerprint, which preserves the plan's invalidation intent without reading the spec tree. No routing decision or frozen scorer changed. The staged default-on cutover remains P4/011 work and is operator-gated by design.
<!-- /ANCHOR:deviations -->
