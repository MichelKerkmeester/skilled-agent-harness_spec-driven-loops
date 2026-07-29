# Iteration 005 — Doctrine, Doc References, Full Agent Tree, Ordering Graph

**Lineage:** glm | **Iteration:** 5 of 5 | **Focus:** Cross-runtime agent grants, command grants, doctrine, ordering graph, recommendations
**Timestamp:** 2026-07-27T20:52:00.000Z

## Focus
Complete the touchpoint inventory with the full cross-runtime agent tool-grant tree, command-level tool grants, doctrine claims in root docs and constitutional rules, and produce the dependency-ordered removal graph with per-consumer remove-vs-fallback recommendations and rollback risk.

## Method
- `rg --hidden --no-ignore -l "mcp__mk_code_index__"` across all four agent trees (.claude, .codex, .pi, .opencode).
- `rg --hidden --no-ignore -n` for code-graph doctrine in agent bodies, commands, spec-kit SKILL.md, and constitutional rules.
- Synthesis of all 5 iterations into the ordering graph.

## Findings

### F5.1 — Full cross-runtime agent tool-grant tree (CONFIRMED, blocking)
**8 agents × 4 runtime trees = 32 agent files** with `mcp__mk_code_index__*` tool grants:
- **Agents:** ai-council, context, debug, deep-alignment, deep-improvement, deep-research, deep-review, review
- **Runtime trees:** `.claude/agents/*.md`, `.codex/agents/*.toml`, `.pi/agents/*.md`, `.opencode/agents/*.md`
- **Grant patterns:**
  - `deep-review`: `detect_changes, code_graph_query, code_graph_context`
  - `deep-alignment`: `code_graph_query, code_graph_context`
  - `review`: `detect_changes`
  - `context`: `code_graph_query, code_graph_context, code_graph_status`
  - `deep-research`, `deep-improvement`, `ai-council`, `debug`: various (query/context or body-only doctrine)
