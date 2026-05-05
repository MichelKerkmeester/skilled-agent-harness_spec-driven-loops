---
title: "Implementation Plan: Phase 4: closeout"
description: "validate + jq metadata refresh + commit. Mechanical."
trigger_phrases: ["071/004 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/004-closeout"
    last_updated_at: "2026-05-05T15:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 plan authored"
    next_safe_action: "Refresh metadata + final commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-closeout"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | bash + jq + validate.sh |
| **Storage** | graph-metadata.json files |
| **Testing** | jq queries + grep |

### Overview
Mechanical closeout: validate.sh --strict + jq edits to 5 graph-metadata.json files + final commit. Mirrors packet 068's Phase 3 closeout pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1-3 commits landed
- [x] validate.sh --strict pre-check PASSED

### Definition of Done
- [x] graph-metadata refreshed
- [ ] One final commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
jq inline-edit per file. No new code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Validate.sh --strict pre-check (already PASS)

### Phase 2: Core Implementation
- [ ] jq edit parent graph-metadata.json (children_ids, status, last_active_child_id)
- [ ] jq edit each child graph-metadata.json (parent_id, status)
- [ ] Author 004 spec docs

### Phase 3: Verification
- [ ] validate.sh --strict re-run (must remain exit 0)
- [ ] Final commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each metadata file | jq query |
| Aggregate | Parent + 4 children consistent | bash loop + jq |
| Integration | validate.sh strict | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| jq | Green |
| validate.sh | Green |
| Phase 1-3 commits | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh --strict regresses
- **Procedure**: `git reset --hard HEAD~1` (revert closeout commit)
- **Granularity**: One commit
<!-- /ANCHOR:rollback -->
