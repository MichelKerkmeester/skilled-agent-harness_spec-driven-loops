<div align="left">

# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/releases)

</div>

> Your AI forgets everything between sessions. This one doesn't. A universal framework with cognitive memory, spec-driven documentation, and multi-agent orchestration — purpose-built for AI-assisted development.

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

AI coding assistants are powerful — but they have amnesia. Every session starts from zero. You explain your auth system Monday; by Wednesday, it's a blank slate. Architectural decisions? Lost in chat history. Documentation? "I'll do it later" (you won't).

Two custom-built systems fix this: a **cognitive memory MCP server** (29 tools across 7 layers) and a **spec-kit documentation framework** (84 templates, 4 levels) that turn stateless AI sessions into a continuous, searchable development history. Not a wrapper around existing tools — purpose-built for AI-assisted development.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session, losing decisions to chat history, and hoping documentation happens "later."

### Key Statistics

| Category         | Count | Details                                          |
| ---------------- | ----- | ------------------------------------------------ |
| MCP Servers      | 3     | Memory Engine, Code Mode, Sequential Thinking    |
| MCP Tools        | 29    | 22 memory (L1-L7) + 7 Code Mode                  |
| Agents           | 10    | 8 custom + 2 built-in (`@general`, `@explore`)   |
| Skills           | 9     | Domain expertise, auto-loaded by task keywords   |
| Commands         | 19    | 7 spec_kit + 5 memory + 6 create + 1 utility     |
| Templates        | 84    | CORE + ADDENDUM composition model (v2.2)         |
| YAML Assets      | 25    | 12 create + 13 spec_kit execution specifications |
| Validation Rules | 13    | Pluggable, automated spec folder checks          |
| Test Files       | 118   | 3,988 tests, 0 TypeScript errors                 |

### How It All Connects

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
│  validation               confidence >= 0.8        HARD BLOCK│
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
│  MEMORY ENGINE (29 MCP tools: 22 memory + 7 code mode)       │
│  Cognitive tiers ─ Causal graphs ─ Hybrid search             │
│  Sources: spec memory + READMEs + constitutional files        │
│  Embeddings: Voyage | OpenAI | HuggingFace Local (free)      │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SPEC KIT (documentation framework)                          │
│  specs/###-feature/  ─  memory/  ─  scratch/                 │
│  4 levels ─ 84 templates ─ 13 validation rules               │
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
| **Code Mode MCP**         | 98.7% token savings   | Progressive tool disclosure for external integrations       |
| **Parallel dispatch**     | 5-dimension scoring   | Complexity-based agent orchestration                        |
| **Debug delegation**      | Fresh perspective     | Model selection + 4-phase methodology                       |
| **Epistemic vectors**     | Smarter gates         | Dual-threshold: confidence AND uncertainty                  |
| **Session learning**      | Quantified growth     | Preflight/postflight tracks actual learning                 |
| **Template composition**  | Zero duplication      | CORE + ADDENDUM architecture (84 templates)                 |

### Requirements

