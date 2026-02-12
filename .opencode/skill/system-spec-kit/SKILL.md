---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.0.0
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

The `memory_match_triggers()` tool includes cognitive features for smarter context management:

- **Attention Decay (FSRS-preferred):** Memories decay based on FSRS v4 retrievability: `R(t) = (1 + 19/81 * t/S)^(-0.5)`. A deprecated legacy exponential fallback (`score * decayRate^(days/30)`) exists but FSRS is the primary model. Session-scoped linear decay (`score * 0.95` per tick) operates independently on working memory.
- **Tiered Content Injection:** Memories classified into 5 states based on FSRS retrievability thresholds:
  - **HOT** (R ≥ 0.80): Full file content injected
  - **WARM** (R ≥ 0.25): 150-character summary injected
  - **COLD** (R ≥ 0.05): Empty string (metadata only)
  - **DORMANT** (R ≥ 0.02): Empty string (metadata only)
  - **ARCHIVED** (R < 0.02 or >90 days): Empty string (metadata only)
  - Per-tier quantity limits: HOT=5, WARM=10, COLD=3, DORMANT=2, ARCHIVED=1 (configurable via env vars)
- **Co-activation:** Spreading activation via stored `related_memories` JSON — BFS traversal with `decayPerHop: 0.5`, max 2 hops, greedy best-first ordering. Config: `boostFactor: 0.15`, `maxRelated: 5`, `minSimilarity: 70`
- **Working Memory:** Session-scoped SQLite table with Miller's Law capacity limit (7 items), linear decay per tick, floor threshold 0.05 (delete threshold 0.01)

> ⚠️ **Parameter Naming Warning:** This tool uses snake_case parameters (`session_id`, `include_cognitive`) unlike all other tools which use camelCase (`sessionId`). Be careful with parameter naming when calling this tool.

