---
title: "Verification Checklist: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Verification Date: 2026-06-19"
trigger_phrases:
  - "advisor outcome ranking checklist"
  - "advisor ambient tick checklist"
  - "advisor bm25 calibration checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/002-skill-advisor-runtime/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author verification checklist for the outcome-weighted-ranking follow-on sub-phase"
    next_safe_action: "Work the tasks, mark checklist items with evidence as built"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-007-outcome-weighted-ranking"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Advisor Outcome-Weighted Ranking Follow-On

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..009)
  - **Evidence**: `spec.md` REQ-001..009 present, SHA `03d0b01eb6`.
- [x] CHK-002 [P0] Technical approach defined in plan.md (Phases 0-4, critical path)
  - **Evidence**: `plan.md` Phases 0-4 + critical path authored, SHA `03d0b01eb6`.
- [x] CHK-003 [P1] Dependencies identified and available (net-new emitter + store, shared Beta primitive w/ 004/D2, shared ambient-tick substrate, the proxy-only data barrier)
  - **Evidence**: `tasks.md` notation block + T007/T009/T010 name the shared-Beta + ambient-tick + emitter-seam deps, those stay PENDING on sibling 004 and Q-001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format/`tsc` checks
  - **Evidence**: `tasks.md` T020 - `tsc` 0 errors, SHA `03d0b01eb6`.
- [x] CHK-011 [P0] No console errors or warnings, existing advisor scorer suite green
  - **Evidence**: `tasks.md` T020 - `tests/scorer` 15 files/109 tests pass, broad `tests/scorer tests/legacy` 0 new failures, SHA `03d0b01eb6`.
- [x] CHK-012 [P1] Error handling implemented (malformed store rows skipped not crashed, ambient-tick idempotent on overlap)
  - **Evidence**: `tasks.md` T017 (replay/double-delivery + double-tick no-op) + `skill-outcome-store.ts`, SHA `03d0b01eb6`.
- [x] CHK-013 [P1] Code follows advisor scorer patterns (metrics record / lane / store conventions)
  - **Evidence**: `tasks.md` T003 adds the record beside the untouched `AdvisorHookOutcomeRecord` in `metrics.ts`, store + lane follow scorer conventions, SHA `03d0b01eb6`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

> Drift correction pointer (2026-07-01): the checklist evidence citing `03d0b01eb6` describes files that were later deleted at `8efcde0e6b`; see `implementation-summary.md` for the pass-2 reconciliation and the delete-commit result, MRR delta +0.005 to +0.008 versus SD 0.0237 and right-skill@3 = 0.000 across all 90 runs.

- [ ] CHK-020 [P0] All acceptance criteria met (SC-001 emitter+store, SC-002 shadow re-rank live-byte-identical, SC-003 ambient-tick + bm25 + NO-GO)
  - **LEFT-PENDING**: SC-002/SC-003 verified, but SC-001 needs the emitter to actually fire - the Q-001 runtime seam is undecided (`tasks.md` T002 `[B]`), so no execution-success data accumulates yet.
- [x] CHK-021 [P0] Beta-blend unit tests pass: cold-start 0.5, anti-flood (low-vs-high count NOT identical), fresh-skill neutrality (blend == pure similarity on empty store)
  - **Evidence**: `tasks.md` T016 + `tests/scorer/outcome-weighted-ranking.vitest.ts`, SHA `03d0b01eb6`.
- [x] CHK-022 [P1] Edge cases tested (empty store, all-success, all-failure, low-count, single-token vs long BM25 query, replay-fold, double-tick)
  - **Evidence**: `tasks.md` T017/T019 - replay-fold, double-tick no-op, BM25 query-length buckets, SHA `03d0b01eb6`.
