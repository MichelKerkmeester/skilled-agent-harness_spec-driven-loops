---
title: "Plan: AGENTS.md Pi Row"
description: "One-row table addition with cross-packet coordination."
trigger_phrases:
  - "AGENTS.md pi row plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/005-agents-md-pi-row"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Plan authored"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: AGENTS.md Pi Row

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add the Pi row to AGENTS.md §8, matching sibling formatting. Check `agents/002-runtime-surface-coverage` state first to avoid duplicate work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [ ] Definition of Ready: 002 packet table state checked
- [ ] Definition of Done: exactly one Pi row; validate.sh on this folder exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Architecture | Table row | Single markdown row, sibling formatting |
<!-- /ANCHOR:architecture -->

---



---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Implement

1. Check `agents/002-runtime-surface-coverage` task state (T001 done?)
2. Add Pi row to AGENTS.md §8 if absent

### Phase 2: Verify

1. `grep` AGENTS.md: exactly one pi row
2. `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| grep | exactly one pi row |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| agents/002-runtime-surface-coverage state | |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the row. Single-line diff.
<!-- /ANCHOR:rollback -->
