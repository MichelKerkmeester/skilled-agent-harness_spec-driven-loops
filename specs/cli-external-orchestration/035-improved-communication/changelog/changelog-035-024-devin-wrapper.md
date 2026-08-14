---
title: "Changelog: Phase 24 Devin Wrapper [035-improved-communication/024-devin-wrapper]"
description: "Chronological changelog for the Phase 24 Devin Wrapper phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/024-devin-wrapper` (Level 2)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires Devin output projection through the Phase 020 CLI-output wrapper. It runs `devin -p` non-interactively and single-turn, captures the printed stdout, routes it through the Devin runtime adapter onto the assembler event envelope shape, feeds the adapted event into `projectMessage()`, gates projection on `isProjectionEnabled()`, and fails open to the byte-exact original. Devin exposes only input, tool, and session-lifecycle hooks that never rewrite the rendered answer, so the wrapper is the only integration path.

### Added

- Author the planned Level-2 phase documents: spec.md, plan.md, tasks.md, and checklist.md (planned, no implementation yet)
- [P] Run a live `devin -p` probe confirming Devin's single-turn print behaviour before the adapter mapping is relied on (REQ-002)
- [P] Author the `devin -p` print-mode capture that runs non-interactively and single-turn with a `--` prompt separator and `/dev/null` stdin, capturing stdout (planned)
- [P] Map the captured print output through `devinRuntimeAdapter.adapt()` onto the assembler event envelope shape (REQ-001)
- [P] Feed the adapted event into `projectMessage()` in the frozen stage order (REQ-003)
- [P] Gate projection on `isProjectionEnabled()`, returning the byte-exact original without a provider call when the gate is off (REQ-004)
- [P] Fail open to the byte-exact original on any error, throw, timeout, or non-accept terminal (REQ-005)
- [P] Cover the adapter mapping, the gate matrix, and the fallback path with tests (REQ-006)

### Changed

None (planning only)

### Fixed

None (planning only)

### Verification

Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: tasks T001 through T011 have not been executed, and no implementation evidence has been collected.
- Dependencies: the completed Phase 020 CLI-output wrapper seam, the Phase 018 `projectMessage()` entrypoint, and the Phase 016 default-off enablement gate `isProjectionEnabled()`.
- Requires the existing Devin runtime adapter (`src/runtimes/devin.ts`) and a live `devin -p` single-turn probe before the adapter mapping is relied on.
- Builds on predecessor `023-pi-wrapper`; the successor runtime-wiring phase is wired by the coordinator.
