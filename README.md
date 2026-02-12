<div align="left">

# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/releases)

</div>

> - 99.999% of people won't try this system. Beat the odds?
> - https://buymeacoffee.com/michelkerkmeester

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. ❓ FAQ](#8--faq)
- [9. 📚 RELATED DOCUMENTS](#9--related-documents)

---

## 1. 📖 OVERVIEW

### What is This?

AI coding assistants are powerful but they have amnesia. Every session starts from zero. You explain your auth system Monday — by Wednesday, it's a blank slate. Your architectural decisions? Lost in chat history. Documentation? "I'll do it later" (you won't).

Two custom-built systems fix this: a **cognitive memory MCP server** and a **spec-kit documentation framework** that turn stateless AI sessions into a continuous, searchable development history. Not a wrapper around existing tools. This is purpose-built for AI-assisted development.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session, losing decisions to chat history, and hoping documentation happens "later."

### Key Statistics

| Category         | Count | Details                                        |
| ---------------- | ----- | ---------------------------------------------- |
| MCP Tools        | 22    | Across 7 architectural layers (L1-L7)          |
| Agents           | 10    | 8 custom + 2 built-in (`@general`, `@explore`) |
| Skills           | 9     | Domain expertise, auto-loaded by task keywords |
| Commands         | 19    | 7 spec_kit + 5 memory + 6 create + 1 utility   |
| Templates        | 70+   | CORE + ADDENDUM composition model (v2.2)       |
| Validation Rules | 13    | Pluggable, automated spec folder checks        |
| Test Files       | 118   | 3,872 tests, 0 TypeScript errors               |

### How It All Connects

```
┌──────────────────────────────────────────────────────────────┐
│                      YOUR REQUEST                            │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  GATE SYSTEM (3 mandatory gates)                             │
│  Gate 1: Understanding ─► Gate 2: Skill Routing ─► Gate 3:   │
│  Context surfacing        Auto-load expertise      Spec      │
│  Dual-threshold           skill_advisor.py         folder    │
│  validation               confidence >= 0.8        HARD BLOCK │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
         ┌─────────────┴──────────────┐
         ▼                            ▼
┌─────────────────┐        ┌─────────────────────┐
│  AGENT NETWORK  │        │  SKILLS LIBRARY     │
│  10 specialized │        │  9 domain skills    │
│  agents with    │◄──────►│  auto-loaded by     │
│  routing logic  │        │  task keywords      │
└────────┬────────┘        └──────────┬──────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────────────────┐
│  MEMORY ENGINE (22 MCP tools, 7 layers)                      │
│  Cognitive tiers ─ Causal graphs ─ Hybrid search             │
│  Embeddings: Voyage | OpenAI | HuggingFace Local (free)      │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SPEC KIT (documentation framework)                          │
│  specs/###-feature/  ─  memory/  ─  scratch/                 │
│  4 levels ─ 70+ templates ─ 13 validation rules              │
└──────────────────────────────────────────────────────────────┘
```

Everything connects. Memory files live *inside* spec folders. Gates enforce documentation before any file change. Skills auto-load based on your task. Agents coordinate and delegate. The result: every AI-assisted session is documented, searchable, and recoverable.

### Why This System?

**Without This**

- **Context**: Re-explain everything every session
- **Documentation**: "I'll document later" (never happens)
- **Decisions**: Lost in chat history
- **Handoffs**: 2-hour "what did you do" meetings
- **Debugging**: Copy-paste error, AI guesses
- **Code search**: `grep` + hope
- **Quality gates**: Trust the AI did it right
- **Tool orchestration**: Manual juggling

**With This Environment**

- **Context**: Memory persists across sessions, models, projects
- **Documentation**: Gate 3 enforces spec folders on every change
- **Decisions**: ADRs in `decision-record.md`, searchable forever
- **Handoffs**: `/spec_kit:handover` produces a 15-line summary
- **Debugging**: `/spec_kit:debug` spawns sub-agent with full context
- **Code search**: Semantic search by *meaning*, not just text
- **Quality gates**: Mandatory gates verify completion with evidence
- **Tool orchestration**: 9 skills load automatically based on task

### Innovations You Won't Find Elsewhere

| Innovation                | Impact                | Description                                                 |
| ------------------------- | --------------------- | ----------------------------------------------------------- |
| **Causal memory graph**   | Decision tracing      | 6 relationship types answer "why" queries                   |
| **Crash recovery**        | Zero lost work        | Auto-resume from compaction/timeout via `/memory:continue`  |
| **Intent-aware search**   | Smarter retrieval     | 5 intent types route to optimized search weights            |
| **Session deduplication** | 50% token savings     | Hash-based duplicate prevention in same session             |
| **ANCHOR retrieval**      | 93% token savings     | Section-level memory extraction, not full files             |
| **Proactive triggers**    | <50ms surfacing       | Context surfaces BEFORE you ask                             |
| **Constitutional tier**   | Rules never forgotten | Critical rules always surface, never decay                  |
| **Cognitive memory**      | Biologically-inspired | HOT/WARM/COLD with attention decay and spreading activation |
| **Debug delegation**      | Fresh perspective     | Model selection + 4-phase methodology                       |
| **Parallel dispatch**     | 5-dimension scoring   | Complexity-based agent orchestration                        |
| **Epistemic vectors**     | Smarter gates         | Dual-threshold: confidence AND uncertainty                  |
| **Session learning**      | Quantified growth     | Preflight/postflight tracks actual learning                 |
| **Template composition**  | Zero duplication      | CORE + ADDENDUM architecture                                |
| **Stateless state**       | No stale files        | State versioned in memory files, not STATE.md               |

### Requirements

| Requirement                                 | Minimum   | Recommended |
| ------------------------------------------- | --------- | ----------- |
| [OpenCode](https://github.com/sst/opencode) | v1.0.190+ | Latest      |
| Node.js                                     | v18+      | v20+        |
| npm                                         | v9+       | v10+        |

---

## 2. 🚀 QUICK START

Three commands. That's it.

### Prerequisites

- [OpenCode](https://github.com/sst/opencode) (v1.0.190+)
- Node.js (v18+)

### 30-Second Setup

```bash
# 1. Clone the environment
git clone https://github.com/MichelKerkmeester/opencode-dev-environment.git
cd opencode-dev-environment

# 2. Build the Memory MCP server (TypeScript -> dist/)
cd .opencode/skill/system-spec-kit && npm install && npm run build && cd ../../..

# 3. Launch OpenCode
opencode
```

### Verify Installation

```bash
# Inside OpenCode, try your first documented feature:
/spec_kit:complete "add user authentication"
# Expected: Creates specs/042-add-user-authentication/ with templates
```

### First Use

```bash
# Save your session context when done
/memory:save

# Next session — even weeks later — your AI remembers:
/memory:context "authentication"
# Returns: semantically matched memories from your previous work
```

You just created a documented, searchable, recoverable development session. No setup files. No configuration dance. It just works.

---

## 3. 📁 STRUCTURE

Here's where everything lives:

```
.opencode/
├── agent/                    # 8 custom agent definitions
│   ├── orchestrate.md        # Multi-agent coordination
│   ├── context.md            # Context retrieval and synthesis
│   ├── research.md           # Evidence gathering
│   ├── speckit.md            # Spec folder documentation
│   ├── write.md              # Documentation generation
│   ├── review.md             # Code review (READ-ONLY)
│   ├── debug.md              # Fresh-perspective debugging
│   └── handover.md           # Session continuation
├── command/                  # 19 slash commands
│   ├── spec_kit/             # 7 spec workflow commands
│   ├── memory/               # 5 memory operation commands
│   └── create/               # 6 creation commands (+1 utility)
├── skill/                    # 9 domain skills
│   ├── system-spec-kit/      # Documentation + Memory MCP server
│   ├── workflows-code--*/    # Code implementation (3 variants)
│   ├── workflows-documentation/  # Document quality
│   ├── workflows-git/        # Git workflows
│   ├── workflows-chrome-devtools/  # Browser automation
│   ├── mcp-code-mode/        # External tool orchestration
│   └── mcp-figma/            # Figma design integration
├── install_guides/           # Setup documentation + install scripts
├── scripts/                  # Utility scripts (skill_advisor.py)
└── specs/                    # Spec folder documentation root
```

### Key Files

| File                                 | Purpose                                                      |
| ------------------------------------ | ------------------------------------------------------------ |
| `AGENTS.md`                          | AI behavior framework — gates, protocols, confidence scoring |
| `opencode.json`                      | MCP server configuration (3 servers)                         |
| `.opencode/scripts/skill_advisor.py` | Auto-routes requests to matching skills                      |

---

## 4. ⚡ FEATURES

### The Memory Engine

> *Remember everything. Surface what matters. Keep it private.*

Your AI assistant forgets everything between sessions. You explain your auth system Monday — by Wednesday, it's a blank slate. You debug a tricky race condition Thursday — by next Tuesday, the same investigation starts from scratch.

The Memory Engine fixes this. A custom MCP server with 22 tools across 7 architectural layers gives your AI persistent, searchable, *cognitive* memory. Not a wrapper around existing tools — this is purpose-built for AI-assisted development.

#### 22 Tools Across 7 Layers

| Layer                | Tools                                                                                                                        | Purpose                                                       | Token Budget |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| **L1** Orchestration | `memory_context`                                                                                                             | Unified entry with intent-aware routing                       | 2,000        |
| **L2** Core          | `memory_search`, `memory_match_triggers`, `memory_save`                                                                      | Semantic search, fast keyword matching (<50ms), file indexing | 1,500        |
| **L3** Discovery     | `memory_list`, `memory_stats`, `memory_health`                                                                               | Browse, statistics, health checks                             | 800          |
| **L4** Mutation      | `memory_update`, `memory_delete`, `memory_validate`                                                                          | Update metadata, delete, record feedback                      | 500          |
| **L5** Checkpoints   | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`                                            | Save/restore memory state (undo button for your index)        | 600          |
| **L6** Analysis      | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | Epistemic tracking, causal graphs                             | 1,200        |
| **L7** Maintenance   | `memory_index_scan`, `memory_get_learning_history`                                                                           | Bulk indexing, learning trends                                | 1,000        |

#### Cognitive Memory

This isn't basic vector storage. Inspired by biological working memory, the system implements cognitive subsystems that make memory *intelligent*:

**HOT / WARM / COLD Tiers** — Memories are classified by attention score. HOT memories (score >= 0.8) return full content. WARM memories (0.25-0.79) return summaries only. COLD memories (< 0.25) are suppressed — they exist but don't clutter your context.

**Attention Decay** — Every memory's score decays with each conversation turn:

```
new_score = current_score x (decay_rate ^ turns_elapsed)
```

Constitutional-tier memories never decay. Normal memories fade at 0.80 per turn. Temporary memories fade fast at 0.60 per turn. This mimics how human working memory naturally prioritizes recent, relevant information.

**Spreading Activation** — When a primary memory is activated, related memories receive a 0.35 score boost automatically. You search for "authentication" and the system co-activates memories about JWT tokens, OAuth setup, and session management — context you didn't ask for but need.

**FSRS Scheduler** — The Free Spaced Repetition Scheduler optimizes review intervals. Memories that prove useful are scheduled for more frequent surfacing; unused ones decay faster.

**Prediction Error Gating** — New information is weighted by how surprising it is. Expected content gets lower priority; novel discoveries get amplified.

#### Causal Memory Graph

Every decision has a lineage. Six months from now, you won't be guessing why you chose JWT over sessions — you'll *know*. The causal graph tracks 6 relationship types:

| Relationship   | Example                                                           |
| -------------- | ----------------------------------------------------------------- |
| `caused`       | "JWT decision" -> caused -> "token refresh implementation"        |
| `enabled`      | "OAuth2 setup" -> enabled -> "social login feature"               |
| `supersedes`   | "v2 auth flow" -> supersedes -> "v1 auth flow"                    |
| `contradicts`  | "stateless approach" -> contradicts -> "session storage proposal" |
| `derived_from` | "rate limiter config" -> derived from -> "load testing results"   |
| `supports`     | "performance benchmarks" -> supports -> "caching decision"        |

Use `memory_drift_why` to trace the causal chain up to N hops, grouping results by relationship type.

#### Hybrid Search

Finding the right memory isn't about keywords alone. Four complementary strategies fuse together:

- **Vector similarity** — semantic meaning via embeddings (Voyage AI, OpenAI, or HuggingFace Local)
- **BM25** — term-frequency ranking for keyword precision
- **Full-Text Search (FTS5)** — SQLite's native text search for exact matches
- **RRF fusion** — Reciprocal Rank Fusion combines all three ranking signals
- **Cross-encoder reranking** — optional second-pass for maximum relevance

#### Learning Metrics

Track what your AI assistant actually *learned*, not just what it did:

```
Learning Index = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)
```

`task_preflight()` captures baseline scores before work starts. `task_postflight()` captures results after. The delta reveals whether a session produced genuine learning or just executed known patterns.

#### The Details That Matter

- **6 importance tiers**: constitutional (always surfaces, never decays) -> critical -> important -> normal -> temporary -> deprecated (hidden but preserved)
- **Session deduplication**: Hash-based tracking prevents re-sending the same memory twice per session (~50% token savings on follow-up queries)
- **ANCHOR format**: Section-level extraction from memory files delivers 93% token savings vs. loading full files
- **4 embedding providers**: Voyage AI (recommended, best retrieval), OpenAI (cloud alternative), HuggingFace Local (free, offline, default fallback), auto-detection based on available API keys
- **Checkpoints**: Snapshot and restore your entire memory index — an undo button for your knowledge base

---

### The Agent Network

Without guardrails, AI assistants make assumptions instead of asking clarifying questions, skip documentation and lose context between sessions, claim completion without proper verification, and create technical debt through inconsistent approaches.

Ten specialized agents fix this. Two are built into OpenCode; eight are custom agents defined in `.opencode/agent/`.

| Agent          | Type     | Role                                                               |
| -------------- | -------- | ------------------------------------------------------------------ |
| `@general`     | Built-in | Implementation, complex coding tasks                               |
| `@explore`     | Built-in | Quick codebase exploration, file discovery                         |
| `@orchestrate` | Custom   | Multi-agent coordination with enterprise patterns                  |
| `@context`     | Custom   | Context retrieval and synthesis for other agents                   |
| `@research`    | Custom   | Evidence gathering, technical investigation                        |
| `@speckit`     | Custom   | Spec folder creation (exclusive: only agent that writes spec docs) |
| `@write`       | Custom   | Documentation generation (READMEs, skills, guides)                 |
| `@review`      | Custom   | Code review with pattern validation (READ-ONLY)                    |
| `@debug`       | Custom   | Fresh-perspective debugging, root cause analysis                   |
| `@handover`    | Custom   | Session continuation, context preservation                         |

#### Enterprise Orchestration

The `@orchestrate` agent implements patterns borrowed from distributed systems — the kind you'd expect in production infrastructure, not an AI coding assistant:

- **Circuit Breaker** — Isolates failing agents (3 failures -> OPEN state, 60s cooldown)
- **Saga Compensation** — Reverse-order rollback when multi-task workflows fail
- **Quality Gates** — Pre/mid/post execution scoring with 70-point threshold
- **Resource Budgeting** — Token budget management (50K default, 80% warning, 100% halt)
- **Conditional Branching** — IF/THEN/ELSE logic with 3-level nesting
- **Checkpointing** — Recovery snapshots every 5 tasks or 10 tool calls
- **Context Window Budget (CWB)** — Tracks cumulative context consumption across delegated tasks
- **Sub-Orchestrator Pattern** — Delegates complex sub-workflows to nested orchestrators

#### How Agents Get Chosen

Agent selection follows clear rules: `@research` for investigation, `@speckit` for spec documentation (exclusively — no other agent may write spec template files), `@debug` when you're stuck 3+ attempts, `@review` for code quality evaluation, `@orchestrate` for anything requiring multi-agent coordination.

#### Fresh-Perspective Debugging

Been staring at the same error for an hour? The `@debug` agent uses a 4-phase methodology — Observe -> Analyze -> Hypothesize -> Fix — and *intentionally starts with no prior context*. When you've exhausted your assumptions, a fresh perspective with none is exactly what you need. Trigger it with `/spec_kit:debug`, select your preferred model, and the agent starts from scratch.

---

### The Gate System

Every request passes through mandatory gates before the AI touches a single file. This is what makes the framework *enforced*, not suggested. No exceptions. No "just this once."

```
Request ──► Gate 1 (SOFT) ──► Gate 2 (REQUIRED) ──► Gate 3 (HARD) ──► Execute
            Understanding      Skill Routing         Spec Folder
```

**Gate 1: Understanding + Context Surfacing** (SOFT BLOCK)
Dual-threshold validation: `READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)`. Both must pass. If either fails, the AI investigates (max 3 iterations) before escalating to you with options. Surfaces relevant memories via trigger matching before you even ask.

**Gate 2: Skill Routing** (REQUIRED)
Runs `skill_advisor.py` against your request. Confidence >= 0.8 means the recommended skill *must* be loaded. Below 0.8, general approach is fine. This ensures the right domain expertise is always in context.

**Gate 3: Spec Folder** (HARD BLOCK)
If the request involves *any* file modification, the AI must ask: A) Use existing spec folder? B) Create new? C) Update related? D) Skip? No file changes happen without an answer. This single gate ensures every change is documented.

**Post-Execution Rules:**
- **Memory Save** — When saving context, `generate-context.js` is mandatory (no manual memory file creation)
- **Completion Verification** — Before claiming "done," the AI loads `checklist.md` and verifies every item with evidence

#### Analysis Lenses

Six lenses the AI applies silently to catch problems before they happen:

| Lens               | Catches                                    |
| ------------------ | ------------------------------------------ |
| **CLARITY**        | Over-abstraction, unearned complexity      |
| **SYSTEMS**        | Missed dependencies, side effects          |
| **BIAS**           | Solving symptoms instead of root causes    |
| **SUSTAINABILITY** | Future maintenance nightmares              |
| **VALUE**          | Cosmetic changes disguised as improvements |
| **SCOPE**          | Solution complexity exceeding problem size |

#### Auto-Detected Anti-Patterns

Six anti-patterns are flagged automatically when the AI detects trigger phrases:

| Pattern                | Trigger                          | Response                                                   |
| ---------------------- | -------------------------------- | ---------------------------------------------------------- |
| Over-engineering       | "future-proof", "might need"     | "Is this solving a current problem or a hypothetical one?" |
| Premature optimization | "could be slow"                  | "Has this been measured?"                                  |
| Cargo culting          | "best practice", "always should" | "Does this pattern fit this specific case?"                |
| Gold-plating           | "while we're here"               | "That's outside current scope. Track separately?"          |
| Wrong abstraction      | "DRY this up" (2 instances)      | "Similar code isn't always the same concept."              |
| Scope creep            | "also add", "bonus feature"      | "That's a separate change."                                |

---

### Spec Kit Documentation

Every feature you build should leave a trail. Not for bureaucracy — for your future self, your team, and the AI that picks up where you left off. Six months from now, you'll know exactly *why* you made that architectural decision.

#### Four Documentation Levels

| Level  | Required Files                                        | When                               |
| ------ | ----------------------------------------------------- | ---------------------------------- |
| **1**  | spec.md, plan.md, tasks.md, implementation-summary.md | All features (<100 LOC)            |
| **2**  | Level 1 + checklist.md                                | QA needed (100-499 LOC)            |
| **3**  | Level 2 + decision-record.md                          | Architecture changes (500+ LOC)    |
| **3+** | Level 3 + AI protocols, extended checklist            | Multi-agent, enterprise governance |

When in doubt, go one level higher.

#### CORE + ADDENDUM Templates

70+ templates use a composition model — CORE templates are shared across levels, and level-specific ADDENDUM templates extend them. Update CORE once and all levels inherit the change. Zero content duplication.

```
Level 1:  [CORE templates]                    -> 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       -> 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  -> 6 files
Level 3+: [CORE] + [all addendums]             -> 6+ files
```

#### Validation System

13 pluggable validation rules run via `validate.sh` before any spec folder can be marked complete. Rules check for required files, unfilled placeholders, valid anchors, correct folder naming, frontmatter integrity, complexity-level alignment, and more. Exit code 0 = pass. Exit code 2 = must fix.

#### Memory Integration

Memory files live *inside* spec folders at `specs/###-feature/memory/`. Saves are enforced via `generate-context.js` (never manual file creation). Sub-folder versioning (`001/`, `002/`, `003/`) gives each version independent memory context. `/memory:continue` auto-loads relevant memories when resuming work.

---

### Skills Library

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the `workflows-git` skill and already knows your conventions. No repeating yourself. No inconsistent results.

#### Available Skills (9)

| Skill                        | Domain        | Purpose                                                                  |
| ---------------------------- | ------------- | ------------------------------------------------------------------------ |
| `system-spec-kit`            | Documentation | Spec folders, templates, memory integration, context preservation        |
| `workflows-code--web-dev`    | Web Dev       | Webflow, vanilla JS — implementation, debugging, verification            |
| `workflows-code--full-stack` | Multi-Stack   | Go, Node.js, React, React Native, Swift — auto-detected via marker files |
| `workflows-code--opencode`   | System Code   | TypeScript, Python, Shell for MCP servers and scripts                    |
| `workflows-documentation`    | Docs          | Document quality scoring, skill creation, install guides                 |
| `workflows-git`              | Git           | Commits, branches, PRs, worktrees                                        |
| `workflows-chrome-devtools`  | Browser       | DevTools automation, screenshots, debugging                              |
| `mcp-code-mode`              | Integrations  | External tools via Code Mode (Figma, GitHub, ClickUp)                    |
| `mcp-figma`                  | Design        | Figma file access, components, styles, comments                          |

#### Auto-Detection

`skill_advisor.py` analyzes your request keywords against skill triggers. Confidence >= 0.8 means the skill is loaded automatically — you don't need to ask. Multi-stack detection works via marker files: `go.mod` -> Go patterns, `Package.swift` -> Swift patterns, `next.config.js` -> React patterns.

---

### Commands

One prompt. Twelve steps. Zero manual overhead.

19 slash commands across 4 categories. Each command encodes a multi-step workflow — one prompt replaces a dozen manual steps.

#### Why Commands Beat Free-Form Prompts

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

#### spec_kit/ (7 commands)

All `spec_kit` commands support `:auto` (execute without pausing) and `:confirm` (pause at each step) mode suffixes.

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `/spec_kit:complete`  | Full workflow: spec -> plan -> implement -> verify     |
| `/spec_kit:plan`      | Planning only, no implementation                       |
| `/spec_kit:implement` | Execute an existing plan                               |
| `/spec_kit:research`  | Technical investigation with evidence gathering        |
| `/spec_kit:resume`    | Continue a previous session (auto-loads memory)        |
| `/spec_kit:debug`     | Delegate debugging to a fresh-perspective sub-agent    |
| `/spec_kit:handover`  | Create session handover (`:quick` or `:full` variants) |

#### memory/ (5 commands)

| Command            | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `/memory:context`  | Unified retrieval with intent-aware routing                   |
| `/memory:save`     | Save context via `generate-context.js`                        |
| `/memory:continue` | Session recovery from crash or compaction                     |
| `/memory:learn`    | Explicit learning capture (`correct` subcommand for mistakes) |
| `/memory:manage`   | Database ops: stats, health, cleanup, checkpoints             |

#### create/ (6 commands)

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `/create:agent`           | Scaffold a new agent definition              |
| `/create:skill`           | Scaffold a new skill with structure          |
| `/create:skill_asset`     | Create a skill asset file                    |
| `/create:skill_reference` | Create a skill reference file                |
| `/create:install_guide`   | Generate a 5-phase install guide             |
| `/create:folder_readme`   | AI-optimized README.md with proper structure |

#### Utility (1 command)

| Command         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `/agent_router` | Route requests to AI Systems with full System Prompt identity adoption |

---

## 5. ⚙️ CONFIGURATION

### Configuration File

**Location**: `opencode.json` (project root)

The configuration file defines 3 MCP servers and their settings:

```json
{
  "mcpServers": {
    "sequential-thinking": { "..." },
    "spec_kit_memory": { "..." },
    "code-mode": { "..." }
  }
}
```

### Embedding Providers

The memory system auto-detects available API keys and selects the best provider. Your code never leaves your machine unless you explicitly choose a cloud provider.

| Provider      | Dimensions | Requirements     | Best For                                  |
| ------------- | ---------- | ---------------- | ----------------------------------------- |
| **Voyage AI** | 1024       | `VOYAGE_API_KEY` | Recommended — best retrieval quality      |
| **OpenAI**    | 1536/3072  | `OPENAI_API_KEY` | Cloud-based alternative                   |
| **HF Local**  | 768        | Node.js only     | Privacy, offline, free — default fallback |

```bash
# Voyage provider (recommended)
export VOYAGE_API_KEY=pa-...

# OpenAI provider (alternative)
export OPENAI_API_KEY=sk-proj-...

# Force HF local (even with API keys set)
export EMBEDDINGS_PROVIDER=hf-local
```

**Privacy note:** HF Local runs embeddings entirely on your machine. No external API calls. Works fully offline. This is the default if no API keys are set.

### MCP Servers

| Server                  | Purpose                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| **Sequential Thinking** | Structured multi-step reasoning for complex problems                  |
| **Spec Kit Memory**     | 22-tool cognitive memory system (the memory engine)                   |
| **Code Mode**           | External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools) |

See individual install guides in [`.opencode/install_guides/`](.opencode/install_guides/) for setup details and install scripts.

---

## 6. 💡 USAGE EXAMPLES

Real workflows, not toy examples.

### Common Workflow Patterns

| Task                       | Command / Action                  | What Happens                                                  |
| -------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Start a documented feature | `/spec_kit:complete "add auth"`   | Creates spec folder, templates, implements, verifies          |
| Plan without implementing  | `/spec_kit:plan "refactor API"`   | Creates spec + plan, stops before code changes                |
| Resume previous work       | `/spec_kit:resume`                | Loads memory context, shows where you left off                |
| Save session context       | `/memory:save`                    | Extracts context via `generate-context.js`, indexes it        |
| Search past decisions      | `/memory:context "auth approach"` | Semantic search across all saved memories                     |
| Debug a stuck issue        | `/spec_kit:debug`                 | Spawns fresh-perspective sub-agent with model selection       |
| Hand off to next session   | `/spec_kit:handover`              | Creates continuation doc (`:quick` = 15 lines, `:full` = 150) |
| Create a new skill         | `/create:skill my-skill`          | Scaffolds complete skill structure with templates             |

### End-to-End Example: Feature Development

```bash
# 1. Start with a plan
/spec_kit:plan "add rate limiting to API"
# -> Creates specs/043-rate-limiting/ with spec.md and plan.md

# 2. Review and approve the plan, then implement
/spec_kit:implement
# -> Follows plan.md, creates code, runs verification

# 3. Save context for future reference
/memory:save
# -> Extracts decisions, blockers, progress into memory/

# 4. Next week, pick up where you left off
/spec_kit:resume
# -> Loads memories, shows checklist status, continues
```

### End-to-End Example: Debugging

```bash
# After 3+ failed attempts at fixing an issue:
/spec_kit:debug
# -> Prompts: "Select model: Opus / Sonnet / Gemini"
# -> Dispatches @debug agent with 4-phase methodology
# -> Observe -> Analyze -> Hypothesize -> Fix
# -> Fresh perspective, no prior assumptions
```

---

## 7. 🛠️ TROUBLESHOOTING

Something broken? Start here.

### Common Issues

#### Memory MCP server won't start

**Symptom**: OpenCode shows "MCP server failed to connect" for `spec_kit_memory`

**Cause**: TypeScript hasn't been compiled to `dist/`

**Solution**:
```bash
cd .opencode/skill/system-spec-kit
npm install && npm run build
```

#### `/memory:save` fails with "generate-context.js not found"

**Symptom**: Error when saving context

**Cause**: Build step was skipped — `scripts/dist/` doesn't exist

**Solution**:
```bash
cd .opencode/skill/system-spec-kit && npm run build
```

#### Skills not loading automatically

**Symptom**: AI doesn't load relevant skill for your task

**Cause**: `skill_advisor.py` confidence below 0.8, or OpenCode version too old

**Solution**:
```bash
# Check OpenCode version (need v1.0.190+)
opencode --version

# Manually invoke a skill if needed
# Ask: "Load the workflows-git skill"
```

### Quick Fixes

| Problem                      | Quick Fix                                                      |
| ---------------------------- | -------------------------------------------------------------- |
| MCP server won't start       | `cd .opencode/skill/system-spec-kit && npm run build`          |
| Stale memory results         | `/memory:manage cleanup`                                       |
| Spec folder validation fails | Check exit code: 0=pass, 1=warning, 2=error                    |
| Embedding dimension mismatch | Each provider uses its own SQLite DB — switch providers safely |
| Context window full          | `/memory:continue` for session recovery                        |

### Diagnostic Commands

```bash
# Check memory system health
/memory:manage health

# View memory statistics
/memory:manage stats

# Verify MCP server is running (inside OpenCode)
# Look for "spec_kit_memory" in the status bar

# Test build
cd .opencode/skill/system-spec-kit && npm run test:cli
```

---

## 8. ❓ FAQ

### General Questions

**Q: Do I need API keys to use the memory system?**

A: No. HuggingFace Local runs entirely on your machine with no API keys needed. It's the default fallback. Voyage AI and OpenAI are optional upgrades for better retrieval quality.

---

**Q: Can I use this with my existing project?**

A: Yes. Copy `.opencode/`, `opencode.json`, and `AGENTS.md` to your project root. The system adapts to your codebase — it doesn't impose a project structure.

---

**Q: How is this different from Cursor's memory or Copilot's context?**

A: Those are session-scoped. This system persists across sessions, models, and even projects. It uses causal graphs to trace decision lineage, cognitive tiers to prioritize relevance, and ANCHOR format for 93% token savings. It's also local-first — your code stays on your machine.

---

**Q: Is this overkill for solo developers?**

A: You might think so — until you lose 3 hours re-debugging an issue you already solved last month. Solo developers arguably benefit *more* because there's no team to ask "hey, why did we do it this way?" The memory system is your institutional knowledge.

---

**Q: What happens if my session crashes mid-work?**

A: Run `/memory:continue`. The system auto-recovers from compaction events, timeouts, and crashes by loading the most recent memory context. Your work isn't lost — it's saved in the spec folder and memory system.

---

### Technical Questions

**Q: What database does the memory system use?**

A: SQLite with the `sqlite-vec` extension for vector operations. Each embedding provider+model+dimension combination gets its own database file to prevent dimension mismatches.

---

**Q: Can I switch embedding providers without losing data?**

A: Each provider uses a separate database, so switching is safe. Your old embeddings remain intact. Re-index with `memory_index_scan` if you want to regenerate embeddings with a new provider.

---

**Q: How do I create a custom skill?**

A: Run `/create:skill my-skill-name` or use the init script:

```bash
python3 .opencode/skill/workflows-documentation/scripts/init_skill.py my-skill
```

Skills are auto-discovered from `.opencode/skill/*/SKILL.md` — no plugin registration needed.

---

**Q: How much disk space does the memory system use?**

A: Minimal. SQLite databases are compact. A project with 100+ memories typically uses under 50MB including embeddings. The HF Local model downloads on first use (~130MB) and is cached for subsequent runs.

---

## 9. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document                                                                             | Purpose                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                                                               | Complete gate system, confidence framework, operational protocols |
| [Install Guides](.opencode/install_guides/README.md)                                 | MCP servers, skill creation, agent configuration                  |
| [Spec Kit README](.opencode/skill/system-spec-kit/README.md)                         | Full memory system and documentation framework reference          |
| [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP%20-%20AGENTS.md)                | Detailed AGENTS.md configuration guide                            |
| [SET-UP - Skill Creation](.opencode/install_guides/SET-UP%20-%20Skill%20Creation.md) | Custom skill creation walkthrough                                 |

### External Resources

| Resource                                                                              | Description                                          |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [OpenCode](https://github.com/sst/opencode)                                           | The AI coding assistant that powers this environment |
| [GitHub Issues](https://github.com/MichelKerkmeester/opencode-dev-environment/issues) | Report bugs and request features                     |

---

**License:** See [LICENSE](LICENSE) for details.
