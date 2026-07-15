---
title: "Verification Checklist: OpenCode Runtime Scenarios (Code Graph Playbook 001)"
description: "Verification Date: 2026-05-26"
trigger_phrases:
  - "opencode runtime scenarios checklist"
  - "code graph live mcp checklist"
  - "029 phase 001 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 verification checklist"
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
# Verification Checklist: OpenCode Runtime Scenarios (Code Graph Playbook 001)

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
- [ ] CHK-003 [P1] opencode DeepSeek provider confirmed available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Dispatch prompts CLEAR-checked before send
- [ ] CHK-011 [P0] No secrets in dispatch prompts
- [ ] CHK-012 [P1] Spec folder passed as pre-approved to dispatch
- [ ] CHK-013 [P1] `--format json --dir <repo-root> </dev/null` on every dispatch
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 15 scenarios dispatched
- [ ] CHK-021 [P0] Each scenario has PASS/FAIL/SKIP verdict + reason
- [ ] CHK-022 [P1] Each verdict cites JSON field evidence
- [ ] CHK-023 [P1] Malformed-call scenario (011) shows field-specific errors
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Any FAIL verdict classed (instance-only / class-of-bug / etc.) and logged, not fixed in place
- [ ] CHK-FIX-002 [P0] Reproducing command captured for each FAIL
- [ ] CHK-FIX-003 [P0] No live runtime/source edited during this validation phase
- [ ] CHK-FIX-004 [P0] Mutating scenarios proven to run on disposable workspace
- [ ] CHK-FIX-005 [P1] Scenario→feature_catalog cross-reference recorded
- [ ] CHK-FIX-006 [P1] Dispatch hangs recorded as SKIP with reason + retry note
- [ ] CHK-FIX-007 [P1] Evidence pinned to captured JSON files, not transient stdout
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in prompts or evidence
- [ ] CHK-031 [P0] No `--dangerously-skip-permissions` used
- [ ] CHK-032 [P1] DeepSeek API key never echoed to logs/evidence
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] evidence.md complete with 15 rows
- [ ] CHK-042 [P2] implementation-summary.md updated post-run
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Dispatch prompts + raw JSON in scratch/ only
- [ ] CHK-051 [P1] scratch/ retained as evidence (do NOT clean — this is a validation packet)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-05-26
<!-- /ANCHOR:summary -->
