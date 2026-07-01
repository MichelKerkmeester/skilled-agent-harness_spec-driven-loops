---
title: "Implementation Plan: Edge-Confidence Differentiation and Seeded-PPR Revisit"
description: "Reuse an existing discarded resolution-quality signal to give CALLS edges real confidence, recover the deleted PPR module from git, re-benchmark unmodified, record an honest verdict."
trigger_phrases:
  - "edge confidence differentiation plan"
  - "seeded ppr revisit plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted the implementation plan"
    next_safe_action: "Dispatch the confidence-differentiation implementation"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-010-edge-confidence-ppr-revisit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: Edge-Confidence Differentiation and Seeded-PPR Revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Code-graph MCP server (`.opencode/skills/system-code-graph/mcp_server/`) |
| **Storage** | SQLite (code-graph DB) |
| **Testing** | Vitest |
| **Executor** | `opencode run --model openai/gpt-5.5-fast --variant high` |
| **Isolation** | git worktree `028-deep-research-wt`, cut from HEAD `aca0f7eb8b` |

### Overview
Give CALLS edges a real confidence gradient by writing an already-computed but currently-discarded resolution-quality signal to edge metadata, gated behind a new default-off flag. Recover the deleted seeded-PPR module from git history and re-wire it to consume the new weights. Re-run the existing benchmark harness unmodified and record an honest verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause of uniform confidence confirmed (wiring gap in `cross-file-edge-resolver.ts`, not a parser limitation)
- [x] Deleted PPR module's commit hashes verified real (`657a0f6a3e`, `277c35344c`)
- [x] Original benchmark harness confirmed self-contained and reusable unmodified

### Definition of Done
- [ ] Existing test suite green with new flag OFF (regression proof)
- [ ] New tests for the confidence-differentiation logic
- [ ] Re-benchmark run to completion, verdict recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential dependency chain: differentiate -> verify no regression -> recover PPR -> re-benchmark -> verdict. Not parallelizable, each step depends on the last.

### Key Components
- **Confidence writer**: `cross-file-edge-resolver.ts` already classifies `resolved`/`ambiguousSkipped`/`unresolved` per edge; this phase makes it WRITE that classification to edge metadata instead of only updating `target_id`.
- **In-file candidate check**: `structural-indexer.ts`'s CALLS edge creation gets a same-name candidate-count check for same-file calls.
- **Recovered PPR module**: `computeBoundedPersonalizedPageRank`, `collectSeededPprImpactRanking`, `SEEDED_PPR_*` constants, `contextEdgeTransitionWeight` -- recovered via `git show 277c35344c^:<path>` into `code-graph-context.ts`.

### Data Flow
CALLS/IMPORTS edge creation -> confidence/evidenceClass written to metadata (gated) -> `contextEdgeReliability` blend consumes real gradient -> PPR transition weights differentiate -> re-benchmark measures the effect.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `code-graph-context.ts` `contextEdgeReliability` | Already live, unconditional, blends confidence x evidenceClassFactor | No change to the blend itself; its INPUT stops being a constant once the flag is on | Existing test suite green with flag OFF proves zero change to current behavior |
| `cross-file-edge-resolver.ts` `resolveCrossFileCallEdges` | Computes resolution quality, only writes `target_id` today | Add a metadata write for `resolved`/`ambiguousSkipped` cases, gated | Re-run resolver with flag on, confirm metadata reflects real classification |
| `structural-indexer.ts` CALLS edge creation | Hardcodes `confidence 0.8, INFERRED` for every edge | Add same-file candidate-cardinality check | New unit test: single-candidate vs multi-candidate same-file calls get different confidence |

Required inventories:
- Same-class producers: `rg -n "buildEdgeMetadata|resolvedWeights.CALLS" .opencode/skills/system-code-graph/mcp_server/lib`
- Consumers of changed symbols: `rg -n "contextEdgeReliability|EdgeEvidenceClass" .opencode/skills/system-code-graph/mcp_server --glob '*.ts'`
- Matrix axes: {same-file single candidate, same-file multi candidate, cross-file resolved, cross-file ambiguous, cross-file unresolved} x {flag on, flag off}
- Algorithm invariant: with the flag off, every CALLS edge must still get `confidence 0.8, INFERRED, heuristic` exactly as today -- byte-identical.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Worktree cut, prior fixes carried forward
- [x] This spec folder scaffolded

