---
title: "Tasks: CLI Per-Command Help, Aliases, and Errors"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "002-cli-help-aliases-errors tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors"
    last_updated_at: "2026-06-11T01:10:42Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed all CLI help, alias, and unknown-command tasks"
    next_safe_action: "Sub-phase complete; continue with sibling CLI tooling UX phases as needed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts"
      - ".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-002-cli-help-aliases-errors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All three CLIs now expose snake, kebab, and camel command forms."
      - "Unknown-command JSON errors include a list-tools hint and closest canonical suggestion."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Per-Command Help, Aliases, and Errors

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

- [x] T001 Capture the skill-advisor per-command help shape (`skill-advisor-cli.ts:661-674`) as the pattern to mirror.
- [x] T002 Enumerate current aliases across `spec-memory-cli.ts:222-228`, `code-index-cli.ts:241-247`, `skill-advisor-cli-manifest.ts:142-151` and list gaps.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Add per-command help/schema to `spec-memory-cli.ts` (replace global-only usage at `:750-755`).
- [x] T004 [P] Add per-command help/schema to `code-index-cli.ts` (replace global-only usage at `:898-903`).
- [x] T005 Declare a unified snake/kebab/camel alias map across all three CLIs with a collision test.
- [x] T006 Add a "try list-tools" hint + closest-match suggestion to the unknown-command catch paths (`spec-memory-cli.ts:774-793`, `code-index-cli.ts:926-945`, `skill-advisor-cli.ts:1111-1130`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify per-command help prints offline for spec-memory and code-index (exit 0).
- [x] T008 Verify the alias collision test is green.
- [x] T009 Verify a typoed command returns the hint plus nearest-match suggestion.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
