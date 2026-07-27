# Resource Map — grok lineage (code-graph decommission touchpoints)

Generated from converged research deltas (emit=true). Evidence-derived; not a packet-root resource-map.

## READMEs
- `.opencode/skills/system-code-graph/README.md` — owner skill
- `.opencode/skills/system-code-graph/INSTALL-GUIDE.md` — owner install
- `.opencode/install-guides/README.md` — §10.4 mk_code_index
- `.opencode/plugins/README.md` — mk-code-graph plugins
- `.opencode/bin/README.md` — code-index CLI
- `README.md` — CODE GRAPH operator section

## Documents
- `AGENTS.md` (canonical; CLAUDE.md symlink)
- `.claude/CLAUDE.md` (separate)
- `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md`
- `.opencode/skills/system-spec-kit/constitutional/code-graph-scope-intent.md`
- `.opencode/skills/system-deep-loop/runtime/references/coverage-graph-schema.md` (EXCLUDE from delete)

## Commands
- `.opencode/commands/doctor/_routes.yaml` + `assets/doctor-code-graph.yaml`
- `.opencode/commands/doctor/assets/doctor-update.yaml` (order starts with code-graph)
- `.opencode/commands/doctor/update.md`
- `.opencode/commands/create/agent.md`, `create/skill.md`
- `.opencode/commands/deep/*.md` (TrustState / readiness doctrine)

## Agents
- `.opencode/agents/{context,review,debug,deep-* ,ai-council}.md`
- `.claude/agents/*` (tools: mcp__mk_code_index__*)
- `.codex/agents/*.toml`
- `.pi/agents/*`

## Skills
- `.opencode/skills/system-code-graph/**` — primary delete unit
- `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts` — stub first
- `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/enrichment/passive-enrichment.ts`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/{claude/session-prime.ts,memory-surface.ts,code-index-cli-fallback.ts,cursor/post-tool-use.mjs}`
- `.opencode/skills/system-skill-advisor/**` (edges, fixtures, bench import)
- `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs`
- `.opencode/skills/sk-doc/create-agent/assets/agent-template.md`

## Specs
- `.opencode/specs/**` — ARCHIVAL (4364 hits); inventory only
- This packet: `036-code-graph-decommission/001-touchpoint-research`

## Scripts
- `.opencode/bin/mk-code-index-launcher.cjs`, `code-index.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs` (code-graph DB path)
- `.opencode/bin/worktree-session.sh`
- `.opencode/scripts/session-cleanup.sh`, `orphan-mcp-sweeper.sh`
- `.opencode/scripts/git-hooks/post-commit`
- `.opencode/skills/system-spec-kit/scripts/deploy-mcp.sh`
- `scripts/setup-maintainer-filters.sh`

## Tests
- `.opencode/bin/mk-code-index-launcher-*.vitest.ts`
- `.opencode/plugins/tests/mk-code-graph*.cjs`
- `.opencode/skills/system-spec-kit/mcp-server/tests/*code-graph*` / `*launcher-code-index*`
- Advisor regression fixtures expecting system-code-graph

## Config
- `opencode.json`, `.claude/mcp.json` (+ symlink aliases), `.codex/config.toml`, `.pi/mcp.json`
- `.claude/settings.json`, `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`
- `.gitignore` skill-local DB paths
- `.env.local` SPECKIT_CODE_GRAPH_MAINTAINER_MODE (untracked)

## Meta / Plugins / CI
- `.opencode/plugins/mk-code-graph.js`, `mk-code-graph-freshness.js`
- `.pi/extensions/code-graph-freshness.ts`
- `.github/workflows/isolation-check.yml`
