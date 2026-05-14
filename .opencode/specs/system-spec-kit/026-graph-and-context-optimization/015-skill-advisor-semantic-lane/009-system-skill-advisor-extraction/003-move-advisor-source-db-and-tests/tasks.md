---
title: "Tasks: Move advisor source DB and tests"
description: "Inventory, batched move with import rewrites, DB relocation, validation."
trigger_phrases:
  - "advisor source move tasks"
  - "015/009/003 tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/003-move-advisor-source-db-and-tests"
    last_updated_at: "2026-05-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Tasks authored"
    next_safe_action: "Author checklist"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-move-advisor-source-db-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Move advisor source DB and tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Snapshot file list under `system-spec-kit/mcp_server/skill_advisor/` (`find . -type f -not -name 'shadow-deltas.jsonl' > scratch/pre-move-inventory.txt`).
- [ ] T002 Capture import graph: every file in `skill_advisor/` that imports a sibling + every file outside that imports something inside.
- [ ] T003 Grep for hardcoded absolute paths referencing `skill_advisor/` in fixture files; list each one.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Batch 1: `git mv` handlers + lib + tools + schemas → `system-skill-advisor/mcp_server/{handlers,lib,tools,schemas}/`.
- [ ] T011 Rewrite imports inside batch 1; relative paths still resolve after the move.
- [ ] T012 `tsc --noEmit` from `system-spec-kit/mcp_server/` after batch 1; must be exit-0.
- [ ] T013 Batch 2: `git mv` scripts + compat + tests + bench + data → `system-skill-advisor/mcp_server/{scripts,compat,tests,bench,data}/`.
- [ ] T014 Rewrite imports inside batch 2 + fix any test-fixture hardcoded paths from T003.
- [ ] T015 `tsc --noEmit` after batch 2; must be exit-0.
- [ ] T016 Batch 3: `git mv` skill-graph.sqlite + -shm + -wal → `system-skill-advisor/mcp_server/database/`.
- [ ] T017 Batch 4: rewrite `system-spec-kit/mcp_server/src/context-server.ts` advisor handler imports to the new module paths.
- [ ] T018 Author `system-skill-advisor/mcp_server/tsconfig.json` (extends spec-kit).
- [ ] T019 Author `system-skill-advisor/mcp_server/vitest.config.*` (covers moved tests).
- [ ] T020 Add `SYSTEM_SKILL_ADVISOR_DB_DIR` env override to the DB path resolver (default = `<skill-folder>/mcp_server/database`).
- [ ] T021 Update `system-skill-advisor/mcp_server/README.md` from "child 003 drop target" stub to reflect landed content.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T030 `npm run typecheck` from `system-spec-kit/mcp_server/` → exit 0.
- [ ] T031 `npx vitest run skill_advisor` → ≤ 3 failures.
- [ ] T032 Smoke: start spec_kit_memory MCP, call advisor_recommend, confirm shaped output.
- [ ] T033 Grep sweep — no live `*.ts` references the old `system-spec-kit/mcp_server/skill_advisor/` prefix outside spec packet docs.
- [ ] T034 DB-isolation check: after smoke, NEW path SQLite mtime advanced + OLD path file absent.
- [ ] T035 Strict-validate 003 + 015/009 + 015.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]` or `[B]` with documented rationale.
- [ ] No production code outside the documented surfaces modified.
- [ ] Vitest parity ≤ 3 (down from 4 post-002).
- [ ] Strict validation green at all three levels.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `015/009-system-skill-advisor-extraction`
- ADR source: `015/009/001-design-and-decision-record/decision-record.md`
- Scaffold source (destination tree): `015/009/002-scaffold-system-skill-advisor-package`
- Next packet: `015/009/004-standalone-mcp-launcher-and-runtime-configs`
<!-- /ANCHOR:cross-refs -->
