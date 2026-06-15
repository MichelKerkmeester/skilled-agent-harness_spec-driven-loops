---
title: "OpenCode Commands"
description: "Slash commands for OpenCode providing structured workflows for component creation, deep loops, prompt improvement, memory management, and spec kit operations."
trigger_phrases:
  - "opencode commands"
  - "slash commands"
  - "command reference"
  - "available commands"
---

# OpenCode Commands

> Slash commands that provide structured workflows for component creation, deep loops, prompt improvement, memory management, and spec kit operations.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PURPOSE](#2--purpose)
- [3. STRUCTURE](#3--structure)
- [4. COMMAND GROUPS](#4--command-groups)
- [5. INSTRUCTIONS](#5--instructions)
- [6. USAGE](#6--usage)
- [7. EXECUTION MODES](#7--execution-modes)
- [8. FAQ](#8--faq)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED DOCUMENTS](#10--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Commands are invoked as slash commands (e.g., `/create:feature-catalog`, `/deep:review`, `/prompt`, `/memory:save`, `/speckit:plan`). Each command is a markdown file with YAML frontmatter that defines its description, argument hints, and allowed tools.

Commands are organized into five groups plus root-level utilities:

| Group | Path | Commands | Purpose |
|-------|------|----------|---------|
| **create** | `commands/create/` | 7 | Scaffold OpenCode components, documentation packages, and changelogs |
| **deep** | `commands/deep/` | 5 | Deep research, review, AI council, agent-improvement, and model-benchmark loops |
| **doctor** | `commands/doctor/` | 3 | MCP, Spec Kit, update, and subsystem diagnostics |
| **memory** | `commands/memory/` | 4 | Memory system operations (search, save, learn, manage with shared lifecycle) |
| **speckit** | `commands/speckit/` | 4 | Spec folder workflows (plan, implement, resume, complete) |
| **root** | `commands/` | 2 | Standalone `/agent_router` and `/prompt` utilities |

Standalone commands live at the root level: `agent_router.md` routes requests to AI systems, and `prompt.md` is the canonical prompt-improvement surface.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:purpose -->
## 2. PURPOSE

Use this document as the top-level routing reference for the OpenCode slash-command surface. It explains which command group owns which workflow and points readers to the canonical sub-index for deeper command-family detail.

This file is descriptive only. The executable contract for any workflow lives in the command entrypoint markdown file itself.

<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
command/
├── agent_router.md           # Route requests to AI systems
├── prompt.md                 # Canonical prompt improvement command
├── create/                   # Component creation commands
│   ├── agent.md              # Create new agent
│   ├── changelog.md          # Create changelog entry
│   ├── feature-catalog.md    # Create or update feature catalog package
│   ├── folder_readme.md      # Create folder README
│   ├── sk-skill.md           # Create or update skill package/files
│   ├── skill.md              # Create or update skill package/files
│   ├── testing-playbook.md   # Create or update manual testing playbook package
│   └── assets/               # YAML workflow definitions (12 files)
├── deep/                     # Deep-loop commands
│   ├── ask-ai-council.md     # Multi-seat AI council planning
│   ├── start-agent-improvement-loop.md # Evaluator-first agent improvement loop
│   ├── start-model-benchmark-loop.md # Model/prompt-framework benchmark loop
│   ├── start-research-loop.md # Iterative deep research workflow
│   ├── start-review-loop.md  # Iterative code review workflow
│   └── assets/               # YAML workflow definitions (10 files)
├── doctor/                   # MCP server diagnostic and install commands
│   ├── mcp.md                # Diagnose/install MCP infrastructure
│   ├── speckit.md            # Spec Kit diagnostics
│   ├── update.md             # Dependency-ordered subsystem alignment
│   ├── assets/               # YAML workflow definitions
│   └── scripts/              # Diagnostic scripts
├── memory/                   # Memory system commands
│   ├── search.md             # Unified retrieval + analysis (intent-aware search, epistemic, causal, eval)
│   ├── learn.md              # Constitutional memory manager
│   ├── manage.md             # Database management, ingest, and shared lifecycle
│   ├── save.md               # Save conversation context
│   └── README.txt            # Memory command index
└── speckit/                  # Spec folder workflow commands
    ├── complete.md           # Full end-to-end workflow
    ├── implement.md          # Execute pre-planned work
    ├── plan.md               # Spec through plan only
    ├── resume.md             # Resume existing spec work
    └── assets/               # YAML workflow definitions (8 files)
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:command-groups -->
## 4. COMMAND GROUPS

### Create Commands

Scaffold OpenCode components using the `sk-doc` skill. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `create/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent | `/create:agent <name>` | Create agent with frontmatter, tool permissions, behavioral rules |
| Changelog | `/create:changelog <spec-folder-or-component>` | Create a changelog entry from recent work |
| Feature Catalog | `/create:feature-catalog <skill> [create\|update]` | Create or update a rooted `feature_catalog/` package |
| Folder README | `/create:folder_readme [readme\|install] <target>` | Unified README and install guide workflow |
| Parent Skill | `/create:sk-skill-parent <skill-name> [create\|update] [--modes <m1,m2,...>]` | Scaffold a parent skill with nested mode packets (one hub identity, registry source of truth) |
| Skill | `/create:sk-skill <name> <operation> [type]` | Unified skill create/update/reference/asset workflow |
| Testing Playbook | `/create:testing-playbook <skill> [create\|update]` | Create or update a rooted `manual_testing_playbook/` package |

### Doctor Commands

Diagnose, install, and repair MCP server connections. Backed by `mcp-doctor.sh` diagnostic script and interactive YAML workflows.

| Command | Invocation | Purpose |
|---------|------------|---------|
| MCP Debug | `/doctor:mcp debug [--fix] [--server <name>]` | Diagnose and fix MCP connection issues across all runtimes |
| MCP Install | `/doctor:mcp install [--server <name>] [--runtime <name>]` | Fresh install or reinstall all 4 MCP servers from install guides |

### Deep Commands

Run long-form, stateful deep-loop workflows. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `deep/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| AI Council | `/deep:ai-council <question> [:auto\|:confirm]` | Multi-seat planning and convergence checks |
| Agent Improvement | `/deep:agent-improvement <agent_path> [:auto\|:confirm]` | Evaluate and improve agents across 5 integration-aware dimensions |
| Model Benchmark | `/deep:model-benchmark [profile] [:auto\|:confirm]` | Benchmark and optimize a model or prompt framework against fixtures |
| Research Loop | `/deep:research <topic> [:auto\|:confirm]` | Iterative technical investigation with convergence |
| Review Loop | `/deep:review <target> [:auto\|:confirm]` | Iterative code review with severity-weighted findings |

### Root Commands

Root commands have no group prefix.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent Router | `/agent_router <request>` | Route a request through intelligent AI system selection |
| Prompt | `/prompt <prompt_or_topic> [:auto\|:confirm]` | Create or improve prompts using frameworks, DEPTH thinking, and CLEAR scoring |

### Memory Commands

Manage the Spec Kit Memory system for context preservation across sessions.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Search | `/memory:search <query>` or `/memory:search <subcommand>` | Unified retrieval + analysis (intent-aware search, epistemic, causal, eval) |
| Learn | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories |
| Manage | `/memory:manage <subcommand>` | Database operations (`scan`, `cleanup`, `tier`, `health`, `checkpoint`, `ingest`) |
| Save | `/memory:save <spec-folder>` | Update packet continuity with semantic indexing |

### Spec Kit Commands

Structured workflows for the spec folder development lifecycle.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Complete | `/speckit:complete <description>` | Full end-to-end workflow (14+ steps) |
| Plan (intake-only) | `/speckit:plan --intake-only [description] [:auto\|:confirm]` | Standalone intake that publishes `spec.md`, `description.json`, and `graph-metadata.json` |
| Implement | `/speckit:implement <spec-folder>` | Execute pre-planned work (requires plan.md) |
| Plan | `/speckit:plan <description> [:with-phases]` | Planning workflow (spec through plan only; `:with-phases` adds phase decomposition) |
| Resume | `/speckit:resume [spec-folder]` | Resume work on existing spec folder |

<!-- /ANCHOR:command-groups -->

---

<!-- ANCHOR:instructions -->
## 5. INSTRUCTIONS

1. Choose the command group that matches your intent: `create`, `deep`, `doctor`, `memory`, or `speckit`.
2. Use the canonical slash-command form `/<group>:<command>` unless the command is a root utility such as `/agent_router` or `/prompt`.
3. Prefer the unified commands over historical split commands.
4. When a command supports `:auto` and `:confirm`, pick the mode that matches how much checkpointing you want.
5. Follow the family-specific index under `commands/<group>/README.txt` when one exists and you need detailed routing help.

<!-- /ANCHOR:instructions -->

---

<!-- ANCHOR:usage -->
## 6. USAGE

### Basic Invocation

```
/create:feature-catalog system-spec-kit create :confirm
/create:testing-playbook system-spec-kit update :auto
/create:sk-skill my-new-skill full-create :auto
/deep:agent-improvement .opencode/agents/review.md :confirm
/prompt $improve "Build a clearer CLI handoff prompt" :auto
/memory:save specs/007-feature
/speckit:plan "Add user authentication" :auto
```

### With Execution Modes

```
# Auto mode: execute without approval prompts
/speckit:complete "Add dark mode" :auto

# Confirm mode: pause at each step for approval
/create:agent my-agent :confirm

# With research phase
/speckit:complete "New feature" :with-research

# With automatic debug recovery notes
```

### Agent Router

```
# Route a request through intelligent agent selection
# Use the exact command name (not /agents or /agents_router)
/agent_router "Build a new authentication system"
```

<!-- /ANCHOR:usage -->

---

<!-- ANCHOR:execution-modes -->
## 7. EXECUTION MODES

Most commands in `create/`, `deep/`, `prompt`, and `speckit/` support two execution modes controlled by a suffix argument.

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode maps to a separate YAML workflow file in the command's `assets/` folder:
- Auto: `<command>_auto.yaml`
- Confirm: `<command>_confirm.yaml`

The `speckit:complete` command supports two additional modes:
- `:with-research` adds a research phase before planning

<!-- /ANCHOR:execution-modes -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: What is the difference between `:auto` and `:confirm` mode?**

A: `:auto` runs all steps in sequence without pausing. `:confirm` stops at each step and waits for your approval before continuing. Use `:auto` when you trust the workflow and want speed. Use `:confirm` when you want to review or adjust each step before it executes.

**Q: Can I use a command without specifying a mode?**

A: Yes. Most commands fall back to `:confirm` behavior when no mode suffix is given. Check the command's frontmatter for its default if the behavior is unclear.

**Q: When should I use `/speckit:plan` instead of `/speckit:complete`?**

A: Use `/speckit:plan` when you want to produce a spec and plan document for review before any implementation begins. Use `/speckit:complete` when you are ready to run the full workflow end-to-end, including implementation.

**Q: How do I recover a session that was interrupted?**

A: Run `/speckit:resume`. This is the canonical recovery surface for packet work. It rebuilds context from `handover.md`, then `_memory.continuity`, then the packet's canonical spec docs before deeper MCP retrieval surfaces kick in.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Command not recognized | Wrong invocation format | Use `/<group>:<command>` format (e.g., `/memory:save`) |
| Agent router command not found | Used `/agents` or `/agents_router` alias | Use `/agent_router "<request>"` |
| Missing arguments error | Required argument not provided | Check the `argument-hint` in the command's frontmatter |
| YAML workflow not found | Missing asset file | Verify `assets/` folder contains the corresponding YAML |
| `create` vs `update` mismatch | Target package exists/does not exist as expected | Re-run the command with the matching operation |
| Tool permission denied | Command lacks required tool | Check `allowed-tools` in command frontmatter |
| Agent router has no request | Empty arguments passed | Provide an explicit request string |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [AGENTS.md](../../AGENTS.md) | Framework defining gates, protocols, agent routing |
| [Create Commands](create/README.txt) | Detailed index for all `/create:*` commands |
| [Deep Agent Improvement Command](deep/start-agent-improvement-loop.md) | Agent improvement loop command |
| [Prompt Command](prompt.md) | Canonical prompt improvement command |
| [sk-doc SKILL.md](../skills/sk-doc/SKILL.md) | Documentation standards and component creation |
| [system-spec-kit SKILL.md](../skills/system-spec-kit/SKILL.md) | Spec folder workflow and memory system |
| [Memory Commands](memory/README.txt) | Memory save, analyze, learn, manage, and shared commands |
| [Spec Kit Commands](speckit/README.txt) | SpecKit plan, implement, complete, and workflow commands |

<!-- /ANCHOR:related-documents -->
