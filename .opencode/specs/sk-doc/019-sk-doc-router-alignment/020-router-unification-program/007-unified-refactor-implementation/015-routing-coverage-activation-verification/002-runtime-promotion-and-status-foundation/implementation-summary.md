---
title: "Implementation Summary: Runtime Promotion & Status Foundation (P0)"
description: "Completion record for the compiled-routing P0 foundation. Implemented and committed in 4153cbebd8: closure promotion to .opencode/bin/lib/compiled-routing/, eligibility/engine split, status probe, ENV entry, tri-state flag, breadcrumbs, and the durable no-spec-import rule — all built behind the still-off SPECKIT_COMPILED_ROUTING flag. Compiled routing stayed byte-identical to legacy and no hub was lit."
trigger_phrases:
  - "runtime promotion status foundation planned summary"
  - "compiled routing P0 foundation status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled the completion record to the implemented+committed state (code landed in 4153cbebd8)"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: the promoted closure is hosted at .opencode/bin/lib/compiled-routing/ (landed in 4153cbebd8)"
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
| **Status** | Implemented — landed in 4153cbebd8. The P0 foundation (closure promotion, eligibility/engine split, status probe, ENV entry, tri-state flag, breadcrumbs, durable no-spec-import rule) is built behind the still-off `SPECKIT_COMPILED_ROUTING` flag; children 003-011 consume it. The staged default-on cutover stays operator-gated (P4/011) and is not done. |
| **Date** | 2026-07-21 |
| **Level** | 3 |
| **Runtime change** | Additive-or-move behind the still-off flag: the runtime closure was promoted to `.opencode/bin/lib/compiled-routing/`, the flag was tri-stated in both read sites, and new status/sync/no-spec-import tooling was added; no routing decision changed |
| **Hubs lit** | Zero; the per-hub default-on cohort is empty and the flag stays off |
| **Verification** | Landed in 4153cbebd8: frozen scorer SHA-256 unchanged (3/3), compiled byte-identical to legacy on all seven hubs, zero runtime reads under `.opencode/specs`, flag default-off and reversible; spec-folder strict validation Errors 0 on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet is the P0 foundation of the routing-coverage program, and it is implemented and committed in 4153cbebd8. The compiled path no longer reads its resolver, engines, activation manifests, and per-hub bundles from inside the spec tree; the runtime closure was promoted to `.opencode/bin/lib/compiled-routing/`. The flag is now documented and tri-state; a per-hub serving-status readout ships; and the three fallback catches now emit DEBUG-gated stderr breadcrumbs. This record states what the foundation built and confirms it changed no routing decision and lit no hub.

The delivered work promoted the whole runtime closure to a stable path so the runtime never reads under `.opencode/specs`, split eligibility from the engine-dispatch map with a divergence cross-check, shipped a per-hub status probe with a cause code that separates drift from breakage, documented and tri-stated the flag without lighting any hub, added stderr breadcrumbs to the three catches, and added a durable rule that blocks any future runtime import from the spec tree. The three benchmark scorer files stayed SHA-256-pinned throughout (unchanged, 3/3), and compiled routing stayed byte-identical to legacy on all seven hubs.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented and committed in 4153cbebd8. The list below is the delivered scope, verified on disk in this worktree.

### Runtime stabilization

Promoted the resolver, engine loader, seven activation manifests, and seven per-hub bundles to a stable runtime path at `.opencode/bin/lib/compiled-routing/` (verified on disk); pointed the shim at it via `.opencode/bin/compiled-route-sync.cjs`; kept the spec-tree copy as the authored source that builds/copies into place; deleted the residual-coupling branch and corrected the stale parent follow-up line at `../../012-default-on-decision/implementation-summary.md`.

### Separation and observability

Split manifest-derived eligibility from the `HUB_CHILD` engine map, standardized one stable per-hub engine entrypoint, and added the divergence cross-check. Shipped `.opencode/bin/compiled-route-status.cjs --hub | --all` (verified on disk) emitting the stable JSON contract with a cause code, and surfaced it in `advisor_status` and `session_bootstrap`.

### Governance, safety, and durability

