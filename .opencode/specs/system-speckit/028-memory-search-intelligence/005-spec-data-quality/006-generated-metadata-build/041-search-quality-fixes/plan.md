---
title: "Implementation Plan: Search-Quality Fixes [template:level_2/plan.md]"
description: "Land the six 029 deep-research fixes in dependency order, smallest blast radius first, each behavioral change reversible. The keystone bridges the dead evidence-gap cap, the other five tighten a benchmark metric, telemetry honesty, a row score, deterministic ranking behind a default-off flag, and the presentation contract. Each MCP change is host-verified with its focused vitest, then dist is rebuilt and the daemon recycled so a fast-subset re-run exercises the live fixes."
trigger_phrases:
  - "search quality fixes plan"
  - "evidence gap cap bridge"
  - "deterministic ranking flag"
  - "029 findings remediation plan"
  - "memory search fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/041-search-quality-fixes"
    last_updated_at: "2026-07-04T17:11:55.938Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the fix plan from the 029 deep-research"
    next_safe_action: "Land fix 1 and fix 3 together in memory-search.ts"
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
# Implementation Plan: Search-Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server, Node ESM benchmark script |
| **Framework** | Spec Kit Memory MCP search pipeline, vitest, `opencode run --command memory/search` for the re-run |
| **Storage** | No schema change, additive envelope fields and one new feature flag |
| **Testing** | Focused vitests per fix, full mcp_server suite for regression, a fast-subset benchmark re-run for the keystone proof |

### Overview
Land the six fixes the 029 deep-research surfaced, in dependency order, smallest blast radius first, keeping each behavioral change reversible. The keystone (Fix 1) bridges `pipelineResult.metadata.stage4.evidenceGapDetected` into `extraData.evidenceGap` so the graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap finally fires live. The keystone and the telemetry fix (Fix 3) share `memory-search.ts` and land together. Each MCP-code change is host-verified with its focused vitest, then the dist is rebuilt and the daemon recycled so the fast-subset re-run exercises the live fixes. The determinism change (Fix 5) ships behind a new default-off flag so default ranking stays byte-identical until a recall benchmark earns the flip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (focused vitests, no new mock failures)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Six small cited changes across the live search pipeline, each scoped to one surface and each additive or flag-gated. The keystone is a one-field bridge in the handler, the telemetry and row-score fixes are additive envelope writes, the determinism change is gated behind a new flag, and the benchmark and presentation changes touch eval and rendering only. Nothing changes the retrieval algorithm by default.

### Key Components
- **`memory-search.ts`**: bridges `stage4.evidenceGapDetected` into `extraData.evidenceGap` (Fix 1) so the verdict cap reads the boolean it was written against, and adds a separate `retrievalProfileWeightsEnabled` status sourced from the hybrid profile-weight gate (Fix 3) so `intent.weightsApplied` stops being overloaded.
- **`search-results.ts`**: emits the resolved row score via `resolveCompositeScore` on graph and degree rows (Fix 4), additive to `similarity`, so the row shows a number rather than a dash.
- **`search-flags.ts`, `hybrid-search.ts`, `pipeline/stage2-fusion.ts`**: the new default-off `SPECKIT_DETERMINISTIC_RANKING` flag (Fix 5) that drops the wall-clock inputs (vector decay, trigger boost, recency) from ranking and adds the trigger id final tie-break.
- **`029-vague-query-model-benchmark/scripts/extract-metrics.mjs`**: the three-tier-aware `citeCorrect` metric (Fix 2), replacing the binary check with valid-set membership.
- **`search_presentation.txt`**: the presentation contract (Fix 6) so the rendered count equals the rows shown and a long path renders its leaf title.

