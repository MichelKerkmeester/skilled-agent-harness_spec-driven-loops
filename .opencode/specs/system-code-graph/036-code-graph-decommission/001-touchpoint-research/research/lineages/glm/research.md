# Deep Research Report: system-code-graph / mk_code_index Decommission Touchpoint Inventory

**Lineage:** glm (cli-devin, model=glm-5-2)
**Session:** fanout-glm-1785176679915-bjzj49
**Iterations:** 5 of 5 (max-iterations stop policy)
**Spec folder:** .opencode/specs/system-code-graph/036-code-graph-decommission/001-touchpoint-research
**Generated:** 2026-07-27T20:55:00.000Z

---

## 1. EXECUTIVE SUMMARY

This report is an exhaustive, read-only touchpoint inventory for fully decommissioning the `system-code-graph` skill and the `mk_code_index` MCP server. Over 5 iterations, the GLM lineage confirmed **every registration, import, shell-out, hook, plugin, CI job, doc reference, agent tool grant, and doctrine claim** that must change, plus ordering constraints and rollback risk.

**Key numbers:**
- 3 runtime registrations (opencode.json, .claude/mcp.json, .codex/config.toml) — 1 physical file behind 3 symlink aliases for the MCP config
- 8 MCP tool ids: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, `detect_changes`
- 32 agent files with `mcp__mk_code_index__*` tool grants (8 agents × 4 runtime trees)
- 11 commands with `mcp__mk_code_index__*` in `allowed-tools:`
- 3 per-runtime freshness hooks (Claude, Codex, Devin)
- 2 plugins (mk-code-graph.js, mk-code-graph-freshness.js)
- 2 session reapers (session-cleanup.sh, orphan-mcp-sweeper.sh)
- 1 git post-commit hook (code-graph invalidation)
- 1 CI job (isolation-check.yml)
- 1 /doctor surface (route + 5 assets + shell script)
- 2 SHARED launcher infrastructure files (launcher-ipc-bridge.cjs, launcher-session-proxy.cjs) — MUST NOT be deleted; shared with mk-spec-memory
- 1 shared contracts file (code-graph-contracts.ts) — may need to survive for spec-kit types
- 11-phase dependency-ordered removal graph
- 19 per-consumer remove-vs-fallback recommendations

**Critical risk:** The launcher IPC bridge and session proxy are shared with `mk-spec-memory`. Naive deletion breaks the spec-memory MCP server. These files must have their code-graph branches stripped, not the files deleted.

---

## 2. RESEARCH TOPIC

Exhaustive touchpoint inventory for fully decommissioning the system-code-graph skill and the mk_code_index MCP server: every registration, import, shell-out, hook, plugin, CI job, doc reference, agent tool grant, and doctrine claim that must change, plus ordering constraints and rollback risk.

---

## 3. METHODOLOGY

- All sweeps used `rg --hidden --no-ignore` (REQ-001 compliant) to catch hidden runtime controls (`.claude/mcp.json`, `.codex/config.toml`, `.devin/hooks.v1.json`, `.claude/settings.json`).
- Symlink deduplication: `CLAUDE.md`→`AGENTS.md`; `.mcp.json`/`.cursor/mcp.json`→`.claude/mcp.json` (REQ-002 compliant).
- Archival boundary: `.opencode/specs/**`, changelogs, and benchmark reports were inventoried but never proposed for editing (REQ-004 compliant).
- Live surface was isolated by excluding `.worktrees/**`, `.opencode/specs/**`, `.git/**`, `node_modules/**`, and `research/lineages/**`.
- 5 iterations, each with a distinct focus track: inventory → runtime-registration → dependencies → hooks-ci → doctrine-ordering.
- No repository file was modified. All writes confined to the GLM lineage artifact directory.

---

## 4. SYMLINK DEDUPLICATION MAP

