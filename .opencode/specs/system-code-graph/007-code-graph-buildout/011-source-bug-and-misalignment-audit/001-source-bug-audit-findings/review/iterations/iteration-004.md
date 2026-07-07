### DR-004-01 [P2] [traceability] INSTALL_GUIDE still describes the old migration direction

file: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:211`

evidence:

```md
53: The server is runtime-standalone: it does not depend on `mk-spec-memory` being installed or running first. Its database lives at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`, shared across runtimes and auto-migrated from the legacy skill-local location on first launch.
```

```md
209: ### Migration
210: 
211: Legacy installs (database at `.opencode/skills/system-code-graph/mcp_server/database/`) are auto-migrated to the standalone shared location on next launch. The legacy database file is preserved as a backup; the launcher copies (does not move) the SQLite triplet, readiness marker, and launcher state file.
```

```js
787:     // Auto-migrate DB from the former shared standalone location back to skill-local.
788:     // The former DB is preserved as a backup (copy, not move).
789:     const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
790:     if (!exists(path.join(dbDir, 'code-graph.sqlite')) && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))) {
```

why: The install guide's overview and migration section still say the skill-local path is the legacy source and that launch migrates it to a shared/standalone location. The launcher does the opposite: it treats `.opencode/.spec-kit/code-graph/database` as the former shared source and copies it back into the skill-local `mcp_server/database` directory. This is separate from DR-001-04's `database_path_policy.md` duplicate; the operator-facing install guide remains independently reversed.

fix: Change the install guide migration text to say former shared `.opencode/.spec-kit/code-graph/database/` installs are copied back to `.opencode/skills/system-code-graph/mcp_server/database/`, and remove the "legacy skill-local" / "standalone shared location" wording.

confidence: 0.96

### DR-004-02 [P2] [traceability] mcp_server README diagram still points the DB flow at `.opencode/.spec-kit`

file: `.opencode/skills/system-code-graph/mcp_server/README.md:56`

evidence:

```md
56:         │ lib/             │          │ handlers/       │    │ shared DB dir      │
57:         │ readiness marker │          │ tool execution  │    │ .opencode/.spec-kit│
58:         └──────────────────┘          └─────────────────┘    └────────────────────┘
```

```md
60: Dependency direction:
61: index.ts ───▶ tool-schemas.ts (ListTools response)
62: index.ts ───▶ tools/ ───▶ handlers/ ───▶ lib/ ───▶ core/ ───▶ shared DB dir
```

```md
142: | Storage | Code graph database files live in `.opencode/skills/system-code-graph/mcp_server/database/` and are accessed through library modules. |
```

```ts
14: // Default DB dir = the SKILL-LOCAL location `.opencode/skills/system-code-graph/mcp_server/database`
15: // (operator directive 2026-05-29: keep code-graph state inside the skill folder, which every runtime
16: // already shares via the `.opencode/skills` symlink, so a skill-local DB is a single shared instance).
```

why: The same README later states the current storage path correctly, and `core/config.ts` resolves the skill-local default. The architecture diagram and flow text still teach the pre-reversal shared `.spec-kit` DB path, leaving a direct doc-internal contradiction on the runtime's storage boundary.

fix: Update the diagram and flow label to `skill-local DB dir` / `.opencode/skills/system-code-graph/mcp_server/database`, matching the boundary table and `core/config.ts`.

confidence: 0.95

### DR-004-03 [P2] [traceability] ARCHITECTURE ADR-003 still says `code_graph_status` refreshes the readiness marker

file: `.opencode/skills/system-code-graph/ARCHITECTURE.md:166`

evidence:

```md
164: | ADR-001 | Hook ownership stays with the spec-kit sibling package; code-graph data accessed through a stable boundary import | Accepted |
165: | ADR-002 | Plugin and bridge names use `mk-code-graph` while the MCP server identity stays as `mk-code-index` for caller stability | Accepted |
166: | ADR-003 | Single-writer invariant on the SQLite graph: the scan loop (`code_graph_scan`) is the only writer of graph rows. Other tools are graph-read-only with two bounded, non-graph side effects: `code_graph_status` refreshes the file-based readiness marker, and the read-path handlers may run an inline self-heal reindex (`ensureCodeGraphReady`) which itself goes through the scan path. `code_graph_apply` mutates only under its verification-gated recovery contract. | Accepted |
```

