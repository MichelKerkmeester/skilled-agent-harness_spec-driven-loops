---
title: "Tasks: design-mcp-open-design references conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "design-mcp-open-design references conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: design-mcp-open-design references conformance

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

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/design-mcp-open-design/references/
- [ ] T002 Read .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Fix: guarded-proxy.md (234 lines, worst offender): all H2s unnumbered/sentence-case (`## Boundary`, `## Canonical Request`, `## Classification`, `## Named Residual`, `## Acceptance`, `## Automation Freeze`), no OVERVIEW section, no `---` separators — reads as a spec document rather than a skill reference
- [ ] T004 Fix: inner-generator-binding.md: all H2s unnumbered and sentence/title case, no OVERVIEW, no `---` separators
- [ ] T005 Fix: freshness-invalidation.md: all H2s unnumbered and sentence/title case, no OVERVIEW, no `---` separators
- [ ] T006 Fix: smart-router-pseudocode.md: all H2s unnumbered and sentence/title case, no OVERVIEW, no `---` separators
- [ ] T007 Fix: cli-child-pairing.md: all H2s unnumbered and sentence/title case, no OVERVIEW, no `---` separators
- [ ] T008 Audit remaining files under .opencode/skills/sk-design/design-mcp-open-design/references/ not already named above
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-read all touched files end-to-end
- [ ] T010 Run validate.sh --strict for this leaf
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
