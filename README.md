# OpenCode Dev Environment

> - 99.999% of people will keep blaming AI for not being good enough for advanced coding. 
> - Beat the odds with this system? 
> - Don't reward me with unwanted coffee:
> - https://buymeacoffee.com/michelkerkmeester

## Summary

**Context Engineering for a [OpenCode](https://github.com/sst/opencode)** development environment. Featuring modular Skills, Semantic Memory, and a custom Spec Kit system you won’t find anywhere else. Everything is designed from the ground up for seamless context retention, automated documentation, and on-demand expertise.

- **🎯 9 Skills** — Domain expertise that loads on demand. Auto-routing via skill_advisor.py, confidence-based invocation, workflows for code/git/docs/browser.

- **🧠 Semantic Memory** — Pick up where you left off, even days later. Hybrid search (vector + FTS5 + RRF fusion), 6 importance tiers, 93% token savings with ANCHOR format, <50ms proactive surfacing. Custom MCP server with 14 tools.

- **📋 Custom Spec Kit** — Every change documented automatically, enforced by gates. 10 templates, 7 slash commands, sub-folder versioning (001/002/003), debug delegation to sub-agents. Memory files live *inside* spec folders.

## TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 SPEC KIT FRAMEWORK](#2--spec-kit-framework)
3. [🧠 MEMORY SYSTEM](#3--memory-system)
4. [🤖 AGENTS.MD FRAMEWORK](#4--agentsmd-framework)
5. [🧩 SKILLS LIBRARY](#5--skills-library)
6. [⚡ COMMANDS](#6--commands)
7. [🚀 INSTALLATION & SETUP](#7--installation--setup)
8.  [🚀 WHAT'S NEXT?](#8--whats-next)

---

## 1. 📖 OVERVIEW

> **Context that persists. Documentation that writes itself.**

### Why This System?

AI coding assistants are powerful but stateless. Every session starts from zero. This environment adds the missing layers: persistent memory, enforced documentation, and automated workflows that make AI-assisted development sustainable for real projects.

| The Pain               | Without This                          | With This Environment                             |
| ---------------------- | ------------------------------------- | ------------------------------------------------- |
| **Context**            | Re-explain everything every session   | Memory persists across sessions, models, projects |
| **Documentation**      | "I'll document later" (never happens) | Gate 3 enforces spec folders on every change      |
| **Decisions**          | Lost in chat history                  | ADRs in decision-record.md, searchable forever    |
| **Handoffs**           | 2-hour "what did you do" meetings     | `/spec_kit:handover` → 15-line summary            |
| **Debugging**          | Copy-paste error → AI guesses         | `/spec_kit:debug` → sub-agent with full context   |
| **Code search**        | grep + hope                           | Semantic search by *meaning*, not text            |
| **Quality gates**      | Trust the AI did it right             | 8 mandatory gates verify completion               |
| **Tool orchestration** | Manual juggling                       | 9 skills load automatically based on task         |

> **The bottom line:** 14 MCP tools, 9 skills, 10 templates, 8 quality gates, 93% token savings—zero re-explanation.


### 🧠 Semantic Memory — *Built from scratch*

A custom MCP server that gives your AI assistant persistent, searchable memory across sessions. Not a wrapper around existing tools—this is purpose-built for AI-assisted development with hybrid search, importance tiers, and proactive context surfacing.

| What Others Have           | What This System Has                       |
| -------------------------- | ------------------------------------------ |
| No memory between sessions | Hybrid search (vector + FTS5 + RRF fusion) |
| Manual context management  | 6 importance tiers with auto-decay         |
| Cloud-dependent solutions  | 100% local (nomic-embed on YOUR machine)   |
| Load entire files          | ANCHOR format = 93% token savings          |
| Hope you remember          | <50ms proactive surfacing before you ask   |
| No recovery options        | Checkpoints = undo button for your index   |

**→ 14 MCP tools | 6 importance tiers | Constitutional memories always surface | Works offline**


### 📋 Spec Kit — What Sets This Apart

Originally inspired by [GitHub Spec Kit](https://github.com/github/spec-kit), this system takes the concept far beyond basic templates. The original offers a starting point for documentation; this version transforms it into a fully automated, self-enforcing workflow. 

Key enhancements include automated through gate enforcement, slash commands for every workflow, deep memory integration, sub-folder versioning for historical traceability, delegated debugging, and a stateless architecture. Here, documentation isn’t just a suggestion—it’s a requirement, enforced by design.

| Original Spec Kit      | This System                                      |
| ---------------------- | ------------------------------------------------ |
| ~3 basic templates     | 10 purpose-built templates                       |
| Optional documentation | Gate 3 blocks code without spec folder           |
| No commands            | 7 slash commands with `:auto`/`:confirm` modes   |
| No memory integration  | Memory lives IN spec folders (deep integration)  |
| Overwrite old work     | 001/002/003 sub-folder versioning                |
| No automation          | 6 scripts handle the boring work                 |
| Debug alone            | AI detects frustration → auto-suggests sub-agent |
| Manual state tracking  | V13.0 stateless architecture (no STATE.md)       |
| "Is this done?"        | Completeness scoring (0-100%)                    |

**→ 10 templates | 7 commands | 6 scripts | V13.0 stateless architecture**

### 🔗 The Integration Nobody Else Has

These systems aren't just bundled—they're *woven together*:
- Memory files live inside spec folders (`specs/###-feature/memory/`)
- Gate 5 enforces `generate-context.js` for every save
- `/spec_kit:resume` auto-loads relevant memories
- Sub-folder versioning preserves independent memory per version

### What's Inside

| Component          | What It Provides                                                        |
| ------------------ | ----------------------------------------------------------------------- |
| **Spec Kit**       | 10 templates, 7 commands, 6 scripts—documentation on autopilot          |
| **Memory System**  | 14 MCP tools, 6 importance tiers, hybrid search—context that persists   |
| **AGENTS.md**      | 8 gates, confidence framework, quality enforcement—guardrails that work |
| **Skills Library** | 9 domain experts that load automatically based on your task             |
| **Commands**       | 20+ slash commands for repeatable multi-step workflows                  |

### How It All Works Together

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
│  • Confidence check (≥80%?)          │
│  • Asks: Spec folder? Git branch?   │
│  • Loads relevant memories          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  🧩 SKILL MATCHING                  │
│                                     │
│  Agent scans <available_skills>     │
│  Loads: workflows-code, spec-kit,    │
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
│  • Checklist verification (L2+)      │
│  • Browser testing confirmed         │
│  • Documentation complete           │
└─────────────────────────────────────┘

     RESULT: Every conversation is:
     ├── 📁 Documented in specs/###-feature/
     ├── 🧠 Searchable in memory system
     └── 🔄 Recoverable in future sessions
```

---

## 2. 📋 SPEC KIT FRAMEWORK

> **Documentation that writes itself. Context that never dies.**

Every feature you build should leave a trail. Not for bureaucracy—for your future self, your team, and the AI that helps you code. Spec Kit enforces one simple rule: *no code without a spec folder*.

The result? Six months from now, you'll know exactly why you made that architectural decision. Your AI assistant will pick up where you left off. And onboarding new developers takes hours instead of weeks.

### What Makes This Different

| Capability             | Basic Documentation | This Spec Kit                                    |
| ---------------------- | ------------------- | ------------------------------------------------ |
| **Enforcement**        | Hope you remember   | Gate 3 blocks file changes without spec folder   |
| **Templates**          | Start from scratch  | 10 purpose-built templates ready to copy         |
| **Commands**           | Manual workflow     | 7 slash commands with `:auto`/`:confirm` modes   |
| **Memory Integration** | None                | Deep integration—memories live IN spec folders   |
| **Session Handover**   | Screenshot + pray   | `:quick` (15 lines) or `:full` (150 lines)       |
| **Debug Assistance**   | None                | AI detects frustration → auto-suggests sub-agent |
| **Quality Metrics**    | Guesswork           | Completeness scoring (0-100%)                    |
| **Folder Versioning**  | Overwrite old work  | 001/002/003 sub-folder pattern preserves history |

> **The bottom line:** 10 templates, 7 commands, 6 scripts, 0 excuses for losing context.

### Three Documentation Levels

| Level       | Files Required               | When to Use                          |
| ----------- | ---------------------------- | ------------------------------------ |
| **Level 1** | spec.md, plan.md, tasks.md   | Bug fixes, small features (<100 LOC) |
| **Level 2** | Level 1 + checklist.md       | Features needing QA (100-499 LOC)    |
| **Level 3** | Level 2 + decision-record.md | Architecture changes (500+ LOC)      |

**Rule of thumb:** When in doubt, go one level higher.

### Quick Example

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

### Spec Kit Commands

| Command               | What It Does                           |
| --------------------- | -------------------------------------- |
| `/spec_kit:complete`  | Full workflow: spec → plan → implement |
| `/spec_kit:plan`      | Planning only, no implementation       |
| `/spec_kit:implement` | Execute existing plan                  |
| `/spec_kit:research`  | Technical investigation                |
| `/spec_kit:resume`    | Continue previous session              |
| `/spec_kit:handover`  | Create session handover document       |
| `/spec_kit:debug`     | Delegate debugging to sub-agent        |

**Mode Suffixes:** Add `:auto` or `:confirm` (e.g., `/spec_kit:complete:auto`)
**Handover Variants:** `:quick` (default) or `:full` (e.g., `/spec_kit:handover:full`)

### Templates (10 Total)

| Template              | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `spec.md`             | Feature specification with acceptance criteria |
| `plan.md`             | Technical implementation plan                  |
| `tasks.md`            | Task breakdown by user story                   |
| `checklist.md`        | QA validation with P0/P1/P2 priorities         |
| `decision-record.md`  | Architecture Decision Records (ADRs)           |
| `research.md`         | Comprehensive technical research               |
| `research-spike.md`   | Time-boxed proof of concept                    |
| `handover.md`         | Session continuity for multi-session work      |
| `debug-delegation.md` | Sub-agent debugging tasks                      |
| `quick-continue.md`   | Minimal handoff for session branching          |

> **V13.0 Architecture:** Project state is embedded in memory files (no separate state.md). This means no bloated marker files cluttering your repo.

For detailed documentation, see the [system-spec-kit skill](skill/system-spec-kit/SKILL.md).

---

## 3. 🧠 MEMORY SYSTEM

> **Remember everything. Surface what matters. Keep it private.**

Your AI assistant forgets everything between sessions. You explain your auth system Monday—by Wednesday, it's a blank slate. This memory system fixes that with semantic search that understands *meaning*, importance tiers that prioritize *what matters*, and local-first architecture that keeps *your code yours*.

No cloud. No external APIs. Just intelligent context preservation that makes AI-assisted development actually work.

### What Makes This Different

| Capability               | Basic Chat Logs    | This Memory System                              |
| ------------------------ | ------------------ | ----------------------------------------------- |
| **Search**               | Ctrl+F (text only) | Hybrid semantic + keyword (RRF fusion)          |
| **Prioritization**       | None               | 6-tier importance (constitutional → deprecated) |
| **Relevance**            | All memories equal | 90-day decay keeps recent memories on top       |
| **Privacy**              | Often cloud-stored | 100% local (nomic-embed runs on YOUR machine)   |
| **Token Efficiency**     | Load everything    | ANCHOR format (93% savings)                     |
| **Spec Kit Integration** | None               | Deep (Gate 5 enforced, lives in spec folders)   |
| **Proactive Surfacing**  | None               | <50ms trigger matching                          |
| **Recovery**             | Hope you backed up | Checkpoints (undo button for your index)        |

> **The bottom line:** 14 MCP tools, 6 importance tiers, <50ms trigger matching, 93% token savings, 0 data sent externally.

### Deep Spec Kit Integration

Memory and Spec Kit are designed to work together:

| Integration Point         | How It Works                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| **Memory Location**       | Files live IN spec folders: `specs/###-feature/memory/`           |
| **Gate 5 Enforcement**    | Memory saves MUST use `generate-context.js` (no orphaned context) |
| **Sub-folder Versioning** | Each 001/002/003 sub-folder has independent memory context        |
| **Session Continuity**    | `/spec_kit:resume` auto-loads relevant memories                   |
| **V13.0 Stateless**       | Project state embedded in memory files (no separate STATE.md)     |

When you save context, it goes to the right spec folder. When you resume work, memories load automatically. When you version your specs, memories version with them.

### The Six Importance Tiers

| Tier             | Boost | Decay  | Use For                                        |
| ---------------- | ----- | ------ | ---------------------------------------------- |
| `constitutional` | 3.0x  | Never  | Project rules, always-on context (~500 tokens) |
| `critical`       | 2.0x  | Never  | Architecture decisions, breaking changes       |
| `important`      | 1.5x  | Never  | Key implementations, major features            |
| `normal`         | 1.0x  | 90-day | Standard development context                   |
| `temporary`      | 0.5x  | 7-day  | Debug sessions, experiments                    |
| `deprecated`     | 0.0x  | —      | Excluded from search                           |

### Memory Commands

| Command                      | What It Does                                  |
| ---------------------------- | --------------------------------------------- |
| `/memory:save [spec-folder]` | Save context via generate-context.js          |
| `/memory:search`             | Dashboard: stats + recent + suggested actions |
| `/memory:search <query>`     | Semantic search with tier/type filters        |
| `/memory:search cleanup`     | Interactive cleanup of old memories           |
| `/memory:search triggers`    | View and manage trigger phrases               |
| `/memory:checkpoint create`  | Snapshot current state                        |

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

> **Your Code Never Leaves Your Machine**

All processing happens locally:
- **Embeddings:** `nomic-embed-text-v1.5` runs on YOUR machine (768-dim vectors)
- **Storage:** SQLite with sqlite-vec extension in YOUR project
- **No external API calls** for memory operations
- Works fully offline

See [`skill/system-memory/`](skill/system-memory/) for implementation details and [`install_guides/MCP/MCP - Semantic Memory.md`](install_guides/MCP/MCP%20-%20Semantic%20Memory.md) for setup.

---

## 4. 🤖 AGENTS.MD FRAMEWORK

The [`AGENTS.md`](AGENTS.md) file is the brain of your AI assistant's behavior. It defines 8 mandatory gates that every request passes through, preventing common failures like hallucination, scope creep, and forgotten context.

### Why You Need This

Without guardrails, AI assistants:
- Make assumptions instead of asking clarifying questions
- Skip documentation and lose context between sessions
- Claim completion without proper verification
- Create technical debt through inconsistent approaches

**AGENTS.md prevents all of this.**

### The 8-Gate System

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

### Core Framework Components

**Confidence & Clarification Framework:**
- Explicit confidence scoring (0-100%)
- Mandatory clarification when confidence < 80%
- Multiple-choice questions for ambiguous requests
- Never fabricates: outputs "UNKNOWN" when unverifiable

**Quality Principles:**
- Simplicity first (KISS)
- Evidence-based decisions with citations
- Scope discipline: solves only what's asked
- Browser verification before completion claims

**Codebase-Agnostic Version:** [`AGENTS (Universal).md`](AGENTS%20(Universal).md)—ready to drop into any codebase.

---

## 5. 🧩 SKILLS LIBRARY

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the workflows-git skill and already knows your conventions.

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

**Native Discovery:** OpenCode v1.0.190+ automatically finds skills in `skill/*/SKILL.md`. No plugin required.

### Available Skills (9 Total)

| Skill                         | What It Does                                    | Trigger Examples                 |
| ----------------------------- | ----------------------------------------------- | -------------------------------- |
| **mcp-leann**                 | Semantic code search—finds code by *meaning*    | "How does auth work?"            |
| **mcp-code-context**          | Structural analysis—lists functions, classes    | "What functions are in auth.ts?" |
| **mcp-code-mode**             | External tool orchestration (Webflow, Figma)    | "Update Webflow site"            |
| **system-memory**             | Context preservation across sessions            | "Save this context"              |
| **system-spec-kit**           | Documentation enforcement and templates         | "Create spec for feature"        |
| **workflows-code**            | Implementation lifecycle (plan → code → verify) | "Implement this feature"         |
| **workflows-documentation**   | Document quality, skill creation                | "Create install guide"           |
| **workflows-git**             | Git workflows (commits, branches, PRs)          | "Commit these changes"           |
| **workflows-chrome-devtools** | Browser automation and debugging                | "Take screenshot"                |

### Skills vs Commands

| Aspect         | Skills                                   | Commands                    |
| -------------- | ---------------------------------------- | --------------------------- |
| **Invocation** | Automatic (keyword-triggered)            | Explicit (`/command:name`)  |
| **Routing**    | skill_advisor.py with confidence scoring | Direct user request         |
| **Style**      | Flexible guidance—AI adapts              | Rigid workflow—strict steps |

**Confidence > 0.8 = mandatory skill invocation.** The AI must load and follow the skill.

### Creating Custom Skills

```bash
python skill/workflows-documentation/scripts/init_skill.py my-skill
```

See [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) for the full guide.

---

## 6. ⚡ COMMANDS

Commands are explicit, user-invoked workflows with structured steps. Unlike skills (which load automatically), commands are triggered with a /slash syntax for repeatable multi-step processes.

### Why Commands Beat Free-Form Prompts

| Free-Form Prompts       | Commands                 |
| ----------------------- | ------------------------ |
| You remember each step  | Workflow baked in        |
| 12 prompts for 12 steps | 1 prompt, 12 steps       |
| No enforcement          | Gates prevent skipping   |
| Manual skill loading    | Auto-loads what's needed |
| High quota usage        | Minimal quota cost       |

### Available Commands

| Folder      | Commands                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spec_kit/` | `/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume`, `/spec_kit:debug`, `/spec_kit:handover` |
| `memory/`   | `/memory:save`, `/memory:search`, `/memory:checkpoint`                                                                                           |
| `create/`   | `/create:skill`, `/create:skill_asset`, `/create:skill_reference`, `/create:folder_readme`, `/create:install_guide`                              |
| `search/`   | `/search:code`, `/search:index`                                                                                                                  |
| `prompt/`   | `/prompt:improve`                                                                                                                                |

---

## 7. 🚀 INSTALLATION & SETUP

> - 📚 Master install guide:** [`install_guides/README.md`](install_guides/README.md)

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

Copy the template to your project:

```bash
cp "Code Environment/opencode.json" /path/to/your-project/opencode.json
```

### Connecting Providers

OpenCode supports multiple LLM providers:

**GitHub Copilot Pro+ (Best Value):**
1. Subscribe to [GitHub Copilot Pro+](https://github.com/features/copilot)
2. Install GitHub CLI: `brew install gh`
3. Authenticate: `gh auth login`
4. OpenCode auto-detects your subscription

**Claude Code (Subscription-Based):**
1. Install [Claude Code](https://claude.ai/code)
2. Sign in with your Anthropic account
3. OpenCode auto-detects and uses your subscription

**OpenRouter (API Key):**
```bash
export OPENROUTER_API_KEY="your-api-key"
```

### MCP Server Setup

MCP servers extend your AI with specialized capabilities. This environment includes 6 pre-configured servers:

| Server                  | What It Does                               | Guide                                                          |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| **Code Mode**           | TypeScript tool orchestration              | [Guide](install_guides/MCP/MCP%20-%20Code%20Mode.md)           |
| **LEANN**               | Semantic code search (97% storage savings) | [Guide](install_guides/MCP/MCP%20-%20LEANN.md)                 |
| **Code Context**        | Structural code analysis via Tree-sitter   | [Guide](install_guides/MCP/MCP%20-%20Code%20Context.md)        |
| **Semantic Memory**     | Local vector-based conversation memory     | [Guide](install_guides/MCP/MCP%20-%20Semantic%20Memory.md)     |
| **Sequential Thinking** | Structured multi-step reasoning            | [Guide](install_guides/MCP/MCP%20-%20Sequential%20Thinking.md) |
| **Chrome DevTools**     | Browser automation and debugging           | [Guide](install_guides/MCP/MCP%20-%20Chrome%20Dev%20Tools.md)  |

### Code Search Tools (Complementary)

Use these three tools together:

| Tool             | Type       | Query Example               | Returns              |
| ---------------- | ---------- | --------------------------- | -------------------- |
| **LEANN**        | Semantic   | "How does auth work?"       | Code by meaning      |
| **Code Context** | Structural | "List functions in auth.ts" | Symbols/definitions  |
| **Grep**         | Lexical    | "Find 'TODO' comments"      | Text pattern matches |

### Native Skills Setup

Skills are **natively supported** in OpenCode v1.0.190+. Auto-discovered from `skill/*/SKILL.md`.

| Guide                                                                         | Purpose                             |
| ----------------------------------------------------------------------------- | ----------------------------------- |
| [SET-UP - AGENTS.md](install_guides/SET-UP%20-%20AGENTS.md)                   | Configure AI agent guardrails       |
| [SET-UP - Skill Advisor.md](install_guides/SET-UP%20-%20Skill%20Advisor.md)   | Configure intelligent skill routing |
| [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) | Create custom skills                |

### Auth Plugins

| Plugin                          | Guide                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| Antigravity Auth (Google OAuth) | [PLUGIN - Antigravity Auth.md](install_guides/PLUGIN/PLUGIN%20-%20Antigravity%20Auth.md)     |
| OpenAI Codex Auth               | [PLUGIN - OpenAI Codex Auth.md](install_guides/PLUGIN/PLUGIN%20-%20OpenAI%20Codex%20Auth.md) |

---

## 8. 🚀 WHAT'S NEXT?

### First Session Checklist

- [ ] Run `opencode` in your project
- [ ] Try `/spec_kit:complete add-login` to create your first documented feature
- [ ] Use `/memory:save` at the end of your session
- [ ] Start a new session and try `/memory:search "login"` to see persistence

### Going Deeper

| Topic               | Resource                                                                      |
| ------------------- | ----------------------------------------------------------------------------- |
| Full installation   | [install_guides/README.md](install_guides/README.md)                          |
| MCP server setup    | [install_guides/MCP/](install_guides/MCP/)                                    |
| Creating skills     | [SET-UP - Skill Creation.md](install_guides/SET-UP%20-%20Skill%20Creation.md) |
| Agent configuration | [SET-UP - AGENTS.md](install_guides/SET-UP%20-%20AGENTS.md)                   |

### Get Help

- **GitHub Issues:** Report bugs and request features
- **AGENTS.md:** Check the gate system for workflow questions
- **Skill READMEs:** Each skill has detailed documentation

## The Philosophy

This environment exists because documentation shouldn't be a tax on productivity—it should be invisible infrastructure that pays dividends when you need it most.

### Documentation as Infrastructure

Every feature leaves a trail. Not for bureaucracy—for your future self, your team, and the AI that helps you code. Gates enforce what humans forget.

### Memory as First-Class Citizen

Context is the most valuable asset in AI-assisted development—and the most fragile. This system treats memory preservation as essential, not optional.

### Automation Over Discipline

Humans forget to document. Humans forget to save context. Humans forget to clean up old memories. This system doesn't rely on human discipline—it automates what matters.