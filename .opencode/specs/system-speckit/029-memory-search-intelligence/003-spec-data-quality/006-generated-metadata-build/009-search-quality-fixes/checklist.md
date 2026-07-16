---
title: "Verification Checklist: Search-Quality Fixes"
description: "Verification Date: 2026-06-23"
trigger_phrases:
  - "search quality fixes checklist"
  - "evidence gap cap verification"
  - "deterministic ranking verification"
  - "029 findings remediation checklist"
  - "memory search fix checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/009-search-quality-fixes"
    last_updated_at: "2026-07-04T17:11:55.938Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the fix QA checklist and verified each fix"
    next_safe_action: "Close the phase once strict validation exits 0"
    blockers: []
    key_files:
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/lib/search/search-flags.ts"
      - "029-vague-query-model-benchmark/scripts/extract-metrics.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-23-041-search-quality-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Search-Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The six fixes scoped from the 029 deep-research with each cause and surface named
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fix 1 lands, a gap-detecting search caps `good` to `weak` live, the `good`-beside-banner contradiction is gone
- [x] CHK-011 [P1] Recovery classification verified, `recovery-payload.ts` returns `partial` only on a true gap and non-gaps fall through unchanged
- [x] CHK-012 [P1] Fix 3 exposes `retrievalProfileWeightsEnabled` separately and `intent.weightsApplied` keeps its Stage-2 meaning
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [x] CHK-021 [P0] Fix 5 default-off keeps ranking byte-identical across 163 tests, and on, ranking drops the wall-clock inputs
- [x] CHK-022 [P1] Fix 4 shows a numeric score on graph and degree rows, 55 of 55 formatter tests plus the new graph-row assertion
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships six cited fixes, so the completeness bar is each fix landing with verification and no new regression.

- [x] CHK-FIX-001 [P0] Fix 1 keystone bridges `stage4.evidenceGapDetected` into `extraData.evidenceGap` and the graduated cap fires live
- [x] CHK-FIX-002 [P0] Fix 5 ships behind the default-off `SPECKIT_DETERMINISTIC_RANKING` flag and leaves default ranking byte-identical when off
- [x] CHK-FIX-003 [P1] Fix 2 scores `cite_with_caveat` correct and the re-extracted `citeCorrect` rate returns near 1.0 across the open-source models
- [x] CHK-FIX-004 [P1] Fix 6 renders the count as `shown of total` and renders the leaf title for long paths
- [x] CHK-FIX-005 [P1] The fast-subset re-run shows 6 of 6 off-corpus cells capped to weak or gap and 0 `good`-beside-banner contradictions, down from 19 of 144
- [x] CHK-FIX-006 [P1] dist rebuilt and the daemon recycled so the re-run exercises the live fixes, not stale dist
- [x] CHK-FIX-007 [P2] The aligned one-word `graph` cap recorded as a Stage-4 threshold tuning question for a later packet, not a wiring bug
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No fix widens the trust surface, the new envelope fields derive from existing internal state and the leaf title renders an already-trusted path
- [x] CHK-031 [P1] The fast-subset re-run dispatches only bare-query retrieval, which is read-only, so verification creates no memory record
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and implementation-summary synchronized, and every verification claim traces to a focused test or the re-run
- [x] CHK-041 [P2] The commit-hygiene note recorded, a concurrent session swept the code changes into pushed commit `bbb2f539f4`, left as-is
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The fixes touch named source files in the MCP server, one 029 benchmark script and one presentation asset, all in scope
- [x] CHK-051 [P1] No temp files left outside the phase results tree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 12 | 12/12 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-06-23
<!-- /ANCHOR:summary -->

---
