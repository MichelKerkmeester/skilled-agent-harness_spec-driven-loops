---
title: "Implementation Summary: Runtime Promotion & Status Foundation (P0)"
description: "Planned-state record for the compiled-routing P0 foundation. The Level-3 plan is authored; all runtime work (closure promotion, eligibility/engine split, status probe, ENV entry, tri-state flag, breadcrumbs, durable no-spec-import rule) is future work gated on an operator go-ahead. No runtime file changed and no hub lit."
trigger_phrases:
  - "runtime promotion status foundation planned summary"
  - "compiled routing P0 foundation status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the Planned-state record for the P0 foundation"
    next_safe_action: "Begin Phase 1 inventory on operator go-ahead"
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
    completion_pct: 0
    open_questions:
      - "Which stable runtime directory hosts the promoted closure?"
    answered_questions: []
---
# Implementation Summary: Runtime Promotion & Status Foundation (P0)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — Level-3 planning set authored; no runtime implementation started. This is the P0 foundation; children 003-011 depend on it. Execution gated on an operator go-ahead. |
| **Date** | 2026-07-20 |
| **Level** | 3 |
| **Runtime change** | None authored by this planning phase |
| **Hubs lit** | Zero; the per-hub default-on cohort is empty and the flag stays off |
| **Verification** | Spec-folder strict validation run; Errors zero on this folder (warnings limited to the parent-owned description.json/graph-metadata) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet is the P0 foundation of the routing-coverage program, and the plan for it is authored but not executed. No runtime work has begun. The compiled path still reads its resolver, engines, activation manifests, and per-hub bundles from inside the spec tree; the flag is still bi-state and undocumented; there is still no per-hub serving-status readout; and the three fallback catches are still silent. This record states what the foundation will build and confirms that authoring it changed nothing at runtime.

The planned work promotes the whole runtime closure to a stable path so the runtime never reads under `.opencode/specs`, splits eligibility from the engine-dispatch map with a divergence cross-check, ships a per-hub status probe with a cause code that separates drift from breakage, documents and tri-states the flag without lighting any hub, adds stderr breadcrumbs to the three catches, and adds a durable rule that blocks any future runtime import from the spec tree. The three benchmark scorer files stay pinned throughout, and compiled routing stays byte-identical to legacy.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing at runtime. The list below is the planned scope this record commits to, not delivered work.

### Runtime stabilization

Promote the resolver, engine loader, seven activation manifests, and seven per-hub bundles to a stable runtime path; point the shim at it; keep the spec-tree copy as the authored source that builds or copies into place; delete the residual-coupling branch and correct the stale parent follow-up line.

### Separation and observability

Split manifest-derived eligibility from the `HUB_CHILD` engine map, standardize one stable per-hub engine entrypoint, and add the divergence cross-check. Ship `compiled-route-status.cjs --hub | --all` emitting the stable JSON contract with a cause code, and surface it in `advisor_status` and `session_bootstrap`.

### Governance, safety, and durability

Document the flag in ENV-REFERENCE, tri-state it in both read sites with an empty default-on cohort, add stderr breadcrumbs to the three catches, and add the durable no-spec-import CI rule.

No runtime file, resolver, engine map, activation manifest, flag read site, status surface, ENV entry, CI rule, or frozen scorer file was changed while authoring this record, and no hub was lit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery follows the ordered steps in `plan.md`: an operator go-ahead to begin, a Phase 1 inventory and baseline capture, a Phase 2 build (promotion, split, status probe, governance, tri-state, breadcrumbs, durable rule), and a Phase 3 verification (move simulation, truth-table, cause-code matrix, byte-identical parity, frozen-digest equality). Each step records parity, status, rollback, and scorer-integrity evidence before the next begins, and stops at the first failed gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences live in this packet's `decision-record.md` and the parent `../../012-default-on-decision/decision-record.md`.

