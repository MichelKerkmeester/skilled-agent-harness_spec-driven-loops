# Spec Kit Framework

Every feature you build should leave a trail. Not for bureaucracy, for your future self, your team, and the AI that helps you code. Spec Kit enforces one simple rule: *no code without a spec folder*.

The result? Six months from now, you'll know exactly why you made that architectural decision. Your AI assistant will pick up where you left off. And onboarding new developers takes hours instead of weeks.

**This isn't your basic Spec Kit.** This is a battle-tested, automation-first fork that treats documentation as a first-class citizen, not an afterthought.

## Why This Fork Exists

| Pain Point             | Original Spec Kit | This Enhanced Fork                               |
| ---------------------- | ----------------- | ------------------------------------------------ |
| **Context Loss**       | Manual recovery   | Auto-saved with ANCHOR format                    |
| **Templates**          | ~5 basic files    | 10 purpose-built templates                       |
| **Commands**           | Manual workflow   | 12 slash commands with `:auto`/`:confirm` modes  |
| **Memory Integration** | None              | Deep integration via `generate-context.js`       |
| **Quality Gates**      | None              | Mandatory gates enforce nothing slips through    |
| **Debug Assistance**   | None              | AI detects frustration → auto-suggests sub-agent |
| **Session Handover**   | None              | `:quick` (15 lines) or `:full` (150 lines)       |
| **Quality Metrics**    | Guesswork         | Completeness scoring (0-100%)                    |
| **Folder Versioning**  | Overwrite         | Sub-folder patterns                              |
| **Automation**         | None              | 11 scripts handle the boring work                |

