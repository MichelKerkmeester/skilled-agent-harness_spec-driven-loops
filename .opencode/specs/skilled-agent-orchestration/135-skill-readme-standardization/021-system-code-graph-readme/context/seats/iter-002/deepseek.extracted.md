Now I have all the information needed to compile the verification report.

---

## Verification Report: system-code-graph README Fact Check

### 1. EXACT TOOLS & INVOCATION

The 8 MCP tools are defined in `mcp_server/tool-schemas.ts` (exported array `CODE_GRAPH_TOOL_SCHEMAS`, lines 186–195). The MCP server name is `mk-code-index`; the namespace prefix is `mcp__mk_code_index__*`.

| # | Tool ID | Operations / Key Inputs | Token Budget | Source Citation |
|---|---------|------------------------|--------------|-----------------|
| 1 | `code_graph_scan` | `rootDir`, `includeGlobs`, `excludeGlobs`, `incremental` (boolean, default true), `includeSkills` (boolean or `sk-*` array), `includeAgents`, `includeCommands`, `includeSpecs`, `includePlugins`, `verify`, `persistBaseline`, `forceZeroNodeReset`, `forceScopeChange`. All params optional. | 1000 | `tool-schemas.ts:13-42` |
| 2 | `code_graph_query` | **Required:** `operation` (`outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`), `subject` (file path, symbol name, or symbolId). Optional: `subjects` (union mode), `unionMode` (`single`/`multi`), `edgeType`, `limit` (1–1000, default 50), `includeTransitive` (boolean, multi-hop BFS), `maxDepth` (1–20, default 3), `minConfidence` (0–1). | 1200 | `tool-schemas.ts:45-63` |
| 3 | `code_graph_classify_query_intent` | **Required:** `query` (natural-language string). Classifies into `structural`, `semantic`, or `hybrid`. | 300 | `tool-schemas.ts:110-120` |
| 4 | `code_graph_context` | `input` (NL query), `queryMode` (`neighborhood` default / `outline` / `impact`), `subject`, `seeds` (array of `filePath`/`startLine`/`endLine`/`symbolName`/`kind`/`provider` [manual\|graph] objects), `budgetTokens` (100–4000, default 1200), `profile` (`quick`/`research`/`debug`). All params optional. Returns `blocked` on non-fresh with `requiredAction: "code_graph_scan"`. Successful responses include `metadata.partialOutput`. | 1200 | `tool-schemas.ts:73-107` |
| 5 | `code_graph_status` | No input params. Returns `totalFiles`, `totalNodes`, `totalEdges`, `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `lastPersistedAt`, `lastGitHead`, `dbFileSize`, `schemaVersion`, `nodesByKind`, `edgesByType`, `parseHealth`, `graphQualitySummary`. Read-only, always answerable. | 500 | `tool-schemas.ts:66-70` |
| 6 | `code_graph_verify` | `rootDir`, `batteryPath`, `category` (`mcp-tool`/`cross-module`/`exported-type`/`regression-detection`), `failFast`, `includeDetails`, `persistBaseline`, `allowInlineIndex`. Returns `blocked` when `readiness !== "fresh"`. | 1000 | `tool-schemas.ts:123-143` |
| 7 | `code_graph_apply` | **Operation enum:** `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`. Additional: `confirm` (required for hard-stale), `dryRun`, `crashRootCauseAddressed` (required for repair-nodes), `quarantineOlderThanDays` (1–365), `lowTierOptIn`, `excludePatterns`, `batteryPath`, `includeDetails`. Runs gold-query battery before AND after; JSONL audit logs. | 1000 | `tool-schemas.ts:146-169` |
| 8 | `detect_changes` | **Required:** `diff` (unified-diff text). Optional: `rootDir`. Refuses when `readiness !== "fresh"` — returns `status: "blocked"` instead of false-safe empty `affectedSymbols[]`. Maps line-range overlap to indexed `code_nodes`. | 1200 | `tool-schemas.ts:172-183` |

**Readyness gate (`ensureCodeGraphReady`):** Every read-path tool (tools 2, 4, 6, 8 per `references/runtime/tool_surface.md:39-40`) consults `ensureCodeGraphReady()` in `mcp_server/lib/ensure-ready.ts:585-743` before answering. The function evaluates six preconditions (graph emptiness, scope fingerprint, git HEAD drift, file mtime staleness, candidate manifest drift, deleted tracked files) per `references/readiness/code_graph_readiness_check.md:41-48`. A 10-second timeout guard prevents blocking queries forever (`mcp_server/lib/ensure-ready.ts:74, 582`).

**False-safe blocked payload:** When readiness is non-fresh, tools return `status: "blocked"` with `requiredAction`, `readiness`, `lastPersistedAt`, and `reason`. The payload is composed via `buildReadinessBlock()` in `mcp_server/lib/readiness-contract.ts:241-249` and augmented with `canonicalReadiness` and `trustState`. This is a hard refuse, not a soft degrade — per `ARCHITECTURE.md:136` and `SKILL.md:29`.

---

### 2. CAPABILITY ROSTER

**Structural indexing — node and edge types:**
- **SQLite tables:** `code_files`, `code_nodes`, `code_edges` plus indexes (`mcp_server/lib/code-graph-db.ts:108-184`).
- **Node kinds (tree-sitter extracted):** `function`, `class`, `method`, `interface`, `type_alias`, `enum`, `import`, `export`, `variable`, `parameter`, `module` (from `mcp_server/lib/structural-indexer.ts:421-980`).
- **Edge types:** `CALLS` (functions → called functions, confidence 0.8), `IMPORTS` (import declarations → modules, confidence 1.0), `CONTAINS` (class → method, confidence 1.0) — per `mcp_server/lib/structural-indexer.ts:1042-1144, 1991-2019`.
- `code_graph_status` returns `nodesByKind` and `edgesByType` as dynamic aggregations (`mcp_server/lib/code-graph-db.ts:1133-1174`).

**Graph node/edge counts (dynamic):** `code_graph_status` reports live counts from the SQLite store: `totalFiles`, `totalNodes`, `totalEdges`, and per-kind/per-type breakdowns (`tool-schemas.ts:68`).

**Blast radius / impact:** `code_graph_query` operation `blast_radius` returns the reverse import impact set of a symbol or file. Supports `includeTransitive` multi-hop BFS traversal (default depth 3, max 20), `multi`-subject union mode, and `minConfidence` filtering (0–1) on import edges (`tool-schemas.ts:47-63`). `detect_changes` is the diff-driven impact preflight — maps unified-diff hunks to affected symbols via line-range overlap against `code_nodes` (`tool-schemas.ts:174-183`).

**Readiness states:** The `GraphFreshness` enum is exactly four values: `fresh`, `stale`, `empty`, `error` (`mcp_server/lib/readiness-contract.ts`). `blocked` is a read-tool refusal payload, NOT a freshness value. `absent` is a trust-state projection of an `empty` graph, NOT a freshness value (`references/readiness/readiness_and_scope_fingerprint.md:51-60`). `canonicalReadiness` maps `fresh`→`ready`, `stale`→`stale`, `empty`→`missing`, `error`→`missing` (`mcp_server/lib/readiness-contract.ts:73-88`).

**Trust state:** `trustState` is a freshness-derived projection: `fresh`→`live`, `stale`→`stale`, `empty`→`absent`, `error`→`unavailable` (`mcp_server/lib/readiness-contract.ts:109-124`). `goldVerificationTrust` is a separate verification axis: `live`/`stale`/`absent` (`references/readiness/readiness_and_scope_fingerprint.md:68-72`).

**False-safe guarantee:** The read path returns an explicit `blocked` payload rather than a silently-empty answer when the graph is not trustworthy. Prevents agents from acting on partial structural state (`SKILL.md:28-29`, `ARCHITECTURE.md:116`, `references/readiness/readiness_and_scope_fingerprint.md:32-33`).

**Change detection:** `detect_changes` maps a unified-diff to affected symbols via line-range overlap against indexed `code_nodes`. Refuses when `readiness !== "fresh"` — returns `status: "blocked"` instead of empty `affectedSymbols[]` (`tool-schemas.ts:172-183`, `references/runtime/tool_surface.md:55`).

**Neighborhood retrieval:** `code_graph_context` builds compact LLM-friendly graph neighborhoods. Accepts `manual` or `graph` seeds. Modes: `neighborhood` (1-hop calls+imports), `outline` (file symbols), `impact` (reverse callers). Returns `blocked` on non-fresh; successful responses include `metadata.partialOutput` for deadline/budget truncation (`tool-schemas.ts:73-107`).

**Scope fingerprint:** A hash of include/exclude globs, `INDEX_*` env flags (or per-call equivalents), and maintainer mode. Computed at scan time and compared on every read. Mismatch blocks reads unless the stored scope was from a per-call scan argument (`references/readiness/readiness_and_scope_fingerprint.md:79-94`).

**Apply-mode recovery:** Verification-gated recovery operations (5 types: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`). Gold-query battery runs before AND after each operation; JSONL audit logs; rollback restores last known-good baseline (`tool-schemas.ts:146-169`, `ARCHITECTURE.md:138`).

