---
title: "Tasks: C3 answerable_questions and semantic_intent tags [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "answerable questions tags"
  - "semantic intent tags"
  - "c3 retrieval tags"
  - "memory parser allow list"
  - "fusion consumer tags"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/016-c3-answerable-questions-tags"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Drafted task breakdown from plan"
    next_safe_action: "Write checklist.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: C3 answerable_questions and semantic_intent tags

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

- [ ] T001 Resolve the generator host module against the live metadata JSON write path (save path module)
- [ ] T002 Add the default-off consumer flag and confirm its default reads off (stage2-fusion.ts)
- [ ] T003 [P] Stand up Vitest fixtures for tagged, untagged, and malformed inputs (test fixtures)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Auto-generate answerable_questions and semantic_intent on write and persist into metadata JSON without mutating the body (generator host module)
- [ ] T005 Add extractAnswerableQuestions and extractSemanticIntent parallel to extractTriggerPhrases (memory-parser.ts L785)
- [ ] T006 Surface both fields on the parsed row alongside triggerPhrases (memory-parser.ts ~L340)
- [ ] T007 Add the bounded flag-gated fusion consumer modeled on applyValidationMultiplier (stage2-fusion.ts L260-289)
- [ ] T008 Skip malformed or legacy frontmatter fields in the extractors without throwing (memory-parser.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Parser unit test proves both fields round-trip onto the row and a no-tag input parses unchanged (memory-parser test)
- [ ] T010 Fusion unit test proves the score moves only within the clampMultiplier bound and only for tagged rows (stage2-fusion test)
- [ ] T011 Confirm with the consumer flag off that prod-mode retrieval matches baseline (manual parity check)
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
