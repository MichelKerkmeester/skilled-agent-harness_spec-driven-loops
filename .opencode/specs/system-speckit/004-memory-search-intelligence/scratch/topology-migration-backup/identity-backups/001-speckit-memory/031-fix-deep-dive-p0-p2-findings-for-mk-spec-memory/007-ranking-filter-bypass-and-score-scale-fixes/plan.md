---
title: "Implementation Plan: Phase 007 - Ranking Filter Bypass and Score Scale Fixes"
description: "Four-cluster fix plan for the mk-spec-memory ranking layer: Group-A flag plumbing root cause, filter-bypass battery, score-scale battery, and gate fixes, measured as before/after eval-delta on the 006 parity harness."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale fixes"
  - "flag read root cause"
  - "filter bypass battery plan"
  - "score scale battery plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T17:51:13.944Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Capture baselines, then run the confirm-before-fix pass on 🟡 findings"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-007-ranking-filter-bypass-and-score-scale-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 007 - Ranking Filter Bypass and Score Scale Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), spec-kit memory MCP server under `.opencode/skills/system-spec-kit/mcp_server/` |
| **Framework** | MCP tool handlers over a staged retrieval pipeline (stage1 candidate-gen, stage2 fusion, stage4 filter, rescue, validation) |
| **Storage** | better-sqlite3 plus sqlite-vec shards (read paths only; no schema changes in this phase) |
| **Testing** | vitest unit/integration suites plus the phase 006 eval-parity harness (fixed query set, prod-mode completeRecall@3) |

### Overview

This phase executes four fix clusters against the search pipeline: Group-A flag plumbing first (so later fixes are observable), then the filter-bypass battery, the score-scale battery, and the gate fixes. Every agent-verified finding gets a confirm-before-fix verification pass, and every ranking-order change is measured as a before/after delta on the 006 parity harness against a captured baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md sections 2-3)
- [ ] Success criteria measurable (spec.md section 5; eval-delta plus adversarial tests)
- [ ] Dependencies identified (006 harness landed or cluster 3 explicitly deferred behind it)
- [ ] Baseline captured: vitest whole-gate numbers plus 006-harness eval numbers, before the first code edit

### Definition of Done
- [ ] All acceptance criteria met (spec.md REQ-001 through REQ-024 complete or user-approved deferral for P1 items)
- [ ] Adversarial regression tests passing for every fixed bypass and gate
- [ ] Group-A toggle matrix passing across all six member flag classes
- [ ] Eval-delta reported against the captured baseline; no completeRecall@3 regression
- [ ] Docs updated (spec/plan/tasks/checklist synchronized; stage2 doc notes for any intentionally retired signal)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Staged retrieval pipeline with side-entry lanes. Rows enter through stage1 candidate generation (vector, FTS, BM25, graph channels), fuse in stage2, filter in stage4, then the rescue layer and validation multiplier run last. The bugs cluster where side lanes (trigger promotion, rescue injection, community/graph injection) append rows after the main gate battery, and where per-channel scores cross scales without normalization discipline.

### Key Components

- **`lib/search/search-flags.ts` + `lib/search/search-utils.ts`**: flag resolution and cache-key construction; the Group-A root-cause site (flags read at process start or cached without flag state).
- **`lib/search/pipeline/orchestrator.ts` / `stage2-fusion.ts` / `stage4-filter.ts`**: main lane ordering, fusion normalization, state filtering; hosts the trigger-lane promotion bypass, keyword-lane double-count, non-hybrid recompute, and minState inversion.
- **`lib/search/rerank/retrieval-rescue.ts`**: default-ON rescue layer; injected rows currently bypass the gate battery.
- **`lib/search/hybrid-search.ts` / `vector-index-queries.ts`**: channel adapters; raw-BM25 leak, degradation-check scale, multi-concept similarity gap.
- **Gate modules**: `hyde.ts`, `query-router.ts`, `evidence-gap-detector.ts`, `intent-classifier.ts`, `graph-search-fn.ts`, `causal-boost.ts`, `community-detection.ts`, `community-search.ts`.
- **Scoring helpers**: `lib/scoring/mpab-aggregation.ts`, `lib/cognitive/adaptive-ranking.ts` (Agent-B items; verify-first before edit).

