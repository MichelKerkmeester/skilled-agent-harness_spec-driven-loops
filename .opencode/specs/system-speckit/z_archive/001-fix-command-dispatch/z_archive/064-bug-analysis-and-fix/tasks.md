---
title: "Tasks: SpecKit Bug [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks]"
description: "Comprehensive task breakdown for fixing ~231 identified issues across the SpecKit system, organized by priority and phase."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "bug"
  - "analysis"
  - "and"
  - "064"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Bug Analysis and Fix - Implementation Breakdown

Comprehensive task breakdown for fixing ~231 identified issues across the SpecKit system, organized by priority and phase.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

---

<!-- ANCHOR:notation -->
## QUICK REFERENCE FOR AI AGENTS

### Critical Path (Must Complete First)

| Task     | Priority | One-Line Summary                               | Key File                           |
| -------- | -------- | ---------------------------------------------- | ---------------------------------- |
| **T101** | P0       | Add `await` to 3 `formatSearchResults()` calls | `context-server.js:1085,1140,1161` |
| **T001** | P0       | Delete unused `config-loader.js`               | `mcp_server/lib/config-loader.js`  |
| **T003** | P0       | Change "2+" to "3+" in debug.md line 232       | `command/spec_kit/debug.md:232`    |
| **T004** | P0       | Create `memory_save.md` command file           | `command/spec_kit/memory_save.md`  |
| **T103** | P0       | Add E429 to ErrorCodes enum                    | `mcp_server/lib/errors.js`         |

### Most Common Verification Commands

```bash
# Check for broken references
grep -r "AGENTS.md" .opencode/skills/system-spec-kit/ --include="*.md" | wc -l  # Should be 0

# Verify await fix
grep -c "return await formatSearchResults" .opencode/skills/system-spec-kit/mcp_server/context-server.js  # Should be 3

# Verify threshold consistency
grep -rn "failed.*attempt" .opencode/ --include="*.md" | grep -v "3" | wc -l  # Should be 0

# Check syntax after edits
node --check .opencode/skills/system-spec-kit/mcp_server/context-server.js  # No errors
```

### Scratch Directory Usage

```bash
# Place ALL temporary files here:
mkdir -p .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/scratch

# Examples of what goes in scratch/:
scratch/config-loader.js.bak     # Backups before deletion
scratch/test-output.log          # Test run outputs
scratch/debug-notes.md           # Investigation notes
```

---

<!-- /ANCHOR:notation -->
## Task Notation

| Prefix | Meaning                                      |
| ------ | -------------------------------------------- |
| `[ ]`  | Pending task                                 |
| `[x]`  | Completed task                               |
| `[P]`  | Can be done in parallel with other [P] tasks |
| `[B]`  | Blocked - waiting on dependency              |

<!-- /ANCHOR:notation -->
---

## AI EXECUTION PROTOCOL

### ⚠️ MANDATORY: Read Before Starting ANY Task

**This section defines HOW an AI agent must execute tasks in this document.**

#### Pre-Task Checklist (Before Each Task)

```
□ 1. READ the full task description including all sub-bullets
□ 2. VERIFY the affected files exist at the specified paths
□ 3. READ the relevant source code sections BEFORE making changes
□ 4. UNDERSTAND the acceptance criteria completely
□ 5. PLAN the specific code changes needed
□ 6. EXECUTE changes one file at a time
□ 7. VERIFY changes match acceptance criteria
□ 8. RUN verification command if provided
□ 9. UPDATE task status to [x] with evidence
```

#### Task Execution Rules

| Rule                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **ONE TASK AT A TIME**     | Complete task fully before moving to next                    |
| **VERIFY BEFORE CLAIMING** | Run verification command, confirm output                     |
| **EVIDENCE REQUIRED**      | Mark `[x]` only with evidence (command output, grep result)  |
| **NO ASSUMPTIONS**         | If file doesn't exist or differs from spec, STOP and clarify |
| **PRESERVE CONTEXT**       | Never modify files outside task scope                        |

#### Status Reporting Format

When completing a task, update it as follows:

```markdown
- [x] T001: Task description
  - **Completed**: YYYY-MM-DD
  - **Evidence**: [paste verification output]
  - **Files Modified**: [list files changed]
```

#### Blocked Task Protocol

If a task cannot be completed:

```markdown
- [B] T001: Task description
  - **Blocked**: YYYY-MM-DD
  - **Reason**: [specific blocker]
  - **Unblock Action**: [what needs to happen]
```

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: spec-kit, bug-fix, memory-system, mcp-server
- **Priority**: P0-critical - HARD BLOCKER (Critical and High priority issues affect system reliability)

### Input
- Bug analysis findings from 20 parallel agent research (re-analysis included)
- Design documents from `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix`

### Prerequisites
- **Required**: `spec.md`, `plan.md`, `research/research.md`
- **Optional**: None

### Organization
Tasks are grouped by priority phase to enable systematic bug elimination while maintaining system stability. The full issue inventory in `research/research.md` is the source of truth and must be fully cleared.

### Tests
Testing is integrated into each task where verification is possible.

---

## 2. CONVENTIONS

### Task Format

**Enhanced Format** (with requirement linking):
```markdown
- [ ] T###: Task description
  - **Priority:** P0/P1/P2
  - **Affected Files:** File paths
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

### Path Conventions
- **MCP Server**: `.opencode/skills/system-spec-kit/mcp_server/`
- **Shared**: `.opencode/skills/system-spec-kit/shared/`
- **Scripts**: `.opencode/skills/system-spec-kit/scripts/`
- **Templates**: `.opencode/skills/system-spec-kit/templates/`
- **Commands**: `.opencode/commands/spec_kit/`
- **Documentation**: `.opencode/skills/system-spec-kit/references/`

---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory  | Purpose                             | Persistence             |
| ---------- | ----------------------------------- | ----------------------- |
| `scratch/` | Debug logs, test data, draft code   | Temporary (git-ignored) |
| `memory/`  | Context to preserve across sessions | Permanent (git-tracked) |
| Root       | Final documentation only            | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

---

## 3. TASK GROUPS BY PHASE

### Phase 1: Critical Fixes (P0 - HARD BLOCKERS)

**Purpose**: Fix critical bugs that break core functionality or cause data integrity issues (9 total)

**Estimated Complexity**: High (4 major system issues)

---

#### T001: Resolve Config System per ADR-001
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/config-loader.js`
  - `.opencode/skills/system-spec-kit/mcp_server/configs/search-weights.json`
  - All modules using hardcoded constants
- **Description:** 8 of 10 config sections in `search-weights.json` are never loaded. `config-loader.js` exists but is never imported. ADR-001 chooses removal of unused config infrastructure.

**STEP-BY-STEP EXECUTION:**

1. **Verify config-loader is unused:**
   ```bash
   grep -r "config-loader" .opencode/skills/system-spec-kit/mcp_server/ --include="*.js" | grep -v "config-loader.js:"
   ```
   Expected: No output (no imports found)

2. **Identify used config sections:**
   ```bash
   grep -r "maxTriggersPerMemory\|smartRanking" .opencode/skills/system-spec-kit/ --include="*.js"
   ```