# Skilled - Agent Orchestration w/ Custom Spec Kit & Memory System

| Core layer | What it adds |
| --- | --- |
| 📋 **Spec Kit Framework** | Structured plans, task tracking, validation gates, and handover docs |
| 🧠 **Cognitive Memory** | Local-first project memory for decisions, context, and continuity |
| ⚛️ **Hybrid RAG + Smart Graph** | Retrieval that blends semantic search with graph-aware project context |
| 🔍 **Code Graph** | Callers, imports, impact paths, and Code Graph + Grep code discovery |
| 🤖 **12 Specialized Agents** | Focused roles for implementation, review, research, docs, git, and more |
| 🎯 **20 On-Demand Skills** | Skill Advisor routing for the right workflow at the right time |

**Reasons to try it**

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

- Works with **Opencode**, **Codex**, and **Claude Code**
- Supports external CLI agent orchestration without unnecessary MCPs or proxies
- Designed to be modular, readable, and easy to adapt to your own stack

> Don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

---

<!-- ANCHOR:table-of-contents -->

## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)
- [QUICK START](#2--quick-start)
- [FEATURES](#3--features)
  - [SPEC KIT DOCUMENTATION](#spec-kit-documentation)
  - [MEMORY ENGINE](#memory-engine)
  - [CODE GRAPH](#code-graph)
  - [SKILL ADVISOR](#skill-advisor)
  - [DEEP LOOP](#deep-loop)
  - [SKILLS LIBRARY](#skills-library)
  - [AGENT NETWORK](#agent-network)
  - [COMMANDS](#commands)
  - [CODE MODE MCP](#code-mode-mcp)
- [CONFIGURATION](#4--configuration)
- [FAQ](#5--faq)
- [RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->

&nbsp;

## 1. OVERVIEW

### What This Framework Does

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Decisions, trade-offs, the carefully reasoned choices behind them, all lost the moment the conversation window closes. This framework fixes that.

The framework adds four layers on top of the base platform:

1. **Structured documentation** (Spec Kit) - every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.
2. **Cognitive memory** (MCP server) - a local-first memory engine storing decisions, context and project history in a searchable database. Like a personal librarian who remembers every conversation.
3. **Code intelligence** (Code Graph) - structural graph indexing handles callers, imports and impact analysis.
4. **Coordinated agents and skills** - 12 specialized agents routed by a gate system that loads the right skills at the right time.


### How It All Connects

```
                         YOUR REQUEST
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │       GATE SYSTEM (3 mandatory gates)    │
         │                                          │
         │  Gate 1: Context     Gate 2: Skills      │
         │  Surface relevant    Auto-load the right │
         │  prior memory        domain expertise    │
         │                                          │
         │  Gate 3: Spec Folder (HARD BLOCK)        │
         │  Every file change needs documentation    │
         └──────────────────────┬───────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌───────────────┐          ┌──────────────────┐
         │ AGENT NETWORK │          │  SKILLS LIBRARY  │
         │ 12 specialized│          │ 20 domain skills │
         │ agents with   │◄────────►│ auto-loaded by   │
         │ routing logic │          │ task keywords    │
         └───────┬───────┘          └────────┬─────────┘
                 │                           │
                 ▼                           ▼
         ┌──────────────────────────────────────────┐
         │          NATIVE MCP TOPOLOGY             │
         │  5 native servers - each one a separate  │
         │  process and MCP boundary                │
         │                                          │
         │  mk-spec-memory      context + memory    │
         │  mk_skill_advisor     skill routing      │
         │  mk_code_index        structural graph   │
         │  code_mode            external tools     │
         │  sequential_thinking  reasoning helper   │
         │                                          │
         │  Shared contract: hybrid retrieval +     │
         │  startup payload via runtime hooks       │
         └──────────────────────┬───────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │     SPEC KIT (documentation framework)   │
         │  specs/###-feature/ - scratch/           │
         │  4 levels - template set - 38 rules      │
         │  nomic-v1.5 (Ollama) │ HF Local │ Voyage │
         └──────────────────────────────────────────┘
```

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->

---

## 2. QUICK START

### Installation

**Prerequisites:** Node.js 18+ with `npm`, `git` and a POSIX shell. The launcher binaries vendor their own dependencies on first run, so you do not need TypeScript or `tsc` installed globally.

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git
cd opencode--spec-kit-skilled-agent-orchestration

# 2. Install root dependencies (file watcher + shared HTTP utilities)
npm install

# 3. Boot the native MCP servers via their committed launchers
# Each launcher is a self-contained .cjs that vendors its own deps on first run.
node .opencode/bin/mk-spec-memory-launcher.cjs --help
node .opencode/bin/mk-skill-advisor-launcher.cjs --help
node .opencode/bin/mk-code-index-launcher.cjs --help
```

The native MCP servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`) ship as committed launcher binaries under `.opencode/bin/`. They self-vendor their dependencies on first run and the checked-in runtime configs already point at them, so there is no separate build step. Launcher reliability (owner-disposal relaunch, lease-probe reap, mk-code-index reconnect, default-on daemon re-election and a single-writer database lock with `SPECKIT_DB_LOCK_DISABLE=1` as the kill switch) is operator-tunable and documented in [`ENV_REFERENCE.md`](.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md).

The three daemons also expose full-parity CLI front doors (`spec-memory.cjs` 39 tools, `code-index.cjs` 8, `skill-advisor.cjs` 9, mutations gated behind `--trusted`): use MCP as the primary in-session transport and the CLIs for hooks, cron, CI and shell diagnostics, per [`daemon_cli_reference.md`](.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md). Idle self-exit, a dry-run-first orphan-process sweeper and worktree-per-session isolation scripts (each session gets its own `SPEC_KIT_DB_DIR`, `SPECKIT_CODE_GRAPH_DB_DIR` and `SPECKIT_IPC_SOCKET_DIR`) live under `.opencode/bin/` and `.opencode/scripts/`; see the [Repo Scripts Runbook](.opencode/scripts/README.md).

### Set Up Embedding Provider

Choose an embedding provider:

```bash
# Default when no cloud keys are set: nomic-embed-text-v1.5 (768 dim)
# served by a local Ollama HTTP endpoint. Pull the model once:
#   ollama pull nomic-embed-text:v1.5
# Option A: Voyage AI (cloud, requires API key, opt-in only)
export VOYAGE_API_KEY="your-key-here"

# Option B: OpenAI embeddings (cloud, requires API key)
export OPENAI_API_KEY="your-key-here"

# Option C: HuggingFace Local (free, CPU/ONNX fallback when Ollama is unavailable)
# Auto-detected when the Ollama probe fails and no cloud keys are set
```

### Verify Installation

```bash
# Confirm the launcher binaries respond
node .opencode/bin/mk-spec-memory-launcher.cjs --help
node .opencode/bin/mk-skill-advisor-launcher.cjs --help
node .opencode/bin/mk-code-index-launcher.cjs --help

# Confirm the active runtime's MCP config references the launchers
# (only the runtime you use needs to exist. .codex/config.toml ships in the repo)
grep -l 'mk-spec-memory\|mk_skill_advisor\|mk_code_index' \
  opencode.json .claude/mcp.json .codex/config.toml .vscode/mcp.json 2>/dev/null
```

### First Use

Open OpenCode in your project directory. The framework is active. Try:

```
/speckit:complete Build a user authentication system
```

This creates a spec folder, runs research, builds a plan and begins implementation - all with memory saved automatically. When you come back tomorrow, the memory engine remembers everything.

### Adapting to Your Stack

This repo ships as a public template. Of the shipped skills, `sk-code` carries the stack-specific patterns (frontend framework, animation library, CMS, backend language). Start there when forking. The other shipped skills (`system-spec-kit`, `sk-doc`, `sk-git`, `sk-code-review`, the `deep-loop-workflows` loops, `deep-loop-runtime`, the `cli-*` orchestrators) are codebase-agnostic out of the box and work for any project without modification. Most teams will also add their own skills on top. Drop them into `.opencode/skills/<your-skill>/` and they'll be picked up automatically.

See [§4 Customizing for Your Stack](#customizing-for-your-stack) for the full customization map and step-by-step adaptation guide.

### Code-Graph Indexing

The standalone `mk_code_index` MCP server indexes **your project's production code** by default, not the framework backend. End users inherit this behavior automatically through the committed config defaults. See [§4 Maintainer-Mode Code-Graph Flags](#maintainer-mode-code-graph-flags-already-disabled-for-end-users) only if you're contributing upstream.

<!-- /ANCHOR:quick-start -->


<!-- ANCHOR:features -->

---

## 3. FEATURES

### 📋 Spec Kit Documentation

The Spec Kit enforces structured spec folders for every file-modifying conversation. Gate 3 requires a spec folder answer before any file modification begins (only typo/whitespace fixes under 5 characters are exempt).

#### Documentation Levels

Documentation depth scales with task complexity.

| Level  | LOC Guidance   | Required Files                                                          | When to Use                                                              |
| ------ | -------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **1**  | < 100          | spec.md, plan.md, tasks.md, implementation-summary.md                   | Small features, bug fixes, single-file changes                           |
| **2**  | 100 - 499      | Level 1 + checklist.md                                                  | Features needing QA verification, multi-file changes                     |
| **3**  | 500+           | Level 2 + decision-record.md                                            | Architecture changes, complex refactors                                  |
| **3+** | Complexity 80+ | Level 3 + approval workflow, compliance checkpoints, stakeholder matrix | High-complexity work needing review tracking and workstream coordination |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.

&nbsp;
#### Spec Folder Structure

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and memory tracking metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── resource-map.md              # Optional path ledger of resources the packet touched
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

`resource-map.md` is optional at any level. Render it from `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` when a packet wants a lean, central listing of the files, scripts and external resources it interacts with. Deep-research and deep-review loops emit it automatically next to `review-report.md`.

&nbsp;
#### Checklist Priority System

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

- **P0** - Hard blocker. Cannot ship without this. Cannot defer.
- **P1** - Required. Must complete or get explicit user approval to defer.
- **P2** - Optional. Nice to have. Can defer without approval.

&nbsp;
#### Phase Decomposition

Phase decomposition splits large features into a parent spec folder (overall specification) and child folders (one per phase).

```text
specs/022-big-feature/             # Parent spec folder
├── spec.md                        # Overall specification
├── 001-data-model/                # Phase 1 child
│   ├── spec.md
│   └── ...
├── 002-api-endpoints/             # Phase 2 child
│   ├── spec.md
│   └── ...
└── 003-frontend/                  # Phase 3 child
    ├── spec.md
    └── ...
```

Use `create.sh --phase` to create a parent with its first child in one step. Run `validate.sh --recursive` to validate the parent and all children together.

&nbsp;
#### Validation

The `validate.sh` script runs 38 rules against a spec folder and reports what passes and what needs fixing. Rules check for required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

- **Exit 0** - All rules pass. Ready to proceed.
- **Exit 1** - User error (bad flags or invalid input).
- **Exit 2** - Validation error. Must fix before claiming completion.
- **Exit 3** - System error (file I/O failure, missing manifest or other environment problem).

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders. Strict validation of a Level 3 packet runs in ~108 ms via a single-orchestrator design. The default scaffold path skips post-create validation. Set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows. Path traversal inputs (e.g. `--path "../etc/passwd"`) are rejected before any filesystem write. Parallel `/memory:save` calls for the same packet are serialized by an advisory lock on `description.json` and `graph-metadata.json`.

&nbsp;
#### Scripts and Validation

**Spec Management Scripts** (in `.opencode/skills/system-spec-kit/scripts/spec/`):

- **`create.sh`** - Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - Run 38 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - Upgrade a spec folder to a higher level by injecting new sections
- **`recommend-level.sh`** - Analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - Calculate spec folder completeness as a percentage
- **`check-completion.sh`** - Verify all completion criteria are met
- **`check-placeholders.sh`** - Find remaining `[PLACEHOLDER]` values after level upgrade

**Memory Scripts** (in `.opencode/skills/system-spec-kit/scripts/memory/`):

- **`generate-context.ts`** - Primary workflow for updating packet continuity and supporting generated context artifacts
- **`backfill-frontmatter.ts`** - Add missing frontmatter to existing generated context artifacts and indexed spec docs
- **`reindex-embeddings.ts`** - Rebuild embedding vectors for stored memories
- **`cleanup-orphaned-vectors.ts`** - Remove vector entries with no matching memory
- **`rebuild-auto-entities.ts`** - Regenerate auto-extracted entity catalog
- **`validate-memory-quality.ts`** - Run quality checks on stored memory content

TypeScript sources compile to `.opencode/skills/system-spec-kit/scripts/dist/`. The runtime entry point for memory saves is `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`.

&nbsp;
#### Gate System

3 mandatory gates run before any file change. Every request passes through the same sequence.

```
  User message arrives
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 1: Understanding (SOFT BLOCK)         │
  │  memory_match_triggers() surfaces context   │
  │  Classify intent: Research / Implementation │
  │  confidence >= 0.70, uncertainty <= 0.35     │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 2: Skill Routing (REQUIRED)           │
  │  advisor_recommend recommends skill         │
  │  confidence >= 0.8 ─► MUST load skill        │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 3: Spec Folder (HARD BLOCK)           │
  │  Only if file modification detected           │
  │  A) Existing  B) New  C) Update             │
  │  D) Skip      E) Phase folder               │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
              EXECUTION
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Post-Rules                                 │
  │  Memory Save ─ must use generate-context.js │
  │  Completion ─ verify checklist.md items     │
  └─────────────────────────────────────────────┘
```

**Analysis Lenses** - applied silently on every request:
- **CLARITY** - Is this the simplest solution? Are abstractions earned?
- **SYSTEMS** - What does this touch? What are the side effects?
- **BIAS** - Is the user solving a symptom? Is the framing correct?
- **SUSTAINABILITY** - Will future developers understand this?
- **VALUE** - Does this change behavior or just refactor?
- **SCOPE** - Does solution complexity match problem size?

For the full spec folder workflow, Level contract template architecture, gate definitions and anti-pattern detection rules, see the [→ Spec Kit README](.opencode/skills/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).

---

### 🧠 Memory Engine

The Memory Engine is a local-first cognitive memory system built as an MCP server. `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder. Canonical continuity lives in the spec packet itself: use `/speckit:resume` as the recovery surface, then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs. The MCP server indexes those packet-local sources with vector embeddings, BM25 and FTS5 full-text search. `memory_match_triggers()` can still surface relevant prior context automatically when deeper retrieval is needed.

`/memory:save` refreshes packet metadata on every invocation. `session_resume` binds `args.sessionId` to transport caller context by default. Set `MCP_SESSION_RESUME_AUTH_MODE=permissive` for rollout canaries. Copilot and Claude share the same compact-cache provenance path.

The memory engine works with session lifecycle surfaces and hybrid retrieval. Structural code indexing now lives in the standalone [`system-code-graph`](.opencode/skills/system-code-graph/) skill and MCP server.

Expired ephemeral rows are cleaned by a retention sweep on startup and hourly by default. Use `memory_retention_sweep` for manual or dry-run cleanup. The handler is defined at [memory-retention-sweep.ts](.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts), with `SPECKIT_RETENTION_SWEEP` and `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` controlling the background interval.

The full MCP API reference is in the [MCP Server README](.opencode/skills/system-spec-kit/mcp_server/README.md).

&nbsp;
#### Layered MCP Surface

The `mk-spec-memory` tools are organized into a layered architecture. Code graph and skill-advisor tools moved to standalone MCP servers, so this table covers memory-owned tools only:

| Layer  | Name            | Tools  | Token Budget | Purpose                                                                      |
| ------ | --------------- | ------ | ------------ | ---------------------------------------------------------------------------- |
| **L1** | Orchestration   | 3      | 2,000        | Unified context, resume and bootstrap entry points                           |
| **L2** | Core            | 3      | 1,500        | Search, trigger matching, save                                               |
| **L3** | Discovery       | 4      | 800          | List, stats, health checks and session readiness                             |
| **L4** | Mutation        | 6      | 500          | Delete, update, validate, bulk cleanup, retention sweep, embedding reconcile |
| **L5** | Lifecycle       | 4      | 600          | Checkpoints and lifecycle state                                              |
| **L6** | Analysis        | 7      | 1,200        | Causal graph (link/unlink/stats/drift_why), quick search, evaluations and dashboards |
| **L7** | Maintenance     | 7      | 1,000        | Memory index scans (run/status/cancel), async ingest and learning history    |
| **L8** | Embedder        | 3      | 400          | Embedder list, set and status                                                |
| **L9** | Task            | 2      | 300          | Task preflight and postflight                                                |
| **—**  | Moved Surfaces  | 0      | -            | Code graph → `mk_code_index`; advisor + skill graph → `mk_skill_advisor`; coverage + council graph → `deep-loop-runtime` CLI scripts (not MCP tools) |
|        | **Total**       | **39** | **~8,300**   |                                                                              |

Lower layers load only when needed. L1 is always available. L2 loads for any search. L3-L7 load based on the specific command being used. The same 39 tools are also exposed 1:1 by the `spec-memory.cjs` daemon-backed CLI front door for hooks, cron, CI and shell diagnostics.

&nbsp;
#### Hybrid Search

Every search checks five core channels at once:

- **Vector** - Semantic similarity via embeddings. Finds related content when words differ.
- **FTS5** - Full-text search on exact words and phrases.
- **BM25** - Keyword relevance scoring.
- **Causal Graph** - Follows cause-and-effect links between memories.
- **Degree** - Scores by graph connectivity, weighted by edge type.

**Reciprocal Rank Fusion (RRF)** combines results across channels so memories scoring well in multiple channels rise to the top. **Graph-first routing** dispatches structural queries to the standalone Code Graph first, then the memory pipeline. A **3-tier FTS fallback** activates when those channels miss: FTS5 full-text, BM25 keyword scoring, then Grep/Glob filesystem search. The system truncates weak results and ensures every active channel is represented.

&nbsp;
#### Search Pipeline

Every search passes through 4 stages:

- **Candidate generation** - Parallel retrieval from the active channels plus constitutional injection where applicable.
- **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights and graph/session boosts when enabled.
- **Rerank** - MMR diversity reranking (algorithmic, gated by `SPECKIT_MMR`) with MPAB chunk reassembly and compatibility-only length-penalty wiring that resolves to a neutral `1.0` multiplier.
- **Filtering** - State/quality filtering, confidence annotation, token-budget enforcement and final response shaping without mutating post-rerank scores.

&nbsp;
#### Query Intelligence

- **Complexity routing** - Simple (2 channels), moderate (4), complex (all 5)
- **Intent classification** - 7 public types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`) plus an internal continuity profile for resume-oriented retrieval (`semantic 0.52`, `keyword 0.18`, `recency 0.07`, `graph 0.23`. Stage 3 MMR lambda `0.65`)
- **Query decomposition** - Multi-topic queries split into sub-queries, expanded with related terms
- **Context pressure** - Downgrades search mode at 60% and 80% window usage
- **Fallback strategies** - LLM reformulation or HyDE for low-confidence searches

Four response modes: **quick** (top answer only), **focused** (one-topic), **deep** (full evidence trails), **resume** (state summary + next-steps).

&nbsp;
#### Memory Lifecycle

Memories fade using **FSRS** (Free Spaced Repetition Scheduler). Decay speed varies by content type and importance tier. Critical decisions never fade. Temporary debugging notes fade within days.

- **Cold-start boost** - Fresh memories (under 48h) receive a temporary scoring lift
- **Interference penalty** - Suppresses near-duplicate clusters
- **Auto-promotion** - Memories earn higher tiers through positive validation
- **Negative feedback** - 30-day decay prevents permanent blacklisting

Four active cognitive states drive normal retrieval weighting: **HOT** >> **WARM** >> **COLD** >> **DORMANT**.

&nbsp;
#### Causal Graph

Six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`

- **Typed traversal** - Prioritizes connection types based on query intent
- **Community detection** - Louvain clustering with neighbor boosting
- **Co-activation spreading** - Fan-effect dampening prevents hub bias
- **Temporal contiguity** - Same-session grouping
- **Graph momentum** - Trending knowledge surfaces higher
- **LLM backfill** - Background discovery of missed causal links
- **Index-friendly traversal** - Graph walks run through a shared app-level BFS helper instead of recursive SQL CTEs, returning the same results with far fewer full scans

&nbsp;
#### Trust Badges on Search Results

Every search result ships with a small `trustBadges` block that tells you how reliable the hit is at a glance. The badges are display-only, they read existing causal links and don't add new storage:

| Badge                  | What it tells you                                         |
| ---------------------- | --------------------------------------------------------- |
| `confidence`           | How strong the strongest causal link to this result is    |
| `extractionAge`        | How long ago the supporting evidence was extracted        |
| `lastAccessAge`        | How recently anything in the chain was used               |
| `orphan`               | True when nothing else in the graph points at this result |
| `weightHistoryChanged` | True when the underlying edge weight has been re-tuned    |

If the database is unreachable the formatter quietly skips badges instead of failing. Caller-provided badges pass through untouched. Every response profile (`quick`, `research`, `resume`) keeps the badges on the top result and the result list.

&nbsp;
#### Save Intelligence

When you save new knowledge, **Prediction Error gating** compares it against existing memories and picks one of four outcomes:

- **CREATE** - No similar memory exists. Stored as new knowledge.
- **REINFORCE** - Similar exists, new one adds value. Both kept, old one boosted.
- **UPDATE** - Similar exists, new one is better. Old version replaced.
- **SUPERSEDE** - New knowledge contradicts the old. Old one demoted to deprecated.

Additional save-time processing:

- **Semantic sufficiency gating** - Rejects content too thin to be useful
- **Verify-fix-verify** - Auto-fixes quality issues before storing
- **Content normalization** - Strips formatting clutter for cleaner embeddings
- **Secret scrubbing** - Pre-index redaction with typed `[REDACTED:<kind>]` markers across 13 credential pattern kinds (API keys, tokens, JWTs, private keys, credential assignments). Fail-closed: a scrubber error aborts the save rather than persisting raw text. The scrubber is shared between the MCP save path and the standalone CLI save lane, and `memory_health` surfaces redaction counters
- **Write provenance** - Automated reducer and feedback writers tag their writes with source-kind provenance, so the write-ingress guard enforces the constitutional rule that automated writers never overwrite manual or constitutional memory
- **Idempotency receipts** (flag-gated, `SPECKIT_MEMORY_IDEMPOTENCY`) - Replayed saves return the original response verbatim from immutable first-write receipts; concurrent first-write losers replay the winner with a visible conflict envelope, and expired receipts are swept on a TTL
- **Auto-entity extraction** - Spots tool/project/concept names for cross-linking
- **SHA-256 deduplication** - Skips unchanged files instantly
- **Correction tracking** - Records how knowledge evolves across versions

&nbsp;
#### Session Awareness

- **Working memory** - Tracks current session findings with attention decay
- **Session deduplication** - Suppresses already-seen results in follow-up queries
- **Context pressure** - Downgrades search mode as the context window fills

&nbsp;
#### Quality Gates

Three layered checks before storage:

- **Structure gate** - Format, headings, metadata validation
- **Semantic sufficiency** - Enough real content to be useful
- **Duplicate detection** - Triggers Prediction Error arbitration if similar content exists

Preview all checks without saving using `dryRun: true`. Learned relevance feedback boosts helpful results with safeguards against noise. Two-tier explainability shows plain-language reasons or exact channel contributions.

&nbsp;
#### Retrieval Enhancements

- **Constitutional injection** - Always-surfaced rules appear without asking
- **Hierarchy awareness** - Searches parent and sibling spec folders
- **Entity linking** - Connects memories referencing the same concepts
- **ANCHOR retrieval** - Per-section indexing (~93% token savings)
- **Auto-surfacing** - Triggers on tool use and context compression events
- **Provenance traces** - Shows exactly how each result was found

&nbsp;
#### Indexing and Infrastructure

- **Real-time watching** - Filesystem monitoring via chokidar
- **Incremental indexing** - Content hashes skip unchanged files
- **Embedding retry** - Background worker retries failed embeddings
- **Single-writer database lock** - Exactly one daemon writer per database, enforced by a kernel-level lock that self-releases even on `kill -9`. A losing cold-spawn exits with a dedicated code and the launcher bridges it to the live holder, structurally eliminating the dual-writer corruption class
- **Vector shard self-heal, durably** - A malformed vector shard is detected, quarantined and rebuilt, and the repair intent survives a process restart: boot compares vector rowcount against the index success count to resume a real repair instead of silently attaching an empty shard
- **Memory-safe lexical fallback** - The packed in-memory BM25 engine uses typed-array postings with BM25F per-field weighting (title and trigger matches rank above body noise) inside a 150MB RSS budget, and resolves spec-folder and tier filters before truncating so scoped searches return their real results
- **Lexical fallback** - Text-searchable when embedding services are down
- **Atomic writes** - Crash-safe with pending-file recovery on startup
- **`memory_index_scan` self-maintaining** - Overlapping scans return a `coalesced:true` success envelope instead of a raw error. Rows become BM25/FTS-searchable immediately as `pending` while vectors drain (`complete_with_pending_vectors` status with `pendingVectors` count). Move reconciliation heals renamed spec folders by packet identity without re-embedding. A bounded global orphan sweep runs per scan. `memory_health` gains an `index` block with a summary enum (`healthy_fresh`, `healthy_lagging_vectors`, `stale_needs_scan`, `degraded_needs_repair`, `unavailable`) plus `indexed`, `pending` and `failed` counts.
- **`memory_embedding_reconcile`** - Net-new L4 maintenance tool (shipped 2026-05-27). Converges `embedding_status` for vector-present stale rows and resets genuinely missing-vector retry rows inside one guarded `BEGIN IMMEDIATE` transaction. Dry-run by default; pass `mode: "apply"` to apply.

&nbsp;
#### Evaluation

- **12-metric computation** - MRR, NDCG, MAP and more
- **Ground truth corpus** - 110 test questions with known correct answers
- **Ablation studies** - Per-channel quality impact measurement
- **Offline scoring checks** - Test ranking changes before deployment

&nbsp;
#### Embedding Providers

The mk-spec-memory text embedder layer is pluggable. Swap defaults through the memory embedder controls without touching code. Canonical narrative: [embedder_pluggability.md](.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md).

- **Ollama (nomic-embed-text-v1.5)** - Default since 2026-05-19 (ADR-013/014). Free, local, 768d retrieval-tuned. Pull once with `ollama pull nomic-embed-text:v1.5`.
- **HuggingFace Local** - Fallback when the Ollama probe fails. Free, local, 768d q8 ONNX.
- **Voyage AI** - Cloud opt-in. Set `VOYAGE_API_KEY`. 1024d. Gated by egress guard.
- **OpenAI** - Cloud opt-in. Set `OPENAI_API_KEY`. 1536d.

---

### 🔍 Code Graph

The Code Graph is an indexed relationship map of your code, so the assistant answers structural questions straight from real call and import edges instead of guessing from text: "what calls this?", "what imports this?", "what breaks if we change it?"

The intended routing order is graph-first: the Code Graph resolves structural queries first, then Memory supports session decisions and active-task context after the packet-local recovery sources have been checked. A 3-tier FTS fallback escalates automatically when results are weak.

&nbsp;
#### Default Scope (End-User Code Only)

By default, code-graph scans your repo code only. Five `.opencode/` folders are excluded so end-user search results stay signal-rich:

- `.opencode/skills/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `<active-spec-folder>/**`
- `.opencode/plugins/**`

Maintainers can opt folders back in process-wide with env vars:

```bash
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true       # all skills
SPECKIT_CODE_GRAPH_INDEX_SKILLS=sk-x,sk-y  # only listed skills (csv)
SPECKIT_CODE_GRAPH_INDEX_AGENTS=true
SPECKIT_CODE_GRAPH_INDEX_COMMANDS=true
SPECKIT_CODE_GRAPH_INDEX_SPECS=true
SPECKIT_CODE_GRAPH_INDEX_PLUGINS=true
SPECKIT_CODE_GRAPH_DB_DIR=/path/to/code-graph-db # optional DB-dir override
```

Per-call args override env vars when provided. Env vars apply only for fields omitted from the scan call:

```ts
code_graph_scan({
  includeSkills: ['sk-code-review', 'sk-doc'], // granular: only these skills
  includeAgents: true,                         // all .opencode/agents/**
})
```

Existing v1 scans trigger a blocked read with `requiredAction:"code_graph_scan"` until you re-run the scan. See [system-code-graph README §8 SCAN SCOPE](.opencode/skills/system-code-graph/README.md#8-scan-scope) for the full scan-scope rules and precedence details.

&nbsp;
#### How the Code Graph Works

The Code Graph is a SQLite-backed structural index owned by `.opencode/skills/system-code-graph/` and registered as the standalone `mk_code_index` MCP server. MCP callers use the `mcp__mk_code_index__*` namespace. Runtime config parity is mixed across clients during the rename transition, so docs use the canonical `mk_code_index` surface while follow-on config work handles remaining legacy bindings.

**Startup injection.** When the MCP server starts, it initializes the `code-graph.sqlite` database, runs a non-blocking startup scan and activates a file watcher. Two supported runtimes (Claude Code, Codex CLI) transport the same compact startup shared-payload through their runtime hooks (`session-prime.ts` on Claude, `session-start.ts` on Codex). Codex requires `[features].codex_hooks = true` opt-in for native hooks. Copilot CLI uses file-based custom instructions with a limited cache and writer path. It refreshes a managed block but does not inject model-visible context during the precompute phase. The payload includes a one-line health summary, `graphQualitySummary` (detector provenance + edge-enrichment summary) and the `sharedPayloadTransport` envelope so downstream consumers receive identical structural context regardless of runtime. `session_bootstrap()` remains available as a manual recovery surface when native hooks are disabled.

**Auto-indexing.** The graph stays current through three mechanisms:
1. **Startup scan** - indexes on server boot (async, non-blocking)
2. **File watcher** - Chokidar monitors spec and source folders with a 2-second debounce, reindexing changed files in real time
3. **Lazy refresh** - `code_graph_query` calls `ensureCodeGraphReady()` which detects staleness and triggers a bounded inline refresh before returning results

The indexer uses tree-sitter to parse source files and extract functions, classes, imports and call relationships. It tracks per-file content hashes to skip unchanged files, making incremental scans fast.

&nbsp;
#### Readiness & Response Contract

`code_graph_query` and `code_graph_context` share a readiness-aware response contract. When the graph is fresh enough, both return `status: "ok"` with resolved results plus a `readiness` / `canonicalReadiness` / `trustState` block. When readiness requires a full scan that cannot run inline, both return an explicit **`status: "blocked"`** payload naming `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, `degraded` and `graphAnswersOmitted` instead of silently returning empty results. Callers should run `code_graph_scan` before retrying.

Success payloads of `code_graph_context` carry structured `data.metadata.partialOutput` (`isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText`) and an explicit `deadlineMs` field so callers can distinguish a complete answer from one trimmed by deadline or budget pressure. `code_graph_status` exposes `graphQualitySummary` (detector provenance + edge-enrichment confidence). CALLS queries on ambiguous subjects (e.g. `handle*`) prefer callable implementation nodes over wrapper-shadow candidates and return ambiguity / selected-candidate metadata so callers can audit the choice.

&nbsp;
#### Edge Explanations and Better Blast Radius

Relationship answers from `code_graph_query` include short `reason` and `step` fields alongside confidence and provenance, so you can see *why* an edge is there instead of just *that* it exists. `code_graph_context` carries those same fields through to structured edges and text briefs.

`blast_radius` keeps the prior payload (affected files, source files, hot files, multi-file union, depth) and adds:

- **`depthGroups`**: affected nodes bucketed by how far they sit from the change
- **`riskLevel`**: `high` when the subject is ambiguous or fans out to more than 10 things at depth one, `medium` for 4–10, `low` otherwise
- **`minConfidence`** filter, drop traversals below a confidence floor
- **`ambiguityCandidates`**: list of plausible matches when the subject can't be resolved
- **`failureFallback`**: structured info instead of a bare error string when resolution can't continue

All of this rides inside the existing `code_edges.metadata` JSON blob, no SQLite schema changes.

&nbsp;
#### `detect_changes`: Preflight Impact Check

`detect_changes` is a read-only Code Graph tool that takes a diff and tells you which symbols and files it touches. It runs alongside `code_graph_scan`, `code_graph_query`, `code_graph_status` and `code_graph_context`.

You hand it `{ diff: string, rootDir?: string }`. It walks each diff hunk, overlaps the line ranges with stored symbols and returns `{ status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`.

Safety is non-negotiable: the tool checks the graph is fresh before parsing the diff. If the graph is stale or unavailable, it returns `status: 'blocked'` immediately, so an out-of-date index never produces a false "nothing impacted" answer. Inline indexing is explicitly disabled here, so the read-only contract is enforced.

Under the hood the scan runner is split into four declared phases (`find-candidates` → `parse-candidates` → `finalize` → `emit-metrics`) for clearer instrumentation, with no SQLite schema changes.

&nbsp;
#### Apply-Pipeline Safety

Mutating graph maintenance (`code_graph_apply`) runs behind layered guards. Destructive operations require an unconditional confirm gate **before** any snapshot or mutation; pre-dispatch refusals name the `requiredAction` instead of churning a rollback; operator rollbacks select a run-scoped target (never the snapshot the failing run just took), and dry-run previews the exact rollback target through the same selection logic. Snapshot retention prunes only after a committed apply and never touches protected known-good directories. The CLI front door refuses a bare `apply` without explicit mutation intent (an operation, `--dry-run`, or an explicit env opt-in), so a default rescan can never fire by accident. The same 8 tools are exposed 1:1 by the `code-index.cjs` daemon-backed CLI.

The code graph runtime has its own feature catalog and operator playbook under [system-code-graph/feature_catalog](.opencode/skills/system-code-graph/feature_catalog/) and [system-code-graph/manual_testing_playbook](.opencode/skills/system-code-graph/manual_testing_playbook/). They document runtime features and manual scenarios for freshness, scan/verify/status, `detect_changes`, context retrieval, and doctor-code-graph behavior.

&nbsp;
#### What Each System Does

| System                   | Best for                                                                   | Primary surface                                                                  |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Code Graph**           | Callers, imports, symbol outlines, impact analysis, neighborhood expansion | `mcp__mk_code_index__code_graph_*`, `mcp__mk_code_index__detect_changes` |
| **Session bridge tools** | Session bootstrap, resume and health checks around graph availability      | `session_bootstrap`, `session_resume`, `session_health`                          |

&nbsp;
#### How Query Routing Works (Graph-First)

The default routing order is: **Code Graph** (structural) -> **Memory** (session/decision context). This graph-first approach tries structural resolution first, with a 3-tier FTS fallback when earlier stages miss.

- Use the **Code Graph** first for structural questions: callers, callees, imports, hierarchy, file outlines and reverse impact.
- Use **session tools** when recovering or checking environment readiness, but treat `/speckit:resume` as the canonical operator-facing recovery surface.
- Rebuild task continuity in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs.
- Use **Memory** after those packet-local sources when the question is about prior decisions, spec history, handovers or task continuity that still needs deeper retrieval.

&nbsp;
#### Why It Matters

Structural search answers relationship questions that text matching cannot. Instead of "this code looks relevant", the Code Graph tells you how it connects: which functions call it, which files import it and what breaks if you change it. That turns impact analysis from a guess into a lookup.

For the full code-graph tool and architecture reference, see the [`system-code-graph` skill](.opencode/skills/system-code-graph/SKILL.md) and [system-code-graph README](.opencode/skills/system-code-graph/README.md). Shared memory and lifecycle details stay in [`.opencode/skills/system-spec-kit/README.md`](.opencode/skills/system-spec-kit/README.md).

---

### 🎯 Skill Advisor

The Skill Advisor matches what you type to the right skill before any tool runs. It is now a standalone MCP server named `mk_skill_advisor`, packaged under `.opencode/skills/system-skill-advisor/mcp_server/`. The server registers nine tools: eight on the public surface (four `advisor_*` tools for routing, freshness, rebuild and validation, plus four `skill_graph_*` tools for scan, query, status and graph validation), plus one internal propagation tool. A small Python compatibility shim still works as a fallback when the native path is unavailable.

#### How It Works

```
  YOU TYPE: "use chrome-devtools to inspect a page"
                      │
                      ▼
           ┌──────────────────────┐
      1.   │  NORMALIZE           │  Clean up the prompt, never store
           │                      │  the raw text
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      2.   │  5-LANE FUSION       │  Explicit author signals 0.42
           │                      │  Lexical match 0.28
           │                      │  Causal graph 0.13
           │                      │  Derived hints 0.12
           │                      │  Semantic evidence 0.05
           └──────────┬───────────┘
                      ▼
      ┌───────────────────────────────┐
      │  3. FRESHNESS + LIFECYCLE     │  Is each candidate still alive?
      │                               │  live / stale / absent / archived
      │  Reads SQLite skill graph     │  with redirect metadata
      │  + generated metadata         │  Falls open on errors
      └───────────────┬───────────────┘
                      ▼
           ┌──────────────────────┐
      4.   │  VALIDATE + FILTER   │  Apply confidence + uncertainty
           │                      │  thresholds, cache the trust
           │                      │  envelope
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      5.   │  RENDER              │  Either a one-line hook brief
           │                      │  or a JSON recommendation list
           └──────────┬───────────┘
                      ▼
                RESULT:
           advisor_recommend -> list of skill recommendations
           hook adapter -> "Advisor: live, use ..."
           shim fallback -> legacy JSON
```

&nbsp;
#### Native Package Layout

```text
.opencode/skills/system-skill-advisor/mcp_server/
├── bench/      benchmarks
├── compat/     stable compatibility entry for runtimes
├── handlers/   the nine MCP tool handlers (8 public + 1 internal)
├── lib/        scorer, normalizer, freshness, cache
├── schemas/    JSON + Zod schemas
├── tests/      test suite
└── tools/      tool registration
```

| Tool                | What it does                                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `advisor_recommend` | Recommends skills for a prompt with lane breakdown, lifecycle redirects and a freshness trust signal. Returns the workspace root and the effective thresholds it used.                                                                      |
| `advisor_rebuild`   | Rebuilds the advisor skill graph when `advisor_status` reports stale, absent or unavailable state. `force:true` rebuilds even when live.                                                                                                    |
| `advisor_status`    | Reports freshness, generation, trust state, lane weights, skill count, last scan time and background daemon status.                                                                                                                         |
| `advisor_validate`  | Runs measurement slices: corpus accuracy, holdout, parity, safety, latency. Surfaces the workspace root, effective thresholds, threshold semantics (aggregate vs runtime) and prompt-safe outcome counts (accepted / corrected / ignored).  |
| `skill_graph_scan` | Indexes skill metadata into the advisor-owned skill graph surface. |
| `skill_graph_query` | Queries skill graph relationships such as dependencies, families, hubs, conflicts and subgraphs. |
| `skill_graph_status` | Reports graph counts, families, categories, staleness, validation and database status. |
| `skill_graph_validate` | Validates schema drift, broken edges, reciprocal symmetry and dependency-cycle issues. |

&nbsp;
#### How Runtimes Talk To It

- **Claude Code, Codex CLI**: call prompt-time hook adapters under `.opencode/skills/system-spec-kit/mcp_server/hooks/`. Codex CLI requires `[features].codex_hooks = true` opt-in for native hooks. Copilot CLI uses file-based custom instructions for the startup-surface path only.
- **OpenCode**: uses `.opencode/plugins/mk-skill-advisor.js` with `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`, which imports the stable compat entry under `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts`.
- **Codex cold starts**: the Codex prompt hook emits a prompt-safe stale advisory plus `{"stale":true,"reason":"timeout-fallback"}` when startup context times out. The smoke helper lives at [freshness-smoke-check.ts](.opencode/skills/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts).
- **Disable everywhere**: set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to turn off all prompt-time advisor surfaces.
- **Threshold contract at the prompt**: confidence ≥ 0.8 and uncertainty ≤ 0.35 by default.
- **CLI front door**: `skill-advisor.cjs` exposes the same 9 tools over the warm daemon for hooks, cron and shell diagnostics; mutation commands (`advisor_rebuild`, `skill_graph_scan`) are gated behind `--trusted`.
- **Launcher resilience**: the advisor launcher carries the same owner lease and reconnecting session proxy as the spec-memory and code-index launchers, and acts on dead-socket respawn decisions under a bootstrap lock — a hung daemon is reaped and replaced instead of stranding the session or spawning a second writer.

&nbsp;
#### Validation and Testing

- `advisor_validate({"skillSlug":null})` returns measured corpus / holdout / parity / safety / latency slices plus prompt-safe outcome totals.
- Python compatibility regression harness: checked-in dataset and pass/fail totals are reported by `skill_advisor_regression.py`.
- Native package: 23 advisor test files, 167 tests.
- Manual testing playbook: 42 scenario files spanning native MCP tools, runtime hooks, the OpenCode plugin, compatibility controls, auto-indexing, lifecycle routing, scorer fusion and operator-state edge cases.
- Hook diagnostics write to bounded JSONL sinks under the temp metrics root. The validator reads those sinks back across processes.

&nbsp;
#### Affordance Evidence

Callers can pass structured tool and resource hints, `skillId`, `name`, `triggers[]`, `category`, `dependsOn[]`, `enhances[]`, `siblings[]`, `prerequisiteFor[]`, `conflictsWith[]`, as affordance evidence. A normalizer strips URLs, emails, token-shaped fragments, control characters and instruction-shaped strings before the scorer sees anything. Free-form `description` text is ignored on purpose. Sanitized triggers feed the existing derived-hints lane at reduced weight. Normalized relations become temporary edges in the existing causal-graph lane reusing the standard relation multipliers (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`). No new scoring lane, no new entity kind, no raw matched phrases in recommendation payloads, evidence labels stay as stable `affordance:<skillId>:<index>` identifiers.

For details, see the [Skill Advisor README](.opencode/skills/system-skill-advisor/README.md).

---

### 🔄 Deep Loop

The Deep Loop system runs autonomous, iterative agent workflows. Each loop dispatches a fresh-context worker against externalized state, then keeps going until a convergence check, not the agent's own claim, decides a stop is safe. Five loop families (context, research, review, AI council, improvement) live as nested mode packets inside one parent skill, `deep-loop-workflows`, and all run on one shared runtime, `deep-loop-runtime`, so they share a state format, a stop contract and a coverage model. The improvement family alone carries four co-equal lanes (agent improvement, model benchmark, skill benchmark, non-dev AI system refine), giving eight `/deep:*` loop commands in total.

#### How It Works

```
  /deep:<mode>  ─►  INIT / RESUME / RESTART
                              │  anchor to a real spec.md, load JSONL state + lineage
                              ▼
        ┌───────────────────────────────────────────┐
        │  DISPATCH ITERATION (fresh context)       │ ◄────────┐
        │  one pass, one agent, no carry-over       │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
        ┌───────────────────────────────────────────┐          │  next
        │  WRITE STATE  deep-*-state.jsonl          │          │  iteration
        │  deltas/ + logs/ (atomic append)          │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
        ┌───────────────────────────────────────────┐          │
        │  REDUCE + SCORE                           │          │
        │  parse terminal events, Bayesian score,   │          │
        │  coverage-graph convergence guards        │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
                  CONVERGED  +  quality gates pass? ───  no  ──┘
                             │ yes
                             ▼
                  legal_stop_evaluated ─► SYNTHESIZE + write-back
```

&nbsp;
#### Deep Loop Runtime (the shared foundation)

One engine under every loop, so they all work the same way and you learn the workflow once.
- **Consistent across loops:** context, research, review, council and improvement all dispatch, track and stop the same way
- **Pause and resume anytime:** progress is saved outside the chat, so a loop survives crashes, new sessions and long runs
- **Trustworthy stops:** a loop ends only when the work has actually converged and passed its quality checks, never because an agent says it is done
- **Hands-off or step-by-step:** run fully autonomous with `:auto` or pause at each step with `:confirm`, and start fresh, resume or restart at will
- **Self-contained and MCP-free:** the runtime declares its own dependency manifest and resolves `zod`, `better-sqlite3` and the `tsx` loader from its own `node_modules`, with no reach-ins into a sibling skill. It carries executor config, atomic state, scoring, fallback routing and the coverage / council graph scripts

&nbsp;
#### Deep Research

Investigates a question for you, one focused pass at a time, until the answers hold up. `/deep:research` runs `@deep-research`.
- **Knows when it's done:** stops once findings stabilize, not after a fixed number of tries
- **Won't quit early:** keeps going until the question is covered from enough angles and sources
- **Remembers dead ends:** ruled-out directions are saved, so you never re-investigate them
- **Builds a written answer:** results land in a growing `research/research.md` you can read as it works

&nbsp;
#### Deep Review

Audits your code in passes and never edits it. `/deep:review` runs `@deep-review`.
- **Fix what matters first:** every issue is ranked P0/P1/P2 across correctness, security, traceability and maintainability
- **Fewer false alarms:** each critical finding gets re-challenged before it sticks
- **Won't sign off on hidden problems:** an open P0 forces another pass, and the audit must clear its quality checks before it can stop
- **Clear verdict:** a `review-report.md` that ends in PASS, CONDITIONAL or FAIL

&nbsp;
#### Deep Context

Maps the existing codebase before you plan, so you extend what's already there instead of rewriting it. `/deep:context` runs `@deep-context`, and `:with-context` adds it to `/speckit:plan` and `/speckit:complete`.
- **Reuse first:** the top of every Context Report is a catalog of existing `file:symbol` pointers to extend, compose or wrap
- **Many models, one scope:** a heterogeneous pool (native agents plus cli models) sweeps the same code in parallel, and agreement across models drives confidence
- **Pointers, not dumps:** it ships verified references instead of pasted source, so planning context stays sharp rather than bloated
- **Knows when it's done:** stops on relevance-gated coverage saturation, with cross-model agreement and relevance as blocking guards

&nbsp;
#### Multi AI Council

Brings several AI viewpoints together to plan hard decisions. `@ai-council` runs the seats, and `/deep:ai-council` handles multi-topic sessions.
- **More than one opinion:** different AI seats reason from different angles, then critique each other
- **A plan you can trust:** the seats converge on a recommendation with the evidence behind it
- **Safe to run:** planning only, so it never touches your implementation files
- **Saved for later:** the plan and its reasoning persist as `ai-council/**` files in the packet

&nbsp;
#### Agent Improvement & Benchmarking

Four co-equal lanes in the `deep-loop-workflows` improvement mode. Lane A reviews and upgrades any of your agents: `/deep:agent-improvement` runs `@deep-improvement`. Lane B benchmarks a model or prompt framework: `/deep:model-benchmark`. Lane C diagnoses a skill's real-world routing, discovery, efficiency and usefulness: `/deep:skill-benchmark`. Lane D benchmarks an AI-system packaging and auto-refines its technique docs behind hard guardrails: `/deep:ai-system-improvement`.
- **Objective scoring:** rates an agent across five dimensions with fixed, repeatable checks, not another AI's opinion
- **Sees the whole footprint:** finds every place the agent lives (definition, mirrors, commands, workflows, skills) before changing anything
- **Never breaks the original:** changes go to a sandbox copy and only get promoted after they pass scoring, benchmarks and your approval, with rollback if they don't
- **Knows when to stop:** ends once the scores stop improving
- **Benchmarks too (Lanes B/C/D):** models and prompt frameworks against fixtures with pattern or 5-dimension scoring (deterministic or graded), skills against real routing and discovery behavior, and non-dev AI-system packagings against a correctness-gated gauntlet

For details, see the [Deep Loop Runtime README](.opencode/skills/deep-loop-runtime/README.md), or the [deep-loop-workflows README](.opencode/skills/deep-loop-workflows/README.md), which documents each mode.

---

### 🎯 Skills Library

20 skills in `.opencode/skills/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

#### SYSTEM

**system-spec-kit**
- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with manifest templates rendered through Level contracts across 4 levels (1-3+)
- Integrates the 39-tool memory surface with constitutional-tier support, session bootstrap and hybrid 5-channel retrieval
- Manages the manifest template source, 38 validation rules, the spec-kit script suite and the feature-catalog / testing-playbook documentation surfaces

**system-code-graph**
- Structural code-graph subsystem at `.opencode/skills/system-code-graph/`
- Owns AST indexing, SQLite graph storage, readiness contracts and `detect_changes` impact checks
- Current MCP server name: `mk_code_index`. Client namespace: `mcp__mk_code_index__*`

**system-skill-advisor**
- Gate 2 skill-routing subsystem at `.opencode/skills/system-skill-advisor/`
- Owns prompt-time skill routing, the `skill_graph_*` tools, freshness and lifecycle checks, with advisor storage kept out of the memory server
- Current MCP server name: `mk_skill_advisor`. Client namespace: `mcp__mk_skill_advisor__*`

&nbsp;
#### CODE WORKFLOW

**sk-code**
- **Write code that fits the stack you're in.** Loads surface-aware patterns, checklists and verification recipes per surface, and detects the active stack from paths and library markers. Unsupported stacks (Go, React/Next.js, generic Node.js, React Native, Swift) trigger a quick disambiguation question
- **Two ready surfaces:** WEBFLOW (Webflow and vanilla HTML/CSS/JS animation, CDN deploy, Lighthouse/TBT/INP targets) and OPENCODE (`.opencode/` system code across JS/TS/Python/Shell/JSON, MCP servers, agents, commands, skills)
- **Verifies before it claims done:** three mandatory phases run implementation, then testing and debugging, then verification

**sk-code-review**
- **Catch problems before they ship.** A stack-agnostic review baseline that reuses `sk-code` surface evidence where it applies
- **Safety floor never drops:** the security, correctness, SOLID and threat-model checklists always run first, and the security and correctness minimums are never relaxed by surface evidence
- **Findings come ranked** P0/P1/P2

**sk-git**
- **One clean path from change to PR.** Orchestrates three sub-skills so branches and commits stay tidy
- **git-worktree:** isolated workspaces, branch creation, parallel development
- **git-commit:** conventional-commit format, staged-change analysis, scope detection
- **git-finish:** PR creation via `gh pr create`, branch cleanup, integration

&nbsp;
#### DEEP LOOP

The shared runtime plus the `deep-loop-workflows` parent skill behind the autonomous loops. See the [Deep Loop](#deep-loop) section above for how they run.

**deep-loop-runtime**
- Self-contained, MCP-free runtime under every deep loop: executor config, state safety, scoring, fallback routing, coverage-graph scripts and `database/deep-loop-graph.sqlite`. Declares its own dependency manifest and resolves `zod`, `better-sqlite3` and `tsx` from its own `node_modules`. See [Deep Loop](#deep-loop).

**deep-loop-workflows**
- A formalized parent skill with nested mode packets: one routing-only `SKILL.md` and a single hub `graph-metadata.json` give it one advisor identity, while `mode-registry.json` is the declarative source of truth the modes project from, and a non-discoverable `shared/` holds cross-mode helpers. The nested packets are `deep-context`, `deep-research`, `deep-review`, `ai-council` and `deep-improvement` (folder names carry the `deep-` prefix except `ai-council`), routing one request to one of five modes over the shared runtime: **context** (codebase-context by-model sweep, `/deep:context`), **research** (autonomous research loop with 3-signal convergence, `/deep:research`), **review** (P0/P1/P2 code-review loop across 4 dimensions, `/deep:review`), **ai-council** (multi-seat planning to packet-local `ai-council/**` artifacts, `/deep:ai-council`), and **improvement** (four co-equal lanes: agent-improvement, model-benchmark, skill-benchmark and non-dev-ai-system). The five native agent names (`@deep-context`, `@deep-research`, `@deep-review`, `@ai-council`, `@deep-improvement`) and all eight `/deep:*` commands are unchanged. This parent-nested-skill pattern is the reusable, documented standard, scaffolded with `/create:sk-skill-parent` and described in `sk-doc`. See [Deep Loop](#deep-loop).

&nbsp;
#### CROSS-AI CLI

These skills let you run **cross-CLI agent teams from any starting CLI**. Whichever assistant you're talking to (Claude Code, Codex, Copilot, OpenCode, raw shell), it can dispatch the other AI CLIs as specialist sub-tools, each one a one-shot non-interactive call that streams structured output back to the caller. The conducting AI stays in charge. The dispatched CLI handles the part it's best at and returns. Use this to compose a Codex implementation + Claude review pipeline from inside any one of them.

> **Self-invocation guard:** every skill refuses to call itself. A Claude Code session never dispatches `cli-claude-code`, an OpenCode session never dispatches `cli-opencode`, etc. Cross-AI delegation only, no cycles.

**cli-codex**
- OpenAI Codex CLI orchestrator. Use it for **code generation, diff-aware review (`/review`), web browsing (`--search`) and screenshot analysis (`--image`)**. Supports session resume/fork, agent profiles and cost control via `--max-budget-usd`.
- Default model: `gpt-5.5` at medium reasoning, fast service tier. `gpt-5.3-codex` and other GPT-5.x variants available via override.

**cli-claude-code**
- Claude Code CLI orchestrator. Use it for **extended thinking (chain-of-thought), surgical diff-based edits and JSON-schema-validated structured output**. Ships with 9 built-in agents and session continuity.
- Three models: `claude-opus-4-6` (deep reasoning), `claude-sonnet-4-6` (default, balanced), `claude-haiku-4-5` (fast/cheap).

**cli-opencode**
- OpenCode CLI orchestrator. Use it when the dispatched task needs **the project's full plugin / skill / MCP / Spec Kit Memory runtime**, a one-shot `opencode run` boots every plugin in `opencode.json`, every skill under `.opencode/skills/`, every MCP server and the memory database. Also handles **parallel detached sessions** (`--share --port N` for ablation suites, worker farms) and **cross-repo dispatch** (`--dir <path>`).
- Default model: `opencode-go/deepseek-v4-pro` at high reasoning. Configured providers span `opencode-go` (default gateway: DeepSeek + open models), `deepseek` (direct API), `minimax-coding-plan` / `minimax` (MiniMax-M3), `xiaomi` (MiMo-V2.5-Pro), `kimi-for-coding` (Kimi k2.7 Code) and `openai` (`gpt-5.5` family) — see the skill's provider pre-flight for the live list.

&nbsp;
#### MCP INTEGRATION

**mcp-code-mode**
- **Reach 200+ external tools without bloating context.** One TypeScript interface fronts every external MCP tool (Figma, GitHub, Chrome DevTools, ClickUp, Webflow)
- **98.7% less context overhead:** tool schemas load on demand at first use, zero upfront cost, type-safe with autocomplete

**mcp-chrome-devtools**
- **Drive a real browser from the assistant.** Chrome DevTools with smart 2-mode routing
- **Fast by default:** CLI mode (`bdg`) runs in the terminal, supports Unix pipes and composes in CI/CD, with MCP mode as the fallback for multi-tool flows

**mcp-click-up**
- **Manage ClickUp tasks from the assistant.** Routes between `cupt` CLI (daily task ops) and the official ClickUp MCP (documents, goals, bulk ops, webhooks) with operation-based routing
- **Agent-safe by design:** enforces per-list status resolution, dry-run before batch completion, `--json` output, and empty-queue handling. Embedded install via `mcp-servers/` directory. 96-feature catalog + 76-scenario playbook included

**mcp-open-design**
- **Drive the installed Open Design desktop app from the terminal.** Reads and reuses local design systems (tokens, components) and commissions gated, multi-turn generation runs through the `od` CLI and a stdio MCP server, instead of the in-app chat
- **Local-first and gated:** a socket-discovered daemon on a rotating port, read-only inspection that surfaces freely, and STOP-and-confirm mutating verbs (`start_run`, then the discovery-form answer that fires the build). Pairs with `sk-design` for the design judgment

**mcp-figma**
- **Drive Figma Desktop from the terminal.** Reads, authors, modifies, and exports designs, tokens, and components through the silships `figma-ds-cli`, with an optional Figma MCP via Code Mode for pulling design context
- **CLI-primary and gated:** a local daemon brokers every command, read-only inspection and exports are free, and authoring or destructive verbs are gated. Needs Figma Desktop open and uses no API key. Pairs with `sk-design` for the design judgment

&nbsp;
#### OTHER

**sk-design (md-generator mode)**
- **Capture a live site's real CSS into a `DESIGN.md`.** An embedded Playwright pipeline (extract → write → validate) crawls a URL across five viewports and emits a v3 **Style Reference** — named colour tokens, a semantic Type Scale, named components, Surfaces, and a copy-paste Quick Start (CSS + Tailwind) — with every hex, font, radius, and shadow copied verbatim from the running page
- **Anti-hallucination by construction:** a script validator checks every value against the extracted `tokens.json` and hard-fails on phantom or content-layer (L4) colors. Captures dark mode, motion, icons, framework markers, and interaction states across the viewports
- **The capture half of the `sk-design-*` family:** it documents what already exists; sibling `sk-design` invents new direction. Produces the authoritative reference that the transports (`mcp-open-design`, `mcp-figma`) and `sk-code` build against

**sk-design**
- **Design UI that does not look templated.** Aesthetic direction (palette, typography, layout, motion) grounded in the brief, with a critique pass that kills the default AI looks before any code is written
- **Grounds against real references:** reads a real design system live (via `mcp-open-design`, as reuse-ground or critique-against) and real-world shipped UI (Mobbin and Refero via Code Mode, critique-against) to ground the work or name the category's real-world default and deviate from it. Never a style chooser or a copy source
- **Pairs with `sk-code`:** this skill owns the look, sk-code builds and verifies it. Vendored from Anthropic's `frontend-design` skill (Apache-2.0)

**sk-doc**
- **Keep docs clean and on-template.** Markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%) plus HVR compliance checking
- **Scaffolds components** (skills, agents, commands) and handles README templates, frontmatter validation, feature-catalog authoring and install guides

**sk-prompt**
- **Turn a rough ask into a strong prompt.** Auto-selects from 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- **Refines, then scores:** DEPTH thinking across 3-10 rounds, then CLEAR scoring (Clarity, Logic, Expression, Reliability) against a 40+/50 pass threshold

**sk-prompt-small-model**
- **Find the right small-model pattern fast.** A discovery anchor that points to executor-owned pattern files rather than hosting the logic itself
- **Covers the active matrix:** DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3 and MiMo-V2.5-Pro via `cli-opencode`
- **`references/pattern_index.md`** maps each pattern (context budget, output verification, permissions, quota fallback, model profiles, tool scoring) to its canonical location
- **Pool-aware quota fallback** routes to a different pool only, never same-pool retries. Frontier models (Opus, Sonnet, gpt-5.5) stay out of scope

---

### 🤖 Agent Network

12 custom specialist agents. Defined in `.opencode/agents/` (source of truth), mirrored for Claude Code (`.claude/agents/`) and Codex CLI (`.codex/agents/`) runtime surfaces. OpenCode and Copilot CLI use runtime-specific MCP and startup integration rather than a dedicated agent mirror.

#### AGENT ORCHESTRATION

**Orchestrate**
- **Runs the show on multi-step work.** Decomposes a task, delegates to specialist agents and merges their output into one answer with conflict resolution
- **Read-only by design:** it directs, the specialists implement
- **No runaway chains:** single-hop delegation only, depth 2 max

**Code**
- **Ships surface-aware code and proves it works.** Write-capable specialist that reads `sk-code`'s detected surface at dispatch, so the agent body stays stack-agnostic
- **Seven dispatch modes:** full build, surgical fix, refactor, test-add, scaffold, rename/move, dependency bump
- **Earns every `DONE`:** a Builder → Critic → Verifier self-check plus the Iron Law (no completion claim without fresh stack verification, LOW confidence blocks `DONE`)
- **Fails closed:** failures return to the orchestrator with an `escalation` classifier, no silent retry. Dispatched only by `@orchestrate`

**Context**
- **Finds what you already know before searching code.** Memory-first retrieval in order: `match_triggers` → `memory_context` → `memory_search` → grep/glob
- **Returns a Context Package** that combines memory findings with codebase evidence, drawing on the 5-channel memory system and Code Graph lookups. Read-only

**Review**
- **Guards code quality, never edits.** Strict read-only, loading the `sk-code-review` baseline first and then layering `sk-code` surface standards
- **Safety floor holds:** security and correctness minimums are never relaxed. Output is findings-first severity with quality scoring

**Debug**
- **A fresh pair of eyes after you're stuck.** Receives a structured context handoff instead of the failed conversation, so it skips inherited bias. Use after 3+ failed tries
- **Systematic 5-phase method:** Observe → Analyze → Hypothesize → Validate → Fix, written up in `debug-delegation.md`

**Markdown**
- **Scoped doc authoring you can trust.** LEAF executor for the `/create:*` family plus scoped spec-doc and markdown writing, loading `sk-doc` and the right template on every run
- **Refuses anything out of scope:** unscoped writes and nested delegation get a canonical REFUSE
- **Deterministic output:** `STATUS=OK PATH=…`, `FAIL` or `CANCELLED`, with a DQI >=75 floor and HVR enforced

**Prompt-Improver**
- **Strengthens high-stakes prompts.** Picks the best `sk-prompt` framework, applies DEPTH at the right energy and validates with CLEAR
- **Returns a structured package** (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`). Used by the CLI mirror-card pipeline and `/prompt` agent mode when inline prompting is too weak

&nbsp;
#### DEEP LOOP

**AI Council**
- **Several AI strategies, one vetted plan.** Dispatches distinct reasoning lenses across cli-codex, cli-claude-code and native, then deliberates over multiple rounds
- Planning-only, scored on a 5-dimension rubric. See [Deep Loop](#deep-loop)

**Deep Research**
- **One research iteration at a time, state on disk.** Executes a single LEAF pass. The `/deep:research` command owns the loop
- Writes `research.md` and `scratch/`, keeps negative knowledge, and stops only when the 3-signal convergence and graph guards agree. See [Deep Loop](#deep-loop)

**Deep Review**
- **Audits one review pass, read-only on code.** Produces P0/P1/P2 findings with `file:line` evidence across 4 dimensions. The `/deep:review` command owns the loop
- Any open P0 forces another pass and faces a Hunter/Skeptic/Referee check before it stands. See [Deep Loop](#deep-loop)

**Deep Context**
- **Maps one slice of the codebase, read-only.** A LEAF seat in the heterogeneous by-model parallel sweep, returning a reuse-first set of verified `file:symbol` findings. The `/deep:context` command owns the loop
- Agreement across models drives confidence; the loop converges on relevance-gated coverage saturation. See [Deep Loop](#deep-loop)

**Deep Improvement**
- **Proposes one agent improvement, safely.** Reads the target's charter, manifest and integration surface, then writes a single candidate to packet-local runtime
- Never scores, promotes or edits the canonical target. The `/deep:agent-improvement` command handles scoring and promotion. See [Deep Loop](#deep-loop)

---

### ⌨️ Commands

28 command entry points across 5 command groups plus root utilities. Each command is a Markdown entry point under `.opencode/commands/**/*.md` backed by a behavioral execution spec; command families keep their workflow routing (YAML execution specs) separate from their Markdown presentation contracts, so the rendered dashboards stay stable while the underlying workflow evolves.

&nbsp;
#### SPEC KIT

**Plan (intake-only mode)**
- A mode of `/speckit:plan` (`--intake-only`), not a separate command. Standalone intake workflow that publishes `spec.md`, `description.json` and `graph-metadata.json`
- Used directly for new packet setup and paired with `/speckit:plan` or `/speckit:complete` when `folder_state` is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Modes: `:auto`, `:confirm`

**Complete**
- End-to-end workflow: intake/delegate → research → plan → implement → verify → save memory
- Smart-detects missing or unhealthy packet state and reuses the shared intake contract from `/speckit:plan --intake-only`. Healthy folders continue without extra setup prompts
- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research)
- After 3 failed implementation attempts, surface diagnostics and let the user dispatch `@debug` via the Task tool

**Plan**
- Planning-only workflow that authors `spec.md`, `plan.md` and `tasks.md` without implementing
- Reuses the shared intake contract from `/speckit:plan --intake-only` when the packet is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Dispatches up to 4 parallel context agents for codebase exploration during planning
- Use when you need stakeholder review before coding. Modes: `:auto`, `:confirm`

**Implement**
- Executes an existing plan - requires plan.md to already exist
- 9-step workflow covering task breakdown, implementation, testing and verification
- Modes: `:auto`, `:confirm`

**Resume**
- Continues a previous session by auto-loading memory from the spec folder
- Presents session summary, shows progress against tasks.md
- Works after crashes, compactions or new sessions

**Spec-first command chains**

```text
/speckit:plan --intake-only
  ├─► /speckit:plan -> /speckit:implement
  ├─► /deep:research -> /speckit:plan
  └─► /speckit:complete
       └─► reuses the shared intake contract from /speckit:plan --intake-only when folder_state still needs intake
```

`/deep:research` only enters that chain after a real `spec.md` exists. It follows `spec_check_protocol.md` for advisory-lock handling, `folder_state` classification and bounded generated-fence sync.

&nbsp;
#### MEMORY

**Save**
- Updates packet continuity and supporting generated context artifacts via `generate-context.js`
- AI composes structured JSON with session summary, key decisions and findings
- Indexes immediately for future retrieval via `memory_save()` or `memory_index_scan()`

**Search**
- Unified retrieval and analysis entry point with intent-aware routing
- Supports epistemic baselines, causal graph traversal, ablation studies and dashboards
- Routes by intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`

**Learn**
- `/memory:learn` constitutional memory manager for always-surface rules
- Constitutional memories carry a 3.0x boost and never decay
- Lifecycle operations: create, list, edit, remove, budget

**Manage**
- Database admin: stats (memory counts, index health), health checks, cleanup (orphaned vectors)
- Checkpoint management: create, list, restore, delete
- Bulk operations and ingestion (start/status/cancel)

&nbsp;
#### CREATE

**Skill**
- Unified skill creation and update workflow
- Creates SKILL.md with 8-section structure, README.md, references and assets directories
- Registers in skill catalog. Modes: `:auto`, `:confirm`

**Parent Skill**
- Scaffolds a parent skill with nested mode packets — one hub identity plus a `mode-registry.json` source of truth the modes project from
- Generates the routing-only `SKILL.md`, single hub `graph-metadata.json`, N mode packets and a non-discoverable `shared/`
- The reusable pattern behind `deep-loop-workflows`. Modes: `:auto`, `:confirm`

**Agent**
- Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions
- Creates source-of-truth file in `.opencode/agents/` and mirrors for Claude and Codex runtimes
- Modes: `:auto`, `:confirm`

**Readme**
- Unified README and install guide creation using sk-doc quality standards
- Auto-detects folder type, loads appropriate template, validates via DQI scoring
- Structure 40%, Content 35%, Style 25%. Modes: `:auto`, `:confirm`

**Changelog**
- Auto-detects recent work from spec folder artifacts or git history
- Resolves correct component folder, calculates next version number
- Generates formatted changelog file matching 370+ existing entries. Modes: `:auto`, `:confirm`

**Feature Catalog**
- Creates or updates feature catalog packages with category routing
- Generates both technical reference entries and simple-terms companion entries
- Validates against the 290-entry catalog structure across 22 categories

**Testing Playbook**
- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against established playbook format

The MCP server also ships explicit stress and matrix execution surfaces. Run `npm run stress` from [mcp_server/](.opencode/skills/system-spec-kit/mcp_server/) for the dedicated [stress_test/](.opencode/skills/system-spec-kit/mcp_server/stress_test/) suite, which covers search-quality, memory, skill-advisor, code-graph, session and matrix subsystems. [matrix_runners/](.opencode/skills/system-spec-kit/mcp_server/matrix_runners/) provides per-CLI adapters plus a manifest and meta-runner for the F1-F14 feature matrix across the remaining active CLI skill surfaces.

&nbsp;
#### DEEP

The five autonomous loop families (the improvement family carries four lanes). See the [Deep Loop](#deep-loop) section for how they run.

**Deep Context** (`/deep:context`)
- Maps the existing codebase before you plan: a heterogeneous by-model parallel sweep over a shared scope, cross-executor-agreement convergence, and a reuse-first Context Report of verified `file:symbol` pointers. Optional `:with-context` pre-step on `/speckit:plan` and `/speckit:complete`. Modes: `:auto`, `:confirm`

**AI Council** (`/deep:ai-council`)
- Multi-seat planning for complex decisions. Produces packet-local `ai-council/**` artifacts and convergence evidence, planning-only. Modes: `:auto`, `:confirm`

**Deep Research** (`/deep:research`)
- Iterative research until convergence, anchored to a real `spec.md`. Externalized JSONL state pauses and resumes across sessions, with `new`/`resume`/`restart` lifecycle. Modes: `:auto`, `:confirm`

**Deep Review** (`/deep:review`)
- Iterative code audit until convergence. Severity-weighted P0/P1/P2 findings across 4 dimensions, a PASS/CONDITIONAL/FAIL verdict and an adversarial P0 self-check. Modes: `:auto`, `:confirm`

**Agent Improvement** (`/deep:agent-improvement`)
- Evaluates and improves any agent across 5 deterministic dimensions. Proposal-first with guarded promotion (scoring, benchmark, repeatability, operator approval) and rollback. Modes: `:auto`, `:confirm`

**Model Benchmark** (`/deep:model-benchmark`)
- Benchmarks a model or prompt framework against fixtures. Pattern or 5-dimension scoring, deterministic or graded runs, with mode-aware records and optional promotion. Modes: `:auto`, `:confirm`

**Skill Benchmark** (`/deep:skill-benchmark`)
- Diagnoses a skill's real-world behavior: routing accuracy, discovery, efficiency and usefulness, scored against repeatable scenarios. Modes: `:auto`, `:confirm`

**Non-Dev AI System** (`/deep:ai-system-improvement`)
- Benchmarks an AI-system packaging and auto-refines its technique docs behind hard guardrails, with correctness as a gate so saturation can never crown a winner. Modes: `:auto`, `:confirm`

&nbsp;
#### DOCTOR

Three commands cover every spec-kit diagnostic surface. Run `/doctor` with no target to see the interactive menu. Upgrade users see "Update everything to match latest release" as option 1.

**`/doctor <target>` (router)**
- Single entry point for 9 subsystems: `memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, `skill-budget`, `parent-skill`, `fable-mode`
- Argv-positional dispatch via `.opencode/commands/doctor/_routes.yaml` manifest (canonical per-target metadata: setup vars, allowed flags, mutation class, MCP tools, advisor trigger phrases)
- Each target loads its own self-contained YAML workflow under `assets/doctor_<target>.yaml`
- Interactive menu when no target supplied. Tier 2 per-target prompt when a required flag is missing
- Examples: `/doctor memory --dry-run`, `/doctor causal-graph --confidence-threshold=0.8`, `/doctor code-graph --scope=stale`, `/doctor fable-mode --dir <deep-loop-artifact-dir>` (read-only behavioral-metrics diagnostic)
- `--target=<name>` is preserved as a compatibility alias for flag-only invocation

**`/doctor:mcp install|debug`**
- MCP infrastructure repair (replaces the standalone `/doctor:mcp_install` and `/doctor:mcp_debug` from v3.4.0.0)
- `install`. Fresh install or reinstall of the native MCP servers from their install guides. Handles old-conflicting-with-new (clean reinstall with venv/node_modules removal)
- `debug`. Diagnoses the native MCP servers (Spec Kit Memory, System Skill Advisor, System Code Graph, Code Mode, Sequential Thinking) with PASS/WARN/FAIL per check. Supports `--fix` for guided repair

**`/doctor:update`**
- Multi-subsystem orchestrator: dependency-safe rebuild across code-graph → context-index + vector-index → causal-edges → skill-graph → advisor → deep-loop → eval
- One lock (`mcp_server/database/.doctor-update.flock`), one pre-mutation snapshot set, one dependency DAG, one rollback policy, one state log (`.doctor-update.last-run.json`)
- Tier-aware mid-run prompts: SHORT steps auto-acknowledge. MEDIUM steps share one combined prompt (Q-MED). LONG-POLE `memory_index_scan` gets explicit ETA prompt (Q-LONG, 5-15 min)
- Additional gates: Q-PROBE (active MCP clients warning, NOT suppressed by `--force`), Q-LEGACY (per-file cleanup with `--cleanup-legacy`), Q-FAIL (step-failure recovery)
- Use after upgrading spec-kit, after large packet moves or when multiple subsystem doctors would otherwise need to run by hand. Pass `--migrate` to handle schema migration (e.g. v3.3.0.0 → v3.4.1.0). Wall-clock 8-25 min

The 12 underlying YAML workflows in `.opencode/commands/doctor/assets/` are self-sufficient. Each declares its own `role/purpose/action/operating_mode/invariants/upstream_assets/user_inputs/field_handling` block plus phased execution. The `route-validate.{sh,py}` CI script enforces internal consistency on the route manifest.

&nbsp;
#### UTILITY

**Agent Router**
- Routes requests to external AI systems (Codex CLI, Claude Code, Copilot CLI)
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself

**Prompt**
- Refines prompts and prompt packages through `/prompt` using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Applies DEPTH thinking methodology with CLEAR quality scoring
- Can return inline improvements or route to `@prompt-improver` for higher-stakes prompt packages

---

### 🔌 Code Mode MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading large external tool definitions into context, Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.

#### Native MCP Servers

Canonical native server set:

| Server                 | Tools | Purpose                                                                |
| ---------------------- | ----- | ---------------------------------------------------------------------- |
| `mk-spec-memory`      | 39    | Cognitive memory, session recovery, causal/eval tools and graph loops  |
| `mk_skill_advisor`     | 9     | Gate 2 advisor routing plus skill-graph scan/query/status/validation   |
| `mk_code_index`        | 8     | Structural code graph, `detect_changes` and impact analysis            |
| `code_mode`            | 7     | External tool orchestration via TypeScript execution                   |
| `sequential_thinking`  | 1     | Structured multi-step reasoning for complex problems                   |
| **Total**              | **64** |                                                                        |

The three daemon servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`) also expose full-parity CLI front doors (`spec-memory.cjs`, `skill-advisor.cjs`, `code-index.cjs` under `.opencode/bin/`) over the same warm daemons — additive IPC clients, not separate servers. See the [Daemon CLI Reference](.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md).

Lifecycle guardrails: `mk-spec-memory`, `mk_skill_advisor`, and `mk_code_index` use the shared idle-timeout knob `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`. Orphan cleanup is documented in [.opencode/scripts/README.md](.opencode/scripts/README.md); the checked-in LaunchAgent is only a template until an operator copies and loads it.

&nbsp;
#### Code Mode Tools (7)

- **`search_tools`** - Discover relevant tools by task description
- **`tool_info`** - Get complete tool parameters and TypeScript interface
- **`call_tool_chain`** - Execute TypeScript code with access to all registered tools
- **`list_tools`** - List all currently registered tool names
- **`register_manual`** - Register a new tool provider
- **`deregister_manual`** - Remove a tool provider
- **`get_required_keys_for_tool`** - Check required environment variables for a tool

&nbsp;
#### External Integrations (via `.utcp_config.json`)

- **`chrome_devtools_1`** (MCP/stdio) - Browser automation (instance 1). No env var needed.
- **`chrome_devtools_2`** (MCP/stdio) - Browser automation (instance 2). No env var needed.
- **`clickup`** (MCP/stdio) - ClickUp community server (`@taazkareem/clickup-mcp-server`). Requires `CLICKUP_API_KEY`.
- **`clickup_official`** (MCP/stdio) - Official ClickUp MCP (`@clickup/mcp-server`). Requires `CLICKUP_API_KEY` + `CLICKUP_TEAM_ID`. Used by `mcp-click-up` skill.
- **`figma`** (MCP/stdio) - Design files, components, exports. Requires `FIGMA_API_KEY`. This is the optional Code Mode MCP. The primary Figma surface is the `mcp-figma` skill via `figma-ds-cli`.
- **`github`** (MCP/stdio) - Issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **`webflow`** (MCP/remote) - Sites, CMS collections. Requires Webflow auth.

&nbsp;
#### Performance

| Metric            | Without Code Mode                          | With Code Mode       |
| ----------------- | ------------------------------------------ | -------------------- |
| Context tokens    | Large external tool schemas loaded upfront | 1.6k (on-demand)     |
| Round trips       | 15+ for chained operations                 | 1 (TypeScript chain) |
| Type safety       | None                                       | Full TypeScript      |
| Context reduction | -                                          | 98.7%                |

To call a Code Mode tool: `call_tool_chain({ code: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skills/mcp-code-mode/SKILL.md`.

<!-- /ANCHOR:features -->


<!-- ANCHOR:configuration -->

---

## 4. CONFIGURATION

<a id="customizing-for-your-stack"></a>
### 🎯 Customizing for Your Stack: Start with `sk-code`

This repo ships as a **public template**. Of the skills it ships with, only one carries stack-specific content, start there:

| Skill / Surface                                     | Out-of-the-box                             | Notes                                                                                                                                                                                                    |
| --------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`sk-code`**                                       | 🎨 Stack-specific (the customization point) | Surface-aware code-quality patterns. Replace the shipped Webflow + OpenCode + Motion.dev surfaces with your own (e.g., Next.js + Tailwind + Postgres or React Native + Reanimated or Go + sqlc, etc.).   |
| `sk-doc`                                            | ✅ Codebase-agnostic                        | Markdown quality + component creation. Works for any project.                                                                                                                                            |
| `sk-git`                                            | ✅ Codebase-agnostic                        | Worktree + commit + PR workflow. Works for any project.                                                                                                                                                  |
| `sk-code-review`                                    | ✅ Codebase-agnostic baseline               | Pulls surface evidence FROM `sk-code`. Customize `sk-code` and the review baseline auto-adapts.                                                                                                          |
| `sk-design (md-generator mode)`                            | ✅ Codebase-agnostic                        | Extracts a live website's real CSS into a v3 Style Reference `DESIGN.md` (named tokens, Type Scale, Components, Surfaces, Quick Start CSS/Tailwind) via an embedded extract→write→validate pipeline (every value verbatim, script-validated against `tokens.json`). The capture engine of the `sk-design-*` family; pairs with `sk-design`. Works for any project. |
| `sk-design`                               | ✅ Codebase-agnostic                        | Visual-design direction (palette, typography, layout, motion) that avoids templated AI defaults; grounds against real design systems (`mcp-open-design`) and shipped-UI references (Mobbin/Refero via Code Mode). Pairs with `sk-code` for the build. Works for any project. |
| `system-spec-kit`                                   | ✅ Codebase-agnostic                        | Spec folder workflow + validator + memory. Works for any project.                                                                                                                                        |
| `mcp-code-mode`                                     | ✅ Codebase-agnostic                        | Multi-tool MCP orchestration. Works for any project.                                                                                                                                                     |
| `deep-loop-runtime` / `deep-loop-workflows` | ✅ Codebase-agnostic                        | Shared runtime plus the unified deep-loop skill (context, research, review, ai-council and improvement modes, including agent improvement and model/skill benchmarking). Work for any topic / target.     |
| `sk-prompt`                                         | ✅ Codebase-agnostic                        | Prompt-engineering framework. Works for any project.                                                                                                                                                     |
| `cli-*` (codex/claude-code/opencode) | ✅ Codebase-agnostic                        | External CLI orchestrators. Stack-independent.                                                                                                                                                           |
| `mcp-chrome-devtools`                               | ✅ Codebase-agnostic                        | Browser tooling. Stack-independent.                                                                                                                                                                      |
| `mcp-click-up`                                      | ✅ Codebase-agnostic                        | ClickUp task management via cupt CLI + official MCP. Requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`. Stack-independent.                                                                                |
| `mcp-open-design`                                   | ✅ Codebase-agnostic                        | Drives the installed Open Design desktop app from the terminal (read and reuse design systems, gated generation runs) via the `od` CLI + MCP. Requires the Open Design desktop app installed. Stack-independent. |
| `mcp-figma`                                         | ✅ Codebase-agnostic                        | Drives Figma Desktop from the terminal (read, author, export designs, tokens, components) via the silships `figma-ds-cli`, with an optional Figma MCP. Requires Figma Desktop open. Stack-independent.   |

**Adding your own skills:** the shipped set is intentionally minimal, most teams will add their own skills (project-specific workflows, ops runbooks, domain-specific reviewers, etc.). That's expected and supported. Just drop them into `.opencode/skills/<your-skill>/` and they'll be picked up by the advisor. The shipped skills above are kept agnostic so upstream updates apply cleanly to your fork.

**What "adapting `sk-code`" looks like**:
- Replace `references/webflow/`, `references/opencode/`, `references/motion_dev/` with your stack's references (e.g., `references/nextjs/`, `references/postgres/`).
- Replace `assets/webflow/`, `assets/opencode/`, `assets/motion_dev/` with your stack's assets (checklists, recipes, snippets).
- Update `SKILL.md` §2 Smart Routing, `STACK_FOLDERS` dict + the bash detection block, to match your stack's marker files and CWD signals.
- Update the `RESOURCE_MAP` intent → file paths to point at your renamed references/assets.
- Bump `sk-code` version + ship a changelog. Use the `assets/opencode/checklists/skill_authoring.md` checklist as your guide.

The other shipped skills will continue working unchanged: `sk-doc` will still validate your markdown, `sk-git` will still manage your branches, `system-spec-kit` will still spec your work and `sk-code-review` will surface YOUR `sk-code` evidence at review time.

&nbsp;
### Core Configuration Files

- **`CLAUDE.md`** - Gate definitions, behavior rules, coding anti-patterns. Used by Claude Code (primary runtime).
- **`AGENTS.md`** - Agent routing, capability reference, gate documentation. Used by all runtimes.
- **`opencode.json`** - MCP server bindings, model configuration and launcher notes. Used by OpenCode platform.
- **`.utcp_config.json`** - Code Mode external tool registrations. Used by `mcp-code-mode` skill.
- **`.claude/mcp.json`** - Claude Code MCP configuration. Claude Code only.
- **`.codex/config.toml`** - Codex CLI MCP configuration and profile definitions.
- **`.vscode/mcp.json`** - VS Code / Copilot MCP configuration wrapper.

&nbsp;
### Memory Engine Configuration

The memory server reads configuration from environment variables:

- **`VOYAGE_API_KEY`** (optional) - Voyage AI cloud embeddings (opt-in only, gated by egress guard)
- **`EMBEDDINGS_PROVIDER`** (optional) - Override the default embedder provider (default: `ollama-nomic-v1.5` since ADR-013/014 2026-05-19; was previously `ollama-jina-v3`). See [embedder_pluggability.md](.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md) for the registered list.
- **`SPECKIT_RERANK_LAYER`** (optional) - Retrieval-rescue layer toggle, default `true` per ADR-011. Set to `false` to disable.
- **`HF_EMBEDDINGS_DTYPE`** (optional) - hf-local fallback dtype (default: `q8`. Also: `fp32`, `fp16`, `q4`, `int8`, `uint8`, `bnb4`)
- **`OPENAI_API_KEY`** (optional) - OpenAI embeddings (alternative)
- **`MEMORY_DB_PATH`** (optional) - Override default database path

Default repo-local database path: `.opencode/skills/system-spec-kit/mcp_server/database/context-index__ollama__nomic-embed-text-v1.5__768.sqlite` (default since ADR-013/014 2026-05-19; previously `__jina-embeddings-v3__1024__q4_k_m.sqlite`). The filename encodes provider, model, dimension and dtype so multiple backends can coexist on disk without mixing vectors.

> [!TIP]
> If no API key is set, the memory engine auto-detects the local Ollama endpoint serving **nomic-embed-text-v1.5** (current default per ADR-013/014), then falls back to **HuggingFace Local** embeddings.


&nbsp;
### Memory Feature Flags

Feature flags control search channels, scoring signals, save-time enforcement and evaluation behavior. The important retrieval/runtime flags are resolved at call time, so long-lived MCP processes do not depend on frozen import-time snapshots.

- **Search Pipeline** - 5-channel retrieval, fallback routing, reranking, graph-walk rollout, confidence and token-budget policies.
- **Session/Cache** - Working memory, cache invalidation on DB rebind, session deduplication, recovery helpers.
- **Memory/Storage** - Save quality gate, reconsolidation, governed scopes, causal graph maintenance, projection cleanup.
- **Runtime Lifecycle** - MCP idle self-exit through `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`; orphan sweeper rollout remains dry-run-first until explicitly installed. Non-destructive incremental `tsc` build keeps a running daemon alive across rebuilds (use `npm run rebuild` for a from-scratch compile). WAL durability: `PRAGMA wal_checkpoint TRUNCATE` on close, `wal_autocheckpoint=256` on the main DB and active vector shard, plus a five-minute periodic checkpoint. FTS5 integrity-check on boot is gated on an unclean-shutdown crash marker (`health` can report `corrupt`; detect-only, no auto-rebuild). Opt-in RSS-ceiling watchdog (`SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`) with crash-loop backoff.
- **Embedding/API** - Startup provider resolution, fail-fast dimension checks, structured fallback metadata for effective vs requested provider.
- **Evaluation/Debug** - Trace mode, eval logging, ablation/reporting guardrails, feedback evaluation and proposal diagnostics that observe candidates without reordering live results.

For the complete flag reference with per-flag defaults, see [ENV_REFERENCE.md](.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md) and the [MCP Server runtime guardrail notes](.opencode/skills/system-spec-kit/mcp_server/README.md#8--runtime-lifecycle-guardrails).

&nbsp;
### Database Schema

The runtime centers on a SQLite `memory_index` table (schema v37 baseline) plus companion FTS5/vector, lineage, checkpoint, working-memory and eval tables.

- **Primary store** - `memory_index` holds the searchable memory rows plus governance, quality, chunking and retrieval metadata.
- **Search companions** - FTS5 and vector tables support lexical and embedding retrieval alongside BM25 rebuild/index data.
- **Graph/lifecycle** - Causal edges, lineage projection, checkpoints, working memory and access tracking support decision tracing and session continuity.
- **Evaluation** - Separate eval tables persist ablation/reporting metrics, with guards for missing query IDs and synthetic token-usage markers.
- **Paths** - The checked-in configs default to the provider-keyed database path under `.opencode/skills/system-spec-kit/mcp_server/database/`. The filename encodes provider, model, dimension and dtype (current default since ADR-013/014: `context-index__ollama__nomic-embed-text-v1.5__768.sqlite`; jina-v3 fallback would produce `context-index__ollama__jina-embeddings-v3__1024__q4_k_m.sqlite`). If a runtime cannot write inside the repo, override `MEMORY_DB_PATH` (and, when relevant, `SPEC_KIT_DB_DIR`) to a writable location.

&nbsp;
### MCP Config Shape

Abbreviated shape. Runtime config files can temporarily differ while the `mk_code_index` rename is being rolled out across clients. The canonical code-graph identity is `mk_code_index` / `mcp__mk_code_index__*`.

```json
{
  "mcp": {
    "mk-spec-memory": {
      "type": "local"
    },
    "mk_skill_advisor": {
      "type": "local"
    },
    "mk_code_index": {
      "type": "local"
    },
    "code_mode": {
      "type": "local"
    },
    "sequential_thinking": {
      "type": "local"
    }
  }
}
```

&nbsp;
### Maintainer-Mode Code-Graph Flags (already disabled for end users)

All 4 runtime MCP configs (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.vscode/mcp.json`) carry five opt-in maintainer flags:

```text
SPECKIT_CODE_GRAPH_INDEX_SKILLS    (covers .opencode/skills/**)
SPECKIT_CODE_GRAPH_INDEX_AGENTS    (covers .opencode/agents/**)
SPECKIT_CODE_GRAPH_INDEX_COMMANDS  (covers .opencode/commands/**)
SPECKIT_CODE_GRAPH_INDEX_SPECS     (covers <active-spec-folder>/**)
SPECKIT_CODE_GRAPH_INDEX_PLUGINS   (covers .opencode/plugins/**)
SPECKIT_CODE_GRAPH_DB_DIR          (optional code-graph SQLite directory override)
```

**End users see all 5 as `"false"`** thanks to the [git clean filter](#git-clean-filter--maintainer-mode-stays-local). That's the framework default and what you want, the code graph indexes your project code, not the framework backend.

**Maintainers (us) have all 5 as `"true"`** locally because we navigate `.opencode/` to iterate on the framework. The smudge filter restores `"true"` on checkout/pull/clone after running `./scripts/setup-maintainer-filters.sh`.

**Per-call override:** the same five flags exist as `includeSkills` / `includeAgents` / `includeCommands` / `includeSpecs` / `includePlugins` arguments on `code_graph_scan`. Per-call args always override env defaults, so you can flip behavior for one scan without editing config.

<a id="git-clean-filter--maintainer-mode-stays-local"></a>
#### Git clean filter: maintainer mode stays local

The repo ships a `.gitattributes` rule that runs an idempotent sed-based clean filter on the 4 config files: every `"true"` for these flags is rewritten to `"false"` when the file enters the git index. The smudge filter rewrites `"false"` → `"true"` on checkout/pull/clone for installed maintainers. Net effect:

- **End users cloning the template** → all 4 configs show `"false"` (framework default, correct out of box)
- **Maintainers after running `./scripts/setup-maintainer-filters.sh`** → all 4 configs show `"true"` locally. Commits + pushes still ship `"false"` to the remote

To opt into maintainer mode on a fresh clone (only relevant if you're contributing upstream):

```bash
./scripts/setup-maintainer-filters.sh
git rm --cached opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml
git checkout -- opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml
```

After that, `cat opencode.json` shows `"true"`. `git show HEAD:opencode.json` shows `"false"` (what the remote sees).

<!-- /ANCHOR:configuration -->


<!-- ANCHOR:faq -->

---

## 5. FAQ

**Q: Do I need all 20 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core documentation skills - `system-spec-kit` and `sk-doc` - cover most documentation workflows. The MCP and cross-AI CLI skills require additional local tooling or API keys depending on the surface.
&nbsp;
**Q: Is this only for OpenCode or does it work with other runtimes?**

A: It works with OpenCode, Codex CLI and Claude Code. The repo also includes Copilot CLI-oriented startup-surface integration. Agent definitions are mirrored in the checked-in Claude and Codex runtime directories. OpenCode and Copilot CLI use runtime-specific MCP or startup integration rather than a dedicated agent mirror.
&nbsp;
**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.
&nbsp;
**Q: How does the memory system know what is relevant to my current task?**

A: Packet continuity and any supporting generated context artifacts use structured frontmatter and anchored markdown so the memory engine can classify, index and retrieve them reliably. For recovery, start with `/speckit:resume` and the packet-local continuity ladder `handover.md` -> `_memory.continuity` -> canonical spec docs. After that, `memory_match_triggers()` runs a fast trigger/cognitive pass, while `memory_context()` and `memory_search()` handle deeper retrieval with intent routing, reranking and filtering.
&nbsp;
**Q: Can I use this framework without the cognitive memory features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works independently of the memory MCP server. You lose cross-session memory retrieval, but structured documentation, agent routing and skill loading all still work.
&nbsp;
**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skills/README.md`.
&nbsp;
**Q: What does "local-first" mean for the memory system?**

A: The memory database is a SQLite file on your local machine. No session data, code or context is sent to any external service unless you configure a cloud embedding provider (Voyage AI or OpenAI). HuggingFace Local embeddings run entirely on-device.
&nbsp;
**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agents/` (the source of truth), then mirror the adapter into `.claude/agents/` and `.codex/agents/`. Use `/create:agent` to scaffold the file from the agent template.
&nbsp;
**Q: How many MCP tools are there and where are they defined?**

A: 64 total across 5 native MCP servers, sourced from registered MCP-dispatched tools only. Breakdown: 39 `mk-spec-memory` tools from `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`, 9 `mk_skill_advisor` tools from `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts`, 8 `mk_code_index` tools from `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`, 7 code mode tools and 1 sequential thinking tool. Canonical advisor/skill-graph docs use `mk_skill_advisor` / `mcp__mk_skill_advisor__*`. Canonical code-graph docs use `mk_code_index` / `mcp__mk_code_index__*`.
&nbsp;

**Q: What is the feature catalog?**

A: The feature catalog is the current technical reference documenting the memory system's live capabilities. It lives at `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`. The code graph runtime adds package-local docs at `.opencode/skills/system-code-graph/feature_catalog/`.

<!-- /ANCHOR:faq -->


<!-- ANCHOR:related-documents -->

---

## 6. RELATED DOCUMENTS

**Internal Documentation:**

- **[→ AGENTS.md](AGENTS.md)** - Agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.opencode/skills/system-spec-kit/README.md)** - Spec folder workflow, Level contract template set, validation rules
- **[→ MCP Server README](.opencode/skills/system-spec-kit/mcp_server/README.md)** - Memory API reference and runtime support docs
- **[→ Repo Scripts Runbook](.opencode/scripts/README.md)** - Dry-run orphan MCP sweeper, Claude cleanup, and LaunchAgent template guidance
- **[→ Orphan MCP Leak Prevention Packet](.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)** - Canonical implementation summary and rollout state
- **[→ System Code Graph Skill](.opencode/skills/system-code-graph/SKILL.md)** - First-class structural graph skill and MCP routing rules
- **[→ Skill Advisor README](.opencode/skills/system-skill-advisor/README.md)** - Standalone `mk_skill_advisor` server, nine advisor/skill-graph tools and routing docs
- **[→ Install Guide](.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md)** - MCP server setup, embedding providers
- **[→ Deployment Notes](DEPLOYMENT.md)** - Docker anti-patterns, Copilot notes and session-resume auth flag
- **[→ Architecture](.opencode/skills/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.opencode/skills/sk-doc/SKILL.md)** - Documentation standards, DQI scoring
- **[→ Skills Index](.opencode/skills/README.md)** - Skills library and invocation patterns
- **[→ Feature Catalog](.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md)** - Current technical reference
- **[→ Manual Testing Playbook](.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md)** - Operator validation scenarios, including runtime lifecycle checks
- **[→ Code Graph Runtime Catalog](.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md)** - Package-local code graph runtime inventory
- **[→ Code Graph Manual Playbook](.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md)** - Operator scenarios for code graph validation
- **[→ Latest System Spec-Kit Release Notes](.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md)** - Most recent shipped release notes
- **[→ Daemon CLI Reference](.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md)** - Full-parity CLI front doors over the three warm daemons

**External Resources:**

- **[→ OpenCode](https://github.com/sst/opencode)** - The underlying AI coding platform
- **[→ Voyage AI](https://www.voyageai.com/)** - Cloud embedding provider (opt-in)
- **[→ HuggingFace](https://huggingface.co/)** - Free local embedding alternative

<!-- /ANCHOR:related-documents -->


*Documentation version: 4.16 | Last updated: 2026-06-14 | Framework: 12 agents, 20 skills, 28 commands, 62 MCP tools (37 mk-spec-memory + 9 mk_skill_advisor + 8 mk_code_index + 7 code mode + 1 sequential thinking. Deferred / internal-only handlers do NOT count).*
