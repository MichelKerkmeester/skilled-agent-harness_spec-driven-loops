# Research Synthesis — system-code-graph / mk_code_index touchpoint inventory (grok lineage)

**Session:** `fanout-grok-1785176679915-bjzj49`  
**Executor:** cli-cursor / cursor-grok-4.5-high  
**Stop reason:** `max_iterations` (5/5; `stopPolicy: max-iterations`; convergence telemetry only)  
**Scope:** Read-only inventory; writes only under `research/lineages/grok`.

---

## 1. Executive verdict

Fully decommissioning `system-code-graph` and `mk_code_index` touches **four physical MCP registrations** (after symlink dedupe), a **multi-runtime freshness hook/plugin matrix**, a **spec-kit process boundary that must be stubbed before skill deletion**, dense **agent/command/doctrine grants**, **doctor/deploy first-peer rebuild wiring**, and **~384 filtered live paths** plus **4364 archival `.opencode/specs/**` hits that must not be edited**.

Safe path: **disable hooks → stub boundary → unregister MCP → retire bins/lifecycle → doctor/advisor/agents → delete skill → retarget CI**. Big-bang delete is ruled out.

---

## 2. Sweep method & alias hygiene (mandatory)

- Sweeps **must** use `rg --hidden --no-ignore` or they miss `opencode.json` companions under dotdirs (`.claude/mcp.json`, `.mcp.json`, `.cursor/mcp.json`, `.claude/settings.local.json`).
- **Symlink dedupe (mutation targets):**
  - `CLAUDE.md` → `AGENTS.md`
  - `.mcp.json` / `.cursor/mcp.json` → `.claude/mcp.json`
  - `.claude/CLAUDE.md` is a **separate** small file (not the root symlink)

---

## 3. Physical registration set

| Path | Role |
|------|------|
| `opencode.json` | MCP `mk_code_index` → `mk-code-index-launcher.cjs` |
| `.claude/mcp.json` | Canonical Claude/Cursor/root MCP |
| `.codex/config.toml` | `[mcp_servers.mk_code_index]` |
| `.pi/mcp.json` | Pi MCP registration |

**Binaries/plugins:** `.opencode/bin/mk-code-index-launcher.cjs`, `code-index.cjs`, `.opencode/plugins/mk-code-graph.js`, `mk-code-graph-freshness.js`.

**Local allow:** `.claude/settings.local.json` Bash grant for `code-index.cjs`.

---

## 4. Consumer inventory (by class)

### 4.1 Hooks / lifecycle automation — REMOVE after disable
Claude settings, Codex hooks, Devin hooks, Cursor `post-tool-use.mjs`, Pi `code-graph-freshness.ts`, git `post-commit` DB path, OpenCode plugins.

### 4.2 Spec-kit boundary — STUB FIRST (keep-behind-fallback)
- `mcp-server/lib/code-graph-boundary.ts` (hard-coded skill DB paths + MCP client)
- Callers: `context-server.ts`, `passive-enrichment.ts`, `session-prime.ts`, `memory-surface.ts`, `code-index-cli-fallback.ts`
- Shared: `shared/code-graph-contracts.ts`

### 4.3 Agents / commands / templates — REMOVE GRANTS
≥30 agent files across OpenCode/Claude/Codex/Pi; heaviest `@context` / `@review`.  
`create/agent.md`, `create/skill.md` hard-code `mcp__mk_code_index__code_graph_query`.  
Deep/doctor/memory command docs and presentations.

### 4.4 Doctor / deploy — REMOVE OR REWRITE
- `/doctor code-graph` route + `doctor-code-graph.yaml` (`skill_owner: system-code-graph`)
- `/doctor:update` `dependency.order` starts with `code-graph`
- `deploy-mcp.sh` `build_pkg "code-graph"`

### 4.5 Lifecycle scripts / IPC — RETIRE IDENTITY
`session-cleanup.sh`, `orphan-mcp-sweeper.sh`, `worktree-session.sh`, `launcher-ipc-bridge.cjs`, `mk-spec-memory-launcher.cjs`, `mcp-route-guard.cjs`.

### 4.6 Advisor — DROP EDGES/FIXTURES/BENCH
graph-metadata edge, regression cases expecting `system-code-graph`, bench importing `structural-indexer.js`.

### 4.7 Doctrine / install — REWRITE
`AGENTS.md`, `README.md`, `gate-tool-routing.md`, `.claude/CLAUDE.md`, `.opencode/install-guides/README.md`, plugin/bin READMEs.

### 4.8 CI — RETARGET THEN DROP
`.github/workflows/isolation-check.yml` bidirectional import bans (keep during staged teardown as absence asserts).

### 4.9 Negative knowledge — DO NOT DELETE
- Deep-loop **coverage-graph** (`runtime/lib/coverage-graph/`) — distinct from `mk_code_index`
- `.opencode/specs/**`, skill changelogs, benchmark reports — **ARCHIVAL**
- `.env.local` maintainer mode — untracked operator local

---

## 5. Ordering constraints (summary)

See iteration-005 F23 for the full 13-step graph. Critical edges:

1. Hooks off **before** skill path deletion  
2. Boundary stub **before** MCP unregister / skill delete  
3. MCP unregister reversible while launchers remain  
4. Advisor fixtures/bench **before** skill delete  
5. isolation-check retarget **during** teardown, not before  
6. Never propose archival edits

---

## 6. Rollback peaks

| Peak | Failure mode |
|------|----------------|
| Skill deleted before boundary stub | Spec-memory / enrichment / session-prime errors |
| MCP unregistered while hooks live | Per-tool-use hook failures |
| isolation CI removed early | Cross-imports regress unnoticed |
| Templates keep MCP tool ids | New scaffolds target dead tools |
| doctor-update still lists code-graph first | Update pipeline breaks |

---

## 7. Occurrence baseline

| Set | Count | Stance |
|-----|------:|--------|
| Filtered live-ish paths | ~384 | Candidate mutation / owner delete |
| `.opencode/specs/**` | 4364 | ARCHIVAL inventory only |
| Spec-kit consumer bucket | 107 | Stub/rewrite |
| Agents | 32 | Rewrite grants |
| Commands | 24 | Rewrite |
| Owner skill tree buckets | ~116 | Delete with package |

Evidence: `logs/live-hit-paths-iter001.txt`, iterations 001–005.

---

## 8. Convergence report

| Field | Value |
|-------|-------|
| Stop reason | `max_iterations` |
| Iterations | 5 |
| newInfoRatio trend | 1.0 → 0.95 → 0.9 → 0.75 → 0.55 (declining; expected under max-iter policy) |
| Questions | Q1–Q5 answered for inventory handoff |
| Quality | Multi-source cited; archival guards applied |

---

## 9. Handoff to successor phase

Successor: `002-decommission-decision-record` should turn F23/F24 into an ADR with explicit amendable scope. This lineage does **not** modify any runtime file outside `research/lineages/grok`.

### Key source citations
- `opencode.json:69`, `.claude/mcp.json:58`, `.codex/config.toml:31`, `.pi/mcp.json:25`
- `.claude/settings.json:165`, `.codex/hooks.json:101`, `.devin/hooks.v1.json:109`
- `code-graph-boundary.ts`, `isolation-check.yml:19+`, `doctor-update.yaml:167`
- `AGENTS.md` Code Graph sections, `install-guides/README.md` §10.4
- `coverage-graph-schema.md:22` (exclusion)
