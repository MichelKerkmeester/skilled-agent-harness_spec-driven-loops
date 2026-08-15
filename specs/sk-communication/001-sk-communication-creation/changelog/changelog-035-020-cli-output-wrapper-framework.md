---
title: "Changelog: Phase 020 CLI-Output Wrapper Framework [035-improved-communication/020-cli-output-wrapper-framework]"
description: "Chronological changelog for the Phase 020 CLI-Output Wrapper Framework phase."
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

> Spec folder: `specs/sk-communication/001-sk-communication-creation/020-cli-output-wrapper-framework` (Level 3)
> Parent packet: `specs/sk-communication/001-sk-communication-creation`

### Summary

This planned phase defines the shared CLI-output wrapper framework that projects output for every runtime without a native output-transform hook (Claude Code, Codex, Devin, Cursor, and Pi if its `turn_end` cannot mutate). The wrapper is planned to run the target runtime in headless, stream, or print mode, capture the assistant output stream incrementally, normalize each envelope through the existing per-runtime adapters, feed the Phase 018 `projectMessage()` entrypoint, and re-render the projected text behind the `isProjectionEnabled()` gate with a fail-open byte-exact original passthrough. Nothing has shipped; this entry records the planning event only.

### Added

- Author the Phase 020 planning packet: spec.md, plan.md, tasks.md, checklist.md, decision-record.md (Level 3)
- [P] Provide a single wrapper entrypoint parameterized by runtime (REQ-001)
- [P] Run the target runtime in its headless, stream, or print mode with incremental stream capture (REQ-002, REQ-003)
- [P] Normalize each runtime's output envelope into the assembler's event shape through the per-runtime adapters (REQ-004)
- [P] Gate projection behind `isProjectionEnabled()` and fail open with a byte-exact original passthrough on every disabled, failed, or incapable state (REQ-005, REQ-006)
- [P] Re-render the projected text on an accept terminal (REQ-007)
- [P] Provide the launch/registration pattern operators invoke (REQ-008)
- [P] Propose ADR-001 (parameterized wrapper entrypoint) and ADR-002 (incremental capture with a fail-open byte-exact original passthrough) (decision-record.md)

### Changed

None (planning only).

### Fixed

None (planning only).

### Verification

- Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending; no wrapper code, launch pattern, or test suite has been authored.
- Blockers: the Phase 018 `projectMessage()` entrypoint, the Phase 017 runtime-wiring feasibility and contract, the Phase 016 default-off enablement gate `isProjectionEnabled()`, and the Phase 019 OpenCode native plugin as the proven native-hook seam.
- Builds on predecessor: `019-opencode-native-plugin`.
- Single-runtime end-to-end validation belongs to successor Phase 021.
