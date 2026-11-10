## runtime:pi — 50 files

| file | `.opencode` lines | what the reference does | origin | needed change | class |
|---|---|---|---|---|---|
| `.pi/SYNC.md` | :3,14,16,26,27,29,34,35 (+12 more) | documents the runtime's derivation contract | authored | rewrite: the manifest describes `.opencode`-as-source; post-move it must describe `.skilled` as source and `.opencode` as consumer | manual |
| `.pi/agents/ai-council.md` | :18,28,118,121,415,637,657,690 (+13 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/code.md` | :19,23,36,38,59,66,376,444 (+6 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/context.md` | :18,62,66,158,181,419,420,421 (+1 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/debug.md` | :19,350,651,652,653,654 | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/deep-improvement.md` | :21,78,238,239,240,241,242 | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/deep-research.md` | :19,103,273,346,570,571,572,573 | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/deep-review.md` | :18,182,235,272,285,286,287,304 (+8 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/design.md` | :19,88,98,114,125,127,129,230 (+6 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/markdown.md` | :19,132,187,188,189,190,191,192 (+16 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/orchestrate.md` | :24,26,149,156,157,158,159,160 (+20 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/prompt-improver.md` | :20,91,92,112,170,375,376,377 (+1 more) | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/agents/review.md` | :17,90,461,462,463,464,465 | generated Pi-dialect agent; `.opencode` refs embed canonical paths | generated — `sync-agents-pi.cjs` | regenerate from `.skilled/agents` (or compat) | regenerate |
| `.pi/extensions/README.md` | :20,21,22,23,24,25,26,27 (+12 more) | documents the mirror surface | authored | mechanical rewrite of prose refs | mechanical |
| `.pi/extensions/lib/README.md` | :16 | documents the mirror surface | authored | mechanical rewrite of prose refs | mechanical |
| `.pi/mcp.json` | :5 | registers the code_mode MCP server — `args`/`command` execs `.opencode/bin/mcp-code-mode-launcher.cjs` | authored | point the launcher arg at `.skilled/bin/mcp-code-mode-launcher.cjs` (or compat) | mechanical |
| `.pi/prompts/agent-router.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-agent.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-benchmark.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-changelog.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-command.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-diff.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-feature-catalog.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-manual-testing-playbook.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-readme.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-repo-rule.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-skill-parent.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-skill.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/create-with-human-voice.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/deep-agent-improvement.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/deep-ai-council.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/deep-model-benchmark.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/deep-research.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/deep-review.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/design-chart.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/design-diagram.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/design-extract.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/doctor-mcp.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/doctor-speckit.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/doctor-update.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/goal-pi.md` | :33 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/prompt-improve.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/rewrite-response-by-external-agent.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/rewrite-response.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-complete.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-implement.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-plan.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-resume.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-save.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
| `.pi/prompts/speckit-search.md` | :1,6 | generated pointer stub naming the canonical `.opencode/commands` file | generated — `sync-prompts-pi.cjs` | regenerate (or compat) | regenerate |
