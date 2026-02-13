<div align="left">

# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/releases)

</div>

> Universal AI assistant framework with spec-driven documentation, memory systems, and multi-agent orchestration.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

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

<!-- /ANCHOR:table-of-contents -->
## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is This?

AI coding assistants are powerful but they have amnesia. Every session starts from zero. You explain your auth system Monday — by Wednesday, it's a blank slate. Your architectural decisions? Lost in chat history. Documentation? "I'll do it later" (you won't).

Two custom-built systems fix this: a **cognitive memory MCP server** and a **spec-kit documentation framework** that turn stateless AI sessions into a continuous, searchable development history. Not a wrapper around existing tools. This is purpose-built for AI-assisted development.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session, losing decisions to chat history, and hoping documentation happens "later."

### Key Statistics

| Category         | Count | Details                                        |
| ---------------- | ----- | ---------------------------------------------- |
| MCP Tools        | 22    | Across 7 architectural layers (L1-L7)          |
| Test Files       | 118   | 3,988 tests, 0 TypeScript errors               |
| Scripts          | 78+   | 29 Shell, 49 TypeScript                        |
| Templates        | 70+   | CORE + ADDENDUM composition model (v2.2)       |
| Commands         | 19    | 7 spec_kit + 5 memory + 6 create + 1 utility   |
| Agents           | 10    | 8 custom + 2 built-in (`@general`, `@explore`) |
| Skills           | 9     | Domain expertise, auto-loaded by task keywords |
| Validation Rules | 13    | Pluggable, automated spec folder checks        |
| YAML Assets      | 13    | Command execution specifications               |

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
│  Sources: spec memory + READMEs + constitutional files        │
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

### Local-First Architecture

Your code never leaves your machine. The Memory Engine runs entirely on your local system — embeddings, vector search, SQLite storage, all local. No cloud dependency. No data transmission. Works fully offline with HuggingFace Local embeddings (default, free). Optional cloud providers (Voyage AI, OpenAI) are opt-in upgrades for better retrieval quality, but you choose what leaves your machine.

**Privacy by design**: Session context, decision history, architectural notes — everything stays in your workspace. The system respects your data sovereignty while delivering enterprise-grade memory capabilities.

### Innovations You Won't Find Elsewhere

| Innovation                | Impact                | Description                                                 |
| ------------------------- | --------------------- | ----------------------------------------------------------- |
| **Cognitive memory**      | Biologically-inspired | HOT/WARM/COLD with attention decay and spreading activation |
| **Causal memory graph**   | Decision tracing      | 6 relationship types answer "why" queries                   |
| **Constitutional tier**   | Rules never forgotten | Critical rules always surface, never decay                  |
| **ANCHOR retrieval**      | 93% token savings     | Section-level memory extraction, not full files             |
| **Session deduplication** | 50% token savings     | Hash-based duplicate prevention in same session             |
| **Proactive triggers**    | <50ms surfacing       | Context surfaces BEFORE you ask                             |
| **Intent-aware search**   | Smarter retrieval     | 5 intent types route to optimized search weights            |
| **Crash recovery**        | Zero lost work        | Auto-resume from compaction/timeout via `/memory:continue`  |
| **README indexing**       | Docs become memory    | Skill + project READMEs auto-indexed with tiered importance |
| **Parallel dispatch**     | 5-dimension scoring   | Complexity-based agent orchestration                        |
| **Debug delegation**      | Fresh perspective     | Model selection + 4-phase methodology                       |
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

### Recent Improvements

| Area                    | Change                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| **Anchor Coverage**     | ~473 anchor tags across 74 READMEs for precise section-level retrieval    |
| **SKILL.md Efficiency** | Core skill file reduced 34% through structural optimization               |
| **Command Quality**     | 19 commands + 13 YAML assets optimized for ≤600 lines, full agent routing |
| **README Standards**    | 75 READMEs aligned to `readme_template.md` (7 style rules)                |
| **Memory Commands**     | 5 memory command READMEs standardized for consistent documentation        |

---

<!-- /ANCHOR:overview -->
## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### Prerequisites

- [OpenCode](https://github.com/sst/opencode) v1.0.190+ (`opencode --version`)
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)

### 30-Second Setup

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode-dev-environment.git
cd opencode-dev-environment

# 2. Install and build the Memory Engine
cd .opencode/skill/system-spec-kit && npm install && npm run build && cd ../../..

# 3. Launch OpenCode
opencode
```

### Verify Installation

```bash
# Inside OpenCode, test the memory system
/memory:manage health
# Expected: "Status: healthy" with database stats

