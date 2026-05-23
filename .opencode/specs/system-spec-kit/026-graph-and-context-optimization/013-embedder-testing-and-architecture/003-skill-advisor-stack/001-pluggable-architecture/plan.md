---
title: "Plan: 022/001 pluggable architecture"
description: "Phases for the skill-advisor embedder adapter + registry"
trigger_phrases: ["022/001 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files: ["mcp_server/lib/embedders/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture-plan"
      parent_session_id: "022-001-pluggable-architecture"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/001 pluggable architecture

<!-- ANCHOR:summary -->
## 1. SUMMARY

Copy-adapt 016's `mcp_server/lib/embedders/` from mk-spec-memory to skill-advisor. Migrate skill-graph.sqlite to add `vec_metadata` + `vec_<dim>` tables. Wire `semantic-shadow.ts` to use the new registry.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Interface | EmbedderAdapter matches 016 shape (test by structural type-check) |
| Registry | MANIFESTS has ≥ 4 entries with jina-v3 as default |
| DB | Migration is idempotent + adds vec_metadata + vec_<dim> tables |
| Wiring | semantic-shadow.ts reads active embedder from registry, not factory.ts |
| Test | Vitest passes for new + existing tests |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
.opencode/skills/system-skill-advisor/mcp_server/lib/
  embedders/                       (NEW — mirrors 016 mk-spec-memory)
    adapter.ts                     EmbedderAdapter interface
    registry.ts                    MANIFESTS + getAdapter(name)
    schema.ts                      vec_metadata + vec_<dim> mgmt
    adapters/
      ollama.ts                    OllamaAdapter (HTTP /api/embed)
      llama-cpp-baseline.ts        Gemma fallback
    types.ts                       Backend kind + manifest
  scorer/lanes/
    semantic-shadow.ts             UPDATED — read active embedder via registry
  skill-graph/
    skill-graph-db.ts              UPDATED — add migration for vec_metadata
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Copy + adapt 016 embedder code
- Read `system-spec-kit/mcp_server/lib/embedders/{adapter,registry,schema,types}.ts`
- Copy with minimal adaptation to skill-advisor's path conventions

### Phase 2: Schema migration
- Add `vec_metadata` table to skill-graph.sqlite migration
- Add `ensureVecTableForDim` helper
- Idempotent — safe to re-run

### Phase 3: Wire semantic-shadow.ts
- Replace `createProvider()` calls with `getAdapter(activeEmbedder)`
- Preserve fallback path (if vec_metadata empty → use baseline)

### Phase 4: Tests
- Unit: adapter dispatch + dim-table creation + active pointer roundtrip
- Existing semantic-shadow-cosine.vitest.ts regression

### Phase 5: Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: new tests in `tests/embedders/` covering interface, registry, schema
- Integration: existing `semantic-shadow-cosine.vitest.ts` + `lane-weight-sweep.vitest.ts` pass
- Schema migration: snapshot before/after skill-graph.sqlite layout
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 016 mk-spec-memory source (reference)
- skill-graph.sqlite (mutation — operator must close daemon first)
- Vitest framework
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Schema migration corrupts skill-graph | Restore from backup; revert migration logic |
| semantic-shadow regression | Wire fallback to legacy factory.ts via env var SKILL_ADVISOR_LEGACY_EMBEDDER=true |
| Adapter dispatch hangs | Revert wiring; keep legacy cascade as default |
<!-- /ANCHOR:rollback -->
