# System Code Graph — Verification Report

---

## 1. EXACT TOOLS & INVOCATION

**Source of truth:** `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (`CODE_GRAPH_TOOL_SCHEMAS`, line 186).

| Tool ID | Schema name | Key inputs | Token Budget |
|---|---|---|---|
| `code_graph_scan` | `codeGraphScan` | `rootDir?`, `includeGlobs?`, `excludeGlobs?`, `incremental?` (default true), `includeSkills?` (bool or `sk-*` array), `includeAgents?`, `includeCommands?`, `includeSpecs?`, `includePlugins?`, `verify?`, `persistBaseline?`, `forceZeroNodeReset?`, `forceScopeChange?` | 1000 |
| `code_graph_query` | `codeGraphQuery` | `operation` (required: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`), `subject` (required), `subjects?`, `unionMode?`, `edgeType?`, `limit?`, `includeTransitive?`, `maxDepth?`, `minConfidence?` | 1200 |
| `code_graph_status` | `codeGraphStatus` | No required params | 500 |
| `code_graph_context` | `codeGraphContext` | `input?`, `queryMode?` (`neighborhood`/`outline`/`impact`), `subject?`, `seeds?` (array of `{filePath, startLine, endLine, query, provider, source, symbolName, kind, nodeId, symbolId}`), `budgetTokens?`, `profile?`, `includeTrace?` | 1200 |
| `code_graph_classify_query_intent` | `codeGraphClassifyQueryIntent` | `query` (required) | 300 |
| `code_graph_verify` | `codeGraphVerify` | `rootDir?`, `batteryPath?`, `category?` (`mcp-tool`/`cross-module`/`exported-type`/`regression-detection`), `failFast?`, `includeDetails?`, `persistBaseline?`, `allowInlineIndex?` | 1000 |
| `code_graph_apply` | `codeGraphApply` | `rootDir?`, `operation?` (`rescan`/`prune-excludes`/`repair-nodes`/`recover-sqlite-corruption`/`rollback-bad-apply`), `confirm?`, `dryRun?`, `crashRootCauseAddressed?`, `quarantineOlderThanDays?`, `lowTierOptIn?`, `excludePatterns?`, `batteryPath?`, `includeDetails?` | 1000 |
| `detect_changes` | `detectChanges` | `diff` (required), `rootDir?` | 1200 |

**MCP namespace:** `mcp__mk_code_index__*` (hyphens → underscores per MCP convention). Server name: `mk-code-index`. (`SKILL.md:284`, `tool_surface.md:80`)

**Readiness gate:** `ensureCodeGraphReady()` gates all read-path tools (`code_graph_query`, `code_graph_context`, `detect_changes`, `code_graph_verify`). On non-fresh state returns `status: "blocked"` with `requiredAction` — never empty arrays. (`SKILL.md:311`, `ARCHITECTURE.md:116`)

**False-safe guarantee:** Read paths return an explicit `blocked` payload rather than silently-empty answers when the graph is not trustworthy. (`SKILL.md:28`)

---

## 2. CAPABILITY ROSTER

**Structural indexing** — tree-sitter via `web-tree-sitter` + `tree-sitter-wasms` WASM grammars. Extracts files, symbols, and edges. (`ARCHITECTURE.md:132`)

**Node types (from `code_graph_status`):** `totalFiles`, `totalNodes`, `totalEdges`, `nodesByKind`, `edgesByType`. Specific node/edge type enums not enumerated in tool-schemas; live in `mcp_server/lib/`. (`tool-schemas.ts:68`)

**Blast radius / impact** — `code_graph_query` with `operation: "blast_radius"` returns reverse import impact set. Supports `includeTransitive` for multi-hop BFS, `maxDepth` (1–20), `unionMode` for multi-subject queries, `minConfidence` filter. (`tool-schemas.ts:46–63`)

**Readiness states** — Freshness: `fresh`, `stale`, `empty`, `error`. `absent` is the trust-state projection of an empty graph, NOT a freshness state. (`SKILL.md:25`, `ARCHITECTURE.md:136`)

**Trust state** — Companion signal: whether the graph passed its gold-query battery recently. (`SKILL.md:26`)

**Scope fingerprint** — Hash of scan inputs (include globs, env flags). Divergence → `blocked` + rescan recommendation. (`SKILL.md:27`)

**Change detection** — `detect_changes` maps unified-diff to affected symbols via line-range overlap against indexed `code_nodes`. Refuses on non-fresh state. (`tool-schemas.ts:172–183`)

**Neighborhood retrieval** — `code_graph_context` modes: `neighborhood` (1-hop calls+imports), `outline` (file symbols), `impact` (reverse callers). Accepts manual and graph seeds. Returns token-budgeted snapshots. (`tool-schemas.ts:73–107`)

