# Resource Map

## Summary

- Total inventory: 10 iteration artifacts plus live path families and immutable archive classes
- Scope: repository touchpoints analyzed for Code Graph decommission
- Generated: 2026-07-27
- Classification: `Planned removal`, `Planned update`, `Analyzed—retain`, `Archival—no edit`

## 1. READMEs

| Path | Action | Status | Note |
|---|---|---|---|
| `README.md` | Planned update | OK | Architecture, capability, count, config, FAQ, version claims |
| `.opencode/install-guides/README.md` | Planned update | OK | Remove Code Graph install sections |
| `.opencode/bin/README.md` | Planned update | OK | Remove launcher/CLI/worktree claims |
| `.opencode/bin/lib/README.md` | Planned update | OK | Remove code-index shim claim |
| `.opencode/plugins/README.md` | Planned update | OK | Remove two plugins |
| `.opencode/scripts/README.md` | Planned update | OK | Remove graph lifecycle guidance |
| `.opencode/scripts/git-hooks/README.md` | Planned update | OK | Preserve memory behavior |
| `.opencode/skills/system-skill-advisor/README.md` | Planned update | OK | Remove ownership exclusion |
| `.opencode/commands/memory/README.txt` | Planned update | OK | Correct tool surface |

## 2. Documents

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/install-guides/SET-UP - Code Graph.md` | Planned removal | OK | Dedicated install guide |
| `.claude/CLAUDE.md` | Planned update | OK | Search routing |
| `.claude/SYNC.md` | Planned update | OK | Tool grants |
| `.opencode/skills/.code-graph-freshness-state/**` | Planned removal | OK | Operational residue |

## 3. Commands

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/commands/deep/{research,review,alignment,ai-council,command-benchmark}.md` | Planned update | OK | Grants and doctrine |
| `.opencode/commands/speckit/{plan,implement,complete}.md` | Planned update | OK | Remove graph grants |
| `.opencode/commands/create/{agent,skill,changelog}.md` | Planned update | OK | Remove graph grants |
| `.opencode/commands/memory/search.md` | Planned update | OK | Remove graph grant |
| `.opencode/commands/doctor/**` | Planned update | OK | Delete graph route; prune mixed routes |
| `.opencode/commands/create/assets/*-{auto,confirm}.yaml` | Planned update | OK | Remove graph-first notes |
| `.opencode/commands/deep/assets/**` | Planned update | OK | Preserve coverage graph |

## 4. Agents

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/agents/{ai-council,context,debug,deep-alignment,deep-improvement,deep-research,deep-review,review}.md` | Planned update | OK | Canonical authority |
| `.claude/agents/**` | Regenerate | OK | Regular-file projection |
| `.codex/agents/**` | Regenerate | OK | Regular-file projection |
| `.cursor/agents/**` | Analyzed—retain | OK | Symlink projections |

## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skills/system-code-graph/**` | Planned removal | OK | Provider deletion unit |
| `.opencode/skills/system-spec-kit/**` | Planned update | OK | Boundary, consumers, dist, docs, tests |
| `.opencode/skills/system-skill-advisor/**` | Planned update | OK | Daemon drills, fixtures, docs |
| `.opencode/skills/system-deep-loop/**` | Planned update | OK | Remove MCP guidance; preserve coverage/council graphs |
| `.opencode/skills/cli-external-orchestration/**` | Planned update | OK | Remove code-index fallback |
| `.opencode/skills/mcp-code-mode/**` | Planned update | OK | Internal-server exemptions |
| `.opencode/skills/sk-code/**` | Planned update | OK | Authoring/routing guidance |
| `.opencode/skills/sk-doc/**` | Planned update | OK | Agent templates |
| `.opencode/skills/sk-git/**` | Planned update | OK | Worktree graph DB claims |
| `.opencode/skills/README.md` | Planned update | OK | Catalog row |

## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/specs/**` | Archival—no edit | OK | 5,155 exact-token files; 9,074 broad-phrase files |
| `research/lineages/sol/iterations/iteration-*.md` | Created | OK | Ten research passes |
| `research/lineages/sol/deltas/iter-*.jsonl` | Created | OK | Ten canonical deltas |

## 7. Scripts

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/bin/mk-code-index-launcher.cjs` | Planned removal | OK | MCP launcher |
| `.opencode/bin/code-index.cjs` | Planned removal | OK | CLI shim |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Planned update | OK | Remove service branch |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Planned update | OK | Remove graph DB env handling |
| `.opencode/bin/worktree-session.sh` | Planned update | OK | Remove graph isolation |
| `.opencode/scripts/session-cleanup.sh` | Planned update | OK | Remove process classifier |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Planned update | OK | Remove process classifier |
| `.opencode/scripts/git-hooks/post-commit` | Planned update | OK | Preserve memory/autosync |
| `.opencode/scripts/setup-maintainer-filters.sh` | Planned update | OK | Remove graph flags |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/verify-zombie-soak.sh` | Planned update | OK | Surviving daemons only |

## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/bin/mk-code-index-launcher-*.vitest.ts` | Planned removal | OK | Dedicated launcher tests |
| `.opencode/bin/cli-{offline,exit-taxonomy}-smoke*` | Planned update | OK | Remove code-index cells |
| `.opencode/plugins/tests/mk-code-graph*.test.cjs` | Planned removal | OK | Dedicated plugin tests |
| `.opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh` | Planned removal | OK | Dedicated graph hook test |
| `.opencode/skills/system-spec-kit/mcp-server/{tests,stress-test}/**` | Planned update | OK | Remove graph cases; retain mixed suites |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/**` | Planned update | OK | Remove tri-daemon assumptions |

## 9. Config

| Path | Action | Status | Note |
|---|---|---|---|
| `opencode.json` | Planned update | OK | Physical registration |
| `.codex/config.toml` | Planned update | OK | Physical registration |
| `.claude/mcp.json` | Planned update | OK | Physical registration; two aliases |
| `.claude/settings.json` | Planned update | OK | Freshness hook |
| `.codex/hooks.json` | Planned update | OK | Freshness hook |
| `.devin/hooks.v1.json` | Planned update | OK | Freshness hook |
| `.env.local` | Operator cleanup | OK | Ignored graph maintainer state |
| `.gitignore` | Planned update | OK | Late graph state pruning |
| `.gitattributes` | Planned update | OK | Maintainer-filter guidance |

## 10. Meta

| Path | Action | Status | Note |
|---|---|---|---|
| `AGENTS.md` | Planned update | OK | Mandatory tool and routing doctrine |
| `CLAUDE.md` | Alias—no separate edit | OK | Symlink to `AGENTS.md` |
| `.mcp.json` | Alias—no separate edit | OK | Symlink to `.claude/mcp.json` |
| `.cursor/mcp.json` | Alias—no separate edit | OK | Resolves to `.claude/mcp.json` |
| `**/CHANGELOG*` and `**/changelog/**` | Archival—no edit | OK | 23 exact / 35 broad files outside spec classification |
| `**/*benchmark*` and captured benchmark reports | Archival—no edit | OK | 10 exact / 36 broad files |
| `.opencode/logs/**` and `.opencode/node_modules/.vite/**` | Ephemeral cleanup | OK | Not source edits |
