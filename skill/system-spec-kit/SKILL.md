---
name: system-spec-kit
description: "Mandatory spec folder workflow orchestrating documentation level selection (1-3), template selection, and folder creation for all file modifications through documentation enforcement."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, Task]
version: 13.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation -->

# 🗂️ Conversation Documentation Workflow - Mandatory Spec Folder System & Template Enforcement

Orchestrates mandatory spec folder creation for all conversations involving file modifications. This skill ensures proper documentation level selection (1-3), template usage, and context preservation through AGENTS.md-enforced workflows.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**MANDATORY activation for ALL file modifications:**
- Code files (JS, TS, Python, CSS, HTML)
- Documentation files (Markdown, README, guides)
- Configuration files (JSON, YAML, TOML, env templates)
- Knowledge base files (project-specific knowledge)
- Template files (`.opencode/skill/system-spec-kit/templates/*.md`)
- Build/tooling files (package.json, requirements.txt, Dockerfile)

**User request patterns:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Keyword detection: modification keywords (add, implement, fix, update, etc.)

### When NOT to Use

- ❌ Pure exploration/reading (no file modifications)
- ❌ Single typo fixes (<5 characters in one file)
- ❌ Whitespace-only changes
- ❌ Auto-generated file updates (package-lock.json)
- ❌ User explicitly selects Option D (skip documentation) - creates technical debt

**Rule of thumb:** If you're modifying ANY file content → Activate this skill.

### Utility Template Triggers

Utility templates (`handover.md`, `debug-delegation.md`) are available at ANY documentation level. The AI should automatically suggest these when detecting trigger keywords.

**Handover Document (`handover.md`)** - Auto-suggest when detecting:
- **Session transfer**: "handover", "hand over", "for next AI", "for next session", "next agent"
- **Work continuation**: "continue later", "pick up later", "resume later", "resume tomorrow"
- **Context preservation**: "pass context", "transfer context", "document for continuation"
- **Session ending**: "stopping for now", "pausing work", "ending session", "save state"
- **Multi-session work**: "multi-session", "ongoing work", "long-running"

**Debug Delegation (`debug-delegation.md`)** - Auto-suggest when detecting:
- **Frustration indicators**: "stuck", "can't fix", "tried everything", "not working still", "same error", "still failing", "keeps happening", "hours on this"
- **Help requests**: "need help debugging", "fresh eyes", "second opinion", "another approach"
- **Repeated failures**: Same error appears 3+ times after fix attempts
- **Explicit delegation**: "delegate debug", "sub-agent debug", "parallel debug"

**Rule:** When ANY of these are detected, suggest running `/spec_kit:debug` command.

---

## 2. 🧭 SMART ROUTING

### SpecKit Commands

| Command               | Steps | Description                                               |
| --------------------- | ----- | --------------------------------------------------------- |
| `/spec_kit:complete`  | 12    | Full end-to-end workflow from spec through implementation |
| `/spec_kit:plan`      | 7     | Planning only - spec through plan, no implementation      |
| `/spec_kit:implement` | 8     | Execute pre-planned work (requires existing plan.md)      |
| `/spec_kit:research`  | 9     | Technical investigation and documentation                 |
| `/spec_kit:resume`    | 5/4   | Resume previous session (5 steps confirm, 4 steps auto)   |
| `/spec_kit:handover`  | 4/5   | Create session handover (:quick default, :full)           |
| `/spec_kit:debug`     | 5     | Delegate debugging to sub-agent (always asks model first) |

**Mode Suffixes:** Add `:auto` or `:confirm` to any command except resume.
- `:auto` - Autonomous execution with self-validation
- `:confirm` - Interactive with user approval checkpoints

### Activation Detection

