<div align="left">
     
# OpenCode Dev Environment + Spec Kit w/ Cognitive Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-dev-environment?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-dev-environment/releases)

> - 99.999% of people won't try this system. Beat the odds?
> - https://buymeacoffee.com/michelkerkmeester

</div>

---

## 1. 📖 OVERVIEW

A development environment for [OpenCode](https://github.com/sst/opencode) featuring two custom-built systems you won't find anywhere else:

**📋 Spec Kit**: Originally inspired by GitHub's spec-kit, this unified system adds automation, slash commands, integrated semantic memory, and sub-folder versioning. Documentation writes itself and is enforced by design.

**🎯 Skills** (custom framework): 8 domain-specific skills that auto-load based on your task. Designed for efficiency: fewer, smarter skills replace the typical sprawl of dozens of fragmented prompts.

#### TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 SPEC KIT FRAMEWORK](#2--spec-kit-framework)
3. [🧠 SEMANTIC MEMORY SYSTEM](#3--semantic-memory-system)
4. [🤖 AGENTS.MD FRAMEWORK](#4--agentsmd-framework)
5. [🧩 SKILLS LIBRARY](#5--skills-library)
6. [⚡ COMMANDS](#6--commands)
7. [🚀 INSTALLATION & SETUP](#7--installation--setup)
8. [🎯 WHAT'S NEXT?](#8--whats-next)

---

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

---

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

- **Causal memory graph** = trace decision chains with "why" queries (6 relationship types)
- **Crash recovery** = auto-resume from compaction/timeout via `/memory:continue`
- **Intent-aware retrieval** = 5 intent types route to optimized search weights
- **Hybrid search** = vector + BM25 + RRF fusion + cross-encoder reranking
- **ANCHOR format** = section-level memory extraction for 93% token savings vs full files
- **Proactive surfacing** = context appears <50ms before you ask via trigger matching
- **Session deduplication** = hash-based tracking prevents re-sending same content (-50% tokens)
- **Checkpoints** = undo button for your memory index with embedding preservation
- **6 importance tiers** = constitutional to deprecated with auto-decay
- **Session learning** = preflight/postflight captures quantified knowledge improvement
- **Multiple embedding providers** = Voyage (recommended), OpenAI, HF Local (offline)

---

### Spec Kit: What Sets This Apart

Originally inspired by [GitHub Spec Kit](https://github.com/github/spec-kit), this system takes the concept far beyond basic templates. Documentation isn't just a suggestion: it's a requirement, enforced by design.

Key enhancements: gate enforcement, slash commands for every workflow, deep memory integration, sub-folder versioning, delegated debugging, stateless architecture, cognitive memory, session learning metrics, and 13 pluggable validation rules.

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

- Memory lives IN spec folders (deep integration)
- 7 slash commands with `:auto`/`:confirm` modes
- AI detects frustration, auto-suggests sub-agent
- **Format validation** = `validate_document.py` enforces template compliance
- Completeness scoring (0-100%)
- 10 core templates (CORE + ADDENDUM v2.0)
- 001/002/003 sub-folder versioning
- 77 scripts handle the boring work (48 JS + 29 shell)
- Stateless architecture (no STATE.md)

### The Integration Nobody Else Has

These systems aren't just bundled: they're *woven together*:

- Memory files live inside spec folders (`specs/###-feature/memory/`)
- Gate enforcement ensures `generate-context.js` for every save
- `/spec_kit:resume` auto-loads relevant memories
- Sub-folder versioning preserves independent memory per version

### Innovations You Won't Find Elsewhere

| Innovation                | Impact                | Description                                     |
| ------------------------- | --------------------- | ----------------------------------------------- |
| **Causal memory graph**   | Decision tracing      | 6 relationship types answer "why" queries       |
| **Crash recovery**        | Zero lost work        | Auto-resume from compaction/timeout             |
| **Intent-aware search**   | Smarter retrieval     | 5 intent types route to optimized search        |
| **Session deduplication** | 50% token savings     | Hash-based duplicate prevention in same session |
| **ANCHOR retrieval**      | 93% token savings     | Section-level memory extraction, not full files |
| **Proactive triggers**    | <50ms surfacing       | Context surfaces BEFORE you ask                 |
| **Constitutional tier**   | Rules never forgotten | Critical rules always surface, never decay      |
| **Cognitive memory**      | Biologically-inspired | HOT/WARM/COLD with spreading activation         |
| **Debug delegation**      | Model selection       | Fresh perspective with full context handoff     |
| **Parallel dispatch**     | 5-dimension scoring   | Complexity-based agent orchestration            |
| **Epistemic vectors**     | Smarter gates         | Dual-threshold: confidence AND uncertainty      |
| **Session learning**      | Quantified growth     | Preflight/postflight tracks actual learning     |
| **Template composition**  | Zero duplication      | CORE + ADDENDUM architecture                    |
| **Stateless state**       | No stale files        | State versioned in memory files, not STATE.md   |

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


## 2. 📋 SPEC KIT FRAMEWORK

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
- **Templates**: 10 core templates (CORE + ADDENDUM v2.0)
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

- **Level 3+** (Level 3 + AI execution protocols)
  Multi-agent coordination, large-scale migrations, complex orchestration

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


### Templates 

Most documentation systems duplicate content across templates. This system uses a **composition model**: core templates are shared, level-specific addendums extend them.

**How Template Composition Works:**
```
Level 1:  [CORE templates only]        → 4 files, ~270 LOC
Level 2:  [CORE] + [L2-VERIFY]         → 5 files, ~390 LOC
Level 3:  [CORE] + [L2] + [L3-ARCH]    → 6 files, ~540 LOC
Level 3+: [CORE] + [all addendums]     → 6 files, ~640 LOC
```

**Why This Matters:**
- Update CORE once → all levels inherit changes
- No content duplication
- `scripts/templates/compose.sh` automates composition
- `--verify` mode detects template drift

**Core Templates:**
- **spec.md**: Feature specification with acceptance criteria
- **plan.md**: Technical implementation plan
- **tasks.md**: Task breakdown by user story
- **checklist.md**: QA validation with P0/P1/P2 priorities (Level 2+)
- **decision-record.md**: Architecture Decision Records (Level 3+)
- **implementation-summary.md**: Post-implementation summary

**Utility Templates:**
- **research.md**: Comprehensive technical research
- **handover.md**: Session continuity for multi-session work
- **debug-delegation.md**: Sub-agent debugging tasks
- **context_template.md**: Memory file generation (internal)


### Validation System (13 Pluggable Rules)

Every spec folder runs through automated validation before you can claim "done."

**Rules:**
| Rule               | Severity | What It Checks                            |
| ------------------ | -------- | ----------------------------------------- |
| FILE_EXISTS        | ERROR    | Required files present for level          |
| PLACEHOLDER_FILLED | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` patterns |
| SECTIONS_PRESENT   | WARNING  | Required markdown sections exist          |
| LEVEL_DECLARED     | INFO     | Level explicitly stated                   |
| PRIORITY_TAGS      | WARNING  | P0/P1/P2 format validated                 |
| EVIDENCE_CITED     | WARNING  | Non-P2 items cite evidence                |
| ANCHORS_VALID      | ERROR    | Memory file anchor pairs matched          |
| FOLDER_NAMING      | ERROR    | Follows `###-short-name` convention       |
| FRONTMATTER_VALID  | WARNING  | YAML frontmatter structured correctly     |
| COMPLEXITY_MATCH   | WARNING  | Content metrics match declared level      |
| AI_PROTOCOL        | WARNING  | Level 3/3+ has AI execution protocols     |
| LEVEL_MATCH        | ERROR    | Level consistent across all files         |
| SECTION_COUNTS     | WARNING  | Section counts within expected ranges     |

**Exit Codes:**
- `0` = Pass → Proceed with completion
- `1` = Warnings → Address or document
- `2` = Errors → Must fix before completion


### Memory Integration

Memory is deeply integrated with Spec Kit. Files live IN spec folders (`specs/###-feature/memory/`), and Gate 5 enforces proper memory saves via `generate-context.js`.

See [Section 3: Semantic Memory System](#3--semantic-memory-system) for full documentation.

For detailed Spec Kit documentation, see the [README](.opencode/skill/system-spec-kit/README.md).


---


## 3. 🧠 SEMANTIC MEMORY SYSTEM

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
- **Privacy**: Local options available (HF Local runs on YOUR machine)
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

| Tier               | Boost | Decay    | Use Case                                           |
| ------------------ | ----- | -------- | -------------------------------------------------- |
| **constitutional** | 3.0x  | Never    | Project rules, always-on context (~500 tokens max) |
| **critical**       | 2.0x  | Never    | Architecture decisions, breaking changes           |
| **important**      | 1.5x  | Never    | Key implementations, major features                |
| **normal**         | 1.0x  | 90-day   | Standard development context (default)             |
| **temporary**      | 0.5x  | 7-day    | Debug sessions, experiments                        |
| **deprecated**     | 0.0x  | Excluded | Outdated information (preserved but hidden)        |


### Memory Commands (5 Consolidated)

| Command                      | Purpose                                                         |
| ---------------------------- | --------------------------------------------------------------- |
| `/memory:context [query]`    | Unified retrieval with intent-aware routing (replaces search)   |
| `/memory:save [spec-folder]` | Save context via generate-context.js                            |
| `/memory:continue`           | Session recovery from crash/compaction                          |
| `/memory:learn [topic]`      | Explicit learning capture (`correct` subcommand for mistakes)   |
| `/memory:manage [operation]` | Database ops: stats, health, cleanup, checkpoint create/restore |

**Example:**

```
> /memory:context "authentication flow"

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


### Cognitive Memory (Biologically-Inspired)

This isn't basic memory storage. The system implements a biologically-inspired working memory model with attention dynamics:

**HOT/WARM/COLD Tiers:**
| Tier     | Score Range | Content Returned | Max Items |
| -------- | ----------- | ---------------- | --------- |
| **HOT**  | >= 0.8      | Full content     | 5         |
| **WARM** | 0.25-0.79   | Summary only     | 10        |
| **COLD** | < 0.25      | Not returned     | -         |

**Attention Decay:**
```
new_score = current_score × (decay_rate ^ turns_elapsed)
```
- Constitutional tier: Never decays (always HOT)
- Normal tier: 0.80 decay per turn
- Temporary tier: 0.60 decay per turn (fast fade)

**Spreading Activation:**
When a primary memory is activated, related memories get a 0.35 score boost automatically. Neural-inspired co-activation surfaces context you didn't explicitly ask for but need.


### Session Learning Metrics

Track what your AI assistant actually *learned*, not just what it did.

**Preflight/Postflight Workflow:**
1. `task_preflight()` → Capture baseline: knowledge, uncertainty, context scores
2. Execute task
3. `task_postflight()` → Capture result, calculate Learning Index

**Learning Index Formula:**
```
LI = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
```

**Interpretation:**
| Learning Index | Meaning                              |
| -------------- | ------------------------------------ |
| >= 40          | Significant learning session         |
| >= 15          | Moderate learning                    |
| >= 5           | Incremental learning                 |
| >= 0           | Execution-focused (minimal learning) |
| < 0            | Knowledge regression (investigate)   |

This enables measuring productivity by *learning*, not just output.


### The 22 MCP Tools (7 Layers)

**L1 Orchestration (1 tool)**
| Tool             | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `memory_context` | Unified entry with intent-aware routing (NEW v1.2.0) |

**L2 Search & Retrieval (3 tools)**
| Tool                    | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `memory_search`         | Semantic search with hybrid vector + BM25 fusion  |
| `memory_match_triggers` | Fast keyword matching (<50ms proactive surfacing) |
| `memory_save`           | Index memory files                                |

**L3 Read-Only (3 tools)**
| Tool            | Purpose                                    |
| --------------- | ------------------------------------------ |
| `memory_list`   | Browse stored memories with pagination     |
| `memory_stats`  | Database statistics with composite ranking |
| `memory_health` | Check memory system health status          |

**L4 Write Operations (3 tools)**
| Tool              | Purpose                             |
| ----------------- | ----------------------------------- |
| `memory_update`   | Update metadata and importance tier |
| `memory_delete`   | Delete by ID or spec folder         |
| `memory_validate` | Record validation feedback          |

**L5 Checkpoints (4 tools)**
| Tool                 | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `checkpoint_create`  | Snapshot current state with embeddings      |
| `checkpoint_list`    | List available checkpoints                  |
| `checkpoint_restore` | Restore from checkpoint (soft or hard mode) |
| `checkpoint_delete`  | Remove checkpoint                           |

**L6 Advanced (6 tools)**
| Tool                   | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `task_preflight`       | Capture epistemic baseline before task            |
| `task_postflight`      | Capture post-task state, calculate Learning Index |
| `memory_drift_why`     | Trace causal chain for "why" queries (NEW v1.2.0) |
| `memory_causal_link`   | Create causal relationships (NEW v1.2.0)          |
| `memory_causal_stats`  | Graph statistics and coverage (NEW v1.2.0)        |
| `memory_causal_unlink` | Remove causal relationships (NEW v1.2.0)          |

**L7 Maintenance (2 tools)**
| Tool                          | Purpose                           |
| ----------------------------- | --------------------------------- |
| `memory_index_scan`           | Bulk scan and index workspace     |
| `memory_get_learning_history` | Get learning trends and summaries |

> **Note:** Full MCP names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search`).


### Embedding Provider Options

> **Choose Your Privacy & Performance Balance**

Spec Kit Memory supports multiple embedding providers with automatic detection:

| Provider     | Dimensions | Requirements     | Best For                           |
| ------------ | ---------- | ---------------- | ---------------------------------- |
| **Voyage**   | 1024       | `VOYAGE_API_KEY` | Recommended, 8% better retrieval   |
| **OpenAI**   | 1536/3072  | `OPENAI_API_KEY` | Cloud-based alternative            |
| **HF Local** | 768        | Node.js only     | Privacy, offline, default fallback |
| **Ollama**   | 768        | Ollama + model   | Optional (not yet available)       |

**Auto-detection:**
- If `VOYAGE_API_KEY` exists → Uses Voyage automatically (recommended)
- Else if `OPENAI_API_KEY` exists → Uses OpenAI automatically
- Else → Uses HF Local (works without additional installation)
- Override: `export EMBEDDINGS_PROVIDER=hf-local` forces local

**Configuration:**
```bash
# Voyage provider (recommended - best retrieval quality)
export VOYAGE_API_KEY=pa-...
export VOYAGE_EMBEDDINGS_MODEL=voyage-3.5  # Optional, this is default

# OpenAI provider (cloud-based alternative)
export OPENAI_API_KEY=sk-proj-...
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small  # Optional

# Force HF local (even with API keys)
export EMBEDDINGS_PROVIDER=hf-local
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Optional
```

**Privacy with HF Local:**
- Embeddings run on YOUR machine (768-dim vectors)
- Storage: SQLite with sqlite-vec extension in YOUR project
- No external API calls
- Works fully offline, no downloads required

**Database per profile:** Each provider+model+dimension uses its own SQLite to prevent dimension mismatch errors.

See [`.opencode/skill/system-spec-kit/`](.opencode/skill/system-spec-kit/) for implementation details.


---


## 4. 🤖 AGENTS.MD FRAMEWORK

The [`AGENTS.md`](AGENTS.md) file is the brain of your AI assistant's behavior. It defines mandatory gates that every request passes through, preventing common failures like hallucination, scope creep, and forgotten context.

### Why You Need This

Without guardrails, AI assistants:

- Make assumptions instead of asking clarifying questions
- Skip documentation and lose context between sessions
- Claim completion without proper verification
- Create technical debt through inconsistent approaches

**AGENTS.md prevents all of this.**


### Specialized Agents (7 Total)

The system includes 7 specialized agents that handle specific tasks. Five are **sub-agents** integrated into commands, two are **enhanced orchestration agents**.

**Sub-Agents** (integrated into commands):

| Agent       | Purpose                                                   | Integrated With       |
| ----------- | --------------------------------------------------------- | --------------------- |
| `@research` | Technical investigation with evidence gathering           | `/spec_kit:research`  |
| `@speckit`  | Spec folder documentation for Level 1-3+                  | `/spec_kit:plan`      |
| `@review`   | Code review with pattern validation (READ-ONLY)           | `/spec_kit:implement` |
| `@debug`    | 4-phase debugging (Observe → Analyze → Hypothesize → Fix) | `/spec_kit:debug`     |
| `@handover` | Session continuation and context preservation             | `/spec_kit:handover`  |

**Orchestration Agents**:

| Agent          | Purpose                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| `@orchestrate` | Senior orchestration with task decomposition, delegation, quality evaluation |
| `@write`       | Documentation generation and maintenance                                     |

**Model Defaults:** Opus 4.5 for complex analysis, Sonnet for cost-efficient structured tasks.


### Enterprise Orchestration Patterns

The `@orchestrate` agent includes enterprise-grade patterns for reliable multi-agent workflows:

| Pattern                   | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **Circuit Breaker**       | Isolates failing agents (3 failures → OPEN state, 60s timeout) |
| **Saga Compensation**     | Reverse-order rollback on multi-task failures                  |
| **Quality Gates**         | Pre/mid/post execution scoring with 70-point threshold         |
| **Resource Budgeting**    | 50K token default, 80% warning, 100% halt                      |
| **Conditional Branching** | IF/THEN/ELSE logic with 3-level nesting                        |
| **Checkpointing**         | Recovery snapshots every 5 tasks or 10 tool calls              |


#### Confidence & Dual-Threshold Validation

The framework uses a sophisticated dual-threshold system to decide when to proceed:

**READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)**

| Confidence | Uncertainty | State               | Action                        |
| ---------- | ----------- | ------------------- | ----------------------------- |
| >=0.70     | <=0.35      | READY               | Proceed                       |
| >=0.70     | >0.35       | Confident Ignorance | INVESTIGATE - reduce unknowns |
| <0.70      | <=0.35      | Low Confidence      | INVESTIGATE - gather evidence |
| <0.70      | >0.35       | Lost                | ESCALATE - ask user           |

**Uncertainty factors:**
- Epistemic gaps (what don't I know?)
- Model boundaries (at capability limits?)
- Temporal variability (how stable is this knowledge?)
- Situational completeness (context sufficient?)

**Investigation Protocol:** Max 3 iterations of evidence gathering before escalating to user with options.

- Explicit confidence scoring (0-100%)
- Mandatory clarification when confidence < 80%
- Multiple-choice questions for ambiguous requests
- Never fabricates: outputs "UNKNOWN" when unverifiable

#### Quality Principles

- Simplicity first (KISS)
- Evidence-based decisions with citations
- Scope discipline: solves only what's asked
- Browser verification before completion claims

#### Five Checks Framework

For substantial changes (>100 LOC or architectural decisions), the AI validates against five checks:

| #   | Check                    | Question                 | Pass Criteria                               |
| --- | ------------------------ | ------------------------ | ------------------------------------------- |
| 1   | **Necessary?**           | Solving ACTUAL need NOW? | Clear requirement exists, not speculative   |
| 2   | **Beyond Local Maxima?** | Explored alternatives?   | >=2 alternatives considered with trade-offs |
| 3   | **Sufficient?**          | Simplest approach?       | No simpler solution achieves the goal       |
| 4   | **Fits Goal?**           | On critical path?        | Directly advances stated objective          |
| 5   | **Open Horizons?**       | Long-term aligned?       | Doesn't create technical debt or lock-in    |

**Usage:** Required for Level 3/3+ spec folders. Optional but recommended for Level 2. Recorded in decision-record.md for architectural changes.

#### The Gate System

The gate system is a series of automated checks that every request passes through to ensure quality, context retention, and workflow integrity. Each gate enforces a specific rule—such as verifying understanding, routing to the right skill, requiring documentation, validating memory saves, and confirming completion—so that nothing falls through the cracks. This layered approach prevents common issues like context loss, incomplete documentation, and unverified work, making the development process more reliable and efficient.


#### Workflows Code (Section: 9)

AGENTS.md includes dedicated guidance for code implementation with two skill variants:

| Skill                        | Use Case                                                       | Path                                          |
| ---------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| `workflows-code--web-dev`    | Single-stack web projects (Webflow, vanilla JS)                | `.opencode/skill/workflows-code--web-dev/`    |
| `workflows-code--full-stack` | Multi-stack projects (Go, Node.js, React, React Native, Swift) | `.opencode/skill/workflows-code--full-stack/` |
| `workflows-code--opencode`   | OpenCode system code (JavaScript, Python, Shell, JSON/JSONC)   | `.opencode/skill/workflows-code--opencode/`   |

**3-Phase Lifecycle:**
1. **Phase 1 - Implementation**: Write code following stack-specific patterns
2. **Phase 2 - Testing/Debugging**: Run tests, fix failures, debug issues
3. **Phase 3 - Verification**: Run verification suite (MANDATORY before "done")

**Stack Detection via Marker Files (full-stack):**
| Stack            | Category | Detection Marker              | Example Patterns                  |
| ---------------- | -------- | ----------------------------- | --------------------------------- |
| **Go**           | backend  | `go.mod`                      | Domain layers, table-driven tests |
| **Node.js**      | backend  | `package.json` with "express" | Express routes, async/await       |
| **React**        | frontend | `next.config.js`              | Server/Client components, hooks   |
| **React Native** | mobile   | `app.json` with "expo"        | Navigation, hooks, platform APIs  |
| **Swift**        | mobile   | `Package.swift`               | SwiftUI, Combine, async/await     |

**Stack-Specific Verification:**
| Stack        | Command                                                  |
| ------------ | -------------------------------------------------------- |
| Go           | `go test ./...` → `golangci-lint run` → `go build ./...` |
| Node.js      | `npm test` → `npm run lint` → `npm run build`            |
| React        | `npm test` → `npm run lint` → `npm run build`            |
| React Native | `npm test` → `npx eslint .` → `npx expo export`          |
| Swift        | `swift test` → `swiftlint` → `swift build`               |

This enables the AI to automatically adapt its workflow based on your project's tech stack.

---


## 5. 🧩 SKILLS LIBRARY

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


### Available Skills (9 Total)

**system-spec-kit**
Unified documentation enforcement, templates, and context preservation across sessions
> Example: "Create spec for feature" or "Save this context"

**mcp-code-mode**
External tool orchestration (Figma, GitHub, ClickUp, etc.)
> Example: "Get Figma file" or "Create GitHub issue"

**mcp-figma**
Figma design integration: file operations, components, styles, variables, comments, projects, versioning (via Code Mode)
> Example: "Get Figma file nodes" or "List team components" or "Post comment on design"

**workflows-code--web-dev**
Single-stack web implementation. Includes 6 performance references (CWV remediation, resource loading, Webflow constraints, third-party optimization), 10-agent research methodology, and JavaScript minification workflow. For Webflow and vanilla JavaScript projects.
> Example: "Implement this feature" or "Analyze performance" or "Minify JavaScript"

**workflows-code--full-stack**
Multi-stack code implementation for 5 technology stacks (Go, Node.js, React, React Native, Swift). Automatic stack detection via marker files, hierarchical resource structure, 3-phase lifecycle, and stack-specific verification commands.
> Example: "Implement Go service" or "Add React component" or "Debug Node.js API"

**workflows-code--opencode**
Multi-language code standards for OpenCode system code (JavaScript, Python, Shell, JSON/JSONC). Language detection routing, universal patterns, commenting standards, and quality checklists for MCP servers, scripts, and configurations.
> Example: "Write MCP server handler" or "Create Python validator" or "Add shell script"

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


## 6. ⚡ COMMANDS

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


### Available Commands (19 Total)

**spec_kit/** (7 commands)
`/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume`, `/spec_kit:debug`, `/spec_kit:handover`

**memory/** (5 commands)
`/memory:context`, `/memory:save`, `/memory:continue`, `/memory:learn`, `/memory:manage`

**create/** (6 commands)
`/create:agent`, `/create:skill`, `/create:skill_asset`, `/create:skill_reference`, `/create:folder_readme`, `/create:install_guide`

**search/** (2 commands)
`/search:code`, `/search:index`


### Sub-Agent Delegation

Several commands leverage sub-agents for complex tasks:

| Command               | Delegation         | Purpose                                                          |
| --------------------- | ------------------ | ---------------------------------------------------------------- |
| `/spec_kit:debug`     | `@debug` agent     | Routes to 4-phase debugging methodology (model selection prompt) |
| `/spec_kit:handover`  | `@handover` agent  | Dedicated Sonnet agent for context gathering                     |
| `/spec_kit:research`  | `@research` agent  | Technical investigation with evidence gathering                  |
| `/spec_kit:plan`      | `@speckit` agent   | Spec folder creation with template enforcement                   |
| `/spec_kit:implement` | `@review` agent    | Code review at completion (READ-ONLY)                            |
| `/memory:save`        | Task tool dispatch | Delegates memory extraction to sub-agent                         |

**Model Selection (Debug):** When stuck 3+ attempts, `/spec_kit:debug` prompts you to select a model, then dispatches to that model via Task tool for fresh perspective.


---


## 7. 🚀 INSTALLATION & SETUP

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
git clone https://github.com/MichelKerkmeester/opencode-dev-environment.git
cp -r opencode-dev-environment/.opencode /path/to/your-project/
cp opencode-dev-environment/opencode.json /path/to/your-project/
cp opencode-dev-environment/AGENTS.md /path/to/your-project/

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
  [Guide](.opencode/install_guides/MCP - Sequential Thinking.md)

- **Spec Kit Memory**: Local vector-based conversation memory (22 MCP tools in 7 layers)
  [Guide](.opencode/install_guides/MCP - Spec Kit Memory.md)

- **Code Mode**: External tool orchestration (Figma, GitHub, ClickUp, Chrome DevTools, etc.)
  [Guide](.opencode/install_guides/MCP - Code Mode.md)

### MCP Install Scripts

Automated installation scripts for MCP servers. Located in `.opencode/install_guides/install_scripts/`:

```bash
# Install all MCP servers at once
./install-all.sh

# Or install individually
./install-sequential-thinking.sh
./install-spec-kit-memory.sh
./install-code-mode.sh
```

Each script handles dependencies, configuration, and validation automatically.


### Spec Kit Memory System

| System              | MCP Name          | Database Location                                               | Purpose                               |
| ------------------- | ----------------- | --------------------------------------------------------------- | ------------------------------------- |
| **Spec Kit Memory** | `spec_kit_memory` | `.opencode/skill/system-spec-kit/database/context-index.sqlite` | **Conversation** context preservation |


### Code Search Tools

Use these native tools:

- **Grep** (Lexical): "Find 'TODO' comments" returns text pattern matches
- **Glob** (Files): "Find all .ts files" returns file paths
- **Read** (Content): Read file contents for detailed analysis


### Native Skills Setup

Skills are **natively supported** in OpenCode v1.0.190+. Auto-discovered from `.opencode/skill/*/SKILL.md`.

- [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP - AGENTS.md): Configure AI agent guardrails
- [SET-UP - Skill Advisor.md](.opencode/install_guides/SET-UP - Skill Advisor.md): Configure intelligent skill routing
- [SET-UP - Skill Creation.md](.opencode/install_guides/SET-UP - Skill Creation.md): Create custom skills


### Session Behavior Modes

Commands support session-wide behavior flags that affect response verbosity:

| Flag        | Effect                                    | Use When                       |
| ----------- | ----------------------------------------- | ------------------------------ |
| `--brief`   | Concise responses, minimal explanations   | Quick tasks, experienced users |
| `--verbose` | Detailed explanations, reasoning shown    | Learning, complex debugging    |
| `--debug`   | Maximum diagnostic output, all tool calls | Troubleshooting, verification  |

**Example:** `/spec_kit:implement --brief "add validation"` or `/spec_kit:debug --verbose`


---


## 8. 🎯 WHAT'S NEXT?


### First Session Checklist

- [ ] Run `opencode` in your project
- [ ] Try `/spec_kit:complete add-login` to create your first documented feature
- [ ] Use `/memory:save` at the end of your session
- [ ] Start a new session and try `/memory:context "login"` to see persistence


### Going Deeper

- **Full installation**: [.opencode/install_guides/README.md](.opencode/install_guides/README.md)
- **MCP server setup**: [.opencode/install_guides/](.opencode/install_guides/) (includes install scripts)
- **Creating skills**: [SET-UP - Skill Creation.md](.opencode/install_guides/SET-UP - Skill Creation.md)
- **Agent configuration**: [SET-UP - AGENTS.md](.opencode/install_guides/SET-UP - AGENTS.md)


### Get Help

- **GitHub Issues**: Report bugs and request features