```ts
196: /** Handle code_graph_status tool call */
197: export async function handleCodeGraphStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
198:   // Read the readiness snapshot FIRST so the degraded envelope still surfaces
199:   // even when `graphDb.getStats()` throws (e.g. DB file corrupted or locked).
200:   // Previously stats was called first; on crash the catch path returned a
201:   // generic "Code graph not initialized" error and action-level readiness was
202:   // hidden. The snapshot helper is read-only, so calling it earlier never
203:   // causes side effects.
```

```ts
129: try {
130:   writeCodeGraphReadinessMarker(process.env.MK_CODE_INDEX_ROOT_DIR || process.cwd());
131: } catch (error: unknown) {
132:   const message = error instanceof Error ? error.message : String(error);
133:   console.error(`[mk-code-index] readiness marker write failed: ${message}`);
```

why: CG-001's remediation made `code_graph_status` a read-only health probe, and the handler now explicitly states the readiness snapshot has no side effects. The remaining marker write is at server startup in `index.ts`, not in the status handler. The ADR row therefore preserves the old side-effect contract and can mislead future reviewers about which tools mutate runtime state.

fix: Rewrite ADR-003 so `code_graph_status` is graph-read-only and side-effect-free; document the startup marker write under server bootstrap instead of the status tool.

confidence: 0.94

### DR-004-04 [P2] [traceability] Feature catalog still routes removed deep-loop coverage graph tools through system-spec-kit MCP files

file: `.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md:14`

evidence:

```md
14: The `mk-code-index` runtime exposes code graph, detect_changes and structural tools through the code graph dispatcher. Deep-loop coverage graph tools still dispatch through the system-spec-kit MCP server.
```

```md
36: | `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:20-31` | Tool surface | registers `code_graph_*` and `detect_changes` names |
37: | `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:60-100` | Tool surface | dispatches those names to handlers |
38: | `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:30-49` | Tool surface | registers and dispatches deep-loop coverage graph tools |
39: | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:19-216` | Schema | defines code graph, detect_changes and structural schemas |
40: | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:613-705` | Schema | defines deep-loop coverage graph schemas |
```

```md
176: ## 6. COVERAGE GRAPH
177: 
178: > **Note (arc 118):** The four `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools were removed in arc 118 (FULL_ISOLATE_NO_MCP). Each tool was replaced by a direct `.cjs` script entry point under `.opencode/skills/deep-loop-runtime/scripts/`. Catalog entries below are retained as historical reference; the script paths under each entry's "Current Reality" are the live invocation surface.
```

```ts
17: /** All tool dispatch modules in priority order */
18: export const ALL_DISPATCHERS = [
19:   contextTools,
20:   memoryTools,
21:   causalTools,
22:   checkpointTools,
23:   lifecycleTools,
24:   // codeGraphTools intentionally omitted: standalone system_code_graph owns MCP dispatch
25:   // skillGraphTools intentionally omitted: standalone mk_skill_advisor owns MCP dispatch
```

why: The root catalog now says the deep-loop MCP tools were removed and replaced by direct `.cjs` scripts, but the tool-registration feature file still tells readers that system-spec-kit registers and dispatches those tools and cites stale schema ranges. The cited `system-spec-kit` dispatcher currently lists only context, memory, causal, checkpoint and lifecycle modules, so the feature file's source anchors no longer describe the live surface.

fix: Update `06--mcp-tool-surface/01-tool-registrations.md` to remove the system-spec-kit MCP dispatch/schema rows or mark them historical, and point live coverage graph references at `.opencode/skills/deep-loop-runtime/scripts/{query,status,upsert,convergence}.cjs`.

confidence: 0.93

newFindings: 4, dimension: traceability