```
TASK CONTEXT
    │
    ├─► Starting new feature / creating spec folder
    │   └─► PHASE 1: Planning
    │       └─► Command: /spec_kit:plan or /spec_kit:complete
    │       └─► Load: level_decision_matrix.md, template_mapping.md
    │       └─► Create: spec.md, plan.md, tasks.md (+ checklist.md for L2+)
    │
    ├─► Executing pre-planned work (plan.md exists)
    │   └─► PHASE 2: Implementation
    │       └─► Command: /spec_kit:implement or /spec_kit:complete
    │       └─► Load: level_specifications.md, template_guide.md
    │       └─► Verify: checklist.md (Level 2+)
    │
    ├─► Technical investigation needed
    │   └─► PHASE 3: Research
    │       └─► Command: /spec_kit:research
    │       └─► Load: template_guide.md
    │       └─► Create: research.md or research-spike.md
    │
    ├─► Resuming previous session
    │   └─► PHASE 4: Resume
    │       └─► Command: /spec_kit:resume
    │       └─► Load: Memory files from spec_folder/memory/
    │       └─► Check: plan.md status (Stateless - no .spec-active marker)
    │
    ├─► Verifying completed work
    │   └─► PHASE 5: Verification
    │       └─► Load: checklist.md, quick_reference.md
    │       └─► Action: Mark [x] items with evidence
    │       └─► ⚠️ P0/P1 items MUST pass before claiming done
    │
    └─► Quick reference needed
        └─► PHASE 6: Reference
            └─► Load: quick_reference.md
            └─► Contains: Commands, checklists, troubleshooting
```

### Resource Router

```python
def route_conversation_resources(task):
    """
    Progressive Enhancement Model:
    - Level 1 (Baseline):     spec.md + plan.md + tasks.md
    - Level 2 (Verification): Level 1 + checklist.md
    - Level 3 (Full):         Level 2 + decision-record.md + optional research.md/research-spike.md

    Utility Templates (any level):
    - handover.md        → Session continuity for multi-session work
    - debug-delegation.md → Sub-agent debugging task delegation

    LOC thresholds are SOFT GUIDANCE (not enforcement):
    - <100 LOC suggests Level 1
    - 100-499 LOC suggests Level 2
    - ≥500 LOC suggests Level 3

    Enforcement via AGENTS.md discipline - verification required before commits.
    """

    # ═══════════════════════════════════════════════════════════════════════════
    # TEMPLATES (12 files in .opencode/skill/system-spec-kit/templates/)
    # ═══════════════════════════════════════════════════════════════════════════

    # Level 1: Baseline (all tasks start here)
    # Required: spec.md + plan.md + tasks.md
    load("templates/spec.md")
    load("templates/plan.md")
    load("templates/tasks.md")

    # Level 2: Add verification (QA validation needed)
    # Required: Level 1 + checklist.md
    if task.needs_qa_validation or task.estimated_loc >= 100:
        load("templates/checklist.md")

    # Level 3: Full documentation (complex/architectural)
    # Required: Level 2 + decision-record.md
    # Optional: research.md, research-spike.md
    if task.is_complex or task.has_arch_impact or task.estimated_loc >= 500:
        load("templates/decision-record.md")
        if task.needs_research:
            load("templates/research.md")          # Comprehensive research
            load("templates/research-spike.md")    # Time-boxed PoC

    # ═══════════════════════════════════════════════════════════════════════════
    # UTILITY TEMPLATES: Available at ANY level, triggered by keywords
    # ═══════════════════════════════════════════════════════════════════════════

    # Handover detection - session transfer keywords
    handover_keywords = ["handover", "hand over", "for next AI", "next session", 
                         "next agent", "continue later", "pick up later", "resume later",
                         "pass context", "transfer context", "ending session", "save state",
                         "multi-session", "ongoing work"]
    if task.is_multi_session or any(kw in user_message.lower() for kw in handover_keywords):
        suggest("templates/handover.md")           # Session continuity

    # Debug delegation detection - expanded natural language triggers
    frustration_keywords = ["stuck", "can't fix", "tried everything", "not working still", 
                            "same error", "still failing", "keeps happening", "hours on this"]
    help_keywords = ["need help debugging", "fresh eyes", "second opinion", "another approach"]
    explicit_keywords = ["delegate debug", "sub-agent debug", "parallel debug"]
    debug_keywords = frustration_keywords + help_keywords + explicit_keywords
    if task.needs_debug_delegation or any(kw in user_message.lower() for kw in debug_keywords):
        suggest("/spec_kit:debug")                 # Sub-agent debugging command

    # ═══════════════════════════════════════════════════════════════════════════
    # ASSETS (3 files in ./assets/) - Decision support tools
    # ═══════════════════════════════════════════════════════════════════════════

    load("assets/level_decision_matrix.md")    # LOC thresholds, complexity factors
    load("assets/template_mapping.md")         # Template-to-level mapping, copy commands
    load("assets/parallel_dispatch_config.md") # Complexity scoring, agent dispatch config

    # ═══════════════════════════════════════════════════════════════════════════
    # REFERENCES (5 files in ./references/) - Detailed documentation
    # ═══════════════════════════════════════════════════════════════════════════

    load("references/level_specifications.md")   # Complete Level 1-3 specifications
    load("references/template_guide.md")         # Template selection & adaptation rules
    load("references/quick_reference.md")        # Commands, checklists, troubleshooting
    load("references/path_scoped_rules.md")      # Path-scoped rule documentation

    # ═══════════════════════════════════════════════════════════════════════════
    # SCRIPTS (6 files in ./scripts/) - Automation tools
    # ═══════════════════════════════════════════════════════════════════════════

    # 6 script files (5 standalone + 1 shared library):
    # - create-spec-folder.sh (standalone)
    # - check-prerequisites.sh (standalone)
    # - calculate-completeness.sh (standalone)
    # - recommend-level.sh (standalone)
    # - archive-spec.sh (standalone)
    # - common.sh (shared library, sourced by other scripts)

    # ═══════════════════════════════════════════════════════════════════════════
    # CHECKLISTS (4 files in ./checklists/) - Phase verification checklists
    # ═══════════════════════════════════════════════════════════════════════════

    # Phase-specific verification checklists (load during respective phases):
    # - planning-phase.md    → During /spec_kit:plan
    # - implementation-phase.md → During /spec_kit:implement
    # - research-phase.md    → During /spec_kit:research
    # - review-phase.md      → Before claiming done

    # ═══════════════════════════════════════════════════════════════════════════
    # CONDITIONAL RESOURCES (loaded when specific features needed)
    # ═══════════════════════════════════════════════════════════════════════════

    if task.uses_sub_folder_versioning:
        load("references/sub_folder_versioning.md")  # Full versioning workflow

    # Overrides: High risk OR arch impact OR >5 files → bump to higher level
    # Enforcement: AGENTS.md discipline - verification required before commits
    # Rule: When in doubt → choose higher level

# SUMMARY: 30 total resources
# - 12 templates in: .opencode/skill/system-spec-kit/templates/
# - 3 assets in:     ./assets/
# - 5 references in: ./references/
# - 6 scripts in:    ./scripts/
# - 4 checklists in: ./checklists/
```

