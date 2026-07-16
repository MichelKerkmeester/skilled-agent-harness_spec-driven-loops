---
title: "Tasks: blast_radius includeTransitive Flag Fix (029 Phase 008)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "blast radius transitive tasks"
  - "f-022-1 fix tasks"
  - "029 phase 008 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 008 tasks"
    next_safe_action: "Edit query handler"
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
# Tasks: blast_radius includeTransitive Flag Fix (029 Phase 008)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Baseline query-handler + scan vitest green pre-edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Add `effectiveDepth = args.includeTransitive ? maxDepth : 1` at blast_radius branch top (query.ts)
- [ ] T003 Route 6 in-branch depth uses through effectiveDepth
- [ ] T004 Add vitest: blast_radius default → 1-hop; includeTransitive:true → multi-hop
- [ ] T005 Reconcile scenario 022 pass criteria (transitive>nontransitive requires includeTransitive:true)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 tsc build clean
- [ ] T007 vitest code-graph-query-handler + code-graph-scan pass
- [ ] T008 verify_alignment_drift.py clean on changed scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked
- [ ] Build + tests + alignment green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
