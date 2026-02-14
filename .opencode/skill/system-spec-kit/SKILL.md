---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.8.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

---

## 1. 🎯 WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Always under `specs/` directory with format `###-short-name/`
- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.

### Agent Exclusivity

**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).

- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
- **Exceptions:**
  - `memory/` → uses generate-context.js script
  - `scratch/` → temporary workspace, any agent
  - `handover.md` → @handover agent only
  - `research.md` → @research agent only
  - `debug-delegation.md` → @debug agent only

Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
User Request
    │
    ├─► Contains "spec", "plan", "document", "checklist"?
    │   └─► YES → Activate SpecKit (spec folder workflow)
    │
    ├─► File modification requested?
    │   └─► Gate 3 triggered → Ask spec folder question
    │
    ├─► Contains "debug", "stuck", "help"?
    │   └─► Route to /spec_kit:debug
    │
    ├─► Contains "continue", "resume", "pick up"?
    │   └─► Route to /spec_kit:resume
    │
    ├─► Contains "save context", "save memory", "/memory:save"?
    │   └─► Execute generate-context.js → Index to Spec Kit Memory
    │
    ├─► Contains "search memory", "find context", "what did we"?
    │   └─► Use memory_search({ query: "..." }) MCP tool (query OR concepts required)
    │
    ├─► Contains "checkpoint", "save state", "restore"?
    │   └─► Use checkpoint_create/restore MCP tools
    │
    └─► Gate enforcement triggered (file modification)?
        └─► Constitutional memories auto-surface via memory_match_triggers()
