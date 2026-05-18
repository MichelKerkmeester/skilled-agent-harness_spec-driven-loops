---
title: "Tasks: Code-Graph Bug Remediation"
description: "One task per P0/P1 finding plus regression test and verification tasks for Phase 026/007/012/004."
trigger_phrases:
  - "026/007/012/004 tasks"
  - "code graph remediation tasks"
  - "F-002 tasks"
  - "F-003 tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/004-zero-node-and-parser-remediation"
    last_updated_at: "2026-05-06T06:02:52Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed remediation task list"
    next_safe_action: "Review final verification output"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:b2eca018bda921d87cd36825ae367961ec42e2684284deefc0a904181622254d"
      session_id: "026-007-012-004-zero-node-and-parser-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code-Graph Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Create Level 2 packet scaffold (`004-zero-node-and-parser-remediation/`)
- [x] T002 Read research findings and resource map (`../003-code-graph-bug-surface-research/research/`)
- [x] T003 Read target code and tests before editing (`scan.ts`, `ensure-ready.ts`, `code-graph-db.ts`, `status.ts`, schemas, tests)
- [x] T004 Update parent child metadata plan (`../graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 F-002 add zero-node scan guard (`code_graph/handlers/scan.ts`)
- [x] T006 F-002 expose `forceZeroNodeReset` (`tool-schemas.ts`, `schemas/tool-input-schemas.ts`)
- [x] T007 F-002 add zero-node preservation regression (`code_graph/tests/code-graph-scan.vitest.ts`)
- [x] T008 F-003 preserve prior per-file graph on parser error (`code_graph/lib/ensure-ready.ts`)
- [x] T009 F-003 add parse-error preservation regression (`code_graph/tests/code-graph-atomic-persistence.vitest.ts`)
- [x] T010 F-009 filter orphan edges and cleanup (`code_graph/lib/code-graph-db.ts`)
- [x] T011 F-009 add orphan-edge regression (`code_graph/tests/code-graph-indexer.vitest.ts`)
- [x] T012 F-008 gate live scan metadata promotion (`code_graph/handlers/scan.ts`, `code_graph/lib/code-graph-db.ts`)
- [x] T013 F-010 loosen candidate manifest recording for nonfatal parse errors (`code_graph/handlers/scan.ts`)
- [x] T014 F-010 add manifest regression (`code_graph/tests/code-graph-scan.vitest.ts`)
- [x] T015 F-011 add durable parse diagnostics schema/API (`code_graph/lib/code-graph-db.ts`)
- [x] T016 F-011 expose diagnostics in scan/status responses (`code_graph/handlers/scan.ts`, `code_graph/handlers/status.ts`)
- [x] T017 F-011 add diagnostics response regression (`code_graph/tests/code-graph-scan.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run code graph tests (`cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run code_graph/tests/`)
- [x] T019 Run TypeScript build (`cd .opencode/skills/system-spec-kit/mcp_server && npm run build`)
- [x] T020 Run child strict validation (`validate.sh 004-zero-node-and-parser-remediation --strict`)
- [x] T021 Run parent strict validation (`validate.sh 011-real-world-usefulness-test-planning --strict`)
- [x] T022 Update implementation summary and checklist evidence (`implementation-summary.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks T005-T009 complete with tests.
- [x] All P1 tasks T010-T017 complete with tests.
- [x] Verification tasks T018-T021 have recorded pass/fail evidence.
- [x] No `[B]` blocked tasks remain.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research Source**: See `../003-code-graph-bug-surface-research/research/research.md`
- **Resource Map**: See `../003-code-graph-bug-surface-research/research/resource-map.md`
<!-- /ANCHOR:cross-refs -->
