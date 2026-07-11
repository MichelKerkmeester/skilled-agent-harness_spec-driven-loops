---
title: "Implementation Plan: Phase 9: Learning Feedback Loop Repair"
description: "Verify-first repair of the mk-spec-memory learning loop: access tracking on cache hits, FSRS timestamp integrity, learned-term expiry, batch-learning idempotency, promotion demotion hysteresis, retention snapshot re-validation and age-based ledger sweeps."
trigger_phrases:
  - "learning feedback loop repair plan"
  - "track access cache hits"
  - "auto promotion demotion hysteresis"
  - "feedback ledger retention sweep"
  - "batch learning idempotency"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-04T17:51:10.586Z"
    last_updated_by: "markdown-agent"
    recent_action: "Remediated REWORK: verify-first P1-5, preventive trackAccess/ledger, absorbed 3 routed findings"
    next_safe_action: "Run Phase 1 baseline capture and verify-first tasks (T002-T009, T035-T037) before changing code"
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
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: Learning Feedback Loop Repair

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | TypeScript (Node 20+, compiled dist), CommonJS runtime |
| **Framework** | None - MCP server handlers + lib modules under `.opencode/skills/system-spec-kit/mcp_server/` |
| **Storage** | SQLite via better-sqlite3 (memory index DB, feedback/audit ledger tables) |
| **Testing** | vitest (unit + integration), read-only SQL probes against the live DB for baselines |

### Overview
Repair the learning/feedback defect clusters identified by deep-dive Chain E and the agent G ledger, plus the absorbed P1-5 retention item from 028/004-review-remediation/002 and three routed silent-drop findings (working-memory decay, dashboard mislabel, FSRS hybrid-decay). The approach is verify-first (every 🟡 finding gets a confirm-before-fix task), then small surgical fixes per cluster with unit tests, then proof via synthetic fixtures that the loop CAN learn once fueled: cache-hit strengthening with `trackAccess` forced on (it is default-off with zero production enablers, so this is preventive/latent), a promotion/demotion cycle, and ledger sweeps proven on injected aged rows rather than organic volume (the live ledgers are near-empty at 65 of 33,101 rows ever accessed). The absorbed P1-5 re-validation already ships in code (`memory-retention-sweep.ts:666`), so it collapses to a proving interleaving test, not a code fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md sections 2-3)
- [ ] Success criteria measurable (spec.md SC-001..SC-005)
- [ ] Dependencies identified (phases 003/006 overlaps, `SPECKIT_RETENTION_FORGETTING_V1` flag)

### Definition of Done
- [ ] All P0 acceptance criteria met with tests (REQ-001..REQ-005); absorbed P1-5 (REQ-006) verify-first with its interleaving test
- [ ] Whole vitest gate re-run and delta reported against the Phase 1 baseline
- [ ] Docs updated (spec/plan/tasks/checklist synchronized; changelog refreshed per parent convention)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Existing layered MCP server: handlers (tool surface) -> lib modules (search, feedback, learning, cognitive, governance) -> better-sqlite3 storage. No new architecture; fixes land inside the owning module of each defect.

