---
title: "Changelog: Phase 17 Runtime-Wiring Feasibility and Contract [035-improved-communication/017-runtime-wiring-feasibility-and-contract]"
description: "Chronological changelog for the Phase 17 Runtime-Wiring Feasibility and Contract phase."
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

> Spec folder: `specs/cli-external-orchestration/035-improved-communication/017-runtime-wiring-feasibility-and-contract` (Level 3)
> Parent packet: `specs/cli-external-orchestration/035-improved-communication`

### Summary

This planned design phase establishes the per-runtime feasibility and the hook-to-projection integration contract that wiring phases 019-025 implement against. It produces no code: it records the feasibility matrix, the seam contract, and validation evidence for the two open feasibility questions. The key decision is to adopt exactly two integration patterns, a native plugin for OpenCode and a CLI-output wrapper for the input-hook-only runtimes, behind one fail-open seam.

### Added

- [P] Author the Phase 017 planning documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- [P] Define the per-runtime feasibility matrix assigning each of the six runtimes (Claude Code, Codex, Devin, Cursor, Pi, OpenCode) exactly one integration pattern and a go/no-go verdict (REQ-001, REQ-006)
- [P] Mandate the enablement-gate placement rule: every activation path and seam entry calls `isProjectionEnabled()` before projecting (REQ-002)
- [P] Contract the fail-open exact-original fallback at the seam (REQ-003)
- [P] Preserve canonical bytes with retained originals for exact restore (REQ-004)
- [P] Gate hosted routing behind per-runtime capability and privacy pre-checks (REQ-005)
- [P] Record the proposed integration-pattern and fail-open seam contract decisions (decision-record.md ADR-001, ADR-002)

### Changed

None (planning only)

### Fixed

None (planning only)

### Verification

Packet validator on this phase folder: validate.sh --strict PASSED, Errors 0 / Warnings 0 (planned packet, no implementation yet).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Implementation is pending: the phase records the feasibility matrix and seam contract as a design foundation, and no runtime adapter is wired.
- Dependencies and blockers: the validated Phase 016 default-off enablement gate, prior runtime-adapter evidence from Phase 001 and Phase 006, the OpenCode `chat.message` hook surface, and the Pi `turn_end` hook surface.
- The OpenCode `chat.message` display caveat must be validated before the native pattern is finalized; a failed probe re-assigns OpenCode.
- The Pi `turn_end` mutation must be validated or Pi routes to the CLI-output wrapper with the reason recorded.
- Builds on the predecessor Phase 016 `016-default-off-and-advisor-exclusion`.
