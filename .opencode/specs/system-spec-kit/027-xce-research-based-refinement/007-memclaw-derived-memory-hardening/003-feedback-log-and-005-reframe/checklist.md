---
title: "Verification Checklist: Phase 3: feedback-log-and-008-reframe [template:level_2/checklist.md]"
description: "Verification checklist for the 008 feedback reframe: shadow-only ledger, reserved system feedback types, deferred active reducers, and the symmetric-damping / rare-but-correct / constitutional-immunity invariants."
trigger_phrases:
  - "feedback reframe checklist shadow only"
  - "reserved feedback type rejection check"
  - "defer active reducers verification"
  - "constitutional immunity invariant check"
  - "008 reframe verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe"
    last_updated_at: "2026-06-06T10:10:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added Level 2 verification checklist for the 008 feedback reframe"
    next_safe_action: "Begin T001 audit of feedback-ledger shadow-only guarantees"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-feedback-log-and-005-reframe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3: feedback-log-and-008-reframe

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements (REQ-001..REQ-004) documented in spec.md
- [ ] CHK-002 [P0] Technical approach + affected surfaces defined in plan.md
- [ ] CHK-003 [P0] Phase 001 provenance (`source_kind`) dependency confirmed as the base for reserved feedback types
- [ ] CHK-004 [P1] Existing shadow-only feedback substrate (`lib/feedback/**`) confirmed present before changes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `tool-input-schemas.ts` reserved-type guard passes lint/format and typechecks
- [ ] CHK-011 [P0] No new ranking / retention / FSRS write is introduced on the feedback path (`feedback-ledger.ts`, `query-flow-tracker.ts`, `batch-learning.ts`)
- [ ] CHK-012 [P1] Reserved-type rejection returns a typed error (not a silent drop or coercion)
- [ ] CHK-013 [P1] Reservation follows the existing write-ingress schema pattern; no public feedback-write tool is added
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] vitest: a write supplying a reserved/system feedback type is rejected (REQ-001)
- [ ] CHK-021 [P0] vitest: the ledger record path mutates no live ranking / retention / FSRS columns (REQ-002)
- [ ] CHK-022 [P0] vitest: a single negative signal on a high-tier / constitutional memory causes no demotion, decay, or archival (rare-but-correct guard)
- [ ] CHK-023 [P1] vitest: a system-stamped feedback record path still succeeds (guard does not over-reject)
- [ ] CHK-024 [P1] vitest: a ledger append failure surfaces a non-fatal warning and does not fail the search/save (fail-safe, NFR-R01)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for feedback emitters (`rg -n 'recordFeedback|FeedbackEvent|feedback_event' lib/feedback context-server.ts`), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the reserved feedback-type set across `mcp_server/**` schemas, handlers, and tests.
- [ ] CHK-FIX-004 [P0] Reserved-type guard has adversarial table tests: system-stamped accepted, user/agent forged rejected, missing-type defaulted, and no-op cases.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: feedback-type source (system-stamped vs user/agent-supplied) x write path (ledger record vs public tool input); both required rows present.
- [ ] CHK-FIX-006 [P1] Shadow-gate env/global-state variant exercised when batch-learning reads process-wide flags (`SPECKIT_BATCH_LEARNED_FEEDBACK`).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] System-generated feedback artifact types are server-reserved; agents cannot forge a learning signal (NFR-S01)
- [ ] CHK-031 [P0] Reserved-feedback-type input validation rejects forged writes at the schema boundary
- [ ] CHK-032 [P0] Constitutional / protected memories are immune to feedback-driven demotion or archival (NFR-S02)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Symmetric-damping, rare-but-correct, and constitutional-immunity invariants recorded in spec/plan for any future reducer (REQ-003)
- [ ] CHK-041 [P0] Coordination note flags `005-learning-feedback-reducers/{001-aggregator,003-causal-reducer,004-retention-reducer,005-env-tests-integration}` as diagnostics-first / deferred, with no edits to those specs (REQ-004)
- [ ] CHK-042 [P1] Spec/plan/tasks/implementation-summary synchronized on the Level-2 reframe
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
| P0 Items | 16 | 0/16 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not started — plan only
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
