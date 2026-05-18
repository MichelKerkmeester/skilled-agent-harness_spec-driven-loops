---
title: "Implementation Plan: 055 AutoClean Orphan Files"
description: "Add cleanFiles option to verify_integrity, thread it through the Vectorindex wrapper, memory_health handler, and schema; gated behind autoRepair+confirmed; uses delete_memory_from_database for ancillary cleanup."
trigger_phrases:
  - "029-autoclean-orphan-file-removal plan"
  - "verify_integrity cleanFiles plan"
  - "memory_health autoRepair cleanFiles plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/029-autoclean-orphan-file-removal"
    last_updated_at: "2026-05-08T10:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author plan for cleanFiles enhancement"
    next_safe_action: "Implement REQ-001 (lib) → REQ-002 (handler/schema) → REQ-003 (tests)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-autoclean-orphan-file-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 055 AutoClean Orphan Files

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) |
| **Framework** | Node.js MCP server (`@modelcontextprotocol/sdk`) |
| **Storage** | SQLite + sqlite-vec (vec_memories), FTS5 (memory_fts) |
| **Testing** | Vitest |

### Overview
Extend the existing `verify_integrity` library function (`lib/search/vector-index-queries.ts:1285-1418`) with a `cleanFiles` option that, when paired with `autoClean`, deletes memory_index rows whose `file_path` no longer exists on disk. Use the existing `delete_memory_from_database` helper (already used for orphan_chunks) so vec_memories rows, lineage edges, projections, and graph residue are cleaned in the same transaction. Surface the option through the `Vectorindex` class wrapper (`vector-index-store.ts:1102`) and `memory_health` autoRepair handler (`memory-crud-health.ts:558`). Gate it behind `autoRepair && confirmed` so it cannot fire by accident.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..004)
- [x] Dependencies identified (`delete_memory_from_database` helper)

