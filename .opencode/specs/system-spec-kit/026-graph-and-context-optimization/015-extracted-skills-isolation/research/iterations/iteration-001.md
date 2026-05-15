# Iteration 1: Complete TS Import Map for Both Extracted Skills

## Focus
Enumerate every TS import from system-spec-kit to system-code-graph and system-skill-advisor with file:line citations, including exact symbols imported.

## Findings

### 1.1 Non-test source files importing from system-code-graph (14 files, not 11 as spec.md estimated)

The actual count is 14 non-test source files (spec.md listed 11, missing: `session-bootstrap.ts`, `session-health.ts`, `index-scope.ts`).

| # | File | Line(s) | Imported Symbols | Source Module |
|---|------|---------|-----------------|---------------|
| 1 | `mcp_server/context-server.ts` | 88 | `* as graphDb` | `code-graph-db.js` |
|   | | 89 | `detectRuntime`, `type RuntimeInfo` | `runtime-detection.js` |
| 2 | `mcp_server/handlers/session-bootstrap.ts` | 32-34 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` |
| 3 | `mcp_server/handlers/session-health.ts` | 27-29 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` |
| 4 | `mcp_server/handlers/session-resume.ts` | 14 | `* as graphDb` | `code-graph-db.js` |
|   | | 15 | `getGraphFreshness`, `type GraphFreshness` | `ensure-ready.js` |
|   | | 34-36 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` |
| 5 | `mcp_server/handlers/memory-search.ts` | 27 | `getGraphReadinessSnapshot` | `ensure-ready.js` |
| 6 | `mcp_server/handlers/memory-context.ts` | 18 | `classifyQueryIntent` | `query-intent-classifier.js` |
|   | | 19 | `buildContext` | `code-graph-context.js` |
| 7 | `mcp_server/hooks/memory-surface.ts` | 9 | `* as graphDb` | `code-graph-db.js` |
| 8 | `mcp_server/hooks/claude/compact-inject.ts` | 18 | `mergeCompactBrief` | `compact-merger.js` |
|   | | 19 | `type MergeInput` | `compact-merger.js` |
| 9 | `mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | 6 | `buildStartupBrief` | `startup-brief.js` |
|   | | 8 | `type StartupBriefResult` | `startup-brief.js` |
| 10 | `mcp_server/lib/context/opencode-transport.ts` | 16 | `type CodeGraphOpsContract` (type-only) | `ops-hardening.js` |
| 11 | `mcp_server/lib/search/graph-readiness-mapper.ts` | 6 | `type GraphReadinessSnapshot` (type-only) | `ensure-ready.js` |
| 12 | `mcp_server/lib/session/session-snapshot.ts` | 10 | `getStats as getGraphStats` (value) | `code-graph-db.js` |
|   | | 11 | `getGraphFreshness` (value) | `ensure-ready.js` |
| 13 | `mcp_server/lib/session/context-metrics.ts` | 8 | `getStats as getGraphStats` (value) | `code-graph-db.js` |
| 14 | `mcp_server/lib/utils/index-scope.ts` | 6-9 | `resolveIndexScopePolicy`, `type IndexScopePolicy`, `type ResolveIndexScopePolicyInput` | `index-scope-policy.js` |

### 1.2 Symbols by decoupling category

**Pure type-only imports (can be resolved with Strategy A alone):**
- `CodeGraphOpsContract` (used in: opencode-transport.ts, session-bootstrap.ts, session-health.ts, session-resume.ts)
- `GraphFreshness` (used in: session-resume.ts)
- `GraphReadinessSnapshot` (used in: graph-readiness-mapper.ts)
- `MergeInput` (used in: compact-inject.ts)
- `StartupBriefResult` (used in: freshness-smoke-check.ts)
- `RuntimeInfo` (used in: context-server.ts)
- `IndexScopePolicy`, `ResolveIndexScopePolicyInput` (used in: index-scope.ts)

**Value imports requiring behavior (need Strategy B for runtime calls):**
- `* as graphDb` — 4 sites (context-server.ts, session-resume.ts, memory-surface.ts) — DB operations: init, close, getStats
- `detectRuntime` — runtime detection function (context-server.ts)
- `getGraphFreshness` — freshness check (session-resume.ts, session-snapshot.ts)
- `getGraphReadinessSnapshot` — readiness snapshot (memory-search.ts)
- `classifyQueryIntent` — query classification (memory-context.ts)
- `buildContext` — context building (memory-context.ts)
- `mergeCompactBrief` — compact merging (compact-inject.ts)
- `buildStartupBrief` — startup brief generation (freshness-smoke-check.ts)
- `buildCodeGraphOpsContract` — ops contract building (session-bootstrap.ts, session-health.ts, session-resume.ts)
- `getStats as getGraphStats` — graph statistics (session-snapshot.ts, context-metrics.ts)
- `resolveIndexScopePolicy` — scope policy resolution (index-scope.ts)

### 1.3 system-skill-advisor coupling: ZERO TS imports

**CRITICAL FINDING:** No `.ts` source file in `system-spec-kit/mcp_server/` imports from `system-skill-advisor/`. The grep for `from '.*system-skill-advisor` returned zero matches across all `.ts` files.

The skill-advisor coupling exists only through:
1. **tsconfig.json line 42**: `"../../system-skill-advisor/mcp_server/**/*.ts"` in `include` — makes tsc type-check advisor files as side effect. NO spec-kit source depends on these types.
2. **vitest.config.ts** (lines 20-21): Includes advisor test/bench files in spec-kit's vitest suite.
3. **vitest.stress.config.ts** (line 18, 20): Same stress-test includes.
4. **Hook proxy files** (`hooks/{claude,codex,gemini}/user-prompt-submit.ts`, `hooks/codex/prompt-wrapper.ts`): Reference `TARGET` string constants pointing to `.opencode/skills/system-skill-advisor/mcp_server/dist/...` — these are runtime path references, not TS imports.
5. **`plugins/spec-kit-skill-advisor.js`** (`.opencode/plugins/`): Separate plugin file, not a TS import. It calls `skill_advisor_status` via the OpenCode plugin bridge.