| Decision | Status | Planned Effect |
|----------|--------|----------------|
| Bind ADR-003 and promote the full closure | Accepted (implemented in Phase 2) | Runtime stops reading under `.opencode/specs`; a spec renumber cannot sever routing |
| Split eligibility from the engine-dispatch table | Accepted (implemented in Phase 2) | `HUB_CHILD` stays an engine map; eligibility derives from manifest freshness; cross-check guards divergence |
| Ship the stable status JSON contract | Accepted (implemented in Phase 2) | One field set plus cause code that downstream children gate on |
| Tri-state the flag with an empty cohort | Accepted (implemented in Phase 2) | Kill-switch and default-on semantics exist; unset stays byte-identical; no hub lit |
| Add the durable no-spec-import rule | Accepted (implemented in Phase 2) | A recurring CI gate protects the promotion from silent regression |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Move the whole closure, not just the resolver | The manifests and bundles share the resolver's failure mode, so promoting one third of the closure would still let a spec renumber sever routing. |
| Keep `HUB_CHILD` as an engine map | It is a live engine-location table, not a removable duplicate, so eligibility is split from it rather than folded into it. |
| Ship the default-on cohort empty | The tri-state mechanism can land safely with no policy members, so this packet changes no behavior and P4 changes only cohort membership. |
| Pin the three scorer files at every step | The parity baseline must stay stable while the runtime around it moves. |
| Make the no-spec-import rule durable | Promotion loses its value if a later edit can re-couple the runtime to the spec tree with no signal. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Local decisions (ADR-001..ADR-005) | Accepted as design direction; implementation is Phase 2 work not yet started |
| Runtime implementation tests | Planned; no runtime implementation exists in this phase |
| Spec-tree-move simulation | Planned for Phase 3 |
| Flag truth-table and status cause-code matrix | Planned for Phase 3 |
| Route-gold compiled-versus-legacy parity | Planned; consumes the frozen scorer read-only |
| Frozen scorer digest comparison | Planned per step |
| Durable no-spec-import rule fixtures | Planned for Phase 2 |
| Spec-folder strict validation | Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation --strict`; Errors zero on this folder (warnings limited to the parent-owned description.json and graph-metadata.json) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 ready to build | Planned | Baselines not captured; runtime directory not chosen |
| M1 runtime stabilized | Planned | Closure not promoted; runtime still reads under `.opencode/specs` |
| M2 separated + observable | Planned | Eligibility still tied to the engine map; no status readout |
| M3 governed | Planned | Flag still bi-state and undocumented; catches still silent |
| M4 guarded + verified | Planned | No durable rule; no parity or truth-table evidence |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is implemented.** This is a Planned-state record; every runtime change is future work gated on an operator go-ahead.
2. **The runtime still reads the spec tree.** The resolver, engines, manifests, and bundles remain under `.opencode/specs`; a spec renumber can still sever routing silently until ADR-001 lands.
3. **The flag is still bi-state and undocumented.** Tri-state parsing and the ENV-REFERENCE entry are Phase 2 work.
4. **There is no serving-status readout.** Drifted and broken remain indistinguishable until the status probe ships.
5. **The promoted runtime copy will need a freshness gate.** This packet wires the build or copy step; the automated staleness check belongs to the downstream P1 drift CI (`../010-rollback-audit-and-non-hub-policy/`).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Choose the stable runtime directory for the promoted closure (OPEN QUESTIONS Q1).
- [ ] Begin Phase 1 inventory and baseline capture after the operator go-ahead.
- [ ] Implement the closure promotion, eligibility split, status probe, ENV entry, tri-state flag, breadcrumbs, and durable rule in Phase 2.
- [ ] Correct the stale residual-coupling follow-up at `../../012-default-on-decision/implementation-summary.md:170` when ADR-001 lands.
- [ ] Hand the stable status contract to the downstream benchmark, playbooks, archiving, and cutover children once it is shipped.
- [ ] Wire the promoted-copy freshness check in the downstream P1 drift CI without editing the frozen scorer files.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None recorded. Implementation has not begun, so there is no execution delta to report.
<!-- /ANCHOR:deviations -->
