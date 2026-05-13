---
title: "Implementation Plan: 017 llama-cpp default flip"
description: "Plan and actual execution path for migration, default gating, runtime cascade, scale validation, rollback, and packet close-out."
trigger_phrases:
  - "017 default flip plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip"
    last_updated_at: "2026-05-13T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed plan and restored hf-local default after Phase 4 quality gate"
    next_safe_action: "Use explicit llama-cpp only for experiments"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1170170170170170170170170170170170170170170170170170170170170170"
      session_id: "017-llama-cpp-default-flip-2026-05-13"
      parent_session_id: "017-llama-cpp-default-flip-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: 017 llama-cpp default flip

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript, Node ESM, SQLite, sqlite-vec, Markdown |
| **Source Provider** | `hf-local` / `onnx-community/embeddinggemma-300m-ONNX` / 768 / q8 |
| **Candidate Provider** | `llama-cpp` / `unsloth/embeddinggemma-300m-GGUF` / 768 / q8 filename profile |
| **Migration Result** | 2488 source rows -> 2488 target rows, 0 mismatches, 130.117s |
| **Gate Result** | MILD_DIVERGENCE; default restored to hf-local |

The plan was to flip auto mode to llama-cpp only if migration and larger-scale quality evidence held. Migration and speed evidence passed; the 1k retrieval probe did not.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered by orchestrator.
- [x] Allowed write scope supplied explicitly.
- [x] Existing factory and provider logic read before edits.
- [x] Existing hf-local store inventoried.

### Definition of Done
- [x] Installer and migration helper created.
- [x] Live migration completed with zero mismatches.
- [x] Runtime configs documented the final state.
- [x] 1k retrieval probe and final benchmark executed.
- [x] Probe verdict controlled default decision.
- [x] MCP-path smoke executed against explicit llama-cpp.
- [x] Packet docs and parent close-out completed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Provider selection remains centralized in `shared/embeddings/factory.ts`. `llama-cpp` remains a supported provider, but after Phase 4 the auto fallback path is:

1. explicit `EMBEDDINGS_PROVIDER`, if recognized
2. `VOYAGE_API_KEY`
3. `OPENAI_API_KEY`
4. `hf-local`

The migrated llama-cpp store is isolated by profile slug and can be used only through explicit `EMBEDDINGS_PROVIDER=llama-cpp`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Status | Evidence |
|-------|--------|----------|
| Phase 0: Pre-flight | Complete | `scratch/pre-flight-notes.md`, `scratch/migration-targets.md` |
| Phase 1: Default flip + fallback | Complete with rollback | `factory.ts`, runtime notes |
| Phase 2: Migration helper | Complete | `migrate-embeddings-to-llama-cpp.ts`, `migration-run-results.json` |
| Phase 3: Runtime config cascade | Complete | Codex, Claude, Gemini, OpenCode notes updated to final hf-local default |
| Phase 4: Validation | Complete, quality gate failed | `probe-1k-results.json`, `bench-final-results.json`, `end-to-end-smoke.md` |
| Phase 5: Docs + validation | Complete | packet docs and strict validator |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Result |
|------|---------|--------|
| Shared build | `cd .opencode/skills/system-spec-kit/shared && npm run build` | exit 0 |
| MCP build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | exit 0 |
| Migration | `npx tsx .opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` | 2488 rows, 0 mismatches |
| Probe | `npx tsx .../scratch/probe-retrieval-quality-1k.ts` | MILD_DIVERGENCE |
| Bench | `npx tsx .../scratch/bench-final.ts --provider=<provider> --iterations=1000` | hf p50 35.956375ms; llama p50 6.027083ms |
| MCP smoke | `npx tsx .../scratch/e2e-smoke-mcp.ts` | PASS |
| Spec validation | `bash .../validate.sh <packet> --strict` | final run exits 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `node-llama-cpp@3.17.1` under the MCP server package.
- GGUF model `embeddinggemma-300M-Q8_0.gguf` in the Hugging Face cache.
- `sqlite3` CLI for migration-pending row counts.
- `better-sqlite3` and `sqlite-vec` from the MCP server dependencies.
- Existing hf-local sqlite as migration source.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback has been applied. Auto mode now resolves to hf-local after cloud keys. To discard explicit llama-cpp experiment data, remove the llama-cpp sqlite manually; the source hf-local sqlite remains untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Notes |
|-------|------------|-------|
| Phase 1 | Phase 0 | Factory changes needed provider/profile facts |
| Phase 2 | Phase 1 | Migration target slug came from provider profile |
| Phase 3 | Phase 1 and Phase 4 | Final config notes reflect rollback, not the initial attempted flip |
| Phase 4 | Phase 2 | Probe and smoke needed migrated store |
| Phase 5 | Phase 4 | Docs use final validation numbers |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Area | Actual Notes |
|------|--------------|
| Factory/provider | Slug and explicit provider path work; auto default restored |
| Migration | Long-text and rowid fixes required before final clean run |
| Validation | Probe took ~178 seconds across both providers |
| Documentation | Final docs record the failed flip honestly |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Risk | Rollback Action |
|------|-----------------|
| Rank drift | Keep auto mode on hf-local |
| Wrong sqlite slug | Remove stray `q8_0` sqlite; rebuild shared and MCP dist |
| Native backend unavailable | Use `EMBEDDINGS_PROVIDER=hf-local` or default auto |
| Manual opt-in misbehaves | Remove explicit llama-cpp env and keep migrated store for inspection |
<!-- /ANCHOR:enhanced-rollback -->
