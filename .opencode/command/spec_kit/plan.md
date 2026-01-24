---
description: Planning workflow (7 steps) - spec through plan only, no implementation. Supports :auto and :confirm modes
argument-hint: "<feature-description> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together).

---

## 🔒 UNIFIED SETUP PHASE

**⚠️ FIRST MESSAGE PROTOCOL**: This consolidated prompt MUST be your FIRST response if the command is invoked. No analysis, no tool calls - ask ALL questions immediately in ONE prompt, then wait.

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains a feature description:
   ├─ IF $ARGUMENTS has content (ignoring :auto/:confirm) → feature_description = $ARGUMENTS, omit Q0
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

4. Determine if memory loading question is needed:
   - Will be asked ONLY if user selects A or C for spec folder AND memory/ has files
   - Include Q4 placeholder with note "(if using existing spec with memory files)"

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Feature Description** (if not provided in command):      │
   │    What feature would you like to plan?                        │
   │                                                                │
   │ **Q1. Spec Folder** (required):                                │
   │    A) Use existing: [suggest if related found]                 │
   │    B) Create new spec folder: specs/[###]-[feature-slug]/      │
   │    C) Update related spec: [if partial match found]            │
   │    D) Skip documentation                                       │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous - Execute all 7 steps without approval        │
   │    B) Interactive - Pause at each step for approval            │
   │                                                                │
   │ **Q3. Dispatch Mode** (required):                              │
   │    A) Single Agent - Execute with one agent (Recommended)      │
   │    B) Multi-Agent (1+2) - 1 orchestrator (opus) + 2 workers (opus) │
   │    C) Multi-Agent (1+3) - 1 orchestrator (opus) + 3 workers (opus) │
   │                                                                │
   │ **Q4. Worker Model** (if B or C selected above):               │
   │    Default: opus                                               │
   │    To use different model, type: opus, gemini, gpt             │
   │    for default                                                 │
   │                                                                │
   │ **Q5. Memory Context** (if using existing spec with memory/):  │
   │    A) Load most recent memory file                              │
   │    B) Load all recent files, up to 3                            │
   │    C) Skip (start fresh)                                       │
   │                                                                │
   │ Reply with answers, e.g.: "B, A, A, , C" or "Add auth, B, A, gemini, C" │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - feature_description = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - dispatch_mode = [single/multi_small/multi_large from Q3]
   - worker_model = [from Q4: opus/gemini/gpt, default opus if blank]
   - memory_choice = [A/B/C from Q5, or N/A if not applicable]

8. Execute background operations based on choices:
   - IF memory_choice == A: Load most recent memory file
   - IF memory_choice == B: Load up to 3 recent memory files
   - IF dispatch_mode is multi_*: Note parallel dispatch will be used

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `feature_description = ________________`
- `spec_choice = ___` | `spec_path = ________________`
- `execution_mode = ________________`
- `dispatch_mode = ________________`
- `worker_model = ________________` (default: opus)
- `memory_loaded = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD               | REQUIRED      | YOUR VALUE | SOURCE                |
| ------------------- | ------------- | ---------- | --------------------- |
| feature_description | ✅ Yes         | ______     | Q0 or $ARGUMENTS      |
| spec_choice         | ✅ Yes         | ______     | Q1                    |
| spec_path           | ○ Conditional | ______     | Derived from Q1       |
| execution_mode      | ✅ Yes         | ______     | Suffix or Q2          |
| dispatch_mode       | ✅ Yes         | ______     | Q3                    |
| worker_model        | ○ Conditional | ______     | Q4 (default: opus)    |
| memory_loaded       | ○ Conditional | ______     | Q5 (if existing spec) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "# SpecKit Plan" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without asking user for feature description when not in $ARGUMENTS
- Auto-created or assumed a spec folder without user confirmation
- Auto-selected dispatch mode without explicit user choice
- Inferred feature from context instead of explicit user input
- Auto-selected execution mode without suffix or explicit user choice

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
```

> **Cross-reference**: These mandatory phases implement AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol". The canonical gate definitions are in AGENTS.md.

---

# SpecKit Plan

Execute the SpecKit planning lifecycle from specification through planning. Terminates after creating plan.md - use `/spec_kit:implement` for implementation phase.

---

```yaml
role: Expert Developer using Smart SpecKit for Planning Phase
purpose: Spec-driven planning with mandatory compliance and stakeholder review support
action: Run planning workflow from specification through technical plan creation

operating_mode:
  workflow: sequential
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_artifact_creation
  validation: consistency_check_before_handoff
```

---

## 1. 🎯 PURPOSE

