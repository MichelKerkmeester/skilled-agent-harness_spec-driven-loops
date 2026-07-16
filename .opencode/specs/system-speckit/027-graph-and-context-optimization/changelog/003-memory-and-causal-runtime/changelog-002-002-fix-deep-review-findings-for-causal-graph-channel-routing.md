---
title: "Causal Graph Channel Routing: 002 Deep-Review Remediation"
description: "Closed all 3 P1 and 39 P2 findings from the 2026-05-11 deep review of 001-deliver-causal-graph-channel-routing-mvp. Cache invalidation wired into both commit paths, env-flag parsing tightened, reliability and observability polish shipped across entity-density.ts and query-router.ts, all traceability docs reconciled."
trigger_phrases:
  - "causal graph channel routing deep review remediation"
  - "entity-density cache invalidation wiring"
  - "P1-C-001 invalidateEntityDensityCache commit hooks"
  - "012 P1 P2 findings closed"
  - "query-router env-flag tightening ADV-001"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-11

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing`

### Summary

The 2026-05-11 deep review of `001-deliver-causal-graph-channel-routing-mvp` returned a CONDITIONAL verdict with 0 P0, 3 P1, 39 P2 findings. Two release blockers were outstanding: `invalidateEntityDensityCache()` was exported but never called from `memory_save` or `memory_bulk_delete` commit paths, leaving entity-density scores stale for up to 60 seconds after row mutations. The 001 resource-map also pointed to a non-existent playbook path.

Tier 1 wired the cache-invalidation call into both commit paths and added an integration test proving post-delete scores refresh without waiting for TTL. The resource-map was corrected and three missing rows were added. Tier 2 shipped reliability, observability, defensive, test-maintenance polish across `entity-density.ts`, `query-router.ts`, `routing-telemetry.ts`, `memory-crud-health.ts`. The doc and metadata passes reconciled the 001 packet with the shipped implementation. All 42 findings closed with file-line evidence.

### Added

- Integration test `tests/integration/entity-density-commit-hooks.vitest.ts` verifying post-commit cache invalidation for both `memory_save` and `memory_bulk_delete` paths (P1-C-001)
- Shared test helpers `tests/__helpers__/test-env.ts` with `setEnv`, `restoreEnv`, `withFeatureFlag` utilities extracted from `query-router.vitest.ts` and `routing-telemetry-stress.vitest.ts` (P2-022, P2-023)
- New `entity-density.vitest.ts` test `012-ED-3.3` for rebuild-after-success-failure scenario (P2-C-002)
- New vitest cases at `query-router.vitest.ts:542` covering `"0"`, `"no"`, `"off"`, `""` as DISABLED env-flag values (ADV-001, REQ-T2-003)

### Changed

- `memory-save.ts`: calls `invalidateEntityDensityCache()` after each successful single-row commit so entity-density scoring reflects the new state without waiting for the 60-second TTL (P1-C-001)
- `memory-bulk-delete.ts`: calls `invalidateEntityDensityCache()` after each successful bulk-delete commit, including partial-success cases (P1-C-001)
- `entity-density.ts`: error path now preserves prior cache state on transient rebuild failures. Concurrency invariant, size bound, `HighDegreeRow` cast comment documented. `parseTriggerPhrases` and `invalidateEntityDensityCache` JSDoc added (P2-008, P2-010, P2-011, P2-021, P2-C-001, ADV-003, F10-004, S7-001)
- `query-router.ts`: pre-computed intent passed into `shouldPreserveBm25` and `shouldPreserveGraph` to remove redundant `classifyIntent` calls. `shouldPreserveGraph` flag self-gate added. JSDoc on three exports. Module header refreshed. Env-flag parsing tightened to reject `"0"`, `"no"`, `"off"`, `""`. `bm25-preserved-by-intent` label added. `routingReasons` clamped to 120 characters. `safeGetDb` per-class warn-once via `Set<string>` (P1-001, P2-003, P2-009, P2-012, P2-013, P2-017, P2-018, P2-019, P2-020, ADV-001)
- `routing-telemetry.ts`: `ChannelName` duplication documented with a source-of-truth comment. Rolling-window doc rename applied. Redundant `Set` dedup removed. `getSnapshot` JSDoc added (P2-001, P2-002, P2-017, F10-005)
- `memory-crud-health.ts`: `getRoutingTelemetrySnapshot` call wrapped in try/catch with a zero-value fallback that includes error class and message clamped to 160 characters (P2-004)

### Fixed

- `001-deliver-causal-graph-channel-routing-mvp/resource-map.md`: playbook path corrected from `210-graph-channel-utilization` to `272-routing-telemetry-and-graph-channel-invocation.md` (P1-002). Changelog row resolved (P1-003). Three missing rows added for `routing-telemetry-stress.vitest.ts`, `scratch/live-smoke-results.md`, `scratch/stress-test-results.md` (P2-015, P2-TR-002). Summary counts corrected from Skills 8/9 and total 18/19 to accurate values (P2-TR-005)
- `001-deliver-causal-graph-channel-routing-mvp/implementation-summary.md`: test-count inconsistency resolved to 95 canonical tests. Q2 rate-band answer expanded to a full paragraph (P2-TR-001, P2-TR-006)
- Doc-staleness in `001-deliver-causal-graph-channel-routing-mvp/`: `spec.md` status updated. `plan.md` DoD checkboxes ticked. `handover.md` completion set to 100. `scratch/live-smoke-results.md` line reference corrected from 167-189 to 183-205. `checklist.md` CHK-051 and CHK-052 evidence updated (F10-001, F10-002, F10-003, P2-TR-003, P2-TR-007)

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `tsc --noEmit` | PASS | exit 0 |
| query-router + entity-density + telemetry-stress + integration tests | PASS | 91 tests across 4 files |
| `validate.sh --strict` 002 packet | PASS | exit 0 after T4 fixes |
| T1.3 integration test | PASS | 2 tests in `tests/integration/entity-density-commit-hooks.vitest.ts` |
| T2a.2 entity-density rebuild test | PASS | new test `012-ED-3.3` |
| T2a.5 env-flag parsing tests | PASS | new tests at `query-router.vitest.ts:542` |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Post-commit branch calls `invalidateEntityDensityCache()` (P1-C-001) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Post-commit branch calls `invalidateEntityDensityCache()` (P1-C-001) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | Error-path cache preservation. Concurrency and size-bound comments. JSDoc on exported helpers |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Pre-computed intent dedup. Flag self-gate. JSDoc. Env-flag tightening. routingReasons clamp. warn-once for safeGetDb |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts` | ChannelName source-of-truth comment. Rolling-window rename. Redundant Set removed. getSnapshot JSDoc |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | try/catch with zero-value fallback around `getRoutingTelemetrySnapshot` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` (NEW) | Two e2e tests for bulk-delete wiring and one unit test for memory-save wiring symmetry |
| `.opencode/skills/system-spec-kit/mcp_server/tests/__helpers__/test-env.ts` (NEW) | Shared `setEnv`, `restoreEnv`, `withFeatureFlag` test helpers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/entity-density.vitest.ts` | New test `012-ED-3.3` for rebuild-after-success-failure scenario |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts` | Env-flag constant deduped. `withFeatureFlag` wired. New tests for disabled-value parsing |
| `.opencode/skills/system-spec-kit/mcp_server/tests/routing-telemetry-stress.vitest.ts` | Refactored to use shared `setEnv`/`restoreEnv` helpers |

### Follow-Ups

None.
