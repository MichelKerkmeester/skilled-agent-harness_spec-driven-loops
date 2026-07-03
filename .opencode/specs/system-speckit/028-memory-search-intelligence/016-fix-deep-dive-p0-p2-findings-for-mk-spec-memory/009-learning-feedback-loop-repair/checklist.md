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
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-03T13:20:00Z"
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-013 with acceptance criteria)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM surfaces, inventories, invariants)
- [ ] CHK-003 [P1] Dependencies identified and available (phase 003 init overlap resolved at T009; `SPECKIT_RETENTION_FORGETTING_V1` semantics confirmed)
- [ ] CHK-004 [P0] Baseline captured before any change: vitest gate, fuel numbers (65/33,101 rows ever accessed), seven ledger row counts, warm p50 (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings introduced in daemon/CLI runs
- [ ] CHK-012 [P1] Error handling implemented (sweeps, maintenance actions and undo paths fail safe and log)
- [ ] CHK-013 [P1] Code follows project patterns; no finding IDs or packet numbers in code comments (comment-hygiene rule)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-005 P0 set; REQ-006 verify-first; seven acceptance scenarios covered by tests)
- [ ] CHK-021 [P0] Cache-hit tracking mechanism proven via synthetic probe (`trackAccess` forced on): cached repeat search increments access metadata (SC-001; preventive/latent, not organic strengthening)
- [ ] CHK-022 [P0] Promotion/demotion cycle test green with no hysteresis flapping (SC-002)
- [ ] CHK-023 [P0] Absorbed P1-5 interleaving test green: concurrently protected row survives the spare-only sweep, proving the existing re-validation at `memory-retention-sweep.ts:666` (SC-004)
- [ ] CHK-024 [P1] Ledger sweeps bounded via injected aged fixtures (live ledgers near-empty at 65 lifetime accesses): before/after counts on the injected set, shadow-window guard proven (SC-003)
- [ ] CHK-025 [P1] Edge cases tested (cap boundary at 8 live terms, empty holdout, "8 packets" non-citation, empty metadata call, hysteresis boundary, working-memory multi-pass stability)
- [ ] CHK-026 [P1] Error scenarios validated (restart mid-window idempotency, undo after stacked corrections)
- [ ] CHK-027 [P1] Whole vitest gate re-run and delta reported against the T001 baseline (no unexplained regressions)
- [ ] CHK-028 [P1] Absorbed working-memory decay: multi-pass `batchUpdateScores` fixture proves attention stays in a stable mid-range, not binary (REQ-014, SC-006)
- [ ] CHK-029 [P2] Absorbed telemetry/latent fixes covered: dashboard direction table test (`ablation_latency_*` lower-is-better) + non-zero sprint id, and FSRS classification-flag-before-hybrid ordering test (REQ-015, REQ-016, SC-006)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all `last_review` writers, all `trackAccess` call sites, all seven ledger owners).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (`buildCacheArgs`, `computed_boost`, manage actions, audit tables).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (true-citation regex table covers false-positive/false-negative/session-dup cases).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (plan.md Required inventories: signal x restart, tier x direction x band, spare axes x timing, labels x holdout).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (`SPECKIT_RETENTION_FORGETTING_V1` on/off, cache enabled/bypassed).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented for new maintenance actions and sweep policies
- [ ] CHK-032 [P1] Maintenance/mutation actions exposed only via `/memory:manage`, never from prompt-time hooks (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized; changelog refreshed per parent convention
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only; finding IDs stay in tasks.md)
- [ ] CHK-042 [P2] `/memory:manage` command doc updated for the new maintenance actions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 16 | 0/16 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending — phase not yet executed
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
