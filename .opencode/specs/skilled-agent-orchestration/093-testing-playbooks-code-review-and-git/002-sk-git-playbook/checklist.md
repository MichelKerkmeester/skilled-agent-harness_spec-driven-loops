---
title: "Verification Checklist: 002 - sk-git manual testing playbook"
description: "Verification Date: 2026-05-07"
trigger_phrases:
  - "sk-git playbook checklist"
  - "093/002 checklist"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/002-sk-git-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 002 - sk-git manual testing playbook

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-014)
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (cli-codex, sk-doc validator, reference playbooks)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Root playbook validates clean via `validate_document.py`
- [ ] CHK-011 [P0] All ~21 per-feature files have frontmatter + 5 numbered H2 sections + 9-column scenario table
- [ ] CHK-012 [P1] All RCAF prompts pass natural-read test
- [ ] CHK-013 [P1] Pass/fail criteria reference actual sk-git reference files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-006 P0 set)
- [ ] CHK-021 [P0] Manual structural sweep passed on every per-feature file
- [ ] CHK-022 [P0] All 4 safety-refusal scenarios documented with real triggers and expected refusal messages
- [ ] CHK-023 [P1] Cross-CLI category covers Claude Code native + cli-codex + at least one of cli-opencode/cli-gemini/cli-copilot
- [ ] CHK-024 [P1] Exact-prompt sync audit passed
- [ ] CHK-025 [P1] Co-Authored-By footer scenario verifies the canonical Claude Opus 4.7 footer string
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

(N/A - this is a documentation-creation packet, not a fix.)

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class. (N/A - no findings expected)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. (N/A)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed. (N/A)
- [ ] CHK-FIX-004 [P0] Adversarial table tests for security/path/parser fixes. (N/A)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed. (N/A)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed. (N/A)
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix SHA. (Apply to implementation-summary.md anchors)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any playbook content
- [ ] CHK-031 [P0] Secrets-refusal scenario uses `<REDACTED>` placeholders
- [ ] CHK-032 [P0] Force-push and amend scenarios document dangerous commands without executing them
- [ ] CHK-033 [P1] No real branch names that could be force-pushed accidentally
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md synchronized
- [ ] CHK-041 [P1] Per-feature SOURCE FILES sections cite actual sk-git reference files
- [ ] CHK-042 [P2] Cross-references between root playbook and per-feature files all resolve
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No forbidden sidecar files (`review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`)
- [ ] CHK-051 [P1] Category folders use canonical `NN--category-name/` naming
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-07
<!-- /ANCHOR:summary -->