```

### Memory System Triggers

> **Note:** Tool names use the full `spec_kit_memory_*` prefix as required by OpenCode MCP integration.

| Trigger Pattern                                     | Action                            | MCP Tool                                                                       |
| --------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| "save context", "save memory", `/memory:save`       | Generate + index memory file      | `spec_kit_memory_memory_save()`                                                |
| "search memory", "find prior", "what did we decide" | Semantic search across sessions   | `spec_kit_memory_memory_search({ query: "..." })` (query OR concepts required) |
| "list memories", "show context"                     | Browse stored memories            | `spec_kit_memory_memory_list()`                                                |
| "checkpoint", "save state"                          | Create named checkpoint           | `spec_kit_memory_checkpoint_create()`                                          |
| "restore checkpoint", "rollback"                    | Restore from checkpoint           | `spec_kit_memory_checkpoint_restore()`                                         |
| Gate enforcement (any file modification)            | Auto-surface constitutional rules | `spec_kit_memory_memory_match_triggers()`                                      |
| "continue", "resume", `/memory:continue`            | Session recovery (crash/timeout)  | `spec_kit_memory_memory_search()` + state anchors                              |
| "context", "get context", `/memory:context`         | Intent-aware context retrieval    | `spec_kit_memory_memory_context()` with intent routing                         |
| "correct", "correction", `/memory:learn correct`    | Learn from corrections            | `spec_kit_memory_memory_update()` with penalty                                 |
| "learn", "insight", `/memory:learn`                 | Capture session learnings         | `spec_kit_memory_memory_save()` with learning tier                             |
| "manage", "cleanup", "database", `/memory:manage`   | Database management + checkpoints | `spec_kit_memory_memory_stats()`, `memory_health()`, `checkpoint_*()`, etc.    |

### Cognitive Memory Features

The `memory_match_triggers()` tool includes cognitive features: **FSRS v4 attention decay** (power-law retrievability model), **tiered content injection** (HOT=full content, WARM=summary, COLD/DORMANT/ARCHIVED=metadata only), **co-activation** (BFS spreading activation across related memories), and **working memory** (session-scoped, 7-item capacity). Uses snake_case parameters (`session_id`, `include_cognitive`) unlike other tools.

**Full documentation:** See [mcp_server/README.md](./mcp_server/README.md#3--cognitive-memory) and [memory_system.md](./references/memory/memory_system.md).

### README Content Discovery

The memory system auto-discovers and indexes READMEs from 4 sources during `memory_index_scan()`: spec memories (0.5 weight), constitutional rules (per-file tier), skill READMEs (0.3), and project READMEs (0.4). READMEs require `<!-- ANCHOR:name -->` tags for section-level retrieval. Control with `includeReadmes` parameter (default: `true`).

**See:** [readme_indexing.md](./references/memory/readme_indexing.md) for discovery functions, exclude patterns, and weight rationale.

### Resource Router

**Phase-Based Loading:**

| Phase              | Trigger                               | Load Resources                             | Execute             |
| ------------------ | ------------------------------------- | ------------------------------------------ | ------------------- |
| **Planning**       | New feature, "plan", "design"         | level_specifications.md, template_guide.md | /spec_kit:plan      |
| **Research**       | "investigate", "explore", "analyze"   | quick_reference.md, worked_examples.md     | /spec_kit:research  |
| **Implementation** | "implement", "build", "code"          | validation_rules.md, template_guide.md     | /spec_kit:implement |
| **Debugging**      | "stuck", "error", "not working"       | quick_reference.md, troubleshooting.md     | /spec_kit:debug     |
| **Completion**     | "done", "finished", "complete"        | validation_rules.md, phase_checklists.md   | /spec_kit:complete  |

> **`/spec_kit:complete` flags:** Supports `:with-research` (runs research before verification) and `:auto-debug` (auto-dispatches debug agent on failures). Usage: `/spec_kit:complete :with-research :auto-debug`
| **Handover**       | "stopping", "break", "continue later" | quick_reference.md                         | /spec_kit:handover  |
| **Resume**         | "continue", "pick up", "resume"       | quick_reference.md                         | /spec_kit:resume    |

### Agent Dispatch in Commands

Spec_kit commands dispatch these agents at specific workflow steps (added in spec 014):

| Agent | Commands | Trigger | Behavior |
| ----- | -------- | ------- | -------- |
| **@debug** | implement (Step 6), complete (Step 10) | `failure_count >= 3` on same error | Auto-suggest `/spec_kit:debug`; `:auto-debug` flag auto-dispatches |
| **@review** | implement (Steps 8a/8b), complete (Steps 12a/12b) | End of implementation | Dual-phase: Mode 2 Pre-Commit (advisory) + Mode 4 Gate Validation (blocking on P0) |
| **@review** | debug (Step 5) | Post-fix validation | Advisory only (`blocking: false`) |
| **@research** | plan (Step 5) | `confidence < 60%` OR user request | Dispatched via `:with-research` flag or automatic confidence gating |
| **@handover** | plan (Step 7), implement (Step 9), complete (Step 14), research (Step 9) | Session end | Proactive context preservation; suggest handover document creation |

> **Note:** `resume.md` and `handover.md` commands are meta-workflow tools — they don't dispatch agents because they don't create code artifacts.

### Reference Sub-folders

| Sub-folder    | Purpose                         | Files                                                                                                |
| ------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `memory/`     | Context preservation, MCP tools | memory_system.md, save_workflow.md, trigger_config.md, epistemic-vectors.md, embedding_resilience.md |
| `templates/`  | Template system, level specs    | level_specifications.md, template_guide.md, template_style_guide.md, level_selection_guide.md        |
| `validation/` | Validation rules, checklists    | validation_rules.md, phase_checklists.md, path_scoped_rules.md, five-checks.md, decision-format.md   |
| `structure/`  | Folder organization, routing    | folder_structure.md, folder_routing.md, sub_folder_versioning.md                                     |
| `workflows/`  | Usage workflows, examples       | quick_reference.md, execution_methods.md, worked_examples.md                                         |
| `debugging/`  | Troubleshooting, debugging      | troubleshooting.md, universal_debugging_methodology.md                                               |
| `config/`     | Configuration                   | environment_variables.md                                                                             |

### Keyword-Based Routing

| Keywords                                          | Route To                 |
| ------------------------------------------------- | ------------------------ |
| "memory", "save context", "MCP", "trigger"        | `references/memory/`     |
| "embeddings", "vector", "semantic", "decay"       | `references/memory/`     |
| "anchor", "snapshot"                              | `references/memory/`     |
| "template", "level 1/2/3", "spec.md format"       | `references/templates/`  |
| "validate", "rules", "checklist", "P0/P1/P2"      | `references/validation/` |
| "folder", "naming", "structure", "versioning"     | `references/structure/`  |
| "workflow", "example", "commands", "quick"        | `references/workflows/`  |
| "debug", "error", "stuck", "troubleshoot"         | `references/debugging/`  |
| "env", "environment", "configuration"             | `references/config/`     |
| "scripts", "generate-context", "check-completion" | `scripts/`               |

### Shared Modules (`shared/`)

Canonical TypeScript modules shared between CLI scripts and MCP server (`@spec-kit/shared` v1.7.2). Modules: `embeddings.ts` (with provider factory for HuggingFace local, OpenAI, and Voyage), `normalization.ts`, `chunking.ts`, `trigger-extractor.ts`, `types.ts`. Subdirectories: `embeddings/` (factory, profile, providers), `scoring/` (folder-scoring), `utils/` (path-security, retry). Source is `.ts`; compiled CommonJS `.js` output is produced in-place.

**Full documentation:** See [shared/README.md](./shared/README.md)

### Configuration (`config/`)

Runtime configuration for the memory system:
- `config.jsonc` — Legacy settings (only Section 1 active; MCP server uses hardcoded values)
- `filters.jsonc` — Content filtering pipeline

**Full documentation:** See [environment_variables.md](./references/config/environment_variables.md)

### Resource Inventory

**Template Architecture (CORE + ADDENDUM v2.2):**

| Folder                | Contents            | When to Use               |
| --------------------- | ------------------- | ------------------------- |
| `templates/level_1/`  | 5 files (~455 LOC)  | **Default for new specs** |
| `templates/level_2/`  | 6 files (~875 LOC)  | QA validation needed      |
| `templates/level_3/`  | 7 files (~1090 LOC) | Architecture decisions    |
| `templates/level_3+/` | 7 files (~1075 LOC) | Enterprise governance     |

> **Source of truth for template LOC counts:** [level_specifications.md](./references/templates/level_specifications.md)

> **IMPORTANT:** Always copy from `templates/level_N/`. The `core/` and `addendum/` folders are source components only.

**Key Scripts:**

| Script                 | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `generate-context.ts`  | Generate memory files from conversation (source) |
| `spec/validate.sh`     | Validate spec folder structure                |
| `spec/create.sh`       | Create new spec folders with templates        |
| `spec/archive.sh`      | Archive completed spec folders to z_archive/  |
| `spec/check-completion.sh` | Completion Verification Rule enforcement  |
| `spec/recommend-level.sh`  | Automated spec level recommendation       |
| `templates/compose.sh` | Compose level templates from core + addendums |

**Full documentation:** See [level_specifications.md](./references/templates/level_specifications.md) and [template_guide.md](./references/templates/template_guide.md)

> **generate-context.ts** accepts two input modes: a spec folder path (direct) or a JSON file path (manual injection). Source `.ts` compiled to `scripts/dist/`. See [scripts/README.md](./scripts/README.md) for architecture and [save_workflow.md](./references/memory/save_workflow.md) for JSON schema.

---

## 3. 🛠️ HOW IT WORKS

### Gate 3 Integration

> **See AGENTS.md Section 2** for the complete Gate 3 flow. This skill implements that gate.

When file modification detected, AI MUST ask:

```
**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip
```

| Option          | Description                        | Best For                        |
| --------------- | ---------------------------------- | ------------------------------- |
| **A) Existing** | Continue in related spec folder    | Iterative work, related changes |
| **B) New**      | Create `specs/###-name/`           | New features, unrelated work    |
| **C) Update**   | Add to existing documentation      | Extending existing docs         |
| **D) Skip**     | No spec folder (creates tech debt) | Trivial changes only            |

