# OpenCode Commands

Quick reference for all available slash commands.

---

## Memory Commands (`/memory:*`)

| Command | Description | Usage |
|---------|-------------|-------|
| `/memory:save` | Save conversation context | `/memory:save [spec-folder]` |
| `/memory:search` | Search and manage memories | `/memory:search [query]` |
| `/memory:checkpoint` | Create/restore checkpoints | `/memory:checkpoint create "name"` |

## SpecKit Commands (`/spec_kit:*`)

| Command | Description | Usage |
|---------|-------------|-------|
| `/spec_kit:complete` | Full feature workflow (plan→build) | `/spec_kit:complete [feature-description]` |
| `/spec_kit:plan` | Create planning documents only | `/spec_kit:plan [feature-description]` |
| `/spec_kit:research` | Deep technical investigation | `/spec_kit:research [topic]` |
| `/spec_kit:implement` | Execute implementation phase | `/spec_kit:implement [spec-folder]` |
| `/spec_kit:resume` | Resume work on existing spec | `/spec_kit:resume [spec-folder]` |
| `/spec_kit:handover` | Create handover doc for next session | `/spec_kit:handover` |
| `/spec_kit:debug` | Delegate stuck problem to specialist | `/spec_kit:debug` |
| `/spec_kit:help` | Show SpecKit help and commands | `/spec_kit:help [command]` |

## Search Commands (`/search:*`)

| Command | Description | Usage |
|---------|-------------|-------|
| `/search:code` | Unified AI-powered code search | `/search:code [query] [--index:name]` |
| `/search:index` | LEANN index management | `/search:index [update\|list\|build\|remove]` |

## Create Commands (`/create:*`)

| Command | Description | Usage |
|---------|-------------|-------|
| `/create:skill` | Create complete OpenCode skill | `/create:skill skill-name` |
| `/create:skill_reference` | Create reference file for skill | `/create:skill_reference skill-name type` |
| `/create:skill_asset` | Create asset file for skill | `/create:skill_asset skill-name type` |
| `/create:folder_readme` | Create AI-optimized README | `/create:folder_readme path [--type]` |
| `/create:install_guide` | Create installation guide | `/create:install_guide project-name` |

---

## Command Syntax

Commands use colon notation: `/category:action [arguments]`

- Arguments in `[brackets]` are optional
- Arguments in `"quotes"` are required strings
- Flags use `--flag:value` or `--flag value` format

---

## Full Documentation

Each command has detailed documentation in its respective folder:

| Category | Location |
|----------|----------|
| Memory | `.opencode/command/memory/` |
| SpecKit | `.opencode/command/spec_kit/` |
| Search | `.opencode/command/search/` |
| Create | `.opencode/command/create/` |
