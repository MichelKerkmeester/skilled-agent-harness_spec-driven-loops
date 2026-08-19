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
    recent_action: "Executed setup, seam wiring, protocol migration and the parity gate"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "T-008 through T-013 depend on a flip edge that does not exist in code"
    key_files: []
    completion_pct: 70
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

- [x] **T-001** Census both deep-research command variants by execution; record the one shared composition seam. [EVIDENCE: `append_to_jsonl` occurs in 0 executable files; 6 shared `.cjs` executables, none a state-log writer; `admitCanonicalWrite` had 0 callers]
- [x] **T-002** Capture the runtime suite baseline and the pre-flip bytes of every mode's authority record. [EVIDENCE: `npx vitest run` — 17 failed / 4102 passed / 39 skipped (4158), exit 1, 7895s]
- [x] **T-003** Re-run the predecessor's reader contract against the current projection. [EVIDENCE: 4/6 consumers exit 0, `verify-iteration.cjs` structured `iteration_file_missing`, `fanout-run.cjs` deferred as a live dispatcher]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-004** Route the seam's canonical persistence boundary through the gateway. [EVIDENCE: `append-mode-event.ts:251` resolves through `admitCanonicalWrite`; probe flipped exit 0 to exit 2 with `AUTHORITY_DENIED` and 0 files written]
- [x] **T-005** Rewrite the protocol documents to name the gateway; remove the direct-append instruction from the canonical path. [EVIDENCE: `SKILL.md`, `loop-protocol.md`, `state-jsonl.md` name the gateway; both manifests carry `state_write_protocol` and parse as valid YAML]
- [x] **T-006** Run live-shaped deep-research runs with both writers active; collect shadow-parity evidence. [EVIDENCE: `deep-research-shadow-parity.vitest.ts` 49/49 exit 0; clean case asserts `exitStatus: 'green'` with empty `diffDispositions`]
- [x] **T-007** Perturb one side; confirm parity reports divergence; discard the perturbation and record both outcomes. [EVIDENCE: 20 fault cases ran — 10 ledger-side, 10 legacy-side, 0 red; faults injected through the shipped `DeepResearchParityFaultInjection` seam so nothing needed discarding]
- [B] **T-008** Execute `requestCutover` for `deep-research` only, bindings resolved from the environment.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] **T-009** Confirm one transition event, one epoch, one canonical route.
- [B] **T-010** Run a real multi-leaf fan-out to completion; confirm leaves wrote through the gateway.
- [x] **T-011** [P] Re-run all six legacy-file consumers; record exit statuses. [EVIDENCE: `reduce-state.cjs` 0, `fanout-merge.cjs` 0, `fanout-salvage.cjs` 0, `divergent-research-pivot.ts` 0, `verify-iteration.cjs` 1 structured `iteration_file_missing`, `fanout-run.cjs` deferred as a live dispatcher]
- [B] **T-012** [P] Diff every non-pilot authority record against its pre-flip bytes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [B] **T-013** Full suite re-run and reported as a delta against the T-002 baseline.
- [x] **T-014** `validate.sh` on this folder with `--strict`; Errors: 0. [EVIDENCE: `validate.sh --strict` on this folder, Errors: 0]
- [x] **T-015** `implementation-summary.md` records the parity evidence, the negative control, and the fan-out proof. [EVIDENCE: `implementation-summary.md` records the parity result and both negative controls, and states in `KNOWN LIMITATIONS` why no fan-out proof exists]
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
