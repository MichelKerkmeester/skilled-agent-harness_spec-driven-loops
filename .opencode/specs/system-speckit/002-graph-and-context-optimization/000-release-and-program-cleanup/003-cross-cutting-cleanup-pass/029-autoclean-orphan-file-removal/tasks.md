---
title: "Tasks: 055 AutoClean Orphan Files"
description: "Task list for the cleanFiles enhancement: lib change, wrapper, schema, handler, tests, build, live-DB run, doc updates."
trigger_phrases:
  - "029-autoclean-orphan-file-removal tasks"
  - "verify_integrity cleanFiles tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal"
    last_updated_at: "2026-05-08T10:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author task list for cleanFiles enhancement"
    next_safe_action: "Start T004 (verify_integrity lib change)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-autoclean-orphan-file-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 055 AutoClean Orphan Files

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

- [x] T001 Spec authored — `spec.md`
- [x] T002 Plan authored — `plan.md`
- [x] T003 Task list authored — `tasks.md` (this file)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Extend `verify_integrity` with `cleanFiles?: boolean` option, cleanup loop using `delete_memory_from_database`, history recording, and `cleaned.files` return field — `mcp_server/lib/search/vector-index-queries.ts:1285`
- [ ] T005 Update `Vectorindex.verifyIntegrity` wrapper option type + return type — `mcp_server/lib/search/vector-index-store.ts:1102`
- [ ] T006 [P] Add `cleanFiles: z.boolean().optional()` to `memoryHealthSchema` and `'cleanFiles'` to ALLOWED_KEYS — `mcp_server/schemas/tool-input-schemas.ts:355,729`
- [ ] T007 Extend `memory_health` autoRepair branch to read `cleanFiles`, validate type, pass to `verify_integrity`, append `orphan_files_cleaned:N` to `repair.actions`, add hint — `mcp_server/handlers/memory-crud-health.ts:244-270,556-589`
- [ ] T008 [P] Add unit tests for `cleanFiles` happy/edge paths — `mcp_server/tests/vector-index-impl.vitest.ts`
- [ ] T009 [P] Add integration test for memory_health autoRepair+cleanFiles flow — `mcp_server/tests/memory-crud-extended.vitest.ts`
- [ ] T010 Build dist — `cd mcp_server && npm run build`
- [ ] T011 Run vitest — `cd mcp_server && npm test`; advisor failure count regression must be 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 User restarts MCP child to load new dist
- [ ] T013 `checkpoint_create({ name: "pre-cleanfiles-<ts>" })` snapshot before live run
- [ ] T014 Capture before stats — `memory_health` full report → `scratch/cleanup-before.json`
- [ ] T015 Run `memory_health({ autoRepair: true, confirmed: true, cleanFiles: true })` → confirm `orphan_files_cleaned:N` in repair.actions
- [ ] T016 Capture after stats — `memory_health` full report → `scratch/cleanup-after.json`; verify orphanedFiles drops to 0 (or <5), `consistency.status === 'healthy'`
- [ ] T017 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
- [ ] T018 Fill `implementation-summary.md` with results and link to before/after stats
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T013/T015 may be deferred behind user OK on the live-DB run; that is acceptable)
- [ ] No `[B]` blocked tasks remaining
- [ ] Tests + build green; advisor pre-existing failures count is unchanged
- [ ] Live-DB run reduces orphanedFiles to 0 (or <5) — or explicitly deferred and marked deferred
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor diagnosis**: `../004-runtime-root-memory-cleanup-followup-fixes/scratch/fts-vec-diagnosis.md`
<!-- /ANCHOR:cross-refs -->

---
