# OpenCode Commands

This directory contains all available OpenCode slash commands organized by namespace.

## Command Namespaces

| Namespace | Purpose | Directory |
|-----------|---------|-----------|
| `/create:*` | Create new skills, documentation, assets | `create/` |
| `/spec_kit:*` | Spec folder workflows and management | `spec_kit/` |
| `/memory:*` | Memory system operations | `memory/` |
| `/search:*` | Code search and indexing | `search/` |

---

## `/create:*` Commands

Commands for creating new skills, documentation, and assets.

| Command | Description | File |
|---------|-------------|------|
| `/create:skill` | Create a complete OpenCode skill with SKILL.md, references, assets | `create/skill.md` |
| `/create:install_guide` | Create installation guide for MCP servers, plugins, tools | `create/install_guide.md` |
| `/create:skill_reference` | Create a skill reference file | `create/skill_reference.md` |
| `/create:skill_asset` | Create a skill asset file (templates, examples) | `create/skill_asset.md` |
| `/create:folder_readme` | Create README for a folder | `create/folder_readme.md` |

---

## `/spec_kit:*` Commands

Commands for managing spec folders and development workflows.

| Command | Description | File |
|---------|-------------|------|
| `/spec_kit:complete` | Full 14-step workflow (research + plan + implement) | `spec_kit/complete.md` |
| `/spec_kit:plan` | Planning-only 7-step workflow | `spec_kit/plan.md` |
| `/spec_kit:implement` | Implementation 9-step workflow | `spec_kit/implement.md` |
| `/spec_kit:research` | Research 9-step workflow | `spec_kit/research.md` |
| `/spec_kit:resume` | Resume an existing spec folder session | `spec_kit/resume.md` |
| `/spec_kit:handover` | Create handover document for session continuity | `spec_kit/handover.md` |
| `/spec_kit:debug` | Debug delegation with model selection | `spec_kit/debug.md` |

---

## `/memory:*` Commands

Commands for managing the Spec Kit Memory system.

| Command | Description | File |
|---------|-------------|------|
| `/memory:search` | Search memories semantically | `memory/search.md` |
| `/memory:save` | Save context to memory file | `memory/save.md` |
| `/memory:checkpoint` | Create, list, restore, delete checkpoints | `memory/checkpoint.md` |

---

## `/search:*` Commands

Commands for code search and indexing.

| Command | Description | File |
|---------|-------------|------|
| `/search:code` | Semantic code search using Narsil | `search/code.md` |
| `/search:index` | Manage Narsil indexes (build, list, remove) | `search/index.md` |

---

## Command File Structure

Each command is defined in a Markdown file with YAML frontmatter:

```yaml
---
name: command-name
description: Brief description of what the command does
allowed-tools: [Tool1, Tool2, Tool3]
---
```

### Asset Files

Commands may have associated YAML asset files in `assets/` subdirectories containing:
- Workflow definitions
- Preset configurations
- Step-by-step instructions

---

## Usage

Commands are invoked using the slash notation:

```
/namespace:command [arguments]
```

Examples:
```
/spec_kit:complete "Add user authentication"
/memory:search "authentication patterns"
/create:skill --name "my-skill"
```

---

## Adding New Commands

1. Create a new `.md` file in the appropriate namespace directory
2. Add YAML frontmatter with `name`, `description`, `allowed-tools`
3. Document the command's purpose, usage, and workflow
4. If needed, create asset files in `assets/` subdirectory

See `workflows-documentation` skill for command template and creation guidelines.
