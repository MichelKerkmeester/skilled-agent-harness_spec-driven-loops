---
title: "Tasks: Phase 007 - Ranking Filter Bypass and Score Scale Fixes"
description: "Task breakdown for the four fix clusters: Group-A flag plumbing, filter-bypass battery, score-scale battery, and gate fixes, with a verify-first group and baseline/eval-delta discipline."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale fixes"
  - "flag read root cause"
  - "verify first battery"
  - "phase 007 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T17:51:13.944Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-007-ranking-filter-bypass-and-score-scale-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 007 - Ranking Filter Bypass and Score Scale Fixes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding references cite `../research/deep-dive-report.md` section 3 numbering (#N), `../research/findings-ledger.md` agent tags (for example C P2, D P2), and ex-031 tracker IDs (T-0211, T-0212, REQ-214). Verification-status markers from the report: verified findings were live-reproduced or code-verified by the primary session; agent-verified findings require the confirm-before-fix tasks below (finding-is-a-hypothesis). Code paths are relative to `.opencode/skills/system-spec-kit/mcp_server/`.
<!-- /ANCHOR:notation -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Vitest whole-gate baseline and 006-harness eval baseline captured and stored before any code change
- [ ] The cluster's 🟡 (agent-verified) findings confirmed against current code at their cited lines (finding-is-a-hypothesis)
- [ ] Dependent ADR status checked (Proposed vs Accepted) before landing code that assumes it; Cluster 3 requires the 006 harness live

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Execute clusters in plan.md dependency order; Cluster 1 (flag plumbing) precedes the boost-verification tasks; Phase 1 gates every cluster |
| TASK-SCOPE | Touch only files listed in spec.md Files to Change; no adjacent cleanup |
| TASK-EVIDENCE | Every completed task cites its test/probe output (adversarial fixture, eval delta, or live CLI probe) in checklist.md, pinned to a SHA |
| TASK-MEASURE | Every ranking-order change reports a before/after delta on the 006 harness; no completeRecall@3 regression ships silently |

### Status Reporting Format

`T### STATUS: [DONE | IN-PROGRESS | BLOCKED] - <one-line evidence pointer>`

### Blocked Task Protocol

Mark the task `[B]` with the blocker named inline, add it to the continuity blockers list, and stop the cluster instead of working around a failed gate. If implementation evidence contradicts this spec (for example a finding fails its verify-first confirmation), escalate with the conflicting facts (logic-sync) rather than proceeding.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Baseline-before-change plus the verify-first battery for agent-verified findings. No fix task may start before its verify-first task records a confirmation note.