| Requirement                                 | Minimum   | Recommended |
| ------------------------------------------- | --------- | ----------- |
| [OpenCode](https://github.com/sst/opencode) | v1.0.190+ | Latest      |
| Node.js                                     | v18+      | v20+        |
| npm                                         | v9+       | v10+        |

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
├── command/                  # 19 slash commands + 25 YAML assets
│   ├── spec_kit/             # 7 commands + 13 YAML execution assets
│   ├── memory/               # 5 commands
│   └── create/               # 6 commands + 12 YAML execution assets
├── install_guides/           # 10 setup guides (5-phase)
└── scripts/                  # Routing & automation

specs/                        # Spec folder documentation
├── ###-feature-name/         # Per-feature: spec, plan, tasks, checklist
│   ├── memory/               # Session context (auto-generated)
│   └── scratch/              # Temporary workspace
```

### Key Files

| File                               | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `opencode.json`                    | MCP server configuration (3 servers)    |
| `AGENTS.md`                        | Gate system, protocols, agent routing   |
| `.opencode/skill/system-spec-kit/` | Memory engine + documentation framework |

---

<!-- /ANCHOR:structure -->
## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

<details open>
<summary><strong>The Memory Engine</strong> — 22 MCP tools across 7 cognitive layers</summary>

<br>

> *Remember everything. Surface what matters. Keep it private.*

Your AI assistant forgets everything between sessions. The Memory Engine fixes this with a custom MCP server — 22 tools across 7 architectural layers giving your AI persistent, searchable, *cognitive* memory.

#### MCP Tool Layers

Each layer has enforced token budgets to prevent context bloat:

| Layer                | Tools                                                                                                                        | Purpose                                                       | Token Budget |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| **L1** Orchestration | `memory_context`                                                                                                             | Unified entry with intent-aware routing                       | 2,000        |
| **L2** Core          | `memory_search`, `memory_match_triggers`, `memory_save`                                                                      | Semantic search, fast keyword matching (<50ms), file indexing | 1,500        |
| **L3** Discovery     | `memory_list`, `memory_stats`, `memory_health`                                                                               | Browse, statistics, health checks                             | 800          |
| **L4** Mutation      | `memory_update`, `memory_delete`, `memory_validate`                                                                          | Update metadata, delete, record feedback                      | 500          |
| **L5** Checkpoints   | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`                                            | Save/restore memory state (undo button for your index)        | 600          |
| **L6** Analysis      | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` | Epistemic tracking, causal graphs                             | 1,200        |
| **L7** Maintenance   | `memory_index_scan`, `memory_get_learning_history`                                                                           | Bulk indexing, learning trends                                | 1,000        |

Most agents interact only with L1-L2. Mutation (L4) and lifecycle (L5) are reserved for explicit user actions. Analysis (L6) is invoked at task boundaries for learning measurement.

#### Cognitive Features

Not basic vector storage — inspired by biological working memory with three cognitive subsystems:

**Attention-Based Decay** — Memory relevance decays using `recency x frequency x importance` scoring:

```
new_score = current_score x (decay_rate ^ turns_elapsed)
```

| Tier           | Decay Rate | Behavior                             |
| -------------- | ---------- | ------------------------------------ |
| Constitutional | 1.00       | Never decays, always surfaces        |
| Normal         | 0.80       | Gradual fade over conversation turns |
| Temporary      | 0.60       | Fast fade, session-scoped            |

**Tiered Content Injection** — Content delivery adapts to memory state:

| Memory State | Score Range | Injection Behavior                 |
| ------------ | ----------- | ---------------------------------- |
| `HOT`        | >= 0.8      | Full content injected into context |
| `WARM`       | 0.25 - 0.79 | Summary only                       |
| `COLD`       | < 0.25      | Trigger phrases only (suppressed)  |

**Co-Activation (Spreading Activation)** — When a primary memory is activated, semantically related memories receive a 0.35 score boost. Search for "authentication" and the system co-activates memories about JWT tokens, OAuth setup, and session management.

Two additional subsystems: **FSRS Scheduler** (spaced repetition for review intervals) and **Prediction Error Gating** (novel discoveries amplified, expected content deprioritized).

#### Hybrid Search Architecture

Three search engines fuse via Reciprocal Rank Fusion (RRF):

| Engine      | Method                           | Strength                                  |
| ----------- | -------------------------------- | ----------------------------------------- |
| **Vector**  | Semantic similarity (embeddings) | Conceptual matching, paraphrase detection |
| **Keyword** | BM25 term frequency              | Technical terms, code identifiers         |
| **Trigger** | Exact phrase matching            | Precise recall for known patterns         |

Plus: FTS5 for exact substrings, cross-encoder reranking, and 4 embedding providers (Voyage AI, OpenAI, HuggingFace Local, auto-detection).

**Intent-Aware Scoring** — Weights adjust for 5 task types:

| Task Intent      | Weight Adjustment                                     |
| ---------------- | ----------------------------------------------------- |
| `fix_bug`        | Boosts error history, debugging context               |
| `add_feature`    | Boosts implementation patterns, existing architecture |
| `understand`     | Balanced weights across all memory types              |
| `refactor`       | Boosts code structure, dependency information         |
| `security_audit` | Boosts security decisions, vulnerability context      |

#### Importance Tiers

6-tier system controlling memory visibility and decay:

| Tier             | Weight | Behavior                                        |
| ---------------- | ------ | ----------------------------------------------- |
| `constitutional` | 1.0    | Always surfaces at top of results, never decays |
| `critical`       | 0.9    | High priority, rarely decays                    |
| `important`      | 0.7    | Standard elevated priority                      |
| `normal`         | 0.5    | Default tier for most memories                  |
| `temporary`      | 0.3    | Session-scoped, fast decay                      |
| `deprecated`     | 0.1    | Retained for history but suppressed in results  |

#### ANCHOR Format

Structured content markers enabling selective retrieval with ~93% token savings:

```markdown
<!-- ANCHOR:decisions -->
Key architectural decisions for this spec...
<!-- /ANCHOR:decisions -->
```

Instead of loading entire memory files (~2,000 tokens), the system retrieves only the relevant anchor section (~150 tokens). ~473 anchor tags across 74 READMEs enable section-level extraction throughout the project.

#### Causal Memory Graph

Every decision has a lineage. The causal graph tracks 6 relationship types:

| Relationship   | Direction | Example                                                           |
| -------------- | --------- | ----------------------------------------------------------------- |
| `caused`       | A -> B    | "JWT decision" -> caused -> "token refresh implementation"        |
| `derived_from` | A <- B    | "rate limiter config" -> derived from -> "load testing results"   |
| `supports`     | A -> B    | "performance benchmarks" -> supports -> "caching decision"        |
| `supersedes`   | A -> B    | "v2 auth flow" -> supersedes -> "v1 auth flow"                    |
| `enabled`      | A -> B    | "OAuth2 setup" -> enabled -> "social login feature"               |
| `contradicts`  | A <-> B   | "stateless approach" -> contradicts -> "session storage proposal" |

Use `memory_drift_why` to trace the causal chain up to N hops. `memory_causal_stats` reports coverage percentage (target: 60% of memories linked).

#### Learning Metrics

Track what your AI actually *learned*:

```
Learning Index = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)
```

`task_preflight()` captures baseline scores before work. `task_postflight()` captures results after. The delta reveals genuine learning vs. executing known patterns.

#### Operational Details

- **Session deduplication**: Hash-based tracking prevents re-sending memories (~50% token savings)
- **Checkpoints**: Snapshot and restore your memory index — an undo button for knowledge
- **Session recovery**: `/memory:continue` auto-loads memories after compaction, timeout, or crash
- **Validation feedback**: `memory_validate` records usefulness, adjusting confidence and tier promotion
- **README indexing**: 75 READMEs with ~473 anchors auto-indexed from 4 tiered sources (constitutional 1.0 > spec memory 0.5 > project READMEs 0.4 > skill READMEs 0.3)

> Full reference: [MCP Server Documentation](.opencode/skill/system-spec-kit/mcp_server/README.md) | [Memory System Guide](.opencode/skill/system-spec-kit/README.md)

</details>

---

<details>
<summary><strong>Code Mode MCP</strong> — 7 tools for external integrations with 98.7% context savings</summary>

<br>

External tool integration via TypeScript execution. Instead of loading all tool definitions into context upfront, Code Mode uses **progressive disclosure**: search for tools, load only what's needed, execute in TypeScript.

#### Code Mode Tools (7)

| Tool                         | Purpose                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| `search_tools`               | Discover relevant tools by task description                 |
| `tool_info`                  | Get complete tool parameters and TypeScript interface       |
| `call_tool_chain`            | Execute TypeScript code with access to all registered tools |
| `list_tools`                 | List all currently registered tool names                    |
| `register_manual`            | Register a new tool provider                                |
| `deregister_manual`          | Remove a tool provider                                      |
| `get_required_keys_for_tool` | Check required environment variables for a tool             |

#### Progressive Tool Disclosure

```typescript
// 1. Discover relevant tools
search_tools({ task_description: "webflow site management" })

