---
title: "Verification Checklist: 009 — Peck Verification Discipline"
description: "Verification checklist for the peck verification-discipline bundle (T5-T9). Planning scaffold — items are verified after implementation."
trigger_phrases:
  - "verification"
  - "checklist"
  - "009 peck verification discipline"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 009 checklist (not implemented)"
    next_safe_action: "Verify items after implementing Phase 1 freshness in WARN mode"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 009 — Peck Verification Discipline

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] 010 reviewer-benchmark fixtures available (dependency) before any rule ships
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Prompt/doc edits pass markdown + template validation
- [ ] CHK-011 [P0] No console errors or warnings in `validate.sh`
- [ ] CHK-012 [P1] Freshness recompute reuses the existing fingerprint helper (no new infra)
- [ ] CHK-013 [P1] Changes follow existing validator-registry + agent-prompt patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] 010 regression fixtures green for stale-verdict, softened-Fail, over-read
- [ ] CHK-022 [P1] Warn-mode emits the actionable message without blocking (each rule)
- [ ] CHK-023 [P1] Error/enforce mode blocks only after the warn-only window
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (incl. the `.claude/agents/*` mirrors).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Clean-tree precondition does not leak file contents into messages
- [ ] CHK-032 [P1] Freshness fingerprint is content-derived, not user-spoofable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Each new validator rule has `How to Fix` wording (no cryptic failures)
- [ ] CHK-042 [P2] ENV_REFERENCE.md updated with the new flags
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
| P0 Items | 11 | 0/11 |
| P1 Items | 14 | 0/14 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-06-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (incl. rejected literal `score>=4 blocks`)
- [ ] CHK-103 [P2] Migration path documented (warn->error rollout)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Freshness recompute adds negligible time to `validate.sh`
- [ ] CHK-111 [P1] Reviewer read-budget reduces token spend without harming recall
- [ ] CHK-112 [P2] Completion-gate latency measured before/after
- [ ] CHK-113 [P2] Benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (flip enforce flag off)
- [ ] CHK-121 [P0] Feature flags configured (`SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`)
- [ ] CHK-122 [P1] Warn-only window + activation timestamp persisted (copy SPECKIT_SAVE_QUALITY_GATE)
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Comment-hygiene + honesty constitutional rules respected
- [ ] CHK-131 [P1] No regression in existing constitutional completion rules
- [ ] CHK-132 [P2] Anti-softening rule reviewed against existing honesty rules
- [ ] CHK-133 [P2] Data handling compliant
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (incl. integration-plan cross-refs)
- [ ] CHK-141 [P1] `.claude/agents/*` mirrors updated or mirror-lag recorded
- [ ] CHK-142 [P2] User-facing message wording reviewed
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| (pending) | Technical Lead | [ ] Approved | |
| (pending) | Product Owner | [ ] Approved | |
| (pending) | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