Run the planning workflow: specification, clarification, and technical planning. Creates spec.md, plan.md, and checklists without proceeding to implementation. Use when planning needs review before coding.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Feature description with optional parameters (branch, scope, context)
**Outputs:** Spec folder with planning artifacts:
- spec.md ✓
- plan.md ✓
- checklist.md (Level 2+ only) ✓
- memory/*.md ✓

> **⚠️ Level 1 Note:** The /spec_kit:plan command creates spec.md and plan.md but NOT tasks.md. For complete Level 1 baseline documentation, either:
> - A) Run /spec_kit:implement after planning to create tasks.md
> - B) Run /spec_kit:complete instead for full workflow
> 
> Level 1 baseline (spec.md + plan.md + tasks.md) is only complete after implementation planning.

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name             | Purpose                      | Outputs                  |
| ---- | ---------------- | ---------------------------- | ------------------------ |
| 1    | Request Analysis | Analyze inputs, define scope | requirement_summary      |
| 2    | Pre-Work Review  | Review AGENTS.md, standards  | coding_standards_summary |
| 3    | Specification    | Create spec.md               | spec.md                  |
| 4    | Clarification    | Resolve ambiguities          | updated spec.md          |
| 5    | Planning         | Create technical plan        | plan.md, checklist.md    |
| 6    | Save Context     | Save conversation context    | memory/*.md              |
| 7    | Handover Check   | Prompt for session handover  | handover.md (optional)   |

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. 📊 OUTPUT FORMATS

### Success Output
```
✅ SpecKit Planning Complete

All 7 planning steps executed successfully.

Artifacts Created:
- spec.md (feature specification)
- plan.md (technical plan)
- checklist.md (validation checklist, Level 2+)
- memory/*.md (session context)

Ready for: /spec_kit:implement [spec-folder-path]

STATUS=OK PATH=[spec-folder-path]
```

### Failure Output
```
❌ SpecKit Planning Failed

Error: [error description]
Step: [step number where failure occurred]

STATUS=FAIL ERROR="[message]"
```

---

## 6. 📌 REFERENCE

**Full details in YAML prompts:**
- Workflow steps and activities
- Field extraction rules
- Documentation levels (1/2/3)
- Templates used
- Completion report format
- Mode behaviors (auto/confirm)
- Parallel dispatch configuration
- Checklist creation guidelines
- Failure recovery procedures

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 7. 🔀 PARALLEL DISPATCH

This workflow supports smart parallel sub-agent dispatch for eligible phases using a 5-dimension complexity scoring algorithm.

### Complexity Scoring Algorithm (5 Dimensions)

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                   |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0               |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0          |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0     |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0 |

### Decision Thresholds

- **<20%**: Proceed directly (no parallel agents)
- **≥20% + 2 domains**: ALWAYS ask user before parallel dispatch

### Planning Step: 4-Agent Parallel Exploration (Automatic)

The Planning step automatically dispatches 4 agents in parallel via the Task tool:

1. **Architecture Explorer** - Project structure, entry points, component connections
2. **Feature Explorer** - Similar features, related patterns
3. **Dependency Explorer** - Imports, modules, affected areas
4. **Test Explorer** - Test patterns, testing infrastructure

After agents return, hypotheses are verified by reading identified files and building a complete mental model.

### Eligible Phases (Plan Workflow)

- Step 3: Specification
- Step 5: Planning (includes automatic 4-agent exploration)

### Override Phrases

- **Direct**: "proceed directly", "handle directly", "skip parallel"
- **Parallel**: "use parallel", "dispatch agents", "parallelize"
- **Auto-decide**: "auto-decide", "auto mode", "decide for me" (1 hour session preference)

---

## 8. 🤖 AGENT ROUTING

This command routes Step 3 (Specification) to the specialized `@speckit` agent when available.

| Step                   | Agent      | Fallback  | Purpose                                             |
| ---------------------- | ---------- | --------- | --------------------------------------------------- |
| Step 3 (Specification) | `@speckit` | `general` | Template-first spec folder creation with validation |

### Model Preference

Model selection is handled automatically by the system based on task complexity.

### How Agent Routing Works

1. **Detection**: When Step 3 is reached, the system checks if `@speckit` agent is available
2. **Dispatch**: If available, dispatches to `@speckit` agent with feature description
3. **Fallback**: If agent unavailable, falls back to `subagent_type: "general-purpose"` (Claude Code) or `"general"` (OpenCode) with warning
4. **Output**: Agent returns confirmation of created files with validation status

### Agent Dispatch Template

```
Task tool with prompt:
---
You are the @speckit agent. Create spec folder documentation.

Feature: {feature_description}
Level: {documentation_level}
Folder: {spec_path}

Create spec.md using template-first approach.
Validate structure against templates.

Return confirmation of created files.
---
```

### Fallback Behavior

When `@speckit` agent is unavailable:
- Warning message: "Speckit agent unavailable, using general dispatch"
- Workflow continues with `subagent_type: "general-purpose"` (Claude Code) or `"general"` (OpenCode)
- Same step executed, may have less template validation

---

## 9. ✅ QUALITY GATES

Quality gates enforce minimum standards at workflow checkpoints.

### Gate Configuration

| Gate Type      | Trigger Point                 | Threshold | Behavior                           |
| -------------- | ----------------------------- | --------- | ---------------------------------- |
| Pre-execution  | Before Step 1 starts          | 70        | Validates inputs and prerequisites |
| Mid-execution  | After Step 3 (Specification)  | 70        | Validates spec.md quality          |
| Post-execution | After Step 7 (Handover Check) | 70        | Validates all artifacts complete   |

### Gate Behavior

- **Score >= Threshold**: Gate passes, workflow continues
- **Score < Threshold**: Gate fails, workflow pauses for remediation

### Gate Checks

**Pre-execution Gate:**
- [ ] Feature description provided and clear
- [ ] Spec folder path valid or auto-creation possible
- [ ] No blocking prerequisites missing

**Mid-execution Gate:**
- [ ] spec.md created with all required sections
- [ ] Acceptance criteria defined and measurable
- [ ] No unresolved [NEEDS CLARIFICATION] markers

**Post-execution Gate:**
- [ ] All planning artifacts exist (spec.md, plan.md)
- [ ] Memory context saved successfully
- [ ] Handover check completed

---

## 10. 🔌 CIRCUIT BREAKER

Circuit breaker pattern prevents cascading failures during workflow execution.

### States

| State     | Description                | Behavior                                       |
| --------- | -------------------------- | ---------------------------------------------- |
| CLOSED    | Normal operation           | Errors tracked, workflow continues             |
| OPEN      | Failure threshold exceeded | Workflow halted, recovery required             |
| HALF-OPEN | Recovery attempted         | Single retry allowed, success resets to CLOSED |

### Configuration

| Parameter         | Value | Description                            |
| ----------------- | ----- | -------------------------------------- |
| failure_threshold | 3     | Consecutive failures before OPEN state |
| recovery_timeout  | 60    | Seconds before attempting HALF-OPEN    |

### Tracked Errors

- Task tool dispatch failures
- File creation/write failures
- Agent routing failures
- Memory save failures

### Recovery Protocol

1. **OPEN state triggered**: Workflow halts with error summary
2. **Wait recovery_timeout**: System waits 60 seconds
3. **HALF-OPEN attempt**: Single retry of failed operation
4. **Success**: Reset to CLOSED, continue workflow
5. **Failure**: Return to OPEN, escalate to user

---

## 11. 🔀 KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- **Terminates after planning** - Does not include task breakdown, analysis, or implementation
- **Next step guidance** - Recommends `/spec_kit:implement` when ready to build
- **Use case** - Planning phase separation, stakeholder review, feasibility analysis

---

## 12. 🔍 EXAMPLES

**Example 1: Simple Planning (autonomous)**
```
/spec_kit:plan:auto Add dark mode toggle to the settings page
```

**Example 2: Complex Planning (interactive)**
```
/spec_kit:plan:confirm Redesign the checkout flow with multi-step form and payment integration
```

**Example 3: With Context**
```
/spec_kit:plan "Build analytics dashboard" tech stack: React, Chart.js, existing API
```

---

## 13. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[/spec_kit:research] → /spec_kit:plan → [/spec_kit:implement]
```

**Explicit next step:**
→ `/spec_kit:implement [spec-folder-path]`

---

## 14. 📌 NEXT STEPS

After planning completes, suggest relevant next steps:

| Condition                             | Suggested Command                        | Reason                           |
| ------------------------------------- | ---------------------------------------- | -------------------------------- |
| Planning complete, ready to implement | `/spec_kit:implement [spec-folder-path]` | Continue to implementation phase |
| Need stakeholder review first         | Share `plan.md` for review               | Get approval before coding       |
| Technical uncertainty exists          | `/spec_kit:research [topic]`             | Investigate before committing    |
| Need to pause work                    | `/spec_kit:handover [spec-folder-path]`  | Save context for later           |
| Want to save context                  | `/memory:save [spec-folder-path]`        | Preserve decisions and findings  |

**ALWAYS** end with: "What would you like to do next?"