**Parser quarantine:** Files that fail parsing are added to a skip-list, surfaced through `parserHealth`, `parserSkipList`, and related status metadata (`references/readiness/readiness_and_scope_fingerprint.md:74`).

---

### 3. KEY FILES

| Path | Role |
|------|------|
| `SKILL.md` | Runtime routing, invariants, tool dispatch contract, resource loading pseudo-code. Version `1.0.3.2`. |
| `README.md` | Human-facing skill overview, quick start, features, structure, configuration, troubleshooting, FAQ. |
| `ARCHITECTURE.md` | System architecture: package topology, dependency direction (`handlers→lib→parser→database`), canonical continuity flows, runtime subsystems, ADRs 001–005, enforcement and verification. |
| `INSTALL_GUIDE.md` | Native bootstrap, per-runtime config (JSON/TOML), prerequisites (Node >=20.11.0), verification steps, database/maintainer mode, troubleshooting. |
| `graph-metadata.json` | Skill-graph metadata: edges, domains, intent signals, derived fields. |
| `package.json` | Private runtime package: `@spec-kit/system-code-graph`. |
| `tsconfig.json` | TypeScript build configuration for `mcp_server/`. |
| `vitest.config.ts` | Focused Vitest test configuration (code-graph suite). |
| `feature_catalog/feature_catalog.md` | Current feature inventory: 14 runtime features across 7 groups. |
| `feature_catalog/01--read-path-freshness/` | 2 features: ensure-code-graph-ready, query-self-heal. |
| `feature_catalog/02--manual-scan-verify-status/` | 3 features: code-graph-scan, code-graph-verify, code-graph-status. |
| `feature_catalog/03--detect-changes/` | 1 feature: detect-changes-preflight. |
| `feature_catalog/04--context-retrieval/` | 2 features: code-graph-context, context-handler. |
| `feature_catalog/05--coverage-graph/` | 4 features: historical deep-loop coverage graph (arc 118: MCP tools removed, now `.cjs` scripts under `deep-loop-runtime`). |
| `feature_catalog/06--mcp-tool-surface/` | 1 feature: tool-registrations. |
| `feature_catalog/08--doctor-code-graph/` | 1 feature: doctor-apply-mode. |
| `manual_testing_playbook/manual_testing_playbook.md` | Operator validation: 22 scenarios across 9 groups. |
| `references/runtime/tool_surface.md` | All 8 tools mapped to handler, purpose, preconditions, token budget. |
| `references/runtime/naming_conventions.md` | Name map across skill folder, MCP server, launcher, plugin bridge, and hook location. |
| `references/runtime/ownership_boundary.md` | What stays in `system-spec-kit` vs `system-code-graph`. |
| `references/runtime/launcher_lease.md` | PID-file single-writer lease contract for the launcher. |
| `references/readiness/code_graph_readiness_check.md` | `ensureCodeGraphReady()` implementation contract: 6 preconditions, 5 gates, 6 failure modes, 3 recovery procedures. |
| `references/readiness/readiness_and_scope_fingerprint.md` | Readiness state machine (`fresh`/`stale`/`blocked`/`empty`/`absent`/`error`), trust state, scope fingerprint, typical flows. |
| `references/config/database_path_policy.md` | Canonical database path (skill-local), override rules, migration history (3 moves), standalone-storage guard. |
| `mcp_server/index.ts` | Standalone MCP transport entrypoint (`mk-code-index`). |
| `mcp_server/tool-schemas.ts` | **Source of truth** for the 8 tool schemas: `CODE_GRAPH_TOOL_SCHEMAS` array + `validateToolArgs()` with unknown-key rejection, enum/enum membership, and string minLength enforcement (`tool-schemas.ts:186-260`). |
| `mcp_server/handlers/` | 9 handler files: `apply.ts`, `classify-query-intent.ts`, `context.ts`, `detect-changes.ts`, `index.ts`, `query.ts`, `scan.ts`, `status.ts`, `verify.ts`. |
| `mcp_server/tools/code-graph-tools.ts` | Runtime tool dispatch and registration. |
| `mcp_server/lib/` | Graph implementation: `code-graph-db.ts`, `structural-indexer.ts`, `readiness-contract.ts`, `ensure-ready.ts`, `tree-sitter-parser.ts`, `code-graph-context.ts`, `query-intent-classifier.ts`, `auto-rescan-policy.ts`, `recovery-procedures.ts`, `diff-parser.ts`, `apply-orchestrator.ts`, plus subdirectories. |
| `mcp_server/database/` | Local SQLite graph (`code-graph.sqlite` + WAL/SHM sidecars), readiness marker (`.code-graph-readiness.json`), launcher state (`.mk-code-index-launcher.json`). |
| `mcp_server/tests/` | Vitest unit and integration coverage. |
| `mcp_server/stress_test/code-graph/` | Pressure and degraded-mode coverage. |
| `mcp_server/plugin_bridges/` | CLI bridge (`mk-code-graph-bridge.mjs`, currently broken post-extraction per `INSTALL_GUIDE.md:234-235` and `README.md:154`). |
| `mcp_server/core/` | Shared runtime helpers. |
| `scripts/doctor.sh` | Read-only health check: verifies dist presence, Node imports (`better-sqlite3`, `web-tree-sitter`, `@modelcontextprotocol/sdk`, `zod`). |
| `changelog/` | 4 changelog entries: `v1.0.0.0.md`, `v1.0.2.0.md`, `v1.0.3.0.md`, `v1.1.0.0.md`. |

