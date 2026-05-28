---
title: "Verification Checklist: Devin Static Scenarios (Code Graph Playbook 002)"
description: "Verification Date: 2026-05-26"
trigger_phrases:
  - "devin static scenarios checklist"
  - "code graph post-rename infra checklist"
  - "029 phase 002 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 verification checklist"
    next_safe_action: "Verify items as scenarios complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Devin Static Scenarios (Code Graph Playbook 002)

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] devin auth confirmed; SWE-1.6 reachable
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] RCAF framework applied + CLEAR 5-check passed
- [ ] CHK-011 [P0] Medium-density pre-planning block in prompt (3-4 steps + acceptance)
- [ ] CHK-012 [P0] sequential_thinking 2-layer enforced (mcp add + system_instructions)
- [ ] CHK-013 [P1] Bundle-gate language kept at "standard" (no over-constraint)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 7 scenarios dispatched
- [ ] CHK-021 [P0] Each scenario has PASS/FAIL/SKIP verdict + reason
- [ ] CHK-022 [P1] Each verdict cites command/file evidence
- [ ] CHK-023 [P1] Build scenario (020) shows tsc success + entry resolution
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Any FAIL verdict classed and logged, not fixed in place
- [ ] CHK-FIX-002 [P0] Reproducing command captured for each FAIL
- [ ] CHK-FIX-003 [P0] No source files modified during validation (git status clean)
- [ ] CHK-FIX-004 [P0] `--permission-mode auto` used; no `dangerous`
- [ ] CHK-FIX-005 [P1] Scenario→feature_catalog cross-reference recorded
- [ ] CHK-FIX-006 [P1] Devin hook scenario (025) asserts `.devin/hooks.v1.json` registration
- [ ] CHK-FIX-007 [P1] Evidence pinned to captured output files, not transient stdout
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in prompts or evidence
- [ ] CHK-031 [P0] No Devin API tokens echoed
- [ ] CHK-032 [P1] Permission escalations (if any) recorded with operator approval
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] evidence.md complete with 7 rows
- [ ] CHK-042 [P2] implementation-summary.md updated post-run
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Prompts + raw output in scratch/ only
- [ ] CHK-051 [P1] scratch/ retained as evidence (validation packet — do NOT clean)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-05-26
<!-- /ANCHOR:summary -->
