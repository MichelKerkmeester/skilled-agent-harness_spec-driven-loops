# Manual Devin pass focuses (gap-driven)

Chosen against the 32 merged fan-out findings, targeting surfaces those findings barely reached.
Fan-out coverage was concentrated in system-spec-kit (6), system-deep-loop (5), system-skill-advisor (3), bin/lib (3).

| Pass | Focus | Why this gap |
|------|-------|--------------|
| 01 | Domain skill hubs: `sk-code`, `sk-doc`, `sk-git`, `sk-prompt` — SKILL.md, mode-registry.json, hub-router.json, leaf-manifest.json, shared/, nested packets | Zero fan-out findings; only sk-design got 1 |
| 02 | `cli-external-orchestration` and `mcp-tooling` hubs plus every nested packet | Zero fan-out findings despite being large hubs |
| 03 | `.opencode/commands/` and `.opencode/agents/` trees | Only 3 shallow findings; orphan assets and dead command routes unexamined |
| 04 | Runtime mirrors `.claude/`, `.codex/`, `.cursor/`, `.devin/` and repo-root config/dotfiles | Only pairwise comparisons, no depth sweep |
| 05 | Test, fixture, and benchmark trees across all skills | Untouched; classic home for stale fixtures and committed outputs |
