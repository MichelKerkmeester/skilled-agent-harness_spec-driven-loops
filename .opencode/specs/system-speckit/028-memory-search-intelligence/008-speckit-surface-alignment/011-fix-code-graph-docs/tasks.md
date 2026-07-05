---
title: "Tasks: Fix Code Graph Docs"
description: "Task ledger for the system-code-graph documentation alignment fix."
trigger_phrases:
  - "tasks"
  - "code graph docs"
  - "doc alignment"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/011-fix-code-graph-docs"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Track system-code-graph doc alignment tasks"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/references/runtime/tool_surface.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-code-graph-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fix Code Graph Docs

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

- [x] T001 Read audit report (`011-code-graph-doc-audit/review-report.md`)
- [x] T002 [P] Verify doc-symbol lane implementation (`mcp_server/lib/structural-indexer.ts`, `mcp_server/lib/doc-symbol-extractor.ts`, `mcp_server/lib/indexer-types.ts`)
- [x] T003 [P] Verify parser retry/self-heal implementation (`mcp_server/lib/parser-skip-list.ts`, `mcp_server/tests/parser-skip-list.vitest.ts`)
- [x] T004 [P] Verify handler topology (`mcp_server/tools/code-graph-tools.ts`, `mcp_server/handlers/README.md`, `mcp_server/handlers/index.ts`)
- [x] T005 [P] Verify parser location (`mcp_server/lib/tree-sitter-parser.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Fix doc-symbol lane wording (`.opencode/skills/system-code-graph/SKILL.md`)
- [x] T007 Fix doc-symbol lane and parser retry wording (`.opencode/skills/system-code-graph/README.md`)
- [x] T008 Fix handler map (`.opencode/skills/system-code-graph/references/runtime/tool_surface.md`)
- [x] T009 Fix architecture parser topology (`.opencode/skills/system-code-graph/ARCHITECTURE.md`)
- [x] T010 Fix skill version and parser retry env var (`.opencode/skills/system-code-graph/INSTALL_GUIDE.md`)
- [x] T011 Fix query-operation catalog wording (`.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Create phase spec (`spec.md`)
- [x] T013 Create phase plan (`plan.md`)
- [x] T014 Create task ledger (`tasks.md`)
- [x] T015 Create implementation summary with before/after evidence (`implementation-summary.md`)
- [x] T016 Run strict spec validation (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/011-fix-code-graph-docs --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six audit findings corrected in documentation.
- [x] No runtime code or tests changed.
- [x] Strict spec validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Audit Source**: See sibling folder `011-code-graph-doc-audit/review-report.md`
<!-- /ANCHOR:cross-refs -->
