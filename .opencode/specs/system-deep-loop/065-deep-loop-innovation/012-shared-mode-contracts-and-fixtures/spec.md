---
title: "Feature Specification: Shared Mode Contracts & Fixtures"
description: "Freeze the shared mode boundary before the eight phase-013 migrations: common interfaces, hoisted cross-mode closures, mixed-version fixtures, and an executable dependency plus write-set conflict graph for parallel-safe work."
trigger_phrases:
  - "shared mode contracts and fixtures"
  - "deep-loop phase 012"
  - "mode write-set conflict graph"
  - "mixed-version mode fixtures"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the shared contracts, fixtures, and mode write-set handoff"
    next_safe_action: "Build the four child contracts and executable conflict graph"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Shared Mode Contracts & Fixtures

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation |
| **Predecessor** | 011-convergence-termination-and-health |
| **Successor** | 013-mode-and-lane-migrations |
| **Handoff Criteria** | Shared mode interfaces are frozen, cross-mode closures are hoisted, mixed-version fixtures are authored, and the executable write-set conflict graph is built for phase 013. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `065-deep-loop-innovation/spec.md` parent places this phase after the ledger compatibility bridge, durable fan-in, novelty and claims, and convergence and health, then makes it the last shared gate before the eight phase-013 mode workstreams. The research in `002-deep-loop-effectiveness-and-fanout/research/research-modes.md` shows that the modes share one evidence-ledger spine, sealed reference artifacts, replay fingerprints, receipts or certificates, and blinded or counterfactual adjudication, while each mode still needs its own typed schema. Without a frozen shared boundary, the migrations can duplicate or diverge those cross-mode responsibilities.

The `execution-sequencing-strategy.md` explicitly defers the phase-013 parallelism decision until this phase produces the dependency and write-set conflict graph. The `manifest/phase-tree.json` names the eight workstreams and records the hard ordering for `004-deep-improvement-common` and its three variants, alongside the shared review loop used by deep-review and deep-alignment. This phase therefore hands phase 013 frozen interfaces, reusable closures, realistic mixed-version fixtures, and an executable map of parallel-safe versus serialized work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-shared-mode-interfaces/` | Freeze the typed interface every mode implements against the substrate (ledger, services, fan-out, convergence), so mode work is uniform. | Planned |
| 002 | `002-cross-mode-closures/` | Hoist logic shared across modes into common closures/modules so each mode migration reuses rather than re-implements shared behavior. | Planned |
| 003 | `003-mixed-version-fixtures/` | Fixtures that exercise mixed-version scenarios (old and new events/state coexisting) so upcasters and shadow parity are tested under realistic drift. | Planned |
| 004 | `004-write-set-conflict-graph/` | The executable dependency + write-set conflict graph that declares which phase-013 modes touch which files/state, deciding parallel-safe vs serialized migration. | Planned |
<!-- /ANCHOR:phase-map -->
