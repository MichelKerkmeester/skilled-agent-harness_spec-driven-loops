---
title: "Spec Kit Framework"
description: "Unified documentation and memory system that makes AI-assisted development sustainable with enforced documentation and persistent context."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
importance_tier: "normal"
---

# Spec Kit Framework

> Your AI assistant forgets everything between sessions. Not anymore.

Spec Kit is a unified documentation and memory system that makes AI-assisted development sustainable. It enforces documentation by design and preserves context across sessions, giving stateless AI assistants the infrastructure they need.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. DOCUMENTATION LEVELS](#3--documentation-levels)
- [4. COMMANDS](#4--commands)
- [5. MEMORY SYSTEM](#5--memory-system)
- [6. TEMPLATES](#6--templates)
- [7. SCRIPTS](#7--scripts)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. FAQ](#9--faq)
- [10. RELATED RESOURCES](#10--related-resources)


---

<!-- /ANCHOR:table-of-contents -->
## 1. OVERVIEW
<!-- ANCHOR:overview -->

### The Problem Nobody Talks About

AI coding assistants are powerful but stateless. Every session starts from zero:

- Monday: "Here's how our auth system works..."
- Wednesday: Blank slate. Explain it all again.
- Friday: That spec folder you created? Lost in chat history.

### The Solution

Spec Kit adds the missing layers: persistent memory, enforced documentation, automated workflows and cross-session context. Documentation isn't optional. Gate 3 blocks file changes without a spec folder. Memory persists across sessions, models, projects and tools.

Cross-workflow alignment is mandatory:
- All code created or updated must fully align with `workflows-code--opencode`.
- All documentation created or updated must fully align with `workflows-documentation`.

---

### What Makes This Different

| Capability               | Basic Approach                        | Spec Kit                                                |
| ------------------------ | ------------------------------------- | ------------------------------------------------------- |
| **Decision Archaeology** | "Why did we build it this way?"       | Causal graph traces decision lineage                    |
| **Token Usage**          | Re-send same memories every query     | Session deduplication saves 50% on follow-ups           |
| **Context**              | Re-explain everything every session   | Memory persists across sessions, models, projects       |
| **Debugging**            | Same error, 10th attempt, no progress | AI detects frustration, auto-suggests sub-agent         |
| **Documentation**        | "I'll document later" (never happens) | Gate 3 enforces spec folders on every file change       |
| **Quality Gates**        | Trust the AI did it right             | PREFLIGHT/POSTFLIGHT validation at operation boundaries |
| **Handoffs**             | 2-hour "what did you do" meetings     | `/spec_kit:handover` produces a 15-line summary         |

---

### Key Innovations

| Innovation                   | Impact                  | Description                                                                                  |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| **Causal Memory Graph**      | "Why" queries           | 6 relationship types: caused, enabled, supersedes, contradicts, derived_from, supports       |
| **Session Deduplication**    | -50% tokens             | Hash-based tracking prevents re-surfacing same memories                                      |
| **ANCHOR Retrieval**         | 93% token savings       | Section-level memory extraction, not full files                                              |
| **Intent-Aware Retrieval**   | +20% match rate         | 7 intent types auto-detected from query phrasing                                             |
| **Document-Type Scoring**    | Precision ranking       | 11 document types with scoring multipliers (spec: 1.4x, constitutional: 2.0x, scratch: 0.6x) |
| **BM25 Hybrid Search**       | +40-50% relevance       | Pure JS BM25 combined with vector via RRF fusion                                             |
| **Cross-Encoder Reranking**  | Precision retrieval     | Voyage/Cohere/local providers with length penalty                                            |
| **Typed Retrieval Contracts**| API safety              | `ContextEnvelope`, `RetrievalTrace`, and degraded-mode contracts for structured responses     |
| **Artifact-Class Routing**   | Precision targeting     | 9 artifact classes with per-type retrieval strategies                                         |
| **Adaptive Hybrid Fusion**   | Intent-aware ranking    | Weighted RRF with intent-sensitive profiles behind `SPECKIT_ADAPTIVE_FUSION`                |
| **Mutation Ledger**          | Tamper-evident audit    | Append-only SQLite trigger pipeline for memory mutations                                      |
| **Extended Telemetry**       | Retrieval observability | Latency, mode, fallback, and quality-proxy dimensions across search/context flows            |
| **5-State Memory Model**     | Automatic lifecycle     | HOT/WARM/COLD/DORMANT/ARCHIVED with threshold transitions                                    |
| **Type-Specific Half-Lives** | +20% decay accuracy     | 9 memory types with distinct decay rates                                                     |
| **Multi-Factor Decay**       | +30-40% relevance       | 5 factors: temporal, usage, importance, pattern, citation                                    |
| **Memory Consolidation**     | Storage efficiency      | 5-phase pipeline: REPLAY, ABSTRACT, INTEGRATE, PRUNE, STRENGTHEN                             |
| **Recovery Hints**           | Zero-frustration errors | 49 error codes with actionable recovery guidance                                             |
| **Lazy Model Loading**       | <500ms MCP startup      | Deferred embedding initialization                                                            |

---

### By The Numbers

| Category              | Count                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| **MCP Tools**         | 22 (memory, checkpoint, causal, drift, learning)                       |
| **Templates**         | 10 (specs, plans, research, decisions)                                 |
| **Scripts**           | 121 source scripts (61 TS + 20 JS + 38 shell + 1 mjs + 1 Python)      |
| **Commands**          | 12 (7 spec_kit + 5 memory), all ≤600 lines, full agent routing (19/19) |
| **Importance Tiers**  | 6 (constitutional -> deprecated)                                       |
| **Memory Types**      | 9 (working, episodic, procedural, semantic, etc.)                      |
| **ANCHOR Coverage**   | 533 anchors across 78 skill READMEs for precise memory retrieval       |
| **README Compliance** | 75 READMEs styled per readme_template.md (7 rules)                     |
| **Test Coverage**     | 4,415 tests across 142 files (latest all-features run)                 |
| **Last Verified**     | 2026-02-20 (module/file counts revalidated via Glob)                  |

### Requirements

| Requirement | Minimum                             |
| ----------- | ----------------------------------- |
| Node.js     | 18+                                 |
| TypeScript  | 5.0+ (compile with `npm run build`) |
| OpenCode    | 1.0.190+                            |
| Bash        | 4.0+                                |

---

<!-- /ANCHOR:overview -->
## 2. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Find the next spec folder number
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1

# 2. Create your spec folder
.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication" --level 2

# 3. Verify creation
ls specs/###-user-authentication/
# Expected: spec.md  plan.md  tasks.md  checklist.md  memory/  scratch/
```

### Or Use Commands (Even Faster)

```bash
# Full workflow (plan + implement)
/spec_kit:complete add user authentication :auto

# Planning only
/spec_kit:plan refactor database layer :confirm

# Research first
/spec_kit:research evaluate GraphQL vs REST
```

### Level Selection

| LOC Estimate | Level | What You Get                                             |
| ------------ | ----- | -------------------------------------------------------- |
| <100         | 1     | spec.md + plan.md + tasks.md + implementation-summary.md |
| 100-499      | 2     | Level 1 + checklist.md                                   |
| >=500        | 3     | Level 2 + decision-record.md                             |
| Complex      | 3+    | Level 3 + extended governance                            |

**Decision rule:** When in doubt, choose the higher level. Future-you will thank present-you.

---

<!-- /ANCHOR:quick-start -->
## 3. DOCUMENTATION LEVELS
<!-- ANCHOR:documentation-levels -->

### Progressive Enhancement

```
Level 1 (Core):         Essential what/why/how (~455 LOC)
         | +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
         | +Arch
Level 3 (Full):         +Architecture decisions, ADRs (~1090 LOC)
         | +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~1350 LOC)
```

### When to Use Each Level

| Task                 | Level | Rationale                      |
| -------------------- | ----- | ------------------------------ |
| Fix CSS alignment    | 1     | Simple, low risk               |
| Add form validation  | 1-2   | Borderline, low complexity     |
| Modal component      | 2     | Multiple files, needs QA       |
| Auth system refactor | 3     | Architecture change, high risk |
| Database migration   | 3     | High risk overrides LOC        |

**Override factors:** Complexity, risk, security implications, multiple systems affected.

### Spec Folder Structure

```
specs/042-user-authentication/
|-- spec.md                    # Feature specification
|-- plan.md                    # Implementation plan
|-- tasks.md                   # Task breakdown
|-- checklist.md               # QA validation (Level 2+)
|-- decision-record.md         # ADRs (Level 3+)
|-- implementation-summary.md  # Post-implementation summary
|-- memory/                    # Context preservation
|   |__ DD-MM-YY_HH-MM__topic.md
|__ scratch/                   # Temporary files (git-ignored)
```

---

<!-- /ANCHOR:documentation-levels -->
## 4. COMMANDS
<!-- ANCHOR:commands -->

### Spec Kit Commands

| Command               | Steps | Purpose                                                                |
| --------------------- | ----- | ---------------------------------------------------------------------- |
| `/spec_kit:complete`  | 14    | Full end-to-end workflow                                               |
| `/spec_kit:plan`      | 7     | Planning only (no implementation)                                      |
| `/spec_kit:implement` | 11    | Execute pre-planned work (9 main + Steps 5.5/7.5 PREFLIGHT/POSTFLIGHT) |
| `/spec_kit:research`  | 9     | Technical investigation                                                |
| `/spec_kit:resume`    | 4     | Resume previous session                                                |
| `/spec_kit:handover`  | 4     | Create session handover document                                       |
| `/spec_kit:debug`     | 5     | Delegate debugging to sub-agent                                        |

### Memory Commands

| Command                   | Purpose                                |
| ------------------------- | -------------------------------------- |
| `/memory:save [folder]`   | Save context via generate-context.js   |
| `/memory:context <query>` | Unified entry with intent awareness    |
| `/memory:manage`          | Database management operations         |
| `/memory:continue`        | Session recovery from crash/compaction |
| `/memory:learn`           | Explicit learning capture              |

### Mode Suffixes

| Suffix           | Behavior                               | Applies To                |
| ---------------- | -------------------------------------- | ------------------------- |
| `:auto`          | Execute without approval gates         | Most commands             |
| `:confirm`       | Pause at each step for approval        | Most commands             |
| `:with-research` | Dispatch @research before verification | `/spec_kit:complete` only |
| `:auto-debug`    | Auto-dispatch @debug on 3+ failures    | `/spec_kit:complete` only |

> **Note:** `:auto`/`:confirm` are supported by most commands. `/spec_kit:handover` always runs in interactive mode. `:with-research` and `:auto-debug` can be combined: `/spec_kit:complete :with-research :auto-debug`

### Workflow Decision Guide

```
START: New Task
     |
     v
Do you understand requirements clearly?
|-- YES -> Need to plan for later?
|          |-- YES -> /spec_kit:plan
|          |__ NO  -> /spec_kit:complete
|__ NO  -> /spec_kit:research
              |
              v
         Then: /spec_kit:plan or /spec_kit:complete
```

### Debug Delegation

**Auto-suggested when:**
- Same error occurs 3+ times after fix attempts
- Frustration keywords detected ("stuck", "can't fix", "tried everything")
- Extended debugging without resolution

The `/spec_kit:debug` command prompts for model selection, then dispatches to that model via Task tool for a fresh perspective with full context handoff.

---

<!-- /ANCHOR:commands -->
## 5. MEMORY SYSTEM
<!-- ANCHOR:memory-system -->

### Memory Architecture

This goes beyond basic chat log storage. This is a cognitive memory system with biologically-inspired attention dynamics:

| Basic Chat Logs                   | This Memory System                                                   |
| --------------------------------- | -------------------------------------------------------------------- |
| Search: Ctrl+F (text only)        | Search: Hybrid semantic + BM25 (RRF fusion)                          |
| Prioritization: None              | Prioritization: 6-tier importance (constitutional -> deprecated)     |
| Privacy: Often cloud-stored       | Privacy: Local options available (HF Local runs on YOUR machine)     |
| Token Efficiency: Load everything | Token Efficiency: ANCHOR format (93% savings) + session dedup (-50%) |
| Recovery: Hope you backed up      | Recovery: Checkpoints = undo button for your index                   |
| "Why" queries: Impossible         | "Why" queries: Causal graph traces decision lineage                  |

---

### The Six Importance Tiers

| Tier               | Boost | Decay    | Use Case                                         |
| ------------------ | ----- | -------- | ------------------------------------------------ |
| **constitutional** | 3.0x  | Never    | Project rules, always-surface (~2000 tokens max) |
| **critical**       | 2.0x  | Never    | Architecture decisions, breaking changes         |
| **important**      | 1.5x  | Never    | Key implementations, major features              |
| **normal**         | 1.0x  | 90-day   | Standard development context (default)           |
| **temporary**      | 0.5x  | 7-day    | Debug sessions, experiments                      |
| **deprecated**     | 0.0x  | Excluded | Outdated information (preserved but hidden)      |

---

### 5-State Memory Model

Memories transition through discrete states based on attention scores:

| State        | Score Range | Behavior                 | Max Items |
| ------------ | ----------- | ------------------------ | --------- |
| **HOT**      | 0.80-1.00   | Always retrieve          | 5         |
| **WARM**     | 0.25-0.80   | Retrieve on match        | 10        |
| **COLD**     | 0.05-0.25   | Retrieve if nothing else | -         |
| **DORMANT**  | 0.02-0.05   | Skip unless explicit     | -         |
| **ARCHIVED** | 0.00-0.02   | Exclude from search      | -         |

This enables automatic cleanup without deletion. ARCHIVED memories are preserved but hidden from search.

---

### Type-Specific Half-Lives

Different memory types decay at different rates. A debug session fades faster than architectural knowledge:

| Type                    | Half-Life | Example                                 |
| ----------------------- | --------- | --------------------------------------- |
| constitutional          | Infinity  | "Never edit without reading first"      |
| procedural              | 90+ days  | "How to deploy to production"           |
| semantic                | 60 days   | "RRF stands for Reciprocal Rank Fusion" |
| episodic                | 14 days   | "Fixed bug XYZ on Tuesday"              |
| working                 | 1 day     | "Currently debugging auth flow"         |
| causal                  | 45 days   | Decision relationships                  |
| declarative             | 60 days   | Facts and definitions                   |
| contextual              | 30 days   | Session-specific context                |
| constitutional_critical | Infinity  | Never-forget critical rules             |

---

### Causal Memory Graph

Answer "why" queries by tracing decision lineage:

**6 Relationship Types:**

| Relation       | Meaning                        |
| -------------- | ------------------------------ |
| `caused`       | A directly led to B            |
| `enabled`      | A made B possible              |
| `supersedes`   | B replaces A                   |
| `contradicts`  | A and B conflict               |
| `derived_from` | B was extracted/learned from A |
| `supports`     | A provides evidence for B      |

**Usage:**
```typescript
memory_drift_why({ memoryId: 'abc123', maxDepth: 3 })
// Returns: { memory: {...}, causedBy: [...], enabledBy: [...], supersedes: [...] }
```

---

### Session Deduplication

Stop re-sending the same memories every query:

| Without Dedup                          | With Dedup                             |
| -------------------------------------- | -------------------------------------- |
| Query 1: Send 5 memories (5000 tokens) | Query 1: Send 5 memories (5000 tokens) |
| Query 2: Send same 5 memories again    | Query 2: Skip already-seen, send 2 new |
| Query 3: Send same 5 memories again    | Query 3: Skip already-seen, send 1 new |
| **Total: 15,000 tokens**               | **Total: 8,000 tokens (-47%)**         |

Hash-based Set tracks `sentMemories` per session. State persists to SQLite for crash recovery.

---

### MCP Tools (22)

**Search & Retrieval**

| Tool                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| `memory_search`         | Semantic search with vector similarity |
| `memory_match_triggers` | Fast keyword matching (<50ms)          |
| `memory_list`           | Browse stored memories                 |
| `memory_stats`          | Get system statistics                  |

**CRUD Operations**

| Tool                | Purpose                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `memory_save`       | Index a memory file                                                                                                   |
| `memory_index_scan` | Bulk scan and index workspace (`includeReadmes`: boolean, default `true`. `includeSpecDocs`: boolean, default `true`) |
| `memory_update`     | Update memory metadata and tier                                                                                       |
| `memory_delete`     | Delete memories by ID or folder                                                                                       |
| `memory_validate`   | Record validation feedback                                                                                            |

**Checkpoints**

| Tool                 | Purpose                                |
| -------------------- | -------------------------------------- |
| `checkpoint_create`  | Snapshot current state with embeddings |
| `checkpoint_list`    | List available checkpoints             |
| `checkpoint_restore` | Restore from checkpoint                |
| `checkpoint_delete`  | Remove checkpoint                      |

**Session Learning**

| Tool                          | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `task_preflight`              | Capture epistemic baseline before task            |
| `task_postflight`             | Capture post-task state, calculate Learning Index |
| `memory_get_learning_history` | Get learning trends and summaries                 |

**Causal Tools**

| Tool                   | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `memory_drift_why`     | Trace causal chain for decision lineage      |
| `memory_causal_link`   | Create causal relationships between memories |
| `memory_causal_stats`  | Graph statistics and coverage metrics        |
| `memory_causal_unlink` | Remove causal relationships                  |
| `memory_context`       | L1 Orchestration unified entry point         |

> **Note:** Full tool names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search`).

---

### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval. Current coverage is **533 anchor tags** across **78 skill READMEs**, which enables precise section-level memory retrieval without loading full files.

```markdown
<!-- ANCHOR: decision-auth-flow -->
## Authentication Decision
We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension without re-login
<!-- /ANCHOR: decision-auth-flow -->
```

**Common Anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

---

### Search Architecture

**Triple-Hybrid Search with RRF Fusion:**

```
Query
   |
   v
+------------------+     +------------------+     +------------------+
|  Vector Search   |     |   BM25 Search    |     |  Graph Traversal |
|   (Semantic)     |     |   (Keyword)      |     |   (Causal)       |
|   Weight: 1.0x   |     |   Weight: 1.0x   |     |   Weight: 1.5x   |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
                    +-------------+-------------+
                    |   RRF Fusion (k=60)       |
                    |   +10% convergence bonus  |
                    +-------------+-------------+
                                  |
                                  v
                    +-------------+-------------+
                    |  Cross-Encoder Reranking  |
                    |   (top-20 candidates)     |
                    +-------------+-------------+
                                  |
                                  v
                         Final Ranked Results
```

**KPI Impact:** +40-50% relevance improvement over single-engine search.

---

### Embedding Providers

| Provider     | Dimensions | Best For                           |
| ------------ | ---------- | ---------------------------------- |
| **Voyage**   | 1024       | Recommended, best retrieval        |
| **OpenAI**   | 1536/3072  | Alternative cloud option           |
| **HF Local** | 768        | Privacy, offline, default fallback |

**Auto-detection priority:** Voyage -> OpenAI -> HF Local

**Fallback Chain:** Primary API (Voyage/OpenAI) -> Local (HF) -> BM25-only

If embedding fails, the system degrades gracefully to keyword search.

---

### 5-Source Indexing Pipeline

The `memory_index_scan` tool indexes content from five distinct sources:

| #   | Source                   | Location Pattern                        | Weight              |
| --- | ------------------------ | --------------------------------------- | ------------------- |
| 1   | **Constitutional Rules** | `.opencode/skill/*/constitutional/*.md` | -                   |
| 2   | **Spec Documents**       | `.opencode/specs/**/*.md`               | Per-type multiplier |
| 3   | **Spec Memories**        | `specs/*/memory/*.{md,txt}`             | `0.5`               |
| 4   | **Project READMEs**      | `**/README.{md,txt}` (project root)     | `0.4`               |
| 5   | **Skill READMEs**        | `.opencode/skill/*/README.{md,txt}`     | `0.3`               |

Sources 4 and 5 are controlled by the `includeReadmes` parameter (default: `true`) and include README.md plus README.txt files. Source 2 is controlled by the `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Spec documents are scored with document-type multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), memory (1.0x), readme (0.8x), scratch (0.6x).

#### Tiered Importance Weights

README sources receive reduced importance to ensure user work memories always outrank documentation in search results:

| Source                    | `importance_weight` | Score Multiplier | Effect     |
| ------------------------- | ------------------: | :--------------: | ---------- |
| User work (spec memories) |               `0.5` |      `1.0x`      | Full score |
| Project READMEs           |               `0.4` |      `0.9x`      | -10%       |
| Skill READMEs             |               `0.3` |      `0.8x`      | -20%       |

The formula: `score *= (0.5 + importance_weight)`. At equal semantic relevance, user work always ranks higher.

> **Full details:** See [references/memory/readme_indexing.md](./references/memory/readme_indexing.md) for discovery functions, exclude patterns, YAML frontmatter options and known limitations.

### Feature Flags

| Flag | Default | Purpose | Source |
|------|---------|---------|--------|
| `SPECKIT_ADAPTIVE_FUSION` | `false` | Enable intent-aware weighted RRF fusion (replaces standard fixed-weight RRF) | `mcp_server/lib/search/adaptive-fusion.ts` |
| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Enable 4-dimension retrieval telemetry (latency, mode, fallback activation, quality score) | `mcp_server/lib/telemetry/retrieval-telemetry.ts` |

Set via environment variables before starting the MCP server. See [mcp_server/README.md](./mcp_server/README.md) for full configuration details and the [rollback runbook](./references/workflows/rollback-runbook.md) for safe flag toggling procedures.

---

<!-- /ANCHOR:memory-system -->
## 6. TEMPLATES
<!-- ANCHOR:templates -->

### Template Overview

| Template                    | Level | Description                             |
| --------------------------- | ----- | --------------------------------------- |
| `spec.md`                   | 1+    | Feature specification with user stories |
| `plan.md`                   | 1+    | Implementation plan with architecture   |
| `tasks.md`                  | 1+    | Task breakdown by user story            |
| `implementation-summary.md` | 1+    | Post-implementation summary             |
| `checklist.md`              | 2+    | Validation/QA checklists (P0/P1/P2)     |
| `decision-record.md`        | 3+    | Architecture Decision Records           |
| `research.md`               | 3     | Comprehensive multi-domain research     |
| `handover.md`               | Any   | Full session continuity                 |
| `debug-delegation.md`       | Any   | Sub-agent debugging delegation          |
| `context_template.md`       | Any   | Memory context template                 |

### Template Composition (CORE + ADDENDUM)

```
Level 1:  [CORE templates only]        -> 4 files, ~455 LOC
Level 2:  [CORE] + [L2-VERIFY]         -> 6 files, ~875 LOC
Level 3:  [CORE] + [L2] + [L3-ARCH]    -> 7 files, ~1090 LOC
Level 3+: [CORE] + [all addendums]     -> 7 files, ~1350 LOC
```

**Why this matters:** Update CORE once -> all levels inherit changes. No content duplication.

### Copy Commands

```bash
# Level 1 (Baseline)
cp .opencode/skill/system-spec-kit/templates/level_1/*.md specs/###-name/

# Level 2 (Add verification)
cp .opencode/skill/system-spec-kit/templates/level_2/*.md specs/###-name/

# Level 3 (Full documentation)
cp .opencode/skill/system-spec-kit/templates/level_3/*.md specs/###-name/

# Utility templates
cp .opencode/skill/system-spec-kit/templates/handover.md specs/###-name/
```

### Priority System (checklist.md)

| Priority | Meaning      | Deferral Rules                          |
| -------- | ------------ | --------------------------------------- |
| **P0**   | HARD BLOCKER | MUST complete, cannot defer             |
| **P1**   | Required     | MUST complete OR user-approved deferral |
| **P2**   | Optional     | Can defer without approval              |

---

<!-- /ANCHOR:templates -->
## 7. SCRIPTS
<!-- ANCHOR:scripts -->

### Script Overview

| Script                           | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| `spec/create.sh`                 | Create feature branch & spec folder                    |
| `spec/validate.sh`               | Validation orchestrator (13 rules)                     |
| `spec/test-validation.sh`        | Validation regression suite (exit codes + rule failures) |
| `spec/calculate-completeness.sh` | Calculate completeness %                               |
| `spec/check-placeholders.sh`     | Verify zero placeholders after upgrade + auto-populate |
| `spec/recommend-level.sh`        | Recommend documentation level                          |
| `spec/archive.sh`                | Archive completed spec folders                         |
| `memory/generate-context.ts`     | Memory file generation (source)                        |
| `templates/compose.sh`           | Compose level templates                                |

### Validation Rules (13 Total)

| Rule                 | Severity | Description                               |
| -------------------- | -------- | ----------------------------------------- |
| `FILE_EXISTS`        | ERROR    | Required files present for level          |
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` patterns |
| `SECTIONS_PRESENT`   | WARNING  | Required markdown sections exist          |
| `LEVEL_DECLARED`     | INFO     | Level explicitly stated                   |
| `PRIORITY_TAGS`      | WARNING  | P0/P1/P2 format validated                 |
| `EVIDENCE_CITED`     | WARNING  | Non-P2 items cite evidence                |
| `ANCHORS_VALID`      | ERROR    | Memory file anchor pairs matched          |
| `FOLDER_NAMING`      | ERROR    | Follows `###-short-name` convention       |
| `FRONTMATTER_VALID`  | WARNING  | YAML frontmatter structured correctly     |
| `COMPLEXITY_MATCH`   | WARNING  | Content metrics match declared level      |
| `AI_PROTOCOL`        | WARNING  | Level 3/3+ has AI execution protocols     |
| `LEVEL_MATCH`        | ERROR    | Level consistent across all files         |
| `SECTION_COUNTS`     | WARNING  | Section counts within expected ranges     |

**Exit Codes:** `0` = Pass | `1` = Warnings | `2` = Errors

### Feature Creation

```bash
# Create spec folder with level 2 templates
./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2

# Skip git branch creation
./scripts/spec/create.sh "Add OAuth2" --level 1 --skip-branch
```

### Memory Generation

```bash
# Generate memory file for spec folder (executes compiled JS from dist/)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/042-feature/
```

**IMPORTANT:** Memory files MUST be created via this script, not manually. Source is TypeScript (`generate-context.ts`). `node` executes the compiled `.js` output from `dist/`.

---

<!-- /ANCHOR:scripts -->
## 8. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Spec Folder Not Found

**Symptom:** Commands fail with "No spec folder found"

**Solution:**
```bash
# Check current branch
git branch --show-current

# List existing spec folders
ls -d specs/[0-9]*/

# Create spec folder if missing
./scripts/spec/create.sh "feature name" --level 2
```

#### Template Placeholders Not Replaced

**Symptom:** Validation blocks with "Placeholders found"

**Solution:**
```bash
# Find all placeholders
grep -r "\[YOUR_VALUE_HERE\]" specs/042-feature/
grep -r "\[PLACEHOLDER\]" specs/042-feature/

# Replace with actual content
```

#### Memory Loading Issues

**Symptom:** Previous context not loaded

**Solution:**
```bash
# Verify memory folder exists
ls -la specs/###-folder/memory/

# Check file naming pattern (DD-MM-YY_HH-MM__topic.md)
ls specs/###-folder/memory/*__*.md

# Force re-index
memory_index_scan({ specFolder: "###-folder" })
```

### Quick Fixes

| Problem               | Quick Fix                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| Spec folder not found | `./scripts/spec/create.sh "name" --level 1`                               |
| Validation failing    | `./scripts/spec/validate.sh <folder> --verbose`                           |
| Memory not indexing   | `memory_index_scan({ specFolder: "..." })`                                |
| ANCHOR tag mismatch   | Check every `<!-- ANCHOR: name -->` has matching `<!-- /ANCHOR: name -->` |
| Embedding API errors  | Check API key or set `EMBEDDINGS_PROVIDER=hf-local`                       |

### Recovery Hints

Every error now includes actionable recovery guidance. 49 error codes mapped to specific recovery commands:

```typescript
// Example error response
{
  error: 'E041',
  message: 'Vector index corrupted',
  recovery: 'Run memory_index_scan to rebuild vector index'
}
```

---

<!-- /ANCHOR:troubleshooting -->

## 9. FAQ
<!-- ANCHOR:faq -->

### Common Questions

**Q: Do I need a spec folder for every file change?**

A: Yes for non-trivial file changes. Tiny typo fixes under five characters in one file and whitespace-only edits are exempt.

**Q: When should I choose Level 2 instead of Level 1?**

A: Use Level 2 when a change spans multiple files or needs verification evidence in `checklist.md`.

**Q: How do I recover context after a crash or compaction?**

A: Start with `/memory:continue`. If you need focused context, call `memory_search` with anchors such as `state` and `next-steps`.

**Q: Can I write memory files manually?**

A: No. Use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` so format and indexing stay consistent.

---

<!-- /ANCHOR:faq -->

## 10. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document                                                                                 | Purpose                                                      |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [SKILL.md](./SKILL.md)                                                                   | AI workflow instructions (routing, validation, command protocols) |
| [mcp_server/README.md](./mcp_server/README.md)                                           | Memory MCP installation and configuration                    |
| [references/memory/memory_system.md](./references/memory/memory_system.md)               | Memory system detailed reference                             |
| [references/memory/readme_indexing.md](./references/memory/readme_indexing.md)           | 5-source indexing pipeline, README weights, discovery        |
| [references/validation/validation_rules.md](./references/validation/validation_rules.md) | All validation rules and fixes                               |
| [references/validation/five-checks.md](./references/validation/five-checks.md)           | Five Checks evaluation framework                             |
| [../workflows-code--opencode/SKILL.md](../workflows-code--opencode/SKILL.md)             | Mandatory standard for all code creation and updates         |
| [../workflows-documentation/SKILL.md](../workflows-documentation/SKILL.md)               | Mandatory standard for all documentation creation and updates |

### Directory Structure

```
.opencode/skill/system-spec-kit/
|-- SKILL.md                   # AI workflow instructions
|-- README.md                  # This file
|-- templates/                 # Template system (CORE + ADDENDUM)
|   |-- core/                  # Foundation templates (4 files)
|   |-- addendum/              # Level-specific additions
|   |-- level_1/ - level_3+/   # Composed templates by level
|   |__ *.md                   # Utility templates
|-- scripts/                   # Automation scripts [TypeScript source]
|   |-- spec/                  # Spec folder management
|   |-- memory/                # Memory system scripts
|   |-- rules/                 # Validation rules (13)
|   |-- tests/                 # Test suite (122 test files)
|   |__ dist/                  # Compiled JavaScript output
|-- shared/                    # Shared workspace (@spec-kit/shared)
|-- mcp_server/                # Spec Kit Memory MCP [TypeScript source]
|   |-- context-server.ts      # MCP server entry (22 tools)
|   |-- core/                  # Core initialization
|   |-- handlers/              # Tool handlers
|   |-- hooks/                 # Lifecycle hooks
|   |-- lib/                   # Server libraries
|   |   |-- cognitive/         # FSRS, PE gating, 5-state model
|   |   |-- search/            # Vector, BM25, RRF fusion, cross-encoder
|   |   |-- session/           # Deduplication, crash recovery
|   |   |-- storage/           # SQLite, causal edges
|   |   |-- providers/         # Embedding providers
|   |   |__ errors/            # Recovery hints (49 codes)
|   |-- utils/                 # Utility modules
|   |-- formatters/            # Output formatting
|   |-- dist/                  # Compiled JavaScript output
|   |__ database/              # SQLite + vector search
|-- references/                # Documentation (19 files)
|-- assets/                    # Decision matrices
|__ constitutional/            # Always-surface rules
```

### Key Locations

| Resource       | Location                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Templates**  | `.opencode/skill/system-spec-kit/templates/`                                             |
| **Scripts**    | `.opencode/skill/system-spec-kit/scripts/`                                               |
| **Memory MCP** | `.opencode/skill/system-spec-kit/mcp_server/`                                            |
| **References** | `.opencode/skill/system-spec-kit/references/`                                            |
| **Commands**   | `.opencode/command/spec_kit/` and `.opencode/command/memory/` (12 files, all ≤600 lines) |

### External Dependencies

| Resource    | Purpose                             |
| ----------- | ----------------------------------- |
| `AGENTS.md` | Project-level AI behavior framework + gate definitions and enforcement |
| `specs/`    | Directory for all spec folders      |

<!-- /ANCHOR:related -->
