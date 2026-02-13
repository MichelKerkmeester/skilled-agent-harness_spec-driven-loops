# Phase 6: Convert scripts/

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-F
> **Tasks:** T140–T175
> **Milestone:** M7 (Scripts Done)
> **SYNC Gate:** SYNC-007
> **Depends On:** Phase 3 (SYNC-004) — can run in parallel with Phases 4-5
> **Session:** 3

---

## Goal

Convert CLI scripts and their modules to TypeScript. Can start after Phase 3 (shared/ complete) since scripts depend primarily on shared/.

## Scope

**Target:** `system-spec-kit/scripts/` — 42 source files, ~9,096 lines

### Sub-Layers (dependency-aware order)

| Layer | Directory | Files | Lines |
|-------|-----------|------:|------:|
| 6a | `utils/` | 9+1 | 1,060 |
| 6b | `lib/` | 10 | 2,368 |
| 6c | `renderers/` | 2 | 224 |
| 6d | `loaders/` | 2 | 173 |
| 6e | `extractors/` | 9 | 2,903 |
| 6f | `spec-folder/` | 4 | 840 |
| 6g | `core/` | 3 | 778 |
| 6h | `memory/` | 3 | 750 |

### Parallelization

- 6a–6d can be converted in parallel (independent leaf modules)
- 6e–6f depend on 6a–6b
- 6g depends on all above
- 6h is the entry point layer (depends on everything)

### Top Complex Files

1. `extractors/collect-session-data.js` — 757 lines (session data assembler)
2. `lib/semantic-summarizer.js` — 591 lines (7 message types)
3. `core/workflow.js` — 550 lines (12-step pipeline orchestration)
4. `spec-folder/alignment-validator.js` — 451 lines (content alignment scoring)
5. `extractors/opencode-capture.js` — 443 lines (session storage reader)

### Special Considerations

- `core/workflow.js` has a lazy `require()` for `mcp_server/lib/search/vector-index` — convert to static import
- Re-export proxies (`lib/embeddings.js`, `lib/trigger-extractor.js`, `lib/retry-manager.js`) must be updated
- Backward-compatible snake_case aliases (from spec 090) must be preserved in exports

## Exit Criteria

- [ ] All 42 files compile with `tsc --noEmit` (zero errors)
- [ ] CLI scripts functional: `node scripts/memory/generate-context.js` produces valid output
- [ ] All re-export proxies updated and working
- [ ] Snake_case backward-compatible aliases preserved
- [ ] Existing tests pass against compiled output
- [ ] SYNC-007 gate passed
