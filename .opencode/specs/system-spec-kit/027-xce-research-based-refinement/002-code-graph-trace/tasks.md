---
title: "Tasks: 027/002 Code Graph Trace"
description: "Task list for filePath-based trace resolution, optional cache/package metadata, and pt-02 trace correctness amendments."
trigger_phrases:
  - "027 002 trace tasks"
  - "code graph trace tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned tasks.md with manifest anchors and pt-02 filePath amendments"
    next_safe_action: "Implement Phase 002 after Phase 001 exports classifyFileRole"
    blockers:
      - "Phase 001 classifyFileRole export is required for architectural_role."
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
      - "Choose exact filePath-derived module policy."
    answered_questions:
      - "fq_name dot splitting is not a P0 ownership source."
---
# Tasks: 027/002 Code Graph Trace

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

- [ ] T001 Confirm Phase 001 exports `classifyFileRole(filePath, db)`.
- [ ] T002 Define trace result schema with `symbol`, `file`, `module`, `architectural_role`, `class?`, `truncated`, and chain metadata.
- [ ] T003 Define `resolveModuleFromFilePath(filePath)` policy examples for TS/JS, Python, Bash, and doc files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/code_graph/lib/code-graph-trace.ts`.
- [ ] T005 Implement `traceSymbol(symbolId, db, opts)` with `CodeNode.filePath` as the file rung source.
- [ ] T006 Use CONTAINS and fqName metadata only for class/method display where available.
- [ ] T007 Fix or avoid nested-class parent matching by comparing `method.fqName` against `class.fqName + "."`.
- [ ] T008 Derive module ownership from file path, never dotted `fq_name`.
- [ ] T009 Call Phase 001 `classifyFileRole(filePath, db)` and assert equality with HLD `file_role`.
- [ ] T010 Create `mcp_server/code_graph/handlers/trace.ts` with readiness gate reuse and zod input validation.
- [ ] T011 Register `code_graph_trace` in `mcp_server/code_graph/tools/code-graph-tools.ts`.
- [ ] T012 Optionally add `trace_cache` only after the P0 trace result works.
- [ ] T013 Keep `code_packages` deferred unless redesigned around file paths, package markers, path aliases, import metadata, or explicit config.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Add fixtures for top-level TS function, Bash function, doc symbol/no node, module node, star re-export, named default class, and anonymous default class.
- [ ] T015 Add nested-class regression fixture proving fqName-based parent matching.
- [ ] T016 Add shared contract test: `trace.architectural_role === classifyFileRole(filePath, db)`.
- [ ] T017 Verify depth cap and `truncated: true` behavior.
- [ ] T018 Run `npm run check`.
- [ ] T019 Run `npx vitest run code-graph-trace.vitest.ts --coverage` and confirm >=80% coverage.
- [ ] T020 Run strict validation for this spec folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Required trace fields are returned for sparse symbols and normal class/method symbols.
- [ ] filePath-derived ownership is the only P0 module source.
- [ ] Optional cache/package work is either complete or explicitly deferred.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research**: `../research/027-xce-research-based-refinement-pt-02/research.md`
<!-- /ANCHOR:cross-refs -->
