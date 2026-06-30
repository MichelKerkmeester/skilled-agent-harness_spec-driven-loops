# Codex Desktop App Bridge

This folder is the project-scoped Codex configuration layer for the Codex Desktop App.

- `config.toml` defines the MCP servers Codex can load for this workspace.
- `specs` and `changelog` are symlinks to the canonical `.opencode` packet context.
- Repository skills are exposed through `.agents/skills`, because Codex discovers repo skills there. In this repo, `.agents` is a symlink to `.codex`, and `.codex/skills` points at `.opencode/skills`.
- Custom Codex agents are intentionally not symlinked from `.opencode/agents`; Codex expects `.codex/agents/*.toml`, while the canonical OpenCode and Claude agent mirrors are Markdown.

Trust this project in Codex Desktop before expecting the project-local config to load.