---

## 3. ⚙️ HOW IT WORKS

### Spec Folder Choice Enforcement

**MANDATORY**: The AI must NEVER autonomously decide whether to use an existing spec folder, create a new one, or skip documentation. This is defined in **AGENTS.md Gates 0, 0.5, 3, 5, 6, 7** - see AGENTS.md Section 2 for complete gate definitions.

#### Enforcement (Manual)

The AI must follow this workflow manually and ask the user before proceeding with any file modifications.

When file modification triggers are detected (rename, create, update, fix, implement, etc.), the **AI MUST ask** the user to explicitly choose:

| Option                    | Description                              | Best For                            |
| ------------------------- | ---------------------------------------- | ----------------------------------- |
| **A) Use existing**       | Continue in related spec folder          | Iterative work, related changes     |
| **B) Create new**         | Create new spec folder (specs/###-name/) | New features, unrelated work        |
| **C) Update related**     | Update documentation in related folder   | Extending existing documentation    |
| **D) Skip documentation** | Proceed without spec folder              | Trivial changes (creates tech debt) |

#### AI Behavior Requirements

1. **ASK** user for spec folder choice before proceeding with file modifications
2. **WAIT** for explicit user selection (A/B/C/D)
3. **NEVER** assume which approach the user wants
4. **RESPECT** the user's choice throughout the workflow
5. If user selects D (skip), warn about technical debt implications

#### Gate Alignment (AGENTS.md V13.0)

