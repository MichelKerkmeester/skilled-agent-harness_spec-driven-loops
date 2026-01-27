# MemSpec

**A Cognitive Spec Kit Framework**

> Documentation-first development framework with integrated cognitive memory system, 17+ MCP tools, and mandatory gates for AI-assisted workflows.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 DIRECTORY STRUCTURE](#3--directory-structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 📊 DOCUMENTATION LEVELS](#5--documentation-levels)
- [6. 📝 TEMPLATES](#6--templates)
- [7. 🎯 COMMANDS](#7--commands)
- [8. 🧠 MEMORY SYSTEM](#8--memory-system)
- [9. 💡 USAGE EXAMPLES](#9--usage-examples)
- [10. 🛠️ TROUBLESHOOTING](#10--troubleshooting)
- [11. ❓ FAQ](#11--faq)
- [12. 🔗 RELATED RESOURCES](#12--related-resources)

---

## 1. 📖 OVERVIEW

### What is MemSpec?

**MemSpec** is a documentation-first development framework that enforces structured workflows for AI-assisted development. It combines mandatory spec folders, integrated memory preservation, and quality gates to ensure context is never lost between sessions.

### Why This Fork Exists

| Pain Point               | Original Spec Kit | MemSpec                                          |
| ------------------------ | ----------------- | ------------------------------------------------ |
| **Context Loss**         | Manual recovery   | Auto-saved with ANCHOR format                    |
| **Templates**            | ~5 basic files    | 10 purpose-built templates                       |
| **Commands**             | Manual workflow   | 11 slash commands with `:auto`/`:confirm` modes  |
| **Memory Integration**   | None              | Deep integration via MCP (17+ tools)             |
| **Quality Gates**        | None              | PREFLIGHT/POSTFLIGHT validation                  |
| **Debug Assistance**     | None              | AI detects frustration → auto-suggests sub-agent |
| **Session Handover**     | None              | `:quick` (15 lines) or `:full` (150 lines)       |
| **Quality Metrics**      | Guesswork         | Completeness scoring (0-100%)                    |
| **Uncertainty Tracking** | None              | Epistemic vectors for decision confidence        |
| **Five Checks**          | None              | Structured solution validation framework         |

### Key Statistics

| Category             | Count | Details                                                  |
| -------------------- | ----- | -------------------------------------------------------- |
| **MCP Tools**        | 17+   | Memory, checkpoint, validation, health tools             |
| **Templates**        | 10    | Markdown templates for specs, plans, research, decisions |
| **Scripts**          | 11    | Shell scripts for automation and validation              |
| **Commands**         | 11    | Slash commands (7 spec_kit + 4 memory)                   |
| **References**       | 19    | Detailed workflow documentation in 7 categories          |
| **Importance Tiers** | 6     | Constitutional → deprecated memory ranking               |

### Key Features

| Feature                    | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| **Six-Tier Importance**    | Constitutional, critical, important, normal, temporary, deprecated memory tiers |
| **PREFLIGHT/POSTFLIGHT**   | Automatic validation before and after operations                                |
| **Five Checks Framework**  | Necessary? Beyond local maxima? Sufficient? Fits goal? Open horizons?           |
| **Uncertainty Tracking**   | Epistemic vectors measure confidence in decisions                               |
| **Learning Delta**         | Track knowledge gained during implementation                                    |
| **ANCHOR-Based Retrieval** | 58-90% token savings via section-level memory retrieval                         |
| **Cognitive Memory**       | Attention decay, tiered content (HOT/WARM/COLD), co-activation                  |
| **Debug Delegation**       | AI detects frustration and auto-suggests debug sub-agent                        |

### Command Systems

MemSpec provides **two integrated command families** that work together:

#### Spec Kit Commands (`/spec_kit:*`)
Workflow orchestration for documentation-first development:

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full end-to-end workflow (research → plan → implement → verify) |
| `/spec_kit:plan` | Planning only - spec through plan, no implementation |
| `/spec_kit:implement` | Execute pre-planned work from existing plan.md |
| `/spec_kit:research` | Technical investigation and evidence gathering |
| `/spec_kit:resume` | Resume work on existing spec folder |
| `/spec_kit:handover` | Create session continuation document |
| `/spec_kit:debug` | Delegate debugging to fresh-perspective sub-agent |

#### Memory Commands (`/memory:*`)
Context preservation and retrieval:

| Command | Purpose |
|---------|---------|
| `/memory:save` | Save current context to spec folder's memory/ |
| `/memory:search` | Semantic search across all saved memories |
| `/memory:checkpoint` | Create/restore named state snapshots |
| `/memory:database` | Index management, cleanup, health checks |

#### How They Integrate

```
┌─────────────────────────────────────────────────────────────┐
│                    SPEC KIT WORKFLOW                        │
│  /spec_kit:complete → creates spec folder → implements      │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MEMORY SYSTEM (automatic)               │   │
│  │  • Auto-surfaces relevant context at task start      │   │
│  │  • Saves decisions/blockers during work              │   │
│  │  • Preserves session state for /spec_kit:resume      │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  /spec_kit:handover → /memory:save → next session          │
└─────────────────────────────────────────────────────────────┘
```

**Key Integration Points:**
- **Gate 2** automatically calls `memory_match_triggers()` to surface relevant context
- **Spec folders** contain `memory/` subdirectory for persistent context
- **/spec_kit:resume** loads memory context to continue previous work
- **/spec_kit:handover** saves context before ending session

### Requirements

| Requirement | Minimum  | Recommended |
| ----------- | -------- | ----------- |
| Node.js     | 18+      | 20+         |
| OpenCode    | 1.0.190+ | Latest      |
| Bash        | 4.0+     | 5.0+        |

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files (JS, TS, Python, CSS, HTML)
- Documentation files (Markdown, README, guides)
- Configuration files (JSON, YAML, TOML, env templates)
- Template files, build/tooling files

**Exceptions (No Spec Required):**
- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# 1. Find the next spec folder number
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1

# 2. Create your spec folder (replace ### with next number)
.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication" --level 2

# 3. Verify creation
ls specs/###-user-authentication/
# Expected: spec.md  plan.md  tasks.md  checklist.md  memory/  scratch/
```

### Verify Installation

```bash
# Validate spec folder structure
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature/

# Expected output:
# ✓ FILE_EXISTS: All required files present
# ✓ PLACEHOLDER_FILLED: No unfilled placeholders
# RESULT: PASSED
```

### First Use

```bash
# Full workflow command
/spec_kit:complete add user authentication :auto

# Or planning only
/spec_kit:plan refactor database layer :confirm
```

### Level Selection Quick Guide

| LOC Estimate | Level | What You Get                                             |
| ------------ | ----- | -------------------------------------------------------- |
| <100         | 1     | spec.md + plan.md + tasks.md + implementation-summary.md |
| 100-499      | 2     | Level 1 + checklist.md                                   |
| ≥500         | 3     | Level 2 + decision-record.md                             |
| Complex      | 3+    | Level 3 + extended governance                            |

---

## 3. 📁 DIRECTORY STRUCTURE

### Core Skill Structure

```
.opencode/skill/system-spec-kit/
├── SKILL.md                   # Complete workflow documentation
├── README.md                  # This file
├── templates/                 # Template system (CORE + ADDENDUM v2.0)
│   ├── core/                  # Foundation templates (4 files)
│   ├── addendum/              # Level-specific additions
│   │   ├── level2-verify/     # +Verification (checklist)
│   │   ├── level3-arch/       # +Architecture (decision-record)
│   │   └── level3plus-govern/ # +Governance
│   ├── level_1/               # Composed Level 1 (~270 LOC)
│   ├── level_2/               # Composed Level 2 (~390 LOC)
│   ├── level_3/               # Composed Level 3 (~540 LOC)
│   ├── level_3+/              # Composed Level 3+ (~640 LOC)
│   └── *.md                   # Utility templates (handover, debug, etc.)
├── scripts/                   # Automation scripts
│   ├── spec/                  # Spec folder management
│   │   ├── create.sh          # Create feature branch & spec folder
│   │   ├── validate.sh        # Validation orchestrator (v2.0)
│   │   ├── archive.sh         # Archive completed specs
│   │   └── calculate-completeness.sh
│   ├── memory/                # Memory system scripts
│   │   └── generate-context.js    # Memory file generation (44 modules)
│   ├── rules/                 # Individual validation rules (9 rules)
│   ├── lib/                   # Shared libraries
│   └── tests/                 # Test suite (36 fixtures)
├── mcp_server/                # Spec Kit Memory MCP
│   ├── context-server.js      # MCP server with 17+ tools
│   ├── lib/                   # Server libraries (27 modules)
│   └── database/              # SQLite + vector search
├── references/                # Documentation (19 files, 7 categories)
│   ├── memory/                # Memory system docs
│   ├── templates/             # Template guides
│   ├── validation/            # Validation rules + Five Checks
│   ├── structure/             # Folder organization
│   ├── workflows/             # Usage workflows
│   ├── debugging/             # Troubleshooting guides
│   └── config/                # Configuration docs
├── assets/                    # Decision matrices
├── constitutional/            # Always-surface rules
└── shared/                    # Shared JS modules
```

### Spec Folder Structure (Example)

```
specs/042-user-authentication/
├── spec.md                    # Feature specification
├── plan.md                    # Implementation plan
├── tasks.md                   # Task breakdown
├── checklist.md               # QA validation (Level 2+)
├── decision-record-*.md       # ADRs (Level 3)
├── implementation-summary.md  # Post-implementation summary
├── memory/                    # Context preservation
│   └── DD-MM-YY_HH-MM__topic.md
└── scratch/                   # Temporary files (git-ignored)
```

### Key Files

| File                                 | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `SKILL.md`                           | Complete AI workflow instructions |
| `templates/level_N/`                 | Pre-composed templates by level   |
| `scripts/spec/validate.sh`           | Validation orchestrator           |
| `scripts/memory/generate-context.js` | Memory file generation            |
| `mcp_server/context-server.js`       | Memory MCP server                 |

---

## 4. ⚡ FEATURES

### Six-Tier Importance System

Memory files are ranked by importance tier for smarter retrieval:

| Tier               | Boost | Decay    | Use Case                                         |
| ------------------ | ----- | -------- | ------------------------------------------------ |
| **constitutional** | 3.0x  | Never    | Project rules, always-surface (~2000 tokens max) |
| **critical**       | 2.0x  | Never    | Architecture decisions, breaking changes         |
| **important**      | 1.5x  | Never    | Key implementations, major features              |
| **normal**         | 1.0x  | 90-day   | Standard development context (default)           |
| **temporary**      | 0.5x  | 7-day    | Debug sessions, experiments                      |
| **deprecated**     | 0.0x  | Excluded | Outdated information (preserved but hidden)      |

### PREFLIGHT/POSTFLIGHT Validation

Automatic quality gates at operation boundaries:

```
PREFLIGHT (before execution):
├── Spec folder exists?
├── Required files present?
├── Placeholders filled?
└── Dependencies resolved?

POSTFLIGHT (after execution):
├── All P0/P1 items verified?
├── Tests passing?
├── No validation errors?
└── Context saved?
```

### Five Checks Framework

For substantial changes (>100 LOC or architectural decisions):

| #   | Check                    | Question                    |
| --- | ------------------------ | --------------------------- |
| 1   | **Necessary?**           | Solving ACTUAL need NOW?    |
| 2   | **Beyond Local Maxima?** | Explored 2+ alternatives?   |
| 3   | **Sufficient?**          | Simplest approach possible? |
| 4   | **Fits Goal?**           | On critical path?           |
| 5   | **Open Horizons?**       | Long-term aligned?          |

### Uncertainty Tracking

Epistemic vectors measure confidence in decisions:

| Factor                   | Weight | Question                      |
| ------------------------ | ------ | ----------------------------- |
| Epistemic gaps           | 0.30   | What don't I know?            |
| Model boundaries         | 0.25   | At capability limits?         |
| Temporal variability     | 0.20   | How stable is this knowledge? |
| Situational completeness | 0.25   | Context sufficient?           |

**Thresholds:** <=0.35 (LOW) proceed | 0.36-0.60 (MEDIUM) verify | >0.60 (HIGH) clarify

### Learning Delta

Track knowledge gained during implementation:

```markdown
## Learning Delta
- **Discovered**: [Unexpected finding]
- **Invalidated**: [Previous assumption proven wrong]
- **Confirmed**: [Hypothesis validated]
- **New Questions**: [Follow-up research needed]
```

### Cognitive Memory

Advanced memory features for smarter context management:

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Attention Decay**  | Memory scores decay per turn (stale context fades) |
| **Tiered Content**   | HOT=full, WARM=summary, COLD=excluded              |
| **Co-Activation**    | Related memories surface together                  |
| **ANCHOR Retrieval** | 58-90% token savings via section targeting         |

---

## 5. 📊 DOCUMENTATION LEVELS

### Progressive Enhancement Model

```
Level 1 (Core):         Essential what/why/how (~270 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~390 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs (~540 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~640 LOC)
```

### Level Specifications

| Level  | LOC     | Required Files                                        | What It ADDS                 |
| ------ | ------- | ----------------------------------------------------- | ---------------------------- |
| **1**  | <100    | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how       |
| **2**  | 100-499 | Level 1 + checklist.md                                | Quality gates, verification  |
| **3**  | ≥500    | Level 2 + decision-record.md                          | Architecture decisions, ADRs |
| **3+** | Complex | Level 3 + extended content                            | Governance, AI protocols     |

### Level Selection Examples

| Task                 | LOC Est. | Level | Rationale                      |
| -------------------- | -------- | ----- | ------------------------------ |
| Fix CSS alignment    | 10       | 1     | Simple, low risk               |
| Add form validation  | 80       | 1-2   | Borderline, low complexity     |
| Modal component      | 200      | 2     | Multiple files, needs QA       |
| Auth system refactor | 600      | 3     | Architecture change, high risk |
| Database migration   | 150      | 3     | High risk overrides LOC        |

**Override Factors:** Complexity, risk, security implications, multiple systems affected.

**Decision rule:** When in doubt → choose higher level.

---

## 6. 📝 TEMPLATES

### Template Summary

| Template                    | Level | Lines | Description                             |
| --------------------------- | ----- | ----- | --------------------------------------- |
| `spec.md`                   | 1+    | ~150  | Feature specification with user stories |
| `plan.md`                   | 1+    | ~120  | Implementation plan with architecture   |
| `tasks.md`                  | 1+    | ~80   | Task breakdown by user story            |
| `implementation-summary.md` | 1+    | ~50   | Post-implementation summary             |
| `checklist.md`              | 2+    | ~100  | Validation/QA checklists (P0/P1/P2)     |
| `decision-record.md`        | 3     | ~90   | Architecture Decision Records           |
| `research.md`               | 3     | ~878  | Comprehensive multi-domain research     |
| `handover.md`               | Any   | ~100  | Full session continuity                 |
| `debug-delegation.md`       | Any   | ~64   | Sub-agent debugging delegation          |
| `context_template.md`       | Any   | ~80   | Memory context template                 |

### Template Styles

| Style    | Location             | Best For                         |
| -------- | -------------------- | -------------------------------- |
| **Core** | `templates/level_N/` | All users, pre-composed by level |

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

## 7. 🎯 COMMANDS

### Command Overview

| Command               | Steps | Purpose                           |
| --------------------- | ----- | --------------------------------- |
| `/spec_kit:complete`  | 12    | Full end-to-end workflow          |
| `/spec_kit:plan`      | 7     | Planning only (no implementation) |
| `/spec_kit:implement` | 8     | Execute pre-planned work          |
| `/spec_kit:research`  | 9     | Technical investigation           |
| `/spec_kit:resume`    | 4-5   | Resume previous session           |
| `/spec_kit:handover`  | 4-5   | Create session handover document  |
| `/spec_kit:debug`     | 4-5   | Delegate debugging to sub-agent   |

### Mode Suffixes

| Suffix     | Mode        | Behavior                        |
| ---------- | ----------- | ------------------------------- |
| `:auto`    | Autonomous  | Execute without approval gates  |
| `:confirm` | Interactive | Pause at each step for approval |

### Memory Commands

| Command                     | Purpose                              |
| --------------------------- | ------------------------------------ |
| `/memory:save [folder]`     | Save context via generate-context.js |
| `/memory:search <query>`    | Semantic search across sessions      |
| `/memory:checkpoint create` | Create named checkpoint              |

### Workflow Decision Guide

```
START: New Task
     │
     ▼
Do you understand requirements clearly?
├─ YES → Need to plan for later?
│        ├─ YES → /spec_kit:plan
│        └─ NO  → /spec_kit:complete
└─ NO  → /spec_kit:research
              │
              ▼
         Then: /spec_kit:plan or /spec_kit:complete
```

### Debug Delegation

**Auto-suggested when:**
- Same error occurs 3+ times after fix attempts
- Frustration keywords detected ("stuck", "can't fix", "tried everything")
- Extended debugging without resolution

**Usage:**
```bash
/spec_kit:debug [spec-folder-path]
```

---

## 8. 🧠 MEMORY SYSTEM

### MCP Tools (17+)

| Tool                      | Purpose                                |
| ------------------------- | -------------------------------------- |
| `memory_search()`         | Semantic search with vector similarity |
| `memory_match_triggers()` | Fast keyword matching (<50ms)          |
| `memory_save()`           | Index a memory file                    |
| `memory_list()`           | Browse stored memories                 |
| `memory_delete()`         | Delete memories by ID or folder        |
| `memory_update()`         | Update memory metadata and tier        |
| `memory_stats()`          | Get system statistics                  |
| `memory_validate()`       | Record validation feedback             |
| `memory_index_scan()`     | Bulk scan and index workspace          |
| `memory_health()`         | Check system health                    |
| `checkpoint_create()`     | Create named checkpoint                |
| `checkpoint_list()`       | List all checkpoints                   |
| `checkpoint_restore()`    | Restore from checkpoint                |
| `checkpoint_delete()`     | Delete a checkpoint                    |

> **Note:** Full tool names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search()`).

### ANCHOR-Based Retrieval

Memory files use ANCHOR markers for section-level retrieval:

```markdown
<!-- ANCHOR:decision-auth-flow -->
## Authentication Decision
We chose JWT with refresh tokens because...
<!-- ANCHOR_END:decision-auth-flow -->
```

**Usage:**
```javascript
// Get only specific sections (~90% token savings)
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context']
})
```

**Common Anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

### Hybrid Search

| Strategy    | Speed  | Best For                                 |
| ----------- | ------ | ---------------------------------------- |
| **Vector**  | ~100ms | Semantic queries ("How does auth work?") |
| **FTS5**    | <10ms  | Exact keywords ("JWT", "refresh token")  |
| **Trigger** | <50ms  | Proactive surfacing (phrase matching)    |

Results are merged using RRF (Reciprocal Rank Fusion).

### Embedding Providers

| Provider     | Dimensions | Best For                           |
| ------------ | ---------- | ---------------------------------- |
| **Voyage**   | 1024       | Recommended, best retrieval        |
| **OpenAI**   | 1536/3072  | Alternative cloud option           |
| **HF Local** | 768        | Privacy, offline, default fallback |

**Priority:** Voyage → OpenAI → HF Local (auto-detection)

---

## 9. 💡 USAGE EXAMPLES

### Creating a New Feature

```bash
# Generate feature branch and spec folder
.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication system"

# Result:
# - Branch: 042-user-authentication-system
# - Folder: specs/042-user-authentication-system/
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

### Saving Context

```bash
# Save context to spec folder
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/042-feature/

# Or via command
/memory:save specs/042-feature
```

### Searching Memory

```javascript
// Semantic search
memory_search({ query: "authentication decisions" })

// With spec folder filter
memory_search({ query: "session context", specFolder: "007-auth" })

// Anchor-targeted retrieval
memory_search({ query: "auth", anchors: ['decisions', 'state'] })
```

### Sub-Folder Versioning

When reusing spec folders with existing content:

```
specs/042-user-auth/
├── 001-initial-implementation/    # Original work (archived)
│   ├── spec.md
│   └── memory/
├── 002-password-reset/            # Second iteration
│   ├── spec.md
│   └── memory/
└── 003-oauth-integration/         # Active work
    ├── spec.md
    └── memory/
```

---

## 10. 🛠️ TROUBLESHOOTING

### Common Issues

#### Spec Folder Not Found

**Symptom**: Commands fail with "No spec folder found"

**Cause**: Not on a feature branch or folder name doesn't match

**Solution**:
```bash
# Check current branch
git branch --show-current

# List existing spec folders
ls -d specs/[0-9]*/

# Create spec folder if missing
./scripts/spec/create.sh "feature name" --level 2
```

#### Template Placeholders Not Replaced

**Symptom**: Validation blocks with "Placeholders found"

**Solution**:
```bash
# Find all placeholders
grep -r "\[YOUR_VALUE_HERE\]" specs/042-feature/
grep -r "\[PLACEHOLDER\]" specs/042-feature/

# Replace with actual content
```

#### Memory Loading Issues

**Symptom**: Previous context not loaded

**Solution**:
```bash
# Verify memory folder exists
ls -la specs/###-folder/memory/

# Check file naming pattern (DD-MM-YY_HH-MM__topic.md)
ls specs/###-folder/memory/*__*.md

# Force re-index
memory_index_scan({ specFolder: "###-folder" })
```

#### ANCHORS_VALID Failures

**Symptom**: "Unmatched ANCHOR_START" validation error

**Solution**:
```bash
# Find unmatched anchors
grep -n "ANCHOR_START\|ANCHOR_END" specs/###-folder/memory/*.md

# Ensure each ANCHOR_START has matching ANCHOR_END with same ID
```

### Quick Fixes

| Problem               | Quick Fix                                       |
| --------------------- | ----------------------------------------------- |
| Spec folder not found | `./scripts/spec/create.sh "name" --level 1`     |
| Validation failing    | `./scripts/spec/validate.sh <folder> --verbose` |
| Memory not indexing   | `memory_index_scan({ specFolder: "..." })`      |
| Old version           | Pull latest from repository                     |

### Diagnostic Commands

```bash
# Check spec folder structure
./scripts/setup/check-prerequisites.sh

# Calculate completeness
./scripts/spec/calculate-completeness.sh specs/###-feature/

# View memory stats
# Use: memory_stats() MCP tool
```

---

## 11. ❓ FAQ

### General Questions

**Q: Do I need a spec folder for every change?**

A: Yes, if modifying files. For trivial changes, select option D (Skip) when prompted.

---

**Q: Which command should I start with?**

A: Use this guide:
1. Know what to build? → `/spec_kit:complete` or `/spec_kit:plan`
2. Need to investigate first? → `/spec_kit:research`
3. Have existing spec + plan? → `/spec_kit:implement`

---

**Q: Can I use MemSpec without the slash commands?**

A: Yes. Copy templates manually and run scripts directly. Commands just orchestrate these components.

---

**Q: What are the 10 templates?**

A: spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md, research.md, handover.md, debug-delegation.md, context_template.md.

---

### Technical Questions

**Q: What are P0, P1, P2 priority levels?**

A: P0 = Blocker (must complete), P1 = Required (must complete or user-approved deferral), P2 = Optional (can defer).

---

**Q: How is context saved?**

A: Manually via `/memory:save` or "save context" trigger phrase. Runs `generate-context.js` script.

---

**Q: Where are templates located?**

A: Single source of truth: `.opencode/skill/system-spec-kit/templates/`

---

**Q: What's the difference between MCP tools and scripts?**

A: Scripts are CLI tools for automation. MCP tools are AI-callable functions for memory operations.

---

## 12. 🔗 RELATED RESOURCES

### Internal Documentation

| Document                                                                                 | Purpose                                             |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [SKILL.md](./SKILL.md)                                                                   | Complete workflow documentation and AI instructions |
| [mcp_server/README.md](./mcp_server/README.md)                                           | Memory MCP installation and configuration           |
| [references/memory/memory_system.md](./references/memory/memory_system.md)               | Memory system deep dive                             |
| [references/validation/validation_rules.md](./references/validation/validation_rules.md) | All validation rules and fixes                      |
| [references/validation/five-checks.md](./references/validation/five-checks.md)           | Five Checks evaluation framework                    |

### Key Locations

| Resource       | Location                                      |
| -------------- | --------------------------------------------- |
| **Templates**  | `.opencode/skill/system-spec-kit/templates/`  |
| **Scripts**    | `.opencode/skill/system-spec-kit/scripts/`    |
| **Memory MCP** | `.opencode/skill/system-spec-kit/mcp_server/` |
| **References** | `.opencode/skill/system-spec-kit/references/` |
| **Commands**   | `.opencode/command/spec_kit/`                 |

### External Dependencies

| Resource    | Purpose                             |
| ----------- | ----------------------------------- |
| `CLAUDE.md` | Project-level AI behavior framework |
| `AGENTS.md` | Gate definitions and enforcement    |
| `specs/`    | Directory for all spec folders      |

---

**MemSpec** - A Cognitive Spec Kit Framework
GitHub: [github.com/MichelKerkmeester/memspec-a-cognitive-spec-kit-framework](https://github.com/MichelKerkmeester/memspec-a-cognitive-spec-kit-framework)

*Documentation version: 2.0.0*