**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.

### Complexity Detection (Option B Flow)

When user selects **B) New**, AI estimates complexity and recommends a level:

1. Estimate LOC, files affected, risk factors
2. Recommend level (1, 2, 3, or 3+) with rationale
3. User accepts or overrides
4. Run `./scripts/spec/create.sh --level N`

**Level Guidelines:**

| LOC     | Level | Template Folder       |
| ------- | ----- | --------------------- |
| <100    | 1     | `templates/level_1/`  |
| 100-499 | 2     | `templates/level_2/`  |
| ≥500    | 3     | `templates/level_3/`  |
| Complex | 3+    | `templates/level_3+/` |

**See:** [quick_reference.md](./references/workflows/quick_reference.md) for detailed examples.

**CLI Tool:**
```bash
# Create spec folder with level 2 templates
./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2

# Create spec folder with level 3+ (extended) templates
./scripts/spec/create.sh "Major platform migration" --level 3+
```

### 3-Level Progressive Enhancement (CORE + ADDENDUM v2.2)

Higher levels ADD VALUE, not just length. Each level builds on the previous:

```
Level 1 (Core):         Essential what/why/how (~455 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~1090 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~1075 LOC)
```

| Level  | LOC Guidance | Required Files                                        | What It ADDS                                |
| ------ | ------------ | ----------------------------------------------------- | ------------------------------------------- |
| **1**  | <100         | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how                      |
| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
| **3**  | ≥500         | Level 2 + decision-record.md                          | Architecture decisions, ADRs                |
| **3+** | Complex      | Level 3 + extended content                            | Governance, approval workflow, AI protocols |

