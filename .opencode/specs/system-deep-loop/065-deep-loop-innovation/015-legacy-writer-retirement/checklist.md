---
title: "Checklist: Legacy Writer Retirement (006 phase 012)"
description: "Blocking verifier contract for zero-use telemetry, ordered legacy live-emitter removal, rollback-evidence retention, and archival-reader preservation."
trigger_phrases:
  - "legacy writer retirement checklist"
  - "deep-loop zero-use verification"
  - "archival reader retention checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking zero-use, deletion-order, and archival-read verifier checks"
    next_safe_action: "Verify every census row has a delete, retain, or blocking disposition"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 012, the last and only legacy live-emitter deletion phase.
Every item remains unchecked while status is Planned. Each evidence record binds the candidate SHA, phase-000 BASE,
telemetry observation window, mode and authority epoch, delete/retain manifest, and command or verifier result. The gate
fails on incomplete telemetry, missing positive controls, any live-use event, an unknown path, an open rollback window,
wrong retire order, a deleted archival reader, lost rollback evidence, candidate drift, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 006 parent outcome, phase-tree dependency, phase-000 census, and phase-013 handoff are cited
- [ ] CHK-002 [P0] Every workstream has a phase-011 cutover certificate, final authority epoch, clean later-of-14-days-and-five-runs window closure, and retained rollback assets
- [ ] CHK-003 [P0] The current candidate reconciles every phase-000 writer, reader, schema, state surface, backend, dynamic path, and historical-read obligation
- [ ] CHK-004 [P0] The delete/retain manifest identifies every live emitter or replaced logic unit and every archival reader, decoder, upcaster, schema, projection, and fixture
- [ ] CHK-005 [P1] Planned status, Level 2 structure, phase adjacency, and last-and-only deletion ownership are explicit
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Deletion is blocked unless static inventory closure, telemetry coverage, positive controls, observation-window facts, zero live use, and zero unknown paths are present
- [ ] CHK-007 [P0] Retire order is exactly `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, `008-deep-alignment`
- [ ] CHK-008 [P0] Each mode's legacy writers are removed before its replaced helpers, and shared legacy emitters are removed only after all mode rows pass
- [ ] CHK-009 [P0] Archival readers, decoders, upcasters, historical schemas, read-only projections, and fixtures are retained and cannot become canonical writers
- [ ] CHK-010 [P1] The deletion diff contains no ephemeral spec, task, phase, packet, or finding identifiers in shipped runtime comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Positive-control legacy writer and reader events are detected with the expected mode, operation class, epoch, candidate, and source fields
- [ ] CHK-012 [P0] The declared observation window covers every workstream and relevant resume, retry, restart, replay, and rollback path; zero qualifying live events are recorded
- [ ] CHK-013 [P0] Every live writer and live canonical-reader boundary has telemetry coverage; an uninstrumented or dynamically unresolved path blocks retirement
- [ ] CHK-014 [P0] Archival reads for representative completed packets are classified read-only and remain successful for every retained historical schema family
- [ ] CHK-015 [P0] Any live-use event, stale certificate, open rollback window, candidate drift, missing coverage, unknown path, or failed archival read fails closed before deletion
- [ ] CHK-016 [P0] The ordered deletion log proves writers-before-helpers for each mode and shared-last removal after all eight mode rows pass
- [ ] CHK-017 [P0] Rollback certificates, cutover certificates, window-closure records, rollback anchors, telemetry reports, and the pre-delete restoration record remain retained after deletion
- [ ] CHK-018 [P1] Restart, resume, malformed historical input, and recorded phase-000 repair fixtures read through archival paths without canonical legacy writes
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P0] Every phase-000 census row maps to one delete, retain, or blocking disposition with an owner, purpose, and verification result
- [ ] CHK-020 [P0] The final delete/retain manifest matches the candidate diff and no shared path is removed before all mode evidence is green
- [ ] CHK-021 [P1] The phase-013 handoff includes the exact candidate SHA, evidence hashes, zero-use report, closure records, deletion diff, retention manifest, and verification commands
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Telemetry and evidence exclude credentials, prompts, unrestricted payloads, and host-sensitive data while retaining bounded verification fields
- [ ] CHK-023 [P0] Missing, malformed, stale, or conflicting telemetry and authority evidence denies deletion rather than selecting a legacy or archival fallback
- [ ] CHK-024 [P1] No historical packet, archival backend, rollback asset, or evidence record is deleted as part of live-writer retirement
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on zero-use proof, mode order, writers-before-shared sequencing, retention, rollback boundary, and phase ownership
- [ ] CHK-026 [P1] Cross-references resolve to the 006 parent, `manifest/phase-tree.json`, phase-000 census, phase-011 cutover specs, and phase-013 successor
- [ ] CHK-027 [P2] Deterministic metadata generation is deferred exactly as instructed and no metadata file is hand-authored
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P0] Only the four approved Level 2 Markdown files exist as authored files in this target folder
- [ ] CHK-029 [P1] Strict validation reports no issue other than expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase may be ratified only when every P0 check has evidence, zero-use telemetry proves complete coverage and no live
legacy use, all eight modes retire in order with shared logic last, archival readers still read historical packets,
rollback evidence remains retained, and phase 013 receives the exact post-retirement candidate and handoff bundle.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the phase-012 verifier confirms the zero-use gate, phase-011 closure evidence, ordered deletion, retained
archival readers, preserved rollback evidence, clean comment hygiene, and an auditable handoff to phase 013.
<!-- /ANCHOR:sign-off -->