This skill enforces and is enforced by these gates:
- **Gate 1**: Understanding + Context Surfacing - memory_match_triggers() call
- **Gate 2**: Skill Routing - skill_advisor.py determines if this skill applies
- **Gate 3**: Spec folder question - HARD BLOCK before file modifications
- **Gate 4**: Memory loading - conditional on spec folder selection
- **Gate 5**: Memory save validation - MUST use `.opencode/skill/system-memory/scripts/generate-context.js`
- **Gate 6**: Completion verification - verify checklist.md items
- **Gate 7**: Context health monitor - suggest handover at session milestones

#### Trigger Keywords

The AI MUST detect these keywords and ask Q1:
- **Create/Add**: "create", "add", "implement", "build", "write", "generate"
- **Modify**: "update", "change", "modify", "edit", "fix", "refactor"
- **Remove**: "delete", "remove", "rename", "move"
- **Configure**: "configure", "analyze" (when file changes expected)

#### Example Prompt

```
🔴 MANDATORY_USER_QUESTION
"Before proceeding with file modifications, please choose:"
  A) Use existing spec folder (continue in 006-commands)
  B) Create new spec folder (specs/007-new-feature/)
  C) Update related spec folder (add to existing documentation)
  D) Skip documentation (creates technical debt - use sparingly)
```

### 3-Level Progressive Enhancement Framework

The conversation documentation system uses a **progressive enhancement** approach where each level BUILDS on the previous:

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md/research-spike.md

Utility (any level):    handover.md, debug-delegation.md
```

**Level 1: Baseline Documentation** (LOC guidance: <100)
- **Required Files**: `spec.md` + `plan.md` + `tasks.md`
- **Optional Files**: None (baseline is complete)
- **Use When**: All features - this is the minimum documentation for any work
- **Enforcement**: Hard block if any required file missing
- **Example**: Add email validation, fix bug, loading spinner, typo fix

**Level 2: Verification Added** (LOC guidance: 100-499)
- **Required Files**: Level 1 + `checklist.md`
- **Optional Files**: None
- **Use When**: Features needing systematic QA validation
- **Enforcement**: Hard block if `checklist.md` missing
- **Example**: Modal component, auth flow, library migration

> **CRITICAL: Checklist as Active Verification Tool**
>
> The `checklist.md` is NOT just documentation - it is an **ACTIVE VERIFICATION TOOL** that the AI MUST use to verify its own work before claiming completion. The checklist serves as:
> - A systematic verification protocol (not a passive record)
> - An evidence-based completion gate (must mark items with proof)
> - A priority-driven blocker (P0/P1 items MUST pass before done)
>
> See Section 4 (RULES) for mandatory checklist verification requirements.

**Level 3: Full Documentation** (LOC guidance: ≥500)
- **Required Files**: Level 2 + `decision-record.md`
- **Optional Files**: `research-spike.md`, `research.md`
- **Use When**: Complex features, architecture changes, major decisions
- **Enforcement**: Hard block if `decision-record.md` missing
- **Example**: Major feature, system redesign, multi-team projects


### Secondary Factors (Can Override LOC)

LOC thresholds are **SOFT GUIDANCE** - these factors can push to higher level:

- **Complexity**: Architectural changes vs simple refactors
- **Risk**: Config cascades, authentication, security implications
- **Dependencies**: Multiple systems affected (>5 files suggests higher level)
- **Testing needs**: Integration vs unit test requirements

**Decision rules**:
- **When in doubt → choose higher level** (better to over-document than under-document)
- **Risk/complexity can override LOC** (e.g., 50 LOC security change = Level 2+)
- **Multi-file changes often need higher level** than LOC alone suggests
- **Enforcement via AGENTS.md** - verification required before commits


### Template System (Progressive Enhancement)

**All 12 templates located in**: `.opencode/skill/system-spec-kit/templates/`

**Required templates by level (progressive):**
- Level 1: `spec.md` + `plan.md` + `tasks.md` (baseline)
- Level 2: Level 1 + `checklist.md` (adds verification)
- Level 3: Level 2 + `decision-record.md` (adds decision records)

**Optional templates (Level 3):**
- `research-spike.md` → `research-spike-[name].md` (time-boxed research/POC)
- `research.md` → `research.md` (comprehensive research)

**Utility templates (any level):**
- `handover.md` → Session continuity for multi-session work
- `debug-delegation.md` → Sub-agent debugging task delegation
- `quick-continue.md` → Minimal handoff for session branching (~10-15 lines, created by /handover or manually)

> **Note (V13.0)**: Project state is now embedded in memory files as "Project State Snapshot" section, automatically generated by `.opencode/skill/system-memory/scripts/generate-context.js`. Separate STATE.md is no longer used. Memory files MUST be created via `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]` - manual Write/Edit of memory files is prohibited (AGENTS.md Gate 5).


### Folder Naming Convention

**Format**: `specs/###-short-name/`

