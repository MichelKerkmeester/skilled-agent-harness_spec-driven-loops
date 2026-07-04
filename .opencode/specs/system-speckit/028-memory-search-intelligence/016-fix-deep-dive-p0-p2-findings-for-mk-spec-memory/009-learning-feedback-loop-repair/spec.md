---
title: "Feature Specification: Phase 9: Learning Feedback Loop Repair"
description: "Repair the memory learning loop so usage signals accumulate: access tracking on cache hits, FSRS timestamp integrity, learned-term expiry, batch-learning sign and idempotency, promotion demotion with hysteresis, retention snapshot fix and bounded feedback ledgers."
trigger_phrases:
  - "learning feedback loop repair"
  - "track access cache hits"
  - "auto promotion demotion hysteresis"
  - "learned feedback expiry cap"
  - "batch learning reformulation negative"
  - "retention spare-only stale snapshot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-04T14:09:13.269Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped 16 REQs across the learning loop; 767 tests green; trackAccess stays default-off"
    next_safe_action: "Phase 010 search-hot-path-performance"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-009-learning-feedback-loop-repair-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Retention age policy per ledger (default 90d, high-volume 30d?) decided during execution"
      - "Does phase 003 land prediction-error-gate init first, leaving 009 verify-only?"
      - "Enable trackAccess on prod/auto-surface path (phase 010 latency)? T041 decides; not forced here"
    answered_questions:
      - "Absorbs 028/006/002 P1-5 (retention spare-only stale snapshot); phase 013 updates old tracker pointers"
      - "REWORK: P1-5 already fixed (memory-retention-sweep.ts:666); REQ-006 verify-first-then-test, not P0"
      - "REWORK: trackAccess default-off (memory-search.ts:909), zero prod enablers; learning fixes preventive/latent via synthetic fixtures, not the 65/33,101 number"
      - "REWORK: absorbed 3 routed findings — working-memory decay (#20), dashboard mislabel+eval_run_id=0 (G P2), FSRS hybrid ordering (C CONTRACT)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: Learning Feedback Loop Repair

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (REWORK remediated) |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 13 |
| **Predecessor** | 008-causal-graph-hygiene-and-entity-linker-noise |
| **Successor** | 010-search-hot-path-performance |
| **Handoff Criteria** | P0 requirements (REQ-001..REQ-005) verified with tests, absorbed P1-5 interleaving test proves the existing re-validation, ledger sweeps proven on injected fixtures, promotion/demotion cycle test green, `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Deep dive remediation phase children specification.

**Scope Boundary**: Learning and feedback subsystems of `mk-spec-memory` only — access tracking, FSRS review metadata, learned-feedback terms, batch learning, corrections, auto-promotion/demotion, retention sweep re-validation, feedback-ledger retention, shadow evaluation labels, true-citation detection, quality-loop scoring, and the prediction-error audit init. No ranking-authority changes (phase 006), no PE-gate lane reachability changes (phase 003), no hot-path performance work (phase 010).

**Dependencies**:
- Phase 011 (daemon freshness) precedes all phases in the recommended execution order, giving this phase a trustworthy CLI/daemon surface.
- Phase 003 owns PE-gate UPDATE/REINFORCE reachability (report #26) and may land the prediction-error-gate init wiring first; T027 verifies before wiring.
- Phase 006 owns eval parity (ablation DB-swap half of report #25); shadow-eval fixes here stay measurable through that harness.
- Absorbs 028/006-review-remediation/002-memory-schema-and-concurrency item P1-5. Verify-first: the re-validation ALREADY ships in code (`memory-retention-sweep.ts:666` calls `revalidateSpareOnlyRetention` on the fresh in-transaction row before DELETE, rationale comment :660-665), so this collapses to writing the interleaving test that proves the existing behavior; phase 013 updates the old tracker's pointers.
- Absorbs three routed silent-drop findings from the plan-review §4 sweep (previously unowned or orphaned to the code-less phase 013): working-memory decay double-apply (report #20), eval-dashboard latency mislabel + `eval_run_id=0` (Agent G P2), and FSRS hybrid-decay ordering (Agent C CONTRACT).

**Deliverables**:
- Access tracking that fires on cached search responses when `trackAccess` is enabled (preventive/latent: `trackAccess` is default-off with zero production enablers, so this restores the mechanism, not the organic fuel number).
- FSRS `last_review` written in one ISO-8601 UTC format and not refreshed by empty metadata calls.
- Expiry-aware learned-term cap with `expireLearnedTerms`/`clearAllLearnedTriggers` wired into `/memory:manage`.
- Batch learning that counts reformulation as negative, aggregates in SQL, and is idempotent per (memory, window).
- Corrections that no-op on active-pair retries and undo by delta.
- Auto-promotion with a demotion path, hysteresis, per-memory throttle, and batched negative counts.
- Interleaving test proving the EXISTING retention spare-axis in-transaction re-validation (absorbed P1-5, already at `memory-retention-sweep.ts:666`) plus extend-window widening.
- Age-based retention sweeps for the seven unbounded feedback/audit ledgers, proven on injected aged fixtures rather than organic volume.
- Shadow evaluation with query-scoped labels or explicitly unlabeled cycles, and empty-holdout non-recording.
- True-citation regex fixes (>=2-digit bare ids, 2-of-3 word anchor subset) with session-scoped uniqueness.
- Quality-loop bestScore/bestContent pairing, an honest fix log, and a real sprint/run id instead of `eval_run_id=0`.
- Prediction-error-gate audit init verified or wired.
- Working-memory decay corrected so repeated passes stop re-applying full decay and re-adding the mention boost (attention no longer degenerates to binary).
- Eval-dashboard trend direction fixed for `ablation_latency_*` metrics (rising latency read as regression, not improvement).
- FSRS hybrid-decay policy no longer combined with classification decay inside `applyClassificationDecay` (classification flag checked first; latent-safe).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory learning loop is starved of usage signal: only 65 of 33,101 index rows have ever recorded an access, and `trackAccess` is default-off (`memory-search.ts:909`) with zero production enablers, so the loop receives almost no fuel today. That makes every fix here **preventive/latent** — validated via synthetic fixtures, not organic strengthening on the 65/33,101 number. Deep-dive Chain E traced the latent defects that would still block learning once fuel flows: `trackAccess` is silently dropped on cache hits even when enabled, FSRS `last_review` mixes timestamp formats and is refreshed by no-op metadata calls, the learned-term cap counts expired terms so memories permanently stop learning after their first 8 terms age out, batch learning counts the `query_reformulated` dissatisfaction signal as a positive boost and double-inserts windows on restart, corrections compound penalties on retry and undo restores stale absolute values, and auto-promotion has no demotion path or hysteresis. Around the loop, seven feedback/audit ledgers have no age-based retention, shadow evaluation grades against query-independent labels, true-citation regexes count "8" in "8 packets" as a citation, the quality loop returns bestContent paired with the last attempt's score, and the prediction-error audit was never initialized. The absorbed P1-5 retention snapshot defect is **already fixed in code** (`memory-retention-sweep.ts:666` re-validates the fresh in-transaction row before DELETE), so it needs a proving test rather than a code fix. Three routed silent-drop findings are now owned here: working-memory attention decay is re-applied in full and the mention boost re-added each pass (`working-memory.ts:601-616`), the eval dashboard mislabels rising `ablation_latency_*` as improved and stamps every quality-loop snapshot `eval_run_id=0` (`quality-loop.ts:729`), and the FSRS hybrid-decay policy (default-ON) runs inside `applyClassificationDecay` before the classification flag check, combining two policies the code says must stay separate.

### Purpose
Make the loop capable of learning: repeated use strengthens memories, dissatisfaction weakens them, promotion and demotion cycle safely under hysteresis, retention deletes only what fresh in-transaction state allows, and every learning ledger stays bounded. Because `trackAccess` is default-off with no production enablers, these are preventive/latent repairs proven via synthetic fixtures; a separate decision (task T041) evaluates whether to enable `trackAccess` on the prod/auto-surface path, coordinated with phase 010's latency budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `trackAccess` on cache hits: the cached-response path in `handlers/memory-search.ts` (report cite memory-search.ts:1230) returns without tracking, and `buildCacheArgs` omits the flag (Chain E, agent B P2). Preventive/latent — `trackAccess` is default-off (`memory-search.ts:909`) with zero production enablers, so the fix is validated via a synthetic fixture that forces the flag on, not organic strengthening.
- FSRS `last_review` integrity: single ISO-8601 UTC write format (agent C P2: `CURRENT_TIMESTAMP` space-form parsed as local time) and no refresh on empty `applyPostInsertMetadata` calls (agent H OPT).
- Learned feedback: expiry-aware 8-term cap (report #27, `learned-feedback.ts:381`) and wiring `expireLearnedTerms`/`clearAllLearnedTriggers` into `/memory:manage`; age-based sweep honors the shadow-period MIN(timestamp) caveat (agent G).
- Batch learning: reformulation weighted as negative (report #25 batch half, `batch-learning.ts:314`), per-(memory, window) idempotency key (restart double-count, `batch-learning.ts:472`), and SQL-side aggregation (G P1/P2/OPT).
- Corrections: active-pair retry becomes a no-op instead of compounding the 0.25x penalty, and undo applies deltas instead of restoring stale absolutes (G P2, `lib/learning/corrections.ts`).
- Auto-promotion: demotion path with hysteresis, per-memory throttle replacing the global 3-per-8h throttle, and batched negative-feedback counts (G refinement/OPT, `lib/search/auto-promotion.ts`).
- Absorbed P1-5 (verify-first-then-close): the retention spare-only delete ALREADY re-validates `importance_weight`/`quality_score`/`retention_trust_score`/`created_at` inside the transaction before the delete — `memory-retention-sweep.ts:666` calls `revalidateSpareOnlyRetention(currentCandidate)` on the fresh in-tx row with a rationale comment (:660-665). Scope collapses to writing the interleaving test that proves this existing behavior, plus retention extend-window widening beyond the 7-day view (G refinement). No change to the re-validation logic.
- Working-memory attention decay (absorbed report §3 P1 #20, `lib/cognitive/working-memory.ts:601-616`): each `batchUpdateScores` pass re-applies full event-distance decay to the stored `attention_score` and re-adds the mention boost, so attention degenerates toward binary. Separate the decay base from the re-added boost so repeated passes stay stable. Validated via a multi-pass fixture.
- Eval-dashboard trend direction (absorbed, findings-ledger Agent G P2, `lib/eval/reporting-dashboard.ts:179-181`): the `latency` prefix check fails on `ablation_latency_*` so rising latency is labeled "improved"; and quality-loop snapshots are written with `eval_run_id=0` (`handlers/quality-loop.ts:729`) so every run collapses to an eternal "run-0" sprint. Match latency/inversion by exact metric or `_latency`/`_ms` suffix and give quality snapshots a real sprint/run id.
- FSRS hybrid-decay policy ordering (absorbed, findings-ledger Agent C CONTRACT, `lib/cognitive/fsrs-scheduler.ts`): `isHybridDecayPolicyEnabled()` is default-ON and `applyClassificationDecay` runs the hybrid NO_DECAY branch (:351) before the classification flag check (:356), combining two policies the code comment says must stay separate. Check the classification flag first and never combine both policies on one memory. Latent while the composite five-factor consumer is dead, but fixed here.
- Decision-record (no code): evaluate enabling `trackAccess` on the prod/auto-surface path, coordinated with phase 010's latency budget; record a recommendation. This phase does NOT force-enable `trackAccess`.
- Age-based retention sweeps for the seven unbounded ledgers: `feedback_events`, `shadow_scoring_log`, `batch_learning_log`, `learned_feedback_audit`, `memory_promotion_audit`, `memory_conflicts`, `adaptive_signal_events` (G P2, C OPT).
- Shadow evaluation: query-scoped relevance labels or explicitly unlabeled cycles, and empty-holdout cycles not recording NDCG (G P2).
- True-citation: bare-id regex requires >=2 digits, anchor match relaxed to a 2-of-3 word subset, and citation uniqueness scoped per session (G P2/refinement, `true-citation-emitter.ts`).
- Quality loop: `bestScore` tracked with `bestContent` so the returned pair matches, and the auto-fix log reports what actually changed (G P2, `handlers/quality-loop.ts`).
- Prediction-error-gate `init(db)` wiring so the T-09 audit is live (G CONTRACT); verify-first because phase 003 scope also names it.

### Out of Scope
- PE-gate UPDATE/REINFORCE lane reachability (report #26) - owned by phase 003 (same Chain E narrative, different fix surface).
- Ablation DB-swap and eval-parity (the `eval-reporting.ts:138` half of report #25) - owned by phase 006 Task 1.
- Rescue-layer ranking authority (learned boosts compressed to <=3.7% of final score) - owned by the phase 006 decision; this phase repairs signal production, not ranking consumption.
- Search hot-path performance work - owned by phase 010; this phase only avoids regressing it.
- Force-enabling `trackAccess` on the production/auto-surface path - out of scope for this phase; task T041 records a decision only, coordinated with phase 010's latency budget.
- Pointer/status updates inside 028/006-review-remediation/002 - owned by phase 013 closeout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-search.ts` | Modify | Track access on the cached-response path; include tracking intent in cache handling |
| `mcp_server/lib/search/search-utils.ts` | Modify | `buildCacheArgs` omission - carry or bypass `trackAccess` so cache hits still track |
| `mcp_server/lib/search/fsrs.ts` | Modify | Parse/write `last_review` in one ISO-8601 UTC format; migration-safe dual-parse for mixed rows |
| `mcp_server/lib/storage/post-insert-metadata.ts` | Modify | Skip `last_review` refresh on empty metadata calls |
| `mcp_server/lib/cognitive/tier-classifier.ts` | Investigate | Confirms which writer emits the space-form `CURRENT_TIMESTAMP` value |
| `mcp_server/lib/search/learned-feedback.ts` | Modify | Expiry-aware 8-term cap; expiry/clear maintenance entry points; `learned_feedback_audit` sweep |
| `mcp_server/lib/feedback/batch-learning.ts` | Modify | Reformulation negative sign, per-(memory, window) idempotency, SQL aggregation, `batch_learning_log` sweep |
| `mcp_server/lib/learning/corrections.ts` | Modify | Active-pair retry no-op; delta-based undo |
| `mcp_server/lib/search/auto-promotion.ts` | Modify | Demotion path, hysteresis, per-memory throttle, batched negative counts, `memory_promotion_audit` sweep |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modify | Absorbed P1-5 in-tx re-validation ALREADY ships (`:666`) — verify + interleaving test only, no change to it; add extend-window widening |
| `mcp_server/lib/cognitive/working-memory.ts` | Modify | Separate event-distance decay base from the re-added mention boost so repeated passes don't degenerate attention to binary (absorbed §3 P1 #20) |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Modify | Trend-direction match for `ablation_latency_*` (lower-is-better); sprint/run labeling for quality-loop snapshots (absorbed Agent G P2) |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Modify | Check classification flag before the hybrid NO_DECAY branch; never combine both decay policies (absorbed Agent C CONTRACT) |
| `mcp_server/lib/feedback/feedback-ledger.ts` | Modify | Age-based sweep for `feedback_events` |
| `mcp_server/lib/feedback/shadow-scoring.ts` | Modify | `shadow_scoring_log` sweep with shadow-period MIN(timestamp) guard |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modify | Query-scoped labels or unlabeled cycles; empty-holdout non-recording |
| `mcp_server/lib/feedback/true-citation-emitter.ts` | Modify | >=2-digit bare-id regex, 2-of-3 anchor word subset, session-scoped uniqueness |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Modify | Age-based sweep for `adaptive_signal_events` |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Age policy for `memory_conflicts`; additive schema only |
| `mcp_server/handlers/quality-loop.ts` | Modify | `bestScore`/`bestContent` pairing; honest fix log; write a real sprint/run id instead of `eval_run_id=0` (absorbed Agent G P2) |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Modify | `init(db)` wiring so the audit records (verify phase 003 first) |
| `.opencode/commands/memory/manage.md` | Modify | Document the learned-term expiry/clear and ledger-sweep maintenance actions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Access tracking fires on cache hits (preventive/latent) | With `trackAccess` forced on in a synthetic fixture, a repeated identical `memory_search` served from cache updates access metadata for returned rows; regression test covers the cached path. `trackAccess` is default-off (`memory-search.ts:909`) with zero production enablers, so this proves the mechanism, not organic strengthening |
| REQ-002 | FSRS `last_review` integrity | All new writes use one ISO-8601 UTC format; mixed legacy rows parse correctly; an empty `applyPostInsertMetadata` call leaves `last_review` unchanged |
| REQ-003 | Expiry-aware learned-term cap with wired maintenance | A memory whose 8 learned terms are all expired accepts new terms; `expireLearnedTerms` and `clearAllLearnedTriggers` are invocable via `/memory:manage` |
| REQ-004 | Batch learning sign, idempotency, and SQL aggregation | `query_reformulated` lowers computed boost; re-running the same window inserts no duplicate rows; aggregation happens in SQL, not per-row JS |
| REQ-005 | Promotion/demotion cycle with hysteresis | Sustained negative signals demote a promoted memory; hysteresis prevents flapping at the boundary; throttle is per-memory; negative counts fetched batched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Absorbed P1-5 retention snapshot — verify-first-then-close | The re-validation ALREADY ships (`memory-retention-sweep.ts:666` calls `revalidateSpareOnlyRetention` on the fresh in-tx row before DELETE, rationale comment :660-665). Deliverable is the interleaving test proving the existing behavior: a concurrent protection raise survives the spare-only sweep. No change to the re-validation logic |
| REQ-007 | Bounded feedback ledgers | All seven ledgers have age-based sweeps with documented policies, proven on injected aged fixtures; `shadow_scoring_log` sweep never removes rows inside the active shadow period (MIN(timestamp) caveat) |
| REQ-008 | Shadow evaluation honesty | Cycles without query-scoped labels are recorded as unlabeled; empty-holdout cycles record no NDCG/promotion signal |
| REQ-009 | True-citation precision | Bare-id matches require >=2 digits ("8 packets" is not a citation); anchors match on a 2-of-3 word subset; uniqueness is session-scoped; table tests cover false-positive and false-negative cases |
| REQ-010 | Corrections idempotency and delta undo | Re-applying an active correction pair is a no-op; undo reverses by delta and never restores stale absolute values |
| REQ-011 | Quality-loop score/content pairing | Rejection responses return `bestContent` with the score of that same attempt; the fix log lists only changes actually applied |
| REQ-012 | Prediction-error audit live | `prediction-error-gate.init(db)` is called at startup (by phase 003 or here); audit rows are written on gating decisions |
| REQ-013 | Retention extend-window widening | The retention extend decision sees usage beyond the current 7-day window per the agent G refinement |
| REQ-014 | Working-memory decay stability (absorbed §3 P1 #20) | Repeated `batchUpdateScores` passes do not re-apply full decay to the stored score and re-add the mention boost each pass; a multi-pass fixture shows attention does not degenerate to binary (`working-memory.ts:601-616`) |

### P2 - Refinement (optional; telemetry/latent, absorbed silent-drops)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | Eval dashboard trend direction + sprint labeling | `ablation_latency_*` is treated as lower-is-better (not "improved" when rising); quality-loop snapshots carry a real sprint/run id instead of `eval_run_id=0` (`reporting-dashboard.ts:179-181`, `quality-loop.ts:729`); a direction/label table test covers both cases |
| REQ-016 | FSRS hybrid-decay not combined with classification decay | `applyClassificationDecay` checks the classification flag before the hybrid NO_DECAY branch and never applies both policies to one memory (`fsrs-scheduler.ts:346-367`); latent-safe while the composite consumer is dead |

### Acceptance Scenarios

1. **Given** a warm search cache with `trackAccess` enabled, **When** the same query is issued twice, **Then** the second (cached) response still increments access metadata for its rows (REQ-001).
2. **Given** a memory whose 8 learned terms have all expired, **When** new positive feedback arrives for a term, **Then** the term is learned instead of silently dropped (REQ-003).
3. **Given** a window containing a `query_reformulated` event for a memory, **When** batch learning aggregates it, **Then** that memory's computed boost is lower than without the event (REQ-004).
4. **Given** a window already aggregated before a daemon restart, **When** batch learning runs again over the same window, **Then** no duplicate `batch_learning_log` rows are inserted (REQ-004).
5. **Given** a promoted memory receiving sustained negative feedback, **When** the promotion job runs, **Then** the memory is demoted, and a single borderline signal inside the hysteresis band does not flip it back (REQ-005).
6. **Given** a concurrent writer raising `retention_trust_score` above threshold after the sweep's pre-transaction snapshot, **When** the spare-only delete transaction commits, **Then** the row survives — the interleaving test proves the re-validation already shipped at `memory-retention-sweep.ts:666` (REQ-006).
7. **Given** a working-memory row updated across many prompts with steady mentions, **When** `batchUpdateScores` runs each pass, **Then** its attention score stays in a stable mid-range rather than snapping to `DECAY_FLOOR` or `1.0` (REQ-014).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cache-hit tracking mechanism is proven via a synthetic probe (a fixture that forces `trackAccess` on): a repeated cached `memory_search` increments access metadata and FSRS state for the returned rows. This is a preventive/latent fix — `trackAccess` is default-off (`memory-search.ts:909`) with zero production enablers, so it cannot move the organic fuel number (65 of 33,101 rows ever accessed on 2026-07-03) until enablement is decided (see Open Questions / task T041).
- **SC-002**: A scripted promotion/demotion cycle test passes: promote on positive signals, demote on sustained negatives, no flapping inside the hysteresis band.
- **SC-003**: Ledger sweeps are proven via INJECTED fixtures, not organic volume — at 65 lifetime accesses the live ledgers are near-empty, so the test injects aged synthetic rows and asserts each age policy removes them (before/after counts on the injected set), with the `shadow_scoring_log` MIN(timestamp) guard proven.
- **SC-004**: The absorbed P1-5 interleaving test proves the EXISTING re-validation (`memory-retention-sweep.ts:666`): a concurrently protected row is not deleted by the spare-only sweep.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 with the checklist marked with evidence.
- **SC-006**: The three absorbed routed findings are proven via synthetic fixtures: a multi-pass working-memory fixture shows attention stays stable (not binary); a dashboard direction table test labels rising `ablation_latency_*` as regression and gives snapshots a non-zero sprint id; an FSRS ordering test shows the classification flag short-circuits before the hybrid branch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tracking on cache hits adds a write to a hot read path | Could regress the phase 010 latency targets | Batch or debounce access writes; measure p50 before/after against the Phase 1 baseline |
| Risk | Demotion path could oscillate tiers | Ranking churn and audit noise | Hysteresis band plus per-memory throttle; cycle test asserts no flapping |
| Risk | Ledger sweeps delete rows feeding the active shadow evaluation | Shadow metrics silently degrade | Shadow-period MIN(timestamp) guard; sweeps ship with a dry-run mode first |
| Risk | `last_review` format migration mis-parses legacy rows | FSRS decay skew worsens | Dual-parse (space-form UTC and ISO) during migration; normalize on write only |
| Risk | Absorbed P1-5 re-validation already ships and is flag-gated (`SPECKIT_RETENTION_FORGETTING_V1`) | Existing fix unverifiable by accident | Deterministic interleaving test forces the concurrent-writer timing to prove the current behavior |
| Risk | `trackAccess` default-off makes the learning fixes latent | Fixes could bit-rot before enablement | Synthetic-fixture tests lock each mechanism; task T041 tracks prod enablement with phase 010 |
| Dependency | Phase 003 (PE audit init overlap) | Double-wiring or missed wiring of `init(db)` | T027 verifies current state before wiring |
| Dependency | Phase 006 eval-parity harness | Shadow-eval changes unmeasurable until parity lands | Fixes are behavior-local with unit tests; harness comparison follows 006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable regression to warm `memory_search` latency from cache-hit tracking (compare p50 against the Phase 1 baseline; phase 010 targets p50 < 800ms warm at 33k rows).
- **NFR-P02**: Ledger sweeps and batched negative-count queries run bounded (indexed age columns or timestamp predicates, no full-table JS scans).

### Security
- **NFR-S01**: Maintenance actions (`expireLearnedTerms`, `clearAllLearnedTriggers`, ledger sweeps) are exposed only through `/memory:manage`, never from prompt-time hooks.
- **NFR-S02**: Sweeps delete derived telemetry only - no canonical spec-doc content, no `memory_index` rows.

### Reliability
- **NFR-R01**: All schema changes are additive and migration-safe; mixed `last_review` formats remain readable throughout the rollout.
- **NFR-R02**: Fixes to default-ON behavior ship direct per the program flag rule; learning-behavior changes stay observable via their audit ledgers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Exactly 8 live terms at the cap: the 9th term is still rejected; only expired terms free capacity.
- Bare ids in prose ("8 packets", "3 of 5"): single-digit tokens never count as citations; 2-digit ids like "28" require the id context the regex defines.
- Empty metadata call: `applyPostInsertMetadata({})` must not touch `last_review`.

### Error Scenarios
- Batch-learning window interrupted mid-aggregation by restart: the idempotency key makes the re-run insert-or-skip, never double-insert.
- Correction undo after multiple corrections on the same pair: delta-based undo reverses only its own contribution.
- Empty shadow holdout: the cycle records no NDCG and does not feed the promotion gate.

### State Transitions
- Promotion at the hysteresis boundary: a memory just above the demote threshold stays put until the band is crossed.
- Sweep during active shadow period: rows newer than the shadow window's MIN(timestamp) survive regardless of age policy.
- Concurrent protection raise during the retention transaction: the fresh in-tx re-read wins over the pre-transaction snapshot (absorbed P1-5).
- Working-memory across many prompts: repeated `batchUpdateScores` passes keep attention within [DECAY_FLOOR, 1.0] without snapping to the bounds (absorbed §3 P1 #20).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | ~21 lib/handler files plus one command doc; additive schema only; three absorbed routed findings |
| Risk | 13/25 | Governance deletes and default-path learning writes, but no ranking-authority changes |
| Research | 11/20 | Findings are agent-verified (🟡) with quoted code; verify-first tasks confirm lines before fixes |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Retention age policy per ledger: default 90 days with a shorter window for high-volume `feedback_events` (~20 rows/search, default ON)? Decided during execution with the operator; sweeps ship dry-run first either way.
- Hysteresis thresholds: constants with env override on first pass, or config from day one? Proposal: constants with env override.
- Prediction-error-gate init: if phase 003 already wired it by execution time, T027 downgrades to verify-only. Confirm at Phase 1.
- trackAccess enablement: should the prod/auto-surface path enable `trackAccess` (coordinated with phase 010's latency budget)? Task T041 evaluates and records a recommendation; this phase does NOT force-enable it.
<!-- /ANCHOR:questions -->