### Data Flow

Query -> intent classification and routing -> stage1 channel candidates -> stage2 fusion (normalization, boosts) -> stage4 state/scope filtering -> trigger-lane promotion -> rescue overlay -> validation multiplier -> envelope. Fix principle: any lane that appends rows after stage4 must re-run the same gate battery, and any score that enters fusion must already be on the fused scale.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies because this plan comes from deep-review findings touching shared policy (gate battery), scoring scale boundaries, and env/flag precedence.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `search-flags.ts` flag readers (producer/policy) | Resolve Group-A flag booleans; some read once at module load | update (per-request resolution or live-state exposure) | Toggle matrix test per flag; `rg -n 'isCausalBoostEnabled\|isContextHeadersEnabled\|COMMUNITY_SEARCH_FALLBACK\|ADAPTIVE_RANKING\|ENABLE_BM25\|GRAPH_UNIFIED' lib/` |
| `buildCacheArgs()` in `search-utils.ts` (consumer) | Builds cache keys for computed search state | update where flag state still missing from keys (T-0110 precedent) | `rg -n 'buildCacheArgs' lib/` plus cache-invalidation test on toggle |
| `stage4-filter.ts` minState mapping (policy) | Maps requested minimum state to a priority threshold | update (line 144 inversion) | Unit test matrix over empty/default/each-state inputs |
| Pipeline `orchestrator.ts` trigger-lane promotion (producer) | Appends trigger-matched rows (`promoteTriggerLaneRows`, lines 125-163) with NO re-gating today | update: HARD-gate tenant/user/agent scope (security); SOFT-gate tier/contextType/quality (relax or penalize, not hard-drop) so the lane keeps legitimate recall (REQ-006, NFR-S01) | Adversarial: scope-excluded row hard-dropped; tier/quality-only failure ranked down, not dropped |
| `retrieval-rescue.ts` injection (producer) | Appends lexical-rescue/sibling rows post-pipeline (line 388) | update: scope + folder are ALREADY re-applied by `buildInjectionBoundary` (lines 353-401); remaining is SOFT tier/contextType/quality/expiry/embedding-status only (REQ-007) | Adversarial: scope/folder already excluded (existing boundary); tier/quality/expiry/embedding failure ranked down, not dropped |
| `hybrid-search.ts` `toHybridResult` + degradation check (producer/consumer) | Maps channel rows to hybrid results; widens on degradation | update (line 232 scale; line 2652 reads rrfScore) | Score-bound assertion test; degradation-fire fixture |
| `stage2-fusion.ts` fusion + keyword lane + non-hybrid step-4 + learned-boost application (policy) | Normalizes and blends channel scores; applies the additive learned boost at line 843 | update (dedupe, trigger-weight normalization per ADR-002, blend-not-recompute at line 1311, and headroom-proportional learned-boost at line 843 per ADR-001 so +0.7 no longer clamps to a 1.0 re-tie) | Fusion-band property test; boost-preservation test on vector-only search; two-boosted-rows-separate test |
| `vector-index-queries.ts` multi-concept rows (producer) | Emits multi-concept search rows | update (line 586 similarity mapping) | Multi-concept ranking fixture |
| Gate modules (`hyde.ts`, `query-router.ts`, `evidence-gap-detector.ts`, `intent-classifier.ts`, `graph-search-fn.ts`, `causal-boost.ts`, community modules) | Decide when auxiliary retrieval/boost paths engage | update per spec REQ-018 through REQ-024. NOTE: #13 non-hybrid blend + #14 causal scaling are ranking-order changes, 006-gated with cluster 3, not shipped direct. `evidence-gap-detector.ts:282-291` already has a `stdDev===0` guard + `applyRelevanceAwareGap` wrapper: scope its task as narrowing the residual n<=2 gap, not a fresh fix | Gate-fire and gate-hold fixtures per module |
| Scoring helpers (`mpab-aggregation.ts`, `adaptive-ranking.ts`) | Aggregate chunk scores; adaptive fusion weighting | verify-first, then update (Agent-B items) | T004 confirmation notes plus graduated-value tests |
| Threshold consumers of the normalized scale (consumers) | Read scores assuming top pins at 1.0 | check the 006 gate FIRST (skip entirely if 006 = Option A); otherwise inventory before ADR-001 headroom change | `rg -n '0\.95\|>= *1\.0\|=== *1\b\|MIN_MATCH_THRESHOLD' lib/search/` reviewed row by row |
| `llm-reformulation.ts` prompt build + cache (producer, SECURITY) | Builds the reformulation LLM prompt (lines 149-177); reads cache before the flag (356 vs 363); no negative caching | update: fence seeds + query as quoted data blocks, cap length; cap parser output; flag before cache; short-TTL negative sentinel (REQ-025, NFR-S02) | Prompt-injection fixture; flag-before-cache test; outage negative-cache test |
| `retrieval-directives.ts` `parseCandidateLine` (parser) | Finds imperative verbs via unbounded `indexOf` (line 159) | update: `\b`-anchored token match so verbs do not match mid-word (REQ-026) | Mid-word-verb no-match test; leading-verb still-parses test |
| `session-boost.ts` boost application (producer) | Writes boosted `finalScore` into `attentionScore` alias when unset (line 178) | update: leave `attentionScore` undefined when absent (REQ-027) | No-prior-attentionScore preservation test |
| `shared/scoring/folder-scoring.ts` recency (policy) | Constitutional recency returns perpetual 1.0 regardless of age (lines 139-141) | update: resolve recency-channel tier-order (bounded exemption or tier-consistent decay) (REQ-028). Consumed via `lib/scoring/folder-scoring.ts` barrel | Constitutional-vs-fresh-critical recency test |
| `entity-linker.ts` concept alias map (policy) | `BUILTIN_CONCEPT_ALIASES` expands common words ('context'->memory, 'plan'->spec, line 91), default-ON via `SPECKIT_QUERY_CONCEPT_EXPANSION` | update: per-alias specificity weight or >=2-token requirement (REQ-029) | Common-word-not-expanded fixture |
| stage2 architecture doc + telemetry docs (docs) | Present the 13-step stack as ranking authority | update notes where semantics change; defer authority wording to 006 | Doc diff reviewed at close |
| Existing vitest suites (tests) | Encode current bypass/scale behavior as expected | update alongside each fix | Whole-gate vitest delta vs baseline |

