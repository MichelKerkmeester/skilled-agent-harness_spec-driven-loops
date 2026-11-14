# Runtimes that register agents by name

Read from `.skilled/bin/agent-mirror-crosswalk.md` section 1 at commit 0d6afbafc4.

| Runtime | Tree | Registers named agents |
|---|---|---|
| opencode | `.skilled/agents/<name>.md` through the `.opencode/agents` link | Yes |
| claude | `.claude/agents/<name>.md` | Yes |
| cursor | `.cursor/agents/<name>.md`, a symlink onto the claude file | Yes |
| devin | `.devin/agents/<name>/AGENT.md`, a symlink onto the claude file | Yes |
| codex | `.codex/agents/<name>.toml`, generated | Yes |
| pi | `.pi/agents/<name>.md`, generated | Yes |

Every tree the crosswalk lists carries one file per agent, so none of them needs the general wrapper.
The rewritten instruction keeps the wrapper only for a runtime whose delegation tool registers no named agents.
