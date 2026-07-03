---
title: "Feature Specification: Phase 007 - Ranking Filter Bypass and Score Scale Fixes"
description: "Search rows enter ranking through side doors that skip tenant/tier/context/quality gates, scores mix incompatible scales, and the Group-A feature flags never change live behavior. This phase fixes the flag-read root cause, closes every filter bypass, and repairs the score-scale and gate battery so ranking signals actually influence result order."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale fixes"
  - "flag read root cause"
  - "group-a flag plumbing"
  - "minstate inversion"
  - "rescue injection gates"
  - "hyde gate fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-03T10:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Capture baselines, then run the confirm-before-fix pass on 🟡 findings"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-007-ranking-filter-bypass-and-score-scale-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 007 - Ranking Filter Bypass and Score Scale Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

This is Phase 7 of 13 in the deep-dive remediation program for the spec-kit memory MCP server. It repairs the ranking layer's correctness in four clusters: (1) the Group-A feature-flag plumbing root cause absorbed from the ex-031 tracker (flags read at process start or cached without flag state, so causal boost, community fallback, and context headers never apply), (2) a filter-bypass battery where trigger-lane and rescue-injected rows skip tenant/tier/context/quality gates and an inverted `minState` comparison drops known-state rows, (3) a score-scale battery where raw BM25 scores, missing multi-concept similarity, dead channel weights, clamp saturation, and top-pinned normalization make boosts inert, and (4) a gate-fix battery where HyDE, quality-gap fallback, evidence-gap detection, graph FTS, and intent classification never fire or fire wrongly.

**Key Decisions**: ADR-001 normalization headroom approach, ADR-002 trigger-weight policy, ADR-003 per-cluster flag and rollout strategy (see `decision-record.md`).

**Critical Dependencies**: Phase 006 must land the eval-parity harness first; every ranking change here is measured as a before/after delta on that harness.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 13 |
| **Predecessor** | 006-rescue-layer-ranking-authority-decision |
| **Successor** | 008-causal-graph-hygiene-and-entity-linker-noise |
| **Handoff Criteria** | All four fix clusters landed with adversarial tests green, Group-A toggle matrix passing, and eval-delta on the 006 parity harness reported with no completeRecall@3 regression |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-dive report (../research/deep-dive-report.md, Chain D) shows a large fraction of the ranking stack is computed, recorded in telemetry as applied, and then discarded or bypassed before it can influence final order. Three lanes append result rows without re-applying the scope/tier/context/quality filters the main lane enforces, so excluded rows re-enter results. Scores leak across incompatible scales (raw BM25 next to normalized RRF), several boost paths clamp or pin at 1.0, and gates such as HyDE and quality-gap fallback are structurally dead. On top of that, three Group-A findings tracked open in the ex-031 packet (T-0211 causal boost never applies, T-0212 community fallback never surfaces, REQ-214 context headers never inject) share one recorded root-cause hypothesis: boolean feature flags are read at process start or cached without flag state instead of read per-request. Live telemetry confirms the symptom: `causalBoostApplied:"applied"` with `causalBoosted:0` and graphContribution all zeros.

### Purpose