# Test skill routing
# Ask: "What skills are available?"
# Expected: 9 skills listed
```

---

<!-- /ANCHOR:quick-start -->
## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
.opencode/
├── agent/                    # 8 custom agent definitions
│   ├── orchestrate.md        # Multi-agent coordination
│   ├── context.md            # Context retrieval & synthesis
│   ├── speckit.md            # Spec documentation (exclusive)
│   └── ...                   # debug, research, write, review, handover
├── skill/                    # 9 domain skills
│   ├── system-spec-kit/      # Core: memory MCP server, templates, validation
│   ├── workflows-code--*/    # Code (web-dev, full-stack, opencode)
│   ├── workflows-git/        # Git workflow automation
│   └── ...                   # documentation, chrome-devtools, mcp-*
├── command/                  # 19 slash commands
│   ├── spec_kit/             # 7 commands + 13 YAML execution assets
│   ├── memory/               # 5 commands
│   └── create/               # 6 commands + 1 utility
├── install_guides/           # 10 setup guides (5-phase)
└── scripts/                  # Routing & automation

specs/                        # Spec folder documentation
├── ###-feature-name/         # Per-feature: spec, plan, tasks, checklist
│   ├── memory/               # Session context (auto-generated)
│   └── scratch/              # Temporary workspace
```

### Key Files

| File | Purpose |
|------|---------|
| `opencode.json` | MCP server configuration (3 servers) |
| `AGENTS.md` | Gate system, protocols, agent routing |
| `.opencode/skill/system-spec-kit/` | Memory engine + documentation framework |

---

<!-- /ANCHOR:structure -->
## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### The Memory Engine

> *Remember everything. Surface what matters. Keep it private.*

Your AI assistant forgets everything between sessions. You explain your auth system Monday — by Wednesday, it's a blank slate. You debug a tricky race condition Thursday — by next Tuesday, the same investigation starts from scratch.

The Memory Engine fixes this. A custom MCP server with 22 tools across 7 architectural layers gives your AI persistent, searchable, *cognitive* memory. Not a wrapper around existing tools — this is purpose-built for AI-assisted development.

#### MCP Tool Layers

22 tools organized across 7 architectural layers, each with enforced token budgets to prevent context bloat:

