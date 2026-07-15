---
title: "Verification Checklist: 018 llama-cpp auto-migration"
description: "Verification evidence for startup auto-migration, destructive cleanup safety, fallback, docs, tests, and scope discipline."
trigger_phrases:
  - "018 llama cpp checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration"
    last_updated_at: "2026-05-13T12:01:28Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded verification checklist"
    next_safe_action: "Use final validation evidence"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3180180180180180180180180180180180180180180180180180180180180180"
      session_id: "018-llama-cpp-auto-migration-2026-05-13"
      parent_session_id: "018-llama-cpp-auto-migration-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 018 llama-cpp auto-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass before close |
| **[P1]** | Required evidence | Must complete or document |
| **[P2]** | Optional evidence | Can defer if justified |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Critical files read before edits.
  - **Evidence**: `scratch/pre-flight-notes.md`.
- [x] CHK-002 [P0] Existing warning body captured.
  - **Evidence**: quoted `warnIfMigrationPending()` body in `scratch/pre-flight-notes.md`.
- [x] CHK-003 [P1] llama-cpp runtime sanity checked.
  - **Evidence**: ESM import printed `ok`; GGUF model exists at expected path.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Migration script exports programmatic API.
  - **Evidence**: `runMigration()` export.
- [x] CHK-011 [P0] CLI shim remains intact.
  - **Evidence**: `npx tsx migrate-embeddings-to-llama-cpp.ts --help` prints usage.
- [x] CHK-012 [P0] Factory owns startup auto-migration envelope.
  - **Evidence**: `runAutoMigrationIfNeeded()` export.
- [x] CHK-013 [P0] Failure path returns `fallbackProvider: "hf-local"`.
  - **Evidence**: validation-failure test.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:migration -->
## Migration

- [x] CHK-020 [P0] Source deletion is gated by validation.
  - **Evidence**: source/target row equality and mismatches check before `rmSync`.
- [x] CHK-021 [P0] Source companions are deleted on success.
  - **Evidence**: success test checks sqlite, `-shm`, and `-wal` removal.
- [x] CHK-022 [P0] Marker file written on success.
  - **Evidence**: success test checks `.auto-migration-complete.json`.
- [x] CHK-023 [P1] Live startup skip path works.
  - **Evidence**: live check returned `target up to date; already migrated`.
<!-- /ANCHOR:migration -->

---

<!-- ANCHOR:quality-gate -->
## Quality Gate

- [x] CHK-030 [P0] No-source skip covered.
  - **Evidence**: Vitest scenario 1.
- [x] CHK-031 [P0] Opt-out warning compatibility covered.
  - **Evidence**: Vitest scenario 2 asserts exact old text.
- [x] CHK-032 [P0] Success/delete path covered.
  - **Evidence**: Vitest scenario 3.
- [x] CHK-033 [P0] Validation failure fallback covered.
  - **Evidence**: Vitest scenario 4.
- [x] CHK-034 [P0] Already migrated target skip covered.
  - **Evidence**: Vitest scenario 5.
<!-- /ANCHOR:quality-gate -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-035 [P0] Shared build passes.
  - **Evidence**: `cd .opencode/skills/system-spec-kit/shared && npm run build`.
- [x] CHK-036 [P0] Scripts build passes.
  - **Evidence**: `cd .opencode/skills/system-spec-kit/scripts && npm run build`.
- [x] CHK-037 [P0] MCP build passes.
  - **Evidence**: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`.
- [x] CHK-038 [P0] Targeted Vitest passes.
  - **Evidence**: `scratch/test-output.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-039 [P0] Startup hook is before vector DB init.
  - **Evidence**: hook is placed before `vectorIndex.initializeDb()`.
- [x] CHK-040 [P0] Fallback uses existing provider override path.
  - **Evidence**: failed migration sets `process.env.EMBEDDINGS_PROVIDER = "hf-local"`.
- [x] CHK-041 [P1] Target up-to-date check includes llama-cpp model rows.
  - **Evidence**: factory checks total rows and `embedding_model`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:benchmark -->
## Benchmark

- [x] CHK-042 [P1] Fixture migration metrics recorded.
  - **Evidence**: 5 source rows, 5 target rows, 0.031s wall clock in smoke scenario.
- [x] CHK-043 [P1] Live startup skip metrics recorded.
  - **Evidence**: 2488 llama-cpp target rows already present.
<!-- /ANCHOR:benchmark -->

---

<!-- ANCHOR:runtime -->
## Runtime And Smoke

- [x] CHK-050 [P0] Runtime skip smoke executes without deletion.
  - **Evidence**: live startup check returned skipped target up to date.
- [x] CHK-051 [P1] Optional destructive smoke ran on temp sqlite fixture.
  - **Evidence**: `scratch/end-to-end-smoke.log` captures `AUTO_MIGRATION_START` and `AUTO_MIGRATION_COMPLETE`.
<!-- /ANCHOR:runtime -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-060 [P0] No sub-agents used.
  - **Evidence**: `SPAWN_AGENT_USED=no`.
- [x] CHK-061 [P0] No git operations performed.
  - **Evidence**: no `git add`, `git commit`, or `git push`.
- [x] CHK-062 [P0] No archival files created.
  - **Evidence**: no `.bak`, `_deprecated`, or commented-out archival changes.
- [x] CHK-063 [P0] No direct live sqlite deletion by Codex.
  - **Evidence**: live migration check skipped because target was up to date.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-064 [P0] `.env.example` documents auto-migration.
  - **Evidence**: auto-migration block with marker path and opt-out.
- [x] CHK-065 [P0] MCP README documents upgrade path.
  - **Evidence**: `Migration` section.
- [x] CHK-066 [P1] Runtime configs contain `_NOTE_AUTO_MIGRATION`.
  - **Evidence**: Codex, Claude, Gemini, OpenCode configs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P0] Required Level 2 docs present.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] CHK-071 [P0] Metadata files present.
  - **Evidence**: `description.json`, `graph-metadata.json`.
- [x] CHK-072 [P0] Strict validation exits 0.
  - **Evidence**: final strict validator run.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Startup auto-migration is implemented, covered, and documented. Failure preserves the source and falls back to `hf-local`; success deletes only after validation.
<!-- /ANCHOR:summary -->
