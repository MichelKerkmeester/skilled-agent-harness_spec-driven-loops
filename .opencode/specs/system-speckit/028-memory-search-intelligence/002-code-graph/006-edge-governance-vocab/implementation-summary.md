---
title: "Implementation Summary: Code-Graph Edge Governance Vocabulary"
description: "DONE for the closed-vocab edge-governance anchor: system-code-graph now has a default-off SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB migration that rebuilds code_edges with an edge_type CHECK, preserves existing bitemporal columns, aborts before rebuild on out-of-vocab live/tombstone values, exposes rollback and verifies the 10 live edge types plus SUPERSEDES."
trigger_phrases:
  - "code graph edge governance summary"
  - "closed vocab check status"
  - "edge governance vocabulary done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the default-off closed-vocab edge_type CHECK migration"
    next_safe_action: "Keep SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB off until owner rollout approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-006-edge-governance-vocab"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When should SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB be enabled for the shared live DB?"
    answered_questions:
      - "Closed vocabulary is the 10 live edge relations plus SUPERSEDES"
      - "Live DB scan found only in-vocab code_edges values and no tombstone edge rows before migration"
---
# Implementation Summary: Code-Graph Edge Governance Vocabulary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab` |
| **Status** | complete |
| **Completion scope** | Closed-vocab governance shipped default-off. Churn cap, audit-subgraph and derived-clock siblings deferred |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The closed-vocabulary edge-governance anchor is implemented in `.opencode/skills/system-code-graph/mcp_server`.

`code_edges.edge_type` can now be rebuilt with a SQLite `CHECK` that admits the runtime `EDGE_TYPES` tuple: `CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF, SUPERSEDES`. The TypeScript `EdgeType` union now derives from the same tuple, so the DB migration and writer types share one vocabulary source.

The automatic migration is default-off behind `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`. When enabled, `ensureSchemaMigrations()` runs the vocabulary migration after the sibling bitemporal migration. The migration preserves existing `valid_at` / `invalid_at` columns, copies rows through a transaction, recreates the `idx_edges_source`, `idx_edges_target` and `idx_edges_type` indexes and advances the package schema version from 7 to 8.

The migration helper set mirrors the sibling schema pattern:

| Helper | Role |
|--------|------|
| `scanCodeEdgeGovernanceVocabulary()` | Pre-rebuild DISTINCT scan across `code_edges.edge_type` and nullable `code_graph_tombstones.edge_type` |
| `backfillCodeEdgeGovernanceVocabulary()` | Fail-closed guard that aborts on out-of-vocab values before any destructive rebuild step |
| `ensureCodeEdgeGovernanceVocabSchema()` | UP migration that rebuilds `code_edges` with the CHECK and preserves rows |
| `rollbackCodeEdgeGovernanceVocabSchema()` | DOWN migration that rebuilds `code_edges` without the CHECK and can be re-run safely |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Flag, schema version 8, CHECK SQL, scan/backfill/up/down helpers, opt-in migration wiring and durable comment-hygiene cleanup |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified | Exported `EDGE_TYPES` runtime tuple and derives `EdgeType` from it |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts` | Added | Covers default-off flag, opt-in init migration, CHECK admit/reject, row preservation, abort safety, tombstone scan, rollback and rerun |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scope was deliberately narrowed to the "edge-governance vocabulary" anchor. The broader planning spec still lists churn cap, audit-subgraph and derived-clock tiebreak siblings. Those remain deferred and were not touched. This avoids mixing a schema rollout with heuristic edge-write behavior.

The live DB was scanned read-only before implementation. Its `code_edges` vocabulary was already clean: `CALLS, CONTAINS, DECORATES, EXPORTS, EXTENDS, IMPLEMENTS, IMPORTS, OVERRIDES, TESTED_BY, TYPE_OF`. The `code_graph_tombstones` table had no edge rows. The `code_edges` table had no CHECK before this change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep automatic enforcement default-off | A table rebuild changes the live DB shape, so opt-in rollout keeps the shared DB stable until the owner enables it |
| Abort, do not repair, out-of-vocab values | Silent mapping would hide data-quality drift, so the migration names offending table/value/count and exits before rebuild |
| Use `EDGE_TYPES` as runtime source of truth | Keeps the TypeScript union and SQLite CHECK vocabulary synchronized, including `SUPERSEDES` |
| Bump schema from 7 to 8 | Sibling 004 already owns 7, so this phase extends that sequence without reusing its migration version |
| Leave siblings deferred | Churn caps, audit-subgraph and derived-clock tiebreak are separate behavior changes beyond the requested vocabulary task |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live DB DISTINCT scan | PASS: only in-vocab `code_edges` values, no tombstone edge rows, CHECK absent before migration |
| Typecheck | PASS: `npm run typecheck` in `.opencode/skills/system-code-graph` |
| Focused schema/migration/governance Vitest | PASS: 3 files, 15 tests passed |
| Mutation falsifier | PASS: temporarily removing `SUPERSEDES` from `EDGE_TYPES` made `code-edge-governance-vocab.vitest.ts` fail as expected, then restored and reran green |
| Comment hygiene | PASS on modified code/test files |
| Alignment drift | PASS: `verify_alignment_drift.py --root .opencode/skills/system-code-graph/mcp_server` |
| `validate.sh --strict` on this folder | PASS after final documentation sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CHECK is opt-in for automatic init.** `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` must be set to `true` before the shared DB is rebuilt automatically.
2. **The live DB was not mutated by this implementation.** The scan was read-only. Migration behavior is covered in temp/in-memory tests.
3. **Churn cap, audit-subgraph and derived-clock tiebreak remain deferred.** They are separate governance siblings and should ship behind their own evidence.
4. **No broad-suite claim is made.** The requested broad suite is known to include pre-existing IPC/socket/daemon environment failures. This pass verifies the focused schema/migration surface.
<!-- /ANCHOR:limitations -->
