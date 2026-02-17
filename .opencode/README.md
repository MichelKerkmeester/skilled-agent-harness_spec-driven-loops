---
title: "OpenCode Configuration Directory"
description: "AI assistant configuration backbone containing agents, skills, commands, scripts and specs that power the OpenCode framework with persistent memory and structured documentation."
trigger_phrases:
  - "opencode config"
  - "opencode directory"
  - "agent definitions"
  - "skill modules"
  - "slash commands"
  - "gate system"
  - "framework structure"
importance_tier: "normal"
---

# `.opencode/`: AI Assistant Configuration Directory

> AI assistant configuration backbone containing agents, skills, commands, scripts and specs that power the OpenCode framework with persistent memory and structured documentation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY STRUCTURE](#2--directory-structure)
- [3. AGENTS OVERVIEW](#3--agents-overview)
- [4. SKILLS OVERVIEW](#4--skills-overview)
- [5. COMMANDS OVERVIEW](#5--commands-overview)
- [6. KEY CONFIGURATION FILES](#6--key-configuration-files)
- [7. MEMORY SYSTEM](#7--memory-system)
- [8. GATE SYSTEM](#8--gate-system)
- [9. GETTING STARTED](#9--getting-started)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This directory serves as the configuration backbone of the OpenCode AI Assistant Framework. It contains agents, skills, commands, scripts, specs and configuration that power an AI coding assistant with persistent memory and structured documentation.

The framework is built on two core systems:

1. **Memory Engine**: 22 memory MCP tools across 7 layers (29 MCP tools total with 7 Code Mode tools), with 5-source indexing, 7-intent retrieval routing, schema v13 metadata (`document_type`, `spec_level`), document-type scoring and causal lineage tracking
2. **Spec Kit Documentation Framework**: Structured documentation with 84 templates, 13 validation rules, and Level 1-3+ CORE + ADDENDUM architecture

Together, these systems enable context-aware development with traceability, hardened retrieval behavior and session continuity through quality gates.

### Current Counts

| Category | Count | Details |
|---|---:|---|
| MCP Servers | 3 | Memory Engine, Code Mode, Sequential Thinking |
| MCP Tools | 29 | 22 memory + 7 code mode |
| Agents | 10 | 8 custom + 2 built-in (`@general`, `@explore`) |
| Skills | 9 | Skill modules in `.opencode/skill/` |
| Commands | 19 | `spec_kit`, `memory`, `create`, `agent_router` |
| Templates | 84 | Spec Kit CORE + ADDENDUM templates |
| YAML assets | 25 | Command execution YAML files |
| Validation rules | 13 | Spec folder validation scripts |

<!-- /ANCHOR:overview -->

---

## 2. DIRECTORY STRUCTURE
<!-- ANCHOR:directory-structure -->

```
.opencode/
├── agent/           — 8 specialized AI agent definitions for task delegation
├── command/         — 19 slash commands for workflow automation (spec_kit, memory, create)
├── install_guides/  — Setup and configuration guides for framework installation
├── skill/scripts/   — Skill routing scripts (skill_advisor.py) and setup guides
├── skill/           — 9 domain expertise skill modules with bundled resources
└── specs/           — Spec folder storage for documentation and memory files
```

**Directory Descriptions:**

- **`agent/`**: Agent definition files (`.md`) that provide specialized capabilities for orchestration, research, debugging, code review, documentation and session handover.
- **`command/`**: Slash command definitions organized by domain (spec_kit, memory, create) that provide workflow shortcuts and automation.
- **`install_guides/`**: Comprehensive setup documentation including `SET-UP - AGENTS.md`, skill installation guides and configuration examples.
- **`skill/scripts/`**: Skill routing utilities including `skill_advisor.py` (routing engine) and setup guides. Agent provider scripts are in `agent/scripts/`.
- **`skill/`**: Self-contained skill modules with `SKILL.md` entry points, bundled references, scripts and assets for domain-specific workflows.
- **`specs/`**: Archived or system-level spec folders. User spec folders typically live in project root `/specs/`.

<!-- /ANCHOR:directory-structure -->

---

## 3. AGENTS OVERVIEW
<!-- ANCHOR:agents-overview -->

The framework includes 8 specialized agents plus 2 built-in agents:

This is a 10 specialized agents / 3-platform model (OpenCode, Claude Code, Codex) with aligned role definitions.

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@orchestrate` | Task decomposition and multi-agent coordination | Complex requests needing delegation across multiple agents |
| `@context` | Codebase exploration and context retrieval (read-only) | ALL file search, pattern discovery and context loading tasks |
| `@research` | Technical investigation with 9-step methodology | Deep investigation before planning, evidence-based analysis |
| `@speckit` | Spec folder documentation (Level 1-3+) | Creating/updating spec folder docs (EXCLUSIVE for spec templates) |
| `@review` | Code review with 5-dimension quality scoring | PR reviews, pre-commit checks, code quality validation |
| `@write` | Documentation generation (READMEs, guides, skills) | Project-level docs outside spec folders |
| `@debug` | Fresh-perspective debugging (4-phase methodology) | After 3+ failed debug attempts, stuck issues |
| `@handover` | Session continuation and context preservation | Ending sessions, branching work, team handoffs |
| `@general` | General implementation and complex tasks | Default agent for code implementation (built-in) |
| `@explore` | Fast codebase search and discovery | Quick file/pattern search (built-in) |

**Agent Routing:** Automatic via Gate 2 (`skill_advisor.py`) or manual via `@agent_name` syntax. Current agent state includes model-agnostic `@review`, Haiku-tier `@handover`, and Codex profile-based agent frontmatter.

<!-- /ANCHOR:agents-overview -->

---

## 4. SKILLS OVERVIEW
<!-- ANCHOR:skills-overview -->

Skills are specialized, on-demand capabilities invoked for complex workflows:

| Skill | Description |
|-------|-------------|
| `system-spec-kit` | Spec folders, memory system, context preservation with CORE + ADDENDUM v2.2 architecture |
| `workflows-documentation` | Markdown quality enforcement, DQI scoring, templates, validation (v5.2) |
| `workflows-git` | Git workflow orchestrator for worktrees, commits, PRs with read-only enforcement (v1.5) |
| `workflows-code--web-dev` | Frontend development lifecycle: implementation, debugging, verification (v1.0.9) |
| `workflows-code--full-stack` | Multi-stack development with auto-detection (Go, Node.js, React, React Native, Swift) (v1.0) |
| `workflows-code--opencode` | OpenCode system code standards for JS, TS, Python, Shell with language routing (v1.3.2) |
| `workflows-chrome-devtools` | Chrome DevTools orchestrator with CLI (bdg) and MCP (Code Mode) routing (v2.1) |
| `mcp-code-mode` | MCP orchestration via TypeScript execution for external tools (ClickUp, Figma, etc.) (v1.1) |
| `mcp-figma` | Figma design file access with 18 tools for components, styles, exports (v1.1) |

**Skill Structure:** Each skill contains `SKILL.md` (entry point), `references/` (documentation), `scripts/` (automation) and `assets/` (templates/checklists).

<!-- /ANCHOR:skills-overview -->

---

## 5. COMMANDS OVERVIEW
<!-- ANCHOR:commands-overview -->

Commands are invoked with `/command_name` syntax in the chat interface.

### Spec Kit Commands (`/spec_kit:*`)

- `/spec_kit:research`: 9-step investigation workflow with evidence collection
- `/spec_kit:plan`: 7-step planning workflow from research to task breakdown
- `/spec_kit:implement`: Implementation workflow with quality gates
- `/spec_kit:complete`: Full 14+ step workflow from research to completion
- `/spec_kit:debug`: Debug delegation with model selection and task dispatch
- `/spec_kit:handover`: Session continuation with context preservation
- `/spec_kit:resume`: Resume existing spec folder work with context loading

### Memory Commands (`/memory:*`)

- `/memory:save`: Save session context to memory files (auto-indexed)
- `/memory:continue`: Crash recovery and context restoration
- `/memory:manage`: Memory database maintenance (stats, health, cleanup, checkpoints)
- `/memory:learn`: Explicit learning from mistakes with stability penalties
- `/memory:context`: Unified context retrieval with intent-aware routing

### Create Commands (`/create:*`)

- `/create:agent`: Generate new agent definition file
- `/create:skill`: Create new skill module with template structure
- `/create:skill_reference`: Add reference documentation to existing skill
- `/create:skill_asset`: Add asset (template/checklist) to existing skill
- `/create:folder_readme`: Generate README for any directory
- `/create:install_guide`: Create installation/setup guide

### Utility Commands

- `/agent_router`: Interactive agent selection for complex tasks

<!-- /ANCHOR:commands-overview -->

---

## 6. KEY CONFIGURATION FILES
<!-- ANCHOR:key-configuration-files -->

### `opencode.json` (project root)
Primary configuration file defining:
- MCP server connections (Spec Kit Memory, Code Mode, Sequential Thinking)
- Model selection and capabilities
- Custom keybindings and permissions
- Agent and skill registration

### `.utcp_config.json` (project root)
Code Mode MCP configuration for external tools:
- Webflow API integration
- Figma API integration
- GitHub API integration
- ClickUp API integration
- Chrome DevTools Protocol integration

### `.codex/config.toml` (project root)
Codex profile and sub-agent dispatch configuration:
- 4 execution profiles (`fast`, `balanced`, `powerful`, `readonly`)
- `gpt-5.3-codex-spark` for fast tier, `gpt-5.3-codex` for other tiers
- `codex-specialized-subagents` MCP server for delegate-based agent dispatch

### `AGENTS.md` (project root)
System prompt defining:
- Mandatory gates (Understanding, Skill Routing, Spec Folder)
- Operational protocols (confidence thresholds, clarification framework)
- Agent routing rules and escalation paths
- Code quality standards and anti-patterns

<!-- /ANCHOR:key-configuration-files -->

---

## 7. MEMORY SYSTEM
<!-- ANCHOR:memory-system -->

The Spec Kit Memory MCP provides persistent context across sessions:

- **Storage:** Memory files in `specs/[###-name]/memory/` using ANCHOR format for structured retrieval
- **Engine:** SQLite + `sqlite-vec` with provider auto-detection (Voyage, OpenAI, HF Local)
- **Retrieval:** Hybrid search across vector, BM25 and trigger matching with RRF fusion + cross-encoder reranking
- **Architecture:** 7-layer tool hierarchy (L1 Orchestration to L7 Maintenance)
- **Indexing:** 5 sources (spec memories, constitutional files, skill READMEs, project READMEs, spec documents) with `includeSpecDocs: true` default
- **Schema:** v13 adds `document_type` and `spec_level` columns for document-type scoring and filtering
- **Features:** Constitutional tier, session deduplication, causal lineage tracking, temporal decay, learning analytics and spec-document causal chains
- **Hardening (Spec126):** import-path fixes, `specFolder` filtering, metadata preservation, vector metadata plumbing, and stable causal edge semantics

**Spec Kit workflow features:** `upgrade-level.sh`, auto-populate workflow, `check-placeholders.sh`, and anchor tags.

**Memory File Format:** ANCHOR tags for semantic sections (`summary`, `state`, `decisions`, `context`, `artifacts`, `next-steps`, `blockers`).

**Unified Entry Point:** `memory_context()` provides intent-aware routing with 7 intents: `add_feature`, `fix_bug`, `understand`, `refactor`, `security_audit`, `find_spec`, `find_decision`.

<!-- /ANCHOR:memory-system -->

---

## 8. GATE SYSTEM
<!-- ANCHOR:gate-system -->

All AI interactions pass through 3 mandatory gates to ensure quality and traceability:

### Gate 1: Understanding + Context Surfacing (Soft Block)
- Trigger: Each new user message
- Action: `memory_match_triggers()` surfaces relevant context, parse intent, dual-threshold validation (confidence >= 0.70 AND uncertainty <= 0.35)
- Pass: Proceed to next gate
- Fail: Investigate (max 3 iterations) or escalate with options

### Gate 2: Skill Routing (Required for Non-Trivial Tasks)
- Trigger: Complex tasks
- Action: Run `skill_advisor.py "[request]" --threshold 0.8` OR cite user's explicit direction
- Pass: Confidence >= 0.8, MUST invoke recommended skill
- Fail: Confidence < 0.8, proceed with general approach

### Gate 3: Spec Folder (HARD BLOCK)
- Trigger: ANY file modification detected
- Action: Ask user: A) Use existing | B) Create new | C) Update related | D) Skip
- Pass: User provides A/B/C/D answer
- Fail: CANNOT use tools without answer
- Priority: Overrides soft blocks (ask BEFORE Gates 1-2 analysis)

**Enforcement:** Gate violations trigger self-correction protocol (STOP, Ask, Wait, Continue).

<!-- /ANCHOR:gate-system -->

---

## 9. GETTING STARTED
<!-- ANCHOR:getting-started -->

### Installation

1. **Review Setup Guide:** See `install_guides/README.md` for comprehensive setup instructions
2. **Configure MCP Servers:** Edit `opencode.json` to enable Spec Kit Memory MCP, Code Mode MCP and Sequential Thinking MCP
3. **Set Environment Variables:** Configure API keys for OpenAI (embeddings), external tools (Webflow, Figma, etc.)
4. **Initialize Memory Database:** Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/setup-db.js`

### Using the Framework

**Invoking Skills:**
- Automatic: Gate 2 auto-routes based on `skill_advisor.py` confidence scores
- Manual: Reference skill name in request (e.g., "Use workflows-documentation to create README")

**Running Commands:**
- Type `/command_name` in chat interface (e.g., `/spec_kit:plan`, `/memory:save`)

**Creating Spec Folders:**
- Gate 3 triggers spec folder question on file modifications
- Choose Option A (existing), B (new), C (update related) or D (skip)
- Level selection (1-3+) auto-determined by LOC and complexity

**Memory Operations:**
- Save context: `/memory:save` or trigger via "save context" phrase
- Resume work: `/memory:continue` or `memory_search({ specFolder, anchors: ['state', 'next-steps'] })`
- Explore memories: `memory_stats()`, `memory_list()`, `memory_health()`

### Common Workflows

- **File modification:** Gate 1, Gate 2, Gate 3 (ask spec folder), Load memory context, Execute
- **Research task:** `memory_match_triggers()`, `memory_context()`, Document findings
- **Resume session:** `/memory:continue`, Review checklist, Continue work
- **End session:** `/spec_kit:handover`, Save context, Continuation prompt
- **Provider switch (agents):** `bash .opencode/agent/scripts/activate-provider.sh <copilot|chatgpt>` then `bash .opencode/agent/scripts/provider-status.sh`

### Further Reading

- **Agents:** Individual `.md` files in `.opencode/agent/`
- **Skills:** `SKILL.md` in each `.opencode/skill/[skill-name]/` directory
- **Commands:** `.md` files in `.opencode/command/[domain]/[command-name].md`
- **Setup:** `.opencode/install_guides/` for installation and configuration

<!-- /ANCHOR:getting-started -->
