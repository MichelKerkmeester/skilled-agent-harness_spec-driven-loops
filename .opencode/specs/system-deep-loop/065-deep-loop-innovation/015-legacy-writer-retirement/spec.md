---
title: "Feature Specification: Legacy Writer Retirement"
description: "Remove the old live emitters and logic replaced by the evidence-ledger spine only after every mode has a clean phase-014 cutover certificate, a closed rollback window, and zero-use telemetry. Retain archival readers required for historical legacy packets."
trigger_phrases:
  - "legacy writer retirement"
  - "deep-loop zero-use telemetry"
  - "retire legacy emitters"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Established zero-use, retire-order, archival-reader, and rollback evidence gates"
    next_safe_action: "Author the retirement matrix and zero-use evidence contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Legacy Writer Retirement

> Phase adjacency under the 006 parent (navigation order, not a hard runtime dependency): predecessor `014-staged-state-migration-and-authority-cutover`; successor `016-whole-system-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/015-legacy-writer-retirement |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 015 leaf in `manifest/phase-tree.json`; the last and only legacy-writer deletion phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 program deliberately keeps the legacy path alive while the typed ledger, compatibility adapters, shadow parity,
state migration, and staged authority cutover prove that the new spine can carry each mode. The parent program assigns
phase 015 the one-time removal of old live emitters and replaced logic after authority has moved, while explicitly
requiring historical completed packets to remain readable (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md`).
The phase tree makes this leaf depend on `014-staged-state-migration-and-authority-cutover` and hands its result to
`016-whole-system-gate` (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

Deletion is unsafe if a legacy writer is merely quiet, if a dynamically constructed path was missed, or if a historical
reader is mistaken for a live authority path. The phase-003 census is therefore the starting inventory: every event
schema, reader, writer, persisted state surface, backend, repair path, and historical-read obligation must be reconciled
against the candidate before a deletion manifest is frozen (`../003-baseline-taxonomy-and-state-census/spec.md`).
Absence of live use must be demonstrated by instrumented, mode-keyed telemetry with positive controls and complete
coverage, not inferred from a zero counter. Archival reads remain a separate permitted class and are not evidence of
live use when their source, purpose, and read-only behavior are explicit.

Phase 014 supplies the hard authority boundary. Its per-mode flip contract keeps legacy available during the reversible
state, requires the eight workstreams to cut over in manifest order, and denies stale legacy writes by epoch
(`../014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md`). Its certificate and window
contract requires the later of 14 calendar days and five successful authoritative executions, retains rollback assets,
and records clean closure before phase 015 evaluates retirement
(`../014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window/spec.md`). This
phase is the final deletion decision: it does not close a rollback window early, remove archival readers, or create a
second compatibility-removal phase.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconcile the phase-003 reader/writer and state census with the exact candidate code, including dynamic emitters,
  shared backends, mode adapters, reducers, repair paths, and generated or projected legacy outputs.
- Define a zero-use telemetry contract for every legacy live writer and live reader boundary: mode/workstream,
  operation class, authority epoch, candidate identity, run/packet identity, result, and bounded source reference;
  payloads, credentials, and unrestricted prompts are excluded.
- Prove absence of live use with instrumentation coverage, positive-control events, a declared observation window that
  exercises each mode and relevant resume/retry/rollback path, zero qualifying live events, and an explicit unknown-path
  result. An uninstrumented or unclassified path blocks retirement.
- Consume every mode's phase-014 cutover certificate, clean rollback-window closure evidence, final authority epoch,
  and retained rollback assets before deleting that mode's old live emitters or replaced logic.
- Retire in the phase-014 manifest order: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`,
  `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, then
  `008-deep-alignment`. Each mode's live writers are removed before its replaced helpers and before shared legacy logic.
- Delete the old live emitters and logic the spine replaced only through a frozen deletion/retention manifest and a
  path-scoped candidate. Preserve archival readers, decoders, upcasters, historical projections, schemas, and fixtures
  needed to read completed legacy packets without making them canonical writers.
- Retain the phase-014 cutover, rollback, telemetry, and zero-use evidence as immutable handoff material for phase 016;
  preserve comment hygiene by keeping specification and task identifiers out of shipped code comments.

### Out of Scope
- Implementing the ledger, compatibility bridge, shadow-parity harness, in-flight-state migration, authority selector,
  cutover certificate, or rollback-window monitor; phases 003-011 own those controls.
- Closing a rollback window early, deleting rollback evidence, or replacing phase-014's later-of-14-days-and-five-runs
  rule with a timer or a low-traffic assumption.
- Removing archival readers or historical data, rewriting legacy completed packets, or changing the archival-read format
  solely to make deletion easier.
- Adding new runtime capabilities, changing mode order, or retiring the `ai-system-improvement` mode excluded by the
  phase-tree manifest.
- Running the final whole-system gate; phase 016 consumes this phase's evidence and verifies the frozen post-retirement
  behavior.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The retirement inventory is closed against phase 003 | Every censused legacy producer, consumer, state surface, backend, dynamic path, and historical-read obligation is classified as delete, retain, or blocked; no unknown row remains. |
| REQ-002 | Every mode has completed phase-014 authority evidence | The eight manifest workstreams each have a matching cutover certificate, final authority epoch, clean rollback-window closure, retained rollback assets, and no unresolved revert signal. |
| REQ-003 | Zero live use is proven before deletion | The telemetry report covers every live writer and live reader boundary, passes positive controls, records the declared observation window and candidate identity, shows zero qualifying live events, and reports zero uninstrumented paths. |
| REQ-004 | Archival reads are distinguished from live reads | Historical-reader events carry an archival classification, read-only operation, source schema/version, and completed-packet provenance; archival activity never authorizes a legacy writer removal without reader retention. |
| REQ-005 | Retirement follows the required order | Modes retire in the phase-014 manifest order; each mode's legacy writers are removed before its replaced helpers, and shared legacy emitters are removed only after all mode rows pass. |
| REQ-006 | Deletion is gated and fail closed | A stale certificate, open rollback window, live-use event, missing telemetry coverage, unknown path, failed historical read, or changed candidate blocks the deletion manifest. |
| REQ-007 | The delete/retain boundary is explicit | The final manifest names every deleted live emitter or replaced logic unit and every retained archival reader, decoder, upcaster, schema, projection, and fixture with an owner and purpose. |
| REQ-008 | Reversibility lasts until deletion | Before deletion, the legacy adapters, rollback anchors, cutover evidence, and pre-delete candidate can restore the prior runtime without data loss; deletion does not begin until this evidence is retained. |
| REQ-009 | Shipped comments remain durable and clean | Deleted or retained runtime comments contain no spec, task, phase, packet, or finding identifiers; comments explain durable behavior only. |
| REQ-010 | Phase 016 receives a complete handoff | The handoff binds the deletion diff, retention manifest, zero-use report, per-mode closure evidence, historical-read results, rollback evidence, candidate SHA, and verification commands. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The zero-use report proves complete telemetry coverage and zero live legacy writes or reads across the
  declared observation window, while positive controls and archival-read classifications validate the measurement.
- **SC-002**: All eight modes have clean phase-014 closure evidence and retire in the declared order, with mode writers
  removed before shared legacy logic.
- **SC-003**: The deletion manifest and candidate diff remove only old live emitters and replaced logic; every required
  archival reader and historical fixture remains executable and readable.
- **SC-004**: No live-use, unknown-path, stale-evidence, open-window, or archival-read failure can be bypassed to delete.
- **SC-005**: Rollback evidence and a pre-delete restoration anchor remain retained through the deletion decision, and
  phase 016 receives an auditable handoff bound to the exact candidate SHA.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False zero from incomplete telemetry** - Dynamic path construction, retries, subprocesses, replay workers, or shared
  backends may bypass counters. Mitigation: reconcile the phase-003 census, static callsite inventory, runtime probes,
  positive controls, and an explicit unknown-path blocker before accepting absence.
- **Archival reader orphaning** - A broad legacy sweep may delete a decoder or projection used only by old completed
  packets. Mitigation: classify reader events separately, retain every historical-read obligation from phase 003, and
  run fixtures for each legacy schema family before deletion.
- **Premature mode or shared deletion** - Shared deep-improvement services are used by three variants and the manifest
  order has a deliberate common-before-variants rule. Mitigation: enforce per-mode rows, writers-before-helpers, and
  shared-last sequencing in the deletion manifest.
- **Rollback evidence loss** - Removing adapters or evidence stores before the final gate could make a failed deletion
  unrecoverable. Mitigation: require closed phase-014 windows, retained anchors, a pre-delete candidate, and immutable
  evidence before the first delete operation.
- **Candidate drift** - A changed BASE, authority epoch, mode contract, or telemetry implementation invalidates evidence.
  Mitigation: bind every report to the exact candidate SHA and rerun the gate on any drift.
- **Comment and scope drift** - Deletion work can leave ephemeral phase IDs in runtime comments or touch unrelated cleanup.
  Mitigation: review the deletion diff for comment hygiene and enforce the frozen delete/retain manifest.
- **Dependencies**: the controlling sources are the 006 parent spec, `manifest/phase-tree.json`, phase-003 baseline and
  census, phase-014 authority-flip and cutover-window contracts, the retained phase-007 receipt semantics, and the phase
  013 whole-system gate. The validator and isolated git worktree provide the packet-level execution boundary.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block authoring. Execution must ratify the telemetry observation-window duration, exact event names and storage
destination, the archival-read event classification, the final delete/retain manifest, and the verifier used for each
historical schema family. Those choices may tighten the gate but may not waive positive controls, complete coverage,
zero live-use evidence, phase-014 window closure, mode order, or archival-reader retention.
<!-- /ANCHOR:questions -->
