---
title: "Verification Checklist: 094 - naturalize playbook prompt voice"
description: "Verification Date: 2026-05-07"
trigger_phrases:
  - "094 checklist"
importance_tier: "high"
contextType: "doc-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/094-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Phase A edits"
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
# Verification Checklist: 094 - naturalize playbook prompt voice

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-013)
- [ ] CHK-002 [P0] Heuristic ADR authored in decision-record.md
- [ ] CHK-003 [P1] Per-playbook inventory complete (16 dirs, ~498 files)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 4 sk-doc files updated and validate clean via `validate_document.py`
- [ ] CHK-011 [P0] All 16 playbook root files validate clean post-refactor
- [ ] CHK-012 [P0] Prompt-sync audit returns 0 mismatches across ~498 per-feature files
- [ ] CHK-013 [P1] RCAF retention rate sits in 15-40% band globally (target ~28%)
- [ ] CHK-014 [P1] Per-playbook retention rates align with expected bands (cli-* high, sk-/deep- low)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria met (REQ-001..REQ-005)
- [ ] CHK-021 [P0] Per-playbook structural sweep passes for all 16 (frontmatter + 5 H2 + 9-col table)
- [ ] CHK-022 [P0] @review DQI returns no P0 regressions on sk-code-review or sk-git playbooks
- [ ] CHK-023 [P1] @review DQI returns no P1 regressions on sk-code-review or sk-git playbooks
- [ ] CHK-024 [P1] Naturalness spot-check passes on 5 random scenarios per playbook
- [ ] CHK-025 [P1] Forbidden-sidecar sweep returns empty across all 16 playbooks
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding from @review DQI has a finding class. (Activates if @review surfaces findings)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: every playbook in scope confirmed in inventory; no playbook silently skipped.
- [ ] CHK-FIX-003 [P0] Consumer inventory: prompt-equality contract preserved (SCENARIO CONTRACT == 9-col table cell) across every refactored file.
- [ ] CHK-FIX-004 [P0] Adversarial table tests: orchestrator-as-actor scenarios (cross-CLI, safety refusal) retained RCAF; human-direct scenarios converted to natural-human; verified by spot-check.
- [ ] CHK-FIX-005 [P1] Matrix axes: 16 playbooks × per-scenario classification. Counted post-refactor.
- [ ] CHK-FIX-006 [P1] Hostile env variant: N/A (doc-only change).
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA in implementation-summary.md (or explicit diff range if not yet committed).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, credentials, or sensitive paths introduced in any refactored prompt
- [ ] CHK-031 [P0] cli-codex sandbox is `workspace-write` (no network mutation outside repo)
- [ ] CHK-032 [P1] No external CLI binary invocations introduced as part of natural-human conversions (preserve existing executable steps)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] sk-doc templates reflect new RCAF-optional default
- [ ] CHK-041 [P0] sk-doc creation reference §5 includes "When to use RCAF vs natural-human" subsection
- [ ] CHK-042 [P1] `/create:testing-playbook` command line 317 updated to acknowledge both voices
- [ ] CHK-043 [P1] decision-record.md ADR-001 captures the rubric with examples
- [ ] CHK-044 [P2] Per-feature SOURCE FILES sections still cite the right reference files (no link rot from prompt edits)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] No files outside scope modified (`git diff --name-only` review)
- [ ] CHK-051 [P1] No new sidecar files introduced (forbidden-sidecar sweep)
- [ ] CHK-052 [P1] All edits stay within `manual_testing_playbook/` directories or the 4 sk-doc files
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-07
<!-- /ANCHOR:summary -->
