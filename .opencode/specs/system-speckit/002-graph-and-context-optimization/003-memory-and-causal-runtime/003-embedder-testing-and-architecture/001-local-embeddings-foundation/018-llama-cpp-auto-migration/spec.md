---
title: "Feature Specification: 018 llama-cpp auto-migration (SUPERSEDED)"
description: "Historical llama-cpp auto-migration packet. SUPERSEDED by the Ollama -> hf-local Nomic cascade work under the local embeddings foundation arc."
trigger_phrases:
  - "018 llama cpp auto migration"
  - "MEMORY_AUTO_MIGRATE_HF_TO_LLAMA"
  - "AUTO_MIGRATION_START"
  - "hf-local to llama-cpp startup migration"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration"
    last_updated_at: "2026-05-13T12:01:28Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed auto-migration implementation and verification"
    next_safe_action: "Treat 014 setup-A as concluded"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "scratch/pre-flight-notes.md"
      - "scratch/test-output.txt"
    session_dedup:
      fingerprint: "sha256:0180180180180180180180180180180180180180180180180180180180180180"
      session_id: "018-llama-cpp-auto-migration-2026-05-13"
      parent_session_id: "018-llama-cpp-auto-migration-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered this packet."
      - "Use subagents? -> Forbidden; SPAWN_AGENT_USED=no."
      - "Opt-out behavior? -> MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false preserves the pre-018 warning."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: 018 llama-cpp auto-migration (SUPERSEDED)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | SUPERSEDED (by 001-local-embeddings-foundation's Ollama cascade work) |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 18 |
| **Outcome** | Warn-only migration upgraded to synchronous auto-migrate, validate, delete, and fallback |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the llama-cpp provider became the local default candidate, startup only warned when a populated `hf-local` sqlite existed while the active profile pointed at the llama-cpp store. That left operators with a manual migration step and a stale source sqlite that could keep being rediscovered.

### Purpose
Historical purpose before supersession: make Memory MCP startup self-healing for upgrades: detect the largest populated `context-index__hf-local__*.sqlite`, migrate it into the llama-cpp profile store, validate row count and sample vectors, delete the source sqlite plus `-shm` and `-wal` companions on success, and fall back to `hf-local` for the current run on any migration failure.
### Supersession note
This phase is historical. The live local-first path is now Ollama -> hf-local Nomic; llama-cpp is not the active auto-migration target. Do not treat this packet as current implementation guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refactor `migrate-embeddings-to-llama-cpp.ts` into exported `runMigration()` plus CLI shim.
- Replace `warnIfMigrationPending()` with exported `runAutoMigrationIfNeeded()`.
- Wire the migration gate into Memory MCP startup before `vectorIndex.initializeDb()`.
- Preserve grep-compatible `MIGRATION_PENDING` text when `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false`.
- Add targeted Vitest coverage for no source, opt-out, success/delete, validation failure, and already migrated target.
- Document auto-migration in `.env.example`, MCP README, and runtime config notes.

### Out of Scope
- New embedding providers or new dependencies.
- CocoIndex changes.
- Git operations.
- Direct deletion of live sqlite files by Codex outside the runtime migration code path.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` | Modify | Exported `runMigration()`, status union, configurable logger, no-op path |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Added auto-migration detection, opt-out, deletion, marker, fallback envelope |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Awaited migration before DB initialization and switched to `hf-local` on failure |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts` | Add | Five scenario coverage for startup auto-migration |
| `.env.example` and runtime configs | Modify | Documented destructive auto-migration and opt-out |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Added migration section |
| `scratch/` | Add | Pre-flight notes and test output evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001** Auto-migration runs only when the active resolved provider is `llama-cpp`.
- **REQ-002** `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` disables migration and emits the exact pre-018 warning text.
- **REQ-003** Startup migrates only when a populated hf-local source exists and the target is missing or behind.
- **REQ-004** Successful migration deletes source sqlite plus `-shm` and `-wal` companions.
- **REQ-005** Successful migration writes `.auto-migration-complete.json`.
- **REQ-006** Migration errors or validation mismatches preserve the source and return fallback provider `hf-local`.
- **REQ-007** Explicit `EMBEDDINGS_PROVIDER=hf-local` remains a valid opt-in to the old provider.

### Non-Functional Requirements
- No sub-agents.
- No archival files.
- No new dependencies.
- MCP requests cannot land before the synchronous startup migration finishes or fails.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. `runMigration()` is exported and the CLI help path still works.
2. `runAutoMigrationIfNeeded()` returns skipped, completed, or failed envelopes.
3. Startup awaits auto-migration before vector DB initialization.
4. Five auto-migration Vitest scenarios pass.
5. Docs and runtime notes describe destructive migration plus opt-out.
6. Packet strict validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Successful path deletes source sqlite | Destructive data loss if validation is wrong | Require source/target row equality and zero sample mismatches before deletion |
| Risk | Migration fails during daemon startup | Memory search could point at empty target | Failure envelope switches this run to `hf-local` |
| Risk | Target already populated | Re-embedding would waste startup time | Skip when target rows and llama-cpp model rows meet source count |
| Dependency | `node-llama-cpp` and Q8_0 GGUF model | Required for llama-cpp default | Availability probe falls back to hf-local when missing |
| Dependency | `sqlite3` CLI | Used for row-count detection | Existing startup warning path already depended on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

| Area | Complexity | Notes |
|------|------------|-------|
| Migration refactor | Medium | Extracted reusable function without breaking CLI behavior |
| Startup wiring | Medium | Must happen after provider resolution and before DB initialization |
| Destructive cleanup | High | Deletes source only after validation and marker write |
| Tests | Medium | Uses temp sqlite fixtures and injected runner to avoid real inference |
| Docs | Low | Runtime note cascade plus README/env updates |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Target | Verification |
|-------------|--------|--------------|
| Fresh clone latency | No source returns quickly | Test no-source skip path |
| Upgrade integrity | Source rows equal target rows | Auto-migration success validation |
| Failure safety | Source preserved | Validation-failure test |
| Observability | Structured log lines | `AUTO_MIGRATION_START`, `AUTO_MIGRATION_COMPLETE`, `AUTO_MIGRATION_FAILED`, `AUTO_MIGRATION_SKIP` |
| Opt-out compatibility | Old warning text preserved | Opt-out test asserts exact string |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Node 25 cannot `require('node-llama-cpp')` because the package is ESM/TLA; ESM `import()` sanity check passed.
- The source path in the contract referenced `mcp_server/src/context-server.ts`, but this repository's actual source entrypoint is `mcp_server/context-server.ts`.
- A stale helper could resolve `shared/mcp_server/database`; package-root detection now requires root markers so startup uses the real Memory MCP database directory.
- The migration script now handles both source and built `dist/` execution paths when deriving the skill root.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No packet-blocking questions remain.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- Parent packet: `../spec.md`
- Predecessor: `../017-llama-cpp-default-flip/implementation-summary.md`
- Evidence: `scratch/pre-flight-notes.md`, `scratch/test-output.txt`
<!-- /ANCHOR:related-docs -->
