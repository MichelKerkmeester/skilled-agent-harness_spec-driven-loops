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
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T17:51:13.944Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Program complete (016 shipped + pushed)"
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
    completion_pct: 100
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

**Critical Dependencies**: Phase 006 must land the eval-parity harness first; every ranking change here is measured as a before/after delta on that harness. Phase 006 also decides rescue-layer ranking authority, and that decision is a hard precondition for the ranking-order work here: if 006 chooses Option A (rescue stays the ranking authority, lexical dominance kept), then ADR-001 (headroom band), ADR-002 (trigger-weight), and cluster 4's two ranking-order gate fixes (#13 non-hybrid blend, #14 causal-boost scaling) are withdrawn as no-ops rather than shipped. They must not land as inert ranking changes that still pay R-002's threshold-migration cost.

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

The deep-dive report (../research/deep-dive-report.md, Chain D) shows a large fraction of the ranking stack is computed, recorded in telemetry as applied, and then discarded or bypassed before it can influence final order. Three lanes append result rows without re-applying the scope/tier/context/quality filters the main lane enforces, so excluded rows re-enter results. Scores leak across incompatible scales (raw BM25 next to normalized RRF), several boost paths clamp or pin at 1.0, and gates such as HyDE and quality-gap fallback are structurally dead. On top of that, three Group-A findings tracked open in the ex-031 packet (T-0211 causal boost never applies, T-0212 community fallback never surfaces, REQ-214 context headers never inject) were recorded under one root-cause hypothesis: boolean feature flags read at process start or cached without flag state instead of per-request. That hypothesis holds for the T-0212/REQ-214 class, but it does not explain T-0211. The causal flag is already read per-request (`isCausalBoostEnabled()` calls `isFeatureEnabled` on every request, `search-flags.ts:60`) and is already part of the cache key (`enableCausalBoost` in `buildCacheArgs`, `search-utils.ts:180`). So the live telemetry symptom `causalBoostApplied:"applied"` with `causalBoosted:0` and graphContribution all zeros is a distinct, still-unexplained defect - not the shared flag-read root cause, and not the #14 typed-traversal cap saturation (which produces flat-MAX values, not zero). T-0211 therefore needs a dedicated zero-symptom diagnosis (T009) before its fix path is known; the flag-plumbing fix alone will not move the zero.

### Purpose