**Level Selection Examples:**

| Task                 | LOC Est. | Level | Rationale                      |
| -------------------- | -------- | ----- | ------------------------------ |
| Fix CSS alignment    | 10       | 1     | Simple, low risk               |
| Add form validation  | 80       | 1-2   | Borderline, low complexity     |
| Modal component      | 200      | 2     | Multiple files, needs QA       |
| Auth system refactor | 600      | 3     | Architecture change, high risk |
| Database migration   | 150      | 3     | High risk overrides LOC        |

**Override Factors (can push to higher level):**
- High complexity or architectural changes
- Risk (security, config cascades, authentication)
- Multiple systems affected (>5 files)
- Integration vs unit test requirements

**Decision rule:** When in doubt → choose higher level. Better to over-document than under-document.

### Checklist as Verification Tool (Level 2+)

The `checklist.md` is an **ACTIVE VERIFICATION TOOL**, not passive documentation:

| Priority | Meaning      | Deferral Rules                          |
| -------- | ------------ | --------------------------------------- |
| **P0**   | HARD BLOCKER | MUST complete, cannot defer             |
| **P1**   | Required     | MUST complete OR user-approved deferral |
| **P2**   | Optional     | Can defer without approval              |

**AI Workflow:**
1. Load checklist.md at completion phase
2. Verify items in order: P0 → P1 → P2
3. Mark `[x]` with evidence for each verified item
4. Cannot claim "done" until all P0/P1 items verified

**Evidence formats:**
- `[Test: npm test - all passing]`
- `[File: src/auth.ts:45-67]`
- `[Commit: abc1234]`
- `[Screenshot: evidence/login-works.png]`
- `(verified by manual testing)`
- `(confirmed in browser console)`

**Example checklist entry:**
```markdown
## P0 - Blockers
- [x] Auth flow working [Test: npm run test:auth - 12/12 passing]
- [x] No console errors [Screenshot: evidence/console-clean.png]

## P1 - Required  
- [x] Unit tests added [File: tests/auth.test.ts - 8 new tests]
- [ ] Documentation updated [DEFERRED: Will complete in follow-up PR]
```

### Folder Naming Convention

**Format:** `specs/###-short-name/`

**Rules:**
- 2-3 words (shorter is better)
- Lowercase, hyphen-separated
- Action-noun structure
- 3-digit padding: `001`, `042`, `099` (no padding past 999)

**Good examples:** `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`
**Bad examples:** `new-feature-implementation`, `UpdateUserAuthSystem`, `fix_bug`

**Find next number:**
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

### Sub-Folder Versioning

When reusing spec folders with existing content:
- Trigger: Option A selected + root-level content exists
- Pattern: `001-original/`, `002-new-work/`, `003-another/`
- Memory: Each sub-folder has independent `memory/` directory
- Tracking: Spec folder path passed via CLI argument (stateless)

**Example structure:**
```
specs/007-auth-system/
├── 001-initial-implementation/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
├── 002-oauth-addition/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
└── 003-security-audit/
    ├── spec.md
    └── memory/
```

**Full documentation:** See [sub_folder_versioning.md](./references/structure/sub_folder_versioning.md)

### Context Preservation

**Manual context save (MANDATORY workflow):**
- Trigger: `/memory:save`, "save context", or "save memory"
- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
- **NEVER:** Create memory files manually via Write/Edit (AGENTS.md Memory Save Rule)
- Location: `specs/###-folder/memory/`
- Filename: `DD-MM-YY_HH-MM__topic.md` (auto-generated by script)
- Content includes: PROJECT STATE SNAPSHOT with Phase, Last Action, Next Action, Blockers

**Memory File Structure:**
```markdown
<!-- ANCHOR:context -->
## Project Context
[Auto-generated summary of conversation and decisions]
<!-- /ANCHOR:context -->

<!-- ANCHOR:state -->
## Project State Snapshot
- Phase: Implementation
- Last Action: Completed auth middleware
- Next Action: Add unit tests for login flow
- Blockers: None
<!-- /ANCHOR:state -->

<!-- ANCHOR:artifacts -->
## Key Artifacts
- Modified: src/middleware/auth.ts
- Created: src/utils/jwt.ts
<!-- /ANCHOR:artifacts -->
```

