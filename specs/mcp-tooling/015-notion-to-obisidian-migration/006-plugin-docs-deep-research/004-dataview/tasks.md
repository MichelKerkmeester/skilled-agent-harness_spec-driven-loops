---
title: "Tasks: Phase 006/004-dataview — Dataview reference-docs deep research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "006 dataview research tasks"
  - "dataview deep research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/004-dataview"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored retrospective task list for the completed research run"
    next_safe_action: "Hand synthesis.md to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-004-dataview"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006/004-dataview — Dataview reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Seed the `blacksmithgu/obsidian-dataview` repository and official documentation
- [ ] T002 [P] Enumerate the research sub-questions in `spec.md` §3 (DQL grammar, DataviewJS API, frontmatter/inline-field conventions)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run the GLM-5.2 High loop via cli-devin, early convergence allowed
- [ ] T004 Confirm the DQL command-resolution order (written-order execution, not a fixed order)
- [ ] T005 Confirm the inline-field multiline constraint (line-break terminated; multiline only via YAML pipe)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Fresh-reviewer re-verification of every research-cited anchor against the live shipped files
- [ ] T007 Write the prioritized P0/P1/P2 edit table in `synthesis.md`, headlined by the DataviewJS API expansion
- [ ] T008 `validate.sh` this phase; refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Both P0 contradictions (multiline inline-fields; DQL command order) resolved with citations
- [ ] `synthesis.md` hands phase 009 a decided, prioritized edit table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Synthesis**: See `synthesis.md`
- **Previous phase**: `../003-project-manager/`
- **Next phase**: `../005-notion-bases/`
<!-- /ANCHOR:cross-refs -->