| Layer                | Tools                                                                                                                        | Purpose                                                       | Token Budget |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| **L1** Orchestration | `memory_context`                                                                                                             | Unified entry with intent-aware routing                       | 2,000        |
| **L2** Core          | `memory_search`, `memory_match_triggers`, `memory_save`                                                                      | Semantic search, fast keyword matching (<50ms), file indexing | 1,500        |
| **L3** Discovery     | `memory_list`, `memory_stats`, `memory_health`                                                                               | Browse, statistics, health checks                             | 800          |
| **L4** Mutation      | `memory_update`, `memory_delete`, `memory_validate`                                                                          | Update metadata, delete, record feedback                      | 500          |
| **L5** Checkpoints   | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`                                            | Save/restore memory state (undo button for your index)        | 600          |
| **L6** Analysis      | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | Epistemic tracking, causal graphs                             | 1,200        |
| **L7** Maintenance   | `memory_index_scan`, `memory_get_learning_history`                                                                           | Bulk indexing, learning trends                                | 1,000        |

The layered architecture enforces separation of concerns. Most agents interact only with L1-L2 (orchestration and core search). Mutation (L4) and lifecycle (L5) tools are reserved for explicit user actions. Analysis (L6) is invoked at task boundaries for learning measurement.

#### Cognitive Features

This isn't basic vector storage. Inspired by biological working memory, the system implements three cognitive subsystems that distinguish it from traditional RAG:

**Attention-Based Decay** — Memory relevance decays over time using `recency x frequency x importance` scoring. Every memory's score decays with each conversation turn:

```
new_score = current_score x (decay_rate ^ turns_elapsed)
```

| Tier            | Decay Rate | Behavior                              |
| --------------- | ---------- | ------------------------------------- |
| Constitutional  | 1.00       | Never decays, always surfaces         |
| Normal          | 0.80       | Gradual fade over conversation turns  |
| Temporary       | 0.60       | Fast fade, session-scoped             |

Recent, frequently-accessed, high-importance memories surface first. This mimics how human working memory naturally prioritizes relevant information.

**Tiered Content Injection** — Content delivery adapts to memory state, controlling how much context each memory contributes:

| Memory State | Score Range | Injection Behavior                  |
| ------------ | ----------- | ----------------------------------- |
| `HOT`        | >= 0.8      | Full content injected into context  |
| `WARM`       | 0.25 - 0.79 | Summary only                        |
| `COLD`       | < 0.25      | Trigger phrases only (suppressed)   |

This prevents cold memories from cluttering your context window while keeping them discoverable.

**Co-Activation (Spreading Activation)** — When a primary memory is activated, semantically related memories receive a 0.35 score boost automatically. You search for "authentication" and the system co-activates memories about JWT tokens, OAuth setup, and session management — surfacing contextual clusters rather than isolated results.

Two additional cognitive subsystems complement the core three:

- **FSRS Scheduler** — Free Spaced Repetition Scheduler optimizes review intervals. Useful memories surface more frequently; unused ones decay faster
- **Prediction Error Gating** — New information is weighted by how surprising it is. Expected content gets lower priority; novel discoveries get amplified

#### Hybrid Search Architecture

Finding the right memory isn't about keywords alone. Three search engines fuse together via Reciprocal Rank Fusion (RRF):

| Engine         | Method                    | Strength                                |
| -------------- | ------------------------- | --------------------------------------- |
| **Vector**     | Semantic similarity (embeddings) | Conceptual matching, paraphrase detection |
| **Keyword**    | BM25 term frequency       | Technical terms, code identifiers       |
| **Trigger**    | Exact phrase matching     | Precise recall for known patterns       |

Additional search capabilities layered on top:

- **Full-Text Search (FTS5)** — SQLite's native text search for exact substring matches
- **Cross-encoder reranking** — optional second-pass that re-scores top results for maximum relevance
- **4 embedding providers** — Voyage AI (recommended, best retrieval), OpenAI (cloud alternative), HuggingFace Local (free, offline, default fallback), auto-detection based on available API keys

**Intent-Aware Scoring** — Search weights adjust automatically for 5 task types:

| Task Intent      | Weight Adjustment                                     |
| ---------------- | ----------------------------------------------------- |
| `fix_bug`        | Boosts error history, debugging context               |
| `add_feature`    | Boosts implementation patterns, existing architecture |
| `understand`     | Balanced weights across all memory types              |
| `refactor`       | Boosts code structure, dependency information         |
| `security_audit` | Boosts security decisions, vulnerability context      |

#### Importance Tiers

6-tier system controlling memory visibility and decay behavior:

| Tier             | Weight | Behavior                                          |
| ---------------- | ------ | ------------------------------------------------- |
| `constitutional` | 1.0    | Always surfaces at top of results, never decays   |
| `critical`       | 0.9    | High priority, rarely decays                      |
| `important`      | 0.7    | Standard elevated priority                        |
| `normal`         | 0.5    | Default tier for most memories                    |
| `temporary`      | 0.3    | Session-scoped, fast decay                        |
| `deprecated`     | 0.1    | Retained for history but suppressed in results    |

Memories with high confidence and repeated validation feedback may be automatically promoted to critical tier. The `memory_validate` tool records usefulness feedback that drives this promotion.

#### ANCHOR Format

Structured content markers enabling selective retrieval with ~93% token savings:

```markdown
<!-- ANCHOR:decisions -->
Key architectural decisions for this spec...
<!-- /ANCHOR:decisions -->
```

Instead of loading entire memory files (~2,000 tokens), the system retrieves only the relevant anchor section (~150 tokens). Common anchors include `state`, `next-steps`, `decisions`, `blockers`, and `context`.

~473 anchor tags across 74 READMEs enable section-level extraction throughout the project. The `memory_search` tool accepts an `anchors` parameter to filter content to specific sections, and `memory_context` in `resume` mode uses anchors like `["state", "next-steps"]` for efficient session recovery.

#### Causal Memory Graph

Every decision has a lineage. Six months from now, you won't be guessing why you chose JWT over sessions — you'll *know*. The causal graph tracks 6 relationship types linking memories into a decision lineage graph:

| Relationship   | Direction | Example                                                           |
| -------------- | --------- | ----------------------------------------------------------------- |
| `caused`       | A -> B    | "JWT decision" -> caused -> "token refresh implementation"        |
| `derived_from` | A <- B    | "rate limiter config" -> derived from -> "load testing results"   |
| `supports`     | A -> B    | "performance benchmarks" -> supports -> "caching decision"        |
| `supersedes`   | A -> B    | "v2 auth flow" -> supersedes -> "v1 auth flow"                    |
| `enabled`      | A -> B    | "OAuth2 setup" -> enabled -> "social login feature"               |
| `contradicts`  | A <-> B   | "stateless approach" -> contradicts -> "session storage proposal" |

Use `memory_drift_why` to trace the causal chain up to N hops, grouping results by relationship type. `memory_causal_stats` reports coverage percentage (target: 60% of memories linked) and breakdown by relationship type.

#### Learning Metrics

Track what your AI assistant actually *learned*, not just what it did:

```
Learning Index = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)
```

`task_preflight()` captures baseline scores before work starts. `task_postflight()` captures results after. The delta reveals whether a session produced genuine learning or just executed known patterns. `memory_get_learning_history` shows trends across tasks within a spec folder.

#### Operational Details

- **Session deduplication**: Hash-based tracking prevents re-sending the same memory twice per session (~50% token savings on follow-up queries)
- **Checkpoints**: Snapshot and restore your entire memory index — an undo button for your knowledge base
- **Session recovery**: `/memory:continue` auto-loads relevant memories when resuming after compaction, timeout, or crash
- **Validation feedback**: `memory_validate` records whether memories were useful, adjusting confidence scores and enabling tier promotion

#### README Content Indexing

Documentation isn't separate from memory — it *is* memory. 75 READMEs follow a standardized template (7 style rules) with ~473 anchor tags for precise section-level retrieval. The indexing pipeline discovers and indexes content from four sources:

| Source                   | Discovery Method             | Importance Weight  | Example                                 |
| ------------------------ | ---------------------------- | ------------------ | --------------------------------------- |
| **Constitutional files** | `skill/*/constitutional/`    | 1.0 (never decays) | Critical rules, mandatory behaviors     |
| **Spec memory files**    | `specs/**/memory/*.md`       | 0.5                | Session context, decisions, blockers    |
| **Project READMEs**      | Root + directory READMEs     | 0.4                | Project overviews, directory navigation |
| **Skill READMEs**        | `skill/*/README.md` + nested | 0.3                | Skill documentation, reference guides   |

Tiered importance weights ensure user work (0.5) always outranks project documentation (0.4) and skill documentation (0.3) in search results. Constitutional content (1.0) always surfaces first and never decays.

The `memory_index_scan` tool accepts an `includeReadmes` parameter (default: `true`) to control whether README files are scanned. Set to `false` if you want to index only spec memory and constitutional files.

> Full reference: [MCP Server Documentation](.opencode/skill/system-spec-kit/mcp_server/README.md) | [Memory System Guide](.opencode/skill/system-spec-kit/README.md)

---

### The Agent Network

Without guardrails, AI assistants make assumptions instead of asking clarifying questions, skip documentation and lose context between sessions, claim completion without proper verification, and create technical debt through inconsistent approaches.

Ten specialized agents fix this. Two are built into OpenCode; eight are custom agents defined in `.opencode/agent/`.

| Agent          | Type     | Role                                                               |
| -------------- | -------- | ------------------------------------------------------------------ |
| `@general`     | Built-in | Implementation, complex coding tasks                               |
| `@orchestrate` | Custom   | Multi-agent coordination with enterprise patterns                  |
| `@context`     | Custom   | Context retrieval and synthesis for other agents                   |
| `@speckit`     | Custom   | Spec folder creation (exclusive: only agent that writes spec docs) |
| `@debug`       | Custom   | Fresh-perspective debugging, root cause analysis                   |
| `@research`    | Custom   | Evidence gathering, technical investigation                        |
| `@review`      | Custom   | Code review with pattern validation (READ-ONLY)                    |
| `@write`       | Custom   | Documentation generation (READMEs, skills, guides)                 |
| `@explore`     | Built-in | Quick codebase exploration, file discovery                         |
| `@handover`    | Custom   | Session continuation, context preservation                         |

#### Enterprise Orchestration

The `@orchestrate` agent implements patterns borrowed from distributed systems — the kind you'd expect in production infrastructure, not an AI coding assistant:

- **Context Window Budget (CWB)** — Tracks cumulative context consumption across delegated tasks with three collection patterns: Direct (full agent files), Summary (condensed agent cards), and File-based (path references only). Wave-based dispatching enables 10+ parallel agents without context overflow. Automatic context pressure detection switches collection modes when thresholds are reached.
- **Circuit Breaker** — Isolates failing agents (3 failures -> OPEN state, 60s cooldown)
- **Saga Compensation** — Reverse-order rollback when multi-task workflows fail
- **Quality Gates** — Pre/mid/post execution scoring with 70-point threshold
- **Resource Budgeting** — Token budget management (50K default, 80% warning, 100% halt)
- **Checkpointing** — Recovery snapshots every 5 tasks or 10 tool calls
- **Conditional Branching** — IF/THEN/ELSE logic with 3-level nesting
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
| **SYSTEMS**        | Missed dependencies, side effects          |
| **BIAS**           | Solving symptoms instead of root causes    |
| **SCOPE**          | Solution complexity exceeding problem size |
| **CLARITY**        | Over-abstraction, unearned complexity      |
| **VALUE**          | Cosmetic changes disguised as improvements |
| **SUSTAINABILITY** | Future maintenance nightmares              |

#### Auto-Detected Anti-Patterns

The system includes 24 pre-indexed anti-patterns with automatic detection and response suggestions. Patterns cover over-engineering, premature optimization, cargo culting, gold-plating, wrong abstraction, and scope creep. Each pattern has trigger phrases that activate silent detection during code review, surfacing concerns naturally without explicit pattern references.

The complete anti-pattern catalog is documented in `AGENTS.md` under Common Failure Patterns, with 6 core patterns shown below for reference:

| Pattern                | Trigger                          | Response                                                   |
| ---------------------- | -------------------------------- | ---------------------------------------------------------- |
| Scope creep            | "also add", "bonus feature"      | "That's a separate change."                                |
| Over-engineering       | "future-proof", "might need"     | "Is this solving a current problem or a hypothetical one?" |
| Gold-plating           | "while we're here"               | "That's outside current scope. Track separately?"          |
| Premature optimization | "could be slow"                  | "Has this been measured?"                                  |
| Cargo culting          | "best practice", "always should" | "Does this pattern fit this specific case?"                |
| Wrong abstraction      | "DRY this up" (2 instances)      | "Similar code isn't always the same concept."              |

---

### Spec Kit Documentation

Every feature you build should leave a trail. Not for bureaucracy — for your future self, your team, and the AI that picks up where you left off. Six months from now, you'll know exactly *why* you made that architectural decision.

#### Four Documentation Levels

The system scales documentation requirements based on change complexity. LOC thresholds are soft guidance — risk and architectural impact can override:

| Level  | LOC          | Required Files                                        | Use When                           |
| ------ | ------------ | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100         | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499      | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500         | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

When in doubt, go one level higher. Single typo/whitespace fixes (<5 characters in one file) are exempt.

#### CORE + ADDENDUM Template Architecture

**70+ templates** across the CORE + ADDENDUM v2.2 architecture use a composition model — CORE templates are shared across levels, and level-specific ADDENDUM templates extend them. Update CORE once and all levels inherit the change. Zero content duplication. Template versioning ensures backward compatibility.

```
Level 1:  [CORE templates]                    -> 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       -> 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  -> 6 files
Level 3+: [CORE] + [all addendums]             -> 6+ files
```

Key templates and their roles:

| Template                    | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `spec.md`                   | Feature scope, requirements, constraints (frozen)    |
| `plan.md`                   | Implementation approach and design decisions         |
| `tasks.md`                  | Ordered task breakdown with status tracking          |
| `checklist.md`              | QA validation items (P0/P1/P2 priority)              |
| `decision-record.md`        | Architectural decisions with rationale and trade-offs |
| `implementation-summary.md` | Post-implementation record of what was built         |

#### Scripts and Automation

**78+ automation scripts** (29 Shell, 49 TypeScript) power the documentation engine:

| Category               | Key Capabilities                                           |
| ---------------------- | ---------------------------------------------------------- |
| **Memory generation**  | Context preservation via `generate-context.js`             |
| **Document validation** | 13 pluggable rules via `validate.sh` (anchors, placeholders, frontmatter) |
| **Skill packaging**    | Bundling, dependency resolution, template scaffolding      |
| **Structure extraction** | Complexity scoring, folder analysis, template rendering   |

Validation runs before any spec folder can be marked complete. Exit code 0 = pass. Exit code 2 = must fix.

#### Commands

**19 commands** across 4 namespaces provide one-prompt access to multi-step workflows:

| Namespace  | Count | Examples                                                       |
| ---------- | ----- | -------------------------------------------------------------- |
| `spec_kit` | 7     | `/spec_kit:research`, `/spec_kit:debug`, `/spec_kit:handover`  |
| `memory`   | 5     | `/memory:save`, `/memory:continue`, `/memory:manage`           |
| `create`   | 6     | `/create:skill`, `/create:folder_readme`, `/create:install_guide` |
| `utility`  | 1     | `/check`                                                       |

Each command encodes a complete workflow — one prompt replaces a dozen manual steps. All `spec_kit` commands support `:auto` and `:confirm` mode suffixes.

#### Memory Integration

Memory files live *inside* spec folders at `specs/###-feature/memory/`. README files across the project are also indexed automatically (see [README Content Indexing](#readme-content-indexing) above). Saves are enforced via `generate-context.js` (never manual file creation). Sub-folder versioning (`001/`, `002/`, `003/`) gives each version independent memory context. `/memory:continue` auto-loads relevant memories when resuming work.