### Key Components
- **Access/FSRS fuel**: `handlers/memory-search.ts` cached-response path + `lib/search/search-utils.ts` (`buildCacheArgs`) + `lib/search/fsrs.ts` + `lib/storage/post-insert-metadata.ts`.
- **Learned feedback**: `lib/search/learned-feedback.ts` (cap, expiry, audit) surfaced through `/memory:manage` maintenance actions.
- **Batch learning**: `lib/feedback/batch-learning.ts` (sign, idempotency key, SQL aggregation).
- **Corrections**: `lib/learning/corrections.ts` (idempotent apply, delta undo).
- **Promotion governance**: `lib/search/auto-promotion.ts` (demotion, hysteresis, per-memory throttle, batched counts).
- **Retention governance**: `lib/governance/memory-retention-sweep.ts` (absorbed P1-5 in-tx re-validation ALREADY ships at :666 — verify + interleaving test only; extend-window) plus age-based sweeps across the seven ledger owners.
- **Evaluation honesty**: `lib/feedback/shadow-evaluation-runtime.ts`, `lib/feedback/shadow-scoring.ts`, `lib/feedback/true-citation-emitter.ts`, `handlers/quality-loop.ts` (pairing + real sprint id), `lib/eval/reporting-dashboard.ts` (trend direction), `lib/cognitive/prediction-error-gate.ts`.
- **Attention & decay (absorbed routed findings)**: `lib/cognitive/working-memory.ts` (decay base vs re-added mention boost, §3 P1 #20) and `lib/cognitive/fsrs-scheduler.ts` (classification-flag-before-hybrid ordering, Agent C CONTRACT).

### Data Flow
Search/save events emit feedback signals -> ledgers (`feedback_events`, audits) -> aggregators (batch learning, auto-promotion, corrections, learned feedback) -> learned state (learned terms, tiers, FSRS metadata) -> future ranking inputs. Retention sweeps bound the ledgers; shadow eval and the prediction-error audit observe the loop without mutating live ranking.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-search.ts` cached path (producer) | Serves cached payloads without access tracking (Chain E, B P2) | update | vitest cache-hit tracking test; `rg -n "trackAccess" mcp_server/handlers mcp_server/lib/search` |
| `lib/search/search-utils.ts` `buildCacheArgs` (helper) | Omits `trackAccess` from cache args | update | Unit test that cached and uncached paths track identically |
| `lib/search/fsrs.ts` + `lib/storage/post-insert-metadata.ts` (producers) | Mixed `last_review` formats; refresh on empty calls (C P2, H OPT) | update | Format-uniformity test; no-op call leaves `last_review` unchanged |
| `lib/cognitive/tier-classifier.ts` (suspected producer) | May emit space-form `CURRENT_TIMESTAMP` | verify then update or mark not-a-producer | `rg -n "last_review" mcp_server/lib mcp_server/handlers` inventory |
| `lib/search/learned-feedback.ts` (producer + policy) | Cap counts expired terms; expiry/clear unwired (#27) | update | 8-expired-terms unit test; manage-action invocation test |
| `lib/feedback/batch-learning.ts` (aggregator) | Positive sign for reformulation; restart double-count; JS aggregation (#25) | update | Sign test, idempotency test, SQL-aggregation assertion |
| `lib/learning/corrections.ts` (pair mutator) | Compounds penalty on retry; absolute-value undo (G P2) | update | Retry no-op test; delta-undo test |
| `lib/search/auto-promotion.ts` (tier mutator) | Promote-only, global throttle, per-row negative counts (G refinement/OPT) | update | Promotion/demotion cycle test with hysteresis band |
| `lib/governance/memory-retention-sweep.ts` (deleter) | Spare-only delete ALREADY re-validates the fresh in-tx row (absorbed P1-5, :666); extend sees 7-day window | verify + test (no re-validation change); update extend-window | Deterministic interleaving test proving existing behavior; extend-window unit test |
| Seven ledger tables (storage) | Unbounded growth, no age retention (G P2, C OPT) | update (age sweeps + dry-run mode) | Before/after row counts vs baseline; shadow-window guard test |
| `lib/feedback/shadow-evaluation-runtime.ts` + `lib/feedback/shadow-scoring.ts` (eval consumers) | Query-independent labels; empty holdout records | update | Unlabeled-cycle marking test; empty-holdout non-recording test |
| `lib/feedback/true-citation-emitter.ts` (label producer, flag OFF) | Bare-id false positives, all-words false negatives (G P2) | update | Adversarial table tests (see algorithm invariant below) |
| `handlers/quality-loop.ts` (save-quality surface) | Returns bestContent with last attempt's score; fix log overstates (G P2); writes `eval_run_id=0` (:729) | update | Pairing unit test; log-content assertion; non-zero sprint-id assertion |
| `lib/cognitive/prediction-error-gate.ts` (audit producer) | `init(db)` never called - audit dead (G CONTRACT) | verify first (phase 003 overlap), then update | Startup wiring check; audit row written on a gating decision |
| `.opencode/commands/memory/manage.md` + manage handler (consumer surface) | No expiry/clear/sweep maintenance actions | update | Doc/handler parity check; action smoke test |
| `lib/cognitive/working-memory.ts` (attention mutator, absorbed §3 P1 #20) | `batchUpdateScores` re-applies full decay to the stored score and re-adds the mention boost each pass (:601-616) → attention binary | update | Multi-pass fixture: attention stays in a stable mid-range |
| `lib/eval/reporting-dashboard.ts` (telemetry, absorbed Agent G P2) | `latency` prefix misses `ablation_latency_*` (:179-181) → rising latency labeled "improved" | update | Direction table test: `ablation_latency_*` = lower-is-better |
| `lib/cognitive/fsrs-scheduler.ts` (decay policy, absorbed Agent C CONTRACT) | `applyClassificationDecay` runs the default-ON hybrid NO_DECAY branch (:351) before the classification flag check (:356) → two policies combined | update | Ordering test: classification flag OFF short-circuits before the hybrid branch |
| Ranking consumers of learned boosts (stage2/rescue) | Consume learned terms; authority decided by phase 006 | not a consumer of this change (signal production only) | Pointer note in spec.md Out of Scope; no stage2 diffs in this phase |
| PE-gate lanes (`pe-gating.ts`, `pe-orchestration.ts`) | Chain E sibling, owned by phase 003 | not a consumer | No diffs to those files in this phase |

Required inventories:
- Same-class producers: `rg -n "last_review|CURRENT_TIMESTAMP" mcp_server/lib mcp_server/handlers` (FSRS writers); `rg -n "trackAccess" mcp_server` (tracking call sites).
- Consumers of changed symbols: `rg -n "expireLearnedTerms|clearAllLearnedTriggers|computed_boost|memory_promotion_audit|evaluateSpareOnlyRetention|getRetentionProtectionReason" mcp_server --glob '*.ts' --glob '*.md'`.
- Ledger owners: `rg -n "feedback_events|shadow_scoring_log|batch_learning_log|learned_feedback_audit|memory_promotion_audit|memory_conflicts|adaptive_signal_events" mcp_server/lib`.
- Absorbed routed findings: `rg -n "EVENT_DECAY_FACTOR|mention_count|attention_score" mcp_server/lib/cognitive/working-memory.ts`; `rg -n "isHigherBetter|lowerIsBetterPrefixes|eval_run_id" mcp_server/lib/eval/reporting-dashboard.ts mcp_server/handlers/quality-loop.ts`; `rg -n "isHybridDecayPolicyEnabled|applyClassificationDecay" mcp_server/lib/cognitive/fsrs-scheduler.ts`.
- Matrix axes: signal type (positive / negative / reformulation) x restart (yes/no) for batch learning; tier state x feedback direction x hysteresis position for promotion; each spare axis (`importance_weight`, `quality_score`, `retention_trust_score`, `created_at`) x concurrent-writer timing for retention; label presence x holdout size for shadow eval.
- Algorithm invariant: a dissatisfaction signal never increases boost; a delete decision is re-validated against fresh axis values inside its transaction; a learning cap counts only live terms; a citation match requires a >=2-digit id or a 2-of-3 word anchor subset. Adversarial cases: "8 packets" (no citation), "28" bare id (citation), anchor with one shared word (no match), anchor with two of three words (match), same citation twice in one session (counted once).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline & Finding Verification
- [ ] Baseline captured: full vitest gate result, fuel numbers (65/33,101 rows ever accessed), row counts for the seven ledgers, warm `memory_search` p50
- [ ] Every 🟡 finding confirmed against current code (tasks T002-T009) before any fix
- [ ] Phase 003 overlap resolved: prediction-error-gate init state recorded

### Phase 2: Core Implementation
- [ ] Fuel fixes: cache-hit tracking (preventive; fixture forces `trackAccess` on), FSRS `last_review` format + no-op guard
- [ ] Learning fixes: learned-term expiry cap + manage wiring, batch-learning sign/idempotency/SQL, corrections no-op/delta-undo, promotion demotion/hysteresis/throttle
- [ ] Governance fixes: absorbed P1-5 is verify + interleaving test only (re-validation already at :666), extend-window widening, seven age-based ledger sweeps proven on injected fixtures (dry-run first)
- [ ] Evaluation fixes: shadow labels/holdout, true-citation regexes + session uniqueness, quality-loop pairing + honest log + real sprint id, prediction-error audit init
- [ ] Absorbed routed findings: working-memory decay/boost separation, dashboard trend-direction + sprint labeling, FSRS hybrid-decay ordering; plus a decision-record evaluating `trackAccess` prod enablement (no force-enable)

### Phase 3: Verification
- [ ] Integration proof: repeat-query strengthening, promotion/demotion cycle, bounded ledgers vs baseline
- [ ] Whole vitest gate re-run; delta reported against Phase 1 baseline
- [ ] Docs synchronized, checklist evidence recorded, `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-cluster fixes: cache-hit tracking (fixture forces `trackAccess`), term cap, batch sign/idempotency, corrections, hysteresis, existing retention re-validation, citation regex table tests, quality-loop pairing; absorbed working-memory multi-pass decay, dashboard direction table, FSRS ordering | vitest |
| Integration | Cache-hit strengthening via synthetic probe; promotion/demotion cycle; sweep interleaving with concurrent writer (proves existing :666 re-validation); shadow-cycle labeling; ledger sweeps over injected aged rows | vitest + scripted daemon runs |
| Manual | Ledger row counts via read-only SQL before/after on injected fixtures; live fuel number recorded as baseline only (`trackAccess` default-off, so it will not move organically) | sqlite3 read-only probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 daemon freshness (execution order predecessor) | Internal | Green (ordered first in program) | Unreliable CLI/daemon surface for live probes |
| Phase 003 PE audit init overlap | Internal | Yellow (verify at T027) | Double-wiring or missed wiring of `init(db)` |
| Phase 006 eval-parity harness | Internal | Yellow | Shadow-eval improvements not comparable on the production pipeline until parity lands |
| `SPECKIT_RETENTION_FORGETTING_V1` flag semantics | Internal | Green | Absorbed P1-5 test must force the gated path deterministically |
| better-sqlite3 transaction semantics | External | Green | In-tx re-validation depends on `BEGIN IMMEDIATE` read-your-writes behavior |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Warm-search latency regression beyond baseline noise, wrongful demotions/deletes in audit ledgers, or FSRS decay skew worsening after the format change.
- **Procedure**: `git revert` the phase commits (fixes are module-local); disable ledger sweeps via their dry-run/off policy; the retention re-validation change only tightens delete conditions, so reverting restores prior behavior without data repair.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + 🟡 verify) ──► Phase 2 (Fuel ► Learning ► Governance ► Evaluation) ──► Phase 3 (Integration proof + gate re-run)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline & Verification | None (011 already done in program order) | Core Implementation |
| Core Implementation | Verified findings, baseline numbers | Verification |
| Verification | Core Implementation | Phase close, 010 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline & Verification | Medium | 2-4 hours |
| Core Implementation | High | 10-16 hours (twelve clusters, ~18 files) |
| Verification | Medium | 3-5 hours |
| **Total** | | **15-25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 1 baseline recorded (vitest, fuel numbers, ledger counts, p50) for delta comparison
- [ ] Ledger sweeps configured dry-run for their first scheduled pass
- [ ] Promotion/demotion changes verified to write `memory_promotion_audit` rows for reverse replay

### Rollback Procedure
1. Disable sweeps (policy off / dry-run) if a wrongful-delete signal appears.
2. `git revert` the offending cluster's commits; clusters are independent and module-local.
3. Re-run the affected vitest suites plus a live read-only probe to confirm restored behavior.
4. Record the rollback and its cause in the phase implementation summary.

### Data Reversal
- **Has data migrations?** No destructive migrations. `last_review` normalization is write-path only with dual-parse reads; sweeps delete derived telemetry rows only.
- **Reversal procedure**: Tier changes replay in reverse from `memory_promotion_audit`; swept telemetry rows are non-canonical and are not restored (documented in the sweep policy).
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
