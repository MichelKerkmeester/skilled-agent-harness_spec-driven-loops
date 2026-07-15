---
title: "Implementation Plan: Legacy Writer Retirement (006 phase 012)"
description: "Implementation Plan for phase 012 of the 006 recommendations-implementation program: gated removal of legacy live emitters and replaced logic with archival readers retained."
trigger_phrases:
  - "legacy writer retirement implementation plan"
  - "deep-loop legacy emitter deletion"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the delete-retain boundary and mode-ordered retirement gates"
    next_safe_action: "Reconcile phase-000 census rows with phase-011 closure evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime (phase 012) |
| **Change class** | Gated deletion with retained archival-read paths |
| **Execution** | Isolated worktree pinned to the phase-000 BASE and candidate evidence |

### Overview
Phase 012 is the last and only deletion phase for the old live path. It reconciles the phase-000 reader/writer census,
the phase-011 per-mode cutover certificates and clean rollback-window closures, and a measured zero-use report before
freezing a delete/retain manifest. The implementation retires one mode at a time in phase-011 order, removes that
mode's live writers before replaced helpers, removes shared legacy emitters only after all modes pass, and retains
archival readers, decoders, upcasters, schemas, projections, and historical fixtures. The deletion candidate stays
reversible until the first delete operation and preserves the evidence required by phase 013.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-000 census is reconciled with the exact candidate and every legacy producer/consumer is classified
- [ ] All eight modes have phase-011 cutover certificates and clean rollback-window closure evidence
- [ ] The telemetry contract covers every live writer and live reader boundary, including dynamic and shared paths
- [ ] Positive controls prove telemetry detects known legacy activity before the zero-use window is evaluated
- [ ] The observation window covers every mode and declared resume, retry, restart, replay, and rollback path
- [ ] The delete/retain manifest names every live path to delete and every archival path to preserve
- [ ] The pre-delete restoration anchor and immutable rollback evidence are retained

### Definition of Done
- [ ] The telemetry report records complete coverage, zero qualifying live use, and no unknown path
- [ ] The eight modes retire in manifest order with writers removed before shared legacy logic
- [ ] Historical completed-packet fixtures read through retained archival readers without canonical writes
- [ ] The deletion diff matches the approved manifest and contains no ephemeral identifiers in runtime comments
- [ ] Phase 013 receives the exact candidate SHA, evidence bundle, retention manifest, and verification results
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The phase-000 census is the authoritative input inventory. Reconcile each reader, writer, schema, reducer, backend,
  repair path, dynamic route, and historical-read obligation before generating the delete/retain manifest.
- A zero-use telemetry boundary records mode/workstream, operation class, authority epoch, candidate identity,
  run/packet identity, result, and bounded source reference. It has no secrets or unrestricted payloads. Live writes and
  live canonical reads are separate from explicitly classified archival reads.
- The zero-use gate requires static inventory closure, runtime instrumentation coverage, positive-control observations,
  a declared observation window, zero qualifying live events, and zero uninstrumented or unknown paths. A quiet counter
  without coverage is a failed gate.
- Phase-011 evidence is consumed, not recreated: each mode must provide the cutover certificate, final authority epoch,
  clean later-of-14-days-and-five-runs window closure, rollback assets, and no unresolved revert signal.
- Retire in this exact order: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`,
  `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and
  `008-deep-alignment`. For each row, delete live writers first, then replaced mode helpers; delete shared legacy
  emitters only after all eight mode rows pass.
- The retention set includes archival readers, decoders, upcasters, historical schemas, read-only projections, and
  fixtures. Retention is verified by historical packet reads and does not permit a live write route.
- The candidate is path-scoped and pre-delete reversible. Evidence, rollback anchors, the deletion manifest, and the
  candidate hash are retained as handoff artifacts. Runtime comments remain free of spec, task, phase, packet, and
  finding identifiers.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the exact phase-000 BASE and clean isolated worktree; reconcile current source and generated paths with the census.
- Collect every phase-011 mode certificate, authority epoch, closed rollback-window record, and retained rollback asset.
- Freeze the telemetry schema, observation-window rule, positive controls, coverage report, and delete/retain manifest.
- Confirm the manifest order and the pre-delete restoration anchor before changing runtime files.

