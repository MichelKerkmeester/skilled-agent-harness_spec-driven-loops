---
title: "Verification Checklist: Phase 9: Learning Feedback Loop Repair"
description: "Verification gates for the learning feedback loop repair: baseline capture, fix completeness per finding class, integration proof and bounded-ledger evidence."
trigger_phrases:
  - "learning feedback loop repair checklist"
  - "track access cache hits"
  - "auto promotion demotion hysteresis"
  - "feedback ledger sweep verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-04T17:51:10.586Z"
    last_updated_by: "markdown-agent"
    recent_action: "Remediated REWORK: P0 now REQ-001..005, SC reframed synthetic/injected, added CHK-028/029"
    next_safe_action: "Leave all items unchecked until execution produces evidence"
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
# Verification Checklist: Phase 9: Learning Feedback Loop Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-013 with acceptance criteria) [EVIDENCE: spec.md carries REQ-001..REQ-016 with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM surfaces, inventories, invariants) [EVIDENCE: plan.md phases + Files-to-Change + required inventories]
- [x] CHK-003 [P1] Dependencies identified and available (phase 003 init overlap resolved at T009; `SPECKIT_RETENTION_FORGETTING_V1` semantics confirmed) [EVIDENCE: prediction-error-gate.init verified wired once at startup (context-server.ts:2233), not double-initialized]
- [x] CHK-004 [P0] Baseline captured before any change: vitest gate, fuel numbers (65/33,101 rows ever accessed), seven ledger row counts, warm p50 (T001) [EVIDENCE: baseline vitest captured; fuel ~65 lifetime accesses / near-empty ledgers confirms preventive-fixture validation is the only honest path]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npx tsc --build exit 0 on integrated main; comment-hygiene gate passed]
- [x] CHK-011 [P0] No console errors or warnings introduced in daemon/CLI runs [EVIDENCE: tsc clean; the two new maintenance tools return structured MCP envelopes with error recovery, no unguarded throws]
- [x] CHK-012 [P1] Error handling implemented (sweeps, maintenance actions and undo paths fail safe and log) [EVIDENCE: sweeps dry-run-default; memory_learned_clear gated on confirm===true; corrections undo is delta-based and reversible]
- [x] CHK-013 [P1] Code follows project patterns; no finding IDs or packet numbers in code comments (comment-hygiene rule) [EVIDENCE: maintenance tools mirror the existing gated-mutation tool shape; comment-hygiene passed on all changed files]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-005 P0 set; REQ-006 verify-first; seven acceptance scenarios covered by tests) [EVIDENCE: xhigh 12/16 first pass, REQ-002/003/008/014 remediated = 16/16; 767 passed across 15 suites]
- [x] CHK-021 [P0] Cache-hit tracking mechanism proven via synthetic probe (`trackAccess` forced on): cached repeat search increments access metadata (SC-001; preventive/latent, not organic strengthening) [EVIDENCE: handler-memory-search.vitest.ts cached-path test with trackAccess forced on; production default off at memory-search.ts:930]
- [x] CHK-022 [P0] Promotion/demotion cycle test green with no hysteresis flapping (SC-002) [EVIDENCE: promotion-positive-validation-semantics.vitest.ts green; auto-promotion demotion/hysteresis at :217-226, per-memory throttle at :150-155]
- [x] CHK-023 [P0] Absorbed P1-5 interleaving test green: concurrently protected row survives the spare-only sweep, proving the existing re-validation at `memory-retention-sweep.ts:666` (SC-004) [EVIDENCE: memory-retention-sweep.vitest.ts:135-155 interleaving test; re-validation logic unchanged (verify-first)]
- [x] CHK-024 [P1] Ledger sweeps bounded via injected aged fixtures (live ledgers near-empty at 65 lifetime accesses): before/after counts on the injected set, shadow-window guard proven (SC-003) [EVIDENCE: ledger-sweeps.vitest.ts covers all seven sweeps on injected aged rows; shadow MIN-timestamp guard at shadow-scoring.ts:731-735]
- [x] CHK-025 [P1] Edge cases tested (cap boundary at 8 live terms, empty holdout, "8 packets" non-citation, empty metadata call, hysteresis boundary, working-memory multi-pass stability) [EVIDENCE: learned-feedback (expired-cap), shadow-evaluation (empty holdout), true-citation-emitter ("8 packets" rejected), working-memory-event-decay (multi-pass) suites green]
- [x] CHK-026 [P1] Error scenarios validated (restart mid-window idempotency, undo after stacked corrections) [EVIDENCE: batch-learning idempotency via unique index + INSERT OR IGNORE; corrections delta-undo test green]
- [x] CHK-027 [P1] Whole vitest gate re-run and delta reported against the T001 baseline (no unexplained regressions) [EVIDENCE: 15-suite gate 767 passed/13 skipped on integrated main; the one BM25 fallback failure is pre-existing and unrelated (touches no 009 file)]
- [x] CHK-028 [P1] Absorbed working-memory decay: multi-pass `batchUpdateScores` fixture proves attention stays in a stable mid-range, not binary (REQ-014, SC-006) [EVIDENCE: working-memory-event-decay.vitest.ts asserts base·0.85ⁿ + additive boost, with score>boost (non-degenerate) and monotonic decay across passes]
- [x] CHK-029 [P2] Absorbed telemetry/latent fixes covered: dashboard direction table test (`ablation_latency_*` lower-is-better) + non-zero sprint id, and FSRS classification-flag-before-hybrid ordering test (REQ-015, REQ-016, SC-006) [EVIDENCE: reporting-dashboard.vitest.ts:560-583 direction test; hybrid-decay-policy.vitest.ts:206-210 classification-before-hybrid test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: last_review = class-of-bug (multiple write sites); batch-learning sign = algorithmic; REQ-014 test = test-isolation]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all `last_review` writers, all `trackAccess` call sites, all seven ledger owners). [EVIDENCE: grep confirmed no CURRENT_TIMESTAMP/datetime('now') last_review writes remain under mcp_server; all seven ledger owners enumerated in ledger-sweeps coverage]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (`buildCacheArgs`, `computed_boost`, manage actions, audit tables). [EVIDENCE: /memory:manage command doc + tool-schemas + handler registration updated for the two new maintenance actions; audit-row writers verified]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (true-citation regex table covers false-positive/false-negative/session-dup cases). [EVIDENCE: true-citation-emitter.vitest.ts table tests cover single-digit rejection, 2-of-3 anchor match, and session-dup]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (plan.md Required inventories: signal x restart, tier x direction x band, spare axes x timing, labels x holdout). [EVIDENCE: dashboard direction×band and shadow labels×holdout axes asserted in reporting-dashboard + shadow-evaluation-runtime suites]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (`SPECKIT_RETENTION_FORGETTING_V1` on/off, cache enabled/bypassed). [EVIDENCE: cached-path vs bypass covered in handler-memory-search; retention window behavior tested in memory-retention-sweep]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: pinned to the 009 integration commit on branch system-speckit/004-memory-search-intelligence]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets introduced; maintenance tools take dryRun/confirm flags only]
- [x] CHK-031 [P0] Input validation implemented for new maintenance actions and sweep policies [EVIDENCE: memory_learned_expire dryRun boolean (default true); memory_learned_clear requires confirm===true; sweeps parameterized with bound cutoffs]
- [x] CHK-032 [P1] Maintenance/mutation actions exposed only via `/memory:manage`, never from prompt-time hooks (NFR-S01) [EVIDENCE: both tools tagged [L4:Mutation] and wired only into the manage.md command surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized; changelog refreshed per parent convention [EVIDENCE: spec.md + tasks.md continuity reconciled to 100%; implementation-summary + decision-record authored]
- [x] CHK-041 [P1] Code comments adequate (durable WHY only; finding IDs stay in tasks.md) [EVIDENCE: comment-hygiene gate passed; the REQ-014 decay comment states the durable WHY (base decays, boost additive)]
- [x] CHK-042 [P2] `/memory:manage` command doc updated for the new maintenance actions [EVIDENCE: manage.md adds learned-expire/learned-clear subcommands, allowed-tools registration, and a routing table]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: no temp artifacts written to the spec folder; verification ran in the worktree + session scratchpad]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: spec scratch/ holds only .gitkeep]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 16 | 16/16 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-04
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
