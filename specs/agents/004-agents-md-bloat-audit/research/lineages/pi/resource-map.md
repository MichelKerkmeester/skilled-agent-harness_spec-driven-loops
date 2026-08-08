# Resource Map — AGENTS.md Bloat Audit (lineage pi)

Derived from converged deltas of the research loop. Covers files inventoried as evidence during iterations 1–5.

## Files Consulted (evidence sources)

| Path | Role | Iterations |
|---|---|---|
| AGENTS.md | Audit target (555L, 47,110B) | 1–5 |
| .opencode/skills/system-spec-kit/SKILL.md | Authoritative for §3 content (F2-4) | 2 |
| .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts | Machine contract for Gate 3 (F2-5) | 2 |
| .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js | Save mechanics; no post-save quality output (F2-6) | 2, 3 |
| .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md | Daemon CLI contract (F2-2) | 2, 3 |
| .opencode/skills/system-spec-kit/constitutional/*.md (21 files) | Authoritative home of the 7 cited constitutional policies (F1-1) | 1, 2 |
| .opencode/skills/sk-code/SKILL.md §2 | Smart-routing contract (F4-1) | 2, 4 |
| .opencode/skills/sk-git/references/remote-branch-policy.md | Push-allowlist contract (F2-1) | 1, 2, 3 |
| opencode.json, .claude/mcp.json, .codex/config.toml, .utcp_config.json | MCP registration truth (F2-3) | 2 |
| .opencode/agents, .claude/agents, .codex/agents, .pi/agents | Agent-directory truth (F2-8) | 2 |
| .opencode/commands/deep/research.md | Quick-reference row target (F2-7) | 2 |
| .opencode/bin/spec-memory.cjs, skill-advisor.cjs | Daemon CLI front doors (F1-2) | 1 |

## Coverage Notes

- Resource-map at spec folder absent at init → `resource_map_present: false`; coverage gate skipped.
- All files above verified to exist via ls/find/wc during the loop; the only missing references are the 7 root `constitutional/*.md` paths cited by AGENTS.md (F1-1).
