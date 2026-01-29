# Spec Kit Framework

> Documentation-first development that actually works. Mandatory gates, integrated memory, and AI-assisted workflows that don't let context slip through the cracks.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📋 DOCUMENTATION LEVELS](#3--documentation-levels)
- [4. ⚡ COMMANDS](#4--commands)
- [5. 🧠 MEMORY SYSTEM](#5--memory-system)
- [6. 📄 TEMPLATES](#6--templates)
- [7. 🔧 SCRIPTS](#7--scripts)
- [8. 🛠️ TROUBLESHOOTING](#8--troubleshooting)
- [9. 📚 RELATED RESOURCES](#9--related-resources)

---

## 1. 📖 OVERVIEW

### Why This System?

AI coding assistants forget everything between sessions. You explain your auth system Monday; by Wednesday, it's a blank slate. The spec folder you created last week? Lost in the conversation history.

This framework fixes that with enforced documentation, integrated memory, and quality gates that make AI-assisted development sustainable.

**Without This**

- **Context**: Re-explain everything every session
- **Documentation**: "I'll document later" (never happens)
- **Quality**: Trust the AI did it right
- **Handoffs**: 2-hour "what did you do" meetings
- **Debugging**: Same error, 10th attempt, no progress

**With Spec Kit**

- **Context**: Memory persists across sessions, models, projects
- **Documentation**: Gate 3 enforces spec folders on every file change
- **Quality**: PREFLIGHT/POSTFLIGHT validation at operation boundaries
- **Handoffs**: `/spec_kit:handover` produces a 15-line summary
- **Debugging**: AI detects frustration, auto-suggests sub-agent

### What Makes This Different

| Capability           | Basic Approach     | This Framework                                    |
| -------------------- | ------------------ | ------------------------------------------------- |
| **Templates**        | Start from scratch | 10 purpose-built templates (CORE + ADDENDUM v2.0) |
| **Commands**         | Manual workflow    | 7 slash commands with `:auto`/`:confirm` modes    |
| **Memory**           | None               | Deep integration via MCP (17+ tools)              |
| **Quality Gates**    | None               | PREFLIGHT/POSTFLIGHT + Five Checks Framework      |
| **Debug Assistance** | None               | Auto-suggests sub-agent after 3+ failed attempts  |
| **Uncertainty**      | Guesswork          | Epistemic vectors for decision confidence         |

### Key Statistics

| Category             | Count                                        |
| -------------------- | -------------------------------------------- |
| **MCP Tools**        | 17+ (memory, checkpoint, validation, health) |
| **Templates**        | 10 (specs, plans, research, decisions)       |
| **Scripts**          | 77 (48 JS + 29 shell)                        |
| **Commands**         | 11 (7 spec_kit + 4 memory)                   |
| **Importance Tiers** | 6 (constitutional → deprecated)              |
| **Test Coverage**    | 1,292 tests across 17 test files             |

### Requirements

| Requirement | Minimum  |
| ----------- | -------- |
| Node.js     | 18+      |
| OpenCode    | 1.0.190+ |
| Bash        | 4.0+     |

---

## 2. 🚀 QUICK START

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

### Or Use Commands

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
| ≥500         | 3     | Level 2 + decision-record.md                             |
| Complex      | 3+    | Level 3 + extended governance                            |

**Decision rule:** When in doubt, choose the higher level.

---

## 3. 📋 DOCUMENTATION LEVELS

### Progressive Enhancement

```
Level 1 (Core):         Essential what/why/how (~270 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~390 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs (~540 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~640 LOC)
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
├── spec.md                    # Feature specification
├── plan.md                    # Implementation plan
├── tasks.md                   # Task breakdown
├── checklist.md               # QA validation (Level 2+)
├── decision-record.md         # ADRs (Level 3+)
├── implementation-summary.md  # Post-implementation summary
├── memory/                    # Context preservation
│   └── DD-MM-YY_HH-MM__topic.md
└── scratch/                   # Temporary files (git-ignored)
```

---

## 4. ⚡ COMMANDS

### Spec Kit Commands

| Command               | Steps | Purpose                           |
| --------------------- | ----- | --------------------------------- |
| `/spec_kit:complete`  | 12    | Full end-to-end workflow          |
| `/spec_kit:plan`      | 7     | Planning only (no implementation) |
| `/spec_kit:implement` | 8     | Execute pre-planned work          |
| `/spec_kit:research`  | 9     | Technical investigation           |
| `/spec_kit:resume`    | 4-5   | Resume previous session           |
| `/spec_kit:handover`  | 4-5   | Create session handover document  |
| `/spec_kit:debug`     | 4-5   | Delegate debugging to sub-agent   |

### Memory Commands

| Command                     | Purpose                              |
| --------------------------- | ------------------------------------ |
| `/memory:save [folder]`     | Save context via generate-context.js |
| `/memory:search <query>`    | Semantic search across sessions      |
| `/memory:checkpoint create` | Create named checkpoint              |
| `/memory:database`          | Database management operations       |

### Mode Suffixes

| Suffix     | Behavior                        |
| ---------- | ------------------------------- |
| `:auto`    | Execute without approval gates  |
| `:confirm` | Pause at each step for approval |

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

The `/spec_kit:debug` command prompts for model selection, then dispatches to that model via Task tool for a fresh perspective with full context handoff.

---

## 5. 🧠 MEMORY SYSTEM

### Why Memory Matters

**Basic Chat Logs**

- Search: Ctrl+F (text only)
- Prioritization: None
- Privacy: Often cloud-stored
- Token Efficiency: Load everything
- Recovery: Hope you backed up

**This Memory System**

- Search: Hybrid semantic + keyword (RRF fusion)
- Prioritization: 6-tier importance (constitutional to deprecated)
- Privacy: Local options available (HF Local runs on YOUR machine)
- Token Efficiency: ANCHOR format (93% savings)
- Recovery: Checkpoints (undo button for your index)

### The Six Importance Tiers

| Tier               | Boost | Decay    | Use Case                                         |
| ------------------ | ----- | -------- | ------------------------------------------------ |
| **constitutional** | 3.0x  | Never    | Project rules, always-surface (~2000 tokens max) |
| **critical**       | 2.0x  | Never    | Architecture decisions, breaking changes         |
| **important**      | 1.5x  | Never    | Key implementations, major features              |
| **normal**         | 1.0x  | 90-day   | Standard development context (default)           |
| **temporary**      | 0.5x  | 7-day    | Debug sessions, experiments                      |
| **deprecated**     | 0.0x  | Excluded | Outdated information (preserved but hidden)      |

### MCP Tools (17+)

**Search & Retrieval**
| Tool                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| `memory_search`         | Semantic search with vector similarity |
| `memory_match_triggers` | Fast keyword matching (<50ms)          |
| `memory_list`           | Browse stored memories                 |
| `memory_stats`          | Get system statistics                  |

**CRUD Operations**
| Tool                | Purpose                         |
| ------------------- | ------------------------------- |
| `memory_save`       | Index a memory file             |
| `memory_index_scan` | Bulk scan and index workspace   |
| `memory_update`     | Update memory metadata and tier |
| `memory_delete`     | Delete memories by ID or folder |
| `memory_validate`   | Record validation feedback      |

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

> **Note:** Full tool names use `spec_kit_memory_` prefix (e.g., `spec_kit_memory_memory_search`).

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

**Usage:**
```javascript
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context']
})
```

**Common Anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

### Cognitive Memory (FSRS + 5-State Model)

Advanced features for smarter context management:

| Feature                     | Description                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| **FSRS Power-Law Decay**    | R(t,S) = (1 + 0.235 × t/S)^(-0.5) - validated on 100M+ users                             |
| **5-State Model**           | HOT (R≥0.8) / WARM (0.25-0.8) / COLD (0.05-0.25) / DORMANT (0.02-0.05) / ARCHIVED (<0.02) |
| **Prediction Error Gating** | Prevents duplicates (≥0.95), handles contradictions (0.90-0.94)                          |
| **Testing Effect**          | Accessing memories strengthens stability                                                 |
| **Co-Activation**           | Related memories surface together                                                        |

### Embedding Providers

| Provider     | Dimensions | Best For                           |
| ------------ | ---------- | ---------------------------------- |
| **Voyage**   | 1024       | Recommended, best retrieval        |
| **OpenAI**   | 1536/3072  | Alternative cloud option           |
| **HF Local** | 768        | Privacy, offline, default fallback |

**Auto-detection priority:** Voyage → OpenAI → HF Local

---

## 6. 📄 TEMPLATES

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

### Template Composition (CORE + ADDENDUM v2.0)

```
Level 1:  [CORE templates only]        → 4 files, ~270 LOC
Level 2:  [CORE] + [L2-VERIFY]         → 5 files, ~390 LOC
Level 3:  [CORE] + [L2] + [L3-ARCH]    → 6 files, ~540 LOC
Level 3+: [CORE] + [all addendums]     → 6 files, ~640 LOC
```

**Why this matters:** Update CORE once → all levels inherit changes. No content duplication.

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

## 7. 🔧 SCRIPTS

### Script Overview

| Script                           | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `spec/create.sh`                 | Create feature branch & spec folder |
| `spec/validate.sh`               | Validation orchestrator (13 rules)  |
| `spec/calculate-completeness.sh` | Calculate completeness %            |
| `spec/recommend-level.sh`        | Recommend documentation level       |
| `spec/archive.sh`                | Archive completed spec folders      |
| `memory/generate-context.js`     | Memory file generation              |
| `templates/compose.sh`           | Compose level templates             |

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
# Generate memory file for spec folder
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/042-feature/
```

**IMPORTANT:** Memory files MUST be created via this script, not manually.

---

## 8. 🛠️ TROUBLESHOOTING

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

| Problem               | Quick Fix                                        |
| --------------------- | ------------------------------------------------ |
| Spec folder not found | `./scripts/spec/create.sh "name" --level 1`      |
| Validation failing    | `./scripts/spec/validate.sh <folder> --verbose`  |
| Memory not indexing   | `memory_index_scan({ specFolder: "..." })`       |
| ANCHOR tag mismatch   | Check every `ANCHOR:` has matching `ANCHOR_END:` |

---

## 9. 📚 RELATED RESOURCES

### Internal Documentation

| Document                                                                                 | Purpose                                             |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [SKILL.md](./SKILL.md)                                                                   | Complete workflow documentation and AI instructions |
| [mcp_server/README.md](./mcp_server/README.md)                                           | Memory MCP installation and configuration           |
| [references/memory/memory_system.md](./references/memory/memory_system.md)               | Memory system deep dive                             |
| [references/validation/validation_rules.md](./references/validation/validation_rules.md) | All validation rules and fixes                      |
| [references/validation/five-checks.md](./references/validation/five-checks.md)           | Five Checks evaluation framework                    |

### Directory Structure

```
.opencode/skill/system-spec-kit/
├── SKILL.md                   # AI workflow instructions
├── README.md                  # This file
├── templates/                 # Template system (CORE + ADDENDUM v2.0)
│   ├── core/                  # Foundation templates (4 files)
│   ├── addendum/              # Level-specific additions
│   ├── level_1/ - level_3+/   # Composed templates by level
│   └── *.md                   # Utility templates
├── scripts/                   # Automation scripts
│   ├── spec/                  # Spec folder management
│   ├── memory/                # Memory system scripts
│   ├── rules/                 # Validation rules (13)
│   └── tests/                 # Test suite (634 tests)
├── mcp_server/                # Spec Kit Memory MCP
│   ├── context-server.js      # MCP server with 17+ tools
│   ├── lib/                   # Server libraries
│   │   └── cognitive/         # FSRS, PE gating, 5-state model
│   └── database/              # SQLite + vector search
├── references/                # Documentation (19 files)
├── assets/                    # Decision matrices
└── constitutional/            # Always-surface rules
```

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