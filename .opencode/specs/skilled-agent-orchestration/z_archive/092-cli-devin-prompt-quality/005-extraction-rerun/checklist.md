---
title: "Verification Checklist: cli-devin extraction rerun"
description: "Checklist for build + re-run + synthesis"
trigger_phrases:
  - "113/005 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/005-extraction-rerun"
    last_updated_at: "2026-05-17T05:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded checklist"
    next_safe_action: "Verify items after build + run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000116003"
      session_id: "113-005-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-devin extraction rerun

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

- [ ] CHK-001 [P0] 113/002 dry-run gate green
- [ ] CHK-002 [P0] claude + devin CLI authenticated
- [ ] CHK-003 [P1] Operator confirms grader cost ceiling
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All .cjs scripts pass `node --check`
- [ ] CHK-011 [P0] Extraction is idempotent (re-run produces same files)
- [ ] CHK-012 [P1] Extraction skips ambiguous blocks rather than guessing
- [ ] CHK-013 [P1] Path traversal segments rejected (no `..` escape)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Canned-output extraction test passes
- [ ] CHK-021 [P0] Re-run completes (or pauses cleanly at ceiling)
- [ ] CHK-022 [P1] Fixture seed hashes match pre/post-run (no corruption)
- [ ] CHK-023 [P1] Live grader returns non-mock JSON with confidence values
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — greenfield extension
- [ ] CHK-FIX-002 [P0] N/A
- [ ] CHK-FIX-003 [P0] Consumer inventory: 113/002 score-variant.cjs modified; grep for other callers
- [ ] CHK-FIX-004 [P0] N/A — extraction not a security/path fix
- [ ] CHK-FIX-005 [P1] Matrix: 5 variants × 7 fixtures = 35 dispatches
- [ ] CHK-FIX-006 [P1] N/A
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Extraction never writes outside fixture CWD
- [ ] CHK-031 [P0] No grader prompt-injection vector (fixture content quoted not interpolated)
- [ ] CHK-032 [P1] Grader API key not logged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] All packet spec docs synchronized
- [ ] CHK-041 [P1] synthesis-v2.md cites both v1 and v2 ranking
- [ ] CHK-042 [P2] cli-devin v1.0.6.0 draft if ranking shifted
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Runtime artifacts in 113/005/state/ (gitignored if appropriate)
- [ ] CHK-051 [P1] Final synthesis-v2.md committed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-17
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (sidecar not rewrite) documented
- [ ] CHK-101 [P1] ADR Status set
- [ ] CHK-102 [P1] Alternatives documented
- [ ] CHK-103 [P2] N/A
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01: extraction < 1s per fixture
- [ ] CHK-111 [P1] NFR-P02: total wall-clock < 2.5 hr
- [ ] CHK-112 [P2] N/A
- [ ] CHK-113 [P2] Cost tracked vs $10 ceiling
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback (rm + git revert) documented
- [ ] CHK-121 [P0] No feature flags
- [ ] CHK-122 [P1] Cost-ceiling pause sentinel works
- [ ] CHK-123 [P1] N/A
- [ ] CHK-124 [P2] N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] N/A
- [ ] CHK-131 [P1] N/A
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] 113/005 spec docs internally consistent
- [ ] CHK-141 [P1] N/A
- [ ] CHK-142 [P2] N/A
- [ ] CHK-143 [P2] N/A
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| n/a | Product Owner | [ ] Approved | |
| n/a | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