---

### 4. WORKFLOWS & OUTPUTS

**Workflow 1 — Refactor preflight (blast radius):**
Documented at `SKILL.md:34-35` and `README.md:195-202`.
- Trigger: "What depends on [symbol/file]?"
- Tool: `code_graph_query` with `operation: "blast_radius"` and `subject`.
- Output: Reverse import impact set with readiness metadata. Supports `includeTransitive` multi-hop BFS, `minConfidence` filtering, and multi-subject `unionMode: "multi"` (`tool-schemas.ts:47-63`). Refuses stale graphs with `blocked` payload.

**Workflow 2 — Patch change detection:**
Documented at `SKILL.md:35` and `README.md:204-211`.
- Trigger: "Which symbols does this patch touch?"
- Tool: `detect_changes` with `diff: "<unified diff>"`.
- Output: `affectedSymbols` and `files` via line-range overlap against indexed `code_nodes`. Passes `allowInlineIndex: false` — never silently reindexes (`feature_catalog/feature_catalog.md:132-134`). Returns `blocked` on non-fresh state instead of empty `affectedSymbols[]`, per false-safe contract (`tool-schemas.ts:174-183`).

**Workflow 3 — Incident neighborhood retrieval:**
Documented at `SKILL.md:36` and `README.md:213-220`.
- Trigger: "Find [concept] and give me nearby code."
- Chain: semantic search for candidate files → `code_graph_context` with selected seeds.
- Tool: `code_graph_context` with `queryMode` (`neighborhood`/`outline`/`impact`) and `seeds` (manual or graph).
- Output: Token-budgeted compact graph neighborhood. `metadata.partialOutput` signals deadline/budget truncation (`tool-schemas.ts:75-78`). Returns `blocked` with `requiredAction: "code_graph_scan"` on non-fresh state.

