---
title: "002/010: Remove memory's live CocoIndex integration and repair 002 type break"
description: "Excised the vestigial CocoIndex coupling from system-spec-kit (memory) that the 001 research missed. Deleted daemon-probe, cocoindex-path, cocoindex-calibration plus three dedicated test files. Removed all ~120 consumer references across ~35 files. Repaired the cross-skill typecheck break left by phase 002. Typecheck and full vitest suite both exit 0."
trigger_phrases:
  - "remove memory cocoindex integration"
  - "deprecate cocoindex phase 010"
  - "memory coco scope gap"
  - "002 type break repair"
  - "vestigial coco telemetry removal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/010-remove-memory-coco-integration` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

The 001 research pass characterized memory's CocoIndex coupling as a narrow opt-in rerank sidecar. That characterization was wrong. Memory carried a live, first-class CocoIndex integration woven through its hot paths: a daemon-probe library, a cocoindex-path utility (`isCocoIndexAvailable`, `getCocoIndexBinaryPath`), a cocoindex-calibration overfetch telemetry module, `cocoIndexAvailable` threaded through `context-server.ts`, `session-snapshot.ts`, `memory-surface.ts`, both session-prime hooks plus `code-graph-boundary.ts`, a `cocoIndex` hint in `compact-inject.ts`, plus a coco-keyed `"vector channel unavailable, lexical-only"` warning in `memory-search.ts`. Memory's real search is an embedder-backed hybrid channel (`vector-index.ts` plus `hybrid-search.ts`). The coco coupling was vestigial post-fetch telemetry only and did not affect search results.

Phase 002 had also removed `cocoIndex` from `MergeInput` and `cocoIndexAvailable` from `StartupBriefResult` in system-code-graph but left memory's consumers referencing the deleted fields. HEAD did not typecheck before this phase.

This phase deleted three coco source modules plus three dedicated test files, then removed all remaining consumer references across approximately 35 files. A follow-up commit the same day scrubbed stale coco and rerank doc references from SKILL.md, embedder architecture docs, plus matrix-runner templates. Both commits landed in a single calendar day. Typecheck now exits 0. The full vitest suite passes. A repo-wide coco grep (excluding specs and changelogs) returns zero.

### Added

- None.

### Changed

- `search-decision-envelope.ts`: removed `cocoindexCalibration`, `cocoIndex` plus `CocoIndexCalibrationEnvelopeTelemetry` fields from the envelope type and builder
- `context-server.ts`: removed `cocoIndexAvailable` field and the `"CocoIndex: ..."` hint from the startup brief
- `session-snapshot.ts`: removed `cocoIndexAvailable` field and the `isCocoIndexAvailable()` call
- `compact-inject.ts`: removed the `cocoIndex` const and its `MergeInput` field
- `memory-search.ts`: removed the daemon-probe call, calibration telemetry, plus the coco-keyed vector-channel warning
- `shared-daemon-runner-helpers.vitest.ts`: updated fixture shape to remove coco fields

### Fixed

- Typecheck failure introduced by phase 002: memory's consumers referenced `cocoIndex` and `cocoIndexAvailable` fields that phase 002 had already removed from code-graph's exported types. Repair removes the fields from memory's literals and types rather than re-adding them to code-graph.
- Misleading `"vector channel unavailable, lexical-only"` warning was keyed off the coco daemon, not the real embedder-backed vector channel. Removed.

### Verification

- `npm run typecheck`: exit 0. Repairs the phase 002 cross-skill break.
- Vitest coco-adjacent suite (14 files, 201 tests): all passed, 0 failed.
- Repo-wide coco grep (`rg -i cocoindex` in system-spec-kit excluding changelog and dist): 0 matches.
- Strict packet validation (`validate.sh --strict`): evidence not available in source files. Manual verification required.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/lib/cocoindex/daemon-probe.ts` (DELETED) | Deleted. Coco daemon availability probe, 173 lines removed. |
| `mcp_server/lib/utils/cocoindex-path.ts` (DELETED) | Deleted. `isCocoIndexAvailable`, `getCocoIndexBinaryPath` utilities, 65 lines removed. |
| `mcp_server/lib/search/cocoindex-calibration.ts` (DELETED) | Deleted. Post-fetch overfetch telemetry, 155 lines removed. |
| `mcp_server/tests/cocoindex-daemon-probe.vitest.ts` (DELETED) | Deleted. Coco-dedicated probe test, 62 lines removed. |
| `mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts` (DELETED) | Deleted. Coco-dedicated calibration stress test, 51 lines removed. |
| `mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` (DELETED) | Deleted. Coco-dedicated telemetry stress test, 117 lines removed. |
| `mcp_server/handlers/memory-search.ts` | Removed daemon-probe call, calibration telemetry, coco-keyed vector warning. 48 lines removed. |
| `mcp_server/handlers/session-resume.ts` | Removed coco status section. 51 lines reduced to minimal form. |
| `mcp_server/handlers/memory-crud-health.ts` | Removed coco health checks. 14 lines removed. |
| `mcp_server/lib/search/search-decision-envelope.ts` | Removed `cocoindexCalibration`, `cocoIndex`, `CocoIndexCalibrationEnvelopeTelemetry`. 36 lines removed. |
| `mcp_server/lib/session/session-snapshot.ts` | Removed `cocoIndexAvailable` field and `isCocoIndexAvailable()` call. 12 lines removed. |
| `mcp_server/hooks/claude/compact-inject.ts` | Removed `cocoIndex` const and `MergeInput` field. |
| `mcp_server/context-server.ts` | Removed `cocoIndexAvailable` field and CocoIndex hint text. |
| `shared/code-graph-contracts.ts` | Removed residual coco contract field. |
| `shared/compact-merger.ts` | Removed coco field from merger contract. |
| `mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Updated fixture shape. Coco fields dropped. |

### Follow-Ups

- Add a correctly keyed vector-availability warning tied to the embedder channel rather than the removed coco daemon. The coco-keyed warning was removed but no replacement was added (out of scope per spec).
- Record `implementation-summary.md` for this packet. The packet shipped but has no continuity document.