### Spec Kit Memory System (Integrated)

Context preservation across sessions via hybrid search (vector similarity + BM25 + FTS with Reciprocal Rank Fusion).

**Server:** `@spec-kit/mcp-server` v1.7.2 — `context-server.ts` (~903 lines) with 11 handler files, 17 lib subdirectories, and 22 MCP tools across 7 layers.

**MCP Tools (8 most-used of 22 total — see [memory_system.md](./references/memory/memory_system.md) for full reference):**

| Tool                            | Layer | Purpose                                           |
| ------------------------------- | ----- | ------------------------------------------------- |
| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
| `memory_search()`               | L2    | Hybrid search (vector + FTS + BM25 with RRF fusion) |
| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
| `memory_save()`                 | L2    | Index a memory file with pre-flight validation    |
| `memory_list()`                 | L3    | Browse stored memories with pagination            |
| `memory_delete()`               | L4    | Delete memories by ID or spec folder              |
| `checkpoint_create()`           | L5    | Create gzip-compressed checkpoint snapshot        |
| `checkpoint_restore()`          | L5    | Transaction-wrapped restore with rollback         |

> Other tools: `memory_stats()` (L3), `memory_health()` (L3), `memory_update()` (L4), `memory_validate()` (L4), `checkpoint_list/delete()` (L5), `task_preflight/postflight()` (L6), `memory_drift_why/causal_link/causal_stats/causal_unlink()` (L6), `memory_index_scan()` (L7), `memory_get_learning_history()` (L7). Full tool names use `spec_kit_memory_` prefix.

**memory_context() — Mode Routing:**

| Mode | Token Budget | When `mode=auto`: Intent Routing |
| --- | --- | --- |
| `quick` | 800 | — |
| `deep` | 2000 | `add_feature`, `refactor`, `security_audit` |
| `focused` | 1500 | `fix_bug`, `understand` |
| `resume` | 1200 | — |

**memory_search() — Key Rules:**
- **REQUIRED:** `query` (string) OR `concepts` (2-5 strings). `specFolder` alone causes E040 error.
- Use `anchors` with `includeContent: true` for token-efficient section retrieval (~90% savings).
- Intent weights auto-adjust scoring: `fix_bug` boosts recency, `security_audit` boosts importance, `refactor`/`understand` boost similarity.
- **Full parameter reference:** See [memory_system.md](./references/memory/memory_system.md)

