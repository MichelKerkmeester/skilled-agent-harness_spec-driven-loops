---
title: "Checklist: Legacy Projections"
description: "Blocking verifier checklist for deterministic, byte-identical legacy projections from the dark ledger."
trigger_phrases:
  - "legacy projections checklist"
  - "dark ledger projection checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-21T02:54:06Z"
    last_updated_by: "codex"
    recent_action: "Passed the projection coverage, timing, isolation, and byte-identity gates"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Legacy Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for legacy projections. Every item remains pending until execution
produces evidence bound to immutable BASE, an exact verified phase-006 ledger head, a projection/reducer version, and
artifact digests. Verification must run only in isolated fixture/shadow roots and must fail on zero manifest rows,
zero reader fixtures, unexpected live-path access, or tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-003 census is frozen; every JSONL/JSON surface has schema, writer, readers, path, fixture, refresh boundary, and archival obligation [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-002 [P0] BASE bytes and verified phase-006 ledger fixtures are pinned by full digest and exact ledger head [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-003 [P1] Projection/reducer versioning, watermark schema, typed failures, and shadow-root policy are approved before output code lands [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Every projector is a pure fold over declared inputs; mutable live legacy output is never hidden reducer state [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-005 [P0] Legacy serializers are reused or extracted; canonical ledger serialization is never substituted for legacy bytes [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-006 [P1] Full-rebuild and incremental paths share one reducer contract; incremental state is disposable and cross-checked against replay [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-007 [P1] Typed errors retain artifact ID, ledger head, projection version, and failing invariant without publishing partial output [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] The projection manifest closes against the phase-003 census with zero missing, duplicate, ambiguous, or unowned rows [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-009 [P0] Full rebuilds repeated in clean processes produce identical bytes and digests for every manifest row [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-010 [P0] Incremental projection at each selected ledger head is byte-identical to full replay from BASE [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-011 [P0] JSONL fixtures match BASE row bytes, order, separators, terminal newline, diff fingerprints, and unchanged-row suppression [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-012 [P0] JSONL projection is immediate and fsynced; no append-only surface enters the deferred snapshot writer [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-013 [P0] Snapshot fixtures match BASE insertion order, two-space indentation, terminal newline, omitted fields, integrity stamp, and unchanged-write behavior [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-014 [P0] Snapshot publication stages, fsyncs, and atomically renames; coalescing occurs only for census-authorized rows and final state flushes on close [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-015 [P0] Restart, duplicate-head, and repeated-event fixtures create no duplicate JSONL row, stale snapshot rewrite, or watermark regression [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-016 [P0] Crash injection before and after fsync proves watermarks never advance ahead of durable output and torn shadow artifacts never become current [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-017 [P0] Sequence gap, fork, hash mismatch, unknown type/version, bad authorization, corrupt tail, and reducer mismatch publish no bytes [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-018 [P0] Dashboard, resume, registry, and other census-linked readers execute unchanged against projected fixture trees and match BASE results [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-019 [P0] Every successor parity bundle reproduces expected/projected digests from its BASE, ledger head, projection version, and fixture inputs [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-020 [P1] Refresh-lag telemetry reports artifact/head watermarks without changing any reader contract or output bytes [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P0] Every projection-manifest row implements full replay, incremental refresh, byte oracle, restart behavior, and reader evidence [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-022 [P1] Any non-projectable census row has an explicit rationale, unchanged-reader impact, and owning later phase; no unknown bucket remains [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P0] Traversal, symlink escape, and direct live-target attempts fail before file open; live legacy paths remain byte-for-byte untouched [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-024 [P1] Fixtures contain no credentials, host-specific secrets, or unsanitized packet content; path guards preserve sandbox boundaries [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The registry documents every fold, serializer, refresh boundary, watermark field, reader, and parity evidence location [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-026 [P1] The phase handoff cites the phase-003 census, phase-006 ledger, `atomic-state.ts`, and `manifest/phase-tree.json` [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P0] Generated projection outputs, watermarks, and parity bundles stay under disposable fixture/shadow roots and never under authoritative legacy paths [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] CHK-028 [P1] Implementation changes remain inside the later approved execution scope; no reader migration or adjacent cleanup lands in this phase [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]

### Evidence bundle

**E1.** Focused Vitest passes 15/15 with exit 0, TypeScript passes with exit 0, alignment and comment hygiene
pass, and the parity-guard falsifier fails at the intended assertion before restoration.

**E2.** The frozen phase-003 validator passes `--static` and `--execute`: 22 fixture streams, zero projection
mismatches, shipped reader execution, and zero tracked-scope mutations.

**E3.** `implementation-summary.md` binds the module inventory, adversarial proofs, immutable census and fixture
digests, additive-dark scope audit, baseline caveat, and final strict-validation result.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Every P0 and P1 check now carries machine-detectable evidence. The census closes without an unknown row, full and
incremental fixtures are byte-identical to BASE, unchanged readers match, failure fixtures publish nothing, and the
leaf-scoped audit shows no live legacy path or authority change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off by the focused test, census execution, typecheck, quality, metadata, and strict packet receipts recorded in
`implementation-summary.md`, bound to BASE, exact ledger heads, projection/reducer versions, manifest and artifact
digests, unchanged-reader results, and a clean leaf-scoped live-path mutation check.
<!-- /ANCHOR:sign-off -->
