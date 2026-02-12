<div align="left">

# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/releases)

</div>

A development environment for [OpenCode](https://github.com/sst/opencode) that adds what AI coding assistants lack: persistent memory that understands *meaning*, enforced documentation on every change, and a network of specialized agents that coordinate complex workflows. Two custom-built systems — a cognitive memory MCP server and a spec-kit documentation framework — turn stateless AI sessions into a continuous, searchable development history.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session, losing decisions to chat history, and hoping documentation happens "later."

---

#### TABLE OF CONTENTS

1. [Quick Start](#1-quick-start)
2. [Architecture Overview](#2-architecture-overview)
3. [The Memory Engine](#3-the-memory-engine)
4. [The Agent Network](#4-the-agent-network)
5. [The Gate System](#5-the-gate-system)
6. [Spec Kit Documentation](#6-spec-kit-documentation)
7. [Skills Library](#7-skills-library)
8. [Commands](#8-commands)
9. [Installation](#9-installation)
10. [What's Next](#10-whats-next)

---

## 1. Quick Start

**Prerequisites:** [OpenCode](https://github.com/sst/opencode) (v1.0.190+), Node.js (v18+)

```bash
# Clone the environment
git clone https://github.com/MichelKerkmeester/opencode-dev-environment.git
cd opencode-dev-environment

# Build the Memory MCP server (TypeScript → dist/)
cd .opencode/skill/system-spec-kit && npm install && npm run build && cd ../../..

# Launch OpenCode
opencode
```

Once inside OpenCode, try your first documented feature:

```
/spec_kit:complete "add user authentication"
```

This creates a spec folder (`specs/042-add-user-authentication/`) with templates, kicks off implementation, and enforces quality gates along the way. When you're done, save your session context:

```
/memory:save
```

You just created a documented, searchable, recoverable development session. Next time you pick this up — even weeks later — your AI assistant remembers where you left off.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      YOUR REQUEST                            │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  GATE SYSTEM (3 mandatory gates)                             │
│  Gate 1: Understanding ─► Gate 2: Skill Routing ─► Gate 3:  │
│  Context surfacing        Auto-load expertise      Spec      │
│  Dual-threshold           skill_advisor.py         folder    │
│  validation               confidence ≥ 0.8        HARD BLOCK │
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

---

## 3. The Memory Engine

This is the crown jewel. A custom MCP server that gives your AI assistant persistent, searchable, *cognitive* memory across sessions. Not a wrapper around existing tools — this is purpose-built for AI-assisted development with 22 MCP tools organized across 7 architectural layers.

### 22 Tools Across 7 Layers

| Layer | Tools | Purpose | Token Budget |
|-------|-------|---------|--------------|
| **L1** Orchestration | `memory_context` | Unified entry with intent-aware routing | 2,000 |
| **L2** Core | `memory_search`, `memory_match_triggers`, `memory_save` | Semantic search, fast keyword matching (<50ms), file indexing | 1,500 |
| **L3** Discovery | `memory_list`, `memory_stats`, `memory_health` | Browse, statistics, health checks | 800 |
| **L4** Mutation | `memory_update`, `memory_delete`, `memory_validate` | Update metadata, delete, record feedback | 500 |
| **L5** Checkpoints | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` | Save/restore memory state (undo button for your index) | 600 |
| **L6** Analysis | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | Epistemic tracking, causal graphs | 1,200 |
| **L7** Maintenance | `memory_index_scan`, `memory_get_learning_history` | Bulk indexing, learning trends | 1,000 |

### Cognitive Memory

Inspired by biological working memory, the system implements 8 cognitive subsystems that go far beyond simple vector storage:

**HOT / WARM / COLD Tiers** — Memories are classified by attention score. HOT memories (score >= 0.8) return full content. WARM memories (0.25-0.79) return summaries only. COLD memories (< 0.25) are suppressed — they exist but don't clutter your context.

**Attention Decay** — Every memory's score decays with each conversation turn:

```
new_score = current_score × (decay_rate ^ turns_elapsed)
```

Constitutional-tier memories never decay. Normal memories fade at 0.80 per turn. Temporary memories fade fast at 0.60 per turn. This mimics how human working memory naturally prioritizes recent, relevant information.

**Spreading Activation** — When a primary memory is activated, related memories receive a 0.35 score boost automatically. You search for "authentication" and the system co-activates memories about JWT tokens, OAuth setup, and session management — context you didn't ask for but need.

**FSRS Scheduler** — The Free Spaced Repetition Scheduler optimizes review intervals. Memories that prove useful are scheduled for more frequent surfacing; unused ones decay faster.

**Prediction Error Gating** — New information is weighted by how surprising it is. Expected content gets lower priority; novel discoveries get amplified.

### Causal Memory Graph

Every decision has a lineage. The causal graph tracks 6 relationship types between memories:

| Relationship | Example |
|-------------|---------|
| `caused` | "JWT decision" → caused → "token refresh implementation" |
| `enabled` | "OAuth2 setup" → enabled → "social login feature" |
| `supersedes` | "v2 auth flow" → supersedes → "v1 auth flow" |
| `contradicts` | "stateless approach" → contradicts → "session storage proposal" |
| `derived_from` | "rate limiter config" → derived from → "load testing results" |
| `supports` | "performance benchmarks" → supports → "caching decision" |

Use `memory_drift_why` to trace why a decision was made — it traverses the causal chain up to N hops, grouping results by relationship type. Six months from now, you won't be guessing why you chose JWT over sessions.

### Hybrid Search

Finding the right memory uses four complementary strategies fused together:

- **Vector similarity** — semantic meaning via embeddings (Voyage AI, OpenAI, or HuggingFace Local)
- **BM25** — term-frequency ranking for keyword precision
- **Full-Text Search (FTS5)** — SQLite's native text search for exact matches
- **RRF fusion** — Reciprocal Rank Fusion combines all three ranking signals
- **Cross-encoder reranking** — optional second-pass reranking for maximum relevance

### Learning Metrics

Track what your AI assistant actually *learned*, not just what it did:

```
Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
```

`task_preflight()` captures baseline scores before work starts. `task_postflight()` captures results after. The delta reveals whether a session produced genuine learning or just executed known patterns.

### The Details That Matter

- **6 importance tiers**: constitutional (always surfaces, never decays) → critical → important → normal → temporary → deprecated (hidden but preserved)
- **Session deduplication**: Hash-based tracking prevents re-sending the same memory twice per session (~50% token savings on follow-up queries)
- **ANCHOR format**: Section-level extraction from memory files delivers 93% token savings vs. loading full files
- **4 embedding providers**: Voyage AI (recommended, best retrieval), OpenAI (cloud alternative), HuggingFace Local (free, offline, default fallback), auto-detection based on available API keys
- **Checkpoints**: Snapshot and restore your entire memory index — an undo button for your knowledge base

---

## 4. The Agent Network

Ten specialized agents handle different aspects of development. Two are built into OpenCode; eight are custom agents defined in `.opencode/agent/`.

| Agent | Type | Role |
|-------|------|------|
| `@general` | Built-in | Implementation, complex coding tasks |
| `@explore` | Built-in | Quick codebase exploration, file discovery |
| `@orchestrate` | Custom | Multi-agent coordination with enterprise patterns |
| `@context` | Custom | Context retrieval and synthesis for other agents |
| `@research` | Custom | Evidence gathering, technical investigation |
| `@speckit` | Custom | Spec folder creation (exclusive: only agent that writes spec docs) |
| `@write` | Custom | Documentation generation (READMEs, skills, guides) |
| `@review` | Custom | Code review with pattern validation (READ-ONLY) |
| `@debug` | Custom | Fresh-perspective debugging, root cause analysis |
| `@handover` | Custom | Session continuation, context preservation |

### Enterprise Orchestration

The `@orchestrate` agent implements patterns borrowed from distributed systems:

- **Circuit Breaker** — Isolates failing agents (3 failures → OPEN state, 60s cooldown)
- **Saga Compensation** — Reverse-order rollback when multi-task workflows fail
- **Quality Gates** — Pre/mid/post execution scoring with 70-point threshold
- **Resource Budgeting** — Token budget management (50K default, 80% warning, 100% halt)
- **Conditional Branching** — IF/THEN/ELSE logic with 3-level nesting
- **Checkpointing** — Recovery snapshots every 5 tasks or 10 tool calls
- **Context Window Budget (CWB)** — Tracks cumulative context consumption across delegated tasks
- **Sub-Orchestrator Pattern** — Delegates complex sub-workflows to nested orchestrators

### How Agents Get Chosen

Agent selection follows clear rules: `@research` for investigation, `@speckit` for spec documentation (exclusively — no other agent may write spec template files), `@debug` when you're stuck 3+ attempts, `@review` for code quality evaluation, `@orchestrate` for anything requiring multi-agent coordination.

### Fresh-Perspective Debugging

The `@debug` agent uses a 4-phase methodology — Observe → Analyze → Hypothesize → Fix — and *intentionally starts with no prior context*. When you've been staring at the same error for an hour, a fresh perspective with no assumptions is exactly what you need. Trigger it with `/spec_kit:debug`, select your preferred model, and the agent starts from scratch.

---

## 5. The Gate System

Every request passes through mandatory gates before the AI touches a file. This is what makes the framework *enforced*, not suggested.

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

### Analysis Lenses

Six lenses the AI applies silently to catch problems before they happen:

| Lens | Catches |
|------|---------|
| **CLARITY** | Over-abstraction, unearned complexity |
| **SYSTEMS** | Missed dependencies, side effects |
| **BIAS** | Solving symptoms instead of root causes |
| **SUSTAINABILITY** | Future maintenance nightmares |
| **VALUE** | Cosmetic changes disguised as improvements |
| **SCOPE** | Solution complexity exceeding problem size |

### Auto-Detected Anti-Patterns

Six anti-patterns are flagged automatically when the AI detects trigger phrases:

| Pattern | Trigger | Response |
|---------|---------|----------|
| Over-engineering | "future-proof", "might need" | "Is this solving a current problem or a hypothetical one?" |
| Premature optimization | "could be slow" | "Has this been measured?" |
| Cargo culting | "best practice", "always should" | "Does this pattern fit this specific case?" |
| Gold-plating | "while we're here" | "That's outside current scope. Track separately?" |
| Wrong abstraction | "DRY this up" (2 instances) | "Similar code isn't always the same concept." |
| Scope creep | "also add", "bonus feature" | "That's a separate change." |

---

## 6. Spec Kit Documentation

Every feature leaves a trail. Not for bureaucracy — for your future self, your team, and the AI that picks up where you left off.

### Four Documentation Levels

| Level | Required Files | When |
|-------|---------------|------|
| **1** | spec.md, plan.md, tasks.md, implementation-summary.md | All features (<100 LOC) |
| **2** | Level 1 + checklist.md | QA needed (100-499 LOC) |
| **3** | Level 2 + decision-record.md | Architecture changes (500+ LOC) |
| **3+** | Level 3 + AI protocols, extended checklist | Multi-agent, enterprise governance |

When in doubt, go one level higher.

### CORE + ADDENDUM Templates (v2.2)

70+ templates use a composition model — CORE templates are shared across levels, and level-specific ADDENDUM templates extend them. Update CORE once and all levels inherit the change. Zero content duplication.

```
Level 1:  [CORE templates]                    → 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       → 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  → 6 files
Level 3+: [CORE] + [all addendums]             → 6+ files
```

### Validation System

13 pluggable validation rules run via `validate.sh` before any spec folder can be marked complete. Rules check for required files, unfilled placeholders, valid anchors, correct folder naming, frontmatter integrity, complexity-level alignment, and more. Exit code 0 = pass. Exit code 2 = must fix.

### Memory Integration

Memory files live *inside* spec folders at `specs/###-feature/memory/`. Saves are enforced via `generate-context.js` (never manual file creation). Sub-folder versioning (`001/`, `002/`, `003/`) gives each version independent memory context. `/memory:continue` auto-loads relevant memories when resuming work.

---

## 7. Skills Library

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the `workflows-git` skill and already knows your conventions.

### Available Skills (9)

| Skill | Domain | Purpose |
|-------|--------|---------|
| `system-spec-kit` | Documentation | Spec folders, templates, memory integration, context preservation |
| `workflows-code--web-dev` | Web Dev | Webflow, vanilla JS — implementation, debugging, verification |
| `workflows-code--full-stack` | Multi-Stack | Go, Node.js, React, React Native, Swift — auto-detected via marker files |
| `workflows-code--opencode` | System Code | TypeScript, Python, Shell for MCP servers and scripts |
| `workflows-documentation` | Docs | Document quality scoring, skill creation, install guides |
| `workflows-git` | Git | Commits, branches, PRs, worktrees |
| `workflows-chrome-devtools` | Browser | DevTools automation, screenshots, debugging |
| `mcp-code-mode` | Integrations | External tools via Code Mode (Figma, GitHub, ClickUp) |
| `mcp-figma` | Design | Figma file access, components, styles, comments |

### Auto-Detection

`skill_advisor.py` analyzes your request keywords against skill triggers. Confidence >= 0.8 means the skill is loaded automatically — you don't need to ask. Multi-stack detection works via marker files: `go.mod` → Go patterns, `Package.swift` → Swift patterns, `next.config.js` → React patterns.

---

## 8. Commands

19 slash commands across 4 categories. Each command encodes a multi-step workflow — one prompt replaces a dozen manual steps. All `spec_kit` commands support `:auto` (execute without pausing) and `:confirm` (pause at each step) mode suffixes.

### spec_kit/ (7 commands)

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full workflow: spec → plan → implement → verify |
| `/spec_kit:plan` | Planning only, no implementation |
| `/spec_kit:implement` | Execute an existing plan |
| `/spec_kit:research` | Technical investigation with evidence gathering |
| `/spec_kit:resume` | Continue a previous session (auto-loads memory) |
| `/spec_kit:debug` | Delegate debugging to a fresh-perspective sub-agent |
| `/spec_kit:handover` | Create session handover (`:quick` or `:full` variants) |

### memory/ (5 commands)

| Command | Purpose |
|---------|---------|
| `/memory:context` | Unified retrieval with intent-aware routing |
| `/memory:save` | Save context via `generate-context.js` |
| `/memory:continue` | Session recovery from crash or compaction |
| `/memory:learn` | Explicit learning capture (`correct` subcommand for mistakes) |
| `/memory:manage` | Database ops: stats, health, cleanup, checkpoints |

### create/ (6 commands)

| Command | Purpose |
|---------|---------|
| `/create:agent` | Scaffold a new agent definition |
| `/create:skill` | Scaffold a new skill with structure |
| `/create:skill_asset` | Create a skill asset file |
| `/create:skill_reference` | Create a skill reference file |
| `/create:install_guide` | Generate a 5-phase install guide |
| `/create:folder_readme` | AI-optimized README.md with proper structure |

**Utility** (1 command):

| Command | Purpose |
|---------|---------|
| `/agent_router` | Route requests to AI Systems with full System Prompt identity adoption |

---

## 9. Installation

### Quick Setup

```bash
# Clone
git clone https://github.com/MichelKerkmeester/opencode-dev-environment.git
cd opencode-dev-environment

# Build the Memory MCP server
cd .opencode/skill/system-spec-kit && npm install && npm run build && cd ../../..

# Copy to your project (or use this repo directly)
cp -r .opencode /path/to/your-project/
cp opencode.json AGENTS.md /path/to/your-project/

# Launch
cd /path/to/your-project && opencode
```

**Embedding providers:** The memory system auto-detects available API keys. If `VOYAGE_API_KEY` is set, it uses Voyage AI (best quality). If `OPENAI_API_KEY` is set, it uses OpenAI. Otherwise, HuggingFace Local runs entirely on your machine — free, offline, no API keys needed.

**Detailed setup:** See [`.opencode/install_guides/SET-UP - AGENTS.md`](.opencode/install_guides/SET-UP%20-%20AGENTS.md) for comprehensive configuration, provider setup, and MCP server installation scripts.

---

## 10. What's Next

### First Session Checklist

- [ ] Run `opencode` in your project directory
- [ ] Try `/spec_kit:complete "add-login"` to create your first documented feature
- [ ] Use `/memory:save` at session end to preserve context
- [ ] Start a new session and try `/memory:context "login"` — your AI remembers

### Going Deeper

- [Install guides](.opencode/install_guides/README.md) — MCP servers, skill creation, agent configuration
- [Spec Kit skill](.opencode/skill/system-spec-kit/README.md) — Full documentation framework reference
- [AGENTS.md](AGENTS.md) — Complete gate system, confidence framework, and operational protocols

### Contributing

Issues, ideas, and pull requests are welcome. Check [GitHub Issues](https://github.com/MichelKerkmeester/opencode-dev-environment/issues) for open items.

**License:** See [LICENSE](LICENSE) for details.