**Full documentation:** See [mcp_server/README.md](./mcp_server/README.md#3--cognitive-memory) and [memory_system.md](./references/memory/memory_system.md).

### README Content Discovery

The memory system automatically discovers and indexes README files from skill directories:

**Indexed Sources:**

| Source | Pattern | Type | Spec Folder ID |
|--------|---------|------|----------------|
| Skill READMEs | `.opencode/skill/**/README.md` | `semantic` | `skill:SKILL-NAME` |

**How READMEs are indexed:**
- Discovered by `findSkillReadmes()` during `memory_index_scan()`
- Require `<!-- ANCHOR:name -->` tags for section-level retrieval
- Classified as `semantic` memory type with `normal` tier and reduced weight (0.3)
- READMEs are reference-grade documentation that surfaces when relevant but never outranks user work memories
- Searchable via all standard memory tools (`memory_search`, `memory_context`, etc.)

**Standard README Anchors:** `overview`, `quick-start`, `structure`, `features`, `configuration`, `examples`, `troubleshooting`, `faq`, `related`

**Example Retrieval:**
```
memory_search({ query: "how does the cognitive memory system work" })
→ May return anchored sections from .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
```

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
- `config.jsonc` — Legacy settings (only Section 1 is active — read by scripts; MCP server uses hardcoded values)
- `filters.jsonc` — Content filtering pipeline

> **Note:** The MCP server also has `mcp_server/configs/search-weights.json` for search weight tuning, but most values in that file are dead config (annotated with `_note` fields). Only `maxTriggersPerMemory: 10` is actively consumed by code. Other weights (vector, BM25, FTS, decay, tier boosts) are hardcoded in `composite-scoring.ts` and `importance-tiers.ts`.

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

**References (`references/`):**

| Sub-folder    | File                                 | Purpose                          | When to Load               |
| ------------- | ------------------------------------ | -------------------------------- | -------------------------- |
| `memory/`     | `memory_system.md`                   | MCP tool behavior and config     | Memory operations          |
| `memory/`     | `save_workflow.md`                   | Memory save workflow docs        | Context preservation       |
| `memory/`     | `trigger_config.md`                  | Trigger phrase configuration     | Setup                      |
| `memory/`     | `epistemic-vectors.md`               | Uncertainty tracking framework   | Gate decisions, planning   |
| `templates/`  | `level_specifications.md`            | Complete Level 1-3+ requirements | Planning                   |
| `templates/`  | `template_guide.md`                  | Template selection and usage     | Planning, Implementation   |
| `templates/`  | `template_style_guide.md`            | Template formatting conventions  | Documentation              |
| `validation/` | `validation_rules.md`                | All validation rules and fixes   | Implementation, Completion |
| `validation/` | `phase_checklists.md`                | Per-phase validation             | Completion                 |
| `validation/` | `path_scoped_rules.md`               | Path-scoped validation           | Advanced                   |
| `validation/` | `five-checks.md`                     | Five Checks evaluation framework | Planning, decisions        |
| `validation/` | `decision-format.md`                 | Structured gate decision format  | Gate decisions, logging    |
| `structure/`  | `folder_structure.md`                | Folder naming conventions        | Planning                   |
| `structure/`  | `folder_routing.md`                  | Folder routing logic             | Planning                   |
| `structure/`  | `sub_folder_versioning.md`           | Sub-folder workflow              | Reusing spec folders       |
| `workflows/`  | `quick_reference.md`                 | Commands and checklists          | Any phase                  |
| `workflows/`  | `execution_methods.md`               | Script execution patterns        | Operations                 |
| `workflows/`  | `worked_examples.md`                 | Real-world examples              | Learning                   |
| `debugging/`  | `troubleshooting.md`                 | Common issues and solutions      | Debugging                  |
| `debugging/`  | `universal_debugging_methodology.md` | Stack-agnostic 4-phase debugging | Debugging                  |
| `config/`     | `environment_variables.md`           | Env var configuration            | Setup                      |

**Assets (`assets/`):**

| File                          | Purpose                               |
| ----------------------------- | ------------------------------------- |
| `level_decision_matrix.md`    | LOC thresholds and complexity factors |
| `template_mapping.md`         | Template-to-level mapping rules       |
| `parallel_dispatch_config.md` | Agent dispatch configuration          |
| `complexity_decision_matrix.md` | Complexity-based level selection and scoring |

**generate-context.ts Input Modes** (executed as `node generate-context.js`):

| Mode       | Usage                                             | Description                                 |
| ---------- | ------------------------------------------------- | ------------------------------------------- |
| **Direct** | `node generate-context.js specs/007-feature/`     | Auto-captures context from OpenCode session |
| **JSON**   | `node generate-context.js /tmp/context-data.json` | Manual context injection via JSON file      |

**Architecture:** The script uses a modular TypeScript architecture (CLI entry point at `scripts/memory/generate-context.ts` + modules across directories: `core/`, `extractors/`, `lib/`, `loaders/`, `memory/`, `renderers/`, `rules/`, `spec/`, `spec-folder/`, `templates/`, `utils/`). Source is `.ts`; compiled to CommonJS `.js` in `scripts/dist/` for execution. See [scripts/README.md](./scripts/README.md) for module details and extension points.

**JSON mode documentation:** See [save_workflow.md](./references/memory/save_workflow.md) for full schema and examples.

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

**MCP Tools (22 tools across 7 layers):**

| Tool                            | Layer | Purpose                                           |
| ------------------------------- | ----- | ------------------------------------------------- |
| `memory_context()`              | L1    | Unified entry point with intent-aware routing     |

**memory_context() — Mode Configuration:**

| Mode | Strategy | Token Budget | Description |
| --- | --- | --- | --- |
| `auto` | adaptive | (none — delegates to sub-strategy) | Auto-detect intent and route to optimal mode |
| `quick` | triggers | 800 | Fast trigger matching for real-time context |
| `deep` | search | 2000 | Semantic search with full context retrieval |
| `focused` | intent-search | 1500 | Intent-aware search with task-specific optimization |
| `resume` | resume | 1200 | Resume previous work with state/next-steps anchors |

**Intent-to-Mode Routing** (when `mode=auto`):

| Intent | Routes To |
| --- | --- |
| `add_feature` | deep |
| `fix_bug` | focused |
| `refactor` | deep |
| `security_audit` | deep |
| `understand` | focused |
| `memory_search()`               | L2    | Hybrid search (vector + FTS + BM25 with RRF fusion) |
| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
| `memory_save()`                 | L2    | Index a memory file with pre-flight validation (PF001-PF031 error codes) |

> **Preflight validation defaults:** `charsPerToken=3.5`, `max_tokens=8000` (env: `MCP_MAX_MEMORY_TOKENS`), `warning_threshold=0.8`, `min_content=10 chars`, `max_content=100000 chars`, `similar_duplicate_threshold=0.95`.
| `memory_list()`                 | L3    | Browse stored memories with pagination            |
| `memory_stats()`                | L3    | Get system statistics and counts                  |
| `memory_health()`               | L3    | Check system health status                        |
| `memory_delete()`               | L4    | Delete memories by ID or spec folder              |
| `memory_update()`               | L4    | Update memory metadata and importance tier        |
| `memory_validate()`             | L4    | Record validation feedback for confidence         |
| `checkpoint_create()`           | L5    | Create gzip-compressed checkpoint (memory_index + working_memory) |
| `checkpoint_list()`             | L5    | List all available checkpoints (default limit: 50, max: 100; max 10 stored) |
| `checkpoint_restore()`          | L5    | Transaction-wrapped restore with rollback on failure + working memory |
| `checkpoint_delete()`           | L5    | Delete a checkpoint                               |
| `task_preflight()`              | L6    | Capture epistemic baseline before task execution  |
| `task_postflight()`             | L6    | Capture epistemic state after task, calc learning |

#### Epistemic Learning Workflow (PREFLIGHT/POSTFLIGHT)

The learning system measures knowledge improvement across tasks:

1. **PREFLIGHT** (Step 5.5 in `/spec_kit:implement`): Before implementation, capture baseline scores:
   - `task_preflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore })`
2. **POSTFLIGHT** (Step 7.5 in `/spec_kit:implement`): After implementation, capture final scores:
   - `task_postflight({ specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore })`
3. **Learning Index**: Calculated as `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`

Use `memory_get_learning_history({ specFolder })` to review learning trends across tasks.

**Learning Index (LI) Interpretation:**

The `task_postflight()` tool calculates `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`:

| LI Range | Interpretation |
| --- | --- |
| ≥ 40 | Significant learning session — substantial knowledge gains |
| 15–39 | Moderate learning session — meaningful progress |
| 5–14 | Incremental learning — some progress made |
| 0–4 | Execution-focused session — minimal new learning |
| < 0 | Knowledge regression — scope expansion or new complexities discovered |
| `memory_drift_why()`            | L6    | Trace causal chain for decision lineage (defaults: maxDepth=3, direction='both', includeMemoryDetails=true) |
| `memory_causal_link()`          | L6    | Create causal relationship between memories (default strength: 1.0) |
| `memory_causal_stats()`         | L6    | Get statistics about causal memory graph          |
| `memory_causal_unlink()`        | L6    | Remove causal relationship by edge ID             |

> **Note:** The L6 causal graph tools (`memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`) are **advanced/manual-use tools**. No command currently integrates them into automated workflows. They are available for manual invocation via `/memory:manage` or direct MCP calls when tracing decision lineage or building causal relationships between memories.

**Auto-Created Causal Links (via `memory_save`):**

When a memory file includes YAML frontmatter with causal metadata, `memory_save()` automatically creates causal edges in the graph. The 5 supported metadata fields and their causal relation mappings:

| Frontmatter Field | Causal Relation | Edge Direction |
| --- | --- | --- |
| `caused_by: [ref]` | `caused` | reverse (ref → this memory) |
| `supersedes: [ref]` | `supersedes` | forward (this memory → ref) |
| `derived_from: [ref]` | `derived_from` | forward (this memory → ref) |
| `blocks: [ref]` | `enabled` | reverse (ref → this memory) |
| `related_to: [ref]` | `supports` | forward (this memory → ref) |

References can be memory IDs, file paths, or titles. See `handlers/memory-save.ts` lines 367-372.
| `memory_index_scan()`           | L7    | Bulk scan and index workspace (see notes below)   |
| `memory_get_learning_history()` | L7    | Get learning history for spec folder              |

> **Note:** Full tool names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search()`).

> **Token Budget Enforcement:** Per-layer token budgets (L1:2000, L2:1500, L3:800, L4:500, L5:600, L6:1200, L7:1000) are enforced after handler execution. The server estimates token count using a `chars/4` approximation and truncates results by removing lowest-scored items when the budget is exceeded. This is approximate enforcement — not exact token counting — but does actively limit output size. The only per-file hard limit is `memory_save`'s validation against `MCP_MAX_MEMORY_TOKENS` (default 8000).

**memory_search() — Full Parameter Reference:**

> **IMPORTANT:** `query` (string) OR `concepts` (array of 2-5 strings) is REQUIRED. `specFolder` alone is NOT sufficient and will cause E040 error.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `query` | string | — | Natural language search query (required if no `concepts`) |
| `concepts` | string[] | — | 2-5 concepts for AND search; results must match ALL (required if no `query`) |
| `specFolder` | string | — | Limit search to a specific spec folder (e.g., `"011-spec-kit-memory-upgrade"`) |
| `limit` | number | 10 | Maximum number of results to return |
| `sessionId` | string | — | Session identifier for deduplication. With `enableDedup=true`, prevents duplicate memories in same session (~50% token savings on follow-ups) |
| `enableDedup` | boolean | true | Enable session deduplication (REQ-001). Requires `sessionId` |
| `tier` | string | — | Filter by importance tier: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `contextType` | string | — | Filter by context type: `decision`, `implementation`, `research`, etc. |
| `useDecay` | boolean | true | Apply FSRS temporal decay scoring (power-law retrievability model) |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories in results |
| `includeConstitutional` | boolean | true | Include constitutional tier memories in results (receive 3.0x search boost, typically appear near top) |
| `includeContent` | boolean | false | Include full file content in results. Each result gets a `content` field. **Required for `anchors` to work.** |
| `anchors` | string[] | — | Filter content to specific anchor sections. **Requires `includeContent: true`** |
| `intent` | enum | — | Task intent for scoring weight adjustments: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand` |
| `autoDetectIntent` | boolean | true | Auto-detect intent from query when `intent` not set |

> **Intent weight values** (from `intent-classifier.ts`): `add_feature` {recency:0.3, importance:0.4, similarity:0.3}, `fix_bug` {0.5, 0.2, 0.3}, `refactor` {0.2, 0.3, 0.5}, `security_audit` {0.1, 0.5, 0.4}, `understand` {0.2, 0.3, 0.5}. Only the `memory-search.ts` `applyIntentWeightsToResults` version (P3-14 fix, includes recency) is active at runtime; the `intent-classifier.ts` `applyIntentWeights` function is stale.

> **Advanced search params** (in inputSchema but intended for internal tuning): `bypassCache` (default: false — skip cache), `minState` (default: 'WARM' — filter by memory state: HOT/WARM/COLD/DORMANT/ARCHIVED), `applyStateLimits` (default: false — enforce per-tier quantity limits: HOT=5, WARM=10, COLD=3, DORMANT=2, ARCHIVED=1), `rerank` (default: false — enable neural reranking; requires `VOYAGE_API_KEY`, `COHERE_API_KEY`, or `RERANKER_LOCAL=true` for an HTTP server at `localhost:8765`; without a configured provider, results keep their original ranking), `applyLengthPenalty` (default: true — penalize very short/long documents during reranking), `trackAccess` (default: false — opt-in access tracking), `includeArchived` (default: false — include archived memories in results).

```typescript
// Correct usage
memory_search({ query: "session context", specFolder: "007-auth" })
memory_search({ concepts: ["auth", "session"], specFolder: "007-auth" })

// Multi-concept AND search (results must match ALL concepts, 2-5 required)
memory_search({ concepts: ["circuit breaker", "error handling", "recovery"], limit: 5 })

// WRONG: Will cause E040 error
// memory_search({ specFolder: "007-auth" })
```

**Anchor-Based Retrieval (Token-Efficient):**

Use the `anchors` parameter with `includeContent: true` to retrieve only specific sections from memory files, reducing token usage by ~90%:

```typescript
// Get only summary and decisions (~300 tokens vs ~2000 full file)
memory_search({
  query: "auth implementation",
  includeContent: true,
  anchors: ['summary', 'decisions']
})

// Resume work - get state and next steps
memory_search({
  query: "session context",
  specFolder: "007-auth",
  includeContent: true,
  anchors: ['state', 'next-steps', 'blockers']
})
```

**Common Anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md#anchor-based-retrieval-token-efficient)

**memory_update() Notes:**

> **Optional param:** `allowPartialUpdate` (default false) controls whether updates succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false, the entire update is rolled back on embedding failure.

**memory_index_scan() Notes:**

> **Optional param:** `incremental` (default true) controls whether only changed files are indexed vs full re-evaluation. When true, skips files whose mtime and content hash are unchanged. Use `force: true` to bypass all caching and re-index everything.

**Search Architecture:**

The search pipeline combines three retrieval methods fused via Reciprocal Rank Fusion (RRF):
1. **Vector similarity** — Cosine similarity against pre-computed embeddings (full table scan; no sqlite-vec index)
2. **BM25 scoring** — Term frequency-inverse document frequency on indexed content
3. **FTS5 full-text search** — SQLite FTS5 for exact phrase and keyword matching

**Reranking (optional):** When `rerank=true`, results are re-scored by one of:
- **Voyage AI** — Requires `VOYAGE_API_KEY` env var
- **Cohere** — Requires `COHERE_API_KEY` env var
- **Local model** — Requires `RERANKER_LOCAL=true` (expects HTTP server at `localhost:8765`)
- **Fallback** — Without any configured provider, results keep their original ranking (no reranking applied)

**Checkpoint Architecture:**

Checkpoints are gzip-compressed JSON snapshots of both `memory_index` and `working_memory` SQLite tables. Key behaviors:
- **Create:** Captures memory_index rows + working_memory state; max 10 checkpoints enforced
- **Restore:** Transaction-wrapped with rollback on failure; validates checkpoint JSON against schema before mutations; refreshes BM25, trigger cache, and vector indexes after restore
- **Working memory:** Saved during checkpoint create and restored during checkpoint restore (session-scoped attention state is preserved)

**Key Concepts:**
- **Constitutional tier** - Critical rules that receive a 3.0x search boost (via `importance-tiers.ts`) and a 2.0x importance multiplier (via `composite-scoring.ts`), causing them to typically appear near the top of search results. They are merged into the normal scoring pipeline, not force-injected at position 0
- **Decay scoring** - FSRS v4 power-law model preferred: `R(t) = (1 + 19/81 * t/S)^(-0.5)`. Deprecated legacy exponential fallback (`score * decayRate^(days/30)`) retained for backward compatibility. Recent memories rank higher
- **Real-time sync** - Use `memory_save` or `memory_index_scan` after creating files
- **Session cleanup** - Three automatic mechanisms:
  - **Expired sessions:** Runs on startup + every 30 min (clears `session_sent_memories` past TTL; default `SESSION_TTL_MINUTES=30`, `SESSION_MAX_ENTRIES=100` per session)
  - **Stale sessions:** Runs on startup + every 1 hour (clears `working_memory`, `sent_memories`, `session_state` older than 24 hours)
  - **Crash recovery:** Runs on startup only (marks active sessions as interrupted)

**Indexing Persistence Note:**
When `generate-context.js` creates a memory file, it performs internal indexing and reports "Indexed as memory #X". However, the running MCP server maintains its own database connection and may not immediately see the new index entry.

For immediate MCP visibility, call one of:
- `memory_index_scan({ specFolder: "your-folder" })` - Re-scan and index
- `memory_save({ filePath: "path/to/memory.md" })` - Index specific file

This is typically only needed if you want to search the memory immediately after creation in the same session.

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.

### Consolidated Question Protocol

All commands use a **single consolidated prompt** to gather required inputs in one interaction:

1. **Spec Folder Selection** — A) Existing | B) New | C) Update related | D) Skip
2. **Memory Context** — A) Load recent | B) Load all | C) Skip
3. **Execution Mode** — A) Autonomous | B) Interactive (if applicable)