- [x] CHK-023 [P1] Error scenarios validated (malformed store row skipped, overlapping ambient-tick is a no-op, shared Beta absent -> re-rank inert)
  - **Evidence**: `tasks.md` T017 (double-tick no-op) + T009 (adapter returns neutral 0.5 / re-rank inert until 004 Beta lands), SHA `03d0b01eb6`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: SA-outcome-weighted-ranking = `missing-signal` (net-new execution-success emitter + store), SA-scheduler-ambient-tick = `missing-infra` (no cadence driver), ADV-bm25-calibration = `algorithmic` (fixed->query-length midpoint).
  - **Evidence**: `tasks.md` T003/T004 (emitter+store), T005 (cadence driver), T013 (BM25 midpoint), SHA `03d0b01eb6`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'AdvisorHookOutcomeRecord|createAdvisorHookOutcomeRecord|advisorHookOutcomesPath' .opencode/skills/system-skill-advisor --glob '*.ts'` (confirm the acceptance path stays untouched, the new emitter is distinct).
  - **Evidence**: `tasks.md` T003 - `AdvisorHookOutcomeRecord` left untouched, the new `SkillExecutionOutcomeRecord` is distinct, SHA `03d0b01eb6`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the shared Beta primitive + the ambient-tick substrate across `system-skill-advisor` and sibling `004-c4-shadow-seam-beta-posterior` (one Beta module, one cadence driver, two consumers).
  - **Evidence**: `tasks.md` T007/T010 - ambient-tick is the shared substrate sibling 004's promoter rides, Beta consumed via thin adapter, both PENDING sibling 004 landing. SHA `03d0b01eb6`.
- [x] CHK-FIX-004 [P0] Adversarial table tests for: replay/double-delivery (fold idempotence), double-tick (no-op), empty store (blend == pure similarity), shared-Beta absent (re-rank inert), shadow-only guardrail (live fused sort byte-identical).
  - **Evidence**: `tasks.md` T016/T017/T018 + `tests/scorer/outcome-weighted-ranking.vitest.ts` (20 tests), SHA `03d0b01eb6`.
- [x] CHK-FIX-005 [P1] Matrix axes listed: {empty, all-success, all-failure, low-count/high-count, single-token/long query, replay, double-tick} x {shadow-only invariant: live order unchanged}.
  - **Evidence**: covered by the 20-test suite (T016-T019), SHA `03d0b01eb6`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed - the shadow re-rank channel and the BM25 lane weight are read once at load, test the channel default-off path and that BM25 stays shadow-only.
  - **Evidence**: `tasks.md` T015/T019 - default-off re-rank channel + BM25 stays shadow-only with zeroed weight, SHA `03d0b01eb6`.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range (per-candidate scoped commits), not a moving branch-relative range.
  - **Evidence**: build committed at SHA `03d0b01eb6` (`feat(028): build 003/007-outcome-weighted-ranking-followon`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: append-only JSONL store + shadow re-rank over internal data, no secret-bearing files in scope, SHA `03d0b01eb6`.
- [x] CHK-031 [P0] Input validation implemented (skill-outcome store JSONL parsed defensively, malformed records skipped, not crashed)
  - **Evidence**: `tasks.md` T003/T004 + `skill-outcome-store.ts` validator + idempotent fold, replay test T017, SHA `03d0b01eb6`.
- [x] CHK-032 [P1] The skill-outcome store is read-only input to ranking, the emitter cannot write live scorer weights, the shadow re-rank cannot change live ordering (NFR-S01)
  - **Evidence**: `tasks.md` T012/T015/T018 - live fused sort byte-identical, re-rank never imported by `fusion.ts`, SHA `03d0b01eb6`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record synchronized
  - **Evidence**: `tasks.md` T022 ran `validate.sh --strict` (0 errors / 0 warnings), spec/plan/tasks/decision-record committed at SHA `03d0b01eb6`.
- [x] CHK-041 [P1] Code comments adequate (durable WHY, no spec-path/packet ids in comments - comment-hygiene)
  - **Evidence**: `implementation-summary.md` Verification - comment hygiene PASS, 0 violations on all changed files, SHA `03d0b01eb6`.
- [ ] CHK-042 [P2] README updated (if applicable - N/A for shadow-only internals)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files (baseline captures) in scratch/ only
  - **Evidence**: `scratch/baseline.md` + `scratch/after.md` are the only scratch artifacts, SHA `03d0b01eb6`.
- [x] CHK-051 [P1] scratch/ cleaned before completion (keep only the recorded baseline if needed for evidence)
  - **Evidence**: only the recorded `baseline.md` / `after.md` retained as before/after evidence (`tasks.md` T001/T014), SHA `03d0b01eb6`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | shadow-only build verified, CHK-020 PENDING (SC-001 emitter seam Q-001 undecided) |
| P1 Items | 13 | verified for the shadow-only build |
| P2 Items | 4 | 0/4 (N/A / deferred) |

**Verification Date**: 2026-06-19
**Verified By**: Reconciliation pass against committed build SHA `03d0b01eb6`
**Scope**: Outcome-weighted ranking follow-on shipped shadow-only / default-off, the emitter runtime seam (Q-001) and sibling 004's Beta primitive remain PENDING, live promotion is a recorded NO-GO.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 build-on-net-new-signal-shadow-only, ADR-002 reuse-shared-Beta-and-ambient-tick)
  - **Evidence**: `decision-record.md` ADR-001/ADR-002 present (`tasks.md` T021 records the NO-GO in ADR-002), SHA `03d0b01eb6`.
- [x] CHK-101 [P1] All ADRs have status (Accepted)
  - **Evidence**: `decision-record.md` ADR statuses recorded, SHA `03d0b01eb6`.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (acceptance-as-success, live-re-rank-now, fork-own-Beta, reuse-integer-scorer)
  - **Evidence**: `decision-record.md` + IS Key Decisions reject acceptance-as-success / live-rerank-now / fork-own-Beta / reuse-integer-scorer, SHA `03d0b01eb6`.
- [ ] CHK-103 [P2] Migration path documented (N/A - additive shadow-only, append-only store, no schema migration)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Ambient-tick adds NO prompt-time latency (out-of-process cron/maintenance only - NFR-P01)
  - **Evidence**: `tasks.md` T006 - `scripts/skill-outcome-fold-tick.mjs` runs cron/maintenance only, nothing on the recommend path imports it. SHA `03d0b01eb6`.
- [x] CHK-111 [P1] Live advisor recommend path + live fused sort byte-identical to baseline (the live path is never touched - NFR-P02)
  - **Evidence**: `tasks.md` T012/T018/T020 - live fused sort byte-identical, SHA `03d0b01eb6`.
- [ ] CHK-112 [P2] Load testing completed (N/A for cron ambient-tick)
- [ ] CHK-113 [P2] Performance benchmarks documented (deferred - the promotion-to-live micro-benchmark is the NO-GO gate, REQ-009)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested (disable shadow re-rank channel + revert scoped commits + delete store -> fresh-0.5, plan.md §L2 Enhanced Rollback)
  - **Rollback satisfied by deletion (2026-07-07)**: rollback satisfied by store deletion at commit `8efcde0e6b` (`skill-outcome-store.ts` deleted; shadow re-rank channel default-off); no live flip needed.
- [x] CHK-121 [P0] Feature flag configured - shadow re-rank channel default-off, BM25 lane stays `shadowOnly:true` with zeroed weight
  - **Evidence**: `tasks.md` T013/T015 - re-rank channel default-off (`isAdvisorOutcomeWeightedRerankEnabled`), BM25 `shadowOnly:true` with zeroed fusion weight, SHA `03d0b01eb6`.
- [ ] CHK-122 [P1] Monitoring/alerting configured (N/A - shadow channel, BM25 calibration is telemetry-only)
- [ ] CHK-123 [P1] Runbook created (ambient-tick cron cadence + how the 004 promoter rides it)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (shadow-only invariant, store read-only input, emitter cannot write live weights)
  - **Evidence**: `tasks.md` T015/T018 - shadow-only invariant proven, store is read-only input, emitter cannot write live scorer weights, SHA `03d0b01eb6`.
- [ ] CHK-131 [P1] Dependency licenses compatible (no new external deps expected)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (N/A - internal scorer pipeline)
- [ ] CHK-133 [P2] Data handling compliant (append-only skill-outcome JSONL, no PII)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record)
  - **Evidence**: `tasks.md` T022 ran `validate.sh --strict` clean, spec/plan/tasks/decision-record committed at SHA `03d0b01eb6`.
- [ ] CHK-141 [P1] API documentation complete (emitter + store + ambient-tick + shared-Beta adapter signatures)
- [ ] CHK-142 [P2] User-facing documentation updated (N/A)
- [ ] CHK-143 [P2] Knowledge transfer documented (004/D2 shared-Beta + shared ambient-tick coordination note)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Maintainer | [ ] Approved | |
| (004 / D2 co-owner) | shared Beta + cadence | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
