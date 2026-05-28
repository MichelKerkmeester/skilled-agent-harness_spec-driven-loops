---
title: "Verification Checklist: Hook + Doc-Sync Fixes (029 Phase 004)"
description: "Verification Date: 2026-05-27"
trigger_phrases:
  - "devin hook fix checklist"
  - "playbook doc sync checklist"
  - "029 phase 004 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 checklist"
    next_safe_action: "Verify as fixes land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Hook + Doc-Sync Fixes (029 Phase 004)

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
- [ ] CHK-002 [P0] Correct hook artifact path confirmed to exist
- [ ] CHK-003 [P1] Stale doc targets identified from 029 evidence
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.devin/hooks.v1.json` remains valid JSON after edit
- [ ] CHK-011 [P0] Registered SessionStart path passes `test -f`
- [ ] CHK-012 [P1] Path matches sibling hook pattern (`<skill>/mcp_server/dist/hooks/devin/`)
- [ ] CHK-013 [P1] Doc edits match verified runtime facts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Startup payload through registered hook emits `## Session Context`
- [ ] CHK-021 [P0] Hook exits 0
- [ ] CHK-022 [P1] No stale `system-code-graph/dist/system-spec-kit` references remain
- [ ] CHK-023 [P1] No stale `11 tools` reference remains in playbook
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] F-025-1 classed instance-only (single registration path); consumer inventory via rg done
- [ ] CHK-FIX-002 [P0] Hook path fix verified by actual invocation, not assumption
- [ ] CHK-FIX-003 [P0] Doc edits do not change scenario intent, only stale facts
- [ ] CHK-FIX-004 [P1] rg sweep for other occurrences of each corrected value
- [ ] CHK-FIX-005 [P1] 021 label/content reconciliation recorded
- [ ] CHK-FIX-006 [P2] Evidence pinned to commands run
- [ ] CHK-FIX-007 [P2] No unrelated edits in touched files
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced
- [ ] CHK-031 [P1] Hook command stays within repo-relative paths
- [ ] CHK-032 [P2] No new external calls
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary updated post-fix
- [ ] CHK-042 [P2] Findings cross-referenced to 029 matrix
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only in-scope files touched
- [ ] CHK-051 [P2] scratch/ holds verification transcripts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 5 | 0/5 |

**Verification Date**: 2026-05-27
<!-- /ANCHOR:summary -->
