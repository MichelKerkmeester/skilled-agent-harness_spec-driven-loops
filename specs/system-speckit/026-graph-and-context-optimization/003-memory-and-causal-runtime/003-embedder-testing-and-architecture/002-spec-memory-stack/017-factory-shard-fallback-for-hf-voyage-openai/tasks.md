---
title: "Tasks: factory-shard-fallback-for-hf-voyage-openai [template:level_1/tasks.md]"
description: "Task list for the packet 017 resolver audit and documentation-only closure."
trigger_phrases:
  - "factory shard fallback tasks"
  - "hf-local voyage openai active embedder tasks"
  - "ADR-012 factory audit tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai"
    last_updated_at: "2026-05-19T19:22:07Z"
    last_updated_by: "codex"
    recent_action: "Completed resolver audit tasks"
    next_safe_action: "Stage packet docs and parent phase map for commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0170000000000000000000000000000000000000000000000000000000000003"
      session_id: "016-002-017-factory-shard-fallback-for-hf-voyage-openai"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No factory source task remains because non-Ollama active resolvers do not exist."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: factory-shard-fallback-for-hf-voyage-openai

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

- [x] T001 Read predecessor implementation summary `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table/implementation-summary.md`
- [x] T002 Read factory source `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- [x] T003 Read canonical shard path source `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Search `factory.ts` with `grep -n` for `readActive*EmbedderFromDb` provider resolver functions.
- [x] T005 Confirm `hf-local`, `voyage`, and `openai` have no analogous active-embedder DB resolver.
- [x] T006 Confirm current hf-local shard filenames may include a quant suffix such as `__q8`.
- [x] T007 Document that no code change is needed because the requested functions do not exist.
- [x] T008 Create packet 017 docs and parent phase-map entry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `npm run build` in `.opencode/skills/system-spec-kit/shared`.
- [x] T010 Run `npm run build` in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] T011 Run strict validation for packet 017.
- [x] T012 Add commit handoff section with exact staging paths and draft commit message.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual source verification passed.
- [x] Build verification passed.
- [x] Strict spec validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../016-reindex-populates-vec-memories-knn-table/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