> Full reference: [System Spec Kit Documentation](.opencode/skill/system-spec-kit/README.md)

---

### Skills Library

Skills are domain expertise on demand. Instead of explaining "how to do git commits properly" every session, the AI loads the `workflows-git` skill and already knows your conventions. No repeating yourself. No inconsistent results.

#### Available Skills (9)

| Skill                        | Domain        | Purpose                                                                  |
| ---------------------------- | ------------- | ------------------------------------------------------------------------ |
| `system-spec-kit`            | Documentation | Spec folders, templates, memory integration, context preservation        |
| `workflows-code--full-stack` | Multi-Stack   | Go, Node.js, React, React Native, Swift — auto-detected via marker files |
| `workflows-code--web-dev`    | Web Dev       | Webflow, vanilla JS — implementation, debugging, verification            |
| `workflows-git`              | Git           | Commits, branches, PRs, worktrees                                        |
| `workflows-code--opencode`   | System Code   | TypeScript, Python, Shell for MCP servers and scripts                    |
| `workflows-documentation`    | Docs          | Document quality scoring, skill creation, install guides                 |
| `mcp-code-mode`              | Integrations  | External tools via Code Mode (Figma, GitHub, ClickUp)                    |
| `workflows-chrome-devtools`  | Browser       | DevTools automation, screenshots, debugging                              |
| `mcp-figma`                  | Design        | Figma file access, components, styles, comments                          |

