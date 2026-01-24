---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.0), validation, Spec Kit Memory with vector search, six-tier importance system, constitutional rules, checkpoint save/restore. Mandatory for all file modifications."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, Task]
version: 1.9.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, constitutional-tier, checkpoint, importance-tiers -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3), template usage, and context preservation through AGENTS.md-enforced workflows.

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

### Cognitive Memory Features

The `memory_match_triggers()` tool includes cognitive features for smarter context management: decay scoring, co-activation, and tiered content injection (HOT/WARM/COLD).

**Full documentation:** See [mcp_server/README.md](./mcp_server/README.md#cognitive-memory-v170) and [memory_system.md](./references/memory/memory_system.md).

### Resource Router

**Phase-Based Loading:**

| Phase              | Trigger                               | Load Resources                             | Execute             |
| ------------------ | ------------------------------------- | ------------------------------------------ | ------------------- |
| **Planning**       | New feature, "plan", "design"         | level_specifications.md, template_guide.md | /spec_kit:plan      |
| **Research**       | "investigate", "explore", "analyze"   | quick_reference.md, worked_examples.md     | /spec_kit:research  |
| **Implementation** | "implement", "build", "code"          | validation_rules.md, template_guide.md     | /spec_kit:implement |
| **Debugging**      | "stuck", "error", "not working"       | quick_reference.md, troubleshooting.md     | /spec_kit:debug     |
| **Completion**     | "done", "finished", "complete"        | validation_rules.md, phase_checklists.md   | /spec_kit:complete  |
| **Handover**       | "stopping", "break", "continue later" | quick_reference.md                         | /spec_kit:handover  |
| **Resume**         | "continue", "pick up", "resume"       | quick_reference.md                         | /spec_kit:resume    |

### Reference Sub-folders

| Sub-folder    | Purpose                         | Files                                                                            |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `memory/`     | Context preservation, MCP tools | memory_system.md, save_workflow.md, trigger_config.md, epistemic-vectors.md      |
| `templates/`  | Template system, level specs    | level_specifications.md, template_guide.md, template_style_guide.md, decision-format.md |
| `validation/` | Validation rules, checklists    | validation_rules.md, phase_checklists.md, path_scoped_rules.md, five-checks.md   |
| `structure/`  | Folder organization, routing    | folder_structure.md, folder_routing.md, sub_folder_versioning.md    |
| `workflows/`  | Usage workflows, examples       | quick_reference.md, execution_methods.md, worked_examples.md        |
| `debugging/`  | Troubleshooting, debugging      | troubleshooting.md, universal_debugging_methodology.md              |
| `config/`     | Configuration                   | environment_variables.md                                            |

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

Canonical JavaScript modules shared between CLI scripts and MCP server. Key functions: `generateDocumentEmbedding()`, `generateQueryEmbedding()`, `extractTriggerPhrases()`.

**Full documentation:** See [shared/README.md](./shared/README.md)

### Configuration (`config/`)

Runtime configuration for the memory system:
- `config.jsonc` — Search, decay, tiers, checkpoints settings
- `filters.jsonc` — Content filtering pipeline

**Full documentation:** See [environment_variables.md](./references/config/environment_variables.md)

### Resource Inventory

**Template Architecture (CORE + ADDENDUM v2.0):**

| Folder | Contents | When to Use |
|--------|----------|-------------|
| `templates/level_1/` | 4 files (~270 LOC) | **Default for new specs** |
| `templates/level_2/` | 5 files (~390 LOC) | QA validation needed |
| `templates/level_3/` | 6 files (~540 LOC) | Architecture decisions |
| `templates/level_3+/` | 6 files (~640 LOC) | Enterprise governance |

> **IMPORTANT:** Always copy from `templates/level_N/`. The `core/` and `addendum/` folders are source components only.

**Key Scripts:**

| Script | Purpose |
|--------|---------|
| `generate-context.js` | Generate memory files from conversation |
| `spec/validate.sh` | Validate spec folder structure |
| `spec/create.sh` | Create new spec folders with templates |
| `templates/compose.sh` | Compose level templates from core + addendums |

**Full documentation:** See [level_specifications.md](./references/templates/level_specifications.md) and [template_guide.md](./references/templates/template_guide.md)

**References (`references/`):**

| Sub-folder    | File                                 | Purpose                          | When to Load               |
| ------------- | ------------------------------------ | -------------------------------- | -------------------------- |
| `memory/`     | `memory_system.md`                   | MCP tool behavior and config     | Memory operations          |
| `memory/`     | `save_workflow.md`                   | Memory save workflow docs        | Context preservation       |
| `memory/`     | `trigger_config.md`                  | Trigger phrase configuration     | Setup                      |
| `memory/`     | `epistemic-vectors.md`               | Uncertainty tracking framework   | Gate decisions, planning   |
| `templates/`  | `level_specifications.md`            | Complete Level 1-3 requirements  | Planning                   |
| `templates/`  | `template_guide.md`                  | Template selection and usage     | Planning, Implementation   |
| `templates/`  | `template_style_guide.md`            | Template formatting conventions  | Documentation              |
| `templates/`  | `decision-format.md`                 | Structured gate decision format  | Gate decisions, logging    |
| `validation/` | `validation_rules.md`                | All validation rules and fixes   | Implementation, Completion |
| `validation/` | `phase_checklists.md`                | Per-phase validation             | Completion                 |
| `validation/` | `path_scoped_rules.md`               | Path-scoped validation           | Advanced                   |
| `validation/` | `five-checks.md`                     | Five Checks evaluation framework | Planning, decisions        |
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

**generate-context.js Input Modes:**

| Mode       | Usage                                             | Description                                 |
| ---------- | ------------------------------------------------- | ------------------------------------------- |
| **Direct** | `node generate-context.js specs/007-feature/`     | Auto-captures context from OpenCode session |
| **JSON**   | `node generate-context.js /tmp/context-data.json` | Manual context injection via JSON file      |

**Architecture:** The script uses a modular architecture (142-line CLI entry point + 44 modules across 10 directories: `core/`, `extractors/`, `lib/`, `loaders/`, `renderers/`, `rules/`, `spec-folder/`, `test-fixtures/`, `tests/`, `utils/`). See [scripts/README.md](./scripts/README.md) for module details and extension points.

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

| LOC | Level | Template Folder |
|-----|-------|-----------------|
| <100 | 1 | `templates/level_1/` |
| 100-499 | 2 | `templates/level_2/` |
| ≥500 | 3 | `templates/level_3/` |
| Complex | 3+ | `templates/level_3+/` |

**See:** [quick_reference.md](./references/workflows/quick_reference.md) for detailed examples.

**CLI Tool:**
```bash
# Create spec folder with level 2 templates
./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2

# Create spec folder with level 3+ (extended) templates
./scripts/spec/create.sh "Major platform migration" --level 3+
```

### 3-Level Progressive Enhancement (CORE + ADDENDUM v2.0)

Higher levels ADD VALUE, not just length. Each level builds on the previous:

```
Level 1 (Core):         Essential what/why/how (~270 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~390 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~540 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~640 LOC)
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
- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]`
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

Context preservation across sessions via vector-based semantic search.

**MCP Tools:**

| Tool                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `memory_search()`         | Semantic search with vector similarity     |
| `memory_match_triggers()` | Fast keyword matching (<50ms)              |
| `memory_save()`           | Index a memory file                        |
| `memory_list()`           | Browse stored memories with pagination     |
| `memory_delete()`         | Delete memories by ID or spec folder       |
| `memory_update()`         | Update memory metadata and importance tier |
| `memory_stats()`          | Get system statistics and counts           |
| `memory_validate()`       | Record validation feedback for confidence  |
| `memory_index_scan()`     | Bulk scan and index workspace              |
| `memory_health()`         | Check system health status                 |
| `checkpoint_create()`     | Create named checkpoint                    |
| `checkpoint_list()`       | List all available checkpoints             |
| `checkpoint_restore()`    | Restore from checkpoint                    |
| `checkpoint_delete()`     | Delete a checkpoint                        |

> **Note:** Full tool names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search()`).

**memory_search() Parameter Requirements:**

> **IMPORTANT:** `query` (string) OR `concepts` (array of 2-5 strings) is REQUIRED. `specFolder` alone is NOT sufficient and will cause E040 error.

```javascript
// Correct usage
memory_search({ query: "session context", specFolder: "007-auth" })
memory_search({ concepts: ["auth", "session"], specFolder: "007-auth" })

// WRONG: Will cause E040 error
// memory_search({ specFolder: "007-auth" })
```

**Anchor-Based Retrieval (Token-Efficient):**

Use the `anchors` parameter to retrieve only specific sections from memory files, reducing token usage by ~90%:

```javascript
// Get only summary and decisions (~300 tokens vs ~2000 full file)
memory_search({
  query: "auth implementation",
  anchors: ['summary', 'decisions']
})

// Resume work - get state and next steps
memory_search({
  query: "session context",
  specFolder: "007-auth",
  anchors: ['state', 'next-steps', 'blockers']
})
```

**Common Anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md#anchor-based-retrieval-token-efficient)

**Key Concepts:**
- **Constitutional tier** - Critical rules that ALWAYS surface at top of search results
- **Decay scoring** - Recent memories rank higher (~62-day half-life)
- **Real-time sync** - Use `memory_save` or `memory_index_scan` after creating files

**Indexing Persistence Note:**
When `generate-context.js` creates a memory file, it performs internal indexing and reports "Indexed as memory #X". However, the running MCP server maintains its own database connection and may not immediately see the new index entry.

For immediate MCP visibility, call one of:
- `memory_index_scan({ specFolder: "your-folder" })` - Re-scan and index
- `memory_save({ filePath: "path/to/memory.md" })` - Index specific file

This is typically only needed if you want to search the memory immediately after creation in the same session.

**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.

### Two-Stage Question Flow

When returning to an active spec folder:

```
STAGE 1: SPEC FOLDER
"Continue in '006-commands' or start fresh?"
  A) Continue in 006-commands
  B) Create new spec folder
  D) Skip documentation

