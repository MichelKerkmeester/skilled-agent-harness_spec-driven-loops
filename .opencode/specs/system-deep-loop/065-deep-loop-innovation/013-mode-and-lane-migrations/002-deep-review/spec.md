---
title: "Feature Specification: Deep Review Migration"
description: "Migrate Deep Review from its legacy scope, dimension-pass, convergence, and review-report loop to the shared typed event-ledger substrate through seven independently gated concern children."
trigger_phrases:
  - "Deep Review migration"
  - "deep-review typed event ledger"
  - "Deep Review mode gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the seven-child Deep Review ledger migration scope"
    next_safe_action: "Develop child 001 typed ledger schema contract on the shared core"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Deep Review Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-deep-ai-council |
| **Handoff Criteria** | Deep Review's full run behavior is migrated to the typed event-ledger substrate: schema and reducers defined, artifacts sealed, certificate and receipts emitted, resume adapter proven, shadow-parity green, and the mode gate passes with the rollback switch armed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The implementation program makes phase 013 responsible for migrating each mode's full run behavior after phase 015 freezes the shared mode contracts and write-set conflict graph. Deep Review is one of those workstreams, and its scope-to-dimension-pass-to-convergence-to-review-report lifecycle must move without making the legacy path authoritative prematurely or forking the shared review-loop contract used by Deep Alignment.

The research inputs show why this migration needs its own bounded parent: review candidates must be separated from validated P0/P1/P2 findings; impact, confidence, reachability, and evidence strength must remain distinct; finding identity must survive revisions through stable semantic fingerprints and lineage; and every evaluation must remain replayable through receipts and retained raw evidence. This phase therefore organizes the mode migration around the seven concern contracts below while keeping their mechanics in the child specs.

It hands the successor a mode-complete, parity-proven Deep Review implementation whose sealed ledger, deterministic projections, continuity mapping, and rollback evidence can be consumed alongside the shared contracts by Deep AI Council. The successor does not inherit an unclassified legacy state path or need to invent a second review-specific substrate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-typed-ledger-schema/` | Define the TYPED APPEND-ONLY EVENT SCHEMA Deep Review emits during its run: the event-envelope specialization, the concrete event types for Deep Review's run behavior, field-level types, and the versioned-envelope plus upcaster hooks. Consumes the phase-006 transition-authorized ledger core and the phase-012 shared event contracts. Output is Deep Review's event VOCABULARY only - the reducers belong to the next sibling. | Planned |
| 002 | `002-reducers-and-projections/` | Define the DETERMINISTIC REDUCERS that replay Deep Review's typed event log (the previous sibling's schema) into its live state projections (iteration/convergence state, artifact index, per-mode status). A pure fold with no side effects: an identical event sequence must always yield an identical projection. | Planned |
| 003 | `003-sealed-artifacts/` | Define how Deep Review SEALS its reference artifacts - the immutable inputs and outputs it must be able to reproduce: content-addressed digests, seal-on-write, and a tamper-evident read path. Consumes the phase-006 sealing primitives; do not invent a second sealing scheme. | Planned |
| 004 | `004-certificates-and-receipts/` | Define Deep Review's per-run CERTIFICATE and per-transition RECEIPTS: what each attests, the replay-fingerprint inputs, and how an independent verifier re-checks them offline. Consumes the phase-006 receipt and certificate primitives. | Planned |
| 005 | `005-resume-adapter/` | Define Deep Review's RESUME ADAPTER: how a mid-run interruption rebuilds live state purely from the sealed ledger via the reducers, the continuity-ladder mapping, and an idempotent re-entry contract (no double-apply, no lost or replayed events). | Planned |
| 006 | `006-shadow-parity/` | Define Deep Review's SHADOW-PARITY harness: run the new ledger path in shadow alongside the legacy emitter, diff the projections event-for-event, and state the parity acceptance criteria that MUST be green before any authority cutover. Consumes the phase-014 shadow framework. | Planned |
| 007 | `007-rollback-and-mode-gate/` | Define Deep Review's ROLLBACK SWITCH and independent Deep Review GATE: the fail-closed authority-cutover toggle, the bounded rollback window, and the mode-gate checklist that certifies THIS mode migrated (shadow-parity green, artifacts sealed, certificate emitted). This is the mode's exit gate into phase 014. | Planned |
<!-- /ANCHOR:phase-map -->
