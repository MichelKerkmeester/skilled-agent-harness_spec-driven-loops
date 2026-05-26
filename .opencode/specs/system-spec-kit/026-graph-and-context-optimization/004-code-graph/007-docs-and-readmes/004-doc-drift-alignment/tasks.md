---
title: "Tasks: system-code-graph doc-drift alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "028 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-doc-drift-alignment"
    last_updated_at: "2026-05-16T09:01:20Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list in canonical 3-phase shape"
    next_safe_action: "Execute Phase 1 edits"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000028"
      session_id: "028-tasks"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: system-code-graph Doc-Drift Alignment

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Scaffold packet folder (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-doc-drift-alignment/`)
- [x] T002 Grep all drift hits across 6 in-scope files
- [x] T003 [P] Confirm `tool-schemas.ts` enumerates 11 tools
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] ARCHITECTURE.md: §3 heading "(10 tools)" → "(11 tools)" and insert `code_graph_classify_query_intent` row (`.opencode/skills/system-code-graph/ARCHITECTURE.md`)
- [x] T005 [P] ARCHITECTURE.md: §8 "All 10 tools" → "All 11 tools" (`.opencode/skills/system-code-graph/ARCHITECTURE.md`)
- [x] T006 [P] ARCHITECTURE.md: §9 "live surface is 10 tools" → "11 tools" (`.opencode/skills/system-code-graph/ARCHITECTURE.md`)
- [x] T007 [P] INSTALL_GUIDE.md: lines 111 + 133 `_NOTE_2_TOOLS` "Registers 10 tools" → "Registers 11 tools" with classify enumeration (`.opencode/skills/system-code-graph/INSTALL_GUIDE.md`)
- [x] T008 [P] feature_catalog.md: line 38 "10 MCP tools" → "11 MCP tools" (`.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`)
- [x] T009 [P] README.md: "Active MCP tools | 10" → "Active MCP tools | 11" and insert classify row in §3.2 table (`.opencode/skills/system-code-graph/README.md`)
- [x] T010 graph-metadata.json: `mcp_server_topology` co-resident → standalone, `mcp_server_host` mk-spec-memory → mk-code-index, edges depends_on context rewritten (`.opencode/skills/system-code-graph/graph-metadata.json`)
- [x] T011 graph-metadata.json: `derived.causal_summary` rewritten to cite 11 tools + standalone server + v1.0.3.0 isolation; `derived.last_updated_at` bumped (`.opencode/skills/system-code-graph/graph-metadata.json`)
- [x] T012 SKILL.md: frontmatter `version` 1.0.0.0 → 1.0.3.1 and `_memory.continuity` refreshed to point at packet 020 (`.opencode/skills/system-code-graph/SKILL.md`)
- [x] T013 README.md: "Skill version | 1.0.0.0" → "Skill version | 1.0.3.1" (`.opencode/skills/system-code-graph/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Grep sweep returns no `10 (tools|MCP tools)` or `12 MCP tools` hits in scope files
- [ ] T015 `validate.sh --strict` on this packet exits 0
- [ ] T016 implementation-summary.md filled with grep + validate evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (strict-validate exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source-of-truth**: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
<!-- /ANCHOR:cross-refs -->
