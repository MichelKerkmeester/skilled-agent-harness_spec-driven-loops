---
title: "Verification Checklist: Skill Uplift"
description: "Checklist for applying 003 synthesis winners to cli-devin SKILL.md + assets + changelog"
trigger_phrases:
  - "113/004 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/004-skill-uplift"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Verify items after uplift commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114043"
      session_id: "114-004-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Uplift

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

- [ ] CHK-001 [P0] 003 synthesis.md operator-ratified
- [ ] CHK-002 [P0] Mapping table approved by operator (each winner → target file + section)
- [ ] CHK-003 [P1] sk-doc validator confirmed working on a sample file
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every edited file passes sk-doc validator
- [ ] CHK-011 [P0] No syntax errors in modified markdown (frontmatter still parses)
- [ ] CHK-012 [P1] Edits preserve existing anchor structure
- [ ] CHK-013 [P1] Edits respect HVR voice rules (no em dashes, no AI filler)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 REQs (001..006) satisfied
- [ ] CHK-021 [P0] swe-1.6 smoke test passes (no regression vs pre-uplift baseline)
- [ ] CHK-022 [P1] Non-SWE-1.6 playbook entries unaffected (verify if shared scaffolding touched)
- [ ] CHK-023 [P1] Changelog reads cleanly to a future developer
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each winner classified: `class-of-bug` (replaces pattern repo-wide) or `instance-only` (single template variant)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'SWE.?1\.6|swe-1\.6' .opencode/skills/cli-devin/` covers all SWE 1.6 references
- [ ] CHK-FIX-003 [P0] Consumer inventory: external consumers of cli-devin contracts identified via grep
- [ ] CHK-FIX-004 [P0] No security/path/parser/redaction fixes in scope (prompt scaffolding changes only)
- [ ] CHK-FIX-005 [P1] Matrix axes: winner list × target files documented in mapping table
- [ ] CHK-FIX-006 [P1] N/A — no hostile env/global-state changes
- [ ] CHK-FIX-007 [P1] Evidence pinned to synthesis.md line range OR specific commit SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] New prompt patterns don't expose repo secrets
- [ ] CHK-031 [P0] Anti-hallucination wording strengthens (not weakens) hallucination defenses
- [ ] CHK-032 [P1] Changelog doesn't leak proprietary fixture content
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] cli-devin SKILL.md + assets + changelog all updated coherently
- [ ] CHK-041 [P1] Each diff hunk has rationale (synthesis citation or inline comment)
- [ ] CHK-042 [P2] Future-reader test: a developer 6 months from now understands the change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp/scratch files in cli-devin tree
- [ ] CHK-051 [P1] changelog/ directory follows existing version-file naming
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (no 4-runtime mirror) documented
- [ ] CHK-101 [P1] ADR Status field set
- [ ] CHK-102 [P1] Alternatives documented
- [ ] CHK-103 [P2] N/A — no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01: no regression in cli-devin dispatch latency
- [ ] CHK-111 [P1] N/A — no throughput
- [ ] CHK-112 [P2] N/A
- [ ] CHK-113 [P2] Smoke test timing logged
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback (git revert) documented
- [ ] CHK-121 [P0] No feature flags applicable
- [ ] CHK-122 [P1] Smoke test scope identified before commit
- [ ] CHK-123 [P1] N/A — no runbook for skill changes
- [ ] CHK-124 [P2] N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No external license concerns
- [ ] CHK-131 [P1] N/A
- [ ] CHK-132 [P2] N/A
- [ ] CHK-133 [P2] N/A
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] cli-devin SKILL.md / assets / changelog consistent
- [ ] CHK-141 [P1] No API changes (cli flags unchanged)
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