### Data Flow
Stage 4 of the pipeline writes the evidence-gap signal into pipeline metadata. The handler now bridges that boolean into `extraData` where the graduated cap reads it, so a gap-detecting search caps `good` to `weak` before the envelope is rendered. The benchmark re-run dispatches bare queries through the live rebuilt dist, the parser reads the verdicts and scores the three-tier `citeCorrect`, and the dashboard review confirms the verdict and banner now agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is a bug-fix pass from a deep-research plan, so the addendum applies. The keystone touches the live verdict path and Fix 5 touches the production ranking path behind a flag, the rest are additive.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-search.ts` handler verdict path | Where the verdict cap should fire | bridge `evidenceGap` into `extraData` | smoke: off-corpus query returns `weak`+banner, the `good`-beside-banner contradiction is gone |
| `recovery-payload.ts` classification | The blast radius of the bridged boolean | read-only verify | `classifyStatus` returns `partial` only on a true gap, non-gaps fall through unchanged |
| production ranking path | The order of search results | flag-gated change, default-off | 163 ranking tests byte-identical with the flag off |
| envelope fields (`retrievalProfileWeightsEnabled`, row `score`) | Public envelope surface | additive writes | tsc clean, 55/55 formatter tests plus the new graph-row assertion |
| `029` benchmark metric and `search_presentation.txt` | Eval and rendering | change scoring and contract only | re-extract `citeCorrect` near 1.0, contract renders `shown of total` plus leaf title |

Required inventories:
- Same-class producers: the four other 029-finding fixes share the search pipeline, each scoped to one surface above.
- Consumers of changed symbols: `extraData.evidenceGap` is consumed by the graduated verdict cap, `retrievalProfileWeightsEnabled` and row `score` are read by envelope consumers, the new flag is read only by the ranking path.
- Matrix axes: six fixes across five source files, one benchmark script, one presentation asset.
- Algorithm invariant: default ranking stays byte-identical with the determinism flag off, and the verdict cap only ever lowers a verdict on a detected gap, never raises one.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Keystone and Telemetry
- [x] Fix 1 in `memory-search.ts`: add `evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected` to `extraData` so the graduated cap fires
- [x] Verify the recovery-classification side effect: `recovery-payload.ts` returns `partial` only on a true gap, non-gaps unchanged
- [x] Fix 3 in `memory-search.ts`: add a separate `retrievalProfileWeightsEnabled` status from `isRetrievalProfileWeightsEnabled()`, leave `intent.weightsApplied` intact

### Phase 2: Additive and Gated Fixes
- [x] Fix 4 in `search-results.ts`: emit the resolved row `score` via `resolveCompositeScore` on graph and degree rows, additive to `similarity`
- [x] Fix 5 behind the new default-off `SPECKIT_DETERMINISTIC_RANKING` flag: gate the wall-clock inputs and add the trigger id tie-break
- [x] Fix 2 in `extract-metrics.mjs`: replace the binary `citeExpected` with three-tier valid-set membership
- [x] Fix 6 in `search_presentation.txt`: render the count as `shown of total` and render the leaf title for long paths

### Phase 3: Verification
- [x] Run the focused vitests for each touched suite, confirm no new mock failures
- [x] Rebuild dist with `npm run build` and recycle the daemon so the re-run exercises the live fixes
- [x] Fast-subset benchmark re-run: confirm Fix 1 caps off-corpus to weak or gap with banner and verdict in agreement, and `citeCorrect` reads honest
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each fix passes its focused vitest: scoring-hardening, deterministic-ranking-flag, handler-memory-search, provenance-envelope, search-results-format | direct vitest invocation per suite |
| Integration | The fast-subset re-run dispatches bare queries through the rebuilt dist and the parser scores the three-tier `citeCorrect` | `opencode run --command memory/search` over the 029 harness, then `extract-metrics.mjs` |
| Manual | Dashboard review confirms the `good`-beside-banner contradiction is gone and off-corpus rows cap to weak or gap | reading the re-run verdicts and the dashboard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` flag | Internal | Green | The keystone has nothing to activate without the graduated cap |
| The 029 benchmark harness and config | Internal | Green | The keystone proof needs the fast-subset re-run |
| `npm run build` and the daemon recycle | Internal | Green | The re-run would exercise stale dist without a rebuild |
| The three open-source provider plans for the re-run | External | Green | A missing model drops a row from the fast-subset matrix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix regresses search behavior or the keystone proof fails to reproduce.
- **Procedure**: Revert the per-fix change. Fix 5 is reversible by leaving `SPECKIT_DETERMINISTIC_RANKING` unset, which it is by default. The keystone and telemetry edits are small handler diffs, the row-score and presentation changes are additive, so each fix reverts independently.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Keystone + Telemetry) ──► Phase 2 (Additive + Gated) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Keystone + Telemetry | None | Additive + Gated |
| Additive + Gated | Keystone + Telemetry | Verify |
| Verify | Additive + Gated | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Keystone + Telemetry | Med | 1-2 hours |
| Additive + Gated | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Focused vitests pass for every touched suite
- [x] Default ranking confirmed byte-identical with the determinism flag off
- [x] dist rebuilt and daemon recycled before the keystone proof re-run

### Rollback Procedure
1. Leave `SPECKIT_DETERMINISTIC_RANKING` unset to disable Fix 5 ranking behavior
2. Revert the per-fix handler, formatter, benchmark and presentation diffs as needed
3. Rebuild dist and recycle the daemon to drop the reverted code

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, no schema change and no persisted state, the fixes are additive envelope fields, a flag-gated ranking branch, and eval or rendering changes
<!-- /ANCHOR:enhanced-rollback -->

---
