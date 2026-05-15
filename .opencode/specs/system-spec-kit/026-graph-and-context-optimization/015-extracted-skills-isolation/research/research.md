# Deep Research: Extracted Skills Isolation from system-spec-kit

## Executive Summary

**Recommended strategy: Strategy C (Hybrid)** — shared types package for type contracts + MCP bridge for existing tool-covered functions + strategic inlining for functions without MCP tools. Total effort: ~31h across 4 independent phases. Fallback: Strategy D (Accept Coupling) at 2h if full isolation is deemed unnecessary.

**Key finding:** The two extracted skills have dramatically different coupling profiles. `system-skill-advisor` has **zero TS imports** in spec-kit source — it can be fully isolated in Phase 1 at 6h. `system-code-graph` has deep coupling (14 source files with 11 distinct function/types) requiring the full Strategy C approach.

---

## 1. Current-State Map

### 1.1 TS Import Map: system-spec-kit → system-code-graph (14 non-test source files)

| # | File | Line(s) | Imported Symbols | Source Module | Category |
|---|------|---------|-----------------|---------------|----------|
| 1 | `mcp_server/context-server.ts` | 88 | `* as graphDb` | `code-graph-db.js` | Value |
|   | | 89 | `detectRuntime`, `type RuntimeInfo` | `runtime-detection.js` | Value+Type |
| 2 | `mcp_server/handlers/session-bootstrap.ts` | 32-34 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` | Value+Type |
| 3 | `mcp_server/handlers/session-health.ts` | 27-29 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` | Value+Type |
| 4 | `mcp_server/handlers/session-resume.ts` | 14 | `* as graphDb` | `code-graph-db.js` | Value |
|   | | 15 | `getGraphFreshness`, `type GraphFreshness` | `ensure-ready.js` | Value+Type |
|   | | 34-36 | `buildCodeGraphOpsContract`, `type CodeGraphOpsContract` | `ops-hardening.js` | Value+Type |
| 5 | `mcp_server/handlers/memory-search.ts` | 27 | `getGraphReadinessSnapshot` | `ensure-ready.js` | Value |
| 6 | `mcp_server/handlers/memory-context.ts` | 18 | `classifyQueryIntent` | `query-intent-classifier.js` | Value |
|   | | 19 | `buildContext` | `code-graph-context.js` | Value |
| 7 | `mcp_server/hooks/memory-surface.ts` | 9 | `* as graphDb` | `code-graph-db.js` | Value |
| 8 | `mcp_server/hooks/claude/compact-inject.ts` | 18 | `mergeCompactBrief` | `compact-merger.js` | Value |
|   | | 19 | `type MergeInput` | `compact-merger.js` | Type |
| 9 | `mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | 6 | `buildStartupBrief` | `startup-brief.js` | Value |
|   | | 8 | `type StartupBriefResult` | `startup-brief.js` | Type |
| 10 | `mcp_server/lib/context/opencode-transport.ts` | 16 | `type CodeGraphOpsContract` | `ops-hardening.js` | **Type-only** |
| 11 | `mcp_server/lib/search/graph-readiness-mapper.ts` | 6 | `type GraphReadinessSnapshot` | `ensure-ready.js` | **Type-only** |
| 12 | `mcp_server/lib/session/session-snapshot.ts` | 10 | `getStats as getGraphStats` | `code-graph-db.js` | Value |
|   | | 11 | `getGraphFreshness` | `ensure-ready.js` | Value |
| 13 | `mcp_server/lib/session/context-metrics.ts` | 8 | `getStats as getGraphStats` | `code-graph-db.js` | Value |
| 14 | `mcp_server/lib/utils/index-scope.ts` | 6-9 | `resolveIndexScopePolicy`, `type IndexScopePolicy`, `type ResolveIndexScopePolicyInput` | `index-scope-policy.js` | Value+Type |

**Summary:** 7 type-only import sites, 17 value import sites across 14 files, referencing 10 distinct types and 11 distinct function/namespace imports.

### 1.2 TS Import Map: system-spec-kit → system-skill-advisor

**ZERO direct TS imports.** The coupling is:
- `tsconfig.json:42` — `"../../system-skill-advisor/mcp_server/**/*.ts"` in `include` (type-checks advisor files as side effect; nothing depends on these types)
- `vitest.config.ts:20-21,23` — includes advisor test/bench files in spec-kit's test suite
- Hook proxy files — runtime path references (string constants, not TS imports)
- Plugin files — `.opencode/plugins/spec-kit-skill-advisor.js` (separate file, not a source import)

### 1.3 tsconfig.json Cross-Skill Includes

`mcp_server/tsconfig.json:41-42`:
```json
"../../system-code-graph/mcp_server/**/*.ts",      // BREAKS tsc if removed (14 files depend on it)
"../../system-skill-advisor/mcp_server/**/*.ts"    // SAFE to remove (zero imports depend on it)
```

### 1.4 Documentation Coupling

56 spec-kit doc files reference extracted skills:

| Category | OWNERSHIP-code-graph | OWNERSHIP-skill-advisor | CROSS-REF | SPEC-KIT | Total |
|----------|---------------------|------------------------|-----------|----------|-------|
| feature_catalog/22-- | 4 | 4 | 7 | 9 | 24 |
| playbook/22-- | 0 | 3 | 1 | 15 | 19 |
| Other feature_catalog | 1 | 0 | 2 | 0 | 3 |
| Other playbook | 2 | 0 | 1 | 0 | 3 |
| Top-level docs | 0 | 0 | 3 | 0 | 3 |
| MCP/reference docs | 0 | 0 | 4 | 0 | 4 |
| **TOTAL** | **7** | **7** | **18** | **24** | **56** |

**Action:** 7 OWNERSHIP-code-graph + 7 OWNERSHIP-skill-advisor = 14 files to MOVE to the owning skill. 18 CROSS-REF entries to update with boundary language.

### 1.5 Changelog References

8 changelog files contain ~57 total references to extracted skills. Changelogs are historical record — DO NOT MODIFY.

### 1.6 Test Coupling

19 test files with direct imports, 9 with indirect mock references:

| Classification | Count | Action |
|----------------|-------|--------|
| MOVE to code-graph | 9 | `git mv` to `system-code-graph/mcp_server/tests/` |
| MOVE to skill-advisor | 2 | `git mv` to `system-skill-advisor/mcp_server/tests/` |
| CONVERT to mocks | 6 | Stay in spec-kit; replace cross-skill imports with local mocks |
| LEGITIMATE | 1 | Stay in spec-kit; update type import path |
| INDIRECT (mock paths) | 9 | Stay in spec-kit; update mock path strings |

---

## 2. Strategy Evaluation Table

| Strategy | Description | Hours | Runtime Cost | Risk | Ergonomic Impact | Completeness |
|----------|-------------|-------|-------------|------|-----------------|--------------|
| **A** Shared Types | Extract 10 shared TS types to `_shared-types/` | 17h | None | Low | Minimal | Partial (types only) |
| **B** MCP Runtime | Replace all imports with MCP tool calls | 30.5h | 5-20ms/call | Medium-High | Significant (async) | Partial (7/11 value imports have no MCP tool) |
| **C** Hybrid | Types via A + behaviors via MCP where possible + strategic inlining | **31h** | 15-45ms total | Medium | Moderate | **Full** (100% isolation) |
| **D** Accept Coupling | Document peer dependency; remove isolation claim | **2h** | None | None | None | Full (by redefinition) |
| **E** Reverse-Extract | Move spec-kit code back to code-graph | 40h+ | None | Very High | Disastrous | Full (by undoing work) |

---

## 3. Recommendation

### Primary: Strategy C (Hybrid) — 4-Phase Execution Plan

**Phase 1: Skill-Advisor Complete Isolation (6h)**
- Remove `"../../system-skill-advisor/mcp_server/**/*.ts"` from tsconfig.json `include`
- Remove skill-advisor from vitest.config.ts includes
- Move 7 OWNERSHIP feature_catalog/playbook files + 2 test files to system-skill-advisor
- Verify `tsc --noEmit` still passes (will pass — zero imports depend on it)

**Phase 2: Shared Types Package (17h)**
- Create `_shared-types/` package with 10 shared types + 2 shared library functions (`mergeCompactBrief`, `buildStartupBrief`)
- Update system-code-graph to import from `_shared-types/`; re-export for backward compat
- Update system-spec-kit to import from `_shared-types/`
- Run `tsc --noEmit` in both skills

**Phase 3: MCP Bridge + Inlining (5h)**
- Wire `code_graph_status` for `getGraphFreshness`, `getGraphReadinessSnapshot`, `getStats`
- Wire `code_graph_context` for `buildContext`
- Inline 4 small functions: `detectRuntime` (~50 lines), `classifyQueryIntent` (~80 lines), `buildCodeGraphOpsContract` (8-line helper), `resolveIndexScopePolicy` (~30 lines)
- Remove remaining cross-skill tsconfig `include` for code-graph
- Final `tsc --noEmit` verification — grep for any remaining imports

**Phase 4: Doc + Test Migration (3h)**
- Move remaining OWNERSHIP feature_catalog/playbook entries to code-graph
- Move 9 tests to code-graph, update vitest configs
- Convert 6 tests to use local mocks/types
- Update 18 CROSS-REF doc entries with boundary language
- Update SKILL.md, README.md, ARCHITECTURE.md

### Fallback: Strategy D (Accept Coupling) — 2h

If full isolation is deemed unnecessary: update ARCHITECTURE.md, SKILL.md, README.md to document the compile-time peer dependency explicitly and remove "100% isolated" claims. All other docs stay as cross-references.

---

## 4. Execution Sequence (Concrete Task List)

### Packet 1: Skill-Advisor Isolation (Phase 1)
1. Remove `"../../system-skill-advisor/mcp_server/**/*.ts"` from `mcp_server/tsconfig.json:42`
2. Remove skill-advisor include lines from `vitest.config.ts` and `vitest.stress.config.ts`
3. Verify `npx tsc --noEmit` passes
4. `git mv` `tests/spec-kit-skill-advisor-plugin.vitest.ts` → `system-skill-advisor/mcp_server/tests/`
5. `git mv` `stress_test/skill-advisor/` → `system-skill-advisor/mcp_server/stress_test/`
6. Move 4 feature_catalog/22-- files (26-29: skill-graph-*) + 3 playbook files (283-285) to system-skill-advisor
7. Update vitest config in system-skill-advisor to include moved tests

### Packet 2: Shared Types Package (Phase 2)
1. Create `.opencode/skills/_shared-types/` with package.json, tsconfig.json
2. Extract types from `ops-hardening.ts`, `ensure-ready.ts`, `compact-merger.ts`, `startup-brief.ts`, `runtime-detection.ts`, `index-scope-policy.ts`
3. Extract `mergeCompactBrief` and `buildStartupBrief` as shared library functions
4. Update code-graph imports + re-exports
5. Update spec-kit imports
6. Run both test suites

### Packet 3: MCP Bridge + Inlining (Phase 3)
1. Inline `detectRuntime` in spec-kit
2. Inline `classifyQueryIntent` in spec-kit (or create shared lib)
3. Inline `buildCodeGraphOpsContract` helper + `resolveIndexScopePolicy` in spec-kit
4. Wire `code_graph_status` calls for freshness/stats
5. Wire `code_graph_context` for context building
6. Remove `"../../system-code-graph/mcp_server/**/*.ts"` from tsconfig.json include
7. Final verification: `npx tsc --noEmit` + grep for remaining imports

### Packet 4: Doc + Test Migration (Phase 4)
1. Move remaining OWNERSHIP files to system-code-graph
2. Move 9 test files to system-code-graph
3. Convert 6 test files to local mocks
4. Update vitest configs in both skills
5. Update 18 CROSS-REF doc entries
6. Update SKILL.md, README.md, ARCHITECTURE.md
7. Update ENV_REFERENCE.md (11 refs), hook_system.md (9 refs), etc.

---

## 5. Risk Register

| # | Risk | Likelihood | Impact | Detection | Rollback |
|---|------|-----------|--------|-----------|----------|
| R1 | `_shared-types/` introduces circular dependency | Low | High | `tsc --noEmit` fails | Remove shared package, restore direct imports |
| R2 | Inlined functions diverge from code-graph originals | Medium | Medium | Cross-skill integration tests | Add shared tests run by both skills |
| R3 | MCP call latency degrades UX | Low | Low | Performance regression tests | Cache MCP results per session |
| R4 | Test migration breaks CI | High | Medium | CI failure on PR | Revert moves; update vitest configs atomically |
| R5 | Forgotten import breaks `tsc --noEmit` | Medium | Low | Verification step | Grep for remaining imports |
| R6 | `_shared-types/` version drift | Medium | Medium | Type mismatch at compile time | Pin with CI check in both skills |
| R7 | Skill-advisor doc moves create broken links | Low | Low | Link checker | Update cross-references |

---

## 6. Adversarial Pass

Each recommendation is challenged and addressed:

**Challenge: "30h is too expensive for compile-time purity when the two skills always run together."**
→ Start with Phase 1 (skill-advisor, 6h) as a pilot. If the benefit is clear (faster tsc, cleaner boundaries), proceed to Phases 2-4. If not, switch to Strategy D (2h doc update). This gates the full investment on demonstrated value.

**Challenge: "Inlining functions creates code duplication."**
→ Revised plan: move `mergeCompactBrief` and `buildStartupBrief` to the shared library package (not inlined). Only trivial functions (<80 lines) are inlined. This eliminates the DRY concern for the complex functions.

**Challenge: "Skill-advisor Phase 1 is oversimplified — it's more than just removing a tsconfig line."**
→ Adjusted estimate from 2h to 6h to include doc/test moves. The tsconfig-only fix is 30 minutes. The doc/test moves add 5.5h. These can be split: ship the tsconfig fix immediately, defer doc/test moves to a follow-up packet.

---

## 7. Research Metadata

- **Stop reason**: All questions answered (convergence: 8/8 key questions resolved)
- **Total iterations**: 6
- **New information trajectory**: 0.80 → 0.70 → 0.65 → 0.55 → 0.45 → 0.30
- **Rolling average (last 3)**: 0.433
- **Strategy**: Autonomously chose to stop after Q1-Q8 all resolved with file:line evidence
- **Model**: deepseek/deepseek-v4-pro (native executor)

## References

- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/` — all `.ts` source files
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json:41-42`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20-21,23`
- [SOURCE: file] `.opencode/skills/system-code-graph/mcp_server/lib/ops-hardening.ts:1-60`
- [SOURCE: file] `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:1-50`
- [SOURCE: file] `.opencode/skills/system-spec-kit/feature_catalog/22--*/` — 24 .md files
- [SOURCE: file] `.opencode/skills/system-spec-kit/manual_testing_playbook/22--*/` — 19 .md files
- [SOURCE: file] `.opencode/skills/system-spec-kit/SKILL.md:375`
- [SOURCE: file] `.opencode/skills/system-spec-kit/README.md:64,106,111,114,116`
- [SOURCE: file] `.opencode/skills/system-spec-kit/ARCHITECTURE.md:§5,§6,461`
- [SOURCE: file] `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- [SOURCE: file] `.opencode/skills/system-spec-kit/references/config/hook_system.md:134`
- [SOURCE: file] `.opencode/skills/system-spec-kit/references/config/environment_variables.md:198`
- [SOURCE: file] `.opencode/skills/system-spec-kit/references/memory/memory_system.md:143`
- [SOURCE: file] `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-extracted-skills-isolation/spec.md`