- [ ] T001 Capture vitest whole-gate baseline: run the mcp_server suite, record pass/fail/skip counts and failing test names (scratch/baseline-vitest.txt)
- [ ] T002 Capture eval baseline on the 006 parity harness: fixed query set, prod-mode completeRecall@3 plus rank positions; requires phase 006 harness landed (scratch/baseline-eval.json)
- [ ] T003 [P] Verify-first, cluster 1: trace Group-A flag reads for isCausalBoostEnabled, community fallback flag, and isContextHeadersEnabled; confirm process-start read or flag-blind cache key per the ex-031 root-cause hypothesis; check buildCacheArgs coverage (lib/search/search-flags.ts, lib/search/search-utils.ts)
- [ ] T004 [P] Verify-first, Agent-B items (ledger section pending, second-hand detail): confirm MPAB clamp-at-assignment (lib/scoring/mpab-aggregation.ts), adaptive-fusion divisor (lib/cognitive/adaptive-ranking.ts), keyword-lane double-count and dead 0.3/0.6 weights plus trigger 1.4 weight (lib/search/pipeline/stage2-fusion.ts), degradation-check raw-BM25 scale (lib/search/hybrid-search.ts:2652)
- [ ] T005 [P] Verify-first, cluster 2: confirm #5 minState inversion (lib/search/pipeline/stage4-filter.ts:144), #6 trigger-lane bypass (lib/search/pipeline/orchestrator.ts:125-163), #7 rescue-injection bypass (lib/search/rerank/retrieval-rescue.ts:388)
- [ ] T006 [P] Verify-first, cluster 3 remainder: confirm #8 multi-concept similarity (lib/search/vector-index-queries.ts:586), #9 raw-BM25 leak (lib/search/hybrid-search.ts:232), intentAdjustedScore pinning with surrogate threshold (D P2, stage1 surrogate boost site), parseFloat falsy-zero knobs (C P2), min-max top-pinning headroom (C P2), recency-bonus saturation (C P2)
- [ ] T007 [P] Verify-first, cluster 4: confirm #12 HyDE gate (lib/search/hyde.ts:88,134), #11 graph-FTS implicit AND (lib/search/graph-search-fn.ts:161-176), #14 causal-boost cap saturation (lib/search/causal-boost.ts:520-569), quality-gap dead fallback (lib/search/query-router.ts:316, D P2), evidence-gap n of 2 (lib/search/evidence-gap-detector.ts:283, G/B P2 - NOTE: already partially mitigated, a `stdDev===0` guard + `applyRelevanceAwareGap` wrapper exist at :282-291, so scope the fix to narrowing the residual n<=2 gap), intent-classifier patterns/keywords (lib/search/intent-classifier.ts, D P2), community injection and token matching (lib/graph/community-detection.ts:623 area, lib/search/community-search.ts:91, C/D P2); #13 is already verified and needs no confirmation pass
- [ ] T008 Record verify-first outcomes in checklist evidence: each finding confirmed or closed as not-a-bug with a quote/line citation; update tasks below to skip closed items
- [ ] T009 Dedicated T-0211 zero-symptom diagnosis (absorbed T-0211): the causal flag is already per-request (`search-flags.ts:60`) and cache-keyed (`search-utils.ts:180`), so `causalBoosted:0` is NOT the flag-read root cause; and #14 gives flat-MAX, not zero, so it is not the cap-saturation either. Trace the actual cause of the zero independently of cluster 1 and T043, record it with a code/line citation, or close not-a-bug with evidence. Gates T011 (lib/search/causal-boost.ts, telemetry emission path)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Cluster 1: Group-A flag plumbing (REQ-001 to REQ-004)

- [ ] T010 Fix the shared flag-read root cause: resolve Group-A flags per-request, or key every cached computation on live flag state, per T003 evidence (lib/search/search-flags.ts, lib/search/search-utils.ts)
- [ ] T011 [B] Apply the fix from the T009 diagnosis, then verify causal boost applies: graph-connected fixture shows causalBoosted greater than 0 and non-zero graphContribution; absorbed T-0211. BLOCKED until T009 records a root cause (do not assume the flag-plumbing fix moves the zero); if T009 closed it not-a-bug, close T011 with that evidence instead (lib/search/causal-boost.ts)
- [ ] T012 Verify community-search fallback surfaces with the flag on: stranded-query fixture returns community results; absorbed T-0212 (lib/search/community-search.ts)
- [ ] T013 Verify contextual tree headers inject in enabled/default mode: result carries the parent-child header instead of content null; absorbed REQ-214 (lib/search/hybrid-search.ts, lib/search/search-flags.ts)
- [ ] T014 Group-A toggle regression matrix: all six member flag classes (REQ-110, REQ-113, REQ-200, REQ-211, REQ-212, REQ-214) verified on/off on a warm daemon, cold start and mid-session toggle (new vitest integration suite)

### Cluster 2: Filter-bypass battery (REQ-005 to REQ-007)

- [ ] T020 Fix minState inversion: default/empty minState maps to the most permissive priority, never above HOT; unit matrix over empty/default/each-state; #5 (lib/search/pipeline/stage4-filter.ts:144)
- [ ] T021 Trigger-lane promotion (`promoteTriggerLaneRows`, appends with no re-gating today) HARD-gates tenant/user/agent scope (the security boundary), and SOFT-gates tier/contextType/quality (relax or rank-down, not hard-drop) so the lane keeps legitimate recall and does not undercut 026 lexical-grounding; #6, REQ-006, NFR-S01 (lib/search/pipeline/orchestrator.ts:125-163)
- [ ] T022 Rescue-injected rows: scope + folder are ALREADY re-applied by `buildInjectionBoundary` (retrieval-rescue.ts:353-401), so add only the residual SOFT gates - tier, contextType, quality, expiry, embedding-status as relax/penalize, not hard-drop; #7, REQ-007 (lib/search/rerank/retrieval-rescue.ts:388)
- [ ] T023 Adversarial bypass battery: per entry lane, a row excluded by tenant/user/agent SCOPE stays hard-excluded regardless of entry lane; a row failing only a SOFT gate (tier/contextType/quality/expiry/embedding-status) is retained but ranked down, not silently dropped and not silently admitted at full rank (new vitest fixtures)

