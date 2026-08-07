# Iteration 003 - OpenCode Capability and Migration Inventory Closure

## Scope

Questions addressed: RQ5 and RQ6.

This pass checked the installed OpenCode CLI capability surface and measured the migration inventory across configured runtime surfaces.

## Evidence

### OpenCode capability check

Installed OpenCode version checked: `opencode 1.16.2`.

The help output for `opencode`, `opencode run`, `opencode agent`, `opencode mcp`, and `opencode plugin` shows plugin and MCP management plus broad permission flags, but no first-class per-subcommand shell-tool registration or permission gate for local CLI commands.

Repository config matches that reading:

- `opencode.json:1-9` uses broad Bash permission allowance, not per-subcommand shell tool registration.
- `opencode.json:18-28` registers the memory server through MCP/launcher config.
- `.opencode/plugins/README.md:8` and `.opencode/plugins/README.md:24-46` describe local JavaScript plugins that can expose tools.
- `.opencode/plugins/mk-code-graph.js:394-419` exposes a plugin tool (`mk_code_graph_status`), showing plugin tools are available even though local shell subcommand gating is not.

### Migration inventory

Scoped inventory across agent allowed-tools, command markdown/YAML, runtime hooks/plugins, doctor routes/scripts, deep-loop allowlists, and runtime configs found:

- 93 unique files with memory-MCP or tool-name references.
- 1041 unique matched references.
- Per-surface counts:
  - Agent allowed-tools: 21 files, 154 refs.
  - Command YAML/Markdown: 56 files, 783 refs.
  - Runtime hooks/plugins: 8 files, 54 refs.
  - Doctor scripts/routes/assets: 11 files, 153 refs.
  - Deep-loop allowlists: 19 files, 65 refs.
  - Runtime config: 2 files, 37 refs.

High-volume files:

- `.opencode/commands/memory/manage.md`: 156 refs.
- `.opencode/commands/memory/search.md`: 104 refs.
- `.opencode/commands/speckit/resume.md`: 49 refs.
- `.opencode/commands/doctor/update.md`: 42 refs.
- `.opencode/commands/memory/README.txt`: 37 refs.
- `.claude/agents/context.md`: 30 refs.
- `.opencode/agents/context.md`: 30 refs.
- `.codex/agents/context.toml`: 29 refs.
- `.opencode/commands/memory/save.md`: 29 refs.
- `.opencode/commands/doctor/_routes.yaml`: 28 refs.

The older rough estimate of about 125 references was too narrow for this scoped search. The measured count includes mirrored agent surfaces and prose docs, so it should not be interpreted as 1041 executable call sites.

## Classification

RQ5 is terminal ACCEPTED for the dual-stack scope. Current OpenCode exposes plugins and MCP, but not a documented first-class local shell tool gate that this packet can wire today. The dual-stack CLI can still be built and used from shell/Bash/plugin wrappers. Replacing MCP affordances with first-class registered shell tools is an upstream/product capability question, not a blocker for this packet.

RQ6 is terminal ACCEPTED as a future migration packet. The migration surface is measured enough to scope later work. Full migration is intentionally outside dual-stack fallback delivery.

## Required Follow-On Boundary

The future migration packet should split executable call sites from documentation/allowed-tool prose before estimating implementation cost. This lineage should not change those references because the parent task is risk closure, not migration.

## Convergence Delta

New information gained: medium. RQ5 and RQ6 moved from deferred/hedged to terminal accepted classifications.

Remaining open: RQ7 and RQ8.