#### Auto-Detection

`skill_advisor.py` analyzes your request keywords against skill triggers. Confidence >= 0.8 means the skill is loaded automatically — you don't need to ask.

**Multi-Stack Auto-Detection** (`workflows-code--full-stack`):

| Stack            | Category | Detection Marker                                | Example Patterns                  |
| ---------------- | -------- | ----------------------------------------------- | --------------------------------- |
| **Go**           | backend  | `go.mod`                                        | Domain layers, table-driven tests |
| **Node.js**      | backend  | `package.json` with "express"                   | Express routes, async/await       |
| **React**        | frontend | `next.config.js` or `package.json` with "react" | Server/Client components, hooks   |
| **React Native** | mobile   | `app.json` with "expo"                          | Navigation, hooks, platform APIs  |
| **Swift**        | mobile   | `Package.swift`                                 | SwiftUI, Combine, async/await     |

The skill checks for marker files at session start, loads stack-specific patterns from `references/{category}/{stack}/`, and auto-adjusts verification commands per stack. This enables unified workflows across any technology stack without manual configuration.

---

### Command Architecture

Commands are user-triggered workflows built on a two-layer architecture — markdown entry points that route to YAML execution engines.

**Layer 1: Entry Point (.md command file)** — The user-facing interface that collects input, presents setup requirements, defines the command's contract and purpose, shows workflow overview, then routes to the correct YAML execution asset.