// 2. Get parameter details
tool_info({ tool_name: "webflow.webflow_sites_list" })

// 3. Execute with TypeScript
call_tool_chain({ code: "await webflow.webflow_sites_list({})" })
```

#### Performance

| Metric             | Without Code Mode      | With Code Mode          |
| ------------------ | ---------------------- | ----------------------- |
| **Context tokens** | 141k (47 tools loaded) | 1.6k (on-demand)        |
| **Round trips**    | 15+ for chained ops    | 1 (TypeScript chain)    |
| **Type safety**    | None                   | Full TypeScript support |

**Supported Integrations**: GitHub (issues, PRs, commits), Figma (design files, components), Webflow (sites, CMS), ClickUp (tasks, workspaces), Chrome DevTools (browser automation).

**Configuration**: `.utcp_config.json` defines available MCP servers. Tool naming: `{manual}.{manual}_{tool}()`.

</details>

---

<details open>
<summary><strong>The Agent Network</strong> — 10 specialized agents with role-based routing</summary>

<br>

Ten specialized agents prevent AI assistants from making assumptions, skipping documentation, and creating technical debt. Two are built into OpenCode; eight are custom agents in `.opencode/agent/`.

#### All Agents

| Agent          | Type     | Model         | Role                                                               |
| -------------- | -------- | ------------- | ------------------------------------------------------------------ |
| `@general`     | Built-in | —             | Implementation, complex coding tasks                               |
| `@explore`     | Built-in | —             | Quick codebase exploration, file discovery                         |
| `@orchestrate` | Custom   | Primary       | Multi-agent coordination with enterprise patterns                  |
| `@context`     | Custom   | claude-haiku  | Context retrieval and synthesis for other agents                   |
| `@speckit`     | Custom   | claude-sonnet | Spec folder creation (exclusive: only agent that writes spec docs) |
| `@debug`       | Custom   | claude-opus   | Fresh-perspective debugging, root cause analysis                   |
| `@research`    | Custom   | claude-opus   | Evidence gathering, technical investigation                        |
| `@review`      | Custom   | claude-opus   | Code review with pattern validation (READ-ONLY)                    |
| `@write`       | Custom   | claude-sonnet | Documentation generation (READMEs, skills, guides)                 |
| `@handover`    | Custom   | claude-sonnet | Session continuation, context preservation                         |

#### Enterprise Orchestration

The `@orchestrate` agent implements distributed-systems patterns:

- **Context Window Budget (CWB)** — Tracks context consumption across delegated tasks. Wave-based dispatching enables 10+ parallel agents without overflow.
- **Circuit Breaker** — Isolates failing agents (3 failures -> OPEN state, 60s cooldown)
- **Saga Compensation** — Reverse-order rollback when multi-task workflows fail
- **Quality Gates** — Pre/mid/post execution scoring with 70-point threshold
- **Resource Budgeting** — Token budget management (50K default, 80% warning, 100% halt)
- **Checkpointing** — Recovery snapshots every 5 tasks or 10 tool calls
- **Conditional Branching** — IF/THEN/ELSE logic with 3-level nesting
- **Sub-Orchestrator Pattern** — Delegates complex sub-workflows to nested orchestrators

#### How Agents Get Chosen

`@research` for investigation. `@speckit` for spec documentation (exclusively). `@debug` when stuck 3+ attempts. `@review` for code quality. `@orchestrate` for multi-agent coordination.

#### Fresh-Perspective Debugging

The `@debug` agent uses a 4-phase methodology — Observe -> Analyze -> Hypothesize -> Fix — and *intentionally starts with no prior context*. Trigger with `/spec_kit:debug`, select your preferred model, and get a fresh perspective.

</details>

---

<details>
<summary><strong>The Gate System</strong> — 3 mandatory gates before any file change</summary>

<br>

Every request passes through mandatory gates before the AI touches a single file. *Enforced*, not suggested. No exceptions.

```
Request ──► Gate 1 (SOFT) ──► Gate 2 (REQUIRED) ──► Gate 3 (HARD) ──► Execute
            Understanding      Skill Routing         Spec Folder