**Rules**:
- 2-3 words (shorter is better)
- Lowercase
- Hyphen-separated
- Action-noun structure
- 3-digit padding: `001`, `042`, `099` (no padding past 999)

**Good examples**: `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`

**Find next number**:
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

### Mandatory Documentation Workflow

**AI agent behavior (AGENTS.md Gate 3):**

**Start of conversation** (file modification detected):
- Detects modification keywords (add, implement, fix, etc.)
- Searches for related existing specs
- Presents options: A) Use existing, B) Create new, C) Update related, D) Skip (technical debt)
- AI agent asks user for choice (A/B/C/D)
- Waits for explicit user selection before proceeding

**Returning to existing spec folder:**
- **Stage 1**: "Continue in this spec folder?" (A/B/D)
- **Stage 2**: "Load memory files?" (A/B/C/D) - only if A chosen in Stage 1
- See "Two-Stage Question Flow" section for details

**Option D (Skip):**
- Proceeds without documentation
- **WARNING**: Creates technical debt - use sparingly


### Context Preservation

**Manual context save (V13.0 - MANDATORY WORKFLOW):**
- Trigger: `/memory:save` command, "save context", or "save memory"
- **MUST use**: `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]`
- **NEVER**: Create memory files manually via Write/Edit tools (AGENTS.md Gate 5)
- Save location: `specs/###-folder/memory/` or sub-folder memory/ if active
- Filename format: `DD-MM-YY_HH-MM__topic.md` (auto-generated by script)
- Content includes: PROJECT STATE SNAPSHOT with Phase, Last Action, Next Action, Blockers


### Sub-Folder Versioning Pattern

When reusing existing spec folders, the system creates numbered sub-folders to separate iterations while maintaining independent memory contexts.

**Quick Reference:**
- **Trigger:** Option A selected + root-level content exists
- **Pattern:** `001-original/`, `002-new-work/`, `003-another/`
- **Memory:** Each sub-folder has independent `memory/` directory
- **Tracking:** Spec folder path passed via CLI argument (stateless)

**Full documentation:** See [sub_folder_versioning.md](./references/sub_folder_versioning.md) for complete workflow, naming conventions, and examples.


### Returning to Active Spec Folder

When returning to an active spec folder, the AI asks two sequential questions:

**Combined Flow:**
```
🔴 STAGE 1: SPEC FOLDER
"You have an active spec folder. Continue in '006-commands' or start fresh?"
  A) Continue in 006-commands
  B) Create new spec folder
  D) Skip documentation

[If A chosen AND memory files exist]

🔴 STAGE 2: MEMORY LOADING
"Found 3 previous session files. Load context?"
  A) Load most recent
  B) Load all recent (1-3)
  C) List and select specific
  D) Skip (start fresh)
```

**Key Insight:** "D" means different things:
- Stage 1 "D" = Skip documentation entirely
- Stage 2 "D" = Skip memory loading (stay in spec folder)

> **Note:** The A/B/C/D options here correspond to AGENTS.md Gate 4's `[1] [2] [3] [all] [skip]` pattern. Both achieve the same goal of user-controlled memory loading.

**AI Actions by Stage 2 Choice:**
- **A:** Read most recent memory file
- **B:** Read 3 most recent files (parallel)
- **C:** List up to 10 files, wait for selection
- **D:** Proceed without loading context


### Parallel Dispatch Configuration

SpecKit supports smart parallel sub-agent dispatch based on 5-dimension complexity scoring.

