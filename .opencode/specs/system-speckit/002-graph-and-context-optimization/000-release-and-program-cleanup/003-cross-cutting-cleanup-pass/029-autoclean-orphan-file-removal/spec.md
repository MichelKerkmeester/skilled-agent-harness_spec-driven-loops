---
title: "Feature Specification: 055 AutoClean Orphan Files"
description: "Extend verify_integrity with a cleanFiles option that deletes memory_index rows whose file_path no longer exists on disk, and expose it through memory_health autoRepair so the runtime can self-heal orphan-file drift."
trigger_phrases:
  - "029-autoclean-orphan-file-removal"
  - "verify_integrity cleanFiles"
  - "memory_health autoRepair cleanFiles"
  - "orphan files autoclean"
  - "orphanedFiles drift cleanup"
  - "memory_index file_path missing"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal"
    last_updated_at: "2026-05-08T10:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author spec for cleanFiles enhancement to verify_integrity + memory_health autoRepair"
    next_safe_action: "Implement REQ-001 lib change, then REQ-002 wrapper/handler/schema, then REQ-003 tests"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 055 AutoClean Orphan Files

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 55 of 55 |
| **Predecessor** | 004-runtime-root-memory-cleanup-followup-fixes |
| **Successor** | None |
| **Handoff Criteria** | autoClean+cleanFiles run drops orphan_files count to 0 (or < 5) and memory_health.consistency.status === 'healthy' |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 55 of the 026/000 release-cleanup track. Closes one of the four follow-ons left open by packet 054.

**Scope Boundary**: Library-level enhancement to `verify_integrity` plus the wrapper, handler, and schema layers that expose it. NOT a one-shot SQL cleanup script — the goal is a repeatable runtime path the autoRepair flow can call whenever orphan-file drift accumulates.

**Dependencies**:
- Packet 054 (committed at 88051ebaa) for the upstream orphan-files diagnosis in `scratch/fts-vec-diagnosis.md`.
- `delete_memory_from_database` helper (already used for orphan_chunks cleanup) for ancillary-row cleanup.

**Deliverables**:
- `cleanFiles?: boolean` option on `verify_integrity` (default false).
- `cleaned.files` field added to the return shape.
- `memory_health` schema accepts `cleanFiles?: boolean` and threads it through to `verify_integrity` when `autoRepair && confirmed`.
- Unit tests covering the new path.
- Successful run: orphanedFiles count drops to 0 (or near 0).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`verify_integrity({ autoClean: true })` only auto-cleans orphan **vectors** and orphan **chunks** — it never deletes memory_index rows whose `file_path` is missing on disk. Packet 054 diagnosis (`scratch/fts-vec-diagnosis.md`) showed ~564 such orphan rows remaining after the deprecated-tier purge, and they surface as a permanent `memory_health.consistency.degraded` signal. There is no runtime self-heal path; the only fix is a one-shot SQL DELETE.

### Purpose
Add a `cleanFiles` opt-in to the existing autoClean flow so the runtime can reliably drop orphan-file rows whenever they accumulate — and re-establish `memory_health.consistency.status === 'healthy'` as a green-baseline signal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `verify_integrity` with `cleanFiles?: boolean` and a new `cleaned.files` count.
- Wire `cleanFiles` through `vector-index-store.ts` (Vectorindex class wrapper) so its TS surface stays consistent.
- Add `cleanFiles` to `memoryHealthSchema` and the autoRepair branch in `memory-crud-health.ts`.
- Use `delete_memory_from_database` (NOT raw DELETE) so lineage/projections/graph residue/vec_memories rows are also cleaned.
- Record per-deletion history (`mcp:integrity_check_files`) for auditability.
- Unit tests: orphan files cleaned, no-orphan no-op, `delete_memory_from_database` failure path, `cleanFiles` with `autoClean: false` is a no-op.