After this phase, every result row passes the same gate battery regardless of entry lane, every ranking signal that is computed can visibly change result order (or is explicitly documented as retired), and toggling any Group-A flag changes live behavior in the same session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Cluster 1, Group-A flag plumbing: fix the shared flag-read root cause (per-request reads, or cache keys that include live flag state), then verify causal boost applies (T-0211), community-search fallback surfaces (T-0212), and contextual tree headers inject (REQ-214).
- Cluster 2, filter-bypass battery: `minState` inversion (report #5, `stage4-filter.ts:144`), trigger-lane promotion bypassing tenant/user/agent scope, tier, contextType, and quality filters (report #6, pipeline `orchestrator.ts:125-163`), rescue-injected rows bypassing tier/contextType/quality/expiry/embedding-status gates (report #7, `retrieval-rescue.ts:388`).
- Cluster 3, score-scale battery: multi-concept similarity missing (report #8, `vector-index-queries.ts:586`), raw-BM25 leak via `toHybridResult` plus degradation-check scale (report #9, `hybrid-search.ts:232` and `hybrid-search.ts:2652`), keyword-lane double-count and dead 0.3/0.6 weights, adaptive-fusion divisor and trigger 1.4 weight normalization, MPAB clamp-at-assignment, `intentAdjustedScore` pinning and surrogate threshold gate, parseFloat falsy-zero knobs, normalization headroom, recency-bonus saturation.
- Cluster 4, gate fixes: HyDE absolute-relevance gate (report #12, `hyde.ts:88`), graph-FTS OR-tokens (report #11, `graph-search-fn.ts:161`), non-hybrid step-4 blend-not-recompute (report #13, `stage2-fusion.ts:1311`, verified), causal-boost typed-traversal scaling (report #14, `causal-boost.ts:520-569`), quality-gap fallback wiring (`query-router.ts:316`), evidence-gap n of 2 handling (`evidence-gap-detector.ts:283`), intent-classifier patterns/keywords/normalization plus memory_context confidence forwarding, community injection existence check with communityDelta recording and community-search token matching.
- Adversarial regression tests for every fixed bypass and gate, plus a Group-A flag toggle matrix.
- Baseline capture (vitest plus 006-harness eval numbers) before the first code change, and an eval-delta report after.

### Absorbed Group-A Scope (ex-031 tracker)

This phase absorbs the flag-read cluster tracked open in `../../014-manual-playbook-execution-sweep/001-findings-remediation/`:

| Tracker Row | Location | Item |
|-------------|----------|------|
| T-0211 | `tasks.md` (Group-A open row) | Causal boost never applies despite default-on; check shared Group-A flag-reading root cause first |
| T-0212 | `tasks.md` (Group-A open row) | Community-search fallback never surfaces despite default-on; same shared root cause |
| REQ-214 | `spec.md` requirements table | Context headers: enabled/default mode returns `content: null` instead of `[parent > child]` header injection via `injectContextualTree`/`isContextHeadersEnabled` |

The ex-031 `plan.md` records the root-cause hypothesis (flags read at process start versus per-request) and names six Group-A members: REQ-110, REQ-113, REQ-200, REQ-211, REQ-212, REQ-214. The T-0110 fix already proved one variant: `buildCacheArgs()` in `search-utils.ts` omitted live flag state from a cache key. Phase 013 updates the old tracker pointers; this phase does not edit the ex-031 docs.

### Out of Scope

- Rescue-layer ranking authority decision and eval-parity harness construction - owned by phase 006 (predecessor; this phase consumes its harness).
- Causal graph hygiene and entity-linker noise - owned by phase 008.
- Search hot-path performance work (rescue hydration batching, caches) - owned by phase 010.
- Envelope presentation, double emission, and command-doc drift - owned by phase 012.
- Updating the ex-031 tracker rows to point at this phase - owned by phase 013.
- Corpus repair (orphans, tiers, dedup, embeddings, triggers) - owned by phases 001-005.

### Files to Change

All code paths are relative to `.opencode/skills/system-spec-kit/mcp_server/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/search/search-flags.ts` | Modify | Group-A flag-read root cause: resolve flags per-request (or expose live state for cache keys) |
| `lib/search/search-utils.ts` | Modify | Include live flag state in `buildCacheArgs()` cache keys where still missing (T-0110 precedent) |
| `lib/search/pipeline/stage4-filter.ts` | Modify | Fix default/empty `minState` mapping to priority 6 dropping known-state rows (line 144) |
| `lib/search/pipeline/orchestrator.ts` | Modify | Re-apply tenant/user/agent scope, tier, contextType, quality gates to trigger-lane promoted rows (lines 125-163) |
| `lib/search/rerank/retrieval-rescue.ts` | Modify | Apply the same gate battery to rescue-injected rows (line 388) |
| `lib/search/vector-index-queries.ts` | Modify | Map similarity/score for multi-concept search rows (line 586) |
| `lib/search/hybrid-search.ts` | Modify | `toHybridResult` emits fused-scale score, not raw BM25 (line 232); degradation check reads rrfScore scale (line 2652) |
| `lib/search/pipeline/stage2-fusion.ts` | Modify | Non-hybrid step-4 blend-not-recompute (line 1311); keyword-lane dedupe; fusion normalization for trigger weight |
| `lib/cognitive/adaptive-ranking.ts` | Modify | Adaptive-fusion divisor fix (confirm exact site in verify-first task T004) |
| `lib/scoring/mpab-aggregation.ts` | Modify | MPAB clamp-at-assignment fix (confirm exact site in verify-first task T004) |
| `lib/search/hyde.ts` | Modify | Gate on absolute relevance instead of min-max normalized scores (lines 88, 134) |
| `lib/search/graph-search-fn.ts` | Modify | Graph channel FTS uses OR-tokens with stopword handling (lines 161-176) |
| `lib/search/causal-boost.ts` | Modify | Typed-traversal boost graduated below cap so relation priors and hop decay matter (lines 520-569) |
| `lib/search/query-router.ts` | Modify | Wire `qualitySignal` into quality-gap fallback or delete the dead plan (line 316) |
| `lib/search/evidence-gap-detector.ts` | Modify | Handle n of 2 or fewer results without auto-flagging a gap (line 283) |
| `lib/search/intent-classifier.ts` | Modify | Article-optional patterns, word-boundary keywords, per-match normalization; respect confidence floor on forwarded intent |
| `lib/graph/community-detection.ts` | Modify | Community injection existence check, effective-score base, communityDelta recording (around line 623) |
| `lib/search/community-search.ts` | Modify | Token-boundary matching instead of substring scoring (line 91) |
| adjacent vitest suites | Modify/Create | Adversarial tests per fixed bypass, gate-fire tests, Group-A toggle matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Finding references use ../research/deep-dive-report.md section 3 numbering (#N), findings-ledger agent tags, and ex-031 tracker IDs.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the Group-A flag-read root cause: flag state resolves per-request, or every cached computation keys on live flag state | Toggling each Group-A flag changes behavior within the same warm daemon session; no process restart needed |
| REQ-002 | Causal boost applies when enabled (absorbed T-0211) | On a graph-connected fixture, telemetry shows `causalBoosted` greater than 0 and graphContribution non-zero |
| REQ-003 | Community-search fallback surfaces when enabled (absorbed T-0212) | Fallback path returns community results on a fixture query that strands the primary lanes |
| REQ-004 | Contextual tree headers inject when enabled (absorbed REQ-214) | Result content carries the `[parent > child]` header instead of `content: null` with `contentError` |
| REQ-005 | Fix `minState` inversion so default/empty minState never maps above HOT priority (#5) | Known-state rows survive stage4 with default arguments; unit test covers empty, default, and each valid state |
| REQ-006 | Trigger-lane promoted rows re-pass tenant/user/agent scope, tier, contextType, and quality filters (#6) | Adversarial test: a row excluded by each filter class stays excluded when it enters via the trigger lane |
| REQ-007 | Rescue-injected rows re-pass tier, contextType, quality, expiry, and embedding-status gates (#7) | Adversarial test: excluded rows stay excluded when they enter via rescue injection |
| REQ-008 | Baseline before change: capture the vitest baseline and 006-harness eval numbers before the first code edit, and report eval-delta after each cluster | Baseline artifacts exist in `scratch/`; final report includes before/after deltas for the whole gate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Multi-concept search rows receive real similarity/score instead of effective 0 (#8) | Multi-concept fixture rows rank by similarity, not recency/hash order |
| REQ-010 | `toHybridResult` stops leaking raw unbounded BM25 into `score`; degradation-widening check reads the rrfScore scale (#9, B P2) | No result exits the enhanced path with a score above 1.0 pre-normalization; degradation check can fire on a weak-lexical fixture |
| REQ-011 | Keyword-lane concat no longer double-counts docs when BM25 delegates to FTS5; dead 0.3/0.6 channel weights wired or deleted (B P2) | Duplicate-doc fixture returns one row per doc; weight disposition recorded per ADR-002 |
| REQ-012 | Adaptive-fusion divisor corrected and trigger 1.4 weight routed through fusion normalization (B P2) | Trigger-lane hit no longer outranks a vector hit by scale alone (was 2.3x); fusion output stays within the documented band |
| REQ-013 | MPAB boost no longer clamps at assignment (B P2) | MPAB aggregation test shows graduated values below the cap |
| REQ-014 | `resolveEffectiveScore` pinning contract fixed: surrogate boost respects MIN_MATCH_THRESHOLD and stops pinning `intentAdjustedScore` for later stages (D P2) | Surrogate fixture no longer holds top precedence through all later stages |
| REQ-015 | parseFloat falsy-zero knobs (GRAPH_WEIGHT_CAP, RECENCY_FUSION_WEIGHT, RECENCY_FUSION_CAP, smartRanking.recencyWeight) accept explicit 0 (C P2) | Setting each knob to 0 disables its effect instead of restoring the default |
| REQ-016 | Normalization leaves boost headroom per ADR-001 (C P2) | Top-ranked row no longer sits at exactly 1.0; post-normalization boosts can reorder the top ranks on a fixture |
| REQ-017 | Recency bonus graduates instead of cap-saturating flat for anything under 10 days (C P2) | Recency test shows monotonically decreasing bonus across fixture ages |
| REQ-018 | HyDE low-confidence gate compares against absolute relevance so it can fire with candidates present (#12) | Gate-fire unit test passes on a low-relevance fixture; gate stays closed on a high-relevance fixture |
| REQ-019 | Graph channel FTS matches OR over tokens with stopword handling so verbose queries return graph candidates (#11) | Verbose fixture query returns non-zero graph candidates |
| REQ-020 | Non-hybrid step-4 intent weighting blends with prior boosts instead of recomputing from raw similarity (#13, verified) | Vector-only search retains recency/co-activation/community/graph boosts in the final order |
| REQ-021 | Causal-boost typed traversal graduates below the 0.20 cap so relation priors and hop decay differentiate neighbors (#14) | Boost distribution test shows non-flat values across relation types and hop depths |
| REQ-022 | Quality-gap fallback either receives a real `qualitySignal` from production or the dead plan is deleted (D P2) | Either `engaged:true` observed on a weak-result fixture, or the code path and doc note are removed together |
| REQ-023 | Intent classifier: article-optional patterns, word-boundary keyword matching, per-match normalization; memory_context intent forwarding respects the confidence floor (D P2, E P2) | "how does X work" classifies as understand; "prefix"/"inspect" no longer steal fix/spec intents; forwarded intent cannot arrive pinned at confidence 1.0 |
| REQ-024 | Community injection checks member existence, bases boost on effective score, and records communityDelta; community-search uses token matching (C/D P2) | No phantom ids for deleted memories; communityDelta non-zero when boost applies; "art" no longer matches "start" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every fixed bypass and gate has an adversarial regression test that fails on the pre-fix code and passes post-fix.
- **SC-002**: Before/after eval on the 006 parity harness is reported; prod-mode completeRecall@3 does not regress, and the delta table is stored with the phase evidence.
- **SC-003**: Telemetry is truthful: `causalBoosted`, `communityDelta`, and graphContribution are non-zero on fixtures where those boosts genuinely apply, and zero where they do not.
- **SC-004**: The Group-A toggle matrix passes: all six member flags (REQ-110, REQ-113, REQ-200, REQ-211, REQ-212, REQ-214 classes) change observable behavior when toggled in a warm session.
- **SC-005**: No agent-verified finding is fixed without a confirm-before-fix note; any finding that does not reproduce is closed as not-a-bug with evidence instead of being patched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 eval-parity harness (eval routed through executePipeline) | Without it, score-scale changes cannot be measured against production behavior | Hold cluster 3 behind the harness; clusters 1-2 can proceed on unit/adversarial tests alone |
| Dependency | Phase 006 rescue-authority decision | Decides whether upstream signal fixes are load-bearing or cleanup | Land fixes as correctness work either way; note which signals rescue currently compresses to 3.7 percent |
| Dependency | Phases 001-005 corpus repair | Eval deltas on a polluted corpus under-measure ranking improvements | Use the fixed query set plus fixtures; treat corpus-sensitive metrics as directional |
| Risk | Score-scale fixes reorder results for existing users | Medium | Cluster 3 behavior changes ship behind the phase flag per ADR-003 until eval-delta is clean |
| Risk | Agent B pipeline ledger section is pending; MPAB and adaptive-fusion details are second-hand | Medium | Verify-first task T004 confirms mechanics at the cited sites before any edit |
| Risk | Per-request flag reads add hot-path cost | Low | Env reads are cheap; where caching stays, key on flag state (T-0110 pattern) and benchmark p50 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Flag-plumbing and gate re-application add no more than 50ms to warm memory_search p50 (baseline about 2.0-2.9s today; phase 010 owns the reduction work).

### Security
- **NFR-S01**: Filter re-application is treated as a security boundary: no row may reach results while excluded by tenant/user/agent scope, regardless of entry lane.

### Reliability
- **NFR-R01**: All default-ON behavior fixes ship direct with revertable per-cluster commits; ranking-order changes stay flag-gated until the eval-delta gate passes (ADR-003).

---

## 8. EDGE CASES

### Data Boundaries
- Empty or default `minState` argument: must map to the most permissive priority, not above HOT.
- All-equal fusion scores: normalization must not emit all 1.0 (headroom rule, ADR-001).
- Explicit 0 in env knobs: honored as 0, not replaced by the default (falsy-zero fix).
- n of 1 or 2 results: evidence-gap detector must not auto-flag a gap from a degenerate Z-score.

### Error Scenarios
- Flag toggled mid-session in a warm daemon: next request observes the new value (or the flag-keyed cache misses).
- Community member deleted between rebuild and injection: existence check drops it instead of injecting a phantom id.
- Query of only stopwords on the graph channel: OR-token matching returns gracefully instead of silent zero-candidate AND failure.
- Rescue lane with zero candidates: gate re-application handles an empty injection set without error.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 18+, fix sites: about 25, one subsystem (search pipeline) |
| Risk | 16/25 | Tenant-scope security relevance, ranking-order changes, no schema or auth changes |
| Research | 12/20 | Verify-first battery over agent-verified findings; Agent B ledger section pending |
| Multi-Agent | 6/15 | Single executor plus eval harness; no parallel workstreams |
| Coordination | 10/15 | Consumes 006 harness and decision; feeds 008, 010, 012, 013 |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gate re-application drops rows users currently rely on (bypass rows were visible) | M | M | Eval-delta on the 006 harness; flag-gate cluster 3; report row-count deltas per lane |
| R-002 | Normalization headroom change shifts every downstream threshold tuned to the 1.0-pinned scale | H | M | ADR-001 inventories threshold consumers before the change; adversarial threshold tests |
| R-003 | Group-A fix changes flag semantics for consumers that relied on process-start reads | M | L | Toggle matrix across all six members; grep inventory of flag readers in the FIX ADDENDUM |
| R-004 | MPAB/adaptive-fusion fixes built on second-hand findings patch the wrong mechanics | M | M | T004 verify-first confirms at `mpab-aggregation.ts` and `adaptive-ranking.ts` before edits |
| R-005 | Eval harness (006) slips and blocks cluster 3 measurement | M | M | Reorder: land clusters 1-2 and 4 first; cluster 3 waits for the harness |

---

## 11. USER STORIES

### US-001: Trustworthy filters (Priority: P0)

**As a** memory-search consumer, **I want** every result row to pass the same scope, tier, context, and quality gates, **so that** deprecated, out-of-scope, or low-quality rows cannot re-enter results through the trigger or rescue lanes.

**Acceptance Criteria**:
1. **Given** a row excluded by tenant scope, **When** it is promoted by the trigger lane, **Then** it is filtered before results are returned.
2. **Given** a row excluded by tier or quality gates, **When** rescue injects it at line 388, **Then** the post-rescue gate battery removes it.

### US-002: Flags that do something (Priority: P0)

**As an** operator tuning retrieval, **I want** Group-A feature flags to change live behavior when toggled, **so that** causal boost, community fallback, and context headers can be enabled, measured, and rolled back without restarting the daemon.

**Acceptance Criteria**:
1. **Given** a warm daemon with causal boost enabled, **When** a graph-connected query runs, **Then** `causalBoosted` is greater than 0 and graphContribution is non-zero.
2. **Given** any Group-A flag flipped mid-session, **When** the next request executes, **Then** the new flag value governs behavior.

### US-003: Scores on one scale (Priority: P1)

**As a** ranking maintainer, **I want** all channels to contribute on a single normalized scale with headroom, **so that** boosts, demotions, and gates can actually reorder results instead of clamping inert at 1.0.

**Acceptance Criteria**:
1. **Given** a BM25-delegated keyword result, **When** `toHybridResult` maps it, **Then** the emitted score is on the fused scale and the enhanced path re-sorts correctly.
2. **Given** a top-ranked result after normalization, **When** a post-normalization boost applies to a lower row, **Then** the boost can change the top-K order (headroom exists).

---

## 12. OPEN QUESTIONS

- Agent B's pipeline-core ledger section is pending: exact MPAB clamp and adaptive-fusion divisor mechanics are second-hand until T004 confirms them at the cited modules.
- Phase 006 may decide the rescue layer stays the ranking authority (option a). If so, several cluster-3 fixes become hygiene rather than user-visible; the eval-delta interpretation changes but the fixes still land.
- The post-normalization target value for the trigger-lane channel weight (currently 1.4 raw) is an A/B outcome, not a spec constant (ADR-002).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Sources**: `../research/deep-dive-report.md` (section 3 P1 items #5-#14, section 6 known-open Group-A), `../research/findings-ledger.md` (Agent C and D sections; Agent B pending), `../research/phase-decomposition.md` (section 007)
- **Absorbed Tracker**: `../../014-manual-playbook-execution-sweep/001-findings-remediation/` (T-0211, T-0212, REQ-214; pointer updates owned by phase 013)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