```

**Gate 1: Understanding + Context Surfacing** (SOFT BLOCK)
Dual-threshold validation: `READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)`. Both must pass. If either fails, the AI investigates (max 3 iterations) before escalating with options. Surfaces relevant memories via trigger matching before you even ask.

**Gate 2: Skill Routing** (REQUIRED)
Runs `skill_advisor.py` against your request. Confidence >= 0.8 means the skill *must* be loaded. This ensures the right domain expertise is always in context.

**Gate 3: Spec Folder** (HARD BLOCK)
If the request involves *any* file modification, the AI must ask: A) Use existing? B) Create new? C) Update related? D) Skip? No file changes without an answer.

**Post-Execution Rules:**
- **Memory Save** — `generate-context.js` is mandatory (no manual memory file creation)
- **Completion Verification** — AI loads `checklist.md` and verifies every item with evidence

#### Analysis Lenses

Six lenses applied silently to catch problems:

| Lens               | Catches                                    |
| ------------------ | ------------------------------------------ |
| **SYSTEMS**        | Missed dependencies, side effects          |
| **BIAS**           | Solving symptoms instead of root causes    |
| **SCOPE**          | Solution complexity exceeding problem size |
| **CLARITY**        | Over-abstraction, unearned complexity      |
| **VALUE**          | Cosmetic changes disguised as improvements |
| **SUSTAINABILITY** | Future maintenance nightmares              |

#### Auto-Detected Anti-Patterns

24 pre-indexed anti-patterns with automatic detection. Six core patterns:

| Pattern                | Trigger                          | Response                                                   |
| ---------------------- | -------------------------------- | ---------------------------------------------------------- |
| Scope creep            | "also add", "bonus feature"      | "That's a separate change."                                |
| Over-engineering       | "future-proof", "might need"     | "Is this solving a current problem or a hypothetical one?" |
| Gold-plating           | "while we're here"               | "That's outside current scope. Track separately?"          |
| Premature optimization | "could be slow"                  | "Has this been measured?"                                  |
| Cargo culting          | "best practice", "always should" | "Does this pattern fit this specific case?"                |
| Wrong abstraction      | "DRY this up" (2 instances)      | "Similar code isn't always the same concept."              |

</details>

---

<details>
<summary><strong>Spec Kit Documentation</strong> — 4 levels, 84 templates, 13 validation rules</summary>

<br>

Every feature leaves a trail. Not for bureaucracy — for your future self, your team, and the AI that picks up where you left off.

#### Four Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | >=500          | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

#### CORE + ADDENDUM Template Architecture

**84 templates** across the v2.2 composition model — CORE templates are shared across levels, ADDENDUM templates extend them. Update CORE once and all levels inherit. Zero duplication.

```
Level 1:  [CORE templates]                    -> 4 files
Level 2:  [CORE] + [L2-VERIFY addendum]       -> 5 files
Level 3:  [CORE] + [L2] + [L3-ARCH addendum]  -> 6 files
Level 3+: [CORE] + [all addendums]             -> 6+ files
```

| Template                    | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `spec.md`                   | Feature scope, requirements, constraints (frozen)     |
| `plan.md`                   | Implementation approach and design decisions          |
| `tasks.md`                  | Ordered task breakdown with status tracking           |
| `checklist.md`              | QA validation items (P0/P1/P2 priority)               |
| `decision-record.md`        | Architectural decisions with rationale and trade-offs |
| `implementation-summary.md` | Post-implementation record of what was built          |

#### Validation and Automation

**13 pluggable validation rules** run before any spec folder can be marked complete:

| Rule                   | Validates                                    |
| ---------------------- | -------------------------------------------- |
| `check-anchors`        | Reference integrity                          |
| `check-placeholders`   | No `[PLACEHOLDER]` text remaining            |
| `check-frontmatter`    | YAML metadata present and valid              |
| `check-sections`       | Required sections exist with content         |
| `check-complexity`     | Complexity score matches documentation level |
| `check-evidence`       | Evidence citations present                   |
| `check-priority-tags`  | P0/P1/P2 tags applied correctly              |
| `check-files`          | Required files exist for declared level      |
| `check-folder-naming`  | `###-kebab-case` naming convention           |
| `check-level-match`    | Declared level matches actual complexity     |
| `check-level`          | Level detection from folder contents         |
| `check-section-counts` | Minimum section counts met                   |
| `check-ai-protocols`   | AI interaction rules validated               |

