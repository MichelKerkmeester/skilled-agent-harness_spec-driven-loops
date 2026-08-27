# Iteration 10: Final verification sweep — missed surfaces + assertions finalization

## Focus
Sweep the remaining repo surfaces not covered in Iter 1-9: advisor keyword map, Zod schemas, configs, stress-test, api layer, budget allocator, session-lifecycle docs, other skills' links, plugins, dot-runtime dirs. Close out the inventory.

## Findings

### F10.1 system-skill-advisor keyword map (LIVE routing surface)
- `skill_advisor.py:2001` — `"constitutional memory": [("system-spec-kit", 1.7)]` — the advisor routes the phrase "constitutional memory" to system-spec-kit. After deprecation the phrase should route to nothing (or the entry removed). Class: TODO. [SOURCE: file:skill_advisor.py:2001]

### F10.2 Zod validation schemas (second schema surface)
- `schemas/tool-input-schemas.ts:124` — `'constitutional'` inside a tier Zod enum; `:179,202,513` — `includeConstitutional: z.boolean().optional()`; `:638-666` — ALLOWED parameter lists for memory_context/memory_search/memory_index_scan include `includeConstitutional`. These are the ALLOWED_PARAMETERS gate (unknown params rejected elsewhere?) — must drop. Class: TODO. [SOURCE: file:schemas/tool-input-schemas.ts:124,179,202,513,638,639,666]

### F10.3 Channel weights config
- `configs/search-weights.json:17` — `"constitutional": 2.0` channel weight in the search-weights config. Class: TODO (remove channel). [SOURCE: file:configs/search-weights.json:17]

### F10.4 api layer + budget allocator
- `api/index.ts:94` — exports `isIndexableConstitutionalMemoryPath` (from lib/utils/index-scope.js); `api/indexing.ts:29,117,131` — indexing API includeConstitutional. Class: TODO. [SOURCE: file:api/index.ts:94, file:api/indexing.ts:29,117,131]
- `shared/budget-allocator.d.ts:20,26` — `constitutional: 700` budget source in the token budget allocator (auto-surface budget); source .ts not at that path — implementation under lib/ (tests: budget-allocator.vitest.ts:4). Class: TODO. [SOURCE: file:shared/budget-allocator.d.ts:20,26]

### F10.5 session-lifecycle doc
- `.opencode/hooks/session-lifecycle/README.md:42` — PreCompact 3-source merge "(constitutional memories + active files + session-state attention signals)" + "auto-surfaces triggered/constitutional memories". Class: TODO (rewrite). [SOURCE: file:.opencode/hooks/session-lifecycle/README.md:42]

### F10.6 .spec-gate-state links (KEEP — gate-enforcement stays)
- `.opencode/skills/.spec-gate-state/README.md:21,109` — links to `../system-spec-kit/constitutional/gate-enforcement.md`. Per Iter 6 H3, gate-enforcement is a KEEP-AS-DOC (unindexed reference doc) → links remain valid. Class: KEEP. [SOURCE: file:.spec-gate-state/README.md:21,109]

### F10.7 stress-test
- `stress-test/memory/gate-d-benchmark-memory-search.vitest.ts:57,72` — `constitutionalInjected` metadata fixtures; `stress-test/durability/embedder-degrade-recall-flood-stress.vitest.ts:31,86` — "constitutional guard lexical fallback" + includeConstitutional:false. Class: TODO (update fixtures/asserts). [SOURCE: file:stress-test/...:57,72,31,86]

### F10.8 Other skills' links (cli-external-orchestration benchmarks)
- `cli-claude-code/benchmark/*` (README + reports + source) reference `goal-prompting-runtime-specific.md` — benchmark history: KEEP (except `manual-testing-playbook/goal-hook/goal-hook.md` which may need re-verification — goal-prompting system STAYS, so likely KEEP). Class: KEEP (benchmarks) / TODO (goal-hook playbook verify — deferred to implementation). [SOURCE: grep, Iter 10]

### F10.9 Dot-runtime dirs + plugins
- `.pi/`, `.codex/`, `.cursor/rules` — 0 constitutional matches (clean). `plugins/tests/system-skill-advisor.test.cjs` — test file (tail). Class: DONE (clean) / TODO (test tail). [SOURCE: grep, Iter 10]

### F10.10 Post-deprecation assertion set — FINAL (consolidated from Iter 3 + F9)
1. `grep -rn "includeConstitutional" mcp-server/{lib,handlers,tools,api,cli.ts,tool-schemas.ts,schemas}` → 0 matches (except migration/history notes).
2. `grep -rn "importance_tier.*constitutional\|'constitutional'" mcp-server/{lib,handlers,formatters}` → 0 production matches.
3. Tests: gate-d-regression-constitutional-memory + constitutional-filtering + retrieval-directives deleted; token-budget-constitutional-sync rewritten without pin; scoring-gaps loses the two sections; memory-crud-update-constitutional-guard rewritten without tier guard; memory-learn-command-docs inverted; stage1 tests no longer pass includeConstitutional.
4. `sqlite3 -readonly context-index.sqlite "SELECT COUNT(*) FROM memory_index WHERE importance_tier='constitutional'"` → 0 after migration.
5. A live `memory_search` (no flags) returns 0 rows with `isConstitutional`/`constitutionalCount` absent from envelope; summary has no "(M constitutional)".
6. `memory_index_scan` reports no constitutional stats; the folder is not scanned (or scanned only for the kept plain docs without indexing).
7. The 18 root-doc links resolve (Option 1: same folder as unindexed docs) or point at new anchors (Option 2).
8. `render.ts` directive capsule unchanged (enforcement intact); `renderAdvisorFallbackDirective` docstring no longer says "constitutional".
9. DB learned_triggers still 0 (untouched); continuity + memory MCP + native-memory ban operational (memory-system-spec-kit-only doc kept).
10. Dist rebuilt: `grep -rn "includeConstitutional" dist/` → only stale-free; daemon restarted; spec-memory.cjs freshness check passes (no exit 69).

## Sources Consulted
- skill_advisor.py, tool-input-schemas.ts, search-weights.json, api/, shared/budget-allocator.d.ts, session-lifecycle/README.md, .spec-gate-state/README.md, stress-test/, cli-external-orchestration benchmarks, .pi/.codex/.cursor

## Assessment
- newInfoRatio: 0.6 — 6 new surface groups found in the tail; inventory now complete (52 + 9 = 61 rows).
- Novelty justification: final sweep found advisor keyword map, Zod schema, search-weights config, budget allocator, session-lifecycle doc — all previously unmapped.
- Confidence: high on grep-verified lines; budget-allocator source location inferred (d.ts evidence only).

## Reflection
- Worked: targeted sweeps by directory tree complete the inventory without spec-history noise.
- Ruled out: deeper d.ts source chase for budget allocator (implementation sweep will locate it; d.ts is sufficient evidence of the surface).

## Recommended Next Focus
phase_synthesis: research.md — final deduped inventory, ranked checklist, retarget set, assertions, consumers, dist/daemon note.