Commands consolidate all questions into ONE user prompt to minimize round-trips. See individual command files for specific question sets.

> **Note:** Users can reply with shorthand (e.g., "A, C, A") to answer all questions at once.

### Prior Work Search (Research Workflow Phase 3)

When executing `/spec_kit:research`, Phase 3 automatically searches for related prior work before proceeding:

```
PHASE 3: PRIOR WORK SEARCH (Auto-execute after Phase 2)

1. Call memory_match_triggers(prompt=research_topic) for fast keyword match
2. Call memory_search(query=research_topic, includeConstitutional=true) for semantic search
3. IF matches found:
   ├─ Display: "Found [N] related memories from prior research"
   ├─ ASK user:
   │   ┌────────────────────────────────────────────────────┐
   │   │ "Load related prior work?"                         │
   │   │                                                    │
   │   │ A) Load all matches (comprehensive context)        │
   │   │ B) Load constitutional only (foundational rules)   │
   │   │ C) Skip (start fresh)                              │
   │   └────────────────────────────────────────────────────┘
   └─ SET STATUS: ✅ PASSED
4. IF no matches found:
   └─ SET STATUS: ⏭️ N/A (no prior work)
```

**Key Behaviors:**
- Constitutional tier memories receive a 3.0x search boost and typically appear near the top of results when `includeConstitutional=true` (default)
- This phase is conditional - skipped if no prior work exists
- Runs between Spec Folder Setup (Phase 2) and Memory Context Loading (Phase 4)

