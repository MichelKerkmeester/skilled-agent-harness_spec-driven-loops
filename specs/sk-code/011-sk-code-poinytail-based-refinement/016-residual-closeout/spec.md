---
title: "Feature Specification: Residual closeout"
description: "Phase parent that fixes what the epic closeout left open: the strict package failures, the hooks README voice, a drifted admission scenario, three battery misses, the hooks vitest scope, and the unreviewed closeout commits."
trigger_phrases:
  - "residual closeout"
  - "sk-code refinement residual closeout"
  - "fast forward and fix remaining"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Closed phase 007"
    next_safe_action: "Fix the surface hint in phase 008"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "rc-016-phase-parent"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Residual closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 015-closeout |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015 closeout ended several items CLOSED that an honest fix could reach: 13 skill units failing the strict package check, seven HVR hard blockers in a hooks README, a drifted deep-loop admission scenario, three advisor battery misses, and a hooks vitest config that collects archived spec tests and rewrites a tracked file. Its own nine commits never had a deep review.

### Purpose
Fix each item with proof from a command that ran, or close it only where every honest fix needs a mechanism the overengineering rule rejects, with the reason and the smallest fix tried. DeepSeek V4.1 Flash builds through cli-pi, one change per brief, and the orchestrator reviews each diff before it commits.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven residual items the master orchestrator listed, and every confirmed finding of the review of commits 77f14f88d0 to d04df31790.
- Whatever the final gate run turns up.

### Out of Scope
- Pushing or merging the branch.
- The main checkout and every other worktree.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| Changelogs, three SKILL.md trims, descriptions, `package_skill.py` and its test | Modify | 001-package-strict | Make the 13 failing skill units pass the strict package check |
| Hooks README files | Modify | 002-hooks-readme-voice | Bring the hooks README HVR hard blockers to 0 |
| The deep-loop admission scenario or router | Modify | 003-admission-gold | Settle the drifted DOC-331 deep-loop admission scenario |
| Owning skills' metadata | Modify | 004-battery-misses | Retry battery misses P4, P7 and P15 at their root cause |
| `.skilled/hooks/vitest.config.ts` | Modify | 005-hooks-vitest-scope | Restrict the hooks vitest include to the hooks tree |
| Review packet only | Modify | 006-closeout-deep-review | DeepSeek deep review of the 015 closeout commits |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its test | Modify | 007-dispatch-wrapper-scan | Read every shell wrapper payload, not only the first |
| `.opencode/plugins/system-skill-advisor.js` and its test | Modify | 008-surface-hint-hub-root | Send OPENCODE only inside the hub's own `.skilled` directory |
| `reduce-state.cjs` and its test | Modify | 009-reducer-config-message | Name the missing review config in the strict failure headline |
| Spec docs only, plus whatever the gate turns up | Modify | 010-final-gate-ledger | Run the final gate from the committed state and close the ledger |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-package-strict/ | Make the 13 failing skill units pass the strict package check | Complete |
| 2 | 002-hooks-readme-voice/ | Bring the hooks README HVR hard blockers to 0 | Complete |
| 3 | 003-admission-gold/ | Settle the drifted DOC-331 deep-loop admission scenario | Complete |
| 4 | 004-battery-misses/ | Retry battery misses P4, P7 and P15 at their root cause | Complete |
| 5 | 005-hooks-vitest-scope/ | Restrict the hooks vitest include to the hooks tree | Complete |
| 6 | 006-closeout-deep-review/ | DeepSeek deep review of the 015 closeout commits | Complete |
| 7 | 007-dispatch-wrapper-scan/ | Read every shell wrapper payload, not only the first | Complete |
| 8 | 008-surface-hint-hub-root/ | Send OPENCODE only inside the hub's own `.skilled` directory | Pending |
| 9 | 009-reducer-config-message/ | Name the missing review config in the strict failure headline | Pending |
| 10 | 010-final-gate-ledger/ | Run the final gate from the committed state and close the ledger | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-package-strict | 002-hooks-readme-voice | 001 committed with its goal criteria passing | `validate.sh --strict` on 001 |
| 002-hooks-readme-voice | 003-admission-gold | 002 committed with its goal criteria passing | `validate.sh --strict` on 002 |
| 003-admission-gold | 004-battery-misses | 003 committed with its goal criteria passing | `validate.sh --strict` on 003 |
| 004-battery-misses | 005-hooks-vitest-scope | 004 committed with its goal criteria passing | `validate.sh --strict` on 004 |
| 005-hooks-vitest-scope | 006-closeout-deep-review | 005 committed with its goal criteria passing | `validate.sh --strict` on 005 |
| 006-closeout-deep-review | 007-dispatch-wrapper-scan | 006 committed with its goal criteria passing | `validate.sh --strict` on 006 |
| 007-dispatch-wrapper-scan | 008-surface-hint-hub-root | 007 committed with its goal criteria passing | `validate.sh --strict` on 007 |
| 008-surface-hint-hub-root | 009-reducer-config-message | 008 committed with its goal criteria passing | `validate.sh --strict` on 008 |
| 009-reducer-config-message | 010-final-gate-ledger | 009 committed with its goal criteria passing | `validate.sh --strict` on 009 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Questions a phase raises are recorded in that phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
