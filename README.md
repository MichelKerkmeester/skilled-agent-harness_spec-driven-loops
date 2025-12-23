# OpenCode Dev Environment

> - 99.999% of people won't try these systems. Beat the odds?
> - Don't reward me with unwanted coffee: https://buymeacoffee.com/michelkerkmeester

A practical AI-assisted coding setup: structured docs, semantic memory, and reusable skills so you spend less time re-explaining context and more time shipping. If you use AI in your terminal or editor every day, this system is meant to make those sessions more consistent, more recoverable, and easier to scale across projects.

For the full, detailed documentation on SpecKit and the Memory system:
- SpecKit (levels, templates, scripts, commands): [`speckit/README.md`](speckit/README.md)
- Memory (setup, search, MCP tools, troubleshooting): [`memory/README.md`](memory/README.md)

---

## TABLE OF CONTENTS

- [1. 🚀 INSTALLING OPENCODE](#1--installing-opencode)
- [2. 🔌 CONNECTING PROVIDERS](#2--connecting-providers)
- [3. 🧩 MCP SERVER SETUP](#3--mcp-server-setup)
- [4. 🤖 AGENTS.MD FRAMEWORK](#4--agentsmd-framework)
- [5. 🗂️ SPECKIT: DOCUMENTATION FRAMEWORK](#5--speckit--documentation-framework)
- [6. 🧠 MEMORY SYSTEM](#6--memory-system)
- [7. 🎛️ SKILLS LIBRARY](#7--skills-library)
- [8. ⚡ COMMANDS](#8--commands)
- [9. 🏎️ QUICK REFERENCE](#9--quick-reference)

---

## 1. 🚀 INSTALLING OPENCODE

### What is OpenCode?

[OpenCode](https://github.com/opencodeco/opencode) is a terminal-based AI coding assistant. It can connect to multiple model providers, talk to MCP servers, and load a skills/plugin system so your workflow is more than just “chat + paste”.

### Installation

```bash
# macOS (Homebrew): recommended
brew install opencode-ai/tap/opencode

# Or via Go
go install github.com/opencodeco/opencode@latest
```

### First Run

```bash
cd /path/to/your-project
opencode
```

On first launch, OpenCode guides you through provider configuration (see Section 2).

### Configuration File

OpenCode reads `opencode.json` from your project root. Use the template in this folder:

```bash
cp "Code Environment/opencode.json" /path/to/your-project/opencode.json
```

Then update paths for your MCP server locations.

---

## 2. 🔌 CONNECTING PROVIDERS

OpenCode supports multiple LLM providers. Here are the most common setups:

### GitHub Copilot Pro+ (Best Value)

**The most cost-effective way to access premium models with CLI capabilities.** Copilot Pro+ gives you generous usage of Claude Opus, GPT-5.2, and other top-tier models: all with agentic coding features similar to Claude Code.

1. Subscribe to [GitHub Copilot Pro+](https://github.com/features/copilot)
2. Install the GitHub CLI: `brew install gh`
3. Authenticate: `gh auth login`
4. OpenCode auto-detects your Copilot subscription

### Claude Code (Subscription-Based)

If you already have a Claude subscription, Claude Code is a smooth option (no API keys required):

1. Install [Claude Code](https://claude.ai/code) 
2. Sign in with your Anthropic account
3. OpenCode auto-detects and uses your subscription

### OpenRouter (API Key: Multi-Model Access)

For flexible pay-per-use access to many models through a single API:

```bash
export OPENROUTER_API_KEY="your-api-key"
```

OpenRouter is ideal when you want model flexibility or pay-per-use pricing.

---

## 3. 🧩 MCP SERVER SETUP

MCP (Model Context Protocol) servers give your assistant extra capabilities (search, memory, browser automation, and more). This environment includes several pre-configured servers.

**📚 Detailed installation guides:** [`install guides/`](install%20guides/)

### Available Servers

| Server                  | What It Does                                        | Guide                                                                                                   |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Code Mode**           | TypeScript tool orchestration, multi-tool workflows | [MCP - Code Mode.md](install%20guides/MCP%20-%20Code%20Mode.md)                                         |
| **LEANN**               | Semantic code search (97% storage savings)          | [MCP - LEANN.md](install%20guides/MCP%20-%20LEANN.md)                                                   |
| **Code Context**        | Structural code analysis via Tree-sitter AST        | [MCP - Code Context.md](install%20guides/MCP%20-%20Code%20Context.md)                                   |
| **Semantic Memory**     | Local vector-based conversation memory              | [MCP - Semantic Memory.md](install%20guides/MCP%20-%20Semantic%20Memory.md)                             |
| **Sequential Thinking** | Structured multi-step reasoning                     | [MCP - Sequential Thinking.md](install%20guides/MCP%20-%20Sequantial%20Thinking%20(Python%20Server).md) |
| **Chrome DevTools**     | Browser automation and debugging                    | [MCP - Chrome Dev Tools.md](install%20guides/MCP%20-%20Chrome%20Dev%20Tools.md)                         |

### Code Search Tools (Complementary - Not Competing)

Use these three tools together for comprehensive code discovery:

| Tool             | Type       | Query Example               | Returns                |
| ---------------- | ---------- | --------------------------- | ---------------------- |
| **LEANN**        | Semantic   | "How does auth work?"       | Code by meaning/intent |
| **Code Context** | Structural | "List functions in auth.ts" | Symbols/definitions    |
| **Grep**         | Lexical    | "Find 'TODO' comments"      | Text pattern matches   |

**Decision Logic:**
- Need to UNDERSTAND code? → LEANN (semantic)
- Need to MAP code structure? → Code Context (structural)
- Need to FIND text patterns? → Grep (lexical)

### Quick Setup

1. **Install dependencies**: follow each server's guide
2. **Copy the config template:**
   ```bash
   cp opencode.json /path/to/your-project/
   ```

### OpenCode Skills Plugin

Enable the skills system by adding to your `opencode.json`.

**Full setup guide:** [PLUGIN - Opencode Skills.md](install%20guides/PLUGIN%20-%20Opencode%20Skills.md)

---

## 4. 🤖 AGENTS.MD FRAMEWORK

The [`AGENTS.md`](AGENTS.md) file defines the guardrails: the rules that keep an AI assistant consistent, careful, and predictable across long-running work.

### Why You Need This

Without guardrails, AI assistants:
- Make assumptions instead of asking clarifying questions
- Skip documentation and lose context between sessions
- Claim completion without proper verification
- Create technical debt through inconsistent approaches

**AGENTS.md prevents all of this.**

### How It All Works Together

Here's the complete workflow from your first message to documented completion:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         YOUR AI-ASSISTED WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────────┐
     │  You: Query or   │
     │  /command        │
     └────────┬─────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  🚦 GATE SYSTEM ACTIVATES           │
│                                     │
│  • Confidence check (≥80%?)         │
│  • Asks: Spec folder? Git branch?   │
│  • Loads relevant memories          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  🧩 SKILL MATCHING                  │
│                                     │
│  Agent scans <available_skills>     │
│  Loads: workflows-code, spec-kit,   │
│         memory, git, etc.           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  ⚡ EXECUTION                        │
│                                     │
│  • Creates spec folder (###-name)   │
│  • Copies templates (spec/plan/     │
│    tasks based on level)            │
│  • Implements with quality checks   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  🧠 CONTEXT PRESERVATION            │
│                                     │
│  • Trigger phrases prompt saves     │
│  • Manual: /memory:save             │
│  • Semantic indexing for recall     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  ✅ COMPLETION                      │
│                                     │
│  • Checklist verification (L2+)     │
│  • Browser testing confirmed        │
│  • Documentation complete           │
└─────────────────────────────────────┘

     RESULT: Every conversation is:
     ├── 📁 Documented in specs/###-feature/
     ├── 🧠 Searchable in memory system
     └── 🔄 Recoverable in future sessions
```

### Core Framework Components

#### Mandatory Gates System

A 7-gate workflow (Gates 0-6) ensures nothing slips through the cracks:

| Gate       | Name                    | Purpose                                                          |
| ---------- | ----------------------- | ---------------------------------------------------------------- |
| **Gate 0** | Compaction Check        | Detects context loss, pauses for user confirmation               |
| **Gate 1** | Understanding Check     | Requires 80%+ confidence, surfaces memories via trigger matching |
| **Gate 2** | Skill Routing           | Routes to appropriate skill via skill_advisor.py                 |
| **Gate 3** | Spec Folder Question    | Asks spec folder choice (A/B/C/D) before file modifications      |
| **Gate 4** | Memory Loading          | Offers to load relevant memories when using existing spec        |
| **Gate 5** | Memory Save Validation  | **MANDATORY** generate-context.js for all memory saves           |
| **Gate 6** | Completion Verification | Enforces checklist completion before claiming "done"             |

#### Spec Folder Discipline

Every file modification gets documented: no exceptions:
- Automatic spec folder creation with numbered naming
- Three documentation levels (baseline → verified → full)
- Template-driven consistency across all projects

#### Confidence & Clarification Framework

Built-in uncertainty handling:
- Explicit confidence scoring (0-100%)
- Mandatory clarification when confidence < 80%
- Multiple-choice questions for ambiguous requests
- Never fabricates: outputs "UNKNOWN" when unverifiable

#### Tool Selection & Routing

Smart tool dispatch based on task type:
- Semantic search for code discovery
- Sequential thinking for complex reasoning
- Parallel agent dispatch for multi-domain tasks
- Chrome DevTools integration for browser verification

#### Quality Principles

Enforced standards:
- Simplicity first (KISS)
- Evidence-based decisions with citations
- Scope discipline: solves only what's asked
- Browser verification before completion claims

### Codebase-Agnostic Version

[`AGENTS (Universal).md`](AGENTS%20(Universal).md): a version without project-specific references, ready to drop into any codebase.

---

## 5. 🗂️ SPECKIT: DOCUMENTATION FRAMEWORK

**Make work recoverable and repeatable.**

A custom fork of the SpecKit spec-driven development framework: dramatically more manageable than the original through smart folder organization, sub-folder versioning, and active recall of previous work within the same feature.

**Full documentation:** [`speckit/README.md`](speckit/README.md)

If you want the step-by-step workflow (quick start, levels, templates, and commands), start with the SpecKit README above.

### Why This Fork Is Different

**A practical fork with automation and memory built-in.**

The original SpecKit introduced spec-driven development but still required you to run most of the workflow manually. This fork pushes more of that into repeatable commands and keeps the results easy to find later.

---

### Templates

9 enhanced templates with context-aware prompts and built-in evidence stubs.

| Original SpecKit     | This Fork                     |
| -------------------- | ----------------------------- |
| Basic templates      | 9 enhanced templates          |
| Generic placeholders | Context-aware prompts         |
| No QA integration    | Built-in evidence stubs       |
| —                    | + `debug-delegation.md` (new) |
| —                    | + `research-spike.md` (new)   |

- **Context-aware prompts**: Templates ask the right questions for each doc type
- **Evidence stubs**: Checklists include placeholders for screenshots, test results
- **New templates**: `debug-delegation.md` for handoffs, `research-spike.md` for exploration

#### What's Included

| Category        | Contents                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **9 Templates** | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `research.md`, `research-spike.md`, `handover.md`, `debug-delegation.md` |
| **6 Scripts**   | `create-spec-folder.sh`, `check-prerequisites.sh`, `calculate-completeness.sh`, `recommend-level.sh`, `archive-spec.sh`, `common.sh`             |
| **Checklists**  | QA validation checklists with evidence stubs                                                                                                     |

#### Documentation Levels

| Level       | What's Required           | Best For                   |
| ----------- | ------------------------- | -------------------------- |
| **Level 1** | spec + plan + tasks       | Bug fixes, small changes   |
| **Level 2** | Level 1 + checklist       | Features requiring QA      |
| **Level 3** | Level 2 + decision-record | Architecture, complex work |

---

### Folder Structure

Hierarchical organization with auto-numbered specs and sub-folder versioning.

| Original SpecKit      | This Fork                               |
| --------------------- | --------------------------------------- |
| Flat `specs/` folder  | Hierarchical + versioned                |
| Manual naming         | Auto-numbered (`###-name`)              |
| No iteration tracking | Sub-folder versioning (`001`, `002`...) |

```
specs/
├── 122-user-authentication/
│   ├── 001-initial-design/     ← Original work (auto-archived)
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── memory/
│   ├── 002-oauth-addition/     ← Follow-up work
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── memory/             ← Has access to 001's context
│   └── 003-bug-fixes/          ← Latest iteration
│       ├── spec.md
│       └── memory/             ← Recalls all previous decisions
```

- **Active recall**: When working in `003-bug-fixes`, the AI can search memories from `001` and `002`
- **Auto-archiving**: Previous work moves to numbered sub-folders, keeping root clean
- **Feature continuity**: All related work stays together, building institutional knowledge

---

### Automation

Commands replace manual workflows: one prompt triggers folder creation, template copying, implementation, and memory saves automatically.

| Original SpecKit        | This Fork                       |
| ----------------------- | ------------------------------- |
| Manual execution        | Commands automate 12+ steps     |
| Copy templates yourself | AI copies & fills automatically |
| Remember the workflow   | AGENTS.md enforces it           |
| No enforcement          | Gate system prevents skipping   |

**One command. Twelve steps. Less babysitting.**

```
/spec_kit:complete authentication
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTOMATED 12-STEP WORKFLOW                                 │
│                                                             │
│  ✓ Step 1:  Create specs/###-authentication/ folder         │
│  ✓ Step 2:  Auto-number based on existing specs             │
│  ✓ Step 3:  Copy spec.md template                           │
│  ✓ Step 4:  Copy plan.md template                           │
│  ✓ Step 5:  Copy tasks.md template                          │
│  ✓ Step 6:  Fill spec from conversation context             │
│  ✓ Step 7:  Generate implementation plan                    │
│  ✓ Step 8:  Break into actionable tasks                     │
│  ✓ Step 9:  Execute tasks with quality checks               │
│  ✓ Step 10: Run verification (browser if UI)                │
│  ✓ Step 11: Complete checklist with evidence                │
│  ✓ Step 12: Save to memory system                           │
│                                                             │
│  YOU: One prompt │ AI: Twelve coordinated steps             │
└─────────────────────────────────────────────────────────────┘
```

#### Commands

| Command                        | What It Does                                    | Steps |
| ------------------------------ | ----------------------------------------------- | ----- |
| `/spec_kit:complete [feature]` | Full workflow: spec → plan → implement → verify | 12    |
| `/spec_kit:plan [feature]`     | Planning-focused: spec → plan → tasks           | 6     |
| `/spec_kit:implement`          | Execute existing plan                           | 4     |
| `/spec_kit:research [topic]`   | Research-first approach                         | 5     |
| `/spec_kit:resume`             | Resume previous session from spec folder        | -     |

#### Why Automation Matters

- **Enforce without hooks**: Opencode doesn't support hooks (yet), so automation is baked into the command itself
- **Eliminate repetitive prompting**: One command replaces 12 separate "now do this" prompts
- **Consistent output**: Same structure every time, regardless of who runs it or when
- **Save your quota**: On Copilot Pro+, fewer prompts = less usage

---

### Memory Integration

Every spec automatically saves to the semantic memory system for future recall.

| Original SpecKit        | This Fork                  |
| ----------------------- | -------------------------- |
| Sessions are ephemeral  | Every spec saves to memory |
| Start fresh each time   | Recalls previous decisions |
| Context lost on close   | Searchable months later    |
| No cross-spec awareness | AI searches related specs  |

- **Persistent context**: Pick up any project exactly where you left off
- **Cross-spec search**: AI finds relevant decisions from related specs
- **Automatic saves**: Memory system integrated into completion workflow

---

## 6. 🧠 MEMORY SYSTEM

**Your AI assistant finally remembers.**

The semantic memory system preserves conversation insights across sessions using local vector embeddings. Ask about something you discussed weeks ago and get the relevant context back.

**Full documentation:** [`memory/README.md`](memory/README.md)

For installation details, command reference, and troubleshooting, the Memory README is the canonical guide.

### Why This Matters

Without memory, every AI session feels like it starts from zero. With semantic memory:

- **Instant context recovery**: "What did we decide about the auth flow?" actually works
- **Cross-project learning**: Solutions from one project inform another
- **Trigger-based preservation**: Say "save context" or use `/memory:save` at key moments
- **Smart retrieval**: Find by meaning, not just keywords

### Key Capabilities

| Feature                | What It Does                                                            |
| ---------------------- | ----------------------------------------------------------------------- |
| **Semantic Search**    | Find memories by meaning, not just keywords                             |
| **Hybrid Search**      | SQLite FTS5 + vector search combined                                    |
| **Memory Decay**       | 90-day half-life prioritizes recent context                             |
| **6 Importance Tiers** | constitutional → critical → important → normal → temporary → deprecated |
| **Checkpoint System**  | Save/restore memory states                                              |
| **100% Local**         | All processing on your machine: no external APIs                        |

### Memory Save Process (MANDATORY)

All memory saves MUST use the `generate-context.js` script - manual file creation is prohibited:

```bash
# Correct: Use the script with spec folder argument
node .opencode/skills/system-memory/scripts/generate-context.js specs/007-feature-name/

# Wrong: Never manually create memory files with Write/Edit tools
```

**Gate 5 Enforcement:**
1. If no folder argument → HARD BLOCK until user selects spec folder
2. If folder provided → Validate alignment with conversation topic
3. If mismatch detected → WARN user + suggest alternatives
4. Script generates proper ANCHOR format and auto-indexes

### Commands

| Command                       | What It Does                                         |
| ----------------------------- | ---------------------------------------------------- |
| `/memory:save [spec-folder]`  | Save conversation with semantic indexing             |
| `/memory:search`              | Dashboard: stats, recent memories, suggested actions |
| `/memory:search "query"`      | Find memories across all projects                    |
| `/memory:search cleanup`      | Interactive cleanup of old/unused memories           |
| `/memory:search triggers`     | View and manage trigger phrases                      |
| `/memory:checkpoint [action]` | Create, list, restore, or delete memory checkpoints  |

### Related Skill

**`system-memory`**: handles semantic context preservation, automatic triggers, and search patterns. Located in your project's `.opencode/skills/system-memory/` directory.

### MCP Server

The Semantic Memory MCP server enables AI assistants to search and load memories directly. See [`skills/workflows-memory/mcp_server/`](skills/workflows-memory/mcp_server/) for the server code and [`install guides/MCP - Semantic Memory.md`](install%20guides/MCP%20-%20Semantic%20Memory.md) for installation.

---

## 7. 🎛️ SKILLS LIBRARY

**Domain expertise, on demand.**

Skills are reusable, on-demand capabilities that extend any AI assistant with specialized knowledge. Unlike passive documentation that sits in context, skills are actively loaded when needed: keeping your context window lean while providing deep expertise exactly when it matters.

**Location:** [`skills/`](skills/)

### The Router Pattern

Most skills here aren't simple single-purpose tools: they're **intelligent routers** that direct the AI to the right knowledge OR capability within a domain. This architecture has key advantages:

- **Fewer skills needed**: One `workflows-code` skill handles implementation, debugging, AND verification
- **No separate knowledge base**: Reference docs live inside the skill as bundled resources
- **Context-aware routing**: The skill decides what sub-capability to invoke based on your task
- **Progressive loading**: Load the router, then only the specific reference you need

```
┌─────────────────────────────────────────────────────────────────┐
│  workflows-code (Router Skill)                                  │
│                                                                 │
│  SKILL.md ──► Routes to:                                        │
│               ├── references/implementation.md                  │
│               ├── references/debugging.md                       │
│               ├── references/verification.md                    │
│               └── scripts/quality-check.sh                      │
│                                                                 │
│  One skill = multiple capabilities + embedded knowledge         │
└─────────────────────────────────────────────────────────────────┘
```

### Why Skills Beat Static Documentation

| Static Docs                       | Skills                    |
| --------------------------------- | ------------------------- |
| Always in context (wastes tokens) | Loaded on-demand          |
| Generic guidance                  | Task-specific workflows   |
| You remember to reference them    | Auto-matched to your task |
| No enforcement                    | Built-in quality gates    |
| Separate knowledge base needed    | Knowledge bundled inside  |

### Available Skills

| Skill                         | What It Does                                         |
| ----------------------------- | ---------------------------------------------------- |
| **mcp-code-mode**             | TypeScript tool orchestration, multi-tool workflows  |
| **mcp-code-context**          | Structural code analysis via Tree-sitter AST         |
| **mcp-leann**                 | Semantic code search with 97% storage savings        |
| **system-memory**             | Semantic context preservation with 6-tier importance |
| **system-spec-kit**           | Spec folder + template enforcement                   |
| **workflows-code**            | 3-phase implementation lifecycle                     |
| **workflows-git**             | Branch management, clean commits                     |
| **workflows-chrome-devtools** | Browser automation via DevTools                      |
| **workflows-documentation**   | Document creation + skill scaffolding                |

### How Skills Work

```
Task Received → Agent scans available skills
                    ↓
         Match Found → Load skill via CLI
                    ↓
    Instructions Load → SKILL.md + bundled resources
                    ↓
      Agent Executes → Complete task using skill guidance
```

### Intelligent Routing: skill_advisor.py vs. Plugin

The skills system relies on two components working in tandem:

1.  **The Plugin (Muscle):** The `opencode-skills` plugin enables the `openskills` command, which physically loads the skill content and assets into the context window.
2.  **The Advisor (Brain):** The `skill_advisor.py` script acts as Gate 2. It analyzes your natural language request, calculates a confidence score, and determines *which* skill (if any) is required.

**The Integration Flow:**

```bash
User Request ──► skill_advisor.py (Analysis)
                      │
                      ▼
              Confidence > 0.8?
              ├── NO: Proceed with manual tool selection
              └── YES: Advisor outputs "Suggested Skill: workflows-code"
                      │
                      ▼
              Agent executes: openskills read workflows-code
                      │
                      ▼
              Plugin loads SKILL.md + Resources
```

This separation ensures skills are only loaded when actually needed, keeping your context clean while ensuring expert capabilities are available instantly for complex tasks.

---

## 8. ⚡ COMMANDS

**Automate workflows with a single prompt.**

Commands in [`command/`](command/) are structured entry points that chain steps, load the right skills, and enforce quality gates without you having to re-prompt every step.

### Why Commands Beat Free-Form Prompts

| Free-Form Prompts       | Commands                 |
| ----------------------- | ------------------------ |
| You remember each step  | Workflow baked in        |
| 12 prompts for 12 steps | 1 prompt, 12 steps       |
| No enforcement          | Gates prevent skipping   |
| Manual skill loading    | Auto-loads what's needed |
| High quota usage        | Minimal quota cost       |

- **Enforce without hooks**: Commands embed enforcement directly into the workflow
- **Chain long workflows**: One command triggers 12+ sequential steps without re-prompting
- **Save your quota**: On Copilot Pro+, one 12-step command costs a fraction of 12 separate requests
- **Auto-load skills**: Commands pull in the domain expertise they need automatically

### Available Commands

| Folder      | Commands                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `spec_kit/` | `/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume`             |
| `memory/`   | `/memory:save`, `/memory:search`, `/memory:checkpoint`                                                              |
| `create/`   | `/create:skill`, `/create:skill_asset`, `/create:skill_reference`, `/create:folder_readme`, `/create:install_guide` |
| `codebase/` | Semantic code search and index management                                                                           |
| `cli/`      | `/cli:codex`, `/cli:codex_quick`, `/cli:gemini`, `/cli:gemini_quick`                                                |
| `prompt/`   | Prompt refinement helpers                                                                                           |


---

## 9. 🏎️ QUICK REFERENCE

**Getting started:** Install OpenCode, copy the config templates, and wire up the providers/servers you want.

| Resource                       | Location                                 |
| ------------------------------ | ---------------------------------------- |
| OpenCode config                | [`opencode.json`](opencode.json)         |
| MCP config (Claude Code, etc.) | [`mcp.json`](mcp.json)                   |
| Agent guardrails               | [`AGENTS.md`](AGENTS.md)                 |
| SpecKit framework              | [`speckit/`](speckit/)                   |
| SpecKit docs (detailed)        | [`speckit/README.md`](speckit/README.md) |
| Memory system                  | [`memory/`](memory/)                     |
| Memory docs (detailed)         | [`memory/README.md`](memory/README.md)   |
| Skills library                 | [`skills/`](skills/)                     |
| Commands                       | [`command/`](command/)                   |
| MCP install guides             | [`install guides/`](install%20guides/)   |