**See also:** `/spec_kit:research` command for full 9-step research workflow.

### Debug Delegation Workflow

**When to Trigger:**
- Manual: `/spec_kit:debug` or "delegate this to a debug agent"
- Auto-suggest when detecting:
  - Same error 3+ times after fix attempts
  - Frustration keywords: "stuck", "can't fix", "tried everything"
  - Extended debugging: >15 minutes with 3+ fix attempts

**⚠️ MANDATORY: After 3 failed attempts on the same error, you MUST suggest `/spec_kit:debug`. Do not continue attempting fixes without offering debug delegation first.**

**Model Selection (MANDATORY - never skip):**

| Model      | Best For                         | Characteristics                    |
| ---------- | -------------------------------- | ---------------------------------- |
| **Claude** | General debugging, code analysis | Anthropic models (Opus/Sonnet)     |
| **Gemini** | Multi-modal, large context       | Google models (Pro/Flash)          |
| **OpenAI** | Code generation, reasoning       | OpenAI models (GPT-4o/o1/o3)      |
| **Other**  | User-specified model             | Custom selection                   |

**Workflow:**
1. Ask which model to use
2. Generate `debug-delegation.md` with: error category, message, files, attempts, hypothesis
3. Dispatch sub-agent via Task tool
4. Present findings: Apply fix / Iterate / Manual review
5. Update debug-delegation.md with resolution

