---
title: "Verification Checklist: Council Design"
description: "Verification checklist for 3-seat council deliberation outcomes"
trigger_phrases:
  - "113/001 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/001-council-design"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Verify items after council run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114013"
      session_id: "114-001-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Council Design

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

- [ ] CHK-001 [P0] Phase parent (114) spec.md ratified
- [ ] CHK-002 [P0] 3 CLI executors (codex, claude, gemini) authenticated
- [ ] CHK-003 [P1] deep-ai-council skill discoverable via skill_advisor
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code authored in this packet (council-only; deferral verified)
- [ ] CHK-011 [P0] All artifacts under `ai-council/**`
- [ ] CHK-012 [P1] State JSONL append-only (no in-place rewrites)
- [ ] CHK-013 [P1] Seat proposals follow Q1/Q2/Q3 structure
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001..005 all satisfied (all 5 P0 reqs from spec.md)
- [ ] CHK-021 [P0] strict-validate exit 0 on this packet
- [ ] CHK-022 [P1] REQ-006..008 satisfied (P1 reqs)
- [ ] CHK-023 [P1] Council-report.md readable by downstream (002, 003) without ambiguity
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — council-only packet, no code fixes here
- [ ] CHK-FIX-002 [P0] N/A
- [ ] CHK-FIX-003 [P0] N/A
- [ ] CHK-FIX-004 [P0] N/A
- [ ] CHK-FIX-005 [P1] N/A
- [ ] CHK-FIX-006 [P1] N/A
- [ ] CHK-FIX-007 [P1] N/A
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in seat prompts or proposals
- [ ] CHK-031 [P0] Seat prompts don't leak sensitive repo paths
- [ ] CHK-032 [P1] CLI executors use existing auth (no new tokens minted)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / council-report.md synchronized
- [ ] CHK-041 [P1] Council decisions cited with seat attribution
- [ ] CHK-042 [P2] README link added to ai-council/ if needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files outside `ai-council/`
- [ ] CHK-051 [P1] No `scratch/` directory created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (sequential vs parallel) documented in decision-record.md
- [ ] CHK-101 [P1] ADR has Status field set
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] No migration path needed (greenfield)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01 met: end-to-end run < 30 min wall-clock
- [ ] CHK-111 [P1] N/A — no throughput target
- [ ] CHK-112 [P2] N/A — no load testing
- [ ] CHK-113 [P2] Wall-clock benchmark logged in implementation-summary.md
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure (rm -rf ai-council/) documented
- [ ] CHK-121 [P0] No feature flags applicable
- [ ] CHK-122 [P1] N/A — no live monitoring (offline deliberation)
- [ ] CHK-123 [P1] N/A — no runbook needed
- [ ] CHK-124 [P2] N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Scope-write boundary verified (REQ-005)
- [ ] CHK-131 [P1] No external license concerns (markdown artifacts)
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 5 packet spec docs synchronized
- [ ] CHK-141 [P1] N/A — no API
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
