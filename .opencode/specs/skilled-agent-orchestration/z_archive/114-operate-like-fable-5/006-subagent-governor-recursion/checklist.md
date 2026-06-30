---
title: "Verification Checklist: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field [template:level_3/checklist.md]"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/006-subagent-governor-recursion"
    last_updated_at: "2026-06-15T14:06:38Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-subagent-governor-recursion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Requirements (REQ-001 to REQ-008) documented in spec.md with acceptance criteria
- [ ] CHK-002 [P0] Technical approach and ordered steps defined in plan.md
- [ ] CHK-003 [P1] Phase 005 governor capsule confirmed available as the injection source
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `executor-config.ts` and `prompt-pack.ts` pass TypeScript compile and lint
- [ ] CHK-011 [P0] No new console errors or warnings from the deep-loop runtime build
- [ ] CHK-012 [P1] Malformed `governor` config is rejected with a clear `ExecutorConfigError`, not a silent default
- [ ] CHK-013 [P1] The `{governor_block}` token follows the existing prompt-pack token convention
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `renderPromptPack` output carries the governor in both deep-loop iteration templates; `validatePromptPackTemplate` reports `governor_block` present (REQ-001)
- [ ] CHK-021 [P0] `parseExecutorConfig` accepts the optional `governor` field; executor-config `vitest` covers present/absent/malformed and passes (REQ-004)
- [ ] CHK-022 [P1] No-governor deep-loop render and parse match pre-change behavior (REQ-007)
- [ ] CHK-023 [P1] Missing-token render throws `PromptPackError` rather than emitting a literal `{governor_block}`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in the governor block or recursion-control rule (static doctrine text only)
- [ ] CHK-031 [P0] The `governor` config field is schema-validated by Zod before use
- [ ] CHK-032 [P1] No untrusted content reaches the `{governor_block}` substitution (trusted runtime config only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized for this phase
- [ ] CHK-041 [P1] `recursion-control.md` carries the durable WHY (no spec paths or artifact ids embedded as code comments)
- [ ] CHK-042 [P2] Constitutional surfacing pointer updated to list the new rule
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
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 8 | 0/8 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Structural-injection decision documented in decision-record.md (ADR-001) with the subagent-blind-hook rationale
- [ ] CHK-101 [P1] All ADRs have a status (Proposed/Accepted)
- [ ] CHK-102 [P1] Rejected alternatives (AGENTS-only governor, hand-edited mirrors) documented with rationale
- [ ] CHK-103 [P2] No data migration needed; rollback path is a clean git revert (documented in plan.md)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Prompt-pack render time effectively unchanged (single string substitution, no extra I/O) (NFR-P01)
- [ ] CHK-111 [P1] Governor block bounded to the single ~90-word capsule paragraph; no multi-governor concatenation
- [ ] CHK-112 [P2] No load testing needed (no runtime hot path or persistence change)
- [ ] CHK-113 [P2] Behavioral measurement (tool:text, self-opener %) is out of scope here; tracked under phase 003 / fable_metrics
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (git revert of additive changes; no migration) in plan.md
- [ ] CHK-121 [P0] No feature flag needed; change is inert until a governor is supplied (token defaults empty, field optional)
- [ ] CHK-122 [P1] Three agent mirrors consistent after `agent-mirror-sync.yml` (REQ-008)
- [ ] CHK-123 [P1] Backward-compat smoke check: no-governor deep-loop run renders and parses unchanged
- [ ] CHK-124 [P2] No deployment runbook needed (in-repo doctrine/schema change, no service deploy)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No new third-party dependencies introduced (uses existing Zod and the deep-loop runtime)
- [ ] CHK-131 [P1] Comment-hygiene check: code snippets carry the durable WHY, no embedded spec paths or artifact ids
- [ ] CHK-132 [P2] Governor text contains no user data or PII (static doctrine only)
- [ ] CHK-133 [P2] Recursion rule scoped to xhigh executors; does not over-block normal-effort runs
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec.md, plan.md, tasks.md, checklist.md, decision-record.md synchronized
- [ ] CHK-141 [P1] `recursion-control.md` reads as a self-contained constitutional rule with the caption test explained
- [ ] CHK-142 [P2] The `{governor_block}` token documented where other prompt-pack tokens are listed (if such a list exists)
- [ ] CHK-143 [P2] implementation-summary.md updated from PLANNED to shipped state after build
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Technical Lead | [ ] Approved | Pending |
| Packet owner | fable-5 packet owner | [ ] Approved | Pending |
| Packet owner | QA / verification | [ ] Approved | Pending |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

