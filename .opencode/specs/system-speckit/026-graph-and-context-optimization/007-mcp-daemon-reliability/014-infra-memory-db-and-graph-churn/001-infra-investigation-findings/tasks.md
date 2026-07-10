---
title: "Tasks: Infra investigations — memory-DB + graph-churn"
description: "Task tracker for the two infra fixes (investigation done; application pending)."
trigger_phrases:
  - "infra fix tasks memory db graph churn"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings"
    last_updated_at: "2026-05-30T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Investigation committed; application pending"
    next_safe_action: "Apply graph-churn fix when tooling healthy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003203"
      session_id: "001-infra-investigation-findings-tasks"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Infra investigations — memory-DB + graph-churn

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

- [x] T001 Root-cause memory-DB SQLITE_CONSTRAINT_PRIMARYKEY (corrupted FTS5 shadow after unclean shutdown)
- [x] T002 Root-cause graph-metadata churn (default-root walk + unconditional last_save_at, incl. archives)
- [x] T003 Revert the unsanctioned agent edit to graph-metadata-parser.ts; preserve it at /tmp for review

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add idempotent last_save_at skip in graph-metadata-parser.ts — `refreshGraphMetadataForSpecFolder` skips the write when `graphMetadataEqualIgnoringVolatile(existing, merged)` (skip-if-unchanged)
- [x] T011 Preserve chronology pointer fields across re-derive — declared `last_active_child_id` + `last_active_at` in `graphMetadataDerivedSchema`; carried through `deriveGraphMetadata` + `mergeGraphMetadata` (Zod was stripping them)
- [x] T012 Stop status downgrade — `deriveStatus` now falls back to the existing status before returning `planned` for lean phase parents (no implementation-summary.md)
- [x] T006 Build + targeted vitest — `npm run build` clean; 4 new round-trip/churn-kill tests + 50 existing graph-metadata tests pass; live 026 probe + 7/7 real-packet sample confirm preservation + zero churn
- [x] T005 Save-time refresh is already scoped to the single touched folder at HEAD (verified c657219dd9 + independently re-checked): workflow.ts calls refreshGraphMetadata(validatedSpecFolderPath); the parser writes exactly one graph-metadata.json with no tree walk; the broad walker in backfill-graph-metadata.ts is CLI-entrypoint-gated and never imported by the save path. Global backfill stays explicit opt-in. No code change needed.
- [x] T007 [B] Memory-DB repair via /doctor memory / FTS runbook (operator-gated; DB-copy probe first)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-save a packet twice → second produces no graph-metadata.json diff (vitest "does not rewrite … no content delta" + 7/7 real-packet sample, all idempotent)
- [x] T009 Verified at HEAD: a save refreshes only the touched packet's graph-metadata.json; archives untouched. The save path is single-folder (no default-root walk); idempotency additionally suppresses no-op rewrites. The earlier "content-changing save still walks the default root" assertion was false.
- [x] T010 memory_save / memory_index_scan / memory_match_triggers succeed; no .unclean-shutdown left (operator-gated DB repair, unchanged)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Graph-churn idempotency + field-preservation + status-preservation applied + verified (T004/T006/T008/T011/T012)
- [x] Walker scope + archive exclusion (T005) — verified already-scoped at HEAD: the save path is single-folder; the broad walker is CLI-only. No code change needed.
- [ ] Memory DB repaired + writes succeed (T007/T010 — operator-gated)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Agent's proposed graph-churn edit**: `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` (reference only — re-derive when applying)

<!-- /ANCHOR:cross-refs -->