### Cluster 3: Score-scale battery (REQ-009 to REQ-017)

- [ ] T030 Map similarity/score for multi-concept search rows so they rank by relevance instead of recency/hash; #8 (lib/search/vector-index-queries.ts:586)
- [ ] T031 toHybridResult emits fused-scale scores, not raw BM25; degradation-widening check reads the rrfScore scale so it can fire; #9 plus B P2 (lib/search/hybrid-search.ts:232, lib/search/hybrid-search.ts:2652)
- [ ] T032 Keyword-lane dedupe when BM25 delegates to FTS5; wire or delete the dead 0.3/0.6 channel weights per ADR-002 disposition; B P2 (lib/search/pipeline/stage2-fusion.ts)
- [ ] T033 Adaptive-fusion divisor fix and trigger 1.4 weight routed through fusion normalization per ADR-002; B P2 (lib/cognitive/adaptive-ranking.ts, lib/search/pipeline/stage2-fusion.ts)
- [ ] T034 MPAB clamp-at-assignment fix so aggregation grades below the cap; B P2, per T004 evidence (lib/scoring/mpab-aggregation.ts)
- [ ] T035 resolveEffectiveScore pinning contract: surrogate boost respects MIN_MATCH_THRESHOLD and stops pinning intentAdjustedScore for later stages; D P2 (lib/search/pipeline/stage2-fusion.ts and stage1 surrogate site per T006)
- [ ] T036 parseFloat falsy-zero knobs accept explicit 0: GRAPH_WEIGHT_CAP, RECENCY_FUSION_WEIGHT, RECENCY_FUSION_CAP, smartRanking.recencyWeight; C P2 (flag/config parse sites per T006)
- [ ] T037 Normalization headroom per ADR-001: sub-1.0 band AND headroom-proportional rescale of the additive learned boost at `stage2-fusion.ts:843` (currently `Math.min(1.0, currentScore + learnedBoost)` with +0.7 from `learned-feedback.ts:75`) so two boosted rows no longer both clamp to a 1.0 re-tie; inventory threshold consumers first per FIX ADDENDUM. 006-gated: skip entirely if 006 = Option A; C P2 (lib/search/pipeline/stage2-fusion.ts)
- [ ] T038 Recency bonus graduates instead of flat cap-saturation under 10 days; C P2 (recency bonus site per T006)

### Cluster 4: Gate fixes (REQ-018 to REQ-024)

- [ ] T040 HyDE gate compares absolute relevance, not min-max normalized scores; gate-fire and gate-hold fixtures; #12 (lib/search/hyde.ts:88,134)
- [ ] T041 Graph channel FTS matches OR over tokens with stopword handling so verbose queries return graph candidates; #11 (lib/search/graph-search-fn.ts:161-176)
- [ ] T042 Non-hybrid step-4 intent weighting blends with prior boosts instead of recomputing from raw similarity; #13, verified. RANKING-ORDER change: 006-gated with cluster 3, measured on the 006 harness, NOT shipped direct; withdrawn if 006 = Option A (lib/search/pipeline/stage2-fusion.ts:1311-1318)
- [ ] T043 Causal-boost typed traversal graduates below the 0.20 cap so relation priors and hop decay differentiate neighbors; #14. RANKING-ORDER change: 006-gated with cluster 3, NOT direct; withdrawn if 006 = Option A. Distinct from the T-0211 zero symptom (T009): #14 produces flat-MAX values, not zero (lib/search/causal-boost.ts:520-569)
- [ ] T044 Quality-gap fallback: wire a production qualitySignal caller or delete the dead plan and its doc claims together; D P2 (lib/search/query-router.ts:316)
- [ ] T045 Evidence-gap detector: narrow the RESIDUAL n<=2 gap. The `stdDev===0` guard + `applyRelevanceAwareGap` wrapper already exist (:282-291); confirm what n<=2 case still auto-flags a degenerate Z-score and close only that gap, or close not-a-bug if the existing guard already covers it; G/B P2 (lib/search/evidence-gap-detector.ts:283)
- [ ] T046 Intent classifier: article-optional understand patterns, word-boundary keyword matching, per-match normalization; memory_context intent forwarding respects the confidence floor; D P2 plus E P2 (lib/search/intent-classifier.ts, memory_context forwarding site)
- [ ] T047 Community fixes: injection existence check, effective-score base, communityDelta recording, and token-boundary matching in community search; C/D P2 (lib/graph/community-detection.ts:623 area, lib/search/community-search.ts:91)

