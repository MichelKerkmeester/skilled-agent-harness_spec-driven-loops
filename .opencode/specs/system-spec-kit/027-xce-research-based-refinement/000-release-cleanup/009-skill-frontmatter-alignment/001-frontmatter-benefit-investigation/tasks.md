---
title: "Tasks: Phase 1: Frontmatter Benefit Investigation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "frontmatter investigation tasks"
  - "consumer audit tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation"
    last_updated_at: "2026-06-11T06:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete"
    next_safe_action: "Operator decides canonical contract; then start skill children"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-frontmatter-benefit-investigation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Frontmatter Benefit Investigation

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

- [x] T001 [P] Count docs with detailed block per skill (`rg -l "trigger_phrases:" .opencode/skills/*/references .opencode/skills/*/assets`)
- [x] T002 [P] Count total md docs per skill in references/ and assets/ (`find`)
- [x] T003 Count docs with no frontmatter at all (first-line probe; 11 of 369)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Trace memory-index path gate (`mcp_server/lib/parsing/memory-parser.ts` isIndexablePath: spec docs + constitutional only)
- [x] T005 Trace skill-advisor inputs (`skill_graph_compiler.py` scans graph-metadata.json only; `skill-graph-db.ts` indexSkillMetadata same; `skill_advisor.py:632` consumes derived.trigger_phrases; 24-phrase cap in `skill-derived-v2.ts:43`)
- [x] T006 Trace code-graph scope policy (`mcp_server/lib/utils/index-scope.ts`: `**/.opencode/skills/**` excluded by default, opt-in `SPECKIT_CODE_GRAPH_INDEX_SKILLS`)
- [x] T007 Repo-grep for any other executable consumer of the three field names (none found outside docs/templates/tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Read sk-doc contract docs (`skill_creation.md`, `frontmatter_templates.md`, feature_catalog + readme templates) and record the three-way contradiction
- [x] T009 Write research.md with findings, evidence table, and Option A/B/C recommendation
- [x] T010 Update packet docs (spec/plan/tasks/implementation-summary) and run strict validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (evidence citations spot-checked against source)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `research.md`
<!-- /ANCHOR:cross-refs -->
