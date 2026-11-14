# How the six other CLI modes attach a persona, and whether the child has the persona's tools

The agent personas name Claude Code tools: Read, Grep, Glob, Bash, Write and Edit. Each row answers one question for a bare dispatch that inlines a persona: does the child have tools the persona's names resolve to. Read on 2026-11-14 from each mode's `SKILL.md` and references. No row was confirmed by a live run made for this table.

| Mode | How it attaches a persona | Child's tools against the persona's | Result |
|---|---|---|---|
| cli-claude-code | `claude -p --agent <name>` resolves `.claude/agents/<name>.md` (rule 14). Inline on a bare `-p` | The child is Claude Code, so the names are its own | native surface |
| cli-cursor | Names the resolved subagent from `.cursor/agents` (rule 17). Inline on a bare `cursor-agent -p` | The subagent file is Cursor's own copy of the persona | native surface |
| cli-devin | `run_subagent` naming `.devin/agents/<name>/AGENT.md` (rule 17). Inline on a bare `devin -p` | The profile is Devin's own copy of the persona | native surface |
| cli-opencode | `--agent orchestrate` to a Task subagent, or inline on a bare `opencode run` (rule 18) | OpenCode has `read`, `grep`, `glob`, `bash`, `edit` and `write`, the same names in lower case. `references/permissions-matrix.md` line 193 maps `Read`, `Grep`, `Glob` to its `read` class | has the tools |
| cli-pi | Inline, mandatory (rule 10) | `references/pi-tools.md` line 117 confirms seven built-in tools: `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`. Read and Grep keep their names and Glob is `find` | has the tools |
| cli-deepseek-harness | Inline, mandatory (rule 7). A fan-out lineage passes the generated `.dsh/agents/<name>.patch.yml` | `references/guards-and-hooks.md` line 61 names `bash`, `write`, `edit` and `subagent` and says a matcher written for capitalized names selects nothing. No document in the packet names a read, grep or glob tool | needs the line |

## Notes

- `cli-deepseek-harness` is the one follow-up. The evidence is the absence of a named read tool in the packet's documents, not an observed failure. A read-only dispatch with an inlined `context` persona would settle it.
- The twenty-five OpenCode dispatches made for this packet all carried a tool-mapping paragraph in the prompt head, so they do not show what OpenCode does without one.
- The fan-out runtime is a seventh consumer the plan listed as not one. `agentPersonaBlock` in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (line 133) inlines `.skilled/agents/<name>.md` for every executor kind, `cli-codex` included, and adds no mapping line. A research or review lineage that sets `agentPersona` on a Codex executor composes the prompt this phase found failing. The runner is out of this phase's scope, so this is reported and not changed.