**Workflow 4 — File outline for cold reading:**
Documented at `README.md:223-229`.
- Tool: `code_graph_query` with `operation: "outline"`.
- Output: Ordered list of top-level symbols with line ranges from the indexed AST.

**Workflow 5 — Index lifecycle (cold start / refresh):**
Documented at `README.md:52-62` and `references/readiness/readiness_and_scope_fingerprint.md:108-141`.
- Steps: `code_graph_status` → `code_graph_scan` (incremental or full) → `code_graph_query` / `code_graph_context` → optional `code_graph_verify`.
- Scan output: updated `totalFiles`, `totalNodes`, `totalEdges`, freshness metadata (`tool-schemas.ts:68`).

**Workflow 6 — Gold-query verification:**
Documented at `references/readiness/readiness_and_scope_fingerprint.md:65-72`.
- Tool: `code_graph_verify` with optional `category`, `failFast`, `persistBaseline`.
- Output: Battery pass/fail results. `goldVerificationTrust` flips to `live` on success. Blocks on stale readiness; only executes on fresh graphs (`ARCHITECTURE.md:154`).

**Workflow 7 — Recovery (doctor code-graph):**
Documented at `SKILL.md:281-282` and `feature_catalog/feature_catalog.md:262-276`.
- Tool: `code_graph_apply` with one of 5 operations. Runs gold-query battery before AND after; JSONL audit logs; rollback restores last known-good baseline (`tool-schemas.ts:146-169`, `ARCHITECTURE.md:138`).
- `/doctor code-graph` slash-command surface is Phase A diagnostic-only; the route manifest is marked `mutates` for future apply flags (`feature_catalog/feature_catalog.md:268-273`).

