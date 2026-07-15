---
title: "Implementation Plan: 018 llama-cpp auto-migration"
description: "Plan and execution path for startup auto-migration, fallback, tests, docs, and packet close-out."
trigger_phrases:
  - "018 auto migration plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration"
    last_updated_at: "2026-05-13T12:01:28Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed implementation plan"
    next_safe_action: "Use implementation-summary.md for final evidence"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180180180180180180180180180180180180180180180180180180180180180"
      session_id: "018-llama-cpp-auto-migration-2026-05-13"
      parent_session_id: "018-llama-cpp-auto-migration-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: 018 llama-cpp auto-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript, Node ESM, SQLite, sqlite-vec, Vitest |
| **Source Provider** | `hf-local` / `onnx-community/embeddinggemma-300m-ONNX` / 768 / q8 |
| **Target Provider** | `llama-cpp` / `unsloth/embeddinggemma-300m-GGUF` / 768 / q8 |
| **Startup Result** | Live store skipped as already migrated: 2488 target rows |
| **Fixture Migration Result** | 4 source rows -> 4 target rows, 0 mismatches, 0.02s |

The plan upgraded startup from passive warning to active migration while retaining an explicit opt-out and a failure fallback to `hf-local`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered by orchestrator.
- [x] Allowed write scope supplied explicitly.
- [x] Existing migration script, factory, context server, and 017 evidence read before edits.
- [x] `node-llama-cpp` and GGUF model sanity checked.

### Definition of Done
- [x] Migration script exports `runMigration()`.
- [x] Factory exports `runAutoMigrationIfNeeded()`.
- [x] Context server awaits migration before DB initialization.
- [x] Five migration tests pass.
- [x] Docs and runtime notes updated.
- [x] Packet docs and parent metadata completed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Provider selection remains centralized in `shared/embeddings/factory.ts`. Startup now resolves an `EmbeddingProfile`, passes it to `runAutoMigrationIfNeeded()`, and only then initializes the vector database. The auto-migration function owns detection, runner import, validation, deletion, marker writing, and failure envelope generation. On failure, `context-server.ts` sets `EMBEDDINGS_PROVIDER=hf-local` for the current process and re-resolves startup config.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Status | Evidence |
|-------|--------|----------|
| Phase 0: Pre-flight | Complete | `scratch/pre-flight-notes.md` |
| Phase 1: Script refactor | Complete | `runMigration()` export and CLI shim |
| Phase 2: Factory refactor | Complete | `runAutoMigrationIfNeeded()` |
| Phase 3: Startup hook | Complete | `context-server.ts` hook before DB init |
| Phase 4: Tests | Complete | `scratch/test-output.txt` |
| Phase 5: Docs/config | Complete | `.env.example`, README, runtime notes |
| Phase 6: Packet close | Complete | packet docs and parent metadata |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Result |
|------|---------|--------|
| node-llama-cpp sanity | `node -e "import('node-llama-cpp').then(() => console.log('ok'))"` | exit 0 |
| Shared build | `cd .opencode/skills/system-spec-kit/shared && npm run build` | exit 0 |
| Scripts build | `cd .opencode/skills/system-spec-kit/scripts && npm run build` | exit 0 |
| MCP build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | exit 0 |
| Auto-migration tests | `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/embeddings-auto-migration.vitest.ts` | 5 passed |
| Runtime skip smoke | `runAutoMigrationIfNeeded(getStartupEmbeddingProfile())` | skipped: target up to date |
| Spec validation | `bash .../validate.sh <packet> --strict` | pending final gate |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `node-llama-cpp` under the MCP server package.
- GGUF model `embeddinggemma-300M-Q8_0.gguf` in the Hugging Face cache.
- `sqlite3` CLI for startup row-count detection.
- Existing migration script compiled through the scripts package for runtime import.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` to restore the old warning-plus-manual-script behavior. Set `EMBEDDINGS_PROVIDER=hf-local` to force the old provider for a server run. If migration fails, the source sqlite is preserved and the startup path applies the `hf-local` fallback automatically.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Notes |
|-------|------------|-------|
| Phase 1 | Phase 0 | Script refactor needed source/target facts |
| Phase 2 | Phase 1 | Factory calls exported migration runner |
| Phase 3 | Phase 2 | Startup hook depends on factory result envelope |
| Phase 4 | Phase 2 and 3 | Tests cover factory behavior and fallback contract |
| Phase 5 | Phase 4 | Docs reflect tested behavior |
| Phase 6 | Phase 5 | Packet docs use final evidence |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Area | Actual Notes |
|------|--------------|
| Script refactor | Added result status and no-op handling |
| Factory migration | Added detection, opt-out, deletion, marker, failure envelope |
| Startup wiring | Reused env override path for `hf-local` fallback |
| Tests | Used temp sqlite fixtures and injected runner to avoid inference |
| Documentation | Updated env, README, runtime notes, and packet docs |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Risk | Rollback Action |
|------|-----------------|
| Operator wants manual migration only | `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` |
| llama-cpp unavailable | Auto resolver falls back to `hf-local` |
| Migration validation fails | Source preserved; current run switches to `hf-local` |
| Target already migrated | Startup skips without reprocessing |
<!-- /ANCHOR:enhanced-rollback -->