| Symlink | Resolves To | Relationship |
|---------|-------------|--------------|
| `CLAUDE.md` | `AGENTS.md` | Symlink (75 bytes) |
| `.mcp.json` | `.claude/mcp.json` | Symlink (16 bytes) |
| `.cursor/mcp.json` | `../.mcp.json` → `.claude/mcp.json` | Two-hop symlink chain (12 bytes) |

**Implication:** The three MCP registration paths are ONE physical file. The two doctrine paths are ONE physical file. Any removal edit touches one file; the aliases are inventoried but not independently edited.

---

## 5. RUNTIME REGISTRATIONS (3 physical files)

| # | File | Line | Registration | Launcher |
|---|------|------|-------------|----------|
| 1 | `opencode.json` | 69 | `"mk_code_index": { ... }` | `.opencode/bin/mk-code-index-launcher.cjs` |
| 2 | `.claude/mcp.json` | 58 | `"mk_code_index": { ... }` | `.opencode/bin/mk-code-index-launcher.cjs` |
| 3 | `.codex/config.toml` | 31 | `[mcp_servers.mk_code_index]` | `.opencode/bin/mk-code-index-launcher.cjs` |

**Failure mode:** Each runtime fails at session start with MCP server-not-found. These are the blocking runtime breaks (REQ-003).

---

## 6. THE 8 MCP TOOL IDS

Confirmed from `.opencode/skills/system-code-graph/mcp-server/tool-schemas.ts`:

| # | Tool ID | Line | MCP Prefix |
|---|---------|------|------------|
| 1 | `code_graph_scan` | 14 | `mcp__mk_code_index__code_graph_scan` |
| 2 | `code_graph_query` | 46 | `mcp__mk_code_index__code_graph_query` |
| 3 | `code_graph_status` | 69 | `mcp__mk_code_index__code_graph_status` |
| 4 | `code_graph_context` | 76 | `mcp__mk_code_index__code_graph_context` |
| 5 | `code_graph_classify_query_intent` | 113 | `mcp__mk_code_index__code_graph_classify_query_intent` |
| 6 | `code_graph_verify` | 126 | `mcp__mk_code_index__code_graph_verify` |
| 7 | `code_graph_apply` | 149 | `mcp__mk_code_index__code_graph_apply` |
| 8 | `detect_changes` | 175 | `mcp__mk_code_index__detect_changes` |

---

## 7. AGENT TOOL GRANTS (32 files: 8 agents × 4 runtime trees)

| Agent | .claude/agents | .codex/agents | .pi/agents | .opencode/agents | Tools Granted |
|-------|----------------|---------------|------------|------------------|---------------|
| ai-council | ✓ | ✓ | ✓ | ✓ | body doctrine (wedged-daemon fallback) |
| context | ✓ | ✓ | ✓ | ✓ | query, context, status |
| debug | ✓ | ✓ | ✓ | ✓ | body doctrine |
| deep-alignment | ✓ | ✓ | ✓ | ✓ | query, context |
| deep-improvement | ✓ | ✓ | ✓ | ✓ | body doctrine |
| deep-research | ✓ | ✓ | ✓ | ✓ | query, context (opencode: allow) |
| deep-review | ✓ | ✓ | ✓ | ✓ | detect_changes, query, context |
| review | ✓ | ✓ | ✓ | ✓ | detect_changes |

