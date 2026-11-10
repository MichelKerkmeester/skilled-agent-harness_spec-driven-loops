## File 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/keep-list.tsv`

CONTENT:

~~~~text
# The keep-list rows of the source-root migration layout decision that fall inside the rewrite set.
# One row per kept statement: repository path, a tab, then a regular expression that matches only the lines making it.
# opencode's own view of where it discovers plugins.
.skilled/plugins/README.md	OpenCode discovers these via a flat glob over \.opencode/plugins/
.skilled/plugins/README.md	^`\.opencode/plugins/` contains the JavaScript modules OpenCode discovers as local plugins
# opencode's own view of where it loads skills and agents.
.skilled/skills/cli-external-orchestration/cli-opencode/README.md	every skill under `\.opencode/skills/` and every MCP server registered there
.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md	^These live at `\.opencode/agents/<slug>\.md` with `mode: subagent`
# The negation of the global ignore, harmless under both layouts.
.gitignore	^# The global ~/\.gitignore_global ignores /\.opencode/ for symlinked repos\.$
.gitignore	^# But THIS repo is the SOURCE of \.opencode/ content
.gitignore	^!\.opencode/$
# Devin finds skills through its provider roster, which has no .skilled entry.
.devin/SYNC.md	discovers the repo's `\.opencode/skills/` packets on its own
.devin/SYNC.md	Devin also discovers the 12 `\.opencode/skills/` packets on its own
# The Hermes code_mode launcher argument resolves in consumer projects that expose only .opencode.
.hermes/SYNC.md	--args \.opencode/bin/mcp-code-mode-launcher\.cjs
~~~~