**Apply-mode recovery** — 5 operations: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`. Gold-query battery runs before AND after. JSONL audit log. (`tool-schemas.ts:146–169`, `ARCHITECTURE.md:138`)

**Query intent classification** — `code_graph_classify_query_intent` classifies NL queries into `structural`, `semantic`, `hybrid`. (`tool-schemas.ts:110–120`)

---

## 3. KEY FILES

| Path | Role |
|---|---|
| `SKILL.md` | Runtime routing instructions, invariants, smart router pseudocode, tool dispatch contract |
| `README.md` | Human-facing overview, quick start, features, usage examples, troubleshooting, FAQ |
| `ARCHITECTURE.md` | System design, package topology, subsystems, dependency direction, decision records |
| `INSTALL_GUIDE.md` | Bootstrap, prerequisites, per-runtime config, verification, maintainer mode |
| `references/runtime/tool_surface.md` | 8 MCP tools mapped to handler files, families, preconditions, token budgets |
| `references/runtime/naming_conventions.md` | Name map across skill folder, MCP server, launcher, plugin bridge, hook location |
| `references/runtime/ownership_boundary.md` | Boundary rules for `system-spec-kit` vs `system-code-graph` |
| `references/runtime/launcher_lease.md` | PID-file lease contract for single-writer launcher |
| `references/readiness/code_graph_readiness_check.md` | `ensureCodeGraphReady()` gates, preconditions, recovery procedures |
| `references/readiness/readiness_and_scope_fingerprint.md` | Readiness state machine, trust state, scope-fingerprint contract |
| `references/config/database_path_policy.md` | Canonical database path policy and override rules |
| `mcp_server/tool-schemas.ts` | Authoritative `CODE_GRAPH_TOOL_SCHEMAS` array (8 tools) + `validateToolArgs()` |
| `mcp_server/tools/code-graph-tools.ts` | Tool registration, dispatch, export surface |
| `mcp_server/handlers/` | MCP tool request adapters |
| `mcp_server/lib/` | Graph implementation, readiness logic, recovery, query, context |
| `mcp_server/tests/` | Vitest unit and integration coverage |
| `mcp_server/stress_test/` | Pressure and degraded-mode coverage |
| `mcp_server/plugin_bridges/` | CLI bridge (currently non-functional post-extraction) |
| `mcp_server/database/` | SQLite graph files and launcher state |
| `mcp_server/core/` | Shared runtime helpers |
| `feature_catalog/` | Current feature inventory (14 entries, 7 groups per README) |
| `manual_testing_playbook/` | Operator validation scenarios (22 scenarios, 9 groups per README) |
| `scripts/` | Referenced in README tree but not listed in directory listing; role: UNKNOWN (not verified in this pass) |

---

## 4. WORKFLOWS & OUTPUTS

**Refactor preflight (blast radius):**
`code_graph_query({ operation: "blast_radius", subject: "<symbol>" })` → reverse import impact set with readiness metadata. (`SKILL.md:34`, `README.md:198–202`)

**Patch change detection:**
`detect_changes({ diff: "<unified diff>" })` → affected symbols and files via line-range overlap, or `blocked` response when graph is not fresh. (`SKILL.md:35`, `README.md:207–211`)

**Incident neighborhood:**
`code_graph_context({ seeds: [...], queryMode: "neighborhood" })` → compact token-budgeted graph neighborhood around seed files/symbols. (`SKILL.md:36`, `README.md:216–220`)

**Graph health check:**
`code_graph_status({})` → `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `schemaVersion`, `totalFiles`, `totalNodes`, `totalEdges`, `dbFileSize`, `nodesByKind`, `edgesByType`, `parseHealth`, `graphQualitySummary`. (`tool-schemas.ts:68`, `README.md:56–58`)

**Index refresh:**
`code_graph_scan({ incremental: true })` → walk workspace, parse via tree-sitter, persist file/symbol/edge rows. Returns scan metadata with counts. (`README.md:63–66`, `INSTALL_GUIDE.md:169`)

**Gold-query verification:**
`code_graph_verify({})` → gold-query battery results. Supports category filtering, fail-fast, baseline persistence. Blocked when readiness not fresh. (`tool-schemas.ts:123–143`)

**Verification-gated recovery:**
`code_graph_apply({ operation: "..." })` → pre-battery → operation → post-battery → JSONL audit log. Rollback on failure. (`ARCHITECTURE.md:138`, `tool-schemas.ts:146–169`)

**Outline (cold read):**
`code_graph_query({ operation: "outline", subject: "<file>" })` → ordered list of top-level symbols with line ranges. (`README.md:225–229`)

---

## 5. TROUBLESHOOTING & FAQ

### Failure modes

