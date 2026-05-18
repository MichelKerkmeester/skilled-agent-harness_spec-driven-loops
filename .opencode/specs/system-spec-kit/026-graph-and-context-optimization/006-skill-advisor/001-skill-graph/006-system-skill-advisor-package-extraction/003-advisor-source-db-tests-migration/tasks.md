---
title: "Tasks: Finalize advisor move recalibration"
description: "Task ledger for the moved advisor source/package/spec recalibration."
trigger_phrases:
  - "advisor move recalibration tasks"
  - "013/009/003 tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration"
    last_updated_at: "2026-05-14T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Continue 004"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0130090030000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-003-recalibrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Finalize Advisor Move Recalibration

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

- [x] T001 Source tree physically moved to `system-skill-advisor/mcp_server/` by prior operation.
- [x] T002 Old source directory confirmed absent with `ls`.
- [x] T003 New source tree confirmed populated.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Ran required old spec-path hit list.
- [x] T011 Rewrote full old spec path references to the new `008/013` nesting.
- [x] T012 Rewrote bare moved-tree `015-skill-advisor-semantic-lane` references.
- [x] T013 Canonicalized moved `graph-metadata.json` and `description.json` files.
- [x] T014 Added moved `013` child to `006-skill-advisor/graph-metadata.json`.
- [x] T015 Updated system-skill-advisor `SKILL.md` and `ARCHITECTURE.md` old packet references.
- [x] T016 Updated code-graph cross-reference metadata.
- [x] T017 Repointed `context-server.ts` advisor imports.
- [x] T018 Repointed bridge schemas/tools/helpers to new advisor package modules.
- [x] T019 Updated projection DB resolver default and added `SYSTEM_SKILL_ADVISOR_DB_DIR`.
- [x] T020 Rewrote the 16 required TypeScript string-literal moved-tree path references.
- [x] T021 Authored package `tsconfig.json`, `vitest.config.ts`, and `package.json`.
- [x] T022 Investigated old DB stub; old stub was absent, new DB had rows.
- [x] T023 Updated package README from scaffold to landed tree map.
- [x] T024 Rewrote stale moved-tree path references in package docs/catalog/playbook.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T030 Rename sweep for old moved spec path returned zero hits.
- [x] T031 Typecheck from `system-spec-kit/mcp_server` passed.
- [x] T032 Requested Vitest command run and fail count recorded.
- [x] T033 Strict validate `003`.
- [x] T034 Strict validate `009`.
- [x] T035 Strict validate `013`.
- [x] T036 Strict validate `008`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All verification tasks complete.
- [x] Public `advisor_*` tool ids unchanged.
- [x] No old source directory recreated.
- [x] Old DB stub not deleted because it was already absent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `006-system-skill-advisor-package-extraction`
- ADR source: `009-system-skill-advisor-extraction/001-extraction-design-and-adr`
- Next packet: `009-system-skill-advisor-extraction/004-standalone-mcp-launcher-runtime-configs`
<!-- /ANCHOR:cross-refs -->