The tsconfig.json `include` for system-skill-advisor is functionally dead — the skill-advisor `**/*.ts` is being type-checked but nothing depends on it. **Removing this include line alone would not break `tsc --noEmit` in any spec-kit source file.**

### 1.4 tsconfig.json cross-skill includes (architectural blocker)

`mcp_server/tsconfig.json` lines 41-42:
```json
"../../system-code-graph/mcp_server/**/*.ts",      // ← BREAKS tsc if removed
"../../system-skill-advisor/mcp_server/**/*.ts"    // ← SAFE to remove
```

Removing the code-graph include breaks tsc because 14 source files have real type dependencies. Removing the skill-advisor include is safe (no import dependency).

### 1.5 Test files importing from system-code-graph (17+ files)

Test files with direct imports from system-code-graph (distinct files, not counting mocks):
1. `tests/startup-brief.vitest.ts:56-58` — `buildStartupBrief`, `* as graphDb`, `getGraphReadinessSnapshot`
2. `tests/session-resume.vitest.ts:73-74` — `* as graphDb`, `getGraphFreshness`
3. `tests/runtime-detection.vitest.ts:9` — `detectRuntime`, `areHooksAvailable`, `getRecoveryApproach`
4. `tests/runtime-routing.vitest.ts:6` — `classifyQueryIntent`
5. `tests/readiness-contract.vitest.ts:26` — multiple symbols from `readiness-contract.js`
6. `tests/query-intent-classifier.vitest.ts:9` — multiple symbols
7. `tests/opencode-transport.vitest.ts:6` — `CodeGraphOpsContract` (type)
8. `tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:13` — `buildStartupBrief`
9. `tests/handler-memory-search-live-envelope.vitest.ts:51` — `getGraphReadinessSnapshot`
10. `tests/graph-readiness-mapper.vitest.ts:3` — `GraphReadinessSnapshot` (type)
11. `tests/ensure-ready.vitest.ts:5` — `ReadyAction`, `GraphFreshness`, `ReadyResult` (type)
12. `tests/crash-recovery.vitest.ts:48-50` — multiple symbols, `CodeNode`, `generateContentHash`
13. `tests/cross-runtime-fallback.vitest.ts:10` — `detectRuntime`, `areHooksAvailable`, `getRecoveryApproach`
14. `tests/dual-scope-hooks.vitest.ts:12-13` — `mergeCompactBrief`, `MergeInput`
15. `tests/compact-merger.vitest.ts:5` — `mergeCompactBrief`, `MergeInput`
16. `tests/budget-allocator.vitest.ts:9` — multiple symbols from `budget-allocator.js`
17. `stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:11-12` — `closeDb`, `initDb`, `handleCodeGraphQuery`

Plus additional files that use `vi.doMock()` with system-code-graph paths (indirect coupling): `hook-session-start.vitest.ts`, `structural-contract.vitest.ts`, `symlink-realpath-hardening.vitest.ts`, `session-resume-auth.vitest.ts`, `graph-payload-validator.vitest.ts`, `index-scope.vitest.ts`, `graph-first-routing-nudge.vitest.ts`, `gate-d-regression-intent-routing.vitest.ts`, etc.

### 1.6 Skill-advisor plugin coupling

`.opencode/plugins/spec-kit-skill-advisor.js` — a separate plugin file (not a TS source import). The test `tests/spec-kit-skill-advisor-plugin.vitest.ts` imports this plugin directly and tests it. This is a different category of coupling: it's a plugin installed in spec-kit's OpenCode config that bridges to the skill-advisor MCP server.

## Sources Consulted
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/` — all `.ts` files (grep `from '.*system-code-graph` → 45 matches, `from '.*system-skill-advisor` → 0 matches)
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json:41-42` — cross-skill includes
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20-21` — advisor test includes
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:88-89`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:32-34`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:27-29`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:14-15,34-36`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:27`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:18-19`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:9`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:18-19`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:6,8`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:16`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts:6`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:10-11`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/lib/session/context-metrics.ts:8`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:6-9`

## Assessment
- **New information ratio: 0.80**
  - 2 fully new findings (skill-advisor has ZERO TS imports — contrary to spec.md assumption; actual source files are 14 not 11; the new 3: session-bootstrap, session-health, index-scope)
  - 1 refinement (test count confirmed at 17+ with exact file list; plugin coupling is distinct from TS imports)
  - Known from spec.md: 11 files listed, tsconfig.json includes, 17 test estimate
- **Questions addressed**: Q1 (code-graph import map), Q2 (skill-advisor import map)
- **Questions answered**: Q1 (complete), Q2 (complete — zero TS imports)

## Reflection
- **What worked and why**: Comprehensive grep with exact path patterns (`from '.*system-code-graph`) captured all imports including the 3 additional files not in spec.md's original inventory. The dual grep approach (from-import + require) confirmed no require() imports exist.
- **What did not work and why**: The spec.md assumption that skill-advisor has "similar density" of TS imports was wrong — the actual count is zero. This dramatically simplifies the isolation strategy for skill-advisor.
- **What I would do differently**: Next iteration should focus on documentation coupling since the code import map is now complete.

## Recommended Next Focus
Iter-2: Complete the documentation/playbook/feature-catalog cross-reference map (Q3). Enumerate every `.md` file in spec-kit that references extracted skills, classify each as OWNERSHIP residue vs cross-reference.
