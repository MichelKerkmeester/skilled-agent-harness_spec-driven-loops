---
title: "Tasks: Novel Context-Budget-Fitting Assembler [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context budget assembler"
  - "near duplicate dedup"
  - "diverse packet selection"
  - "context density"
  - "token per relevant row"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/022-novel-context-budget-assembler"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown for the assembler build"
    next_safe_action: "Author checklist for the assembler build"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Novel Context-Budget-Fitting Assembler

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

- [ ] T001 Read the truncation block and floor read to lock the post-floor insertion point (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [ ] T002 Confirm the per-result rows carry a vector or normalized text for the near-duplicate signal (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [ ] T003 [P] Stand up a fixture set with planted near-duplicates and a distinct control result
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the pure assembler over the post-floor set and a token budget (.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts)
- [ ] T005 Implement the near-duplicate collapse above the configured similarity threshold (.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts)
- [ ] T006 Implement the floor-preservation guard against DEFAULT_MIN_RESULTS (.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts)
- [ ] T007 Implement the diversity preference for an unrepresented packet at near-equal relevance (.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts)
- [ ] T008 Emit token-per-relevant-row and a duplicate rate into the stage trace (.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts)
- [ ] T009 Insert the assembleByBudget call behind the default-off flag with a degrade-to-un-assembled fallback (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 The vitest suite passes for dedup, diversity, floor-preservation and the density metrics (.opencode/skills/system-spec-kit/mcp_server/tests/context-budget-assembler.vitest.ts)
- [ ] T011 The flag-off path returns the post-floor set byte-for-byte and no floor-cut candidate is re-added, plus edge cases (empty set, set at the floor, single-packet set, vector-absent text fallback, budget below the floor)
- [ ] T012 Update documentation (spec/plan/tasks/checklist)
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
