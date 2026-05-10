---
title: "Tasks: 027/002 Code Graph HLD/LLD"
description: "Task list for deterministic HLD/LLD generation, MCP registration, optional omni wiring, and pt-02 contract amendments."
trigger_phrases:
  - "027 001 hld lld tasks"
  - "code graph hld lld tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-hld-lld"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned tasks.md with manifest anchors and pt-02 HLD/LLD amendments"
    next_safe_action: "Implement deterministic HLD/LLD helpers before MCP and omni wiring"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose dangling-edge policy before implementation."
      - "Confirm whether omni wiring stays in Phase 002 scope."
    answered_questions:
      - "Stable ordering before caps is required by pt-02."
      - "Primary module selection must prefer synthetic module nodes."
---
# Tasks: 027/002 Code Graph HLD/LLD

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

- [ ] T001 Choose and document dangling-edge policy: filter unresolved edges or emit explicit unresolved records.
- [ ] T002 Define HLD result schema with `file_role`, `layer`, `summary`, `dependencies`, `exports`, and `complexity_hints`.
- [ ] T003 Define LLD result schema with symbol identity, signature, relationships, and deterministic ordering.
- [ ] T004 Confirm whether `queryMode: "omni"` remains in Phase 002 scope or is explicitly removed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `mcp_server/code_graph/lib/code-graph-hld-lld.ts`.
- [ ] T006 Implement stable sort helper before every capped collection.
- [ ] T007 Implement `generateHLD(filePath, db)` with deterministic output for identical inputs.
- [ ] T008 Implement `generateLLD(symbolId, db)` with null output for missing symbols.
- [ ] T009 Implement `generateFileNarrative(filePath, db)` as a composer over HLD/LLD primitives.
- [ ] T010 Export `classifyFileRole(filePath, db)` and keep `generateHLD(filePath, db).file_role` equal to it.
- [ ] T011 Implement `classifyLayer()` using the agreed local heuristic set.
- [ ] T012 Prefer synthetic module nodes where `fq_name === getModuleName(filePath)`.
- [ ] T013 Create `mcp_server/code_graph/handlers/hld-lld.ts` with readiness gate reuse and zod input validation.
- [ ] T014 Register `code_graph_hld_lld` in `mcp_server/code_graph/tools/code-graph-tools.ts`.
- [ ] T015 If omni remains in scope, wire QueryMode, ContextResult, handler parse, serialized JSON, and integration coverage.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Add deterministic-order test with at least 100 repeated calls and 1000+ symbols.
- [ ] T017 Add dangling-edge fixture for the chosen policy.
- [ ] T018 Add primary-module-selection fixture with synthetic module and captured module-like symbol.
- [ ] T019 Add equality test for `classifyFileRole(filePath, db)` and HLD `file_role`.
- [ ] T020 Add file-role fixtures for module, API handler, library, test, and config.
- [ ] T021 Add layer fixtures for presentation, business, data, and utility.
- [ ] T022 Add serialization test proving `JSON.stringify(result)` succeeds.
- [ ] T023 Run `npm run check`.
- [ ] T024 Run `npx vitest run code-graph-hld-lld.vitest.ts --coverage` and confirm >=80% coverage.
- [ ] T025 Run strict validation for this spec folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] HLD and LLD outputs are deterministic, serializable, and covered by fixtures.
- [ ] `classifyFileRole` is exported for Phase 003 and equals HLD `file_role`.
- [ ] Omni scope is either fully wired and tested or explicitly removed from Phase 002.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research Part 1**: `../research/findings.md`
- **Research Part 2**: `../research/027-xce-research-based-refinement-pt-02/research.md`
<!-- /ANCHOR:cross-refs -->