### Cluster 5: Absorbed silent-drop findings (REQ-025 to REQ-029)

Routed from the plan-review Systemic #4 drop list. Each keeps a verify-first confirmation; independent of the harness.

- [ ] T060 SECURITY - llm-reformulation hardening: fence seeds AND the raw query as quoted data blocks and cap their length in `buildReformulationPrompt` (:149-177); cap abstract/variant length in `parseReformulationResponse`; move `isLlmReformulationEnabled()` before the `cache.get` (currently :356 before :363); cache a short-TTL negative sentinel on outage so the 8s timeout does not re-stall every call; REQ-025, NFR-S02 (lib/search/llm-reformulation.ts)
- [ ] T061 parseCandidateLine word-boundary match: replace unbounded `lower.indexOf(kw)` (:159) with a `\b`-anchored token match so "only" no longer matches inside "Commonly" and malformed directives stop reaching the LLM; REQ-026 (lib/search/retrieval-directives.ts:156-171)
- [ ] T062 session-boost attentionScore preservation: leave `attentionScore` undefined when the row has none instead of writing the boosted `finalScore` into the alias (:178); keep `sessionBoostScore` as the boosted-value carrier; REQ-027 (lib/search/session-boost.ts:178)
- [ ] T063 constitutional recency tier-order: `computeRecencyScore` returns a perpetual 1.0 for constitutional regardless of age (:139-141) while critical decays - resolve the recency-channel tier-order (bounded exemption or tier-consistent decay), recording the choice; REQ-028 (shared/scoring/folder-scoring.ts:138-141, consumed via lib/scoring/folder-scoring.ts)
- [ ] T064 concept-alias specificity: add a per-alias specificity weight or a >=2-matched-token requirement so common words ('context'->memory :96, 'plan'->spec :113) in `BUILTIN_CONCEPT_ALIASES` (default-ON via SPECKIT_QUERY_CONCEPT_EXPANSION) no longer dilute lexical precision; REQ-029 (lib/search/entity-linker.ts:91-114)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T050 Adversarial regression battery green: one failing-before/passing-after test per fixed bypass and gate (T023 battery plus per-gate fixtures)
- [ ] T051 Re-run the whole vitest gate; report delta against T001 baseline; zero unexplained regressions
- [ ] T052 Re-run the 006 parity harness eval; report delta against T002 baseline; no prod-mode completeRecall@3 regression
- [ ] T053 Telemetry truthfulness check: causalBoosted, communityDelta, and graphContribution non-zero on boost fixtures, zero on non-boost fixtures
- [ ] T054 Update stage2/search documentation notes where score semantics changed; any signal intentionally left non-influential gets an explicit doc note (respect the 006 signal-ordering contract)
- [ ] T055 Flag disposition per ADR-003: the single ranking-order flag guards ADR-001 (headroom band + boost rescale), ADR-002 (trigger weight), the recency curve, AND cluster 4's #13/#14. If 006 = Option A the whole group is withdrawn, not flipped on. Otherwise, after a clean eval-delta flip the default and schedule flag removal; record the decision in decision-record.md status updates
- [ ] T056 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict`, complete checklist.md with evidence, and write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Baseline and eval-delta artifacts exist and are cited in checklist evidence
- [ ] Group-A toggle matrix and adversarial bypass battery pass
- [ ] Manual verification passed (live CLI probes for T-0211/T-0212/REQ-214 symptom disappearance)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md` (ADR-001 headroom, ADR-002 trigger weight, ADR-003 flags/rollout)
- **Research**: `../research/deep-dive-report.md`, `../research/findings-ledger.md`, `../research/phase-decomposition.md`
- **Absorbed tracker**: `../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/` (T-0211, T-0212, REQ-214; pointers updated by phase 013)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
