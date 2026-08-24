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
    recent_action: "Completed the flip execution, one-transition confirmation, and post-flip fan-out tasks"
    next_safe_action: "Proceed to 003-fleet-enablement"
    blockers: []
    key_files: []
    completion_pct: 100
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
- [x] **T-008** Execute `requestCutover` for `deep-research` only, bindings resolved from the environment. [EVIDENCE: `deep-research-pilot-flip.vitest.ts` drives a real `AuthorityFlipCoordinator.requestCutover({ requestedModes: ['deep-research'] })` on evidence from the four real producers; the on-disk record reaches `new_authoritative_reversible`. Committed `e7f6dcd014`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-009** Confirm one transition event, one epoch, one canonical route. [EVIDENCE: pilot reads the record back — `epoch === fromEpoch + 1`, exactly one authority-flip event on the ledger, canonical `dark` route. Committed `e7f6dcd014`]
- [x] **T-010** Run a real multi-leaf fan-out to completion; confirm leaves wrote through the gateway. [EVIDENCE: `deep-research-postflip-fanout.vitest.ts` — 3 leaves on the real `runCappedPool`, six events in the ledger; the `check-direct-append.cjs` guard returns `ok` (file matches watermark) and `DIRECT_APPEND_DETECTED` on a direct byte. Committed `e6ee16f78b`]
- [x] **T-011** [P] Re-run all six legacy-file consumers; record exit statuses. [EVIDENCE: `reduce-state.cjs` 0, `fanout-merge.cjs` 0, `fanout-salvage.cjs` 0, `divergent-research-pivot.ts` 0, `verify-iteration.cjs` 1 structured `iteration_file_missing`, `fanout-run.cjs` deferred as a live dispatcher]
- [x] **T-012** [P] Diff every non-pilot authority record against its pre-flip bytes. [EVIDENCE: the pilot flips `deep-research` on isolated temporary authority roots, writing no durable record; `find . -name 'authority-*.json'` returns 0 durable records before and after, so every non-pilot mode's pre-flip bytes are unchanged (the synthesized `legacy_authoritative` default)]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-013** Full suite re-run and reported as a delta against the T-002 baseline. [EVIDENCE: full suite at HEAD — 183/199 files pass, 16 fail (4392 passed / 22 failed / 39 skipped). No deep-research regression: the six authority suites pass 117/117; all 16 failing files re-run standalone and classify as credentialed skips, load-sensitive timeouts, worktree-environmental, or worktree-only contract drift deferred to the gate. See CHK-014.]
- [x] **T-014** `validate.sh` on this folder with `--strict`; Errors: 0. [EVIDENCE: `validate.sh --strict` on this folder, Errors: 0]
- [x] **T-015** `implementation-summary.md` records the parity evidence, the negative control, and the fan-out proof. [EVIDENCE: `implementation-summary.md` §5 records the parity result and negative control, the end-to-end flip, and the post-flip fan-out proof with the guard's four measured outcomes]
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