### Phase 2: Implementation
- Add or enable bounded telemetry at every legacy live writer and live canonical-reader boundary, with explicit archival
  classification and fail-closed unknown-path handling.
- Run positive controls, then hold the declared observation window and record zero qualifying live events for each mode;
  archive the report before beginning the delete sequence.
- Retire `001-deep-research`, then `002-deep-review`, then `003-deep-ai-council`; remove each mode's live writers before
  its replaced helpers and recheck the mode row after each deletion.
- Retire `004-deep-improvement-common` before `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`;
  do not treat shared-backend usage as permission to share a selector, epoch, or evidence row.
- Retire `008-deep-alignment` last among the mode workstreams, then remove shared legacy emitters and replaced spine logic
  only after all mode rows, archival-reader checks, and deletion gates pass.
- Preserve archival readers, decoders, upcasters, historical schemas, read-only projections, and fixtures; deny any
  canonical legacy write route left outside the delete manifest.
- Review all changed runtime comments for durable-why content only; do not add spec or task identifiers.

### Phase 3: Verification
- Prove the telemetry report has complete census coverage, positive-control detection, zero live use, and zero unknown
  paths for the exact candidate.
- Verify the eight mode rows and shared-last order, then compare the deletion diff against the frozen manifest.
- Read representative completed legacy packets for every retained schema family, including restart/resume and malformed
  historical cases where phase 000 recorded a repair obligation.
- Verify rollback evidence, cutover certificates, window-closure records, and the pre-delete restoration anchor remain
  retained and content-bound after deletion.
- Run scoped runtime checks and strict spec validation; package the candidate SHA and all evidence for phase 013.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the phase-000 census and current static/runtime inventory; every row is delete, retain, or blocked with no unknown classification |
| REQ-002 | Verify all eight phase-011 certificates, final epochs, clean window closures, retained rollback assets, and candidate bindings |
| REQ-003 | Run positive-control writer/reader events, verify instrumentation coverage, evaluate the declared observation window, and require zero qualifying live events |
| REQ-004 | Replay historical completed packets through retained archival readers; assert archival classification, read-only behavior, schema identity, and no canonical write |
| REQ-005 | Inspect the ordered deletion log: each mode's writers precede its replaced helpers, and shared legacy emitters are last |
| REQ-006 | Inject stale evidence, open windows, live-use events, unknown paths, candidate drift, and failed historical reads; each blocks deletion |
| REQ-007 | Review the final delete/retain manifest against every census row and the candidate diff; retained paths have historical fixtures |
| REQ-008 | Verify pre-delete restore from the retained anchor and confirm rollback evidence remains content-bound through the deletion candidate |
| REQ-009 | Scan changed runtime comments for ephemeral spec/task/phase/packet/finding identifiers and reject any match |
| REQ-010 | Produce the phase-013 handoff with candidate SHA, telemetry report, closure evidence, deletion diff, retention manifest, archival-read results, and commands |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The controlling dependencies are the 006 parent sequencing invariants and success criteria, `manifest/phase-tree.json`,
the phase-000 baseline/census contract, phase-011 `002-per-mode-authority-flip` for per-mode authority and ordering,
phase-011 `003-cutover-certificate-and-rollback-window` for clean closure and retained rollback assets, phase-004
receipt semantics for durable evidence, and the phase-013 whole-system gate. The spec-kit validator and isolated git
worktree provide the documentation and candidate boundaries. Phase 012 must not duplicate authority-cutover or
rollback-window ownership.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before any deletion, retain the phase-000 BASE, the exact candidate diff, the delete/retain manifest, all phase-011
certificates and closure records, telemetry reports, archival fixtures, and a pre-delete restoration anchor. If
telemetry is incomplete, a live-use event appears, a window is open, historical reads fail, or candidate drift is found,
stop before deletion and restore the candidate worktree to the pre-delete state. If a scoped deletion check fails before
the deletion candidate is accepted, revert the candidate changes without touching persisted historical data. The delete
operation itself is the final reversible boundary: after it, no runtime rollback promise is made for the removed live
writers, but the retained archival readers and all evidence remain available, and a source-level revert remains a
reviewed recovery option before downstream integration. No historical packet or archival backend is deleted by this phase.
<!-- /ANCHOR:rollback -->