**Epistemic Learning:** Use `task_preflight()` before and `task_postflight()` after implementation to measure knowledge gains. Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`. Review trends via `memory_get_learning_history()`. See [epistemic-vectors.md](./references/memory/epistemic-vectors.md).

**Key Concepts:**
- **Constitutional tier** — 3.0x search boost + 2.0x importance multiplier; merged into normal scoring pipeline
- **Decay scoring** — FSRS v4 power-law model; recent memories rank higher
- **Real-time sync** — Use `memory_save` or `memory_index_scan` after creating files
- **Checkpoints** — Gzip-compressed JSON snapshots of memory_index + working_memory; max 10 stored; transaction-wrapped restore
- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility

> **Token budgets per layer:** L1:2000, L2:1500, L3:800, L4:500, L5:600, L6:1200, L7:1000 (enforced via `chars/4` approximation).

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.

### Consolidated Question Protocol

All commands use a **single consolidated prompt** to gather required inputs in one interaction:

1. **Spec Folder Selection** — A) Existing | B) New | C) Update related | D) Skip
2. **Memory Context** — A) Load recent | B) Load all | C) Skip
3. **Execution Mode** — A) Autonomous | B) Interactive (if applicable)

Commands consolidate all questions into ONE user prompt to minimize round-trips. See individual command files for specific question sets.

> **Note:** Users can reply with shorthand (e.g., "A, C, A") to answer all questions at once.

### Prior Work Search (Research Workflow Phase 3)

During `/spec_kit:research`, Phase 3 automatically searches for related prior work via `memory_match_triggers()` (keyword) and `memory_search()` (semantic). If matches are found, the user is asked to load all matches, constitutional only, or skip. Constitutional tier memories receive a 3.0x search boost. This phase runs between Spec Folder Setup (Phase 2) and Memory Context Loading (Phase 4) and is skipped if no prior work exists.

**See:** `/spec_kit:research` command for the full 9-step research workflow.

### Debug Delegation Workflow

**Trigger:** `/spec_kit:debug`, frustration keywords ("stuck", "can't fix"), or same error 3+ times. **MANDATORY:** After 3 failed attempts on the same error, suggest `/spec_kit:debug` before continuing.

**Flow:** Ask model selection (Claude/Gemini/OpenAI/Other) → Generate `debug-delegation.md` → Dispatch sub-agent via Task tool → Present findings → Update with resolution. The `:auto-debug` flag on `/spec_kit:complete` can auto-dispatch without manual invocation.

**Full details:** See `.opencode/agent/debug.md` and `templates/debug-delegation.md`.

### Command Pattern Protocol

Commands in `.opencode/command/**/*.md` are **Reference Patterns**:

1. **Scan** available commands for relevance to task
2. **Extract** logic (decision trees), sequencing (order of ops), structure (outputs)
3. **Adapt** if <80% match; apply directly if >80%
4. **Report** contributions in `implementation-summary.md`

> **Exception:** Explicitly invoked commands (e.g., `/spec_kit:complete`) are **ENFORCED LAW**, not just reference.

### Parallel Dispatch Configuration

SpecKit supports smart parallel sub-agent dispatch based on 5-dimension complexity scoring:
- **<20% complexity:** Proceed directly
- **≥20% + 2 domains:** Ask user for dispatch preference
- **Step 6 Planning:** Auto-dispatches 4 parallel exploration agents

**Full configuration:** See [parallel_dispatch_config.md](./assets/parallel_dispatch_config.md)

### Validation Workflow

Automated validation of spec folder contents via `validate.sh`.

**Usage:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder>`

**Exit Codes:**

| Code | Meaning                         | Action                       |
| ---- | ------------------------------- | ---------------------------- |
| 0    | Passed (no errors, no warnings) | Proceed with completion      |
| 1    | Passed with warnings            | Address or document warnings |
| 2    | Failed (errors found)           | MUST fix before completion   |

**Completion Verification:**
1. Run validation: `./scripts/spec/validate.sh <spec-folder>`
2. Exit 2 → FIX errors
3. Exit 1 → ADDRESS warnings or document reason
4. Exit 0 → Proceed with completion claim

**Full documentation:** See [validation_rules.md](./references/validation/validation_rules.md) for all rules, configuration, and troubleshooting.

---

## 4. 📋 RULES

### ✅ ALWAYS

1. **Determine level (1/2/3/3+) before ANY file changes** - Count LOC, assess complexity/risk
2. **Copy templates from `templates/level_N/`** - Use level folders, NEVER create from scratch
3. **Fill ALL placeholders** - Remove `[PLACEHOLDER]` and sample content
4. **Ask A/B/C/D when file modification detected** - Present options, wait for selection
5. **Check for related specs before creating new folders** - Search keywords, review status
6. **Get explicit user approval before changes** - Show level, path, templates, approach
7. **Use consistent folder naming** - `specs/###-short-name/` format
8. **Use checklist.md to verify (Level 2+)** - Load before claiming done
9. **Mark items `[x]` with evidence** - Include links, test outputs, screenshots
10. **Complete P0/P1 before claiming done** - No exceptions
11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
12. **Run validate.sh before completion** - Completion Verification requirement
13. **Create implementation-summary.md at end of implementation phase (Level 1+)** - Document what was built
14. **Suggest /spec_kit:handover when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
15. **Suggest /spec_kit:debug after 3+ failed fix attempts on same error** - Do not continue without offering debug delegation

### ❌ NEVER

1. **Create documentation from scratch** - Use templates only
2. **Skip spec folder creation** - Unless user explicitly selects D
3. **Make changes before spec + approval** - Spec folder is prerequisite
4. **Leave placeholders in final docs** - All must be replaced
5. **Decide autonomously update vs create** - Always ask user
6. **Claim done without checklist verification** - Level 2+ requirement
7. **Proceed without spec folder confirmation** - Wait for A/B/C/D
8. **Skip validation before completion** - Completion Verification hard block

### ⚠️ ESCALATE IF

1. **Scope grows during implementation** - Add higher-level templates, document change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

## 5. 🏆 SUCCESS CRITERIA

### Documentation Created

