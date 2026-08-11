---
title: "Changelog: Phase 003 Core Normalization and Assembly [035-improved-communication/003-core-normalization-and-assembly]"
description: "Chronological changelog for the Phase 003 Core Normalization and Assembly phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-11

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/003-core-normalization-and-assembly` (Level 3)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

The package now exports a runtime-neutral normalizer, a bounded generation-keyed assembler, a request-scoped context selector and a closed evidence emitter. Inputs are validated and detached before state changes. Terminal failures keep the frozen exact-original record available.

### Added

- [P] Create the proposed Phase 003 package surfaces and focused test suite (spec.md, plan.md)
- Implement normalization and ordering invariants. (packages/cli-communication-projection/src/core/normalizer.ts)
- [P] Implement the bounded generation state machine. (packages/cli-communication-projection/src/core/assembler.ts)
- Implement bounded context selection plus typed failure, cancellation, timeout, and exact-original fallback behavior (packages/cli-communication-projection/src/context/selector.ts, src/core/)
- Implement content-free lifecycle evidence at core boundaries (packages/cli-communication-projection/src/observability/emitter.ts)
- Reconcile checklist, implementation summary, metadata, and 004-protected-spans-fidelity-render handoff (checklist.md)

### Changed

- Freeze normalization, assembly, bounded-context, content-free evidence, and independent test-matrix invariants (spec.md, plan.md)
- [P] Replay adversarial assembly, context, privacy, evidence, and cleanup matrices (packages/cli-communication-projection/test/core/)
- [P] Run same-class producer and changed-consumer inventories (checklist.md)
- Run focused negative controls and boundary tests (checklist.md)
- Run the authoritative workspace gate and recursive packet validator (checklist.md)
- All P0 requirements and checklist blockers have observed evidence.

### Fixed

- Confirm 002-contracts-and-fixtures handoff evidence and capture the baseline (spec.md, plan.md)

### Verification

- Phase 002 baseline - PASS: 7 files and 30 tests before Phase 003 implementation
- Phase 003 focused suite - PASS: 5 files and 17 tests
- Authoritative package gate - PASS: typecheck, build, 12 files and 47 tests, plus public import smoke
- Export negative control - PASS: five Phase 003 exports absent before implementation and present after build
- Dependency and security audit - PASS: three development dependencies, no production dependency added and 0 vulnerabilities
- Package dry run - PASS: 121 entries, 59,765-byte archive and 317,722 bytes unpacked
- Comment and unsafe-shortcut scans - PASS: no ephemeral comment pointer, unsafe type escape, ignored type error, temporary marker or debug logger found
- One-mebibyte warm benchmark - PASS: Apple M5 Max, Node v25.6.1, 5 warm-ups, 30 measured runs, 2.63 ms p50 and 3.10 ms p95 against the 25 ms budget

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Projection fidelity is not implemented: Protected spans, semantic vetoes and render decisions belong to Phase 004.
- Provider and runtime adapters are not implemented: Hosted or local inference begins in Phase 005. Claude, Codex, Pi, OpenCode, Devin and Cursor integration begins in Phase 006.
- Performance evidence is provisional: The warm benchmark passed on one machine. Release decisions still require the broader evaluation and release gates in Phases 007 and 008.
- Memory indexing was unavailable: The memory transport returned Transport closed. Canonical packet files and local metadata scripts remain the source of truth for this handoff.
