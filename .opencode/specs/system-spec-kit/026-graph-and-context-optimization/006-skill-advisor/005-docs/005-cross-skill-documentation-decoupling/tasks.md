---
title: "Tasks: Cross-skill decoupling"
description: "Per-file task list across 3 phases."
trigger_phrases:
  - "005 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/005-cross-skill-documentation-decoupling"
    last_updated_at: "2026-05-16T12:33:24Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Mark T401-T407 complete and commit"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0050000000000000000000000000000000000000000000000000000000000007"
      session_id: "005-cross-skill-documentation-decoupling-tasks"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Skill Decoupling

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Phase 1 inventory via Explore agent (26 cross-skill refs catalogued)
- [x] T102 Reverse-engineer spec-kit ARCHITECTURE as canonical template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 1 Decouple
- [x] T201 spec-kit/README.md §1 OVERVIEW rewrite + sibling-ref removals
- [x] T202 spec-kit/mcp_server/README.md trigger_phrases + inline path scrub
- [x] T203 spec-kit/ARCHITECTURE.md full rewrite to canonical 8-section template

### Phase 2 Zero §1 Tables
- [x] T204 advisor/README.md §1 "How This Compares" + "Key Features" to prose + bullets
- [x] T205 code-graph/README.md §1 "How This Compares" + "Cross-Skill Integration" to prose + bullets

### Phase 3 ARCHITECTURE Conform
- [x] T206 advisor/ARCHITECTURE.md full rewrite, terse target
- [x] T207 code-graph/ARCHITECTURE.md full rewrite, terse target
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T301 Cross-skill grep on 3 spec-kit docs returns 0
- [x] T302 §1 table count is 0 in 3 READMEs
- [x] T303 spec-kit/README em-dash count is 0
- [x] T304 ARCHITECTURE section list identical across 3 files
- [x] T305 advisor and code-graph ARCHITECTURE each ≤220 lines
- [ ] T306 Strict-validate child 005 exit 0
- [ ] T307 Fill implementation-summary.md with evidence
- [ ] T308 Commit on main referencing 005
- [ ] T309 Push to origin/main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2 + 3 tasks marked `[x]`
- [ ] Strict-validate child 005 exit 0
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
