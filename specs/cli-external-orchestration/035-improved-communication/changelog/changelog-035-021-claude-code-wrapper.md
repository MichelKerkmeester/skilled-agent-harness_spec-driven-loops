---
title: "Changelog: Phase 21 Claude Code Wrapper [035-improved-communication/021-claude-code-wrapper]"
description: "Chronological changelog for the Phase 21 Claude Code Wrapper phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/021-claude-code-wrapper` (Level 2)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires Claude Code output projection through the Phase 020 CLI-output wrapper. It runs `claude -p --output-format stream-json`, maps the stream through the Claude runtime adapter onto the assembler event shape, routes it through `projectMessage()`, gates on `isProjectionEnabled()`, and fails open to the byte-exact original. The interactive TUI is explicitly out of scope because only headless and print output are interceptable.

### Added

- Author the planned Level-2 phase documents: spec.md, plan.md, tasks.md, and checklist.md (planned, no implementation yet)
- [P] Implement the Claude runtime adapter that maps stream-json events onto the assembler event shape in order (planned)
- [P] Wire the wrapper seam to run `claude -p --output-format stream-json`, route the stream through `projectMessage()`, and re-render projected output (planned)
- [P] Gate every seam entry on `isProjectionEnabled()` and fail open to the byte-exact original on disable or any failure (planned)
- [P] Cover the adapter mapping, the enablement gate, and the exact-original fallback with tests (planned)
- [P] Run capability and privacy pre-checks before any hosted routing (planned)

### Changed

None (planning only)

### Fixed

None (planning only)

### Verification

Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: tasks T001 through T013 have not been executed, and no implementation evidence has been collected.
- Dependencies: the completed Phase 020 CLI-output wrapper framework and its capture-transform-re-render seam, the Phase 018 projection runtime core `projectMessage()` entrypoint, and the Phase 016 default-off enablement gate `isProjectionEnabled()`.
- Builds on predecessor Phase 020 CLI-output wrapper framework; it is the first live consumer of that wrapper seam.