- [ ] Spec folder exists at `specs/###-short-name/`
- [ ] Folder name follows convention (2-3 words, lowercase, hyphen-separated)
- [ ] Number is sequential (no gaps or duplicates)
- [ ] Correct level templates copied (not created from scratch)
- [ ] All placeholders replaced with actual content
- [ ] Sample content and instructional comments removed
- [ ] Cross-references to sibling documents work (spec.md ↔ plan.md ↔ tasks.md)

### User Approval

- [ ] Asked user for A/B/C/D choice when file modification detected
- [ ] Documentation level presented with rationale
- [ ] Spec folder path shown before creation
- [ ] Templates to be used listed
- [ ] Explicit approval ("yes", "go ahead", "proceed") received before file changes

### Context Preservation

- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
- [ ] Memory files contain PROJECT STATE SNAPSHOT section
- [ ] Manual saves triggered via `/memory:save` or keywords
- [ ] Anchor pairs properly formatted and closed

### Checklist Verification (Level 2+)

- [ ] Loaded checklist.md before claiming completion
- [ ] Verified items in priority order (P0 → P1 → P2)
- [ ] All P0 items marked `[x]` with evidence
- [ ] All P1 items marked `[x]` with evidence
- [ ] P2 items either verified or deferred with documented reason
- [ ] No unchecked P0/P1 items remain

### Validation Passed

- [ ] Ran `validate.sh` on spec folder
- [ ] Exit code is 0 (pass) or 1 (warnings only)
- [ ] All ERROR-level issues resolved
- [ ] WARNING-level issues addressed or documented

---

## 6. 🔌 INTEGRATION POINTS

### Priority System

| Priority | Level    | Deferral                                 |
| -------- | -------- | ---------------------------------------- |
| **P0**   | Blocker  | Cannot proceed without resolution        |
| **P1**   | Warning  | Must address or defer with user approval |
| **P2**   | Optional | Can defer without approval               |

### Validation Triggers

- **AGENTS.md Gate 3** → Validates spec folder existence and template completeness
- **AGENTS.md Completion Verification** → Runs validate.sh before completion claims
- **Manual `/memory:save`** → Context preservation on demand
- **Template validation** → Checks placeholder removal and required field completion

### Cross-Skill Workflows

| Workflow | Flow |
| --- | --- |
| **Spec → Implementation** | system-spec-kit → workflows-code → workflows-git → Spec Kit Memory |
| **Documentation Quality** | system-spec-kit → workflows-documentation (validate, score) → Iterate if <90 |
| **Validation** | Implementation complete → validate.sh → Fix errors → Address warnings → Claim completion |

### Quick Reference Commands

| Command | Usage |
| --- | --- |
| Create spec folder | `./scripts/spec/create.sh "Description" --short-name name --level 2` |
| Validate | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/007-feature/` |
| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/007-feature/` |
| Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
| Completeness | `.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh specs/007-feature/` |

---

## 7. 🔗 RELATED RESOURCES

### Related Skills

| Direction      | Skill                   | Integration                                           |
| -------------- | ----------------------- | ----------------------------------------------------- |
| **Upstream**   | None                    | This is the foundational workflow                     |
| **Downstream** | workflows-code          | Uses spec folders for implementation tracking         |
| **Downstream** | workflows-git           | References spec folders in commit messages and PRs    |
| **Downstream** | workflows-documentation | Validates spec folder documentation quality           |
| **Integrated** | Spec Kit Memory         | Context preservation via MCP (merged into this skill) |

### External Dependencies

| Resource          | Location                                                                   | Purpose                           |
| ----------------- | -------------------------------------------------------------------------- | --------------------------------- |
| Templates         | `templates/level_1/` through `level_3+/` (see Resource Inventory above)    | Pre-merged level templates        |
| Validation        | `scripts/spec/validate.sh`                                                 | Automated validation              |
| Gates             | `AGENTS.md` Section 2                                                      | Gate definitions                  |
| Memory gen        | `scripts/memory/generate-context.ts` → `scripts/dist/`                     | Memory file creation              |
| MCP Server        | `mcp_server/context-server.ts`                                             | Spec Kit Memory MCP (~903 lines)  |
| Database          | `mcp_server/database/context-index.sqlite`                                 | Vector search index               |
| Constitutional    | `constitutional/`                                                          | Always-surface rules              |

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and validation for all file modifications. Every conversation that modifies files MUST have a spec folder.