**Quick Reference:**
- **<20% complexity:** Proceed directly
- **≥20% + 2 domains:** Ask user for dispatch preference
- **Step 6 Planning:** Auto-dispatches 4 parallel exploration agents

**Full configuration:** See [parallel_dispatch_config.md](./assets/parallel_dispatch_config.md) for scoring algorithm, thresholds, and override phrases.

### Command Pattern Reference Protocol

**Philosophy**: Commands (`.opencode/command/**/*.yaml`) are high-value "Reference Patterns" containing optimized logic, not rigid laws for manual execution.

> **IMPORTANT**: If a command is *explicitly invoked* (e.g., `/spec_kit:complete`), its logic is **ENFORCED LAW**, not just a reference.

**Execution Protocol**:

1.  **🔍 Scan**: Before diving in, use a parallel sub-agent to scan available commands and identify which ones are relevant to the task.
    *   *Prompt*: "Scan .opencode/command/ for workflows relevant to [task]."

2.  **🧩 Extract**: Treat these commands as reference patterns. Extract their:
    *   **Logic**: Decision trees and confidence checkpoints.
    *   **Sequencing**: Order of operations (e.g., Plan → Verify → Implement).
    *   **Structure**: Required outputs and validation steps.

3.  **🛠️ Adapt**: Build an approach tailored to the specific task by adapting the extracted patterns.
    *   *Rule*: Only apply a command directly as-is when it is **>80% relevant**. Otherwise, modify it to fit.

4.  **📝 Report**: After completing the task, report in `implementation-summary.md`:
    *   Which commands were referenced.
    *   How they contributed to the outcome.

### Debug Delegation Workflow

#### When to Trigger Debug Delegation

Debug delegation should be triggered in two ways:

**1. Manual Trigger:**
- User runs `/spec_kit:debug` command
- Explicit request: "delegate this to a debug agent"

**2. Auto-Suggestion (Proactive):**
The AI should SUGGEST debug delegation when detecting:

```python
# Trigger conditions (ANY of these)
debug_triggers = {
    "repeated_errors": error_count >= 3,  # Same error 3+ times
    "frustration_keywords": any([
        "stuck", "can't fix", "tried everything", "not working still",
        "same error", "still failing", "keeps happening", "hours on this",
        "multiple attempts", "tried that already", "doesn't work",
        "need help debugging", "fresh eyes", "second opinion"
    ]),
    "extended_session": debugging_time > 15_minutes and fix_attempts >= 2
}
```

**Auto-Suggestion Display:**
```
💡 **Debug Delegation Suggested**

You've been working on this issue for a while. Would you like to delegate 
to a debugging sub-agent for a fresh perspective?

Run: `/spec_kit:debug`

This will:
1. Ask which AI model to use (Claude/Gemini/Codex)
2. Generate a debug report with full context
3. Dispatch a parallel sub-agent to investigate
4. Return findings for your review
```

#### Model Selection (MANDATORY)

The `/spec_kit:debug` command ALWAYS asks the user which model to use:

| Model | Best For | Characteristics |
|-------|----------|-----------------|
| **Claude** | General debugging, code analysis | Anthropic models (Sonnet/Opus) |
| **Gemini** | Multi-modal, large context | Google models (Pro/Ultra) |
| **Codex** | Code generation, reasoning | OpenAI models (GPT-4/o1) |
| **Other** | User-specified model | Custom selection |

**Rule:** Never skip model selection. Always ask, even if you have a recommendation.

#### Debug Report Generation

The command generates `debug-delegation.md` in the spec folder root containing:
- Error category and full message
- Affected files list
- Previous fix attempts documented
- Relevant code snippets
- Hypothesis about root cause
- Recommended next steps

#### Sub-Agent Dispatch

Uses the Task tool to dispatch a parallel debugging agent:
- Passes full debug report as context
- Instructs agent to: analyze → propose fix → verify steps → prevention
- Receives structured response with root cause, fix, and verification

#### Integration of Results

After sub-agent returns:
1. Present findings to user
2. Offer options: Apply fix / Iterate / Manual review
3. Update debug-delegation.md with resolution

---

## 4. 📋 RULES

### ✅ ALWAYS 