Required inventories:
- Same-class producers: `rg -n 'push\(|concat\(|inject' lib/search/pipeline/orchestrator.ts lib/search/rerank/retrieval-rescue.ts lib/graph/community-detection.ts` to enumerate every lane that appends result rows post-filter.
- Consumers of changed symbols: `rg -n 'toHybridResult|resolveEffectiveScore|intentAdjustedScore|rrfScore' lib/ --glob '*.ts'` before changing score semantics.
- Matrix axes: entry lane (main, trigger, rescue, community/graph injection) x filter class (tenant/user/agent scope, tier, contextType, quality, expiry, embedding-status) x flag state (on, off) for the bypass battery; six Group-A flags x (on, off) x (cold start, warm toggle) for the plumbing fix.
- Algorithm invariant: a row excluded by any active filter is excluded from the final result set regardless of entry lane; adversarial cases include rows excluded by exactly one filter class at a time, and a row excluded only after rescue re-injection.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Vitest whole-gate baseline captured to `scratch/baseline-vitest.txt`
- [ ] 006-harness eval baseline captured to `scratch/baseline-eval.json` (fixed query set, prod-mode completeRecall@3)
- [ ] Verify-first battery complete: every agent-verified finding confirmed (or closed as not-a-bug) at its cited line before edits
- [ ] Dedicated T-0211 zero-symptom diagnosis (T009): the causal flag is already per-request + cache-keyed, so trace why `causalBoosted:0` independently of the flag work and of #14; record the confirmed cause or close not-a-bug
- [ ] Note the already-mitigated findings so their tasks narrow the residual gap rather than re-fix: `evidence-gap-detector.ts:282-291` (`stdDev===0` guard + `applyRelevanceAwareGap`), and rescue scope/folder re-application via `buildInjectionBoundary` (`retrieval-rescue.ts:353-401`)

