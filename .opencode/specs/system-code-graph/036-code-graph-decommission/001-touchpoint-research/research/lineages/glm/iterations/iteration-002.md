# Iteration 002 — Runtime Registrations, Launchers, Plugins, Install Surfaces

**Lineage:** glm | **Iteration:** 2 of 5 | **Focus:** Launcher chain, plugins, install surfaces, remaining tool ids
**Timestamp:** 2026-07-27T20:34:00.000Z

## Focus
Deep-dive the runtime registration chain: launchers (`mk-code-index-launcher.cjs`, `code-index.cjs`, `mk-spec-memory-launcher.cjs`), plugins (`mk-code-graph.js`, `mk-code-graph-freshness.js`), shared IPC bridge, install surfaces, and confirmation of all 8 tool ids via `tool-schemas.ts`.

## Method
- `rg --hidden --no-ignore -n` for tool ids in `tool-schemas.ts`.
- `rg --hidden --no-ignore -n` for `require()`/`import` and skill-path references in the launcher and plugin files.
- `wc -l` for file sizes.
- `rg` for plugin registration mechanism in `opencode.json` and `.opencode/plugins/README.md`.

## Findings

### F2.1 — All 8 `code_graph_*` tool ids confirmed (CONFIRMED)
From `.opencode/skills/system-code-graph/mcp-server/tool-schemas.ts`:
1. `code_graph_scan` (line 14)
2. `code_graph_query` (line 46)
3. `code_graph_status` (line 69)
4. `code_graph_context` (line 76)
5. `code_graph_classify_query_intent` (line 113)
6. `code_graph_verify` (line 126)
7. `code_graph_apply` (line 149)
8. `detect_changes` (line 175)
- MCP prefix: `mcp__mk_code_index__<tool>`. [SOURCE: tool-schemas.ts:14-175, README.md:657]

### F2.2 — `.claude/agents/context.md` tool grant confirmed (CONFIRMED)
`.claude/agents/context.md:4` — `tools: Read, Grep, Glob, mcp__mk_spec_memory__*, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__code_graph_status`
- This completes the agent tool-grant set from iteration 1. [SOURCE: .claude/agents/context.md:4]

### F2.3 — Launcher chain: `mk-code-index-launcher.cjs` (CONFIRMED, blocking)
- **File:** `.opencode/bin/mk-code-index-launcher.cjs` (1944 lines)
- **Requires:** `./lib/launcher-ipc-bridge.cjs` (line 225), `./lib/launcher-session-proxy.cjs` (line 18)
- **Skill path binding:** `kitDir = path.join(skillsDir, 'system-code-graph')` (lines 152, 285)
- **Hard dependency:** throws if `system-code-graph` directory not found (line 1353: `throw new Error('mk-code-index skill (system-code-graph directory) not found...')`)
- **Failure mode if skill removed:** launcher crashes at startup with explicit error. Every runtime registration (opencode.json, .claude/mcp.json, .codex/config.toml) points at this file, so all three runtimes break. [SOURCE: mk-code-index-launcher.cjs:152,225,285,1353]

### F2.4 — `code-index.cjs` CLI front door (CONFIRMED, blocking)
- **File:** `.opencode/bin/code-index.cjs` (119 lines)
- **Purpose:** "Runs the built daemon-backed mk-code-index CLI" (line 5)
- **Skill path binding:** `skillDir = path.join(opencodeDir, 'skills', 'system-code-graph')` (line 22)
- **Cross-skill dependency:** `require('...system-spec-kit/scripts/lib/dist-freshness.cjs')` (line 24) — the code-graph CLI depends on spec-kit's dist-freshness checker.
- **Socket dir:** `/tmp/mk-code-index` (line 25)
- **Failure mode if skill removed:** CLI crashes; any shell-out to `code-index.cjs` fails. [SOURCE: code-index.cjs:5,22,24,25]

### F2.5 — SHARED launcher infrastructure — critical coupling (CONFIRMED, blocking)
- **`launcher-ipc-bridge.cjs`** (555 lines): branches on `serviceName`:
  - `mk-spec-memory` (line 86) → spec-memory socket path
  - `mk-code-index` (line 89) → code-graph database path
  - **Implication:** This file is SHARED between mk-code-index and mk-spec-memory launchers. Deleting it would break mk-spec-memory. Removal must strip only the `mk-code-index` branch, not the file. [SOURCE: launcher-ipc-bridge.cjs:86-92]