**Layer 2: Execution Engine (.yaml asset file)** — Detailed behavioral specification with every step enumerated, validation gates, sub-agent prompt templates, circuit breakers, and error handling. The .md file always ends with explicit routing like: `"Load and execute: spec_kit_debug_auto.yaml"`.

**Two-Layer Separation**: The .md layer handles user interaction and setup; the .yaml layer handles execution logic and agent dispatch. This separation allows command definitions to stay readable while execution remains precise and auditable.

**Architecture by Numbers**:
- 19 total commands (7 spec_kit + 5 memory + 6 create + 1 utility)
- 13 YAML execution assets (all spec_kit commands have .yaml files)
- Memory commands are self-contained .md files only (no YAML layer)

**Why Commands Beat Free-Form Prompts**: One prompt. Twelve steps. Zero manual overhead. Each command encodes a multi-step workflow — one prompt replaces a dozen manual steps.

| Aspect            | Free-Form Prompts     | Commands               |
| ----------------- | --------------------- | ---------------------- |
| Step Memory       | You remember each     | Workflow baked in      |
| Interaction Count | 12 prompts for 12     | 1 prompt, 12 steps     |
| Enforcement       | No enforcement        | Gates prevent skipping |
| Skill Loading     | Manual skill loading  | Auto-loads what's needed |
| Quota Usage       | High quota usage      | Minimal quota cost     |

#### spec_kit/ (7 commands)

All `spec_kit` commands support `:auto` (execute without pausing) and `:confirm` (pause at each step) mode suffixes.

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `/spec_kit:complete`  | Full workflow: spec -> plan -> implement -> verify     |
| `/spec_kit:resume`    | Continue a previous session (auto-loads memory)        |
| `/spec_kit:debug`     | Delegate debugging to a fresh-perspective sub-agent    |
| `/spec_kit:plan`      | Planning only, no implementation                       |
| `/spec_kit:implement` | Execute an existing plan                               |
| `/spec_kit:research`  | Technical investigation with evidence gathering        |
| `/spec_kit:handover`  | Create session handover (`:quick` or `:full` variants) |

#### memory/ (5 commands)

| Command            | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `/memory:save`     | Save context via `generate-context.js`                        |
| `/memory:continue` | Session recovery from crash or compaction                     |
| `/memory:context`  | Unified retrieval with intent-aware routing                   |
| `/memory:learn`    | Explicit learning capture (`correct` subcommand for mistakes) |
| `/memory:manage`   | Database ops: stats, health, cleanup, checkpoints             |

#### create/ (6 commands)

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `/create:skill`           | Scaffold a new skill with structure          |
| `/create:agent`           | Scaffold a new agent definition              |
| `/create:folder_readme`   | AI-optimized README.md with proper structure |
| `/create:skill_asset`     | Create a skill asset file                    |
| `/create:skill_reference` | Create a skill reference file                |
| `/create:install_guide`   | Generate a 5-phase install guide             |

#### Utility (1 command)

| Command         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `/agent_router` | Route requests to AI Systems with full System Prompt identity adoption |

---

### Code Mode MCP

External tool integration via TypeScript execution. Instead of calling MCP tools natively (which loads all tool definitions into context upfront), Code Mode uses progressive disclosure: search for tools by task description, load only what's needed, execute in TypeScript with state persistence across operations.