After this phase, every result row passes the same gate battery regardless of entry lane, every ranking signal that is computed can visibly change result order (or is explicitly documented as retired), and toggling any Group-A flag changes live behavior in the same session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Cluster 1, Group-A flag plumbing: fix the shared flag-read root cause (per-request reads, or cache keys that include live flag state) for the T-0212/REQ-214 class, then verify community-search fallback surfaces (T-0212) and contextual tree headers inject (REQ-214). T-0211 (causal boost `causalBoosted:0`) is NOT in the flag-plumbing set - its flag is already per-request and cache-keyed - so it gets a dedicated zero-symptom diagnosis task (T009) that must find the real cause before any fix, independent of the flag work and of the #14 causal-scaling task (T043).
- Cluster 2, filter-bypass battery: `minState` inversion (report #5, `stage4-filter.ts:144`), trigger-lane promotion bypassing tenant/user/agent scope, tier, contextType, and quality filters (report #6, pipeline `orchestrator.ts:125-163`), rescue-injected rows bypassing tier/contextType/quality/expiry/embedding-status gates (report #7, `retrieval-rescue.ts:388`).
- Cluster 3, score-scale battery: multi-concept similarity missing (report #8, `vector-index-queries.ts:586`), raw-BM25 leak via `toHybridResult` plus degradation-check scale (report #9, `hybrid-search.ts:232` and `hybrid-search.ts:2652`), keyword-lane double-count and dead 0.3/0.6 weights, adaptive-fusion divisor and trigger 1.4 weight normalization, MPAB clamp-at-assignment, `intentAdjustedScore` pinning and surrogate threshold gate, parseFloat falsy-zero knobs, normalization headroom, recency-bonus saturation.
- Cluster 4, gate fixes: HyDE absolute-relevance gate (report #12, `hyde.ts:88`), graph-FTS OR-tokens (report #11, `graph-search-fn.ts:161`), non-hybrid step-4 blend-not-recompute (report #13, `stage2-fusion.ts:1311`, verified), causal-boost typed-traversal scaling (report #14, `causal-boost.ts:520-569`), quality-gap fallback wiring (`query-router.ts:316`), evidence-gap n of 2 handling (`evidence-gap-detector.ts:283`), intent-classifier patterns/keywords/normalization plus memory_context confidence forwarding, community injection existence check with communityDelta recording and community-search token matching. Note: #13 (non-hybrid blend) and #14 (causal-boost scaling) are ranking-order changes, not gate-correctness fixes; they are equally rescue-compressed, so they are measured on the 006 harness and gated on the 006 decision alongside cluster 3, NOT shipped "direct." If 006 chooses Option A they are withdrawn (see ADR-003).
- Cluster 5, absorbed silent-drop findings (routed from the plan-review systemic-drop list): the `llm-reformulation` prompt-injection and cache/flag/negative-caching hardening (security), the `retrieval-directives` `parseCandidateLine` mid-word verb match, the `session-boost` `attentionScore` alias contract violation, the constitutional recency tier-order violation, and the concept-alias-map lexical dilution.
- Adversarial regression tests for every fixed bypass and gate, plus a Group-A flag toggle matrix.
- Baseline capture (vitest plus 006-harness eval numbers) before the first code change, and an eval-delta report after.

### Absorbed Group-A Scope (ex-031 tracker)

This phase absorbs the flag-read cluster tracked open in `../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/`:

| Tracker Row | Location | Item |
|-------------|----------|------|
| T-0211 | `tasks.md` (Group-A open row) | Causal boost never applies (`causalBoosted:0`) despite default-on. Re-root-caused here: the flag is already per-request and cache-keyed, so this is NOT the shared Group-A flag-read root cause. Route to the dedicated zero-symptom diagnosis (T009), not the flag-plumbing fix |
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
| `lib/search/llm-reformulation.ts` | Modify | Fence seeds as quoted data blocks and cap query length in `buildReformulationPrompt` (lines 149-177); cap abstract/variant length in `parseReformulationResponse`; check `isLlmReformulationEnabled()` before the cache read (lines 356 vs 363); cache a short-TTL negative sentinel so an outage does not re-stall 8s per call |
| `lib/search/retrieval-directives.ts` | Modify | `parseCandidateLine` uses `\b`-anchored token matching instead of unbounded `indexOf` so verbs do not match mid-word (line 159, e.g. "only" inside "Commonly") |
| `lib/search/session-boost.ts` | Modify | Leave `attentionScore` undefined when the row has none instead of writing the boosted ranking `finalScore` into the alias (line 178) |
| `shared/scoring/folder-scoring.ts` | Modify | Constitutional recency exemption returns a perpetual 1.0 regardless of age (lines 139-141) while critical tier decays - resolve the recency-channel tier-order violation. Consumed by the barrel at `lib/scoring/folder-scoring.ts` |
| `lib/search/entity-linker.ts` | Modify | Concept alias map (`BUILTIN_CONCEPT_ALIASES`, line 91) expands common words ('context'->memory line 96, 'plan'->spec line 113) default-ON via `SPECKIT_QUERY_CONCEPT_EXPANSION`; add per-alias specificity weight or require >=2 matched tokens |
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
| REQ-002 | Diagnose and fix the causal-boost `causalBoosted:0` zero symptom (absorbed T-0211). This is NOT the flag-read root cause (flag is per-request + cache-keyed, `search-flags.ts:60`, `search-utils.ts:180`) and NOT the #14 cap saturation; the dedicated diagnosis task T009 must identify the actual cause first | T009 records the confirmed root cause with a code/line citation; then, on a graph-connected fixture, telemetry shows `causalBoosted` greater than 0 and graphContribution non-zero. If T009 finds no reproducible defect it is closed as not-a-bug with evidence (SC-005) |
| REQ-003 | Community-search fallback surfaces when enabled (absorbed T-0212) | Fallback path returns community results on a fixture query that strands the primary lanes |
| REQ-004 | Contextual tree headers inject when enabled (absorbed REQ-214) | Result content carries the `[parent > child]` header instead of `content: null` with `contentError` |
| REQ-005 | Fix `minState` inversion so default/empty minState never maps above HOT priority (#5) | Known-state rows survive stage4 with default arguments; unit test covers empty, default, and each valid state |
| REQ-006 | Trigger-lane promoted rows (`orchestrator.ts:125-163`, currently appended with no re-gating) HARD-gate on tenant/user/agent scope (the security boundary); tier, contextType, and quality apply as SOFT gates (relax or soft-penalize, not hard-drop) so the lane keeps the legitimate recall it exists for and does not undercut 026 lexical-grounding (#6) | Adversarial test: a row excluded by tenant/user/agent scope stays excluded via the trigger lane; a row failing only tier/contextType/quality is retained but ranked down, not silently dropped |
| REQ-007 | Rescue-injected rows (`retrieval-rescue.ts:388`) apply the residual gate battery. Scope + folder are ALREADY re-applied via `buildInjectionBoundary` (`retrieval-rescue.ts:353-401`), so the true remaining scope is tier, contextType, quality, expiry, and embedding-status only - and these are SOFT gates (relax or soft-penalize), not hard drops, per the recall-vs-security split (#7) | Adversarial test: a scope/folder-excluded row already stays excluded (existing boundary); a row failing only tier/contextType/quality/expiry/embedding-status is retained but ranked down, not hard-dropped |
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
| REQ-016 | Normalization leaves boost headroom per ADR-001, and the dominant additive learned boost (+0.7, `learned-feedback.ts:75`, applied at `stage2-fusion.ts:843`) no longer saturates two boosted rows to a 1.0 re-tie (C P2) | Top-ranked row no longer sits at exactly 1.0; two rows that both receive the learned boost separate by signal instead of both clamping to 1.0 and resolving by hash; post-normalization boosts can reorder the top ranks on a fixture |
| REQ-017 | Recency bonus graduates instead of cap-saturating flat for anything under 10 days (C P2) | Recency test shows monotonically decreasing bonus across fixture ages |
| REQ-018 | HyDE low-confidence gate compares against absolute relevance so it can fire with candidates present (#12) | Gate-fire unit test passes on a low-relevance fixture; gate stays closed on a high-relevance fixture |
| REQ-019 | Graph channel FTS matches OR over tokens with stopword handling so verbose queries return graph candidates (#11) | Verbose fixture query returns non-zero graph candidates |
| REQ-020 | Non-hybrid step-4 intent weighting blends with prior boosts instead of recomputing from raw similarity (#13, verified). This is a ranking-order change: measured on the 006 harness and gated on the 006 decision, withdrawn if 006 = Option A (ADR-003) | Vector-only search retains recency/co-activation/community/graph boosts in the final order; eval-delta reported, no completeRecall@3 regression |
| REQ-021 | Causal-boost typed traversal graduates below the 0.20 cap so relation priors and hop decay differentiate neighbors (#14). Ranking-order change: measured on the 006 harness and gated on the 006 decision, withdrawn if 006 = Option A (ADR-003). Distinct from the T-0211 zero symptom (REQ-002/T009): #14 produces flat-MAX values, not zero | Boost distribution test shows non-flat values across relation types and hop depths; eval-delta reported |
| REQ-022 | Quality-gap fallback either receives a real `qualitySignal` from production or the dead plan is deleted (D P2) | Either `engaged:true` observed on a weak-result fixture, or the code path and doc note are removed together |
| REQ-023 | Intent classifier: article-optional patterns, word-boundary keyword matching, per-match normalization; memory_context intent forwarding respects the confidence floor (D P2, E P2) | "how does X work" classifies as understand; "prefix"/"inspect" no longer steal fix/spec intents; forwarded intent cannot arrive pinned at confidence 1.0 |
| REQ-024 | Community injection checks member existence, bases boost on effective score, and records communityDelta; community-search uses token matching (C/D P2) | No phantom ids for deleted memories; communityDelta non-zero when boost applies; "art" no longer matches "start" |

### P2 - Absorbed silent-drop findings (routed from plan-review Systemic #4)

These were traced to no phase owner by the program-coherence reviewer and routed here. Each keeps a verify-first pass; several are already partially mitigated in live code and are scoped as narrowing the residual gap.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-025 | SECURITY: `llm-reformulation` hardening (Agent D P2). `buildReformulationPrompt` (`llm-reformulation.ts:149-177`) interpolates seed content and the raw query UNFENCED into the LLM prompt (prompt-injection); the cache is read before the enable flag (`:356` before `:363`); an outage caches nothing so every call re-stalls the 8s LLM timeout. Fix: fence seeds and the query as quoted data blocks, cap query length; cap abstract/variant length in `parseReformulationResponse`; check `isLlmReformulationEnabled()` before the cache read; cache a short-TTL negative sentinel | Adversarial fixture: a seed containing prompt-control text cannot alter the reformulation instruction; a disabled flag short-circuits before the cache read; a simulated endpoint outage caches a negative sentinel so the second call returns fast instead of re-stalling |
| REQ-026 | `retrieval-directives.parseCandidateLine` matches imperative verbs on word boundaries, not unbounded `indexOf` (`:159`), so "only" no longer matches inside "Commonly" and malformed directives stop reaching the LLM (Agent D P2) | Unit test: a line whose verb only appears mid-word yields no false directive; a genuine leading-verb line still parses |
| REQ-027 | `session-boost` leaves `attentionScore` undefined when the row has none instead of writing the boosted ranking `finalScore` into the alias (`session-boost.ts:178`), honoring stage2's preservation contract (Agent C P2) | Unit test: a row with no prior attentionScore exits session-boost with `attentionScore` still undefined, while `sessionBoostScore` carries the boosted value |
| REQ-028 | Constitutional recency exemption stops returning a perpetual max recency regardless of age (`shared/scoring/folder-scoring.ts:139-141` returns 1.0) while critical tier decays - resolve the recency-channel tier-order violation (Agent C contract) | Recency-channel test: constitutional does not outrank a fresh critical row on recency alone; the chosen resolution (bounded exemption or tier-consistent decay) is recorded |
| REQ-029 | Concept alias map adds a per-alias specificity weight or requires >=2 matched tokens so common words ('context'->memory, 'plan'->spec, `entity-linker.ts:91`, default-ON via `SPECKIT_QUERY_CONCEPT_EXPANSION`) no longer dilute lexical precision (Agent D refinement) | Fixture: a query using 'context' or 'plan' as an ordinary word does not get force-expanded to the memory/spec canonical unless the specificity/co-token condition holds |
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
| Dependency | Phase 006 rescue-authority decision | Gates the ranking-order work: if 006 = Option A (lexical dominance kept), ADR-001/ADR-002 and #13/#14 are moot | Correctness fixes (clusters 1, 2, gate-correctness parts of 4) land either way; ranking-order changes (ADR-001 headroom, ADR-002 trigger-weight, #13, #14) are WITHDRAWN before paying R-002's threshold-migration cost if 006 = Option A |
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
- **NFR-S01**: Only tenant/user/agent scope is the hard security boundary: no row may reach results while excluded by tenant/user/agent scope, regardless of entry lane. Tier, contextType, quality, expiry, and embedding-status are recall-quality gates, NOT security gates - on the recall lanes (trigger promotion, rescue injection) they apply as soft relax/penalize rules, because hard-dropping them suppresses the legitimate recall those lanes exist for and undercuts the 026 lexical-grounding purpose.
- **NFR-S02**: LLM-facing prompt construction treats corpus content and the user query as untrusted data, not instructions: `llm-reformulation` fences seeds and the query as quoted data blocks and caps their length so seed/query text cannot alter the reformulation instruction (prompt-injection boundary; REQ-025).

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
| R-002 | Normalization headroom change shifts every downstream threshold tuned to the 1.0-pinned scale | H | M | Check the 006 decision FIRST: if 006 = Option A, withdraw ADR-001 before running the threshold inventory so the migration cost is not paid for a no-op. Otherwise ADR-001 inventories threshold consumers before the change; adversarial threshold tests |
| R-003 | Group-A fix changes flag semantics for consumers that relied on process-start reads | M | L | Toggle matrix across all six members; grep inventory of flag readers in the FIX ADDENDUM |
| R-004 | MPAB/adaptive-fusion fixes built on second-hand findings patch the wrong mechanics | M | M | T004 verify-first confirms at `mpab-aggregation.ts` and `adaptive-ranking.ts` before edits |
| R-005 | Eval harness (006) slips and blocks cluster 3 measurement | M | M | Reorder: land clusters 1-2 and 4 first; cluster 3 waits for the harness |

---

## 11. USER STORIES

### US-001: Trustworthy filters (Priority: P0)

**As a** memory-search consumer, **I want** every result row to pass the tenant/user/agent scope boundary regardless of entry lane, and tier/context/quality to shape rank rather than silently re-admit excluded rows, **so that** out-of-scope rows never leak while the trigger and rescue lanes keep surfacing the legitimate lower-tier recall they exist for.

**Acceptance Criteria**:
1. **Given** a row excluded by tenant/user/agent scope, **When** it is promoted by the trigger lane, **Then** it is hard-filtered before results are returned (the security boundary).
2. **Given** a row failing only a tier or quality gate, **When** rescue injects it at line 388, **Then** the post-rescue battery soft-penalizes it (ranks it down) rather than hard-dropping it, and scope/folder exclusion is already enforced by `buildInjectionBoundary`.

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
- Phase 006 may decide the rescue layer stays the ranking authority (Option A). If so, the ranking-order changes (ADR-001 headroom band, ADR-002 trigger-weight, #13 non-hybrid blend, #14 causal scaling) are WITHDRAWN as no-ops before paying R-002's threshold-migration cost; the correctness fixes (clusters 1, 2, gate-correctness parts of 4, cluster 5) still land. This is a hard precondition, not just an interpretation change.
- The post-normalization target value for the trigger-lane channel weight (currently 1.4 raw) is an A/B outcome, not a spec constant (ADR-002).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Sources**: `../research/deep-dive-report.md` (section 3 P1 items #5-#14, section 6 known-open Group-A), `../research/findings-ledger.md` (Agent C and D sections; Agent B pending), `../research/phase-decomposition.md` (section 007)
- **Absorbed Tracker**: `../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/` (T-0211, T-0212, REQ-214; pointer updates owned by phase 013)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
