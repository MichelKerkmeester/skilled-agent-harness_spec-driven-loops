---
title: "Implementation Summary: Compiled Routing Default-On Safe Cutover"
description: "Planned-state record for the P0-to-P4 compiled-routing cutover. The ruling is settled (adopt the phased path); all runtime implementation remains future work gated on an operator go-ahead to begin P0."
trigger_phrases:
  - "compiled routing default-on planned summary"
  - "P0 P4 cutover current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Settled the ruling (adopt the phased path) and reconciled the packet to that status"
    next_safe_action: "Begin P0 on operator go-ahead"
    blockers: []
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
    completion_pct: 30
    open_questions:
      - "Which environment profile hosts the P2 canary?"
    answered_questions:
      - "Flip the default now or adopt the phased path? Adopt the phased path, settled on the analysis; operator may override."
---
# Implementation Summary: Compiled Routing Default-On Safe Cutover

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Ruling settled (adopt the phased path P0->P4, decided on the analysis; reversible and operator-overridable). No runtime implementation started; a separate operator go-ahead gates P0. |
| **Date** | 2026-07-20 |
| **Level** | 3 |
| **Runtime change** | None authored by this documentation phase |
| **Repository default** | Unchanged; compiled routing remains default-off |
| **Verification** | Packet strict validation run; Errors zero on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The decision packet settles the ruling on the analysis: adopt a staged path to compiled routing as the effective default rather than flipping the default now. No runtime work has begun. The current live integration remains additive metadata only, the compiled and legacy decisions remain identical, and the repository flag remains off by default. The operator may override the ruling to flip-now at any time; that override is available but not blocking.

The planned program starts by documenting and observing the existing behavior, then adds drift enforcement, a bounded canary, data-driven eligibility, and finally a reversible hub-by-hub default change. The three benchmark scorer files remain pinned throughout.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### P0: Governance, Observability, and Resolver Stability

Document the environment flag, distinguish drift-to-legacy from resolver breakage, expose serving status per hub, and remove or explicitly guard the runtime dependency on a spec-tree path.

### P1 and P2: Enforcement and Canary

Add re-mint-required CI for stale manifests, then enable compiled routing in one named environment profile while the repository default remains off.

### P3 and P4: Eligibility and Effective Default

Derive both eligibility consumers from the manifest-freshness rule already owned by `decision-record.md`, then stage the global default one hub at a time while preserving `SPECKIT_COMPILED_ROUTING=0` as the fleet-wide kill-switch.

No runtime file, environment profile, manifest, CI job, hub directive, or frozen scorer file was changed while authoring this record.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery follows the ordered gates in `plan.md`: an operator go-ahead to begin, P0 safety surface, P1 drift enforcement, P2 canary, P3 derived eligibility, and P4 staged cutover. Each stage records parity, status, rollback, and scorer-integrity evidence before the next stage can begin. The implementation stops at the first failed gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences remain authoritative in `decision-record.md`.

| Decision | Status | Planned Effect |
|----------|--------|----------------|
| Treat global default-on as the P4 outcome | Accepted | No default change before P0-P3 evidence |
| Derive eligibility from a valid fresh manifest | Accepted (implemented in P3) | Future onboarding and both runtime consumers share one rule |
| Promote the resolver to a stable runtime path | Accepted (implemented in P0) | Spec-tree renames stop being a silent runtime drift source |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep the repository default off during documentation, drift CI, and the canary | The current compiled path changes no routing decisions, so safety and observability must land before the default carries operational weight. |
| Pin the three scorer files at every stage | The parity baseline must stay stable while the harness around it evolves. |
| Keep rollback stage-local | A failed canary or eligibility change should not discard earlier governance and diagnostic improvements. |
| Make sibling packets consume these contracts | One authoritative fallback and eligibility definition prevents create-skill and benchmark behavior from diverging. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ruling (ADR-001) | Settled: adopt the phased path, decided on the analysis; operator override to flip-now remains available |
| Runtime implementation tests | Planned; no runtime implementation exists in this phase |
| Route-gold compiled-versus-legacy parity | Planned for the benchmark-alignment phase |
| Drift CI and status readout | Planned for P0-P1 |
| Canary and kill-switch drill | Planned for P2 and P4 |
| Frozen scorer digest comparison | Planned per stage |
| Spec-folder strict validation | Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision --strict`; Errors zero |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 ruling | Settled | Adopt the phased path (decided on the analysis); override available |
| M1 P0 safety surface | Planned | No implementation evidence |
| M2 P1 drift enforcement | Planned | No implementation evidence |
| M3 P2 canary | Planned | Canary profile not selected |
| M4 P3 eligibility | Planned | Current allowlists remain hand-maintained |
| M5 P4 effective default | Planned | Repository default remains off |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ruling is reversible and overridable.** The settled phased path is a documentation decision; the operator may override to flip-now, and no runtime state depends on the ruling yet.
2. **The flag is still undocumented in the environment reference.** That gap is P0 implementation work, not work performed by this authoring phase.
3. **Drift and breakage are not yet distinguishable in the live verification surface.** The planned P0 harness change owns that distinction.
4. **Eligibility is still duplicated.** The P3 implementation has not replaced the current hand-maintained sets.
5. **The resolver still depends on the current runtime path arrangement.** P0 must promote it or record and guard an approved exception.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Optional: the operator may override the settled ruling to flip-now; record the override in `decision-record.md` if chosen.
- [ ] Choose the P2 canary environment profile and promotion owner.
- [ ] Resolve the P0 architecture choice: promote the resolver to a stable runtime location or approve a guarded residual coupling.
- [ ] Implement P0-P4 runtime, CI, environment, and hub-directive changes outside this documentation-only authoring pass.
- [ ] Implement create-skill onboarding alignment in the dependent packet after the P3 minter and eligibility interfaces are stable.
- [ ] Implement Lane C compiled-path parity and drift fixtures in the dependent benchmark packet without editing the frozen scorer files.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None recorded. Implementation has not begun, so there is no execution delta to report.
<!-- /ANCHOR:deviations -->
