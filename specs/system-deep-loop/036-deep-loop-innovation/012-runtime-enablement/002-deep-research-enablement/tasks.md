---
title: "Tasks: Deep-Research Enablement"
description: "Task breakdown for the deep-research protocol migration, parity gate with negative control, pilot authority move, and post-flip fan-out proof."
trigger_phrases:
  - "deep-research enablement tasks"
  - "pilot flip tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the pilot migration into three phases"
    next_safe_action: "Run T-001 census once the predecessor passes"
    blockers:
      - "Predecessor 001-append-gateway-and-projection must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Research Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [B] **T-001** Census both deep-research command variants by execution; record the one shared composition seam.
- [ ] **T-002** Capture the runtime suite baseline and the pre-flip bytes of every mode's authority record.
- [ ] **T-003** Re-run the predecessor's reader contract against the current projection.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Route the seam's canonical persistence boundary through the gateway.
- [ ] **T-005** Rewrite the protocol documents to name the gateway; remove the direct-append instruction from the canonical path.
- [ ] **T-006** Run live-shaped deep-research runs with both writers active; collect shadow-parity evidence.
- [ ] **T-007** Perturb one side; confirm parity reports divergence; discard the perturbation and record both outcomes.
- [ ] **T-008** Execute `requestCutover` for `deep-research` only, bindings resolved from the environment.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-009** Confirm one transition event, one epoch, one canonical route.
- [ ] **T-010** Run a real multi-leaf fan-out to completion; confirm leaves wrote through the gateway.
- [ ] **T-011** [P] Re-run all six legacy-file consumers; record exit statuses.
- [ ] **T-012** [P] Diff every non-pilot authority record against its pre-flip bytes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-013** Full suite re-run and reported as a delta against the T-002 baseline.
- [ ] **T-014** `validate.sh` on this folder with `--strict`; Errors: 0.
- [ ] **T-015** `implementation-summary.md` records the parity evidence, the negative control, and the fan-out proof.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../001-append-gateway-and-projection/` |
| Successor | `../003-fleet-enablement/` |
<!-- /ANCHOR:cross-refs -->
