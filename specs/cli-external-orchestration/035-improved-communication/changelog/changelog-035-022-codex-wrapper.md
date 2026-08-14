---
title: "Changelog: Phase 22 Codex Wrapper [035-improved-communication/022-codex-wrapper]"
description: "Chronological changelog for the Phase 22 Codex Wrapper phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/022-codex-wrapper` (Level 2)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires Codex through the Phase 020 CLI-output wrapper. It runs `codex exec` in its non-interactive JSON-stream mode, maps the output envelope through the Codex runtime adapter onto the assembler event shape, re-renders through `projectMessage()`, gates on `isProjectionEnabled()`, and fails open to the byte-exact original. Scope is limited to the Codex executor entry, the adapter mapping, and their tests; the wrapper, the entrypoint, and canonical bytes stay in Phase 020.

### Added

- Create the planned Phase 022 packet planning docs (spec.md, plan.md, tasks.md, checklist.md)
- [P] Author the Codex executor entry on the Phase 020 wrapper that runs `codex exec` headless in JSON-stream mode and captures the output stream (REQ-001)
- [P] Map Codex's output envelope onto the assembler event shape through the Codex runtime adapter (REQ-002)
- [P] Identify and pin Codex's actual headless and JSON-stream flags from its CLI before the wrapper relies on them (REQ-003)
- [P] Gate projection on `isProjectionEnabled()`, showing the byte-exact original when the gate is off (REQ-004)
- [P] Fail open to the byte-exact original on any parse failure, adapter rejection, projection error, or disabled gate (REQ-005)
- [P] Tests covering the Codex envelope mapping, the enablement gate, and the fail-open fallback (REQ-006)

### Changed

- None (planning only)

### Fixed

- None (planning only)

### Verification

- Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending; no code has been written and all deliverables above remain planned.
- Depends on the Phase 020 CLI-output wrapper, which owns `projectMessage()`, `isProjectionEnabled()`, and the fail-open byte-exact fallback.
- Depends on the Phase 021 Claude Code wrapper, which provides the wrapper seam precedent to mirror.
- Requires the Codex runtime adapter (`src/runtimes/codex.ts`) and a pinned Codex CLI reference so the headless and JSON-stream flags are confirmed before the wrapper relies on them.
- Builds on predecessor `021-claude-code-wrapper`; the successor runtime-wiring phase is wired by the coordinator.
