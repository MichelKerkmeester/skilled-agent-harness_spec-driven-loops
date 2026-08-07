---
title: "Tasks: A2 Trigger Propagation and Derived Description [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "trigger propagation description"
  - "extractive description derive"
  - "description json triggers"
  - "extractTriggersFromContent cap"
  - "subset coherence triggers"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/002-trigger-propagation-description"
    last_updated_at: "2026-07-04T17:12:01.703Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for A2 trigger-propagation scaffold"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A2 Trigger Propagation and Derived Description

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

- [ ] T001 Confirm the curated frontmatter `trigger_phrases` are readable inside the existing single spec.md read (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T002 Confirm `trigger_phrases` validation tolerates a populated capped array with no schema break (`.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts`)
- [ ] T003 [P] Capture the baseline `005/description.json` state, a title-echo description and a missing `trigger_phrases` key
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Raise the `extractTriggersFromContent` cap from 8 to 12 so the derive helper matches the propagation cap (`.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts`)
- [ ] T005 Derive a real extractive description in `extractDescription`, preferring a Problem or Purpose line and demoting the title-copy to a last-resort fallback (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T006 Populate `trigger_phrases` in `generatePerFolderDescription` from the curated frontmatter set merged with the derived set, deduplicated and capped at 12 (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T007 Add the subset coherence check, asserting the curated set is a subset of the propagated set rather than byte equality
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Regenerate `005/description.json` and confirm a `trigger_phrases` superset of its curated frontmatter set and a description that is not a verbatim title copy
- [ ] T009 Confirm the derive cap and the propagation cap both read 12 and the subset coherence assertion passes against a folder with curated triggers
- [ ] T010 Confirm idempotence, a second regeneration over an unchanged spec.md yields identical `trigger_phrases` and `description`
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

---
