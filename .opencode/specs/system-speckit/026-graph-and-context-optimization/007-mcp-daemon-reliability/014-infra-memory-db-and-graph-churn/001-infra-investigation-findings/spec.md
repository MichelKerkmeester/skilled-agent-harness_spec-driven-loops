---
title: "Feature Specification: Infra investigations — memory-DB corruption + graph-metadata churn"
description: "Root-cause findings + proposed fixes for two live-infra issues: (1) the spec-memory MCP throws SQLITE_CONSTRAINT_PRIMARYKEY on writes (corrupted FTS5 shadow after an unclean shutdown); (2) the daemon rewrites ~634 graph-metadata.json last_save_at timestamps repo-wide on every save. Fixes are documented but NOT yet applied (memory-DB is operator-gated; graph-churn code fix deferred under degraded tooling)."
trigger_phrases:
  - "memory db SQLITE_CONSTRAINT_PRIMARYKEY corruption"
  - "graph-metadata last_save_at churn 634 files"
  - "spec-memory MCP write failure investigation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings"
    last_updated_at: "2026-05-30T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied + verified graph-metadata fixes"
    next_safe_action: "Run /doctor memory for the DB repair"
    blockers:
      - "Graph-churn code fix deferred (memory-DB resolved 2026-05-30)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003201"
      session_id: "001-infra-investigation-findings-spec"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Memory-DB root cause: corrupted FTS5 shadow (memory_fts_data) after an unclean shutdown; the AFTER-INSERT trigger memory_fts_insert hits a duplicate shadow rowid -> SQLITE_CONSTRAINT_PRIMARYKEY, aborting every memory_index insert. Detect-only boot probe does not repair."
      - "Graph-churn root cause: the save path invokes the graph-metadata refresh with the DEFAULT ROOT (whole .opencode/specs tree, incl z_archive/z_future) and writes last_save_at unconditionally, so every save rewrites ~634 packets' timestamps."
      - "Graph-churn was ALSO compounded by Zod stripping last_active_child_id/last_active_at (never declared in graphMetadataDerivedSchema) and deriveStatus resetting lean phase parents to 'planned' — so each re-derive both churned AND silently corrupted curated metadata. Fixed: declare+preserve the fields, preserve existing status, and make the write idempotent (skip when only last_save_at would change)."
---
# Feature Specification: Infra investigations — memory-DB corruption + graph-metadata churn

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Graph-metadata fixes applied + verified; memory-DB repair operator-gated |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | (standalone infra packet) |
| **Handoff Criteria** | Graph-churn fix applied (scope + idempotency) with the daemon no longer churning archived trees; memory-DB repaired via /doctor memory or the FTS runbook and memory_save/index_scan/match_triggers succeed. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two live-infra issues degrade the spec-memory subsystem. (1) The spec-memory MCP throws `SQLITE_CONSTRAINT_PRIMARYKEY` on `memory_match_triggers`, `memory_index_scan`, and `memory_save`, blocking every memory write/index path — present since session start, caused by corrupted on-disk DB state after an unclean shutdown, not a logic defect. (2) The daemon (and any save path) rewrites ~634 `graph-metadata.json` `last_save_at` timestamps repo-wide — including `z_archive/` and `z_future/` — on essentially every save, burying real changes in working-tree noise and forcing wide manual git scoping on every commit.

### Purpose
Record the verified root cause and a minimal, safe fix for each, so the graph-churn code fix can be applied cleanly when tooling is healthy and the memory-DB repair can be run through the operator-gated path.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Documented root cause + proposed fix for both issues (this packet).
- The graph-churn fix is a code change (scope the refresh to the saved folder + write `last_save_at` only on a real content delta + exclude archived trees from the global walker).

### Out of Scope
- Applying the memory-DB repair here — it mutates a 1 GB live DB and is operator-gated (`/doctor memory` or the FTS runbook), with a DB-copy probe first to choose the branch.
- Applying the graph-churn code fix in this session — deferred because the editing tooling (Read/shell) was degraded and the change touches operator-sensitive metadata-writing code; an investigation agent's attempted in-place edit to `graph-metadata-parser.ts` was reverted to known-good HEAD and preserved at `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` for review.

### Files to Change (when applied)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/graph/graph-metadata-schema.ts | Modify (DONE) | Declare `last_active_child_id` + `last_active_at` (nullable optional) so Zod preserves them |
| mcp_server/lib/graph/graph-metadata-parser.ts | Modify (DONE) | Idempotent `last_save_at` skip; preserve pointer fields + existing status across derive/merge; `graphMetadataEqualIgnoringVolatile` helper |
| scripts/tests/graph-metadata-refresh.vitest.ts | Modify (DONE) | Round-trip + churn-kill + status-preservation regression tests |
| scripts/graph/backfill-graph-metadata.ts (+ generate-context save path) | Modify (DEFERRED, T005) | Scope the save-time refresh to the touched folder; exclude `z_archive`/`z_future`; keep the global backfill as explicit opt-in |
| mcp_server/database/context-index.sqlite | Repair (operator-gated) | FTS5 shadow rebuild via `/doctor memory` / runbook — NOT a normal edit |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete to resolve)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Memory writes succeed again | `memory_save` / `memory_index_scan` / `memory_match_triggers` run without `SQLITE_CONSTRAINT_PRIMARYKEY` after the FTS5 shadow rebuild |
| REQ-002 | Saves stop churning archived trees | A save rewrites only the touched packet's `graph-metadata.json`; `z_archive`/`z_future` are never touched |
| REQ-003 | `last_save_at` is idempotent | A no-op save produces no `graph-metadata.json` diff — DONE (skip-if-unchanged in `refreshGraphMetadataForSpecFolder`) |
| REQ-006 | Chronology pointer survives re-derive | `last_active_child_id` + `last_active_at` declared in the schema and preserved through derive/merge; a graph_only re-derive keeps them — DONE |
| REQ-007 | Curated status survives re-derive | `deriveStatus` preserves an existing status for lean phase parents instead of resetting to `planned` — DONE |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Memory-DB repair done safely | DB copied to /tmp and probed first; the chosen branch (FTS rebuild vs id-dedupe) verified on the copy before any live change |
| REQ-005 | Global backfill remains available | The repo-wide refresh is reachable via an explicit CLI flag, not the save-time default |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Memory subsystem writes succeed; the boot integrity probe passes with no `.unclean-shutdown` marker left behind.
- **SC-002**: A typical save touches one `graph-metadata.json`, not ~634; archived trees never churn.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Memory-DB is a 1 GB live file; wrong SQL = data loss | High | DB-copy probe first; prefer FTS rebuild (touches only the derived index); never `INSERT OR REPLACE` on `memory_index` |
| Risk | graph-metadata-parser.ts is operator-sensitive; edited under degraded tooling | Corruption | Deferred; agent's in-place edit reverted; apply only when Read/shell are reliable and the build verifies |
| Dependency | `/doctor memory` / FTS_CORRUPTION_RUNBOOK | Memory repair path | Operator-gated; documented in bug-report-memory-db-corruption.md |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the save-time refresh be made idempotent + scoped in the same change, or split (idempotency in `graph-metadata-parser.ts` first, then scope the caller)?

<!-- /ANCHOR:questions -->
