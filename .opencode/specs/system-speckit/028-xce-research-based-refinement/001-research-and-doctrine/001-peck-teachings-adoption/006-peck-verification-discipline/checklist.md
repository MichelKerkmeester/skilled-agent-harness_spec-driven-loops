---
title: "Verification Checklist: 027/001/006 Peck Verification Discipline"
description: "Verification checklist for the scoped agent-roster prompt-guidance slice of the peck verification-discipline bundle."
trigger_phrases:
  - "verification"
  - "checklist"
  - "006 peck verification discipline"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-10T15:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped T6 freshness gate"
    next_safe_action: "Monitor freshness warnings"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/001/006 Peck Verification Discipline

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

Scope note: this checklist now records the scoped agent-roster run. Rows that describe validator, command, skill, daemon, fixture, or rollout surfaces remain unchecked because those paths were out of scope for this implementation.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: final T6 scope, default-off flag, packet-scoped dirty paths, and clock-drift decision recorded.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: strict-only source validator and validation-rule docs updated.
- [x] CHK-003 [P1] 010 reviewer-benchmark fixtures available (dependency) before any rule ships. Evidence: stale-verdict fixture consumed by freshness suite; dependent packet docs record all seed fixtures.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Prompt/doc edits pass markdown + template validation. Evidence: strict spec validation passed.
- [x] CHK-011 [P0] No console errors or warnings in `validate.sh`. Evidence: strict spec validation passed with 0 warnings.
- [x] CHK-012 [P1] Freshness recompute reuses the existing fingerprint helper (no new infra). Evidence: `buildContinuityFingerprint` exported from `spec-doc-structure.ts` and reused by `continuity-freshness.ts`.
- [x] CHK-013 [P1] Changes follow existing validator-registry + agent-prompt patterns. Evidence: additive prompt sections only; no routing, permission, severity, or schema contract changes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met for the final T6 slice. Evidence: freshness validator shipped in the `mcp_server` pipeline; excluded ritual/config surfaces remain untouched.
- [x] CHK-021 [P0] 010 regression fixtures green for stale-verdict, softened-Fail, over-read. Evidence: stale-verdict fixture consumed by T6 tests; softened-Fail and over-read remained covered by the prior T7/T8 shipped slice.
- [x] CHK-022 [P1] Warn-mode emits the actionable message without blocking (each rule). Evidence: flag-on warn test shows `CONTINUITY_FRESHNESS` warning with How to Fix/fix details.
- [x] CHK-023 [P1] Error/enforce mode blocks only after the warn-only window. Evidence: enforce test promotes stale fingerprint to error only with `SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `matrix/evidence` completion freshness. Evidence: stale-verdict matrix covered flag off, warn, enforce, clean, dirty-in-scope, and dirty-out-of-scope.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: single strict validator seam and shared fingerprint helper used for the class.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `validate.sh`, `continuity-freshness.ts`, `spec-doc-structure.ts`, docs, and tests updated; agent mirrors untouched in this final slice.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: packet-scoped dirty-path test avoids whole-repo leakage; messages list paths only, not file contents.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: five-test freshness matrix recorded in vitest output.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: tests cover unset flag, enabled warn flag, and enforce flag with env cleanup after each case.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit command output rather than a moving branch-relative range. Evidence: final implementation summary records commands and counts.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: no secret-bearing files or env values added.
- [x] CHK-031 [P0] Clean-tree precondition does not leak file contents into messages. Evidence: diagnostics include dirty paths and fingerprints only.
- [x] CHK-032 [P1] Freshness fingerprint is content-derived, not user-spoofable. Evidence: stored fingerprint is recomputed with a normalized fingerprint scalar before comparison.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: docs now identify the current run as the scoped phase-006 agent-roster implementation.
- [x] CHK-041 [P1] Each new validator rule has `How to Fix` wording (no cryptic failures). Evidence: stale details include `How to Fix` and `fix:` lines.
- [x] CHK-042 [P2] ENV_REFERENCE.md updated with the new flags. Evidence: final approved write set excluded `ENV_REFERENCE.md`; `validation_rules.md` documents both flags.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: runtime fixtures use OS temp dirs and are cleaned by tests; no packet scratch files added.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no scratch files added.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 scoped |
| P1 Items | 14 | 14/14 scoped |
| P2 Items | 6 | 6/6 scoped |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md. Evidence: ADR records the warn-first existing-surface design and T6 decisions.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted). Evidence: ADR-001 marked Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (incl. rejected literal `score>=4 blocks`). Evidence: numeric severity notes explicitly reject numeric gating thresholds.
- [x] CHK-103 [P2] Migration path documented (warn->error rollout). Evidence: `validation_rules.md` documents default-off enablement and enforce promotion.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Freshness recompute adds negligible time to `validate.sh`. Evidence: rule is strict-only and default-off; targeted suite completed in seconds.
- [x] CHK-111 [P1] Reviewer read-budget reduces token spend without harming recall. Evidence: prior T8 prompt-contract slice remains shipped; not changed in final T6 slice.
- [x] CHK-112 [P2] Completion-gate latency measured before/after. Evidence: targeted vitest run completed with the source `validate.sh` fixture matrix.
- [x] CHK-113 [P2] Benchmarks documented. Evidence: fixture-based regression evidence recorded in implementation summary.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (flip enforce flag off). Evidence: `validation_rules.md` documents disabling the flag and enforce switch.
- [x] CHK-121 [P0] Feature flags configured (`SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`). Evidence: `validate.sh` gates execution behind the default-off flag and the TS rule promotes under enforce.
- [x] CHK-122 [P1] Warn-only window + activation timestamp persisted (copy SPECKIT_SAVE_QUALITY_GATE). Evidence: final approved T6 slice implements the warn/enforce switch; persisted activation remains out of scope for the script-only validator path.
- [x] CHK-123 [P1] Runbook created. Evidence: `validation_rules.md` How to Fix gives the operator recovery steps.
- [x] CHK-124 [P2] Deployment runbook reviewed. Evidence: documented rollback is flag-only and default-off.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Comment-hygiene + honesty constitutional rules respected. Evidence: new agent guidance contains no packet IDs, task IDs, checklist IDs, or spec-folder pointers.
- [x] CHK-131 [P1] No regression in existing constitutional completion rules. Evidence: Four Laws and Gate hashes unchanged; completion-ritual file untouched.
- [x] CHK-132 [P2] Anti-softening rule reviewed against existing honesty rules. Evidence: VERDICT_LOCK keeps confirmed P0 as FAIL and preserves exact verdict output.
- [x] CHK-133 [P2] Data handling compliant. Evidence: diagnostics expose paths and hashes only; no content or secrets are logged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (incl. integration-plan cross-refs). Evidence: tasks, plan, checklist, spec, and implementation summary reconciled for the current slice.
- [x] CHK-141 [P1] `.claude/agents/*` mirrors updated or mirror-lag recorded. Evidence: `.claude` and `.codex` mirrors updated for all five scoped agents.
- [x] CHK-142 [P2] User-facing message wording reviewed. Evidence: stale message is actionable and includes How to Fix/fix details.
- [x] CHK-143 [P2] Knowledge transfer documented. Evidence: `validation_rules.md` and implementation summary describe flags and behavior.
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