### Phase 2: Core Implementation
- [ ] Cluster 1: Group-A flag plumbing root cause fixed for the T-0212/REQ-214 class; community fallback + context headers verified live. (T-0211 causal-zero is NOT here - it runs as the T009 dedicated diagnosis in Phase 1.)
- [ ] Cluster 2: filter-bypass battery (minState inversion; trigger-lane HARD scope + SOFT tier/quality; rescue-injection SOFT tier/quality/expiry/embedding on top of the existing scope boundary)
- [ ] Cluster 3: score-scale battery (multi-concept similarity, BM25 leak, keyword lane, adaptive fusion, MPAB, pinning, falsy-zero, headroom band + boost rescale, recency) - all 006-gated ranking-order changes
- [ ] Cluster 4: gate fixes. Gate-CORRECTNESS parts ship direct (HyDE, graph-FTS, quality-gap, evidence-gap residual, intent classifier, community existence). #13 non-hybrid blend + #14 causal-boost scaling are ranking-ORDER changes: 006-gated with cluster 3, NOT direct
- [ ] Cluster 5: absorbed silent-drop findings (REQ-025 llm-reformulation security, REQ-026 parseCandidateLine, REQ-027 session-boost alias, REQ-028 recency tier-order, REQ-029 concept-alias specificity)