Exit code 0 = pass. Exit code 2 = must fix.

#### Memory Integration

Memory files live *inside* spec folders at `specs/###-feature/memory/`. Saves enforced via `generate-context.js` (never manual). Sub-folder versioning (`001/`, `002/`, `003/`) gives each version independent context. `/memory:continue` auto-loads relevant memories when resuming.

> Full reference: [System Spec Kit Documentation](.opencode/skill/system-spec-kit/README.md)

</details>

---

<details>
<summary><strong>Skills Library</strong> — 9 domain skills, auto-loaded by task keywords</summary>

<br>

Skills are domain expertise on demand. The AI loads the right skill and already knows your conventions.

#### All Skills

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

`skill_advisor.py` analyzes your request keywords. Confidence >= 0.8 = skill auto-loads.

**Multi-Stack Auto-Detection** (`workflows-code--full-stack`):

| Stack            | Category | Detection Marker                                | Example Patterns                  |
| ---------------- | -------- | ----------------------------------------------- | --------------------------------- |
| **Go**           | backend  | `go.mod`                                        | Domain layers, table-driven tests |
| **Node.js**      | backend  | `package.json` with "express"                   | Express routes, async/await       |
| **React**        | frontend | `next.config.js` or `package.json` with "react" | Server/Client components, hooks   |
| **React Native** | mobile   | `app.json` with "expo"                          | Navigation, hooks, platform APIs  |
| **Swift**        | mobile   | `Package.swift`                                 | SwiftUI, Combine, async/await     |

