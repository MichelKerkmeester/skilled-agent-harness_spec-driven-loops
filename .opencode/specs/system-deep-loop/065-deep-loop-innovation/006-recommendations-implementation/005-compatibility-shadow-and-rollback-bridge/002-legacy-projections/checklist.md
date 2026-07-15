---
title: "Checklist: Legacy Projections"
description: "Blocking verifier checklist for deterministic, byte-identical legacy projections from the dark ledger."
trigger_phrases:
  - "legacy projections checklist"
  - "dark ledger projection checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 gates for projection coverage, timing, isolation, and byte identity"
    next_safe_action: "Run the census-closure and byte-parity verifier matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Legacy Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for legacy projections. Every item remains pending until execution
produces evidence bound to immutable BASE, an exact verified phase-003 ledger head, a projection/reducer version, and
artifact digests. Verification must run only in isolated fixture/shadow roots and must fail on zero manifest rows,
zero reader fixtures, unexpected live-path access, or tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-000 census is frozen; every JSONL/JSON surface has schema, writer, readers, path, fixture, refresh boundary, and archival obligation
- [ ] CHK-002 [P0] BASE bytes and verified phase-003 ledger fixtures are pinned by full digest and exact ledger head
- [ ] CHK-003 [P1] Projection/reducer versioning, watermark schema, typed failures, and shadow-root policy are approved before output code lands
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every projector is a pure fold over declared inputs; mutable live legacy output is never hidden reducer state
- [ ] CHK-005 [P0] Legacy serializers are reused or extracted; canonical ledger serialization is never substituted for legacy bytes
- [ ] CHK-006 [P1] Full-rebuild and incremental paths share one reducer contract; incremental state is disposable and cross-checked against replay
- [ ] CHK-007 [P1] Typed errors retain artifact ID, ledger head, projection version, and failing invariant without publishing partial output
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] The projection manifest closes against the phase-000 census with zero missing, duplicate, ambiguous, or unowned rows
- [ ] CHK-009 [P0] Full rebuilds repeated in clean processes produce identical bytes and digests for every manifest row
- [ ] CHK-010 [P0] Incremental projection at each selected ledger head is byte-identical to full replay from BASE
- [ ] CHK-011 [P0] JSONL fixtures match BASE row bytes, order, separators, terminal newline, diff fingerprints, and unchanged-row suppression
- [ ] CHK-012 [P0] JSONL projection is immediate and fsynced; no append-only surface enters the deferred snapshot writer
- [ ] CHK-013 [P0] Snapshot fixtures match BASE insertion order, two-space indentation, terminal newline, omitted fields, integrity stamp, and unchanged-write behavior
- [ ] CHK-014 [P0] Snapshot publication stages, fsyncs, and atomically renames; coalescing occurs only for census-authorized rows and final state flushes on close
- [ ] CHK-015 [P0] Restart, duplicate-head, and repeated-event fixtures create no duplicate JSONL row, stale snapshot rewrite, or watermark regression
- [ ] CHK-016 [P0] Crash injection before and after fsync proves watermarks never advance ahead of durable output and torn shadow artifacts never become current
- [ ] CHK-017 [P0] Sequence gap, fork, hash mismatch, unknown type/version, bad authorization, corrupt tail, and reducer mismatch publish no bytes
- [ ] CHK-018 [P0] Dashboard, resume, registry, and other census-linked readers execute unchanged against projected fixture trees and match BASE results
- [ ] CHK-019 [P0] Every successor parity bundle reproduces expected/projected digests from its BASE, ledger head, projection version, and fixture inputs
- [ ] CHK-020 [P1] Refresh-lag telemetry reports artifact/head watermarks without changing any reader contract or output bytes
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P0] Every projection-manifest row implements full replay, incremental refresh, byte oracle, restart behavior, and reader evidence
- [ ] CHK-022 [P1] Any non-projectable census row has an explicit rationale, unchanged-reader impact, and owning later phase; no unknown bucket remains
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P0] Traversal, symlink escape, and direct live-target attempts fail before file open; live legacy paths remain byte-for-byte untouched
- [ ] CHK-024 [P1] Fixtures contain no credentials, host-specific secrets, or unsanitized packet content; path guards preserve sandbox boundaries
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] The registry documents every fold, serializer, refresh boundary, watermark field, reader, and parity evidence location
- [ ] CHK-026 [P1] The phase handoff cites the phase-000 census, phase-003 ledger, `atomic-state.ts`, and `manifest/phase-tree.json`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P0] Generated projection outputs, watermarks, and parity bundles stay under disposable fixture/shadow roots and never under authoritative legacy paths
- [ ] CHK-028 [P1] Implementation changes remain inside the later approved execution scope; no reader migration or adjacent cleanup lands in this phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check carries machine-detectable evidence, the census closes without an
unknown row, full and incremental projections are byte-identical to BASE, unchanged readers match, failure fixtures
publish nothing, and no live legacy path changes. Planned status is intentional; no execution evidence is claimed in
this authored doc set.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off requires a verifier receipt bound to BASE, exact ledger heads, projection/reducer version, manifest digest,
per-artifact byte digests, unchanged-reader results, and a clean live-path mutation check.
<!-- /ANCHOR:sign-off -->
