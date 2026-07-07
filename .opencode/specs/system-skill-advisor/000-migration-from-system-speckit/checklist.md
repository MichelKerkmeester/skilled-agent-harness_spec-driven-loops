---
title: "Verification Checklist: Migration From system-speckit"
description: "Verification Date: 2026-07-07"
trigger_phrases:
  - "verification"
  - "checklist"
  - "skill-advisor migration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/000-migration-from-system-speckit"
    last_updated_at: "2026-07-07T11:01:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored checklist.md alongside spec.md, plan.md, tasks.md"
    next_safe_action: "Dispatch the /deep:review 20-iteration loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Migration From system-speckit

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

- [x] CHK-001 [P0] Requirements documented in spec.md (verified)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verified)
- [x] CHK-003 [P1] Manifest source-to-destination mapping fully enumerated (verified) - spec.md Scope section, from 3 parallel Explore agents plus git log --follow archaeology
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

N/A. This packet moves and renumbers spec-doc folders, it does not change application code, so lint/console/error-handling checks do not apply.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `validate.sh --strict --recursive` clean on `system-skill-advisor/`
- [ ] CHK-021 [P0] `validate.sh --strict --recursive` clean on `026/`, `027/`, `028/`
- [ ] CHK-022 [P0] Repo-wide `rg` for every old path fragment returns zero live hits
- [ ] CHK-023 [P1] Manual spot-read confirms `system-skill-advisor/spec.md` narrates 001-012 coherently
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every moved folder used `git mv`, not delete-and-recreate (history preserved, verifiable via `git log --follow`)
- [ ] CHK-FIX-002 [P0] No scoped commit used `git add -A` (verified against the concurrent session's ~2,700 unrelated dirty paths)
- [ ] CHK-FIX-003 [P0] Every touched parent's `children_ids` reconciled to the folders actually on disk
- [ ] CHK-FIX-004 [P1] Contiguous renumbering applied to every parent that lost a child (no gaps left)
- [ ] CHK-FIX-005 [P1] `027/003-advisor-and-codegraph/spec.md` prose updated to reflect its narrower post-split scope
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

N/A. No secrets, auth, or input-validation surface is touched by moving spec-doc folders.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized with final executed state
- [ ] CHK-041 [P1] `implementation-summary.md` written with evidence (validate output, rg output)
- [ ] CHK-042 [P2] Scoped `memory_index_scan` run per moved path
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files used, all authoring went directly into the tracked spec folder (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 6 | 3/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-07-07 (pre-execution baseline, migration not yet run)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (verified) - ADR-001 numbering scheme, ADR-002 shared-infra policy, ADR-003 renumbering policy
- [x] CHK-101 [P1] All ADRs have status Accepted (verified)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (verified)
- [ ] CHK-103 [P2] Migration path documented (if applicable) - N/A, this packet is the migration itself
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

N/A. This is a spec-folder reorganization, it has no runtime performance surface.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (verified) - see plan.md Rollback Plan, per-batch `git revert`, each batch independently committed
- [ ] CHK-121 [P0] Feature flag configured (if applicable) - N/A, no runtime feature flag involved
- [ ] CHK-122 [P1] Monitoring/alerting configured - N/A
- [ ] CHK-123 [P1] Runbook created - covered by plan.md's batch sequencing
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

N/A. No security review, license, or data-handling surface applies to a spec-folder migration.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-142 [P2] `context-index.md` documents the 6 left-in-place shared/joint items
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Requester | [x] Approved (plan mode approval) | 2026-07-07 |
<!-- /ANCHOR:sign-off -->
