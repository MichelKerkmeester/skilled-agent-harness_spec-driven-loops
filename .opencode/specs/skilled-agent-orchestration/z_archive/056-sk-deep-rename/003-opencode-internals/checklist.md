---
title: "Verification Checklist: Phase 003 OpenCode Internal References"
description: "Verification Date: 2026-05-05"
trigger_phrases:
  - "070 phase 003 checklist"
  - "opencode internal reference verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "completed"
    next_safe_action: "Start Phase 004 handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 003 OpenCode Internal References

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (evidence: `REQ-001` through `REQ-008`)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (evidence: critical-edge-first replacement workflow)
- [x] CHK-003 [P1] Dependencies identified and available (evidence: parent docs, Phase 001 inventory, Python JSON parser, grep, validator)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-CODE-001 [P0] Critical graph metadata files contain no old skill IDs (evidence: both critical residual counts `0`)
- [x] CHK-CODE-002 [P0] Edited JSON files parse successfully (evidence: `json_checked=96`)
- [x] CHK-CODE-003 [P0] No excluded historical paths are modified (evidence: replacement commands excluded `z_archive/`, `runs/`, Phase 001 inventory, SQLite databases, deep skill changelogs, and fixture `053`)
- [x] CHK-CODE-004 [P1] Mechanical replacement preserves new command IDs and only updates underlying skill references (evidence: agent/command audit count `0`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-TEST-001 [P0] `sk-code-review/graph-metadata.json` residual count is 0
- [x] CHK-TEST-002 [P0] `skill_advisor/graph-metadata.json` residual count is 0
- [x] CHK-TEST-003 [P0] Active specs grep audit returns 0
- [x] CHK-TEST-004 [P0] Agent/command grep audit returns 0
- [x] CHK-TEST-005 [P0] MCP server/scripts grep audit returns 0 outside explicit exclusions
- [x] CHK-TEST-006 [P1] OpenCode alignment drift verifier runs or deferral is recorded (evidence: PASS, 0 errors, 21 warnings)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Known broken advisor metadata edges fixed before broad replacement
- [x] CHK-FIX-002 [P0] Other skills' docs and metadata references updated
- [x] CHK-FIX-003 [P0] Commands and agents reference `deep-review`/`deep-research`
- [x] CHK-FIX-004 [P0] MCP advisor/scorer code and tests use new canonical IDs
- [x] CHK-FIX-005 [P1] Active spec folder docs and metadata use new canonical IDs where in scope
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC-001 [P0] No secrets or binary database contents are introduced into docs or outputs
- [x] CHK-SEC-002 [P1] SQLite databases are not edited directly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-DOC-001 [P1] Spec/plan/tasks/checklist reflect completed Phase 003 state
- [x] CHK-DOC-002 [P1] Completion evidence is recorded in this checklist
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-ORG-001 [P0] Phase 003 artifacts live inside `003-opencode-internals/`
- [x] CHK-ORG-002 [P0] No files outside `.opencode/` and this phase folder are modified by this phase
- [x] CHK-ORG-003 [P0] `z_archive/`, `runs/`, Phase 001 inventory files, binary databases, and historical deep skill changelogs are untouched
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