</details>

---

<details>
<summary><strong>Command Architecture</strong> — 19 commands across 4 namespaces with 25 YAML assets</summary>

<br>

Commands are user-triggered workflows built on a two-layer architecture — markdown entry points that route to YAML execution engines.

**Layer 1: Entry Point (.md)** — User-facing interface: input collection, setup, routing.
**Layer 2: Execution Engine (.yaml)** — Behavioral spec: step enumeration, validation gates, agent prompts, circuit breakers.

**Why commands beat free-form prompts**: One prompt. Twelve steps. Zero manual overhead.

| Aspect            | Free-Form Prompts    | Commands                 |
| ----------------- | -------------------- | ------------------------ |
| Step Memory       | You remember each    | Workflow baked in        |
| Interaction Count | 12 prompts for 12    | 1 prompt, 12 steps       |
| Enforcement       | No enforcement       | Gates prevent skipping   |
| Skill Loading     | Manual skill loading | Auto-loads what's needed |

#### spec_kit/ (7 commands)

All support `:auto` and `:confirm` mode suffixes.

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `/spec_kit:complete`  | Full workflow: spec -> plan -> implement -> verify     |
| `/spec_kit:plan`      | Planning only, no implementation                       |
| `/spec_kit:implement` | Execute an existing plan                               |
| `/spec_kit:research`  | Technical investigation with evidence gathering        |
| `/spec_kit:debug`     | Delegate debugging to a fresh-perspective sub-agent    |
| `/spec_kit:resume`    | Continue a previous session (auto-loads memory)        |
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

