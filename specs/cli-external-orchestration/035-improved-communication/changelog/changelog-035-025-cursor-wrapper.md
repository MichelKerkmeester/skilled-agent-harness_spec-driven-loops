---
title: "Changelog: Phase 25 Cursor Wrapper [035-improved-communication/025-cursor-wrapper]"
description: "Chronological changelog for the Phase 25 Cursor Wrapper phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/025-cursor-wrapper` (Level 2)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires Cursor into the existing Phase 020 CLI-output wrapper, the integration seam Cursor needs because it exposes only input, tool, and lifecycle hooks and cannot rewrite the rendered assistant answer. It captures non-interactive `cursor-agent` stdout as the canonical original, routes it through the Cursor runtime adapter onto the assembler event shape, calls the Phase 018 `projectMessage()` entrypoint, and re-renders the projection only on an accept terminal. Every other terminal fails open to the byte-exact original, and the wrapper, entrypoint, adapter, and enablement gate are consumed, never modified.

### Added

- Author the planned Phase 025 packet documents (spec.md, plan.md, tasks.md, checklist.md)
- [P] Wire Cursor into the Phase 020 CLI-output wrapper. (REQ-001)
- [P] Confirm the `cursor-agent` non-interactive print flag from its CLI before the wrapper relies on it. (REQ-002)
- [P] Map captured cursor-agent stdout onto the assembler event shape through `cursorRuntimeAdapter`. (REQ-003)
- [P] Gate projection behind `isProjectionEnabled()`. (REQ-004)
- [P] Call the Phase 018 `projectMessage()` entrypoint. (REQ-005)
- [P] Fail open on any capture, adapter, gate, or entrypoint error to the byte-exact original. (REQ-006)
- [P] Re-render the projected output when the entrypoint accepts. (REQ-007)
- [P] Test the adapter mapping, the enablement gate, and the fail-open fallback. (REQ-008)

### Changed

None (planning only).

### Fixed

None (planning only).

### Verification

- Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending; nothing has shipped and no evidence beyond planning has been collected.
- Depends on the Phase 020 CLI-output wrapper (hard blocker), which owns the capture and re-render seam this phase wires Cursor into.
- Depends on the Cursor runtime adapter from Phase 006, the Phase 018 `projectMessage()` entrypoint, the Phase 016 `isProjectionEnabled()` gate, and the Phase 017 seam contract.
- The `cursor-agent` non-interactive print flag must be confirmed from its CLI before the wrapper relies on it.
- Predecessor: `024-devin-wrapper`. The successor is wired by the coordinator among the remaining phases 026 through 028.