> **The bottom line:** 10 templates, 12 commands, 11 scripts, 0 excuses for losing context.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 DIRECTORY STRUCTURE](#2--directory-structure)
- [3. 📊 DOCUMENTATION LEVELS (1-3)](#3--documentation-levels-1-3)
- [4. 📝 TEMPLATES (10 TOTAL)](#4--templates-10-total)
- [5. ⚙️ SCRIPTS](#5--scripts)
- [6. 🎯 COMMANDS (7 TOTAL)](#6--commands-7-total)
- [7. 🔄 HOW IT WORKS](#7--how-it-works)
- [8. 🧠 INTEGRATED MEMORY SYSTEM](#8--integrated-memory-system)
- [9. 🔌 INTEGRATION POINTS](#9--integration-points)
- [10. 💡 USAGE EXAMPLES](#10--usage-examples)
- [11. 🚀 INSTALLATION & SETUP](#11--installation--setup)
- [12. 🔧 TROUBLESHOOTING](#12--troubleshooting)
- [13. ❓ FAQ](#13--faq)

---

## 1. 📖 OVERVIEW

### What is Spec Kit?

**Spec Kit** is an automation-first documentation framework that makes AI assistants *actually useful* across sessions. While the original Spec Kit concept provides basic structure, this enhanced fork transforms it into a complete system with:

- **Deep Memory Integration** — Context auto-saves to semantic memory, searchable across sessions
- **Gate Enforcement** — Mandatory gates prevent skipped steps, lost context, and incomplete work
- **Debug Intelligence** — AI detects when you're stuck and offers to dispatch a specialist sub-agent

> **Fork Exclusive**: This version is specifically designed for AI-assisted development workflows where context preservation is critical.

### Key Statistics

| Category   | Count  | Details                                                                  |
| ---------- | ------ | ------------------------------------------------------------------------ |
| Templates  | 10     | Markdown templates for specs, plans, research, decisions, handover       |
| Scripts    | 11     | Shell scripts for automation and validation                              |
| Assets     | 3      | Decision support tools (level matrix, template mapping, parallel config) |
| References | 18     | Detailed workflow documentation in 7 categories                          |
| Checklists | 4      | Phase-specific checklists (research, planning, implementation, review)   |
| **Total**  | **41** | Complete bundled resource set                                            |
| Commands   | 12     | Slash commands (8 spec_kit + 4 memory)                                   |

> **Automation Win**: These 41 resources eliminate the "blank page problem" — you're never starting from scratch.

### Key Features

**Template Management**:
- 10 structured templates for documentation levels 1-3
- Placeholder system with validation enforcement
- Template source markers for traceability

**Workflow Automation** *(Fork Exclusive)*:
- Auto-create feature branches and spec folders in ~100ms
- Prerequisite checking catches missing files before you hit errors
- Completeness scoring (0-100%) tells you exactly when a spec is "done"

**Cognitive Memory** *(v1.7.1)*:
- Attention decay fades stale context per turn
- Tiered content loading (HOT/WARM/COLD)
- Co-activation surfaces related memories together
- Session-scoped working memory

**Quality Enforcement**:
- Integration with `validate-spec-final.sh` script
- Template adaptation validation
- Cross-reference checking

### Activation Triggers

**MANDATORY activation for ALL file modifications:**
- Code files (JS, TS, Python, CSS, HTML)
- Documentation files (Markdown, README, guides)
- Configuration files (JSON, YAML, TOML, env templates)
- Template files (`.opencode/skill/system-spec-kit/templates/*.md`)
- Build/tooling files (package.json, requirements.txt, Dockerfile)

**Exceptions (No Spec Required):**
- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)

---

## 2. 📁 DIRECTORY STRUCTURE

### Core Spec Kit Structure

```
.opencode/skill/system-spec-kit/
├── README.md               # This file (comprehensive documentation)
├── templates/              # 10 markdown templates
│   ├── spec.md             # Feature specification (Level 1+)
│   ├── plan.md             # Implementation plan (Level 1+)
│   ├── tasks.md            # Task breakdown (Level 1+)
│   ├── checklist.md        # QA validation (Level 2+)
│   ├── decision-record.md  # Architecture decisions (Level 3)
│   ├── research.md         # Comprehensive research (Level 3 optional)
│   ├── handover.md         # Full session continuity (utility)
│   └── debug-delegation.md # Sub-agent debugging (utility)
└── scripts/                # Modular validation architecture
    ├── lib/                    # Shared libraries
    │   ├── common.sh           # Core utilities (logging, helpers)
    │   ├── config.sh           # Configuration loading (.speckit.yaml)
    │   └── output.sh           # Output formatting (text/JSON)
    ├── rules/                  # Individual validation rules
    │   ├── check-anchors.sh    # ANCHOR tag validation
    │   ├── check-evidence.sh   # Evidence citation validation
    │   ├── check-files.sh      # Required files per level
    │   ├── check-folder-naming.sh # ###-short-name pattern validation
    │   ├── check-frontmatter.sh # YAML frontmatter validation
    │   ├── check-level.sh      # Level detection/validation
    │   ├── check-placeholders.sh # Unfilled placeholder detection
    │   ├── check-priority-tags.sh # P0/P1/P2 tag validation
    │   └── check-sections.sh   # Required section validation
    ├── test-fixtures/          # Test cases for validation rules
    │   ├── valid-level1/       # Valid Level 1 spec folder
    │   ├── valid-level3/       # Valid Level 3 spec folder
    │   ├── missing-plan/       # Missing required file test
    │   ├── unfilled-placeholders/ # Placeholder detection test
    │   └── ...                 # 36 test fixtures across 10 categories
    ├── common.sh               # Legacy compatibility (sources lib/)
    ├── create-spec-folder.sh   # Create feature branch & spec folder
    ├── check-prerequisites.sh  # Validate spec folder structure
    ├── calculate-completeness.sh # Calculate completeness percentage
    ├── recommend-level.sh      # Recommend documentation level (1-3)
    ├── archive-spec.sh         # Archive completed spec folders
    └── validate-spec.sh        # Validation orchestrator (v2.0)
```

### Skill Resources (system-spec-kit)

```
.opencode/skill/system-spec-kit/
├── SKILL.md                              # Complete workflow documentation
├── README.md                             # Skill overview
├── assets/
│   ├── level_decision_matrix.md          # LOC thresholds, complexity factors
│   ├── template_mapping.md               # Template-to-level mapping
│   └── parallel_dispatch_config.md       # Complexity scoring, agent dispatch config
├── references/                           # 18 reference documents in 7 categories
│   ├── config/                           # Configuration (environment variables)
│   ├── debugging/                        # Debugging guides (universal methodology, troubleshooting)
│   ├── memory/                           # Memory system (save workflow, triggers)
│   ├── structure/                        # Folder structure and versioning
│   ├── templates/                        # Template guides and specifications
│   ├── validation/                       # Validation rules and checklists
│   └── workflows/                        # Workflow execution guides
├── mcp_server/                           # Spec Kit Memory MCP (v1.7.1 cognitive)
│   ├── context-server.js                 # MCP server with vector search
│   ├── lib/                              # Server libraries (27 modules)
│   ├── configs/                          # Server configuration
│   └── README.md                         # MCP installation guide
├── database/
│   └── context-index.sqlite              # Vector search database
├── constitutional/
│   └── gate-enforcement.md               # Always-surface rules for gates
└── scripts/
    ├── generate-context.js               # Memory file generation (modular: 40 modules)
    ├── core/, extractors/, utils/...     # JS modules (see scripts/README.md)
    └── *.sh                              # Shell scripts for validation
```

### Spec Folder Structure (Example)

```
specs/042-user-authentication/
├── spec.md                 # Required (Level 1+)
├── plan.md                 # Required (Level 1+)
├── tasks.md                # Required (Level 1+)
├── checklist.md            # Required (Level 2+)
├── decision-record-auth-provider.md  # Required (Level 3)
├── research.md             # Optional (Level 3)
├── memory/                 # Context preservation
│   ├── 07-12-25_14-30__initial-spec.md
│   └── 07-12-25_16-45__implementation-progress.md
└── scratch/                # Temporary/exploratory files (git-ignored)
    └── .gitkeep
```

### Special Folders

#### `scratch/` - Temporary Working Files

The `scratch/` folder is a designated location for **temporary, exploratory, and work-in-progress files** that should NOT be committed to version control.

**Purpose:**
- Store temporary exploration files during development
- Keep draft code snippets being tested
- Hold experimental configurations
- Preserve working notes that don't belong in formal documentation

**Git Behavior:**
- Contents are **git-ignored** (won't appear in `git status`)
- `.gitkeep` file is **tracked** to preserve the folder structure
- Safe to delete contents at any time without affecting git history

**Use Cases:**
```bash
# Testing a code snippet before adding to plan
echo "test query" > specs/042-feature/scratch/db-query-test.sql

# Temporary notes while investigating
vim specs/042-feature/scratch/investigation-notes.txt

# Draft implementation before finalizing
cp src/component.js specs/042-feature/scratch/component-draft.js
```

**Best Practices:**
- Use scratch/ for anything you might delete later
- Move useful content to proper documentation (spec.md, plan.md, memory/)
- Clean up scratch/ periodically to avoid confusion
- Never reference scratch/ files from other documentation

#### `memory/` - Context Preservation

> **Fork Exclusive**: Deep integration with Spec Kit Memory MCP for vector-searchable context.

The `memory/` folder stores **conversation context and session history** for AI assistants.

**Purpose:**
- Saves conversation context with ANCHOR markers for section-level retrieval (implemented v1.7.2)
- Enables semantic search across all sessions (not just this spec folder)
- Preserves decision rationale with ANCHOR-based selective loading (58-90% token savings)

**Git Behavior:**
- Contents **ARE tracked** (committed to version control)
- Files follow naming pattern: `DD-MM-YY_HH-MM__topic-name.md`
- Auto-indexed into semantic memory database on save

**V17.1 Architecture (Cognitive Memory System):**
- Memory saves MUST use `generate-context.js` (Gate 5 enforces this)
- Project state is embedded IN memory files (no separate STATE.md)
- No .spec-skip or .spec-active markers needed
- Spec Kit Memory MCP is now integrated into this skill (was separate `system-memory`)
- Cognitive features: attention decay, tiered content (HOT/WARM/COLD), co-activation

**Integrated Components:**
| Component      | Location                        | Purpose                            |
| -------------- | ------------------------------- | ---------------------------------- |
| MCP Server     | `mcp_server/context-server.js`  | Semantic memory with vector search |
| Database       | `database/context-index.sqlite` | SQLite + FTS5 + embeddings         |
| Constitutional | `constitutional/`               | Always-surface rules               |
| Scripts        | `scripts/generate-context.js`   | Memory file generation             |

**Memory MCP Tools:**
- `memory_search()` - Semantic search with vector similarity
- `memory_match_triggers()` - Fast keyword matching (<50ms)
- `memory_save()` - Index memory files
- `memory_list()` - Browse stored memories
- `checkpoint_create/restore()` - State snapshots

### Tool Naming Convention

MCP tools use the full prefix `spec_kit_memory_*` when invoked. Documentation uses shorthand for readability.

| Full MCP Name                           | Shorthand (in docs)     |
| --------------------------------------- | ----------------------- |
| `spec_kit_memory_memory_search`         | `memory_search`         |
| `spec_kit_memory_memory_save`           | `memory_save`           |
| `spec_kit_memory_memory_list`           | `memory_list`           |
| `spec_kit_memory_memory_stats`          | `memory_stats`          |
| `spec_kit_memory_memory_update`         | `memory_update`         |
| `spec_kit_memory_memory_delete`         | `memory_delete`         |
| `spec_kit_memory_memory_validate`       | `memory_validate`       |
| `spec_kit_memory_memory_index_scan`     | `memory_index_scan`     |
| `spec_kit_memory_memory_match_triggers` | `memory_match_triggers` |
| `spec_kit_memory_checkpoint_create`     | `checkpoint_create`     |
| `spec_kit_memory_checkpoint_list`       | `checkpoint_list`       |
| `spec_kit_memory_checkpoint_restore`    | `checkpoint_restore`    |
| `spec_kit_memory_checkpoint_delete`     | `checkpoint_delete`     |

**Usage:** When calling MCP tools directly, use the full name (e.g., `spec_kit_memory_memory_search({ query: "..." })`). In documentation and discussion, shorthand is acceptable.

---

## 3. 📊 DOCUMENTATION LEVELS (1-3)

The Spec Kit documentation system uses a **progressive enhancement** approach where each level BUILDS on the previous.

### Progressive Enhancement Model

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
                              │
                              ▼
Level 2 (Verification): Level 1 + checklist.md
                              │
                              ▼
Level 3 (Full):         Level 2 + decision-record.md + optional research

Utility (any level):    handover.md, debug-delegation.md
``` 

### Level Specifications

| Level | Name         | Required Files                                           | LOC Guidance | Enforcement                              |
| ----- | ------------ | -------------------------------------------------------- | ------------ | ---------------------------------------- |
| **1** | Baseline     | spec.md + plan.md + tasks.md + implementation-summary.md | <100         | Hard block if any missing                |
| **2** | Verification | Level 1 + checklist.md                                   | 100-499      | Hard block if checklist.md missing       |
| **3** | Full         | Level 2 + decision-record.md                             | ≥500         | Hard block if decision-record.md missing |

### Level 1: Baseline Documentation

- **Required Files**: `spec.md` + `plan.md` + `tasks.md`
- **Optional Files**: None (baseline is complete)
- **Use When**: All features - this is the minimum documentation for any work
- **Examples**: Email validation, bug fix, loading spinner, typo fix

### Level 2: Verification Added

- **Required Files**: Level 1 + `checklist.md`
- **Optional Files**: None
- **Use When**: Features needing systematic QA validation
- **Examples**: Modal component, auth flow, library migration

> **Note**: The `checklist.md` is an **ACTIVE VERIFICATION TOOL** that the AI MUST use before claiming completion. P0/P1 items must be marked with evidence.

### Level 3: Full Documentation

- **Required Files**: Level 2 + `decision-record.md`
- **Optional Files**: `research.md`
- **Use When**: Complex features, architecture changes, major decisions
- **Examples**: Major feature, system redesign, multi-team projects

### Utility Templates (Any Level)

| Template              | Purpose             | When to Use                                  |
| --------------------- | ------------------- | -------------------------------------------- |
| `handover.md`         | Session continuity  | Multi-session work, team handoffs            |
| `debug-delegation.md` | Sub-agent debugging | Delegating debug tasks to specialized agents |

### LOC Thresholds Are SOFT GUIDANCE

> **Pro Tip**: Use `recommend-level.sh --loc 250 --files 8` to get an AI-assisted recommendation.

These factors can override LOC and push to a higher level:

- **Complexity**: Architectural changes vs simple refactors
- **Risk**: Config cascades, authentication, security implications
- **Dependencies**: Multiple systems affected (>5 files suggests higher level)
- **Testing needs**: Integration vs unit test requirements

**Decision Rules:**
- When in doubt → choose higher level (better to over-document)
- Risk/complexity can override LOC (e.g., 50 LOC security change = Level 2+)
- Multi-file changes often need higher level than LOC alone suggests

---

## 4. 📝 TEMPLATES (10 TOTAL)

All templates are located in `.opencode/skill/system-spec-kit/templates/`. **NEVER create documentation from scratch** - always copy from templates and fill placeholders.

### Template Summary Table

| Template                    | Level | Type     | Lines | Description                             |
| --------------------------- | ----- | -------- | ----- | --------------------------------------- |
| `spec.md`                   | 1+    | Required | ~150  | Feature specification with user stories |
| `plan.md`                   | 1+    | Required | ~120  | Implementation plan with architecture   |
| `tasks.md`                  | 1+    | Required | ~80   | Task breakdown by user story            |
| `checklist.md`              | 2+    | Required | ~100  | Validation/QA checklists (P0/P1/P2)     |
| `decision-record.md`        | 3     | Required | ~90   | Architecture Decision Records (ADR)     |
| `research.md`               | 3     | Optional | ~878  | Comprehensive multi-domain research     |
| `handover.md`               | Any   | Utility  | ~100  | Full session continuity (7 sections)    |
| `debug-delegation.md`       | Any   | Utility  | ~64   | Sub-agent debugging delegation          |
| `implementation-summary.md` | Any   | Utility  | ~50   | Implementation completion summary       |

### Level 1: Baseline Templates

#### `spec.md` - Feature Specification

**Purpose**: Complete feature specification with user stories, acceptance criteria, and technical requirements

**Key Sections**:
- Objective & metadata (category, priority, status)
- Scope (in/out of scope)
- User stories with acceptance scenarios
- Functional & non-functional requirements
- Edge cases, success criteria, dependencies

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/###-name/spec.md
```

#### `plan.md` - Implementation Plan

**Purpose**: Implementation plan with architecture decisions, technical approach, and execution phases

**Key Sections**:
- Technical approach & architecture
- Implementation phases with milestones
- Testing strategy & quality gates
- Risk assessment & rollback plan
- Resource requirements

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/plan.md specs/###-name/plan.md
```

#### `tasks.md` - Task Breakdown

**Purpose**: Break implementation plan into actionable, trackable tasks

**Key Sections**:
- Task list with priorities and estimates
- Dependencies between tasks
- Assignment and status tracking
- Completion criteria per task

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-name/tasks.md
```

### Level 2: Verification Template

#### `checklist.md` - QA Validation

**Purpose**: Systematic validation and QA procedures with priority levels

**Key Sections**:
- Pre-implementation checklist
- Implementation verification
- Testing checklist
- Documentation completeness
- Deployment readiness

**Priority System**:
- **P0 (Blocker)**: MUST pass - work is incomplete without this
- **P1 (Required)**: MUST pass for production readiness
- **P2 (Optional)**: Can defer with documented reason

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/###-name/checklist.md
```

### Level 3: Full Documentation Templates

#### `decision-record.md` - Architecture Decisions

**Purpose**: Architecture Decision Records (ADRs) for documenting major technical decisions

**Key Sections**:
- Decision title and status
- Context and problem statement
- Options considered with pros/cons
- Decision outcome and rationale
- Consequences and follow-up actions

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/###-name/decision-record-[topic].md
```

#### `research.md` - Comprehensive Research

**Purpose**: Comprehensive technical research spanning multiple domains (architecture, integration, security, performance)

**Key Sections** (17 total):
- Project context & research scope
- Technical foundations & architecture analysis
- Integration patterns & data flow
- API/SDK documentation review
- Security & performance considerations
- Implementation recommendations

**When to Use**:
- Deep technical investigation before implementation
- Complex features spanning multiple technical areas
- Evaluating multiple solution approaches

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

### Utility Templates

> **Fork Exclusive**: These utility templates don't exist in the original Spec Kit.

#### `handover.md` - Session Continuity

**Purpose**: Document context for agent handoffs between sessions or team members

**Key Sections**:
- Context summary (task ID, status, progress)
- Completed work (files modified, decisions made, tests run)
- Remaining work (next steps, known issues, blockers)
- Artifacts (key files, related memory files)
- Handover checklist

**When to Use**:
- Multi-session work requiring context transfer
- Team handoffs or agent transitions
- Session completion with pending work

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/handover.md specs/###-name/handover.md
```

#### `debug-delegation.md` - Sub-Agent Debugging

> **Fork Exclusive**: AI detects frustration keywords and auto-suggests this workflow.

**Purpose**: Document debugging context when delegating to specialized agents

**Key Sections**:
- Problem summary (error category, message, affected files)
- Attempted fixes (approach, result, diff for each attempt)
- Context for specialist (code section, documentation, hypothesis)
- Recommended next steps
- Handoff checklist

**When to Use**:
- Complex debugging requiring specialized knowledge
- After 3+ failed fix attempts
- Escalating to domain-specific agents

**Automation Win**: The AI monitors for frustration signals ("stuck", "can't fix", "tried everything") and proactively suggests `/spec_kit:debug` before you have to ask.

**Copy Command**:
```bash
cp .opencode/skill/system-spec-kit/templates/debug-delegation.md specs/###-name/debug-delegation.md
```

### Template Rules

1. **ALWAYS copy from `.opencode/skill/system-spec-kit/templates/`** - never create from scratch
2. **Fill ALL placeholders** - replace `[PLACEHOLDER]` and `[YOUR_VALUE_HERE]` with actual content
3. **Remove sample content** - delete `<!-- SAMPLE CONTENT -->` blocks
4. **Preserve structure** - keep numbered H2 sections with consistent formatting
5. **Use descriptive filenames** - prefix decision records and research spikes with topic

---

## 5. ⚙️ SCRIPTS

> **Fork Exclusive**: The original Spec Kit has zero automation scripts. This fork has eleven.

Eleven automation scripts in `.opencode/skill/system-spec-kit/scripts/` handle the tedious work so you can focus on building.

### Script Overview

| Script                      | Purpose                             | Time Saved           |
| --------------------------- | ----------------------------------- | -------------------- |
| `common.sh`                 | Shared utility functions            | N/A (sourced)        |
| `create-spec-folder.sh`     | Create feature branch & spec folder | ~2 min/feature       |
| `check-prerequisites.sh`    | Validate spec folder structure      | ~1 min/check         |
| `calculate-completeness.sh` | Calculate completeness percentage   | Eliminates guesswork |
| `recommend-level.sh`        | Recommend documentation level (1-3) | ~30 sec/decision     |
| `archive-spec.sh`           | Archive completed spec folders      | ~1 min/archive       |
| `validate-spec.sh`          | Validate spec folder quality        | Catches issues early |

> **Automation Win**: These scripts execute in <200ms each. The time saved is in *not having to think* about folder naming, file structure, or "is this spec complete enough?"

### `common.sh` - Shared Utilities

**Purpose**: Shared utility functions used by all other Spec Kit scripts

**Functions**:
| Function                 | Description                               |
| ------------------------ | ----------------------------------------- |
| `get_repo_root()`        | Find git repository root directory        |
| `get_current_branch()`   | Get current git branch name               |
| `get_feature_paths()`    | Resolve all feature-related paths         |
| `check_feature_branch()` | Validate branch follows naming convention |

**Usage**: Sourced by other scripts, not called directly

### `create-spec-folder.sh` - Feature Creation

**Purpose**: Create new feature branch and spec folder with proper numbering

**Options**:
| Flag                  | Description                           | Default        |
| --------------------- | ------------------------------------- | -------------- |
| `--json`              | Output in JSON format                 | false          |
| `--level N`           | Documentation level (1, 2, or 3)      | 1              |
| `--short-name <name>` | Custom feature name (2-4 words)       | auto-generated |
| `--number N`          | Specify feature number                | auto-increment |
| `--skip-branch`       | Create spec folder without git branch | false          |

**Documentation Levels**:
- **Level 1 (Baseline)**: spec.md + plan.md + tasks.md + implementation-summary.md
- **Level 2 (Verification)**: Level 1 + checklist.md
- **Level 3 (Full)**: Level 2 + decision-record.md

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/create-spec-folder.sh "Add user authentication" --level 2

═══════════════════════════════════════════════════════════════════
  Spec Kit: Spec Folder Created Successfully
═══════════════════════════════════════════════════════════════════

  BRANCH_NAME:  042-user-authentication
  FEATURE_NUM:  042
  DOC_LEVEL:    Level 2
  SPEC_FOLDER:  /path/to/specs/042-user-authentication

  Created Structure:
  └── 042-user-authentication/
      ├── spec.md
      ├── plan.md
      ├── tasks.md
      ├── checklist.md
      ├── scratch/          (git-ignored working files)
      │   └── .gitkeep
      └── memory/           (context preservation)
          └── .gitkeep
```

**Auto-Create Logic**:
1. Find next number: `ls -d specs/[0-9]*/ | sort -n | tail -1` + 1
2. Create folder: `specs/{NNN}-{feature-name}/`
3. Handle collisions: Increment until unique
4. Create branch: `feature-{NNN}-{short-name}`

**Exit Codes**: `0` = Success | `1` = Invalid arguments | `2` = Git error

### `check-prerequisites.sh` - Structure Validation

**Purpose**: Validate spec folder structure and list available documentation

**Options**:
| Flag              | Description                     | Default |
| ----------------- | ------------------------------- | ------- |
| `--json`          | Output in JSON format           | false   |
| `--require-tasks` | Require tasks.md exists         | false   |
| `--include-tasks` | Include tasks.md in output      | false   |
| `--paths-only`    | Output paths without validation | false   |

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/check-prerequisites.sh

FEATURE_DIR: specs/042-user-auth
AVAILABLE_DOCS:
  ✓ spec.md
  ✓ plan.md
  ✗ tasks.md
  ✗ research.md
```

**Exit Codes**: `0` = All prerequisites met | `1` = Missing required files | `2` = No spec folder found

### `calculate-completeness.sh` - Quality Assessment

**Purpose**: Calculate spec folder completeness percentage for quality assessment

**What It Checks**:
| Check            | Weight | Description                      |
| ---------------- | ------ | -------------------------------- |
| Required files   | 30%    | spec.md, plan.md exist           |
| Placeholders     | 25%    | All `[YOUR_VALUE_HERE]` replaced |
| Content quality  | 20%    | Minimum word counts met          |
| Cross-references | 15%    | Files reference each other       |
| Metadata         | 10%    | Status, priority, dates filled   |

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/calculate-completeness.sh specs/042-user-auth

Completeness Score: 75%

Missing:
  - tasks.md not created
  - 2 placeholders in spec.md
  - Cross-references incomplete

Recommendations:
  - Create tasks.md from plan
  - Fill remaining placeholders
```

**Exit Codes**: `0` = 80%+ complete | `1` = Below 80% | `2` = Spec folder not found

### `recommend-level.sh` - Level Recommendation

**Purpose**: Analyze feature complexity and recommend appropriate documentation level (1-3)

**Options**:
| Flag           | Description                        | Default |
| -------------- | ---------------------------------- | ------- |
| `--json`       | Output in JSON format              | false   |
| `--loc <N>`    | Estimated lines of code            | auto    |
| `--files <N>`  | Number of files to modify          | auto    |
| `--complexity` | Include complexity factor analysis | false   |

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/recommend-level.sh --loc 250 --files 8

Recommended Level: 2 (Verification)

Analysis:
  - LOC estimate: 250 (100-499 range = Level 2)
  - Files affected: 8 (>5 files suggests Level 2+)
  - Complexity factors: None specified

Rationale:
  - Medium scope change requiring checklist verification
  - Multiple files suggest cross-cutting concerns
```

**Exit Codes**: `0` = Recommendation provided | `1` = Invalid arguments

### `archive-spec.sh` - Spec Archival

**Purpose**: Archive completed spec folders to reduce clutter and improve navigation

**Options**:
| Flag         | Description                 | Default    |
| ------------ | --------------------------- | ---------- |
| `--json`     | Output in JSON format       | false      |
| `--dry-run`  | Show what would be archived | false      |
| `--target`   | Custom archive location     | z_archive/ |
| `--compress` | Compress archived folder    | false      |

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/archive-spec.sh specs/042-user-auth

Archived: specs/042-user-auth → specs/z_archive/042-user-auth

Archive Summary:
  - Files moved: 6
  - Memory preserved: Yes
  - Git status: Staged for commit
```

**Exit Codes**: `0` = Success | `1` = Invalid arguments | `2` = Folder not found

### `validate-spec.sh` - Quality Validation

**Purpose**: Validate spec folder contents against quality requirements based on documentation level. Checks for required files, unfilled placeholders, and proper markdown structure.

> **Gate 6 Integration**: This script is invoked by Gate 6 (Completion Verification) before claiming any work as "done".

**Options**:
| Flag              | Description                               | Default |
| ----------------- | ----------------------------------------- | ------- |
| `--json`          | Output in JSON format (for tooling)       | false   |
| `--strict`        | Treat warnings as errors                  | false   |
| `--verbose`       | Show detailed validation output           | false   |
| `--quiet`, `-q`   | Results only (suppress decorative output) | false   |
| `--help`, `-h`    | Show help message                         | -       |
| `--version`, `-v` | Show version number                       | -       |

**Environment Variables**:
| Variable                   | Effect                      |
| -------------------------- | --------------------------- |
| `SPECKIT_VALIDATION=false` | Disable validation entirely |
| `SPECKIT_STRICT=true`      | Enable strict mode          |
| `SPECKIT_JSON=true`        | Force JSON output           |
| `SPECKIT_VERBOSE=true`     | Enable verbose output       |
| `SPECKIT_QUIET=true`       | Enable quiet mode           |

**Validation Rules** (7 total):
| Rule                 | Severity | Description                                      |
| -------------------- | -------- | ------------------------------------------------ |
| `FILE_EXISTS`        | error    | Required files present for documentation level   |
| `PLACEHOLDER_FILLED` | error    | No unfilled `[YOUR_VALUE_HERE:]` placeholders    |
| `SECTIONS_PRESENT`   | warn     | Required markdown sections exist                 |
| `LEVEL_DECLARED`     | info     | Level explicitly declared in spec.md             |
| `PRIORITY_TAGS`      | warn     | P0/P1/P2 tags properly formatted in checklist.md |
| `EVIDENCE_CITED`     | warn     | Completed P0/P1 items have evidence citations    |
| `ANCHORS_VALID`      | error    | ANCHOR tags in memory files have matching pairs  |

**Level Detection**:
1. **Explicit**: Reads `| **Level** | N |` from spec.md metadata table
2. **Inferred**: Falls back to file presence (decision-record.md → L3, checklist.md → L2, else L1)

**Example**:
```bash
$ .opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/042-user-auth

═══════════════════════════════════════════════════════════════
  Spec Folder Validation
═══════════════════════════════════════════════════════════════

  Folder: specs/042-user-auth
  Level:  2 (explicit)

───────────────────────────────────────────────────────────────

✓ FILE_EXISTS: All required files present for Level 2
✓ PLACEHOLDER_FILLED: No unfilled placeholders found
✓ SECTIONS_PRESENT: All required sections found

───────────────────────────────────────────────────────────────

  Summary:
    Errors:   0
    Warnings: 0
    Info:     0

  RESULT: PASSED
```

**JSON Output** (for CI/tooling):
```bash
$ .opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/042-user-auth --json

{
  "folder": "specs/042-user-auth",
  "level": 2,
  "levelMethod": "explicit",
  "results": [...],
  "summary": { "errors": 0, "warnings": 0, "info": 0 },
  "details": {
    "missingFiles": [],
    "unfilledPlaceholders": [],
    "missingSections": []
  },
  "passed": true,
  "strict": false
}
```

**Strict Mode** (for CI pipelines):
```bash
# Warnings become errors in strict mode
$ .opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/042-user-auth --strict
```

**Exit Codes**: `0` = Passed | `1` = Passed with warnings | `2` = Failed (errors found)

### 5.8 Modular Validation Architecture

> **v2.0 Architecture**: The validation system uses a modular design for maintainability, testability, and extensibility.

**Architecture Overview**:
```
validate-spec.sh (orchestrator)
    │
    ├── lib/common.sh    ─── Core utilities (logging, path resolution)
    ├── lib/config.sh    ─── Configuration loading (.speckit.yaml)
    ├── lib/output.sh    ─── Output formatting (text/JSON modes)
    │
    └── rules/           ─── Individual validation rules
        ├── check-files.sh          → FILE_EXISTS
        ├── check-folder-naming.sh  → FOLDER_NAMING (###-short-name pattern)
        ├── check-frontmatter.sh    → FRONTMATTER_VALID (YAML structure)
        ├── check-placeholders.sh   → PLACEHOLDER_FILLED
        ├── check-sections.sh       → SECTIONS_PRESENT
        ├── check-level.sh          → LEVEL_DECLARED
        ├── check-priority-tags.sh  → PRIORITY_TAGS
        ├── check-evidence.sh       → EVIDENCE_CITED
        └── check-anchors.sh        → ANCHORS_VALID
```

**Design Principles**:
1. **Single Responsibility** - Each rule file handles one validation concern
2. **Consistent Interface** - All rules export `run_check()` function
3. **Configurable Severity** - Rules respect `.speckit.yaml` severity overrides
4. **Testable** - Each rule can be tested in isolation via test-fixtures/

**Adding New Rules**:
```bash
# 1. Create rule file in rules/
cp rules/check-files.sh rules/check-custom.sh

# 2. Implement run_check() function
# Function receives: FOLDER_PATH, DETECTED_LEVEL, exports RESULT, SEVERITY, MESSAGE

# 3. Register in validate-spec.sh orchestrator
# Add to RULES array and call in main loop

# 4. Add test fixtures
mkdir -p test-fixtures/custom-valid test-fixtures/custom-invalid
```

### 5.9 Configuration (.speckit.yaml)

> **Fork Exclusive**: Override default validation behavior per-project or per-folder.

The validation system supports optional `.speckit.yaml` configuration files for customizing validation behavior.

**Config File Locations** (checked in order):
1. `<spec-folder>/.speckit.yaml` - Folder-specific overrides
2. `<repo-root>/.speckit.yaml` - Project-wide defaults

**Configuration Options**:
```yaml
# .speckit.yaml - Validation configuration
validation:
  # Override rule severities (error | warn | info | skip)
  rules:
    FILE_EXISTS: error        # Required files must exist (default: error)
    PLACEHOLDER_FILLED: error # No unfilled placeholders (default: error)
    SECTIONS_PRESENT: warn    # Required sections (default: warn)
    LEVEL_DECLARED: info      # Explicit level in spec.md (default: info)
    PRIORITY_TAGS: warn       # P0/P1/P2 formatting (default: warn)
    EVIDENCE_CITED: warn      # Evidence for completed items (default: warn)
    ANCHORS_VALID: error      # ANCHOR tag pairs valid (default: error)
  
  # Global settings
  strict: false               # Treat warnings as errors
  verbose: false              # Show detailed output
```

**Severity Levels**:
| Severity | Exit Code Impact | Description                    |
| -------- | ---------------- | ------------------------------ |
| `error`  | Exit 2           | Validation fails               |
| `warn`   | Exit 1           | Validation passes with warning |
| `info`   | Exit 0           | Informational only             |
| `skip`   | N/A              | Rule disabled entirely         |

**Example Use Cases**:
```yaml
# Disable placeholder checking during early drafts
validation:
  rules:
    PLACEHOLDER_FILLED: skip

# Strict mode for CI pipelines
validation:
  strict: true
  rules:
    SECTIONS_PRESENT: error
```

### 5.10 Test Suite

> **Quality Assurance**: 36 test fixtures across 10 categories ensure validation rules work correctly.

The test suite validates that all rules correctly detect issues and pass valid specs.

**Running Tests**:
```bash
# Run all validation tests
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh

# Run with verbose output
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh --verbose
```

**Test Fixture Structure**:
```
test-fixtures/
├── valid-level1/           # Should pass - valid Level 1 spec
├── valid-level3/           # Should pass - valid Level 3 spec
├── valid-sections/         # Should pass - all required sections
├── valid-priority-tags/    # Should pass - proper P0/P1/P2 format
├── valid-evidence/         # Should pass - evidence citations present
├── missing-plan/           # Should fail - FILE_EXISTS
├── missing-required-files/ # Should fail - FILE_EXISTS
├── unfilled-placeholders/  # Should fail - PLACEHOLDER_FILLED
├── missing-plan-sections/  # Should warn - SECTIONS_PRESENT
├── invalid-priority-tags/  # Should warn - PRIORITY_TAGS
├── missing-evidence/       # Should warn - EVIDENCE_CITED
├── invalid-anchors/        # Should fail - ANCHORS_VALID
├── level-explicit/         # Level detection from metadata
├── level-inferred/         # Level detection from file presence
├── placeholder-in-codeblock/  # Placeholders in code blocks (allowed)
├── placeholder-in-inline-code/ # Placeholders in inline code (allowed)
├── with-config/            # Config file loading test
├── with-scratch/           # Scratch folder handling
└── README.md               # Test fixture documentation
```

**Adding Test Fixtures**:
```bash
# 1. Create fixture directory
mkdir test-fixtures/my-test-case

# 2. Add minimum required files
cp templates/spec.md test-fixtures/my-test-case/
cp templates/plan.md test-fixtures/my-test-case/
cp templates/tasks.md test-fixtures/my-test-case/

# 3. Modify to create test condition
# (e.g., leave placeholder unfilled, remove required section)

# 4. Add expected outcome to tests/test-validation.sh
```

**Test Output Example**:
```bash
$ ./tests/test-validation.sh

═══════════════════════════════════════════════════════════════
  Spec Kit Validation Test Suite
═══════════════════════════════════════════════════════════════

Testing: valid-level1 .......................... PASS
Testing: valid-level3 .......................... PASS
Testing: missing-plan .......................... PASS (expected fail)
Testing: unfilled-placeholders ................. PASS (expected fail)
Testing: invalid-anchors ....................... PASS (expected fail)

───────────────────────────────────────────────────────────────
  Results: 55/55 passed (51 fixtures, 10 categories)
───────────────────────────────────────────────────────────────
```

---

## 6. 🎯 COMMANDS (7 TOTAL)

> **Fork Exclusive**: The original Spec Kit has no slash commands. This fork has seven, each with `:auto` and `:confirm` mode variants.

Twelve Spec Kit commands transform multi-step workflows into single invocations.

### Command Overview

| Command               | Steps | Purpose                           | Key Templates             |
| --------------------- | ----- | --------------------------------- | ------------------------- |
| `/spec_kit:complete`  | 12    | Full end-to-end workflow          | All templates             |
| `/spec_kit:plan`      | 7     | Planning only (no implementation) | spec, plan, checklist     |
| `/spec_kit:implement` | 8     | Execute pre-planned work          | tasks, checklist          |
| `/spec_kit:research`  | 9     | Technical investigation           | research, decision-record |
| `/spec_kit:resume`    | 4-5   | Resume previous session           | Loads memory/             |
| `/spec_kit:handover`  | 4-5   | Create session handover document  | handover.md               |
| `/spec_kit:debug`     | 4-5   | Delegate debugging to sub-agent   | debug-delegation.md       |

### Core Commands (6)

#### `/spec_kit:complete` - Full Workflow

End-to-end workflow from specification through implementation.

**Steps (12)**:
1. Create/select spec folder
2. Write spec.md
3. Review spec
4. Write plan.md
5. Review plan
6. Create tasks.md
7. Implement tasks
8. Run tests
9. Create checklist.md
10. Verify checklist
11. Commit changes
12. Complete workflow

#### `/spec_kit:plan` - Planning Only

Planning workflow without implementation (for later execution).

**Steps (7)**:
1. Create/select spec folder
2. Write spec.md
3. Review spec
4. Write plan.md
5. Review plan
6. Create tasks.md
7. Save for later implementation

#### `/spec_kit:implement` - Implementation Only

Execute pre-planned work (requires existing spec+plan).

**Steps (8)**:
1. Load existing spec folder
2. Review spec.md and plan.md
3. Load/create tasks.md
4. Implement tasks
5. Run tests
6. Create/verify checklist.md
7. Commit changes
8. Complete workflow

#### `/spec_kit:research` - Technical Investigation

Comprehensive technical research workflow.

**Steps (9)**:
1. Define research scope
2. Create research.md
3. Conduct investigation
4. Document findings
5. Evaluate options
6. Create decision-record.md
7. Recommend approach
8. Review with stakeholders
9. Prepare for planning

#### `/spec_kit:handover` - Session Handover

Create session handover document for continuing work in new conversations.

**Key Features:**
- **Sub-agent delegation**: Dispatches context gathering to sub-agent via Task tool
- **Two variants**: `:quick` (15-line summary) or `:full` (150-line comprehensive)
- **Memory integration**: Auto-saves context via `generate-context.js`

**Steps (4-5)**:
1. Validate/detect spec folder
2. Dispatch sub-agent to gather session context
3. Create handover.md document
4. Display continuation instructions
5. Save context to memory (optional)

#### `/spec_kit:debug` - Debug Delegation

> **Fork Exclusive**: This command doesn't exist in the original Spec Kit. It's a game-changer for stuck debugging sessions.

Delegates debugging tasks to a specialized sub-agent with full context handoff.

**Key Features:**
- **Model selection prompt**: Always asks which AI model to use (Claude/Gemini/GPT)
- **Structured debug report**: Generates report using `debug-delegation.md` template
- **Sub-agent dispatch**: Routes debugging to selected model via Task tool
- **Universal methodology**: Follows systematic debugging approach documented in `references/debugging/universal_debugging_methodology.md`
- **Returns**: Root cause analysis, proposed fix, and verification steps

**Auto-Suggestion (AI-Powered):**
The AI monitors your session and proactively suggests this command when:
- Same error occurs 3+ times after fix attempts
- Frustration keywords detected ("stuck", "can't fix", "tried everything", "hours on this")
- Extended debugging session without resolution

> **Why This Matters**: You don't have to admit you're stuck. The AI notices *for you* and offers help before frustration peaks.

**Usage:**
```bash
/spec_kit:debug [spec-folder-path]
```

**Steps (4-5)**:
1. Validate/detect spec folder
2. Ask user which AI model to use (Claude/Gemini/GPT)
3. Generate debug-delegation.md with context
4. Dispatch sub-agent via Task tool with universal debugging methodology
5. Return results with root cause and fix proposal

### Utility Commands (1)

| Command            | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `/spec_kit:resume` | Resume previous session, load memory files |

### Mode Suffixes

Each core command supports two execution modes:

| Suffix     | Mode        | Behavior                        |
| ---------- | ----------- | ------------------------------- |
| `:auto`    | Autonomous  | Execute without approval gates  |
| `:confirm` | Interactive | Pause at each step for approval |

**Examples**:
```bash
/spec_kit:complete add user authentication :auto
/spec_kit:plan refactor database layer :confirm
```

### Session Behavior Modes

Commands also support session-wide behavior flags that affect response verbosity:

| Flag | Effect | Use When |
|------|--------|----------|
| `--brief` | Concise responses, minimal explanations | Quick tasks, experienced users |
| `--verbose` | Detailed explanations, reasoning shown | Learning, complex debugging |
| `--debug` | Maximum diagnostic output, all tool calls | Troubleshooting, verification |

**Examples**:
```bash
/spec_kit:implement --brief "add validation"
/spec_kit:debug --verbose
/spec_kit:research --debug "evaluate auth options"
```

### Workflow Decision Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    START: New Task                          │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
              ┌───────────────────────────────┐
              │ Do you understand the         │
              │ requirements clearly?         │
              └───────────────┬───────────────┘
                    ┌─────────┴─────────┐
                    ▼                   ▼
                  YES                   NO
                    │                   │
                    ▼                   ▼
    ┌───────────────────────┐  ┌───────────────────────┐
    │ Do you need to plan   │  │ /spec_kit:research    │
    │ implementation later? │  │ (investigate first)   │
    └───────────┬───────────┘  └───────────┬───────────┘
          ┌─────┴─────┐                    │
          ▼           ▼                    ▼
        YES          NO             Then choose path:
          │           │             :plan or :complete
          ▼           ▼
  ┌─────────────┐  ┌─────────────┐
  │/spec_kit:   │  │/spec_kit:   │
  │ plan        │  │ complete    │
  │ (7 steps)   │  │ (12 steps)  │
  └──────┬──────┘  └─────────────┘
         │
         ▼
  ┌─────────────────┐
  │/spec_kit:       │
  │ implement       │
  │ (8 steps)       │
  └─────────────────┘
```

### Valid Workflow Paths

1. `/spec_kit:complete` - Full end-to-end (spec → plan → implement)
2. `/spec_kit:plan` → `/spec_kit:implement` - Split execution
3. `/spec_kit:research` → `/spec_kit:plan` → `/spec_kit:implement` - With research phase
4. `/spec_kit:research` → `/spec_kit:complete` - Research then full workflow

### Command Locations

```
.opencode/command/spec_kit/          # OpenCode
```

---

## 7. 🔄 HOW IT WORKS

### 7.1 Spec Folder Question Flow (A/B/C/D Options)

When file modification intent is detected, the system presents four options:

| Option | Action                   | Description                                   |
| ------ | ------------------------ | --------------------------------------------- |
| **A**  | Use existing spec folder | Continue work in detected folder              |
| **B**  | Create new spec folder   | Auto-increment number, create fresh folder    |
| **C**  | Update related spec      | Modify existing related spec                  |
| **D**  | Skip documentation       | Proceed without spec (creates technical debt) |

**AI Agent Protocol**: Present options, wait for explicit user selection, never decide autonomously.

### 7.2 Memory File Loading (Auto-Load with Opt-Out)

When selecting Option A or C with existing memory files:

**Default Behavior**: Automatically load the most recent memory file

**On-Demand Options**:
| Command                            | Action                             |
| ---------------------------------- | ---------------------------------- |
| `"load all memory"`                | Load up to 3 recent files          |
| `"list memory"`                    | Show available files for selection |
| `"skip memory"` or `"fresh start"` | No context loading                 |

**Memory File Naming Format**: `DD-MM-YY_HH-MM__short-description.md`

### 7.3 Sub-Folder Versioning (001, 002, 003 Pattern)

> **Fork Exclusive**: Original Spec Kit overwrites existing specs. This fork versions them.

When reusing a spec folder with existing root-level content:

1. **Trigger**: Selecting Option A with existing files at root
2. **Archive**: Existing files moved to `001-{topic}/`
3. **New Work**: Create sub-folder `002-{user-name}/`, `003-{user-name}/`, etc.
4. **Memory**: Each sub-folder has independent `memory/` context

> **Why This Matters**: You can revisit a feature 6 months later, see all previous iterations, and understand the evolution of decisions.

**Example**:
```
specs/122-skill-standardization/
├── 001-original-work/        (archived)
├── 002-api-refactor/         (completed)
└── 003-bug-fixes/            (active)
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── memory/
        └── 07-12-25_14-30__context.md
```

### 7.4 Context Save (V17.1 Architecture)

> **V17.1**: Memory saves MUST use `generate-context.js`. Manual file creation is blocked by Gate 5. Cognitive memory features now provide attention decay and tiered content loading.

Context preservation uses the `/memory:save` command or "save context" trigger phrase. The system:
1. Dispatches sub-agent via Task tool to gather context (for complex sessions)
2. Runs `generate-context.js` to capture conversation context
3. Generates ANCHOR markers for section-level retrieval (implemented v1.7.2)
4. Auto-indexes into semantic memory database
5. Embeds project state directly in memory file (no separate STATE.md)

### 7.5 Folder Naming Convention

**Format**: `/specs/###-short-name/`

**Finding Next Number**:
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

**Naming Rules**:
- 2-3 words maximum
- Lowercase, hyphen-separated
- Action-noun structure preferred (e.g., `add-auth`, `fix-validation`)

### 7.6 Architecture (2-Tier System)

> **Fork Exclusive**: This command/prompt separation enables mode variants (`:auto`/`:confirm`) without code duplication.

Spec Kit uses a 2-tier architecture:

**Tier 1: Command Definitions** (what to do)
- Location: `.opencode/command/spec_kit/*.md`
- Purpose: Define workflow purpose, steps, user-facing documentation
- Contains: Workflow overview, mode detection, error handling

**Tier 2: Workflow Prompts** (how to do it)
- Location: `.opencode/command/spec_kit/assets/*.yaml`
- Purpose: Detailed AI instructions per mode (auto/confirm)
- Contains: Step-by-step activities, template references, tool invocations

**Flow**: User invokes command → Command definition routes to prompt → Prompt executes workflow

---

## 8. 🧠 INTEGRATED MEMORY SYSTEM

> **Fork Exclusive**: The original Spec Kit has no memory integration. This fork includes a complete semantic memory system with vector search, importance tiers, and proactive context surfacing.

### 8.1 Overview

The Spec Kit Memory system gives your AI assistant persistent, searchable memory across sessions. Memory files live IN spec folders (`specs/###-feature/memory/`), are indexed into a local SQLite database with vector embeddings, and surface proactively when relevant.

**Key Capabilities:**
- Hybrid search (vector + FTS5 + RRF fusion)
- 6 importance tiers with configurable decay
- ANCHOR format for section marking (implemented v1.7.2, 58-90% token savings)
- <50ms proactive trigger matching
- Checkpoints for state snapshots

### 8.2 Importance Tiers

The memory system uses 6 importance tiers to prioritize what surfaces first:

| Tier | Boost | Decay | Use Case |
|------|-------|-------|----------|
| **constitutional** | 3.0x | Never | Project rules, always-on context (~2000 tokens max) |
| **critical** | 2.0x | Never | Architecture decisions, breaking changes |
| **important** | 1.5x | Never | Key implementations, major features |
| **normal** | 1.0x | 90-day | Standard development context (default) |
| **temporary** | 0.5x | 7-day | Debug sessions, experiments |
| **deprecated** | 0.0x | Excluded | Outdated information (preserved but hidden) |

**Tier Selection:**
- **constitutional**: Reserved for rules that should ALWAYS surface
- **critical/important**: Decisions that would break things or save significant time
- **normal**: Default for most session context
- **temporary**: Short-term debugging notes
- **deprecated**: Mark outdated info instead of deleting

### 8.3 ANCHOR Format

Memory files use ANCHOR markers for section-level retrieval:

> **Implemented (v1.7.2):** ANCHOR tags are now fully indexed and support section-level retrieval. Use the `anchors` parameter in `memory_search()` to retrieve specific sections (e.g., `memory_search({ query: "auth decisions", anchors: ["decisions", "context"] })`). Token savings of 58-90% depending on content structure. The `extractAnchors()` function is available for programmatic anchor extraction.

```markdown
<!-- ANCHOR: decision-auth-flow -->
## Authentication Decision

We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension without re-login

**Trade-offs:** Token revocation requires blocklist.
<!-- ANCHOR_END: decision-auth-flow -->
```

**How it works:**
1. `generate-context.js` extracts ANCHOR sections
2. Each section is embedded separately
3. Search returns specific sections, not entire files
4. Agent loads only relevant anchors

**ANCHOR Rules:**
- Every `ANCHOR:` must have matching `ANCHOR_END:`
- IDs must be unique within a file
- Use descriptive IDs: `decision-*`, `blocker-*`, `context-*`

### 8.4 Memory Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/memory:save [folder]` | Save context via generate-context.js | `/memory:save specs/042-auth` |
| `/memory:search` | Dashboard with stats and suggestions | `/memory:search` |
| `/memory:search <query>` | Semantic search with filters | `/memory:search "auth flow"` |
| `/memory:search cleanup` | Interactive cleanup of old memories | `/memory:search cleanup` |
| `/memory:checkpoint create` | Snapshot current state | `/memory:checkpoint create v1` |

### 8.5 Hybrid Search

The memory system combines three search strategies via RRF (Reciprocal Rank Fusion):

| Strategy | Speed | Best For |
|----------|-------|----------|
| **Vector** | ~100ms | Semantic queries ("How does auth work?") |
| **FTS5** | <10ms | Exact keywords ("JWT", "refresh token") |
| **Trigger** | <50ms | Proactive surfacing (phrase matching) |

Results are merged using RRF fusion, giving you semantic understanding with keyword precision.

### 8.6 Privacy & Embedding Options

**Provider Flexibility (v12.0+):**

The memory system supports multiple embedding providers:

| Provider | Dimensions | Requirements | Best For |
|----------|------------|--------------|----------|
| **Voyage** | 1024 | `VOYAGE_API_KEY` | Recommended, best retrieval quality (`voyage-4`) |
| **OpenAI** | 1536/3072 | `OPENAI_API_KEY` | Alternative cloud option |
| **HF Local** | 768 | Node.js only | Privacy, offline, default fallback |
| **Ollama** | 768 | Ollama + model | Optional (not yet available) |

**Local-First Option (HF Local):**
- **Embeddings**: nomic-embed-text-v1.5 runs on YOUR machine via Transformers.js
- **Storage**: SQLite database in YOUR project (`.opencode/skill/system-spec-kit/database/`)
- **No external API calls** for memory operations
- Works fully offline, no downloads required

**Cloud Option (Voyage / OpenAI):**
- Voyage offers 8% better retrieval quality than OpenAI
- Auto-detection priority: Voyage → OpenAI → HF Local
- Override with `EMBEDDINGS_PROVIDER=hf-local` to force local

See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details on the factory pattern and DB-per-profile architecture.

### 8.7 Cognitive Memory (v1.7.1)

The memory system now includes cognitive features for smarter context surfacing:

| Feature | Description |
|---------|-------------|
| **Attention Decay** | Memory scores decay per turn (stale context fades) |
| **Tiered Content** | HOT=full, WARM=summary, COLD=excluded |
| **Co-Activation** | Related memories surface together |
| **Working Memory** | Session-scoped context that persists within a conversation |

**Usage**: Pass `session_id` and `turn_number` to `memory_match_triggers` to enable cognitive features.

**How it works:**
1. Each memory tracks when it was last accessed
2. Decay rate applies per conversation turn (configurable)
3. HOT memories (recently accessed, high relevance) return full content
4. WARM memories return summaries to save tokens
5. COLD memories are excluded from results but preserved in database
6. Co-activation links related memories so they surface together

**Configuration:**
```javascript
// Enable cognitive features in memory_match_triggers
memory_match_triggers({
  prompt: "user query here",
  session_id: "unique-session-id",
  turn_number: 5  // Current turn in conversation
})
```

---

## 9. 🔌 INTEGRATION POINTS

### Related Skills

**Upstream:** None (foundational workflow)

**Downstream:**
| Skill                     | Integration                          |
| ------------------------- | ------------------------------------ |
| `workflows-code`          | Uses spec folders for implementation |
| `workflows-git`           | References specs in commits/PRs      |
| `workflows-documentation` | Validates documentation quality      |

**Integrated (formerly separate skill):**
| Component           | Integration                                     |
| ------------------- | ----------------------------------------------- |
| Spec Kit Memory MCP | Context preservation via vector search (merged) |

### External Dependencies

- `.opencode/skill/system-spec-kit/templates/*.md` - All 10 templates
- `.opencode/skill/system-spec-kit/SKILL.md` - Main skill
- `AGENTS.md` - Section 2 defines requirements
- `specs/` - Directory for all spec folders

### Spec Kit vs Commands

| Component    | Purpose                        | Execution                      | Location                           |
| ------------ | ------------------------------ | ------------------------------ | ---------------------------------- |
| **Spec Kit** | Template & workflow management | User-invoked or AI-triggered   | `.opencode/skill/system-spec-kit/` |
| **Commands** | Spec Kit workflow execution    | Slash commands (`/spec_kit:*`) | `.opencode/command/`               |

---

## 10. 💡 USAGE EXAMPLES

### Creating a New Feature

```bash
# Generate feature branch and spec folder
.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh "Add user authentication system"

# Result:
# - Branch: 042-user-authentication-system
# - Folder: specs/042-user-authentication-system/
# - File: specs/042-user-authentication-system/spec.md
```

### Manual Template Setup

```bash
# Level 1: Baseline (all features)
cp .opencode/skill/system-spec-kit/templates/spec.md specs/042-feature/spec.md
cp .opencode/skill/system-spec-kit/templates/plan.md specs/042-feature/plan.md
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/042-feature/tasks.md
cp .opencode/skill/system-spec-kit/templates/implementation-summary.md specs/042-feature/implementation-summary.md

# Level 2: Add verification
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/042-feature/checklist.md

# Level 3: Add decision documentation
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/042-feature/decision-record-database.md

# Optional research
cp .opencode/skill/system-spec-kit/templates/research.md specs/042-feature/research.md

# Utility templates
cp .opencode/skill/system-spec-kit/templates/handover.md specs/042-feature/handover.md
cp .opencode/skill/system-spec-kit/templates/debug-delegation.md specs/042-feature/debug-delegation.md
```

### Checking Prerequisites

```bash
# Validate spec folder has required files
.opencode/skill/system-spec-kit/scripts/check-prerequisites.sh

# Output example:
# FEATURE_DIR: specs/042-user-auth
# AVAILABLE_DOCS:
#   ✓ spec.md
#   ✓ plan.md
#   ✗ tasks.md
#   ✗ research.md
```

### Checking Completeness

```bash
# Calculate spec folder completeness
.opencode/skill/system-spec-kit/scripts/calculate-completeness.sh specs/042-user-auth

# Output example:
# Completeness Score: 75%
# Missing:
#   - tasks.md not created
#   - Placeholders in spec.md (2 found)
#   - Cross-references incomplete
```

### Using Commands

```bash
# Full workflow for new feature
/spec_kit:complete add payment processing :confirm

# Planning for later implementation
/spec_kit:plan refactor user service :auto

# Research before planning
/spec_kit:research evaluate GraphQL vs REST

# Resume previous work
/spec_kit:resume
```

### Sub-Folder Versioning

```bash
# When reusing spec folder with existing content
# System auto-creates versioned sub-folders:

specs/042-user-auth/
├── 001-initial-implementation/    # Original work (archived)
│   ├── spec.md
│   └── plan.md
├── 002-password-reset-feature/    # Second iteration
│   ├── spec.md
│   ├── plan.md
│   └── memory/
└── 003-oauth-integration/         # Active work
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── memory/
```

---

## 11. 🚀 INSTALLATION & SETUP

### 30-Second Setup

```bash
# 1. Navigate to your project root
cd /path/to/project

# 2. Find the next spec folder number
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1

# 3. Create your spec folder (replace ### with next number)
mkdir -p specs/###-your-feature-name/

# 4. Copy required templates
cp .opencode/skill/system-spec-kit/templates/spec.md specs/###-your-feature-name/
cp .opencode/skill/system-spec-kit/templates/plan.md specs/###-your-feature-name/
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-your-feature-name/
```

### Using Commands

```bash
# Full workflow (spec → plan → implement)
/spec_kit:complete add user authentication

# Planning only
/spec_kit:plan refactor database layer

# Implementation (requires existing spec+plan)
/spec_kit:implement

# Technical investigation
/spec_kit:research evaluate auth libraries
```

### Level Selection Quick Guide

| LOC Estimate | Level | Templates to Copy            |
| ------------ | ----- | ---------------------------- |
| <100         | 1     | spec.md + plan.md + tasks.md |
| 100-499      | 2     | Level 1 + checklist.md       |
| ≥500         | 3     | Level 2 + decision-record.md |

---

## 12. 🔧 TROUBLESHOOTING

### Spec Folder Not Found

**Symptom**: Commands fail with "No spec folder found"

**Causes**:
1. Not on a feature branch (`feature-*` or `feat/*` pattern)
2. Spec folder name doesn't match branch pattern
3. Working in wrong directory

**Solutions**:
```bash
# Check current branch
git branch --show-current

# List existing spec folders
ls -d specs/[0-9]*/

# Verify folder matches branch pattern
# Branch: feature-042-user-auth → Folder: specs/042-user-auth/
```

### Template Placeholders Not Replaced

**Symptom**: Validation blocks with "Placeholders found in spec.md" error

**Causes**:
1. `[YOUR_VALUE_HERE]` or `[PLACEHOLDER]` text still in file
2. Template markers not adapted to actual content

**Solutions**:
```bash
# Find all placeholders in spec folder
grep -r "\[PLACEHOLDER\]" specs/042-feature/
grep -r "\[YOUR_VALUE_HERE\]" specs/042-feature/

# Common placeholders to replace:
# - [FEATURE_NAME] → Actual feature name
# - [PRIORITY] → P0/P1/P2
# - [STATUS] → Draft/In Progress/Complete
```

### Completeness Score Below Threshold

**Symptom**: `calculate-completeness.sh` returns score below 80%

**Causes**:
1. Missing required files (spec.md, plan.md)
2. Incomplete sections in templates
3. Missing cross-references between files

**Solutions**:
```bash
# Run completeness check with details
.opencode/skill/system-spec-kit/scripts/calculate-completeness.sh specs/042-feature/

# Address missing items in order of weight:
# 1. Required files (30%)
# 2. Placeholders (25%)
# 3. Content quality (20%)
# 4. Cross-references (15%)
# 5. Metadata (10%)
```

### Memory Loading Issues

**Symptom**: Previous context not loaded

**Solutions**:
```bash
# Verify memory folder exists
ls -la specs/###-folder/memory/

# Check file naming pattern
ls specs/###-folder/memory/*__*.md

# Manually load memory file
cat specs/###-folder/memory/DD-MM-YY_HH-MM__description.md
```

### Command Mode Confusion

**Symptom**: Unsure whether to use `:auto` or `:confirm` mode

**Decision Guide**:
| Situation                 | Recommended Mode |
| ------------------------- | ---------------- |
| First time using Spec Kit | `:confirm`       |
| Learning new workflow     | `:confirm`       |
| Routine feature work      | `:auto`          |
| Complex/risky changes     | `:confirm`       |
| Debugging workflow issues | `:confirm`       |

### Performance Issues

**Symptom**: Spec Kit scripts take >1 second to execute

**Solutions**:
1. Check file system performance (network drives can be slow)
2. Reduce spec folder count (archive old folders)
3. Ensure scripts have execute permission: `chmod +x .opencode/skill/system-spec-kit/scripts/*.sh`

**Expected Performance**:
| Script                      | Expected Time |
| --------------------------- | ------------- |
| `create-spec-folder.sh`     | <100ms        |
| `check-prerequisites.sh`    | <50ms         |
| `calculate-completeness.sh` | <200ms        |

### ANCHORS_VALID Failures

**Symptom**: "Unmatched ANCHOR_START" or "Unmatched ANCHOR_END" validation error

**Cause**: Memory file has incomplete anchor pairs - an `ANCHOR_START` without a matching `ANCHOR_END` or vice versa.

**Solutions**:
```bash
# Find unmatched anchors in memory files
grep -n "ANCHOR_START\|ANCHOR_END" specs/###-folder/memory/*.md

# Verify each ANCHOR_START has matching ANCHOR_END with same ID
# Example of correct format:
# <!-- ANCHOR_START: decisions -->
# Content here...
# <!-- ANCHOR_END: decisions -->
```

**Prevention**: Use `generate-context.js` script instead of manual memory file creation. Gate 5 enforces this.

```bash
# Correct way to create memory files
node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/###-folder/
```

### EVIDENCE_CITED Failures

**Symptom**: "Missing evidence citation" validation warning

**Cause**: Completed checklist items (marked `[x]`) lack `[SOURCE:]` markers to verify the claim.

**Note**: This rule only applies to **Level 3** spec folders.

**Solutions**:
```bash
# Find completed items missing evidence
grep -n "\[x\]" specs/###-folder/checklist.md | grep -v "\[SOURCE:"

# Add evidence citation after factual claims:
# Before: - [x] P0: Authentication flow tested
# After:  - [x] P0: Authentication flow tested [SOURCE: tests/auth.test.js:45-89]
```

**Evidence Format**:
- File reference: `[SOURCE: path/to/file.md:lines]`
- URL reference: `[SOURCE: https://example.com/doc]`
- Verbal confirmation: `[SOURCE: Confirmed by @username on DATE]`

### PRIORITY_TAGS Failures

**Symptom**: "Missing priority tag" validation warning

**Cause**: Checklist items don't have P0/P1/P2 priority markers.

**Solutions**:
```bash
# Find checklist items without priority tags
grep -n "^\- \[" specs/###-folder/checklist.md | grep -v "P0:\|P1:\|P2:"

# Add priority tag to each item:
# Before: - [ ] Task description
# After:  - [ ] P0: Task description
```

**Priority Levels**:
| Tag  | Meaning  | Requirement                         |
| ---- | -------- | ----------------------------------- |
| `P0` | Blocker  | MUST pass - work incomplete without |
| `P1` | Required | MUST pass for production readiness  |
| `P2` | Optional | Can defer with documented reason    |

---

## 13. ❓ FAQ

### General Questions

**Q: Do I need a spec folder for every change?**

A: Yes, if the change modifies files (code, docs, config). For truly trivial changes, select option D (Skip) when prompted.

---

**Q: Which command should I start with?**

A: Use this decision tree:
1. **Know what to build?** → `/spec_kit:complete` or `/spec_kit:plan`
2. **Need to investigate first?** → `/spec_kit:research`
3. **Have existing spec + plan?** → `/spec_kit:implement`

---

**Q: Can I use Spec Kit without the slash commands?**

A: Yes. Templates and scripts work independently. You can:
- Copy templates manually: `cp templates/spec.md specs/042-feature/spec.md`
- Run scripts directly: `./scripts/create-spec-folder.sh "feature name"`
- Commands just orchestrate these components

---

**Q: What happens if I run `/spec_kit:implement` without spec.md?**

A: The command will fail at the prerequisites check step. It requires both `spec.md` and `plan.md` to exist in the spec folder before proceeding.

---

**Q: Can I reuse a spec folder for related work?**

A: Yes. When the workflow detects existing content, it offers sub-folder versioning:
- Existing content archives to `001-original-work/`
- New work goes in `002-your-description/`
- Each sub-folder has independent `memory/` context

---

**Q: What are the 10 templates?**

A:
1. `spec.md` - Feature specification (Level 1+)
2. `plan.md` - Implementation plan (Level 1+)
3. `tasks.md` - Task breakdown (Level 1+)
4. `checklist.md` - QA validation (Level 2+)
5. `decision-record.md` - Architecture decisions (Level 3)
6. `research.md` - Comprehensive research (Level 3 optional)
7. `handover.md` - Full session continuity (utility, ~100-150 lines)
8. `debug-delegation.md` - Sub-agent debugging (utility)
9. `implementation-summary.md` - Implementation completion summary (utility)
10. `context_template.md` - Memory context template (utility)

---

**Q: What are P0, P1, P2 priority levels in checklists?**

A:
- **P0 (Blocker)**: MUST pass - work is incomplete without this
- **P1 (Required)**: MUST pass for production readiness
- **P2 (Optional)**: Can defer with documented reason

---

**Q: How is context saved?**

A: Context is saved manually using `/memory:save` command or trigger phrases like "save context". OpenCode does not support automatic interval-based saves.

---

**Q: Where are templates located?**

A: Single source of truth: `.opencode/skill/system-spec-kit/templates/`

---

**Q: Why should I use this fork instead of the original Spec Kit?**

A: The original Spec Kit is a concept. This fork is a complete system:

| What You Get       | Original | This Fork                           |
| ------------------ | -------- | ----------------------------------- |
| Templates          | Basic    | 10 production-ready                 |
| Automation         | None     | 11 scripts                          |
| Commands           | None     | 12 with mode variants               |
| Memory Integration | None     | Semantic search across sessions     |
| Debug Help         | None     | AI-detected frustration → sub-agent |
| Gate Enforcement   | None     | Mandatory gates prevent mistakes    |
| Quality Metrics    | None     | Completeness scoring                |

**TL;DR**: The original tells you *what* to document. This fork *does the documenting for you*.

---

## The Philosophy

This fork exists because documentation shouldn't be a tax on productivity—it should be invisible infrastructure that pays dividends when you need it most: resuming work after a break, onboarding a new team member, or debugging something you wrote 6 months ago.

**Built for AI-assisted workflows.** Every design decision assumes you're working with an LLM that forgets everything between sessions. The templates, scripts, and commands are optimized for context recovery, not just documentation compliance.

**Automation over discipline.** Humans forget to document. Scripts don't. Every manual step that could be automated has been automated.

**Stateless by design.** V13.0 eliminated all marker files (.spec-skip, .spec-active, STATE.md) because they created more problems than they solved. Project state lives in memory files where it belongs—searchable, versionable, and actually useful.

**Cognitive by V17.1.** Memory now behaves more like human memory: recently accessed context stays hot, stale context fades, and related memories surface together through co-activation.
