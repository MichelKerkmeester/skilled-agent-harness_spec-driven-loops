---
title: "OpenCode Commands"
description: "OpenCode slash commands: component creation, deep loops, prompts, continuity, rewrites and spec kit workflows."
trigger_phrases:
  - "opencode commands"
  - "slash commands"
  - "command reference"
  - "available commands"
---

# OpenCode Commands

> Slash commands that provide structured workflows for component creation, deep loops, prompt improvement, packet continuity, and spec kit operations.

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

Commands are invoked as slash commands (e.g., `/create:feature-catalog`, `/deep:review`, `/prompt:improve`, `/speckit:save`, `/speckit:plan`). Each command is a markdown file with YAML frontmatter that defines its description, argument hints, and allowed tools.

Commands are organized into five groups plus root-level utilities:

| Group | Path | Commands | Purpose |
|-------|------|----------|---------|
| **create** | `commands/create/` | 14 | Scaffold OpenCode components, documentation packages, changelogs, charts, diagrams, diffs and repo rules |
| **deep** | `commands/deep/` | 6 | Deep research, review, AI council and improvement loops |
| **doctor** | `commands/doctor/` | 3 | MCP, Spec Kit, update, and subsystem diagnostics |
| **design** | `commands/design/` | 1 | Measured Style Reference DESIGN.md extraction |
| **prompt** | `commands/prompt/` | 1 | Prompt engineering surface (`/prompt:improve`) via sk-prompt |
| **rewrite** | `commands/rewrite/` | 3 | Re-express an existing reply or topic in plain English, or as a diagram |
| **speckit** | `commands/speckit/` | 6 | Spec folder workflows (plan, implement, resume, complete), continuity write (save) and lexical retrieval (search) |
| **root** | `commands/` | 3 | Standalone `/agent-router`, `/goal-opencode` and `/vision` utilities |

Standalone commands live at the root level: `agent-router.md` routes requests to AI systems, `goal-opencode.md` manages the passive session goal via the `opencode-goal` plugin, and `vision.md` reads your most recent image on-device. The prompt-improvement surface lives in the `prompt` group as `prompt/improve.md` (invoked `/prompt:improve`).

Each group's command count above is the number of command files in that folder. When a command is added, update the count and its row in section 4; a group whose file set outgrew this index is the failure mode this document has hit before.

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
├── agent-router.md           # Route requests to AI systems
├── goal-opencode.md          # Session-goal router for the opencode-goal plugin (OpenCode only)
├── vision.md                 # On-device read of your most recent image
├── prompt/                   # Prompt engineering command group
│   └── improve.md            # Canonical prompt improvement command (/prompt:improve)
├── create/                   # Component creation commands — see create/README.txt for the
│   │                         # full fourteen-command table and per-command invocations
│   ├── agent.md              # Create new agent
│   ├── benchmark.md          # Promote a curated MCP benchmark folder
│   ├── changelog.md          # Create changelog entry
│   ├── chart.md              # Author a standalone HTML data chart
│   ├── command.md            # Create or update OpenCode slash command set
│   ├── diagram.md            # Create an HTML/SVG diagram or a validated ASCII flowchart
│   ├── diff.md               # Create a before/after document diff report
│   ├── feature-catalog.md    # Create or update feature catalog package
│   ├── manual-testing-playbook.md   # Create or update manual testing playbook package
│   ├── readme.md             # Create folder README or install guide
│   ├── repo-rule.md          # Create, revise or retire a repo rule
│   ├── skill.md              # Create or update skill package/files
│   ├── skill-parent.md       # Scaffold a parent skill with nested mode packets
│   ├── with-human-voice.md   # Apply or score prose against the Human Voice Rules
│   └── assets/               # YAML workflow and presentation contracts
├── deep/                     # Deep-loop commands
│   ├── agent-improvement.md  # Evaluator-first agent improvement loop
│   ├── ai-council.md         # Multi-seat AI council planning
│   ├── model-benchmark.md    # Model/prompt-framework benchmark loop
│   ├── research.md           # Iterative deep research workflow
│   ├── review.md             # Iterative code review workflow
│   ├── skill-benchmark.md    # Skill routing and usefulness benchmark loop
│   └── assets/               # YAML workflow definitions
├── doctor/                   # MCP server diagnostic and install commands
│   ├── mcp.md                # Diagnose/install MCP infrastructure
│   ├── speckit.md            # Spec Kit diagnostics
│   ├── update.md             # Dependency-ordered subsystem alignment
│   ├── assets/               # YAML workflow definitions
│   └── scripts/              # Diagnostic scripts
├── design/                    # Design extraction commands
│   ├── extract.md             # Extract a measured Style Reference DESIGN.md
│   └── assets/                # Auto/confirm/presentation workflow assets
├── rewrite/                  # Plain-English and visual re-expression commands
│   ├── explain-visually.md   # Explain the prior reply or a topic as the smallest useful diagram
│   ├── response.md           # Rewrite the active AI's last reply in plain English
│   └── response-by-external-agent.md   # Same, via an external CLI agent or local LLM
└── speckit/                  # Spec folder workflow, continuity write and retrieval commands
    ├── complete.md           # Full end-to-end workflow
    ├── implement.md          # Execute pre-planned work
    ├── plan.md               # Spec through plan only
    ├── resume.md             # Resume existing spec work
    ├── save.md               # Save conversation context into packet continuity
    ├── search.md             # Lexical retrieval: trigger-index lookup plus ripgrep recipes
    └── assets/               # YAML workflow definitions, plus save/search presentation contracts
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:command-groups -->
## 4. COMMAND GROUPS