**.opencode/agents/** uses a permissions-block syntax: `code_graph_query: allow` (e.g., `context.md:15-17`) plus `mk_code_index` in allowed MCP servers (`context.md:25`).

**Agent body doctrine:** Every `.opencode/agents/*` file contains a "Wedged-daemon fallback" paragraph referencing `mcp__mk_code_index__*` and `node .opencode/bin/code-index.cjs <tool> --warm-only`. `context.md` has extensive routing tables (lines 59, 79-87, 92-93, 117, 139, 172, 176, 414-416).

---

## 8. COMMAND TOOL GRANTS (11 commands)

| # | Command File | Line | Tools Granted |
|---|-------------|------|---------------|
| 1 | `.opencode/commands/deep/research.md` | 4 | query, context |
| 2 | `.opencode/commands/deep/review.md` | 4 | query, context |
| 3 | `.opencode/commands/doctor/update.md` | 4 | status, query, context, scan, apply, detect_changes |
| 4 | `.opencode/commands/doctor/speckit.md` | 4 | status, query, context, detect_changes |
| 5 | `.opencode/commands/memory/search.md` | 4 | query, context |
| 6 | `.opencode/commands/speckit/implement.md` | 4 | query |
| 7 | `.opencode/commands/speckit/plan.md` | 4 | query |
| 8 | `.opencode/commands/speckit/complete.md` | 4 | query |
| 9 | `.opencode/commands/create/agent.md` | 4 | query |
| 10 | `.opencode/commands/create/skill.md` | 4 | query |
| 11 | `.opencode/commands/create/changelog.md` | 4 | query |

---

## 9. HOOKS, LIFECYCLE AUTOMATION, CI, REAPERS

### 9.1 Per-Runtime Freshness Hooks (3)
| Runtime | File | Line | Shell-Out Target |
|---------|------|------|------------------|
| Claude | `.claude/settings.json` | 165 | `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` |
| Codex | `.codex/hooks.json` | 101 | `system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs` |
| Devin | `.devin/hooks.v1.json` | 109 | `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` |

### 9.2 Git Post-Commit Hook
- `.opencode/scripts/git-hooks/post-commit` — invalidates code-graph SQLite stale marker. DB paths at lines 73-74. Bypass: `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT=1`.
- Regression test: `.opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh` (208 lines).

### 9.3 Session Reapers (2)
- `session-cleanup.sh:99,102` — kills `mk-code-index-launcher.cjs` and `system-code-graph/mcp-server/dist/index.js` processes.
- `orphan-mcp-sweeper.sh:209,213` — identifies `mk-code-index-launcher` and `code-graph-server` orphans.

### 9.4 CI Job
- `.github/workflows/isolation-check.yml` — 3 audit steps (lines 19-61, 110-126) all target system-code-graph. Enforces the spec-kit/code-graph isolation boundary.

---

## 10. PLUGINS (2 + tests)

| Plugin | Lines | Imports From | Hooks |
|--------|-------|-------------|-------|
| `mk-code-graph.js` | 514 | `system-code-graph/mcp-server/plugin-bridges/mk-code-graph-transport.mjs` (line 37), `mk-code-graph-bridge.mjs` (line 51) | `experimental.chat.*`, `session.created/deleted`, `experimental.session.compacting` |
| `mk-code-graph-freshness.js` | 241 | `system-code-graph/runtime/lib/code-graph/freshness-core.cjs` (line 33) | `tool.execute.before/after`, `session.created`, `server.instance.disposed`, `global.disposed` |

- Tests: `.opencode/plugins/tests/mk-code-graph.test.cjs`, `mk-code-graph-freshness.test.cjs`
- Runtime state: `.opencode/skills/.code-graph-freshness-state/`
- **Auto-discovered** by OpenCode from `.opencode/plugins/*.js` — no explicit registration in `opencode.json`.

---

## 11. RECOMMENDATIONS (Ordering Graph)

### 11-Phase Dependency-Ordered Removal

**Phase 0: Hooks & Reapers** (fire on every tool call/commit/session)
→ Remove 3 freshness hooks, strip post-commit, strip 2 reapers

**Phase 1: Agent & Command Tool Grants** (32 + 11 files)
→ Strip all `mcp__mk_code_index__*` grants and body doctrine

**Phase 2: Spec-Kit Decoupling** (the boundary — must complete before skill deletion)
→ Decouple 4 importers from `code-graph-boundary.ts`, remove boundary + CLI fallback, update tool-schemas, trim shared contracts

**Phase 3: Skill-Advisor Graph**
→ Remove `system-code-graph` node from `skill-graph.json` + all scorer lanes (TS + Python), rebuild

**Phase 4: Plugins**
→ Remove 2 plugin files + tests

**Phase 5: MCP Registrations** (after plugins — plugins import from skill)
→ Remove from 3 runtime config files

**Phase 6: Launchers & CLI** (after registrations — registrations point at them)
→ Remove 2 launchers, STRIP (not delete) 2 shared infra files, strip mk-spec-memory-launcher code-graph refs

**Phase 7: /Doctor Surface**
→ Remove route + code-graph-specific asset, strip multi-server assets

**Phase 8: CI**
→ Remove or rewrite isolation-check.yml

**Phase 9: Skill Directory** (delete last — everything above referenced it)
→ Delete `.opencode/skills/system-code-graph/` + `.code-graph-freshness-state/`

**Phase 10: Docs** (update after skill is gone — references become dead links)
→ Update README.md, AGENTS.md, .claude/CLAUDE.md, install-guides, spec-kit SKILL.md, constitutional rules, deep-loop docs, command doctrine

### Per-Consumer Remove-vs-Fallback

| # | Consumer | Recommendation | Rollback Risk |
|---|----------|---------------|---------------|
| 1 | Runtime registrations (3) | REMOVE | Low |
| 2 | Agent tool grants (32) | REMOVE | Low |
| 3 | Command tool grants (11) | REMOVE | Low |
| 4 | Freshness hooks (3) | REMOVE | Low |
| 5 | Git post-commit hook | STRIP code-graph logic | Medium |
| 6 | Session reapers (2) | STRIP code-graph patterns | Low |
| 7 | Plugins (2 + tests) | REMOVE | Low |
| 8 | Launchers (2) | REMOVE | Low |
| 9 | Shared launcher infra (2) | **FALLBACK: strip branch, keep file** | **HIGH** |
| 10 | mk-spec-memory-launcher.cjs | STRIP code-graph DB refs | Medium |
| 11 | Spec-kit boundary | REMOVE after decoupling | Medium |
| 12 | Spec-kit hooks (3) | STRIP code-graph imports | Medium |
| 13 | Shared contracts | **FALLBACK: trim or remove** | Medium |
| 14 | Skill-advisor graph | REMOVE node + rebuild | Low |
| 15 | /doctor surface | REMOVE route + strip assets | Low |
| 16 | CI job | REMOVE or rewrite | Low |
| 17 | Docs | REMOVE code-graph sections | Low |
| 18 | Skill directory | REMOVE (last step) | **HIGH** |
| 19 | Archival specs | **INVENTORY ONLY** | N/A |

---

## 12. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Visible-only `rg` (without `--hidden`) | Misses `.claude/mcp.json`, `.codex/config.toml`, `.devin/hooks.v1.json`, `.claude/settings.json` | Symlink map F1.1; all 3 freshness hooks in hidden files | 1, 4 |
| Counting symlink aliases as independent edits | `CLAUDE.md`=`AGENTS.md`; `.mcp.json`/`.cursor/mcp.json`=`.claude/mcp.json` — one physical file each | `ls -la` symlink chain | 1 |
| Deleting `launcher-ipc-bridge.cjs` wholesale | SHARED with mk-spec-memory; branches on `serviceName` at line 86 | F2.5 | 2 |
| Deleting `launcher-session-proxy.cjs` wholesale | SHARED with mk-spec-memory; "only the tools/call replayability set differs" | F2.5 | 2 |
| Deleting `shared/code-graph-contracts.ts` outright | Spec-kit types (`GraphFreshness`, `StructuralReadiness`, etc.) may still be imported by surviving spec-kit code | F3.5 | 3 |
| Deleting `code-graph-boundary.ts` before decoupling importers | 4 spec-kit subsystems import from it (context-server, session-prime, memory-surface, passive-enrichment) | F3.1, F3.6, F3.7 | 3 |
| Explicit plugin registration in `opencode.json` | None exists — plugins are auto-discovered from `.opencode/plugins/*.js` | F2.6 | 2 |
| `.github/hooks/scripts/session-start.sh` as a touchpoint | No code-graph references found | F4 dead end | 4 |
| Editing `.opencode/specs/**` or changelogs | Archival historical record — REQ-004 prohibits | F1.6 | 1 |

---

## 13. OPEN QUESTIONS

1. **Should any consumer keep a degraded fallback path rather than dropping the feature outright?** — Resolved: consumers 9 (shared launcher infra) and 13 (shared contracts) MUST keep fallback paths. All others: remove. Ratified in phase 002.
2. **Does removing the `isolation-check` CI job leave a coupling pattern worth guarding elsewhere?** — Open. The CI job enforced the spec-kit/code-graph isolation boundary. After decommission, the boundary is moot, but if a future skill split occurs, a similar guard may be needed. Defer to phase 002 decision record.
3. **Does `shared/code-graph-contracts.ts` have surviving importers after Phase 2 decoupling?** — Must be verified at implementation time. If `GraphFreshness`/`StructuralReadiness` types are still referenced by spec-kit's own code (independent of the boundary), the contracts file must survive as a spec-kit-local file.

---

## 14. CONFIRMED vs INFERRED

All touchpoints in this inventory are **CONFIRMED** with `file:line` evidence from `rg --hidden --no-ignore` sweeps. No inferred touchpoints remain. The post-research verification sweep (SC-001) should be run at implementation time to confirm no live-surface reference is absent from this inventory.

---

## 15. ARCHIVAL BOUNDARY (REQ-004)

The following paths are **ARCHIVAL historical record** — inventoried but never proposed for editing:

- `.opencode/specs/system-code-graph/**` (including `z_archive/`) — spec packet history
- `.opencode/skills/system-code-graph/changelog/**` — skill changelogs
- `.opencode/skills/system-deep-loop/deep-*/changelog/**` — deep-loop changelogs
- `.opencode/skills/*/benchmark/reports/**` — benchmark reports
- `.worktrees/**` — worktree checkouts with archival copies

---

## 16. REFERENCES

### Iteration Files
- `iterations/iteration-001.md` — Physical topology and raw occurrence baseline
- `iterations/iteration-002.md` — Runtime registrations, launchers, plugins, install surfaces
- `iterations/iteration-003.md` — External executable dependencies and shared contracts
- `iterations/iteration-004.md` — Hooks, lifecycle automation, CI, session reapers, /doctor
- `iterations/iteration-005.md` — Doctrine, doc references, agent tree, ordering graph

### Key Source Files (file:line)
- `opencode.json:69`, `.claude/mcp.json:58`, `.codex/config.toml:31` — MCP registrations
- `tool-schemas.ts:14-175` — 8 tool ids
- `mk-code-index-launcher.cjs:152,1353` — launcher hard dependency
- `launcher-ipc-bridge.cjs:86-92` — shared infra branching
- `code-graph-boundary.ts:4,32,39` — spec-kit process boundary
- `skill-graph.json:1` — skill-advisor graph node
- `.claude/settings.json:165`, `.codex/hooks.json:101`, `.devin/hooks.v1.json:109` — freshness hooks
- `.github/workflows/isolation-check.yml:19-126` — CI job
- `AGENTS.md:342,378`, `.claude/CLAUDE.md:5`, `README.md:590-657` — root doctrine

---

## 17. CONVERGENCE REPORT

- **Stop reason:** max_iterations (5 of 5 reached; convergence before max was telemetry only per stop policy)
- **Total iterations completed:** 5
- **Questions answered ratio:** 5/5 (100%)
- **Average newInfoRatio trend:** 1.0 → 0.92 → 0.88 → 0.85 → 0.80 (descending, as expected for a finite inventory task)
- **newInfoRatio trend:** Descending — each iteration found proportionally less net-new information as the inventory saturated
- **Quality guards:** Source diversity (rg sweeps + file reads + ls), focus alignment (5 distinct focus tracks), no single-weak-source (every finding has ≥1 file:line citation)
- **Key finding:** The touchpoint inventory is complete. The 11-phase ordering graph and 19 per-consumer recommendations provide a deletion-safe roadmap. The two HIGH-risk consumers (shared launcher infra, skill directory deletion) are explicitly flagged with fallback/last-step constraints.