- **`launcher-session-proxy.cjs`** (33805 bytes): "servers; only the tools/call replayability set differs per server (memory tools vs code-graph..." (line 141). Required by both `mk-code-index-launcher.cjs:18` and `mk-spec-memory-launcher.cjs:19`. **Same shared-file constraint.** [SOURCE: launcher-session-proxy.cjs:141, mk-spec-memory-launcher.cjs:19]
- **`mk-spec-memory-launcher.cjs`** references `system-code-graph` database dir at lines 102, 346, 1150 — the spec-memory launcher has a code-graph DB path coupling for the shared-database era. [SOURCE: mk-spec-memory-launcher.cjs:102,346,1150]

### F2.6 — Plugins: auto-discovered, two code-graph plugins (CONFIRMED, blocking)
OpenCode auto-discovers `.js` files in `.opencode/plugins/` (no explicit registration in `opencode.json`). Two code-graph plugins:
1. **`mk-code-graph.js`** (514 lines): imports from `../skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-transport.mjs` (line 37) and `mk-code-graph-bridge.mjs` (line 51). Registers `mk_code_graph_status` tool (line 377). Hooks: `experimental.chat.system.transform`, `experimental.chat.messages.transform`, `experimental.session.compacting`, `session.created`, `session.deleted`. [SOURCE: mk-code-graph.js:37,51,377, plugins/README.md:128]
2. **`mk-code-graph-freshness.js`** (241 lines): requires `../skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs` (line 33). Hooks: `tool.execute.before`, `tool.execute.after`, `session.created`, `server.instance.disposed`, `global.disposed`. Manages scan locks, edit debouncing, stale-state sweeping. [SOURCE: mk-code-graph-freshness.js:33,131,144, plugins/README.md:127]
- **Failure mode if skill removed:** Both plugins `require`/`import` from the `system-code-graph` skill directory. If the skill is deleted first, plugin load crashes at session start. Plugins must be removed before or in lockstep with the skill directory.
- **Runtime state dir:** `.opencode/skills/.code-graph-freshness-state/` — freshness plugin runtime state. [SOURCE: plugins/README.md:162]

### F2.7 — Install surface documentation (CONFIRMED, live doc)
- `.opencode/install-guides/README.md:84` — install guide table row for system-code-graph
- `.opencode/install-guides/README.md:319` — MCP server table: "System Code Graph (`mk_code_index`)| MCP Server | Structural AST + blast-radius + neighborhood context (8 tools)"
- `.opencode/install-guides/README.md:380` — "mk_code_index is NOT in the Minimal bundle"
- `.opencode/install-guides/README.md:699-715` — §10.4 full install section with `npm --prefix .opencode/skills/system-code-graph install` and build check
- `.opencode/skills/system-code-graph/INSTALL-GUIDE.md` — skill-local install guide (part of the skill being decommissioned)
- `.opencode/skills/system-code-graph/scripts/doctor.sh` (73 lines) — skill-local health check script [SOURCE: install-guides/README.md:84,319,380,699-715, doctor.sh:5]

### F2.8 — `.opencode/bin/README.md` references (CONFIRMED, live doc)
- Documents `code-index.cjs` and `mk-code-index-launcher.cjs` as bin entries. [SOURCE: .opencode/bin/README.md (in iteration-1 hit list)]

## Assessment
- **newInfoRatio:** 0.92 — 7 of 8 findings fully new; F2.2 completes the agent tool-grant set from iteration 1 (refinement).
- **Questions advanced:** q1 (launcher chain confirmed), q2 (executable dependencies + shared IPC coupling confirmed), q4 (install docs confirmed).
- **Critical risk surfaced:** `launcher-ipc-bridge.cjs` and `launcher-session-proxy.cjs` are SHARED between mk-code-index and mk-spec-memory. Naive deletion breaks spec-memory. This is an ordering constraint: strip the code-graph branch, do not delete the shared file.

## Dead Ends
- Checked `opencode.json` for an explicit plugins section — none exists. Plugins are auto-discovered, so there is no registration entry to remove; the plugin files themselves are the touchpoints.

## Next Focus
Iteration 3: External executable dependencies and shared contracts — `system-spec-kit` integration (`code-graph-boundary.ts`, `code-index-cli-fallback.ts`, `context-server.ts`, `tool-schemas.ts`, `shared/code-graph-contracts.ts`), the skill-advisor graph (`skill-graph.json`, scorer fusion lanes), and the coverage-graph schema in `system-deep-loop`.