### Phase 2: Core Implementation
- [ ] Implement confidence differentiation behind new flag
- [ ] Regression check: existing suite green with flag off
- [ ] Recover and re-wire deleted PPR module
- [ ] Re-run re-benchmark, record verdict

### Phase 3: Verification
- [ ] Sync to live tree
- [ ] Finalize PPR doc entries in `../005-seeded-ppr-ranking/` and `009-drift-audit-deep-history-correction/` with the real verdict
- [ ] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Existing code-graph test suite, flag off | Vitest |
| Unit | New confidence-differentiation logic | Vitest, new test file |
| Benchmark | Re-run `seeded-ppr-impact-benchmark.mjs` unmodified | Node script, real graph data |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `009-drift-audit-deep-history-correction` | Internal (parallel) | In progress | Independent; that pass's PPR forward-pointer gets finalized once this completes |
| OpenAI `openai/gpt-5.5-fast` provider | External | Configured | Dispatch cannot run if it drops |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression suite fails with flag off, or recovered PPR code doesn't compile cleanly.
- **Procedure**: Nothing committed until reviewed; discard the worktree or `git checkout --` specific files in the live tree. The new flag being off by default means even a partial/buggy implementation has zero blast radius on real usage until explicitly enabled.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Differentiate -> Regress -> Recover PPR -> Benchmark) --> Phase 3 (Sync + Finalize docs + Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Minutes |
| Confidence differentiation + regression | Medium | One GPT-5.5-fast dispatch, ~10-20 min, monitored every ~2 min |
| PPR recovery + re-wire | Medium | One GPT-5.5-fast dispatch, ~10-20 min, monitored every ~2 min |
| Re-benchmark | Low-Medium | Real script execution, minutes to tens of minutes depending on graph size |
| **Total** | | **~30-60 min sequential** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] New flag default-off
- [x] Worktree isolation in place
- [x] Recovery baseline commit recorded: `aca0f7eb8b`

### Rollback Procedure
1. Do not enable the new flag anywhere outside the benchmark run.
2. Discard the worktree if the implementation doesn't pan out; live tree is untouched until an explicit sync-back.

### Data Reversal
- **Has data migrations?** No -- edge metadata is additive/optional fields, not a schema migration.
- **Reversal procedure**: N/A with flag off; drop the new column/field usage if ever fully abandoned.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────┐     ┌──────────┐
│ Confidence   │────►│ Regression check  │────►│ Recover + rewire │────►│ Re-bench │
│ differentiation│    │ (flag off, green) │     │ PPR module       │     │ + verdict│
└──────────────┘     └───────────────────┘     └─────────────────┘     └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confidence differentiation | None | Real edge metadata (gated) | Regression check |
| Regression check | Confidence differentiation | Proof of zero behavior change | PPR recovery (must be safe first) |
| PPR recovery | Regression check passing | Re-wired PPR module | Re-benchmark |
| Re-benchmark | PPR recovery | Verdict | Doc finalization in 009/005 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confidence differentiation** - ~15 min - CRITICAL
2. **Regression check (flag off)** - ~5 min - CRITICAL
3. **PPR recovery + re-wire** - ~15 min - CRITICAL
4. **Re-benchmark** - ~10-20 min - CRITICAL

**Total Critical Path**: ~45-55 min

**Parallel Opportunities**: None within this phase (genuine sequential dependency); Stream B (009 doc corrections) runs fully in parallel as an independent effort.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Confidence differentiation shipped, gated | Regression suite green, flag off | Phase 2 start |
| M2 | PPR module recovered and re-wired | Compiles clean, unit tests pass | Phase 2 mid |
| M3 | Re-benchmark complete | Real metrics produced, verdict written | Phase 2 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADRs (reuse-discarded-signal vs build-new-resolver; recover-from-git vs rewrite-from-scratch).