| Failure | Cause | Fix | Source |
|---|---|---|---|
| `status: "blocked"` with `requiredAction: "code_graph_scan"` | Graph is stale, missing, or scope-mismatched | Run `code_graph_scan`; use `incremental: false` for scope changes | `README.md:237`, `INSTALL_GUIDE.md:241` |
| `parserHealth: "quarantined"` | Files failed parsing → skip-list | Inspect `parserSkipList.sample` from status; repair or accept | `README.md:238`, `INSTALL_GUIDE.md:243` |
| Skill files missing from scan | `.opencode/skills/**` excluded by default | Set `includeSkills: true` per-call or `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` | `README.md:239`, `INSTALL_GUIDE.md:242` |
| Standalone-storage guard violation | `SPECKIT_CODE_GRAPH_DB_DIR` outside workspace | Use path inside repo or unset override | `INSTALL_GUIDE.md:240` |
| Scope fingerprint mismatch | Requested scope differs from stored baseline | Escalate; surface delta; require `forceScopeChange: true` | `SKILL.md:335` |
| Root-level `dist/` exists | Stale pre-cleanup build output | `npm run clean && npm run build` | `INSTALL_GUIDE.md:246` |

### Top user questions

1. **"Why is the folder `system-code-graph` but the MCP server is `mk-code-index`?"** — Skill slug vs MCP server identity; both intentional. Filesystem uses slug, MCP uses server name. (`README.md:248–250`)

2. **"Does this replace grep?"** — No. Use grep for exact text; code graph for relationships, symbols, freshness, impact. (`README.md:252–254`)

3. **"Why refuse on stale state instead of returning what we have?"** — Empty arrays from stale index train agents on false data. `blocked` + `requiredAction` is safer than plausible-but-wrong. (`README.md:256–258`)

4. **"Can I run this without mk-spec-memory?"** — Yes. Standalone MCP server, no dependency on memory server. (`README.md:264–266`)

5. **"What is the structural vs semantic boundary?"** — This skill is purely structural (tree-sitter AST: callers, imports, symbols). Semantic/embedding search is not provided; seeds for `code_graph_context` can come from external semantic runtimes. (`README.md:42`, `SKILL.md:16–18`)

---

## 6. STALE FACTS IN CURRENT README

1. **Tool count "8" — CORRECT.** `tool-schemas.ts:186–195` exports exactly 8 schemas. README claims "8 MCP tools" in multiple places. Consistent.

2. **`feature_catalog/` entry count "14 entries, 7 groups" (README line 143) — UNVERIFIABLE in this pass.** The `feature_catalog/` directory contents were not read. Mark as UNKNOWN until verified against `feature_catalog/feature_catalog.md`.

3. **`manual_testing_playbook/` entry count "22 scenarios, 9 groups" (README line 144) — UNVERIFIABLE in this pass.** The `manual_testing_playbook/` directory contents were not read. Mark as UNKNOWN until verified.

4. **README §3.5 "INDEX LIFECYCLE" duplicates §3.1 "Structural Index".** Both list `code_graph_status`, `code_graph_scan`, and `code_graph_verify`. This is a structural redundancy, not a factual error, but the duplication may confuse readers about whether these are distinct capabilities. (`README.md:96–100` vs `README.md:124–129`)

5. **README §3.3 title "Impact Analysis" groups `code_graph_verify` with `detect_changes`.** `code_graph_verify` is a maintenance/verification tool, not an impact-analysis tool. `tool_surface.md:46–41` classifies it under "Maintenance" family. The grouping is misleading but not factually wrong about the tool's existence. (`README.md:111–115`)

6. **README §4 STRUCTURE lists `scripts/`** in the tree (line 157: `node_modules/`) but does not list `scripts/` as a subfolder. The `scripts/` directory appears in §9 RELATED DOCUMENTS as `../../scripts/README.md` (repo-level, not skill-local). No stale claim found.

7. **README §9 RELATED DOCUMENTS references `mcp_server/tests/README.md`** (line 295). This file was not verified in this pass — UNKNOWN whether it exists.

8. **INSTALL_GUIDE.md §1 field table says "MCP tools: 8 (see README.md §3.2)".** Section 3.2 in README covers only 5 tools (query, classify, context, verify, detect_changes). The full 8 are in §3.1 + §3.2 + §3.4 combined. The cross-reference is imprecise but not wrong about the count. (`INSTALL_GUIDE.md:66`)

9. **No stale version number found.** SKILL.md version `1.0.3.2` matches INSTALL_GUIDE.md field table. (`SKILL.md:5`, `INSTALL_GUIDE.md:59`)

10. **No stale tool names found.** All tool IDs in README match `CODE_GRAPH_TOOL_SCHEMAS` exactly.

**Summary:** No hard factual disagreements found between README, SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, and `tool-schemas.ts`. Two entry-count claims (feature_catalog 14/7, manual_testing_playbook 22/9) are unverified. One structural redundancy (§3.5 duplicates §3.1) and one misleading grouping (§3.3) are present but not factually incorrect.