**What each tool returns (summary):**
- `code_graph_scan` → scan metadata with `totalFiles`, `totalNodes`, `totalEdges`, `lastScanAt`, `lastPersistedAt`.
- `code_graph_query` → structural results depending on operation (outline symbols, caller/import/edge lists, blast-radius impact set) with readiness metadata. Blocks on non-fresh.
- `code_graph_classify_query_intent` → `{ structural, semantic, hybrid }` classification.
- `code_graph_context` → compact neighborhood graph with `metadata.partialOutput`. Blocks on non-fresh.
- `code_graph_status` → `totalFiles`, `totalNodes`, `totalEdges`, `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `lastPersistedAt`, `lastGitHead`, `dbFileSize`, `schemaVersion`, `nodesByKind`, `edgesByType`, `parseHealth`, `graphQualitySummary`. Always answerable.
- `code_graph_verify` → gold-query battery results. Blocks on non-fresh.
- `code_graph_apply` → recovery operation result with pre/post gold-query battery results.
- `detect_changes` → `affectedSymbols[]` and affected `files`. Blocks on non-fresh.

---

### 5. TROUBLESHOOTING & FAQ

**Concrete failure modes (from `README.md:234-243` and `INSTALL_GUIDE.md:238-249`):**

1. **`status: "blocked"` with `requiredAction: "code_graph_scan"`** — Graph is stale, missing, or scope-mismatched. Fix: run `code_graph_scan` with the intended scope; use `incremental: false` for scope changes. Source: `readiness_and_scope_fingerprint.md:56,58` and `code_graph_readiness_check.md:68-69`.

2. **Stale index (soft-stale vs hard-stale)** — Soft-stale: few changed files, incremental rescan self-heals. Hard-stale: too many changes, requires full rescan. The auto-rescan safety gate in `auto-rescan-policy.ts:106-128` allows auto-rescan only when scope fingerprints match and parse-error backlog stays below threshold.

3. **Scope fingerprint mismatch** — Stored fingerprint differs from current scan inputs. Read paths block with fingerprint-delta hint. Resolution paths vary by scenario: widening scope → incremental OK; narrowing → full scan needed; forced replacement → `forceScopeChange: true`. Source: `readiness_and_scope_fingerprint.md:79-101`.

4. **Scan failures** — Tree-sitter parser failures quarantine files in the skip-list, surfaced as `parserHealth: "quarantined"` with `parserSkipList.sample` in status output. Fix: inspect and repair files; accept quarantine; or run `code_graph_apply` with `repair-nodes`. Also: auto-index 10-second timeout aborts via `AbortController` (`ensure-ready.ts:498-533`), and guarded full scan denial returns `autoRescanSafety: 'blocked'` with a reason (`ensure-ready.ts:625-635`).

5. **Launcher exits with standalone-storage guard violation** — `SPECKIT_CODE_GRAPH_DB_DIR` points outside the workspace. Fix: use a workspace-internal path or unset the override. Source: `INSTALL_GUIDE.md:240`, `database_path_policy.md:71-72`.

6. **Plugin bridge fails on startup** — `mcp_server/plugin_bridges/` imports point at modules that moved to `system-spec-kit` post-extraction. Currently non-functional; fix is a follow-on packet. Source: `INSTALL_GUIDE.md:246`, `README.md:242`.

**Most likely user questions with grounded answers:**

**Q1: "Why does this tool refuse to answer instead of returning empty results?"**
A: The false-safe guarantee (`SKILL.md:28-29`). Returning empty arrays from a stale index trains agents to act on false information. A `blocked` payload with `requiredAction` is more useful — especially during refactors. This is a hard refuse, not a soft degrade (`ARCHITECTURE.md:136`). Every read-path tool consults `ensureCodeGraphReady()` before answering (`SKILL.md:311`).

**Q2: "When do I use System Code Graph vs grep?"**
A: Use `grep` for exact text matching. Use code graph tools when relationships, symbols, freshness, or impact matter. The structural-versus-semantic boundary: semantic search answers "what does this code mean"; structural indexing answers "what does this code touch" (`SKILL.md:14-18`). The tools answer different questions than text search; never fall back to text search when code graph is unavailable — report and stop (`SKILL.md:291-292`).

**Q3: "Why are the skill folder and MCP server names different?"**
A: Five identifiers refer to this skill: skill folder slug (`system-code-graph`), MCP server name (`mk-code-index`), MCP config key (`mk_code_index`), launcher file, and plugin bridge file. Names are stable per layer per ADR-002 (`references/runtime/naming_conventions.md:42-53`). The two are allowed to diverge in exchange for tool-call stability — renaming would invalidate every config across all six runtimes (`naming_conventions.md:59-61`).

**Q4: "Can I run this without mk-spec-memory?"**
A: Yes. The standalone MCP server boots independently. No runtime dependency on `mk-spec-memory`. `README.md:264-266` and `INSTALL_GUIDE.md:77`. The TypeScript build emits only this package's runtime under `mcp_server/dist/` (`ARCHITECTURE.md` ADR-005).

**Q5: "What does readiness vs trust state mean?"**
A: Two separate signals. Readiness answers "does the graph reflect current workspace state"; verification trust answers "did the graph pass its gold-query battery recently." A graph can be `fresh` while `goldVerificationTrust` is `absent` or `stale` (`readiness_and_scope_fingerprint.md:42-46`). Both must be acceptable before verification-gated decisions.

---

### 6. STALE FACTS IN CURRENT README

None found.

Every claim in `README.md` that was verifiable against canonical sources (`SKILL.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`, `tool-schemas.ts`, `references/*`, `feature_catalog/feature_catalog.md`, `manual_testing_playbook/manual_testing_playbook.md`, `mcp_server/handlers/`, `mcp_server/lib/`) checked out consistent:

- **8 MCP tools** — matches `tool-schemas.ts:186-195` (8 entries) and `INSTALL_GUIDE.md:59,66` and `tool_surface.md:13`.
- **14 feature catalog entries, 7 groups** — matches `feature_catalog.md:22-34` (counts verified per-group: 2+3+1+2+4+1+1=14, 7 groups).
- **22 manual testing playbook scenarios, 9 groups** — matches `manual_testing_playbook.md:19` (counts verified per-group: 2+4+2+1+2+3+2+5+1=22, 9 groups).
- **Tool operations and primary files** — all handler files (`scan.ts`, `query.ts`, `status.ts`, `context.ts`, `classify-query-intent.ts`, `verify.ts`, `apply.ts`, `detect-changes.ts`) confirmed present in `mcp_server/handlers/`. All lib files (`structural-indexer.ts`, `readiness-contract.ts`, `code-graph-db.ts`, `query-intent-classifier.ts`, `code-graph-context.ts`, `gold-query-verifier.ts` (UNKNOWN exact filename — the README says `gold-query-verifier.ts`), `diff-parser.ts`, `apply-orchestrator.ts`) confirmed present or consistent with naming patterns in `mcp_server/lib/`.
- **Configuration table** — all 5 `INDEX_*` flags, `MAINTAINER_MODE`, `PARSER_SKIP_LIST_ENABLED`, `LAUNCHER_IDLE_TIMEOUT_MIN` match `INSTALL_GUIDE.md:152-185` and `README.md:175-188`.
- **Troubleshooting table** — all 6 entries in README §7 match corresponding entries in `INSTALL_GUIDE.md §8` with equivalent causes and fixes.
- **FAQ** — all 6 Q&As consistent with canonical docs (ADR-002 naming rationale, structural-vs-semantic boundary, readiness contract, ownership boundary, independent boot, template scope).
- **Readiness state machine** — `fresh`/`stale`/`empty`/`error` (4 freshness values), `blocked` as refusal payload, `absent` as trust projection — matches `readiness_and_scope_fingerprint.md:51-60` and `ARCHITECTURE.md:136` and `code_graph_readiness_check.md:107-108`.
- **False-safe guarantee** — README's emphasis on "No silent empty arrays" and `blocked` payloads matches `SKILL.md:29`, `ARCHITECTURE.md:116`, and `readiness_and_scope_fingerprint.md:32-33`.
- **Structural-versus-semantic boundary** — README §1 and FAQ Q2 match `SKILL.md:14-18,50-53`.
- **Version** — README does not claim a version; SKILL.md frontmatter and INSTALL_GUIDE both agree on `1.0.3.2`.

**One note on a minor classification choice:** `code_graph_verify` is grouped under "Impact Analysis" in README §3.3, while SKILL.md §3 and `tool_surface.md:40` classify it as "Maintenance." Both are valid perspectives — verify *enables* safe impact analysis, but its primary operation (running gold-query battery) is maintenance. This is an organizational choice in the README, not a factual error about what the tool does. All factual claims about verify's purpose, input schema, and behavior are correct.