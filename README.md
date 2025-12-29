<div align="left">

# OpenCode Dev Environment

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/Opencode_Dev_Environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/Opencode_Dev_Environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/Opencode_Dev_Environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/Opencode_Dev_Environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/Opencode_Dev_Environment/releases)

</div>

A development environment for [OpenCode](https://github.com/sst/opencode) featuring two custom-built systems you won't find anywhere else:

**📋 Spec Kit**: Originally inspired by GitHub's spec-kit, this unified system adds automation, slash commands, integrated semantic memory, and sub-folder versioning. Documentation writes itself and is enforced by design.

**🎯 Skills** (custom framework): 8 domain-specific skills that auto-load based on your task. Designed for efficiency: fewer, smarter skills replace the typical sprawl of dozens of fragmented prompts.

#### Table of Contents

1. [📖 Overview](#1--overview)
2. [📋 Spec Kit Framework](#2--spec-kit-framework)
3. [🧠 Semantic Memory System](#3--semantic-memory-system)
4. [🤖 AGENTS.md Framework](#4--agentsmd-framework)
5. [🧩 Skills Library](#5--skills-library)
6. [⚡ Commands](#6--commands)
7. [🚀 Installation & Setup](#7--installation--setup)
8. [🎯 What's Next?](#8--whats-next)

---

> - 99.999% of people will keep blaming AI for not being good enough for advanced coding.
> - Beat the odds with this system?
> - Don't reward me with unwanted coffee:
> - https://buymeacoffee.com/michelkerkmeester

---

## 1. 📖 Overview

> **Context that persists. Documentation that writes itself.**


### Why This System?

AI coding assistants are powerful but stateless. Every session starts from zero. This environment adds the missing layers: persistent memory, enforced documentation, and automated workflows that make AI-assisted development sustainable for real projects.

**Without This**

- **Context**: Re-explain everything every session
- **Documentation**: "I'll document later" (never happens)
- **Decisions**: Lost in chat history
- **Handoffs**: 2-hour "what did you do" meetings
- **Debugging**: Copy-paste error, AI guesses
- **Code search**: grep + hope
- **Quality gates**: Trust the AI did it right
- **Tool orchestration**: Manual juggling

**With This Environment**

- **Context**: Memory persists across sessions, models, projects
- **Documentation**: Gate 3 enforces spec folders on every change
- **Decisions**: ADRs in decision-record.md, searchable forever
- **Handoffs**: `/spec_kit:handover` produces a 15-line summary
- **Debugging**: `/spec_kit:debug` spawns sub-agent with full context
- **Code search**: Semantic search by *meaning*, not text
- **Quality gates**: Mandatory gates verify completion
- **Tool orchestration**: 8 skills load automatically based on task

—

### Semantic Memory: Built from Scratch

A custom MCP server that gives your AI assistant persistent, searchable memory across sessions. Not a wrapper around existing tools: this is purpose-built for AI-assisted development.

**Core features:** hybrid search (vector + FTS5), importance tiers, and proactive context surfacing.

**What Others Have**

- No memory between sessions
- Manual context management
- Cloud-dependent solutions
- Load entire files
- Hope you remember
- No recovery options

**What This System Has**

- Hybrid search (vector + FTS5 + RRF fusion)
- 6 importance tiers with auto-decay
- 100% local (nomic-embed on YOUR machine)
- ANCHOR format = 93% token savings
- <50ms proactive surfacing before you ask
- Checkpoints = undo button for your index

—

### Spec Kit: What Sets This Apart

Originally inspired by [GitHub Spec Kit](https://github.com/github/spec-kit), this system takes the concept far beyond basic templates. Documentation isn't just a suggestion: it's a requirement, enforced by design.

Key enhancements: gate enforcement, slash commands for every workflow, deep memory integration, sub-folder versioning, delegated debugging, and stateless architecture.

**Original Spec Kit**

- ~3 basic templates
- Optional documentation
- No commands
- No memory integration
- Overwrite old work
- No automation
- Debug alone
- Manual state tracking
- "Is this done?"

**This System**

- 10 purpose-built templates
- 7 slash commands with `:auto`/`:confirm` modes
- Memory lives IN spec folders (deep integration)
- 001/002/003 sub-folder versioning
- 11 scripts handle the boring work
- AI detects frustration, auto-suggests sub-agent
- Stateless architecture (no STATE.md)
- Completeness scoring (0-100%)

—

### The Integration Nobody Else Has

These systems aren't just bundled: they're *woven together*:

- Memory files live inside spec folders (`specs/###-feature/memory/`)
- Gate 5 enforces `generate-context.js` for every save
- `/spec_kit:resume` auto-loads relevant memories
- Sub-folder versioning preserves independent memory per version

—


### How It All Works Together

When you make a request, the system:

1. **Checks gates**: Confidence level, spec folder status, relevant memories
2. **Routes skills**: Auto-loads domain expertise based on keywords
3. **Executes**: Creates docs, implements code, runs quality checks
4. **Preserves**: Saves context for future sessions



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
│  GATE SYSTEM ACTIVATES              │
│                                     │
│  • Confidence check (≥80%?)          │
│  • Asks: Spec folder? Git branch?   │
│  • Loads relevant memories          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  SKILL MATCHING                     │
│                                     │
│  Agent scans <available_skills>     │
│  Loads: workflows-code, spec-kit,    │
│         memory, git, etc.           │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  EXECUTION                          │
│                                     │
│  • Creates spec folder (###-name)   │
│  • Copies templates (spec/plan/     │
│    tasks based on level)            │
│  • Implements with quality checks   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  CONTEXT PRESERVATION               │
│                                     │
│  • Trigger phrases prompt saves     │
│  • Manual: /memory:save             │
│  • Semantic indexing for recall     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  COMPLETION                         │
│                                     │
│  • Checklist verification (L2+)      │
│  • Browser testing confirmed         │
│  • Documentation complete           │
└─────────────────────────────────────┘

     RESULT: Every conversation is:
     ├── Documented in specs/###-feature/
     ├── Searchable in memory system
     └── Recoverable in future sessions
```


---


## 2. 📋 Spec Kit Framework

Every feature you build should leave a trail. Not for bureaucracy: for your future self, your team, and the AI that helps you code. Spec Kit enforces one simple rule: *no code without a spec folder*. 

The result? Six months from now, you'll know exactly why you made that architectural decision. Your AI assistant will pick up where you left off. And onboarding new developers takes hours instead of weeks.


### Quick Start

Create a documented feature in one command:

```bash
/spec_kit:complete "add user authentication"
```

This creates:

```
specs/042-add-user-authentication/
├── spec.md          # What we're building
├── plan.md          # How we'll build it
├── tasks.md         # Step-by-step breakdown
├── checklist.md     # QA verification (Level 2+)
├── scratch/         # Temporary files (git-ignored)
└── memory/          # Session context (persisted)
```


### What Makes This Different

**Basic Documentation**

- **Enforcement**: Hope you remember
- **Templates**: Start from scratch
- **Commands**: Manual workflow
- **Memory Integration**: None
- **Session Handover**: Screenshot + pray
- **Debug Assistance**: None
- **Quality Metrics**: Guesswork
- **Folder Versioning**: Overwrite old work

**This Spec Kit**

- **Enforcement**: Gate 3 blocks file changes without spec folder
- **Templates**: 10 purpose-built templates ready to copy
- **Commands**: 7 slash commands with `:auto`/`:confirm` modes
- **Memory Integration**: Deep integration, memories live IN spec folders
- **Session Handover**: `:quick` (15 lines) or `:full` (150 lines)
- **Debug Assistance**: AI detects frustration, auto-suggests sub-agent
- **Quality Metrics**: Completeness scoring (0-100%)
- **Folder Versioning**: 001/002/003 sub-folder pattern preserves history


### Three Documentation Levels

- **Level 1** (spec.md, plan.md, tasks.md)
  Bug fixes, small features under 100 LOC

- **Level 2** (Level 1 + checklist.md)
  Features needing QA, 100-499 LOC

- **Level 3** (Level 2 + decision-record.md)
  Architecture changes, 500+ LOC

**Rule of thumb:** When in doubt, go one level higher.


### Spec Kit Commands

- `/spec_kit:complete`: Full workflow (spec, plan, implement)
- `/spec_kit:plan`: Planning only, no implementation
- `/spec_kit:implement`: Execute existing plan
- `/spec_kit:research`: Technical investigation
- `/spec_kit:resume`: Continue previous session
- `/spec_kit:handover`: Create session handover document
- `/spec_kit:debug`: Delegate debugging to sub-agent

**Mode Suffixes:** Add `:auto` or `:confirm` (e.g., `/spec_kit:complete:auto`)

**Handover Variants:** `:quick` (default) or `:full` (e.g., `/spec_kit:handover:full`)


### Templates (10 Total)

- **spec.md**: Feature specification with acceptance criteria
- **plan.md**: Technical implementation plan
- **tasks.md**: Task breakdown by user story
- **checklist.md**: QA validation with P0/P1/P2 priorities
- **decision-record.md**: Architecture Decision Records (ADRs)
- **research.md**: Comprehensive technical research
- **handover.md**: Session continuity for multi-session work
- **debug-delegation.md**: Sub-agent debugging tasks
- **implementation-summary.md**: Post-implementation summary of what was built
- **context_template.md**: Memory file generation template (internal)


### Memory Integration

Memory is deeply integrated with Spec Kit. Files live IN spec folders (`specs/###-feature/memory/`), and Gate 5 enforces proper memory saves via `generate-context.js`.

See [Section 3: Semantic Memory System](#3--semantic-memory-system) for full documentation.

For detailed Spec Kit documentation, see the [README](.opencode/skill/system-spec-kit/README.md).


---


## 3. 🧠 Semantic Memory System

> **Remember everything. Surface what matters. Keep it private.**

Your AI assistant forgets everything between sessions. You explain your auth system Monday: by Wednesday, it's a blank slate. The semantic memory system fixes that with vector search that understands *meaning*, importance tiers that prioritize *what matters*, and local-first architecture that keeps *your code yours*.

No cloud. No external APIs. Just intelligent context preservation that makes AI-assisted development actually work.


### What Sets This Apart

**Basic Chat Logs**

- **Search**: Ctrl+F (text only)
- **Prioritization**: None
- **Relevance**: All memories equal
- **Privacy**: Often cloud-stored
- **Token Efficiency**: Load everything
- **Spec Kit Integration**: None
- **Proactive Surfacing**: None
- **Recovery**: Hope you backed up

**This Memory System**

- **Search**: Hybrid semantic + keyword (RRF fusion)
- **Prioritization**: 6-tier importance (constitutional to deprecated)
- **Relevance**: 90-day decay keeps recent memories on top
- **Privacy**: 100% local (nomic-embed runs on YOUR machine)
- **Token Efficiency**: ANCHOR format (93% savings)
- **Spec Kit Integration**: Deep (Gate 5 enforced, lives in spec folders)
- **Proactive Surfacing**: <50ms trigger matching
- **Recovery**: Checkpoints (undo button for your index)


### Deep Integration with Spec Kit

Memory and Spec Kit are designed to work together:

- **Memory Location**: Files live IN spec folders (`specs/###-feature/memory/`)
- **Gate 5 Enforcement**: Memory saves MUST use `generate-context.js` (no orphaned context)
- **Sub-folder Versioning**: Each 001/002/003 sub-folder has independent memory context
- **Session Continuity**: `/spec_kit:resume` auto-loads relevant memories
- **Stateless Design**: Project state embedded in memory files (no separate STATE.md)


### The Six Importance Tiers

| Tier | Boost | Decay | Use Case |
|------|-------|-------|----------|
| **constitutional** | 3.0x | Never | Project rules, always-on context (~500 tokens max) |
| **critical** | 2.0x | Never | Architecture decisions, breaking changes |
| **important** | 1.5x | Never | Key implementations, major features |
| **normal** | 1.0x | 90-day | Standard development context (default) |
| **temporary** | 0.5x | 7-day | Debug sessions, experiments |
| **deprecated** | 0.0x | Excluded | Outdated information (preserved but hidden) |


### Memory Commands

| Command | Purpose |
|---------|---------|
| `/memory:save [spec-folder]` | Save context via generate-context.js |
| `/memory:search` | Dashboard with stats, recent memories, and suggested actions |
| `/memory:search <query>` | Semantic search with tier/type filters |
| `/memory:search cleanup` | Interactive cleanup of old memories |
| `/memory:search triggers` | View and manage trigger phrases |
| `/memory:checkpoint create` | Snapshot current state |

**Example:**

```
> /memory:search "authentication flow"

Found 3 memories:
1. [critical] JWT token refresh implementation (2 days ago) - 94% match
2. [important] OAuth2 provider setup (5 days ago) - 87% match  
3. [normal] Login form validation (12 days ago) - 72% match

Load: [1] [2] [3] [all] [skip]
```


### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval:

```markdown
<!-- ANCHOR: decision-auth-flow -->
## Authentication Decision
We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension without re-login
<!-- ANCHOR_END: decision-auth-flow -->
```

**How it works:**
1. `generate-context.js` extracts ANCHOR sections
2. Each section is embedded separately
3. Search returns specific sections, not entire files
4. Agent loads only relevant anchors (93% token savings)


### The 13 MCP Tools

| Tool | Purpose |
|------|---------|
| `memory_search` | Semantic search with vector similarity |
| `memory_match_triggers` | Fast keyword matching (<50ms) |
| `memory_save` | Index memory files |
| `memory_list` | Browse stored memories |
| `memory_stats` | Database statistics |
| `memory_update` | Update existing memory |
| `memory_delete` | Remove memory by ID |
| `memory_validate` | Record validation feedback |
| `memory_index_scan` | Bulk index new files |
| `checkpoint_create` | Snapshot current state |
| `checkpoint_list` | List available checkpoints |
| `checkpoint_restore` | Restore from checkpoint |
| `checkpoint_delete` | Remove checkpoint |

> **Note:** Full MCP names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search`).


### Privacy & Local-First

> **Your Code Never Leaves Your Machine**

All processing happens locally:

- **Embeddings**: `nomic-embed-text-v1.5` runs on YOUR machine (768-dim vectors)
- **Storage**: SQLite with sqlite-vec extension in YOUR project
- **No external API calls** for memory operations
- Works fully offline after initial Ollama model download

See [`.opencode/skill/system-spec-kit/`](.opencode/skill/system-spec-kit/) for implementation details.


---


## 4. 🤖 AGENTS.md Framework

The [`AGENTS.md`](AGENTS.md) file is the brain of your AI assistant's behavior. It defines mandatory gates that every request passes through, preventing common failures like hallucination, scope creep, and forgotten context.

### Why You Need This

Without guardrails, AI assistants:

- Make assumptions instead of asking clarifying questions
- Skip documentation and lose context between sessions
- Claim completion without proper verification
- Create technical debt through inconsistent approaches

**AGENTS.md prevents all of this.**



#### Confidence & Clarification Framework

- Explicit confidence scoring (0-100%)
- Mandatory clarification when confidence < 80%
- Multiple-choice questions for ambiguous requests
- Never fabricates: outputs "UNKNOWN" when unverifiable

#### Quality Principles

- Simplicity first (KISS)
- Evidence-based decisions with citations
- Scope discipline: solves only what's asked
- Browser verification before completion claims

#### The Gate System

The gate system is a series of automated checks that every request passes through to ensure quality, context retention, and workflow integrity. Each gate enforces a specific rule—such as verifying understanding, routing to the right skill, requiring documentation, validating memory saves, and confirming completion—so that nothing falls through the cracks. This layered approach prevents common issues like context loss, incomplete documentation, and unverified work, making the development process more reliable and efficient.

---


## 5. 🧩 Skills Library

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the workflows-git skill and already knows your conventions.


### How Skills Work

```
Your Request → python3 .opencode/scripts/skill_advisor.py analyzes keywords
                        ↓
              Confidence > 80%? → Load skill automatically
                        ↓
              .opencode/skill/<name>/SKILL.md + bundled resources loaded
                        ↓
              AI follows skill guidance
```

**Native Discovery:** OpenCode v1.0.190+ automatically finds skills in `.opencode/skill/*/SKILL.md`. No plugin required.


### Available Skills (8 Total)

**system-spec-kit**
Unified documentation enforcement, templates, and context preservation across sessions
> Example: "Create spec for feature" or "Save this context"

**mcp-narsil**
Deep code intelligence: semantic search, security scanning, call graphs, structural queries (via Code Mode)
> Example: "How does auth work?" or "Scan for vulnerabilities" or "List functions in auth.ts"

**mcp-code-mode**
External tool orchestration (Figma, GitHub, ClickUp, etc.)
> Example: "Get Figma file" or "Create GitHub issue"

**workflows-code**
Implementation lifecycle (plan, code, verify), CDN deployment, JavaScript minification
> Example: "Implement this feature" or "Minify and deploy JavaScript"

**workflows-documentation**
Document quality, skill creation
> Example: "Create install guide"

**workflows-git**
Git workflows (commits, branches, PRs)
> Example: "Commit these changes"

**workflows-chrome-devtools**
Browser automation and debugging
> Example: "Take screenshot"


### Skills vs Commands

**Skills**
- Automatic invocation (keyword-triggered)
- Routed via skill_advisor.py with confidence scoring
- Flexible guidance: AI adapts to context

**Commands**
- Explicit invocation (`/command:name`)
- Direct user request
- Rigid workflow: strict steps enforced

**Confidence > 0.8 = mandatory skill invocation.** The AI must load and follow the skill.


### Creating Custom Skills

```bash
python3 .opencode/skill/workflows-documentation/scripts/init_skill.py my-skill
```

See [SET-UP - Skill Creation.md](.opencode/install_guides/SET-UP - Skill Creation.md) for the full guide.


---


## 6. ⚡ Commands

Commands are explicit, user-invoked workflows with structured steps. Unlike skills (which load automatically), commands are triggered with a /slash syntax for repeatable multi-step processes.


### Why Commands Beat Free-Form Prompts

**Free-Form Prompts**
- You remember each step
- 12 prompts for 12 steps
- No enforcement
- Manual skill loading
- High quota usage

**Commands**
- Workflow baked in
- 1 prompt, 12 steps
- Gates prevent skipping
- Auto-loads what's needed
- Minimal quota cost


### Available Commands (17 Total)

**spec_kit/** (7 commands)
`/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume`, `/spec_kit:debug`, `/spec_kit:handover`

**memory/** (3 commands)
`/memory:save`, `/memory:search`, `/memory:checkpoint`

**create/** (5 commands)
`/create:skill`, `/create:skill_asset`, `/create:skill_reference`, `/create:folder_readme`, `/create:install_guide`

**search/** (2 commands)
`/search:code`, `/search:index`


---


## 7. 🚀 Installation & Setup

> **Master install guide:** [`.opencode/install_guides/README.md`](.opencode/install_guides/README.md)


### Installing OpenCode

[OpenCode](https://github.com/sst/opencode) is a terminal-based AI coding assistant that powers this entire environment.

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

On first launch, OpenCode guides you through provider configuration.


### Configuration File

Copy this environment to your project:

```bash
# Clone and copy to your project
git clone https://github.com/MichelKerkmeester/Opencode_Dev_Environment.git
cp -r Opencode_Dev_Environment/.opencode /path/to/your-project/
cp Opencode_Dev_Environment/opencode.json /path/to/your-project/
cp Opencode_Dev_Environment/AGENTS.md /path/to/your-project/

# Or copy specific components
cp opencode.json /path/to/your-project/
cp -r .opencode/skill /path/to/your-project/.opencode/
cp -r .opencode/command /path/to/your-project/.opencode/
```

> **Full installation guide:** See [`.opencode/install_guides/README.md`](.opencode/install_guides/README.md) for comprehensive setup with validation checkpoints.


### Connecting Providers

OpenCode supports multiple LLM providers:

**GitHub Copilot Pro+ (Best Value)**

1. Subscribe to [GitHub Copilot Pro+](https://github.com/features/copilot)
2. Install GitHub CLI: `brew install gh`
3. Authenticate: `gh auth login`
4. OpenCode auto-detects your subscription

**Claude Code (Subscription-Based)**

1. Install [Claude Code](https://claude.ai/code)
2. Sign in with your Anthropic account
3. OpenCode auto-detects and uses your subscription

**OpenRouter (API Key)**

```bash
export OPENROUTER_API_KEY="your-api-key"
```

### MCP Server Setup

MCP servers extend your AI with specialized capabilities. This environment includes 4 pre-configured servers in `opencode.json`:

- **Sequential Thinking**: Structured multi-step reasoning for complex problems
  [Guide](.opencode/install_guides/MCP/MCP - Sequential Thinking.md)

- **Spec Kit Memory**: Local vector-based conversation memory (13 MCP tools)
  [Guide](.opencode/install_guides/MCP/MCP - Spec Kit Memory.md)

- **Code Mode**: External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools, Narsil, etc.)
  [Guide](.opencode/install_guides/MCP/MCP - Code Mode.md)

**Via Code Mode:**

- **Narsil**: Deep code intelligence (semantic search, security scanning, call graphs, structural queries)
  [Guide](.opencode/install_guides/MCP/MCP - Narsil.md)


### Two Systems (Don't Confuse Them)

| System              | MCP Name             | Database Location                                               | Purpose                               |
| ------------------- | -------------------- | --------------------------------------------------------------- | ------------------------------------- |
| **Narsil**          | `narsil` (Code Mode) | Managed by Narsil                                               | **Code** semantic + structural search |
| **Spec Kit Memory** | `spec_kit_memory`    | `.opencode/skill/system-spec-kit/database/context-index.sqlite` | **Conversation** context preservation |

**Common Confusion Points:**
- Narsil handles ALL code intelligence (semantic, structural, security)
- Spec Kit Memory is for conversation context preservation
- They are COMPLETELY SEPARATE systems with different purposes


### Code Search Tools

Use these two tools together:

- **Narsil** (Semantic + Structural + Security): "How does auth work?" or "List functions in auth.ts" or "Scan for vulnerabilities" (via Code Mode)
- **Grep** (Lexical): "Find 'TODO' comments" returns text pattern matches


### Native Skills Setup

Skills are **natively supported** in OpenCode v1.0.190+. Auto-discovered from `.opencode/skill/*/SKILL.md`.

- [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP - AGENTS.md): Configure AI agent guardrails
- [SET-UP - Skill Advisor.md](.opencode/install_guides/SET-UP - Skill Advisor.md): Configure intelligent skill routing
- [SET-UP - Skill Creation.md](.opencode/install_guides/SET-UP - Skill Creation.md): Create custom skills


### Auth Plugins

- **Antigravity Auth** (Google OAuth): [PLUGIN - Antigravity Auth.md](.opencode/install_guides/PLUGIN/PLUGIN - Antigravity Auth.md)
- **OpenAI Codex Auth**: [PLUGIN - OpenAI Codex Auth.md](.opencode/install_guides/PLUGIN/PLUGIN - OpenAI Codex Auth.md)


---


## 8. 🎯 What's Next?


### First Session Checklist

- [ ] Run `opencode` in your project
- [ ] Try `/spec_kit:complete add-login` to create your first documented feature
- [ ] Use `/memory:save` at the end of your session
- [ ] Start a new session and try `/memory:search "login"` to see persistence


### Going Deeper

- **Full installation**: [.opencode/install_guides/README.md](.opencode/install_guides/README.md)
- **MCP server setup**: [.opencode/install_guides/MCP/](.opencode/install_guides/MCP/)
- **Creating skills**: [SET-UP - Skill Creation.md](.opencode/install_guides/SET-UP - Skill Creation.md)
- **Agent configuration**: [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP - AGENTS.md)


### Get Help

- **GitHub Issues**: Report bugs and request features