1. **ALWAYS determine documentation level (1/2/3) before ANY file changes**
   - Count LOC estimate
   - Assess complexity and risk
   - Choose higher level when uncertain

2. **ALWAYS copy templates from `.opencode/skill/system-spec-kit/templates/` - NEVER create from scratch**
   - Use exact template files for level
   - Rename correctly after copying
   - Preserve template structure

3. **ALWAYS fill ALL placeholders in templates**
   - Replace `[PLACEHOLDER]` with actual content
   - Remove `<!-- SAMPLE CONTENT -->` blocks
   - Remove instructional comments

4. **ALWAYS ask user for spec folder choice (A/B/C/D) when file modification detected**
   - Present all 4 options clearly
   - Explain implications of each choice
   - Wait for explicit user selection

5. **ALWAYS check for related specs before creating new folders**
   - Search by keywords in folder names and titles
   - Review status field (draft/active/paused/complete/archived)
   - Recommend updates to existing specs when appropriate

6. **ALWAYS get explicit user approval before file changes**
   - Present documentation level chosen
   - Show spec folder path
   - List templates used
   - Explain implementation approach
   - Wait for "yes/go ahead/proceed"

7. **ALWAYS use consistent folder naming**
   - Format: `specs/###-short-name/`
   - 2-3 words, lowercase, hyphen-separated
   - Find next number with command

8. **ALWAYS use checklist.md to verify work before completion (Level 2+)**
   - Load checklist.md at completion phase
   - Verify each item systematically (P0 first, then P1, then P2)
   - Cannot claim "done" until checklist verification complete

9. **ALWAYS mark checklist items [x] with evidence when verified**
   - Include links to files, test outputs, or screenshots
   - Document how each item was verified
   - Update checklist.md with verification timestamps

10. **ALWAYS complete all P0 and P1 items before claiming done**
    - P0 = Blocker: MUST pass or work is incomplete
    - P1 = Required: MUST pass for production readiness
    - P2 = Optional: Can defer with documented reason

11. **ALWAYS suggest handover.md when session-ending keywords detected**
    - Detect: "handover", "for next AI", "continue later", "next session", "pass context"
    - Action: Suggest creating handover.md in active spec folder
    - Copy from `.opencode/skill/system-spec-kit/templates/handover.md`
    - Fill all 5 sections: Summary, Context Transfer, Next Steps, Validation, Notes

### ❌ NEVER 

1. **NEVER create documentation files from scratch** - Always copy from `.opencode/skill/system-spec-kit/templates/`

2. **NEVER skip spec folder creation** (unless user explicitly selects Option D)
   - All file modifications require spec folders
   - Applies to code, docs, config, templates, knowledge base files

3. **NEVER make file changes before spec folder creation and user approval**
   - Spec folder is prerequisite for ALL modifications
   - No exceptions without explicit user choice (Option D)

4. **NEVER leave placeholder text in final documentation**
   - All `[PLACEHOLDER]` must be replaced
   - All sample content must be removed
   - Templates must be fully adapted

5. **NEVER decide autonomously between update vs create**
   - Always ask user when related specs exist
   - Present status and let user choose
   - Respect user's explicit choice

6. **NEVER claim completion without verifying checklist.md items (Level 2+)**
   - Must load and review checklist.md before stating work is done
   - Must mark all P0/P1 items as verified with evidence
   - Incomplete checklist = incomplete work

7. **NEVER proceed without spec folder confirmation**
   - Always ask user to choose (A/B/C/D) for file modifications
   - Wait for explicit selection
   - Document choice in spec folder

### ⚠️ ESCALATE IF

1. **Scope grows during implementation**
   - LOC estimate increases significantly
   - Complexity increases substantially
   - Add higher-level templates to same folder
   - Document level change in changelog

2. **Uncertainty about level selection (confidence <80%)**
   - Present level options to user
   - Explain trade-offs
   - Default to higher level if user unsure

3. **Template doesn't fit feature requirements**
   - Use closest template as starting point
   - Adapt structure to fit
   - Document modifications
   - Consider creating custom template for future use

