---
title: "Changelog: Phase 019 OpenCode Native Plugin [035-improved-communication/019-opencode-native-plugin]"
description: "Chronological changelog for the Phase 019 OpenCode Native Plugin phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/019-opencode-native-plugin` (Level 3)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned phase wires the first working runtime: an OpenCode plugin at `.opencode/plugins/mk-communication-projection.js` that registers the native `chat.message` hook, gates projection behind `isProjectionEnabled()` and the shared `isHookEnabled(concern)` kill-switch, and holds the byte-exact original parts in message-id keyed plugin state for restore. It proves the whole projection on the only runtime with a native output-transform hook before the wrapper-based runtimes in phases 020-025 follow. Scope is the plugin and its test suite only; the Phase 018 entrypoint and the Phase 017 contract are consumed, never modified.

### Added

- Author the planning documents for the planned Level-3 packet (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- [P] Create the OpenCode plugin at `.opencode/plugins/mk-communication-projection.js` registering the plugin `chat.message` hook (REQ-001)
- [P] Mutate `output.parts` to the projected text when the hook accepts a projection (REQ-002)
- [P] Gate projection behind `isProjectionEnabled()` AND the shared `isHookEnabled(concern)` kill-switch, failing open on any error or disabled state (REQ-003, REQ-004)
- [P] Hold the canonical original parts in plugin-side state keyed by message id for byte-exact restore (REQ-005, REQ-006)
- [P] Call the Phase 018 `projectMessage()` entrypoint and honour its exact-original fallback for every non-accept terminal (REQ-007)
- [P] Author the plugin test suite mirroring the `mk-*.test.cjs` pattern at `.opencode/plugins/tests/mk-communication-projection.test.cjs` (REQ-008)
- [P] Confirm the Phase 017 `chat.message` display caveat pre-implementation (REQ-009)

### Changed

None (planning only).

### Fixed

None (planning only).

### Verification

- Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: no plugin, tests, or runtime evidence has been produced; the packet records Planned status with zero completion.
- Depends on the Phase 018 `projectMessage()` entrypoint, the Phase 017 runtime-wiring feasibility and contract, and the Phase 016 default-off enablement gate plus the shared `isHookEnabled(concern)` kill-switch.
- The Phase 017 LOW-CONFIDENCE `chat.message` display caveat must be confirmed pre-implementation before authoring the hook.
- Predecessor: `018-projection-runtime-core`; the proven hook seam then feeds the successor runtime-wiring phases 020-025.