### Out of Scope
- Mass purge of unrelated orphan rows beyond the file-path-missing class.
- Rewriting `mismatchedIds` slice cap of 50 — that is a reporting-shape concern, separately tracked.
- VACUUM (separate decision; rollback checkpoint must remain intact until explicit user OK).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | Add `cleanFiles` option + cleanup loop in `verify_integrity` |
| `mcp_server/lib/search/vector-index-store.ts` | Modify | Update `verifyIntegrity` wrapper option type + return type |
| `mcp_server/lib/search/vector-index.ts` | (no change) | Re-exports flow through automatically |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Read `cleanFiles` arg, validate, pass into autoRepair `verify_integrity` call, surface in repair.actions/hints |
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Add `cleanFiles: z.boolean().optional()` to `memoryHealthSchema` and `'cleanFiles'` to allowed-keys |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Modify | Add cleanFiles test cases |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Modify | Add memory_health autoRepair+cleanFiles integration test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `verify_integrity` accepts `cleanFiles?: boolean` (default false). When `cleanFiles && autoClean` and orphan_files exist, each is deleted via `delete_memory_from_database`; deletion count returned in `cleaned.files`; per-row history recorded as `mcp:integrity_check_files`; `orphanedFiles` array in return shape reflects post-clean state | Unit test asserts: pre-state has N orphan files, post `verify_integrity({ autoClean: true, cleanFiles: true })` returns `cleaned.files === N` and `orphanedFiles.length === 0`; `isConsistent === true` when nothing else is wrong. |
| REQ-002 | `memoryHealthSchema` accepts `cleanFiles?: boolean`; handler validates type, requires `autoRepair && confirmed` to honor it, threads it through to `verify_integrity` call at line 558; surfaces cleanedFiles count in `repair.actions` (`orphan_files_cleaned:N`) and a hint | Schema validation rejects non-boolean cleanFiles; integration test confirms autoRepair+confirmed+cleanFiles end-to-end via memory_health handler; repair.actions contains `orphan_files_cleaned:N` when N > 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Build dist + run vitest suite; advisor's pre-existing 37 failures (out of scope, tracked by sibling test-fixture sweep packet) MUST NOT regress count | `npm run build` exits 0; vitest output shows the new tests passing; total advisor failure count <= 37 |
| REQ-004 | Run `verify_integrity({ autoClean: true, cleanFiles: true })` once against the live DB after MCP child restart; confirm orphanedFiles drops to 0 (or <5) and `memory_health.consistency.status === 'healthy'` | Captured before/after snapshots in `scratch/cleanup-results.md`; memoryCount expected to drop by ~564 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verify_integrity({ autoClean: true, cleanFiles: true })` is a callable, tested code path with `cleaned.files` reporting actual deletion count.
- **SC-002**: `memory_health` autoRepair flow honors `cleanFiles` and reports it in `repair.actions`.
- **SC-003**: Live-DB run drops orphanedFiles to 0 (or <5) and flips `consistency.status` to 'healthy'.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0 after implementation-summary is filled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting an orphan-file row also removes a memory the user wanted preserved (file moved, not deleted) | Med | `cleanFiles` is opt-in (default false) and gated behind `autoRepair && confirmed`; the existing checkpoint id=1 (pre-bulk-delete-deprecated-2026-05-08T09-12-20) still provides rollback for the preceding 054 purge; recommend `checkpoint_create` before running this against production data |
| Risk | `delete_memory_from_database` partial failure leaves graph/lineage in inconsistent state | Low | Use the same helper that already cleans orphan_chunks (line 1387); record warnings via `repair.warnings`; isConsistent reflects actual post-clean state |
| Dependency | `delete_memory_from_database` helper already handles vec_memories/lineage/projections cleanup | If helper changes shape, both orphan_chunks and orphan_files paths break together | Same module already imported; no new dep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we emit a structured event for each orphan-file deletion, or just per-batch? (Decision: per-row history via `recordHistory(id, 'DELETE', ..., 'mcp:integrity_check_files', spec_folder)`, mirroring orphan_chunks; no separate event stream needed.)
<!-- /ANCHOR:questions -->

---
