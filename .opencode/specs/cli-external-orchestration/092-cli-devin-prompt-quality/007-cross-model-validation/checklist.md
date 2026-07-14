---
title: "Verification Checklist: cross-model-validation"
description: "Planning-state checklist for packet 113/007. Items remain pending until the confirm harness is built, run, and analyzed."
trigger_phrases:
  - "113/007 verification checklist"
  - "cross model validation checklist"
  - "deepseek kimi checklist"
  - "confirm harness verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation"
    last_updated_at: "2026-05-17T12:18:35Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-planned-verification-state"
    next_safe_action: "build-cross-model-confirm-harness"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/state/confirm-results.jsonl"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/007-cross-model-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "All implementation verification remains pending"
    answered_questions:
      - "Checklist represents planned gates, not completed verification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: cross-model-validation

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Harness passes `node --check`
- [ ] CHK-011 [P0] Harness logs provider errors without leaking credentials
- [ ] CHK-012 [P1] Tuple failures are recorded with enough detail to rerun
- [ ] CHK-013 [P1] Harness follows existing CommonJS packet script patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Full 70-dispatch matrix complete or explicitly accounted for
- [ ] CHK-022 [P1] Provider preflight complete for both routes
- [ ] CHK-023 [P1] Extraction and scoring outputs validated on sample rows
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class is `matrix/evidence`: cross-model validation for prompt-guidance propagation.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory covers the 113/003 variants under test.
- [ ] CHK-FIX-003 [P0] Consumer inventory covers packet 113/006 held propagation decisions and future CLI prompt cards.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction cases inherit coverage from 113/005 extraction and fixture deterministic checks where applicable.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant is not applicable unless the harness reads process-wide mutable state beyond provider credentials.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to packet-local result rows, not a moving branch-relative summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Provider inputs validated before dispatch
- [ ] CHK-032 [P1] Auth/authz is limited to existing provider environment
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized after run
- [ ] CHK-041 [P1] Harness comments explain non-obvious scoring and resume behavior
- [ ] CHK-042 [P2] README update not applicable unless operator run instructions need a public surface
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] Result state stays under packet 113/007 state or scratch paths
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-05-17
<!-- /ANCHOR:summary -->

---

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented if the harness changes provider routing assumptions
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Wall-clock estimate reviewed against actual provider latency
- [ ] CHK-111 [P1] Throughput target limited to one row per tuple without duplicate dispatch
- [ ] CHK-112 [P2] Load testing not applicable
- [ ] CHK-113 [P2] Cost and latency notes documented after run
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested for packet-local files
- [ ] CHK-121 [P0] Feature flag not applicable
- [ ] CHK-122 [P1] Monitoring is packet-local result logging
- [ ] CHK-123 [P1] Operator run notes captured in plan or analysis
- [ ] CHK-124 [P2] Deployment runbook not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed for provider credential handling
- [ ] CHK-131 [P1] Dependency licenses unchanged
- [ ] CHK-132 [P2] OWASP checklist not applicable
- [ ] CHK-133 [P2] Data handling limited to local packet result artifacts
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized after implementation
- [ ] CHK-141 [P1] API documentation not applicable
- [ ] CHK-142 [P2] User-facing documentation not applicable
- [ ] CHK-143 [P2] Knowledge transfer documented in implementation-summary.md after completion
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| cli-codex | Documentation author | Planning docs prepared | 2026-05-17 |
| Operator | Product owner | Pending implementation | |
| Strict validation | QA gate | Pending final command | |
<!-- /ANCHOR:sign-off -->