**Auto-debug via `/spec_kit:complete`:** The `:auto-debug` flag on `/spec_kit:complete` can automatically dispatch a debug agent when implementation failures are detected, without requiring manual `/spec_kit:debug` invocation. See complete.md for details.

**Auto-suggestion display:**
```
Debug Delegation Suggested - You've been working on this issue for a while.
Run: /spec_kit:debug
```

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

**Spec Folder → Implementation:**
```
system-spec-kit (creates spec folder)
    → workflows-code (implements from spec + plan)
    → workflows-git (commits with spec reference)
    → Spec Kit Memory (preserves conversation to spec/memory/ via MCP)
```

**Documentation Quality:**
```
system-spec-kit (creates spec documentation)
    → workflows-documentation (validates structure, scores quality)
    → Feedback loop: Iterate if scores <90
```

**Validation Workflow:**
```
Implementation complete
    → validate.sh (automated checks)
    → Fix ERROR-level issues
    → Address WARNING-level issues
    → Claim completion with confidence
```

### Common Failure Patterns

| Pattern                       | Trigger                                 | Prevention                                |
| ----------------------------- | --------------------------------------- | ----------------------------------------- |
| Skip Gate 3 on exciting tasks | "comprehensive", "fix all", "15 agents" | STOP → Ask spec folder → Wait for A/B/C/D |
| Rush to code                  | "straightforward", "simple fix"         | Analyze → Verify → Simplest solution      |
| Create docs from scratch      | Time pressure                           | Always copy from templates/level_N/       |
| Skip checklist verification   | "trivial edit"                          | Load checklist.md, verify ALL items       |
| Manual memory file creation   | "quick save"                            | MUST use generate-context.js script       |
| Autonomous update vs create   | "obvious choice"                        | Always ask user for A/B/C/D               |

