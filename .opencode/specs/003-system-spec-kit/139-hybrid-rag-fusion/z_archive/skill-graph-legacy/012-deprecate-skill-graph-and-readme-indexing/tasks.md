---
title: "Tasks: 012 - Deprecate Skill Graph and README/Skill-Ref Indexing [012-deprecate-skill-graph-and-readme-indexing/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "012"
  - "deprecate"
  - "skill"
  - "graph"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 012 - Deprecate Skill Graph and README/Skill-Ref Indexing

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: SGQS/Skill-Graph Runtime Deprecation

- [x] T001 Remove SGQS tools from schema contract (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`)
- [x] T002 Remove SGQS handler registration from handler exports/index (`.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts`)
- [x] T003 Delete SGQS handler implementation (`.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts`)
- [x] T004 Remove SGQS cache/runtime dependencies from graph search path (`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/skill-graph-cache.ts`)
- [x] T005 [P] Update SGQS-dependent tests to deprecation assertions (`.opencode/skill/system-spec-kit/mcp_server/tests/*sgqs*.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Remove README and Skill Reference/Assets Indexing

- [x] T010 Remove `includeReadmes` and `includeSkillRefs` indexing behavior from memory index handler (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`)
- [x] T011 Remove README acceptance and readme-specific weighting/type handling from memory save path (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`)
- [x] T012 Remove skill reference indexing config surface (`.opencode/skill/system-spec-kit/mcp_server/lib/config/skill-ref-config.ts`, `.opencode/skill/system-spec-kit/config/config.jsonc`)
- [x] T013 [P] Update memory type and scoring logic tied to readme/source categories (`.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts`)
- [x] T014 [P] Update/replace readme and skill-ref indexing tests (`.opencode/skill/system-spec-kit/mcp_server/tests/readme-discovery.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-readme.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Commands, Skills, Agents, and Root README Alignment

- [x] T020 Remove SGQS and removed indexing references from command docs (`.opencode/command/**`)
- [x] T021 Remove SGQS capability references from agent docs (`.opencode/agent/**`)
- [x] T022 Mirror agent updates for chatgpt profile (`.opencode/agent/chatgpt/**`)
- [x] T023 Remove stale SGQS and README/skill-ref indexing claims from skills docs (`.opencode/skill/**`)
- [x] T024 Update root architecture/indexing narrative (`README.md`)
- [x] T025 Enforce README anchor guidance in README generation workflows (`.opencode/command/create/**`, `.opencode/skill/sk-documentation/**`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Validation and Testing

- [x] T030 Run SGQS/stale symbol sweep and confirm no active references (`rg -n "memory_skill_graph_query|memory_skill_graph_invalidate|skill-graph|SGQS" .opencode/skill/system-spec-kit/mcp_server .opencode/command .opencode/agent .opencode/agent/chatgpt README.md`)
- [x] T031 Run indexing-surface sweep and confirm no README/skill-ref indexing parameters remain (`rg -n "includeReadmes|includeSkillRefs|skillReferenceIndexing|README indexing" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/config`) 
- [x] T032 Execute MCP server typecheck (`npm run typecheck --workspace .opencode/skill/system-spec-kit/mcp_server`)
- [x] T033 Execute MCP server tests (`npm run test --workspace .opencode/skill/system-spec-kit/mcp_server`)
- [x] T034 [P] Execute focused deprecation test files after updates (`vitest` targeted files under `.opencode/skill/system-spec-kit/mcp_server/tests/`)
- [x] T035 Update checklist evidence entries with concrete command output and file references (`checklist.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Spec Folder Verification

- [x] T040 Validate this phase documentation bundle (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing`)
- [x] T041 Ensure no placeholder markers remain in spec docs (`bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing`)
- [x] T042 Final sync check across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete.
- [x] All P1 tasks complete or explicitly deferred by user.
- [x] Validation and testing commands captured in checklist evidence.
- [x] No blocked tasks remain.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