4. **User requests to skip documentation (Option D)**
   - Warn about technical debt implications
   - Explain future debugging challenges
   - Confirm explicit consent
   - Log skip event for audit trail

---

## 5. ✅ SUCCESS CRITERIA

### Documentation Created

- [ ] Spec folder exists at `specs/###-short-name/`
- [ ] Folder name follows convention (2-3 words, lowercase, hyphen-separated)
- [ ] Number is sequential (no gaps or duplicates)
- [ ] Correct level templates copied and renamed
- [ ] All placeholders replaced with actual content
- [ ] Sample content removed
- [ ] Supporting templates added if needed

### Template Quality

- [ ] Templates copied from `.opencode/skill/system-spec-kit/templates/` (not created from scratch)
- [ ] Template structure preserved (numbered H2 sections with emojis)
- [ ] Metadata block filled correctly
- [ ] All sections relevant (N/A stated if not applicable)
- [ ] Cross-references to sibling documents (spec.md ↔ plan.md ↔ tasks.md)

### User Approval

- [ ] Documentation level presented to user
- [ ] Spec folder path shown
- [ ] Templates used listed
- [ ] Implementation approach explained
- [ ] Explicit "yes/go ahead/proceed" received before file changes

### Spec Folder Compliance

- [ ] Asked user for A/B/C/D choice when file modification detected
- [ ] Documented user's choice
- [ ] Created spec folder based on user selection

### Context Preservation

- [ ] Context saved via `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]` (NEVER manual Write/Edit)
- [ ] Manual saves triggered via `/memory:save` or "save context" keywords
- [ ] Memory files contain PROJECT STATE SNAPSHOT section
- [ ] Conversation history preserved for debugging
- [ ] Implementation decisions documented

### Checklist Verification (Level 2+)

- [ ] Loaded `checklist.md` before claiming completion
- [ ] Verified items in priority order (P0 → P1 → P2)
- [ ] All P0 items marked [x] with evidence
- [ ] All P1 items marked [x] with evidence
- [ ] P2 items either verified or deferred with documented reason
- [ ] Updated `checklist.md` with verification timestamps
- [ ] No unchecked P0/P1 items remain

---

## 6. 🔗 INTEGRATION POINTS

### Enforcement Priority System

SpecKit uses a priority system for validation and enforcement through AGENTS.md discipline.

**Enforcement Levels (Priority System):**
- **P0 (Blocker)**: Cannot proceed without resolution
  - Missing required templates for level (e.g., no `checklist.md` for Level 2)
  - Unresolved placeholders in templates (`[PLACEHOLDER]`)
- **P1 (Warning)**: Must address or explicitly defer with user approval
  - Incomplete checklist items before completion claims
  - Missing optional templates for level
- **P2 (Optional)**: Can defer without approval
  - Documentation enhancements
  - Additional context preservation

**Validation Triggers:**
- AGENTS.md Gate 3 → Validates spec folder existence and template completeness
- Manual `/save_context` → Context preservation on demand
- Template validation → Checks placeholder removal and required field completion

### Related Skills

**Upstream (feeds into this skill):**
- None - This is the foundational workflow for all implementation conversations

**Downstream (uses this skill's outputs):**
- **workflows-code** → Uses spec folders for implementation tracking
- **workflows-git** → References spec folders in commit messages and PRs
- **workflows-documentation** → Validates spec folder documentation quality
- **system-memory** → Saves conversation context to spec folder memory/

### Cross-Skill Workflows

**Spec Folder → Implementation Workflow:**
1. `system-spec-kit` creates spec folder
2. `workflows-code` implements from spec + plan
3. `workflows-git` commits with spec reference
4. `system-memory` preserves conversation to spec/memory/

**Documentation Quality Workflow:**
1. `system-spec-kit` creates spec documentation
2. `workflows-documentation` validates structure and quality scores
3. Feedback loop: Iterate on documentation if scores <90

### External Dependencies

- `.opencode/skill/system-spec-kit/templates/` - All template files
- `AGENTS.md` - Section 2 defines mandatory documentation requirements
- `/spec_kit:complete` - Level 3 auto-generation command

---

**Remember**: This skill operates as the foundational documentation orchestrator. It enforces structure, template usage, and context preservation for all file modifications.