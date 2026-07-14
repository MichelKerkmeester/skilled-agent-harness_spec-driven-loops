---
title: "Verification Checklist: Phase 003 OpenCode Internals [template:level_2/checklist.md]"
description: "Verification checklist for Phase 003 .opencode internal rename work."
trigger_phrases:
  - "082 phase 003 checklist"
  - "opencode internals verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T11:12:38Z"
    last_updated_by: "codex"
    recent_action: "Checklist created"
    next_safe_action: "Resolve rebuild blocker"
    blockers:
      - "advisor_rebuild blocked by deep-agent-improvement skill_id mismatch"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Should the deep-agent-improvement graph metadata mismatch be fixed before Phase 004?"
    answered_questions: []
---
# Verification Checklist: Phase 003 OpenCode Internals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim full phase completion until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: parent and Phase 003 specs read before edits.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md records scoped literal rotation and verification path.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: branch `main`, target files read; cli-copilot files are absent/deleted in working tree.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks. Evidence: JSON/JSONL `jq` checks and Python `py_compile` passed.
- [x] CHK-011 [P0] No prompt-card sync drift. Evidence: `check-prompt-quality-card-sync.sh` returned `SYNC OK`.
- [x] CHK-012 [P1] Error handling documented. Evidence: advisor rebuild failure is recorded in tasks and implementation summary.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: replacements preserve existing literal-string structures in Python, TypeScript, JSON, shell, JSONL, and Markdown.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Phase 003 acceptance criteria met for source refs. Evidence: explicit Phase 003 file-list grep returned zero `sk-improve-prompt` hits.
- [x] CHK-021 [P0] Manual verification complete. Evidence: broad scoped grep was run and residuals classified as Phase 005-only.
- [x] CHK-022 [P1] Edge cases tested. Evidence: JSONL line validation, prompt-card hash sync, and Python probe executed.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: advisor rebuild failure reproduced through the compiled handler with exact metadata mismatch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: source refs are instance-only literal rotations; rebuild blocker is a cross-packet metadata mismatch.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: Phase 001 inventory and explicit Phase 003 file-list grep were used.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: dispatcher, advisor, cli mirrors, cross-skill refs, and docs were covered.
- [x] CHK-FIX-004 [P0] Security/path/parser fixes include adversarial cases. Evidence: not applicable; this is a semantic rename with no parser/security logic changes.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: implementation summary groups files by dispatcher, advisor, cli mirrors, and cross-skill refs.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when needed. Evidence: not applicable; no env/global-state logic changed.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands. Evidence: tasks.md and implementation-summary.md list exact command evidence.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: only skill ID/path literals changed.
- [x] CHK-031 [P0] Input validation implemented. Evidence: not applicable; no input path or schema logic changed.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable; no auth surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md updated.
- [x] CHK-041 [P1] Code comments adequate. Evidence: no new code comments were needed for literal string rotations.
- [x] CHK-042 [P2] README updated if applicable. Evidence: Phase 005 README surfaces intentionally left untouched per constraints.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files were created in the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no scratch artifacts were produced.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
