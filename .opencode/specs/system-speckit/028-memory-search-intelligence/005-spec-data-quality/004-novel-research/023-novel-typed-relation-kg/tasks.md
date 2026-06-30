---
title: "Tasks: Novel typed-relation KG auto-extracted [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "typed relation kg"
  - "llm graph backfill"
  - "knowledge graph navigation"
  - "causal edges provenance"
  - "deterministic extractor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/023-novel-typed-relation-kg"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author task breakdown for the typed-relation KG build"
    next_safe_action: "Author checklist for the build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Novel typed-relation KG auto-extracted

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

- [ ] T001 Confirm the SPECKIT_LLM_GRAPH_BACKFILL flag and the _scheduleLlmBackfill scheduler are the shipped gating path (.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts)
- [ ] T002 Confirm the frozen RELATION_TYPES enum and the causal_edges CHECK constraint as the write target (.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [ ] T003 [P] Stand up a parse fixture with one in-vocabulary relation and one out-of-vocabulary relation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the LLM typed-relation extractor that maps prose onto the six canonical relations (.opencode/skills/system-spec-kit/mcp_server/lib/causal/llm-relation-extractor.ts)
- [ ] T005 Drop every out-of-vocabulary relation and apply the reused strength and per-node caps before write (.opencode/skills/system-spec-kit/mcp_server/lib/causal/llm-relation-extractor.ts)
- [ ] T006 Persist LLM-derived edges with a distinct created_by and an LLM evidence marker (.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [ ] T007 Call registerLlmBackfillFn once at bootstrap to close the unwired seam (.opencode/skills/system-spec-kit/mcp_server/context-server.ts)
- [ ] T008 Add the read-only typed-edge navigation accessor over causal_edges (.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 The registered callback fires under the flag and no insert fails the relation CHECK constraint
- [ ] T010 LLM edges partition by created_by and evidence, flag-off writes zero rows and the navigation read leaves ranking unchanged
- [ ] T011 Update documentation (spec/plan/tasks/checklist)
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
