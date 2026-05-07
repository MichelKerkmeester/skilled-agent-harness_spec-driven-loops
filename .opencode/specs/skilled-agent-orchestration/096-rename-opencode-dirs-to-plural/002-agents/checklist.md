---
title: "Verification Checklist: 096/002 - agents rename"
description: "Verification Date: 2026-05-07"
trigger_phrases:
  - "096/002 checklist"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-agents"
    last_updated_at: "2026-05-07T14:00:00Z"
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
# Verification Checklist: 096/002 - agents rename

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

- [ ] CHK-001 [P0] Phase 001 complete and verified
- [ ] CHK-002 [P0] Critical-patch list complete (4 files)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.opencode/agents/` removed
- [ ] CHK-011 [P0] `.opencode/agents/` present with 12 files
- [ ] CHK-012 [P0] grep audit returns 0
- [ ] CHK-013 [P0] CLAUDE.md §5 routing table updated
- [ ] CHK-014 [P0] sk-prompt graph-metadata + runtime_capabilities mirrorPath plural
- [ ] CHK-015 [P1] audit_descriptions.py compiles
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] JSON files validate
- [ ] CHK-021 [P1] No regression in scripts (validate.sh on 095 still works)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a finding class. (N/A — refactor)
- [ ] CHK-FIX-002 [P0] Same-class producers inventoried (1,532 files).
- [ ] CHK-FIX-003 [P0] Consumer inventory: 4 critical patches.
- [ ] CHK-FIX-004 [P0] Adversarial test: bulk sed false-positive sweep.
- [ ] CHK-FIX-005 [P1] Matrix axes covered.
- [ ] CHK-FIX-006 [P1] Hostile env variant: N/A.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets exposed
- [ ] CHK-031 [P0] cli-codex sandbox=workspace-write only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec docs synchronized
- [ ] CHK-041 [P1] implementation-summary.md filled
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No files outside agent rename scope modified
- [ ] CHK-051 [P1] git working tree contains only expected diffs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-05-07
<!-- /ANCHOR:summary -->
