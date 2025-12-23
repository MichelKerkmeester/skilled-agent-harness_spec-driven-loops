# OpenCode Dev Environment

> **Stop re-explaining your codebase to AI every session.**

Your AI assistant forgets everything between conversations. This environment fixes that with:

- **🧠 Semantic Memory** — Pick up where you left off, even days later
- **📋 Structured Documentation** — Every change tracked, nothing lost
- **🎯 Reusable Skills** — Domain expertise that loads on demand
- **🔒 Local-First** — Your code stays on your machine

Works with Claude, GPT, Gemini, and any OpenCode-compatible model.

---

## 📑 Table of Contents

- [1. Installing OpenCode](#1--installing-opencode)
- [2. Connecting Providers](#2--connecting-providers)
- [3. MCP Server Setup](#3--mcp-server-setup)
- [4. AGENTS.MD Framework](#4--agentsmd-framework)
- [5. SpecKit: Documentation Framework](#5--speckit-documentation-framework)
- [6. Memory System](#6--memory-system)
- [7. Skills Library](#7--skills-library)
- [8. Commands](#8--commands)
- [9. Quick Reference](#9--quick-reference)
- [10. What's Next?](#10--whats-next)

---

## 1. 🚀 Installing OpenCode

OpenCode is the CLI that powers this entire environment. It connects your AI models, loads your skills, and manages your conversation sessions. Installation takes about 2 minutes via Homebrew or Go.

### What is OpenCode?

[OpenCode](https://github.com/sst/opencode) is a terminal-based AI coding assistant. It can connect to multiple model providers, talk to MCP servers, and load a skills/plugin system so your workflow is more than just “chat + paste”.

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

## 2. 🔌 Connecting Providers

Providers give OpenCode access to AI models like Claude, GPT, and Gemini. You can connect multiple providers and switch between them mid-conversation. Each provider has different strengths—Claude for reasoning, GPT for speed, Gemini for large contexts.

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

## 3. 🧩 MCP Server Setup

MCP (Model Context Protocol) servers extend your AI assistant with specialized capabilities—semantic search, browser automation, external tool integration, and more. Think of them as plugins that give your AI superpowers it doesn't have out of the box. This environment includes 6 pre-configured servers ready to use.

**📚 Detailed installation guides:** [`install_guides/README.md`](install_guides/README.md) (master guide with pre-flight checks, component matrix, and step-by-step setup)

### Available Servers

| Server                  | What It Does                                        | Guide                                                                                     |
| ----------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Code Mode**           | TypeScript tool orchestration, multi-tool workflows | [MCP - Code Mode.md](install_guides/MCP/MCP%20-%20Code%20Mode.md)                         |
| **LEANN**               | Semantic code search (97% storage savings)          | [MCP - LEANN.md](install_guides/MCP/MCP%20-%20LEANN.md)                                   |
| **Code Context**        | Structural code analysis via Tree-sitter AST        | [MCP - Code Context.md](install_guides/MCP/MCP%20-%20Code%20Context.md)                   |
| **Semantic Memory**     | Local vector-based conversation memory              | [MCP - Semantic Memory.md](install_guides/MCP/MCP%20-%20Semantic%20Memory.md)             |
| **Sequential Thinking** | Structured multi-step reasoning                     | [MCP - Sequential Thinking.md](install_guides/MCP/MCP%20-%20Sequential%20Thinking.md)     |
| **Chrome DevTools**     | Browser automation and debugging                    | [MCP - Chrome Dev Tools.md](install_guides/MCP/MCP%20-%20Chrome%20Dev%20Tools.md)         |

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

### Native Skills (OpenCode v1.0.190+)

Skills are **natively supported** in OpenCode v1.0.190+. No plugin required.

Skills are auto-discovered from `.opencode/skill/*/SKILL.md` and exposed as `skills_*` functions.

**Setup guides:**
| Guide | Purpose |
|-------|---------|
| [SET-UP - AGENTS.md](install_guides/SET-UP%20-%20AGENTS.md) | Configure AI agent guardrails |
| [SET-UP - Skill Advisor.md](install_guides/SET-UP%20-%20Skill%20Advisor.md) | Configure intelligent skill routing |
| [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) | Create custom skills |

**Auth Plugins:**
| Plugin | Guide |
|--------|-------|
| Antigravity Auth (Google OAuth) | [PLUGIN - Antigravity Auth.md](install_guides/PLUGIN/PLUGIN%20-%20Antigravity%20Auth.md) |
| OpenAI Codex Auth | [PLUGIN - OpenAI Codex Auth.md](install_guides/PLUGIN/PLUGIN%20-%20OpenAI%20Codex%20Auth.md) |

---

## 4. 🤖 AGENTS.MD Framework

The AGENTS.md file is the brain of your AI assistant's behavior. It defines 7 mandatory gates that every request passes through, preventing common failures like hallucination, scope creep, and forgotten context. Without these guardrails, AI assistants make assumptions, skip documentation, and lose track of multi-step tasks.

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
│  ⚡ EXECUTION                       │
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

A comprehensive gate workflow (Gates 0–7) ensures nothing slips through the cracks:

| Gate         | Name                    | Purpose                                                          |
| ------------ | ----------------------- | ---------------------------------------------------------------- |
| **Gate 0**   | Compaction Check        | Detects context loss, pauses for user confirmation               |
| **Gate 0.5** | Continuation Validation | Validates handoff state against memory files on resume           |
| **Gate 1**   | Understanding Check     | Requires 80%+ confidence, surfaces memories via trigger matching |
| **Gate 2**   | Skill Routing           | Routes to appropriate skill via skill_advisor.py                 |
| **Gate 3**   | Spec Folder Question    | Asks spec folder choice (A/B/C/D) before file modifications      |
| **Gate 4**   | Memory Loading          | Offers to load relevant memories when using existing spec        |
| **Gate 5**   | Memory Save Validation  | **MANDATORY** generate-context.js for all memory saves           |
| **Gate 6**   | Completion Verification | Enforces checklist completion before claiming "done"             |
| **Gate 7**   | Context Health Monitor  | Progressive warnings (Tier 1/2/3) for long sessions              |

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

## 5. 📋 SpecKit: Documentation Framework

Every file change gets documented—not because bureaucracy is fun, but because future-you (and future-AI) will thank you. SpecKit enforces a simple rule: no code without a spec folder. This means every feature, bug fix, and refactor has traceable context that persists across sessions and team members.

### Why This Matters

Without documentation:
- AI forgets what you built last week
- You forget why you made that decision
- Handoffs become archaeology projects

With SpecKit:
- Every change has a spec folder
- Context persists across sessions
- Decisions are traceable

### Three Documentation Levels

| Level | Files Required | When to Use |
|-------|----------------|-------------|
| **Level 1** | spec.md, plan.md, tasks.md | Bug fixes, small features (<100 LOC) |
| **Level 2** | Level 1 + checklist.md | Features needing QA (100-499 LOC) |
| **Level 3** | Level 2 + decision-record.md | Architecture changes (500+ LOC) |

**Rule of thumb:** When in doubt, go one level higher.

### Quick Start

```bash
# Create a new spec folder
/spec_kit:complete "add user authentication"

# This creates:
specs/042-add-user-authentication/
├── spec.md          # What we're building
├── plan.md          # How we'll build it
├── tasks.md         # Step-by-step breakdown
├── checklist.md     # QA verification (Level 2+)
├── scratch/         # Temporary files (git-ignored)
└── memory/          # Session context (persisted)
```

### SpecKit Commands

| Command | What It Does |
|---------|--------------|
| `/spec_kit:complete` | Full workflow: spec → plan → implement |
| `/spec_kit:plan` | Planning only, no implementation |
| `/spec_kit:implement` | Execute existing plan |
| `/spec_kit:research` | Technical investigation |
| `/spec_kit:resume` | Continue previous session |
| `/spec_kit:handover` | Create session handover document |
| `/spec_kit:debug` | Delegate debugging to sub-agent |

**Mode Suffixes:** Add `:auto` or `:confirm` to commands (e.g., `/spec_kit:complete:auto`)
**Handover Variants:** `:quick` (default) or `:full` (e.g., `/spec_kit:handover:full`)

### Templates (10 Total)

All templates live in `skill/system-spec-kit/templates/` (or `.opencode/skill/` in deployed projects):

| Template | Purpose |
|----------|---------|
| `spec.md` | Feature specification with acceptance criteria |
| `plan.md` | Technical implementation plan |
| `tasks.md` | Task breakdown by user story |
| `checklist.md` | QA validation with P0/P1/P2 priorities |
| `decision-record.md` | Architecture Decision Records (ADRs) |
| `research.md` | Comprehensive technical research |
| `research-spike.md` | Time-boxed proof of concept |
| `handover.md` | Session continuity for multi-session work |
| `debug-delegation.md` | Sub-agent debugging tasks |
| `quick-continue.md` | Minimal handoff for session branching |

> **Note:** Project state is now embedded in memory files (V13.0 stateless architecture). No separate state.md template.

For detailed template documentation, see the [system-spec-kit skill](skill/system-spec-kit/SKILL.md).

---

## 6. 🧠 Memory System

**The Problem:** Every AI conversation starts fresh. You explain your auth system on Monday, and by Wednesday the AI has no idea what you're talking about.

**The Solution:** Semantic memory that persists across sessions, models, and projects.

> **CRITICAL (V13.0):** Memory saves MUST use `generate-context.js`—never manually create memory files. This is enforced by Gate 5.

### How It Works

```
Conversation → generate-context.js → ANCHOR Format → Vector Embeddings → SQLite
                                           ↓
Future Session → Query → Hybrid Search → Anchor-Based Section Loading
```

### Key Features

| Feature | What It Does | Why It Matters |
|---------|--------------|----------------|
| **6-Tier Importance** | Constitutional → Critical → Important → Normal → Temporary → Deprecated | Right context at the right time |
| **Hybrid Search** | Vector similarity + full-text keywords + RRF fusion | Finds what you mean, not just what you typed |
| **ANCHOR Format** | `<!-- ANCHOR: section-id -->` markers enable section loading | 93% token savings—load specific decisions, not entire files |
| **90-Day Decay** | Old memories fade, recent ones surface | Stays relevant without manual cleanup |
| **Auto-Indexing** | `memory_save()` and `memory_index_scan()` MCP tools | New memories indexed automatically |
| **Checkpoints** | Save/restore database state | Experiment safely, rollback if needed |

### The Six Importance Tiers

| Tier | Boost | Decay | Use For |
|------|-------|-------|---------|
| `constitutional` | 3.0x | Never | Project rules, always-on context (~500 tokens) |
| `critical` | 2.0x | Never | Architecture decisions, breaking changes |
| `important` | 1.5x | Never | Key implementations, major features |
| `normal` | 1.0x | 90-day | Standard development context |
| `temporary` | 0.5x | 7-day | Debug sessions, experiments |
| `deprecated` | 0.0x | — | Excluded from search |

### Memory Commands

| Command | What It Does |
|---------|--------------|
| `/memory:save [spec-folder]` | Save context via generate-context.js (folder required or prompted) |
| `/memory:search` | Dashboard: stats + recent + suggested actions |
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
We chose JWT with refresh tokens because...
<!-- ANCHOR_END: decision-auth-flow -->
```

This enables `memory_load({ specFolder: "042-auth", anchorId: "decision-auth-flow" })` to load just that section instead of the entire file.

### Privacy First

All processing happens locally:
- **Embeddings:** `nomic-embed-text-v1.5` via Ollama (768-dim vectors)
- **Storage:** SQLite with sqlite-vec extension
- **No external API calls** for memory operations

The Semantic Memory MCP server enables AI assistants to search and load memories directly. See [`skill/system-memory/`](skill/system-memory/) for implementation details and [`install_guides/MCP/MCP - Semantic Memory.md`](install_guides/MCP/MCP%20-%20Semantic%20Memory.md) for setup.

---

## 7. 🧩 Skills Library

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the workflows-git skill and already knows your conventions. Skills are automatically discovered and loaded based on what you're trying to do—no manual invocation required for common tasks.

### How Skills Work

```
Your Request → skill_advisor.py analyzes keywords
                        ↓
              Confidence > 80%? → Load skill automatically
                        ↓
              SKILL.md + bundled resources loaded
                        ↓
              AI follows skill guidance
```

**Native Discovery:** OpenCode v1.0.190+ automatically finds skills in `skill/*/SKILL.md` (or `.opencode/skill/` in deployed projects). No plugin required.

### Available Skills (9 Total)

| Skill | What It Does | Trigger Examples |
|-------|--------------|------------------|
| **mcp-leann** | Semantic code search—finds code by *meaning*, not just text | "How does auth work?", "Explain the login flow" |
| **mcp-code-context** | Structural analysis—lists functions, classes, symbols | "What functions are in auth.ts?", "Show class hierarchy" |
| **mcp-code-mode** | External tool orchestration (Webflow, Figma, ClickUp) | "Update Webflow site", "Get Figma components" |
| **system-memory** | Context preservation across sessions | "Save this context", "What did we decide about X?" |
| **system-spec-kit** | Documentation enforcement and templates | "Create spec for feature", "Start new task" |
| **workflows-code** | Implementation lifecycle (plan → code → verify) | "Implement this feature", "Debug this error" |
| **workflows-documentation** | Document quality, skill creation, ASCII flowcharts | "Create install guide", "Validate markdown" |
| **workflows-git** | Git workflows (commits, branches, PRs) | "Commit these changes", "Create PR" |
| **workflows-chrome-devtools** | Browser automation and debugging | "Take screenshot", "Check console errors" |

### Skills vs Commands

| Aspect | Skills | Commands |
|--------|--------|----------|
| **Invocation** | Automatic (keyword-triggered) | Explicit (`/command:name`) |
| **Routing** | skill_advisor.py with confidence scoring | Direct user request |
| **Style** | Flexible guidance—AI adapts | Rigid workflow—strict steps |
| **Example** | "How does auth work?" → mcp-leann | `/spec_kit:complete auth` → 12-step workflow |

### Skill Routing (Gate 2)

Every request passes through the skill advisor:

```bash
python .opencode/scripts/skill_advisor.py "your request"
```

Returns:
```json
{
  "skill": "mcp-leann",
  "confidence": 0.92,
  "reason": "Matched: !how, !authentication, !work"
}
```

**Confidence > 0.8 = mandatory skill invocation.** The AI must load and follow the skill.

### Creating Custom Skills

```bash
# Initialize skill structure
python skill/workflows-documentation/scripts/init_skill.py my-skill

# Required SKILL.md sections:
# - WHEN TO USE (triggers)
# - HOW IT WORKS (patterns)  
# - RULES (✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF)
```

See [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) for the full guide.

---

## 8. ⚡ Commands

Commands are explicit, user-invoked workflows with structured steps. Unlike skills (which load automatically), commands are triggered with a /slash syntax when you want a specific multi-step process. They're perfect for repeatable workflows like creating specs, saving context, or searching code.

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

| Folder      | Commands                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `spec_kit/` | `/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume`, `/spec_kit:debug`, `/spec_kit:handover` |
| `memory/`   | `/memory:save`, `/memory:search`, `/memory:checkpoint`                                                                                |
| `create/`   | `/create:skill`, `/create:skill_asset`, `/create:skill_reference`, `/create:folder_readme`, `/create:install_guide`                   |
| `search/`   | `/search:code`, `/search:index` (semantic code search and index management)                                                           |
| `prompt/`   | `/prompt:improve` (prompt refinement)                                                                                                 |

**Mode Suffixes for spec_kit:** `:auto` or `:confirm` (e.g., `/spec_kit:complete:auto`)
**Handover Variants:** `:quick` (default) or `:full` (e.g., `/spec_kit:handover:full`)


---

## 9. 🏎️ Quick Reference

Everything you need at a glance. This section provides quick links to configuration files, documentation, and common resources. Bookmark this section—you'll come back to it often when you need to find where something lives.

| Resource                       | Location                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **Master Install Guide**       | [`install_guides/README.md`](install_guides/README.md)       |
| OpenCode config                | [`opencode.json`](opencode.json)                             |
| Agent guardrails               | [`AGENTS.md`](AGENTS.md)                                     |
| Skills library                 | [`skill/`](skill/)                                           |
| Commands                       | [`command/`](command/)                                       |
| MCP guides                     | [`install_guides/MCP/`](install_guides/MCP/)                 |
| Plugin guides                  | [`install_guides/PLUGIN/`](install_guides/PLUGIN/)           |
| Setup guides                   | [`install_guides/SET-UP - *.md`](install_guides/)            |

---

## 10. 🎯 What's Next?

You've got the environment set up—now what? This section provides a first-session checklist to validate everything works, links to deeper documentation, and troubleshooting tips for common issues. Complete the checklist to confirm your setup is production-ready.

### First Session Checklist

- [ ] Run `opencode` in your project
- [ ] Try `/spec_kit:complete add-login` to create your first documented feature
- [ ] Use `/memory:save` at the end of your session
- [ ] Start a new session and try `/memory:search "login"` to see persistence

### Going Deeper

| Topic | Resource |
|-------|----------|
| Full installation | [install_guides/README.md](install_guides/README.md) |
| MCP server setup | [install_guides/MCP/](install_guides/MCP/) |
| Creating skills | [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) |
| Agent configuration | [SET-UP - AGENTS.md](install_guides/SET-UP%20-%20AGENTS.md) |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| MCP server won't connect | Check `opencode.json` paths, restart OpenCode |
| Memory search returns nothing | Run `/memory:search cleanup` to reindex |
| Skill not loading | Verify SKILL.md frontmatter has valid `name` field |
| Embeddings failing | Ensure Ollama is running: `ollama serve` |

### Get Help

- **GitHub Issues:** Report bugs and request features
- **AGENTS.md:** Check the gate system for workflow questions
- **Skill READMEs:** Each skill has detailed documentation

---

<p align="center">
  <sub>Found this useful? <a href="https://buymeacoffee.com/michelkerkmeester">Buy me a coffee</a> ☕</sub>
</p>