**Progressive Tool Disclosure**:
1. `search_tools({ task_description: "webflow site management" })` — Discover relevant tools
2. `tool_info({ tool_name: "webflow.webflow_sites_list" })` — Get parameter details
3. `call_tool_chain({ code: "await webflow.webflow_sites_list({})" })` — Execute with TypeScript

**Performance Benefits**:
- **98.7% context reduction** — 1.6k tokens vs 141k for 47 tools exposed natively
- **60% faster execution** — Single API round-trip vs 15+ for chained operations
- **Type-safe invocation** — Full TypeScript support with autocomplete and error checking

**Supported Integrations**:
- **GitHub**: Issues, PRs, commits, repository operations
- **Figma**: Design file access, component extraction, team collaboration
- **Webflow**: Sites, collections, CMS management
- **ClickUp**: Task management, lists, workspaces
- **Chrome DevTools**: Live browser automation, screenshots, console logs, network inspection (via MCP fallback)

**Configuration**: `.utcp_config.json` defines available MCP servers. Tool naming convention: `{manual}.{manual}_{tool}()` (e.g., `webflow.webflow_sites_list({})`).

**When to Use**: ALL external tool integration (Webflow, Figma, GitHub, ClickUp). Code Mode is mandatory for MCP tool calls — never call these tools natively.

---

### Chrome DevTools Integration

Dual-mode browser debugging: CLI-first for speed and token efficiency, MCP fallback for multi-tool integration.

**CLI Approach (Priority)** — `browser-debugger-cli` (bdg):
- 300+ CDP methods across 53 Chrome DevTools domains
- Self-documenting discovery: `bdg cdp --list`, `--describe`, `--search`
- Unix composability: pipe output to `jq`, `grep`, standard tools
- Minimal token cost — command help is built-in

**MCP Approach (Fallback)** — Chrome DevTools via Code Mode:
- When CLI unavailable or multi-tool integration needed
- Isolated browser instances (`--isolated=true` flag)
- Parallel testing: compare production vs staging simultaneously
- Invocation: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`

**Common Operations**:
- **Screenshots**: `bdg dom screenshot output.png`
- **Console logs**: `bdg console --list | jq '.[] | select(.level == "error")'`
- **DOM queries**: `bdg dom query ".my-class"`
- **Network traces**: `bdg network har trace.har`
- **JavaScript execution**: `bdg dom eval "document.title"`

**CLI-First Philosophy**: CLI prioritized for lightweight debugging, single-tool operations, and token efficiency. MCP used when chaining browser operations with other external tools (e.g., capture screenshot → create ClickUp task → post to Webflow).

---

### Git Workflows

Three-phase workflow orchestration for professional git development — workspace setup, clean commits, and work completion.

**Phase 1: Workspace Setup** — Git worktrees for isolated development:
- Parallel work without branch juggling or stash chaos
- Short-lived temp branches, automatic cleanup after merge
- Directory isolation: `.worktrees/feature-name/`

**Phase 2: Clean Commits** — Conventional Commits with artifact filtering:
- Analyze changes, categorize by type (feat/fix/docs/refactor)
- Filter build artifacts (coverage/, dist/, node_modules/)
- Stage only public-value files with descriptive commit messages
- Format: `type(scope): description` (e.g., `feat(auth): add OAuth2 login`)

**Phase 3: Work Completion** — Merge, PR creation, and cleanup:
- Test verification gate (MANDATORY before integration)
- Four completion options: Merge locally, Create PR, Keep as-is, Discard
- Automated cleanup: Delete feature branches, remove worktrees
- PR templates with structured descriptions

**Branch Management**:
- Naming convention: `type/short-description` (e.g., `feat/add-auth`, `fix/login-bug`)
- Protected branch rules: Never force push to main/master
- Branch strategies: Feature branches, squash merges for clean history

**Integration**: Uses GitHub MCP (via Code Mode) for remote operations — create PRs, list issues, add comments, check CI status. Local git commands (via Bash) for commits, diffs, logs, merges.

---

### Extensibility

The framework is designed for adaptation. Every component — agents, skills, commands, templates — follows standardized patterns that make customization straightforward.

**Custom Skills** — Domain expertise packages loaded on demand:
- Create with `/create:skill my-skill` or `init_skill.py` script
- Auto-detected by `skill_advisor.py` based on keyword triggers
- Structured as SKILL.md (entry point) + references/ + assets/ + scripts/
- Examples: Stack-specific coding standards, tool integrations, workflow orchestrations

**Custom Agents** — Specialized AI personas with role boundaries:
- Scaffold with `/create:agent my-agent`
- Define behavioral constraints, tool access, delegation rules
- Integrate with gate system and multi-agent orchestration
- Examples: Project-specific reviewers, domain specialists, workflow coordinators

**Custom Commands** — Two-layer user-triggered workflows:
- Layer 1 (.md): User interface, input collection, routing logic
- Layer 2 (.yaml): Execution specification, agent prompts, validation gates
- Optimize to ≤600 lines for maintainability
- Examples: Project setup, deployment workflows, batch operations

**Template System** — CORE + ADDENDUM composition (v2.2):
- 70+ templates for spec folders, documentation, command structures
- CORE templates shared across levels, ADDENDUM extends per level
- Update once, inherit everywhere — zero content duplication
- Validation system ensures template compliance (13 pluggable rules)

**Philosophy**: "Convention over configuration" — templates provide structure, but you own the content. Swap embedding providers, add MCP servers, create domain skills, define custom agents. The framework adapts to your project, not the other way around.

---

<!-- /ANCHOR:features -->
## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

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
| **Spec Kit Memory**     | 22-tool cognitive memory system (the memory engine)                   |
| **Code Mode**           | External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools) |
| **Sequential Thinking** | Structured multi-step reasoning for complex problems                  |

See individual install guides in [`.opencode/install_guides/`](.opencode/install_guides/) for setup details and install scripts.

---

<!-- /ANCHOR:configuration -->
## 6. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

Real workflows, not toy examples.

### Common Workflow Patterns

| Task                       | Command / Action                  | What Happens                                                  |
| -------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Resume previous work       | `/spec_kit:resume`                | Loads memory context, shows where you left off                |
| Save session context       | `/memory:save`                    | Extracts context via `generate-context.js`, indexes it        |
| Start a documented feature | `/spec_kit:complete "add auth"`   | Creates spec folder, templates, implements, verifies          |
| Search past decisions      | `/memory:context "auth approach"` | Semantic search across all saved memories                     |
| Debug a stuck issue        | `/spec_kit:debug`                 | Spawns fresh-perspective sub-agent with model selection       |
| Plan without implementing  | `/spec_kit:plan "refactor API"`   | Creates spec + plan, stops before code changes                |
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

### Memory Workflow Examples

Practical examples of the 22 MCP memory tools in action.

Context retrieval at the start of a session:
```
memory_context({ input: "implementing dark mode toggle", mode: "auto" })
→ Auto-detects intent: "add_feature"
→ Returns: relevant prior work, decisions, patterns
```

Semantic search with full content embedding:
```
memory_search({ query: "authentication flow", specFolder: "005-auth", includeContent: true })
→ Returns: ranked results with full content embedded
→ Constitutional memories always appear first
```

Session deduplication for follow-up queries:
```
memory_search({ query: "auth patterns", sessionId: "sess-123", enableDedup: true })
→ Filters previously-sent memories → ~50% token savings on follow-ups
```

Causal tracing to understand decision lineage:
```
memory_drift_why({ memoryId: "42", direction: "incoming", maxDepth: 3 })
→ Traces: what caused this decision?
→ Returns: causal chain grouped by relationship type
```

Learning measurement with pre/post flight:
```
task_preflight({ specFolder: "specs/005-auth", taskId: "T1",
  knowledgeScore: 40, uncertaintyScore: 70, contextScore: 30 })
