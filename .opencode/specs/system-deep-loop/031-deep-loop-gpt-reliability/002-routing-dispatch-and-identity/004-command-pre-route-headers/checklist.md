---
title: "Verification Checklist: Command Pre-Route Headers"
description: "Verification Date: 2026-06-30"
trigger_phrases:
  - "verification"
  - "checklist"
  - "command-pre-route-headers"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers"
    last_updated_at: "2026-06-30T18:37:51Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Checklist evidence complete; strict validation passed"
    next_safe_action: "Proceed to phase 004 GPT verification smoke"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in spec.md - Evidence: Level 2 spec includes scope, requirements, success criteria, NFRs, and edge cases.
- [x] CHK-002 [P0] Technical approach defined in plan.md - Evidence: plan includes architecture, phases, testing, dependencies, and rollback.
- [x] CHK-003 [P1] Dependencies identified and available - Evidence: predecessors complete; `deep-loop-runtime` Vitest dependency root available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] Code passes syntax/type checks - Evidence: `node --check` passed for modified council scripts; `npm run typecheck` passed in `deep-loop-runtime`.
- [x] CHK-011 [P0] Comment hygiene passes - Evidence: `check-comment-hygiene.sh` exited 0 for modified files.
- [x] CHK-012 [P1] Code follows project patterns - Evidence: additive prompt-contract changes; no new broad abstraction; alignment checks passed.
- [x] CHK-013 [P1] Native dispatch fields preserved - Evidence: grep found native `agent:` fields still present for research, review, and context.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] All acceptance criteria met by targeted verification - Evidence: route-header-static-check PASS.
- [x] CHK-021 [P0] Council route propagation tested - Evidence: focused Vitest run passed 2 files and 8 tests.
- [x] CHK-022 [P1] Error scenarios considered - Evidence: static check fails if council YAML gains forbidden `if_cli_opencode`; council defaults cover missing optional route config.
- [x] CHK-023 [P1] Prompt-body regression checked - Evidence: edits are additive header lines before existing body sections.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - Evidence: phase scope maps F13/F14/F15/F28-F30 to prompt-contract hardening.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep - Evidence: research/review templates, context contracts, and council prompt/script seams all covered.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests - Evidence: council session/topic script consumers and focused tests updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests where applicable - Evidence: not applicable; this phase changes prompt contracts and route propagation only, with no parser/path/security mutation.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - Evidence: four-mode matrix is documented in spec and plan.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - Evidence: not applicable; new script defaults do not read environment or global process state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands and file paths - Evidence: task list and implementation summary record commands and changed paths.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] No hardcoded secrets - Evidence: route strings contain no credentials or secret material.
- [x] CHK-031 [P0] Input validation impact reviewed - Evidence: no user-input parser or validation boundary changed.
- [x] CHK-032 [P1] Auth/authz impact reviewed - Evidence: no permission model or auth boundary changed; native dispatch fields preserved.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - Evidence: all phase docs describe the same four-mode route-header implementation.
- [x] CHK-041 [P1] Implementation summary updated - Evidence: implementation-summary.md records files changed and verification evidence.
- [x] CHK-042 [P2] README updated if applicable - Evidence: not applicable; no public README contract changed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] Temp files avoided outside approved scratch/temp paths - Evidence: no persistent temp files created.
- [x] CHK-051 [P1] Scope limited to phase files and route-header implementation surfaces - Evidence: changed files align with spec scope and council propagation tests.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-30
**Verified By**: OpenCode GPT-5.5
**Strict Validation**: PASS - 0 errors, 0 warnings.
<!-- /ANCHOR:summary -->