### Phase 3: Verification
- [ ] Adversarial regression battery green (one test per fixed bypass/gate)
- [ ] Whole vitest gate re-run; delta vs baseline reported
- [ ] Eval re-run on the 006 harness; delta vs baseline reported, no completeRecall@3 regression
- [ ] Telemetry truthfulness spot-check (causalBoosted, communityDelta, graphContribution)
- [ ] Documentation updated and `validate.sh --strict` passing
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-module fixes: minState matrix, score bounds, gate fire/hold, falsy-zero knobs, graduated boosts | vitest |
| Adversarial | Excluded-row battery per entry lane x filter class; flag toggle matrix (six Group-A members, warm toggle) | vitest integration fixtures |
| Eval | Fixed query set on the 006 parity harness, before and after each ranking-order change; prod-mode completeRecall@3 plus rank-position deltas | 006 harness (executePipeline-routed) |
| Manual | Live CLI probes for T-0211/T-0212/REQ-214 symptom disappearance on the warm daemon | spec-memory CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 eval-parity harness | Internal | Yellow (in flight) | Cluster 3 and cluster 4's #13/#14 (ranking-order) cannot be measured; hold them, land clusters 1-2, gate-correctness cluster 4, and cluster 5 on unit/adversarial tests |
| Phase 006 rescue-authority decision | Internal | Yellow (in flight) | HARD GATE for ranking-order work: if Option A, ADR-001/ADR-002 and #13/#14 are WITHDRAWN before paying R-002's threshold-migration cost. Correctness fixes land either way |
| Phase 011 daemon/dist freshness | Internal | Green (first in program order) | Warm-daemon toggle tests need a trustworthy CLI surface |
| Phases 001-005 corpus repair | Internal | Yellow (in flight) | Eval deltas are directional on a polluted corpus; rely on fixtures for pass/fail |
| Agent B pipeline-core ledger section | Internal | Red (pending) | MPAB/adaptive-fusion details second-hand; T004 verify-first substitutes primary evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: completeRecall@3 regression on the 006 harness, vitest regressions attributable to a cluster, or a tenant-scope adversarial test failing post-merge.
- **Procedure**: each cluster lands as its own conventional commit; revert the cluster commit with `git revert <cluster-sha>`. Cluster 3 ranking-order changes additionally sit behind the phase flag from ADR-003, so first-line rollback is flipping that flag off (no deploy needed on the warm daemon once cluster 1 lands, because flags then take effect per-request).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Cluster | Depends On | Reason |
|---------|-----------|--------|
| Cluster 1 (Group-A plumbing) | none (first) | Restores flag observability for the T-0212/REQ-214 class; the T-0211 causal-zero is a separate T009 diagnosis, not flag work |
| Cluster 2 (filter bypasses) | none (parallel-safe with cluster 1) | Pure gate correctness; unit/adversarial tested without the harness. Trigger/rescue lanes hard-gate scope, soft-gate tier/quality |
| Cluster 3 (score scale) | Cluster 1, 006 harness, 006 decision != Option A, ADR-001/ADR-002 | Ranking-order changes need live flags, a measurement harness, and the 006 authority decision; withdrawn if Option A |
| Cluster 4 (gate fixes) | Cluster 1 for community items; gate-correctness independent; #13/#14 need the 006 harness + decision like cluster 3 | Correctness gates ship direct; #13/#14 are ranking-order, 006-gated |
| Cluster 5 (silent-drop absorptions) | none (independent) | REQ-025..REQ-029 are localized correctness/security fixes; unit/adversarial tested without the harness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Cluster | Complexity | Estimated Effort |
|---------|------------|------------------|
| Phase 1 (baselines + 🟡 confirm pass + T009 causal-zero diagnosis) | Medium | 3-4 hours |
| Cluster 1 (Group-A flag plumbing root cause) | High | 3-5 hours |
| Cluster 2 (filter-bypass battery) | Medium | 3-4 hours |
| Cluster 3 (score-scale battery) | High | 6-9 hours |
| Cluster 4 (gate fixes) | High | 5-7 hours |
| Cluster 5 (silent-drop absorptions) | Medium | 2-3 hours |
| Verification (adversarial + eval delta) | Medium | 3-4 hours |
| **Total** | | **25-36 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Vitest whole-gate baseline and 006-harness eval baseline stored before any edit
- [ ] Each cluster landed as its own conventional commit for granular revert
- [ ] Ranking-order changes (Cluster 3) sit behind the ADR-003 phase flag before merge

### Rollback Procedure
1. Identify the regressing cluster from the vitest/eval delta or a failing adversarial test.
2. First line (Cluster 3 ranking order): flip the ADR-003 phase flag off — takes effect per-request once Cluster 1 lands, no deploy.
3. Second line: `git revert <cluster-sha>` for the offending cluster; rebuild dist.
4. Re-run the vitest baseline gate and the 006-harness eval; confirm parity with the stored baseline.

### Data Reversal
- **Has data migrations?** No. This phase is code-only (ranking pipeline, flag plumbing, score-scale math); it writes no schema or row migrations.
- **Reversal procedure**: pure `git revert` of cluster commits plus dist rebuild; no data restore needed. Group-A flag plumbing (Cluster 1) changes only when a flag is read, not stored state.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────┐     ┌─────────────────┐
│  Phase 1       │────►│  Cluster 1      │
│  Baselines +   │     │  Group-A flag   │
│  🟡 verify     │     │  plumbing       │
└──────┬─────────┘     └───┬─────────┬───┘
       │                   │         │
       ├──────────────────►│         ▼
       │            ┌──────▼───┐ ┌───────────────┐
       ├───────────►│ Cluster 2│ │  Cluster 4    │
       │            │ bypasses │ │  gate fixes   │
       │            └────┬─────┘ │ (causal/comm  │
       │                 │       │  need C1)     │
       │        ┌────────▼────┐  └───────┬───────┘
       └───────►│  Cluster 3  │          │
                │  score scale│──────────┤
                │ (needs 006  │          ▼
                │  harness)   │   ┌───────────────┐
                └─────────────┘   │  Phase 3      │
                                  │  Verification │
                                  └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baselines + 🟡 verify + T009 | None | Confirmed findings + baseline evidence + T-0211 causal-zero root cause | All clusters |
