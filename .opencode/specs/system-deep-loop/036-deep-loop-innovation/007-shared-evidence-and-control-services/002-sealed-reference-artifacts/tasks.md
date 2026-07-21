---
title: "Tasks: Sealed Reference Artifacts"
description: "Tasks for implementing immutable sealing, reference-by-digest, verified reads, replay binding, and retention of deep-loop reference artifacts."
trigger_phrases:
  - "sealed reference artifacts tasks"
  - "deep-loop artifact sealing tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-21T00:32:18Z"
    last_updated_by: "codex"
    recent_action: "Completed the sealed-artifact implementation and its focused verifier"
    next_safe_action: "Preserve the dark boundary until later consumers integrate the service"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Sealed Reference Artifacts

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

- [x] T001 Inventory initial artifact kinds, mutable input sources, replay roots, rollback holds, and archival requirements against the pinned baseline [EVIDENCE: `state-backend-census.json` and `replay-rollback-manifest.json` reviewed]
- [x] T002 Freeze the versioned seal descriptor, canonicalization registry, algorithm-qualified digest grammar, verified-read errors, reference-set ordering, and lifecycle records [EVIDENCE: `sealed-artifact-types.ts` and `artifact-events.ts`]
- [x] T003 Define the additive-dark integration boundary with phase-006 fingerprints and phase-008 input-equivalence checks without changing legacy authority [EVIDENCE: `artifact-reference-set.ts`; scoped Git status leaves legacy writers unchanged]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement deterministic canonicalizers for prompt sets, fixtures, prior-run outputs, and configuration with explicit artifact-kind/version registration [EVIDENCE: `artifact-registries.ts`; focused Vitest 45/45]
- [x] T005 Implement staged atomic sealing, descriptor derivation, immutable blob publication, post-write verification, and reference publication [EVIDENCE: `sealed-artifact-store.ts`; four crash-boundary fixtures pass]
- [x] T006 Implement idempotent duplicate sealing plus typed collision, descriptor-conflict, corruption, and quarantine handling [EVIDENCE: focused Vitest idempotency and forced-collision cases pass]
- [x] T007 Implement exact reference-by-digest schemas and reject mutable-only path, alias, tag, and `latest` inputs from dark replay evidence [EVIDENCE: focused mutable-reference matrix passes]
- [x] T008 Implement streaming verified reads that recompute size and digest before releasing a verified handle and release no bytes on failure [EVIDENCE: `readBoundedFile` plus 11 corruption/per-kind cases pass]
- [x] T009 Bind ordered verified artifact-reference sets into ledger events, receipts/certificates, and the phase-006 replay-fingerprint descriptor [EVIDENCE: focused Vitest 45/45; replay fingerprint integration fixture passes]
- [x] T010 Add the phase-008 shadow-parity precondition that legacy and dark executions cite the same verified artifact-reference set [EVIDENCE: `compareArtifactReferenceSets` mismatch fixture passes]
- [x] T011 Implement append-only lifecycle records for creation, protected references, retention class, holds, quarantine, eligibility, deletion receipts, tombstones, and exact restoration [EVIDENCE: `artifact-events.ts` and lifecycle fixtures pass]
- [x] T012 Implement conservative mark-and-sweep rooted in runs, fingerprints, receipts, rollback windows, archival readers, and holds; incomplete analysis retains data [EVIDENCE: focused Vitest 45/45; six root fixtures and incomplete-scan fixture pass]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify equivalent inputs produce byte-identical canonical content, descriptors, and algorithm-qualified digests across supported platforms [EVIDENCE: four-kind canonicalization matrix passes in focused Vitest]
- [x] T014 Verify crash-stage atomicity, immutability, duplicate idempotency, collision quarantine, and no partial published reference [EVIDENCE: focused Vitest 45/45; four crash boundaries plus idempotency and collision fixtures pass]
- [x] T015 Verify missing, changed, truncated, substituted, wrong-kind, wrong-size, and unsupported-version objects fail before any bytes reach a consumer [EVIDENCE: verified-read failure matrix passes with 45/45 total tests]
- [x] T016 Verify mutable-only or unverifiable inputs cannot produce trusted replay fingerprints, parity comparisons, receipts, or certificates [EVIDENCE: focused Vitest 45/45; unrecorded-seal and mutable-reference fixtures pass]
- [x] T017 Verify identical sealed inputs plus the same replay contract reproduce effective events and projections, while any input/reference drift yields a typed mismatch [EVIDENCE: focused Vitest 45/45; deterministic replay and reversed-order fingerprint fixtures pass]
- [x] T018 Verify retention preserves all protected roots, uncertainty deletes nothing, eligible sweep emits receipts, tombstones fail reads, and restoration requires exact bytes [EVIDENCE: focused Vitest 45/45; retention, sweep, tombstone, and restoration fixtures pass]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:evidence -->
## Completion Evidence

- The focused Vitest contract passes 45 tests covering four artifact kinds, four publication crash boundaries, the
  verified-read failure matrix, gateway-authorized ledger evidence, replay/parity binding, six retention roots,
  deletion receipts, tombstones, and exact restoration.
- Full runtime TypeScript checking passes with exit 0. The alignment verifier reports zero findings across the seven
  source modules, and comment hygiene reports zero violations across all eight runtime and test files.
- Scoped Git inspection shows only the new service directory, its focused test, and this leaf's documentation;
  `event-envelope`, `authorized-ledger`, `replay-fingerprint`, and existing runtime writers have no changes.
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