### Create Commands

Scaffold OpenCode components using the `sk-doc` skill. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `create/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent | `/create:agent <agent_name>` | Create agent with frontmatter, tool permissions, behavioral rules |
| Benchmark | `/create:benchmark <skill-or-mode> <spec-packet> --family=<family>` | Author or update family-keyed benchmark packages |
| Changelog | `/create:changelog <spec-folder-or-component>` | Create a global or packet-local changelog entry from recent work |
| Chart | `/design:chart <target-chart.html> <what the reader compares>` | Author a standalone HTML chart from a catalog of 21 forms |
| Command | `/create:command <command_invocation> [command_request]` | Create or update an OpenCode slash command set |
| Diagram | `/design:diagram <target.html\|target.md> [description\|--import <src>]` | Create an HTML/SVG diagram, an ASCII/markdown flowchart, or a draw.io/Mermaid redraw |
| Diff | `/create:diff <document> [:auto\|:confirm]` | Create a self-contained before/after document diff report |
| Feature Catalog | `/create:feature-catalog <skill> [create\|update]` | Create or update a rooted `feature-catalog/` package |
| Folder README | `/create:readme [readme\|install] <target>` | Unified README and install guide workflow |
| Parent Skill | `/create:skill-parent <skill-name> [create\|update] [--modes <m1,m2,...>]` | Scaffold a parent skill with nested mode packets (one hub identity, registry source of truth) |
| Repo Rule | `/create:repo-rule <what the rule should bind> [create\|revise\|retire]` | Create, revise or retire a repo rule under `repo-rules/`, wired into `REPO RULES.md` |
| Skill | `/create:skill <name> <operation> [type]` | Unified skill create/update/reference/asset workflow |
| Testing Playbook | `/create:manual-testing-playbook <skill> [create\|update]` | Create or update a rooted `manual-testing-playbook/` package |
| With Human Voice | `/create:with-human-voice <file or passage> [apply\|score]` | Apply or score prose against the Human Voice Rules |

### Doctor Commands

Three command files cover the diagnostic surface. Backed by `_routes.yaml`, `mcp-doctor.sh`, and interactive YAML workflows.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Doctor Router | `/doctor <target> [flags]` (backed by `doctor/speckit.md`) | Single entry point for 9 subsystems (`speckit-retrieval`, `embeddings`, `deep-loop`, `skill-advisor`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `fable-mode`, `runtime-mirrors`); argv-positional dispatch via `_routes.yaml` |
| MCP Debug | `/doctor:mcp debug [--fix] [--server <name>]` | Diagnose and fix MCP connection issues across all runtimes |
| MCP Install | `/doctor:mcp install [--server <name>] [--runtime <name>]` | Fresh install or reinstall all supported MCP servers from install guides |
| Update | `/doctor:update [--migrate] [--force]` | Dependency-safe multi-subsystem rebuild orchestrator (trigger index, skill-graph, advisor, deep-loop) |

### Deep Commands

Run long-form, stateful deep-loop workflows. Each command supports `:auto` and `:confirm` execution modes with corresponding YAML workflow files in `deep/assets/`.

| Command | Invocation | Purpose |
|---------|------------|---------|
| AI Council | `/deep:ai-council <question> [:auto\|:confirm]` | Multi-seat planning and convergence checks |
| Agent Improvement | `/deep:agent-improvement <agent_path> [:auto\|:confirm]` | Evaluate and improve agents across 5 integration-aware dimensions |
| Model Benchmark | `/deep:model-benchmark [profile] [:auto\|:confirm]` | Benchmark and optimize a model or prompt framework against fixtures |
| Research Loop | `/deep:research <topic> [:auto\|:confirm]` | Iterative technical investigation with convergence |
| Review Loop | `/deep:review <target> [:auto\|:confirm]` | Iterative code review with severity-weighted findings |
| Skill Benchmark | `/deep:skill-benchmark <skill> [:auto\|:confirm]` | Benchmark a skill routing, discovery, efficiency and usefulness |

### Design Commands

Extract a measured Style Reference from a live site using the `sk-design-md-generator` skill.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Extract | `/design:extract <live-url> --output <dir> [:auto\|:confirm]` | Extract a measured Style Reference DESIGN.md |

### Root Commands

Root commands have no group prefix.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Agent Router | `/agent-router <request>` | Route a request through intelligent AI system selection |
| Prompt | `/prompt:improve <prompt_or_topic> [:auto\|:confirm]` | Create or improve prompts using frameworks, DEPTH thinking, and CLEAR scoring |
| Goal (OpenCode) | `/goal-opencode <condition>` | Set/show/pause/clear/complete a durable session-completion goal via the `opencode-goal` plugin |
| Vision | `/vision [question about your most recent image]` | On-device scene read, caption and OCR of your most recent image; omit the question for a full read |

### Rewrite Commands

Re-express something that already exists — the active AI's last reply, or a named topic — without changing files.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Response | `/rewrite:response [--show-original]` | Rewrite the active AI's most recent reply into plain English in-context |
| Response by External Agent | `/rewrite:response-by-external-agent [cli-<skill>\|native\|local] [target-text]` | Same projection, run through an external CLI agent or a local LLM |
| Explain Visually | `/rewrite:explain-visually [--depth=expert\|plain\|novice] [--artifact] [topic]` | Explain the prior reply or a topic as the smallest diagram that answers the question |

### Spec Kit Commands

Structured workflows for the spec folder development lifecycle, plus packet continuity write and lexical retrieval.

| Command | Invocation | Purpose |
|---------|------------|---------|
| Complete | `/speckit:complete <description>` | Full end-to-end workflow (14+ steps) |
| Implement | `/speckit:implement <spec-folder>` | Execute pre-planned work (requires plan.md) |
| Plan | `/speckit:plan <description> [--intake-only] [:with-phases]` | Planning workflow (spec through plan only). `--intake-only` publishes just `spec.md`, `description.json` and `graph-metadata.json`. `:with-phases` adds phase decomposition |
| Resume | `/speckit:resume [spec-folder]` | Resume work on existing spec folder |
| Save | `/speckit:save <spec-folder>` | Write conversation context into canonical spec-doc continuity surfaces |
| Search | `/speckit:search <query> [--packet <spec-folder>] [--triggers\|--paths\|--count]` | Lexical retrieval: trigger-index lookup plus ripgrep recipes over spec docs and skill docs |

<!-- /ANCHOR:command-groups -->

---

<!-- ANCHOR:instructions -->
## 5. INSTRUCTIONS

1. Choose the command group that matches your intent: `create`, `deep`, `design`, `doctor`, `prompt`, `rewrite`, or `speckit`.
2. Use the canonical slash-command form `/<group>:<command>` unless the command is a root utility such as `/agent-router` or `/goal-opencode`.
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
/create:manual-testing-playbook system-spec-kit update :auto
/create:skill my-new-skill full-create :auto
/deep:agent-improvement .opencode/agents/review.md :confirm
/prompt:improve $improve "Build a clearer CLI handoff prompt" :auto
/speckit:save specs/007-feature
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
# Use the exact command name (not /agents or /agents-router)
/agent-router "Build a new authentication system"
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

A: Run `/speckit:resume`. This is the canonical recovery surface for packet work. It rebuilds context from `handover.md`, then `_memory.continuity`, then the packet's canonical spec docs. When you still need to find something afterwards, `/speckit:search` runs the lexical lanes over spec docs and skill docs.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Command not recognized | Wrong invocation format | Use `/<group>:<command>` format (e.g., `/speckit:save`) |
| Agent router command not found | Used `/agents` or `/agents-router` alias | Use `/agent-router "<request>"` |
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
| [Deep Agent Improvement Command](deep/agent-improvement.md) | Agent improvement loop command |
| [Prompt Command](prompt/improve.md) | Canonical prompt improvement command |
| [sk-doc SKILL.md](../skills/sk-doc/SKILL.md) | Documentation standards and component creation |
| [system-spec-kit SKILL.md](../skills/system-spec-kit/SKILL.md) | Spec folder workflow and packet continuity |
| [Spec Kit Commands](speckit/README.txt) | SpecKit plan, implement, complete, resume, save and search commands |

<!-- /ANCHOR:related-documents -->