Documented the flag in ENV-REFERENCE (entry present), tri-stated it in both read sites via a shared flag module with an empty default-on cohort, added DEBUG-gated stderr breadcrumbs to the three catches, and added the durable no-spec-import CI rule (`.opencode/bin/check-no-spec-imports.cjs` + `.github/workflows/runtime-no-spec-import.yml`, verified on disk).

The runtime resolver, engine map, flag read sites, status surface, ENV entry, and CI rule were changed behind the still-off flag; no routing decision changed, no frozen scorer file was edited (SHA-256 unchanged, 3/3), and no hub was lit.
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
| Local decisions (ADR-001..ADR-005) | Accepted and implemented in 4153cbebd8 |
| Runtime implementation tests | Foundation and advisor test suites landed in 4153cbebd8 (test files present in the commit; the landing commit records them green) |
| Spec-tree-move simulation / no-spec-import guard | Guard shipped: `.opencode/bin/check-no-spec-imports.cjs` + `.github/workflows/runtime-no-spec-import.yml` (verified on disk); zero runtime reads under `.opencode/specs` (invariant held at 4153cbebd8) |
| Flag truth-table and status cause-code matrix | Tri-state flag (shared flag module, both read sites) and `.opencode/bin/compiled-route-status.cjs` status probe landed in 4153cbebd8 (verified on disk) |
| Route-gold compiled-versus-legacy parity | Compiled byte-identical to legacy on all seven hubs (invariant held at 4153cbebd8); frozen scorer consumed read-only |
| Frozen scorer digest comparison | The three scorer SHA-256 digests unchanged, 3/3 (invariant held at 4153cbebd8) |
| Durable no-spec-import rule fixtures | Shipped and wired into CI in 4153cbebd8 |
| Spec-folder strict validation | Re-run during this reconciliation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation --strict`; Errors 0 on this folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 ready to build | Done | Baselines captured; runtime directory chosen (`.opencode/bin/lib/compiled-routing/`) |
| M1 runtime stabilized | Done | Closure promoted; runtime no longer reads under `.opencode/specs` (4153cbebd8) |
| M2 separated + observable | Done | Eligibility split from the engine map with cross-check; status readout shipped (`.opencode/bin/compiled-route-status.cjs`) |
| M3 governed | Done | Flag tri-state and documented in ENV-REFERENCE; the three catches emit breadcrumbs |
| M4 guarded + verified | Done | Durable no-spec-import rule + CI shipped; parity byte-identical and frozen digests unchanged (4153cbebd8) |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The default flip is not done.** The foundation is implemented behind the still-off `SPECKIT_COMPILED_ROUTING` flag; the per-hub default-on cohort ships empty and no hub is lit. The staged default-on cutover is the separate P4 packet (`../011-activation-cutover-p4/`) and stays operator-gated.
2. **The promoted runtime copy relies on a downstream freshness gate.** This packet wired the build/copy step (`.opencode/bin/compiled-route-sync.cjs`); the automated staleness check belongs to the downstream P1 drift CI (`../010-rollback-audit-and-non-hub-policy/`).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Choose the stable runtime directory for the promoted closure — `.opencode/bin/lib/compiled-routing/` (OPEN QUESTIONS Q1 answered; landed in 4153cbebd8).
- [x] Phase 1 inventory and baseline capture — completed (4153cbebd8).
- [x] Implement the closure promotion, eligibility split, status probe, ENV entry, tri-state flag, breadcrumbs, and durable rule — completed (4153cbebd8).
- [x] Correct the stale residual-coupling follow-up at `../../012-default-on-decision/implementation-summary.md` to bind the Accepted ADR-003 promotion — completed (4153cbebd8).
- [ ] Hand the stable status contract to the downstream benchmark, playbooks, archiving, and cutover children (consumed by 003-011).
- [ ] Wire the promoted-copy freshness check in the downstream P1 drift CI (`../010-rollback-audit-and-non-hub-policy/`) without editing the frozen scorer files.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None material. The plan was executed as authored and landed in 4153cbebd8; the flag remains default-off with no hub lit, and the promoted closure resides at `.opencode/bin/lib/compiled-routing/` per OPEN QUESTIONS Q1's recommended destination.
<!-- /ANCHOR:deviations -->
