---
title: "Checklist: Cross-Mode Closures"
description: "Checklist for phase 012 child 002 of the shared-mode-contracts-and-fixtures parent: verify one reusable closure layer, explicit mode overrides, and additive-dark parity before phase 013."
trigger_phrases:
  - "cross-mode closures checklist"
  - "deep-loop closure verification"
  - "phase 012 shared behavior conformance"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-21T14:11:23Z"
    last_updated_by: "codex"
    recent_action: "Verified all closure ownership, safety, parity, and replay fixtures"
    next_safe_action: "Hand the closure catalog to the phase-013 mode migrations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cross-mode-closures.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Cross-Mode Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 012 child 002. The verifier derives the eight mode rows from `manifest/phase-tree.json`, binds each row to the frozen `001-shared-mode-interfaces` interface version, records the shared closure owner and override strategy, and fails on duplicate implementations, bypassed safety ports, nondeterministic output, hidden writes, or evidence that changes legacy authority before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The parent outcome, `depends_on: []`, phase adjacency, and eight-mode list are pinned. Evidence: `../../manifest/phase-tree.json` and `runtime/lib/cross-mode-closures/catalog.ts`.
- [x] CHK-002 [P0] The frozen `ModeContract`, phase-007 ports, and shipped legacy seams are reconciled. Evidence: `runtime/lib/cross-mode-closures/types.ts`, `context.ts`, and `parity.ts`.
- [x] CHK-003 [P0] The five closure families each have one owner, typed output, write-set binding, and override boundary. Evidence: `runtime/lib/cross-mode-closures/catalog.ts` and `index.ts`.
- [x] CHK-004 [P1] The mixed-version and conflict-graph successors remain outside this leaf. Evidence: path-scoped status contains no files under sibling `003-*` or `004-*` leaves.
- [x] CHK-005 [P2] Intentional parser divergence and mode-local convergence policy remain outside shared mechanics. Evidence: `runtime/lib/cross-mode-closures/deep-improvement-common.ts` accepts only variant schema/policy overrides.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Evidence normalization, sealing, raw payload retention, and provenance use one path. Evidence: `runtime/lib/cross-mode-closures/evidence.ts` and the evidence-preservation fixture.
- [x] CHK-007 [P0] Authorized facts precede the phase-007 effect/recovery and boundary ports. Evidence: `runtime/lib/cross-mode-closures/receipts-effects.ts` and the receipt-ordering fixture.
- [x] CHK-008 [P0] Blinded adjudication returns the service verdict, raw scores, and probes without local reduction. Evidence: `runtime/lib/cross-mode-closures/adjudication.ts` and both adjudication fixtures.
- [x] CHK-009 [P0] Admission, reservation, attempt charging, settlement, and denial use the hierarchical budget port. Evidence: `runtime/lib/cross-mode-closures/budgets.ts` and the uncertainty/exhaustion fixture.
- [x] CHK-010 [P0] Authorized events, gauge folds, replay state, and fenced persistence use one projection path. Evidence: `runtime/lib/cross-mode-closures/projections.ts` and the deterministic replay fixture.
- [x] CHK-011 [P1] Overrides name input/output versions and policy ownership, projection and variant outputs enforce declared exact keys, and reserved safety fields are rejected recursively. Evidence: `runtime/lib/cross-mode-closures/override-seam.ts`, `internal.ts`, `projections.ts`, and `deep-improvement-common.ts`.
- [x] CHK-012 [P1] Every manifest row holds the same five function identities. Evidence: `runtime/lib/cross-mode-closures/catalog.ts` and the manifest-complete one-owner fixture.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-013 [P0] Evidence input retains domain fields while adding contract and provenance data. Evidence: `cross-mode-closures.vitest.ts` evidence-preservation fixture.
- [x] CHK-014 [P0] Receipt sequencing delegates intent/effect/recovery idempotency to the existing phase-007 gateway only after authorization. Evidence: `cross-mode-closures.vitest.ts` receipt-ordering fixture.
- [x] CHK-015 [P0] Adjudication retains the phase-007 verdict, judgments, and counterfactual probes as-is and rejects local verdict fields. Evidence: `cross-mode-closures.vitest.ts` adjudication fixtures.
- [x] CHK-016 [P0] Uncertain accounting and typed exhaustion deny dispatch; settlement requires a normalized terminal receipt. Evidence: `cross-mode-closures.vitest.ts` budget-denial fixture and `budgets.ts` settlement branch.
- [x] CHK-017 [P0] Repeated event/gauge/service inputs produce the same projection bytes and digest, while writes require a declared fenced resource. Evidence: `cross-mode-closures.vitest.ts` replay fixture and `projections.ts`.
- [x] CHK-018 [P0] The adapter catalog covers all eight manifest rows. Evidence: `cross-mode-closures.vitest.ts` compares catalog mode IDs with `PHASE_013_MODE_IDS`.
- [x] CHK-019 [P0] Common evaluation, benchmark, promotion, and mirror verification run once before three thin variants. Evidence: `cross-mode-closures.vitest.ts` asserts one call per common port and exact execution order.
- [x] CHK-020 [P0] Deep-review and deep-alignment consume only the same five declared closure identities; findings and conformance decisions are absent from the closure API. Evidence: `runtime/lib/cross-mode-closures/catalog.ts` and `index.ts`.
- [x] CHK-021 [P0] Negative overrides cannot acquire authorization, sealing, receipt, budget, fence, or local-reduction authority. Evidence: `cross-mode-closures.vitest.ts` covers nested and top-level smuggling at projection and deep-improvement sites plus adjudication re-reduction.
- [x] CHK-022 [P1] Shadow parity preserves the exact legacy result even when closure execution fails. Evidence: `cross-mode-closures.vitest.ts` additive-dark fixture and `runtime/lib/cross-mode-closures/parity.ts`.
- [x] CHK-023 [P1] Fixed inputs and service responses produce canonical-equivalent closure results. Evidence: `cross-mode-closures.vitest.ts` deterministic replay fixture; Vitest reports 15 passed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The closure catalog, owner map, override seams, and parity-source inventory cover every requirement without a mode exception. Evidence: `runtime/lib/cross-mode-closures/catalog.ts`, `types.ts`, and `parity.ts`.
- [x] CHK-025 [P1] The handoff names versioned owners, eight adapter rows, fixture cases, service ports, and write-set bindings. Evidence: `runtime/lib/cross-mode-closures/index.ts` and `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] No override can emit an effect or boundary receipt before the authorized lifecycle fact; recovery remains inside the phase-007 gateway. Evidence: `runtime/lib/cross-mode-closures/receipts-effects.ts`.
- [x] CHK-027 [P0] Sealed reads, shared adjudication, typed budget denial, and fenced projection replacement are mandatory call paths. Evidence: `evidence.ts`, `adjudication.ts`, `budgets.ts`, and `projections.ts`.
- [x] CHK-028 [P1] Closure failure is observable and cannot replace the legacy result. Evidence: `runtime/lib/cross-mode-closures/parity.ts` returns `legacyAuthority: authoritative` on match, divergence, or failure.
- [x] CHK-033 [P1] The returned context exposes no raw service-port property; closure owners resolve validated ports through private binding. Evidence: `context.ts`, `internal.ts`, and the private-service fixture.
- [x] CHK-034 [P1] Projection and deep-improvement outputs reject undeclared and reserved fields before persistence or return while honest outputs remain accepted. Evidence: four adversarial override fixtures and two positive controls in `cross-mode-closures.vitest.ts`.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] Canonical docs cross-reference the parent, manifest, interface, service ports, shipped seams, and successors. Evidence: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [x] CHK-030 [P2] The handoff distinguishes shared mechanics from mode schema/policy and names the override fixtures. Evidence: `implementation-summary.md`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-031 [P1] Authored changes are limited to `runtime/lib/cross-mode-closures/`, its unit test, and this leaf's docs; metadata files are tooling-generated. Evidence: path-scoped `git status --short`.
- [x] CHK-032 [P2] The implementation adds a new closure layer and leaves the frozen mode contract, phase-007 services, legacy helpers, and sibling leaves unchanged. Evidence: path-scoped `git status --short`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All 15 adversarial closure fixtures pass. One implementation serves each repeated behavior across all eight phase-013 rows, override outputs are closed and data-only, raw services remain private, common-before-variant ordering is proven, and legacy authority remains intact.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Implementation sign-off records owner versions, eight-row coverage, fixture outcomes, and unchanged runtime authority. Independent adversarial verification can consume the same public catalog and test fixtures.
<!-- /ANCHOR:sign-off -->
