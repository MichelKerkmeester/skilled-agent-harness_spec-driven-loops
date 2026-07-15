---
title: "Checklist: whole-system gate (006 phase 013)"
description: "Blocking verification checklist for phase 013 of the 006 recommendations-implementation program; all checks are bound to the exact candidate SHA and phase-000 BASE."
trigger_phrases:
  - "whole-system gate checklist"
  - "deep-loop phase 013 checklist"
  - "exact-SHA gate verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/013-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/013-whole-system-gate"
    last_updated_at: "2026-07-15T16:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking checklist coverage for every whole-system gate"
    next_safe_action: "Verify the frozen candidate manifest and prerequisite evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 013. Every item is run against one frozen candidate SHA
and the phase-000 BASE SHA; the report records the manifest hash, commands, exit codes, fixture and scenario IDs,
artifact digests, expected controls, failure owner, and tracked-mutation result. Any P0 failure blocks phase 014 and
reopens the phase that owns the failed contract. No baseline change, skipped mode, count-only comparison, validation
warning, or unexplained delta may be accepted as a pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `012-legacy-writer-retirement` has landed zero-use, rollback, and archival-reader evidence on the candidate worktree
- [ ] CHK-002 [P0] The phase-000 BASE SHA, protected behavior corpus, replay fixtures, rollback anchors, and baseline digests are available
- [ ] CHK-003 [P0] One candidate exact SHA is frozen with clean tree state, ref provenance, toolchain versions, source digests, fixture digests, and manifest hash
- [ ] CHK-004 [P1] Phase-005 parity, phase-004 effect-recovery/adjudication, phase-008 health, and phase-009 mixed-version harnesses are executable
- [ ] CHK-005 [P1] Eight phase-010 mode-gate outputs plus phase-011 cutover and phase-012 retirement evidence are addressable
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] The gate manifest maps every required assertion to a command, expected result, artifact, fixture, scenario, and failure owner
- [ ] CHK-007 [P0] Gate execution uses disposable backends and sanitized fixtures and cannot mutate authoritative runtime or tracked state
- [ ] CHK-008 [P1] All observed deltas are classified against the phase-000 protected baseline; no defect is silently promoted to a contract
- [ ] CHK-009 [P1] Verification commands and toolchain versions are recorded without secrets, host-specific credentials, or unreviewed environment state
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Every result carries the exact candidate SHA, phase-000 BASE SHA, manifest hash, fixture digest, and toolchain identity
- [ ] CHK-011 [P0] The eight mode gates pass for `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`, `agent-improvement`, `model-benchmark`, and `skill-benchmark`
- [ ] CHK-012 [P0] Each mode has behavior and parity evidence plus its sealed artifact or certificate, replay result, resume result, and rollback-switch result
- [ ] CHK-013 [P0] All phase-009 mixed-version fixture families replay deterministically through upcasters, projections, archival readers, resume, and terminal checks
- [ ] CHK-014 [P0] Crash injection at effect, receipt, dispatch, checkpoint, resume, and recovery boundaries passes phase-004 recovery with no lost, duplicated, or unauthorized effects
- [ ] CHK-015 [P0] Phase-004 blinded/counterfactual adjudication passes order/identity perturbation controls and preserves replayable decision evidence
- [ ] CHK-016 [P0] Phase-008 health and degeneration cases detect or correctly clear repetition, cycles, mode collapse, quality decay, and unsafe continuation
- [ ] CHK-017 [P0] Full phase-005 parity against phase 000 is green by stable scenario ID and semantic assertion, including budget, receipt, terminal, replay, sealed-artifact, and archival-read behavior
- [ ] CHK-018 [P0] The blocking SOL verifier review is bound to the exact candidate commit, includes commands and exit codes, and records an approval verdict with no unresolved blocking finding
- [ ] CHK-019 [P0] `validate.sh --strict --recursive` reports `Errors: 0` and `Warnings: 0` for the complete 006 tree
- [ ] CHK-020 [P0] Post-run worktree and index checks prove verification caused no unexpected tracked mutation
- [ ] CHK-021 [P1] Every failure, if any, maps to an owning phase and blocks phase 014 until the corrected exact SHA reruns affected and dependent checks
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P0] Requirements REQ-001 through REQ-012 and success criteria SC-001 through SC-008 each map to a recorded gate result
- [ ] CHK-023 [P1] No mode, fixture family, scenario, crash point, counterfactual control, degeneration case, or archival reader is omitted from the reviewed manifest
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] External effects are sanitized, isolated, or mocked and recovery evidence proves no unauthorized replay or duplicate side effect
- [ ] CHK-025 [P1] Temporary backends, logs, and reports contain no credentials, process secrets, or unapproved host paths
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P1] The gate manifest and SOL report identify the candidate SHA, BASE SHA, fixture/artifact digests, commands, exit codes, and final verdict
- [ ] CHK-027 [P1] Spec, plan, tasks, checklist, parent phase map, and execution-sequencing references remain synchronized with the final gate contract
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Verification evidence is path-scoped to the approved gate output location and no adjacent phase or baseline artifact is rewritten
- [ ] CHK-029 [P1] The final candidate worktree is clean after verification, apart from explicitly approved untracked report artifacts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 item passes, all eight mode gates and cross-system checks are green, the
blocking SOL verifier approves the exact candidate SHA, recursive strict validation reports Errors 0 and Warnings 0,
and the tracked worktree is unchanged. Any failure is recorded with its reopen owner; phase 014 remains blocked until
the corrected candidate produces a renewed exact-SHA report.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the candidate and BASE SHAs match every result, the strict
recursive validator is clean, and the post-verification mutation check shows no unexpected tracked change.
<!-- /ANCHOR:sign-off -->
