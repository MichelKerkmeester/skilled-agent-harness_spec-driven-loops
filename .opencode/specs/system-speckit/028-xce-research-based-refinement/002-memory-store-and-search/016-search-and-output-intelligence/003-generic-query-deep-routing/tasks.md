---
title: "Tasks: Phase 3: generic-query-deep-routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing"
    last_updated_at: "2026-06-17T08:48:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped generic-query deep routing; tasks superseded by impl-summary"
    next_safe_action: "Tune LOW_SIGNAL_STOPWORD_RATIO against real memory_search traffic"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generic-query-deep-routing.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-003"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Optimal LOW_SIGNAL_STOPWORD_RATIO threshold under real traffic"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: generic-query-deep-routing

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

- [x] T001 Confirm channel selection + both expansion guards key off the classifier tier
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `isLowSignalShortQuery` + escalation to `complex`/`low` with `LOW_SIGNAL_STOPWORD_RATIO` (query-classifier.ts)
- [x] T005 Append `expandQuery` synonym variants to `suggestedQueries`, capped at three (recovery-payload.ts)
- [x] T006 Add `semantic`/`retrieval`/`agent`/`skill`/`council` to `DOMAIN_VOCABULARY_MAP` (query-expander.ts)
- [x] T007 Ensure escalation adds NO LLM call (HyDE/LLM gates left outside the write set)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 New `generic-query-deep-routing.vitest.ts` pins escalation, cost-control, recovery
- [x] T009 Edge cases: confident short query stays simple; capped suggestions
- [x] T010 `implementation-summary.md` written
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

