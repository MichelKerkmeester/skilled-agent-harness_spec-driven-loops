---
title: "Tasks: C1 deterministic header-path plus curated-signal chunk prefix [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "chunk prefix tasks"
  - "header path tasks"
  - "embedding coverage guard tasks"
  - "dual cache key tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/014-chunk-prefix"
    last_updated_at: "2026-07-04T17:11:52.520Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown"
    next_safe_action: "Start setup tasks once 015 gate lands"
    blockers:
      - "Gated on 015-prodmode-recall-gate prod-mode completeRecall@3 proof"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-tasks-014-chunk-prefix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: C1 deterministic header-path plus curated-signal chunk prefix

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

- [ ] T001 Capture the 015 prod-mode completeRecall@3 baseline before any re-embed
- [ ] T002 Add the strategy flag default-off and the strategy version constant (content-normalizer.ts)
- [ ] T003 [P] Scaffold the `embedding_context_version` column and coverage readout (embedding-cache.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the deterministic prefix builder that re-composes frontmatter triggers and title and header path (content-normalizer.ts)
- [ ] T005 Fold the strategy version into the persistent cache primary key at line 157 (embedding-cache.ts)
- [ ] T006 Fold the strategy version into the in-process LRU key at getCacheKey lines 309-311 (shared/embeddings.ts)
- [ ] T007 Handle degraded inputs and over-long prefix truncation in the builder (content-normalizer.ts)
- [ ] T008 Run the full re-embed behind the flag at the new strategy version
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Determinism test confirms byte-identical prefixes for the same chunk
- [ ] T010 Dual-key miss test confirms no silent no-op on a strategy bump
- [ ] T011 Coverage guard reports full coverage and the prod read refuses a mixed regime
- [ ] T012 Update spec, plan, and tasks docs and run strict validation
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
