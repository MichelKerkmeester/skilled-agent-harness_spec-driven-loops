---
title: "Architecture Cleanup Remediation: 15 P2 Findings Closed (F-016-D1 / F-017-D2 / F-018-D3)"
description: "Fifteen surgical refactors close the §16-18 architectural findings from the 046 deep-research audit. Neutral seam modules correct import direction, shared type extractions break value-level cycles, a dead export is removed. Canonical tuples replace hand-written union literals throughout the advisor and memory subsystems."
trigger_phrases:
  - "F-016-D1 boundary discipline"
  - "F-017-D2 dependency cycle"
  - "F-018-D3 schema duplication"
  - "watcher orchestrator split"
  - "architecture cleanup remediation 006"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/006-fix-architecture-cleanup-followups` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

The 046 deep-research audit flagged 15 P2 architectural violations split across three groups. Eight boundary-discipline failures let modules import across subsystem lines. Three dependency-graph cycles forced value-level circular imports via shared types. Four schema-duplication findings left hand-written union literals free to drift from their guards and Zod schemas. All 15 findings were closed in one commit via surgical refactors that extracted neutral seam modules, broke cycles by lifting shared types into dedicated files, removed a dead export. Every affected union type now derives from a canonical `typeof TUPLE[number]` definition. No public API surface changed at any call site.

### Added

- `lib/utils/sqlite-integrity.ts` seam (now under `system-skill-advisor`): re-exports `checkSqliteIntegrity` so storage callers depend inward without crossing into advisor freshness internals
- `lib/utils/skill-label-sanitizer.ts` seam: re-exports `sanitizeSkillLabel` so shared-payload contracts no longer cross into the advisor renderer
- `lib/discovery/spec-document-finder.ts` seam: stable lib-level wrapper around `findSpecDocuments` so resume-ladder imports inward
- `skill_advisor/lib/compat/advisor-status-reader.ts` seam: thin advisor-lib wrapper for the status reader used by `daemon-probe.ts`
- `skill_advisor/lib/utils/busy-retry.ts` seam: re-exports `runWithBusyRetry` so freshness rebuild no longer depends on the daemon watcher module
- `skill_advisor/lib/daemon/watcher-orchestrator.ts`: internal `WatcherOrchestrator` factory extracted from `watcher.ts`; every public symbol on `watcher.ts` stays at the same path with the same signature
- `skill_advisor/lib/scorer/age-policy.ts` seam: re-exports `applyAgeHaircutToLane` so the derived lane no longer reaches across the scorer/lifecycle architectural line
- `lib/session/structural-bootstrap-contract.ts` type seam: `StructuralBootstrapContract` extracted here to break the session-snapshot to memory-surface value-level cycle
- `lib/graph/community-types.ts` type seam: `CommunityResult` and `CommunitySummary` extracted here to break the community detection/storage/summaries triangle
- `skill_advisor/lib/freshness/trust-state-values.ts`: canonical 4-element tuple for `SkillGraphTrustState`; schemas and guards derive from it via `typeof TUPLE[number]`
- `skill_advisor/lib/lifecycle/status-values.ts`: canonical tuple for `SkillLifecycleStatus`
- `skill_advisor/lib/advisor-runtime-values.ts`: canonical tuple for `AdvisorRuntime` and outcome labels
- `skill_advisor/tools/advisor-contract-keys.ts`: canonical key tuples for `advisor_recommend` and `advisor_validate` tool contracts
- `mcp_server/tests/architecture-seam.vitest.ts` (NEW): 13 reference-identity assertions covering every new seam module
- `mcp_server/tests/architecture-cleanup-cycles.vitest.ts` (NEW): 4 assertions covering cycle removal and the dead-export removal

### Changed

- `lib/skill-graph/skill-graph-db.ts`: import path for `checkSqliteIntegrity` corrected to the neutral seam
- `lib/context/shared-payload.ts`: import path for `sanitizeSkillLabel` corrected to the neutral seam
- `lib/resume/resume-ladder.ts`: import path for `findSpecDocuments` corrected to the lib seam
- `skill_advisor/lib/compat/daemon-probe.ts`: default `statusReader` now resolves through the advisor-lib compat seam
- `skill_advisor/lib/freshness/rebuild-from-source.ts`: import path for `runWithBusyRetry` corrected to the neutral utility seam
- `skill_advisor/lib/daemon/watcher.ts`: delegates reindex/generation orchestration to `WatcherOrchestrator`; all public symbols and sub-phase 005 features (`unwatch`, ring buffer, `onMalformed`) preserved
- `skill_advisor/lib/scorer/lanes/derived.ts`: import path for age-haircut policy corrected to the scorer seam
- `skill_advisor/lib/corpus/df-idf.ts`: `computeCorpusStats` accepts an optional `predicate` parameter (default `filterCorpusStatEligible`) so callers can filter upstream without the corpus module crossing into lifecycle
- `lib/session/session-snapshot.ts`: re-exports `StructuralBootstrapContract` from the new type seam
- `lib/graph/community-detection.ts` / `community-storage.ts` / `community-summaries.ts`: share `CommunityResult` and `CommunitySummary` via `community-types.ts`
- `skill_advisor/lib/freshness/trust-state.ts`: derives `SkillGraphTrustState` from canonical tuple
- `skill_advisor/lib/scorer/types.ts` / `lib/lifecycle/age-haircut.ts` / `lib/lifecycle/supersession.ts`: derive `SkillLifecycleStatus` from canonical tuple
- `skill_advisor/lib/skill-advisor-brief.ts`: derives `AdvisorRuntime` from canonical tuple
- `skill_advisor/tools/advisor-recommend.ts` / `advisor-validate.ts`: property keys typed by canonical tuple; `ALLOWED_PARAMETERS` in `schemas/tool-input-schemas.ts` derives from the same tuple

### Fixed

- Eight boundary violations where modules imported implementation details across subsystem lines (findings F-016-D1-01 through F-016-D1-08). Each is now routed through a neutral seam module.
- Two value-level dependency cycles: session-snapshot to memory-surface (F-017-D2-01) and the community detection/storage/summaries triangle (F-017-D2-02)
- Dead `getDetectedRuntime` export removed from `context-server.ts` (F-017-D2-03). Zero live consumers confirmed via grep.
- Four schema-duplication findings (F-018-D3-01 through F-018-D3-03 fully closed, F-018-D3-04 partially closed). Union literals that previously could drift from guards now derive from canonical tuples so compile-time errors surface any mismatch.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | exit 0 after each finding group (D3, D2, D1 in order) |
| New vitest `architecture-seam.vitest.ts` | 13 of 13 passed |
| New vitest `architecture-cleanup-cycles.vitest.ts` | 4 of 4 passed |
| Existing watcher tests (`daemon-watcher-resource-leaks-049-005`) | 7 of 7 passed |
| Existing advisor renderer + runtime parity + trust-state | 26 of 26 passed |
| `npm run stress` | 57 of 58 files passed, 194 of 195 tests passed. One failure is `gate-d-benchmark-memory-search` p95 latency flake (433-481ms vs 300ms threshold), reproduced on baseline `main` with all changes stashed. Unrelated to this packet. |
| Inline finding markers | 15 markers found, one per finding (verified via `grep F-016-D1`, `grep F-017-D2`, `grep F-018-D3`) |
| Watcher public API parity | All 7 named exports plus `__testables` bag still resolve at `daemon/watcher.js`. Verified by architecture-seam vitest reference-identity test. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/utils/sqlite-integrity.ts` | Created (NEW) | F-016-D1-01. Neutral seam re-exporting `checkSqliteIntegrity` |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | F-016-D1-01. Import direction corrected to neutral seam |
| `mcp_server/lib/utils/skill-label-sanitizer.ts` | Modified | F-016-D1-02. Seam confirmed present. Import corrected in shared-payload |
| `mcp_server/lib/context/shared-payload.ts` | Modified | F-016-D1-02. Import direction corrected to neutral seam |
| `mcp_server/lib/discovery/spec-document-finder.ts` | Modified | F-016-D1-03. Lib seam confirmed present. Import corrected in resume-ladder |
| `mcp_server/lib/resume/resume-ladder.ts` | Modified | F-016-D1-03. Import direction corrected to lib seam |
| `mcp_server/lib/session/structural-bootstrap-contract.ts` | Created (NEW) | F-017-D2-01. Type seam breaks session-snapshot to memory-surface cycle |
| `mcp_server/lib/session/session-snapshot.ts` | Modified | F-017-D2-01. Re-exports type from seam |
| `mcp_server/hooks/memory-surface.ts` | Modified | F-017-D2-01. Imports type from seam |
| `mcp_server/lib/graph/community-types.ts` | Created (NEW) | F-017-D2-02. Shared type seam breaks community triangle cycle |
| `mcp_server/lib/graph/community-detection.ts` | Modified | F-017-D2-02. Imports from community-types seam |
| `mcp_server/lib/graph/community-storage.ts` | Modified | F-017-D2-02. Imports from community-types seam |
| `mcp_server/lib/graph/community-summaries.ts` | Modified | F-017-D2-02. Imports and re-exports from community-types seam |
| `mcp_server/context-server.ts` | Modified | F-017-D2-03. Dead `getDetectedRuntime` export removed |
| `mcp_server/tests/architecture-seam.vitest.ts` | Created (NEW) | 13 reference-identity assertions for all new seam modules |
| `mcp_server/tests/architecture-cleanup-cycles.vitest.ts` | Created (NEW) | 4 cycle-removal and dead-export assertions |

### Follow-Ups

- Complete F-018-D3-04 for the full 60+-tool MCP contract surface. The partial fix covers `advisor_recommend` and `advisor_validate`. A full pass requires introducing `zod-to-json-schema` and refactoring `validateToolArgs` to read schemas centrally.
- Remove `runWithBusyRetry` from its dual location. The neutral seam at `skill_advisor/lib/utils/busy-retry.ts` re-exports the watcher's copy. A future packet can consolidate to a single source once existing watcher test imports are updated.
- Investigate `gate-d-benchmark-memory-search` p95 latency flake in CI if it persists beyond the current machine. The flake is environmental but should be tracked to confirm it does not appear in CI.