[If A chosen AND memory files exist]

STAGE 2: MEMORY LOADING
"Found 3 previous session files. Load context?"
  A) Load most recent
  B) Load all recent (1-3)
  C) List and select specific
  D) Skip (start fresh)
```

**Key Insight:** "D" means different things:
- Stage 1 "D" = Skip documentation entirely
- Stage 2 "D" = Skip memory loading (stay in spec folder)

**AI Actions by Stage 2 Choice:**
- **A:** Read most recent memory file
- **B:** Read 3 most recent files (parallel)
- **C:** List up to 10 files, wait for selection
- **D:** Proceed without loading context

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
- Constitutional tier memories are ALWAYS loaded regardless of choice (auto-surface with similarity: 100)
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

| Model      | Best For                         | Characteristics                |
| ---------- | -------------------------------- | ------------------------------ |
| **Claude** | General debugging, code analysis | Anthropic models (Sonnet/Opus) |
| **Gemini** | Multi-modal, large context       | Google models (Pro/Ultra)      |
| **Codex**  | Code generation, reasoning       | OpenAI models (GPT-4/o1)       |
| **Other**  | User-specified model             | Custom selection               |

**Workflow:**
1. Ask which model to use
2. Generate `debug-delegation.md` with: error category, message, files, attempts, hypothesis
3. Dispatch sub-agent via Task tool
4. Present findings: Apply fix / Iterate / Manual review
5. Update debug-delegation.md with resolution

**Auto-suggestion display:**
```
💡 Debug Delegation Suggested - You've been working on this issue for a while.
Run: /spec_kit:debug
```

### Command Pattern Protocol

Commands in `.opencode/command/**/*.yaml` are **Reference Patterns**:

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

Automated validation of spec folder contents via `validate-spec.sh`.

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

1. **Determine level (1/2/3) before ANY file changes** - Count LOC, assess complexity/risk
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
12. **Run validate-spec.sh before completion** - Completion Verification requirement
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

- [ ] Ran `validate-spec.sh` on spec folder
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
- **AGENTS.md Completion Verification** → Runs validate-spec.sh before completion claims
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
    → validate-spec.sh (automated checks)
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
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/007-feature/
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

| Resource          | Location                                                             | Purpose                           |
| ----------------- | -------------------------------------------------------------------- | --------------------------------- |
| Core templates    | `templates/core/` (4 files)                                          | Foundation shared by all levels   |
| Level 2 addendum  | `templates/addendum/level2-verify/` (3 files)                        | +Verification, NFRs               |
| Level 3 addendum  | `templates/addendum/level3-arch/` (3 files)                          | +Architecture, ADRs               |
| Level 3+ addendum | `templates/addendum/level3plus-govern/` (3 files)                    | +Governance, compliance           |
| Level 1           | `templates/level_1/` (4 files)                                       | Pre-merged core (~270 LOC)        |
| Level 2           | `templates/level_2/` (5 files)                                       | Core + L2 (~390 LOC)              |
| Level 3           | `templates/level_3/` (6 files)                                       | Core + L2 + L3 (~540 LOC)         |
| Level 3+          | `templates/level_3+/` (6 files)                                      | All addendums (~640 LOC)          |
| Utility templates | `templates/` root                                                    | handover.md, debug-delegation.md  |
| Compose script    | `scripts/templates/compose.sh`                                       | Template composition from sources |
| Validation        | `scripts/spec/validate.sh`                                           | Automated validation              |
| Gates             | `AGENTS.md` Section 2                                                | Gate definitions                  |
| Memory gen        | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.js` | Memory file creation              |
| MCP Server        | `.opencode/skill/system-spec-kit/mcp_server/context-server.js`       | Spec Kit Memory MCP               |
| Database          | `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Vector search index               |
| Constitutional    | `.opencode/skill/system-spec-kit/constitutional/`                    | Always-surface rules              |

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and validation for all file modifications. Every conversation that modifies files MUST have a spec folder.