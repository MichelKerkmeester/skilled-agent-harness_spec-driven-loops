---
title: "Changelog: Phase 23 Pi Wrapper [035-improved-communication/023-pi-wrapper]"
description: "Chronological changelog for the Phase 23 Pi Wrapper phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase planning"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-14

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/023-pi-wrapper` (Level 2)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires Pi output projection on a validated integration path. Pi is PARTIAL: its `turn_end` event delivers the ending assistant message but is only read in-repo, so the phase first runs a `turn_end`-mutation validation probe and records the observable verdict. The verdict selects exactly one shipped path: a Pi extension that projects via `turn_end` if mutation works, else the Phase 020 CLI-output wrapper in `pi` print mode with the Pi runtime adapter, gated on `isProjectionEnabled()` and failing open to the byte-exact original.

### Added

- [P] Author the Phase 023 planning documents (spec.md, plan.md, tasks.md, checklist.md)
- [P] Define the `turn_end`-mutation probe that mutates a rendered Pi bubble through a handler and records the observable verdict (REQ-001)
- [P] Wire the single validated path: a `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode with the Pi runtime adapter (REQ-002)
- [P] Gate every seam entry on `isProjectionEnabled()`, emitting the byte-exact original with no provider call when off (REQ-003)
- [P] Fail open to the byte-exact original on any probe, adapter, extension, parse, or wrapper failure (REQ-004)
- [P] Preserve canonical event bytes and keep the original available for exact restore (REQ-005)
- [P] Plan tests covering the recorded probe verdict, the chosen path, the enablement gate, and the exact-original fallback (REQ-006)

### Changed

None (planning only).

### Fixed

None (planning only).

### Verification

Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: the phase is Planned with zero completion evidence; execution begins with the `turn_end`-mutation probe (T001-T004).
- Depends on the completed Phase 020 CLI-output wrapper framework for the wrapper fallback path.
- Depends on the Phase 017 Pi feasibility note that `turn_end` only reads the assistant message.
- Depends on the Phase 018 projection runtime core `projectMessage()` entrypoint.
- Depends on the Phase 016 default-off enablement gate `isProjectionEnabled()`.
- Builds on predecessor Phase 022-codex-wrapper; the successor is a parent packet decision.
