# Iteration 002 — Skills, agents, hooks, doctrine grants

## Focus

Which skills, agents, commands, hooks, and doctrine files grant or require code-graph tools (Q2).

## Actions Taken

1. Swept runtime agent directories (`.opencode/agents`, `.claude/agents`, `.codex/agents`, `.pi/agents`) for `mk_code_index` / `code_graph_*` grants.
2. Mapped freshness hooks across Claude, Codex, Devin, Cursor post-tool-use, git post-commit, Pi extension.
3. Cited doctrine surfaces in `AGENTS.md`, `README.md`, and constitutional `gate-tool-routing.md`.
4. Located `/doctor code-graph` route + `doctor-code-graph.yaml`.

## Findings

### F7 — Agent tool grants are multi-runtime and dense
[SOURCE: .opencode/agents/context.md:15-25]
[SOURCE: .claude/agents/context.md:4]
[SOURCE: .claude/agents/review.md:4]
Explicit allow/tools frontmatter and body doctrine appear across **≥30 agent files** spanning OpenCode/Claude/Codex/Pi (list in live-hit paths). Heaviest consumers:
- `@context` — `code_graph_status|query|context` required in workflow; MCP server `mk_code_index` listed.
- `@review` — `detect_changes` grant (Claude tools line); wedged-daemon fallback mentions `code-index.cjs`.
- Deep-loop agents (`deep-research`, `deep-review`, `deep-alignment`, `deep-improvement`, `ai-council`, `debug`) — at minimum wedged-daemon fallback prose referencing `mcp__mk_code_index__*`.

**Recommendation class:** rewrite agent doctrine to Grep/Glob/Read-only (or optional future indexer); remove MCP grants. Not archival.

### F8 — Freshness hook matrix (live shell-outs into skill tree)
| Runtime | Path | Target |
|---------|------|--------|
| Claude | `.claude/settings.json:165` | `system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` |
| Codex | `.codex/hooks.json:101` | `.../codex/code-graph-freshness.cjs` |
| Devin | `.devin/hooks.v1.json:109` | `.../devin/code-graph-freshness.cjs` |
| Cursor | `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:39` | imports Claude freshness script path |
| Pi | `.pi/extensions/code-graph-freshness.ts` | Pi extension surface |
| Git | `.opencode/scripts/git-hooks/post-commit:73` | `CANONICAL_DB_DIR=.../system-code-graph/mcp-server/database` |

Plus OpenCode plugins `mk-code-graph.js` / `mk-code-graph-freshness.js` (iter 1).

**Mutation class:** remove/disable hooks before deleting skill tree or post-commit will break.

### F9 — Doctrine claims (root + constitutional)
[SOURCE: AGENTS.md:316+] — Code Graph mandatory tools table, daemon CLI fallback, doctor `code-graph` route, search decision tree.
[SOURCE: README.md:601+] — Full CODE GRAPH operator section; installer grep for `mk_code_index`.
[SOURCE: .opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:42+] — Semantic/structural routing → `mcp__mk_code_index__code_graph_query`.
[SOURCE: .claude/CLAUDE.md] — separate small file (NOT symlink to AGENTS.md); mentions ownership of code-graph under `system-code-graph/` and `mk-code-index` tools — **third doctrine host**, distinct from root `CLAUDE.md→AGENTS.md`.

### F10 — Doctor command is a first-class consumer
[SOURCE: .opencode/commands/doctor/_routes.yaml:83-105]
[SOURCE: .opencode/commands/doctor/assets/doctor-code-graph.yaml]
- Route `target: code-graph` → `doctor-code-graph.yaml`
- `skill_owner: ".opencode/skills/system-code-graph/"`
- Warm-only CLI: `node .opencode/bin/code-index.cjs code_graph_status ...`
**Mutation class:** remove/retire doctor route + YAML + presentation strings; update AGENTS doctor table.

### F11 — Skill package is the primary deletable unit
`.opencode/skills/system-code-graph/` (SKILL.md, graph-metadata.json, feature-catalog, mcp-server, runtime hooks, playbooks). Advisor metadata may lack `description.json` at skill root (ls showed graph-metadata only in one probe) — verify before claiming advisor-index removal complete.

## Questions Answered

- Q2 (substantial): Agents, hooks, doctrine, doctor all grant/require code-graph; skill tree is the owner package.

## Questions Remaining

- Q3: Import/shell-out/CI/shared-contract spine (spec-kit boundary, isolation-check, launchers).
- Q4: Ordering + rollback.
- Q5: Generated/dist/changelog classification refinements.

## Ruled Out

- Deleting the skill tree before unhooking Claude/Codex/Devin/Cursor/git freshness paths.
- Treating `.claude/CLAUDE.md` as identical to root `CLAUDE.md` symlink (it is a separate file).

## Next Focus

Imports, shell-outs, scripts, CI jobs, and shared contracts that invoke the code-graph stack (Q3).

## SCOPE VIOLATIONS

None.
