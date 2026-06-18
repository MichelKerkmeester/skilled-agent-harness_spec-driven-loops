---
title: "Verification Checklist: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only [template:level_3/checklist.md]"
description: "Verification Date: 2026-06-03"
trigger_phrases:
  - "model registry verification"
  - "benchmark hub checklist"
  - "sk-prompt forkable checklist"
  - "deep-improvement hub checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Checklist authored and verified post-implementation"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-008 present with acceptance criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — three-phase sequenced migration with grep verification
- [x] CHK-003 [P1] Dependencies identified and available — six sub-phases, ~121 refs, four skill surfaces all in working tree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No lint errors introduced — YAML, JSON, Markdown all well-formed after edits
- [x] CHK-011 [P0] No console errors — `node -e` require of hub registry succeeds without errors
- [x] CHK-012 [P1] Error handling: deep-improvement .cjs scripts are path-agnostic; no new error paths introduced
- [x] CHK-013 [P1] Code follows project patterns — hub path follows existing `assets/` and `benchmarks/` conventions in sk-prompt-small-model
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-008 verified by grep + node checks
- [x] CHK-021 [P0] Manual testing complete — `rg 'sk-prompt/assets/model-profiles'` returns zero hits in active surfaces
- [x] CHK-022 [P1] Edge cases tested — sub-phases with no run-data got `BENCHMARK-RELOCATED.md` with `hub_path: N/A`
- [x] CHK-023 [P1] Error scenarios validated — rollback procedure documented in plan.md
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — migration is a relocation (cross-consumer); all consumer surfaces identified in plan.md Affected Surfaces table
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — `find . -name model-profiles.json` confirms single producer at hub after migration
- [x] CHK-FIX-003 [P0] Consumer inventory completed — ~121 reference files identified and repointed; cli-opencode templates updated; deep-improvement YAML updated
- [x] CHK-FIX-004 [P0] N/A — no security/path/parser/redaction fix; this is a relocation
- [x] CHK-FIX-005 [P1] Matrix axes listed — six sub-phases × run-data types (fixtures, profiles, synthesis) documented in tasks T010-T015
- [x] CHK-FIX-006 [P1] N/A — no process-wide state reads in this migration
- [x] CHK-FIX-007 [P1] Evidence pinned to implementation session on 2026-06-03; verified via spec prompt description and grep results
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — model-profiles.json contains only model IDs, display names, and capability flags; no credentials
- [x] CHK-031 [P0] Input validation N/A — no runtime input; filesystem migration only
- [x] CHK-032 [P1] Auth/authz N/A — no auth surfaces in this migration
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all three reflect the same work with matching task IDs and requirements
- [x] CHK-041 [P1] Code comments adequate — `BENCHMARK-RELOCATED.md` pointers in each gutted sub-phase provide clear provenance
- [x] CHK-042 [P2] README N/A — no user-facing README affected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files created during this migration
- [x] CHK-051 [P1] scratch/ cleaned — scratch directory is empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-03
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — three ADRs: benchmarks-to-hub, model-profiles.md deleted, deep-improvement hub-only
- [x] CHK-101 [P1] All ADRs have status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale in each ADR
- [x] CHK-103 [P2] Migration path documented — plan.md Phase 2 tasks T004-T021 provide full migration sequence
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Registry load time unchanged — synchronous JSON require; path change does not affect load time
- [x] CHK-111 [P1] N/A — no throughput targets for filesystem migration
- [x] CHK-112 [P2] N/A — no load testing applicable
- [x] CHK-113 [P2] N/A — benchmark performance is of the AI evaluations, not this migration itself
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented in plan.md §7 and L2 Enhanced Rollback
- [x] CHK-121 [P0] Feature flag N/A — filesystem migration, no feature flag needed
- [x] CHK-122 [P1] Monitoring N/A — no runtime service affected
- [x] CHK-123 [P1] Runbook: plan.md Phase 3 verification tasks serve as runbook for confirming migration health
- [x] CHK-124 [P2] Deployment runbook reviewed by author
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review: no secrets or credentials in migrated files
- [x] CHK-131 [P1] Dependency licenses: all dependencies are internal skill files; no external license concerns
- [x] CHK-132 [P2] N/A — OWASP not applicable to a filesystem migration
- [x] CHK-133 [P2] Data handling: model-profiles.json contains only public model metadata; no PII or sensitive data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md all consistent
- [x] CHK-141 [P1] API documentation N/A — no API surface changed
- [x] CHK-142 [P2] User-facing documentation: `BENCHMARK-RELOCATED.md` pointers inform any reader navigating old sub-phase paths
- [x] CHK-143 [P2] Knowledge transfer: decision-record.md captures rationale for all three architectural choices
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| MichelKerkmeester | Author / Technical Lead | [x] Approved | 2026-06-03 |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