| Cluster 1 (Group-A plumbing) | Setup | Per-request flag reads (T-0212/REQ-214); live boost observability | Cluster 4 community items |
| Cluster 2 (filter bypasses) | Setup | Scope-hard / tier-soft correctness across lanes | Phase 3 |
| Cluster 3 (score scale) | Cluster 1, 006 harness, 006 decision != Option A, ADR-001/ADR-002 | Bounded, comparable scores (withdrawn if Option A) | Phase 3 |
| Cluster 4 (gate fixes) | Cluster 1 (community only); #13/#14 need 006 harness + decision | Firing gates (direct); #13/#14 ranking order (006-gated) | Phase 3 |
| Cluster 5 (silent-drop absorptions) | Setup | Security + parser + contract + recency + alias fixes | Phase 3 |
| Verification | All clusters | Eval delta + adversarial battery | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 baselines + 🟡 confirm pass** - 2-3h - CRITICAL (gates every cluster; agent-verified findings confirmed at their cited lines first)
2. **Cluster 1 Group-A flag plumbing** - 3-5h - CRITICAL (until flags apply per-request, Cluster 3/4 boost fixes are unverifiable)
3. **Cluster 3 score-scale battery on the 006 harness** - 6-9h - CRITICAL (the widest ranking-order surface; needs Cluster 1 + eval parity)
4. **Phase 3 verification (adversarial battery + eval delta + strict validation)** - 3-4h - CRITICAL

**Total Critical Path**: 14-21 hours

**Parallel Opportunities**:
- Cluster 2 (pure filter correctness) is independent of Cluster 1 and can proceed in parallel on unit/adversarial fixtures.
- Cluster 4 non-graph gate fixes (HyDE, graph-FTS, non-hybrid blend, evidence-gap, intent classifier) are independent of Cluster 1; only its causal/community items wait on flag plumbing.
- Test authoring per cluster runs parallel to an adjacent cluster's implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines + confirmations done | All 🟡 findings confirmed/refuted with quoted code; vitest + eval baselines stored | End of Phase 1 |
| M2 | Group-A plumbing landed | Flags read per-request; causalBoosted/communityDelta/context-headers observably non-zero when applicable | Mid Phase 2 |
| M3 | All clusters landed | REQ-001..REQ-012 implemented; adversarial bypass battery green; vitest delta clean | End of Phase 2 |
| M4 | Phase close | SC-001..SC-006 evidenced; no completeRecall@3 regression on the 006 harness; checklist P0/P1 complete; validate.sh --strict exit 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Architecture decisions for this phase live in `decision-record.md`:

- **ADR-001**: Score-normalization headroom approach — sub-1 band PLUS headroom-proportional boost rescale so the additive +0.7 learned boost no longer re-ties at 1.0 (Proposed; 006-gated, withdrawn if 006 = Option A; ratify against the 006-harness A/B).
- **ADR-002**: Trigger-lane fusion weight — fold the 1.4 out-of-band multiplier into the normalized channel set (Proposed; 006-gated, withdrawn if 006 = Option A; keyword-lane dedupe lands either way).
- **ADR-003**: Per-cluster flag/rollout strategy — correctness fixes direct; all ranking-order changes (ADR-001, ADR-002, recency, #13, #14) behind one 006-gated flag (Accepted).

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records in decision-record.md
-->