### Definition of Done
- [ ] REQ-001 implemented in `verify_integrity`
- [ ] REQ-002 implemented in handler + schema
- [ ] Unit tests pass (no regression in advisor's pre-existing 37 failures)
- [ ] `npm run build` exits 0
- [ ] Live-DB run drops orphanedFiles to 0 (or <5)
- [ ] `validate.sh --strict` exits 0
- [ ] implementation-summary.md filled with results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP handler — schema (zod) → handler (validation + business logic) → wrapper class (`Vectorindex`) → lib function (`verify_integrity`).

### Key Components
- **`verify_integrity`** (`lib/search/vector-index-queries.ts`): pure function — reads orphans, optionally cleans, returns summary.
- **`Vectorindex.verifyIntegrity`** (`lib/search/vector-index-store.ts:1102`): async wrapper — provides type signature to handler.
- **`memory_health` handler** (`handlers/memory-crud-health.ts`): validates input, gates on `autoRepair && confirmed`, calls wrapper, surfaces results in `repair.actions`/`hints`.
- **`memoryHealthSchema`** (`schemas/tool-input-schemas.ts:355`): zod schema declares input shape.

### Data Flow
1. MCP client → `memory_health({ autoRepair: true, confirmed: true, cleanFiles: true })`
2. Schema validates → handler reads args → `vectorIndex.verifyIntegrity({ autoClean: true, cleanFiles: true })`
3. Lib function: queries memory_index for rows whose `file_path` is missing on disk → for each, `delete_memory_from_database(db, id)` → records history.
4. Returns `{ orphanedFiles: [], cleaned: { vectors: V, chunks: C, files: F }, isConsistent: bool, ... }`
5. Handler appends `orphan_files_cleaned:F` to `repair.actions`, adds hint, runs post-repair `verify_integrity({ autoClean: false })` to confirm clean state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `verify_integrity` (`vector-index-queries.ts:1285`) | Producer of orphan-file report; cleans only vectors+chunks | **Update** — accept `cleanFiles`, add cleanup loop, expand `cleaned` shape | Unit test `cleanFiles=true` deletes rows; type-check on return shape |
| `Vectorindex.verifyIntegrity` (`vector-index-store.ts:1102`) | Wrapper exposing function to TS callers | **Update** — extend options + return types | Type-check passes; handler call site compiles |
| `memory-crud-health.ts:558` | Handler call site for autoRepair | **Update** — pass `cleanFiles` through; surface result | Integration test `autoRepair+confirmed+cleanFiles` end-to-end |
| `memory-crud-health.ts:574` (post-repair check) | Diagnostic re-read | **Unchanged** — still calls with `autoClean: false` | Existing test |
| `memoryHealthSchema` (`tool-input-schemas.ts:355`) | Public input contract for `memory_health` | **Update** — add `cleanFiles: z.boolean().optional()` | Schema validator rejects non-boolean |
| `memory_health` ALLOWED_KEYS (`tool-input-schemas.ts:729`) | Allowed-keys allowlist | **Update** — add `'cleanFiles'` | Schema-allowed-keys test |
| `context-server.ts:1869` (other `verifyIntegrity` caller) | Read-only diagnostic | **Unchanged** — doesn't pass options | grep confirms |

Required inventories:
- Same-class producers: `rg -n 'verifyIntegrity\|verify_integrity' .opencode/skills/system-spec-kit/mcp_server` — already audited, only the call sites above touch it.
- Consumers of changed symbols: `rg -n 'cleanFiles' .opencode/skills/system-spec-kit/mcp_server` — expected zero before this packet, non-zero after.
- Algorithm invariant: when `cleanFiles && autoClean`, every memory whose `file_path` does not exist on disk MUST be deleted via `delete_memory_from_database` (NOT raw DELETE), and vec_memories rows MUST drop in lockstep so subsequent runs report `cleaned.files === 0`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec authored (this packet)
- [x] Predecessor diagnosis read (`scratch/fts-vec-diagnosis.md` in 054)
- [x] Affected-surfaces matrix complete (above)

### Phase 2: Core Implementation
- [ ] REQ-001 — extend `verify_integrity` in `vector-index-queries.ts`
- [ ] REQ-002 — extend `Vectorindex.verifyIntegrity` wrapper in `vector-index-store.ts`
- [ ] REQ-002 — extend `memoryHealthSchema` + ALLOWED_KEYS in `tool-input-schemas.ts`
- [ ] REQ-002 — extend `memory_health` handler in `memory-crud-health.ts` (validate input, thread through, surface result)
- [ ] REQ-003 — unit tests in `tests/vector-index-impl.vitest.ts`
- [ ] REQ-003 — integration test in `tests/memory-crud-extended.vitest.ts`

### Phase 3: Verification
- [ ] `cd mcp_server && npm run build` exits 0
- [ ] `npm test` — new tests pass; existing test count regresses by 0
- [ ] User restarts MCP child
- [ ] Run `memory_health({ autoRepair: true, confirmed: true, cleanFiles: true })` against live DB
- [ ] Capture before/after stats in `scratch/cleanup-results.md`
- [ ] `validate.sh --strict` exits 0
- [ ] implementation-summary.md filled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `verify_integrity` cleanFiles cleanup logic — happy path, no-orphan no-op, helper failure, cleanFiles without autoClean | Vitest with in-memory SQLite + filesystem mocks |
| Integration | `memory_health` autoRepair+confirmed+cleanFiles end-to-end via the handler | Vitest spawning a fresh DB |
| Manual | Live-DB cleanup run after MCP child restart | MCP `memory_health` tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `delete_memory_from_database` helper | Internal | Green | Already used for orphan_chunks; same module |
| MCP child restart | Operational | User-action | Cleanup deferred until restart |
| Existing 37 advisor test failures | Internal (out-of-scope) | Yellow (tracked by sibling test-fixture sweep packet) | Failure count must NOT grow |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live-DB run deletes user-authored memories that should have been preserved (e.g., file moved rather than deleted).
- **Procedure**:
  1. `checkpoint_restore({ name: "pre-bulk-delete-deprecated-2026-05-08T09-12-20" })` reverts the prior packet 054 deletions plus any cleanFiles deletions made AFTER the checkpoint was created (the auto-checkpoint snapshot dates from 2026-05-08T09:12:20Z; cleanFiles run is later, so its rows are NOT in the snapshot — additional rollback may require a fresh `checkpoint_create` BEFORE running cleanFiles).
  2. **Recommended workflow**: `checkpoint_create({ name: "pre-cleanfiles-<ts>" })` BEFORE the live cleanFiles run.
  3. Code-level rollback: `git revert <commit>` for the implementation; `npm run build` to restore old dist.
<!-- /ANCHOR:rollback -->

---
