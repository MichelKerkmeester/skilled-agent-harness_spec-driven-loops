---
title: "Changelog: Phase 18 Projection Runtime Core [035-improved-communication/018-projection-runtime-core]"
description: "Chronological changelog for the Phase 18 Projection Runtime Core phase."
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

> Spec folder: `specs/sk-communication/001-sk-communication-creation/018-projection-runtime-core` (Level 3)
> Parent packet: `specs/sk-communication/001-sk-communication-creation`

### Summary

The enablement flag currently gates a partially-unbuilt library: the provider adapters only prepare and parse, no production transport exists, the client presentation functions are unreachable from the root barrel, and `judgeMode: 'required'` falls back to `JUDGE_UNAVAILABLE`. This planned phase builds the production projection runtime core so one `projectMessage()` call turns a single raw agent message into a validated display projection or the exact original, preserving every existing invariant. It is the critical path for the runtime-wiring phases 019 through 025.

### Added

- Author the planned Level-3 packet documents: spec.md, plan.md, tasks.md, checklist.md, and decision-record.md
- [P] Provide a default hosted-provider HTTP `ProviderTransport`, injected where the executor expects it (REQ-001)
- [P] Provide a local-model transport path (Ollama or llama.cpp compatible) without any hosted egress (REQ-002)
- [P] Provide one top-level `projectMessage()` entrypoint that runs the full frozen stage order in sequence (REQ-003)
- [P] Gate projection first via `isProjectionEnabled()` and return the exact original when off (REQ-004)
- [P] Route privacy before any hosted call, with a denied route yielding the exact original and no hosted egress (REQ-005)
- [P] Bind `judgeMode: 'required'` to a default reject-only meaning judge so validation resolves instead of returning `JUDGE_UNAVAILABLE` (REQ-006)
- [P] Export `applyDisplayPresentation` and `applySidecarPresentation` from the root barrel (REQ-007)
- [P] Preserve canonical state byte-for-byte and fall back to the exact original on every non-accept terminal (REQ-008, REQ-009)
- [P] Keep `npm run check` green with new entrypoint, transport, judge, and root-barrel export tests (REQ-010)

### Changed

None (planning only).

### Fixed

None (planning only).

### Verification

Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: no transport, entrypoint, judge binding, barrel export, or test has been shipped.
- Blocked by the Phase 017 runtime-wiring feasibility and contract predecessor, which must pin the transport and stage-order contract first.
- Blocked by the Phase 016 default-off enablement gate and the Phase 002-008 assembled projection library.
- Successor: runtime-wiring phases 019 through 025 depend on this runtime core and are wired by the coordinator.