### Quick Reference Commands

**Create new spec folder:**
```bash
./scripts/spec/create.sh "Add feature description" --short-name feature-name --level 2
```

**Validate spec folder:**
```bash
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/007-feature/
```

**Save context:**
```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/007-feature/
```

**Find next spec number:**
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

**Calculate documentation completeness:**
```bash
.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh specs/007-feature/
```

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
| Core templates    | `templates/core/` (4 files)                                                | Foundation shared by all levels   |
| Level 2 addendum  | `templates/addendum/level2-verify/` (3 files)                              | +Verification, NFRs               |
| Level 3 addendum  | `templates/addendum/level3-arch/` (3 files)                                | +Architecture, ADRs               |
| Level 3+ addendum | `templates/addendum/level3plus-govern/` (3 files)                          | +Governance, compliance           |
| Level 1           | `templates/level_1/` (5 files)                                             | Pre-merged core (~455 LOC)        |
| Level 2           | `templates/level_2/` (6 files)                                             | Core + L2 (~875 LOC)              |
| Level 3           | `templates/level_3/` (7 files)                                             | Core + L2 + L3 (~1090 LOC)        |
| Level 3+          | `templates/level_3+/` (7 files)                                            | All addendums (~1075 LOC)         |
| Utility templates | `templates/` root                                                          | handover.md, debug-delegation.md  |
| Compose script    | `scripts/templates/compose.sh`                                             | Template composition from sources |
| Validation        | `scripts/spec/validate.sh`                                                 | Automated validation              |
| Gates             | `AGENTS.md` Section 2                                                      | Gate definitions                  |
| Memory gen        | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`       | Memory file creation (source)     |
| MCP Server        | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`             | Spec Kit Memory MCP (source, ~903 lines) |
| Database          | `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Vector search index               |
| Constitutional    | `.opencode/skill/system-spec-kit/constitutional/`                          | Always-surface rules              |

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and validation for all file modifications. Every conversation that modifies files MUST have a spec folder.