</details>

---

<details>
<summary><strong>Chrome DevTools Integration</strong> — Dual-mode browser debugging</summary>

<br>

CLI-first for speed and token efficiency, MCP fallback for multi-tool integration.

**CLI Approach (Priority)** — `browser-debugger-cli` (bdg):
- 300+ CDP methods across 53 Chrome DevTools domains
- Self-documenting: `bdg cdp --list`, `--describe`, `--search`
- Unix composability: pipe to `jq`, `grep`, standard tools

**MCP Approach (Fallback)** — Chrome DevTools via Code Mode:
- When CLI unavailable or multi-tool integration needed
- Isolated browser instances, parallel testing

**Common Operations**:

| Operation      | Command                                                       |
| -------------- | ------------------------------------------------------------- |
| Screenshots    | `bdg dom screenshot output.png`                               |
| Console logs   | `bdg console --list \| jq '.[] \| select(.level == "error")'` |
| DOM queries    | `bdg dom query ".my-class"`                                   |
| Network traces | `bdg network har trace.har`                                   |
| JS execution   | `bdg dom eval "document.title"`                               |

</details>

---

<details>
<summary><strong>Git Workflows</strong> — 3-phase professional git orchestration</summary>

<br>

**Phase 1: Workspace Setup** — Git worktrees for isolated development:
- Parallel work without branch juggling or stash chaos
- Short-lived temp branches, automatic cleanup after merge
- Directory isolation: `.worktrees/feature-name/`

**Phase 2: Clean Commits** — Conventional Commits with artifact filtering:
- Analyze changes, categorize by type (feat/fix/docs/refactor)
- Filter build artifacts (coverage/, dist/, node_modules/)
- Format: `type(scope): description` (e.g., `feat(auth): add OAuth2 login`)

**Phase 3: Work Completion** — Merge, PR creation, and cleanup:
- Test verification gate (MANDATORY before integration)
- Four options: Merge locally, Create PR, Keep as-is, Discard
- Automated cleanup: Delete feature branches, remove worktrees

**Integration**: GitHub MCP (via Code Mode) for remote operations. Local git commands for commits, diffs, merges.

</details>

---

<details>
<summary><strong>Extensibility</strong> — Custom skills, agents, commands, and templates</summary>

<br>

Every component follows standardized patterns for customization:

**Custom Skills** — `/create:skill my-skill` or `init_skill.py`. Auto-detected by `skill_advisor.py`. Structure: SKILL.md + references/ + assets/ + scripts/.

**Custom Agents** — `/create:agent my-agent`. Define constraints, tool access, delegation rules. Integrate with gate system and orchestration.

**Custom Commands** — Two-layer (.md + .yaml). Optimize to <=600 lines.

**Template System** — 84 templates across CORE + ADDENDUM v2.2. Update once, inherit everywhere. 13 validation rules ensure compliance.

**Philosophy**: Convention over configuration. Templates provide structure; you own the content. The framework adapts to your project.

</details>

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

| Server                  | Tools | Purpose                                                               |
| ----------------------- | ----- | --------------------------------------------------------------------- |
| **Spec Kit Memory**     | 22    | Cognitive memory system (the memory engine)                           |
| **Code Mode**           | 7     | External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools) |
| **Sequential Thinking** | —     | Structured multi-step reasoning for complex problems                  |

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

Practical examples of the MCP memory tools in action.

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