→ Records epistemic baseline

// ... after implementation ...

task_postflight({ specFolder: "specs/005-auth", taskId: "T1",
  knowledgeScore: 85, uncertaintyScore: 20, contextScore: 90 })
→ Learning Index: 0.78 (knowledge +45, uncertainty -50, context +60)
```

---

<!-- /ANCHOR:examples -->
## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

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
| Context window full          | `/memory:continue` for session recovery                        |
| Stale memory results         | `/memory:manage cleanup`                                       |
| Spec folder validation fails | Check exit code: 0=pass, 1=warning, 2=error                    |
| Embedding dimension mismatch | Each provider uses its own SQLite DB — switch providers safely |

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

<!-- /ANCHOR:troubleshooting -->
## 8. ❓ FAQ
<!-- ANCHOR:faq -->

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

<!-- /ANCHOR:faq -->
## 9. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document                                                                             | Purpose                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Spec Kit README](.opencode/skill/system-spec-kit/README.md)                         | Full memory system and documentation framework reference          |
| [AGENTS.md](AGENTS.md)                                                               | Complete gate system, confidence framework, operational protocols |
| [Install Guides](.opencode/install_guides/README.md)                                 | MCP servers, skill creation, agent configuration                  |
| [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP%20-%20AGENTS.md)                | Detailed AGENTS.md configuration guide                            |
| [SET-UP - Skill Creation](.opencode/install_guides/SET-UP%20-%20Skill%20Creation.md) | Custom skill creation walkthrough                                 |

### External Resources

| Resource                                                                              | Description                                          |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [OpenCode](https://github.com/sst/opencode)                                           | The AI coding assistant that powers this environment |
| [GitHub Issues](https://github.com/MichelKerkmeester/opencode-dev-environment/issues) | Report bugs and request features                     |

---

**License:** See [LICENSE](LICENSE) for details.
<!-- /ANCHOR:related -->
