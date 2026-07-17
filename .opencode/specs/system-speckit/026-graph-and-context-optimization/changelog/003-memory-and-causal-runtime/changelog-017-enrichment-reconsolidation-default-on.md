---
title: "Enrichment Default-On With Async Save Path"
description: "Flipped post-insert enrichment and quality auto-fix to default-on, added async enrichment so saves return with a deferred status and recorded post-review hardening for the background scheduler. Reconsolidation was kept opt-in after review because it can merge or deprecate rows."
trigger_phrases:
  - "post insert enrichment default on"
  - "async enrichment deferred save"
  - "quality auto fix default on"
  - "reconsolidation opt in after review"
  - "017 enrichment reconsolidation default on"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

This packet changed the save-time enrichment posture so normal saves can populate graph and entity data without blocking the save response. Post-insert enrichment and quality auto-fix now use default-on flag semantics with opt-out environment values. The enrichment bundle runs in the background by default and the response reports a deferred post-insert enrichment result.

The packet title includes reconsolidation, but the final reviewed state keeps save reconsolidation opt-in because it can merge or deprecate rows. The review report records follow-up remediation for async safety, error classification, doc drift and test gaps, then marks the conditional review verdict cleared except for a deferred backfill-failure regression test.

### Added

- `isPostInsertEnrichmentAsync()` with a default async path and a synchronous override through `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true`.
- A deferred post-insert enrichment result for the async save path.
- Async behavior coverage for deferred enrichment lanes.
- Review artifacts covering the enrichment default-on work, its safety findings and the remediation status.

### Changed

- Post-insert enrichment now defaults on and can be disabled with its opt-out environment value.
- Quality auto-fix now defaults on while retaining its opt-out behavior.
- Save reconsolidation was reverted to opt-in after review because it gates a destructive merge and deprecate path.
- Background enrichment was hardened to re-check row state, bound concurrency, reacquire the database at run time and avoid marking incomplete summary work as complete.
- Documentation was corrected for feature defaults, the full-auto caveat and public tool counts.

### Fixed

- Low causal and entity coverage from default-off post-insert enrichment on routine saves.
- Save latency risk from making enrichment default-on by moving the work to the async background path.
- Review-confirmed async hazards around superseded rows, unbounded work, stale database handles and false completion on summary failure.
- Review-confirmed E081 classification escapes and documentation overclaims.

### Verification

| Check | Result |
|-------|--------|
| Build | PASS. Implementation summary records `npm run build` clean |
| Flag tests | PASS. `search-flags.vitest.ts` updated for opt-out behavior and async override |
| Affected suites | PASS. Checklist records affected save, enrichment and reconsolidation suites green |
| Live save behavior | PASS. Checklist records default saves enriched async and recent rows reached `complete` |
| Post-review remediation | PASS. Review report records P0 0, P1 remediated and conditional verdict cleared |
| Full suite | Not claimed as fully green. Review report records two unrelated pre-existing scan-fixture failures |
| Deferred test gap | Open. Backfill-failure-mode regression test deferred as a small follow-up |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | Switched enrichment and quality auto-fix to default-on semantics, added async enrichment flag helper and kept reconsolidation opt-in after review |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Scheduled post-insert enrichment in the async background path and returned a deferred result |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | Modified | Added async background result handling and tightened summary failure behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` | Modified | Updated flag tests for default-on, opt-out and sync override behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/enrichment-async-deferred.vitest.ts` | Added | Covered deferred async enrichment behavior through the save path |
| `.opencode/skills/system-spec-kit/feature_catalog.md` | Modified | Corrected default descriptions and public tool-count claims |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented final environment behavior for enrichment, reconsolidation and async override |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on/review/review-report.md` | Added | Captured review findings, remediation status and the remaining deferred test follow-up |

### Follow-Ups

- Add the deferred backfill-failure-mode regression test noted in the review report.
- Existing docs still need re-save or pending-marker repair before they gain the new enrichment output.
- Use `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` when strict read-after-write graph freshness is required.
