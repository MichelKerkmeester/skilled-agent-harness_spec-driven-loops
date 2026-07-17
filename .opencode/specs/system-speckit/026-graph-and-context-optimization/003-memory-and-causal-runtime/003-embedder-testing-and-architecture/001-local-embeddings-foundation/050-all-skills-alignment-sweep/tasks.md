---
title: "Tasks: All Skills Alignment Sweep"
description: "Batch task list for auditing and aligning all 19 skill documentation packages."
trigger_phrases:
  - "all skills alignment tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep"
    last_updated_at: "2026-05-14T20:40:00Z"
    last_updated_by: "codex"
    recent_action: "Final verification passed"
    next_safe_action: "Commit packet close-out"
    blockers: []
    key_files:
      - "tasks.md"
      - "research/skills-audit.md"
    session_dedup:
      fingerprint: "sha256:9b23435c8378377a0855e353f2ad66e94f90c361046c3214da031b6892e1871d"
      session_id: "015-all-skills-alignment-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: All Skills Alignment Sweep

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Verify next free packet number under `026-graph-and-context-optimization`
- [x] T002 Scaffold Level 3 packet at `015-all-skills-alignment-sweep`
- [x] T003 [P] Read sk-doc operating manual and skill templates
- [x] T004 [P] Read 013/009 handover and `git log --oneline -50`
- [x] T005 Create `research/skills-audit.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Batch A audit/edit CLI executor skills
- [x] T011 Commit Batch A
- [x] T020 Batch B audit/edit deep-loop skills
- [x] T021 Commit Batch B
- [x] T030 Batch C audit/edit MCP integration skills
- [x] T031 Commit Batch C
- [x] T040 Batch D audit/edit sk-* skills
- [x] T041 Commit Batch D
- [x] T050 Batch E audit/edit system-* skills plus root READMEs
- [x] T051 Commit Batch E
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 Run all `quick_validate.py` checks for 19 `SKILL.md` files
- [x] T061 Run README validators for primary READMEs
- [x] T062 Run targeted stale-reference grep
- [x] T063 Strict-validate packet
- [x] T064 Update checklist and implementation-summary evidence
- [x] T065 Final close-out commit if needed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Final binding trace filled in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit**: See `research/skills-audit.md`
<!-- /ANCHOR:cross-refs -->