- **.opencode/agents/** uses a different grant syntax: `code_graph_query: allow` in a permissions block (e.g., `deep-alignment.md:15-16`, `context.md:15-17`) plus `mk_code_index` in allowed MCP servers list (`context.md:25`). [SOURCE: .opencode/agents/context.md:15-17,25, .opencode/agents/deep-alignment.md:15-16, .opencode/agents/deep-research.md:15-16]
- **Failure mode:** 32 files must have their tool grants stripped. Missing any one leaves a dangling reference to a non-existent MCP tool.

### F5.2 — Agent body doctrine: wedged-daemon fallback + CLI front doors (CONFIRMED, live doctrine)
Every `.opencode/agents/*` file contains a "Wedged-daemon fallback" paragraph referencing `mcp__mk_code_index__*` and the warm-daemon CLI front door `node .opencode/bin/code-index.cjs <tool> --format json --timeout-ms 5000 --warm-only`:
- `ai-council.md:134`, `review.md:103`, `deep-alignment.md:262`, `deep-improvement.md:72`, `deep-research.md:342`, `debug.md:357`
- `context.md` has extensive code-graph routing tables (lines 59, 79-87, 92-93, 117, 139, 172, 176, 414-416) and GRAPH HEALTH instructions.
- **Classification:** Live doctrine. Must be stripped from all 8 agent bodies across all 4 runtime trees. [SOURCE: .opencode/agents/ai-council.md:134, review.md:103, context.md:59-87]

### F5.3 — Command-level tool grants (CONFIRMED, blocking)
**11 commands** grant `mcp__mk_code_index__*` tools in their `allowed-tools:` frontmatter:
1. `.opencode/commands/deep/research.md:4` — `code_graph_query, code_graph_context`
2. `.opencode/commands/deep/review.md:4` — `code_graph_query, code_graph_context`
3. `.opencode/commands/doctor/update.md:4` — `code_graph_status, code_graph_query, code_graph_context, code_graph_scan, code_graph_apply, detect_changes` (6 tools)
4. `.opencode/commands/doctor/speckit.md:4` — `code_graph_status, code_graph_query, code_graph_context, detect_changes`
5. `.opencode/commands/memory/search.md:4` — `code_graph_query, code_graph_context`
6. `.opencode/commands/speckit/implement.md:4` — `code_graph_query`
7. `.opencode/commands/speckit/plan.md:4` — `code_graph_query`
8. `.opencode/commands/speckit/complete.md:4` — `code_graph_query`
9. `.opencode/commands/create/agent.md:4` — `code_graph_query`
10. `.opencode/commands/create/skill.md:4` — `code_graph_query`
11. `.opencode/commands/create/changelog.md:4` — `code_graph_query`
- **Also:** `doctor/speckit.md:45` references the code-graph doctor route in a table. [SOURCE: each command file line 4]
- **Failure mode:** Commands with granted tools that no longer exist will error or silently drop the tool. Must strip all 11 command frontmatters.

### F5.4 — Deep-loop command doctrine (CONFIRMED, live doctrine)
- `.opencode/commands/deep/research.md:17` — "Code Graph ownership: `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs now live under `.opencode/skills/system-code-graph/`."
- `.opencode/commands/deep/review.md:144` — "Code graph tool IDs remain stable as `code_graph_query` and `code_graph_context`; implementation and docs live under `.opencode/skills/system-code-graph/`."
- **Classification:** Live doctrine claiming tool ID stability. Must be removed. [SOURCE: research.md:17, review.md:144]

### F5.5 — spec-kit SKILL.md doctrine (CONFIRMED, live doctrine)
- `.opencode/skills/system-spec-kit/SKILL.md:441` — "code graph, and Code Graph readiness details live in..."
- `.opencode/skills/system-spec-kit/SKILL.md:449` — "The `system-code-graph` skill owns the 8-tool `mcp__mk_code_index__*` surface: read tools (`code_graph_query`, `code_graph_context`, `detect_changes`) return blocked/degraded payloads... maintenance tools (`code_graph_scan`, `code_graph_apply`, `code_graph_verify`)..."
- **Classification:** Live doctrine. Must be updated to remove the code-graph surface description. [SOURCE: SKILL.md:441,449]

### F5.6 — spec-kit constitutional/gate-tool-routing.md (CONFIRMED, live doctrine)
- `:42-43` — routing table: "Semantic/concept → `mcp__mk_code_index__code_graph_query` (Code Graph)", "Structural → `code_graph_query` (Code Graph)"
- `:71` — "Always-on code-graph context injection: Graph signals are injected into every retrieval response regardless of causal boost state (SPECKIT_GRAPH_CONTEXT_INJECTION)."
- `:79` — "routing tables are derived from the search handlers in `system-code-graph/` and `system-spec-kit/mcp-server/handlers/`..."
- **Classification:** Constitutional rule. Must update routing tables to remove code-graph, remove the injection claim, and update the handler derivation note. [SOURCE: gate-tool-routing.md:42-43,71,79]

### F5.7 — Root doc doctrine (CONFIRMED, live doctrine — consolidates iteration 1)
- `AGENTS.md:342` — routing table: "Code Graph (`code_graph_query`, `code_graph_context`, `detect_changes`) + Grep"
- `AGENTS.md:378` — "code_graph_scan if needed"
- `.claude/CLAUDE.md:5` — "SEARCH ROUTING: use Code Graph structural search (`mcp__mk_code_index__code_graph_query`) plus Grep..."
- `README.md:590-657,886,1220` — extensive end-user code graph documentation, tool count table, skill description
- `.claude/SYNC.md:76` — `tools: ... mcp__mk_code_index__detect_changes`
- **Note:** `AGENTS.md` = `CLAUDE.md` (symlink). One edit covers both. [SOURCE: AGENTS.md:342,378, .claude/CLAUDE.md:5, README.md:590-657, .claude/SYNC.md:76]

---

## ORDERING GRAPH (Dependency-ordered removal)

```
Phase 0: HOOKS & REAPERS (remove first — they fire on every tool call/commit/session)
  ├─ .claude/settings.json:165 (freshness hook)
  ├─ .codex/hooks.json:101 (freshness hook)
  ├─ .devin/hooks.v1.json:109 (freshness hook)
  ├─ .opencode/scripts/git-hooks/post-commit (strip code-graph invalidation)
  ├─ .opencode/scripts/session-cleanup.sh:99,102 (strip code-graph process patterns)
  └─ .opencode/scripts/orphan-mcp-sweeper.sh:209,213 (strip code-graph patterns)
     │
     ▼
Phase 1: AGENT & COMMAND TOOL GRANTS (32 agent files + 11 command files)
  ├─ .claude/agents/*.md (8 files) — strip mcp__mk_code_index__* from tools:
  ├─ .codex/agents/*.toml (8 files) — strip tool grants
  ├─ .pi/agents/*.md (8 files) — strip tool grants + body doctrine
  ├─ .opencode/agents/*.md (8 files) — strip permissions block + body doctrine
  └─ .opencode/commands/{deep,doctor,speckit,create,memory}/*.md (11 files) — strip allowed-tools
     │
     ▼
Phase 2: SPEC-KIT DECOUPLING (the boundary — must complete before skill deletion)
  ├─ context-server.ts — remove callCodeGraphTool calls, routing fields, session bootstrap checks
  ├─ hooks/claude/session-prime.ts — remove code-graph-boundary import + guidance injection
  ├─ hooks/memory-surface.ts — remove code-graph-boundary import + scan/query recommendations
  ├─ hooks/cursor/post-tool-use.mjs:39 — remove code-graph-freshness.cjs reference
  ├─ lib/enrichment/passive-enrichment.ts — remove callCodeGraphTool import + symbol enrichment
  ├─ mcp-server/lib/code-graph-boundary.ts — REMOVE (after all importers decoupled)
  ├─ mcp-server/hooks/code-index-cli-fallback.ts — REMOVE
  ├─ mcp-server/tool-schemas.ts — strip code_graph_query descriptions, structuralContext fields
  ├─ mcp-server/scripts/finalize-dist.mjs:22 — remove 'system-code-graph' from dist list
  └─ shared/code-graph-contracts.ts — TRIM to spec-kit-only types or REMOVE if unused
     │
     ▼
Phase 3: SKILL-ADVISOR GRAPH
  ├─ skill-graph.json — remove system-code-graph node + adjacency + signals
  ├─ scorer/fusion.ts:530 — remove semanticSearchCodeGraphBonus
  ├─ scorer/lanes/explicit.ts — remove all system-code-graph scoring weights
  ├─ scorer/lanes/lexical.ts:29 — remove system-code-graph synonyms
  ├─ skill_advisor.py — remove Python parity entries
  └─ Rebuild skill-graph.json
     │
     ▼
Phase 4: PLUGINS
  ├─ .opencode/plugins/mk-code-graph.js — REMOVE
  ├─ .opencode/plugins/mk-code-graph-freshness.js — REMOVE
  └─ .opencode/plugins/tests/mk-code-graph*.test.cjs — REMOVE
     │
     ▼
Phase 5: MCP REGISTRATIONS (remove after plugins — plugins import from skill)
  ├─ opencode.json:69 — remove mk_code_index block
  ├─ .claude/mcp.json:58 — remove mk_code_index block (covers .mcp.json + .cursor/mcp.json symlinks)
  └─ .codex/config.toml:31 — remove [mcp_servers.mk_code_index]
     │
     ▼
Phase 6: LAUNCHERS & CLI (remove after registrations — registrations point at them)
  ├─ .opencode/bin/mk-code-index-launcher.cjs — REMOVE
  ├─ .opencode/bin/code-index.cjs — REMOVE
  ├─ .opencode/bin/lib/launcher-ipc-bridge.cjs — STRIP mk-code-index branch (KEEP for mk-spec-memory)
  ├─ .opencode/bin/lib/launcher-session-proxy.cjs — STRIP code-graph replayability set (KEEP for mk-spec-memory)
  └─ .opencode/bin/mk-spec-memory-launcher.cjs — STRIP code-graph DB path references (lines 102,346,1150)
     │
     ▼
Phase 7: /DOCTOR SURFACE
  ├─ _routes.yaml:83-105 — remove code-graph route
  ├─ doctor-code-graph.yaml — REMOVE (278 lines, code-graph-specific)
  ├─ doctor-mcp-debug.yaml — strip mk_code_index entries
  ├─ doctor-mcp-install.yaml — strip mk_code_index entries
  ├─ mcp-doctor.sh — remove diagnose_mk_code_index() + mk_code_index references
  ├─ doctor-mcp-presentation.txt — strip mk_code_index
  └─ doctor-update.yaml — strip system-code-graph references
     │
     ▼
Phase 8: CI
  └─ .github/workflows/isolation-check.yml — REMOVE or rewrite (all 3 audit steps target code-graph)
     │
     ▼
Phase 9: SKILL DIRECTORY (delete last — everything above still referenced it)
  ├─ .opencode/skills/system-code-graph/ — DELETE entire directory
  └─ .opencode/skills/.code-graph-freshness-state/ — DELETE
     │
     ▼
Phase 10: DOCS (update after skill is gone — references become dead links)
  ├─ README.md — remove §code-graph sections (lines 590-657, 886, 1220, 1401)
  ├─ AGENTS.md (=CLAUDE.md symlink) — remove routing table rows (lines 342, 378)
  ├─ .claude/CLAUDE.md:5 — remove SEARCH ROUTING code-graph line
  ├─ .claude/SYNC.md:76 — strip detect_changes from tools
  ├─ .opencode/install-guides/README.md — remove §10.4, table rows (lines 84,319,380,699-715)
  ├─ .opencode/bin/README.md — remove code-index.cjs, mk-code-index-launcher.cjs entries
  ├─ .opencode/skills/system-spec-kit/SKILL.md:441,449 — remove code-graph doctrine
  ├─ .opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:42-43,71,79 — update routing
  ├─ .opencode/skills/system-deep-loop/runtime/references/integration-points.md:82-90 — remove code-graph refs
  ├─ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md:40 — remove code-graph ref
  ├─ .opencode/commands/deep/research.md:17 — remove code-graph ownership note
  └─ .opencode/commands/deep/review.md:144 — remove code-graph ownership note
```

**ARCHIVAL (inventory only — DO NOT EDIT):**
- `.opencode/specs/system-code-graph/**` (including `z_archive/`) — historical spec record
- `.opencode/skills/system-code-graph/changelog/**` — skill changelogs
- `.opencode/skills/system-deep-loop/deep-*/changelog/**` — deep-loop changelogs referencing code-graph
- `.opencode/skills/*/benchmark/reports/**` — benchmark reports
- `.worktrees/**` — worktree checkouts with archival copies

---

## PER-CONSUMER REMOVE-VS-FALLBACK RECOMMENDATIONS

| # | Consumer | Recommendation | Rationale | Rollback Risk |
|---|----------|---------------|-----------|---------------|
| 1 | Runtime registrations (3 files) | **REMOVE** | MCP server is being decommissioned; no degraded mode | Low — re-add the registration block |
| 2 | Agent tool grants (32 files) | **REMOVE** | Agents already have wedged-daemon fallback to Grep/Read | Low — re-add the tool grant |
| 3 | Command tool grants (11 files) | **REMOVE** | Commands fall back to Grep/Glob | Low |
| 4 | Freshness hooks (3 files) | **REMOVE** | Hook is code-graph-specific; no other purpose | Low |
| 5 | Git post-commit hook | **STRIP code-graph logic** | Hook may have other future purposes; strip only the invalidation | Medium — must preserve non-code-graph hook logic |
| 6 | Session reapers (2 scripts) | **STRIP code-graph patterns** | Scripts serve other MCP servers | Low |
| 7 | Plugins (2 files + tests) | **REMOVE** | Code-graph-specific; no fallback | Low |
| 8 | Launchers (mk-code-index-launcher.cjs, code-index.cjs) | **REMOVE** | Code-graph-specific | Low |
| 9 | Shared launcher infra (ipc-bridge, session-proxy) | **FALLBACK: strip branch, keep file** | SHARED with mk-spec-memory; deletion breaks spec-memory | HIGH — must not delete the file |
| 10 | mk-spec-memory-launcher.cjs | **STRIP code-graph DB refs** | Launcher remains for spec-memory | Medium — must preserve spec-memory logic |
| 11 | Spec-kit boundary (code-graph-boundary.ts) | **REMOVE after decoupling** | No fallback; spec-kit routes to Grep/Glob | Medium — 4 importers must be decoupled first |
| 12 | Spec-kit hooks (3 hooks) | **STRIP code-graph imports** | Hooks remain for spec-memory | Medium |
| 13 | Shared contracts (code-graph-contracts.ts) | **FALLBACK: trim or remove** | Spec-kit types may still depend on some contracts | Medium — verify no surviving importers |
| 14 | Skill-advisor graph | **REMOVE node + rebuild** | No fallback; advisor must not route to non-existent skill | Low — re-add the node |
| 15 | /doctor surface | **REMOVE route + strip multi-server assets** | Route is code-graph-specific; multi-server assets remain | Low |
| 16 | CI job (isolation-check.yml) | **REMOVE or rewrite** | All audit steps target code-graph | Low |
| 17 | Docs (README, AGENTS.md, etc.) | **REMOVE code-graph sections** | Update routing to Grep/Glob | Low |
| 18 | Skill directory | **REMOVE (last step)** | Everything above still referenced it | High — irreversible; verify all phases complete first |
| 19 | Archival specs | **INVENTORY ONLY** | Historical record; never edit | N/A |

## Assessment
- **newInfoRatio:** 0.80 — the agent tree (32 files) and command grants (11 files) are new; the ordering graph and recommendations synthesize all 5 iterations.
- **Questions advanced:** q4 (doctrine claims — all confirmed), q5 (ordering graph + recommendations — complete).
- **All 5 key questions now answered with file:line evidence.**

## Dead Ends
- None. All five key questions have been answered with confirmed file:line evidence across 5 iterations.

## Next Focus
Synthesis: compile research.md from all 5 iterations, produce resource-map.md, and emit the convergence report.
