---
title: "Changelog: Ranking Filter Bypass and Score Scale Fixes [016/007-ranking-filter-bypass-and-score-scale-fixes]"
description: "Closed the side doors where trigger-promoted and rescue-injected rows skipped the ranking gates, unified the mismatched score scales and fixed a circular-import crash that would have taken down the daemon on restart."
trigger_phrases:
  - "ranking filter bypass changelog"
  - "score scale unification"
  - "db-state circular import crash fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

Rows can no longer sneak into ranking through a side door and scores are on one scale. Trigger-lane promoted rows and rescue-injected rows used to be appended after the gate battery, so they skipped the tenant, tier, context and quality checks every other row passes. Both now hard-gate on scope and carry the residual soft penalties. The mixed score scales are unified so a real semantic match cannot be outranked by a rescue or surrogate row. Wiring the eval baseline also exposed a circular-import temporal-dead-zone bug in `db-state.ts` that would have crashed the daemon on its next restart. That was fixed too. Shipped in `ab4c46cd56`.

### Changed

- Trigger-promoted and rescue-injected rows hard-gate on scope and carry residual soft penalties on tier, context and quality.
- Score scales are unified. `toHybridResult` no longer leaks raw unbounded BM25 into `score`, the degradation-widening check reads the `rrfScore` scale, multi-concept rows get a real similarity instead of effective 0, the keyword lane stops double-counting when BM25 delegates to FTS5, adaptive fusion normalizes the trigger weight through the divisor and MPAB compresses over-1 scores instead of clamping.
- The Group-A flag read resolves per request, so flipping a search flag changes behavior without a daemon restart.
- The surrogate path was tightened so a below-threshold intent-adjacent overlap cannot pin a row above a real semantic match.

### Fixed

- The `causalBoosted:0` symptom traced to injected-row contribution accounting, so a row with real causal neighbors now gets a non-zero boost.
- The community-search fallback and the contextual tree headers surface when enabled.
- The `minState` inversion that let a default or empty state map above HOT priority is corrected.
- A circular-import temporal-dead-zone bug in `db-state.ts` was fixed by hoisting the backing store with `var`. Any import of `db-state` had thrown `Cannot access before initialization`, which would have crashed the daemon on its next restart with a rebuilt dist. `tsc` and the unit suites missed it because it only fires at real module-load time.

### Verification

- `npm run build` clean.
- 007 targeted vitest 338 of 338, 1 skipped.
- REQ review 10 of 14 on the first pass. The flag read, causal boost and surrogate pinning were remediated.
- Score-scale order preserved. The reviewer confirmed a real match outranks a rescue or keyword row.
- db-state circular-import TDZ fixed. It loads clean and would otherwise have crashed the daemon on restart.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/search/hybrid-search.ts` carries the gating and score-scale fixes.
- `mcp_server/lib/search/pipeline/orchestrator.ts` re-gates the promoted and rescued rows.
- `mcp_server/core/db-state.ts` fixes the circular-import TDZ.

### Follow-Ups

- The eval-parity before and after numbers are a daemon-side capture because the harness needs the live index.
- Ranking effects apply on the next daemon-lease restart, which now also carries the crash fix.
