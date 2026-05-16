---
title: "Verification Checklist: Eval Rig"
description: "Checklist for fixtures + grader + cache + deterministic checks + dry-run gate"
trigger_phrases:
  - "114/002 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/002-eval-rig"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Verify items after rig build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114023"
      session_id: "114-002-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Eval Rig

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

- [ ] CHK-001 [P0] council-report.md ratified upstream
- [ ] CHK-002 [P0] Node.js >= 18 confirmed
- [ ] CHK-003 [P1] Grader CLI authenticated (cli-claude-code or cli-codex per council)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All .cjs scripts pass `node --check`
- [ ] CHK-011 [P0] No console warnings/errors during dry-run
- [ ] CHK-012 [P1] Error handling: grader unavailable, fixture missing, cache corrupt
- [ ] CHK-013 [P1] Scripts follow CommonJS pattern (no ES modules)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001..006 (all P0) satisfied
- [ ] CHK-021 [P0] Full dry-run exit 0
- [ ] CHK-022 [P1] Edge cases: empty output, malformed grader JSON, cache disk-full handled
- [ ] CHK-023 [P1] Concurrent cache writes don't tear (100-entry test)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — greenfield rig
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

- [ ] CHK-030 [P0] No hardcoded secrets in fixtures, scripts, or grader prompts
- [ ] CHK-031 [P0] Grader prompts scrubbed of tokens before dispatch
- [ ] CHK-032 [P1] Cache directory not world-readable if sensitive (mode 700)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Inline comments in scripts explain non-obvious logic only
- [ ] CHK-042 [P2] README in 002-eval-rig/ root if rig grows complex
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/scratch files outside this packet's tree
- [ ] CHK-051 [P1] cache/{det,grader}/ subdirs created and used; not mixed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (separate det/grader caches) documented
- [ ] CHK-101 [P1] ADR Status field set
- [ ] CHK-102 [P1] Alternatives documented
- [ ] CHK-103 [P2] N/A — no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01: single grader call < 30s p95
- [ ] CHK-111 [P1] NFR-P02: deterministic suite < 1s per output
- [ ] CHK-112 [P2] Benchmark logged in implementation-summary.md
- [ ] CHK-113 [P2] No throughput target (single-fixture scoring)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback (rm -rf packet subdirs) documented
- [ ] CHK-121 [P0] No feature flags
- [ ] CHK-122 [P1] Cache size monitoring (operator manual)
- [ ] CHK-123 [P1] N/A — no live deployment
- [ ] CHK-124 [P2] N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No external license concerns (vanilla Node.js)
- [ ] CHK-131 [P1] Fixture content scrubbed for sensitive paths
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet spec docs synchronized
- [ ] CHK-141 [P1] N/A — internal scripts only
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
